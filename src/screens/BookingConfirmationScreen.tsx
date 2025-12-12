import { StyleSheet, Text, View } from "react-native"
import { CONTAINER_MARGIN, ThemeData } from "@/theme"
import { useStyleSheet } from "@/hooks/useStyleSheet"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { NavParams } from "@/Routes"
import { Booking } from "@/models/Booking"
import RoundedIconBackground from "@/components/RoundedIconBackground"
import { Feather } from "@expo/vector-icons"
import Card from "@/components/Card"
import FlightOverview from "@/components/FlightOverview"
import TextButton from "@/components/TextButton"

export type BookingConfirmationScreenProps = NativeStackScreenProps<NavParams, "bookingConfirmation"> & {
  booking: Booking,
}

/** Screen that shows the details of a confirmed booking */
export default function BookingConfirmationScreen({ navigation, booking }: BookingConfirmationScreenProps) {
  const styles = useStyleSheet(getStyles)
  
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.horizontallyCentered}>
        <RoundedIconBackground color="#DCFCE7" size={54}>
          <Feather name="check-circle" size={34} color="#16A34A" />
        </RoundedIconBackground>

        <Text style={styles.confirmationTitle}>Booking Confirmed!</Text>
        <Text style={styles.confirmationSubtitle}>Your flight has been successfully booked</Text>
      </View>

      {/* booking reference */}
      <Card clickable={false} style={styles.bookingRefCard}>
        <Text>Booking Reference</Text>
        <Text style={styles.bookingNr}>{booking.bookingNr}</Text>
        <Text style={styles.bookingNrSubtitle}>Save this reference for check-ins and support inquiries</Text>
      </Card>

      <Card clickable={false}>
        <Text style={styles.detailsTitle}>Flight Details</Text>
        <FlightOverview flight={booking.flight} chosenClass={booking.chosenClass} />
        <View style={styles.passengerSection}>
          <Text style={styles.passengerLine}>Passenger</Text>
          <Text>{booking.passengerName}</Text>
        </View>
      </Card>

      <TextButton
        style={styles.viewTripsButton}
        onPress={() => navigation.replace("account")}
      >
        View My Trips
      </TextButton>
      <TextButton
        kind="outlined"
        style={styles.button}
        onPress={() => navigation.popTo("searchFlight")}
      >
        Search More Flights
      </TextButton>
      <TextButton
        kind="outlined" 
        style={styles.button}
        onPress={() => navigation.popTo("home")}
      >
        Back to Home
      </TextButton>
    </View>
  )
}

const getStyles = ({ colors, fonts }: ThemeData) => StyleSheet.create({
  container: {
    margin: CONTAINER_MARGIN,
    paddingBottom: 20,
  },
  horizontallyCentered: {
    alignItems: "center",
  },
  confirmationTitle: {
    ...fonts.headlineMedium,
    fontWeight: 600,
    marginTop: 16,
  },
  confirmationSubtitle: {
    ...fonts.bodyLarge,
    color: colors.textSecondary,
    marginTop: 6,
  },

  bookingRefCard: {
    backgroundColor: colors.card,
    borderColor: colors.primaryShaded,
    borderWidth: 1,
    alignItems: "center",
  },
  bookingNr: {
    ...fonts.headlineMedium,
    color: colors.primary,
    fontWeight: 600,
    marginTop: 6,
  },
  bookingNrSubtitle: {
    paddingTop: 8,
    color: colors.textSecondary,
  },
  detailsTitle: {
    ...fonts.titleLarge,
    marginBottom: 14,
  },
  passengerSection: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  passengerLine: {
    ...fonts.titleMedium,
    color: colors.textSecondary,
  },
  
  viewTripsButton: {
    width: "100%",
    backgroundColor: colors.primary,
    marginTop: 10,
  },
  button: {
    width: "100%",
    marginTop: 10,
  },
})
