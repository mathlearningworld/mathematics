# 35H — Session Verification Runtime

## 1. Purpose

The Session Verification Runtime defines how the Learning Session Runtime proves that its plans, execution, evidence, persistence, projections, recovery, and cross-runtime effects are structurally valid and operationally trustworthy.

Verification is not a single test suite and it is not a synonym for successful execution.

> A session may complete without being verified, and a verified runtime may still produce a learner outcome that requires human interpretation.

The verification runtime therefore establishes explicit gates, evidence classes, failure codes, and review boundaries.

---

## 2. Core Distinctions

- Test pass ≠ runtime proof
- Runtime proof ≠ educational truth
- Session completion ≠ mastery verification
- Projection consistency ≠ ledger correctness
- Evidence presence ≠ evidence quality
- No exception ≠ correct behavior
- Retry success ≠ absence of duplicate effects
- Replay success ≠ migration safety
- Structural validity ≠ policy authorization
- Repository review ≠ local runtime certification

---

## 3. Verification Domains

The verification system covers ten domains:

1. Contract Verification
2. Authority Verification
3. Planning Verification
4. Orchestration Verification
5. Adaptation Verification
6. Evidence Verification
7. Persistence and Replay Verification
8. Projection Verification
9. Safety and Policy Verification
10. Cross-Runtime Verification

Each domain produces explicit findings rather than a single undifferentiated pass/fail.

---

## 4. Verification Result Model

```ts
interface SessionVerificationResult {
  verificationId: string;
  sessionId?: string;
  runtimeVersion: string;
  planVersion?: number;
  verificationProfile: string;
  startedAt: string;
  completedAt: string;
  status: 'PASS' | 'PASS_WITH_WARNINGS' | 'FAIL' | 'INCONCLUSIVE';
  findings: SessionVerificationFinding[];
  evidenceRefs: string[];
  environmentRef?: string;
  verifierVersion: string;
}

interface SessionVerificationFinding {
  findingId: string;
  domain: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  code: string;
  message: string;
  subjectRef?: string;
  evidenceRefs: string[];
  remediation?: string;
}
```

`INCONCLUSIVE` is required when proof is unavailable or incomplete. It must not be converted into PASS.

---

## 5. Verification Profiles

### Repository Profile

Checks architecture, contracts, public exports, version declarations, invariant documentation, and verifier wiring without claiming runtime execution.

### Local Runtime Profile

Checks dependency loading, type/build integrity, reducers, persistence adapters, replay, and deterministic scenarios in a local environment.

### Integration Profile

Checks channel adapters, database behavior, outbox/inbox, cross-runtime contracts, and projection pipelines.

### Operational Profile

Checks a running end-to-end learner flow from session authorization through durable effects and visible projections.

### Recovery Profile

Checks interruption, restart, lease replacement, checkpoint recovery, and unknown effect reconciliation.

### Migration Profile

Checks schema upcasting, snapshot compatibility, shadow replay, and rollback readiness.

---

## 6. Contract Verification

Contract verification ensures every externally visible command, event, projection, and failure code is explicit and versioned.

Required checks:

- required fields exist
- enums are closed or intentionally extensible
- identity fields are unambiguous
- timestamps have defined semantics
- version fields are present
- idempotency keys are defined
- command/result/failure contracts align
- private runtime state does not leak through public contracts
- consumer compatibility expectations are documented

Contract verification must detect accidental semantic reuse of fields.

---

## 7. Authority Verification

Authority verification confirms that only authorized actors and runtimes may create or advance sessions.

Required scenarios:

- learner identity mismatch rejected
- tenant mismatch rejected
- actor lacks requested capability
- expired authorization rejected
- plan authority does not match session authority
- stale execution lease rejected
- stale fencing token rejected
- unauthorized objective replacement rejected
- human-only action cannot be automated
- system-only recovery action cannot be forged by client input

An authorization failure must not mutate session state.

---

## 8. Planning Verification

Planning verification proves that generated plans respect prerequisites, burden, time, evidence, accessibility, and policy constraints.

Required properties:

- objectives are bound to authorized mission or intervention intent
- unknown prerequisites are not treated as satisfied
- activities fit the allowed session duration
- activity sequence has valid entry and terminal paths
- evidence requirements exist before execution
- mandatory accessibility constraints are preserved
- fallback channels are authorized
- stop and completion rules are explicit
- no unsafe plan can be authorized
- deterministic inputs produce deterministic plan identity when required

Property-based testing should generate boundary combinations for time, prerequisite uncertainty, activity availability, and channel capability.

