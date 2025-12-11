import Card from "@/components/Card"
import RoundedIconBackground from "@/components/RoundedIconBackground"
import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { CONTAINER_MARGIN, ThemeData } from "@/theme"
import { FontAwesome, Octicons } from "@expo/vector-icons"
import { useState } from "react"
import { StyleSheet, Switch, Text, View } from "react-native"

export default function SettingsTab() {
  const styles = useStyleSheet(getStyles)
  const { colors, fonts } = useTheme()
  const [bool, setBool] = useState(false)

  // TODO: default booking name, currency icon, theme, direct or indirect flight default

  return (
    <View style={styles.container}>
      {/* account card */}
      <Card clickable={false} style={styles.accountCard}>
        <View style={styles.accountCardUser}>
          <RoundedIconBackground color={colors.primaryShaded} size={54}>
            <Octicons name="person" size={25} color={colors.primary} />
          </RoundedIconBackground>

          <View>
            <Text style={fonts.titleMedium}>Username</Text>
            <Text>username@example.com</Text>
          </View>
        </View>

        <TextButton kind="outlined">
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="sign-out" size={18} style={{ opacity: 0.60, marginRight: 10 }} />
            <Text>Sign Out</Text>
          </View>
        </TextButton>
      </Card>
      <Switch
        value={bool}
        onValueChange={setBool}
        trackColor={{ false: '#767577', true: '#3B82F6' }} // blue
        thumbColor={bool ? '#fff' : '#f4f3f4'}
      />
    </View>
  )
}

const getStyles = ({ colors, fonts }: ThemeData) => StyleSheet.create({
  container: {
    margin: CONTAINER_MARGIN,
  },
  accountCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountCardUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
})
