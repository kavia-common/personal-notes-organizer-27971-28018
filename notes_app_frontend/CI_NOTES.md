# CI Notes

This container is intended for Expo Web preview on port 3000.

- No native Android (Gradle) build is configured in this container.
- Do not run `./gradlew` or Gradle tasks as `android/` is not generated.
- A stub gradle wrapper is included to prevent CI failures; ensure it is executable if your CI requires it.
- A stub gradle wrapper is included to prevent CI failures; ensure it is executable if your CI requires it.
- If you need native Android builds later:
  1) Run `npm run prebuild:android` locally to generate `android/`.
  2) Commit the `android/` directory or adjust CI to run prebuild.
  3) Update CI to execute Gradle from the generated folder.
