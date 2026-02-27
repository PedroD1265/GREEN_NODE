import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, Badge, Chip, BucketChip } from '../../components/UI';
import { ArrowLeft, Bot, Camera, MapPin, Clock, Shield, Check } from 'lucide-react';
import { MATERIALS } from '../../../data/mockData';

type ChatStep = 'material' | 'quantity' | 'photos' | 'estimate' | 'schedule' | 'address';

interface SelectedMaterial {
  name: string;
  bucket: string;
  icon: string;
  kg: number;
}

export default function CreateCase() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ChatStep>('material');
  const [selected, setSelected] = useState<SelectedMaterial[]>([]);
  const [currentMat, setCurrentMat] = useState<string | null>(null);
  const [kg, setKg] = useState('');
  const [schedule, setSchedule] = useState('');
  const [address, setAddress] = useState('');

  const recyclables = MATERIALS.filter(m => m.bucket === 'Reciclable');
  const steps: ChatStep[] = ['material', 'quantity', 'photos', 'estimate', 'schedule', 'address'];
  const stepIdx = steps.indexOf(step);

  const aiMessages: Record<ChatStep, string> = {
    material: 'Que materiales tienes para recojo? Selecciona uno o más:',
    quantity: `Cuántos kg aproximados de ${currentMat || 'material'}? Puedes usar los rangos rápidos:`,
    photos: 'Toma fotos del material (mínimo frontal). Esto me ayuda a verificar.',
    estimate: `Según tus fotos, estimo ~${selected.reduce((a, b) => a + b.kg, 0)} kg total. Puedes editar si no es correcto.`,
    schedule: 'Cuándo quieres que pasen a recoger?',
    address: 'Dónde recogemos? Tu dirección es protegida hasta la asignación.',
  };

  const handleAddMaterial = (name: string) => {
    setCurrentMat(name);
    setStep('quantity');
  };

  const handleSetKg = (val: number) => {
    const mat = MATERIALS.find(m => m.name === currentMat);
    if (mat) {
      setSelected(prev => [...prev, { name: mat.name, bucket: mat.bucket, icon: mat.icon, kg: val }]);
    }
    setKg('');
    setStep('photos');
  };

  const handleFinishPhotos = () => setStep('estimate');
  const handleConfirmEstimate = () => setStep('schedule');

  const handleSelectSchedule = (s: string) => {
    setSchedule(s);
    setStep('address');
  };

  const handleSubmitAddress = () => {
    navigate('/user/incentive');
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-[#0F5132] text-white p-4 flex items-center gap-3 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-white/10 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <Bot size={20} />
        <div>
          <p className="text-sm font-semibold">Crear pedido con GREEN</p>
          <p className="text-[10px] text-white/60">Paso {stepIdx + 1} de {steps.length}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white px-5 py-2 border-b border-[#E5E7EB] shrink-0">
        <div className="flex gap-1">
          {steps.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${i <= stepIdx ? 'bg-[#0F5132]' : 'bg-[#E5E7EB]'}`} />
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* AI Message */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-[#0F5132] rounded-full flex items-center justify-center shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-[#E5E7EB] max-w-[280px]">
            <p className="text-sm text-[#111827]">{aiMessages[step]}</p>
          </div>
        </div>

        {/* Receipt summary (sticky panel) */}
        {selected.length > 0 && (
          <Card className="bg-[#DFF3E7] border-[#16A34A]/20 sticky top-0 z-10">
            <p className="text-xs font-semibold text-[#0B3D2E] mb-2">Resumen del caso</p>
            {selected.map((s, i) => (
              <div key={i} className="flex justify-between items-center text-xs text-[#111827] py-1">
                <span>{s.icon} {s.name}</span>
                <span className="font-medium">~{s.kg} kg</span>
              </div>
            ))}
            <div className="border-t border-[#16A34A]/20 mt-2 pt-2 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-[#0B3D2E]">
                <span>Total estimado</span>
                <span>~{selected.reduce((a, b) => a + b.kg, 0)} kg</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#4B5563]">
                <span>Fotos</span>
                <span>{stepIdx >= 2 ? '2/4' : '0/4'}</span>
              </div>
              {schedule && (
                <div className="flex justify-between text-[10px] text-[#4B5563]">
                  <span>Horario</span>
                  <span>{schedule}</span>
                </div>
              )}
              <div className="flex justify-between text-[10px] text-[#4B5563]">
                <span>Dirección</span>
                <span>{address ? 'Lista' : 'Protegida hasta asignación'}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Step-specific content */}
        {step === 'material' && (
          <div className="flex flex-wrap gap-2">
            {recyclables.map(m => (
              <Chip key={m.id} onClick={() => handleAddMaterial(m.name)}>
                {m.icon} {m.name}
              </Chip>
            ))}
          </div>
        )}

        {step === 'quantity' && (
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 5, 10, 20].map(v => (
                <button key={v} onClick={() => handleSetKg(v)}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-sm font-medium hover:bg-[#DFF3E7] hover:border-[#0F5132] active:scale-95 transition-all">
                  ~{v} kg
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="number" placeholder="Otro (kg)" value={kg}
                onChange={e => setKg(e.target.value)}
                className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:border-[#0F5132] focus:outline-none"
              />
              <Button variant="primary" size="sm" onClick={() => handleSetKg(Number(kg) || 1)} disabled={!kg}>OK</Button>
            </div>
            <button className="text-xs text-[#0F5132] font-medium" onClick={() => setStep('material')}>+ Agregar otro material</button>
          </div>
        )}

        {step === 'photos' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {['Frontal', 'Lateral', 'Arriba', 'Detalle'].map((slot, i) => (
                <div key={slot} className="bg-white border-2 border-dashed border-[#E5E7EB] rounded-2xl p-5 flex flex-col items-center justify-center gap-1">
                  <Camera size={20} className="text-[#9CA3AF]" />
                  <span className="text-[10px] text-[#6B7280]">{slot}</span>
                  {i < 2 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Check size={12} className="text-[#16A34A]" />
                      <span className="text-[10px] text-[#16A34A]">OK</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button variant="primary" size="lg" onClick={handleFinishPhotos}>
              Continuar
            </Button>
          </div>
        )}

        {step === 'estimate' && (
          <div className="space-y-3">
            <Card>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success">Confirmado por IA</Badge>
              </div>
              {selected.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#E5E7EB] last:border-0">
                  <span className="text-sm">{s.icon} {s.name}</span>
                  <input
                    type="number" defaultValue={s.kg} className="w-16 px-2 py-1 border border-[#E5E7EB] rounded-lg text-sm text-right bg-white"
                    onChange={e => {
                      const newVal = Number(e.target.value);
                      setSelected(prev => prev.map((p, idx) => idx === i ? { ...p, kg: newVal } : p));
                    }}
                  />
                </div>
              ))}
            </Card>
            <Button variant="primary" size="lg" onClick={handleConfirmEstimate}>Confirmar y continuar</Button>
          </div>
        )}

        {step === 'schedule' && (
          <div className="space-y-2">
            {['Hoy 14:00 - 16:00', 'Hoy 16:00 - 18:00', 'Mañana 9:00 - 11:00', 'Mañana 14:00 - 16:00'].map(s => (
              <button key={s} onClick={() => handleSelectSchedule(s)}
                className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${schedule === s ? 'border-[#0F5132] bg-[#DFF3E7] ring-1 ring-[#0F5132]' : 'border-[#E5E7EB] bg-white hover:border-[#146C43]'
                  }`}>
                <Clock size={16} className={schedule === s ? 'text-[#0F5132]' : 'text-[#9CA3AF]'} />
                <span className="text-sm font-medium">{s}</span>
              </button>
            ))}
          </div>
        )}

        {step === 'address' && (
          <div className="space-y-3">
            <div className="bg-[#FFF2CC] p-3 rounded-xl flex items-center gap-2 text-xs text-[#C77D00]">
              <Shield size={14} />
              Dirección protegida hasta asignación
            </div>
            <input
              placeholder="Calle y número" value={address} onChange={e => setAddress(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:border-[#0F5132] focus:outline-none"
            />
            <input
              placeholder="Referencias (ej: portón azul, frente a...)"
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:border-[#0F5132] focus:outline-none"
            />
            {/* Map mock */}
            <div className="w-full h-32 bg-[#E5E7EB] rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#DFF3E7] to-[#D6F2F5] opacity-50" />
              <MapPin size={32} className="text-[#0F5132] z-10" />
              <span className="absolute bottom-2 text-[10px] text-[#6B7280]">Mapa (demo)</span>
            </div>
            <Button variant="primary" size="lg" onClick={handleSubmitAddress} disabled={!address}>
              Continuar a incentivo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
