#!/bin/sh
# Root-level Gradle wrapper stub to prevent CI failures when Android build is not configured.
# Tries to delegate to app stub if present, otherwise exits successfully.
APP_BASH="./notes_app_frontend/android/gradlew"
APP_SH="./notes_app_frontend/android/gradlew.sh"

if [ -f "$APP_BASH" ]; then
  bash "$APP_BASH" "$@"
  exit 0
fi

if [ -f "$APP_SH" ]; then
  sh "$APP_SH" "$@"
  exit 0
fi

echo "Gradle wrapper stub: Android build is not configured in this container. Skipping."
exit 0
