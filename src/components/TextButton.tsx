import { useStyleSheet } from "@/hooks/useStyleSheet"
import { BORDER_RADIUS_NORMAL, BORDER_RADIUS_ROUNDED_BUTTON, ThemeData } from "@/theme"
import { ReactNode} from "react"
import { StyleProp, TextStyle } from "react-native"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, Text } from "react-native"

// Use the same props as a TouchableOpacity, making children not undefined
export type TextButtonProps = TouchableOpacityProps & {
  kind?: ButtonKind,
  shape?: ButtonShape,
  textStyle?: StyleProp<TextStyle>,
  children: ReactNode,
}

export type ButtonKind = "filled" | "outlined"
export type ButtonShape = "circular" | "rectangular"

/** Styled, accessible button containing text */
export default function TextButton({
  kind = "filled",
  shape = "rectangular",
  style,
  textStyle,
  children,
  ...props
}: TextButtonProps) {
  const styles = useStyleSheet(
    (theme) => getStyles(theme, kind, shape),
    [kind, shape, style, textStyle],
  )
  
  return (
    <TouchableOpacity style={[styles.container, style]} activeOpacity={0.5} {...props}>
      <Text style={[styles.textContent, textStyle]}>{children}</Text>
    </TouchableOpacity>
  )
}

const getStyles = ({ colors, fonts }: ThemeData, kind: ButtonKind, shape: ButtonShape) => {
  // override certain colors when the button is outlined, so that its styling
  // acts more like text than an actual button
  const [backgroundColor, textColor, borderColor] = kind == "filled"
    ? [colors.button, colors.buttonText, undefined]
    : [undefined, colors.text, colors.border]
  
  return StyleSheet.create({
    container: {
      alignSelf: "flex-start", // only take needed space
      backgroundColor,
      padding: 11,
      paddingHorizontal: 22,
      borderRadius: shape == "circular" ? BORDER_RADIUS_ROUNDED_BUTTON : BORDER_RADIUS_NORMAL,
      // for outlined buttons
      borderColor,
      borderWidth: 1,
    },
    textContent: {
      ...fonts.labelLarge,
      color: textColor,
      textAlign: "center",
    },
  })
}