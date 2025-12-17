import z from "zod"

const airportSchema = z.object({
  city: z.string(),
  /** Short airport name, e.g. "JFK" */
  shortName: z.string(),
  /** Long airport name, e.g. "John F. Kennedy International" */
  longName: z.string(),
})

export type Airport = z.infer<typeof airportSchema>

/**
 * Represents a flight path, which is a direct path between two airports,
 * flown with a specific airplane as part of a {@link Flight}.
 */
export class FlightPath {
  constructor(
    readonly departureAirport: Airport,
    readonly arrivalAirport: Airport,
    departureTime: Date,
    arrivalTime: Date,
  ) {
    this.departureTimeIso = departureTime.toISOString()
    this.arrivalTimeIso = arrivalTime.toISOString()

    if (departureTime >= arrivalTime) {
      throw new Error(`FlightPath arrivalTime must be after departureTime: ${arrivalTime} and ${departureTime}`)
    }
  }

  // NOTE: fields below are stored as ISO 8601 date-time string instead of Date to be serializable across screens and such
  private readonly departureTimeIso: string
  private readonly arrivalTimeIso: string

  get departureTime(): Date {
    return new Date(this.departureTimeIso)
  }

  get arrivalTime(): Date {
    return new Date(this.arrivalTimeIso)
  }

  static schema = z.object({
    departureAirport: airportSchema,
    arrivalAirport: airportSchema,
    departureTime: z.coerce.date(),
    arrivalTime: z.coerce.date(),
  })
  .transform(val => new FlightPath(val.departureAirport, val.arrivalAirport, val.departureTime, val.arrivalTime))

  toString(): string {
    return `${this.departureAirport.shortName} (${this.departureTime.toLocaleString()}) → ` +
      `${this.arrivalAirport.shortName} (${this.arrivalTime.toLocaleString()})`
  }
}

/** One journey from origin to arrival */
export class Flight {
  constructor(
    readonly id: number,
    readonly flightNr: string,
    readonly airline: string,
    readonly price: number,
    /**
     * Ordered list of paths that this flight consists of.
     * The first and last entry contain respectively the departure and arrival airport.
     * The arrival of every entry points to the departure of the next entry (if any).
     * At least one path must be present.
     */
    readonly paths: Array<FlightPath>,
  ) {

    if (paths.length === 0) {
      throw new Error("Flight must contain at least one path")
    }

    for (let i = 1; i < paths.length; i++) {
      const prev = paths[i - 1]
      const path = paths[i]

      if (prev.arrivalAirport.shortName !== path.departureAirport.shortName) {
        throw new Error(`invalid airport chain at index ${i}: ${prev.arrivalAirport.shortName} -> ${path.arrivalAirport.shortName}`)
      }

      if (path.departureTime < prev.arrivalTime) {
        throw new Error(`Path ${i} departs before previous path arrived: ${path.departureTime} and ${prev.arrivalTime}`)
      }
    }
  }

  get departureAirport(): Airport {
    return this.paths[0].departureAirport
  }
  
  get arrivalAirport(): Airport {
    return this.paths[this.paths.length - 1].arrivalAirport
  }

  get departureTime(): Date {
    return new Date(this.paths[0].departureTime)
  }

  get arrivalTime(): Date {
    return new Date(this.paths[this.paths.length - 1].arrivalTime)
  }

  get isDirect(): boolean {
    return this.paths.length == 1
  }

  get intermediaryStopCount(): number {
    return this.paths.length - 1
  }
  
  // returns duration as Date since UTC
  get totalDuration(): Date {
    return new Date(this.arrivalTime.getTime() - this.departureTime.getTime())
  }

  toString(): string {
    const pathStrings = this.paths.map((p, i) => `  ${i + 1}. ${p.toString()}`).join("\n")
    return `Flight ${this.flightNr} (${this.airline}) - $${this.price}\n` +
      `From ${this.departureAirport.shortName} to ${this.arrivalAirport.shortName}\n` +
      `Departure: ${this.departureTime.toISOString()} | Arrival: ${this.arrivalTime.toISOString()}\n` +
      `Direct: ${this.isDirect} | Total Duration: ${this.totalDuration.getUTCHours()}h ${this.totalDuration.getUTCMinutes()}m\n` +
      `Paths:\n${pathStrings}`
  }
  
  public static schema = z.object({
    id: z.number(),
    flightNr: z.string().nonempty(),
    airline: z.string(),
    price: z.number().positive(),
    paths: z.array(FlightPath.schema),
  }).transform(val => new Flight(val.id, val.flightNr, val.airline, val.price, val.paths))
  
  /** @throws on validation failure */
  static fromDto(dto: unknown): Flight {
    return Flight.schema.parse(dto)
  }
}
