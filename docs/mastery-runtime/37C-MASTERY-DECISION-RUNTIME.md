# Chapter 37C — Mastery Decision Runtime

## 1. Purpose

Mastery Decision Runtime is the authoritative boundary that converts a valid evaluation result into a durable mastery state transition.

It protects the system from treating an evaluation candidate, score, projection, recommendation, or human opinion as mastery authority without lifecycle, version, policy, review, and concurrency checks.

```text
Evaluation proposes.
Decision validates and authorizes.
Persistence records.
Projection communicates.
```

## 2. Decision Boundary

Decision Runtime owns:

- decision command validation,
- aggregate lifecycle validation,
- evaluation-result applicability,
- expected-version enforcement,
- policy authority validation,
- human-review authority validation,
- transition selection,
- decision version creation,
- decision explanation attachment,
- publication of authoritative decision events.

It does not own:

- evidence generation,
- evaluation feature calculation,
- curriculum definition,
- session or journey orchestration,
- intervention execution,
- read-model presentation.

## 3. Decision Command

```ts
interface RecordMasteryDecisionCommand {
  commandId: string;
  tenantId: string;
  actor: MasteryDecisionActor;
  masteryRecordId: string;
  evaluationId: string;
  expectedAggregateVersion: number;
  expectedDecisionVersion: number;
  requestedOutcome: CandidateMasteryOutcome;
  policyVersion: string;
  curriculumVersion: string;
  reviewApproval: HumanReviewApproval | null;
  correlationId: string;
  causationId: string;
  idempotencyKey: string;
  occurredAt: string;
}
```

The command may request only the candidate outcome produced by the referenced evaluation. Any mismatch fails explicitly.

## 4. Decision Actor

```ts
type MasteryDecisionActor =
  | { type: 'SYSTEM'; runtimeId: string }
  | { type: 'TEACHER'; userId: string }
  | { type: 'AUTHORIZED_REVIEWER'; userId: string; authorityScope: string[] }
  | { type: 'ADMINISTRATOR'; userId: string; emergencyAuthority: boolean };
```

The actor is not automatically allowed to choose any outcome. Authority is policy-scoped and transition-scoped.

## 5. Applicability Checks

Before a decision can be recorded, Decision Runtime verifies:

1. mastery record exists in the tenant,
2. evaluation exists and completed successfully,
3. evaluation belongs to the same learner, skill, and mastery record,
4. curriculum and policy versions match,
5. evaluation input cutoff and result remain valid,
6. no relevant source evidence has been invalidated,
7. expected aggregate and decision versions match,
8. requested outcome equals the evaluation candidate,
9. any required human review is present and valid,
10. transition is allowed from the current status,
11. idempotency key is unused or payload-identical.

Failure of any check prevents mutation.

## 6. Decision Record

```ts
interface MasteryDecisionRecord {
  decisionId: string;
  masteryRecordId: string;
  decisionVersion: number;
  previousDecisionVersion: number | null;
  evaluationId: string;
  status: MasteryStatus;
  level: MasteryLevel;
  confidence: number;
  durability: DurabilityState;
  evidenceCoverage: EvidenceCoverage;
  curriculumVersion: string;
  policyVersion: string;
  evaluationModelVersion: string;
  evidenceCutoffAt: string;
  explanationHash: string;
  reviewApprovalId: string | null;
  decidedBy: MasteryDecisionActor;
  decidedAt: string;
  supersedesDecisionId: string | null;
}
```

Decision records are immutable. The mastery aggregate points to the current authoritative decision.

## 7. Transition Policy

Representative allowed transitions:

```text
UNASSESSED
  -> EVIDENCE_INSUFFICIENT
  -> EVALUATION_PENDING
  -> NOT_MASTERED
  -> EMERGING
  -> MASTERED
  -> MASTERED_WITH_REVIEW

EVIDENCE_INSUFFICIENT
  -> EVALUATION_PENDING
  -> NOT_MASTERED
  -> EMERGING
  -> MASTERED
  -> MASTERED_WITH_REVIEW

NOT_MASTERED
  -> EVIDENCE_INSUFFICIENT
  -> EVALUATION_PENDING
  -> EMERGING
  -> MASTERED
  -> MASTERED_WITH_REVIEW

EMERGING
  -> EVIDENCE_INSUFFICIENT
  -> NOT_MASTERED
  -> MASTERED
  -> MASTERED_WITH_REVIEW

MASTERED
  -> MASTERED
  -> MASTERED_WITH_REVIEW
  -> AT_RISK
  -> REVOKED
  -> SUPERSEDED

MASTERED_WITH_REVIEW
  -> MASTERED
  -> MASTERED_WITH_REVIEW
  -> AT_RISK
  -> REVOKED
  -> SUPERSEDED

AT_RISK
  -> MASTERED
  -> MASTERED_WITH_REVIEW
  -> NOT_MASTERED
  -> REVOKED
  -> SUPERSEDED

REVOKED
  -> EVALUATION_PENDING
  -> NOT_MASTERED
  -> EMERGING
  -> MASTERED
  -> MASTERED_WITH_REVIEW
  -> SUPERSEDED
```

