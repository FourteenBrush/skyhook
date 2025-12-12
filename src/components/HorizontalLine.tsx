import { useTheme } from "@/hooks/useTheme"
import { View } from "react-native"

export default function HorizontalLine({ thickness = 1, marginVertical = 10 }) {
  const { colors } = useTheme()

  return (
    <View
      style={{
        width: "100%",
        alignSelf: "center",
        backgroundColor: colors.horizontalLine,
        height: thickness,
        marginVertical,
      }}
    />
  )
}
