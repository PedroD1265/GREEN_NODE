import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Chip, Badge } from '../../components/UI';
import { ArrowLeft, MapPin, Phone, Clock } from 'lucide-react';
import { CENTERS, COLLECTORS, MATERIALS } from '../../../data/mockData';

type Tab = 'centros' | 'peligrosos' | 'precios';

export default function Centers() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('centros');

  const dangerousMaterials = MATERIALS.filter(m => m.bucket === 'Peligroso' || m.bucket === 'Especial');

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <div className="bg-white p-5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-[#F3F4F6] rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#0B3D2E]">Manejo especial y centros</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <Chip active={tab === 'centros'} onClick={() => setTab('centros')}>Centros de acopio</Chip>
          <Chip active={tab === 'peligrosos'} onClick={() => setTab('peligrosos')}>Peligrosos/Especiales</Chip>
          <Chip active={tab === 'precios'} onClick={() => setTab('precios')}>Precios</Chip>
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 overflow-y-auto">
        {tab === 'centros' && (
          <>
            {CENTERS.map(c => (
              <Card key={c.id}>
                <h3 className="font-semibold text-sm text-[#111827] mb-2">{c.name}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {c.materialsAccepted.map(m => (
                    <span key={m} className="text-[10px] bg-[#DFF3E7] text-[#0F5132] px-2 py-0.5 rounded-full">{m}</span>
                  ))}
                </div>
                <div className="space-y-1.5 text-xs text-[#4B5563]">
                  <div className="flex items-center gap-2"><Clock size={12} />{c.hours}</div>
                  <div className="flex items-center gap-2"><MapPin size={12} />{c.address}</div>
                  <div className="flex items-center gap-2"><Phone size={12} />{c.phone}</div>
                </div>
                {/* Mini map mock */}
                <div className="mt-3 h-20 bg-[#E5E7EB] rounded-xl flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#DFF3E7]/40 to-[#D6F2F5]/40 rounded-xl" />
                  <MapPin size={20} className="text-[#0F5132] z-10" />
                </div>
              </Card>
            ))}
          </>
        )}

        {tab === 'peligrosos' && (
          <>
            <p className="text-xs text-[#4B5563]">Estos materiales requieren manejo especial. No mezclar con reciclables comunes.</p>
            {dangerousMaterials.map(m => (
              <Card key={m.id} className={m.bucket === 'Peligroso' ? 'border-l-4 border-l-[#DC2626]' : 'border-l-4 border-l-[#F59E0B]'}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-[#111827]">{m.name}</h4>
                      <Badge variant={m.bucket === 'Peligroso' ? 'danger' : 'warning'}>
                        {m.bucket}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#4B5563]">{m.tips}</p>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab === 'precios' && (
          <>
            <p className="text-xs text-[#4B5563] mb-2">Precios referenciales derivados de tarifas de recolectores. Verifica condiciones por recolector/zona.</p>
            <Card>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="text-left py-2 text-[#6B7280] font-semibold">Material</th>
                    {COLLECTORS.map(c => (
                      <th key={c.id} className="text-right py-2 text-[#6B7280] font-semibold">{c.name.split(' ')[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['PET', 'Cartón', 'Vidrio', 'Aluminio', 'Acero/Chatarra'].map(mat => (
                    <tr key={mat} className="border-b border-[#F3F4F6]">
                      <td className="py-2 text-[#111827] font-medium">{mat}</td>
                      {COLLECTORS.map(c => (
                        <td key={c.id} className="text-right py-2 text-[#4B5563]">
                          {c.tariffs[mat] ? `Bs ${c.tariffs[mat]}` : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <p className="text-[10px] text-[#9CA3AF] italic">Puede variar según recolector/zona</p>
          </>
        )}
      </div>
    </div>
  );
}
