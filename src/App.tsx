import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LandingPageScreen from "@/screens/LandingPageScreen"
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons"
import { ThemeContext } from "@/hooks/useTheme"
import { useColorScheme } from "react-native"
import { darkTheme, lightTheme } from "@/theme"

/** Mapping of params needed by route names */
export type NavParams = {
  "home": undefined,
}

const Stack = createNativeStackNavigator<NavParams>()

export default function App() {
  // FIXME: use settings override
  const preferredColorScheme = useColorScheme()
  const theme = preferredColorScheme == "dark" ? darkTheme : lightTheme
  
  return (
    <NavigationContainer>
      <ThemeContext.Provider value={theme}>
        <Stack.Navigator initialRouteName="home">
          <Stack.Screen name="home" component={LandingPageScreen} options={{
            title: "Skyhook",
            headerLeft: () => <MaterialDesignIcons name="airplane" size={25} color="#2563EB" style={{marginRight: 11}} />
          }} />
        </Stack.Navigator>
      </ThemeContext.Provider>
    </NavigationContainer>
  )
}