# Chapter 29B — Gameplay Session Runtime

Status: Architecture Definition
Chapter: 29 — Gameplay Runtime
Slice: 29B

## 1. Purpose

Gameplay Session Runtime governs the complete operational lifecycle of one learner's playable session. It establishes the authoritative boundary within which scene state, objective context, interaction events, assistance, faults, checkpoints, completion requests, and closure are interpreted.

A gameplay session is not merely a browser visit or scene load. It is a versioned, authorized, durable execution context.

## 2. Session Authority

The GameplaySession aggregate is the sole authority for:

- whether a session may open;
- which learner owns the session;
- which mission, objective set, world, and scene are bound;
- whether interaction intake is currently allowed;
- whether the session may pause, resume, complete, close, expire, or be abandoned;
- which checkpoint is authoritative;
- which runtime and policy versions apply.

No UI component, scene object, local cache, or client store may independently assert session state.

## 3. Session Identity

Required identity fields:

```text
tenantId
learnerId
gameplaySessionId
sessionCategory
worldId
sceneId
runtimeVersion
policyVersion
createdAt
```

Conditional identity:

```text
missionId
missionVersion
missionActivationId
objectiveSetId
learningActivityId
practicePlanId
diagnosticRunId
```

All conditional bindings must be validated when the session opens and revalidated when a stale session resumes.

## 4. Session State Machine

```text
CREATED
  ↓ open
OPEN
  ↓ start
ACTIVE
  ├─ pause → PAUSED
  ├─ fault → FAULTED
  ├─ block → BLOCKED
  ├─ request completion → COMPLETION_PENDING
  ├─ abandon → ABANDONED
  └─ expire → EXPIRED

PAUSED
  ├─ resume → ACTIVE
  ├─ abandon → ABANDONED
  └─ expire → EXPIRED

FAULTED
  ├─ recover → PAUSED or ACTIVE
  ├─ quarantine → QUARANTINED
  └─ abandon → ABANDONED

BLOCKED
  ├─ unblock → PAUSED or ACTIVE
  ├─ abandon → ABANDONED
  └─ expire → EXPIRED

COMPLETION_PENDING
  ├─ confirm → COMPLETED
  ├─ reject → ACTIVE or PAUSED
  └─ hold → BLOCKED

COMPLETED
  ↓ close
CLOSED
```

Terminal states:

- CLOSED;
- ABANDONED;
- EXPIRED;
- QUARANTINED.

COMPLETED is operationally terminal for interaction intake but still permits final evidence publication and explicit closure.

## 5. Open Session Command

`OpenGameplaySession` must include:

- commandId;
- tenantId;
- learnerId;
- requestedSessionId or idempotency key;
- sessionCategory;
- world and scene binding;
- mission or activity binding when applicable;
- runtimeVersion;
- policyVersion;
- sourceDeviceId;
- requestedAt;
- correlationId.

Opening requires:

- authenticated actor;
- valid learner scope;
- authorized binding;
- supported runtime version;
- available policy version;
- no conflicting active-session policy violation.

## 6. Concurrent Session Policy

The policy must explicitly define whether a learner may have:

- one active session globally;
- one active session per mission;
- one active session per device;
- multiple parallel sessions.

Default architectural preference:

```text
One authoritative ACTIVE gameplay session per learner per mission binding.
```

Additional sessions may open only when product policy explicitly permits parallelism.

Conflicting sessions must not silently share progress.

## 7. Start and Activation

OPEN means the durable context exists.

ACTIVE means interaction intake is allowed.

A session becomes ACTIVE only after:

- scene manifest verification;
- required asset readiness or safe fallback readiness;
- objective context loading;
- client runtime handshake;
- clock and sequence initialization;
- checkpoint restoration when resuming.

A scene render alone does not prove that a session is ACTIVE.

## 8. Pause Runtime

Pause reasons include:

- learner requested;
- application backgrounded;
- device interruption;
- connectivity loss;
- teacher requested;
- parent requested;
- runtime safety hold;
- scene transition;
- checkpoint operation.

Pause must record:

- pauseId;
- reason;
- actor;
- effective time;
- latest accepted source sequence;
- checkpoint reference;
- outstanding interaction batch state.

Events received after pause may be rejected, buffered, or reconciled according to explicit policy.

## 9. Resume Runtime

Resume requires revalidation of:

- learner authorization;
- mission binding and version;
- session terminal state;
- scene availability;
- runtime compatibility;
- policy compatibility;
- checkpoint integrity;
- outstanding event sequence;
- expiration rules.

Resume outcomes:

- RESUMED;
- RESUMED_WITH_MIGRATION;
- RESUMED_WITH_LIMITATIONS;
- BLOCKED;
- EXPIRED;
- QUARANTINED.

A stale session may not resume merely because a local client still has cached state.

## 10. Checkpoint Model

A checkpoint is a recoverable operational snapshot, not the source of truth.

Checkpoint contents may include:

- gameplaySessionId;
- sessionVersion;
- latestEventSequence;
- scene position;
- scene-local object state;
- objective-local state;
- inventory references;
- assist state;
- timer state;
- deterministic random seed state;
- hash of durable event prefix.

Checkpoint acceptance requires hash and version validation.

## 11. Device Handoff

A session may move between devices only through an explicit handoff process.

Handoff must address:

