import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './theme/ThemeProvider';
import AppNavigator from './navigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './components/ErrorBoundary';
import { setupScreens } from './setupScreens';

setupScreens();
import { setupScreens } from './setupScreens';

setupScreens();
import { ErrorBoundary } from './components/ErrorBoundary';

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Root component wrapping the app with Theme, SafeArea, GestureHandler providers and ErrorBoundary.
 */
export default function Root(): JSX.Element {
  /** Root component wrapping the app with Theme and GestureHandler provider */
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <AppNavigator />
          </ErrorBoundary>
          <StatusBar style="dark" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
