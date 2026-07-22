# Bridge Crossing Evidence Requirements

## Purpose

This document defines the evidence required to claim that Bridge Crossing has moved from approved contract to verified runtime behavior.

Documentation completeness does not equal implementation completeness. Repository, Runtime, Operational, Screenshot, and Human Product gates remain separate.

## Evidence Package

Every implementation or targeted patch round must provide a uniquely named evidence package containing:

- branch and commit SHA
- changed paths
- mapped runtime owners
- verification command results
- runtime logs or state traces
- screenshots required by the screenshot standard
- failure and recovery observations
- unresolved items and explicit gate status

Evidence must not overwrite a previous round.

## Gate A — Repository Evidence

Required:

- Bridge Crossing runtime paths identified in `00-RUNTIME-MAPPING.md`
- no duplicate landmark-state authority
- public exports and integration points identified
- state transitions represented in code or contract-verifier form
- invalid transitions rejected
- persistence and projection boundaries visible in the repository
- diff scope limited to approved implementation surfaces

Repository evidence may support `REPOSITORY PASS`. It cannot prove runtime or operational behavior.

## Gate B — Runtime Evidence

Required local execution evidence:

- install/build/typecheck/lint status as applicable
- relevant automated tests
- successful landmark activation
- every valid forward state transition
- representative invalid transition rejection
- reload reconstruction from durable progress
- idempotent final completion
- no runtime errors in the tested flow

Provide command names, results, and meaningful failure output. A summary without execution evidence is insufficient.

## Gate C — Operational Evidence

Required system-running evidence:

```text
Player input
  -> landmark activation
  -> command validation
  -> authoritative state transition
  -> persistence when required
  -> visual/UI projection
  -> destination verification
  -> reload continuity
```

The operational flow must be observed in the actual supported runtime environment, not inferred from repository structure.

## Screenshot Evidence

At minimum provide:

### Hero Frame

Shows destination, obstacle, bridge solution surface, and route hierarchy.

### Gameplay Frame — Blocked

Shows the player near the landmark before the bridge is crossable.

### Gameplay Frame — Crossable

Shows the completed or activated bridge and a clearly usable route.

### Exploration Frame

Shows how Bridge Crossing connects to surrounding world space and continuation.

### Scale Validation Frame

Shows player, bridge width, terrain mass, and destination relationship.

### Lighting Validation Frame

Shows that lighting supports destination, obstacle, route, and player readability.

Each image must use a unique filename and record the build/commit it represents.

## State Trace Evidence

Provide a trace equivalent to:

```text
UNDISCOVERED
  -> APPROACHING
  -> OBSERVING
  -> PREPARING
  -> CROSSABLE
  -> CROSSING
  -> CROSSING_VERIFIED
```

The trace must identify:

- triggering input or command
- previous state
- next state
- persistence outcome where applicable
- projection outcome

Also provide traces for at least these rejection cases:

- crossing before `CROSSABLE`
- destination entry through an invalid route
- repeated verification after completion

## Recovery Evidence

Demonstrate at least:

- leaving and re-entering during observation or preparation
- reload after a durable intermediate state
- reload after `CROSSING_VERIFIED`
- persistence failure or an equivalent controlled failure path where safely testable
- visual state does not falsely remain completed after an uncommitted failure

## Human Product Acceptance

Human review must answer:

- Is the destination understandable before heavy UI guidance?
- Does terrain make the bridge necessary?
- Is the next meaningful action clear?
- Does completion feel earned through crossing rather than merely triggered?
- Does the landmark fit Builders Valley's discovery and building philosophy?

Human Product Acceptance is distinct from technical PASS results.

## Status Vocabulary

Every gate must use one of:

- `PASS`
- `FAIL`
- `DEFERRED`
- `NOT APPLICABLE`

Do not use vague labels such as "looks good" or "mostly complete."

## Completion Rule

Bridge Crossing implementation is complete only when:

```text
Repository PASS
AND Runtime PASS
AND Operational PASS
AND Screenshot PASS
AND Human Product Acceptance PASS
```

Any deferred or failed gate keeps the implementation incomplete while preserving verified evidence from prior successful gates.

## Evidence Handoff Template

```text
BRIDGE_CROSSING_EVIDENCE

Branch:
Commit:
Changed paths:
Runtime owners:

Repository Gate:
Runtime Gate:
Operational Gate:
Screenshot Gate:
Human Product Gate:

Valid transition evidence:
Invalid transition evidence:
Reload/recovery evidence:
Artifacts:
Unresolved items:
Next targeted action:
```
