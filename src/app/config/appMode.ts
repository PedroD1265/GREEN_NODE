export type AppMode = 'demo' | 'replit' | 'real';

export const APP_MODES: AppMode[] = ['demo', 'replit', 'real'];

const STORAGE_KEY = 'app_mode';

export function getAppMode(): AppMode {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && APP_MODES.includes(stored as AppMode)) {
      return stored as AppMode;
    }
  }

  const envMode = (import.meta as any).env?.VITE_APP_MODE as string | undefined;
  if (envMode && APP_MODES.includes(envMode as AppMode)) {
    return envMode as AppMode;
  }

  return 'demo';
}

export function setAppMode(mode: AppMode): void {
  if (!APP_MODES.includes(mode)) {
    throw new Error(`Invalid app mode: ${mode}. Must be one of: ${APP_MODES.join(', ')}`);
  }
  localStorage.setItem(STORAGE_KEY, mode);
}
