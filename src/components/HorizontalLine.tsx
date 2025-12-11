import { View } from "react-native"

export default function HorizontalLine({ color = "#E0E0E0", thickness = 1, marginVertical = 10 }) {
  return (
    <View
      style={{
        width: "100%",
        alignSelf: "center",
        backgroundColor: color,
        height: thickness,
        marginVertical,
      }}
    />
  )
}
