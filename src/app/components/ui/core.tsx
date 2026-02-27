import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

// --- Utilities ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

// 1. Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-95 transition-all',
      secondary: 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm active:scale-95 transition-all',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-95 transition-all',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-95 transition-all',
      outline: 'border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:scale-95 transition-all',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-lg',
      md: 'h-12 px-5 text-sm font-medium rounded-xl', // Mobile friendly touch target
      lg: 'h-14 px-8 text-base font-medium rounded-2xl',
      icon: 'h-12 w-12 flex items-center justify-center rounded-full',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// 2. Card
export const Card = ({ className, children, onClick }: { className?: string, children: React.ReactNode, onClick?: () => void }) => (
  <motion.div
    whileTap={onClick ? { scale: 0.98 } : undefined}
    onClick={onClick}
    className={cn(
      "bg-white rounded-2xl border border-gray-100 shadow-sm p-4",
      onClick && "cursor-pointer active:bg-gray-50",
      className
    )}
  >
    {children}
  </motion.div>
);

// 3. Badge
export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline', className?: string }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
    outline: 'border border-gray-200 text-gray-600',
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
};

// 4. Chip (Selectable)
export const Chip = ({ label, selected, onClick, icon: Icon }: { label: string, selected?: boolean, onClick?: () => void, icon?: any }) => (
  <button
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
      selected 
        ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
    )}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {label}
  </button>
);

// 5. Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
