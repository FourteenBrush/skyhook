import { LinkingOptions, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LandingPageScreen from "@/screens/LandingPageScreen"
import { ThemeProvider } from "@/hooks/useTheme"
import SearchFlightPage from "./screens/SearchFlightPage"
import { SafeAreaView } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

/** Mapping of params needed by route names */
export type NavParams = {
  "home": undefined,
  "searchFlight": undefined,
}

const Stack = createNativeStackNavigator<NavParams>()

// linking options, to configure url integration in web browser (history.push etc)
const linking: LinkingOptions<NavParams> = {
  prefixes: [],
}

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer linking={linking}>
        <ThemeProvider>
          <Stack.Navigator initialRouteName="home" screenOptions={{
            title: "Skyhook",
            headerBackVisible: true,
            headerLeft: () => <MaterialCommunityIcons name="airplane-takeoff" size={25} color="#2563EB" style={{marginRight: 11}} />,
          }}>
            <Stack.Screen name="home" component={LandingPageScreen} />
            <Stack.Screen name="searchFlight" component={SearchFlightPage} />
          </Stack.Navigator>
        </ThemeProvider>
      </NavigationContainer>
    </SafeAreaView>
  )
}