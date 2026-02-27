import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Button, Card, Badge } from '../../components/UI';
import { ArrowLeft, Bot, Shield, Star, MapPin, CheckCircle, Clock } from 'lucide-react';
import { COLLECTORS } from '../../../data/mockData';

export default function AutoAssign() {
  const navigate = useNavigate();
  const { addCase } = useApp();
  const assigned = COLLECTORS[2]; // EcoCocha - most efficient

  const handleConfirm = async () => {
    const newId = await addCase({
      status: 'Pendiente',
      items: [{ materialId: 'm1', materialName: 'PET', bucket: 'Reciclable', estimatedKg: 3, photos: 4 }],
      totalKg: 3,
      incentive: 'Puntos',
      collectorId: assigned.id,
      collectorName: assigned.name,
      scheduledTime: 'Hoy 16:00-18:00',
      address: 'Dirección protegida',
      addressVisible: false,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      aiConfirmed: true,
      userLevel: 'Plata',
      userId: 'user-me',
      pointsEarned: 6,
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
          <h1 className="text-lg font-bold text-[#0B3D2E]">Asignación automática</h1>
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#0F5132] rounded-full flex items-center justify-center shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-[#E5E7EB]">
            <p className="text-sm text-[#111827]">He asignado al recolector más eficiente para tu zona y materiales:</p>
          </div>
        </div>

        <Card className="border-2 border-[#0F5132]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#0B5D6B] text-white rounded-full flex items-center justify-center font-bold">
              {assigned.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#111827]">{assigned.name}</span>
                <Shield size={14} className="text-[#0B5D6B]" />
              </div>
              <p className="text-xs text-[#6B7280]">{assigned.type}</p>
            </div>
            <Badge variant="primary" className="ml-auto text-[10px]">IA Asignado</Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#4B5563] mb-3">
            <span className="flex items-center gap-1"><Star size={12} className="text-[#C77D00] fill-[#C77D00]" />{assigned.rating}</span>
            <span>{assigned.completedPickups} recojos</span>
          </div>

          <div className="bg-[#DFF3E7] p-3 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#0B3D2E]">
              <Clock size={14} />
              <span className="font-medium">Ventana: Hoy 16:00-18:00</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#0B3D2E]">
              <MapPin size={14} />
              <span>Distancia óptima a tu ubicación</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#0B3D2E]">
              <CheckCircle size={14} />
              <span>Acepta todos tus materiales</span>
            </div>
          </div>
        </Card>

        <Card className="bg-[#F7F8FA]">
          <p className="text-xs font-semibold text-[#111827] mb-1">Por qué este recolector?</p>
          <ul className="text-xs text-[#4B5563] space-y-1">
            <li>- Mejor ruta/distancia para tu zona</li>
            <li>- Acepta todos tus materiales declarados</li>
            <li>- Alta calificación y auto-aceptar activado</li>
            <li>- Ventana de recojo compatible</li>
          </ul>
        </Card>
      </div>

      <div className="p-5 bg-white border-t border-[#E5E7EB]">
        <Button variant="primary" size="lg" onClick={handleConfirm}>
          Confirmar asignación
        </Button>
      </div>
    </div>
  );
}
