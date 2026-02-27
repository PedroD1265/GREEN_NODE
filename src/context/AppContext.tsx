import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  PickupCase, CaseItem, CaseStatus, UserLevel, IncentiveType,
  DEMO_CASES, COLLECTORS, Collector
} from '../data/mockData';

interface AppContextType {
  // Mode
  mode: 'user' | 'collector';
  setMode: (m: 'user' | 'collector') => void;

  // User state
  userPoints: number;
  userLevel: UserLevel;
  userName: string;
  cases: PickupCase[];
  addCase: (c: Omit<PickupCase, 'id' | 'createdAt'>) => string;
  updateCaseStatus: (id: string, status: CaseStatus) => void;
  addPoints: (p: number) => void;

  // Collector state
  collectorId: string;
  collectorAutoAccept: boolean;
  toggleAutoAccept: () => void;
  collectorRequests: PickupCase[];
  acceptCase: (id: string) => void;
  completeCase: (id: string) => void;
  activeCollector: Collector;

  // Onboarding
  collectorOnboarded: boolean;
  setCollectorOnboarded: (v: boolean) => void;

  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'user' | 'collector'>('user');
  const [userPoints, setUserPoints] = useState(1250);
  const [cases, setCases] = useState<PickupCase[]>(DEMO_CASES);
  const [autoAccept, setAutoAccept] = useState(true);
  const [collectorOnboarded, setCollectorOnboarded] = useState(false);

  const userLevel: UserLevel = userPoints >= 2000 ? 'Oro' : userPoints >= 800 ? 'Plata' : 'Bronce';

  const addCase = (c: Omit<PickupCase, 'id' | 'createdAt'>): string => {
    const id = `CASE-${Date.now()}`;
    const newCase: PickupCase = {
      ...c,
      id,
      createdAt: Date.now(),
    };
    setCases(prev => [newCase, ...prev]);
    return id;
  };

  const updateCaseStatus = (id: string, status: CaseStatus) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const addPoints = (p: number) => setUserPoints(prev => prev + p);

  const acceptCase = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? {
      ...c, status: 'Aceptado' as CaseStatus, collectorId: 'col-3', collectorName: 'EcoCocha',
      addressVisible: true, address: 'Av. Heroínas #890, Centro'
    } : c));
  };

  const completeCase = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'Completado' as CaseStatus } : c));
  };

  const collectorRequests = cases.filter(c =>
    c.status === 'Pendiente' || c.status === 'Aceptado' || c.status === 'En camino'
  );

  const resetDemo = () => {
    setCases(DEMO_CASES);
    setUserPoints(1250);
    setAutoAccept(true);
    setCollectorOnboarded(false);
  };

  return (
    <AppContext.Provider value={{
      mode, setMode,
      userPoints, userLevel, userName: 'Ana',
      cases,
      addCase, updateCaseStatus, addPoints,
      collectorId: 'col-3',
      collectorAutoAccept: autoAccept,
      toggleAutoAccept: () => setAutoAccept(p => !p),
      collectorRequests,
      acceptCase, completeCase,
      activeCollector: COLLECTORS[2],
      collectorOnboarded, setCollectorOnboarded,
      resetDemo,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
