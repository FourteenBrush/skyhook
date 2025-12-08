import { useStyleSheet } from "@/hooks/useStyleSheet"
import { Flight } from "@/models/Flight"
import { FlightQuery, SeatClass } from "@/models/FlightQuery"
import { BORDER_RADIUS_NORMAL, CARD_PADDING, CONTAINER_MARGIN, ThemeData } from "@/theme"
import { ApiClient, QUERY_KEYS } from "@/api"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavParams } from "@/App"
import FlightRouteDisplay from "@/components/FlightRouteDisplay"
import NumberOfStopsBadge from "@/components/NumberOfStopsBadge"
import StatusIndicator from "@/components/StatusIndicator"
import { useTheme } from "@/hooks/useTheme"
import TextButton from "@/components/TextButton"
import Card from "@/components/Card"
import { formatDuration, formatTime } from "@/utils/utils"

export type FlightListScreenProps = {
  query: FlightQuery,
}

/** Screen responsable for loading available flights, based off users query */
export default function FlightListScreen({ query }: FlightListScreenProps) {
  const styles = useStyleSheet(getStyles)
  const { colors } = useTheme()
  
  const { isPending, error, data, refetch } = useQuery({
    queryKey: [QUERY_KEYS.GET_FLIGHTS, query],
    queryFn: () => ApiClient.getFlights(query),
  })
  
  if (isPending) {
    return (
      <StatusIndicator
        title="Searching Flights.."
        subtitle={`${query.departureCity} -> ${query.destinationCity}`}
        style={styles.queryIndicator}
        icon=<MaterialCommunityIcons name="airplane" size={48} color={colors.primary} />
        userMessage="Finding the best deals..."
      />
    )
  }
  if (error !== null) {
    return (
      <StatusIndicator
        title="Search Failed"
        subtitle="We encountered an issue while searching for flights."
        style={styles.queryIndicator}
        icon=<Feather name="alert-circle" size={48} color="#EF4444" />
        userMessage="Unable to connect to the server"
        button=<TextButton shape="circular" onPress={() => refetch()}>Retry</TextButton>
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
      {/* FIXME: pass normalized names (capitalized and such) */}
      <FlightRouteDisplay
        departure={query.departureCity}
        destination={query.destinationCity}
        size="large"
      />
      
      <Text style={styles.flightCount}>{flights.length} flights found</Text>
      
      <FlatList
        data={flights}
        renderItem={({ item }) => <FlightCard flight={item} chosenClass={query.seatClass} />}
        keyExtractor={(flight) => flight.id.toString()}
        style={styles.flights}
        persistentScrollbar={true}
        indicatorStyle="black"
      />
    </View>
  )
}

function FlightCard({ flight, chosenClass }: { flight: Flight, chosenClass: SeatClass }) {
  const styles = useStyleSheet(getStyles)
  const navigation = useNavigation<NavigationProp<NavParams>>()

  return (
    <Card
      clickable={true}
      activeOpacity={0.5}
      onPress={() => navigation.navigate("flightDetails", { flight, chosenClass })}
    >
      <View style={styles.flightCardTitle}>
        <Text accessibilityHint="airline">{flight.airline}{"  "}</Text>
        <Text accessibilityHint="flight number" style={styles.flightNr}>{flight.flightNr}{"  "}</Text>
        <NumberOfStopsBadge stops={flight.paths.length - 1} />
      </View>
      
      <FlightSchedule flight={flight} />
      <Text accessibilityHint="flight price" style={styles.flightPrice}>&euro;{flight.price}</Text>
    </Card>
  )
}

const FlightSchedule = ({ flight }: { flight: Flight }) => {
  const styles = useStyleSheet(getStyles)

  return (
    <View style={styles.flightSchedule}>
      <View>
        <Text style={styles.scheduleTime} accessibilityHint="flight departure time">{formatTime(flight.departureTime)}</Text>
        <Text accessibilityHint="departure airport">{flight.departureAirport.shortName}</Text>
      </View>
      
      <View style={styles.flightDuration} accessibilityHint="flight duration">
        <Feather name="clock" size={13} />
        <Text>{formatDuration(flight.totalDuration)}</Text>
      </View>
      
      <View>
        <Text style={styles.scheduleTime} accessibilityHint="flight arrival time">{formatTime(flight.arrivalTime)}</Text>
        <Text style={{ alignSelf: "flex-end" }} accessibilityHint="destination airport">{flight.arrivalAirport.shortName}</Text>
      </View>
    </View>
  )
}

const getStyles = ({ fonts, colors }: ThemeData) => StyleSheet.create({
  container: {
    marginHorizontal: CONTAINER_MARGIN,
    // to not clip into bottom of screen
    // FIXME: why is there padding around the flatlist because of this,
    // not caused by a safe area?
    flex: 1,
  },
  queryIndicator: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    transform: [{ translateY: -65 }], // move slightly up
  },
  flightCount: {
    ...fonts.bodyMedium,
    color: colors.textSecondary,
    marginTop: 8,
  },
  flights: {
    marginVertical: CONTAINER_MARGIN,
    // flex: 1,
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
