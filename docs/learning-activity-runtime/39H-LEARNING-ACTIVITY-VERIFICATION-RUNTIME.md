# Chapter 39H — Learning Activity Verification Runtime

## 1. Purpose

The Learning Activity Verification Runtime defines how the platform proves that Learning Activity behavior is correct, safe, deterministic, compatible, and operationally reliable across repository, runtime, integration, and production boundaries.

Verification is not a single test suite. It is a layered evidence system that demonstrates that the Learning Activity Runtime behaves according to its contracts and invariants under normal, concurrent, degraded, replayed, migrated, and adversarial conditions.

Its governing rule is:

> Verification must prove the behavior that matters at the boundary where that behavior becomes authoritative.

## 2. Verification Boundary

This runtime verifies:

- aggregate lifecycle correctness
- authorization correctness
- orchestration correctness
- adaptation correctness
- evidence linkage correctness
- projection correctness
- persistence and replay correctness
- cross-runtime contract compatibility
- safety and privacy constraints
- migration and evolution behavior
- observability and recovery behavior

It does not redefine product policy or learning meaning.

## 3. Five Verification Gates

### Gate A — Repository Gate

Proves static architecture and contract integrity.

Includes:

- file and module boundaries
- public exports
- contract schemas
- lifecycle definitions
- invariant catalog
- verifier wiring
- snapshots
- no unintended scope leakage

Repository Gate cannot certify local dependency resolution, database behavior, or running integrations.

### Gate B — Runtime Gate

Proves executable behavior in a local or CI runtime.

Includes:

- build
- typecheck
- lint
- unit tests
- state-machine tests
- property-based tests
- deterministic transition tests
- persistence adapter tests

### Gate C — Integration Gate

Proves cross-module and cross-runtime compatibility.

Includes:

- Learning Path → Activity creation
- Activity Authorization → Orchestration
- Activity → Session binding
- Session → Activity completion
- Activity → Evidence linking
- Activity completion → Mastery evaluation request
- Activity events → Projection rebuild

### Gate D — Operational Gate

Proves behavior in a running system under real infrastructure conditions.

Includes:

- API to application to database flow
- concurrency
- retries
- timeouts
- outbox/inbox behavior
- restart recovery
- observability
- tenant isolation
- role-based projection visibility

### Gate E — Evolution Gate

Proves compatibility across schema, policy, definition, and event-version changes.

Includes:

- event upcasting
- snapshot compatibility
- aggregate migration
- activity-definition migration
- mixed-version operation
- shadow execution
- rollback and forward-fix behavior

## 4. Verification Domains

The minimum verification domains are:

1. Contract verification
2. Aggregate lifecycle verification
3. Authorization verification
4. Orchestration verification
5. Adaptation verification
6. Evidence verification
7. Projection verification
8. Persistence and replay verification
9. Cross-runtime integration verification
10. Safety, privacy, accessibility, and fairness verification
11. Evolution verification
12. Operational recovery verification

## 5. Contract Verification

Contract verification ensures that commands, results, events, failures, and projections conform to declared schemas.

Required checks:

- required fields
- nullability
- identifier types
- enum exhaustiveness
- version fields
- tenant identity
- learner identity
- correlation and causation metadata
- failure code stability
- backward-compatible parsing

Unknown required fields or enum values must fail explicitly rather than being silently coerced.

## 6. Aggregate Lifecycle Verification

Lifecycle tests must prove every legal transition and reject every illegal transition.

Representative legal sequence:

```text
CREATED
→ AUTHORIZED
→ READY
→ IN_PROGRESS
→ PAUSED
→ IN_PROGRESS
→ COMPLETED
→ EVIDENCE_LINKED
→ CLOSED
```

Representative terminal alternatives:

```text
CANCELLED
ABORTED
EXPIRED
FAILED
SUPERSEDED
```

Required properties:

- terminal states cannot return to active states
- aggregate version increments exactly once per accepted command
- rejected commands do not mutate state
- timestamps are monotonic where required
- only one active session may be bound

## 7. Authorization Verification

Authorization tests must cover:

- valid learner and tenant
- active Learning Path reference
- prerequisite satisfied
- prerequisite unsatisfied
- expired authorization
- revoked authorization
- attempt limit reached
- retry allowed
- retry denied
- accessibility requirement satisfied
- safety review required
- human approval required
- replacement authorization

A visible activity without valid authorization must remain unstartable.

## 8. Orchestration Verification

Orchestration scenarios include:

- start from READY
- duplicate start
- bind session
- duplicate session binding
- conflicting session binding
- pause with checkpoint
- resume from checkpoint
- complete attempt
- completion without required evidence
- close after obligations are satisfied
- cancel before start
- abort while active
- expire before start
- timeout while paused
- recover after process restart

## 9. Adaptation Verification

Adaptation verification proves that adaptive behavior is explicit and lineage-safe.

Required scenarios:

