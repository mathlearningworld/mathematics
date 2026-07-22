# 36H — Journey Verification Runtime

## Status

- Chapter: 36 — Learning Journey Runtime
- Slice: 36H
- Authority: Architecture Source of Truth
- Scope: Verification model, gates, evidence, failure classification, and cross-runtime conformance

---

## 1. Purpose

Journey Verification Runtime defines how the system proves that a long-running learning journey is structurally correct, operationally safe, historically trustworthy, and consistent with the authority boundaries established across Chapters 25–36.

A journey is not verified merely because:

- documents exist,
- code compiles,
- a session launched,
- a projection rendered,
- or a milestone was marked complete.

Verification must be layered, evidence-based, reproducible, and explicit about which gate has passed.

---

## 2. Verification Doctrine

```text
Repository PASS ≠ Runtime PASS
Runtime PASS ≠ Integration PASS
Integration PASS ≠ Operational PASS
Operational PASS ≠ Educational outcome proof
```

The highest passed gate must be stated precisely. Lower gates may support higher gates, but they cannot be substituted for them.

---

## 3. Verification Domains

Journey Runtime verification is divided into ten domains:

1. Contract Verification
2. Authority Verification
3. Planning Verification
4. Orchestration Verification
5. Adaptation Verification
6. Evidence Verification
7. Persistence & Replay Verification
8. Projection Verification
9. Safety & Policy Verification
10. Cross-Runtime Verification

No single domain is sufficient to declare the runtime complete.

---

## 4. Gate Model

### Gate A — Repository Gate

Confirms:

- required architecture files exist,
- public contracts are coherent,
- boundaries are explicit,
- lifecycle and invariants are documented,
- verification assets are wired,
- changed paths are within scope.

This gate does not execute dependencies or prove runtime behavior.

### Gate B — Runtime Gate

Confirms:

- code can load,
- types and schemas are valid,
- unit and contract tests pass,
- deterministic reducers behave as specified,
- invalid transitions are refused.

### Gate C — Integration Gate

Confirms real interactions across:

- Mission Runtime,
- Recommendation Runtime,
- Diagnostic Runtime,
- Intervention Runtime,
- Learning Session Runtime,
- Progress Runtime,
- Curriculum Runtime,
- and persistence adapters.

### Gate D — Operational Gate

Confirms a journey can run through real operational conditions:

- start,
- dispatch sessions,
- pause,
- resume,
- adapt,
- recover from failure,
- produce projections,
- and complete or cancel safely.

### Gate E — Evolution Gate

Confirms compatible rollout, shadow comparison, migration, rollback, and active-journey continuity across runtime versions.

---

## 5. Verification Evidence Package

Every verification claim should identify:

```ts
interface JourneyVerificationEvidence {
  verificationId: string;
  gate: 'A' | 'B' | 'C' | 'D' | 'E';
  domain: JourneyVerificationDomain;
  repositoryRef: string;
  runtimeVersion?: string;
  environment?: string;
  scenarioId?: string;
  startedAt: string;
  completedAt: string;
  result: 'PASS' | 'FAIL' | 'BLOCKED' | 'DEFERRED';
  evidenceRefs: string[];
  limitations: string[];
  verifier: ActorReference;
}
```

Evidence may include:

- repository diff,
- contract snapshots,
- automated test output,
- event ledger extracts,
- screenshots,
- API traces,
- projection comparisons,
- replay hashes,
- failure-injection logs,
- and human operational observations.

---

## 6. Contract Verification

Contract verification must prove:

- stable journey identity,
- tenant identity requirement,
- command and event versioning,
- lifecycle state vocabulary,
- expected-version semantics,
- idempotency semantics,
- failure-code semantics,
- and result shape stability.

Required negative cases:

- missing tenant,
- mismatched learner,
- reused command ID with different payload,
- unsupported event version,
- stale aggregate version,
- illegal lifecycle transition.

---

## 7. Authority Verification

Authority verification ensures no runtime exceeds its ownership.

Examples:

- Mission Runtime owns mission intent.
- Journey Runtime owns journey execution state.
- Session Runtime owns session execution state.
- Assessment/Mastery authority owns educational judgment.
- Curriculum Runtime owns curriculum structure.
- Projection Runtime owns derived views only.

Verification must reject implementations where Journey Runtime:

- rewrites the mission objective,
- declares mastery directly,
- mutates session history,
- treats recommendations as mandatory commands,
- or uses projections as write authority.

---

## 8. Planning Verification

Planning verification must cover:

