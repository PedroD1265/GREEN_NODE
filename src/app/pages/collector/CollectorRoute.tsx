import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../../context/AppContext';
import { Button, Card } from '../../components/UI';
import { ArrowLeft, MapPin, Phone, Navigation, CheckCircle } from 'lucide-react';

export default function CollectorRoute() {
  const navigate = useNavigate();
  const { collectorRequests, updateCaseStatus } = useApp();
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const activeCases = collectorRequests.filter(c => c.status === 'En camino' || c.status === 'Aceptado');
  const currentCase = activeCases[0];

  if (!currentCase) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-[#F7F8FA]">
        <div className="w-20 h-20 bg-[#D6F2F5] rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-[#0B5D6B]" />
        </div>
        <h2 className="text-xl font-bold text-[#0B3D2E] mb-2">Sin ruta activa</h2>
        <p className="text-sm text-[#4B5563] mb-6">Acepta solicitudes para iniciar tu ruta.</p>
        <Button variant="secondary" onClick={() => navigate('/collector/requests')}>Ver solicitudes</Button>
      </div>
    );
  }

  const handleArrived = () => {
    updateCaseStatus(currentCase.id, 'En camino');
    setShowPinInput(true);
  };

  const handleVerifyPin = () => {
    if (pin === currentCase.pin) {
      navigate(`/collector/pickup/${currentCase.id}`);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] relative">
      {/* Map background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-[#DFF3E7] to-[#D6F2F5] relative">
          {/* Grid pattern for map mock */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(#0B5D6B 1px, transparent 1px), linear-gradient(90deg, #0B5D6B 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M80 100 Q180 200 160 350 T280 500" fill="none" stroke="#0B5D6B" strokeWidth="4" strokeDasharray="8,8" opacity="0.6" />
          </svg>
          {/* Start pin */}
          <div className="absolute top-[100px] left-[80px] w-4 h-4 bg-[#0B5D6B] border-2 border-white rounded-full shadow-lg" />
          {/* End pin */}
          <div className="absolute top-[350px] left-[200px] w-8 h-8 bg-[#0F5132] border-3 border-white rounded-full shadow-xl flex items-center justify-center text-white text-[10px] font-bold">
            1
          </div>
        </div>
      </div>

      {/* Top bar */}
      <div className="relative z-10 p-4">
        <Button variant="outline" size="sm" className="bg-white shadow-md" onClick={() => navigate('/collector/home')}>
          <ArrowLeft size={14} />
          Volver
        </Button>
      </div>

      {/* Bottom sheet */}
      <div className="mt-auto relative z-10 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-5 pb-8">
        <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-5" />

        {showPinInput ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-bold text-lg text-[#0B3D2E]">Confirmar entrega</h3>
              <p className="text-xs text-[#4B5563]">Pide el PIN al usuario</p>
              <p className="text-[10px] text-[#16A34A] font-mono mt-1">Demo hint: PIN es {currentCase.pin}</p>
            </div>

            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map(idx => (
                <input
                  key={idx}
                  type="text" maxLength={1}
                  className={`w-12 h-14 border-2 rounded-xl text-center text-2xl font-bold focus:outline-none ${
                    pinError ? 'border-[#DC2626] bg-[#FEE2E2]' : 'border-[#E5E7EB] focus:border-[#0B5D6B]'
                  }`}
                  value={pin[idx] || ''}
                  onChange={e => {
                    const val = e.target.value.slice(-1);
                    const newPin = pin.split('');
                    newPin[idx] = val;
                    setPin(newPin.join(''));
                    if (val && idx < 3) {
                      const next = e.target.parentElement?.children[idx + 1] as HTMLInputElement;
                      next?.focus();
                    }
                  }}
                />
              ))}
            </div>
            {pinError && <p className="text-xs text-[#DC2626] text-center">PIN incorrecto</p>}

            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={() => { setShowPinInput(false); setPin(''); }}>Cancelar</Button>
              <Button variant="secondary" disabled={pin.length < 4} onClick={handleVerifyPin}>Validar</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B3D2E]">Recogida</h2>
                <p className="text-xs text-[#4B5563] flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {currentCase.addressVisible ? currentCase.address : 'Dirección protegida'}
                </p>
              </div>
              <button className="w-10 h-10 bg-[#D6F2F5] rounded-full flex items-center justify-center text-[#0B5D6B]">
                <Phone size={18} />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {currentCase.items.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-[#F3F4F6] rounded-full text-xs font-medium text-[#4B5563] border border-[#E5E7EB] whitespace-nowrap">
                  {item.estimatedKg}kg {item.materialName}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button variant="outline">
                <Navigation size={16} />
                Navegar
              </Button>
              <Button variant="secondary" onClick={handleArrived}>
                Llegué al punto
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
