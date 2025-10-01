import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function Divider({ space = 12 }: { space?: number }): JSX.Element {
  const theme = useTheme();
  return (
    <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: space }} />
  );
}
