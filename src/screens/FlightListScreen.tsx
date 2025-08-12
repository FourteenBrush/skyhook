import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { Flight } from "@/models/Flight"
import { FlightQuery } from "@/models/FlightQuery"
import { BORDER_RADIUS_NORMAL, BORDER_RADIUS_ROUNDED_BUTTON, CONTAINER_MARGIN, ThemeData } from "@/theme"
import { ApiClient, QUERY_KEYS } from "@/api"
import { AntDesign, Feather } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { memo } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { mockupFlights } from "@/utils/mockupData"

export type FlightListScreenProps = {
  query: FlightQuery,
}

/** Screen responsable for loading available flights, based off users query */
export default function FlightListScreen({ query }: FlightListScreenProps) {
  const styles = useStyleSheet(getStyles)
  const { fonts } = useTheme()
  
  const { isPending, error, data } = useQuery({
    queryKey: [QUERY_KEYS.GET_FLIGHTS, query],
    queryFn: () => ApiClient.getFlights(query),
  })
  
  const flights = mockupFlights
  console.log(isPending, error, data)
  
  return (
    <View style={styles.container}>
      {/* From -> To */}
      <Text style={fonts.headlineLarge}>
        {query.departureCity}{" "}
        <AntDesign name="arrowright" size={22} />
        {" "}{query.destinationCity}
      </Text>
      
      <Text style={styles.flightCount}>{flights.length} flights found</Text>
      
      <FlatList
        data={flights}
        renderItem={({ item }) => <FlightCard flight={item} />}
        keyExtractor={(flight) => flight.id.toString()}
        style={styles.flights}
      />
    </View>
  )
}

function FlightCard({ flight }: { flight: Flight }) {
  const styles = useStyleSheet(getStyles)
  
  return (
    <View style={styles.flightCard}>
      <View style={styles.flightCardTitle}>
        <Text accessibilityHint="airline">{flight.airline}{"  "}</Text>
        <Text accessibilityHint="flight number" style={styles.flightNr}>{flight.flightNr}{"  "}</Text>
        {flight.isDirect && <DirectFlightBadge />}
      </View>
      
      <FlightSchedule flight={flight} />
      <Text accessibilityHint="flight price" style={styles.flightPrice}>&euro;{flight.price}</Text>
    </View>
  )
}

const DirectFlightBadge = memo(() => {
  const styles = useStyleSheet(getStyles)
  
  return (
    <View style={styles.directFlightBadge} accessible accessibilityLabel="direct flight badge">
      <Text style={styles.directFlightBadgeText}>Direct</Text>
    </View>
  )
})

const FlightSchedule = ({ flight }: { flight: Flight }) => {
  const styles = useStyleSheet(getStyles)
  
  return (
    <View style={styles.flightSchedule}>
      <View accessibilityHint="flight departure time">
        <Text style={styles.scheduleTime}>{flight.departureTime.toLocaleTimeString(undefined, { timeStyle: "short" })}</Text>
        <Text accessibilityHint="departure airport">{flight.departureAirport.shortName}</Text>
      </View>
      
      <View style={styles.flightDuration} accessibilityHint="flight duration">
        <Feather name="clock" size={13} />
        <Text>{flight.totalDuration.toLocaleTimeString(undefined, { timeStyle: "short", timeZone: "UTC" })}</Text>
      </View>
      
      <View accessibilityHint="flight arrival time">
        <Text style={styles.scheduleTime}>{flight.arrivalTime.toLocaleTimeString(undefined, { timeStyle: "short" })}</Text>
        <Text accessibilityHint="destination airport">{flight.destinationAirport.shortName}</Text>
      </View>
    </View>
  )
}

const getStyles = ({ fonts, colors }: ThemeData) => StyleSheet.create({
  container: {
    margin: CONTAINER_MARGIN,
  },
  flightCount: {
    ...fonts.bodyMedium,
    color: colors.textSecondary,
    marginTop: 8,
  },
  flights: {
    marginVertical: CONTAINER_MARGIN,
  },
  flightCard: {
    borderRadius: BORDER_RADIUS_NORMAL * 2,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
  },
  flightCardTitle: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
  },
  flightNr: {
    color: colors.textSecondary,
  },
  directFlightBadge: {
    borderRadius: BORDER_RADIUS_ROUNDED_BUTTON,
    backgroundColor: colors.button,
    color: colors.buttonText,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  directFlightBadgeText: {
    ...fonts.labelMedium,
    color: colors.buttonText,
  },
  flightSchedule: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flightDuration: {
     alignItems: "center",
     gap: 4,
  },
  scheduleTime: {
    ...fonts.labelLarge,
    fontWeight: 600,
  },
  flightPrice: {
    ...fonts.titleLarge,
    color: colors.primary,
    fontWeight: 600,
    textAlign: "right",
    marginTop: 10,
  },
})