# Skyhook

Cross-platform (React Native) app for booking plane tickets. Merely a proof-of-concept achieved through a
custom backend that provides plane and ticket data.

## Functional requirements

- List all applicable flights for a given destination
- Purchase tickets (although without an actual payment system)
- Get an overview of all booked flights, being able to cancel them when applicable

## References

- [Vector icons finder](https://icons.expo.fyi/Index)

## Run instructions

```bash
npm i

npx expo start
# or
npm run android
# (with an emulator or a device connected through adb)
```

# Native build

```bash
cd android
./gradlew assembleRelease
# Apk can be found in app/build/outputs/apk/release/app-release.apk.
# Install this on a device with `adb install`
```

An `.env.example` file is available to indicate required runtime environment variables.
