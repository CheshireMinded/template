import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from "../../src/controllers/todoController";
import { HttpError } from "../../src/middleware/errorHandler";
import { TodoService } from "../../src/models/todo";

// Mock the TodoService
jest.mock("../../src/models/todo", () => {
  const actual = jest.requireActual("../../src/models/todo");
  return {
    ...actual,
    TodoService: {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  };
});

describe("Todo Controller", () => {
  const makeRes = () => {
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    return res;
  };

  const makeNext = () => jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTodos", () => {
    it("returns all todos", () => {
      const todos = [
        { id: "1", title: "Test", completed: false, createdAt: "2025-01-01", updatedAt: "2025-01-01" }
      ];
      (TodoService.getAll as jest.Mock).mockReturnValue(todos);

      const req: any = { requestId: "test-id" };
      const res = makeRes();
      const next = makeNext();

      getAllTodos(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        todos,
        count: 1,
        request_id: "test-id"
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getTodoById", () => {
    it("returns a todo when found", () => {
      const todo = { id: "1", title: "Test", completed: false, createdAt: "2025-01-01", updatedAt: "2025-01-01" };
      (TodoService.getById as jest.Mock).mockReturnValue(todo);

      const req: any = { params: { id: "1" }, requestId: "test-id" };
      const res = makeRes();
      const next = makeNext();

      getTodoById(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        todo,
        request_id: "test-id"
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("throws HttpError when todo not found", () => {
      (TodoService.getById as jest.Mock).mockReturnValue(undefined);

      const req: any = { params: { id: "999" }, requestId: "test-id" };
      const res = makeRes();
      const next = makeNext();

      getTodoById(req, res, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(HttpError);
      expect(err.statusCode).toBe(404);
    });
  });

  describe("createTodo", () => {
    it("creates a new todo", () => {
      const newTodo = { id: "2", title: "New Todo", completed: false, createdAt: "2025-01-01", updatedAt: "2025-01-01" };
      (TodoService.create as jest.Mock).mockReturnValue(newTodo);

      const req: any = { body: { title: "New Todo" }, requestId: "test-id" };
      const res = makeRes();
      const next = makeNext();

      createTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        todo: newTodo,
        request_id: "test-id"
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("updateTodo", () => {
    it("updates an existing todo", () => {
      const updatedTodo = { id: "1", title: "Updated", completed: true, createdAt: "2025-01-01", updatedAt: "2025-01-02" };
      (TodoService.getById as jest.Mock).mockReturnValue({ id: "1" });
      (TodoService.update as jest.Mock).mockReturnValue(updatedTodo);

      const req: any = { params: { id: "1" }, body: { title: "Updated", completed: true }, requestId: "test-id" };
      const res = makeRes();
      const next = makeNext();

      updateTodo(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        todo: updatedTodo,
        request_id: "test-id"
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("throws HttpError when todo not found", () => {
      (TodoService.getById as jest.Mock).mockReturnValue(undefined);

      const req: any = { params: { id: "999" }, body: { title: "Updated" }, requestId: "test-id" };
      const res = makeRes();
      const next = makeNext();

      updateTodo(req, res, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(HttpError);
      expect(err.statusCode).toBe(404);
    });
  });

  describe("deleteTodo", () => {
    it("deletes an existing todo", () => {
      (TodoService.delete as jest.Mock).mockReturnValue(true);

      const req: any = { params: { id: "1" }, requestId: "test-id" };
      const res = makeRes();
      const next = makeNext();

      deleteTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("throws HttpError when todo not found", () => {
      (TodoService.delete as jest.Mock).mockReturnValue(false);

      const req: any = { params: { id: "999" }, requestId: "test-id" };
      const res = makeRes();
      const next = makeNext();

      deleteTodo(req, res, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(HttpError);
      expect(err.statusCode).toBe(404);
    });
  });
});

