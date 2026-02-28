import type { AppMode } from './appMode';

export interface ModeDescription {
  mode: AppMode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export const modeDescriptions: Record<AppMode, ModeDescription> = {
  demo: {
    mode: 'demo',
    title: 'DEMO',
    description: 'Datos ficticios, sin backend real. Ideal para explorar la app.',
    color: '#C77D00',
    bgColor: '#FFF2CC',
    borderColor: '#F5D880',
    icon: 'play',
  },
  replit: {
    mode: 'replit',
    title: 'FULL REPLIT',
    description: 'Backend completo con DB SQLite/Postgres en Replit. Datos persistentes.',
    color: '#0969DA',
    bgColor: '#DBEAFE',
    borderColor: '#93C5FD',
    icon: 'server',
  },
  real: {
    mode: 'real',
    title: 'REAL',
    description: 'Proveedores externos (Supabase, Azure). Para producción.',
    color: '#0F5132',
    bgColor: '#D1FAE5',
    borderColor: '#6EE7B7',
    icon: 'globe',
  },
};
