import { useStyleSheet } from "@/hooks/useStyleSheet"
import { Flight } from "@/models/Flight"
import { FlightQuery } from "@/models/FlightQuery"
import { BORDER_RADIUS_NORMAL, CARD_PADDING, CONTAINER_MARGIN, ThemeData } from "@/theme"
import { ApiClient, QUERY_KEYS } from "@/api"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavParams } from "@/App"
import FlightRouteDisplay from "@/components/FlightRouteDisplay"
import DirectFlightBadge from "@/components/DirectFlightBadge"
import { LoadingIndicator, ErrorIndicator } from "@/components/Indicators"
import { useTheme } from "@/hooks/useTheme"

export type FlightListScreenProps = {
  query: FlightQuery,
}

/** Screen responsable for loading available flights, based off users query */
export default function FlightListScreen({ query }: FlightListScreenProps) {
  const { colors } = useTheme()
  
  const { isPending, error, data } = useQuery({
    queryKey: [QUERY_KEYS.GET_FLIGHTS, query],
    queryFn: () => ApiClient.getFlights(query),
  })
  
  if (isPending) {
    return (
      <LoadingIndicator
        title="Searching Flights"
        subtitle={`${query.departureCity} -> ${query.destinationCity}`}
        icon=<MaterialCommunityIcons name="airplane" size={48} color={colors.primary} />
        userMessage="Finding the best deals..."
      />
    )
  }
  if (error !== null) {
    return (
      <ErrorIndicator
        title="Search Failed"
        subtitle="We encountered an issue while searching for flights."
        icon=<Feather name="alert-circle" size={48} color="#EF4444" />
        userMessage="Unable to connect to server"
      />
    )
  }
  return <FlightList query={query} flights={data} />
}

function FlightList({ query, flights }: { query: FlightQuery, flights: Flight[] }) {
  const styles = useStyleSheet(getStyles)
  
  return (
    <View style={styles.container}>
      {/* From -> To */}
      <FlightRouteDisplay departure={query.departureCity} destination={query.destinationCity} />
      
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
  const navigation = useNavigation<NavigationProp<NavParams>>()
  
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.flightCard}
      onPress={() => navigation.navigate("flightDetails", { flight })}
    >
      <View style={styles.flightCardTitle}>
        <Text accessibilityHint="airline">{flight.airline}{"  "}</Text>
        <Text accessibilityHint="flight number" style={styles.flightNr}>{flight.flightNr}{"  "}</Text>
        {flight.isDirect && <DirectFlightBadge />}
      </View>
      
      <FlightSchedule flight={flight} />
      <Text accessibilityHint="flight price" style={styles.flightPrice}>&euro;{flight.price}</Text>
    </TouchableOpacity>
  )
}

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
    padding: CARD_PADDING,
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