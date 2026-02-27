import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Card, StatusBadge, Badge, Chip } from '../../components/UI';
import { MapPin, Clock, Shield, AlertTriangle } from 'lucide-react';

export default function CollectorRequests() {
  const navigate = useNavigate();
  const { collectorRequests } = useApp();
  const [sort, setSort] = useState<'nearest' | 'value' | 'time'>('nearest');

  const pending = collectorRequests
    .filter(c => c.status === 'Pendiente')
    .sort((a, b) => {
      if (sort === 'value') return b.totalKg - a.totalKg;
      if (sort === 'time') return (a.scheduledTime || '').localeCompare(b.scheduledTime || '');
      return a.id.localeCompare(b.id); // 'nearest' - demo default by ID
    });

  return (
    <div className="p-5 space-y-4">
      <h1 className="text-xl font-bold text-[#0B3D2E]">Solicitudes</h1>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        <Chip active={sort === 'nearest'} onClick={() => setSort('nearest')}>Más cercano</Chip>
        <Chip active={sort === 'value'} onClick={() => setSort('value')}>Mejor valor</Chip>
        <Chip active={sort === 'time'} onClick={() => setSort('time')}>Ventana horaria</Chip>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-16 text-[#9CA3AF]">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">No hay solicitudes pendientes.</p>
        </div>
      ) : (
        pending.map(c => (
          <Card key={c.id} onClick={() => navigate(`/collector/request/${c.id}`)} className="active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={c.status} />
                {c.aiConfirmed && <Badge variant="success" className="text-[10px]">IA ✓</Badge>}
              </div>
              <span className="text-xs text-[#6B7280] font-mono">{c.id}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {c.items.map((item, i) => (
                <span key={i} className="text-xs bg-[#F3F4F6] px-2 py-0.5 rounded-full text-[#4B5563]">
                  {item.materialName} ~{item.estimatedKg}kg
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-[#4B5563] mb-2">
              <Badge variant={c.userLevel === 'Oro' ? 'accent' : c.userLevel === 'Plata' ? 'neutral' : 'warning'} className="text-[10px]">
                {c.userLevel}
              </Badge>
              {c.userLevel === 'Bronce' && (
                <span className="flex items-center gap-1 text-[#C77D00]">
                  <AlertTriangle size={10} />
                  Baja confianza
                </span>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-[#6B7280]">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {c.scheduledTime}
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                {c.addressVisible ? c.address : 'Dirección protegida'}
              </div>
            </div>

            {c.payoutBs && (
              <p className="text-xs font-semibold text-[#0F5132] mt-2">Pago estimado: Bs {c.payoutBs}</p>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
