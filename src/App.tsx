import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LandingPageScreen from "@/screens/LandingPageScreen"
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons"
import { ThemeProvider } from "@/hooks/useTheme"
import SearchFlightPage from "./screens/SearchFlightPage"
import { SafeAreaView } from "react-native"

/** Mapping of params needed by route names */
export type NavParams = {
  "home": undefined,
  "searchFlight": undefined,
}

const Stack = createNativeStackNavigator<NavParams>()

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <ThemeProvider>
          <Stack.Navigator initialRouteName="home" screenOptions={{
            title: "Skyhook",
            headerBackVisible: true,
            headerLeft: () => <MaterialDesignIcons name="airplane" size={25} color="#2563EB" style={{marginRight: 11}} />,
          }}>
            <Stack.Screen name="home" component={LandingPageScreen} />
            <Stack.Screen name="searchFlight" component={SearchFlightPage} />
          </Stack.Navigator>
        </ThemeProvider>
      </NavigationContainer>
    </SafeAreaView>
  )
}