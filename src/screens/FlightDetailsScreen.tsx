import Card from "@/components/Card"
import NumberOfStopsBadge from "@/components/NumberOfStopsBadge"
import FlightRouteDisplay from "@/components/FlightRouteDisplay"
import FlightTiming from "@/components/FlightTiming"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { Airport, Flight } from "@/models/Flight"
import { CONTAINER_MARGIN, ThemeData } from "@/theme"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { formatDurationToReadable, formatTime } from "@/utils/utils"
import { TimelineMarker } from "@/components/TimelineMarker"
import Badge from "@/components/Badge"
import TextButton from "@/components/TextButton"
import { SeatClass, seatClassToCapitalized } from "@/models/FlightQuery"
import { EvilIcons } from "@expo/vector-icons"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavParams } from "@/Routes"
import { useAuth } from "@/hooks/useAuth"

export type FlightDetailsScreenProps = {
  flight: Flight,
  chosenClass: SeatClass,
}

export default function FlightDetailsScreen({ flight, chosenClass }: FlightDetailsScreenProps) {
  const styles = useStyleSheet(getStyles)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* general flight info */}
      <Card clickable={false} accessibilityHint="general flight information">
        <FlightRouteDisplay
          departure={flight.departureAirport.city}
          arrival={flight.arrivalAirport.city}
          size="small"
          style={{ paddingBottom: 11 }}
        />
      
        <View style={styles.generalInfo}>
          <Text accessibilityHint="airline">{flight.airline}</Text>
          <Text accessibilityHint="flight number" style={styles.flightNr}>{flight.flightNr}</Text>
          <NumberOfStopsBadge stops={flight.intermediaryStopCount} />
        </View>

        <Text accessibilityHint="flight price" style={styles.price}>&euro;{flight.price}</Text>

        <FlightTiming flight={flight} kind="large" />
      </Card>
      <FlightStops flight={flight} />

      <FlightBookingSection flight={flight} chosenClass={chosenClass} />
    </ScrollView>
  )
}

const getFlightStops = (flight: Flight): FlightStopProps[] => {
  if (flight.isDirect) {
    const { departureAirport, departureTime, arrivalAirport, arrivalTime } = flight.paths[0]
    return [
      { kind: "departure", airport: departureAirport, departureTime },
      { kind: "arrival", airport: arrivalAirport, arrivalTime },
    ]
  }

  return flight.paths.flatMap<FlightStopProps>((path, i, arr) => {
    const isDeparture = i === 0
    const isArrival = i === arr.length - 1
    const { departureAirport, departureTime, arrivalAirport, arrivalTime } = path

    if (isDeparture) {
      return [{ kind: "departure", airport: departureAirport, departureTime }]
    }

    if (isArrival) {
      const prev = arr[i - 1] // safe as flight.isDirect is checked beforehand
      return [
        // layover starts from the moment prev flight arrived up till this flight departs
        { kind: "layover", airport: departureAirport, departureTime: prev.arrivalTime, arrivalTime: departureTime },
        { kind: "arrival", airport: arrivalAirport, arrivalTime }
      ]
    }

    // middle = layover only
    const prev = arr[i - 1] // safe as flight.isDirect is checked beforehand
    return [
      { kind: "layover", airport: departureAirport, departureTime: prev.arrivalTime, arrivalTime: departureTime },
    ]
  })
}

function FlightStops({ flight }: { flight: Flight }) {
  const styles = useStyleSheet(getStyles)

  const stops = getFlightStops(flight)

  return (
    <Card clickable={false}>
      <Text style={styles.routeTitle}>Flight Route & Stops</Text>

      <View style={{ gap: 8 }}>
        {stops.map((stop, i) => <FlightStop key={i} {...stop} />)}
      </View>

      <Text style={styles.timezoneNotice}>(All times are displayed in the current system timezone)</Text>
    </Card>
  )
}

