import { describe, it, expect, beforeEach } from "vitest";
import { recordEvent, getEvents, resetRecorder } from "./evidenceRecorder.js";

describe("evidenceRecorder", () => {
  beforeEach(() => {
    resetRecorder();
  });

  it("sequence starts at 1", () => {
    recordEvent("ROUND_STARTED", 1);
    const events = getEvents();
    expect(events[0].sequence).toBe(1);
  });

  it("sequence increments", () => {
    recordEvent("ROUND_STARTED", 1);
    recordEvent("PIECE_PLACED", 1);
    const events = getEvents();
    expect(events[0].sequence).toBe(1);
    expect(events[1].sequence).toBe(2);
  });

  it("payload is preserved without mutation", () => {
    const payload = { numerator: 1, denominator: 2 };
    recordEvent("PIECE_PLACED", 1, payload);
    payload.numerator = 99;
    const events = getEvents();
    expect(events[0].payload.numerator).toBe(1);
  });

  it("reset event does not erase earlier evidence", () => {
    recordEvent("ROUND_STARTED", 1);
    recordEvent("ROUND_RESET", 1);
    const events = getEvents();
    expect(events.length).toBe(2);
  });

  it("replay event remains in the same session evidence list", () => {
    recordEvent("ROUND_STARTED", 1);
    recordEvent("ROUND_COMPLETED", 1);
    recordEvent("SESSION_REPLAYED", 0);
    const events = getEvents();
    expect(events.length).toBe(3);
    expect(events[2].type).toBe("SESSION_REPLAYED");
  });
});
