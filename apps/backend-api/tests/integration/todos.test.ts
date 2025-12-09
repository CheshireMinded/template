import request from "supertest";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { getEnv } from "../../src/config/env";
import { attachRequestId } from "../../src/middleware/requestId";
import { requestLogger } from "../../src/middleware/requestLogger";
import { errorHandler } from "../../src/middleware/errorHandler";
import { router as healthRouter } from "../../src/health";
import { router as apiRouter } from "../../src/routes";

const env = getEnv();

// Build app for testing (similar to health.test.ts pattern)
function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(attachRequestId);
  app.use(requestLogger);
  app.use("/healthz", healthRouter);
  app.use("/api/v1", apiRouter);
  app.use(errorHandler);
  return app;
}

const app = createApp();

describe("Todo API Integration Tests", () => {
  let createdTodoId: string;
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    // Register a test user and get auth token
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        username: `testuser_${Date.now()}`,
        password: "testpass123"
      });

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  describe("GET /api/v1/todos", () => {
    it("returns list of todos", async () => {
      const response = await request(app)
        .get("/api/v1/todos")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(Array.isArray(response.body.todos)).toBe(true);
      expect(typeof response.body.count).toBe("number");
      expect(response.body.request_id).toBeDefined();
    });
  });

  describe("POST /api/v1/todos", () => {
    it("creates a new todo", async () => {
      const response = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Integration Test Todo",
          description: "This is a test todo"
        })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.todo).toBeDefined();
      expect(response.body.todo.title).toBe("Integration Test Todo");
      expect(response.body.todo.completed).toBe(false);
      expect(response.body.todo.id).toBeDefined();

      createdTodoId = response.body.todo.id;
    });

    it("returns 400 for invalid input", async () => {
      const response = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: ""
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it("returns 400 for missing title", async () => {
      const response = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /api/v1/todos/:id", () => {
    it("returns a todo by id", async () => {
      // First create a todo
      const createResponse = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Get Test Todo" })
        .expect(201);

      const todoId = createResponse.body.todo.id;

      // Then get it
      const response = await request(app)
        .get(`/api/v1/todos/${todoId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.todo.id).toBe(todoId);
      expect(response.body.todo.title).toBe("Get Test Todo");
    });

    it("returns 404 for non-existent todo", async () => {
      const response = await request(app)
        .get("/api/v1/todos/999999")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error).toBe("ERR_NOT_FOUND");
    });
  });

  describe("PUT /api/v1/todos/:id", () => {
    it("updates a todo", async () => {
      // First create a todo
      const createResponse = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Update Test Todo" })
        .expect(201);

      const todoId = createResponse.body.todo.id;

      // Then update it
      const response = await request(app)
        .put(`/api/v1/todos/${todoId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Updated Todo",
          completed: true
        })
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.todo.title).toBe("Updated Todo");
      expect(response.body.todo.completed).toBe(true);
    });

    it("returns 404 for non-existent todo", async () => {
      const response = await request(app)
        .put("/api/v1/todos/999999")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Updated" })
        .expect(404);

      expect(response.body.error).toBe("ERR_NOT_FOUND");
    });
  });

  describe("DELETE /api/v1/todos/:id", () => {
    it("deletes a todo", async () => {
      // First create a todo
      const createResponse = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Delete Test Todo" })
        .expect(201);

      const todoId = createResponse.body.todo.id;

      // Then delete it
      await request(app)
        .delete(`/api/v1/todos/${todoId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      // Verify it's deleted
      await request(app)
        .get(`/api/v1/todos/${todoId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });

    it("returns 404 for non-existent todo", async () => {
      const response = await request(app)
        .delete("/api/v1/todos/999999")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error).toBe("ERR_NOT_FOUND");
    });
  });
});

