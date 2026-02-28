import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, CheckCircle2, ExternalLink, ArrowLeft, Copy } from 'lucide-react';
import { getAppMode, setAppMode } from '../config/appMode';
import { api } from '../../lib/api';

interface ConfigStatus {
  mode: string;
  missingEnvVars: string[];
  database: { type: string; status: string };
  storage: { type: string; status: string };
  auth: { type: string; status: string };
  ai: { type: string; status: string };
}

const SUPABASE_STEPS = [
  'Crear una cuenta en supabase.com',
  'Crear un nuevo proyecto',
  'Copiar la URL y las API Keys del dashboard',
  'Crear un bucket de Storage llamado "evidence"',
  'Configurar las variables de entorno en Replit',
];

const ENV_VARS_INFO: Record<string, string> = {
  SUPABASE_URL: 'URL del proyecto (ej: https://xxx.supabase.co)',
  SUPABASE_ANON_KEY: 'Clave publica (anon/public key)',
  SUPABASE_SERVICE_ROLE_KEY: 'Clave de servicio (solo servidor)',
  SUPABASE_BUCKET: 'Nombre del bucket de Storage (ej: evidence)',
  EXTERNAL_AI_API_KEY: 'API Key del proveedor de IA',
  EXTERNAL_AI_ENDPOINT: 'URL del endpoint de IA',
};

export default function LaunchChecklist() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.healthConfig('real').then(data => {
      setConfig(data);
    }).catch(() => {
      setConfig({
        mode: 'real',
        missingEnvVars: Object.keys(ENV_VARS_INFO),
        database: { type: 'supabase', status: 'not_configured' },
        storage: { type: 'supabase', status: 'not_configured' },
        auth: { type: 'supabase', status: 'not_configured' },
        ai: { type: 'external', status: 'not_configured' },
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSwitchToDemo = () => {
    setAppMode('demo');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="animate-pulse text-[#9CA3AF] text-sm">Verificando configuracion...</div>
      </div>
    );
  }

  const allConfigured = config?.missingEnvVars.length === 0;

  return (
    <div className="p-5 pb-20 bg-gradient-to-b from-[#DFF3E7] to-white min-h-full">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-xs text-[#6B7280] mb-4 hover:text-[#0B3D2E]"
      >
        <ArrowLeft size={14} />
        Volver al inicio
      </button>

      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-amber-500" size={20} />
        <h1 className="text-lg font-bold text-[#0B3D2E]">Launch Checklist - Modo REAL</h1>
      </div>

      {allConfigured ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={18} />
            <span className="text-sm font-medium text-green-800">Todas las variables configuradas</span>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-amber-800">
            Faltan <strong>{config?.missingEnvVars.length}</strong> variables de entorno para el modo REAL.
            La app funciona en modo lectura hasta que se configuren.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-4">
        <h2 className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-3">Variables de Entorno</h2>
        <div className="space-y-2">
          {Object.entries(ENV_VARS_INFO).map(([key, desc]) => {
            const isMissing = config?.missingEnvVars.includes(key);
            return (
              <div key={key} className="flex items-start gap-2 text-[11px]">
                {isMissing ? (
                  <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={12} />
                ) : (
                  <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={12} />
                )}
                <div>
                  <code className="font-mono text-[10px] bg-gray-100 px-1 py-0.5 rounded">{key}</code>
                  <span className="text-[#6B7280] ml-1">{desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-4">
        <h2 className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-3">Servicios</h2>
        <div className="space-y-2">
          {config && ['database', 'storage', 'auth', 'ai'].map(svc => {
            const info = (config as any)[svc];
            const isReady = info.status === 'ready';
            return (
              <div key={svc} className="flex items-center justify-between text-[11px] py-1.5 border-b border-gray-50 last:border-0">
                <span className="capitalize font-medium text-[#374151]">{svc}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#6B7280]">{info.type}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${isReady ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {isReady ? 'OK' : 'Pendiente'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-4">
        <h2 className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-3 flex items-center gap-1">
          Quick Start - Supabase
          <ExternalLink size={10} className="text-[#6B7280]" />
        </h2>
        <ol className="space-y-2">
          {SUPABASE_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-[#4B5563]">
              <span className="w-4 h-4 rounded-full bg-[#0F5132] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <button
        onClick={handleSwitchToDemo}
        className="w-full text-center text-xs text-[#6B7280] underline py-2"
      >
        Cambiar a modo DEMO
      </button>
    </div>
  );
}
