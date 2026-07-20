import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../app.js";

describe("Health Module — HTTP Integration", () => {
  it("GET /api/v1/health should return 200 with correct JSON body", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toEqual({
      status: "ok",
      service: "mathematics-backend",
    });
  });
});
