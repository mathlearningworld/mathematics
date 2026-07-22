# Chapter 34H — Intervention Verification Runtime

## 1. Purpose

Intervention Verification Runtime determines whether intervention planning, authorization, execution, adaptation, evidence handling, effectiveness evaluation, projection, and persistence comply with their contracts.

Verification protects the learner from unsafe automation, false claims of progress, hidden execution failures, policy bypass, and conclusions that exceed available evidence.

## 2. Governing Doctrine

```text
Verified planning is not verified execution.
Verified execution is not verified effectiveness.
Completed is not effective.
Effective once is not durable mastery.
Technically valid is not automatically safe.
INCONCLUSIVE is an honest result, not a defect to conceal.
```

## 3. Verification Layers

The runtime verifies eight layers:

1. Structural Verification
2. Authority Verification
3. Planning Verification
4. Execution Verification
5. Adaptation Verification
6. Evidence and Effectiveness Verification
7. Projection and Persistence Verification
8. Policy and Safety Verification

## 4. Verification Result Contract

```ts
interface InterventionVerificationResult {
  verificationId: string;
  interventionCaseId: string;
  scope: string;
  status:
    | 'PASS'
    | 'PASS_WITH_WARNINGS'
    | 'FAIL'
    | 'BLOCKED'
    | 'INCONCLUSIVE'
    | 'NOT_APPLICABLE';
  checks: InterventionVerificationCheck[];
  blockingFailures: string[];
  warnings: string[];
  verifiedAt: string;
  verifierVersion: string;
}
```

## 5. Structural Verification

Structural checks confirm that required shapes, identifiers, and versions exist.

Required checks:

- tenant identity present
- learner identity present
- intervention case identity present
- aggregate version valid
- event envelope valid
- mandatory plan fields present
- strategy version present
- policy version present
- evidence contract present
- safety contract present
- timestamps valid and ordered

Structural validity does not establish semantic correctness.

## 6. Authority Verification

Authority verification confirms that the actor and runtime may perform the requested transition.

Checks include:

- tenant boundary
- learner access scope
- actor role
- authorization source
- plan approval requirement
- human review requirement
- consent requirement
- active policy version
- expected aggregate state
- expected aggregate version

Examples:

```text
A recommendation engine may propose but not authorize.
An execution adapter may deliver but not redefine dosage.
A teacher may approve within assigned learners, not across tenants.
A projection reader may display but not mutate authority.
```

## 7. Planning Verification

A plan passes only when it is executable, evidence-aware, bounded, and safe.

Checks:

- target aligns with diagnostic or approved objective
- rationale is traceable
- strategy is eligible
- dosage is explicit
- schedule is explicit
- phase ordering is valid
- execution channel is available
- evidence requirements are defined before execution
- adaptation envelope is explicit
- stop conditions exist
- review conditions exist
- accessibility constraints are considered
- learner burden is bounded
- conflicts with active interventions are resolved

Planning failure codes:

```text
PLAN_TARGET_UNSUPPORTED
PLAN_RATIONALE_UNTRACEABLE
PLAN_STRATEGY_INELIGIBLE
PLAN_DOSAGE_UNBOUNDED
PLAN_CHANNEL_UNAVAILABLE
PLAN_EVIDENCE_CONTRACT_MISSING
PLAN_ADAPTATION_ENVELOPE_MISSING
PLAN_SAFETY_CONTRACT_MISSING
PLAN_CONFLICT_UNRESOLVED
PLAN_HUMAN_REVIEW_REQUIRED
```

## 8. Execution Verification

Execution verification compares planned intent with observed delivery.

It must verify:

- correct plan version was activated
- correct activity was dispatched
- channel acknowledged delivery
- retry policy was honored
- phase order remained valid
- pause and resume boundaries were preserved
- interruption was recorded
- delivered dose did not exceed bounds
- learner interaction evidence is linked
- completion reason is explicit
- external side effects are idempotent

Execution fidelity result:

```ts
interface ExecutionFidelityAssessment {
  result: 'HIGH' | 'ADEQUATE' | 'LOW' | 'UNKNOWN';
  plannedDose: number;
  deliveredDose: number;
  completedDose: number;
  deviations: ExecutionDeviation[];
  confidence: number;
}
```

Low execution fidelity blocks strong effectiveness claims.

## 9. Adaptation Verification

Adaptation verification confirms that a runtime change stayed inside the approved envelope or followed escalation rules.

