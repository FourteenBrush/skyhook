import { Flight } from "@/models/Flight"
import { FlightQuery, SeatClass } from "@/models/FlightQuery"
import { Booking } from "@/models/Booking"
import axios from "axios"
import z from "zod"

/** Query keys which act as an unique identifier for identity based query hooks */
export const QUERY_KEYS = {
  GET_FLIGHTS: "flights",
  GET_BOOKINGS: "bookings",
}

const baseUrl = function() {
  const url = process.env.EXPO_PUBLIC_API_URL
  if (url === undefined || url === "") {
    throw new Error("env variable EXPO_PUBLIC_API_URL must be set to indicate the api base url")
  }
  // ensure base url doesnt end with "/"
  return url.endsWith("/") ? url.substring(0, url.length - 1) : url
}()

const api = axios.create({
  baseURL: baseUrl,
  headers: { Accept: "application/json" },
})
api.interceptors.request.use(null, (error: any) => {
  if (axios.isAxiosError(error)) {
    const details = error.message ?? error.cause
    console.error(`request error for path ${error.config!.url}: ${details}`)
  } else {
    console.error(error)
  }
  return Promise.reject(error)
})
api.interceptors.response.use(null, (error: any) => {
  if (axios.isAxiosError(error)) {
    const details = error.message ?? error.cause
    console.error(`response error ${error.status} for path ${error.config!.url}: ${details}'`)
  } else {
    console.error(error)
  }
  return Promise.reject(error)
})

const friendlyErrorMessage = (apiError: any): string => {
  if (axios.isAxiosError(apiError)) {
    if (apiError.status === undefined || apiError.cause === "Network Error") {
      return "Server seems to be unreachable"
    }
    if (Math.floor(apiError.status / 100) === 5) {
      return "Unexpected server error"
    }
  }
  // server is presumably reachable, and not a 500, must be some sort of validation failure then
  return "An unexpected error occured"
}

const dateToIso8601 = (isoStr: string): string => {
  const d = new Date(isoStr)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, "0")
  const day = d.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getFlightsResponseSchema = z.array(Flight.schema)
const getFlights = async (query: FlightQuery): Promise<Flight[]> => {
  const params = {
    "departureCity": query.departureCity,
    "arrivalCity": query.destinationCity,
    "departureDate": dateToIso8601(query.departureDateIsoStr),
    "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  }

  const { data } = await api.get("/flights/search", { params })
  return getFlightsResponseSchema.parse(data)
}

export type AuthResponse = {
  authToken: string,
}

export type SignInRequest = {
  email: string,
  password: string,
}

const signIn = async ({ email, password }: SignInRequest): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 3000))

  return {
    authToken: "<some token>",
  }
}

export type RegisterRequest = {
  fullName: string,
  email: string,
  password: string,
}

const register = async ({ fullName, email, password }: RegisterRequest): Promise<undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500))
}

export type TokenValidationResponse = {
  isValid: boolean,
}

const validateUserToken = async ({ authToken }: AuthOption): Promise<TokenValidationResponse> => {

  await new Promise(resolve => setTimeout(resolve, 500))
  return { isValid: true }
}

const mockupBookings: Booking[] = []

export type AuthOption = {
  authToken: string,
}

const getBookings = async ({ authToken }: AuthOption): Promise<Array<Booking>> => {
  return mockupBookings
  // try {
  //   const res = await fetch(`${baseUrl}/booking`)
  //   const body = await res.json() as unknown
  //   if (!Array.isArray(body)) {
  //     throw new Error("expected a json array to be returned")
  //   }
  //
  //   const items = body as unknown[]
  //   items.forEach(u => BookingSchema.parse(u))
  //   return (body as Booking[])
  // } catch (e) {
  //   console.error("failed to load bookings:", e)
  //   throw e
  // }
}

export type CreateBookingRequest = AuthOption & {
  flight: Flight,
  passengerName: string,
  chosenClass: SeatClass,
}

const createBooking = async ({ flight, passengerName, chosenClass, authToken }: CreateBookingRequest): Promise<Booking> => {
  await new Promise(resolve => setTimeout(resolve, 100))

  const booking = new Booking(flight, chosenClass, passengerName, new Date(), "BR-023-RND")
  mockupBookings.push(booking)
  return booking
}

export const ApiClient = {
  friendlyErrorMessage,
  getFlights,
  signIn,
  register,
  validateUserToken,
  getBookings,
  createBooking,
}
