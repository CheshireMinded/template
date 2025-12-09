import { Request, Response, NextFunction } from "express";
import { HttpError } from "./errorHandler";
import { getEnv } from "../config/env";

/**
 * Simple rate limiter middleware (example implementation)
 * 
 * For production use, consider:
 * - redis-rate-limiter for distributed systems
 * - express-rate-limit with Redis store
 * - Per-route rate limits
 * 
 * See: docs/security/security-headers.md
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const env = getEnv();

  // Rate limiting is enabled by default in staging/production, disabled in dev
  if (!env.RATE_LIMIT_ENABLED) {
    return next();
  }

  const clientId = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  const clientData = requestCounts.get(clientId);

  if (!clientData || now > clientData.resetAt) {
    // New window or expired window
    requestCounts.set(clientId, {
      count: 1,
      resetAt: now + env.RATE_LIMIT_WINDOW_MS
    });
    return next();
  }

  if (clientData.count >= env.RATE_LIMIT_MAX_REQUESTS) {
    throw new HttpError(
      429,
      "ERR_RATE_LIMIT",
      "Too many requests, please try again later"
    );
  }

  clientData.count++;
  next();
}
