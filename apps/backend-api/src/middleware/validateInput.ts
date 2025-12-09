import { Request, Response, NextFunction } from "express";
import { HttpError } from "./errorHandler";

/**
 * Example input validation middleware
 * 
 * For production use, consider:
 * - Zod for schema validation (https://zod.dev)
 * - Joi for validation
 * - class-validator for DTO validation
 * 
 * See: docs/security/asvs-security-checklist.md
 */

export function validateEchoInput(req: Request, res: Response, next: NextFunction) {
  const { message } = req.body;

  if (typeof message !== "string") {
    throw new HttpError(400, "ERR_INVALID_BODY", "message must be a string");
  }

  if (message.trim() === "") {
    throw new HttpError(400, "ERR_INVALID_BODY", "message must be a non-empty string");
  }

  // Additional validation: max length
  if (message.length > 1000) {
    throw new HttpError(400, "ERR_INVALID_BODY", "message must be 1000 characters or less");
  }

  next();
}

