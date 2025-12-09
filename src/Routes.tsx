import { FlightQuery, SeatClass } from "@/models/FlightQuery"
import { Flight } from "@/models/Flight"
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Platform, StatusBar, StyleSheet, View } from "react-native"
import { Link } from "@react-navigation/native"
import TextButton from "@/components/TextButton"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import CreateBookingScreen from "@/screens/CreateBookingScreen"
import LoginScreen from "@/screens/LoginScreen"
import LandingPageScreen from "@/screens/LandingPageScreen"
import SearchFlightScreen from "@/screens/SearchFlightScreen"
import FlightListScreen from "@/screens/FlightListScreen"
import FlightDetailsScreen from "@/screens/FlightDetailsScreen"
import RegisterScreen from "@/screens/RegisterScreen"

/** Mapping of params needed by route names */
export type NavParams = {
  "home": undefined,
  "searchFlight": undefined,
  "flightList": FlightQuery,
  "flightDetails": { flight: Flight, chosenClass: SeatClass },
  "createBooking": undefined,
  "login": undefined,
  "register": undefined,
}

const Stack = createNativeStackNavigator<NavParams>()

export default function Routes() {
  const { colors, isDark } = useTheme()
  const { isSignedIn } = useAuth()

  const screenOptions: NativeStackNavigationOptions = {
    // set screen background color for screens that don't explicitly override this
    contentStyle: { backgroundColor: colors.background },
    title: "Skyhook",
    headerBackVisible: true, // not applicable to web
    headerLeft: () => <MaterialCommunityIcons name="airplane-takeoff" size={25} color="#2563EB" style={styles.headerIcon} />,
    headerRight: () => <HeaderRight signedIn={isSignedIn} />,
    animation: "ios_from_right",
  }

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"}/>

      <Stack.Navigator initialRouteName="home" screenOptions={screenOptions}>
        <Stack.Screen name="home" component={LandingPageScreen} />
        <Stack.Screen name="searchFlight" component={SearchFlightScreen} />
        <Stack.Screen name="flightList">{({ route }) => <FlightListScreen query={route.params} />}</Stack.Screen>
        <Stack.Screen name="flightDetails">
          {({ route }) => <FlightDetailsScreen flight={route.params.flight} chosenClass={route.params.chosenClass} />}
        </Stack.Screen>

        {isSignedIn ? (<>
          <Stack.Screen name="createBooking" component={CreateBookingScreen} />
        </>) : (<>
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="register" component={RegisterScreen} />
        </>)}
      </Stack.Navigator>
    </>

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
      {/* <Link<NavParams> screen="createBooking" style={styles.signInButton}>Bookings</Link> */}
      {signedIn
        ? <MaterialCommunityIcons name="account-circle" size={35} style={{ opacity: 0.58 }} />
        : <SignInButton />
      }
    </View>
  )
}

const styles = StyleSheet.create({
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
