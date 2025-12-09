import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "./errorHandler";
import { getEnv } from "../config/env";

export interface AuthPayload {
  sub: string;
  username: string;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return next(new HttpError(401, "ERR_UNAUTHORIZED", "Missing authorization"));
  }
  const token = auth.slice("Bearer ".length);
  const env = getEnv();
  const secret = env.AUTH_JWT_SECRET;
  if (!secret) {
    return next(new HttpError(500, "ERR_CONFIG", "JWT secret not configured"));
  }
  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    (req as any).user = payload;
    next();
  } catch (err) {
    next(new HttpError(401, "ERR_UNAUTHORIZED", "Invalid or expired token"));
  }
}

