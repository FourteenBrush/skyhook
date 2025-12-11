import z from "zod"
import { Flight } from "@/models/Flight"
import { SEAT_CLASSES, SeatClass } from "@/models/FlightQuery"

export class Booking {
  constructor(
    readonly flight: Flight,
    readonly chosenClass: SeatClass,
    readonly passengerName: string,
    bookedAt: Date,
    readonly bookingNr: string,
  ) {
    this.bookedAtIsoStr = bookedAt.toISOString()
  }

  private readonly bookedAtIsoStr: string

  get bookedAt(): Date {
    return new Date(this.bookedAtIsoStr)
  }

  static schema = z.object({
    flight: Flight.schema,
    chosenClass: z.enum(SEAT_CLASSES),
    passengerName: z.string().min(4, "Passenger name must be at least 4 characters long"),
    bookingNr: z.string().min(3, "Booking nr must be at least 3 characters long"),
    bookedAt: z.iso.datetime(),
  })
}
