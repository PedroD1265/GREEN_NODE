import React from 'react';
import { Loader2, AlertTriangle, WifiOff, ArrowLeft, Play } from 'lucide-react';
import { setAppMode } from '../config/appMode';
import type { AppMode } from '../config/appMode';

interface BackendStatusProps {
  status: 'connecting' | 'connected' | 'unavailable';
  appMode: AppMode;
  retryCount?: number;
  maxRetries?: number;
  onRetry?: () => void;
}

function goToModeSelector() {
  setAppMode('demo');
  window.location.href = '/';
}

export function BackendStatus({ status, appMode, retryCount = 0, maxRetries = 5, onRetry }: BackendStatusProps) {
  if (appMode === 'demo' || status === 'connected') return null;

  if (status === 'connecting') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
        <div className="text-center p-8 max-w-[280px]">
          <Loader2 className="w-10 h-10 text-[#0F5132] animate-spin mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-[#0B3D2E] mb-1">Conectando al backend...</h3>
          <p className="text-xs text-[#6B7280] mb-2">
            {retryCount > 0
              ? `Intento ${retryCount}/${maxRetries}... El servidor esta iniciando.`
              : 'Verificando conexion con el servidor.'}
          </p>
          <button
            onClick={goToModeSelector}
            className="text-xs text-[#6B7280] hover:text-[#0F5132] underline underline-offset-2 mt-2 inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={12} />
            Volver a seleccion de modos
          </button>
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
              <p className="text-xs text-[#6B7280] mb-2">
                No se pudo conectar despues de {maxRetries} intentos.
              </p>
            </>
          )}
          <div className="flex flex-col gap-2 items-center">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs px-4 py-2 bg-[#0F5132] text-white rounded-lg hover:bg-[#0B3D2E] transition-colors"
              >
                Reintentar ({maxRetries} intentos)
              </button>
            )}
            <button
              onClick={goToModeSelector}
              className="text-xs px-4 py-2 text-[#6B7280] hover:text-[#0F5132] underline underline-offset-2 inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={12} />
              Volver a seleccion de modos
            </button>
            <button
              onClick={goToModeSelector}
              className="text-xs px-4 py-2 text-amber-600 hover:text-amber-800 inline-flex items-center gap-1 transition-colors font-medium"
            >
              <Play size={12} />
              Forzar modo DEMO
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