- current device lease;
- latest durable sequence;
- unflushed local events;
- checkpoint publication;
- new device authorization;
- runtime compatibility;
- duplicate event prevention.

The new device cannot assume authority until the prior lease is released, expired, or superseded by policy.

## 12. Heartbeat and Lease

Active sessions may use a renewable lease.

Lease fields:

- leaseId;
- gameplaySessionId;
- deviceId;
- issuedAt;
- expiresAt;
- sessionVersion;
- latestObservedSequence.

A heartbeat proves connectivity to the session authority. It does not prove meaningful learner activity.

## 13. Idle and Expiration

Idle time must be distinct from active learning time.

Expiration policy may consider:

- lease expiration;
- maximum pause duration;
- mission expiration;
- scene version withdrawal;
- policy withdrawal;
- learner account state;
- administrative closure.

Expiration produces a durable event and preserves all prior accepted facts.

## 14. Blocking and Faults

BLOCKED represents a known condition preventing safe continuation.

FAULTED represents a runtime failure requiring recovery analysis.

Block examples:

- mission suspended;
- objective unavailable;
- required asset unsafe;
- policy mismatch;
- required human approval missing.

Fault examples:

- deterministic state mismatch;
- corrupted checkpoint;
- event sequence gap;
- client runtime crash;
- scene invariant failure.

Faults must not be converted into learner failure.

## 15. Abandonment

Abandonment is explicit and attributable.

Abandonment reasons:

- learner chose to stop;
- guardian stopped session;
- teacher stopped session;
- system safety stop;
- superseded by new session;
- unrecoverable runtime failure.

Abandonment preserves partial gameplay facts but does not imply objective failure, lack of effort, or lack of understanding.

## 16. Completion Request

A session may request gameplay completion when operational exit criteria appear satisfied.

The request must include:

- session version;
- final accepted sequence;
- objective signal summary;
- unresolved blockers;
- unresolved faults;
- assist summary;
- evidence candidate references;
- final checkpoint hash.

Gameplay Session Runtime does not confirm Mission completion or mastery.

## 17. Close Session

Close is permitted after:

- completion and evidence publication;
- accepted abandonment;
- accepted expiration;
- quarantine decision;
- explicit administrative closure.

Closure records:

- close reason;
- actor;
- final state;
- final session version;
- final event sequence;
- evidence publication state;
- unresolved limitations;
- closedAt.

## 18. Optimistic Concurrency

Every command must carry an expected session version unless it is an idempotent creation command.

Conflict behavior:

```text
expectedVersion != currentVersion
→ reject with GAMEPLAY_SESSION_VERSION_CONFLICT
```

No last-write-wins behavior is permitted.

## 19. Idempotency

Idempotency applies to:

- session opening;
- pause;
- resume;
- checkpoint publication;
- completion request;
- close;
- abandonment;
- device handoff.

The same commandId with the same payload returns the prior result.

The same commandId with a different payload is rejected as an idempotency conflict.

## 20. Session Events

Required event metadata:

- eventId;
- gameplaySessionId;
- sessionVersion;
- tenantId;
- learnerId;
- eventType;
- actorType;
- actorId when applicable;
- effectiveAt;
- recordedAt;
- correlationId;
- causationId;
- policyVersion;
- runtimeVersion;
- payloadHash.

## 21. Typed Failures

- GAMEPLAY_SESSION_NOT_FOUND;
- GAMEPLAY_SESSION_ALREADY_EXISTS;
- GAMEPLAY_SESSION_NOT_OPEN;
- GAMEPLAY_SESSION_NOT_ACTIVE;
- GAMEPLAY_SESSION_TERMINAL;
- GAMEPLAY_SESSION_VERSION_CONFLICT;
- GAMEPLAY_SESSION_LEASE_CONFLICT;
- GAMEPLAY_SESSION_EXPIRED;
- GAMEPLAY_SESSION_QUARANTINED;
- CHECKPOINT_INVALID;
- CHECKPOINT_VERSION_MISMATCH;
- EVENT_SEQUENCE_GAP;
- DEVICE_HANDOFF_CONFLICT;
- MISSION_BINDING_STALE;
- SCENE_VERSION_UNAVAILABLE;
- RUNTIME_VERSION_UNSUPPORTED;
- POLICY_VERSION_UNAVAILABLE;
- ACTOR_UNAUTHORIZED.

## 22. Session Invariants

1. Only the aggregate controls session state.
2. OPEN and ACTIVE are distinct.
3. Interaction intake is permitted only while ACTIVE unless reconciliation policy explicitly applies.
4. Terminal sessions never resume.
5. A stale mission binding blocks unsafe resume.
6. Checkpoints never replace event history.
7. Device handoff is explicit and lease-safe.
8. Heartbeats do not count as learning activity.
9. Runtime faults do not become learner failure claims.
10. Completion requests do not assert Mission completion.
11. Closing never deletes partial evidence.
12. Every state transition is versioned and attributable.

## 23. Acceptance Gate

29B is architecturally complete when implementation can verify:

- deterministic state transitions;
- valid open/start distinction;
- pause and resume revalidation;
- checkpoint integrity;
- device lease and handoff safety;
- explicit expiration and abandonment;
- completion request boundary;
- optimistic concurrency;
- idempotent commands;
- durable and attributable session history.
