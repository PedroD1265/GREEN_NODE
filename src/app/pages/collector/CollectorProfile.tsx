import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Card, Badge, Button, Chip } from '../../components/UI';
import { Shield, Star, ToggleLeft, ToggleRight, Clock, MapPin, ArrowLeft } from 'lucide-react';

export default function CollectorProfile() {
  const navigate = useNavigate();
  const { activeCollector, collectorAutoAccept, toggleAutoAccept, cases, resetDemo } = useApp();

  const completedCases = cases.filter(c => c.status === 'Completado' && c.collectorId === activeCollector.id);

  return (
    <div className="p-5 space-y-4 pb-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-[#0B5D6B] text-white rounded-full flex items-center justify-center text-2xl font-bold">
          {activeCollector.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0B3D2E]">{activeCollector.name}</h1>
            <Shield size={16} className="text-[#0B5D6B]" />
          </div>
          <p className="text-xs text-[#4B5563]">{activeCollector.type}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={14} className="text-[#C77D00] fill-[#C77D00]" />
            <span className="text-sm font-semibold text-[#111827]">{activeCollector.rating}</span>
            <span className="text-xs text-[#6B7280]">- {activeCollector.completedPickups} recojos</span>
          </div>
        </div>
      </div>

      {/* Badge */}
      <Badge variant="info" className="text-xs">Verificado ✓</Badge>

      {/* Auto-accept */}
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#111827]">Auto-aceptar</p>
          <p className="text-[10px] text-[#4B5563]">Aceptar automáticamente usuarios de confianza</p>
        </div>
        <button onClick={toggleAutoAccept}>
          {collectorAutoAccept
            ? <ToggleRight size={36} className="text-[#0B5D6B]" />
            : <ToggleLeft size={36} className="text-[#9CA3AF]" />
          }
        </button>
      </Card>

      {/* Materials */}
      <Card>
        <p className="text-xs font-semibold text-[#111827] uppercase mb-2">Materiales que acepto</p>
        <div className="flex flex-wrap gap-2">
          {activeCollector.materialsAccepted.map(m => (
            <span key={m} className="text-xs bg-[#DFF3E7] text-[#0F5132] px-3 py-1 rounded-full">{m}</span>
          ))}
        </div>
      </Card>

      {/* Tariffs */}
      <Card>
        <p className="text-xs font-semibold text-[#111827] uppercase mb-2">Tarifas Bs/kg</p>
        {Object.entries(activeCollector.tariffs).map(([mat, price]) => (
          <div key={mat} className="flex justify-between py-1.5 text-sm border-b border-[#F3F4F6] last:border-0">
            <span className="text-[#4B5563]">{mat}</span>
            <span className="font-medium text-[#111827]">Bs {price}</span>
          </div>
        ))}
      </Card>

      {/* Schedule */}
      <Card>
        <p className="text-xs font-semibold text-[#111827] uppercase mb-2">Ventanas de recojo</p>
        {activeCollector.pickupWindows.map(w => (
          <div key={w} className="flex items-center gap-2 py-1.5 text-sm text-[#4B5563]">
            <Clock size={14} />
            {w}
          </div>
        ))}
      </Card>

      {/* Zone */}
      <Card>
        <p className="text-xs font-semibold text-[#111827] uppercase mb-2">Zona</p>
        <div className="flex items-center gap-2 text-sm text-[#4B5563]">
          <MapPin size={14} className="text-[#0B5D6B]" />
          {activeCollector.zone}
        </div>
      </Card>

      {/* Past pickups */}
      <Card>
        <p className="text-xs font-semibold text-[#111827] uppercase mb-2">Recojos completados ({completedCases.length})</p>
        {completedCases.length === 0 ? (
          <p className="text-xs text-[#9CA3AF]">Sin recojos completados aún (demo)</p>
        ) : (
          completedCases.slice(0, 3).map(c => (
            <div key={c.id} className="flex justify-between py-1.5 text-xs border-b border-[#F3F4F6] last:border-0">
              <span className="text-[#4B5563]">{c.items.map(i => i.materialName).join(', ')}</span>
              <span className="font-medium">{c.totalKg} kg</span>
            </div>
          ))
        )}
      </Card>

      {/* Reset Demo */}
      <Button variant="ghost" size="md" className="w-full text-[#DC2626]" onClick={() => { resetDemo(); navigate('/'); }}>
        Reiniciar Demo
      </Button>
    </div>
  );
}
