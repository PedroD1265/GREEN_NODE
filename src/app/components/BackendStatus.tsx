import React from 'react';
import { Loader2, AlertTriangle, WifiOff } from 'lucide-react';
import type { AppMode } from '../config/appMode';

interface BackendStatusProps {
  status: 'connecting' | 'connected' | 'unavailable';
  appMode: AppMode;
  retryCount?: number;
}

export function BackendStatus({ status, appMode, retryCount = 0 }: BackendStatusProps) {
  if (appMode === 'demo' || status === 'connected') return null;

  if (status === 'connecting') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
        <div className="text-center p-8 max-w-[280px]">
          <Loader2 className="w-10 h-10 text-[#0F5132] animate-spin mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-[#0B3D2E] mb-1">Conectando al backend...</h3>
          <p className="text-xs text-[#6B7280]">
            {retryCount > 0
              ? `Intento ${retryCount}... El servidor esta iniciando.`
              : 'Verificando conexion con el servidor.'}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
        <div className="text-center p-8 max-w-[300px]">
          {appMode === 'real' ? (
            <>
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-[#0B3D2E] mb-1">Configuracion requerida</h3>
              <p className="text-xs text-[#6B7280] mb-4">
                El modo REAL requiere proveedores externos configurados. Verifica las variables de entorno.
              </p>
            </>
          ) : (
            <>
              <WifiOff className="w-10 h-10 text-red-400 mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-[#0B3D2E] mb-1">Backend no disponible</h3>
              <p className="text-xs text-[#6B7280] mb-4">
                No se pudo conectar al servidor. Intenta recargar la pagina o cambia a modo DEMO.
              </p>
            </>
          )}
          <button
            onClick={() => window.location.reload()}
            className="text-xs px-4 py-2 bg-[#0F5132] text-white rounded-lg hover:bg-[#0B3D2E] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return null;
}
