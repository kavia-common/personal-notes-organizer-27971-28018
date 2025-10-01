import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'notes_store_v1';
const CATS_KEY = 'categories_store_v1';

export type Note = {
  id: number;
  title: string;
  content: string;
  category_id: number | null;
  created_at: number;
  updated_at: number;
};

export type Category = { id: number; name: string };

// Helpers
async function read<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}
async function write<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function ensureSeeded() {
  const cats = await read<Category[]>(CATS_KEY, []);
  const notes = await read<Note[]>(NOTES_KEY, []);
  if (cats.length === 0) {
    const seedCats: Category[] = [
      { id: 1, name: 'Personal' },
      { id: 2, name: 'Work' },
      { id: 3, name: 'Ideas' },
    ];
    await write(CATS_KEY, seedCats);
  }
  if (notes.length === 0) {
    const now = Date.now();
    const seedNotes: Note[] = [
      { id: 1, title: 'Welcome to Ocean Notes', content: 'Tap + to create a note.', category_id: null, created_at: now, updated_at: now },
      { id: 2, title: 'Organize with Categories', content: 'Use the drawer filter.', category_id: 1, created_at: now - 100000, updated_at: now - 100000 },
      { id: 3, title: 'Search your ideas', content: 'Type in the search bar.', category_id: 3, created_at: now - 200000, updated_at: now - 200000 },
    ];
    await write(NOTES_KEY, seedNotes);
  }
}

// PUBLIC_INTERFACE
export async function storageListNotes(query?: string, categoryId?: number | null, sort: 'updated_desc' | 'created_desc' = 'updated_desc'): Promise<Note[]> {
  /** List notes from AsyncStorage with optional search and category filter */
  await ensureSeeded();
  let arr = await read<Note[]>(NOTES_KEY, []);
  if (categoryId) arr = arr.filter(n => n.category_id === categoryId);
  if (query && query.trim()) {
    const q = query.toLowerCase();
    arr = arr.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }
  arr.sort((a, b) => (sort === 'updated_desc' ? b.updated_at - a.updated_at : b.created_at - a.created_at));
  return arr;
}

// PUBLIC_INTERFACE
export async function storageGetNote(id: number): Promise<Note | null> {
  /** Get a single note from AsyncStorage */
  await ensureSeeded();
  const arr = await read<Note[]>(NOTES_KEY, []);
  return arr.find(n => n.id === id) ?? null;
}

// PUBLIC_INTERFACE
export async function storageCreateNote(data: { title: string; content: string; categoryId?: number | null }): Promise<number> {
  /** Create note and return new id */
  await ensureSeeded();
  const arr = await read<Note[]>(NOTES_KEY, []);
  const now = Date.now();
  const id = (arr.at(-1)?.id ?? 0) + 1;
  arr.push({ id, title: data.title, content: data.content, category_id: data.categoryId ?? null, created_at: now, updated_at: now });
  await write(NOTES_KEY, arr);
  return id;
}

// PUBLIC_INTERFACE
export async function storageUpdateNote(id: number, data: Partial<{ title: string; content: string; categoryId: number | null }>): Promise<void> {
  /** Update an existing note by id */
  await ensureSeeded();
  const arr = await read<Note[]>(NOTES_KEY, []);
  const idx = arr.findIndex(n => n.id === id);
  if (idx === -1) return;
  const now = Date.now();
  arr[idx] = {
    ...arr[idx],
    title: data.title ?? arr[idx].title,
    content: data.content ?? arr[idx].content,
    category_id: data.categoryId !== undefined ? data.categoryId : arr[idx].category_id,
    updated_at: now,
  };
  await write(NOTES_KEY, arr);
}

// PUBLIC_INTERFACE
export async function storageDeleteNote(id: number): Promise<void> {
  /** Delete note by id */
  await ensureSeeded();
  const arr = await read<Note[]>(NOTES_KEY, []);
  await write(NOTES_KEY, arr.filter(n => n.id !== id));
}

// PUBLIC_INTERFACE
export async function storageListCategories(): Promise<Category[]> {
  /** List categories from AsyncStorage */
  await ensureSeeded();
  return read<Category[]>(CATS_KEY, []);
}

// PUBLIC_INTERFACE
export async function storageCreateCategory(name: string): Promise<number> {
  /** Create a new category and return id */
  await ensureSeeded();
  const arr = await read<Category[]>(CATS_KEY, []);
  const id = (arr.at(-1)?.id ?? 0) + 1;
  arr.push({ id, name });
  await write(CATS_KEY, arr);
  return id;
}

// PUBLIC_INTERFACE
export async function storageRenameCategory(id: number, name: string): Promise<void> {
  /** Rename category by id */
  await ensureSeeded();
  const arr = await read<Category[]>(CATS_KEY, []);
  const idx = arr.findIndex(c => c.id === id);
  if (idx >= 0) {
    arr[idx] = { ...arr[idx], name };
    await write(CATS_KEY, arr);
  }
}

// PUBLIC_INTERFACE
export async function storageDeleteCategory(id: number): Promise<void> {
  /** Delete category by id and clear references in notes */
  await ensureSeeded();
  const cats = await read<Category[]>(CATS_KEY, []);
  const notes = await read<Note[]>(NOTES_KEY, []);
  await write(CATS_KEY, cats.filter(c => c.id !== id));
  const updatedNotes = notes.map(n => (n.category_id === id ? { ...n, category_id: null } : n));
  await write(NOTES_KEY, updatedNotes);
}
