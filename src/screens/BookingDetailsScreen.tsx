import { Booking } from "@/models/Booking"
import FlightDetailsScreen from "@/screens/FlightDetailsScreen"

export default function BookingDetailsScreen({ booking }: { booking: Booking }) {
  return (
    <FlightDetailsScreen flight={booking.flight} chosenClass={booking.chosenClass} showBookingSection={false} />
  )
}
