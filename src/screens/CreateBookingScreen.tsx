import { ApiClient } from "@/api"
import Badge from "@/components/Badge"
import Card from "@/components/Card"
import FlightTiming from "@/components/FlightTiming"
import { ErrorLabel, TextInputField } from "@/components/FormInputs"
import TextButton from "@/components/TextButton"
import { useForm } from "@/hooks/useForm"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { Flight } from "@/models/Flight"
import { SeatClass, seatClassToCapitalized } from "@/models/FlightQuery"
import { NavParams } from "@/Routes"
import { CONTAINER_MARGIN, ThemeData } from "@/theme"
import { formatDate } from "@/utils/utils"
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { DefaultError, useMutation } from "@tanstack/react-query"
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native"
import z from "zod"

export type CreateBookingScreenProps = NativeStackScreenProps<NavParams, "createBooking"> & {
  flight: Flight,
  chosenClass: SeatClass,
}

const passengerSchema = z.object({
  passengerName: z.string().min(2, "Passenger name must be at least 4 characters long"),
})

export default function CreateBookingScreen({ navigation, flight, chosenClass }: CreateBookingScreenProps) {
  const styles = useStyleSheet(getStyles)
  const { colors, fonts } = useTheme()

  const {
    formState,
    updateField,
    errors,
    validateAndSubmit,
  } = useForm(passengerSchema, { passengerName: "" })

  const createBookingMutation = useMutation<void, DefaultError, { passengerName: string }>({
    mutationFn: ({ passengerName }) => ApiClient.createBooking({ flight, passengerName, chosenClass }),
  })

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.centeredHeaderSection}>
          {/* ticket icon */}
          <View style={styles.ticketIconRounded}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={34} color={colors.primary} />
          </View>

          <Text style={styles.screenTitle}>Book Your Flight</Text>
          <Text style={styles.screenSubtitle}>Complete your booking details below</Text>
        </View>

        {/* flight information card */}
        <Card clickable={false}>
          {/* airline and flight nr */}
          <View style={styles.airlineAndFlightNr}>
            <View style={{ flexDirection: "row", gap: 7 }}>
              <Ionicons name="airplane-outline" color={colors.primary} size={17} style={{ transform: [{ rotateZ: "-45deg" }] }} />
              <Text style={fonts.titleMedium}>{flight.airline}</Text>
            </View>

            <Badge kind="light">{flight.flightNr}</Badge>
          </View>

          <FlightTiming flight={flight} kind="small" />
          <HorizontalLine />

          {/* departure, class and price */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <MaterialCommunityIcons name="calendar-blank" size={16} />
              <Text>{formatDate(flight.departureTime)}</Text>
              <Text>{seatClassToCapitalized(chosenClass)}</Text>
            </View>

            <Text style={styles.price}>&euro;{flight.price}</Text>
          </View>
        </Card>

        {/* passenger details */}
        <Card clickable={false}>
          <View style={styles.passengerDetailsTitle}>
            <Octicons name="person" color={colors.primary} size={20} />
            <Text style={fonts.titleLarge}>Passenger Details</Text>
          </View>

          <TextInputField
            autoFocus
            value={formState.passengerName}
            onChangeText={updateField.bind(null, "passengerName")}
            error={errors.passengerName}
            label="Full Name (as on ID)"
            placeholder="Your name"
            style={styles.passengerNameInputField}
          />
          <Text style={{ color: colors.textSecondary }}>(note: we only support adding one passenger)</Text>
        </Card>

        {/* pricing */}
        <Card clickable={false}>
          <View style={styles.invoiceLine}>
            <Text style={styles.invoiceLineText}>Base fare</Text>
            <Text style={fonts.titleSmall}>&euro;{flight.price}</Text>
          </View>

          <View style={styles.invoiceLine}>
            <Text style={styles.invoiceLineText}>Taxes & fees</Text>
            <Text style={fonts.titleSmall}>&euro;0.00</Text>
          </View>

          <HorizontalLine />
          <View style={styles.invoiceLine}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalPrice}>&euro;{flight.price}</Text>
          </View>
        </Card>

        <TextButton
          kind="filled"
          style={styles.confirmButton}
          onPress={validateAndSubmit.bind(null, ({ passengerName }) => createBookingMutation.mutate({ passengerName }))}
          disabled={createBookingMutation.isPending}
        >
          Confirm Booking
        </TextButton>
        {createBookingMutation.isError && <ErrorLabel error={"Something went wrong while booking your flight, please try again later"} />}
        <TextButton
          kind="outlined"
          style={styles.backButton}
          onPress={() => navigation.pop()}
        >
          Back to Flight Details
        </TextButton>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const HorizontalLine = ({ color = "#E0E0E0", thickness = 1, marginVertical = 10 }) => (
  <View
    style={{
      width: "100%",
      alignSelf: "center",
      backgroundColor: color,
      height: thickness,
      marginVertical,
    }}
  />
);

const getStyles = ({ colors, fonts }: ThemeData) => StyleSheet.create({
  container: {
    margin: CONTAINER_MARGIN,
    paddingBottom: 20,
  },
  centeredHeaderSection: {
    alignItems: "center",
  },
  screenTitle: {
    ...fonts.headlineSmall,
    fontWeight: 500,
    paddingTop: 10,
  },
  screenSubtitle: {
    ...fonts.titleMedium,
    color: colors.textSecondary,
    paddingTop: 6,
  },
  ticketIconRounded: {
    width: 54,
    height: 54,
    backgroundColor: "#E6EEFA",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },

  airlineAndFlightNr: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  price: {
    ...fonts.titleLarge,
    color: colors.primary,
  },

  passengerDetailsTitle: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  passengerNameInputField: {
    backgroundColor: "#F8FAFB",
    borderColor: "#E1E7EF",
    marginTop: 12,
  },

  invoiceLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  invoiceLineText: {
    ...fonts.titleMedium,
    color: colors.textSecondary,
  },
  totalText: {
    ...fonts.titleLarge,
    fontWeight: 600,
  },
  totalPrice: {
    ...fonts.titleMedium,
    color: colors.primary,
    fontWeight: 600,
  },

  confirmButton: {
    width: "100%",
    backgroundColor: colors.primary,
    marginTop: 10,
  },
  backButton: {
    width: "100%",
    marginTop: 12,
  },
})
