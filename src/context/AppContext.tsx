import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  PickupCase, CaseItem, CaseStatus, UserLevel, IncentiveType,
  DEMO_CASES, COLLECTORS, Collector
} from '../data/mockData';
import { api, setAuthToken, getAuthToken } from '../lib/api';
import { AppMode, getAppMode } from '../app/config/appMode';

type BackendStatus = 'connecting' | 'connected' | 'unavailable';

interface AppContextType {
  mode: 'user' | 'collector';
  setMode: (m: 'user' | 'collector') => void;

  appMode: AppMode;
  backendStatus: BackendStatus;
  retryCount: number;

  userPoints: number;
  userLevel: UserLevel;
  userName: string;
  userId: string;
  cases: PickupCase[];
  addCase: (c: Omit<PickupCase, 'id' | 'createdAt'>) => Promise<string>;
  updateCaseStatus: (id: string, status: CaseStatus) => void;
  addPoints: (p: number) => void;

  collectorId: string;
  collectorAutoAccept: boolean;
  toggleAutoAccept: () => void;
  collectorRequests: PickupCase[];
  acceptCase: (id: string) => void;
  completeCase: (id: string) => void;
  activeCollector: Collector;

  collectorOnboarded: boolean;
  setCollectorOnboarded: (v: boolean) => void;

  redeemReward: (rewardId: string) => Promise<{ success: boolean; remainingPoints?: number; error?: string }>;
  rateCase: (caseId: string, fromRole: string, stars: number, issues: string[]) => Promise<void>;

  isLoggedIn: boolean;
  loginAs: (role: 'user' | 'collector' | 'admin') => Promise<void>;
  logout: () => void;

