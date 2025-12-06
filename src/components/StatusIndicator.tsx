import { useStyleSheet } from "@/hooks/useStyleSheet"
import { ThemeData } from "@/theme"
import { ReactElement, ReactNode } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"

export type IndicatorProps = {
  title: string,
  subtitle: string,
  icon: ReactElement,
  userMessage: string,
  button?: ReactNode,
  style?: StyleProp<ViewStyle>,
}

export default function StatusIndicator({ title, subtitle, icon, userMessage, button, style }: IndicatorProps) {
  const styles = useStyleSheet(getStyles)

  return (
    <View style={[styles.container, style]}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.errorMsg}>{userMessage}</Text>
      <View style={styles.buttonPre}>{button}</View>
    </View>
  )
}

const getStyles = ({ fonts }: ThemeData) => StyleSheet.create({
  container: {
    padding: 28,
    alignItems: "center",
  },
  title: {
    ...fonts.headlineMedium,
    fontWeight: 500,
    paddingTop: 8,
  },
  subtitle: {
    ...fonts.titleSmall,
    paddingTop: 8,
  },
  errorMsg: {
    ...fonts.titleMedium,
    paddingTop: 4,
  },
  buttonPre: {
    paddingTop: 12,
  },
})
