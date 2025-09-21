import { ThemeData } from "@/theme"
import { DependencyList, useMemo } from "react"
import { StyleSheet } from "react-native"
import { useTheme } from "@/hooks/useTheme"

// because, ..well, ..namespaces
export type NamedStyles<T> = StyleSheet.NamedStyles<T>

/**
* Composes a {@link StyleSheet} with dynamic theming data.
* @param getStyles a function that computes the stylesheet, this functions re-runs
*                  every time the theming data changes (see {@link useTheme}).
* @returns a memoized stylesheet
* @example
* const styles = useStyleSheet(getStyles)
*
* const getStyles = (theme: ThemeData) => StyleSheet.create({
*   container: { padding: 12 },
* })
*
* return (
*   <View style={styles.container}>Hello World</View>
* )
*/
export const useStyleSheet = <T extends NamedStyles<T> | NamedStyles<any>>(
  getStyles: (theme: ThemeData) => T,
  deps: DependencyList = [],
) => {
  const theme = useTheme()
  return useMemo(() => getStyles(theme), [theme, ...deps])
}