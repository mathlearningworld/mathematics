# 23H — Simulation & Time Runtime

## Status

- Chapter: 23 — Game Runtime & World Architecture
- Slice: 23H
- Authority: Architecture documentation
- Scope: Simulation ownership, clocks, ticks, scheduling, pause/resume, determinism, catch-up, and runtime invariants

## 1. Purpose

The Simulation & Time Runtime defines how change unfolds inside a world.

It governs:

- authoritative world time,
- simulation stepping,
- scheduled effects,
- cooldowns,
- growth and decay,
- NPC and environment updates,
- pause and suspension,
- recovery after elapsed real time,
- and deterministic ordering where product behavior requires it.

## 2. Core Principle

> Time is an explicit runtime dependency; gameplay rules must not depend on incidental render frames, animation callbacks, or uncontrolled wall-clock reads.

Render time may animate a projection. It is not automatically world time.

## 3. Time Domains

The runtime distinguishes at least four time domains.

### Wall-clock time

Real elapsed time from a trusted clock.

Used for:

- persistence timestamps,
- daily boundaries,
- offline elapsed time,
- audit records.

### Monotonic runtime time

Elapsed process time that does not move backward.

Used for:

- cooldowns,
- timeout measurement,
- local scheduling,
- frame-independent duration tracking.

### Simulation time

The governed time experienced by the world.

Simulation time may pause, scale, advance in fixed steps, or catch up under policy.

### Presentation time

Animation and interpolation time used by rendering.

Presentation time may continue or stop independently from authoritative simulation according to UX policy.

## 4. Clock Authority

```ts
interface WorldClock {
  worldId: string;
  simulationTimeMs: number;
  tick: number;
  rate: number;
  state: 'STOPPED' | 'RUNNING' | 'PAUSED' | 'SUSPENDED' | 'RECOVERING';
  revision: number;
}
```

Only the Simulation Runtime advances authoritative simulation time.

Systems may read the clock but must not privately advance it.

## 5. Fixed-Step Simulation

Where deterministic behavior matters, use fixed simulation steps.

```text
Real Elapsed Time
  → Accumulator
    → Zero or More Fixed Steps
      → Interpolated Projection
```

```ts
interface SimulationStep {
  tick: number;
  deltaMs: number;
  simulationTimeMs: number;
}
```

Rendering frequency must not change the number or meaning of authoritative updates.

## 6. Variable-Step Boundary

Variable delta may be acceptable for non-authoritative presentation effects.

Examples:

- particles,
- camera easing,
- decorative motion,
- UI transitions.

Authoritative resource production, cooldown expiry, mission timing, and world mutation should not depend on uncontrolled frame delta.

## 7. Simulation Phases

Each tick should execute in a stable phase order.

```text
1. Intake accepted commands
2. Resolve scheduled work
3. Update movement and spatial state
4. Update interactions and systems
5. Apply world mutations
6. Emit domain events
7. Evaluate missions and consequences
8. Publish projection snapshot
```

Exact phases may evolve, but ordering must be explicit and testable.

## 8. Deterministic Ordering

When multiple operations are eligible in the same tick, ordering must be stable.

Possible ordering keys:

- phase,
- priority,
- scheduled tick,
- entity ID,
- command sequence,
- correlation ID.

Array insertion order from unrelated scene code is not a valid authority.

## 9. Scheduler

```ts
interface ScheduledWorldAction {
  scheduleId: string;
  worldId: string;
  dueAtSimulationTimeMs: number;
  actionType: string;
  payloadRef: string;
  status: 'SCHEDULED' | 'CLAIMED' | 'COMPLETED' | 'CANCELLED';
  revision: number;
}
```

Scheduled actions must be:

- identifiable,
- cancellable under policy,
- idempotent,
- recoverable,
- and ordered deterministically.

## 10. Cooldowns and Durations

Cooldown state should store semantic timing data.

```ts
interface CooldownState {
  key: string;
  startedAtSimulationTimeMs: number;
  expiresAtSimulationTimeMs: number;
}
```

UI countdowns derive from this state.

A timer widget is not the cooldown authority.

## 11. Pause Semantics

Pause is a policy decision, not merely stopping rendering.

The runtime must define which domains pause:

- player movement,
- NPC decisions,
- environment simulation,
- mission timers,
- animation,
- network synchronization.

For single-player local worlds, simulation may pause entirely.

