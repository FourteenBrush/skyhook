import { useStyleSheet } from "@/hooks/useStyleSheet"
import { BORDER_RADIUS_ROUNDED_BUTTON, ThemeData } from "@/theme"
import { StyleSheet, Text } from "react-native"

export default function DirectFlightBadge() {
  const styles = useStyleSheet(getStyles)

  return (
    <Text style={styles.container}>Direct</Text>
  )
}

const getStyles = ({ fonts, colors }: ThemeData) => StyleSheet.create({
  container: {
    ...fonts.bodySmall,
    backgroundColor: colors.button,
    color: colors.buttonText,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: BORDER_RADIUS_ROUNDED_BUTTON,
  },
})
