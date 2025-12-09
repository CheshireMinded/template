import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

type ApiError = {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
};

export class HttpError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function errorHandler(
  err: Error | HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const isHttpError = err instanceof HttpError;
  const isProduction = process.env.NODE_ENV === "production";

  const payload: ApiError = {
    statusCode: isHttpError ? err.statusCode : 500,
    code: isHttpError ? err.code : "ERR_INTERNAL",
    message: isHttpError ? err.message : "Internal Server Error"
  };

  // Only include details in non-production environments
  // In production, never expose internal error details to clients
  if (isHttpError && err.details && !isProduction) {
    payload.details = err.details;
  }

  // Log full error details (including stack) for debugging
  // This goes to logs, not to the client response
  logger.error("unhandled_error", {
    error: err.message,
    stack: err.stack,
    request_id: req.requestId,
    statusCode: payload.statusCode,
    code: payload.code
  });

  // In production, never send stack traces or internal error messages to clients
  // Always use generic messages for 500 errors in production
  const clientMessage = isProduction && !isHttpError
    ? "Internal Server Error"
    : payload.message;

  res.status(payload.statusCode).json({
    error: true,
    code: payload.code,
    message: clientMessage,
    trace_id: req.requestId
  });
}

