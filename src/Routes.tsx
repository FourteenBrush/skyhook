import { FlightQuery, SeatClass } from "@/models/FlightQuery"
import { Flight } from "@/models/Flight"
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import { Platform, Pressable, StatusBar, StyleSheet, View } from "react-native"
import { Link, useRoute } from "@react-navigation/native"
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
import { Booking } from "./models/Booking"
import AccountScreen from "./screens/account/AccountScreen"
import { ReactNode } from "react"

/** Mapping of params needed by route names */
export type NavParams = {
  "home": undefined,
  "searchFlight": undefined,
  "flightList": FlightQuery,
  "flightDetails": { flight: Flight, chosenClass: SeatClass },
  "createBooking": { flight: Flight, chosenClass: SeatClass },
  "login": undefined,
  "register": undefined,
  "account": { bookings: Booking[] },
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
    headerRight: () => <AuthHeader />,
    animation: "ios_from_right",
  }

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"}/>

      <Stack.Navigator initialRouteName="home" screenOptions={screenOptions}>
        <Stack.Screen name="home" component={LandingPageScreen} />
        <Stack.Screen name="searchFlight" component={SearchFlightScreen} />
        <Stack.Screen name="flightList">
          {({ route }) => <FlightListScreen query={route.params} />}
        </Stack.Screen>
        <Stack.Screen name="flightDetails">
          {({ route }) => <FlightDetailsScreen flight={route.params.flight} chosenClass={route.params.chosenClass} />}
        </Stack.Screen>

        {isSignedIn ? (<>
          <Stack.Screen name="createBooking">
            {(props) => <CreateBookingScreen {...props.route.params} {...props} />}
          </Stack.Screen>
          <Stack.Screen name="account">
            {(props) => <AccountScreen bookings={props.route.params.bookings} {...props} />}
          </Stack.Screen>
        </>) : (<>
          <Stack.Screen name="login" component={LoginScreen} options={{ animationTypeForReplace: "push" }} />
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

const AuthHeader = () => {
  const { isSignedIn, signOut } = useAuth()
  const route = useRoute()
  const routeName = route.name as keyof NavParams

  let content: ReactNode
  if (!isSignedIn) {
    // hide the login button on the login screen, as ..whats the point?
    content = routeName === "login" ? undefined : <SignInButton />
  } else if (routeName === "account") {
    content = <Pressable onPress={signOut}>
      <FontAwesome name="sign-out" size={28} style={{ opacity: 0.65 }} />
    </Pressable>
  } else {
    content = <Link<NavParams> screen="account" params={{ bookings: [] }}>
      <MaterialCommunityIcons name="account-circle" size={35} color="#656565" style={{ opacity: 0.55 }} />
    </Link>
  }

  return (
    <View style={styles.authHeader}>
      {content}
    </View>
  )
}

const styles = StyleSheet.create({
  headerIcon: {
    // some extra spacing on web to account for the lack of a back button
    marginLeft: Platform.select({ web: 12, default: undefined }),
    marginRight: 11,
  },
  authHeader: {
    flexDirection: "row",
    gap: 4,
    marginRight: Platform.select({ web: 8, default: undefined }),
  },
  signInButton: {
    paddingVertical: 6,
    paddingHorizontal: 7,
  },
})
