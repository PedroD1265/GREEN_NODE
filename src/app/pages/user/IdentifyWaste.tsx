import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, Badge, BucketChip } from '../../components/UI';
import { ArrowLeft, Camera, Upload, RefreshCw, CheckCircle } from 'lucide-react';
import { MATERIALS } from '../../../data/mockData';

type Step = 'guide' | 'capture' | 'analyzing' | 'result';

export default function IdentifyWaste() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('guide');

  // Mock result
  const result = {
    material: MATERIALS[0], // PET
    confidence: 0.94,
    qualityNote: 'Limpio, buen estado',
  };

  const photoSlots = ['Frontal', 'Lateral', 'Arriba', 'Detalle'];

  if (step === 'guide') {
    return (
      <div className="flex flex-col h-full bg-[#F7F8FA]">
        <div className="bg-white p-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-[#F3F4F6] rounded-full">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-[#0B3D2E]">Esto se recicla?</h1>
          </div>
        </div>

        <div className="p-5 space-y-4 flex-1">
          <Card>
            <h3 className="font-semibold text-sm text-[#111827] mb-2">Instrucciones para fotos</h3>
            <p className="text-xs text-[#4B5563] mb-3">Toma fotos claras del material para que GREEN pueda identificarlo correctamente.</p>
            <div className="bg-[#D6F2F5] p-3 rounded-xl text-xs text-[#0B5D6B]">
              Tips: Fondo limpio, buena luz, que se vea solo el material
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {photoSlots.map((slot, i) => (
              <button
                key={slot}
                onClick={() => setStep('capture')}
                className="bg-white border-2 border-dashed border-[#E5E7EB] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#0F5132] transition-colors"
              >
                <Camera size={24} className="text-[#9CA3AF]" />
                <span className="text-xs text-[#6B7280] font-medium">{slot}</span>
                {i === 0 && <span className="text-[10px] text-[#0F5132]">Requerida</span>}
              </button>
            ))}
          </div>

          <Button variant="primary" size="lg" onClick={() => {
            setStep('analyzing');
            setTimeout(() => setStep('result'), 2000);
          }}>
            <Upload size={18} />
            Analizar con IA
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'capture' || step === 'analyzing') {
    return (
      <div className="flex flex-col h-full bg-black items-center justify-center relative">
        <button onClick={() => setStep('guide')} className="absolute top-4 left-4 p-2 bg-black/40 text-white rounded-full z-50">
          <ArrowLeft size={20} />
        </button>

        <div className="w-64 h-64 border-2 border-white/40 rounded-3xl relative mb-8">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-lg" />

          {step === 'analyzing' && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-3xl backdrop-blur-sm">
              <RefreshCw className="text-[#16A34A] w-10 h-10 animate-spin mb-3" />
              <p className="text-white text-sm font-medium">Analizando...</p>
            </div>
          )}
        </div>

        {step === 'capture' && (
          <button
            onClick={() => { setStep('analyzing'); setTimeout(() => setStep('result'), 2000); }}
            className="w-16 h-16 bg-white rounded-full border-4 border-[#4B5563] flex items-center justify-center active:scale-90 transition-transform"
          >
            <div className="w-12 h-12 bg-white rounded-full border-2 border-[#111827]" />
          </button>
        )}

        <p className="text-white/50 text-xs mt-4">Apunta al residuo</p>
      </div>
    );
  }

  // RESULT step
  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <div className="bg-white p-5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('guide')} className="p-1.5 hover:bg-[#F3F4F6] rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#0B3D2E]">Resultado IA</h1>
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 overflow-y-auto pb-32">
        {/* AI Result Panel */}
        <Card className="border-l-4 border-l-[#16A34A]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wide font-semibold mb-0.5">Material detectado</p>
              <h2 className="text-2xl font-bold text-[#111827]">{result.material.name}</h2>
            </div>
            <div className="w-11 h-11 bg-[#DCFCE7] rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-[#16A34A]" />
            </div>
          </div>

          <div className="flex gap-2 mb-3 flex-wrap">
            <BucketChip bucket={result.material.bucket} icon={result.material.icon} />
            <Badge variant="neutral">Confianza: {Math.round(result.confidence * 100)}%</Badge>
          </div>

          <div className="space-y-2">
            <div className="bg-[#F7F8FA] p-3 rounded-xl">
              <p className="text-xs font-medium text-[#111827] mb-0.5">Calidad</p>
              <p className="text-xs text-[#4B5563]">{result.qualityNote}</p>
            </div>
            <div className="bg-[#DFF3E7] p-3 rounded-xl">
              <p className="text-xs font-medium text-[#0B3D2E] mb-0.5">Tip</p>
              <p className="text-xs text-[#146C43]">{result.material.tips}</p>
            </div>
          </div>
        </Card>

        {/* Confidence meter */}
        <Card>
          <p className="text-xs font-semibold text-[#111827] mb-2">Nivel de confianza</p>
          <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div className="h-full bg-[#16A34A] rounded-full transition-all" style={{ width: `${result.confidence * 100}%` }} />
          </div>
          <p className="text-[10px] text-[#9CA3AF] mt-1">{Math.round(result.confidence * 100)}% de confianza en la identificación</p>
        </Card>

        <p className="text-[10px] text-[#9CA3AF] text-center">DEMO: Esta clasificación es una simulación. Verifica normas locales.</p>
      </div>

      {/* CTAs based on bucket */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-5 bg-white border-t border-[#E5E7EB] space-y-2">
        {result.material.bucket === 'Reciclable' && (
          <Button variant="primary" size="lg" onClick={() => navigate('/user/create-case')}>
            Crear pedido de recojo
          </Button>
        )}
        {result.material.bucket === 'No aprovechable' && (
          <Button variant="outline" size="lg" onClick={() => navigate('/user/home')}>
            Marcar como desecho
          </Button>
        )}
        {(result.material.bucket === 'Peligroso' || result.material.bucket === 'Especial') && (
          <Button variant="secondary" size="lg" onClick={() => navigate('/user/centers')}>
            Ver manejo especial
          </Button>
        )}
        {result.material.bucket === 'Reciclable' && (
          <Button variant="ghost" size="lg" onClick={() => navigate('/user/home')}>
            Volver al inicio
          </Button>
        )}
      </div>
    </div>
  );
}
