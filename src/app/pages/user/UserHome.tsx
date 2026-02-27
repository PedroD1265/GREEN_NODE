import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Button, Card, Badge, StatusBadge } from '../../components/UI';
import { Plus, Bot, Gift, Info, Zap, ChevronRight, Sparkles } from 'lucide-react';

export default function UserHome() {
  const { userPoints, userLevel, userName, cases } = useApp();
  const navigate = useNavigate();

  const myCases = cases.filter(c => c.userId === 'user-me');
  const activeCase = myCases.find(c => c.status !== 'Completado');
  const levelColors = { Bronce: '#C77D00', Plata: '#6B7280', Oro: '#C77D00' };

  return (
    <div className="p-5 space-y-5 pb-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#0B3D2E]">Hola, {userName}</h1>
          <p className="text-[#4B5563] text-sm">Cochabamba, Bolivia</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#FFF2CC] text-[#C77D00] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Zap size={12} />
            {userPoints} pts
          </div>
          <Badge variant={userLevel === 'Oro' ? 'accent' : userLevel === 'Plata' ? 'neutral' : 'warning'}>
            {userLevel}
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => navigate('/user/manual-case')} className="bg-white border border-[#E5E7EB] p-4 rounded-2xl text-center hover:bg-[#F7F8FA] active:scale-95 transition-all">
          <div className="w-10 h-10 bg-[#DFF3E7] rounded-full flex items-center justify-center mx-auto mb-2 text-[#0F5132]">
            <Plus size={20} />
          </div>
          <p className="text-xs font-semibold text-[#111827]">Crear pedido</p>
        </button>
        <button onClick={() => navigate('/user/photos')} className="bg-white border border-[#E5E7EB] p-4 rounded-2xl text-center hover:bg-[#F7F8FA] active:scale-95 transition-all">
          <div className="w-10 h-10 bg-[#D6F2F5] rounded-full flex items-center justify-center mx-auto mb-2 text-[#0B5D6B]">
            <Sparkles size={20} />
          </div>
          <p className="text-xs font-semibold text-[#111827]">Se recicla?</p>
        </button>
        <button onClick={() => navigate('/user/rewards')} className="bg-white border border-[#E5E7EB] p-4 rounded-2xl text-center hover:bg-[#F7F8FA] active:scale-95 transition-all">
          <div className="w-10 h-10 bg-[#FFF2CC] rounded-full flex items-center justify-center mx-auto mb-2 text-[#C77D00]">
            <Gift size={20} />
          </div>
          <p className="text-xs font-semibold text-[#111827]">Recompensas</p>
        </button>
      </div>

      {/* Big CTA - Talk to GREEN */}
      <button
        onClick={() => navigate('/user/ai')}
        className="w-full bg-gradient-to-r from-[#0F5132] to-[#146C43] text-white p-5 rounded-2xl shadow-lg shadow-[#0F5132]/20 text-left active:scale-[0.98] transition-transform flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
          <Bot size={28} />
        </div>
        <div>
          <p className="font-bold text-base">Hablar con GREEN (IA)</p>
          <p className="text-white/70 text-xs mt-0.5">Crear pedido, identificar residuos, preguntar</p>
        </div>
        <ChevronRight size={20} className="ml-auto opacity-60" />
      </button>

      {/* Active Case */}
      {activeCase ? (
        <Card className="border-l-4 border-l-[#0F5132]" onClick={() => navigate(`/user/case/${activeCase.id}`)}>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-[#111827] text-sm">Caso activo</h4>
            <StatusBadge status={activeCase.status} />
          </div>
          <p className="text-xs text-[#4B5563] mb-1">
            {activeCase.items.map(i => `${i.materialName} ~${i.estimatedKg}kg`).join(', ')}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[#6B7280]">{activeCase.scheduledTime}</span>
            <span className="text-xs text-[#0F5132] font-medium">Ver detalles →</span>
          </div>
        </Card>
      ) : (
        <Card className="bg-[#F7F8FA] border-dashed">
          <p className="text-[#9CA3AF] text-sm text-center py-2">No tienes casos activos. Crea uno nuevo.</p>
        </Card>
      )}

      {/* Tip */}
      <div className="bg-[#D6F2F5] p-4 rounded-2xl flex gap-3 items-start">
        <Info className="text-[#0B5D6B] shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="font-semibold text-[#0B5D6B] text-xs">Tip del día</h4>
          <p className="text-[#0B5D6B] text-xs mt-1 opacity-80">Enjuaga las botellas PET antes de aplastarlas. Esto las mantiene limpias y facilita el reciclaje.</p>
        </div>
      </div>
    </div>
  );
}
