import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Button, Card, Badge } from '../../components/UI';
import { ArrowLeft, Star, CheckCircle, Shield, Clock, Sparkles } from 'lucide-react';
import { COLLECTORS } from '../../../data/mockData';

export default function CollectorOffers() {
  const navigate = useNavigate();
  const { addCase } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    const col = COLLECTORS.find(c => c.id === selectedId);
    if (!col) return;
    const newId = addCase({
      status: 'Pendiente',
      items: [{ materialId: 'm1', materialName: 'PET', bucket: 'Reciclable', estimatedKg: 3, photos: 4 }],
      totalKg: 3,
      incentive: 'Efectivo',
      collectorId: col.id,
      collectorName: col.name,
      scheduledTime: 'Hoy 14:00-16:00',
      address: 'Dirección protegida',
      addressVisible: false,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      aiConfirmed: true,
      userLevel: 'Plata',
      userId: 'user-me',
      payoutBs: 4.5,
    });
    navigate(`/user/case/${newId}`);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <div className="bg-white p-5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-[#F3F4F6] rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#0B3D2E]">Ofertas de recolectores</h1>
        </div>
      </div>

      <div className="p-5 space-y-3 flex-1 overflow-y-auto pb-28">
        <p className="text-xs text-[#4B5563]">3 recolectores verificados disponibles para tu zona</p>

        {COLLECTORS.map(col => (
          <button
            key={col.id}
            onClick={() => setSelectedId(col.id)}
            className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${selectedId === col.id ? 'border-[#0F5132] bg-[#DFF3E7] shadow-md' : 'border-[#E5E7EB] bg-white'
              }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#0B5D6B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {col.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[#111827]">{col.name}</span>
                    {col.verified && <Shield size={14} className="text-[#0B5D6B]" />}
                  </div>
                  <p className="text-[10px] text-[#6B7280]">{col.type} - {col.zone}</p>
                </div>
              </div>
              {col.aiRecommended && (
                <Badge variant="primary" className="text-[10px]">
                  <Sparkles size={10} className="mr-1" /> IA Recomendado
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1 text-xs text-[#4B5563]">
                <Star size={12} className="text-[#C77D00] fill-[#C77D00]" />
                {col.rating}
              </div>
              <span className="text-xs text-[#9CA3AF]">|</span>
              <span className="text-xs text-[#4B5563]">{col.completedPickups} recojos</span>
              <span className="text-xs text-[#9CA3AF]">|</span>
              <div className="flex items-center gap-1 text-xs text-[#4B5563]">
                <Clock size={12} />
                {col.pickupWindows[0]}
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {Object.entries(col.tariffs).map(([mat, price]) => (
                <span key={mat} className="text-[10px] bg-[#F3F4F6] text-[#4B5563] px-2 py-0.5 rounded-full">
                  {mat}: Bs {price}/kg
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-5 bg-white border-t border-[#E5E7EB]">
        <Button variant="primary" size="lg" disabled={!selectedId} onClick={handleConfirm}>
          Confirmar recolector
        </Button>
      </div>
    </div>
  );
}