/**
 * departure and arrival are expressed in monotonic times, solely
 * indicating the start and end of this "event".
 */
type FlightStopProps = (
  | { kind: "departure", departureTime: Date, arrivalTime?: never }
  | { kind: "layover", departureTime: Date, arrivalTime: Date }
  | { kind: "arrival", departureTime?: never, arrivalTime: Date }
) & { airport: Airport }

function FlightStop({ kind, airport, departureTime, arrivalTime }: FlightStopProps) {
  if (kind === "layover") {
    console.assert(departureTime < arrivalTime)
  }

  const styles = useStyleSheet(getStyles)
  const { fonts } = useTheme()

  const stopTitle = kind === "layover"
    ? `Layover in ${airport.city}`
    : formatTime(departureTime ?? arrivalTime)

  const markerColor = kind === "departure"
    ? "#2d7df6" // blue
    : kind === "layover"
      ? "#f6a623" // orange
      : "#3cb043" // green

  return (
    <View style={{ flexDirection: "row" }} accessibilityHint={`${kind} airport in flight route`}>
      <TimelineMarker color={markerColor} />

      {/* stop content */}
      <View style={{ paddingBottom: 6 }}>
        <View style={styles.routeLine}>
          <Text style={fonts.titleMedium}>{stopTitle}</Text>

          {kind === "layover" && <>
            <Text>{airport.shortName}</Text>
            <Badge kind="outlined">{
              formatDurationToReadable(new Date(arrivalTime.getTime() - departureTime.getTime()))
            }</Badge>
          </>}
        </View>

        {kind === "layover" && <Text>Arrival: {formatTime(departureTime)}</Text>}
        <Text>{airport.longName}</Text>
        {kind === "layover" && <Text>Connecting flight: {formatTime(arrivalTime)}</Text>}
        {kind === "arrival" && <View style={{ flexDirection: "row" }}>
          <EvilIcons name="location" color="#DC6717" size={18} />
          <Text>Destination</Text>
        </View>}
      </View>
    </View>
  )
}

function FlightBookingSection({ flight, chosenClass }: { flight: Flight, chosenClass: SeatClass }) {
  const navigation = useNavigation<NavigationProp<NavParams>>()
  const { isSignedIn } = useAuth()
  const styles = useStyleSheet(getStyles)
  const { fonts } = useTheme()

  const navigateToBooking = () => {
    // FIXME: could ideally create some useProtectedRoute hook or something
    if (isSignedIn) {
      navigation.navigate("createBooking", { flight, chosenClass })
    } else {
      navigation.navigate("login")
    }
  }

  return (
    <Card clickable={false}>
      <View style={styles.bookingSectionPrice}>
        <Text style={fonts.titleLarge}>&euro;{flight.price}</Text>
        <Text>per person &bull; {seatClassToCapitalized(chosenClass)}</Text>
      </View>

      <TextButton kind="filled" style={styles.bookFlightButton} onPress={navigateToBooking}>
        Book This Flight
      </TextButton>
    </Card>
  )
}

const getStyles = ({ fonts, colors }: ThemeData) => StyleSheet.create({
  container: {
    margin: CONTAINER_MARGIN,
    // to not clip into bottom of screen
    // FIXME: why is our scrollview even clipping in the first place?
    paddingBottom: 20,
  },
  generalInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flightNr: {
    color: colors.textSecondary,
  },
  price: {
    ...fonts.headlineSmall,
    fontWeight: 500,
    color: colors.primary,
    textAlign: "right",
    paddingTop: 7,
  },
  timezoneNotice: {
    color: colors.textSecondary,
    paddingTop: 6,
  },
  bookFlightButton: {
    marginTop: 12,
    width: "100%",
  },

  routeTitle: {
    ...fonts.titleLarge,
    fontWeight: 500,
    paddingBottom: 10,
  },
  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  
  bookingSectionPrice: {
    alignItems: "flex-start",
    alignSelf: "center"
  },
})
