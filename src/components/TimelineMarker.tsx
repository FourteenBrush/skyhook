import { StyleSheet, Text, View } from "react-native";

export function TimelineMarker({ color }: { color: string }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.dot, { backgroundColor: color }]} />

      <View style={styles.verticalLine} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#ccc",
    marginTop: 2,
  },
})
