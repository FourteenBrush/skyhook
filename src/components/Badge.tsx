import { useStyleSheet } from "@/hooks/useStyleSheet"
import { BORDER_RADIUS_ROUNDED_BUTTON, ThemeData } from "@/theme"
import { StyleSheet, Text, TextProps } from "react-native"

export type BadgeProps = TextProps & {
  kind: "dark" | "light" | "outlined",
}

export default function Badge({ kind = "light", style, ...props }: BadgeProps) {
  const styles = useStyleSheet(theme => getStyles(theme, kind))

  return (
    <Text style={[styles.container, style]} {...props} />
  )
}

const getStyles = ({ fonts, colors }: ThemeData, kind: "dark" | "light" | "outlined") => StyleSheet.create({
  container: {
    ...fonts.bodySmall,
    color: kind === "outlined" ? colors.text : colors.buttonText,
    backgroundColor: kind === "outlined" ? undefined : (kind === "dark" ? colors.button : "#959595"),
    borderRadius: BORDER_RADIUS_ROUNDED_BUTTON,
    borderColor: kind === "outlined" ? colors.border : undefined,
    borderWidth: kind === "outlined" ? 1 : undefined,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
})
