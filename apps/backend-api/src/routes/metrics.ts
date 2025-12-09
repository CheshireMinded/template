import { Router, Request, Response } from "express";
import { getMetrics } from "../metrics/prometheus";

const router = Router();

/**
 * GET /metrics
 * Exposes Prometheus metrics endpoint
 */
router.get("/metrics", async (_req: Request, res: Response) => {
  try {
    const metrics = await getMetrics();
    res.set("Content-Type", "text/plain; version=0.0.4");
    res.send(metrics);
  } catch (error) {
    res.status(500).json({ error: true, message: "Failed to collect metrics" });
  }
});

export { router };

