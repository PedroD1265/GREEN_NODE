import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, Badge, Button } from '../../components/UI';
import { Zap } from 'lucide-react';
import { REWARDS } from '../../../data/mockData';
import { toast } from 'sonner';

export default function Rewards() {
  const { userPoints, userLevel, redeemReward } = useApp();

  // Progress to next level
  const nextLevel = userLevel === 'Bronce' ? 800 : userLevel === 'Plata' ? 2000 : 5000;
  const progress = Math.min((userPoints / nextLevel) * 100, 100);

  return (
    <div className="p-5 space-y-5 pb-4">
      {/* Points Header */}
      <div className="bg-gradient-to-br from-[#0F5132] to-[#146C43] text-white p-5 rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <p className="text-white/70 text-xs uppercase tracking-wider">Tus puntos</p>
          <Badge variant={userLevel === 'Oro' ? 'accent' : 'neutral'} className="text-[10px]">{userLevel}</Badge>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={24} className="text-[#FFF2CC]" />
          <span className="text-3xl font-bold">{userPoints}</span>
          <span className="text-white/60 text-sm">pts</span>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#FFF2CC] rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] text-white/60 mt-1">{nextLevel - userPoints} pts para {userLevel === 'Bronce' ? 'Plata' : userLevel === 'Plata' ? 'Oro' : 'siguiente nivel'}</p>
      </div>

      {/* Penalty / Bonus info */}
      <Card className="bg-[#FFF2CC]/50 border-[#C77D00]/20">
        <p className="text-xs font-semibold text-[#C77D00] mb-1">Reglas de puntos</p>
        <ul className="text-[11px] text-[#4B5563] space-y-1">
          <li className="flex items-center gap-1.5">
            <span className="text-[#16A34A]">▲</span>
            <span><strong>Bonus +10%</strong> si tu material está limpio y separado</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-[#DC2626]">▼</span>
            <span><strong>Penalización -5 pts</strong> si el material declarado no coincide</span>
          </li>
        </ul>
      </Card>

      {/* Catalog */}
      <h2 className="text-lg font-bold text-[#0B3D2E]">Catálogo de recompensas</h2>

      <div className="space-y-3">
        {REWARDS.map(rw => {
          const canRedeem = userPoints >= rw.pointsCost;
          const missing = rw.pointsCost - userPoints;
          return (
            <Card key={rw.id} className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-[#FFF2CC] rounded-2xl flex items-center justify-center text-2xl shrink-0">
                {rw.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-[#111827] truncate">{rw.name}</h4>
                <p className="text-[11px] text-[#6B7280] truncate">{rw.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-[#C77D00]">{rw.pointsCost} pts</span>
                  {!canRedeem && (
                    <span className="text-[10px] text-[#DC2626]">Te faltan {missing}</span>
                  )}
                </div>
              </div>
              <Button
                variant={canRedeem ? 'primary' : 'outline'}
                size="sm"
                disabled={!canRedeem}
                className="shrink-0"
                onClick={async () => {
                  if (!canRedeem) return;
                  const result = await redeemReward(rw.id);
                  if (result.success) {
                    toast.success(`${rw.name} canjeado!`, { description: `Te quedan ${result.remainingPoints} pts` });
                  } else {
                    toast.error('Error al canjear', { description: result.error });
                  }
                }}
              >
                {canRedeem ? 'Canjear' : 'Bloqueado'}
              </Button>
            </Card>
          );
        })}
      </div>

      <p className="text-[10px] text-[#9CA3AF] text-center">DEMO: Los canjes son simulados</p>
    </div>
  );
}
