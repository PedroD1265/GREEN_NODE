import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card } from '../../components/UI';
import { ArrowLeft, Banknote, Star } from 'lucide-react';

export default function IncentiveChoice() {
  const navigate = useNavigate();
  const [choice, setChoice] = useState<'cash' | 'points' | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <div className="bg-white p-5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-[#F3F4F6] rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#0B3D2E]">Elige tu incentivo</h1>
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1">
        <p className="text-sm text-[#4B5563]">Como quieres recibir el valor por tus materiales?</p>

        <button
          onClick={() => setChoice('cash')}
          className={`w-full text-left rounded-2xl p-5 border-2 transition-all ${
            choice === 'cash' ? 'border-[#0F5132] bg-[#DFF3E7] shadow-md' : 'border-[#E5E7EB] bg-white hover:border-[#146C43]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${choice === 'cash' ? 'bg-[#0F5132] text-white' : 'bg-[#DFF3E7] text-[#0F5132]'}`}>
              <Banknote size={24} />
            </div>
            <div>
              <p className="font-bold text-[#111827]">Efectivo (pago al recoger)</p>
              <p className="text-xs text-[#4B5563] mt-0.5">El recolector te paga según sus tarifas Bs/kg al momento del recojo.</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setChoice('points')}
          className={`w-full text-left rounded-2xl p-5 border-2 transition-all ${
            choice === 'points' ? 'border-[#C77D00] bg-[#FFF2CC] shadow-md' : 'border-[#E5E7EB] bg-white hover:border-[#C77D00]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${choice === 'points' ? 'bg-[#C77D00] text-white' : 'bg-[#FFF2CC] text-[#C77D00]'}`}>
              <Star size={24} />
            </div>
            <div>
              <p className="font-bold text-[#111827]">Puntos (canje en recompensas)</p>
              <p className="text-xs text-[#4B5563] mt-0.5">Acumula puntos y canjea por recargas, cupones, productos eco y más.</p>
            </div>
          </div>
        </button>
      </div>

      <div className="p-5 bg-white border-t border-[#E5E7EB]">
        <Button
          variant="primary" size="lg"
          disabled={!choice}
          onClick={() => navigate(choice === 'cash' ? '/user/collector-offers' : '/user/auto-assign')}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
