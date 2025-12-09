import { echoController } from "../../src/controllers/exampleController";
import { HttpError } from "../../src/middleware/errorHandler";

describe("echoController", () => {
  const makeRes = () => {
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const makeNext = () => jest.fn();

  it("returns echo for valid message", () => {
    const req: any = { body: { message: "hello" }, requestId: "test-id" };
    const res = makeRes();
    const next = makeNext();

    echoController(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      echo: "hello",
      request_id: "test-id"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("throws HttpError for invalid message", () => {
    const req: any = { body: { message: "" } };
    const res = makeRes();
    const next = makeNext();

    echoController(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(HttpError);
    expect(err.statusCode).toBe(400);
  });
});

