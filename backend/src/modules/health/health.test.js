import { describe, it, expect } from "vitest";
import { healthService } from "./health.service.js";

describe("Health Module", () => {
  describe("healthService.check()", () => {
    it("should return status ok and correct service name", () => {
      const result = healthService.check();

      expect(result).toEqual({
        status: "ok",
        service: "mathematics-backend",
      });
    });
  });
});
