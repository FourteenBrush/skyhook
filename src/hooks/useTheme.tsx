import { darkTheme, lightTheme, ThemeData } from "@/theme"
import { createContext, PropsWithChildren, useContext } from "react"
import { useColorScheme } from "react-native"

export const ThemeContext = createContext<ThemeData>(lightTheme)

/** Provides a theme based on the os settings */
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  // FIXME: settings override
  const preferredColorScheme = useColorScheme()
  // TODO:
  // const scheme = preferredColorScheme == "dark" ? darkTheme : lightTheme
  const scheme = lightTheme
  
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
