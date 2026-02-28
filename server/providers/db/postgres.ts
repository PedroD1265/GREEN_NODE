import { DBProvider } from '../../db/provider';

export class PostgresDBProvider implements DBProvider {
  private mode: 'postgres' | 'sqlite' = 'sqlite';
  private sqliteDb: import('better-sqlite3').Database | null = null;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      this.mode = 'postgres';
      console.log('[PostgresDBProvider] DATABASE_URL detected — PostgreSQL mode (stub: not yet implemented, falling back to SQLite)');
      this.initSQLiteFallback();
    } else {
      this.mode = 'sqlite';
      console.log('[PostgresDBProvider] No DATABASE_URL found — using SQLite fallback');
      this.initSQLiteFallback();
    }
  }

  private initSQLiteFallback() {
    const Database = require('better-sqlite3');
    const path = require('path');
    const fs = require('fs');
    const dbPath = process.env.DB_PATH || './data/green-node.sqlite';
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.sqliteDb = new Database(dbPath);
    (this.sqliteDb as any).pragma('journal_mode = WAL');
    (this.sqliteDb as any).pragma('foreign_keys = ON');
  }

  private getDb(): import('better-sqlite3').Database {
    if (!this.sqliteDb) {
      throw new Error('[PostgresDBProvider] Database not initialized');
    }
    return this.sqliteDb;
  }

  query<T>(sql: string, params: any[] = []): T[] {
    if (this.mode === 'postgres') {
      return this.getDb().prepare(sql).all(...params) as T[];
    }
    return this.getDb().prepare(sql).all(...params) as T[];
  }

  get<T>(sql: string, params: any[] = []): T | undefined {
    if (this.mode === 'postgres') {
      return this.getDb().prepare(sql).get(...params) as T | undefined;
    }
    return this.getDb().prepare(sql).get(...params) as T | undefined;
  }

  run(sql: string, params: any[] = []) {
    const result = this.getDb().prepare(sql).run(...params);
    return { changes: result.changes, lastInsertRowid: result.lastInsertRowid };
  }

  transaction<T>(fn: () => T): T {
    return this.getDb().transaction(fn)();
  }

  getMode(): 'postgres' | 'sqlite' {
    return this.mode;
  }

  static validateConfig(): string[] {
    const missing: string[] = [];
    if (!process.env.DATABASE_URL) {
      missing.push('DATABASE_URL (optional — falls back to SQLite)');
    }
    return missing;
  }
}