Exact transitions are policy-versioned. A transition matrix must be explicit and testable.

## 8. Outcome Authority

Decision Runtime may not substitute its own preferred outcome for the evaluation result.

It may:

- accept the candidate,
- reject the decision command,
- require human review,
- mark the evaluation stale,
- request re-evaluation,
- refuse an unsafe transition.

It may not silently change `EMERGING` to `MASTERED`, lower confidence, or alter the level while retaining the original evaluation ID.

## 9. Human Review Approval

```ts
interface HumanReviewApproval {
  approvalId: string;
  reviewerUserId: string;
  reviewerRole: string;
  authorityScope: string[];
  evaluationId: string;
  approvedOutcome: CandidateMasteryOutcome;
  rationale: string;
  policyVersion: string;
  approvedAt: string;
  expiresAt: string | null;
}
```

Approval requirements:

- reviewer authority covers tenant, learner context, skill, and transition,
- approval targets the exact evaluation and candidate,
- rationale is non-empty,
- approval is not expired or revoked,
- reviewer is not prohibited by separation-of-duty policy.

Human review authorizes a policy-defined candidate; it does not create untraceable override authority.

## 10. Override Model

Exceptional override is allowed only when policy defines it.

```ts
interface MasteryDecisionOverride {
  overrideId: string;
  requestedOutcome: CandidateMasteryOutcome;
  evaluationCandidate: CandidateMasteryOutcome;
  reasonCode: string;
  rationale: string;
  authorizedBy: string;
  secondaryApprovalId: string | null;
  expiresAt: string | null;
}
```

Overrides require:

- explicit reason code,
- full audit trail,
- stronger authority than ordinary review,
- secondary approval for high-impact transitions,
- scheduled re-evaluation where applicable,
- projection visibility that the decision was overridden.

An override never mutates the evaluation result.

## 11. Confirmation Semantics

A transition to `MASTERED` or `MASTERED_WITH_REVIEW` creates a mastery confirmation.

```ts
interface MasteryConfirmation {
  masteryRecordId: string;
  decisionId: string;
  skillId: string;
  learnerId: string;
  confirmedLevel: MasteryLevel;
  confirmedAt: string;
  validUnderPolicyVersion: string;
  nextReviewAt: string | null;
}
```

Confirmation is scoped to the decision's curriculum and policy versions. It is not an eternal, context-free badge.

## 12. Review Scheduling

Decision Runtime calculates `nextReviewAt` only from policy and evaluation inputs.

Possible triggers:

- retention interval,
- `MASTERED_WITH_REVIEW` status,
- limited durability evidence,
- override use,
- contradiction below blocking threshold,
- high-impact prerequisite role,
- curriculum migration requirement.

Scheduling a review does not automatically mark mastery at risk.

## 13. Marking Mastery At Risk

`AT_RISK` indicates that existing mastery remains historically valid but current confidence or durability has weakened.

Allowed causes:

- significant contradictory evidence,
- retention review failure,
- evidence decay threshold,
- source evidence invalidation,
- incompatible curriculum reinterpretation,
- anomaly requiring review.

The event must record the cause and whether dependent systems should pause mastery-based unlocks.

## 14. Revocation

Revocation is a high-impact transition.

It requires:

- a valid evaluation candidate or policy-authorized emergency command,
- explicit revocation reason,
- impact analysis,
- required review authority,
- durable event publication,
- downstream reconciliation plan.

```ts
type MasteryRevocationReason =
  | 'CONTRADICTORY_EVIDENCE'
  | 'RETENTION_FAILURE'
  | 'EVIDENCE_INVALIDATED'
  | 'FRAUD_OR_INTEGRITY_FAILURE'
  | 'CURRICULUM_INCOMPATIBILITY'
  | 'POLICY_CORRECTION'
  | 'ADMINISTRATIVE_ERROR';
```

Revocation does not erase prior learning history. It changes current authority.

## 15. Supersession

A record becomes `SUPERSEDED` when authority moves to a new record lineage, commonly because of:

- incompatible skill-definition version,
- curriculum migration,
- tenant merge or learner identity correction,
- aggregate repair,
- policy-required lineage split.

Supersession must identify the successor record and preserve bidirectional lineage references.

## 16. Decision Idempotency

For a given idempotency key:

- identical command payload returns the existing decision result,
- different payload fails with `IDEMPOTENCY_CONFLICT`,
- no second event is appended,
- no duplicate downstream publication is created.

Decision version remains monotonic even when repeated commands are retried after network uncertainty.

## 17. Optimistic Concurrency

The write transaction requires:

```text
stored aggregateVersion == expectedAggregateVersion
stored decisionVersion == expectedDecisionVersion
```

If either differs, the command fails with a stale-version outcome. The caller must reload current authority and decide whether to request a new evaluation.

Decision Runtime never auto-merges concurrent mastery outcomes.

## 18. Atomic Write Contract

The authoritative transaction writes atomically:

