import { useStyleSheet } from "@/hooks/useStyleSheet"
import { BORDER_RADIUS_ROUNDED_BUTTON, ThemeData } from "@/theme"
import { StyleSheet, Text } from "react-native"

export default function NumberOfStopsBadge({ stops }: { stops: number }) {
  const styles = useStyleSheet(theme => getStyles(theme, stops))

  return (
    <Text accessibilityLabel="direct flight" style={styles.container}>{
      stops === 0 ? "Direct" : `${stops} ${stops === 1 ? "stop" : "stops"}`
    }</Text>
  )
}

const getStyles = ({ fonts, colors }: ThemeData, stops: number) => StyleSheet.create({
  container: {
    ...fonts.bodySmall,
    backgroundColor: stops === 0 ? colors.button : "#959595",
    color: colors.buttonText,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BORDER_RADIUS_ROUNDED_BUTTON,
  },
})
