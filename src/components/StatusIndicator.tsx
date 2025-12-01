import { useStyleSheet } from "@/hooks/useStyleSheet"
import { ThemeData } from "@/theme"
import { ReactElement } from "react"
import { StyleSheet, Text, View } from "react-native"

export type IndicatorProps = {
  title: string,
  subtitle: string,
  icon: ReactElement,
  userMessage: string,
}

export default function StatusIndicator({ title, subtitle, icon, userMessage }: IndicatorProps) {
  const styles = useStyleSheet(getStyles)

  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.errorMsg}>{userMessage}</Text>
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
})
