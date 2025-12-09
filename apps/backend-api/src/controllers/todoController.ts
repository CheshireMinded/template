import { Request, Response, NextFunction } from "express";
import { TodoService } from "../services/todoService";
import { HttpError } from "../middleware/errorHandler";
import { AuthPayload } from "../middleware/auth";
import { todosCreated } from "../metrics/prometheus";

/**
 * Todo controller - handles CRUD operations for todos
 * 
 * Input validation is handled by validateTodoInput middleware
 * See: apps/backend-api/src/middleware/validateInput.ts
 */

export async function getAllTodos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user as AuthPayload;
    const todos = await TodoService.getAll(user.sub);
    res.json({
      ok: true,
      todos,
      count: todos.length,
      request_id: req.requestId
    });
  } catch (err) {
    next(err);
  }
}

export async function getTodoById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const user = (req as any).user as AuthPayload;
    const todo = await TodoService.getById(id, user.sub);

    if (!todo) {
      throw new HttpError(404, "ERR_NOT_FOUND", `Todo with id ${id} not found`);
    }

    res.json({
      ok: true,
      todo,
      request_id: req.requestId
    });
  } catch (err) {
    next(err);
  }
}

export async function createTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validation already done by middleware, safe to use
    const { title, description } = req.body;
    const user = (req as any).user as AuthPayload;

    const todo = await TodoService.create({ title, description }, user.sub);

    // Record metric
    todosCreated.inc();

    res.status(201).json({
      ok: true,
      todo,
      request_id: req.requestId
    });
  } catch (err) {
    next(err);
  }
}

export async function updateTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const user = (req as any).user as AuthPayload;

    // Check if todo exists
    const existing = await TodoService.getById(id, user.sub);
    if (!existing) {
      throw new HttpError(404, "ERR_NOT_FOUND", `Todo with id ${id} not found`);
    }

    const todo = await TodoService.update(id, user.sub, { title, description, completed });

    if (!todo) {
      throw new HttpError(404, "ERR_NOT_FOUND", `Todo with id ${id} not found`);
    }

    res.json({
      ok: true,
      todo,
      request_id: req.requestId
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const user = (req as any).user as AuthPayload;

    const deleted = await TodoService.delete(id, user.sub);
    if (!deleted) {
      throw new HttpError(404, "ERR_NOT_FOUND", `Todo with id ${id} not found`);
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
