import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Button, Card, Badge, StatusBadge } from '../../components/UI';
import { ArrowLeft, Camera, AlertTriangle, CheckCircle, MapPin, Navigation } from 'lucide-react';

export default function CollectorRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, acceptCase, updateCaseStatus } = useApp();
  const c = cases.find(x => x.id === id);

  if (!c) return <div className="p-5 text-center text-[#9CA3AF]">Solicitud no encontrada</div>;

  const handleAccept = () => {
    acceptCase(c.id);
    navigate('/collector/requests');
  };

  const handleStartRoute = () => {
    updateCaseStatus(c.id, 'En camino');
    navigate('/collector/route');
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <div className="bg-white p-5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-[#F3F4F6] rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#0B3D2E]">Detalle solicitud</h1>
            <span className="text-xs text-[#6B7280] font-mono">{c.id}</span>
          </div>
          <StatusBadge status={c.status} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-28">
        {/* Photos gallery mock */}
        <Card>
          <p className="text-xs font-semibold text-[#111827] uppercase mb-3">Fotos del material</p>
          <div className="grid grid-cols-4 gap-2">
            {['Frontal', 'Lateral', 'Arriba', 'Detalle'].map((label, i) => (
              <div key={label} className="aspect-square bg-[#F3F4F6] rounded-xl flex flex-col items-center justify-center gap-1 border border-[#E5E7EB]">
                <Camera size={16} className="text-[#9CA3AF]" />
                <span className="text-[8px] text-[#6B7280]">{label}</span>
                {i < c.items[0]?.photos && (
                  <div className="absolute"><CheckCircle size={10} className="text-[#16A34A]" /></div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Materials */}
        <Card>
          <p className="text-xs font-semibold text-[#111827] uppercase mb-2">Materiales declarados</p>
          {c.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-[#F3F4F6] last:border-0">
              <div>
                <span className="text-sm font-medium text-[#111827]">{item.materialName}</span>
                <p className="text-[10px] text-[#6B7280]">{item.bucket}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">~{item.estimatedKg} kg</span>
                {c.aiConfirmed && <p className="text-[10px] text-[#16A34A]">IA: ~{item.estimatedKg} kg</p>}
              </div>
            </div>
          ))}
        </Card>

        {/* Quality / AI flags */}
        <Card>
          <div className="flex items-center gap-2 mb-2">
            {c.aiConfirmed && <Badge variant="success">Confirmado por IA</Badge>}
            <Badge variant={c.userLevel === 'Oro' ? 'accent' : c.userLevel === 'Plata' ? 'neutral' : 'warning'}>
              Usuario {c.userLevel}
            </Badge>
          </div>
          {c.userLevel === 'Bronce' && (
            <div className="flex items-center gap-2 text-xs text-[#C77D00] bg-[#FEF3C7] p-2 rounded-lg">
              <AlertTriangle size={14} />
              Baja confianza - revisión manual recomendada
            </div>
          )}
        </Card>

        {/* Address */}
        <Card>
          <p className="text-xs font-semibold text-[#111827] uppercase mb-2">Dirección</p>
          <div className="flex items-center gap-2 text-sm text-[#4B5563]">
            <MapPin size={16} className="text-[#0B5D6B]" />
            {c.addressVisible ? c.address : 'Visible después de aceptar'}
          </div>
          <p className="text-[10px] text-[#6B7280] mt-1">Horario: {c.scheduledTime}</p>
        </Card>

        {c.payoutBs && (
          <Card className="bg-[#DFF3E7]">
            <p className="text-xs font-semibold text-[#0B3D2E]">Pago estimado: Bs {c.payoutBs}</p>
          </Card>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-5 bg-white border-t border-[#E5E7EB] space-y-2">
        {c.status === 'Pendiente' && (
          <>
            <Button variant="secondary" size="lg" onClick={handleAccept}>
              Aceptar recojo
            </Button>
            {c.userLevel === 'Bronce' && (
              <Button variant="ghost" size="lg" className="text-[#DC2626]" onClick={() => navigate(-1)}>
                Rechazar
              </Button>
            )}
          </>
        )}
        {c.status === 'Aceptado' && (
          <Button variant="secondary" size="lg" onClick={handleStartRoute}>
            <Navigation size={18} />
            Iniciar ruta
          </Button>
        )}
      </div>
    </div>
  );
}
