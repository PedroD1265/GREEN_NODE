
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center font-sans text-slate-900">
      <div className={cn(
        "w-full h-[100dvh] bg-white overflow-hidden relative shadow-2xl",
        "md:max-w-[390px] md:h-[844px] md:rounded-[40px] md:border-[8px] md:border-slate-800",
        className
      )}>
        {/* iOS Status Bar Mock */}
        <div className="h-11 w-full flex items-center justify-between px-6 pt-2 select-none z-50 absolute top-0 left-0 bg-transparent text-black mix-blend-difference md:text-inherit md:mix-blend-normal">
          <span className="font-semibold text-sm">9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-2.5 bg-current rounded-[1px]"></div>
            <div className="w-0.5 h-1 bg-current"></div>
          </div>
        </div>
        
        <div className="h-full w-full overflow-y-auto scrollbar-hide pb-20 pt-12">
          {children}
        </div>
      </div>
    </div>
  );
};
