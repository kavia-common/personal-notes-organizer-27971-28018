import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import AppBar from '../components/AppBar';
import { useTheme } from '../theme/ThemeProvider';
import { getNote, deleteNote, listCategories, Note } from '../services/repository/repository';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';

type Nav = NativeStackNavigationProp<RootStackParamList, 'NoteDetail'>;
type Route = RouteProp<RootStackParamList, 'NoteDetail'>;

export default function NoteDetailScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const id: number = route.params.id;
  const theme = useTheme();
  const [note, setNote] = useState<Note | null>(null);
  const [catName, setCatName] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const n = await getNote(id);
      setNote(n);
      const cats = await listCategories();
      if (n?.category_id) {
        setCatName(cats.find(c => c.id === n.category_id)?.name);
      }
    })();
  }, [id]);

  const right = (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => nav.navigate('NoteEdit', { id })} style={{ paddingHorizontal: 8 }}>
        <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          Alert.alert('Delete note?', 'This action cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                await deleteNote(id);
                nav.goBack();
              },
            },
          ])
        }
        style={{ paddingHorizontal: 8 }}
      >
        <Text style={{ color: theme.colors.error, fontWeight: '700' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppBar title="Note" right={right} />
      {!note ? (
        <View style={{ padding: 16 }}><Text>Loading...</Text></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{note.title}</Text>
          {catName ? (
            <View style={[styles.chip, { backgroundColor: '#EEF2FF' }]}>
              <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>{catName}</Text>
            </View>
          ) : null}
          <Text style={{ color: theme.colors.mutedText, marginBottom: 12 }}>
            Created {format(note.created_at, 'PPp')} • Updated {format(note.updated_at, 'PPp')}
          </Text>
          <Text style={{ color: theme.colors.text, lineHeight: 22 }}>{note.content || 'No content'}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  chip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginBottom: 8 },
});
