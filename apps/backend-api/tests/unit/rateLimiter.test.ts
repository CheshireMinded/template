import { Request, Response, NextFunction } from "express";
import { rateLimiter } from "../../src/middleware/rateLimiter";
import { HttpError } from "../../src/middleware/errorHandler";

// Mock getEnv
jest.mock("../../src/config/env", () => ({
  getEnv: jest.fn(() => ({
    RATE_LIMIT_ENABLED: true,
    RATE_LIMIT_MAX_REQUESTS: 5,
    RATE_LIMIT_WINDOW_MS: 60000
  }))
}));

describe("rateLimiter middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" }
    };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("allows requests when rate limit is disabled", () => {
    jest.doMock("../../src/config/env", () => ({
      getEnv: () => ({
        RATE_LIMIT_ENABLED: false,
        RATE_LIMIT_MAX_REQUESTS: 5,
        RATE_LIMIT_WINDOW_MS: 60000
      })
    }));

    rateLimiter(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it("allows requests within rate limit", () => {
    for (let i = 0; i < 5; i++) {
      rateLimiter(req as Request, res as Response, next);
    }
    expect(next).toHaveBeenCalledTimes(5);
  });

  it("blocks requests exceeding rate limit", () => {
    // Make 5 requests (at limit)
    for (let i = 0; i < 5; i++) {
      rateLimiter(req as Request, res as Response, next);
    }

    // 6th request should be blocked
    expect(() => {
      rateLimiter(req as Request, res as Response, next);
    }).toThrow(HttpError);

    expect(next).toHaveBeenCalledTimes(5);
  });

  it("resets rate limit after window expires", async () => {
    jest.doMock("../../src/config/env", () => ({
      getEnv: () => ({
        RATE_LIMIT_ENABLED: true,
        RATE_LIMIT_MAX_REQUESTS: 2,
        RATE_LIMIT_WINDOW_MS: 100 // Very short window for testing
      })
    }));

    // Make 2 requests (at limit)
    rateLimiter(req as Request, res as Response, next);
    rateLimiter(req as Request, res as Response, next);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Should allow requests again
    rateLimiter(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(3);
  });

  it("uses IP address for client identification", () => {
    const req1 = { ...req, ip: "192.168.1.1" } as Request;
    const req2 = { ...req, ip: "192.168.1.2" } as Request;

    // Each IP should have separate rate limit
    rateLimiter(req1, res as Response, next);
    rateLimiter(req2, res as Response, next);

    expect(next).toHaveBeenCalledTimes(2);
  });
});

