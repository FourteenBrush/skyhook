import { Airport, Flight, FlightPath } from "@/models/Flight"

const JFK: Airport = { city: "New York", shortName: "JFK", longName: "John F. Kennedy International" }
const LAX: Airport = { city: "Los Angeles", shortName: "LAX", longName: "Los Angeles International" }
const AMS: Airport = { city: "Amsterdam", shortName: "AMS", longName: "Amsterdam Schiphol" }
const DXB: Airport = { city: "Dubai", shortName: "DXB", longName: "Dubai International" }
const SIN: Airport = { city: "Singapore", shortName: "SIN", longName: "Singapore Changi" }
const HND: Airport = { city: "Tokyo", shortName: "HND", longName: "Tokyo Haneda" }

const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * 3600_000)

const randomFutureDate = (): Date => {
  const daysAhead = Math.floor(Math.random() * 7) + 1          // 1–7 days ahead
  const hourOfDay = Math.floor(Math.random() * 24)             // 0–23
  const base = new Date()
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + daysAhead,
    hourOfDay,
    0,
    0,
    0
  )
}

const generateTimedPaths = (
  airports: Array<{ departureAirport: Airport, arrivalAirport: Airport }>,
  start: Date,
  totalFlightDurationHours: number,
): Array<FlightPath> => {
  const result = new Array<FlightPath>
  const segmentCount = airports.length

  // split total duration into random segment durations
  let remainingHours = totalFlightDurationHours
  let currentStart = start

  for (let i = 0; i < segmentCount; i++) {
    const isLast = i === segmentCount - 1

    // assign a random duration between 1 and min(6, remainingHours - minHoursForRemaining)
    const maxSegment = Math.min(6, remainingHours - (segmentCount - i - 1)) // leave at least 1h for remaining
    const segmentHours = isLast
      ? remainingHours
      : Math.floor(Math.random() * (maxSegment - 1 + 1)) + 1

    remainingHours -= segmentHours

    const arrival = addHours(currentStart, segmentHours)
    result.push(new FlightPath(
      airports[i].departureAirport,
      airports[i].arrivalAirport,
      currentStart,
      arrival,
    ))

    // add realistic layover of 1–3 hours if not last segment
    const layoverHours = isLast ? 0 : Math.floor(Math.random() * 3) + 1
    currentStart = addHours(arrival, layoverHours)
    remainingHours -= layoverHours
  }
  return result
}

export const flights = [] as Flight[]
let id = 1

const pushFlight = (
  flightNr: string,
  airline: string,
  price: number,
  durationHours: number,
  airportPairs: Array<{ departureAirport: Airport, arrivalAirport: Airport, }>
) => {
  const dep = randomFutureDate()
  const paths = generateTimedPaths(airportPairs, dep, durationHours)

  flights.push(new Flight(id++, flightNr, airline, price, paths))
}

// 1. JFK → LAX (direct)
pushFlight("DL104", "Delta Airlines", 450, 6, [
  { departureAirport: JFK, arrivalAirport: LAX }
])

// 2. JFK → AMS → DXB
pushFlight("KL612", "KLM", 980, 13, [
  { departureAirport: JFK, arrivalAirport: AMS },
  { departureAirport: AMS, arrivalAirport: DXB },
])

// 3. LAX → HND → SIN
pushFlight("NH105", "All Nippon Airways", 1250, 17, [
  { departureAirport: LAX, arrivalAirport: HND },
  { departureAirport: HND, arrivalAirport: SIN },
])

// 4. AMS → HND (direct)
pushFlight("KL851", "KLM", 620, 11, [
  { departureAirport: AMS, arrivalAirport: HND },
])

// 5. DXB → SIN → LAX
pushFlight("EK362", "Emirates / Singapore Airlines", 1500, 18, [
  { departureAirport: DXB, arrivalAirport: SIN },
  { departureAirport: SIN, arrivalAirport: LAX },
])
