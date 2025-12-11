import { ApiClient, AuthResponse, SignInRequest, TokenValidationResponse } from "@/api"
import { createContext, PropsWithChildren, useContext, useEffect, useReducer } from "react"
// NOTE: needs a * import as this is broken otherwise for some reason
import * as SecureStore from "expo-secure-store"
import { DefaultError, useMutation } from "@tanstack/react-query"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import z from "zod"
import _ from "lodash"

export type AuthState = {
  isSignedIn: boolean,
  /** Accounts for both loading async state and actually performing network calls */
  isLoading: boolean,
  /** User authentication token, always set when `isSignedIn` is true */
  authToken: string | null,
  /** Associated user settings, these contain defaults when the user is not signed in */
  userSettings: UserSettings,
  /** Error which is set when both `isSignedIn` and `isLoading` are false */
  error: any | null,
  signIn: (email: string, password: string) => Promise<void>,
  signOut: () => Promise<void>,
}

export type UserSettings = {
  preferredCurrency: CurrencyPreference,
  /** Null indicates to rely on the device default */
  darkMode: boolean | null,
  defaultTripType: TripTypePreference,
  /** A function to update a setting, is a no-op when the user is not signed in */
  updateState: SettingsUpdateFunc,
}

export type SettingsUpdateFunc = <K extends keyof Omit<UserSettings, "updateState">>(
  key: K,
  value: UserSettings[K],
) => Promise<void>

const CURRENCIES = ["dollar", "euro"] as const
export type CurrencyPreference = (typeof CURRENCIES)[number]
const TRIP_TYPES = ["oneWay", "roundTrip"] as const
export type TripTypePreference = (typeof TRIP_TYPES)[number]

type InternalAuthState = {
  token: string | null,
  // we could make this nullable but it actually doesn't matter, as these
  // will be default initialized either way
  userSettings: UserSettings,
  isLoading: boolean,
  error: any | null,
}

const AuthContext = createContext<AuthState | null>(null)

type AuthAction =
  | { type: "RESTORE_SAVED_STATE", restoredState: SavedState | null, updateFunc: SettingsUpdateFunc }
  | { type: "REFRESH_USER_SETTINGS", settings: UserSettings }
  | { type: "RESTORE_TOKEN", token: string }
  | { type: "SIGN_OUT" }
  | { type: "SET_LOADING", isLoading: boolean }
  | { type: "ABORT_WITH_ERROR", error: any }

const authStateReducer = (state: InternalAuthState, action: AuthAction): InternalAuthState => {
  switch (action.type) {
    case "RESTORE_SAVED_STATE":
      const { restoredState } = action
      // use default user settings when not logged in
      const userSettings: UserSettings = {
        darkMode: restoredState?.darkMode ?? defaultUserSettings.darkMode,
        defaultTripType: restoredState?.defaultTripType ?? defaultUserSettings.defaultTripType,
        preferredCurrency: restoredState?.preferredCurrency ?? defaultUserSettings.preferredCurrency,
        updateState: action.updateFunc,
      }
      const token = restoredState !== null ? restoredState.token : null

      return { ...state, isLoading: false, token, userSettings }
    case "REFRESH_USER_SETTINGS":
      const settings: UserSettings = { ...action.settings, updateState: state.userSettings.updateState }
      return { ...state, isLoading: false, userSettings: settings }
    case "RESTORE_TOKEN":
      return { ...state, isLoading: false, token: action.token }
    case "SIGN_OUT":
      return { ...state, isLoading: false, token: null }
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading }
    case "ABORT_WITH_ERROR":
      return { ...state, isLoading: false, token: null, error: action.error }
  }
}

const defaultUserSettings: UserSettings = {
  darkMode: null,
  defaultTripType: "roundTrip",
  preferredCurrency: "euro",
  updateState: async (_key, _value) => {}, // no-op as not signed in
}

