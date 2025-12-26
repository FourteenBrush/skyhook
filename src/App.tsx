import { NavigationContainer } from "@react-navigation/native"
import * as SplashScreen from "expo-splash-screen"
import { ThemeProvider } from "@/hooks/useTheme"
import { LogBox, StyleSheet } from "react-native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { AuthProvider } from "@/hooks/useAuth"
import Routes from "@/Routes"

// prevent hiding splash screen automatically the moment the app is loaded
// (because we still have to load auth state), a call to SplashScreen.hide must be manually inserted
// NOTE: must be called in global scope
SplashScreen.preventAutoHideAsync()

// do not show an error overlay when an error occurs, instead only log them in the terminal
LogBox.ignoreAllLogs(true)

export default function App() {
  const queryClient = new QueryClient()
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["left", "bottom", "right"]}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {/* NOTE: linking options, to configure url integration in web browser (history.push etc) */}
            <NavigationContainer linking={{ prefixes: [] }}>
              <ThemeProvider>
                <Routes />
              </ThemeProvider>
            </NavigationContainer>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
})
