import { View } from "react-native";

export type FlightRouteDisplayProps = {
  departure: string,
  destination: string,
}

export default function FlightRouteDisplay({ departure, destination }: FlightRouteDisplayProps) {
  return (
    <View>Flight Route</View>
  )
}
