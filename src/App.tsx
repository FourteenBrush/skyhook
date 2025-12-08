import { Link, LinkingOptions, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack"
import LandingPageScreen from "@/screens/LandingPageScreen"
import SearchFlightScreen from "@/screens/SearchFlightScreen"
import FlightListScreen from "@/screens/FlightListScreen"
import LoginScreen from "@/screens/LoginScreen"
import RegisterScreen from "@/screens/RegisterScreen"

import { ThemeProvider, useTheme } from "@/hooks/useTheme"
import { Platform, StatusBar, StyleSheet, View } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Flight } from "@/models/Flight"
import { FlightQuery, SeatClass } from "@/models/FlightQuery"
import TextButton from "@/components/TextButton"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import FlightDetailsScreen from "@/screens/FlightDetailsScreen"
import BookingsScreen from "@/screens/BookingsScreen"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

/** Mapping of params needed by route names */
export type NavParams = {
  "home": undefined,
  "searchFlight": undefined,
  "flightList": FlightQuery,
  "flightDetails": { flight: Flight, chosenClass: SeatClass },
  "bookings": undefined,
  "login": undefined,
  "register": undefined,
}

const Stack = createNativeStackNavigator<NavParams>()

export default function App() {
  const { colors, isDark } = useTheme()
  const isSignedIn = false
  
  const queryClient = new QueryClient()
  
  const screenOptions: NativeStackNavigationOptions = {
    // set screen background color for screens that don't explicitly override this
    contentStyle: { backgroundColor: colors.background },
    title: "Skyhook",
    headerBackVisible: true, // not applicable to web
    headerLeft: () => <MaterialCommunityIcons name="airplane-takeoff" size={25} color="#2563EB" style={styles.headerIcon} />,
    headerRight: () => <HeaderRight signedIn={isSignedIn} />,
    animation: "ios_from_right",
  }

  // linking options, to configure url integration in web browser (history.push etc)
  const linking: LinkingOptions<NavParams> = {
    prefixes: [],
  }
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["left", "bottom", "right"]}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer linking={linking}>
            <ThemeProvider>
              <StatusBar barStyle={isDark ? "light-content" : "dark-content"}/>
              <Stack.Navigator initialRouteName="home" screenOptions={screenOptions}>
                <Stack.Screen name="home" component={LandingPageScreen} />
                <Stack.Screen name="searchFlight" component={SearchFlightScreen} />
                <Stack.Screen name="flightList">{({ route }) => <FlightListScreen query={route.params} />}</Stack.Screen>
                <Stack.Screen name="flightDetails">
                  {({ route }) => <FlightDetailsScreen flight={route.params.flight} chosenClass={route.params.chosenClass} />}
                </Stack.Screen>
                <Stack.Screen name="bookings" component={BookingsScreen} />
                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="register" component={RegisterScreen} />
              </Stack.Navigator>
            </ThemeProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const SignInButton = () => (
  <TextButton kind="outlined" style={styles.signInButton}>
    <Link<NavParams> screen="login">Sign in</Link>
  </TextButton>
)

const HeaderRight = ({ signedIn }: { signedIn: boolean }) => {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      <Link<NavParams> screen="bookings" style={styles.signInButton}>Bookings</Link>
      {(!signedIn && <SignInButton />)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  headerIcon: {
    // some extra spacing on web to account for the lack of a back button
    marginLeft: Platform.select({ web: 12, default: undefined }),
    marginRight: 11,
  },
  signInButton: {
    paddingVertical: 6,
    paddingHorizontal: 7,
  },
})
