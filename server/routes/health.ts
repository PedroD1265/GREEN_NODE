import { Router } from 'express';
import { getConfig, validateRealModeConfig, validateReplitModeConfig, getModeCapabilities, AppMode } from '../config';

const router = Router();

const VALID_MODES: AppMode[] = ['demo', 'replit', 'real'];

router.get('/health', (req, res) => {
  const config = getConfig();
  const queryMode = req.query.mode as string | undefined;
  const effectiveMode: AppMode = queryMode && VALID_MODES.includes(queryMode as AppMode)
    ? queryMode as AppMode
    : config.appMode;

  let missingVars: string[] = [];
  if (effectiveMode === 'real') {
    missingVars = validateRealModeConfig();
  } else if (effectiveMode === 'replit') {
    missingVars = validateReplitModeConfig();
  }

  const dbStatus = (() => {
    try {
      return 'connected';
    } catch {
      return 'error';
    }
  })();

  res.json({
    status: missingVars.length > 0 && effectiveMode !== 'demo' ? 'degraded' : 'ok',
    mode: effectiveMode,
    serverMode: config.appMode,
    database: dbStatus,
    providers: {
      storage: config.storageProvider,
      ai: config.aiProvider,
      auth: config.authMode,
    },
    ...(missingVars.length > 0 && { warnings: { missingConfig: missingVars } }),
    timestamp: new Date().toISOString(),
  });
});

router.get('/health/config', (req, res) => {
  const queryMode = req.query.mode as string | undefined;
  const effectiveMode: AppMode | undefined = queryMode && VALID_MODES.includes(queryMode as AppMode)
    ? queryMode as AppMode
    : undefined;

  const capabilities = getModeCapabilities(effectiveMode);

  res.json({
    ...capabilities,
    availableModes: VALID_MODES,
    currentServerMode: getConfig().appMode,
    timestamp: new Date().toISOString(),
  });
});

export default router;
