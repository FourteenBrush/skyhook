import { NavigationContainer } from "@react-navigation/native"
import { ThemeProvider } from "@/hooks/useTheme"
import { StyleSheet } from "react-native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { AuthProvider } from "@/hooks/useAuth"
import Routes from "@/Routes"

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
