import * as SQLite from 'expo-sqlite';

export type SQLiteDatabase = SQLite.SQLiteDatabase;

let db: SQLiteDatabase | null = null;

// PUBLIC_INTERFACE
export async function getDb(): Promise<SQLiteDatabase | null> {
  /** Returns opened SQLite database if available, else null for fallback to AsyncStorage. */
  try {
    if (!db) {
      // expo-sqlite for Expo; if unavailable, this may throw.
      db = await SQLite.openDatabaseAsync('notes.db');
      await runMigrations(db);
    }
    return db;
  } catch {
    return null;
  }
}

async function runMigrations(database: SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      category_id INTEGER NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  // Seed if empty
  const catCount = await database.getFirstAsync<{ count: number }>('SELECT COUNT(1) as count FROM categories');
  const noteCount = await database.getFirstAsync<{ count: number }>('SELECT COUNT(1) as count FROM notes');

  if ((catCount?.count ?? 0) === 0) {
    await database.runAsync('INSERT INTO categories (name) VALUES (?),(?),(?)', ['Personal', 'Work', 'Ideas']);
  }
  if ((noteCount?.count ?? 0) === 0) {
    const now = Date.now();
    await database.runAsync(
      'INSERT INTO notes (title, content, category_id, created_at, updated_at) VALUES (?,?,?,?,?), (?,?,?,?,?), (?,?,?,?,?)',
      [
        'Welcome to Ocean Notes',
        'Start capturing your thoughts. Tap + to create a new note.',
        null, now, now,
        'Organize with Categories',
        'Filter by category from the drawer to focus.',
        1, now - 100000, now - 100000,
        'Search your ideas',
        'Use the search bar on top to find notes by title or content.',
        3, now - 200000, now - 200000,
      ]
    );
  }
}
