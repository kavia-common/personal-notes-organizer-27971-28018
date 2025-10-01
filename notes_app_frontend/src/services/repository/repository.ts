import { getDb } from '../db/sqlite';
import {
  storageListNotes,
  storageGetNote,
  storageCreateNote,
  storageUpdateNote,
  storageDeleteNote,
  storageListCategories,
  storageCreateCategory,
  storageRenameCategory,
  storageDeleteCategory,
  Note,
  Category,
} from './storage';

export type { Note, Category };

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * List notes with optional query text, category filter, and sort option.
 * Falls back to AsyncStorage if SQLite is unavailable.
 */
export async function listNotes(params: { query?: string; categoryId?: number | null; sort?: 'updated_desc' | 'created_desc' } = {}): Promise<Note[]> {
  const db = await getDb();
  if (!db) return storageListNotes(params.query, params.categoryId, params.sort ?? 'updated_desc');

  const filters: string[] = [];
  const args: unknown[] = [];
  if (params.categoryId) {
    filters.push('category_id = ?');
    args.push(params.categoryId);
  }
  if (params.query && params.query.trim()) {
    filters.push('(LOWER(title) LIKE ? OR LOWER(content) LIKE ?)');
    const q = `%${params.query.toLowerCase().replace(/[%_]/g, (m) => '\\' + m)}%`;
    args.push(q, q);
  }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const order = params.sort === 'created_desc' ? 'created_at DESC' : 'updated_at DESC';
  const rows = await db.getAllAsync<Note>(`SELECT id, title, content, category_id, created_at, updated_at FROM notes ${where} ORDER BY ${order}`, args);
  return rows;
}

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Retrieve a single note by id.
 */
export async function getNote(id: number): Promise<Note | null> {
  const db = await getDb();
  if (!db) return storageGetNote(id);

  const row = await db.getFirstAsync<Note>('SELECT id, title, content, category_id, created_at, updated_at FROM notes WHERE id = ?', [id]);
  return row ?? null;
}

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Create a new note and return its id.
 */
export async function createNote(data: { title: string; content: string; categoryId?: number | null }): Promise<number> {
  const db = await getDb();
  if (!db) return storageCreateNote(data);

  const now = Date.now();
  const res = await db.runAsync(
    'INSERT INTO notes (title, content, category_id, created_at, updated_at) VALUES (?,?,?,?,?)',
    [data.title, data.content, data.categoryId ?? null, now, now]
  );
  // @ts-expect-error expo-sqlite runAsync returns object with lastInsertRowId in runtime
  return res.lastInsertRowId ?? 0;
}

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Update an existing note by id with provided fields.
 */
export async function updateNote(id: number, data: Partial<{ title: string; content: string; categoryId: number | null }>): Promise<void> {
  const db = await getDb();
  if (!db) return storageUpdateNote(id, data);

  const now = Date.now();
  const existing = await getNote(id);
  if (!existing) return;
  await db.runAsync(
    'UPDATE notes SET title = ?, content = ?, category_id = ?, updated_at = ? WHERE id = ?',
    [
      data.title ?? existing.title,
      data.content ?? existing.content,
      data.categoryId !== undefined ? data.categoryId : existing.category_id,
      now,
      id,
    ]
  );
}

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Delete a note by id.
 */
export async function deleteNote(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return storageDeleteNote(id);

  await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
}

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * List all categories ordered by name.
 */
export async function listCategories(): Promise<Category[]> {
  const db = await getDb();
  if (!db) return storageListCategories();

  return db.getAllAsync<Category>('SELECT id, name FROM categories ORDER BY name ASC');
}

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Create a new category and return its id.
 */
export async function createCategory(name: string): Promise<number> {
  const db = await getDb();
  if (!db) return storageCreateCategory(name);

  const res = await db.runAsync('INSERT INTO categories (name) VALUES (?)', [name]);
  // @ts-expect-error expo-sqlite runAsync returns object with lastInsertRowId in runtime
  return res.lastInsertRowId ?? 0;
}

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Rename an existing category by id.
 */
export async function renameCategory(id: number, name: string): Promise<void> {
  const db = await getDb();
  if (!db) return storageRenameCategory(id, name);

  await db.runAsync('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
}

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * Delete a category and clear references in notes (set null).
 */
export async function deleteCategory(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return storageDeleteCategory(id);

  await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
  await db.runAsync('UPDATE notes SET category_id = NULL WHERE category_id = ?', [id]);
}
