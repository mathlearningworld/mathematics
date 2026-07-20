import { describe, expect, it } from "vitest";
import { resolveMovement } from "./movement.js";

describe("resolveMovement", () => {
  it("stops when there is no intent", () => {
    expect(resolveMovement({ x: 0, y: 0 }, 180)).toEqual({
      velocityX: 0,
      velocityY: 0,
      moving: false,
    });
  });

  it("normalizes diagonal movement", () => {
    const result = resolveMovement({ x: 1, y: 1 }, 180);
    expect(Math.hypot(result.velocityX, result.velocityY)).toBeCloseTo(180);
  });

  it("does not depend on a rendering scene", () => {
    expect(resolveMovement({ x: -1, y: 0 }, 100)).toEqual({
      velocityX: -100,
      velocityY: 0,
      moving: true,
    });
  });
});
