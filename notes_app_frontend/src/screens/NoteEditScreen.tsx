import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AppBar from '../components/AppBar';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { createCategory, createNote, getNote, listCategories, updateNote } from '../services/repository/repository';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { toast } from '../utils/toast';
import { toast } from '../utils/toast';

type Nav = NativeStackNavigationProp<RootStackParamList, 'NoteEdit'>;
type Route = RouteProp<RootStackParamList, 'NoteEdit'>;

export default function NoteEditScreen() {
  const theme = useTheme();
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const id: number | undefined = route.params?.id;

  const isNew = !id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    (async () => {
      const categories = await listCategories();
      setCats(categories);
      if (id) {
        const n = await getNote(id);
        if (n) {
          setTitle(n.title);
          setContent(n.content);
          setCategoryId(n.category_id);
        }
      }
    })();
  }, [id]);

  const save = async () => {
    if (!title.trim()) {
      Alert.alert('Title is required', 'Please enter a title.');
      return;
    }
    try {
      if (isNew) {
        const newId = await createNote({ title, content, categoryId });
        toast('Note created');
        nav.replace('NoteDetail', { id: newId });
      } else {
        await updateNote(id!, { title, content, categoryId });
        toast('Note updated');
        nav.goBack();
      }
    } catch {
      Alert.alert('Save failed', 'Please try again.');
    }
  };

  const addCategoryInline = async () => {
    const name = newCatName.trim();
    if (!name) return;
    try {
      const newId = await createCategory(name);
      const updated = await listCategories();
      setCats(updated);
      setCategoryId(newId);
      setNewCatName('');
      setAddingCat(false);
      toast('Category added');
    } catch {
      Alert.alert('Could not create category');
    }
  };

  const right = (
    <TouchableOpacity onPress={save} style={{ paddingHorizontal: 8 }}>
      <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Save</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppBar title={isNew ? 'New Note' : 'Edit Note'} right={right} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextField placeholder="Title" value={title} onChangeText={setTitle} />
        <View style={{ height: 12 }} />
        <TextField
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
          style={{ height: 200, textAlignVertical: 'top' }}
        />

        <View style={{ height: 16 }} />
        <Text style={{ color: theme.colors.mutedText, marginBottom: 8 }}>Category</Text>
        <View style={styles.catWrap}>
          <TouchableOpacity
            onPress={() => setCategoryId(null)}
            style={[
              styles.catItem,
              { borderColor: theme.colors.border, backgroundColor: categoryId === null ? '#DBEAFE' : theme.colors.surface },
            ]}
          >
            <Text style={{ color: theme.colors.text }}>None</Text>
          </TouchableOpacity>
          {cats.map(c => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCategoryId(c.id)}
              style={[
                styles.catItem,
                { borderColor: theme.colors.border, backgroundColor: categoryId === c.id ? '#DBEAFE' : theme.colors.surface },
              ]}
            >
              <Text style={{ color: theme.colors.text }}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!addingCat ? (
          <Button label="Add new category" variant="outline" onPress={() => setAddingCat(true)} />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextField style={{ flex: 1, marginRight: 8 }} placeholder="New category name" value={newCatName} onChangeText={setNewCatName} />
            <Button label="Add" onPress={addCategoryInline} />
          </View>
        )}

        <View style={{ height: 24 }} />
        <Button label="Save" onPress={save} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  catWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  catItem: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, marginRight: 8, marginBottom: 8 },
});
