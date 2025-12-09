import request from "supertest";
import { app } from "../../src/index";
import { getDb } from "../../src/db/connection";
import { userRepo } from "../../src/db/userRepo";

describe("Auth API Integration Tests", () => {
  beforeEach(async () => {
    // Clean up users table before each test
    const db = getDb();
    await db("users").delete();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: "testuser",
          password: "testpass123"
        });

      expect(response.status).toBe(201);
      expect(response.body.ok).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toEqual({
        id: expect.any(String),
        username: "testuser"
      });
    });

    it("should reject registration with missing username", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          password: "testpass123"
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.code).toBe("ERR_VALIDATION");
    });

    it("should reject registration with short password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: "testuser",
          password: "short"
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(true);
    });

    it("should reject duplicate username", async () => {
      // Register first user
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: "testuser",
          password: "testpass123"
        });

      // Try to register again with same username
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: "testuser",
          password: "testpass123"
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe(true);
      expect(response.body.code).toBe("ERR_CONFLICT");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      // Create a test user
      await userRepo.create({
        username: "testuser",
        password: "testpass123"
      });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          username: "testuser",
          password: "testpass123"
        });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toEqual({
        id: expect.any(String),
        username: "testuser"
      });
    });

    it("should reject login with invalid username", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          username: "nonexistent",
          password: "testpass123"
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
      expect(response.body.code).toBe("ERR_UNAUTHORIZED");
    });

    it("should reject login with invalid password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          username: "testuser",
          password: "wrongpassword"
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
      expect(response.body.code).toBe("ERR_UNAUTHORIZED");
    });

    it("should reject login with missing credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          username: "testuser"
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.code).toBe("ERR_VALIDATION");
    });
  });

  describe("Protected routes require authentication", () => {
    it("should reject todo requests without auth token", async () => {
      const response = await request(app)
        .get("/api/v1/todos");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
      expect(response.body.code).toBe("ERR_UNAUTHORIZED");
    });

    it("should accept todo requests with valid auth token", async () => {
      // Register and get token
      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: "testuser",
          password: "testpass123"
        });

      const token = registerResponse.body.token;

      // Use token to access protected route
      const response = await request(app)
        .get("/api/v1/todos")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it("should reject requests with invalid token", async () => {
      const response = await request(app)
        .get("/api/v1/todos")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(true);
      expect(response.body.code).toBe("ERR_UNAUTHORIZED");
    });
  });
});

