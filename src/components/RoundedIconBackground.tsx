import { PropsWithChildren } from "react"
import { ColorValue, StyleSheet, View } from "react-native"

export type RoundedIconBackgroundProps = PropsWithChildren & {
  color: ColorValue,
  size: number,
}

export default function RoundedIconBackground({ color, size, children }: RoundedIconBackgroundProps) {
  return (
    <View style={[styles.container, { backgroundColor: color, width: size, height: size }]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  }
})
