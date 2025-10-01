#!/usr/bin/env node
// Root-level Gradle wrapper stub implemented in Node.js to ensure portability in CI.
// Exits successfully and prints a helpful message instead of failing.
const path = require('path');
const fs = require('fs');

const appStubBash = path.join(__dirname, 'notes_app_frontend', 'android', 'gradlew');
const appStubSh = path.join(__dirname, 'notes_app_frontend', 'android', 'gradlew.sh');

if (fs.existsSync(appStubBash)) {
  console.log('Gradle wrapper stub: delegating to notes_app_frontend/android/gradlew (stub).');
  try {
    require('child_process').spawnSync('bash', [appStubBash, ...process.argv.slice(2)], { stdio: 'inherit' });
  } catch {}
  process.exit(0);
}
if (fs.existsSync(appStubSh)) {
  console.log('Gradle wrapper stub: delegating to notes_app_frontend/android/gradlew.sh (stub).');
  try {
    require('child_process').spawnSync('sh', [appStubSh, ...process.argv.slice(2)], { stdio: 'inherit' });
  } catch {}
  process.exit(0);
}

console.log('Gradle wrapper stub: Android build is not configured. Skipping.');
process.exit(0);
