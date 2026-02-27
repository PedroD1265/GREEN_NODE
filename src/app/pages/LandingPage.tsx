import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/UI';
import { Leaf, Truck } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-b from-[#DFF3E7] to-white">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[#0F5132] rounded-3xl flex items-center justify-center mb-5 shadow-xl shadow-[#0F5132]/30 rotate-3">
          <Leaf className="text-white w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-[#0B3D2E] mb-1 tracking-tight">GREEN NODE</h1>
        <p className="text-[#4B5563] text-sm max-w-[260px]">Conectamos generadores de residuos con recolectores verificados en Cochabamba.</p>

        <div className="mt-6 px-4 py-1.5 bg-[#FFF2CC] text-[#C77D00] rounded-full text-xs font-semibold uppercase tracking-wider">
          Modo Demo
        </div>

        {/* Demo How-To */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm border border-[#E5E7EB] text-left w-full max-w-[320px]">
          <p className="text-xs font-semibold text-[#0B3D2E] mb-2">Demo usuario:</p>
          <ol className="text-[11px] text-[#4B5563] space-y-1 list-decimal list-inside">
            <li>Entra como Usuario y habla con GREEN (IA)</li>
            <li>Escanea un residuo o crea un pedido</li>
            <li>Elige incentivo y recolector</li>
            <li>Sigue el caso hasta completar con PIN</li>
            <li>Canjea recompensas con tus puntos</li>
          </ol>
          <p className="text-xs font-semibold text-[#0B5D6B] mb-2 mt-4">Demo recolector:</p>
          <ol className="text-[11px] text-[#4B5563] space-y-1 list-decimal list-inside">
            <li>Entrar como Recolector</li>
            <li>Registrar perfil y tarifas</li>
            <li>Ver solicitudes cercanas</li>
            <li>Aceptar y seguir ruta</li>
            <li>Confirmar PIN y calificar</li>
          </ol>
          <p className="text-[10px] text-[#9CA3AF] mt-2 italic">Todo es DEMO - datos ficticios</p>
        </div>
      </div>

      <div className="space-y-3 pb-8">
        <p className="text-center text-xs text-[#9CA3AF] mb-1">Selecciona un rol</p>
        <Button variant="primary" size="lg" onClick={() => navigate('/user/home')}>
          <Leaf size={20} />
          Entrar como Usuario
        </Button>
        <Button variant="secondary" size="lg" onClick={() => navigate('/collector/onboarding')}>
          <Truck size={20} />
          Entrar como Recolector
        </Button>
      </div>
    </div>
  );
}
