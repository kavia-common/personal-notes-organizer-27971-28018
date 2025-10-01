import 'expo-sqlite';

declare module 'expo-sqlite' {
  type SQLParam = string | number | null | Uint8Array;
  interface SQLiteDatabase {
    execAsync(sql: string): Promise<void>;
    runAsync(sql: string, params?: ReadonlyArray<SQLParam>): Promise<{ lastInsertRowId?: number; changes?: number }>;
    getFirstAsync<T = unknown>(sql: string, params?: ReadonlyArray<SQLParam>): Promise<T | undefined>;
    getAllAsync<T = unknown>(sql: string, params?: ReadonlyArray<SQLParam>): Promise<T[]>;
  }
}
