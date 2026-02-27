import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Button, Card, Chip, Badge } from '../../components/UI';
import { ArrowLeft, Camera, Clock, MapPin, Shield, Banknote, Star } from 'lucide-react';
import { MATERIALS, getBucketForMaterial } from '../../../data/mockData';

type Step = 1 | 2 | 3 | 4 | 5;

export default function ManualCase() {
  const navigate = useNavigate();
  const { addCase, userLevel } = useApp();
  const [step, setStep] = useState<Step>(1);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [schedule, setSchedule] = useState('');
  const [address, setAddress] = useState('');
  const [incentive, setIncentive] = useState<'Efectivo' | 'Puntos' | null>(null);

  const recyclables = MATERIALS.filter(m => m.bucket === 'Reciclable');

  const toggleMaterial = (name: string) => {
    setSelectedMaterials(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  const stepTitles = ['Seleccionar material', 'Cantidad y fotos', 'Horario y dirección', 'Incentivo y ofertas', 'Confirmar'];

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <div className="bg-white p-5 border-b border-[#E5E7EB] shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => step > 1 ? setStep((step - 1) as Step) : navigate(-1)} className="p-1.5 hover:bg-[#F3F4F6] rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#0B3D2E]">{stepTitles[step - 1]}</h1>
            <p className="text-[10px] text-[#6B7280]">Paso {step} de 5</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#0F5132]' : 'bg-[#E5E7EB]'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-28">
        {step === 1 && (
          <>
            <p className="text-sm text-[#4B5563]">Qué materiales tienes? (puede variar según recolector/zona)</p>
            <div className="flex flex-wrap gap-2">
              {recyclables.map(m => (
                <Chip key={m.id} active={selectedMaterials.includes(m.name)} onClick={() => toggleMaterial(m.name)}>
                  {m.icon} {m.name}
                </Chip>
              ))}
            </div>
            {selectedMaterials.length > 0 && (
              <Card className="bg-[#DFF3E7]">
                <p className="text-xs font-medium text-[#0B3D2E]">Seleccionados: {selectedMaterials.join(', ')}</p>
              </Card>
            )}
          </>
        )}

        {step === 2 && (
          <>
            {selectedMaterials.map(name => {
              const mat = MATERIALS.find(m => m.name === name);
              return (
                <Card key={name}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{mat?.icon}</span>
                    <span className="font-semibold text-sm">{name}</span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {[1, 3, 5, 10].map(v => (
                      <button key={v} onClick={() => setQuantities(p => ({ ...p, [name]: v }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border ${quantities[name] === v ? 'bg-[#0F5132] text-white border-[#0F5132]' : 'bg-white border-[#E5E7EB]'
                          }`}>
                        ~{v}kg
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['Frontal', 'Lateral', 'Arriba', 'Detalle'].map(s => (
                      <div key={s} className="bg-[#F7F8FA] border border-dashed border-[#E5E7EB] rounded-xl p-3 flex flex-col items-center gap-1">
                        <Camera size={14} className="text-[#9CA3AF]" />
                        <span className="text-[8px] text-[#6B7280]">{s}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-[#4B5563] mb-2">Cuándo y dónde?</p>
            {['Hoy 14:00-16:00', 'Hoy 16:00-18:00', 'Mañana 9:00-11:00'].map(s => (
              <button key={s} onClick={() => setSchedule(s)}
                className={`w-full p-3 rounded-xl border flex items-center gap-3 ${schedule === s ? 'border-[#0F5132] bg-[#DFF3E7]' : 'border-[#E5E7EB] bg-white'
                  }`}>
                <Clock size={16} className={schedule === s ? 'text-[#0F5132]' : 'text-[#9CA3AF]'} />
                <span className="text-sm">{s}</span>
              </button>
            ))}
            <div className="mt-3 space-y-2">
              <input placeholder="Dirección (calle y número)" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm bg-white" />
              <div className="flex items-center gap-2 text-xs text-[#C77D00]">
                <Shield size={12} />
                Dirección protegida hasta asignación
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-sm text-[#4B5563] mb-2">¿Cómo quieres recibir el valor?</p>
            <button
              onClick={() => setIncentive('Efectivo')}
              className={`w-full text-left rounded-2xl p-5 border-2 transition-all ${incentive === 'Efectivo' ? 'border-[#0F5132] bg-[#DFF3E7] shadow-md' : 'border-[#E5E7EB] bg-white hover:border-[#146C43]'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${incentive === 'Efectivo' ? 'bg-[#0F5132] text-white' : 'bg-[#DFF3E7] text-[#0F5132]'}`}>
                  <Banknote size={24} />
                </div>
                <div>
                  <p className="font-bold text-[#111827]">Efectivo (pago al recoger)</p>
                  <p className="text-xs text-[#4B5563] mt-0.5">El recolector te paga según sus tarifas Bs/kg.</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setIncentive('Puntos')}
              className={`w-full text-left rounded-2xl p-5 border-2 transition-all ${incentive === 'Puntos' ? 'border-[#C77D00] bg-[#FFF2CC] shadow-md' : 'border-[#E5E7EB] bg-white hover:border-[#C77D00]'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${incentive === 'Puntos' ? 'bg-[#C77D00] text-white' : 'bg-[#FFF2CC] text-[#C77D00]'}`}>
                  <Star size={24} />
                </div>
                <div>
                  <p className="font-bold text-[#111827]">Puntos (canje en recompensas)</p>
                  <p className="text-xs text-[#4B5563] mt-0.5">Acumula puntos y canjea por recargas, cupones y más.</p>
                </div>
              </div>
            </button>
          </>
        )}

        {step === 5 && (
          <>
            <Card className="border-2 border-[#0F5132]">
              <h3 className="font-semibold text-sm text-[#0B3D2E] mb-3">Resumen del pedido</h3>
              {selectedMaterials.map(name => (
                <div key={name} className="flex justify-between text-xs py-1.5 border-b border-[#F3F4F6] last:border-0">
                  <span>{name}</span>
                  <span className="font-medium">~{quantities[name] || 1} kg</span>
                </div>
              ))}
              <div className="border-t border-[#E5E7EB] mt-2 pt-2 flex justify-between text-xs">
                <span>Total estimado</span>
                <span className="font-bold text-[#0F5132]">~{Object.values(quantities).reduce((a, b) => a + b, 0)} kg</span>
              </div>
              <div className="mt-2 text-xs text-[#4B5563]">
                <p>Horario: {schedule || 'No seleccionado'}</p>
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-5 bg-white border-t border-[#E5E7EB]">
        {step < 5 ? (
          <Button variant="primary" size="lg"
            disabled={(step === 1 && selectedMaterials.length === 0) || (step === 4 && !incentive)}
            onClick={() => setStep((step + 1) as Step)}>
            Continuar
          </Button>
        ) : (
          <Button variant="primary" size="lg" onClick={async () => {
            const totalKg = Object.values(quantities).reduce((a, b) => a + b, 0) || selectedMaterials.length;
            const items = selectedMaterials.map(name => {
              const mat = MATERIALS.find(m => m.name === name);
              return {
                materialId: mat?.id || '',
                materialName: name,
                bucket: getBucketForMaterial(name),
                estimatedKg: quantities[name] || 1,
                photos: 4,
              };
            });
            const newId = await addCase({
              status: 'Pendiente',
              items,
              totalKg,
              incentive: incentive || 'Efectivo',
              collectorId: '',
              collectorName: '',
              scheduledTime: schedule || 'Sin horario',
              address: address || 'Dirección protegida',
              addressVisible: false,
              pin: Math.floor(1000 + Math.random() * 9000).toString(),
              aiConfirmed: false,
              userLevel,
              userId: 'user-me',
            });
            navigate(`/user/case/${newId}`);
          }}>
            Enviar solicitud
          </Button>
        )}
      </div>
    </div>
  );
}
