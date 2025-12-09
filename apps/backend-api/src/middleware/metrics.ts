import { Request, Response, NextFunction } from "express";
import { httpRequestDuration, httpRequestTotal, httpErrorsTotal } from "../metrics/prometheus";

/**
 * Middleware to collect Prometheus metrics for HTTP requests
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const route = req.route?.path || req.path || "unknown";

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const labels = {
      method: req.method,
      route: route,
      status_code: res.statusCode.toString()
    };

    // Record duration
    httpRequestDuration.observe(labels, duration);

    // Increment request counter
    httpRequestTotal.inc(labels);

    // Record errors
    if (res.statusCode >= 400) {
      const errorCode = (res.locals.errorCode as string) || "unknown";
      httpErrorsTotal.inc({
        ...labels,
        error_code: errorCode
      });
    }
  });

  next();
}

