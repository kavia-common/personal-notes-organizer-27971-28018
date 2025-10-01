import React from 'react';
import { View, Text } from 'react-native';

type ErrorBoundaryProps = { children: React.ReactNode };
type ErrorBoundaryState = { error: Error | null };

// PUBLIC_INTERFACE
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /** Simple error boundary to avoid blank screens on runtime errors */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 8 }}>Something went wrong</Text>
          <Text>{String(this.state.error.message || this.state.error)}</Text>
        </View>
      );
    }
    return <>{this.props.children}</>;
  }
}
