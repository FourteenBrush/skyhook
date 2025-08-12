import { Flight } from "@/models/Flight"
import { agent, SuperAgentRequest } from "superagent"
import { FlightQuery } from "@/models/FlightQuery"

/** Query keys to uniquely describe rest endpoints */
export const QUERY_KEYS = {
  GET_FLIGHTS: "flights",
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
  console.log(req.url)
})

const getFlights = async (query: FlightQuery): Promise<Flight[]> => {
  const { body } = await api.get("/flight/search/").query({
    departureCity: query.departureCity,
    destinationCity: query.destinationCity,
    departureDate: query.departureDateIsoStr,
    returnDate: query.returnDateIsoStr,
    passengerCount: query.passengerCount,
    seatClass: query.seatClass,
  })
  if (!Array.isArray(body)) {
    throw new Error("expected a json array to be returned")
  }
  return (body as unknown[]).map(Flight.fromDto)
}

export const ApiClient = {
  getFlights,
}