import { DBProvider } from '../../db/provider';

const REQUIRED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

export class SupabaseDBProvider implements DBProvider {
  private supabaseUrl: string;
  private serviceRoleKey: string;

  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const missing = this.getMissingVars();
    if (missing.length > 0) {
      console.warn(`[SupabaseDB] Missing config: ${missing.join(', ')}`);
    }
  }

  getMissingVars(): string[] {
    const missing: string[] = [];
    if (!this.supabaseUrl) missing.push('SUPABASE_URL');
    if (!this.serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    return missing;
  }

  private ensureConfigured(): void {
    const missing = this.getMissingVars();
    if (missing.length > 0) {
      throw Object.assign(
        new Error(`Supabase DB not configured. Missing environment variables: ${missing.join(', ')}`),
        { status: 503 }
      );
    }
  }

  query<T>(_sql: string, _params?: any[]): T[] {
    this.ensureConfigured();
    throw Object.assign(
      new Error('Supabase DB query not yet implemented. Install @supabase/supabase-js and implement.'),
      { status: 501 }
    );
  }

  get<T>(_sql: string, _params?: any[]): T | undefined {
    this.ensureConfigured();
    throw Object.assign(
      new Error('Supabase DB get not yet implemented.'),
      { status: 501 }
    );
  }

  run(_sql: string, _params?: any[]): { changes: number; lastInsertRowid: number | bigint } {
    this.ensureConfigured();
    throw Object.assign(
      new Error('Supabase DB run not yet implemented.'),
      { status: 501 }
    );
  }

  transaction<T>(_fn: () => T): T {
    this.ensureConfigured();
    throw Object.assign(
      new Error('Supabase DB transaction not yet implemented.'),
      { status: 501 }
    );
  }
}