- objective binding,
- prerequisite claim handling,
- phase generation,
- milestone generation,
- session-intent generation,
- duration estimates,
- deadline feasibility,
- alternative plan generation,
- risk registration,
- and plan acceptance.

Important assertions:

```text
Recommendation ≠ Accepted plan
Estimate ≠ Obligation
Planned evidence ≠ Collected evidence
Plan acceptance ≠ Journey activation
```

Planning must remain deterministic for the same versioned inputs or explicitly record nondeterministic model outputs as accepted artifacts.

---

## 9. Orchestration Verification

Orchestration verification must prove:

- only one authoritative worker progresses a journey epoch,
- stale fencing tokens are rejected,
- session intent dispatch is idempotent,
- session acknowledgement is correlated,
- outcomes cannot be attached to the wrong journey,
- pause blocks new dispatch,
- resume continues rather than restarts,
- cancellation does not erase history,
- blockers prevent unsafe progress,
- and completion requires explicit completion criteria.

Failure injection should occur at:

- before event commit,
- after event commit but before response,
- after outbox commit but before delivery,
- after delivery but before acknowledgement,
- during lease expiry,
- and during projection lag.

---

## 10. Adaptation Verification

Adaptive Journey verification must cover:

- signal intake,
- adaptation eligibility,
- impact analysis,
- safe adaptation envelope,
- active-session protection,
- plan lineage,
- human approval when required,
- rollback eligibility,
- and adaptation outcome observation.

Required refusals:

- changing historical evidence,
- changing the mission objective without authority,
- replacing an active session for non-critical optimization,
- removing mandatory safety constraints,
- or adapting from stale/conflicting data without acknowledgement.

---

## 11. Evidence Verification

Evidence verification proves that journey-level evidence remains traceable and does not overstate educational meaning.

It must confirm:

- immutable source references,
- source version retention,
- trust classification,
- freshness handling,
- supersession handling,
- conflict visibility,
- privacy classification,
- coverage calculations,
- and completion-package lineage.

Required doctrines:

```text
Evidence collected ≠ Evidence trusted
Evidence coverage ≠ Mastery
Milestone completion ≠ Understanding
Journey completion ≠ Certification
```

---

## 12. Persistence & Replay Verification

Verification scenarios must include:

- atomic aggregate/event/outbox write,
- duplicate command replay,
- stale version rejection,
- snapshot corruption fallback,
- missing-event detection,
- deterministic aggregate replay,
- projection rebuild,
- stale lease rejection,
- inbox deduplication,
- outbox retry,
- and ambiguous session-dispatch reconciliation.

Replay verification should compare canonical state hashes.

A replay mismatch is an integrity failure, not a normal transient error.

---

## 13. Projection Verification

Projection verification must prove:

- projections are derived from authoritative events,
- event ordering is preserved,
- duplicate events do not duplicate read-model effects,
- stale state is visibly marked,
- redaction is role-aware,
- learner/parent/teacher views do not leak restricted evidence,
- rebuild reaches the same canonical result,
- and projection write paths cannot mutate the journey aggregate.

Verification must include delayed and out-of-order delivery scenarios.

---

## 14. Safety & Policy Verification

Safety verification must cover:

- age-appropriate policy,
- learner workload limits,
- break and inactivity handling,
- accessibility requirements,
- parent/guardian permissions where applicable,
- educator visibility boundaries,
- sensitive evidence handling,
- and emergency suspension.

The runtime must prefer safe pause or escalation over autonomous continuation when policy authority is missing or contradictory.

---

## 15. Cross-Runtime Verification

The following handoffs require explicit contract verification:

### Mission → Journey

- objective identity,
- learner identity,
- mission status,
- constraints,
- cancellation/revision semantics.

### Recommendation → Journey

- advisory status,
- recommendation version,
- rationale reference,
- expiry/freshness.

### Journey → Session

- stable session intent identity,
- required objective scope,
- evidence requirements,
- safety constraints,
- idempotency key.

### Session → Journey

- session identity,
- journey binding,
- terminal status,
- evidence references,
- completion timestamp,
- source version.

### Journey → Progress / Assessment

- evidence package reference,
- non-authoritative interpretation boundary,
- correlation identity.

---

## 16. Scenario Matrix

Minimum operational scenarios:

