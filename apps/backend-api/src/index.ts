import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { getEnv } from "./config/env";
import { logger } from "./config/logger";
import { attachRequestId } from "./middleware/requestId";
import { requestLogger } from "./middleware/requestLogger";
import { metricsMiddleware } from "./middleware/metrics";
import { rateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { router as healthRouter } from "./health";
import { router as apiRouter } from "./routes";
import { runMigrations } from "./db/migrate";

// Load env
const env = getEnv();

const app = express();

// Basic hardening
app.use(helmet());

// CORS configuration
// SECURITY: Never use origin: '*' with credentials: true (dangerous combination)
// In production, CORS_ORIGIN must be explicitly set to your frontend domain
if (env.CORS_ORIGIN === "*") {
  throw new Error(
    "CORS_ORIGIN cannot be '*' when credentials are enabled. " +
    "Set CORS_ORIGIN to your specific frontend domain."
  );
}
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    // Additional security: explicitly set allowed methods and headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());

// Logging
if (env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Attach request ID & log basic request info
app.use(attachRequestId);
app.use(requestLogger);

// Prometheus metrics collection
app.use(metricsMiddleware);

// Rate limiting (disabled by default, enable via RATE_LIMIT_ENABLED=true)
app.use(rateLimiter);

// Routes
app.use("/healthz", healthRouter);
app.use("/api/v1", apiRouter);

// Global error handler (must be last)
app.use(errorHandler);

const port = env.PORT;

// Export app for testing
export { app };

// Only start server if not in test environment
if (env.NODE_ENV !== "test") {
  // Run migrations on startup
  runMigrations()
    .then(() => {
      app.listen(port, () => {
        logger.info(`API listening on port ${port} (${env.NODE_ENV})`);
      });
    })
    .catch((error) => {
      logger.error("Failed to start server:", error);
      process.exit(1);
    });
}

