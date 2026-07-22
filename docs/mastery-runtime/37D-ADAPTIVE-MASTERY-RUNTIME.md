# Chapter 37D — Adaptive Mastery Runtime

## 1. Purpose

Adaptive Mastery Runtime governs when and how an existing mastery model is re-evaluated as new evidence, contradictions, retention decay, prerequisite changes, accessibility context, or policy changes emerge.

It does not silently rewrite mastery. It produces governed adaptation proposals that must pass the Mastery Decision Runtime.

> Adaptation changes the interpretation path, not historical evidence.

## 2. Scope

This runtime owns:

- adaptation signal intake
- adaptation eligibility
- re-evaluation planning
- adaptation priority
- safe adaptation envelopes
- prerequisite impact analysis
- retention and recency response
- contradiction escalation
- adaptation lineage
- adaptation outcome observation
- rollback recommendation
- human-review routing

It does not own:

- evidence creation
- curriculum truth
- skill graph truth
- final mastery authorization
- intervention execution
- learning-session execution
- projection authority

## 3. Core Principle

A mastery state is durable but not immutable.

Durability means the state cannot be changed casually. New evidence may justify a new decision, but every change must preserve:

- traceability
- explainability
- learner safety
- deterministic evaluation
- authority boundaries
- historical lineage

## 4. Adaptation Triggers

Canonical triggers include:

- `NEW_EVIDENCE_ACCEPTED`
- `EVIDENCE_CORRECTION_ACCEPTED`
- `CONTRADICTION_DETECTED`
- `RETENTION_WINDOW_EXPIRED`
- `PREREQUISITE_STATE_CHANGED`
- `CURRICULUM_MAPPING_CHANGED`
- `SKILL_GRAPH_DEPENDENCY_CHANGED`
- `ASSESSMENT_POLICY_CHANGED`
- `ACCESSIBILITY_CONTEXT_CHANGED`
- `HUMAN_REVIEW_REQUESTED`
- `APPEAL_ACCEPTED`
- `MASTERY_AT_RISK`
- `REVOCATION_REQUESTED`

A trigger is not itself permission to alter mastery.

## 5. Adaptation Signal Contract

```ts
export interface MasteryAdaptationSignal {
  signalId: string;
  tenantId: string;
  learnerId: string;
  masteryRecordId: string;
  skillId: string;
  signalType: MasteryAdaptationSignalType;
  sourceRuntime: string;
  sourceReferenceId: string;
  observedAt: string;
  receivedAt: string;
  payloadVersion: number;
  payloadHash: string;
  correlationId: string;
  causationId?: string;
}
```

Signals must be idempotent by `tenantId + signalId`.

## 6. Adaptation State Machine

```text
RECEIVED
  → VALIDATED
  → ELIGIBLE
  → PLANNED
  → EVALUATING
  → PROPOSED
  → DECISION_PENDING
  → APPLIED | REJECTED | REVIEW_REQUIRED | SUPERSEDED
```

Failure states:

- `INVALID_SIGNAL`
- `STALE_SIGNAL`
- `AUTHORITY_MISMATCH`
- `UNSUPPORTED_VERSION`
- `EVIDENCE_UNAVAILABLE`
- `POLICY_UNAVAILABLE`
- `CONCURRENT_CHANGE`
- `SAFETY_BLOCKED`

## 7. Eligibility Rules

An adaptation is eligible only when:

1. tenant, learner, skill, and mastery identities match;
2. the source runtime is trusted for the signal type;
3. the source reference exists and is readable;
4. the signal is newer than the last consumed equivalent signal;
5. the current mastery state permits re-evaluation;
6. no active decision lease conflicts;
7. the required policy version is available;
8. the adaptation does not violate a legal or consent boundary.

## 8. Adaptation Classes

### 8.1 Evidence Expansion

New independent evidence increases coverage or confidence.

### 8.2 Evidence Correction

Previously accepted evidence is corrected, withdrawn, or reclassified.