---

## 9. Orchestration Verification

Orchestration verification covers lifecycle transitions and dispatch safety.

Required lifecycle tests:

- only valid transitions are accepted
- terminal sessions cannot resume
- paused sessions do not accumulate active time
- waiting states remain distinguishable
- activity completion cannot be inferred from route navigation
- duplicate command delivery is idempotent
- concurrent executors cannot both advance state
- dispatch intent is durable before external delivery
- retry does not duplicate completion, score, or reward
- channel rejection is not classified as learner failure

Every transition test must assert both accepted and rejected paths.

---

## 10. Adaptation Verification

Adaptation verification ensures the runtime changes only what the authorized envelope allows.

Required checks:

- pacing adaptation stays within bounds
- hint escalation follows policy
- activity substitution preserves objective and evidence class
- protected objectives cannot be silently changed
- diagnostic claims are not rewritten by session adaptation
- accessibility support is not removed
- adaptation loops terminate
- repeated friction triggers escalation when required
- adaptations are explainable from recorded observations
- human-required adaptations remain blocked pending approval

The verifier must prove that “no adaptation” remains a valid safe result.

---

## 11. Evidence Verification

Evidence verification evaluates provenance, qualification, scope, duplication, contradiction, and correction lineage.

Required checks:

- each evidence item traces to a source event
- evidence is bound to learner, activity, objective, and plan version
- qualification rules are versioned
- duplicate evidence is detected
- retracted evidence no longer contributes to active inference
- corrected evidence preserves historical lineage
- reliability class matches capture conditions
- accessibility context is preserved
- completion events are not automatically treated as understanding evidence
- contradictory evidence remains visible rather than silently averaged away

Evidence verification must never claim mastery directly unless the Assessment or Progress authority contract explicitly establishes it.

---

## 12. Persistence Verification

Persistence verification checks durable authority.

Required scenarios:

- event append is atomic with version update
- outbox write is atomic with source event
- optimistic concurrency rejects stale expected versions
- repeated command ID returns prior outcome
- changed payload under repeated command ID is rejected
- event versions are contiguous
- tenant isolation is enforced in every repository path
- corrupt snapshot is discarded
- missing event breaks reconstruction explicitly
- ledger checksum mismatch fails closed

Database constraint verification must complement application checks.

---

## 13. Replay Verification

Replay verification compares reconstructed state with authoritative expected state.

Required checks:

- replay from event zero
- replay from every supported snapshot version
- snapshot plus tail equals full replay
- reducer execution performs no I/O
- replay performs no external side effects
- historical events upcast deterministically
- unknown schema version fails explicitly
- replayed final version matches ledger head
- invariant checks pass after each event or defined checkpoint
- replay result hash is stable across repeated runs

A replay mismatch is a critical verification failure.

---

## 14. Recovery Verification

Recovery verification uses deliberate failure injection.

Required scenarios:

- crash before event commit
- crash after event commit but before response
- crash after outbox write but before delivery
- crash after delivery but before acknowledgement
- lease expiration during activity
- device switch at checkpoint
- channel timeout with unknown outcome
- snapshot corruption
- projection lag during recovery
- human wait across deployment

The verifier must inspect durable state after each injected failure and prove the next action is safe.

---

## 15. Projection Verification

Projection verification proves read models are derived faithfully and declare freshness honestly.

Required checks:

- projection event cursor is monotonic
- duplicate event delivery is idempotent
- out-of-order events are rejected or buffered by policy
- rebuild produces the same projection result
- stale projections declare stale status
- learner and parent projections redact restricted details
- teacher and tutor views respect authorization scope
- terminal state matches ledger authority
- adaptation and evidence summaries trace to source events
- projection failure cannot mutate session authority

A visually correct UI is not sufficient proof; the verifier must compare projection state with ledger-derived expectations.

---

## 16. Safety and Policy Verification

Safety verification confirms protected learner constraints remain effective.

Required categories:

- age and content suitability
- accessibility obligations
- session burden and fatigue limits
- restricted data capture
- human escalation thresholds
- prohibited automated decisions
- emergency stop behavior
- consent and guardian policy where applicable
- retention and privacy policy
- fairness across supported channels and device classes

Critical safety failures block release or session authorization according to policy.

---

## 17. Cross-Runtime Verification

Learning Session Runtime interacts with Mission, Recommendation, Diagnostic, Intervention, Assessment, Progress, Curriculum, Skill Graph, and Gameplay runtimes.

Required checks:

