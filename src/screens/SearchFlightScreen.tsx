import { DateInputField, Dropdown, TextInputField } from "@/components/FormInputs"
import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { CONTAINER_MARGIN, MEDIA_QUERY_MEDIUM_BREAK, ThemeData } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { PickerItemProps } from "@react-native-picker/picker"
import { Text, StyleSheet, View, ScrollView } from "react-native"
import { preconnect } from "react-dom"
import { FlightQuery, SEAT_CLASSES, SeatClass } from "@/models/FlightQuery"
import { NavParams } from "@/App"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import z from "zod"
import { useForm } from "@/hooks/useForm"

// const passengerChoices: PickerItemProps<number>[] = [1, 2, 3, 4].map((nr) => {
//   const label = `${nr} Passenger` + (nr > 1 ? "s" : "")
//   return { label, value: nr }
// })

const citySchema = (requiredErr: string) => z.string({ error: requiredErr })
  .min(2, "At least 2 characters are required").max(100)

const formSchema = z.object({
  isRoundTrip: z.boolean(),
  departureCity: citySchema("Please enter a departure city"),
  destinationCity: citySchema("Please enter a destination city"),
  departureDate: z.date("Please enter a departure date"),
  returnDate: z.date().optional(),
  seatClass: z.enum(SEAT_CLASSES),
})
.refine(data => data.departureDate > new Date(), {
  message: "Departure date must be after today",
  path: ["departureDate"],
  when: (_payload) => true,
})
.refine(data => data.isRoundTrip === (data.returnDate !== undefined), {
  message: "Please enter a return date",
  path: ["returnDate"],
  when: (_payload) => true, // always run, even if other properties contain errors
})
.refine(data => data.isRoundTrip ? data.departureDate <= data.returnDate! : true, {
  message: "Return data must not be before departure data",
  path: ["returnDate"],
  // run if departureDate and returnDate are valid
  when: (payload) => formSchema
    .pick({ isRoundTrip: true, departureDate: true, returnDate: true })
    .safeParse(payload.value).success,
})

const seatClasses: PickerItemProps<SeatClass>[] = SEAT_CLASSES.map((sclass) => {
  const label = sclass.charAt(0).toUpperCase() + sclass.substring(1)
  return { label, value: sclass }
})

export type SearchFlightScreenProps = NativeStackScreenProps<NavParams, "searchFlight">

export default function SearchFlightPage({ navigation }: SearchFlightScreenProps) {
  const {
    formState,
    errors,
    updateField,
    validateAndSubmit,
  } = useForm(formSchema, { isRoundTrip: true, seatClass: "economy" })

  const styles = useStyleSheet(getStyles, [formState.isRoundTrip])
  const { fonts } = useTheme()
  
  const navigateToFlightList = () => {
    // hint browser to start connection handshake already
    preconnect(process.env.EXPO_PUBLIC_API_URL)

    const query: FlightQuery = {
      departureCity: formState.departureCity.toLowerCase(),
      destinationCity: formState.destinationCity.toLowerCase(),
      departureDateIsoStr: formState.departureDate.toISOString(),
      returnDateIsoStr: formState.isRoundTrip ? formState.returnDate!.toISOString() : undefined,
      seatClass: formState.seatClass,
    }
    navigation.navigate("flightList", query)
  }
  
  const today = new Date()
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* form wrapper, for the purpose of making the submit bottom stick to the bottom */}
      <View>
        <Text style={fonts.headlineLarge}>Search Flights</Text>

        <View style={styles.roundTripButtonsWrapper}>
          <TextButton
            kind={formState.isRoundTrip ? "filled" : "outlined"}
            onPress={updateField.bind(null, "isRoundTrip", true)}
            style={styles.roundTripButton}
            accessibilityLabel="round trip flight selector"
          >
            Round Trip
          </TextButton>
          <TextButton
            kind={formState.isRoundTrip ? "outlined" : "filled"}
            onPress={updateField.bind(null, "isRoundTrip", false)}
            style={styles.roundTripButton}
            accessibilityLabel="one way flight selector"
          >
            One Way
          </TextButton>
        </View>
        
        <TextInputField
          value={formState.departureCity}
          error={errors.departureCity}
          onChangeText={updateField.bind(null, "departureCity")}
          label="From"
          placeholder="Departure City"
          accessibilityHint="departure city input field"
        />
        <TextInputField
          value={formState.destinationCity}
          error={errors.destinationCity}
          onChangeText={updateField.bind(null, "destinationCity")}
          label="To"
          placeholder="Destination City"
          accessibilityHint="destination city input field"
        />
        
        <DateInputField
          value={formState.departureDate}
          error={errors.departureDate}
          label="Departure Date"
          placeholder="Select date"
          dialogTitle="Select departure date"
          onChange={updateField.bind(null, "departureDate")}
          minDate={today}
          accessibilityHint="select trip departure date"
          placeholderLeading=<MaterialCommunityIcons name="calendar-blank" size={25} />
        />
        {formState.isRoundTrip && (
          <DateInputField
            value={formState.returnDate}
            error={errors.returnDate}
            label="Return date"
            placeholder="Select date"
            dialogTitle="Select return date"
            onChange={updateField.bind(null, "returnDate")}
            minDate={formState.departureDate ?? today}
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
          selectedValue={formState.seatClass}
          onValueChange={updateField.bind(null, "seatClass")}
          mode="dropdown"
          label="Class"
          accessibilityHint="seat class"
        />
      </View>
      
      <TextButton
        onPress={validateAndSubmit.bind(null, navigateToFlightList)}
        style={styles.searchFlightsButton}
        accessibilityHint="search flights">Search Flights
      </TextButton>
    </ScrollView>
  )
}

const getStyles = ({ colors }: ThemeData) => {
  return StyleSheet.create({
    container: {
      // reasonable size for form width
      maxWidth: MEDIA_QUERY_MEDIUM_BREAK,
      maxHeight: 900,
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
