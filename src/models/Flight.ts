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
  
  static fromDto(dto: unknown): Flight {
    throw new Error("todo")
  }
}

/**
 * Represents a flight path, which is a direct path between two airports,
 * flown with a specific airplane as part of a {@link Flight}.
 */
export type FlightPath = {
  readonly departureAirport: Airport,
  readonly destinationAirport: Airport,
}

export type Airport = {
  city: string,
  /** Short airport name, e.g. "JFK" */
  shortName: string,
  /** Long airport name, e.g. "John F. Kennedy International" */
  longName: string,
}