import { FlightQuery, SEAT_CLASSES, SeatClass } from "@/models/FlightQuery"
import { useState } from "react"
import z from "zod"

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

export type FormValues = {
  isRoundTrip: boolean,
  departureCity?: string,
  destinationCity?: string,
  departureDate?: Date,
  returnDate?: Date,
  seatClass: SeatClass,
}

export const useFlightSearchForm = () => {
  const [formState, setFormState] = useState<FormValues>({
    isRoundTrip: true,
    seatClass: "economy",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})

  const updateField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }))
    // clear existing error
    if (errors[key] !== undefined) {
      setErrors(prev => {
        const { [key]: _, ...rest } = prev
        return rest
      })
    }
  }

  const validateAndSubmit = (onValid: (query: FlightQuery) => void) => {
    const { error, data } = formSchema.safeParse(formState)

    if (error !== undefined) {
      const { fieldErrors } = z.flattenError(error)
      const errors: Record<string, string> = {}

      Object.entries(fieldErrors).forEach(([key, messages]) => {
        if (messages?.length) {
          errors[key] = messages[0]
        }
      })
      setErrors(errors)
      return
    }

    // success
    setErrors({})
    const query: FlightQuery = {
      departureCity: data.departureCity.toLowerCase(),
      destinationCity: data.destinationCity.toLowerCase(),
      departureDateIsoStr: data.departureDate.toISOString(),
      returnDateIsoStr: data.isRoundTrip ? data.returnDate!.toISOString() : undefined,
      seatClass: data.seatClass,
    }

    onValid(query)
  }

  return {
    formState,
    errors,
    updateField,
    validateAndSubmit,
  }
}