- remediation insertion
- retry with variation
- difficulty reduction
- difficulty increase
- substitution
- acceleration
- defer
- cancel and replace
- cooldown rejection
- anti-thrashing protection
- human review path
- adaptation activation failure
- concurrent adaptation requests

Properties:

- completed history remains immutable
- adaptation creates explicit lineage
- old authorization is revoked or superseded correctly
- new activity is independently authorized
- no in-place reinterpretation of completed attempts

## 10. Evidence Verification

Evidence tests must prove:

- execution evidence links to the correct activity and attempt
- completion evidence does not imply mastery
- evidence bundle is immutable after acceptance
- correction uses supersession
- withdrawal is explicit
- quarantined evidence cannot feed mastery
- duplicate evidence links are idempotent
- cross-tenant evidence links fail
- evidence integrity hashes verify

## 11. Projection Verification

Projection tests must prove:

- learner view shows only permitted activity state
- parent view respects guardian scope
- teacher view respects roster and tenant boundaries
- operator view contains operational detail without leaking restricted learner data
- stale projections suppress unsafe actions
- projection rebuild is deterministic
- projection version advances monotonically
- replayed projections match live projections
- projection deletion does not affect authority

## 12. Persistence Verification

Persistence tests include:

- atomic aggregate/event/command/outbox commit
- optimistic concurrency conflict
- command idempotency
- command fingerprint conflict
- inbox duplicate handling
- outbox retry
- snapshot fallback
- event gap detection
- integrity hash mismatch
- tenant-scoped repository access
- backup restore reconciliation

## 13. Replay Verification

Replay tests must prove:

```text
replay(event stream) == persisted state
```

for:

- complete lifecycle
- cancellation lifecycle
- retry lineage
- adaptation lineage
- recovered ambiguous outcome
- migrated event schema
- snapshot-assisted replay

Replay must not call external policy services or use current time.

## 14. Cross-Runtime Contract Verification

Required contract pairs:

### Learning Path → Learning Activity

- stable pathId and pathVersion
- activity intent is explicit
- no implicit authorization

### Learning Activity → Learning Session

- one active session binding
- session identity is stable
- completion references correct attempt

### Learning Session → Learning Activity

- session result is not automatically mastery
- completion acceptance remains Activity authority

### Learning Activity → Evidence

- evidence references activityId and attemptId
- evidence acceptance remains Evidence authority

### Learning Activity → Mastery

- only governed evidence bundles are submitted
- Activity Runtime does not set mastery directly

## 15. Golden Scenarios

Golden scenarios are end-to-end deterministic examples maintained as durable verification assets.

Minimum golden scenarios:

1. Standard practice activity completes and closes.
2. Activity pauses and resumes from checkpoint.
3. Failed attempt schedules an authorized retry.
4. Adaptive substitution creates new lineage.
5. Evidence is linked but mastery remains pending.
6. Authorization expires before start.
7. Active activity is aborted safely.
8. Network timeout resolves through idempotent command lookup.
9. Process restart resumes outbox and active orchestration state.
10. Event replay rebuilds identical aggregate and projections.
11. Tenant boundary rejects cross-tenant activity access.
12. Definition migration preserves historical meaning.

## 16. State-Machine Testing

State-machine tests generate command sequences and verify invariants after every step.

Commands may include:

- authorize
- revoke
- start
- bind session
- checkpoint
- pause
- resume
- complete attempt
- link evidence
- close
- cancel
- abort
- expire
- request retry
- request adaptation

The test model must compare expected state with runtime state and reject illegal transitions.

## 17. Property-Based Testing

Useful properties include:

- no illegal command decreases aggregate version
- rejected commands preserve state
- replay is deterministic
- duplicate commands are idempotent
- terminal states remain terminal
- one activity has at most one active session
- every accepted transition emits at least one event
- every emitted event advances aggregate version consistently
- tenant identity never changes
- adaptation never rewrites historical attempts

## 18. Concurrency Verification

Concurrency scenarios include:

- two simultaneous starts
- start and revoke race
- pause and complete race
- two completion submissions
- concurrent evidence links
- adaptation and retry race
- close and cancel race

Exactly one valid transition may win when commands compete for the same expected version.

## 19. Fault Injection

Fault injection must cover failures at:

- before aggregate load
- after aggregate load
- before event append
- after event append but before state write
- before database commit
- after commit before response
- during outbox publication
- during inbox processing
- during projection update
- during snapshot creation
- during replay

The result must preserve atomicity and recoverability.

## 20. Time Verification

Time-sensitive behavior requires a controlled clock.

Verify:

- authorization expiration
- activity deadline
- retry cooldown
- pause timeout
- evidence submission window
- projection freshness threshold

Tests must not depend on wall-clock timing.

## 21. Determinism Verification

Given identical:

- initial state
- command
- clock value
- policy version
- definition version

The transition result and emitted events must be identical.

Randomness must be supplied as explicit seeded input and recorded when it affects behavior.

