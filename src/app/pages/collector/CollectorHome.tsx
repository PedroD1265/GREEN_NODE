import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Button, Card, Badge } from '../../components/UI';
import { Star, Truck, ClipboardList, DollarSign, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

export default function CollectorHome() {
  const navigate = useNavigate();
  const { collectorRequests, activeCollector, collectorAutoAccept, toggleAutoAccept, collectorOnboarded } = useApp();

  if (!collectorOnboarded) {
    navigate('/collector/onboarding');
    return null;
  }

  const pendingCount = collectorRequests.filter(c => c.status === 'Pendiente').length;
  const todayPickups = collectorRequests.filter(c => c.status === 'Completado').length;

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-[#0B3D2E]">Dashboard</h1>
          <p className="text-xs text-[#4B5563]">{activeCollector.zone}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#0B5D6B] text-white rounded-full flex items-center justify-center font-bold">
            {activeCollector.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827]">{activeCollector.name}</p>
            <div className="flex items-center gap-1">
              <Shield size={10} className="text-[#0B5D6B]" />
              <span className="text-[10px] text-[#0B5D6B]">Verificado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-accept toggle */}
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#111827]">Auto-aceptar</p>
          <p className="text-[10px] text-[#4B5563]">Usuarios de confianza se asignan automáticamente</p>
        </div>
        <button onClick={toggleAutoAccept} className="text-[#0B5D6B]">
          {collectorAutoAccept ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-[#9CA3AF]" />}
        </button>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-[#D6F2F5] border-[#0B5D6B]/10">
          <p className="text-[10px] text-[#0B5D6B] uppercase font-bold mb-1">Recojos hoy</p>
          <p className="text-2xl font-bold text-[#0B5D6B]">{todayPickups}</p>
        </Card>
        <Card className="bg-[#FFF2CC] border-[#C77D00]/10">
          <p className="text-[10px] text-[#C77D00] uppercase font-bold mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-[#C77D00]">{pendingCount}</p>
        </Card>
        <Card>
          <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Rating</p>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-[#C77D00] fill-[#C77D00]" />
            <span className="text-2xl font-bold text-[#111827]">{activeCollector.rating}</span>
          </div>
        </Card>
        <Card>
          <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1">Ganancias (demo)</p>
          <p className="text-2xl font-bold text-[#0F5132]">Bs 85</p>
        </Card>
      </div>

      {/* CTA */}
      <Button variant="secondary" size="lg" onClick={() => navigate('/collector/requests')}>
        <ClipboardList size={18} />
        Ver solicitudes ({pendingCount})
      </Button>

      <Button variant="outline" size="lg" onClick={() => navigate('/collector/route')}>
        <Truck size={18} />
        Iniciar ruta
      </Button>
    </div>
  );
}
