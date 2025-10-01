import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type EmptyStateProps = {
  title: string;
  subtitle?: string;
};

export default function EmptyState({ title, subtitle }: EmptyStateProps): JSX.Element {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.illus, { backgroundColor: '#DBEAFE' }]} />
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle ? <Text style={{ color: theme.colors.mutedText, textAlign: 'center' }}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24 },
  illus: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
});
