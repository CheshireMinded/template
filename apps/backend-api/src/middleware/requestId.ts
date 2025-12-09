import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}

export function attachRequestId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.header("X-Request-Id") || uuidv4();
  req.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
}

