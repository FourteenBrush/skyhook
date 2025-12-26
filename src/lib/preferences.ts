import z from "zod"

export type PreferenceUpdateFunc = <K extends keyof Omit<UserPreferences, "updateState">>(
  key: K,
  value: UserPreferences[K],
) => Promise<void>

const APPEARANCES = ["light", "dark", "system"] as const
export type Appearance = (typeof APPEARANCES)[number]

const CURRENCIES = ["euro", "dollar"] as const
export type CurrencyPreference = (typeof CURRENCIES)[number]

export const persistedPreferenceSchema = z.object({
  preferredCurrency: z.enum(["euro", "dollar"]),
  appearance: z.enum(["light", "dark", "system"]),
  defaultTripType: z.enum(["oneWay", "roundTrip"]),
})

export const defaultUserPreferences: UserPreferences = {
  appearance: "light",
  defaultTripType: "roundTrip",
  preferredCurrency: "euro",
}

export const getCurrencySign = (preference: UserPreferences["preferredCurrency"]): string => {

  return preference === "euro" ? "€" : "$"
}

export type UserPreferences = z.infer<typeof persistedPreferenceSchema>
