import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../middleware/errorHandler";
import { getEnv } from "../config/env";
import { userRepo } from "../db/userRepo";
import { usersRegistered } from "../metrics/prometheus";

const router = Router();

/**
 * POST /api/v1/auth/register
 * body: { username, password }
 * returns: { token, user: { id, username } }
 */
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new HttpError(400, "ERR_VALIDATION", "Username and password are required");
    }

    if (password.length < 6) {
      throw new HttpError(400, "ERR_VALIDATION", "Password must be at least 6 characters");
    }

    // Check if user already exists
    const existing = await userRepo.findByUsername(username);
    if (existing) {
      throw new HttpError(409, "ERR_CONFLICT", "Username already exists");
    }

    // Create user
    const user = await userRepo.create({ username, password });

    // Record metric
    usersRegistered.inc();

    // Generate token
    const env = getEnv();
    const secret = env.AUTH_JWT_SECRET;
    if (!secret) {
      throw new HttpError(500, "ERR_CONFIG", "JWT secret not configured");
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      secret,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      ok: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/auth/login
 * body: { username, password }
 * returns: { token, user: { id, username } }
 */
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new HttpError(400, "ERR_VALIDATION", "Username and password are required");
    }

    // Find user
    const user = await userRepo.findByUsername(username);
    if (!user) {
      throw new HttpError(401, "ERR_UNAUTHORIZED", "Invalid credentials");
    }

    // Verify password
    const isValid = await userRepo.verifyPassword(user, password);
    if (!isValid) {
      throw new HttpError(401, "ERR_UNAUTHORIZED", "Invalid credentials");
    }

    // Generate token
    const env = getEnv();
    const secret = env.AUTH_JWT_SECRET;
    if (!secret) {
      throw new HttpError(500, "ERR_CONFIG", "JWT secret not configured");
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      secret,
      { expiresIn: "24h" }
    );

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (err) {
    next(err);
  }
});

export { router };
