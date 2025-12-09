import { Request, Response, NextFunction } from "express";
import { HttpError } from "../middleware/errorHandler";

export function echoController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || message.trim() === "") {
      throw new HttpError(400, "ERR_INVALID_BODY", "message must be a non-empty string");
    }

    res.json({
      ok: true,
      echo: message,
      request_id: req.requestId
    });
  } catch (err) {
    next(err);
  }
}

