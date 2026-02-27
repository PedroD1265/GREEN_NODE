export interface DBProvider {
  query<T>(sql: string, params?: any[]): T[];
  get<T>(sql: string, params?: any[]): T | undefined;
  run(sql: string, params?: any[]): { changes: number; lastInsertRowid: number | bigint };
  transaction<T>(fn: () => T): T;
}

export class SQLiteDBProvider implements DBProvider {
  constructor(private db: import('better-sqlite3').Database) {}

  query<T>(sql: string, params: any[] = []): T[] {
    return this.db.prepare(sql).all(...params) as T[];
  }

  get<T>(sql: string, params: any[] = []): T | undefined {
    return this.db.prepare(sql).get(...params) as T | undefined;
  }

  run(sql: string, params: any[] = []) {
    const result = this.db.prepare(sql).run(...params);
    return { changes: result.changes, lastInsertRowid: result.lastInsertRowid };
  }

  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)();
  }
}

export interface CosmosDBProvider extends DBProvider {
  // Stub for future Azure Cosmos DB integration
  // Implementation would use @azure/cosmos SDK
}
