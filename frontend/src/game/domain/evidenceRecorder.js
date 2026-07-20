/**
 * In-memory evidence recorder for Fraction Bridge.
 * No localStorage, no network, no UUIDs, no timestamps.
 */

/** @type {Array<{ type: string, round: number, sequence: number, payload: object }>} */
let events = [];
let sequence = 0;

/**
 * Record an event.
 * @param {string} type
 * @param {number} round
 * @param {object} [payload={}]
 */
export function recordEvent(type, round, payload = {}) {
  sequence++;
  events.push({
    type,
    round,
    sequence,
    payload: JSON.parse(JSON.stringify(payload)),
  });
}

/**
 * Get all recorded events.
 * @returns {ReadonlyArray<object>}
 */
export function getEvents() {
  return events.map((e) => ({ ...e, payload: { ...e.payload } }));
}

/**
 * Reset the evidence recorder for a new session.
 */
export function resetRecorder() {
  events = [];
  sequence = 0;
}

/**
 * Expose evidence for Architect/parent inspection.
 */
if (typeof window !== "undefined") {
  window.__FRACTION_BRIDGE_EVIDENCE__ = {
    getEvents,
    resetRecorder,
  };
}
