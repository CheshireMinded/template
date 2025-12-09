import { Router, Request, Response, NextFunction } from "express";
import { echoController } from "../controllers/exampleController";
import { validateEchoInput } from "../middleware/validateInput";

const router = Router();

/**
 * Simple example:
 * POST /api/v1/example/echo
 * body: { "message": "hello" }
 * 
 * See: apps/backend-api/openapi.yaml for API specification
 */
router.post("/echo", validateEchoInput, (req: Request, res: Response, next: NextFunction) => {
  echoController(req, res, next);
});

export { router };

