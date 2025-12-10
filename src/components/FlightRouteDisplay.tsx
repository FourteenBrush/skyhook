import { useStyleSheet } from "@/hooks/useStyleSheet"
import { ThemeData } from "@/theme"
import { FontAwesome } from "@expo/vector-icons"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"

export type FlightRouteDisplayProps = {
  departure: string,
  arrival: string,
  size: "small" | "large"
  style?: StyleProp<ViewStyle>,
}

export default function FlightRouteDisplay({ departure, arrival: destination, size, style }: FlightRouteDisplayProps) {
  const styles = useStyleSheet(theme => getStyles(theme, size))

  return (
    <View style={[styles.container, style]} accessibilityHint="flight route departure and arrival">
      <Text style={styles.text}>{departure}</Text>
      <FontAwesome name="long-arrow-right" size={size ===  "large" ? 18 : 15} />
      <Text style={styles.text}>{destination}</Text>
    </View>
  )
}

const getStyles = ({ fonts }: ThemeData, size: "small" | "large") => StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  text: {
    ...(size === "small" ? fonts.titleLarge : fonts.headlineSmall),
    fontWeight: 500,
  },
})
