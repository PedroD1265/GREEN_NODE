import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { clsx } from 'clsx';
import { Home, Bot, ClipboardList, Gift, Truck, List, User, MapPin } from 'lucide-react';

export function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isUser = location.pathname.startsWith('/user');
  const isCollector = location.pathname.startsWith('/collector');
  const showNav = location.pathname !== '/' && (isUser || isCollector);

  // Hide nav on certain full-screen pages
  const hideNavPaths = ['/user/photos', '/user/create-case', '/collector/onboarding'];
  const shouldHideNav = hideNavPaths.some(p => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#111827] bg-[#F7F8FA]">
      {/* Status Bar */}
      <div className={clsx(
        "h-11 w-full flex items-center justify-between px-6 shrink-0",
        isUser ? "bg-[#0B3D2E] text-white" : isCollector ? "bg-[#0B5D6B] text-white" : "bg-white text-[#111827]"
      )}>
        <span className="text-xs font-medium">9:41</span>
        <div className="flex gap-1 items-center">
          <div className="w-4 h-2 border border-current rounded-sm opacity-60"><div className="w-2.5 h-1 bg-current rounded-sm m-px" /></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto relative scrollbar-hide">
        <Outlet />
      </div>

      {/* Bottom Nav */}
      {showNav && !shouldHideNav && (
        <div className="h-[72px] bg-white border-t border-[#E5E7EB] flex items-start justify-around pt-2 shrink-0 pb-5">
          {isUser ? (
            <>
              <NavItem icon={Home} label="Inicio" path="/user/home" active={location.pathname === '/user/home'} />
              <NavItem icon={Bot} label="IA" path="/user/ai" active={location.pathname === '/user/ai'} />
              <NavItem icon={ClipboardList} label="Casos" path="/user/cases" active={location.pathname.startsWith('/user/case')} />
              <NavItem icon={Gift} label="Recompensas" path="/user/rewards" active={location.pathname === '/user/rewards'} />
            </>
          ) : (
            <>
              <NavItem icon={Home} label="Inicio" path="/collector/home" active={location.pathname === '/collector/home'} color="#0B5D6B" />
              <NavItem icon={List} label="Solicitudes" path="/collector/requests" active={location.pathname.startsWith('/collector/request')} color="#0B5D6B" />
              <NavItem icon={MapPin} label="Ruta" path="/collector/route" active={location.pathname === '/collector/route'} color="#0B5D6B" />
              <NavItem icon={User} label="Perfil" path="/collector/profile" active={location.pathname === '/collector/profile'} color="#0B5D6B" />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function NavItem({ icon: Icon, label, path, active, color = '#0F5132' }: {
  icon: any; label: string; path: string; active: boolean; color?: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="flex flex-col items-center justify-center w-16 gap-1 transition-colors"
      style={{ color: active ? color : '#9CA3AF' }}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
