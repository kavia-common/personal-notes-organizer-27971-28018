import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, AccessibilityRole } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type AppBarProps = {
  title: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  accessibilityRole?: AccessibilityRole;
};

export default function AppBar({ title, right, left, style, titleStyle }: AppBarProps): JSX.Element {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="header"
      accessibilityLabel={title}
      style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }, style]}
    >
      <View style={styles.side}>{left}</View>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.text }, titleStyle]}>{title}</Text>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  side: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
