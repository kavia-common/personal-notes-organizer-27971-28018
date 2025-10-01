import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function TextField(props: TextInputProps): JSX.Element {
  const theme = useTheme();
  return (
    <TextInput
      placeholderTextColor="#9CA3AF"
      {...props}
      style={[
        styles.input,
        { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
});
