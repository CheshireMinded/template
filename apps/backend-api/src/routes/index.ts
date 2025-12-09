import { Router } from "express";
import { router as exampleRouter } from "./example";

const router = Router();

router.use("/example", exampleRouter);

export { router };

