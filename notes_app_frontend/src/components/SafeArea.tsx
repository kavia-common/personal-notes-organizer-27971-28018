import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// PUBLIC_INTERFACE
export function WithSafeArea({ children }: { children: React.ReactNode }) {
  /** Wrap children with SafeAreaProvider for consistent safe area handling */
  return <SafeAreaProvider>{children}</SafeAreaProvider>;
}