Checks:

- trigger evidence exists
- trigger evidence timing is valid
- adaptation type is classified correctly
- parameter changes remain within bounds
- automatic adaptation count is not exceeded
- plan replacement creates a new plan version
- diagnostic review is requested when required
- human escalation occurs when safety thresholds are crossed
- rationale is stored
- no-change decisions are auditable

Failure codes:

```text
ADAPTATION_TRIGGER_UNSUPPORTED
ADAPTATION_OUTSIDE_ENVELOPE
ADAPTATION_LIMIT_EXCEEDED
ADAPTATION_REPLAN_NOT_VERSIONED
ADAPTATION_DIAGNOSTIC_REVIEW_BYPASSED
ADAPTATION_HUMAN_ESCALATION_BYPASSED
ADAPTATION_RATIONALE_MISSING
```

## 10. Evidence Verification

Evidence verification evaluates provenance, integrity, relevance, timing, and access policy.

Checks:

- source runtime is trusted
- schema version is supported
- evidence identity is unique
- content hash matches where available
- captured time and linked time are preserved
- evidence is relevant to target
- evidence is not duplicated as independent support
- evidence remains accessible under policy
- evidence class permits the intended use
- missing evidence is represented explicitly

Evidence quality statuses:

```text
VERIFIED
VERIFIED_WITH_LIMITATIONS
UNVERIFIED
UNAVAILABLE
CONFLICTING
INADMISSIBLE
```

## 11. Effectiveness Verification

Effectiveness verification guards against overstated conclusions.

Required checks:

- baseline exists or absence is declared
- evaluation window is appropriate
- execution fidelity is considered
- target outcome is aligned
- retention evidence is distinguished from immediate performance
- transfer evidence is distinguished from near repetition
- confounding factors are recorded
- learner burden is assessed
- harmful or unsafe signals override positive score movement
- confidence is calibrated
- conclusion wording matches evidence strength

Forbidden inference examples:

```text
Activity completed -> intervention effective
One higher score -> mastery achieved
Immediate recall -> long-term retention
Near transfer -> general transfer
Engagement -> understanding
Repeated practice -> correct diagnosis
```

## 12. Temporal Verification

Temporal checks ensure conclusions use evidence available at the claimed time.

The verifier must distinguish:

```text
occurredAt
capturedAt
linkedAt
recordedAt
evaluatedAt
projectedAt
```

Late evidence may produce a new evaluation but must not rewrite the prior historical evaluation as though it knew the evidence earlier.

## 13. Projection Verification

Projection verification checks:

- projection generation
- source event position
- freshness state
- tenant isolation
- audience authorization
- learner-safe language
- no authority mutation through projection
- no hidden stale-blocking state
- summary traceability
- projection rebuild hash where supported

Learner-facing projections must not expose unsupported diagnostic labels or risk scores.

## 14. Persistence and Replay Verification

Checks:

- event ordering
- aggregate version continuity
- snapshot hash
- event gap detection
- immutable plan versions
- outbox consistency
- replay dependency completeness
- no side effects during replay
- deterministic state hash
- atomic projection generation publication
- quarantine visibility

Replay result mismatch is a blocking failure until explained.

## 15. Policy Verification

Policy verification confirms compliance with:

- consent
- age-sensitive safeguards
- jurisdictional retention
- role-based access
- human review thresholds
- maximum automated dosage
- escalation requirements
- accessibility obligations
- prohibited intervention types
- communication restrictions

A policy failure blocks execution even when every technical check passes.

## 16. Safety Verification

Safety verification has higher priority than optimization.

Safety signals include:

- distress or frustration escalation
- excessive repetition
- accessibility mismatch
- punitive framing
- stigmatizing language
- unsafe human instruction
- intervention interference
- adverse performance trend
- unexplained disengagement
- consent withdrawal

Safety result:

```ts
interface InterventionSafetyResult {
  status: 'CLEAR' | 'MONITOR' | 'PAUSE_REQUIRED' | 'STOP_REQUIRED' | 'HUMAN_REVIEW_REQUIRED';
  signals: SafetySignal[];
  policyVersion: string;
  assessedAt: string;
}
```

## 17. Cross-Runtime Verification

Boundary checks cover:

### Diagnostic Runtime

- diagnostic case exists where required
- hypothesis confidence is not inflated
- intervention outcome does not overwrite diagnosis

### Recommendation Runtime

