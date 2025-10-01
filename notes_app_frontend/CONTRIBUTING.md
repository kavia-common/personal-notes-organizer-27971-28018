# Contributing

- Install dependencies: `npm install`
- Run the web preview: `npm run web`
- Lint locally: `npm run lint`

Notes:
- The app uses Expo 53 with React 19 and React Native 0.79.
- Navigation peers: react-native-screens, react-native-safe-area-context, and react-native-gesture-handler are included and initialized in `src/Root.tsx`.
- SQLite is accessed via expo-sqlite with AsyncStorage fallback; types are augmented in `src/types/sqlite-augment.d.ts`.
