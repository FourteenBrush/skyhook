import { ErrorLabel, TextInputField } from "@/components/FormInputs"
import TextButton from "@/components/TextButton"
import { useAuth } from "@/hooks/useAuth"
import { useForm } from "@/hooks/useForm"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { NavParams } from "@/Routes"
import { BORDER_RADIUS_NORMAL, CONTAINER_MARGIN, ThemeData } from "@/theme"
import { Link } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Platform, StyleSheet, Text, View } from "react-native"
import z from "zod"

const loginSchema = z.object({
  email: z.email("Expected a valid email address"),
  password: z.string().min(3, "At least 3 characters are required"),
})

export default function LoginScreen({ navigation }: NativeStackScreenProps<NavParams, "login">) {
  const {
    formState,
    errors,
    updateField,
    validateAndSubmit,
  } = useForm(loginSchema, { email: "", password: "" })

  const { signIn, isLoading, error, isSignedIn } = useAuth()
  console.log(isLoading, error, isSignedIn)

  const signInAndNavigate = () => {
    signIn(formState.email, formState.password)
    // NOTE: login happens async, automatic navigation occurs when auth state changed
  }

  const styles = useStyleSheet(getStyles)
  
  return (
    <View style={styles.container}>
      <View style={styles.signInForm}>
        <Text style={styles.signInTitle}>Sign in</Text>
        <Text style={styles.subtitle}>Access your account to continue booking</Text>
        
        <TextInputField
          value={formState.email}
          onChangeText={updateField.bind(null, "email")}
          error={errors.email}
          autoCapitalize="none"
          label="Email"
          placeholder="you@example.com"
          accessibilityHint="email input field"
        />
        <TextInputField
          value={formState.password}
          onChangeText={updateField.bind(null, "password")}
          error={errors.password}
          autoCapitalize="none"
          secureTextEntry
          label="Password"
          placeholder="password"
          accessibilityHint="password input field"
        />
        
        <TextButton
          style={styles.signInButton}
          accessibilityHint="sign in button"
          onPress={validateAndSubmit.bind(null, signInAndNavigate)}
          disabled={isLoading}
        >
          Sign in
        </TextButton>

        {error != null && <ErrorLabel error="Something went wrong while signing you in" />}
        

      {/* TODO: use navigator routeNamesChangeBehavior */}
        <Text style={styles.signupTitle}>
          Don't have an account?{" "}
          <Link<NavParams>
            style={styles.signupLink}
            onPress={() => navigation.navigate("register")} screen="register">
            Create one instead
          </Link>
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
