import { describe, expect, it } from "vitest";
import {
  addResource,
  consumeResource,
  createInventory,
  getResourceCount,
} from "./inventory.js";

describe("sandbox inventory", () => {
  it("starts with deterministic zero counts", () => {
    expect(createInventory()).toEqual({ wood: 0, stone: 0 });
  });

  it("adds collected resources without mutating the prior state", () => {
    const before = createInventory();
    const after = addResource(before, "wood", 2);

    expect(before.wood).toBe(0);
    expect(after.wood).toBe(2);
  });

  it("consumes a resource only when stock is available", () => {
    const inventory = createInventory({ stone: 1 });
    const success = consumeResource(inventory, "stone");
    const failure = consumeResource(success.inventory, "stone");

    expect(success).toEqual({
      inventory: { wood: 0, stone: 0 },
      consumed: true,
    });
    expect(failure.inventory).toBe(success.inventory);
    expect(failure.consumed).toBe(false);
  });

  it("exposes resource counts through a guarded contract", () => {
    expect(getResourceCount(createInventory({ wood: 3 }), "wood")).toBe(3);
    expect(() => getResourceCount(createInventory(), "metal")).toThrow(
      "Unsupported resource type",
    );
  });
});
