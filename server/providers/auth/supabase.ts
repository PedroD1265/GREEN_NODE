import { AuthProvider, AuthUser, LoginResult } from './interface';

const REQUIRED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

export class SupabaseAuthProvider implements AuthProvider {
  private supabaseUrl: string;
  private anonKey: string;
  private serviceRoleKey: string;

  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.anonKey = process.env.SUPABASE_ANON_KEY || '';
    this.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const missing = this.getMissingVars();
    if (missing.length > 0) {
      console.warn(`[SupabaseAuth] Missing config: ${missing.join(', ')}`);
    }
  }

  getMissingVars(): string[] {
    const missing: string[] = [];
    if (!this.supabaseUrl) missing.push('SUPABASE_URL');
    if (!this.anonKey) missing.push('SUPABASE_ANON_KEY');
    if (!this.serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    return missing;
  }

  private ensureConfigured(): void {
    const missing = this.getMissingVars();
    if (missing.length > 0) {
      throw Object.assign(
        new Error(`Supabase Auth not configured. Missing environment variables: ${missing.join(', ')}`),
        { status: 503 }
      );
    }
  }

  async login(_role: string, _name?: string): Promise<LoginResult> {
    this.ensureConfigured();
    throw Object.assign(
      new Error('Supabase Auth login not yet implemented. Install @supabase/supabase-js and implement.'),
      { status: 501 }
    );
  }

  async verifyToken(_token: string): Promise<AuthUser | null> {
    this.ensureConfigured();
    throw Object.assign(
      new Error('Supabase Auth token verification not yet implemented.'),
      { status: 501 }
    );
  }

  async getUser(_id: string): Promise<AuthUser | null> {
    this.ensureConfigured();
    throw Object.assign(
      new Error('Supabase Auth user lookup not yet implemented.'),
      { status: 501 }
    );
  }
}
