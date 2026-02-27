import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { Home, Camera, ShoppingBag, Trophy, MapPin, List, User } from 'lucide-react';
import { cn } from './core';

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 flex justify-center">
    <div className="w-full max-w-[390px] bg-white shadow-xl min-h-screen relative flex flex-col pb-20">
      {children}
    </div>
  </div>
);

export const AppBar = ({ title, mode = 'user' }: { title: string, mode?: 'user' | 'collector' }) => (
  <header className={cn(
    "sticky top-0 z-50 h-16 flex items-center justify-between px-4 border-b bg-white/90 backdrop-blur-md",
    mode === 'collector' ? "border-sky-100" : "border-emerald-100"
  )}>
    <h1 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h1>
    <div className={cn(
      "px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
      mode === 'collector' ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"
    )}>
      {mode === 'collector' ? 'Recolector' : 'Usuario'}
    </div>
  </header>
);

export const BottomNav = ({ mode = 'user' }: { mode?: 'user' | 'collector' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const userItems = [
    { icon: Home, label: 'Inicio', path: '/user/home' },
    { icon: Camera, label: 'Identificar', path: '/user/scan' },
    { icon: ShoppingBag, label: 'Bolsa', path: '/user/bag' },
    { icon: Trophy, label: 'Puntos', path: '/user/points' },
  ];

  const collectorItems = [
    { icon: Home, label: 'Inicio', path: '/collector/home' },
    { icon: MapPin, label: 'Mapa', path: '/collector/map' },
    { icon: List, label: 'Historial', path: '/collector/history' },
    { icon: User, label: 'Perfil', path: '/collector/profile' },
  ];

  const items = mode === 'collector' ? collectorItems : userItems;
  const activeColor = mode === 'collector' ? 'text-sky-600' : 'text-emerald-600';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe-area-bottom flex justify-center">
      <div className="w-full max-w-[390px] flex justify-around items-center h-16 px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-90 transition-transform",
                isActive ? activeColor : "text-gray-400 hover:text-gray-600"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
