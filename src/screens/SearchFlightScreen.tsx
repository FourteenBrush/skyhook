import { DateInputField, Dropdown, TextInputField } from "@/components/FormInputs"
import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { CONTAINER_MARGIN, MEDIA_QUERY_MEDIUM_BREAK, ThemeData } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { PickerItemProps } from "@react-native-picker/picker"
import { useState } from "react"
import { Text, StyleSheet, View } from "react-native"
import { preconnect } from "react-dom"
import { FlightQuery, SEAT_CLASSES, SeatClass } from "@/models/FlightQuery"
import { NavParams } from "@/App"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

const passengerChoices: PickerItemProps<number>[] = [1, 2, 3, 4].map((nr) => {
  const label = `${nr} Passenger` + (nr > 1 ? "s" : "")
  return { label, value: nr }
})

const seatClasses: PickerItemProps<SeatClass>[] = SEAT_CLASSES.map((sclass) => {
  const label = sclass.charAt(0).toUpperCase() + sclass.substring(1)
  return { label, value: sclass }
})

export type SearchFlightScreenProps = NativeStackScreenProps<NavParams, "searchFlight">

export default function SearchFlightPage({ navigation }: SearchFlightScreenProps) {
  const [isRoundTrip, setIsRoundTrip] = useState(true)
  const [departureCity, setDepartureCity] = useState<string | undefined>()
  const [destinationCity, setDestinationCity] = useState<string | undefined>()
  const [departureDate, setDepartureDate] = useState<Date | undefined>()
  // undefined for one way flights
  const [returnDate, setArrivalDate] = useState<Date | undefined>()
  // const [passengerCount, setPassengerCount] = useState(1) // keep in sync with `passengerChoices`
  const [seatClass, setFlightClass] = useState<SeatClass>("economy")
  
  const styles = useStyleSheet(getStyles, [isRoundTrip])
  const { fonts } = useTheme()
  
  const submitForm = () => {
    const query: FlightQuery = {
      departureCity: departureCity!.toLowerCase(),
      destinationCity: destinationCity!.toLowerCase(),
      departureDateIsoStr: departureDate!.toISOString(),
      // NOTE: returnDate might still hold a value when isRoundTrip is false (to restore ui on button press)
      returnDateIsoStr: isRoundTrip ? returnDate!.toISOString() : undefined,
      // passengerCount,
      seatClass,
    }
    
    // hint browser to start connection handshake already
    preconnect(process.env.EXPO_PUBLIC_API_URL)
    navigation.navigate("flightList", query)
  }
  
  const today = new Date()
  
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
          value={destinationCity}
          onChangeText={setDestinationCity}
          label="To"
          placeholder="Destination City"
          accessibilityHint="destination city input field"
        />
        
        <DateInputField
          label="Departure Date"
          placeholder="Select date"
          dialogTitle="Select departure date"
          onChange={setDepartureDate}
          minDate={today}
          accessibilityHint="select trip departure date"
          placeholderLeading=<MaterialCommunityIcons name="calendar" size={25} />
        />
        {isRoundTrip && (
          <DateInputField
            label="Return date"
            placeholder="Select date"
            dialogTitle="Select return date"
            onChange={setArrivalDate}
            minDate={departureDate ?? today}
            accessibilityHint="select trip return date"
            placeholderLeading=<MaterialCommunityIcons name="calendar-blank" size={25} />
          />
        )}
        
        {/* <Dropdown
          items={passengerChoices}
          onValueChange={setPassengerCount}
          mode="dropdown"
          label="Passengers"
          accessibilityHint="select number of passengers"
        /> */}
        
        <Dropdown
          items={seatClasses}
          selectedValue={seatClass}
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
      margin: CONTAINER_MARGIN,
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