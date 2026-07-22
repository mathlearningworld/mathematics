# Chapter 37A — Mastery Runtime Foundation

## 1. Purpose

Mastery Runtime is the authoritative runtime responsible for deciding, recording, revising, and explaining whether a learner has demonstrated sufficient, durable understanding of a skill.

It converts trusted learning evidence into explicit mastery state without allowing activity completion, score accumulation, journey progression, or human intuition alone to become mastery authority.

The runtime exists to answer four operational questions:

1. What skill is being judged?
2. What evidence is admissible for that judgment?
3. What decision state is currently authoritative?
4. What new evidence would be required to strengthen, revise, or revoke that decision?

## 2. Runtime Boundary

Mastery Runtime owns:

- mastery aggregate identity and lifecycle,
- mastery status transitions,
- evaluation requests and decision records,
- evidence references used in a decision,
- decision confidence and coverage,
- durability and recency interpretation,
- revocation, regression, and re-evaluation history,
- mastery lineage across policy and curriculum versions,
- publication of mastery decision events.

Mastery Runtime does not own:

- curriculum truth,
- skill prerequisite structure,
- activity execution,
- assessment item delivery,
- raw evidence creation,
- learning journey orchestration,
- intervention execution,
- recommendation ranking,
- user interface state.

Those responsibilities remain with Curriculum Runtime, Skill Graph Runtime, Learning Session Runtime, Assessment Engine, Learning Journey Runtime, Intervention Runtime, Recommendation Engine, and projection consumers.

## 3. Core Principle

```text
Evidence supports mastery.
Evidence does not become mastery until an explicit decision is made.
```

A score, completion flag, teacher observation, self-report, or repeated attempt is only evidence. Mastery exists only as an authoritative decision produced under a declared policy, curriculum version, and skill identity.

## 4. Aggregate

The primary aggregate is `MasteryRecord`.

```ts
interface MasteryRecord {
  masteryRecordId: string;
  tenantId: string;
  learnerId: string;
  skillId: string;
  curriculumVersion: string;
  policyVersion: string;
  status: MasteryStatus;
  level: MasteryLevel;
  confidence: number;
  evidenceCoverage: EvidenceCoverage;
  durability: DurabilityState;
  lastEvaluatedAt: string | null;
  lastConfirmedAt: string | null;
  nextReviewAt: string | null;
  decisionVersion: number;
  aggregateVersion: number;
  createdAt: string;
  updatedAt: string;
}
```

A record is scoped by learner, skill, curriculum authority, and tenant. A new curriculum or policy version may require a new lineage branch rather than silently rewriting an existing decision.

## 5. Mastery Status

```ts
type MasteryStatus =
  | 'UNASSESSED'
  | 'EVIDENCE_INSUFFICIENT'
  | 'EVALUATION_PENDING'
  | 'NOT_MASTERED'
  | 'EMERGING'
  | 'MASTERED'
  | 'MASTERED_WITH_REVIEW'
  | 'AT_RISK'
  | 'REVOKED'
  | 'SUPERSEDED';
```

Status meanings:

- `UNASSESSED`: no admissible evidence has been evaluated.
- `EVIDENCE_INSUFFICIENT`: evidence exists but does not satisfy minimum coverage.
- `EVALUATION_PENDING`: a deterministic decision is waiting for required inputs or an authorized human review.
- `NOT_MASTERED`: current evidence demonstrates that mastery criteria are not met.
- `EMERGING`: meaningful partial understanding exists, but mastery criteria are incomplete.
- `MASTERED`: criteria are met with sufficient coverage, confidence, and durability.
- `MASTERED_WITH_REVIEW`: mastery is accepted but a scheduled review is required.
- `AT_RISK`: previously mastered understanding has signs of decay, contradiction, or insufficient recency.
- `REVOKED`: previous mastery is no longer authoritative.
- `SUPERSEDED`: this decision lineage has been replaced by another authoritative record.

## 6. Mastery Level

Status and level are separate.

```ts
type MasteryLevel =
  | 'NONE'
  | 'FOUNDATIONAL'
  | 'FUNCTIONAL'
  | 'FLUENT'
  | 'TRANSFERABLE';
```

- `FOUNDATIONAL`: learner can demonstrate the essential concept in constrained contexts.
- `FUNCTIONAL`: learner can use the skill correctly in expected grade-level contexts.
- `FLUENT`: learner performs accurately and efficiently across representative contexts.
- `TRANSFERABLE`: learner applies the skill to unfamiliar, mixed, or cross-domain contexts.

