import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Button, Card, Badge } from '../../components/UI';
import { CheckCircle, Camera, Upload, Star } from 'lucide-react';

export default function PickupConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, completeCase } = useApp();
  const [phase, setPhase] = useState<'confirm' | 'rate'>('confirm');
  const [rating, setRating] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);

  const c = cases.find(x => x.id === id);
  if (!c) return <div className="p-5 text-center text-[#9CA3AF]">Caso no encontrado</div>;

  const handleComplete = () => {
    completeCase(c.id);
    setPhase('rate');
  };

  const issueTags = ['Material incorrecto', 'Sucio', 'Mezclado', 'Cantidad falsa'];

  if (phase === 'rate') {
    return (
      <div className="flex flex-col h-full bg-[#F7F8FA] p-5">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#DFF3E7] rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={40} className="text-[#0F5132]" />
          </div>
          <h2 className="text-xl font-bold text-[#0B3D2E] mb-2">Recojo completado!</h2>
          <p className="text-sm text-[#4B5563] mb-1">
            {c.incentive === 'Efectivo' ? `Pago: Bs ${c.payoutBs || 0}` : `Puntos: +${c.pointsEarned || 0}`}
          </p>
          <p className="text-xs text-[#6B7280] mb-6">Total: ~{c.totalKg} kg recolectados</p>

          <Card className="w-full text-left mb-4">
            <p className="text-sm font-semibold text-[#111827] mb-3">Califica al usuario</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setRating(s)} className="text-3xl transition-transform active:scale-110">
                  {s <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>

            <p className="text-xs text-[#6B7280] mb-2">Reportar problemas (opcional)</p>
            <div className="flex flex-wrap gap-2">
              {issueTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setIssues(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  className={`px-3 py-1.5 rounded-full text-xs border ${
                    issues.includes(tag) ? 'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]' : 'bg-white text-[#4B5563] border-[#E5E7EB]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#9CA3AF] mt-2 italic">Esto afecta el nivel de confianza del usuario (demo)</p>
          </Card>

          <Button variant="secondary" size="lg" onClick={() => navigate('/collector/home')}>
            Volver al dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <div className="bg-[#0B5D6B] text-white p-5">
        <h1 className="text-lg font-bold">Confirmar recojo</h1>
        <p className="text-white/70 text-xs font-mono">{c.id}</p>
      </div>

      <div className="p-5 space-y-4 flex-1">
        <Card className="border-2 border-[#0B5D6B]">
          <p className="text-xs font-semibold text-[#111827] uppercase mb-2">Resumen de recojo</p>
          {c.items.map((item, i) => (
            <div key={i} className="flex justify-between py-1.5 text-sm border-b border-[#F3F4F6] last:border-0">
              <span>{item.materialName}</span>
              <span className="font-medium">~{item.estimatedKg} kg</span>
            </div>
          ))}
          <div className="border-t border-[#E5E7EB] mt-2 pt-2 flex justify-between text-sm font-bold">
            <span>Total</span>
            <span className="text-[#0B5D6B]">~{c.totalKg} kg</span>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold text-[#111827] mb-3">Foto evidencia (opcional)</p>
          <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-[#9CA3AF]">
            <Upload size={24} />
            <span className="text-xs">Subir foto (demo)</span>
          </div>
        </Card>

        <div className="bg-[#DFF3E7] p-4 rounded-2xl">
          <p className="text-xs font-semibold text-[#0B3D2E] mb-1">
            {c.incentive === 'Efectivo' ? 'Pago al usuario' : 'Puntos para el usuario'}
          </p>
          <p className="text-xl font-bold text-[#0F5132]">
            {c.incentive === 'Efectivo' ? `Bs ${c.payoutBs || 0}` : `+${c.pointsEarned || 0} pts`}
          </p>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-[#E5E7EB]">
        <Button variant="secondary" size="lg" onClick={handleComplete}>
          <CheckCircle size={18} />
          Completar caso
        </Button>
      </div>
    </div>
  );
}
