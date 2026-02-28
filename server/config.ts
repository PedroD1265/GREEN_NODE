export type AppMode = 'demo' | 'replit' | 'real';

export type StorageType = 'local' | 'replit' | 'supabase' | 'azure';
export type AIType = 'mock' | 'external' | 'azure';
export type AuthType = 'demo' | 'replit' | 'supabase' | 'azure';
export type DBType = 'sqlite' | 'postgres' | 'supabase';

export interface AppConfig {
  appMode: AppMode;
  storageProvider: StorageType;
  aiProvider: AIType;
  authMode: AuthType;
  dbType: DBType;
  port: number;
  dbPath: string;
  uploadsDir: string;
  jwtSecret: string;
}

export function getConfig(): AppConfig {
  const appMode = (process.env.APP_MODE || 'demo') as AppMode;

  const defaults: Record<AppMode, { storage: StorageType; ai: AIType; auth: AuthType; db: DBType }> = {
    demo: { storage: 'local', ai: 'mock', auth: 'demo', db: 'sqlite' },
    replit: {
      storage: 'replit',
      ai: 'mock',
      auth: 'replit',
      db: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
    },
    real: { storage: 'supabase', ai: 'external', auth: 'supabase', db: 'supabase' },
  };

  const d = defaults[appMode];

  return {
    appMode,
    storageProvider: (process.env.STORAGE_PROVIDER || d.storage) as StorageType,
    aiProvider: (process.env.AI_PROVIDER || d.ai) as AIType,
    authMode: (process.env.AUTH_MODE || d.auth) as AuthType,
    dbType: (process.env.DB_TYPE || d.db) as DBType,
    port: parseInt(process.env.API_PORT || '3001', 10),
    dbPath: process.env.DB_PATH || './data/green-node.sqlite',
    uploadsDir: process.env.UPLOADS_DIR || './uploads',
    jwtSecret: process.env.JWT_SECRET || 'green-node-demo-secret-change-in-production',
  };
}

export function validateRealModeConfig(): string[] {
  const missing: string[] = [];
  const supabaseVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
  for (const v of supabaseVars) {
    if (!process.env[v]) missing.push(v);
  }
  if (!process.env.SUPABASE_BUCKET) missing.push('SUPABASE_BUCKET');
  if (!process.env.EXTERNAL_AI_API_KEY) missing.push('EXTERNAL_AI_API_KEY');
  if (!process.env.EXTERNAL_AI_ENDPOINT) missing.push('EXTERNAL_AI_ENDPOINT');
  return missing;
}

export function validateReplitModeConfig(): string[] {
  const missing: string[] = [];
  if (!process.env.DATABASE_URL && !process.env.DB_PATH) {
    missing.push('DATABASE_URL (or DB_PATH for SQLite fallback)');
  }
  return missing;
}

export interface ModeCapabilities {
  mode: AppMode;
  database: { type: string; status: string };
  storage: { type: string; status: string };
  auth: { type: string; status: string };
  ai: { type: string; status: string };
  missingEnvVars: string[];
}

export function getModeCapabilities(mode?: AppMode): ModeCapabilities {
  const effectiveMode = mode || getConfig().appMode;

  const missingEnvVars = effectiveMode === 'real'
    ? validateRealModeConfig()
    : effectiveMode === 'replit'
      ? validateReplitModeConfig()
      : [];

  const capabilities: Record<AppMode, Omit<ModeCapabilities, 'missingEnvVars'>> = {
    demo: {
      mode: 'demo',
      database: { type: 'sqlite', status: 'ready' },
      storage: { type: 'local', status: 'ready' },
      auth: { type: 'demo-jwt', status: 'ready' },
      ai: { type: 'mock', status: 'ready' },
    },
    replit: {
      mode: 'replit',
      database: { type: process.env.DATABASE_URL ? 'postgres' : 'sqlite', status: 'ready' },
      storage: { type: 'replit-local', status: 'ready' },
      auth: { type: 'replit-jwt', status: 'ready' },
      ai: { type: 'mock', status: 'ready' },
    },
    real: {
      mode: 'real',
      database: { type: 'supabase', status: missingEnvVars.some(v => v.startsWith('SUPABASE_')) ? 'not_configured' : 'ready' },
      storage: { type: 'supabase', status: missingEnvVars.includes('SUPABASE_BUCKET') ? 'not_configured' : 'ready' },
      auth: { type: 'supabase', status: missingEnvVars.some(v => v.startsWith('SUPABASE_')) ? 'not_configured' : 'ready' },
      ai: { type: 'external', status: missingEnvVars.some(v => v.startsWith('EXTERNAL_AI_')) ? 'not_configured' : 'ready' },
    },
  };

  return {
    ...capabilities[effectiveMode],
    missingEnvVars,
  };
}
