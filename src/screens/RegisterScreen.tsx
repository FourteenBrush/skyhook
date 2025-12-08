import { ApiClient } from "@/api"
import { NavParams } from "@/App"
import { ErrorLabel, TextInputField } from "@/components/FormInputs"
import TextButton from "@/components/TextButton"
import { useForm } from "@/hooks/useForm"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { BORDER_RADIUS_NORMAL, CONTAINER_MARGIN, ThemeData } from "@/theme"
import { Link } from "@react-navigation/native"
import { useMutation } from "@tanstack/react-query"
import { Platform, StyleSheet, Text, View } from "react-native"
import z from "zod"

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Expected a valid email address"),
  password: z.string().min(3, "A valid password consists of at least 3 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  error: "The two passwords do not match",
  path: ["confirmPassword"],
  when: () => true,
})

export default function RegisterScreen() {
  const {
    formState,
    errors,
    updateField,
    validateAndSubmit,
  } = useForm(registerSchema, { fullName: "", email: "", password: "", confirmPassword: "" })
  
  const { mutate: register, error } = useMutation({
    mutationFn: () => ApiClient.register(formState),
    onError: (error) => console.error("sign up failed: " + error),
  })

  const styles = useStyleSheet(getStyles)
  
  return (
    <View style={styles.container}>
      <View style={styles.registerForm}>
        <Text style={styles.registerTitle}>Create account</Text>
        <Text style={styles.subtitle}>Join Skyhook and start booking your flights today</Text>
        
        <TextInputField
          value={formState.fullName}
          onChangeText={updateField.bind(null, "fullName")}
          error={errors.fullName}
          label="Full name"
          placeholder="John Doe"
          accessibilityHint="full name input field"
        />
        <TextInputField
          value={formState.email}
          onChangeText={updateField.bind(null, "email")}
          error={errors.email}
          label="Email"
          placeholder="you@example.com"
          accessibilityHint="email input field"
        />
        {/* FIXME: make password placeholders show dots (same for login screen) */}
        <TextInputField
          value={formState.password}
          onChangeText={updateField.bind(null, "password")}
          error={errors.password}
          secureTextEntry
          label="Password"
          placeholder="password"
          accessibilityHint="password input field"
        />
        <TextInputField
          value={formState.confirmPassword}
          onChangeText={updateField.bind(null, "confirmPassword")}
          error={errors.confirmPassword}
          secureTextEntry
          label="Confirm password"
          placeholder="password"
          accessibilityHint="confirm password input field"
        />
        
        <TextButton
          style={styles.signInButton}
          accessibilityHint="sign in button"
          onPress={validateAndSubmit.bind(null, () => register())}>
          Create account
        </TextButton>

        {/* FIXME: show more detailed error message, user already exists, etc.. */}
        {error != null && <ErrorLabel error="Something went wrong while creating an account" />}
        
        <Text style={styles.signinTitle}>
          Already have an account?{" "}
          <Link<NavParams>
            style={styles.signinLink}
            screen="login">
            Sign in
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
