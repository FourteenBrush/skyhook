import { lightTheme, ThemeData } from "@/theme"
import { createContext, useContext } from "react"

export const ThemeContext = createContext<ThemeData>(lightTheme)

export const useTheme = () => {
  const theme = useContext(ThemeContext)
  
  if (theme == null) {
    throw new Error("ThemeContext provider not found in the widget tree")
  }
  return theme
}