A learner may be `MASTERED` at `FUNCTIONAL` level without yet being `FLUENT` or `TRANSFERABLE`.

## 7. Decision Context

Every decision must include a complete context snapshot.

```ts
interface MasteryDecisionContext {
  learnerId: string;
  skillId: string;
  curriculumVersion: string;
  skillDefinitionVersion: string;
  masteryPolicyVersion: string;
  evaluationModelVersion: string;
  evidenceCutoffAt: string;
  requestedBy: DecisionRequester;
  correlationId: string;
}
```

A decision without versioned context is not reproducible and therefore cannot become authoritative.

## 8. Evidence Reference Model

Mastery Runtime references evidence; it does not mutate source evidence.

```ts
interface MasteryEvidenceReference {
  evidenceId: string;
  sourceRuntime: string;
  sourceAggregateId: string;
  sourceVersion: number;
  evidenceType: string;
  skillId: string;
  observedAt: string;
  recordedAt: string;
  trustClass: EvidenceTrustClass;
  independenceGroup: string;
  validUntil: string | null;
  supersedesEvidenceId: string | null;
}
```

Evidence must remain traceable to immutable source authority.

## 9. Evidence Trust Classes

```ts
type EvidenceTrustClass =
  | 'SYSTEM_VERIFIED'
  | 'ASSESSMENT_VERIFIED'
  | 'TEACHER_VERIFIED'
  | 'PARENT_VERIFIED'
  | 'PEER_OBSERVED'
  | 'LEARNER_SELF_REPORTED';
```

Trust class does not directly determine mastery. Policy determines how each class contributes to admissibility, confidence, independence, and coverage.

## 10. Evidence Coverage

```ts
interface EvidenceCoverage {
  conceptual: number;
  procedural: number;
  application: number;
  transfer: number;
  retention: number;
  independence: number;
  totalIndependentSources: number;
}
```

Coverage is multidimensional. A high score in one dimension cannot automatically compensate for missing dimensions unless the active policy explicitly allows it.

## 11. Durability State

```ts
type DurabilityState =
  | 'UNKNOWN'
  | 'RECENT_ONLY'
  | 'REPEATED'
  | 'RETAINED'
  | 'DECAY_SIGNAL'
  | 'CONTRADICTED';
```

Mastery is not merely immediate correctness. Policies may require evidence separated by time, contexts, or independent attempts before durability is accepted.

## 12. Commands

Primary commands:

```text
CreateMasteryRecord
RequestMasteryEvaluation
SubmitEvaluationInputs
RecordMasteryDecision
ScheduleMasteryReview
MarkMasteryAtRisk
RevokeMastery
SupersedeMasteryRecord
ReconcileMasteryRecord
```

All commands require tenant, actor, correlation, expected aggregate version, policy context, and idempotency key where applicable.

## 13. Events

Primary events:

```text
MasteryRecordCreated
MasteryEvaluationRequested
MasteryEvidenceAccepted
MasteryEvidenceRejected
MasteryDecisionRecorded
MasteryConfirmed
MasteryMarkedAtRisk
MasteryReviewScheduled
MasteryRevoked
MasteryRecordSuperseded
MasteryRecordReconciled
```

Events describe authoritative state transitions. They do not instruct consumers to perform hidden writes.

## 14. Lifecycle

```text
UNASSESSED
  ├─> EVIDENCE_INSUFFICIENT
  ├─> EVALUATION_PENDING
  └─> NOT_MASTERED

EVALUATION_PENDING
  ├─> EVIDENCE_INSUFFICIENT
  ├─> NOT_MASTERED
  ├─> EMERGING
  ├─> MASTERED
  └─> MASTERED_WITH_REVIEW

MASTERED / MASTERED_WITH_REVIEW
  ├─> AT_RISK
  ├─> REVOKED
  └─> SUPERSEDED

AT_RISK
  ├─> MASTERED
  ├─> MASTERED_WITH_REVIEW
  ├─> NOT_MASTERED
  └─> REVOKED
```

No transition may bypass policy evaluation merely because another runtime requests a desired result.

## 15. Authority Rules

1. Assessment Engine may produce evidence but may not directly write mastery status.
2. Progress Engine may project mastery but may not declare or revoke it.
3. Learning Journey Runtime may request evaluation but may not choose the outcome.
4. Curriculum Runtime defines skill meaning and grade requirements but does not judge learner evidence.
5. Skill Graph Runtime defines prerequisite relationships but does not infer mastery from graph position.
6. Human reviewers may participate only through explicit policy-authorized commands.
7. UI clients may display a decision but never become decision authority.

