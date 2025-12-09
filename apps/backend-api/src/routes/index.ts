import { Router } from "express";
import { router as exampleRouter } from "./example";
import { router as todoRouter } from "./todo";
import { router as authRouter } from "./auth";
import { router as metricsRouter } from "./metrics";

const router = Router();

router.use("/example", exampleRouter);
router.use("/auth", authRouter);
router.use("/todos", todoRouter);
router.use("/", metricsRouter); // Metrics at root level

export { router };

