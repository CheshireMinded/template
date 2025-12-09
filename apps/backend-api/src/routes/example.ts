import { Router, Request, Response, NextFunction } from "express";
import { echoController } from "../controllers/exampleController";

const router = Router();

/**
 * Simple example:
 * POST /api/v1/example/echo
 * body: { "message": "hello" }
 */
router.post("/echo", (req: Request, res: Response, next: NextFunction) => {
  echoController(req, res, next);
});

export { router };

