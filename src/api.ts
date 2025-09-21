import { Flight } from "@/models/Flight"
import { agent, SuperAgentRequest } from "superagent"
import { FlightQuery } from "@/models/FlightQuery"
import { Booking, BookingSchema } from "@/models/Booking"

/** Query keys to uniquely describe rest endpoints */
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
  const params = new URLSearchParams({
    departureCity: query.departureCity,
    destinationCity: query.destinationCity,
    departureDate: new Date(Date.parse(query.departureDateIsoStr)).toISOString().slice(0, 10),
    seatClass: query.seatClass,
  });
  const res = await fetch(`${baseUrl}/flight/search?${params.toString()}`)
  const body = await res.json()
  
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
  if (!Array.isArray(body)) {
    throw new Error("expected a json array to be returned")
  }
  // console.log(JSON.stringify(body, null, 2))
  return (body as unknown[]).map(Flight.fromDto)
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

export const ApiClient = {
  getFlights,
  getBookings,
  createBooking,
}