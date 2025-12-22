import { useStyleSheet } from "@/hooks/useStyleSheet"
import { BORDER_RADIUS_NORMAL, BORDER_RADIUS_ROUNDED_BUTTON, ThemeData } from "@/theme"
import { ReactNode} from "react"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, Text } from "react-native"

// Use the same props as a TouchableOpacity, making children not undefined
export type TextButtonProps = TouchableOpacityProps & {
  kind?: ButtonKind,
  shape?: ButtonShape,
  pre?: ReactNode,
  children: ReactNode,
}

export type ButtonKind = "filled" | "outlined"
export type ButtonShape = "circular" | "rectangular"

/** Styled, accessible button containing text */
export default function TextButton({
  kind = "filled",
  shape = "rectangular",
  style,
  pre,
  children,
  ...props
}: TextButtonProps) {
  const styles = useStyleSheet(
    (theme) => getStyles(theme, kind, shape),
    [kind, shape, style],
  )

  const textContent = <Text style={[styles.textContent]}>{children}</Text>
  const opacity = props.disabled ? 0.65 : 1.0
  
  return (
    <TouchableOpacity style={[styles.container, style, { opacity }]} activeOpacity={0.5} {...props}>
      {pre}
      {textContent}
    </TouchableOpacity>
  )
}

const getStyles = ({ colors, fonts }: ThemeData, kind: ButtonKind, shape: ButtonShape) => {
  // override certain colors when the button is outlined, so that its styling
  // acts more like text than an actual button
  const [backgroundColor, textColor, borderColor, borderWidth] = kind == "filled"
    ? [colors.button, colors.buttonText, undefined, 0]
    : [colors.buttonOutlined, colors.text, colors.border, 1]
  
  return StyleSheet.create({
    container: {
      alignSelf: "baseline", // only take needed width essentially
      backgroundColor,
      padding: 11,
      paddingHorizontal: 22,
      borderRadius: shape == "circular" ? BORDER_RADIUS_ROUNDED_BUTTON : BORDER_RADIUS_NORMAL,
      // for outlined buttons
      borderColor,
      borderWidth,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 4,
    },
    textContent: {
      ...fonts.labelLarge,
      color: textColor,
      textAlign: "center",
    },
  })
}