1. Create and activate a valid journey.
2. Reject activation without accepted plan.
3. Dispatch first session exactly once.
4. Receive duplicate session outcome safely.
5. Pause during active phase.
6. Resume after long inactivity.
7. Adapt after repeated struggle.
8. Refuse adaptation during protected active session.
9. Recover after process termination.
10. Rebuild projections from event history.
11. Detect stale projection.
12. Reconcile ambiguous session dispatch.
13. Complete a milestone with sufficient journey evidence.
14. Refuse journey completion when criteria are incomplete.
15. Cancel while preserving history.
16. Reject cross-tenant command.
17. Reject stale worker write.
18. Replay old events through upcasters.
19. Roll back a candidate runtime version.
20. Preserve active journey continuity during deployment.

---

## 17. Negative Verification

A robust verifier must intentionally prove refusals.

Examples:

- illegal transition is rejected,
- missing evidence remains missing,
- stale data is not labeled fresh,
- duplicate delivery does not double progress,
- wrong learner binding is rejected,
- projection cannot issue commands,
- journey cannot certify mastery,
- deleted snapshot does not delete history,
- rollback cannot erase committed events,
- and plan migration cannot silently change the mission objective.

---

## 18. Verification Result Vocabulary

### PASS

The stated gate and scenario were executed successfully with sufficient evidence.

### FAIL

The verifier executed and observed a contract or behavior violation.

### BLOCKED

Verification could not execute because a required dependency, environment, permission, or artifact was unavailable.

### DEFERRED

Verification is intentionally postponed and must not be represented as passing.

### NOT APPLICABLE

Allowed only when the architecture explicitly excludes the scenario and the exclusion is reviewed.

---

## 19. Failure Severity

Suggested severity model:

- **S0 — Informational:** no correctness impact.
- **S1 — Minor:** degraded visibility or non-authoritative delay.
- **S2 — Material:** journey progress delayed or partially unavailable.
- **S3 — Critical:** authority, privacy, duplication, or integrity risk.
- **S4 — Emergency:** cross-tenant leak, corrupted historical authority, unsafe learner behavior, or unrecoverable duplicate effects.

S3/S4 findings block operational completion.

---

## 20. Traceability Matrix

Each invariant should map to:

- architecture section,
- contract or schema,
- implementation path,
- automated verifier,
- operational scenario,
- and evidence artifact.

Example:

```text
Invariant: stale worker cannot commit
Contract: fencingToken required
Implementation: journey repository write guard
Automated test: stale-token rejection
Operational test: lease takeover scenario
Evidence: event ledger + test output
```

---

## 21. Repository Review Boundary

Repository review may inspect:

- changed paths,
- public exports,
- contracts,
- lifecycle definitions,
- verifier wiring,
- snapshots,
- documentation consistency,
- and scope isolation.

Repository review must not claim to have executed:

- package installation,
- database migration,
- live session integration,
- browser/mobile workflow,
- or production recovery.

Those belong to later gates.

---

## 22. Runtime Certification Boundary

Runtime certification requires execution evidence from an environment that can run the implementation and dependencies.

It should record:

- exact commit SHA,
- dependency lock state,
- environment identity,
- database/schema state,
- commands executed,
- outputs,
- failures,
- and limitations.

A local success on an uncommitted working tree must not be treated as repository-certified delivery.

---

## 23. Operational Verification Boundary

Operational verification must follow a real user-visible flow:

```text
Journey View
→ API
→ Application Runtime
→ Persistence
→ Session Runtime
→ Evidence Intake
→ Projection Update
→ User-visible continuation
```

It must include the actual authority transitions, not merely mocked UI states.

---

## 24. Acceptance Criteria

36H is accepted when:

- all ten verification domains are defined,
- Gate A–E boundaries are explicit,
- positive and negative scenarios exist,
- evidence requirements are specified,
- repository/runtime/operational claims cannot be conflated,
- cross-runtime handoffs are verifiable,
- integrity failures block completion,
- and verification output is reproducible and traceable.

---

## 25. Non-Negotiable Rules

1. No gate may claim evidence from a gate that did not execute.
2. No document presence may be called runtime proof.
3. No successful session may be called journey correctness by itself.
4. No journey completion may be called mastery certification.
5. No stale projection may appear authoritative and fresh.
6. No duplicate delivery may advance journey state twice.
7. No cross-runtime contract may rely on undocumented field meaning.
8. No integrity divergence may be downgraded to an ordinary retry.
9. No safety-critical failure may be hidden by aggregate pass counts.
10. No verification report may omit known limitations.

---

## 26. Completion Statement

36H is complete when the Learning Journey Runtime has a layered, evidence-based verification system capable of proving repository conformance, executable behavior, cross-runtime integration, operational continuity, and safe evolution without overstating educational outcomes.