import z from "zod"

const airportSchema = z.object({
  city: z.string(),
  /** Short airport name, e.g. "JFK" */
  shortName: z.string(),
  /** Long airport name, e.g. "John F. Kennedy International" */
  longName: z.string(),
})

export type Airport = z.infer<typeof airportSchema>


const flightPathSchema = z.object({
  departureAirport: airportSchema,
  destinationAirport: airportSchema,
})

/**
 * Represents a flight path, which is a direct path between two airports,
 * flown with a specific airplane as part of a {@link Flight}.
 */
export type FlightPath = z.infer<typeof flightPathSchema>


/** One journey from origin to destination */
export class Flight {
  constructor(
    readonly id: number,
    readonly flightNr: string,
    readonly departureTime: Date,
    readonly arrivalTime: Date,
    readonly airline: string,
    readonly price: number,
    /**
     * Ordered list of paths that this flight consists of.
     * The first and last entry contain respectively the departure and arrival airport.
     * The destination of every entry points to the departure of the next entry (if any).
     */
    readonly paths: Array<FlightPath>,
  ) {}
  
  get departureAirport(): Airport {
    return this.paths[0].departureAirport
  }
  
  get destinationAirport(): Airport {
    return this.paths[this.paths.length - 1].destinationAirport
  }
  
  get isDirect(): boolean {
    return this.paths.length == 1
  }
  
  // returns duration as Date since UTC
  get totalDuration(): Date {
    return new Date(this.arrivalTime.getTime() - this.departureTime.getTime())
  }
  
  public static schema = z.object({
    id: z.number(),
    flightNr: z.string().nonempty(),
    departureTime: z.coerce.date(),
    arrivalTime: z.coerce.date(),
    airline: z.string(),
    price: z.number().positive(),
    paths: z.array(flightPathSchema)
  })
  
  /** @throws on validation failure */
  static fromDto(dto: unknown): Flight {
    const data = Flight.schema.parse(dto)
    return new Flight(
      data.id,
      data.flightNr,
      data.departureTime,
      data.arrivalTime,
      data.airline,
      data.price,
      data.paths,
    )
  }
}