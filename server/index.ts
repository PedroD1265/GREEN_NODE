import express from 'express';
import cors from 'cors';
import path from 'path';
import compression from 'compression';
import { getConfig, validateRealModeConfig } from './config';
import { initDb } from './db';
import { seedDb } from './db/seed';
import { getProviders } from './providers';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import casesRoutes from './routes/cases';
import collectorsRoutes from './routes/collectors';
import rewardsRoutes from './routes/rewards';
import centersRoutes from './routes/centers';
import aiRoutes from './routes/ai';

const config = getConfig();
const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/uploads', express.static(path.resolve(config.uploadsDir)));

app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api', casesRoutes);
app.use('/api', collectorsRoutes);
app.use('/api', rewardsRoutes);
app.use('/api', centersRoutes);
app.use('/api', aiRoutes);

app.use(errorHandler);

initDb();
seedDb();

const missingVars = config.appMode === 'real' ? validateRealModeConfig() : [];
if (missingVars.length > 0) {
  console.warn(`[CONFIG] Running in REAL mode with missing variables: ${missingVars.join(', ')}`);
}

getProviders();

app.listen(config.port, 'localhost', () => {
  console.log(`[API] Server running on http://localhost:${config.port} (mode: ${config.appMode})`);
});
