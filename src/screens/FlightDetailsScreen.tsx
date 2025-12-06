import Card from "@/components/Card"
import NumberOfStopsBadge from "@/components/NumberOfStopsBadge"
import FlightRouteDisplay from "@/components/FlightRouteDisplay"
import FlightTiming from "@/components/FlightTiming"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { Airport, Flight } from "@/models/Flight"
import { CONTAINER_MARGIN, ThemeData } from "@/theme"
import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "@/hooks/useTheme"
import { formatDurationToReadable, formatTime } from "@/utils/utils"
import { TimelineMarker } from "@/components/TimelineMarker"

export type FlightDetailsScreenProps = {
  flight: Flight,
}

export default function FlightDetailsScreen({ flight }: FlightDetailsScreenProps) {
  const styles = useStyleSheet(getStyles)

  return (
    <View style={styles.container}>
      {/* general flight info */}
      <Card clickable={false} accessibilityHint="general flight information">
        <FlightRouteDisplay
          departure={flight.departureAirport.city}
          destination={flight.arrivalAirport.city}
          size="small"
          style={{ paddingBottom: 11 }}
        />
      
        <View style={styles.generalInfo}>
          <Text accessibilityHint="airline">{flight.airline}</Text>
          <Text accessibilityHint="flight number" style={styles.flightNr}>{flight.flightNr}</Text>
          <NumberOfStopsBadge stops={flight.paths.length - 1} />
        </View>

        <Text accessibilityHint="flight price" style={styles.price}>&euro;{flight.price}</Text>

        <FlightTiming flight={flight} />
      </Card>
      <FlightStops flight={flight} />
    </View>
  )
}
const getFlightStops = (flight: Flight): FlightStopProps[] => {
  return flight.paths.flatMap<FlightStopProps>((path, i, arr) => {
    const isFirst = i === 0
    const isLast = i === arr.length - 1

    if (isFirst) {
      return [{
        kind: "departure",
        airport: path.departureAirport,
        departureTime: path.departureTime,
      }]
    }

    if (isLast) {
      return [{
        kind: "layover",
        airport: path.departureAirport,
        arrivalTime: path.arrivalTime,
        departureTime: path.departureTime,
      }, {
        kind: "arrival",
        airport: path.arrivalAirport,
        arrivalTime: path.arrivalTime,
      }]
    }

    // middle = layover only
    return [{
      kind: "layover",
      airport: path.departureAirport,
      arrivalTime: path.arrivalTime,
      departureTime: path.departureTime,
    }]
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

      <Text style={styles.timezoneNotice}>(All times are displayed in the curent system timezone)</Text>
    </Card>
  )
}

type FlightStopProps = (
  | { kind: "departure", departureTime: Date, arrivalTime?: never }
  | { kind: "layover", departureTime: Date, arrivalTime: Date }
  | { kind: "arrival", departureTime?: never, arrivalTime: Date }
) & { airport: Airport }

function FlightStop({ kind, airport, departureTime, arrivalTime }: FlightStopProps) {
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
          {kind !== "layover" && <Text>{airport.shortName}</Text>}
          {kind === "layover" && <Text>{formatDurationToReadable(new Date(arrivalTime - departureTime))}</Text>}
        </View>

        {kind === "layover" && <Text>Arrival: {formatTime(departureTime)}</Text>}
        <Text>{airport.longName}</Text>
      </View>
    </View>
  )
}


const getStyles = ({ fonts, colors }: ThemeData) => StyleSheet.create({
  container: {
    margin: CONTAINER_MARGIN,
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
})
