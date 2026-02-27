import { Router } from 'express';
import { getConfig, validateRealModeConfig } from '../config';

const router = Router();

router.get('/health', (_req, res) => {
  const config = getConfig();
  const missingVars = config.appMode === 'real' ? validateRealModeConfig() : [];

  res.json({
    status: 'ok',
    mode: config.appMode,
    providers: {
      storage: config.storageProvider,
      ai: config.aiProvider,
      auth: config.authMode,
    },
    ...(missingVars.length > 0 && { warnings: { missingConfig: missingVars } }),
    timestamp: new Date().toISOString(),
  });
});

export default router;
