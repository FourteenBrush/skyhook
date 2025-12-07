import { Airport, Flight, FlightPath } from "@/models/Flight"

const JFK: Airport = { city: "New York", shortName: "JFK", longName: "John F. Kennedy International" }
const LAX: Airport = { city: "Los Angeles", shortName: "LAX", longName: "Los Angeles International" }
const AMS: Airport = { city: "Amsterdam", shortName: "AMS", longName: "Amsterdam Schiphol" }
const DXB: Airport = { city: "Dubai", shortName: "DXB", longName: "Dubai International" }
const SIN: Airport = { city: "Singapore", shortName: "SIN", longName: "Singapore Changi" }
const HND: Airport = { city: "Tokyo", shortName: "HND", longName: "Tokyo Haneda" }
const DOH: Airport = { city: "Doha", shortName: "DOH", longName: "Hamad International" }
const SYD: Airport = { city: "Sydney", shortName: "SYD", longName: "Sydney Kingsford Smith" }
const AKL: Airport = { city: "Auckland", shortName: "AKL", longName: "Auckland International" }

const NRT: Airport = { city: "Tokyo", shortName: "NRT", longName: "Narita International" }
const BKK: Airport = { city: "Bangkok", shortName: "BKK", longName: "Suvarnabhumi Airport" }
const MNL: Airport = { city: "Manila", shortName: "MNL", longName: "Ninoy Aquino International" }

const IST: Airport = { city: "Istanbul", shortName: "IST", longName: "Istanbul Airport" }
const DEL: Airport = { city: "New Delhi", shortName: "DEL", longName: "Indira Gandhi International" }
const KUL: Airport = { city: "Kuala Lumpur", shortName: "KUL", longName: "Kuala Lumpur International" }

const JNB: Airport = { city: "Johannesburg", shortName: "JNB", longName: "O. R. Tambo International" }
const GRU: Airport = { city: "São Paulo", shortName: "GRU", longName: "São Paulo–Guarulhos" }
const SCL: Airport = { city: "Santiago", shortName: "SCL", longName: "Arturo Merino Benítez" }

const ICN: Airport = { city: "Seoul", shortName: "ICN", longName: "Incheon International" }
const SEA: Airport = { city: "Seattle", shortName: "SEA", longName: "Seattle–Tacoma International" }
const YVR: Airport = { city: "Vancouver", shortName: "YVR", longName: "Vancouver International" }

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
  const result: FlightPath[] = []
  const segmentCount = airports.length

  // defensive: ensure there's at least one hour per flight segment
  if (totalFlightDurationHours < segmentCount) {
    // if caller passed an impossible total, bump it to at least segmentCount
    totalFlightDurationHours = segmentCount
  }

  let remainingHours = totalFlightDurationHours
  let currentStart = start

  for (let i = 0; i < segmentCount; i++) {
    const isLast = i === segmentCount - 1

    // reserve at least 1 hour for every remaining future flight segment
    const minReserveForRemaining = segmentCount - i - 1

    // maximum sensible segment length: at most 6 hours, but also limited by remainingHours minus reserves
    const rawMaxSegment = remainingHours - minReserveForRemaining
    const maxSegment = Math.max(1, Math.min(6, rawMaxSegment)) // ensure >= 1

    // decide segment hours
    let segmentHours: number
    if (isLast) {
      // whatever is left must be the final flight segment; ensure at least 1 hour
      segmentHours = Math.max(1, remainingHours)
    } else {
      // uniform random between 1 and maxSegment (inclusive)
      segmentHours = Math.floor(Math.random() * maxSegment) + 1
      // but don't allow choosing more than what's available after reserving 1h for each remaining segment
      const allowedMax = remainingHours - minReserveForRemaining
      segmentHours = Math.min(segmentHours, Math.max(1, allowedMax))
    }

    // compute arrival
    const arrival = addHours(currentStart, segmentHours)

    // push path (constructor will validate times)
    result.push(new FlightPath(
      airports[i].departureAirport,
      airports[i].arrivalAirport,
      currentStart,
      arrival,
    ))

    // consume the flown hours
    remainingHours -= segmentHours

    // if not last, add a layover between 1 and 3 hours but never force remainingHours negative
    if (!isLast) {
      const maxLayoverPossible = Math.max(1, Math.min(3, remainingHours - (segmentCount - i - 2))) // reserve for future segments
      // choose a layover between 1 and maxLayoverPossible (inclusive)
      const layoverHours = Math.min(Math.floor(Math.random() * 3) + 1, maxLayoverPossible)
      currentStart = addHours(arrival, layoverHours)
      remainingHours -= layoverHours
    } else {
      // last: nothing more
      currentStart = arrival
    }
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

// 6. JFK → DOH → SYD → AKL
pushFlight("QR823", "Qatar Airways", 1780, 27, [
  { departureAirport: JFK, arrivalAirport: DOH },
  { departureAirport: DOH, arrivalAirport: SYD },
  { departureAirport: SYD, arrivalAirport: AKL },
])

// 7. LAX → NRT → BKK → MNL
pushFlight("JL701", "Japan Airlines", 1340, 22, [
  { departureAirport: LAX, arrivalAirport: NRT },
  { departureAirport: NRT, arrivalAirport: BKK },
  { departureAirport: BKK, arrivalAirport: MNL },
])

// 8. AMS → IST → DEL → KUL
pushFlight("TK721", "Turkish Airlines", 1120, 20, [
  { departureAirport: AMS, arrivalAirport: IST },
  { departureAirport: IST, arrivalAirport: DEL },
  { departureAirport: DEL, arrivalAirport: KUL },
])

// 9. DXB → JNB → GRU → SCL
pushFlight("EK775", "Emirates", 1650, 25, [
  { departureAirport: DXB, arrivalAirport: JNB },
  { departureAirport: JNB, arrivalAirport: GRU },
  { departureAirport: GRU, arrivalAirport: SCL },
])

// 10. HND → ICN → SEA → YVR
pushFlight("KE720", "Korean Air", 960, 15, [
  { departureAirport: HND, arrivalAirport: ICN },
  { departureAirport: ICN, arrivalAirport: SEA },
  { departureAirport: SEA, arrivalAirport: YVR },
])
