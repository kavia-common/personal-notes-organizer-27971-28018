import { enableScreens } from 'react-native-screens';

// PUBLIC_INTERFACE
export function setupScreens(): void {
  /** Enable native screens optimizations where supported */
  try {
    enableScreens(true);
  } catch {
    // no-op on web or environments where not supported
  }
}
