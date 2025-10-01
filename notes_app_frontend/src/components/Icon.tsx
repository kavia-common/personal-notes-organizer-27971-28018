import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

type IconProps = {
  name: 'plus' | 'edit' | 'delete' | 'filter' | 'back' | 'save';
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
};

const map: Record<IconProps['name'], string> = {
  plus: '＋',
  edit: '✎',
  delete: '✖',
  filter: '⚲',
  back: '←',
  save: '✓',
};

export default function Icon({ name, color = '#111827', size = 18, style }: IconProps): JSX.Element {
  return <Text style={[{ color, fontSize: size }, style]}>{map[name]}</Text>;
}
