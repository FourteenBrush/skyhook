// NOTE: needs a * import as this is broken otherwise for some reason
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native"
import z from "zod"

/** Helper type to extract the type stored in a {@link JsonStorage} */
export type StorageOutput<T> = T extends JsonStorage<infer S> ? z.infer<S> : never

/** A persistent storage which stores values encoded as json objects */
export class JsonStorage<Schema extends z.ZodObject> {
  constructor(
    readonly keyName: string,
    readonly schema: Schema,
  ) {}

  persist(value: z.input<Schema>): Promise<void> {
    return PlatformStorage.persistAsync(this.keyName, JSON.stringify(value))
  }

  /** Throws on schema validation failure or storage failures */
  async getValue(): Promise<z.output<Schema> | null> {
    const json = await PlatformStorage.getAsync(this.keyName)
    if (json === null) return null
    return this.schema.parse(JSON.parse(json))
  }

  delete(): Promise<void> {
    return PlatformStorage.removeAsync(this.keyName)
  }
}

// NOTE: web does not support secure store, use localStorage instead
const PlatformStorage = {
  async getAsync(key: string): Promise<string | null> {
    return Platform.OS === "web"
      ? AsyncStorage.getItem(key)
      : SecureStore.getItemAsync(key)
  },

  async persistAsync(key: string, value: string): Promise<void> {
    return Platform.OS === "web"
      ? AsyncStorage.setItem(key, value)
      : SecureStore.setItemAsync(key, value)
  },

  async removeAsync(key: string): Promise<void> {
    return Platform.OS === "web"
      ? AsyncStorage.removeItem(key)
      : SecureStore.deleteItemAsync(key)
  }
}
