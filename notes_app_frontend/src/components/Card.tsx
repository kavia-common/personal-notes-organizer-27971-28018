import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { formatDistanceToNow } from 'date-fns';
import { snippet } from '../utils/text';
import { snippet } from '../utils/text';

type NoteItemProps = {
  id: number;
  title: string;
  content: string;
  categoryName?: string | null;
  updatedAt: number;
  onPress?: () => void;
  style?: ViewStyle;
};

export function NoteItem({ title, content, categoryName, updatedAt, onPress, style }: NoteItemProps): JSX.Element {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{title}</Text>
        {categoryName ? (
          <View style={[styles.chip, { backgroundColor: '#EEF2FF' }]}>
            <Text style={[styles.chipText, { color: theme.colors.primary }]} numberOfLines={1}>{categoryName}</Text>
          </View>
        ) : null}
      </View>
      <Text style={{ color: theme.colors.mutedText }} numberOfLines={3}>
        {content?.trim()?.length ? snippet(content, 220) : 'No content'}
      </Text>
      <Text style={[styles.time, { color: theme.colors.mutedText }]}>
        {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  title: { flex: 1, fontSize: 16, fontWeight: '700', marginRight: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  chipText: { fontSize: 12, fontWeight: '700' },
  time: { marginTop: 8, fontSize: 12 },
});
