/**
 * Fraction Bridge game rules.
 * Pure deterministic functions. No Phaser, no side effects.
 */

import { addFractions, compareFractions, areEquivalent } from "./fraction.js";

/** @type {string} */
export const UNDERFILLED = "UNDERFILLED";

/** @type {string} */
export const EXACT = "EXACT";

/** @type {string} */
export const OVERFILLED = "OVERFILLED";

/**
 * Round definitions.
 * Each round has a target gap and available pieces.
 */
const ROUND_DEFINITIONS = [
  // Round 1: one 1/2 fills the gap
  {
    target: { numerator: 1, denominator: 2 },
    pieces: [
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 3 },
      { numerator: 1, denominator: 4 },
    ],
  },
  // Round 2: two 1/4 fill the same gap, no 1/2 piece
  {
    target: { numerator: 1, denominator: 2 },
    pieces: [
      { numerator: 1, denominator: 4 },
      { numerator: 1, denominator: 4 },
      { numerator: 1, denominator: 3 },
    ],
  },
  // Round 3: visual choice — pick the bridge that matches 1/2
  {
    target: { numerator: 1, denominator: 2 },
    choices: [
      { numerator: 2, denominator: 3 },
      { numerator: 2, denominator: 4 },
      { numerator: 3, denominator: 4 },
    ],
  },
];

/**
 * Create the initial state for a given round.
 * @param {number} roundNumber - 1-based round number
 * @returns {object}
 */
export function createRoundState(roundNumber) {
  const def = ROUND_DEFINITIONS[roundNumber - 1];
  if (!def) {
    throw new Error(`Invalid round number: ${roundNumber}`);
  }
  return {
    round: roundNumber,
    target: { ...def.target },
    pieces: def.pieces ? def.pieces.map((p) => ({ ...p })) : [],
    placedPieces: [],
    availablePieces: def.pieces
      ? def.pieces.map((p, i) => ({
          ...p,
          id: `piece-${roundNumber}-${i}`,
        }))
      : [],
    choices: def.choices
      ? def.choices.map((c, i) => ({ ...c, id: `choice-${roundNumber}-${i}` }))
      : undefined,
    selectedChoice: null,
    status: UNDERFILLED,
  };

}

/**
 * Place a piece onto the bridge.
 * Returns a new state object (does not mutate).
 * @param {object} state
 * @param {object} piece - { numerator, denominator, id }
 * @returns {object}
 */
export function placePiece(state, piece) {
  const newPlaced = [...state.placedPieces, { numerator: piece.numerator, denominator: piece.denominator, id: piece.id }];
  const newAvailable = state.availablePieces.filter((p) => p.id !== piece.id);
  const total = newPlaced
    .filter((p) => p.numerator !== undefined)
    .reduce(
      (acc, p) => addFractions(acc, { numerator: p.numerator, denominator: p.denominator }),
      { numerator: 0, denominator: 1 },
    );
  const cmp = compareFractions(total, state.target);
  let status;
  if (cmp < 0) status = UNDERFILLED;
  else if (cmp === 0) status = EXACT;
  else status = OVERFILLED;

  return {
    ...state,
    placedPieces: newPlaced,
    availablePieces: newAvailable,
    status,
  };
}

/**
 * Reset the current round to its initial state.
 * @param {object} state
 * @returns {object}
 */
export function resetRound(state) {
  return createRoundState(state.round);
}

/**
 * Evaluate the bridge status.
 * @param {object} state
 * @returns {string}
 */
export function evaluateBridge(state) {
  return state.status;
}

/**
 * Evaluate a visual choice against the reference fraction.
 * @param {{ numerator: number, denominator: number }} reference
 * @param {{ numerator: number, denominator: number }} candidate
 * @returns {boolean}
 */
export function evaluateVisualChoice(reference, candidate) {
  return areEquivalent(reference, candidate);
}
