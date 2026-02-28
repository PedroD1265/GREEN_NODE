import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { Button } from '../components/UI';
import { Leaf, Truck, Play, Server, Globe } from 'lucide-react';
import { AppMode, getAppMode, setAppMode } from '../config/appMode';
import { modeDescriptions } from '../config/modeDescriptions';

const modeIcons: Record<AppMode, React.ReactNode> = {
  demo: <Play size={22} />,
  replit: <Server size={22} />,
  real: <Globe size={22} />,
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginAs, setMode, appMode: currentAppMode } = useApp();
  const [selectedMode, setSelectedMode] = useState<AppMode>(getAppMode());

  const handleModeSelect = (mode: AppMode) => {
    setAppMode(mode);
    setSelectedMode(mode);
  };

  const enterApp = (targetPath: string, role: 'user' | 'collector') => {
    if (selectedMode !== currentAppMode) {
      setAppMode(selectedMode);
      window.location.href = targetPath;
      return;
    }

    if (selectedMode === 'real') {
      navigate('/launch-checklist');
      return;
    }

    return (async () => {
      await loginAs(role);
      setMode(role);
      navigate(targetPath);
    })();
  };

  const handleUserLogin = () => enterApp('/user/home', 'user');
  const handleCollectorLogin = () => enterApp('/collector/onboarding', 'collector');

  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-b from-[#DFF3E7] to-white">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[#0F5132] rounded-3xl flex items-center justify-center mb-5 shadow-xl shadow-[#0F5132]/30 rotate-3">
          <Leaf className="text-white w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-[#0B3D2E] mb-1 tracking-tight">GREEN NODE</h1>
        <p className="text-[#4B5563] text-sm max-w-[260px]">Conectamos generadores de residuos con recolectores verificados en Cochabamba.</p>

        <div className="mt-5 w-full max-w-[340px] space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Selecciona modo de operacion</p>
          {(['demo', 'replit', 'real'] as AppMode[]).map((mode) => {
            const desc = modeDescriptions[mode];
            const isSelected = selectedMode === mode;
            return (
              <button
                key={mode}
                onClick={() => handleModeSelect(mode)}
                className="w-full text-left rounded-xl p-3 border-2 transition-all flex items-start gap-3"
                style={{
                  borderColor: isSelected ? desc.color : '#E5E7EB',
                  backgroundColor: isSelected ? desc.bgColor : 'white',
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: isSelected ? desc.color : '#F3F4F6', color: isSelected ? 'white' : '#9CA3AF' }}
                >
                  {modeIcons[mode]}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold" style={{ color: isSelected ? desc.color : '#374151' }}>
                    {desc.title}
                  </div>
                  <div className="text-[10px] leading-tight mt-0.5" style={{ color: isSelected ? desc.color : '#6B7280' }}>
                    {desc.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 pb-8">
        <p className="text-center text-xs text-[#9CA3AF] mb-1">Selecciona un rol</p>
        <Button variant="primary" size="lg" onClick={handleUserLogin}>
          <Leaf size={20} />
          Entrar como Usuario
        </Button>
        <Button variant="secondary" size="lg" onClick={handleCollectorLogin}>
          <Truck size={20} />
          Entrar como Recolector
        </Button>
      </div>
    </div>
  );
}
