import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import BookingsTab from "@/screens/account/BookingsTab"
import SettingsTab from "@/screens/account/SettingsTab"
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useTheme } from "@/hooks/useTheme"

export type TabNavParams = {
  "bookingsTab": undefined,
  "settingsTab": undefined,
}

const Tab = createBottomTabNavigator<TabNavParams>()

export default function AccountScreen() {
  const { colors } = useTheme()

  const screenOptions: BottomTabNavigationOptions = {
    sceneStyle: { backgroundColor: colors.background },
    headerShown: false,
    tabBarLabelPosition: "beside-icon", // shift icon down as we hide the label
    tabBarShowLabel: false,
    animation: "shift",
  }

  return (
    <Tab.Navigator initialRouteName="bookingsTab" screenOptions={screenOptions}>
      <Tab.Screen name="bookingsTab" component={BookingsTab} options={{ tabBarIcon: TabBarBookingsIcon }} />
      <Tab.Screen name="settingsTab" component={SettingsTab} options={{ tabBarIcon: TabBarSettingsIcon }} />
    </Tab.Navigator>
  )
}

type TabBarIconProps = {
  focused: boolean,
  color: string,
  size: number,
}

const TabBarBookingsIcon = ({ color, size }: TabBarIconProps) =>
  <MaterialCommunityIcons name="ticket-outline" size={size} color={color} />

const TabBarSettingsIcon = ({ color, size }: TabBarIconProps) =>
  <EvilIcons name="gear" size={size} color={color} />
