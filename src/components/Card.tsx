import { useStyleSheet } from "@/hooks/useStyleSheet"
import { BORDER_RADIUS_NORMAL, CARD_PADDING, ThemeData } from "@/theme"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from "react-native"

export type CardProps =
  | { clickable: true } & TouchableOpacityProps
  | { clickable: false } & ViewProps

export default function Card({ clickable, style, ...props }: CardProps) {
  const styles = useStyleSheet(getStyles)

  const s = [styles.container, style]
  return clickable
    ? <TouchableOpacity style={s} {...props as TouchableOpacityProps} />
    : <View style={s} {...props} />
}

const getStyles = ({ colors }: ThemeData) => StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS_NORMAL * 2,
    borderColor: colors.border,
    borderWidth: 1,
    padding: CARD_PADDING,
    marginVertical: 8,
  },
})
