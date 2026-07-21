# Chapter 29H — Gameplay Persistence & Replay

## Status

Architecture specification for durable gameplay history, recovery, outbox publication, and deterministic replay.

## Purpose

Gameplay Persistence & Replay preserves authoritative gameplay truth across sessions, devices, offline periods, failures, policy evolution, and operational recovery.

```text
Gameplay Commands
      ↓
Authoritative Transition
      ↓
Append-only Gameplay Ledger
      ↓
Snapshots / Outbox / Projections / Replay
```

Persistence is not merely storage. It is the durable authority boundary for what happened, in what order, under which policy, by which actor, and with which limitations.

## Core Doctrine

```text
Gameplay history is append-only.
Supersession never erases prior truth.
Historical replay is not reassessment.
Snapshot is not Source of Truth.
```

No implementation may rewrite history to make a later projection or policy appear as though it existed at the original event time.

## Durable Record Families

- GameplaySessionRecord
- GameplaySessionTransitionRecord
- GameplayObjectiveRecord
- GameplayObjectiveTransitionRecord
- GameplayInteractionRecord
- GameplayWorldMutationRecord
- GameplayEvidenceCandidateRecord
- GameplayCompletionDecisionRecord
- GameplayCheckpointRecord
- GameplayLeaseRecord
- GameplaySupersessionRecord
- GameplayVerificationRecord
- GameplayReplayRecord
- GameplayIdempotencyRecord
- GameplayOutboxRecord
- GameplayQuarantineRecord

Every record must include tenant identity, learner identity, aggregate identity, sequence or version, correlation identity, causation identity, source provenance, policy version, actor context, timestamps, and integrity metadata.

## Time Model

The runtime distinguishes:

```text
Source Time
Client Observed Time
Server Received Time
Decision Time
Effective Time
Recorded Time
Publication Time
```

Client time is evidence, not ordering authority. Authoritative ordering must be assigned durably by the server or by an approved offline reconciliation protocol.

## Aggregate Boundaries

Primary aggregates include:

- Gameplay Session
- Gameplay Objective Instance
- Interaction Stream Partition
- Evidence Candidate Set
- Gameplay Completion Decision

Transactions must preserve aggregate invariants. Cross-aggregate consequences are delivered through durable outbox records, idempotent consumers, and explicit reconciliation.

## Append-only Ledger

Accepted transitions create immutable records. Corrections are represented through compensating, invalidating, superseding, or quarantining records rather than mutation or deletion.

Permitted semantic corrections include:

- INVALIDATED_BY_INTEGRITY_FAILURE
- SUPERSEDED_BY_POLICY_CORRECTION
- CORRECTED_ACTOR_ATTRIBUTION
- CORRECTED_ORDERING_AFTER_OFFLINE_RECONCILIATION
- WITHDRAWN_BY_PRIVACY_POLICY

Correction records must reference the prior record and explain scope, authority, reason, and effect.

## Optimistic Concurrency

Every state-changing command must provide an expected aggregate version or equivalent concurrency token.

```text
Expected Version ≠ Current Version
→ Reject or explicitly reconcile
```

Last-write-wins is prohibited for session state, objective state, evidence state, completion decisions, leases, and checkpoints.

## Idempotency

Idempotency keys are required for retryable commands and offline synchronization. A repeated key with identical semantic input returns the prior durable result. A repeated key with different semantic input is rejected and audited.

Idempotency scope must include tenant, learner, command family, aggregate, and actor context.

## Checkpoints and Snapshots

Checkpoints accelerate resume. Snapshots accelerate reads and replay. Neither replaces the append-only ledger.

A valid checkpoint includes:

- source ledger position;
- aggregate version;
- world-state hash;
- runtime compatibility version;
- objective state hashes;
- pending interaction references;
- assistance and accessibility context;
- integrity signature;
- creation and expiry times.

Checkpoint corruption or incompatibility must fall back to ledger reconstruction or a typed recoverable failure.

## Transactional Outbox

Gameplay state transitions and their outbound messages must commit atomically.

Outbox destinations include:

