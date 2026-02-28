import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import compression from "compression";
import { fileURLToPath } from "url";
import { getConfig, validateRealModeConfig } from "./config";
import { initDb } from "./db";
import { seedDb } from "./db/seed";
import { getProviders } from "./providers";
import { requestLogger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

import healthRoutes from "./routes/health";
import authRoutes from "./routes/auth";
import casesRoutes from "./routes/cases";
import collectorsRoutes from "./routes/collectors";
import rewardsRoutes from "./routes/rewards";
import centersRoutes from "./routes/centers";
import aiRoutes from "./routes/ai";

const config = getConfig();
const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/uploads", express.static(path.resolve(config.uploadsDir)));

// API routes
app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", casesRoutes);
app.use("/api", collectorsRoutes);
app.use("/api", rewardsRoutes);
app.use("/api", centersRoutes);
app.use("/api", aiRoutes);

// Serve frontend build (production)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "..", "dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback (Express 5 safe): non-API/uploads routes serve index.html
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    return res.sendFile(path.join(distPath, "index.html"));
  });
  console.log(`[Server] Serving frontend from ${distPath}`);
} else {
  console.log(
    "[Server] No dist/ found — frontend not served (run npm run build first)",
  );
}

app.use(errorHandler);

initDb();
seedDb();

const missingVars = config.appMode === "real" ? validateRealModeConfig() : [];
if (missingVars.length > 0) {
  console.warn(
    `[CONFIG] Running in REAL mode with missing variables: ${missingVars.join(", ")}`,
  );
}

if (
  config.jwtSecret === "green-node-demo-secret-change-in-production" &&
  config.appMode !== "demo"
) {
  console.warn(
    "[SECURITY] Using default JWT secret! Set JWT_SECRET in environment variables.",
  );
}

getProviders();

app.listen(config.port, "0.0.0.0", () => {
  console.log(
    `[API] Server running on http://0.0.0.0:${config.port} (mode: ${config.appMode})`,
  );
});
