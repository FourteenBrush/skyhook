import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { ThemeData } from "@/theme"
import { useState } from "react"
import { TextInput } from "react-native"
import { Text, StyleSheet, View } from "react-native"

export default function SearchFlightPage() {
  const [roundTrip, setIsRoundTrip] = useState(false)
  const styles = useStyleSheet(getStyles, [roundTrip])
  const { fonts } = useTheme()
  
  
  // TODO: impose max width on form, based off media query
  return (
    <View style={styles.container}>
      <Text style={fonts.headlineLarge}>Search Flights</Text>
      
      <View style={styles.roundTripButtonWrapper}>
        <TextButton
          kind={roundTrip ? "filled" : "outlined"}
          onPress={() => setIsRoundTrip(true)}
          style={{ flex: 1 }}>
            Round Trip
          </TextButton>
        <TextButton
          kind={roundTrip ? "outlined" : "filled"}
          onPress={() => setIsRoundTrip(false)}
          style={{ flex: 1 }}>
            One Way
          </TextButton>
      </View>
      
      <TextInput placeholder="Departure City" />
    </View>
  )
}

const getStyles = ({ colors }: ThemeData) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      margin: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
    },
    roundTripButtonWrapper: {
      marginTop: 18,
      justifyContent: "space-between",
      flexDirection: "row",
      gap: 16,
    },
    roundTripButton: {
      textAlign: "center",
      color: colors.buttonText,
    },
  })
}