For shared worlds, one client opening a menu must not pause authoritative world time.

## 12. Suspend and Resume

Suspension occurs when the world runtime cannot continue active simulation.

Examples:

- application backgrounding,
- route teardown,
- device sleep,
- network loss,
- process termination.

Resume pipeline:

```text
Load Last Confirmed Clock
  → Measure Trusted Elapsed Time
    → Apply Catch-up Policy
      → Rebuild Scheduled Queue
        → Resume Simulation
```

## 13. Offline Catch-up

Offline elapsed time must never be applied without explicit policy.

Possible policies:

- no catch-up,
- capped catch-up,
- full deterministic catch-up,
- summarized catch-up,
- server-authoritative catch-up.

```ts
interface CatchUpPolicy {
  mode: 'NONE' | 'CAPPED' | 'FULL' | 'SUMMARIZED' | 'SERVER';
  maxElapsedMs?: number;
  maxSteps?: number;
}
```

Large elapsed periods should not cause an unbounded tick storm.

## 14. Summarized Simulation

Long periods may be resolved through semantic summaries rather than replaying every tick.

Examples:

- crop growth stage advancement,
- resource node regeneration,
- workshop production,
- daily world reset.

Summarized simulation must preserve the same product rules as detailed simulation and produce traceable evidence.

## 15. Randomness

Authoritative randomness must be governed.

```ts
interface RandomContext {
  seed: string;
  stream: string;
  sequence: number;
}
```

Rules:

- random streams must be identifiable,
- replay-sensitive outcomes must use seeded randomness,
- presentation randomness must not affect authoritative outcomes,
- retries must not silently reroll committed results.

## 16. Entity Update Ownership

Entities do not update themselves arbitrarily.

Systems own update policy for component families.

Examples:

- movement system owns movement integration,
- growth system owns growth progression,
- durability system owns decay,
- NPC system owns decision evaluation.

This preserves one write authority per canonical state.

## 17. Event Timing

Events should record both ordering and time.

```ts
interface TimedWorldEvent {
  eventId: string;
  tick: number;
  simulationTimeMs: number;
  occurredAt: string;
  sequence: number;
}
```

Wall-clock timestamps alone are insufficient for deterministic intra-world ordering.

## 18. Networked Authority Boundary

For future shared worlds:

- server simulation time is authoritative,
- clients may predict presentation and selected actions,
- reconciliation uses authoritative tick/revision,
- clock drift is measured and corrected gradually where possible.

The architecture must not assume that local device time is trusted authority.

## 19. Performance Budget

Simulation work should be budgeted by:

- active entity count,
- system frequency,
- spatial relevance,
- scheduled work size,
- catch-up cost.

Not every system must run every tick.

```ts
interface SystemSchedule {
  systemId: string;
  intervalTicks: number;
  phase: string;
  priority: number;
}
```

## 20. Degraded Operation

When simulation exceeds budget, the runtime may:

- reduce presentation fidelity,
- defer non-critical work,
- reduce distant-system frequency,
- batch semantic updates,
- enter a controlled degraded mode.

It must not silently skip authoritative mutations that break conservation or progression rules.

## 21. Observability

Simulation telemetry should expose:

- current tick,
- simulation time,
- accumulated lag,
- steps executed,
- dropped presentation frames,
- scheduled queue depth,
- catch-up mode,
- slow systems,
- deterministic sequence information.

## 22. Runtime Invariants

1. Rendering does not own authoritative time.
2. World rules do not read uncontrolled wall-clock time directly.
3. Authoritative update order is stable.
4. Pause semantics are explicit per system.
5. Offline catch-up is policy-governed and bounded.
6. Scheduled work is identifiable and idempotent.
7. Random authoritative outcomes are reproducible where replay requires it.
8. One system owns mutation for each canonical timed state.
9. Scene reload does not reset durable timers.
10. Performance degradation must not corrupt world meaning.

## 23. Verification Targets

Verification must cover:

- fixed-step behavior across render rates,
- deterministic ordering,
- pause and resume,
- timer persistence,
- scheduler retries,
- offline catch-up caps,
- summarized simulation equivalence,
- seeded randomness,
- background suspension,
- network clock reconciliation boundaries.

## 24. Architectural Outcome

This slice makes time and simulation explicit world services.

It prevents frame rate, UI timers, scene callbacks, and device clock behavior from becoming hidden authorities over gameplay outcomes.