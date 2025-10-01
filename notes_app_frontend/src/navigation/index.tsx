import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotesListScreen from '../screens/NotesListScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import NoteEditScreen from '../screens/NoteEditScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import { useTheme } from '../theme/ThemeProvider';
import linking from './linking';

export type RootStackParamList = {
  NotesList: undefined;
  NoteDetail: { id: number };
  NoteEdit: { id?: number } | undefined;
  Categories: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * PUBLIC_INTERFACE
 * AppNavigator
 * Provides the main NavigationContainer with stack routes:
 * - NotesList (default)
 * - NoteDetail (view note)
 * - NoteEdit (create/edit note)
 * - Categories (manage categories)
 * Returns the configured navigation tree element.
 */
export default function AppNavigator(): JSX.Element {
  const t = useTheme();
  const navTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: t.colors.background,
      card: t.colors.surface,
      text: t.colors.text,
      primary: t.colors.primary,
      border: t.colors.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="NotesList" component={NotesListScreen} />
        <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
        <Stack.Screen name="NoteEdit" component={NoteEditScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
