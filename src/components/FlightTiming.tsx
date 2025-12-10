import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { Airport, Flight } from "@/models/Flight"
import { ThemeData } from "@/theme"
import { formatDurationToReadable, formatTime } from "@/utils/utils"
import { Feather } from "@expo/vector-icons"
import { StyleProp, StyleSheet, Text, View, ViewProps, ViewStyle } from "react-native"

/**
 * Small = horizontal display of the flight departure and arrival time and airport.
 * Large = vertical display with more details.
 */
export type FlightTimingKind = "small" | "large"

export type FlightTimingProps = ViewProps & {
  flight: Flight,
  kind: FlightTimingKind,
}

export default function FlightTiming({ flight, kind, ...props }: FlightTimingProps) {
  const styles = useStyleSheet(getStyles)

  const style: ViewStyle = kind === "large"
    ? { flexDirection: "column" }
    : { flexDirection: "row", justifyContent: "space-between" }

  const [departureStyle, arrivalStyle]: [ViewStyle, ViewStyle] = [
    { alignSelf: "flex-start" },
    { alignSelf: "flex-end", paddingTop: kind === "large" ? 8 : 0 },
  ]

  return (
    <View style={style} {...props}>
      <TimingSection
        kind={kind}
        style={departureStyle}
        title={kind === "large" ? "Departure" : undefined}
        time={flight.departureTime}
        airport={flight.departureAirport}
        accessibilityHint="departure timing info"
      />
      <View style={styles.flightDuration}>
        <Feather name="clock" size={13} />
        <Text accessibilityHint="total flight duration">{formatDurationToReadable(flight.totalDuration)}</Text>
      </View>
      <TimingSection
        kind={kind}
        style={arrivalStyle}
        title={kind === "large" ? "Arrival" : undefined}
        time={flight.arrivalTime}
        airport={flight.arrivalAirport}
        accessibilityHint="arrival timing info"
      />
    </View>
  )
}

type TimingSectionProps = ViewProps & {
  kind: FlightTimingKind,
  title?: string,
  time: Date,
  airport: Airport,
  style?: StyleProp<ViewStyle>,
}

function TimingSection({ kind, title, time, airport, style, ...props }: TimingSectionProps) {
  const styles = useStyleSheet(getStyles)
  const { fonts } = useTheme()

  const airportName = kind === "large" ? airport.longName : airport.shortName

  return (
    <View style={style} {...props}>
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.time}>{`${formatTime(time)}`}</Text>
      <Text style={fonts.titleSmall}>{`${airportName}`}</Text>
      {kind === "small" && <Text>{airport.city}</Text>}
    </View>
  )
}

const getStyles = ({ fonts }: ThemeData) => StyleSheet.create({
  title: {
    ...fonts.titleMedium,
    fontWeight: 500,
    paddingBottom: 5,
  },
  time: {
    ...fonts.titleLarge,
    paddingBottom: 5,
  },
  flightDuration: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 12,
  },
})
