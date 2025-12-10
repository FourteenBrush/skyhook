import { ApiClient, AuthResponse, SignInRequest, TokenValidationResponse } from "@/api"
import { createContext, PropsWithChildren, useContext, useEffect, useReducer } from "react"
// NOTE: needs a * import as this is broken otherwise for some reason
import * as SecureStore from "expo-secure-store"
import { DefaultError, useMutation } from "@tanstack/react-query"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

type InternalAuthState = {
  token: string | null,
  isLoading: boolean,
  error: any | null,
}

export type AuthState = {
  isSignedIn: boolean,
  /** Accounts for both loading async state and actually performing network calls */
  isLoading: boolean,
  /** Error which is set when both `isSignedIn` and `isLoading` are false */
  error: any | null,
  signIn: (email: string, password: string) => Promise<void>,
  signOut: () => Promise<void>,
}

const AuthContext = createContext<AuthState | null>(null)

type AuthAction =
  | { type: "RESTORE_TOKEN", token: string | null }
  | { type: "SIGN_OUT" }
  | { type: "SET_LOADING", isLoading: boolean }
  | { type: "ABORT_WITH_ERROR", error: any }

const TOKEN_KEY = "__USER_TOKEN"

const authReducer = (state: InternalAuthState, action: AuthAction): InternalAuthState => {
  switch (action.type) {
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

/**
 * An auth context provider, the auth check is immediately started upon mounting.
 */
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    token: null,
    error: null,
  })

  const loginMutation = useMutation<AuthResponse, DefaultError, SignInRequest>({
    mutationFn: (req) => ApiClient.signIn(req),
    onError: (error) => console.error("sign in failed: " + error),
  })

  const validateTokenMutation = useMutation<TokenValidationResponse, DefaultError, { token: string }>({
    mutationFn: ({ token }) => ApiClient.validateUserToken(token),
    onError: (error) => console.error("validating token failed: " + error),
  })

  useEffect(() => {
    const bootstrap = async () => {
      try {
        let userToken = await PlatformStorage.getItemAsync(TOKEN_KEY)
        if (userToken !== null) {
          const { isValid } = await validateTokenMutation.mutateAsync({ token: userToken })

          if (!isValid) {
            userToken = null
            await PlatformStorage.deleteValueAsync(TOKEN_KEY)
          }
        }

        dispatch({ type: "RESTORE_TOKEN", token: userToken })
      } catch (e) {
        dispatch({ type: "ABORT_WITH_ERROR", error: e })
      }
    }

    bootstrap()
  }, [])

  const signIn = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", isLoading: true })
    try {
      const { token } = await loginMutation.mutateAsync({ email, password })
      await PlatformStorage.persistAsync(TOKEN_KEY, token)
        .catch(err => console.error("failed to persist user token after sign in: " + err))

      dispatch({ type: "RESTORE_TOKEN", token })
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
