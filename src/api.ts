import { Flight } from "@/models/Flight"
import { agent, SuperAgentRequest } from "superagent"
import { FlightQuery } from "@/models/FlightQuery"
import { Booking, BookingSchema } from "@/models/Booking"
import * as mockupData from "@/utils/mockupFlights"

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

const api = agent()
api.use((req: SuperAgentRequest) => {
  // prepend base url, to avoid specifying this on every call
  req.url = `${baseUrl}${req.url.startsWith("/") ? "" : "/"}${req.url}`
  if (req.url.endsWith("/")) {
    req.url = req.url.substring(0, req.url.length - 1)
  }
})

const getFlights = async (query: FlightQuery): Promise<Flight[]> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  // const params = new URLSearchParams({
  //   departureCity: query.departureCity,
  //   destinationCity: query.destinationCity,
  //   departureDate: new Date(Date.parse(query.departureDateIsoStr)).toISOString().slice(0, 10),
  //   seatClass: query.seatClass,
  // });
  // const res = await fetch(`${baseUrl}/flight/search?${params.toString()}`)
  // const body = await res.json()
  
  // console.log(query)
  // const { body } = await api.get("/flight/search").query({
  //   departureCity: query.departureCity,
  //   destinationCity: query.destinationCity,
  //   departureDate: new Date(Date.parse(query.departureDateIsoStr)),
  //   returnDate: query.returnDateIsoStr !== undefined ? new Date(Date.parse(query.returnDateIsoStr)) : undefined,
  //   // passengerCount: query.passengerCount,
  //   seatClass: query.seatClass,
  // })
  // console.warn(body)
  // if (!Array.isArray(body)) {
  //   throw new Error("expected a json array to be returned")
  // }
  // // console.log(JSON.stringify(body, null, 2))
  // return (body as unknown[]).map(Flight.fromDto)


  return mockupData.flights
}

// TODO: map by user id from SecureStore
const getBookings = async (): Promise<Array<Booking>> => {
  try {
    const res = await fetch(`${baseUrl}/booking`)
    const body = await res.json() as unknown
    if (!Array.isArray(body)) {
      throw new Error("expected a json array to be returned")
    }
    
    const items = body as unknown[]
    items.forEach(u => BookingSchema.parse(u))
    return (body as Booking[])
  } catch (e) {
    console.error("failed to load bookings:", e)
    throw e
  }
}

const createBooking = async (flight: Flight, userFullName: string): Promise<void> => {
  const body =  JSON.stringify({
    flightId: flight.id,
    userFullName,
  })
  await fetch(`${baseUrl}/booking/create`, {
    method: "POST", body,
    headers: { "Content-Type": "application/json" },
  })
  console.debug("created booking")
}

export type AuthResponse = {
  token: string,
}

export type SignInRequest = {
  email: string,
  password: string,
}

const signIn = async ({ email, password }: SignInRequest): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 3000))

  return {
    token: "<some token>",
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

const validateUserToken = async (token: string): Promise<TokenValidationResponse> => {

  await new Promise(resolve => setTimeout(resolve, 500))
  return { isValid: true }
}

export const ApiClient = {
  getFlights,
  getBookings,
  createBooking,
  signIn,
  register,
  validateUserToken,
}
