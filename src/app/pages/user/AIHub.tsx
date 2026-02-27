import React from 'react';
import { useNavigate } from 'react-router';
import { Card, Chip } from '../../components/UI';
import { Bot, Truck, Sparkles, MapPin, ArrowLeft } from 'lucide-react';

export default function AIHub() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#0F5132] text-white p-5 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/user/home')} className="p-1.5 hover:bg-white/10 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">GREEN - Asistente IA</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={28} />
          </div>
          <div>
            <p className="font-medium">Hola, soy GREEN</p>
            <p className="text-white/70 text-xs">Tu asistente de reciclaje en Cochabamba</p>
          </div>
        </div>
      </div>

      {/* Intent Buttons */}
      <div className="p-5 space-y-3 flex-1">
        <p className="text-sm text-[#4B5563] mb-1">En que te puedo ayudar?</p>

        <button
          onClick={() => navigate('/user/create-case')}
          className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform text-left hover:bg-[#F7F8FA]"
        >
          <div className="w-11 h-11 bg-[#DFF3E7] rounded-full flex items-center justify-center text-[#0F5132] shrink-0">
            <Truck size={22} />
          </div>
          <div>
            <p className="font-semibold text-[#111827] text-sm">Crear pedido de recojo</p>
            <p className="text-xs text-[#6B7280]">Te guio paso a paso para solicitar un recolector</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/user/photos')}
          className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform text-left hover:bg-[#F7F8FA]"
        >
          <div className="w-11 h-11 bg-[#D6F2F5] rounded-full flex items-center justify-center text-[#0B5D6B] shrink-0">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="font-semibold text-[#111827] text-sm">Esto se recicla?</p>
            <p className="text-xs text-[#6B7280]">Toma fotos y te digo que es y como manejarlo</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/user/centers')}
          className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform text-left hover:bg-[#F7F8FA]"
        >
          <div className="w-11 h-11 bg-[#FFF2CC] rounded-full flex items-center justify-center text-[#C77D00] shrink-0">
            <MapPin size={22} />
          </div>
          <div>
            <p className="font-semibold text-[#111827] text-sm">Precios y centros de acopio</p>
            <p className="text-xs text-[#6B7280]">Ver tarfias, centros y manejo especial</p>
          </div>
        </button>

        {/* Quick Replies */}
        <div className="mt-4">
          <p className="text-xs text-[#9CA3AF] mb-2">Materiales frecuentes</p>
          <div className="flex gap-2 flex-wrap">
            {['PET', 'Cartón', 'Vidrio', 'Aluminio'].map(m => (
              <Chip key={m} onClick={() => navigate('/user/photos')}>
                {m === 'PET' ? '🥤' : m === 'Cartón' ? '📦' : m === 'Vidrio' ? '🍾' : '🥫'} {m}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