/**
 * An auth context provider, the auth check is immediately started upon mounting.
 */
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(authStateReducer, {
    token: null,
    userSettings: { ...defaultUserSettings },
    isLoading: true,
    error: null,
  })

  const loginMutation = useMutation<AuthResponse, DefaultError, SignInRequest>({
    mutationFn: (req) => ApiClient.signIn(req),
    onError: (error) => console.error("sign in failed: " + error),
  })

  const validateTokenMutation = useMutation<TokenValidationResponse, DefaultError, { authToken: string }>({
    mutationFn: ({ authToken }) => ApiClient.validateUserToken({ authToken }),
    onError: (error) => console.error("validating token failed: " + error),
  })

  const updateUserSetting: SettingsUpdateFunc = async (key, value) => {
    const newSettings = { ...state.userSettings, [key]: value }
    await persistUserSettings(newSettings)
    dispatch({ type: "REFRESH_USER_SETTINGS", settings: newSettings })
  }

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const restoredState = await restoreSavedState()
        if (restoredState === null) {
          // user might not be signed in, or an error occured while restoring state,
          // either way, they will have to sign in again
          dispatch({ type: "RESTORE_SAVED_STATE", restoredState: null, updateFunc: async () => {} })
          return
        }

        const { isValid } = await validateTokenMutation.mutateAsync({ authToken: restoredState.token })
        if (!isValid) {
          // only delete token, keep user settings
          await deleteSavedToken()
        }

        dispatch({
          type: "RESTORE_SAVED_STATE",
          restoredState: isValid ? restoredState : null,
          updateFunc: isValid ? updateUserSetting : async () => {},
        })
      } catch (e) {
        dispatch({ type: "ABORT_WITH_ERROR", error: e })
      }
    }

    bootstrap()
  }, [])

  const signIn = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", isLoading: true })
    try {
      const { authToken } = await loginMutation.mutateAsync({ email, password })
      await persistLoginState(authToken)
        .catch(err => console.error("failed to persist auth state after sign in: " + err))

      dispatch({ type: "RESTORE_TOKEN", token: authToken })
    } catch (e) {
      dispatch({ type: "ABORT_WITH_ERROR", error: e })
    }
  }

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY)
      dispatch({ type: "SIGN_OUT" })
    } catch (e) {
      console.error("failed to remove user token after signing out " + e)
      dispatch({ type: "ABORT_WITH_ERROR", error: e })
    }
  }

  const value: AuthState = {
    isSignedIn: state.token !== null,
    isLoading: state.isLoading,
    authToken: state.token,
    userSettings: state.userSettings,
    error: state.error,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthState  => {
  const ctx = useContext(AuthContext)
  if (ctx == null) {
    throw new Error("AuthContext Provider not found in the component tree")
  }
  return ctx
}

const savedStateSchema = z.object({
  preferredCurrency: z.enum(CURRENCIES),
  defaultTripType: z.enum(TRIP_TYPES),
  darkMode: z.boolean().nullable(),
})
type SavedState = z.infer<typeof savedStateSchema> & {
  token: string,
}

const TOKEN_KEY = "__TOKEN"
const SETTINGS_KEY = "__SETTINGS"

const restoreSavedState = async (): Promise<SavedState | null> => {
  const token = await PlatformStorage.getItemAsync(TOKEN_KEY)
  if (token === null) return null
  const settings = await PlatformStorage.getItemAsync(SETTINGS_KEY)
  if (settings === null) return null

  const decodedSettings = JSON.parse(settings)
  return {
    ...savedStateSchema.parse(decodedSettings),
    token,
  }
}

const persistLoginState = async (token: string) => {
  const [_, encodedSettings] = await Promise.all([
    PlatformStorage.persistAsync(TOKEN_KEY, token),
    PlatformStorage.getItemAsync(SETTINGS_KEY),
  ])

  if (encodedSettings === null) {
    // first time a user signed in, save default settings
    await PlatformStorage.persistAsync(SETTINGS_KEY, JSON.stringify(defaultUserSettings))
  }
}

const deleteSavedToken = async (): Promise<void> =>
  PlatformStorage.deleteValueAsync(TOKEN_KEY)

const persistUserSettings = async (settings: UserSettings): Promise<void> => {
  await PlatformStorage.persistAsync(SETTINGS_KEY, JSON.stringify(settings))
}

// NOTE: web does not support secure store, use localStorage instead
const PlatformStorage = {
  async getItemAsync(key: string): Promise<string | null> {
    return Platform.OS === "web"
      ? AsyncStorage.getItem(key)
      : SecureStore.getItemAsync(key)
  },

  async persistAsync(key: string, value: string): Promise<void> {
    return Platform.OS === "web"
      ? AsyncStorage.setItem(key, value)
      : SecureStore.setItemAsync(key, value)
  },

  async deleteValueAsync(key: string): Promise<void> {
    return Platform.OS === "web"
      ? AsyncStorage.removeItem(key)
      : SecureStore.deleteItemAsync(key)
  }
}
