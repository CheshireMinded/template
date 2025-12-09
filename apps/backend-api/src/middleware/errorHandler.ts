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

  const payload: ApiError = {
    statusCode: isHttpError ? err.statusCode : 500,
    code: isHttpError ? err.code : "ERR_INTERNAL",
    message: isHttpError ? err.message : "Internal Server Error"
  };

  if (isHttpError && err.details) {
    payload.details = err.details;
  }

  logger.error("unhandled_error", {
    error: err.message,
    stack: err.stack,
    request_id: req.requestId
  });

  res.status(payload.statusCode).json({
    error: true,
    code: payload.code,
    message: payload.message,
    trace_id: req.requestId
  });
}

