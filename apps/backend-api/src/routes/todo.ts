import { Router, Request, Response, NextFunction } from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from "../controllers/todoController";
import {
  validateCreateTodoInput,
  validateUpdateTodoInput
} from "../middleware/validateInput";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * Todo routes (protected)
 * 
 * GET    /api/v1/todos        - List all todos
 * GET    /api/v1/todos/:id    - Get a single todo
 * POST   /api/v1/todos        - Create a new todo
 * PUT    /api/v1/todos/:id    - Update a todo
 * DELETE /api/v1/todos/:id    - Delete a todo
 */

// Require auth for all todo routes
router.use(requireAuth);

router.get("/", getAllTodos);
router.get("/:id", getTodoById);
router.post("/", validateCreateTodoInput, createTodo);
router.put("/:id", validateUpdateTodoInput, updateTodo);
router.delete("/:id", deleteTodo);

export { router };

