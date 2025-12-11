import { TextStyle } from "react-native"

export const BORDER_RADIUS_NORMAL = 4
export const BORDER_RADIUS_ROUNDED_BUTTON = 24

export const CONTAINER_MARGIN = 18
export const MEDIA_QUERY_MEDIUM_BREAK = 768

export const CARD_PADDING = 10


export type ThemeData = {
  fonts: TextTheme,
  colors: ColorScheme,
  isDark: boolean,
}

// FIXME: encorporate default text colors
export type TextTheme = {
  displayLarge: TextStyle,
  displayMedium: TextStyle,
  displaySmall: TextStyle,
  headlineLarge: TextStyle,
  headlineMedium: TextStyle,
  headlineSmall: TextStyle,
  titleLarge: TextStyle,
  titleMedium: TextStyle,
  titleSmall: TextStyle,
  labelLarge: TextStyle,
  labelMedium: TextStyle,
  labelSmall: TextStyle,
  bodyLarge: TextStyle,
  bodyMedium: TextStyle,
  bodySmall: TextStyle,
}

export type ColorScheme = {
  primary: string,
  primaryShaded: string,
  secondary: string,
  /** App background */
  background: string,
  card: string,
  text: string,
  /** Slightly less visible text color */
  textSecondary: string,
  button: string,
  buttonText: string,
  border: string,
}

const colors: ColorScheme = {
  primary: "#2563EB",       // blue
  primaryShaded: "#E6EEFA", // lighter blue
  secondary: "#4B5563",     // somewhat dark gray
  background: "#FFF",       // white
  card: "#F2F8FF",          // very slight blue
  text: "#020202",          // black
  textSecondary: "#929299", // light gray
  button: "#18181B",        // black
  buttonText: "#FFF",       // white
  border: "#D4D0C9",        // light gray
}

// Material design principles
const fonts: TextTheme = {
  displayLarge: {
    fontSize: 57,
    fontWeight: "400", // Regular
    lineHeight: 64,
    letterSpacing: 0,
  },
  displayMedium: {
    fontSize: 45,
    fontWeight: "400",
    lineHeight: 52,
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: 36,
    fontWeight: "400",
    lineHeight: 44,
    letterSpacing: 0,
  },
  headlineLarge: {
    fontSize: 32,
    fontWeight: "400",
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 28,
    fontWeight: "400",
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 24,
    fontWeight: "400",
    lineHeight: 32,
    letterSpacing: 0,
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: "500", // Medium
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: 0.4,
  },
}

export const lightTheme: ThemeData = {
  fonts, colors, isDark: false,
}

// FIXME: implement dark mode
export const darkTheme: ThemeData = {
  ...lightTheme,
  isDark: true,
}
