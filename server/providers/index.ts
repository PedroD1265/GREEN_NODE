import { getConfig } from '../config';
import { StorageProvider } from './storage/interface';
import { LocalStorageProvider } from './storage/local';
import { ReplitStorageProvider } from './storage/replit';
import { SupabaseStorageProvider } from './storage/supabase';
import { AzureBlobStorageProvider } from './storage/azure';
import { AIProvider } from './ai/interface';
import { AIMockProvider } from './ai/mock';
import { ExternalAIProvider } from './ai/external';
import { AzureAIProvider } from './ai/azure';
import { AuthProvider } from './auth/interface';
import { DemoAuthProvider } from './auth/demo';
import { ReplitAuthProvider } from './auth/replit';
import { SupabaseAuthProvider } from './auth/supabase';
import { AzureAuthProvider } from './auth/azure';

export interface Providers {
  storage: StorageProvider;
  ai: AIProvider;
  auth: AuthProvider;
}

let providers: Providers | null = null;

export function getProviders(): Providers {
  if (!providers) {
    const config = getConfig();

    const storageMap: Record<string, () => StorageProvider> = {
      local: () => new LocalStorageProvider(config.uploadsDir),
      replit: () => new ReplitStorageProvider(config.uploadsDir),
      supabase: () => new SupabaseStorageProvider(),
      azure: () => new AzureBlobStorageProvider(),
    };

    const aiMap: Record<string, () => AIProvider> = {
      mock: () => new AIMockProvider(),
      external: () => new ExternalAIProvider(),
      azure: () => new AzureAIProvider(),
    };

    const authMap: Record<string, () => AuthProvider> = {
      demo: () => new DemoAuthProvider(),
      replit: () => new ReplitAuthProvider(),
      supabase: () => new SupabaseAuthProvider(),
      azure: () => new AzureAuthProvider(),
    };

    providers = {
      storage: (storageMap[config.storageProvider] || storageMap.local)(),
      ai: (aiMap[config.aiProvider] || aiMap.mock)(),
      auth: (authMap[config.authMode] || authMap.demo)(),
    };

    console.log(`[Providers] storage=${config.storageProvider} ai=${config.aiProvider} auth=${config.authMode}`);
  }
  return providers;
}
