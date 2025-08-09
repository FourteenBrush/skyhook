import { DateInputField, Dropdown, TextInputField } from "@/components/FormInputs"
import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { ThemeData } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { PickerItemProps } from "@react-native-picker/picker"
import { useState } from "react"
import { Text, StyleSheet, View } from "react-native"

const MEDIA_QUERY_MEDIUM_BREAK = 768

const SEAT_CLASSES = ["economy", "business"] as const
type SeatClass = (typeof SEAT_CLASSES)[number] // union of strings

const passengerChoices: PickerItemProps<number>[] = [1, 2, 3, 4].map((nr) => {
  const label = `${nr} Passenger` + (nr > 1 ? "s" : "")
  return { label, value: nr }
})

const seatClasses: PickerItemProps<SeatClass>[] = SEAT_CLASSES.map((fclass) => {
  const label = fclass.charAt(0).toUpperCase() + fclass.substring(1)
  return { label, value: fclass }
})

export default function SearchFlightPage() {
  const [isRoundTrip, setIsRoundTrip] = useState(true)
  const [departureCity, setDepartureCity] = useState<string | undefined>()
  const [arrivalCity, setArrivalCity] = useState<string | undefined>()
  const [departureDate, setDepartureDate] = useState<Date | undefined>()
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>()
  const [passengerCount, setPassengerCount] = useState(1) // keep in sync with `passengerChoices`
  const [flightClass, setFlightClass] = useState<SeatClass>("economy")
  
  const styles = useStyleSheet(getStyles, [isRoundTrip])
  const { fonts } = useTheme()
  
  const submitForm = () => {
    console.log(isRoundTrip, departureCity, arrivalCity, departureDate, arrivalDate, passengerCount, flightClass)
  }
  
  return (
    <View style={styles.container}>
      {/* form wrapper, for the sake of making the submit bottom stick to the bottom */}
      <View>
        <Text style={fonts.headlineLarge}>Search Flights</Text>
        
        <View style={styles.roundTripButtonsWrapper}>
          <TextButton
            kind={isRoundTrip ? "filled" : "outlined"}
            onPress={() => setIsRoundTrip(true)}
            style={styles.roundTripButton}
            accessibilityLabel="round trip flight selector"
          >
            Round Trip
          </TextButton>
          <TextButton
            kind={isRoundTrip ? "outlined" : "filled"}
            onPress={() => setIsRoundTrip(false)}
            style={styles.roundTripButton}
            accessibilityLabel="one way flight selector"
          >
            One Way
          </TextButton>
        </View>
        
        {/* FIXME: add validation */}
        <TextInputField
          value={departureCity}
          onChangeText={setDepartureCity}
          label="From"
          placeholder="Departure City"
          accessibilityHint="departure city input field"
        />
        <TextInputField
          value={arrivalCity}
          onChangeText={setArrivalCity}
          label="To"
          placeholder="Destination City"
          accessibilityHint="destination city input field"
        />
        
        <DateInputField
          label="Departure Date"
          placeholder="Select date"
          onChange={setDepartureDate}
          accessibilityHint="select trip departure date"
          placeholderLeading=<MaterialCommunityIcons name="calendar" size={25} />
        />
        {isRoundTrip && (
          <DateInputField
            label="Return date"
            placeholder="Select date"
            onChange={setArrivalDate}
            accessibilityHint="select trip return date"
            placeholderLeading=<MaterialCommunityIcons name="calendar-blank" size={25} />
          />
        )}
        
        <Dropdown
          items={passengerChoices}
          onValueChange={setPassengerCount}
          mode="dropdown"
          label="Passengers"
          accessibilityHint="select number of passengers"
        />
        
        <Dropdown
          items={seatClasses}
          selectedValue={flightClass}
          onValueChange={setFlightClass}
          mode="dropdown"
          label="Class"
          accessibilityHint="seat class"
        />
      </View>
      
      <TextButton onPress={submitForm} style={styles.searchFlightsButton} accessibilityHint="search flights">Search Flights</TextButton>
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