1. decision record,
2. aggregate status and current-decision pointer,
3. aggregate and decision version increments,
4. review schedule if required,
5. idempotency result,
6. outbox events.

Partial success is forbidden.

## 19. Events

Representative authoritative events:

```text
MasteryDecisionRecorded
MasteryConfirmed
MasteryConfirmationRenewed
MasteryReviewScheduled
MasteryMarkedAtRisk
MasteryRevoked
MasteryDecisionOverridden
MasteryRecordSuperseded
MasteryDecisionRejected
MasteryReevaluationRequired
```

A single transaction may append more than one event when all represent the same authorized transition.

## 20. Downstream Effects

Consumers may react to decision events:

- Progress Engine updates progress projections.
- Learning Journey Runtime re-plans milestones.
- Recommendation Engine changes candidate recommendations.
- Skill Graph Runtime evaluates prerequisite readiness projections.
- Intervention Runtime considers remediation.
- Gameplay Runtime changes non-authoritative unlock projections.

Consumers must be idempotent and may not mutate the mastery decision record.

## 21. Unlock Safety

Mastery-based unlocks are downstream policy decisions.

Decision events should include:

```ts
interface MasteryAuthoritySignal {
  status: MasteryStatus;
  level: MasteryLevel;
  confidence: number;
  decisionVersion: number;
  usableForUnlock: boolean;
  reviewPending: boolean;
  atRisk: boolean;
}
```

Mastery Runtime may calculate the authority signal under policy, but each consuming domain remains responsible for its own unlock rule.

## 22. Appeals

Learners, parents, or teachers may submit an appeal through a separate command workflow.

Appeal rules:

- does not directly change mastery status,
- identifies the disputed decision,
- records reason and supporting evidence references,
- routes to authorized review,
- preserves original decision,
- may trigger re-evaluation,
- produces an explicit appeal outcome.

## 23. Decision Explanation

The authoritative decision explanation includes:

- previous and new status,
- previous and new level,
- evaluation ID and input hash,
- policy gates applied,
- review or override involvement,
- transition reason,
- evidence cutoff,
- confidence and durability,
- unmet criteria,
- review schedule,
- downstream authority signal.

The explanation must be durable and versioned with the decision.

## 24. Failure Outcomes

```text
MASTERY_RECORD_NOT_FOUND
EVALUATION_NOT_FOUND
EVALUATION_INCOMPLETE
EVALUATION_RECORD_MISMATCH
EVALUATION_CONTEXT_MISMATCH
EVALUATION_RESULT_STALE
REQUESTED_OUTCOME_MISMATCH
TRANSITION_NOT_ALLOWED
STALE_AGGREGATE_VERSION
STALE_DECISION_VERSION
POLICY_AUTHORITY_INVALID
HUMAN_REVIEW_REQUIRED
REVIEW_APPROVAL_INVALID
REVIEW_APPROVAL_EXPIRED
OVERRIDE_NOT_ALLOWED
SECONDARY_APPROVAL_REQUIRED
REVOCATION_REASON_REQUIRED
SUPERSESSION_TARGET_INVALID
TENANT_SCOPE_VIOLATION
IDEMPOTENCY_CONFLICT
ATOMIC_WRITE_FAILED
```

## 25. Verification Scenarios

Minimum decision verification includes:

- valid candidate produces exactly one decision version,
- requested outcome differing from candidate is rejected,
- stale aggregate or decision version prevents mutation,
- duplicate command is idempotent,
- same key with changed payload fails,
- review-required evaluation cannot pass without valid approval,
- unauthorized reviewer is rejected,
- expired approval is rejected,
- invalid transition is rejected,
- revocation requires cause and authority,
- supersession preserves lineage,
- aggregate, decision, idempotency, and outbox writes are atomic,
- downstream retry does not duplicate decision events,
- appeal does not directly alter mastery,
- historical decisions remain immutable.

## 26. Runtime Invariants

1. Only Decision Runtime may authorize mastery state mutation.
2. A decision must reference one completed evaluation result.
3. Requested outcome must equal the evaluation candidate unless a governed override is used.
4. Evaluation and decision contexts must match exactly.
5. Every decision transition is expected-version guarded.
6. Decision versions are monotonic and gap-free within one aggregate.
7. Historical decision records are immutable.
8. Human review must be explicit, scoped, attributable, and policy-authorized.
9. Override use must remain visible and auditable.
10. Revocation changes current authority but does not erase history.
11. Supersession requires a valid successor lineage.
12. Appeals cannot directly mutate mastery state.
13. Downstream consumers cannot write back into decision authority.
14. Atomic persistence includes decision, aggregate, idempotency, and outbox state.
15. A stale evaluation can never authorize a current transition.

## 27. Batch 1 Completion

37A, 37B, and 37C establish the first complete Mastery Runtime slice:

```text
Versioned Evidence Context
  -> Deterministic Evaluation
  -> Governed Decision Authority
  -> Authoritative Mastery State
```

Batch 2 will extend this foundation with adaptive re-evaluation, mastery-specific evidence qualification, and multi-audience projections.
