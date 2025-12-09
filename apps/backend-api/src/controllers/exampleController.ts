import { Request, Response, NextFunction } from "express";

/**
 * Echo controller - returns the message from request body
 * 
 * Input validation is handled by validateEchoInput middleware
 * See: apps/backend-api/src/middleware/validateInput.ts
 */
export function echoController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validation already done by middleware, safe to use
    const { message } = req.body;

    res.json({
      ok: true,
      echo: message,
      request_id: req.requestId
    });
  } catch (err) {
    next(err);
  }
}

