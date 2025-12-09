import { Request, Response } from "express";
import { requestLogger } from "../../src/middleware/requestLogger";
import { logger } from "../../src/config/logger";

jest.mock("../../src/config/logger", () => ({
  logger: {
    info: jest.fn()
  }
}));

describe("requestLogger middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      method: "GET",
      originalUrl: "/api/v1/todos",
      requestId: "test-request-id"
    };
    res = {
      statusCode: 200,
      on: jest.fn((event: string, callback: () => void) => {
        if (event === "finish") {
          setTimeout(callback, 10);
        }
      })
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("logs request information on response finish", (done) => {
    requestLogger(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();

    // Simulate response finish
    (res.on as jest.Mock).mock.calls.forEach(([event, callback]) => {
      if (event === "finish") {
        callback();
        setTimeout(() => {
          expect(logger.info).toHaveBeenCalledWith("http_request", {
            method: "GET",
            path: "/api/v1/todos",
            status: 200,
            duration: expect.any(Number),
            request_id: "test-request-id"
          });
          done();
        }, 20);
      }
    });
  });

  it("calculates request duration", (done) => {
    requestLogger(req as Request, res as Response, next);

    (res.on as jest.Mock).mock.calls.forEach(([event, callback]) => {
      if (event === "finish") {
        callback();
        setTimeout(() => {
          const callArgs = (logger.info as jest.Mock).mock.calls[0];
          expect(callArgs[1].duration).toBeGreaterThanOrEqual(0);
          done();
        }, 20);
      }
    });
  });
});

