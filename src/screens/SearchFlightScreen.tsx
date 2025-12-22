import { DateInputField, Dropdown, TextInputField } from "@/components/FormInputs"
import TextButton from "@/components/TextButton"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { CONTAINER_MARGIN, MEDIA_QUERY_MEDIUM_BREAK, ThemeData } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { PickerItemProps } from "@react-native-picker/picker"
import { Text, StyleSheet, View, ScrollView } from "react-native"
import { preconnect } from "react-dom"
import { FlightQuery, SEAT_CLASSES, SeatClass, seatClassToCapitalized } from "@/models/FlightQuery"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import z from "zod"
import { useForm } from "@/hooks/useForm"
import { NavParams } from "@/Routes"
import { dateAtStartOfDay } from "@/utils/utils"

const citySchema = (requiredErr: string) => z.string({ error: requiredErr })
  .min(2, "At least 2 characters are required").max(100)

const formSchema = z.object({
  departureCity: citySchema("Please enter a departure city"),
  destinationCity: citySchema("Please enter a destination city"),
  departureDate: z.date("Please enter a departure date"),
  seatClass: z.enum(SEAT_CLASSES),
})
.refine(data => dateAtStartOfDay(data.departureDate) >= dateAtStartOfDay(new Date()), {
  message: "Departure date must be today or later",
  path: ["departureDate"],
  when: (_payload) => true,
})

const seatClasses: PickerItemProps<SeatClass>[] = SEAT_CLASSES.map((sclass) => {
  const label = seatClassToCapitalized(sclass)
  return { label, value: sclass }
})

export type SearchFlightScreenProps = NativeStackScreenProps<NavParams, "searchFlight">

export default function SearchFlightPage({ navigation }: SearchFlightScreenProps) {
  const {
    formState,
    errors,
    updateField,
    validateAndSubmit,
  } = useForm(formSchema, { seatClass: "economy" })

  const styles = useStyleSheet(getStyles)
  const { fonts, colors } = useTheme()
  
  const navigateToFlightList = () => {
    // hint browser to start connection handshake already
    preconnect(process.env.EXPO_PUBLIC_API_URL)

    const query: FlightQuery = {
      departureCity: formState.departureCity,
      destinationCity: formState.destinationCity,
      departureDateIsoStr: formState.departureDate.toISOString(),
      seatClass: formState.seatClass,
    }
    navigation.navigate("flightList", query)
  }
  
  const today = new Date()
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* form wrapper, for the purpose of making the submit button stick to the bottom */}
      <View>
        <Text style={fonts.headlineLarge}>Search Flights</Text>

        <TextInputField
          value={formState.departureCity}
          error={errors.departureCity}
          onChangeText={updateField.bind(null, "departureCity")}
          label="From"
          autoCapitalize="words"
          placeholder="Departure City"
          accessibilityHint="departure city input field"
        />
        <TextInputField
          value={formState.destinationCity}
          error={errors.destinationCity}
          onChangeText={updateField.bind(null, "destinationCity")}
          label="To"
          autoCapitalize="words"
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
          placeholderLeading=<MaterialCommunityIcons name="calendar-blank" size={25} color={colors.text} />
        />
        
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
    roundTripButton: {
      flex: 1,
    },
    searchFlightsButton: {
      alignSelf: "stretch",
    },
  })
}
