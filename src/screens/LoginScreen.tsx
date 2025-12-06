import { NavParams } from "@/App"
import { TextInputField } from "@/components/FormInputs"
import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { BORDER_RADIUS_NORMAL, CONTAINER_MARGIN, ThemeData } from "@/theme"
import { Link } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Platform, StyleSheet, Text, View } from "react-native"

export type LoginScreenProps = NativeStackScreenProps<NavParams, "login">

export default function LoginScreen({ route }: LoginScreenProps) {
  const styles = useStyleSheet(getStyles)
  
  const login = () => {
    // TODO: some api stuff here
    // TODO: use navigator routeNamesChangeBehavior instead
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.signInForm}>
        <Text style={styles.signInTitle}>Sign in</Text>
        <Text style={styles.subtitle}>Access your account to continue booking</Text>
        
        <TextInputField
          label="Email"
          placeholder="you@example.com"
          accessibilityHint="email input field"
        />
        <TextInputField
          secureTextEntry
          label="Password"
          placeholder="password"
          accessibilityHint="password input field"
        />
        
        <TextButton style={styles.signInButton} accessibilityHint="sign in button">
          Sign in
        </TextButton>
        
        <Text style={styles.signupTitle}>
          Don't have an account?{" "}
          <Link<NavParams> style={styles.signupLink} onPress={login} screen="register">Create one</Link>
        </Text>
      </View>
    </View>
  )
}

const getStyles = ({ colors, fonts }: ThemeData) => StyleSheet.create({
  container: {
    flex: 1,
    // center login form vertically on web
    justifyContent: Platform.select({ web: "center", default: undefined }),
    alignItems: "center",
  },
  signInForm: {
    minWidth: 380,
    margin: CONTAINER_MARGIN * 2,
    padding: 18,
    borderRadius: BORDER_RADIUS_NORMAL * 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signInTitle: {
    ...fonts.headlineSmall,
    fontWeight: 700,
    marginBottom: 3,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: 20,
  },
  signInButton: {
    marginTop: 5,
    alignSelf: "stretch",
  },
  signupTitle: {
    textAlign: "center",
    marginTop: 10,
  },
  signupLink: {
    textDecorationLine: "underline",
  },
})
