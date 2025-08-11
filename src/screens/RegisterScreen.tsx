import { NavParams } from "@/App"
import { TextInputField } from "@/components/FormInputs"
import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { BORDER_RADIUS_NORMAL, CONTAINER_MARGIN, ThemeData } from "@/theme"
import { Link } from "@react-navigation/native"
import { Platform, StyleSheet, Text, View } from "react-native"

// NOTE: mostly copied from LoginScreen

export default function RegisterScreen() {
  const styles = useStyleSheet(getStyles)
  
  const register = () => {
    // TODO: some api stuff here
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.registerForm}>
        <Text style={styles.registerTitle}>Create account</Text>
        <Text style={styles.subtitle}>Join Skyhook and start booking your flights today</Text>
        
        <TextInputField
          label="Full name"
          placeholder="John Doe"
          accessibilityHint="full name input field"
        />
        <TextInputField
          label="Email"
          placeholder="you@example.com"
          accessibilityHint="email input field"
        />
        {/* FIXME: make password placeholders show dots (same for login screen) */}
        <TextInputField
          secureTextEntry
          label="Password"
          placeholder="password"
          accessibilityHint="password input field"
        />
        <TextInputField
          secureTextEntry
          label="Confirm password"
          placeholder="password"
          accessibilityHint="confirm password input field"
        />
        
        <TextButton style={styles.signInButton} accessibilityHint="sign in button">
          Create account
        </TextButton>
        
        <Text style={styles.signinTitle}>
          Already have an account?{" "}
          <Link<NavParams> style={styles.signinLink} onPress={register} screen="login">Sign in</Link>
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
  registerForm: {
    minWidth: 380,
    margin: CONTAINER_MARGIN * 2,
    padding: 18,
    borderRadius: BORDER_RADIUS_NORMAL * 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  registerTitle: {
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
  signinTitle: {
    textAlign: "center",
    marginTop: 10,
  },
  signinLink: {
    textDecorationLine: "underline",
  },
})