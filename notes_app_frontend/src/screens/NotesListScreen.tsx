import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import AppBar from '../components/AppBar';
import TextField from '../components/TextField';
import { useDebouncedValue } from '../utils/hooks';
import { Note, listNotes, listCategories } from '../services/repository/repository';
import { NoteItem } from '../components/Card';
import FAB from '../components/FAB';
import EmptyState from '../components/EmptyState';
import Chip from '../components/Chip';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList, 'NotesList'>;

export default function NotesListScreen() {
  const theme = useTheme();
  const nav = useNavigation<Nav>();
  const [q, setQ] = useState('');
  const dq = useDebouncedValue(q, 300);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [data, setData] = useState<Note[]>([]);
  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const load = useCallback(async () => {
    const [notes, categories] = await Promise.all([
      listNotes({ query: dq, categoryId, sort: 'updated_desc' }),
      listCategories(),
    ]);
    setData(notes);
    setCats([{ id: 0, name: 'All' }, ...categories]);
  }, [dq, categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  const headerRight = useMemo(() => (
    <TouchableOpacity onPress={() => setFiltersOpen(true)} style={styles.filterBtn} accessibilityLabel="Filter categories">
      <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Filter</Text>
    </TouchableOpacity>
  ), [theme.colors.primary]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <AppBar title="Notes" right={headerRight} />
      <View style={{ padding: 12 }}>
        <TextField
          value={q}
          onChangeText={setQ}
          placeholder="Search notes..."
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {data.length === 0 ? (
        <EmptyState
          title={q || categoryId ? 'No results' : 'No notes yet'}
          subtitle={q || categoryId ? 'Try adjusting your search or filters.' : 'Tap the + button to create your first note.'}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 80 }}
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <NoteItem
              id={item.id}
              title={item.title}
              content={item.content}
              categoryName={cats.find(c => c.id === item.category_id)?.name ?? undefined}
              updatedAt={item.updated_at}
              onPress={() => nav.navigate('NoteDetail', { id: item.id })}
            />
          )}
        />
      )}

      <FAB onPress={() => nav.navigate('NoteEdit')} />

      <Modal visible={filtersOpen} animationType="slide" transparent onRequestClose={() => setFiltersOpen(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setFiltersOpen(false)}>
          <View />
        </TouchableOpacity>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>Filter by Category</Text>
            <TouchableOpacity onPress={() => { setFiltersOpen(false); nav.navigate('Categories'); }}>
              <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Manage</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipWrap}>
            {cats.map(c => {
              const selected = (categoryId ?? 0) === c.id;
              return (
                <Chip
                  key={c.id}
                  label={c.name}
                  selected={selected}
                  onPress={() => setCategoryId(c.id === 0 ? null : c.id)}
                />
              );
            })}
          </View>
          <View style={{ height: 12 }} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  filterBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sheetTitle: { fontSize: 16, fontWeight: '700' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 8 },
});
