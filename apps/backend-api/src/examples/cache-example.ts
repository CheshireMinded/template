/**
 * Example: Using Redis cache in a controller
 * 
 * This demonstrates how to use the Redis cache layer to improve performance.
 * Uncomment and adapt this code to use caching in your controllers.
 */

import { Request, Response } from "express";
import { getCached, invalidateCache } from "../cache/redis";
import { TodoService } from "../services/todoService";
import { AuthPayload } from "../middleware/auth";

interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

/**
 * Example: Get todos with caching
 * 
 * Todos are cached for 5 minutes (300 seconds).
 * Cache is invalidated when todos are created/updated/deleted.
 */
export async function getTodosCached(
  req: AuthenticatedRequest,
  res: Response
) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }

  const cacheKey = `todos:user:${userId}`;

  // Try to get from cache, otherwise fetch from database
  const todos = await getCached(
    cacheKey,
    () => TodoService.getAll(userId),
    300 // 5 minutes TTL
  );

  res.json({ ok: true, todos, count: todos.length });
}

/**
 * Example: Create todo and invalidate cache
 */
export async function createTodoCached(
  req: AuthenticatedRequest,
  res: Response
) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }

  const { title, description } = req.body;
  const todo = await TodoService.create({ title, description }, userId);

  // Invalidate cache so next fetch gets fresh data
  await invalidateCache(`todos:user:${userId}`);

  res.status(201).json({ ok: true, todo });
}

