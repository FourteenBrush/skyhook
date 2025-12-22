import { ColorValue, TextStyle } from "react-native"

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
  primary: ColorValue,
  primaryShaded: ColorValue,
  secondary: ColorValue,
  /** App background */
  background: ColorValue,
  card: ColorValue,
  cardAlternative: ColorValue,
  text: ColorValue,
  /** Slightly less visible text color */
  textSecondary: ColorValue,
  button: ColorValue,
  buttonOutlined: ColorValue,
  buttonText: ColorValue,
  warningRed: ColorValue,
  border: ColorValue,
  badge: ColorValue,
  horizontalLine: ColorValue,
  errorRed: ColorValue,
  headerIcon: ColorValue,
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
  fonts,
  isDark: false,
  colors: {
    primary: "#2563EB",         // blue
    primaryShaded: "#E6EEFA",   // lighter blue
    secondary: "#4B5563",       // somewhat dark gray
    background: "#F9FAFB",      // white
    card: "#FFF",               // very slight blue
    cardAlternative: "#F3F5F7", // light gray
    text: "#020202",            // black
    textSecondary: "#929299",   // light gray
    button: "#18181B",          // black
    buttonOutlined: "#FFF",     // white
    buttonText: "#FFF",         // white
    warningRed: "#ef4444",
    border: "#D4D0C9",          // light gray
    badge: "#959585",           // gray
    horizontalLine: "#E0E0E0",  // white-gray like
    errorRed: "red",
    headerIcon: "#2563EB",      // blue
  },
}

export const darkTheme: ThemeData = {
  fonts,
  isDark: true,
  colors: {
    ...lightTheme.colors,
    primary: "#3C83F6",
    primaryShaded: "#111E38",
    background: "#080C16",
    card: "#0C1322",
    cardAlternative: "#1D283A",
    text: "#F9FAFB",
    textSecondary: "#8391A6",
    button: "#2563EB",
    buttonOutlined: "#1D283A",
    buttonText: "#FCFDFF",
    border: "#1D283A",
    badge: "#1D283A",
    horizontalLine: "#1D283A",
    errorRed: "#C12D2F",
    headerIcon: "#3C83F6",
  },
}