## 22. Security Verification

Required security tests:

- tenant isolation
- learner ownership
- role scope
- unauthorized command rejection
- tampered event detection
- replay access control
- repair-operation authorization
- sensitive payload redaction
- audit-log completeness

## 23. Privacy Verification

Verify:

- minimal personal data in events
- projection redaction by role
- guardian scope
- teacher roster scope
- operator masking
- export boundaries
- erasure/anonymization compatibility
- no sensitive values in metrics or logs

## 24. Accessibility Verification

Activity authorization and execution must verify declared accessibility requirements, including where relevant:

- keyboard navigation
- screen reader semantics
- reduced motion compatibility
- color-independent cues
- readable text scaling
- alternative input modes
- time accommodation

Accessibility failure must not be hidden as learner failure.

## 25. Fairness Verification

Adaptive and authorization policies must be checked for systematic disadvantage across relevant learner groups.

Verification may include:

- retry availability parity
- remediation assignment distribution
- difficulty adaptation distribution
- human-review escalation distribution
- false block rate
- accessibility accommodation effectiveness

Fairness analysis must use governed data and privacy-safe reporting.

## 26. Performance Verification

Required performance targets should cover:

- command latency
- aggregate load latency
- event append latency
- projection update latency
- replay throughput
- rebuild throughput
- outbox delay
- high-contention behavior

Performance tests must preserve correctness assertions.

## 27. Load Verification

Load scenarios include:

- many learners starting activities simultaneously
- burst completion submissions
- large projection rebuild
- large tenant replay
- outbox backlog recovery
- retry storms

Rate limiting and backpressure must not corrupt authority.

## 28. Observability Verification

Verify that every critical failure produces:

- typed failure code
- correlationId
- tenant-safe context
- aggregate identity
- version context
- retryability classification
- metric increment
- structured log or trace

Observability must not expose sensitive learner data.

## 29. Recovery Verification

Recovery scenarios:

- restart with active activity
- restart with pending outbox
- restart with partially processed inbox
- snapshot corruption
- projection lag
- event stream integrity failure
- replay divergence
- manual quarantine and repair

Recovery must begin from durable authority.

## 30. Evolution Verification

Evolution tests must cover:

- old event read by new code
- old snapshot read or invalidated by new code
- old activity definition retained for historical replay
- new definition used only for new or explicitly migrated activities
- mixed-version aggregates
- upcaster determinism
- shadow execution comparison
- rollback compatibility
- forward-fix compatibility

## 31. Verification Evidence Package

Each implementation milestone should produce an evidence package containing:

```text
scope
base commit
head commit
changed paths
contracts verified
invariants verified
commands executed
results
failures and waivers
runtime environment
known limitations
human verification status
```

## 32. Failure Classification

Verification results use:

- PASS
- FAIL
- BLOCKED
- DEFERRED
- NOT_APPLICABLE

A Gate may not be marked PASS when required evidence is absent.

## 33. Waivers

A waiver requires:

- explicit unmet check
- risk statement
- owner
- expiration
- mitigation
- follow-up issue

Waivers must not silently convert FAIL into PASS.

## 34. Release Gate Policy

A release candidate requires:

- Gate A PASS
- Gate B PASS
- Gate C PASS for changed integrations
- Gate D PASS for operationally relevant changes
- Gate E PASS for evolution changes

Documentation-only architecture changes may complete Repository Gate while Runtime and Operational Gates remain not applicable or deferred, provided that distinction is explicit.

## 35. Minimum Verification Matrix

```text
Foundation          → contract + lifecycle + state-machine
Authorization       → eligibility + expiry + revocation
Orchestration       → start/pause/resume/complete/close
Adaptive            → lineage + cooldown + replacement
Evidence            → linkage + integrity + supersession
Projection          → role views + freshness + rebuild
Persistence         → atomicity + idempotency + concurrency
Replay              → deterministic reconstruction
Integration         → Path/Session/Evidence/Mastery contracts
Evolution           → compatibility + migration + rollback
Operations          → recovery + observability + tenant safety
```

## 36. Core Verification Invariants

1. Verification evidence must correspond to the boundary being certified.
2. Repository review is not runtime certification.
3. Runtime tests are not operational proof.
4. Rejected commands must be verified as non-mutating.
5. Replay must reproduce authoritative state deterministically.
6. Concurrency tests must prove exactly-one-winner semantics.
7. Cross-runtime tests must preserve ownership boundaries.
8. Accessibility failures must not be classified as learner failure.
9. Privacy and tenant isolation are release gates.
10. Evolution changes require compatibility evidence.
11. Waivers are explicit and temporary.
12. No Gate passes by inference alone.

## 37. Final Boundary

```text
Contracts define expected behavior.
Tests exercise that behavior.
Runtime evidence proves execution.
Operational evidence proves the integrated system.
Evolution evidence proves continuity across change.
Verification never replaces product authority;
it proves that authority is implemented correctly.
```
