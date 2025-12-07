import { useStyleSheet } from "@/hooks/useStyleSheet"
import { Airport, Flight } from "@/models/Flight"
import { ThemeData } from "@/theme"
import { formatDurationToReadable, formatTime } from "@/utils/utils"
import { Feather } from "@expo/vector-icons"
import { StyleProp, StyleSheet, Text, View, ViewProps, ViewStyle } from "react-native"

export default function FlightTiming({ flight }: { flight: Flight }) {
  const styles = useStyleSheet(getStyles)

  return (
    <>
      <TimingSection
        style={{ alignSelf: "flex-start" }}
        title="Departure"
        time={flight.departureTime}
        airport={flight.departureAirport}
        accessibilityHint="departure timing info"
      />
      <View style={styles.flightDuration}>
        <Feather name="clock" size={13} />
        <Text accessibilityHint="total flight duration">{formatDurationToReadable(flight.totalDuration)}</Text>
      </View>
      <TimingSection
        style={{ alignSelf: "flex-end", paddingTop: 12 }}
        title="Arrival"
        time={flight.arrivalTime}
        airport={flight.arrivalAirport}
        accessibilityHint="arrival timing info"
      />
    </>
  )
}

type TimingSectionProps = ViewProps & {
  title: string,
  time: Date,
  airport: Airport,
  style?: StyleProp<ViewStyle>,
}

function TimingSection({ title, time, airport, style, ...props }: TimingSectionProps) {
  const styles = useStyleSheet(getStyles)

  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()

  return (
    <View style={style} {...props}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.time}>{`${formatTime(time)} ${timeZone}`}</Text>
      <Text>{`${airport.longName} (${airport.shortName})`}</Text>
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
    paddingVertical: 22,
  },
})