  refreshCases: () => Promise<void>;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MAX_RETRIES = 5;
const RETRY_BASE_MS = 1000;

async function waitForBackend(maxRetries: number, onRetry: (n: number) => void, appMode?: string): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await api.health();
      if (appMode === 'real' && result.status === 'degraded') {
        return true;
      }
      return true;
    } catch {
      onRetry(i + 1);
      await new Promise(r => setTimeout(r, RETRY_BASE_MS * Math.pow(1.5, i)));
    }
  }
  return false;
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'user' | 'collector'>('user');
  const [appMode] = useState<AppMode>(getAppMode());
  const [backendStatus, setBackendStatus] = useState<BackendStatus>(appMode === 'demo' ? 'connected' : 'connecting');
  const [retryCount, setRetryCount] = useState(0);
  const [userPoints, setUserPoints] = useState(1250);
  const [userName, setUserName] = useState('Ana');
  const [userId, setUserId] = useState('user-me');
  const [cases, setCases] = useState<PickupCase[]>(DEMO_CASES);
  const [autoAccept, setAutoAccept] = useState(true);
  const [collectorOnboarded, setCollectorOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userLevel: UserLevel = userPoints >= 2000 ? 'Oro' : userPoints >= 800 ? 'Plata' : 'Bronce';

  const refreshCases = useCallback(async () => {
    try {
      const data = await api.getCases();
      setCases(data);
    } catch {
      if (appMode !== 'demo') {
        console.warn('[AppContext] Failed to fetch cases from API');
      }
    }
  }, [appMode]);

  const loginAs = useCallback(async (role: 'user' | 'collector' | 'admin') => {
    try {
      const result = await api.login(role);
      setAuthToken(result.token);
      setIsLoggedIn(true);
      if (role === 'user' || role === 'admin') {
        setUserName(result.user.name);
        setUserId(result.user.id);
        setUserPoints(result.user.points);
      }
      await refreshCases();
    } catch (err) {
      if (appMode === 'demo') {
        console.warn('[AppContext] Login failed, continuing in local demo mode');
      } else {
        console.error('[AppContext] Login failed in', appMode, 'mode:', err);
      }
    }
  }, [refreshCases, appMode]);

  const logout = useCallback(() => {
    setAuthToken(null);
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      if (appMode === 'demo') {
        const token = getAuthToken();
        if (token) {
          try {
            const user = await api.getMe();
            setIsLoggedIn(true);
            setUserName(user.name);
            setUserId(user.id);
            setUserPoints(user.points);
            await refreshCases();
            setBackendStatus('connected');
          } catch {
            setAuthToken(null);
            setBackendStatus('connected');
          }
        } else {
          try {
            await api.health();
            await loginAs('user');
            setBackendStatus('connected');
          } catch {
            console.warn('[AppContext] API not available, using mock data');
            setBackendStatus('connected');
          }
        }
        return;
      }

      const connected = await waitForBackend(MAX_RETRIES, (n) => setRetryCount(n), appMode);
      if (!connected) {
        setBackendStatus('unavailable');
        if (appMode === 'replit') {
          console.error('[AppContext] Backend unavailable in FULL REPLIT mode');
        }
        return;
      }

      setBackendStatus('connected');
      setRetryCount(0);

      const token = getAuthToken();
      if (token) {
        try {
          const user = await api.getMe();
          setIsLoggedIn(true);
          setUserName(user.name);
          setUserId(user.id);
          setUserPoints(user.points);
          await refreshCases();
        } catch {
          setAuthToken(null);
          await loginAs('user');
        }
      } else {
        await loginAs('user');
      }
    };

    init();
  }, []);

  const addCase = async (c: Omit<PickupCase, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const result = await api.createCase({
        items: c.items,
        totalKg: c.totalKg,
        incentive: c.incentive,
        scheduledTime: c.scheduledTime,
        address: c.address,
        addressVisible: c.addressVisible,
        aiConfirmed: c.aiConfirmed,
        userLevel: c.userLevel,
        userId: c.userId || userId,
        pin: c.pin,
      });
      await refreshCases();
      return result.id;
    } catch {
      if (appMode === 'demo') {
        const id = `CASE-${Date.now()}`;
        const newCase: PickupCase = { ...c, id, createdAt: Date.now() };
        setCases(prev => [newCase, ...prev]);
        return id;
      }
      throw new Error('No se pudo crear el caso');
    }
  };

  const updateCaseStatus = (id: string, status: CaseStatus) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    api.updateCase(id, { status }).then(() => refreshCases()).catch(() => {});
  };

  const addPoints = (p: number) => {
    setUserPoints(prev => prev + p);
    api.updatePoints(p).catch(() => {});
  };

  const acceptCase = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? {
      ...c, status: 'Aceptado' as CaseStatus, collectorId: 'col-3', collectorName: 'EcoCocha',
      addressVisible: true, address: 'Av. Heroinas #890, Centro'
    } : c));
    api.updateCase(id, {
      status: 'Aceptado',
      collectorId: 'col-3',
      collectorName: 'EcoCocha',
      addressVisible: true,
      address: 'Av. Heroinas #890, Centro',
    }).then(() => refreshCases()).catch(() => {});
  };

  const completeCase = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'Completado' as CaseStatus } : c));
    api.updateCase(id, { status: 'Completado' }).then(() => refreshCases()).catch(() => {});
  };

  const collectorRequests = cases.filter(c =>
    c.status === 'Pendiente' || c.status === 'Aceptado' || c.status === 'En camino'
  );

  const redeemReward = async (rewardId: string) => {
    try {
      const result = await api.redeemReward(userId, rewardId);
      setUserPoints(result.remainingPoints);
      return { success: true, remainingPoints: result.remainingPoints };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const rateCaseFn = async (caseId: string, fromRole: string, stars: number, issues: string[]) => {
    try {
      await api.rateCase(caseId, { fromRole, stars, issues });
    } catch {
      console.warn('[AppContext] Rating failed to save to API');
    }
  };

  const resetDemo = () => {
    setCases(DEMO_CASES);
    setUserPoints(1250);
    setAutoAccept(true);
    setCollectorOnboarded(false);
  };

  return (
    <AppContext.Provider value={{
      mode, setMode,
      appMode, backendStatus, retryCount,
      userPoints, userLevel, userName, userId,
      cases,
      addCase, updateCaseStatus, addPoints,
      collectorId: 'col-3',
      collectorAutoAccept: autoAccept,
      toggleAutoAccept: () => {
        setAutoAccept(p => !p);
        api.updateCollector('col-3', { autoAccept: !autoAccept }).catch(() => {});
      },
      collectorRequests,
      acceptCase, completeCase,
      activeCollector: COLLECTORS[2],
      collectorOnboarded, setCollectorOnboarded,
      redeemReward,
      rateCase: rateCaseFn,
      isLoggedIn, loginAs, logout,
      refreshCases,
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
