import z from "zod"
import { Flight } from "@/models/Flight"
import { SEAT_CLASSES } from "@/models/FlightQuery"

export const BookingSchema = z.object({
  flight: Flight.schema,
  bookedAt: z.iso.datetime(),
  passengerName: z.string().min(4, "Passenger name must be at least 4 characters long"),
  chosenClass: z.enum(SEAT_CLASSES),
})

export type Booking = z.infer<typeof BookingSchema>