### 8.3 Contradiction Response

New evidence conflicts materially with the active mastery conclusion.

### 8.4 Retention Response

Mastery confidence requires revalidation after a configured time window.

### 8.5 Dependency Response

A prerequisite or dependent skill state changes in a way that affects interpretation.

### 8.6 Policy Response

A governing evaluation or decision policy changes.

### 8.7 Accessibility Response

An accommodation context changes the fairness interpretation of prior evidence.

## 9. Safe Adaptation Envelope

Every adaptation plan must declare:

```ts
export interface MasteryAdaptationEnvelope {
  permittedActions: Array<
    | 'REEVALUATE'
    | 'REQUEST_ADDITIONAL_EVIDENCE'
    | 'MARK_AT_RISK'
    | 'REQUEST_HUMAN_REVIEW'
    | 'PROPOSE_CONFIRMATION'
    | 'PROPOSE_LEVEL_CHANGE'
    | 'PROPOSE_REVOCATION'
  >;
  protectedFields: string[];
  maxLevelIncrease: number;
  maxLevelDecrease: number;
  requiresHumanReview: boolean;
  reasonCodes: string[];
  policyVersion: string;
}
```

Historical evidence, prior decisions, actor attribution, and timestamps are always protected.

## 10. Re-evaluation Planning

The planner freezes:

- current mastery aggregate version
- current decision version
- evidence set version
- curriculum mapping version
- skill graph version
- evaluation policy version
- decision policy version
- accessibility policy version

The resulting plan is immutable and hash-addressed.

```ts
export interface MasteryAdaptationPlan {
  adaptationId: string;
  masteryRecordId: string;
  triggerSignalIds: string[];
  baselineDecisionId: string;
  baselineAggregateVersion: number;
  frozenInputVector: Record<string, string | number>;
  evaluationScope: string[];
  envelope: MasteryAdaptationEnvelope;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  plannedAt: string;
  planHash: string;
}
```

## 11. Priority Model

Priority ordering:

1. learner safety
2. invalid or withdrawn evidence
3. severe contradiction
4. prerequisite invalidation
5. appeal or authorized human review
6. retention expiry
7. evidence expansion
8. optimization-only re-evaluation

Priority must not be based on commercial value, subscription tier, or engagement pressure.

## 12. Contradiction Handling

Contradiction severity:

- `INFORMATIONAL`
- `MINOR`
- `MATERIAL`
- `SEVERE`
- `CRITICAL`

Rules:

- informational contradictions may only affect projection;
- material contradictions require re-evaluation;
- severe contradictions may propose `AT_RISK`;
- critical contradictions may suspend downstream reliance pending review;
- contradiction never deletes the evidence that created it.

## 13. Retention Adaptation

Retention is skill- and policy-specific.

A retention expiry does not automatically revoke mastery. It may:

- reduce confidence;
- mark the state as needing confirmation;
- request a low-burden check;
- schedule a re-evaluation;
- mark mastery `AT_RISK` when policy permits.

## 14. Prerequisite Impact

When a prerequisite changes, the runtime calculates:

- direct impact
- transitive impact
- confidence impact
- coverage impact
- decision dependency
- downstream mission impact

A prerequisite regression does not automatically erase mastery in a dependent skill. It creates a governed review obligation.

## 15. Active Learning Protection

Adaptation must not interrupt an active learning session unless:

- evidence integrity is compromised;
- a safety policy requires interruption;
- the session is operating on invalid authority;
- continuation would create harmful or misleading progression.

Otherwise, adaptation is staged for the next safe boundary.

## 16. Human Review

Human review is required when:

- evidence sources materially disagree;
- the proposed decrease exceeds the envelope;
- accessibility interpretation is uncertain;
- an appeal is active;
- policy explicitly requires human authority;
- the learner would lose a high-impact entitlement;
- automated reasoning cannot produce an explanation.

Human reviewers cannot modify evidence records. They may authorize, reject, or request a new evaluation.

## 17. Adaptation Proposal

