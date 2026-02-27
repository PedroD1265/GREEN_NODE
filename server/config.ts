export interface AppConfig {
  appMode: 'demo' | 'real';
  storageProvider: 'local' | 'azure';
  aiProvider: 'mock' | 'azure';
  authMode: 'demo' | 'real';
  port: number;
  dbPath: string;
  uploadsDir: string;
  jwtSecret: string;
}

export function getConfig(): AppConfig {
  const appMode = (process.env.APP_MODE || 'demo') as 'demo' | 'real';
  return {
    appMode,
    storageProvider: (process.env.STORAGE_PROVIDER || (appMode === 'demo' ? 'local' : 'azure')) as 'local' | 'azure',
    aiProvider: (process.env.AI_PROVIDER || (appMode === 'demo' ? 'mock' : 'azure')) as 'mock' | 'azure',
    authMode: (process.env.AUTH_MODE || appMode) as 'demo' | 'real',
    port: parseInt(process.env.API_PORT || '3001', 10),
    dbPath: process.env.DB_PATH || './data/green-node.sqlite',
    uploadsDir: process.env.UPLOADS_DIR || './uploads',
    jwtSecret: process.env.JWT_SECRET || 'green-node-demo-secret-change-in-production',
  };
}

export function validateRealModeConfig(): string[] {
  const missing: string[] = [];

  if (process.env.APP_MODE === 'real' || process.env.STORAGE_PROVIDER === 'azure') {
    const azureStorageVars = ['AZURE_STORAGE_ACCOUNT', 'AZURE_STORAGE_CONTAINER'];
    for (const v of azureStorageVars) {
      if (!process.env[v]) missing.push(v);
    }
  }

  if (process.env.APP_MODE === 'real' || process.env.AI_PROVIDER === 'azure') {
    const azureAiVars = ['AZURE_OPENAI_ENDPOINT', 'AZURE_OPENAI_API_KEY', 'AZURE_OPENAI_DEPLOYMENT'];
    for (const v of azureAiVars) {
      if (!process.env[v]) missing.push(v);
    }
  }

  if (process.env.APP_MODE === 'real' || process.env.AUTH_MODE === 'real') {
    const authVars = ['AUTH_TENANT_ID', 'AUTH_CLIENT_ID', 'AUTH_ISSUER', 'AUTH_AUDIENCE'];
    for (const v of authVars) {
      if (!process.env[v]) missing.push(v);
    }
  }

  return missing;
}
