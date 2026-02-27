import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, RefreshCw } from 'lucide-react';

export function CameraMock({ onCapture }: { onCapture: (img: string) => void }) {
  const [active, setActive] = useState(true);

  // Simulating a camera viewfinder
  return (
    <div className="relative w-full h-[60vh] bg-neutral-900 overflow-hidden rounded-3xl mt-4">
      {active && (
        <>
          <img 
            src="https://images.unsplash.com/photo-1749805339958-4b1d0f16423d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwd2F0ZXIlMjBib3R0bGUlMjBnYXJiYWdlfGVufDF8fHx8MTc3MjIxNDE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
            alt="Camera Feed" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-lg"></div>
             </div>
          </div>
          
          <div className="absolute bottom-8 w-full flex justify-center">
            <button 
              onClick={() => onCapture("https://images.unsplash.com/photo-1749805339958-4b1d0f16423d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwd2F0ZXIlMjBib3R0bGUlMjBnYXJiYWdlfGVufDF8fHx8MTc3MjIxNDE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral")}
              className="w-16 h-16 bg-white rounded-full border-4 border-neutral-300 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <div className="w-12 h-12 bg-white rounded-full border-2 border-black"></div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function AIScanningOverlay() {
  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col items-center justify-center backdrop-blur-sm rounded-3xl">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <RefreshCw className="text-green-400 w-12 h-12" />
      </motion.div>
      <p className="text-white font-medium text-lg">Analizando residuo...</p>
      <p className="text-white/60 text-sm mt-2">Identificando material</p>
    </div>
  );
}
