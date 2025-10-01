import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
};

export default function Button({ label, onPress, variant = 'primary', style, labelStyle, disabled }: ButtonProps): JSX.Element {
  const theme = useTheme();
  const bg =
    variant === 'primary' ? theme.colors.primary :
    variant === 'secondary' ? theme.colors.secondary : 'transparent';
  const borderColor = variant === 'outline' ? theme.colors.primary : 'transparent';
  const textColor = variant === 'outline' ? theme.colors.primary : '#fff';

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        { backgroundColor: bg, borderColor, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: textColor }, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  label: { fontSize: 16, fontWeight: '600' },
});