- recommendation is not treated as authorization
- selected strategy remains within recommendation constraints

### Learning Engine

- delivered activity contract matches plan
- learning evidence is attributable

### Assessment Engine

- assessment evidence is valid for intended inference
- practice results are not mistaken for independent assessment

### Mission Engine

- intervention does not silently rewrite learner mission
- mission completion does not imply intervention effectiveness

### Progress Engine

- effectiveness claims do not directly mutate mastery without progress policy

### Skill Graph and Curriculum Runtime

- target skill identity and version are resolvable
- prerequisite relationships are evaluated under pinned versions

## 18. Verification Gates

### Gate A — Repository Gate

Verifies architecture, contracts, public APIs, event vocabulary, invariants, and verifier wiring from repository evidence.

### Gate B — Runtime Gate

Verifies executable behavior, dependency wiring, persistence, replay, adapters, migrations, and automated tests.

### Gate C — Operational Gate

Verifies real end-to-end delivery:

```text
UI or Human Action
-> API
-> Intervention Application Runtime
-> Persistence
-> Execution Channel
-> Evidence Capture
-> Effectiveness Evaluation
-> Projection
-> Authorized UI
```

Repository PASS must never be reported as Runtime or Operational PASS.

## 19. Verification Severity

```text
INFO
WARNING
ERROR
BLOCKING
SAFETY_CRITICAL
```

`SAFETY_CRITICAL` requires immediate pause or stop according to policy.

## 20. Verification Timing

Verification occurs:

- before authorization
- before activation
- at dispatch
- after interruption
- before adaptation
- before completion
- before effectiveness publication
- after replay
- after migration
- after projection rebuild
- during scheduled audits

## 21. Verification Evidence

A verification result must preserve:

- verifier version
- policy version
- evaluated entities and versions
- event range
- evidence references
- check outcomes
- warnings
- blocking failures
- actor or system identity
- timestamp

## 22. Human Review

Human review is mandatory when:

- policy requires approval
- evidence is materially conflicting
- safety signals are unresolved
- adaptation exceeds automatic bounds
- repeated ineffectiveness persists
- learner impact is high and confidence is low
- intervention may create stigma or exclusion
- cross-runtime authority is ambiguous

Human approval must record scope and rationale. It does not erase machine uncertainty.

## 23. Test Matrix

Minimum verifier tests:

- invalid authorization
- missing plan version
- unbounded dosage
- channel unavailable
- evidence contract missing
- wrong activity dispatch
- duplicate dispatch
- dose overflow
- adaptation outside envelope
- repeated ineffective escalation
- late evidence
- conflicting evidence
- low fidelity effectiveness block
- safety stop
- stale learner projection
- replay hash mismatch
- tenant boundary violation
- repository/runtime/operational gate separation

## 24. Failure Semantics

```text
VERIFICATION_STRUCTURE_FAILED
VERIFICATION_AUTHORITY_FAILED
VERIFICATION_PLAN_FAILED
VERIFICATION_EXECUTION_FAILED
VERIFICATION_ADAPTATION_FAILED
VERIFICATION_EVIDENCE_FAILED
VERIFICATION_EFFECTIVENESS_FAILED
VERIFICATION_TEMPORAL_FAILED
VERIFICATION_PROJECTION_FAILED
VERIFICATION_REPLAY_FAILED
VERIFICATION_POLICY_FAILED
VERIFICATION_SAFETY_FAILED
VERIFICATION_CROSS_RUNTIME_FAILED
```

## 25. Final Invariants

```text
I-VERIFY-01  Recommendation never verifies authorization.
I-VERIFY-02  Plan validity never proves execution fidelity.
I-VERIFY-03  Completion never proves effectiveness.
I-VERIFY-04  Low fidelity limits effectiveness claims.
I-VERIFY-05  Adaptations outside the envelope require re-plan or escalation.
I-VERIFY-06  Late evidence creates new temporal conclusions.
I-VERIFY-07  Safety and policy failures override optimization.
I-VERIFY-08  Projection verification never grants authority.
I-VERIFY-09  Replay mismatch is blocking until resolved.
I-VERIFY-10  Repository, Runtime, and Operational gates remain distinct.
```

## 26. Completion Criterion

34H is complete when every material intervention claim can be checked against authority, plan, execution, evidence, temporal, policy, safety, persistence, and cross-runtime contracts without converting uncertainty into false certainty.