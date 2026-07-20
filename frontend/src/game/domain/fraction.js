/**
 * Pure fraction mathematics.
 * No Phaser, no side effects, no mutation.
 */

/**
 * Compute the greatest common divisor of two integers using Euclid's algorithm.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function greatestCommonDivisor(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b > 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/**
 * Normalize a fraction to lowest terms.
 * @param {{ numerator: number, denominator: number }} f
 * @returns {{ numerator: number, denominator: number }}
 */
export function normalizeFraction(f) {
  if (f.denominator === 0) {
    throw new Error("Denominator cannot be zero");
  }
  const g = greatestCommonDivisor(f.numerator, f.denominator);
  return {
    numerator: f.numerator / g,
    denominator: f.denominator / g,
  };
}

/**
 * Add two fractions.
 * @param {{ numerator: number, denominator: number }} left
 * @param {{ numerator: number, denominator: number }} right
 * @returns {{ numerator: number, denominator: number }}
 */
export function addFractions(left, right) {
  if (left.denominator === 0 || right.denominator === 0) {
    throw new Error("Denominator cannot be zero");
  }
  const numerator = left.numerator * right.denominator + right.numerator * left.denominator;
  const denominator = left.denominator * right.denominator;
  return normalizeFraction({ numerator, denominator });
}

/**
 * Compare two fractions.
 * Returns -1 if left < right, 0 if equal, 1 if left > right.
 * @param {{ numerator: number, denominator: number }} left
 * @param {{ numerator: number, denominator: number }} right
 * @returns {number}
 */
export function compareFractions(left, right) {
  if (left.denominator === 0 || right.denominator === 0) {
    throw new Error("Denominator cannot be zero");
  }
  const a = left.numerator * right.denominator;
  const b = right.numerator * left.denominator;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Check if two fractions are equivalent.
 * @param {{ numerator: number, denominator: number }} left
 * @param {{ numerator: number, denominator: number }} right
 * @returns {boolean}
 */
export function areEquivalent(left, right) {
  if (left.denominator === 0 || right.denominator === 0) {
    throw new Error("Denominator cannot be zero");
  }
  const nl = normalizeFraction(left);
  const nr = normalizeFraction(right);
  return nl.numerator === nr.numerator && nl.denominator === nr.denominator;
}
