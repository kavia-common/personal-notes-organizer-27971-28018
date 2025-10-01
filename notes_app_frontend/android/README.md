This is a stub Android folder added to prevent CI from failing when `./gradlew` is executed inadvertently.

- The app targets Expo Web preview for this task.
- To enable real Android builds later:
  1) Run `npm run prebuild:android` to generate a full `android/` project.
  2) Remove this stub and commit the generated native project if desired.
  3) Update CI to run Gradle tasks as needed.
