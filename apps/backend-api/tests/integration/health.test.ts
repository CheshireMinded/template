import request from "supertest";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import { getEnv } from "../../src/config/env";
import { attachRequestId } from "../../src/middleware/requestId";
import { requestLogger } from "../../src/middleware/requestLogger";
import { errorHandler } from "../../src/middleware/errorHandler";
import { router as healthRouter } from "../../src/health";

const env = getEnv();

// build a small in-memory app for testing
function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(attachRequestId);
  app.use(requestLogger);
  app.use("/healthz", healthRouter);
  app.use(errorHandler);
  return app;
}

describe("GET /healthz", () => {
  it("returns ok status", async () => {
    const app = createApp();
    const res = await request(app).get("/healthz");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe(env.APP_NAME);
  });
});

