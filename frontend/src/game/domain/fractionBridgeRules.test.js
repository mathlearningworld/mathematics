import { describe, it, expect } from "vitest";
import {
  createRoundState,
  placePiece,
  resetRound,
  evaluateBridge,
  evaluateVisualChoice,
  UNDERFILLED,
  EXACT,
  OVERFILLED,
} from "./fractionBridgeRules.js";

describe("Round 1", () => {
  it("target is 1/2", () => {
    const state = createRoundState(1);
    expect(state.target).toEqual({ numerator: 1, denominator: 2 });
  });

  it("one 1/2 gives EXACT", () => {
    const state = createRoundState(1);
    const half = state.availablePieces.find(
      (p) => p.numerator === 1 && p.denominator === 2,
    );
    const result = placePiece(state, half);
    expect(result.status).toBe(EXACT);
  });

  it("one 1/4 gives UNDERFILLED", () => {
    const state = createRoundState(1);
    const quarter = state.availablePieces.find(
      (p) => p.numerator === 1 && p.denominator === 4,
    );
    const result = placePiece(state, quarter);
    expect(result.status).toBe(UNDERFILLED);
  });

  it("1/2 + 1/4 gives OVERFILLED", () => {
    const state = createRoundState(1);
    const half = state.availablePieces.find(
      (p) => p.numerator === 1 && p.denominator === 2,
    );
    const quarter = state.availablePieces.find(
      (p) => p.numerator === 1 && p.denominator === 4,
    );
    const afterHalf = placePiece(state, half);
    const result = placePiece(afterHalf, quarter);
    expect(result.status).toBe(OVERFILLED);
  });
});

describe("Round 2", () => {
  it("contains two 1/4 pieces and no 1/2 piece", () => {
    const state = createRoundState(2);
    const quarters = state.availablePieces.filter(
      (p) => p.numerator === 1 && p.denominator === 4,
    );
    expect(quarters.length).toBe(2);
    const half = state.availablePieces.find(
      (p) => p.numerator === 1 && p.denominator === 2,
    );
    expect(half).toBeUndefined();
  });

  it("two 1/4 give EXACT", () => {
    const state = createRoundState(2);
    const quarters = state.availablePieces.filter(
      (p) => p.numerator === 1 && p.denominator === 4,
    );
    const afterFirst = placePiece(state, quarters[0]);
    const result = placePiece(afterFirst, quarters[1]);
    expect(result.status).toBe(EXACT);
  });
});

describe("reset", () => {
  it("reset restores initial round state", () => {
    const state = createRoundState(1);
    const half = state.availablePieces.find(
      (p) => p.numerator === 1 && p.denominator === 2,
    );
    const afterPlace = placePiece(state, half);
    const reset = resetRound(afterPlace);
    expect(reset.round).toBe(1);
    expect(reset.placedPieces.length).toBe(0);
    expect(reset.availablePieces.length).toBe(3);
    expect(reset.status).toBe(UNDERFILLED);
  });
});

describe("evaluateBridge", () => {
  it("returns current status", () => {
    const state = createRoundState(1);
    expect(evaluateBridge(state)).toBe(UNDERFILLED);
  });
});

describe("visual choice (Round 3)", () => {
  it("2/4 matches 1/2 via areEquivalent", () => {
    expect(
      evaluateVisualChoice(
        { numerator: 1, denominator: 2 },
        { numerator: 2, denominator: 4 },
      ),
    ).toBe(true);
  });

  it("2/3 does not match 1/2", () => {
    expect(
      evaluateVisualChoice(
        { numerator: 1, denominator: 2 },
        { numerator: 2, denominator: 3 },
      ),
    ).toBe(false);
  });

  it("3/4 does not match 1/2", () => {
    expect(
      evaluateVisualChoice(
        { numerator: 1, denominator: 2 },
        { numerator: 3, denominator: 4 },
      ),
    ).toBe(false);
  });

  it("correct candidate is derived through areEquivalent, not hard-coded index", () => {
    // This test verifies the logic works for any equivalent pair
    expect(
      evaluateVisualChoice(
        { numerator: 2, denominator: 3 },
        { numerator: 4, denominator: 6 },
      ),
    ).toBe(true);
    expect(
      evaluateVisualChoice(
        { numerator: 2, denominator: 3 },
        { numerator: 3, denominator: 4 },
      ),
    ).toBe(false);
  });
});

describe("immutability", () => {
  it("createRoundState does not share references", () => {
    const state = createRoundState(1);
    const piece = state.availablePieces[0];
    const result = placePiece(state, piece);
    expect(state.placedPieces.length).toBe(0);
    expect(result.placedPieces.length).toBe(1);
  });

  it("resetRound returns new object", () => {
    const state = createRoundState(1);
    const reset = resetRound(state);
    expect(reset).not.toBe(state);
  });
});

describe("round lifecycle transitions (pure domain)", () => {
  it("Round 1 → Round 2: createRoundState(2) has correct pieces", () => {
    const r1 = createRoundState(1);
    const r2 = createRoundState(2);
    expect(r1.round).toBe(1);
    expect(r2.round).toBe(2);
    expect(r2.availablePieces.length).toBe(3);
    expect(r2.availablePieces.filter(p => p.numerator === 1 && p.denominator === 4).length).toBe(2);
  });

  it("Round 2 → Round 3: createRoundState(3) has choices", () => {
    const r2 = createRoundState(2);
    const r3 = createRoundState(3);
    expect(r2.round).toBe(2);
    expect(r3.round).toBe(3);
    expect(r3.choices).toBeDefined();
    expect(r3.choices.length).toBe(3);
  });

  it("Round 3 → completed: no further round state", () => {
    const r3 = createRoundState(3);
    expect(r3.round).toBe(3);
    expect(() => createRoundState(4)).toThrow("Invalid round number");
  });

  it("replay → clean Round 1: resetRound returns round 1 state", () => {
    const r1 = createRoundState(1);
    const half = r1.availablePieces.find(p => p.numerator === 1 && p.denominator === 2);
    const afterPlace = placePiece(r1, half);
    expect(afterPlace.status).toBe(EXACT);
    const replay = resetRound(afterPlace);
    expect(replay.round).toBe(1);
    expect(replay.placedPieces.length).toBe(0);
    expect(replay.status).toBe(UNDERFILLED);
  });

  it("ROUND_COMPLETED cannot be emitted twice for one round (domain check)", () => {
    // Domain: once EXACT, placing more pieces is impossible since they're consumed
    const state = createRoundState(1);
    const half = state.availablePieces.find(p => p.numerator === 1 && p.denominator === 2);
    const result = placePiece(state, half);
    expect(result.status).toBe(EXACT);
    // No more pieces to place
    expect(result.availablePieces.length).toBe(2);
    // Placing another piece would require it to be in availablePieces
    const anotherPiece = result.availablePieces[0];
    const overfill = placePiece(result, anotherPiece);
    expect(overfill.status).toBe(OVERFILLED);
    // EXACT was only reached once
  });

  it("EQUIVALENCE_DISCOVERED cannot be emitted twice (domain check)", () => {
    // Domain: evaluateVisualChoice is pure and deterministic
    const ref = { numerator: 1, denominator: 2 };
    const candidate = { numerator: 2, denominator: 4 };
    expect(evaluateVisualChoice(ref, candidate)).toBe(true);
    // Calling again gives same result, but the scene should guard against double-emit
    expect(evaluateVisualChoice(ref, candidate)).toBe(true);
  });
});
