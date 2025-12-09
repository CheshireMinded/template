import { Router, Request, Response } from "express";
import { getEnv } from "./config/env";

const router = Router();
const env = getEnv();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: env.APP_NAME,
    version: env.APP_VERSION,
    env: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

export { router };

