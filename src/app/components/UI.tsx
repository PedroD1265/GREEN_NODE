import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

// ─── BUTTON ───
export function Button({
  variant = 'primary', size = 'md', isLoading, disabled, className, children, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}) {
  const base = "inline-flex items-center justify-center font-semibold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";
  const variants: Record<string, string> = {
    primary: "bg-[#0F5132] text-white hover:bg-[#0B3D2E] shadow-lg shadow-[#0F5132]/20 rounded-[14px]",
    secondary: "bg-[#0B5D6B] text-white hover:bg-[#094B56] shadow-lg shadow-[#0B5D6B]/20 rounded-[14px]",
    ghost: "bg-transparent text-[#4B5563] hover:bg-[#F3F4F6] rounded-[14px]",
    danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C] rounded-[14px]",
    outline: "bg-transparent border-2 border-[#E5E7EB] text-[#111827] hover:border-[#D1D5DB] rounded-[14px]",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-4 text-xs gap-2",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-13 px-6 text-base w-full gap-3",
  };
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

// ─── CARD ───
export function Card({ className, children, onClick, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("bg-white rounded-[16px] shadow-sm border border-[#E5E7EB] p-4", onClick && "cursor-pointer", className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── BADGE ───
export function Badge({
  variant = 'neutral', children, className
}: {
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary' | 'info' | 'accent';
  children: React.ReactNode;
  className?: string;
}) {
  const styles: Record<string, string> = {
    success: "bg-[#DCFCE7] text-[#16A34A]",
    warning: "bg-[#FEF3C7] text-[#C77D00]",
    danger: "bg-[#FEE2E2] text-[#DC2626]",
    neutral: "bg-[#F3F4F6] text-[#6B7280]",
    primary: "bg-[#0F5132] text-white",
    info: "bg-[#DBEAFE] text-[#2563EB]",
    accent: "bg-[#FFF2CC] text-[#C77D00]",
  };
  return (
    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", styles[variant], className)}>
      {children}
    </span>
  );
}

// ─── CHIP ───
export function Chip({ active, children, onClick, color }: {
  active?: boolean; children: React.ReactNode; onClick?: () => void; color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-2 rounded-full text-sm font-medium transition-colors border whitespace-nowrap",
        active
          ? "bg-[#0F5132] text-white border-[#0F5132]"
          : "bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F7F8FA]"
      )}
      style={color && active ? { backgroundColor: color, borderColor: color } : undefined}
    >
      {children}
    </button>
  );
}

// ─── STATUS BADGE ───
export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: string; label: string }> = {
    'Pendiente': { variant: 'warning', label: 'Pendiente' },
    'Aceptado': { variant: 'info', label: 'Aceptado' },
    'En camino': { variant: 'primary', label: 'En camino' },
    'Completado': { variant: 'success', label: 'Completado' },
  };
  const c = config[status] || { variant: 'neutral', label: status };
  return <Badge variant={c.variant as any}>{c.label}</Badge>;
}

// ─── TIMELINE STEPPER ───
export function TimelineStepper({ steps, currentIdx }: { steps: string[]; currentIdx: number }) {
  return (
    <div className="relative flex justify-between px-2">
      <div className="absolute top-3 left-4 right-4 h-0.5 bg-[#E5E7EB]" />
      <div
        className="absolute top-3 left-4 h-0.5 bg-[#0F5132] transition-all duration-500"
        style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
      />
      {steps.map((step, idx) => {
        const active = idx <= currentIdx;
        const current = idx === currentIdx;
        return (
          <div key={step} className="flex flex-col items-center gap-2 z-10">
            <div className={clsx(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white",
              active ? "border-[#0F5132]" : "border-[#D1D5DB]"
            )}>
              {active && <div className={clsx("w-2.5 h-2.5 rounded-full", active ? "bg-[#0F5132]" : "bg-[#D1D5DB]")} />}
            </div>
            <span className={clsx("text-[10px] font-medium", current ? "text-[#0B3D2E]" : "text-[#9CA3AF]")}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── BUCKET CHIP ───
export function BucketChip({ bucket, icon }: { bucket: string; icon: string }) {
  const colors: Record<string, string> = {
    'Reciclable': 'bg-[#DCFCE7] text-[#16A34A]',
    'Biodegradable': 'bg-[#DFF3E7] text-[#146C43]',
    'No aprovechable': 'bg-[#F3F4F6] text-[#6B7280]',
    'Peligroso': 'bg-[#FEE2E2] text-[#DC2626]',
    'Especial': 'bg-[#FEF3C7] text-[#C77D00]',
  };
  return (
    <span className={clsx("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium", colors[bucket] || colors['No aprovechable'])}>
      {icon} {bucket}
    </span>
  );
}
