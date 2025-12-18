import z from "zod"

export type PreferenceUpdateFunc = <K extends keyof Omit<UserPreferences, "updateState">>(
  key: K,
  value: UserPreferences[K],
) => Promise<void>

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

export type UserPreferences = z.infer<typeof persistedPreferenceSchema>
