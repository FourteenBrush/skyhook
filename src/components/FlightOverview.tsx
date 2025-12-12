import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { Flight } from "@/models/Flight"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"
import Badge from "@/components/Badge"
import FlightTiming from "@/components/FlightTiming"
import { ThemeData } from "@/theme"
import { formatDate } from "@/utils/utils"
import { SeatClass, seatClassToCapitalized } from "@/models/FlightQuery"
import HorizontalLine from "@/components/HorizontalLine"

export default function FlightOverview({ flight, chosenClass }: { flight: Flight, chosenClass: SeatClass }) {
  const styles = useStyleSheet(getStyles)
  const { colors, fonts } = useTheme()

  return (
    <>
      {/* airline and flight nr */}
      <View style={styles.airlineAndFlightNr}>
        <View style={{ flexDirection: "row", gap: 7 }}>
          <Ionicons name="airplane-outline" color={colors.primary} size={17} style={{ transform: [{ rotateZ: "-45deg" }] }} />
          <Text style={fonts.titleMedium} accessibilityHint="airline">{flight.airline}</Text>
        </View>

        <Badge kind="light">{flight.flightNr}</Badge>
      </View>

      <FlightTiming flight={flight} kind="small" />
      <HorizontalLine />

      {/* departure, class and price */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <MaterialCommunityIcons name="calendar-blank" size={16} color={colors.text} />
          <Text style={fonts.bodyMedium} accessibilityHint="departure time">{formatDate(flight.departureTime)}</Text>
          <Text style={fonts.bodyMedium} accessibilityHint="seat class">{seatClassToCapitalized(chosenClass)}</Text>
        </View>

        <Text style={styles.price} accessibilityHint="flight price">&euro;{flight.price}</Text>
      </View>
    </>
  )
}

const getStyles = ({ colors, fonts }: ThemeData) => StyleSheet.create({
  airlineAndFlightNr: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  price: {
    ...fonts.titleLarge,
    color: colors.primary,
  },
})