## 16. Consistency Model

Mastery decisions require strong aggregate consistency.

- Aggregate mutation uses optimistic concurrency.
- Duplicate commands are resolved through idempotency records.
- Evidence references are validated against declared source versions.
- Projections are eventually consistent and must expose freshness.
- Cross-runtime delivery uses outbox/inbox semantics.
- Re-evaluation never mutates historical decision events.

## 17. Re-Evaluation

A mastery record may be re-evaluated when:

- new admissible evidence arrives,
- contradictory evidence arrives,
- evidence becomes stale,
- curriculum meaning changes,
- mastery policy changes,
- a scheduled retention review becomes due,
- an authorized reviewer requests reconciliation.

Re-evaluation creates a new decision version. It does not erase the previous result.

## 18. Decision Explainability

Every authoritative decision must expose:

- decision outcome,
- policy and model versions,
- evidence references used,
- rejected evidence and rejection reasons,
- coverage achieved,
- confidence achieved,
- durability interpretation,
- unmet criteria,
- next useful evidence request,
- human review participation where applicable.

A result that cannot explain its evidence and policy basis is operationally invalid.

## 19. Safety and Fairness

Mastery policy must not depend on protected personal traits unless legally required and explicitly governed.

The runtime must support:

- accessibility accommodations without lowering conceptual truth,
- language-minimal or alternative representations,
- separation of speed from understanding where policy requires,
- bias monitoring across evaluation pathways,
- appeal and human review,
- auditability of policy changes.

## 20. Failure Model

Representative failures:

```text
MASTERY_RECORD_NOT_FOUND
MASTERY_RECORD_ALREADY_EXISTS
STALE_AGGREGATE_VERSION
EVIDENCE_SOURCE_UNAVAILABLE
EVIDENCE_REFERENCE_INVALID
EVIDENCE_VERSION_MISMATCH
EVIDENCE_NOT_ADMISSIBLE
EVIDENCE_COVERAGE_INSUFFICIENT
POLICY_VERSION_UNSUPPORTED
CURRICULUM_VERSION_UNSUPPORTED
DECISION_NOT_REPRODUCIBLE
TRANSITION_NOT_ALLOWED
REVIEW_AUTHORITY_REQUIRED
TENANT_SCOPE_VIOLATION
IDEMPOTENCY_CONFLICT
```

Failures are explicit domain outcomes and must not be flattened into generic internal errors.

## 21. Observability

Minimum telemetry:

- evaluations requested and completed,
- evaluation latency,
- insufficient-evidence rate,
- mastery confirmation rate,
- at-risk and revocation rate,
- policy-version distribution,
- evidence trust-class distribution,
- decision confidence distribution,
- replay divergence count,
- cross-runtime delivery lag,
- human review volume and latency.

Telemetry must not expose unnecessary learner-identifying information.

## 22. Foundational Invariants

1. Activity completion is not mastery.
2. A single score is not mastery unless policy explicitly defines sufficient multidimensional coverage.
3. Mastery status must be tied to a specific learner and skill identity.
4. Every decision must be tied to curriculum, policy, and model versions.
5. Historical decisions are immutable.
6. Re-evaluation creates a new decision version.
7. Evidence must remain traceable to immutable source authority.
8. Mastery cannot be inferred solely from journey position.
9. Mastery cannot be inferred solely from prerequisite mastery.
10. Projection state cannot become write authority.
11. Revocation requires an explicit authoritative transition.
12. Accessibility accommodations must not be confused with reduced mastery standards.
13. Human override must be explicit, attributable, policy-authorized, and auditable.
14. Cross-tenant mastery access is forbidden.
15. A decision that cannot be reproduced from its declared inputs is invalid.

## 23. Chapter Contract

The remaining Chapter 37 documents refine this foundation:

- 37B defines deterministic mastery evaluation.
- 37C defines decision authority and transition policy.
- 37D defines adaptive re-evaluation and decay handling.
- 37E defines mastery evidence qualification.
- 37F defines projections and consumer read models.
- 37G defines persistence, replay, and recovery.
- 37H defines verification gates.
- 37I defines safe runtime evolution.
- 37J consolidates permanent invariants.

Mastery Runtime is complete only when evidence, decision authority, persistence, replay, verification, and evolution remain explicitly separated and jointly governed.
