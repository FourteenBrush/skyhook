// NOTE: must be json serializable as this is used as route param
export type FlightQuery = {
  departureCity: string,
  destinationCity: string,
  // because Date objects are not json serializable... hopefully Temporal gets stabilized soon..
  departureDateIsoStr: string,
  /** `undefined` on a one-way trip */
  returnDateIsoStr: string | undefined,
  // passengerCount: number,
  seatClass: SeatClass,
}

export const SEAT_CLASSES = ["economy", "business"] as const
export type SeatClass = (typeof SEAT_CLASSES)[number] // union of strings

export const seatClassToCapitalized = (sclass: SeatClass) => sclass.charAt(0).toUpperCase() + sclass.substring(1)
