import { getConfig } from '../config';
import { StorageProvider } from './storage/interface';
import { LocalStorageProvider } from './storage/local';
import { AzureBlobStorageProvider } from './storage/azure';
import { AIProvider } from './ai/interface';
import { AIMockProvider } from './ai/mock';
import { AzureAIProvider } from './ai/azure';
import { AuthProvider } from './auth/interface';
import { DemoAuthProvider } from './auth/demo';
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
    providers = {
      storage: config.storageProvider === 'azure'
        ? new AzureBlobStorageProvider()
        : new LocalStorageProvider(config.uploadsDir),
      ai: config.aiProvider === 'azure'
        ? new AzureAIProvider()
        : new AIMockProvider(),
      auth: config.authMode === 'real'
        ? new AzureAuthProvider()
        : new DemoAuthProvider(),
    };
    console.log(`[Providers] storage=${config.storageProvider} ai=${config.aiProvider} auth=${config.authMode}`);
  }
  return providers;
}
