import { Flight } from "@/models/Flight"
import { View } from "react-native"

export type FlightDetailsScreenProps = {
  flight: Flight,
}

export default function FlightDetailsScreen({ flight }: FlightDetailsScreenProps) {
  return (<View>Ello</View>)
}