```ts
export interface MasteryAdaptationProposal {
  adaptationId: string;
  masteryRecordId: string;
  baselineDecisionId: string;
  evaluationResultId: string;
  proposedAction:
    | 'NO_CHANGE'
    | 'CONFIRM'
    | 'LEVEL_INCREASE'
    | 'LEVEL_DECREASE'
    | 'MARK_AT_RISK'
    | 'REQUEST_REVIEW'
    | 'PROPOSE_REVOCATION';
  reasonCodes: string[];
  confidenceDelta: number;
  coverageDelta: number;
  explanationRef: string;
  proposalHash: string;
}
```

The proposal has no write authority over mastery state.

## 18. Outcome Observation

After a decision is applied, the runtime records:

- proposal accepted or rejected
- resulting decision ID
- resulting mastery state
- human intervention
- downstream effects
- later evidence outcome
- false-positive or false-negative indicators

Outcome observation may improve future policy, but cannot rewrite the completed decision.

## 19. Rollback Model

Adaptation rollback means issuing a new corrective decision based on preserved history.

It never means deleting:

- the adaptation signal
- the evaluation result
- the decision event
- the prior mastery state

## 20. Idempotency and Concurrency

Commands use:

```text
tenantId + adaptationId + commandType
```

Every apply operation verifies:

- expected aggregate version
- expected decision version
- expected policy vector
- expected adaptation plan hash

On conflict, the runtime must re-read authority and re-plan. It must not retry blindly.

## 21. Events

Canonical events:

- `MasteryAdaptationSignalReceived`
- `MasteryAdaptationValidated`
- `MasteryAdaptationPlanned`
- `MasteryReevaluationRequested`
- `MasteryAdaptationProposed`
- `MasteryAdaptationReviewRequired`
- `MasteryAdaptationAccepted`
- `MasteryAdaptationRejected`
- `MasteryAdaptationSuperseded`
- `MasteryAdaptationOutcomeObserved`

## 22. Cross-Runtime Contracts

### Evidence Runtime

Provides immutable evidence references and corrections.

### Skill Graph Runtime

Provides dependency versions and impact graph.

### Curriculum Runtime

Provides curriculum mapping and requirement versions.

### Assessment Runtime

Provides assessment evidence and scoring interpretation.

### Intervention Runtime

Consumes authorized intervention needs, never raw adaptation guesses.

### Journey Runtime

Consumes authorized mastery changes for replanning.

## 23. Observability

Required metrics:

- adaptation signals by type
- eligibility rejection rate
- adaptation latency
- contradiction severity distribution
- review-required rate
- accepted proposal rate
- decision reversal rate
- stale-plan conflict rate
- safety-block count

Logs must include correlation, causation, tenant, learner, skill, adaptation, and policy versions without exposing sensitive evidence payloads.

## 24. Security and Privacy

- tenant isolation is mandatory;
- evidence payloads are referenced, not copied unnecessarily;
- reviewer access is scoped;
- sensitive accommodations are redacted by projection policy;
- commercial systems cannot alter adaptation priority;
- deletion requests follow legal retention and audit constraints.

## 25. Runtime Invariants

1. Adaptation never edits historical evidence.
2. Adaptation never authorizes mastery directly.
3. Every proposal references a deterministic evaluation result.
4. Every plan freezes its authority vector.
5. Active learning is protected except for safety-critical conditions.
6. Contradiction is preserved, not hidden.
7. Human review authority is explicit and auditable.
8. Rollback is a new event, not history deletion.
9. Commercial tier never changes educational truth.
10. Concurrent authority changes require re-planning.

## 26. Completion Criteria

37D is complete when the system can demonstrate:

- deterministic signal validation;
- safe adaptation planning;
- contradiction and retention handling;
- prerequisite impact analysis;
- decision-authority separation;
- human-review routing;
- idempotent concurrency behavior;
- complete adaptation lineage;
- privacy-safe observability;
- replayable adaptation outcomes.
