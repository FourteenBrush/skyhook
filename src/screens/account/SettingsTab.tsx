import Card from "@/components/Card"
import RoundedIconBackground from "@/components/RoundedIconBackground"
import SegmentedControl from "@/components/SegmentedControl"
import TextButton from "@/components/TextButton"
import { Appearance, CurrencyPreference, useAuth } from "@/hooks/useAuth"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { CONTAINER_MARGIN, ThemeData } from "@/theme"
import { Feather, FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons"
import { PropsWithChildren, ReactNode } from "react"
import { StyleSheet, Switch, Text, View } from "react-native"

export default function SettingsTab() {
  const styles = useStyleSheet(getStyles)
  const { colors, fonts } = useTheme()
  const { signOut, userSettings, updateUserSetting } = useAuth()

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
            <Text style={styles.email}>username@example.com</Text>
          </View>
        </View>

        <TextButton
          kind="outlined"
          onPress={signOut} style={styles.signOutButton}
          pre=<FontAwesome name="sign-out" size={18} color={colors.text} style={{ opacity: 0.60, marginRight: 10 }} />
        >
          Sign Out
        </TextButton>
      </Card>

      {/* FIXME: show error label in the unlikely case updateUserSetting failed */}
      <SettingsCard
        title="Currency"
        subtitle="Select your preferred currency for prices"
      >
        <BooleanControl<CurrencyPreference>
          leftOption={{ value: "dollar", text: "USD", icon: ({ color }) => <Feather name="dollar-sign" color={color} size={24} /> }}
          rightOption={{ value: "euro", text: "EUR", icon: ({ color }) => <MaterialIcons name="euro-symbol" color={color} size={24} /> }}
          selected={userSettings.preferredCurrency === "dollar" ? "left" : "right"}
          onChange={updateUserSetting.bind(null, "preferredCurrency")}
        />
      </SettingsCard>

      <SettingsCard
        title="Appearance"
        subtitle="Choose your preferred color scheme"
      >
        <SegmentedControl<Appearance>
          options={[
            { label: "Light", value: "light", icon: ({ color }) => <Feather name="sun" size={20} color={color} /> },
            { label: "Dark", value: "dark", icon: ({ color }) => <Feather name="moon" size={20} color={color} /> },
            { label: "System", value: "system", icon: ({ color }) => <Feather name="monitor" size={20} color={color} /> }
          ]}
          selected={userSettings.appearance}
          onChange={updateUserSetting.bind(null, "appearance")}
        />
      </SettingsCard>

      {/*
      <SettingsCard
        title="Default Trip Type"
        subtitle="Pre-select trip type when searching flights"
        leftOption={{ value: "light", text: "Light", icon: ({ color }) => <Feather name="sun" color={color} size={24} /> }}
        rightOption=
      />
      */}
    </View>
  )
}

type SettingsCardProps = PropsWithChildren & {
  title: string,
  subtitle: string,
}

const SettingsCard = ({ title, subtitle, children }: SettingsCardProps) => {
  const styles = useStyleSheet(getStyles)

  return (
    <Card clickable={false} style={{ paddingBottom: 20 }}>
      <Text style={styles.settingsTitle}>{title}</Text>
      <Text style={styles.settingsSubtitle}>{subtitle}</Text>
      {children}
    </Card>
  )
}

type BooleanControlProps<T> = {
  leftOption: { value: T, icon: ({ color }: { color: string | undefined }) => ReactNode, text: string },
  rightOption: { value: T, icon: ({ color }: { color: string | undefined }) => ReactNode, text: string },
  selected: "left" | "right",
  onChange: (value: T) => void,
}

/**
 * @template T the type stored in every option
 */
const BooleanControl = <T,>({ leftOption, rightOption, selected, onChange }: BooleanControlProps<T>) => {
  const styles = useStyleSheet(getStyles)
  const { fonts, colors } = useTheme()

  const [leftIconColor, rightIconColor] = selected === "left"
    ? [colors.primary, colors.secondary]
    : [colors.secondary, colors.primary]

  return (
    <View style={styles.booleanControl}>
      <View style={styles.settingsOption}>
        <RoundedIconBackground color={colors.primaryShaded} size={38}>
          {leftOption.icon({ color: leftIconColor })}
        </RoundedIconBackground>
        <Text style={fonts.titleMedium}>{leftOption.text}</Text>
      </View>

      <Switch
        value={selected === "right"}
        onValueChange={(right) => onChange(right ? rightOption.value : leftOption.value)}
        trackColor={{ false: '#767577', true: '#3B82F6' }} // blue
        thumbColor={selected === "left" ? '#fff' : '#f4f3f4'}
      />

      <View style={styles.settingsOption}>
        <Text style={fonts.titleMedium}>{rightOption.text}</Text>
        <RoundedIconBackground color={colors.primaryShaded} size={38}>
          {rightOption.icon({ color: rightIconColor })}
        </RoundedIconBackground>
      </View>
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
  email: {
    ...fonts.titleSmall,
    color: colors.textSecondary,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  booleanControl: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  settingsTitle: {
    ...fonts.titleMedium,
    color: colors.text,
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
