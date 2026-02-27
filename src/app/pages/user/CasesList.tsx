import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Card, StatusBadge, Badge } from '../../components/UI';

export default function CasesList() {
  const { cases } = useApp();
  const navigate = useNavigate();
  const myCases = cases.filter(c => c.userId === 'user-me');

  return (
    <div className="p-5 space-y-4">
      <h1 className="text-xl font-bold text-[#0B3D2E]">Mis Casos</h1>

      {myCases.length === 0 ? (
        <div className="text-center py-16 text-[#9CA3AF]">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">No tienes casos aún.</p>
        </div>
      ) : (
        myCases.map(c => (
          <Card key={c.id} onClick={() => navigate(`/user/case/${c.id}`)} className="active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-[#6B7280] font-mono">{c.id}</span>
              <StatusBadge status={c.status} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              {c.items.map((item, i) => (
                <span key={i} className="text-xs bg-[#F3F4F6] px-2 py-0.5 rounded-full text-[#4B5563]">
                  {item.materialName} ~{item.estimatedKg}kg
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center text-xs text-[#6B7280]">
              <span>{c.scheduledTime}</span>
              {c.aiConfirmed && <Badge variant="success" className="text-[10px]">Confirmado por IA</Badge>}
            </div>
            {c.collectorName && (
              <p className="text-xs text-[#4B5563] mt-1">Recolector: {c.collectorName}</p>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
