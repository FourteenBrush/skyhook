import { darkTheme, lightTheme, TextTheme, ThemeData } from "@/theme"
import { createContext, PropsWithChildren, useContext, useMemo } from "react"
import { useColorScheme } from "react-native"
import { useAuth } from "@/hooks/useAuth"

export const ThemeContext = createContext<ThemeData>(lightTheme)

/** Provides a theme based on the os settings, depends on the auth provider */
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { userPreferences } = useAuth()
  const preferredColorScheme = useColorScheme()

  const scheme = function() {
    switch (userPreferences.appearance) {
      case "system": return preferredColorScheme === "dark" ? darkTheme : lightTheme
      case "light": return lightTheme
      case "dark": return darkTheme
    }
  }()

  // merge fonts with a default text color, so fonts.* definitions are already styled appropriately
  scheme.fonts = useMemo<TextTheme>(() => {
    const base = { ...scheme.fonts }
    const defaultColor = scheme.colors.text

    Object.entries(base).forEach(([name, fontConfig]) => {
      base[name as keyof typeof base] = { ...fontConfig, color: defaultColor }
    })
    return base
  }, [scheme.colors])
  
  return (
    <ThemeContext.Provider value={scheme}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const theme = useContext(ThemeContext)
  
  if (theme == null) {
    throw new Error("ThemeContext provider not found in the widget tree")
  }
  return theme
}
