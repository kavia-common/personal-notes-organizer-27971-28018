# Notes App Frontend (React Native / Expo)

Ocean Professional themed personal notes app with local persistence (SQLite with AsyncStorage fallback). Features:
- Create, edit, delete notes
- Search by title/content
- Categories management and filtering
- Modern UI, FAB, cards, chips

Run (uses the existing preview, no changes to scripts):
- Install deps: npm install
- Start: npm run web (or npm start and use Expo)
- Preview should be available via the provided port 3000 link

Note: Android gradle build is not required for web preview; CI may attempt to run gradle in some environments which is not necessary for this container preview.

Note: Android gradle build is not required for web preview; CI may attempt to run gradle in some environments which is not necessary for this container preview.

Notes:
- We wrap the app in GestureHandlerRootView to satisfy @react-navigation requirements on web and native.
- Android gradle build script was intentionally removed from package.json to prevent CI from attempting a native build in this web-focused container.
- Android gradle build script was intentionally removed from package.json to prevent CI from attempting a native build in this web-focused container.

Notes:
- We wrap the app in GestureHandlerRootView to satisfy @react-navigation requirements on web and native.

Tech:
- React Navigation (native-stack)
- expo-sqlite for on-device persistence; falls back to @react-native-async-storage/async-storage automatically
- date-fns for relative timestamps
- react-native-screens and react-native-safe-area-context for navigation integration
- react-native-screens and react-native-safe-area-context for navigation integration

No environment variables required.
