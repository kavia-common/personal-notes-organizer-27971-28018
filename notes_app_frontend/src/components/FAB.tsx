import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type FABProps = {
  icon?: string;
  label?: string;
  onPress?: () => void;
};

export default function FAB({ label = '+', onPress }: FABProps): JSX.Element {
  const theme = useTheme();
  return (
    <TouchableOpacity accessibilityRole="button" onPress={onPress} style={[styles.fab, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.shadow }]}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  label: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: -2 },
});
