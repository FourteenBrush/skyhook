import Card from "@/components/Card"
import RoundedIconBackground from "@/components/RoundedIconBackground"
import TextButton from "@/components/TextButton"
import { CurrencyPreference, useAuth } from "@/hooks/useAuth"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { CONTAINER_MARGIN, ThemeData } from "@/theme"
import { Feather, FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons"
import { ReactNode } from "react"
import { StyleSheet, Switch, Text, View } from "react-native"

export default function SettingsTab() {
  const styles = useStyleSheet(getStyles)
  const { colors, fonts } = useTheme()
  const { signOut, userSettings } = useAuth()


  // TODO: default booking name, currency icon, theme, direct or indirect flight default
  console.warn("SettingsTab settings:", userSettings)

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

        <TextButton kind="outlined" onPress={signOut}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="sign-out" size={18} style={{ opacity: 0.60, marginRight: 10 }} />
            <Text>Sign Out</Text>
          </View>
        </TextButton>
      </Card>

      {/* FIXME: show error label when updateState failed */}
      <SettingsCard<CurrencyPreference>
        title="Currency"
        subtitle="Select your preferred currency for prices"
        leftOption={{ value: "dollar", text: "USD", icon: ({ color }) => <Feather name="dollar-sign" color={color} size={24} /> }}
        rightOption={{ value: "euro", text: "EUR", icon: ({ color }) => <MaterialIcons name="euro-symbol" color={color} size={24} /> }}
        selection={userSettings.preferredCurrency === "dollar" ? "left" : "right"}
        onChange={userSettings.updateState.bind(null, "preferredCurrency")}
      />
    </View>
  )
}

type SettingsCardProps<T> = {
  title: string,
  subtitle: string,
  leftOption: { value: T, icon: ({ color }: { color: string | undefined }) => ReactNode, text: string },
  rightOption: { value: T, icon: ({ color }: { color: string | undefined }) => ReactNode, text: string },
  selection: "left" | "right",
  onChange: (value: T) => void,
}

/**
 * @template T the type stored in every option
 */
const SettingsCard = <T,>({ title, subtitle, leftOption, rightOption, selection, onChange }: SettingsCardProps<T>) => {
  const styles = useStyleSheet(getStyles)
  const { fonts, colors } = useTheme()

  const [leftIconColor, rightIconColor] = selection === "left"
    ? [colors.primary, undefined]
    : [undefined, colors.primary]

  return (
    <Card clickable={false}>
      <Text style={styles.settingsTitle}>{title}</Text>
      <Text style={styles.settingsSubtitle}>{subtitle}</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.settingsOption}>
          <RoundedIconBackground color={colors.primaryShaded} size={38}>
            {leftOption.icon({ color: leftIconColor })}
          </RoundedIconBackground>
          <Text style={fonts.titleMedium}>{leftOption.text}</Text>
        </View>

        <Switch
          value={selection === "right"}
          onValueChange={(right) => onChange(right ? rightOption.value : leftOption.value)}
          trackColor={{ false: '#767577', true: '#3B82F6' }} // blue
          thumbColor={selection === "left" ? '#fff' : '#f4f3f4'}
        />

        <View style={styles.settingsOption}>
          <Text style={fonts.titleMedium}>{rightOption.text}</Text>
          <RoundedIconBackground color={colors.primaryShaded} size={38}>
            {rightOption.icon({ color: rightIconColor })}
          </RoundedIconBackground>
        </View>
      </View>
    </Card> 
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

  settingsTitle: {
    ...fonts.titleMedium,
    fontWeight: 600,
    marginBottom: 6,
  },
  settingsSubtitle: {
    ...fonts.titleSmall,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  settingsOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
})
