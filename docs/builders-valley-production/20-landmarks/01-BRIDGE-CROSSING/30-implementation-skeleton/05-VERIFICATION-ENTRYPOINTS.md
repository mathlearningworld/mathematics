# Bridge Crossing Implementation Skeleton — Verification Entry Points

## Purpose

This document defines the verification surfaces required before Bridge Crossing implementation can be called repository-ready, runtime-ready, or operationally complete.

## Proposed Verification Paths

```text
src/builders-valley/verification/
├── bridge-crossing.contract.spec.ts
├── bridge-crossing.state-machine.spec.ts
├── bridge-crossing.integration.spec.ts
└── index.ts

scripts/
└── verify-builders-valley-bridge-crossing.*
```

Exact test framework and script extension may follow the existing repository toolchain.

## Repository Gate

Repository verification must prove:

- package layout matches approved ownership
- public exports are intentional
- no unauthorized deep imports exist
- Bridge Crossing does not own global authorities
- registration identity is unique
- implementation paths replace all `TBD / UNMAPPED` mapping entries
- verifier and test files are wired into the repository toolchain

Repository PASS does not certify executable behavior.

## Runtime Gate

Runtime verification must execute and prove:

- valid state transitions succeed
- invalid transitions are rejected
- transition replay is idempotent where required
- persistence conflicts do not produce false success
- reload reconstructs the same meaningful state
- duplicate registration blocks startup
- missing mandatory authorities block startup
- port failures map to stable runtime failures

## Operational Gate

Operational verification must demonstrate the complete player flow:

```text
Approach
  → Observe obstruction and destination
  → Prepare required action
  → Build / Repair / Activate
  → Bridge becomes crossable
  → Player crosses
  → Destination boundary verifies completion
  → Reload preserves verified progress
```

## Screenshot and Visual Evidence

Evidence must conform to the Builders Valley Screenshot Standard and include at minimum:

- Hero Frame
- Gameplay Frame before the crossing is available
- Gameplay Frame after the crossing becomes available
- Exploration Frame showing continuation beyond the landmark
- Scale Validation Frame
- Lighting Validation Frame

Screenshots support product acceptance; they do not replace runtime evidence.

## Evidence Package

The Executor must return:

- branch and base commit
- changed paths
- actual runtime ownership map
- public exports
- test and verifier wiring
- command results
- state-transition evidence
- persistence and reload evidence
- operational recording or equivalent evidence
- required screenshots
- known limitations
- final status separated into Repository, Runtime, Operational, and Human Acceptance

## Status Vocabulary

Only these statuses are permitted:

- `NOT_STARTED`
- `BLOCKED`
- `IMPLEMENTED_UNVERIFIED`
- `REPOSITORY_PASS`
- `RUNTIME_PASS`
- `OPERATIONAL_PASS`
- `HUMAN_ACCEPTED`

A later gate cannot be inferred from an earlier one.

## Completion Rule

Bridge Crossing is complete only when:

```text
Repository PASS
AND Runtime PASS
AND Operational PASS
AND Screenshot Evidence PASS
AND Human Product Acceptance
```

Documentation completion alone must never be reported as runtime or operational completion.