- Mission Engine
- Assessment Engine
- Recommendation refresh triggers
- Projection workers
- Operational monitoring
- Audit and replay services

Publication retries must be idempotent. Publication success does not mutate the original gameplay decision.

## Offline Persistence

Offline-capable clients may retain encrypted local queues and provisional checkpoints. Local storage is never final authority.

On reconnection the server must validate:

1. tenant and learner identity;
2. session binding and lease history;
3. event schema and runtime version;
4. idempotency;
5. local ordering evidence;
6. authoritative ordering;
7. objective eligibility;
8. world mutation conflicts;
9. assistance and collaboration attribution;
10. integrity and privacy constraints.

Conflicts must be preserved and resolved explicitly. They must not be silently dropped or reordered to manufacture success.

## Replay Modes

```text
HISTORICAL_REPLAY
CURRENT_POLICY_SIMULATION
DIAGNOSTIC_REPLAY
PROJECTION_REPLAY
RECOVERY_REPLAY
WORLD_STATE_REPLAY
OFFLINE_RECONCILIATION_REPLAY
```

### Historical Replay

Reconstructs the result under the exact historical code compatibility contract, policy version, source ordering, and recorded facts where available.

### Current Policy Simulation

Evaluates historical records under a current policy for analysis only. It must never overwrite historical decisions.

### Diagnostic Replay

Explains a failure, divergence, integrity issue, or unexpected outcome.

### Projection Replay

Rebuilds audience-specific read models from authoritative records.

### Recovery Replay

Reconstructs aggregates after snapshot loss, worker failure, or disaster recovery.

### World State Replay

Reconstructs gameplay world mutations to a declared ledger position.

## Replay Outcomes

```text
MATCH
MATCH_WITH_NON_SEMANTIC_DIFFERENCE
DIVERGED
UNREPLAYABLE
FAILED
QUARANTINED
```

Every replay result stores source range, versions, environment fingerprint, policy versions, output hashes, divergence classification, limitations, and operator action.

Replay divergence is evidence. It must not be hidden.

## Retention and Privacy

Retention policy must distinguish operational records, learner evidence, raw interactions, sensitive content, collaboration data, security telemetry, and derived projections.

Privacy erasure requirements must use legally compliant withdrawal, cryptographic erasure, redaction, or tombstone strategies without falsely rewriting audit history. Access to retained records remains least-privilege and auditable.

## Failure Semantics

Typed failures include:

- GAMEPLAY_PERSISTENCE_CONFLICT
- GAMEPLAY_SEQUENCE_CONFLICT
- GAMEPLAY_IDEMPOTENCY_CONFLICT
- GAMEPLAY_CHECKPOINT_CORRUPT
- GAMEPLAY_SNAPSHOT_INCOMPATIBLE
- GAMEPLAY_OUTBOX_FAILED
- GAMEPLAY_REPLAY_DIVERGED
- GAMEPLAY_REPLAY_UNAVAILABLE
- GAMEPLAY_INTEGRITY_MISMATCH
- GAMEPLAY_OFFLINE_RECONCILIATION_REQUIRED
- GAMEPLAY_RECORD_QUARANTINED

Operational failure must never be translated into learner failure.

## Recovery Rules

Recovery must prefer durable evidence over client claims, replay over guesswork, explicit quarantine over silent data loss, and compensating records over historical mutation.

A recovered runtime must prove its ledger position before accepting new commands.

## Acceptance Gates

Implementation is acceptable only when automated verification proves:

1. append-only history;
2. optimistic concurrency;
3. idempotent retry behavior;
4. atomic state and outbox writes;
5. deterministic aggregate reconstruction;
6. checkpoint corruption recovery;
7. snapshot fallback to ledger;
8. offline reconciliation preserves conflicts;
9. historical replay does not reassess;
10. current-policy simulation cannot mutate history;
11. divergence is persisted and visible;
12. tenant and learner isolation across storage and replay;
13. privacy retention rules are enforced;
14. no last-write-wins on authoritative state.

## Chapter Boundary

29H defines durability and replay. Publication meaning is constrained by 29G. Verification authority belongs to 29I. Final cross-runtime laws belong to 29J.
