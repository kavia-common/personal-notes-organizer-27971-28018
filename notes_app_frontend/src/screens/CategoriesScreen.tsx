import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import AppBar from '../components/AppBar';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { createCategory, deleteCategory, listCategories, renameCategory } from '../services/repository/repository';
import { useNavigation } from '@react-navigation/native';

export default function CategoriesScreen() {
  const theme = useTheme();
  const nav = useNavigation();
  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [newName, setNewName] = useState('');

  const load = async () => {
    setCats(await listCategories());
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const n = newName.trim();
    if (!n) return;
    await createCategory(n);
    setNewName('');
    await load();
  };

  const rename = async (id: number) => {
    Alert.prompt?.('Rename category', undefined, async (text) => {
      const t = (text ?? '').trim();
      if (t) {
        await renameCategory(id, t);
        await load();
      }
    });
  };

  const del = async (id: number) => {
    Alert.alert('Delete category?', 'Notes in this category will be uncategorized.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteCategory(id); await load(); } },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppBar title="Categories" left={<TouchableOpacity onPress={() => nav.goBack()}><Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Back</Text></TouchableOpacity>} />
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <TextField style={{ flex: 1, marginRight: 8 }} placeholder="New category" value={newName} onChangeText={setNewName} />
          <Button label="Add" onPress={add} />
        </View>
        <FlatList
          data={cats}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={{ flex: 1, color: theme.colors.text, fontSize: 16 }}>{item.name}</Text>
              <TouchableOpacity onPress={() => rename(item.id)} style={{ paddingHorizontal: 8 }}>
                <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Rename</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => del(item.id)} style={{ paddingHorizontal: 8 }}>
                <Text style={{ color: theme.colors.error, fontWeight: '700' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={<Text>No categories.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12 },
});
