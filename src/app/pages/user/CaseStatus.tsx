import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Button, Card, Badge, TimelineStepper } from '../../components/UI';
import { ArrowLeft, Phone, MessageSquare, Shield, Key, Star, MapPin, Camera, CheckCircle, Loader2 } from 'lucide-react';
import { COLLECTORS } from '../../../data/mockData';
import { api } from '../../../lib/api';
import { toast } from 'sonner';

export default function CaseStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, updateCaseStatus, addPoints, rateCase } = useApp();
  const [showPin, setShowPin] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);
  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const c = cases.find(x => x.id === id);
  if (!c) return <div className="p-5 text-center text-[#9CA3AF]">Caso no encontrado</div>;

  const handleEvidenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.uploadEvidence(c.id, file, 'photo');
      setEvidenceUrl(result.url);
      toast.success('Evidencia subida correctamente');
    } catch (err) {
      console.warn('[CaseStatus] Evidence upload failed:', err);
      toast.error('No se pudo subir la evidencia');
    } finally {
      setUploading(false);
    }
  };

  const steps = ['Pendiente', 'Aceptado', 'En camino', 'Completado'];
  const currentIdx = steps.indexOf(c.status);
  const collector = COLLECTORS.find(col => col.id === c.collectorId);

  const handleComplete = () => {
    updateCaseStatus(c.id, 'Completado');
    if (c.pointsEarned) addPoints(c.pointsEarned);
    setShowRating(true);
  };

  if (showRating) {
    return (
      <div className="flex flex-col h-full bg-[#F7F8FA] items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-[#DFF3E7] rounded-full flex items-center justify-center mb-4">
          <Star size={40} className="text-[#0F5132]" />
        </div>
        <h2 className="text-xl font-bold text-[#0B3D2E] mb-2">Caso completado!</h2>
        <p className="text-sm text-[#4B5563] mb-6">
          {c.incentive === 'Puntos' ? `+${c.pointsEarned || 0} puntos ganados` : `Pago: Bs ${c.payoutBs || 0}`}
        </p>

        <p className="text-sm text-[#111827] font-medium mb-3">Califica al recolector</p>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} onClick={() => setRating(s)} className="text-2xl">
              {s <= rating ? '⭐' : '☆'}
            </button>
          ))}
        </div>

        <p className="text-xs text-[#6B7280] mb-2">Reportar problemas (opcional)</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {['No puntual', 'Material no coincidió', 'Mala comunicación', 'Recojo incompleto'].map(tag => (
            <button
              key={tag}
              onClick={() => setIssues(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
              className={`px-3 py-1.5 rounded-full text-xs border ${issues.includes(tag) ? 'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]' : 'bg-white text-[#4B5563] border-[#E5E7EB]'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Photo evidence — real upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleEvidenceUpload}
        />
        {evidenceUrl ? (
          <div className="border-2 border-[#16A34A] rounded-xl p-2 flex items-center gap-3 mb-4 bg-[#F0FDF4] w-full max-w-[280px]">
            <img src={evidenceUrl} alt="Evidencia" className="w-14 h-14 rounded-lg object-cover" />
            <div className="flex-1 text-left">
              <div className="flex items-center gap-1 text-xs font-medium text-[#16A34A]">
                <CheckCircle size={12} /> Evidencia subida
              </div>
              <p className="text-[10px] text-[#6B7280] mt-0.5 truncate">{evidenceUrl.split('/').pop()}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-4 flex items-center justify-center gap-2 text-[#9CA3AF] mb-4 w-full max-w-[280px] hover:border-[#0F5132] hover:text-[#0F5132] transition-colors cursor-pointer"
          >
            {uploading ? (
              <><Loader2 size={16} className="animate-spin" /><span className="text-xs">Subiendo...</span></>
            ) : (
              <><Camera size={16} /><span className="text-xs">Subir foto evidencia (opcional)</span></>
            )}
          </button>
        )}

        <Button variant="primary" size="lg" onClick={async () => {
          if (rating > 0) {
            await rateCase(c.id, 'user', rating, issues);
            toast.success('Calificación enviada');
          }
          navigate('/user/home');
        }}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <div className="bg-white p-5 pb-8 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/user/cases')} className="p-1.5 hover:bg-[#F3F4F6] rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#0B3D2E]">Seguimiento</h1>
          <span className="text-xs text-[#6B7280] font-mono ml-auto">{c.id}</span>
        </div>
        <TimelineStepper steps={steps} currentIdx={currentIdx} />
      </div>

      <div className="p-5 space-y-4 flex-1 overflow-y-auto">
        {/* PIN Card */}
        {(c.status === 'Aceptado' || c.status === 'En camino') && (
          showPin ? (
            <Card className="bg-gradient-to-br from-[#0F5132] to-[#0B3D2E] text-white border-none text-center py-6">
              <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Tu PIN de entrega</p>
              <div className="text-4xl font-mono font-bold tracking-[0.3em] mb-3">{c.pin}</div>
              <p className="text-white/60 text-xs">Mostrar al recolector al momento del recojo</p>
              <Button variant="ghost" size="sm" className="mt-3 text-white/60 hover:text-white" onClick={() => setShowPin(false)}>
                Ocultar PIN
              </Button>
            </Card>
          ) : (
            <Button variant="primary" size="lg" onClick={() => setShowPin(true)}>
              <Key size={18} />
              Ver PIN de entrega
            </Button>
          )
        )}

        {/* Address visibility */}
        <div className="flex items-center gap-2 px-1">
          <Shield size={14} className={c.addressVisible ? 'text-[#16A34A]' : 'text-[#C77D00]'} />
          <span className="text-xs text-[#4B5563]">
            {c.addressVisible ? 'Compartida con recolector verificado ✅' : 'Dirección protegida'}
          </span>
        </div>

        {/* Collector Info */}
        {collector && currentIdx >= 1 && (
          <Card>
            <p className="text-xs text-[#6B7280] uppercase font-semibold mb-2">Tu Recolector</p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#0B5D6B] text-white rounded-full flex items-center justify-center font-bold">
                {collector.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm text-[#111827]">{collector.name}</span>
                  <Shield size={12} className="text-[#0B5D6B]" />
                </div>
                <span className="text-xs text-[#6B7280]">⭐ {collector.rating} - {collector.completedPickups} recojos</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-[#DFF3E7] text-[#0F5132] rounded-full"><Phone size={16} /></button>
                <button className="p-2 bg-[#D6F2F5] text-[#0B5D6B] rounded-full"><MessageSquare size={16} /></button>
              </div>
            </div>
          </Card>
        )}

        {/* Case details */}
        <Card>
          <p className="text-xs text-[#6B7280] uppercase font-semibold mb-2">Materiales</p>
          {c.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-[#F3F4F6] last:border-0">
              <span className="text-sm text-[#111827]">{item.materialName}</span>
              <span className="text-sm text-[#4B5563]">~{item.estimatedKg} kg</span>
            </div>
          ))}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#E5E7EB]">
            <span className="text-sm font-semibold text-[#111827]">Total</span>
            <span className="text-sm font-semibold text-[#0F5132]">~{c.totalKg} kg</span>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between text-xs text-[#4B5563]">
            <span>Incentivo</span>
            <span className="font-medium text-[#111827]">{c.incentive}</span>
          </div>
          <div className="flex justify-between text-xs text-[#4B5563] mt-1">
            <span>Horario</span>
            <span className="font-medium text-[#111827]">{c.scheduledTime}</span>
          </div>
          {c.aiConfirmed && (
            <div className="mt-2">
              <Badge variant="success">Confirmado por IA</Badge>
            </div>
          )}
        </Card>

        {/* Map mock */}
        <div className="w-full h-36 bg-[#E5E7EB] rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#DFF3E7]/50 to-[#D6F2F5]/50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-[#0F5132] rounded-full border-3 border-white shadow-lg animate-pulse" />
          </div>
          <div className="absolute bottom-2 left-3 bg-white px-2 py-1 rounded-lg text-[10px] font-medium shadow-sm">
            <MapPin size={10} className="inline mr-1" />
            Llegada estimada: 15 min
          </div>
        </div>

        {/* Complete button for demo */}
        {c.status !== 'Completado' && (
          <Button variant="primary" size="lg" onClick={handleComplete}>
            Completar caso (Demo)
          </Button>
        )}
      </div>
    </div>
  );
}
