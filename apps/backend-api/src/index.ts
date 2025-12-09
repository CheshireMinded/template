import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { getEnv } from "./config/env";
import { logger } from "./config/logger";
import { attachRequestId } from "./middleware/requestId";
import { requestLogger } from "./middleware/requestLogger";
import { rateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { router as healthRouter } from "./health";
import { router as apiRouter } from "./routes";

// Load env
const env = getEnv();

const app = express();

// Basic hardening
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
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

// Rate limiting (disabled by default, enable via RATE_LIMIT_ENABLED=true)
app.use(rateLimiter);

// Routes
app.use("/healthz", healthRouter);
app.use("/api/v1", apiRouter);

// Global error handler (must be last)
app.use(errorHandler);

const port = env.PORT;

app.listen(port, () => {
  logger.info(`API listening on port ${port} (${env.NODE_ENV})`);
});

