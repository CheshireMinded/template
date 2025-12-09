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

/**
 * Validate Todo creation input
 */
export function validateCreateTodoInput(req: Request, res: Response, next: NextFunction) {
  const { title, description } = req.body;

  if (typeof title !== "string") {
    throw new HttpError(400, "ERR_INVALID_BODY", "title must be a string");
  }

  if (title.trim() === "") {
    throw new HttpError(400, "ERR_INVALID_BODY", "title must be a non-empty string");
  }

  if (title.length > 200) {
    throw new HttpError(400, "ERR_INVALID_BODY", "title must be 200 characters or less");
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new HttpError(400, "ERR_INVALID_BODY", "description must be a string");
    }

    if (description.length > 1000) {
      throw new HttpError(400, "ERR_INVALID_BODY", "description must be 1000 characters or less");
    }
  }

  next();
}

/**
 * Validate Todo update input
 */
export function validateUpdateTodoInput(req: Request, res: Response, next: NextFunction) {
  const { title, description, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string") {
      throw new HttpError(400, "ERR_INVALID_BODY", "title must be a string");
    }

    if (title.trim() === "") {
      throw new HttpError(400, "ERR_INVALID_BODY", "title must be a non-empty string");
    }

    if (title.length > 200) {
      throw new HttpError(400, "ERR_INVALID_BODY", "title must be 200 characters or less");
    }
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new HttpError(400, "ERR_INVALID_BODY", "description must be a string");
    }

    if (description.length > 1000) {
      throw new HttpError(400, "ERR_INVALID_BODY", "description must be 1000 characters or less");
    }
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      throw new HttpError(400, "ERR_INVALID_BODY", "completed must be a boolean");
    }
  }

  // At least one field must be provided
  if (title === undefined && description === undefined && completed === undefined) {
    throw new HttpError(400, "ERR_INVALID_BODY", "At least one field (title, description, completed) must be provided");
  }

  next();
}

