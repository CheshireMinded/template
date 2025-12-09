import { Request, Response, NextFunction } from "express";
import { HttpError } from "./errorHandler";

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

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // per window

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  // Rate limiting is disabled by default in template
  // Enable by setting RATE_LIMIT_ENABLED=true in environment
  if (process.env.RATE_LIMIT_ENABLED !== "true") {
    return next();
  }

  const clientId = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  const clientData = requestCounts.get(clientId);

  if (!clientData || now > clientData.resetAt) {
    // New window or expired window
    requestCounts.set(clientId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return next();
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    throw new HttpError(
      429,
      "ERR_RATE_LIMIT",
      "Too many requests, please try again later"
    );
  }

  clientData.count++;
  next();
}

