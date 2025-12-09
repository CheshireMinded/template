import { Request, Response } from "express";
import { attachRequestId } from "../../src/middleware/requestId";

describe("attachRequestId middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      setHeader: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("uses X-Request-Id header if present", () => {
    (req.header as jest.Mock).mockReturnValue("custom-request-id");

    attachRequestId(req as Request, res as Response, next);

    expect(req.requestId).toBe("custom-request-id");
    expect(res.setHeader).toHaveBeenCalledWith("X-Request-Id", "custom-request-id");
    expect(next).toHaveBeenCalled();
  });

  it("generates UUID if X-Request-Id header is missing", () => {
    (req.header as jest.Mock).mockReturnValue(undefined);

    attachRequestId(req as Request, res as Response, next);

    expect(req.requestId).toBeDefined();
    expect(req.requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(res.setHeader).toHaveBeenCalledWith("X-Request-Id", req.requestId);
    expect(next).toHaveBeenCalled();
  });

  it("generates UUID if X-Request-Id header is empty", () => {
    (req.header as jest.Mock).mockReturnValue("");

    attachRequestId(req as Request, res as Response, next);

    expect(req.requestId).toBeDefined();
    expect(req.requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(next).toHaveBeenCalled();
  });
});

