import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app.js";

describe("Not Found — HTTP Integration", () => {
  it("GET /api/v1/unknown should return 404 with ROUTE_NOT_FOUND", async () => {
    const res = await request(app).get("/api/v1/unknown");

    expect(res.status).toBe(404);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toEqual({
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "Route not found",
      },
    });
  });
});
