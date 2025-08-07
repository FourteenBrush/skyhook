import { DateInputField, Dropdown, TextInputField } from "@/components/FormInputs"
import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { ThemeData } from "@/theme"
import { PickerItemProps } from "@react-native-picker/picker"
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons"
import { useState } from "react"
import { Text, StyleSheet, View } from "react-native"

const MEDIA_QUERY_MEDIUM_BREAK = 768

export default function SearchFlightPage() {
  const [roundTrip, setIsRoundTrip] = useState(true)
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined)
  const [passengerCount, setPassengerCount] = useState<number | undefined>(undefined)
  
  const styles = useStyleSheet(getStyles, [roundTrip])
  const { fonts } = useTheme()
  
  const passengerChoices: PickerItemProps<number>[] = [1, 2, 3, 4].map((nr) => {
    const label = `${nr} Passenger` + (nr > 1 ? "s" : "")
    return { label, value: nr }
  })
  
  return (
    <View style={styles.container}>
      {/* form wrapper, for the sake of making the submit bottom stick to the bottom */}
      <View>
        <Text style={fonts.headlineLarge}>Search Flights</Text>
        
        <View style={styles.roundTripButtonsWrapper}>
          <TextButton
            kind={roundTrip ? "filled" : "outlined"}
            onPress={() => setIsRoundTrip(true)}
            style={styles.roundTripButton}
            accessibilityLabel="round trip flight selector"
          >
            Round Trip
          </TextButton>
          <TextButton
            kind={roundTrip ? "outlined" : "filled"}
            onPress={() => setIsRoundTrip(false)}
            style={styles.roundTripButton}
            accessibilityLabel="one way flight selector"
          >
            One Way
          </TextButton>
        </View>
        
        {/* FIXME: add validation */}
        <TextInputField label="From" placeholder="Departure City" accessibilityHint="departure city input field" />
        {/* FIXME: as state is stored internally, showing this field again after it was hidden, does not restore its stored date */}
        <TextInputField label="To" placeholder="Destination City" accessibilityHint="destination city input field" />
        
        <DateInputField
          label="Departure Date"
          placeholder="Select date"
          accessibilityHint="select trip departure date"
          placeholderLeading={<MaterialDesignIcons name="calendar-blank" size={25} />}
        />
        {roundTrip && (
          <DateInputField
            label="Return date"
            placeholder="Select date"
            accessibilityHint="select trip return date"
            placeholderLeading={<MaterialDesignIcons name="calendar-blank" size={25} />}
          />
        )}
        
        <Dropdown
          mode="dropdown"
          label="Passengers"
          items={passengerChoices}
          onValueChange={setPassengerCount}
          accessibilityHint="select number of passengers"
        />
        
        <Dropdown
          mode="dropdown"
          label="Class"
          items={[ { label: "Economy" }, { label: "Business" } ]}
          accessibilityHint="seat class"
        />
      </View>
      
      <TextButton style={styles.searchFlightsButton} accessibilityHint="search flights">Search Flights</TextButton>
    </View>
  )
}

const getStyles = ({ colors }: ThemeData) => {
  return StyleSheet.create({
    container: {
      // reasonable size for form width
      maxWidth: MEDIA_QUERY_MEDIUM_BREAK,
      maxHeight: 900,
      flex: 1,
      flexDirection: "column",
      // make submit button stick to the bottom
      justifyContent: "space-between",
      margin: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
    },
    roundTripButtonsWrapper: {
      marginTop: 18,
      marginBottom: 10,
      justifyContent: "space-between",
      flexDirection: "row",
      gap: 16,
    },
    roundTripButton: {
      flex: 1,
    },
    searchFlightsButton: {
      alignSelf: "stretch",
    },
  })
}