- incoming authority references resolve
- outgoing event schemas match consumer contracts
- consumer deduplication keys are stable
- completion does not directly grant mastery
- evidence publication does not bypass assessment policy
- progress updates are based on authorized outcomes
- intervention linkage remains traceable
- curriculum and skill references use immutable identities or versioned mappings
- gameplay rewards cannot be duplicated by replay
- downstream failure does not erase session history

---

## 18. Golden Scenarios

A maintained golden scenario set should include:

1. Normal short session completion
2. Pause and resume on same device
3. Resume on another device
4. Learner inactivity and safe waiting
5. Channel fallback
6. Adaptive hint escalation
7. Human escalation
8. Conflicting evidence
9. Outbox redelivery
10. Unknown external dispatch outcome
11. Snapshot corruption and full replay
12. Concurrent executor race
13. Session cancellation
14. Session abandonment
15. Runtime version migration

Each golden scenario must assert ledger, aggregate, outbox, evidence, and projections.

---

## 19. Property and Model-Based Verification

The lifecycle state machine should be tested using generated command sequences.

Properties:

- terminal states remain terminal
- session version never decreases
- one accepted command yields a deterministic event sequence
- invalid commands produce no state mutation
- active time never includes paused or waiting intervals
- objective completion cannot exceed authorized objective set
- every effect acknowledgement has preceding durable intent
- every qualified evidence item has valid provenance
- replayed state equals live state
- no two active leases share the current fencing authority

---

## 20. Observability Verification

Operational verification must confirm that logs, metrics, and traces expose enough context without leaking sensitive learner data.

Required fields:

- session ID or privacy-safe trace reference
- command/event type
- session version
- plan version
- correlation and causation IDs
- executor and lease reference
- outcome and failure code
- latency class
- projection lag
- outbox attempt count

Raw learner responses must not appear in general-purpose logs unless explicitly authorized and protected.

---

## 21. Verification Gate Model

### Gate A — Repository Gate

Architecture, contract, verifier wiring, scope, public API, and review evidence.

### Gate B — Runtime Gate

Build, typecheck, unit/model tests, reducer determinism, persistence adapter tests, and replay.

### Gate C — Integration Gate

Database, outbox/inbox, adapters, projections, and cross-runtime contracts.

### Gate D — Operational Gate

Running learner flow, interruption, recovery, and visible UI behavior.

### Gate E — Evolution Gate

Migration, compatibility, shadow replay, rollback, and release evidence.

No earlier gate may be represented as proof of a later gate.

---

## 22. Failure Codes

Representative verification failure codes:

- `SESSION_CONTRACT_INVALID`
- `SESSION_AUTHORITY_VIOLATION`
- `SESSION_PLAN_UNSAFE`
- `SESSION_TRANSITION_INVALID`
- `SESSION_ADAPTATION_OUT_OF_ENVELOPE`
- `SESSION_EVIDENCE_PROVENANCE_INVALID`
- `SESSION_LEDGER_INTEGRITY_FAILED`
- `SESSION_REPLAY_MISMATCH`
- `SESSION_RECOVERY_UNSAFE`
- `SESSION_PROJECTION_DIVERGED`
- `SESSION_PRIVACY_POLICY_FAILED`
- `SESSION_CROSS_RUNTIME_CONTRACT_FAILED`
- `SESSION_VERIFICATION_INCONCLUSIVE`

---

## 23. Release Evidence Package

A release candidate should produce:

- runtime and schema versions
- changed contracts
- migration plan
- verifier versions
- gate results
- golden scenario results
- replay hashes
- failure-injection results
- projection rebuild results
- unresolved warnings
- rollback decision and procedure
- human test status

The evidence package must identify which checks were automated and which require human validation.

---

## 24. Runtime Invariants Established by 35H

1. Verification evidence must be explicit and reproducible.
2. Inconclusive evidence cannot be reported as PASS.
3. Session completion cannot prove mastery by itself.
4. Every lifecycle transition requires accepted and rejected-path verification.
5. Replay equivalence is mandatory for durable recovery.
6. Projection verification cannot substitute for ledger verification.
7. Safety-critical failures block authorization or release.
8. Cross-runtime effects require contract and deduplication verification.
9. Repository, runtime, integration, operational, and evolution gates remain distinct.
10. A release claim may not exceed the strongest completed verification gate.

---

## 25. Completion Criteria

35H is complete when the system has explicit verification domains, profiles, findings, failure codes, golden scenarios, model-based properties, failure-injection requirements, gate separation, and a release evidence package capable of proving Learning Session Runtime behavior without overstating certainty.