import { describe, it, expect } from "vitest";
import { notFoundHandler } from "./notFoundHandler.js";

describe("notFoundHandler", () => {
  it("should return 404 with ROUTE_NOT_FOUND error", () => {
    const req = {};
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
      },
    };

    notFoundHandler(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "Route not found",
      },
    });
  });
});
