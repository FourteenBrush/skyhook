import z from "zod"

export const BookingSchema = z.object({

})

export type Booking = z.infer<typeof BookingSchema>
