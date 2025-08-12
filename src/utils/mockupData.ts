import { Flight } from "@/models/Flight"

// Predefined Airport constants
const StandardAirports = {
  JFK: { shortName: "JFK", longName: "John F. Kennedy International", city: "New York" },
  ORD: { shortName: "ORD", longName: "O'Hare International", city: "Chicago" },
  LAX: { shortName: "LAX", longName: "Los Angeles International", city: "Los Angeles" },
  DFW: { shortName: "DFW", longName: "Dallas/Fort Worth International", city: "Dallas" },
  LHR: { shortName: "LHR", longName: "Heathrow Airport", city: "London" },
  CDG: { shortName: "CDG", longName: "Charles de Gaulle Airport", city: "Paris" },
  DXB: { shortName: "DXB", longName: "Dubai International", city: "Dubai" },
  SYD: { shortName: "SYD", longName: "Sydney Kingsford Smith", city: "Sydney" },
  FRA: { shortName: "FRA", longName: "Frankfurt am Main Airport", city: "Frankfurt" },
  YYZ: { shortName: "YYZ", longName: "Toronto Pearson International", city: "Toronto" },
  SIN: { shortName: "SIN", longName: "Singapore Changi Airport", city: "Singapore" },
  HND: { shortName: "HND", longName: "Haneda Airport", city: "Tokyo" },
  IST: { shortName: "IST", longName: "Istanbul Airport", city: "Istanbul" },
  MIA: { shortName: "MIA", longName: "Miami International Airport", city: "Miami" },
  ATL: { shortName: "ATL", longName: "Hartsfield–Jackson Atlanta International Airport", city: "Atlanta" },
  IAH: { shortName: "IAH", longName: "George Bush Intercontinental Airport", city: "Houston" },
  SFO: { shortName: "SFO", longName: "San Francisco International Airport", city: "San Francisco" },
}

export const mockupFlights: Flight[] = [
  // Direct flights
  new Flight(
    1,
    "DL101",
    new Date("2025-03-01T08:00:00"),
    new Date("2025-03-01T11:00:00"),
    "Delta",
    350,
    [
      {
        departureAirport: StandardAirports.JFK,
        destinationAirport: StandardAirports.ORD
      }
    ]
  ),
  new Flight(
    2,
    "UA202",
    new Date("2025-03-02T14:00:00"),
    new Date("2025-03-02T18:00:00"),
    "United",
    450,
    [
      {
        departureAirport: StandardAirports.LAX,
        destinationAirport: StandardAirports.DFW
      }
    ]
  ),
  new Flight(
    3,
    "BA303",
    new Date("2025-03-05T09:00:00"),
    new Date("2025-03-05T17:00:00"),
    "British Airways",
    800,
    [
      {
        departureAirport: StandardAirports.LHR,
        destinationAirport: StandardAirports.JFK
      }
    ]
  ),

  // Indirect flights (2 paths)
  new Flight(
    4,
    "AF404",
    new Date("2025-03-06T07:00:00"),
    new Date("2025-03-06T16:30:00"),
    "Air France",
    920,
    [
      {
        departureAirport: StandardAirports.CDG,
        destinationAirport: StandardAirports.DXB
      },
      {
        departureAirport: StandardAirports.DXB,
        destinationAirport: StandardAirports.SYD
      }
    ]
  ),
  new Flight(
    5,
    "LH505",
    new Date("2025-03-07T12:00:00"),
    new Date("2025-03-07T22:00:00"),
    "Lufthansa",
    700,
    [
      {
        departureAirport: StandardAirports.FRA,
        destinationAirport: StandardAirports.YYZ
      },
      {
        departureAirport: StandardAirports.YYZ,
        destinationAirport: StandardAirports.ORD
      }
    ]
  ),

  // More mixed examples
  new Flight(
    6,
    "QF606",
    new Date("2025-03-08T06:30:00"),
    new Date("2025-03-08T18:00:00"),
    "Qantas",
    1100,
    [
      {
        departureAirport: StandardAirports.SYD,
        destinationAirport: StandardAirports.SIN
      },
      {
        departureAirport: StandardAirports.SIN,
        destinationAirport: StandardAirports.HND
      }
    ]
  ),
  new Flight(
    7,
    "EK707",
    new Date("2025-03-09T10:00:00"),
    new Date("2025-03-09T20:00:00"),
    "Emirates",
    980,
    [
      {
        departureAirport: StandardAirports.DXB,
        destinationAirport: StandardAirports.IST
      },
      {
        departureAirport: StandardAirports.IST,
        destinationAirport: StandardAirports.CDG
      }
    ]
  ),
  new Flight(
    8,
    "AA808",
    new Date("2025-03-10T15:00:00"),
    new Date("2025-03-10T20:00:00"),
    "American Airlines",
    400,
    [
      {
        departureAirport: StandardAirports.MIA,
        destinationAirport: StandardAirports.JFK
      }
    ]
  ),
  new Flight(
    9,
    "DL909",
    new Date("2025-03-12T08:30:00"),
    new Date("2025-03-12T12:45:00"),
    "Delta",
    380,
    [
      {
        departureAirport: StandardAirports.ATL,
        destinationAirport: StandardAirports.IAH
      }
    ]
  ),
  new Flight(
    10,
    "UA010",
    new Date("2025-03-13T09:00:00"),
    new Date("2025-03-13T21:00:00"),
    "United",
    890,
    [
      {
        departureAirport: StandardAirports.SFO,
        destinationAirport: StandardAirports.LHR
      }
    ]
  ),
]