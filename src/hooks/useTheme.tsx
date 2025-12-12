import { darkTheme, lightTheme, ThemeData } from "@/theme"
import { createContext, PropsWithChildren, useContext } from "react"
import { useColorScheme } from "react-native"
import { useAuth } from "@/hooks/useAuth"

export const ThemeContext = createContext<ThemeData>(lightTheme)

/** Provides a theme based on the os settings, depends on the auth provider */
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { userSettings } = useAuth()
  const preferredColorScheme = useColorScheme()

  const scheme = function() {
    switch (userSettings.appearance) {
      case "system": return preferredColorScheme === "dark" ? darkTheme : lightTheme
      case "light": return lightTheme
      case "dark": return darkTheme
    }
  }()
  
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
