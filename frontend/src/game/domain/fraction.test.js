import { describe, it, expect } from "vitest";
import {
  greatestCommonDivisor,
  normalizeFraction,
  addFractions,
  compareFractions,
  areEquivalent,
} from "./fraction.js";

describe("greatestCommonDivisor", () => {
  it("gcd(12, 8) = 4", () => {
    expect(greatestCommonDivisor(12, 8)).toBe(4);
  });

  it("gcd(7, 13) = 1", () => {
    expect(greatestCommonDivisor(7, 13)).toBe(1);
  });

  it("gcd(0, 5) = 5", () => {
    expect(greatestCommonDivisor(0, 5)).toBe(5);
  });
});

describe("normalizeFraction", () => {
  it("normalize 2/4 to 1/2", () => {
    const result = normalizeFraction({ numerator: 2, denominator: 4 });
    expect(result).toEqual({ numerator: 1, denominator: 2 });
  });

  it("normalize 4/6 to 2/3", () => {
    const result = normalizeFraction({ numerator: 4, denominator: 6 });
    expect(result).toEqual({ numerator: 2, denominator: 3 });
  });

  it("throws on denominator 0", () => {
    expect(() => normalizeFraction({ numerator: 1, denominator: 0 })).toThrow(
      "Denominator cannot be zero",
    );
  });
});

describe("addFractions", () => {
  it("1/4 + 1/4 = 1/2", () => {
    const result = addFractions(
      { numerator: 1, denominator: 4 },
      { numerator: 1, denominator: 4 },
    );
    expect(result).toEqual({ numerator: 1, denominator: 2 });
  });

  it("1/2 + 1/4 = 3/4", () => {
    const result = addFractions(
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 4 },
    );
    expect(result).toEqual({ numerator: 3, denominator: 4 });
  });

  it("throws on denominator 0", () => {
    expect(() =>
      addFractions({ numerator: 1, denominator: 0 }, { numerator: 1, denominator: 4 }),
    ).toThrow("Denominator cannot be zero");
  });
});

describe("compareFractions", () => {
  it("1/2 < 3/4", () => {
    expect(
      compareFractions({ numerator: 1, denominator: 2 }, { numerator: 3, denominator: 4 }),
    ).toBe(-1);
  });

  it("3/4 > 1/2", () => {
    expect(
      compareFractions({ numerator: 3, denominator: 4 }, { numerator: 1, denominator: 2 }),
    ).toBe(1);
  });

  it("1/2 equals 2/4", () => {
    expect(
      compareFractions({ numerator: 1, denominator: 2 }, { numerator: 2, denominator: 4 }),
    ).toBe(0);
  });
});

describe("areEquivalent", () => {
  it("1/2 equivalent to 2/4", () => {
    expect(
      areEquivalent({ numerator: 1, denominator: 2 }, { numerator: 2, denominator: 4 }),
    ).toBe(true);
  });

  it("1/2 not equivalent to 2/3", () => {
    expect(
      areEquivalent({ numerator: 1, denominator: 2 }, { numerator: 2, denominator: 3 }),
    ).toBe(false);
  });

  it("throws on denominator 0", () => {
    expect(() =>
      areEquivalent({ numerator: 1, denominator: 0 }, { numerator: 1, denominator: 2 }),
    ).toThrow("Denominator cannot be zero");
  });
});

describe("immutability", () => {
  it("normalizeFraction does not mutate input", () => {
    const input = { numerator: 2, denominator: 4 };
    const inputCopy = { ...input };
    normalizeFraction(input);
    expect(input).toEqual(inputCopy);
  });

  it("addFractions does not mutate inputs", () => {
    const a = { numerator: 1, denominator: 4 };
    const b = { numerator: 1, denominator: 4 };
    const aCopy = { ...a };
    const bCopy = { ...b };
    addFractions(a, b);
    expect(a).toEqual(aCopy);
    expect(b).toEqual(bCopy);
  });
});
