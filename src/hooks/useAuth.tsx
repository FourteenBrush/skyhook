import { ApiClient, AuthResponse, SignInRequest, TokenValidationResponse } from "@/api"
import { createContext, PropsWithChildren, useContext, useEffect, useReducer } from "react"
import { DefaultError, useMutation } from "@tanstack/react-query"
import z from "zod"
import { persistedPreferenceSchema, PreferenceUpdateFunc, UserPreferences } from "@/lib/preferences"
import { defaultUserPreferences } from "@/lib/preferences"
import { JsonStorage, StorageOutput } from "@/lib/auth"

export type AuthState = {
  isSignedIn: boolean,
  /** Accounts for both loading async state and actually performing network calls */
  isLoading: boolean,
  /** User details, always set when `isSignedIn` is true */
  userDetails: UserDetails | null,
  /** Associated user preferences, these contain defaults when the user is not signed in */
  userPreferences: UserPreferences,
  /** Error which is set when both `isSignedIn` and `isLoading` are false */
  error: any | null,
  /** Clears the set `error`, useful for resetting the login attempt after unmounting */
  clearError: () => void,
  signIn: (email: string, password: string) => Promise<void>,
  signOut: () => Promise<void>,

  /** A function to update a preference, is a no-op when `isSignedIn` is false */
  updateUserPreference: PreferenceUpdateFunc,
}

export type UserDetails = {
  username: string,
  email: string,
  authToken: string,
}

type InternalAuthState = {
  userDetails: UserDetails | null,
  // we could make this nullable but it actually doesn't matter, as these
  // will be default initialized either way
  userPreferences: UserPreferences,
  isLoading: boolean,
  error: any | null,
}

// Restored persistent state
type SavedBundle = {
  userPreferences: StorageOutput<typeof userPreferencesStorage>,
  userDetails: StorageOutput<typeof userDetailsStorage>,
}

const AuthContext = createContext<AuthState | null>(null)

type AuthAction =
  | { type: "RESTORE_SAVED_STATE", restoredState: SavedBundle | null }
  | { type: "REFRESH_USER_PREFERENCES", preferences: UserPreferences }
  | { type: "RESTORE_TOKEN", authResponse: AuthResponse, preferences: UserPreferences }
  | { type: "SIGN_OUT" }
  | { type: "SET_LOADING", isLoading: boolean }
  | { type: "SET_ERROR", error: any }

const authStateReducer = (state: InternalAuthState, action: AuthAction): InternalAuthState => {
  switch (action.type) {
    case "RESTORE_SAVED_STATE":
      if (action.restoredState === null) {
        // use default user preferences when not logged in
        return { ...state, isLoading: false, userDetails: null, userPreferences: { ...defaultUserPreferences } }
      }

      const { userDetails, userPreferences } = action.restoredState
      return { ...state, isLoading: false, userDetails, userPreferences }
    case "REFRESH_USER_PREFERENCES":
      const preferences: UserPreferences = { ...action.preferences }
      return { ...state, isLoading: false, userPreferences: preferences }
    case "RESTORE_TOKEN":
      const { authResponse, preferences: prefs } = action
      const details: UserDetails = {
        username: authResponse.fullName,
        email: authResponse.email,
        authToken: authResponse.token,
      }
      return { ...state, isLoading: false, userDetails: details, userPreferences: prefs }
    case "SIGN_OUT":
      return { ...state, isLoading: false, userDetails: null, userPreferences: { ...defaultUserPreferences } }
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading }
    case "SET_ERROR":
      return { ...state, isLoading: false, userDetails: null, error: action.error }
  }
}

// storage accessors

const userDetailsStorage = new JsonStorage(
  "__USER_DETAILS",
  z.object({
    email: z.string().nonempty(),
    username: z.string().nonempty(),
    authToken: z.string().nonempty(),
  }),
)
const userPreferencesStorage = new JsonStorage(
  "__USER_PREFERENCES",
  persistedPreferenceSchema,
)

/**
 * An auth context provider, the auth check is immediately started upon mounting.
 */
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(authStateReducer, {
    userPreferences: { ...defaultUserPreferences },
    userDetails: null,
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

  const updateUserPreference: PreferenceUpdateFunc = async (key, value) => {
    if (state.userDetails === null) return // no-op, not signed in

    const newPrefs = { ...state.userPreferences, [key]: value }
    await userPreferencesStorage.persist(newPrefs)
    dispatch({ type: "REFRESH_USER_PREFERENCES", preferences: newPrefs })
  }

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const restoredState = await restoreSavedState()
        if (restoredState === null) {
          // user might not be signed in, or an error occured while restoring state,
          // either way, they will have to sign in again
          dispatch({ type: "RESTORE_SAVED_STATE", restoredState: null })
          return
        }

        const { isValid } = await validateTokenMutation.mutateAsync({ authToken: restoredState.userDetails.authToken })
        if (!isValid) {
          // delete token, keep user preferences (not used), so the user is forced to sign in again
          await userDetailsStorage.delete()
        }

        dispatch({ type: "RESTORE_SAVED_STATE", restoredState: isValid ? restoredState : null })
      } catch (e) {
        dispatch({ type: "SET_ERROR", error: e })
      }
    }

    bootstrap()
  }, [])

  const signIn = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", isLoading: true })
    try {
      const authResponse = await loginMutation.mutateAsync({ email, password })
      const preferences = await persistLoginState(authResponse)

      dispatch({ type: "RESTORE_TOKEN", authResponse, preferences })
    } catch (e) {
      dispatch({ type: "SET_ERROR", error: e })
    }
  }

  const signOut = async () => {
    try {
      await userDetailsStorage.delete()
      dispatch({ type: "SIGN_OUT" })
    } catch (e) {
      console.error("failed to remove user token after signing out:", e)
      dispatch({ type: "SET_ERROR", error: e })
    }
  }

  const value: AuthState = {
    isSignedIn: state.userDetails !== null,
    isLoading: state.isLoading,
    userDetails: state.userDetails,
    userPreferences: state.userPreferences,
    error: state.error,
    clearError: () => dispatch({ type: "SET_ERROR", error: null }),
    signIn,
    signOut,
    updateUserPreference,
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

// ============================== 
//    STORAGE PERSISTENCE
// ============================== 

// TODO: support multiple users, probably via tagged state keys

/** Returns null when state is incomplete or absent, rejects on failure  */
const restoreSavedState = async (): Promise<SavedBundle | null> => {
  try {
    const [userDetails, userPreferences] = await Promise.all([
      userDetailsStorage.getValue(),
      userPreferencesStorage.getValue(),
    ])

    if (userDetails === null || userPreferences === null) return null

    return { userDetails, userPreferences }
  } catch (e) {
    console.error("failed to parse persistent state, purging it..:", e)
    // stored data does not match validation schema, delete it so
    // it can be re-written on next sign in, this should only happen during schema definition
    // changes or when manually tampering with persisted state
    await Promise.all([
      userPreferencesStorage.delete(),
      userDetailsStorage.delete(),
    ])
    return Promise.reject(e)
  }
}

const persistLoginState = async (state: AuthResponse): Promise<UserPreferences> => {
  const userDetails: UserDetails = {
    username: state.fullName,
    email: state.email,
    authToken: state.token,
  }
  const [_, preferences] = await Promise.all([
    userDetailsStorage.persist(userDetails),
    userPreferencesStorage.getValue(),
  ])

  if (preferences === null) {
    // first time a user signed in, save default preferences
    await userPreferencesStorage.persist(defaultUserPreferences)
  }
  return preferences ?? defaultUserPreferences
}

