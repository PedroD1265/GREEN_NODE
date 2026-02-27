import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Button, Card, Chip } from '../../components/UI';
import { ArrowLeft, User, Building2, Camera, MapPin, Shield, Check, Upload } from 'lucide-react';
import { MATERIALS } from '../../../data/mockData';

type Phase = 'type' | 'form' | 'verifying' | 'verified';

export default function CollectorOnboarding() {
  const navigate = useNavigate();
  const { setCollectorOnboarded, collectorOnboarded } = useApp();
  const [phase, setPhase] = useState<Phase>(collectorOnboarded ? 'verified' : 'type');
  const [collectorType, setCollectorType] = useState<'ind' | 'emp' | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['PET', 'Cartón']);

  const recyclables = MATERIALS.filter(m => m.bucket === 'Reciclable');

  if (phase === 'verified' || collectorOnboarded) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-[#F7F8FA]">
        <div className="w-20 h-20 bg-[#DFF3E7] rounded-full flex items-center justify-center mb-4">
          <Shield size={40} className="text-[#0F5132]" />
        </div>
        <h2 className="text-xl font-bold text-[#0B3D2E] mb-2">Verificado (DEMO)</h2>
        <p className="text-sm text-[#4B5563] mb-6">Tu perfil de recolector está activo</p>
        <Button variant="primary" size="lg" onClick={() => { setCollectorOnboarded(true); navigate('/collector/home'); }}>
          Ir al Dashboard
        </Button>
      </div>
    );
  }

  if (phase === 'verifying') {
    setTimeout(() => setPhase('verified'), 2000);
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-[#F7F8FA]">
        <div className="w-16 h-16 border-4 border-[#0F5132] border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-lg font-bold text-[#0B3D2E]">Verificación pendiente (DEMO)</h2>
        <p className="text-sm text-[#4B5563] mt-2">Validando documentos...</p>
      </div>
    );
  }

  if (phase === 'type') {
    return (
      <div className="flex flex-col h-full bg-[#F7F8FA]">
        <div className="bg-[#0B5D6B] text-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => navigate('/')} className="p-1.5 hover:bg-white/10 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold">Registro de recolector</h1>
          </div>
          <p className="text-white/70 text-xs">Paso 1: Elige tu tipo</p>
        </div>

        <div className="p-5 space-y-4 flex-1">
          <p className="text-sm text-[#4B5563]">Qué tipo de recolector eres?</p>

          <button
            onClick={() => { setCollectorType('ind'); setPhase('form'); }}
            className="w-full text-left bg-white border-2 border-[#E5E7EB] rounded-2xl p-5 hover:border-[#0B5D6B] active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D6F2F5] rounded-full flex items-center justify-center text-[#0B5D6B]">
                <User size={24} />
              </div>
              <div>
                <p className="font-bold text-[#111827]">Independiente</p>
                <p className="text-xs text-[#4B5563]">Recolector individual con vehículo propio</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setCollectorType('emp'); setPhase('form'); }}
            className="w-full text-left bg-white border-2 border-[#E5E7EB] rounded-2xl p-5 hover:border-[#0B5D6B] active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D6F2F5] rounded-full flex items-center justify-center text-[#0B5D6B]">
                <Building2 size={24} />
              </div>
              <div>
                <p className="font-bold text-[#111827]">Empresa</p>
                <p className="text-xs text-[#4B5563]">Empresa de reciclaje con equipo y flotilla</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // FORM phase
  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <div className="bg-[#0B5D6B] text-white p-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => setPhase('type')} className="p-1.5 hover:bg-white/10 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">
            {collectorType === 'ind' ? 'Registro Independiente' : 'Registro Empresa'}
          </h1>
        </div>
        <p className="text-white/70 text-xs ml-9">Seguridad y verificación (DEMO)</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-28">
        {collectorType === 'ind' ? (
          <>
            <FormField label="Carnet de Identidad (CI)" placeholder="Ej: 1234567 CB" />
            <UploadField label="Foto de CI" />
            <UploadField label="Selfie de verificación" />
            <FormField label="Teléfono" placeholder="Ej: 70012345" />
            <UploadField label="Foto del vehículo" />
            <FormField label="Placa del vehículo" placeholder="Ej: 1234-ABC" />
            <UploadField label="Licencia de conducir" />
          </>
        ) : (
          <>
            <FormField label="Razón social" placeholder="Nombre de la empresa" />
            <FormField label="NIT (opcional)" placeholder="Ej: 123456789" />
            <FormField label="Representante legal - CI" placeholder="CI del representante" />
            <UploadField label="Foto CI representante" />
            <FormField label="Conductores" placeholder="Nombre + licencia (separar por coma)" />
            <FormField label="Vehículos" placeholder="Placa + tipo (separar por coma)" />
          </>
        )}

        {/* Common fields */}
        <Card>
          <p className="text-sm font-semibold text-[#111827] mb-3">Zona de operación</p>
          <div className="h-28 bg-[#E5E7EB] rounded-xl flex items-center justify-center relative">
            <MapPin size={24} className="text-[#0B5D6B]" />
            <span className="absolute bottom-1 text-[10px] text-[#6B7280]">Seleccionar zona (demo)</span>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-[#111827] mb-3">Materiales que aceptas</p>
          <div className="flex flex-wrap gap-2">
            {recyclables.map(m => (
              <Chip
                key={m.id}
                active={selectedMaterials.includes(m.name)}
                onClick={() => setSelectedMaterials(prev =>
                  prev.includes(m.name) ? prev.filter(x => x !== m.name) : [...prev, m.name]
                )}
              >
                {m.icon} {m.name}
              </Chip>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-[#111827] mb-3">Ventanas de recojo</p>
          <div className="space-y-2">
            {['Lun-Vie 8:00-12:00', 'Lun-Vie 14:00-18:00', 'Sáb 9:00-13:00'].map(w => (
              <label key={w} className="flex items-center gap-2 text-sm text-[#4B5563]">
                <input type="checkbox" className="accent-[#0B5D6B]" defaultChecked={w.includes('8:00')} />
                {w}
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-[#111827] mb-3">Tarifas Bs/kg</p>
          {selectedMaterials.map(m => (
            <div key={m} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
              <span className="text-sm text-[#111827]">{m}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-[#6B7280]">Bs</span>
                <input type="number" defaultValue="1.0" step="0.1" className="w-16 px-2 py-1 border border-[#E5E7EB] rounded-lg text-sm text-right bg-white" />
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-5 bg-white border-t border-[#E5E7EB]">
        <Button variant="secondary" size="lg" onClick={() => setPhase('verifying')}>
          Enviar para verificación
        </Button>
      </div>
    </div>
  );
}

function FormField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-[#4B5563] mb-1 block">{label}</label>
      <input placeholder={placeholder} className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:border-[#0B5D6B] focus:outline-none" />
    </div>
  );
}

function UploadField({ label }: { label: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-[#4B5563] mb-1 block">{label}</label>
      <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-4 flex items-center justify-center gap-2 text-[#9CA3AF] hover:border-[#0B5D6B] transition-colors cursor-pointer">
        <Upload size={16} />
        <span className="text-xs">Subir archivo (demo)</span>
      </div>
    </div>
  );
}
