# 16G — Mastery & Progression

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16G — Mastery & Progression  
**Document Type:** Child Architecture / Production Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16B-LEARNER-READINESS-AND-COGNITIVE-DIAGNOSIS.md`, `docs/world/16C-COGNITIVE-MISSION-PLANNING-AND-GENERATION.md`, `docs/world/16D-WORLD-ACTIVITY-BINDING.md`, `docs/world/16E-MATHEMATICAL-EVIDENCE-AND-ASSESSMENT.md`, `docs/world/16F-HINT-AND-MENTOR-SUPPORT.md`  
**Downstream Consumers:** 16H Remediation, 16I Parent/Teacher Projection, 16J Analytics & Governance, progression runtime, unlock runtime, review runtime, curriculum runtime, learner profile runtime

---

## 1. Purpose

This guide defines how Math Learning World converts assessment results into durable mastery state and safe learner progression without confusing recent success, assisted success, task completion, speed, or repetition with genuine mathematical understanding.

The central doctrine is:

> Progression must follow demonstrated, sufficiently independent, durable understanding—not activity completion, accumulated play time, or isolated correctness.

A conforming mastery and progression system must answer:

> What does the learner understand, how strongly and independently is that understanding supported, how stable is it over time and context, what may now be unlocked, and what must remain protected from premature advancement?

---

## 2. Architectural Position

```text
Assessment Results
        ↓
Evidence Aggregation
        ↓
Mastery Evaluation
        ↓
Mastery State Transition
        ↓
Prerequisite Resolution
        ↓
Progression Eligibility
        ↓
Unlock Decision
        ↓
Review / Retention Scheduling
        ↓
Updated Learner Path
```

Phase 16G is the authority for mastery state, progression eligibility, unlock policy, retention review, and regression handling.

It does not own curriculum definitions, cognitive transformation definitions, raw diagnosis, mission generation, world activity design, evidence interpretation, hint delivery, remediation experience design, or parent-facing presentation.

---

## 3. Authority Boundary

### 3.1 Phase 16G owns

- mastery state contracts;
- mastery evaluation policy;
- mastery transition rules;
- independent evidence requirements;
- evidence sufficiency across time and context;
- prerequisite satisfaction;
- progression eligibility;
- unlock decisions;
- review and retention scheduling;
- mastery decay and regression semantics;
- provisional mastery;
- transfer confirmation;
- progression holds;
- mastery replay and audit;
- idempotent mastery updates;
- progression failure handling.

### 3.2 Phase 16G does not own

- redefining learning targets;
- inventing evidence;
- changing assessment conclusions;
- hiding assistance history;
- generating remediation missions;
- deciding parent-facing language;
- ranking learners against peers;
- equating grade placement with mastery;
- granting mastery from task completion alone.

---

## 4. Core Distinctions

The runtime MUST preserve the following distinctions:

```text
Task Completion ≠ Mathematical Evidence
Mathematical Evidence ≠ Assessment Result
Assessment Result ≠ Mastery
Mastery ≠ Permanent Immunity From Forgetting
Mastery ≠ Permission To Skip All Dependencies
Progression ≠ Grade Promotion
Unlock ≠ Proven Transfer
```

A learner may complete a mission without generating sufficient mastery evidence.

A learner may generate positive assessment evidence but still remain below mastery because the evidence is:

- too narrow;
- too recent;
- too assisted;
- too context-dependent;
- internally contradictory;
- not independently confirmed;
- not retained over time.

---

## 5. Mastery Domain Model

### 5.1 MasteryRecord

```ts
interface MasteryRecord {
  masteryRecordId: string
  learnerId: string
  targetId: string
  targetVersion: string
  state: MasteryState
  confidence: number
  independence: number
  durability: number
  transferBreadth: number
  evidenceCount: number
  independentEvidenceCount: number
  firstObservedAt: string | null
  lastObservedAt: string | null
  lastIndependentConfirmationAt: string | null
  nextReviewAt: string | null
  regressionRisk: RegressionRisk
  activeHoldCodes: ProgressionHoldCode[]
  policyVersion: string
  recordVersion: number
  updatedAt: string
}
```

### 5.2 MasteryState

```ts
type MasteryState =
  | 'UNOBSERVED'
  | 'EMERGING'
  | 'DEVELOPING'
  | 'PROVISIONAL'
  | 'MASTERED'
  | 'TRANSFER_CONFIRMED'
  | 'REVIEW_DUE'
  | 'AT_RISK'
  | 'REGRESSED'
```

### 5.3 State meaning

#### UNOBSERVED

No trustworthy evidence is available.

#### EMERGING

The learner shows partial or inconsistent understanding.

#### DEVELOPING

The learner demonstrates meaningful understanding but does not yet satisfy mastery requirements.

#### PROVISIONAL

The learner has enough recent evidence to proceed cautiously, but durability, independence, or transfer remains insufficient.

#### MASTERED

The learner has demonstrated sufficiently independent and stable understanding under the governing mastery policy.

#### TRANSFER_CONFIRMED

The learner has demonstrated the same mathematical structure across materially different representations or contexts.

#### REVIEW_DUE

The learner previously met mastery requirements, but retention confirmation is now due.

#### AT_RISK

New evidence suggests instability, dependency on support, or probable forgetting.

#### REGRESSED

Current trustworthy evidence no longer supports the prior mastery claim.

---

## 6. Mastery Dimensions

Mastery MUST NOT be represented by a single raw score without dimensional meaning.

The minimum dimensions are:

```ts
interface MasteryDimensions {
  conceptualUnderstanding: number
  proceduralFluency: number
  representationFlexibility: number
  reasoningQuality: number
  independence: number
  durability: number
  transferBreadth: number
}
```

Each dimension is normalized to `[0, 1]` but remains semantically distinct.

### 6.1 Conceptual understanding

Measures whether the learner understands the mathematical relationships and structures involved.

### 6.2 Procedural fluency

Measures accurate and efficient execution of procedures when procedures are relevant.

### 6.3 Representation flexibility

Measures movement between diagrams, symbols, quantities, tables, language-light world structures, and other valid representations.

### 6.4 Reasoning quality

Measures whether choices, revisions, comparisons, and explanations reveal coherent mathematical reasoning.

### 6.5 Independence

Measures how much of the successful performance occurred without hints, mentor direction, answer exposure, or peer substitution.

### 6.6 Durability

Measures whether understanding persists across time rather than appearing only immediately after instruction.

### 6.7 Transfer breadth

Measures whether the learner can apply the same underlying structure in a different surface context.

---

## 7. Mastery Policy Contract

```ts
interface MasteryPolicy {
  policyId: string
  policyVersion: string
  targetId: string
  minimumDimensions: Partial<MasteryDimensions>
  requiredEvidenceCount: number
  requiredIndependentEvidenceCount: number
  requiredDistinctContexts: number
  requiredDistinctRepresentations: number
  minimumObservationSpanHours: number
  maximumContradictionRatio: number
  requireDelayedConfirmation: boolean
  delayedConfirmationMinimumHours: number | null
  requireTransferConfirmation: boolean
  masteryStateOnPass: 'PROVISIONAL' | 'MASTERED'
  reviewSchedule: ReviewSchedulePolicy
}
```

Mastery policies MUST be versioned.

A policy change MUST NOT silently rewrite historical decisions. Re-evaluation must produce an auditable new decision linked to the previous policy version.

---

## 8. Evidence Eligibility

Only assessment results validated by Phase 16E may enter mastery evaluation.

Eligible evidence MUST include:

- learner identity;
- learning target identity and version;
- assessment result identity;
- evidence provenance;
- assistance attribution;
- confidence;
- observation timestamp;
- context identity;
- representation identity where relevant;
- assessment policy version.

Evidence MUST be excluded or down-weighted when:

- identity cannot be trusted;
- the event is duplicated;
- assistance attribution is missing;
- the target version is incompatible;
- the evidence was invalidated;
- multiplayer authorship is ambiguous;
- the result is operational only;
- replay produces a different conclusion without a version change.

---

## 9. Independent Evidence

Independent evidence is evidence produced without intervention that materially supplies the mathematical step being assessed.

Independent evidence MAY include accessibility support when the support changes access but not mathematical reasoning.

Independent evidence MUST NOT include:

- direct answer revelation;
- step-by-step completion supplied by another actor;
- copied peer output;
- system correction before learner commitment;
- mentor manipulation of the relevant world object;
- answer validation loops that expose the correct result before reasoning is observed.

```ts
interface IndependenceAssessment {
  classification: 'INDEPENDENT' | 'PARTIALLY_ASSISTED' | 'DEPENDENT' | 'UNKNOWN'
  score: number
  supportEventIds: string[]
  rationaleCodes: string[]
}
```

A mastery policy MUST declare a minimum independent evidence requirement.

No target may transition to `MASTERED` solely from dependent evidence.

---

## 10. Observation Span

Repeated success within a very short session may represent short-term imitation rather than durable understanding.

Mastery evaluation MUST consider:

- time between observations;
- whether evidence occurred before and after support;
- whether evidence occurred in separate sessions;
- whether delayed confirmation exists;
- whether the learner returned after unrelated activity;
- whether performance remained stable.

```ts
interface ObservationSpan {
  firstObservedAt: string
  lastObservedAt: string
  distinctSessionCount: number
  elapsedHours: number
  includesDelayedConfirmation: boolean
}
```

---

## 11. Context Diversity

Evidence diversity protects against overfitting to one mission pattern.

A context fingerprint SHOULD include:

```ts
interface ContextFingerprint {
  worldId: string
  activityType: string
  mathematicalStructure: string
  surfaceTheme: string
  representationTypes: string[]
  quantityRangeBand: string
  interactionPattern: string
}
```

Two activities are not meaningfully distinct merely because colors, names, or decorative assets differ.

Context diversity must reflect a change that could expose whether the learner understands the underlying mathematics rather than memorizing a surface routine.

---

## 12. Representation Diversity

Where applicable, mastery SHOULD require successful reasoning across more than one representation.

Examples include:

- concrete world objects;
- bar models;
- ratio tables;
- number lines;
- symbolic expressions;
- graphs;
- spatial layouts;
- verbal or icon-supported descriptions.

Representation diversity MUST NOT become a rigid requirement for targets where multiple representations are not pedagogically meaningful.

---

## 13. Contradictory Evidence

Contradictory evidence MUST remain visible.

The runtime MUST NOT average away serious contradictions without interpretation.

```ts
interface EvidenceConflict {
  conflictId: string
  targetId: string
  positiveAssessmentIds: string[]
  negativeAssessmentIds: string[]
  conflictType: EvidenceConflictType
  severity: number
  resolutionStatus: 'OPEN' | 'RESOLVED' | 'ACCEPTED_UNCERTAINTY'
}

type EvidenceConflictType =
  | 'CONTEXT_DEPENDENCE'
  | 'REPRESENTATION_DEPENDENCE'
  | 'ASSISTANCE_DEPENDENCE'
  | 'RECENCY_CONFLICT'
  | 'IDENTITY_AMBIGUITY'
  | 'PROCEDURAL_CONCEPTUAL_SPLIT'
  | 'TRANSFER_FAILURE'
```

Serious unresolved contradiction MUST block `MASTERED` unless the mastery policy explicitly permits the uncertainty and records why.

---

## 14. Mastery Evaluation

```ts
interface MasteryEvaluationInput {
  learnerId: string
  targetId: string
  currentRecord: MasteryRecord | null
  assessmentResults: AssessmentResultReference[]
  policy: MasteryPolicy
  evaluatedAt: string
  correlationId: string
}

interface MasteryEvaluationResult {
  evaluationId: string
  learnerId: string
  targetId: string
  previousState: MasteryState
  proposedState: MasteryState
  dimensions: MasteryDimensions
  confidence: number
  evidenceSufficiency: EvidenceSufficiency
  prerequisiteImpact: PrerequisiteImpact
  holdCodes: ProgressionHoldCode[]
  rationaleCodes: string[]
  policyVersion: string
  evaluatedAt: string
}
```

Mastery evaluation MUST be deterministic for the same input set and policy version.

---

## 15. Evidence Sufficiency

```ts
type EvidenceSufficiency =
  | 'INSUFFICIENT'
  | 'PARTIAL'
  | 'SUFFICIENT_FOR_PROVISIONAL'
  | 'SUFFICIENT_FOR_MASTERY'
  | 'SUFFICIENT_FOR_TRANSFER'
```

Evidence sufficiency is not identical to average performance.

A learner may have a high average but remain insufficient because evidence lacks independence, time span, context diversity, or delayed confirmation.

---

## 16. Mastery Transition Rules

Allowed transitions include:

```text
UNOBSERVED → EMERGING
UNOBSERVED → DEVELOPING
EMERGING → DEVELOPING
DEVELOPING → PROVISIONAL
PROVISIONAL → MASTERED
MASTERED → TRANSFER_CONFIRMED
MASTERED → REVIEW_DUE
TRANSFER_CONFIRMED → REVIEW_DUE
REVIEW_DUE → MASTERED
REVIEW_DUE → TRANSFER_CONFIRMED
MASTERED → AT_RISK
TRANSFER_CONFIRMED → AT_RISK
AT_RISK → MASTERED
AT_RISK → REGRESSED
REVIEW_DUE → REGRESSED
REGRESSED → DEVELOPING
REGRESSED → PROVISIONAL
```

The runtime MUST reject unsupported direct transitions unless a migration or administrative correction policy explicitly authorizes them.

Examples of normally invalid transitions:

```text
UNOBSERVED → MASTERED
EMERGING → TRANSFER_CONFIRMED
REGRESSED → TRANSFER_CONFIRMED
```

---

## 17. Provisional Mastery

`PROVISIONAL` exists to permit cautious forward movement without falsely claiming durable mastery.

It may be used when:

- recent evidence is strong;
- independent evidence is present but limited;
- delayed confirmation is still pending;
- transfer evidence is incomplete;
- the learner is ready for low-risk dependent content.

Provisional mastery MUST carry an expiration or review requirement.

```ts
interface ProvisionalMasteryRule {
  expiresAfterHours: number
  allowedUnlockRisk: 'LOW' | 'MODERATE'
  requiresIndependentConfirmation: boolean
  requiresDelayedConfirmation: boolean
}
```

---

## 18. Transfer Confirmation

Transfer confirmation is stronger than mastery within a familiar pattern.

A transfer claim requires evidence that:

- preserves the same mathematical structure;
- changes meaningful surface conditions;
- prevents direct template reuse;
- remains attributable to the learner;
- meets independence requirements.

Transfer confirmation MUST NOT be awarded merely because the learner completed two visually different missions built from the same hidden interaction template.

---

## 19. Prerequisite Graph

Progression operates over the Learning Target and Cognitive Transformation Graph defined upstream.

```ts
interface PrerequisiteRequirement {
  prerequisiteTargetId: string
  requiredState: 'PROVISIONAL' | 'MASTERED' | 'TRANSFER_CONFIRMED'
  minimumConfidence: number
  allowAtRisk: boolean
  requirementType: 'HARD' | 'SOFT' | 'DIAGNOSTIC'
}
```

### 19.1 Hard prerequisite

Blocks progression when unmet.

### 19.2 Soft prerequisite

Allows progression with warning, extra support, or constrained mission generation.

### 19.3 Diagnostic prerequisite

Does not block automatically but requires targeted observation before progression becomes stable.

---

## 20. Progression Eligibility

```ts
interface ProgressionEligibility {
  learnerId: string
  destinationId: string
  status: 'ELIGIBLE' | 'PROVISIONALLY_ELIGIBLE' | 'HELD' | 'INELIGIBLE'
  satisfiedPrerequisites: string[]
  unsatisfiedPrerequisites: string[]
  activeHoldCodes: ProgressionHoldCode[]
  allowedMissionConstraints: string[]
  evaluatedAt: string
  policyVersion: string
}
```

Progression eligibility MUST be computed from current mastery truth, prerequisite policy, and active holds.

It MUST NOT be inferred from age, school grade, payment status, total play time, or number of completed missions.

---

## 21. Progression Hold Codes

```ts
type ProgressionHoldCode =
  | 'INSUFFICIENT_EVIDENCE'
  | 'INSUFFICIENT_INDEPENDENCE'
  | 'DELAYED_CONFIRMATION_REQUIRED'
  | 'PREREQUISITE_NOT_MASTERED'
  | 'CONTRADICTORY_EVIDENCE'
  | 'TRANSFER_NOT_CONFIRMED'
  | 'MASTERY_REVIEW_DUE'
  | 'MASTERY_AT_RISK'
  | 'IDENTITY_UNCERTAIN'
  | 'POLICY_VERSION_MISMATCH'
  | 'ACTIVE_REMEDIATION_REQUIRED'
```

A hold MUST be explainable through machine-readable rationale and suitable downstream projection.

---

## 22. Unlock Decision

```ts
interface UnlockDecision {
  unlockDecisionId: string
  learnerId: string
  destinationType: 'TARGET' | 'MISSION_FAMILY' | 'WORLD_ZONE' | 'TOOL' | 'CHALLENGE'
  destinationId: string
  decision: 'UNLOCK' | 'LIMITED_UNLOCK' | 'KEEP_LOCKED' | 'RELOCK'
  eligibilitySnapshot: ProgressionEligibility
  rationaleCodes: string[]
  policyVersion: string
  decidedAt: string
}
```

### 22.1 Limited unlock

A limited unlock may permit:

- exploratory access;
- low-stakes preview;
- supported missions;
- diagnostic missions;
- non-progress-bearing practice.

It MUST NOT falsely represent full progression eligibility.

---

## 23. World Progression

World progression should make learning structure visible without turning the experience into a conventional grade menu.

Possible progression surfaces include:

- new construction capabilities;
- access to new regions;
- more complex resource systems;
- new tools that require mastered mathematics;
- new collaboration roles;
- new planning responsibilities;
- richer optimization challenges.

World unlocks MUST preserve the relationship between mathematical readiness and world capability.

Decorative rewards MAY be granted independently, but decorative rewards MUST NOT imply mastery.

---

## 24. Grade Independence

The learner may progress above nominal grade level where prerequisites are satisfied.

The learner may receive prerequisite repair below nominal grade level where foundational understanding is missing.

Therefore:

```text
Grade Level = Curriculum Reference
Mastery State = Learner Understanding Truth
Progression Eligibility = Policy Decision From Current Truth
```

The system MUST NOT force all learners through identical grade-sequenced content when the prerequisite graph supports a more accurate path.

---

## 25. Retention and Review

Mastery is a maintained claim, not an eternal badge.

```ts
interface ReviewSchedulePolicy {
  initialReviewDelayHours: number
  subsequentReviewDelaysHours: number[]
  accelerateOnRisk: boolean
  postponeOnStrongTransfer: boolean
  maximumReviewGapHours: number | null
}
```

Review scheduling SHOULD consider:

- current durability;
- previous review outcomes;
- contradiction severity;
- time since independent evidence;
- target importance in downstream dependencies;
- transfer confirmation;
- observed forgetting patterns.

---

## 26. Review Missions

A review mission SHOULD:

- be brief enough to avoid unnecessary repetition;
- preserve the underlying mathematical target;
- change surface context where useful;
- avoid reproducing the exact prior sequence;
- collect independent evidence;
- avoid punitive framing.

Review missions are not remediation missions by default.

A review becomes remediation input only when evidence indicates a meaningful loss or unresolved misconception.

---

## 27. Mastery Decay

Mastery decay is not automatic deletion of mastery after a fixed time.

Instead, time increases uncertainty and may trigger `REVIEW_DUE`.

```ts
interface DecayAssessment {
  elapsedHoursSinceConfirmation: number
  targetDependencyWeight: number
  historicalRetentionRate: number
  transferConfirmed: boolean
  riskScore: number
  recommendedState: 'UNCHANGED' | 'REVIEW_DUE' | 'AT_RISK'
}
```

The runtime MUST distinguish:

- lack of recent evidence;
- actual negative evidence;
- temporary performance failure;
- persistent regression.

---

## 28. Regression

A learner may regress from a previously mastered state.

Regression MUST require trustworthy evidence or unresolved review failure, not a single accidental mistake.

Regression handling MUST preserve dignity and continuity.

The system SHOULD:

- retain historical mastery events;
- mark current state accurately;
- avoid erasing prior achievement;
- identify the likely fragile prerequisite;
- hand off to Phase 16H for remediation planning;
- protect downstream progression where necessary.

---

## 29. Re-lock Policy

Re-locking already accessed content can be disruptive and discouraging.

Therefore, `RELOCK` MUST be used conservatively.

Possible policies include:

- keep world access but block progression-bearing completion;
- allow supported participation;
- restrict only high-dependency missions;
- require a short confirmation mission;
- preserve completed decorative rewards;
- preserve social access where safe.

A re-lock decision MUST explain what capability is protected and why.

---

## 30. Mastery Across Composite Targets

Some destinations depend on multiple targets.

```ts
interface CompositeProgressionRule {
  destinationId: string
  requiredTargets: Array<{
    targetId: string
    minimumState: MasteryState
    minimumConfidence: number
    weight: number
  }>
  aggregationMode: 'ALL_REQUIRED' | 'WEIGHTED_WITH_HARD_MINIMUMS' | 'POLICY_EXPRESSION'
}
```

Weighted aggregation MUST NOT permit a high score in one target to conceal a critical prerequisite failure in another.

---

## 31. Misconception-Aware Mastery

Mastery evaluation MUST consider active misconception signals from Phase 16B and assessment results from Phase 16E.

A high correctness rate does not establish mastery when a persistent misconception remains observable.

```ts
interface MisconceptionConstraint {
  misconceptionId: string
  severity: number
  blocksMastery: boolean
  blocksTransfer: boolean
  requiresIndependentDisconfirmation: boolean
}
```

---

## 32. Hint and Mentor Effects

Phase 16F assistance attribution MUST affect mastery interpretation.

General rules:

- low-level orienting support may reduce confidence slightly or not at all depending on policy;
- conceptual hints reduce independence for the hinted reasoning step;
- procedural instructions cannot support independent procedural mastery for the supplied step;
- direct answer exposure invalidates the affected evidence for independent mastery;
- mentor support must be attributed by action and target;
- subsequent independent confirmation may restore confidence.

The runtime MUST NOT permanently penalize a learner for requesting help.

Assistance affects the interpretation of a specific evidence trail, not the learner's worth or long-term potential.

---

## 33. Speed and Efficiency

Speed MAY be relevant to fluency only after conceptual accuracy and independence are established.

The system MUST NOT use speed as a universal mastery criterion.

Slow, deliberate, correct reasoning may provide strong conceptual evidence.

Fast guessing may provide weak evidence even when the final answer is correct.

---

## 34. Error and Revision

Self-correction can be strong evidence.

A learner who identifies and repairs an error may demonstrate deeper understanding than a learner who arrives at the correct result accidentally.

Mastery evaluation SHOULD preserve:

- first committed attempt;
- detected error;
- revision path;
- whether the correction was independent;
- whether the learner generalized the correction.

---

## 35. Administrative Correction

Manual correction may be necessary for corrupted data, identity mistakes, or policy migration.

```ts
interface MasteryAdministrativeCorrection {
  correctionId: string
  learnerId: string
  targetId: string
  previousRecordVersion: number
  correctedState: MasteryState
  reasonCode: string
  evidenceReferences: string[]
  actorId: string
  actorRole: string
  createdAt: string
}
```

Administrative correction MUST be auditable and MUST NOT overwrite history silently.

Teachers and parents MUST NOT receive unrestricted authority to declare mastery without evidence under normal operation.

---

## 36. Runtime Services

### 36.1 MasteryEvaluationService

Consumes assessment results and produces a deterministic mastery evaluation.

### 36.2 MasteryTransitionService

Validates and applies mastery state transitions.

### 36.3 PrerequisiteResolutionService

Resolves prerequisite state for a requested destination.

### 36.4 ProgressionEligibilityService

Determines progression eligibility and active holds.

### 36.5 UnlockDecisionService

Produces auditable unlock, limited unlock, keep-locked, or re-lock decisions.

### 36.6 ReviewSchedulingService

Schedules retention and delayed confirmation reviews.

### 36.7 RegressionDetectionService

Evaluates whether current evidence supports `AT_RISK` or `REGRESSED`.

### 36.8 MasteryReplayService

Rebuilds mastery state from versioned events and policies.

---

## 37. Runtime Events

```ts
type MasteryRuntimeEvent =
  | MasteryEvaluationRequested
  | MasteryEvaluationCompleted
  | MasteryStateChanged
  | MasteryReviewScheduled
  | MasteryReviewDue
  | MasteryRiskDetected
  | MasteryRegressionConfirmed
  | ProgressionEligibilityEvaluated
  | ProgressionHoldApplied
  | ProgressionHoldReleased
  | DestinationUnlocked
  | DestinationLimitedUnlocked
  | DestinationRelocked
```

Every event MUST include:

- event identity;
- learner identity;
- target or destination identity;
- causation identity;
- correlation identity;
- policy version;
- occurred-at timestamp;
- schema version.

---

## 38. Persistence Contracts

Suggested durable aggregates:

```text
LearnerMasteryAggregate
ProgressionEligibilityAggregate
UnlockDecisionAggregate
ReviewScheduleAggregate
```

Suggested read projections:

```text
LearnerMasteryProjection
LearnerPathProjection
ReviewQueueProjection
ProgressionHoldProjection
WorldUnlockProjection
```

Persistence MUST support optimistic concurrency.

Mastery writes MUST use expected record version.

Duplicate evaluation commands MUST be idempotent.

---

## 39. API-Oriented Contracts

### 39.1 Evaluate mastery

```http
POST /api/v1/learners/{learnerId}/mastery/{targetId}/evaluate
```

```ts
interface EvaluateMasteryCommand {
  expectedRecordVersion: number | null
  assessmentResultIds: string[]
  policyVersion: string
  correlationId: string
}
```

### 39.2 Read mastery

```http
GET /api/v1/learners/{learnerId}/mastery/{targetId}
```

### 39.3 Evaluate progression

```http
POST /api/v1/learners/{learnerId}/progression/evaluate
```

```ts
interface EvaluateProgressionCommand {
  destinationId: string
  destinationType: string
  policyVersion: string
  correlationId: string
}
```

### 39.4 Read learner path

```http
GET /api/v1/learners/{learnerId}/progression
```

### 39.5 Read review queue

```http
GET /api/v1/learners/{learnerId}/reviews
```

---

## 40. Failure Taxonomy

```ts
type MasteryFailureCode =
  | 'MASTERY_POLICY_NOT_FOUND'
  | 'MASTERY_POLICY_VERSION_MISMATCH'
  | 'TARGET_VERSION_MISMATCH'
  | 'ASSESSMENT_RESULT_NOT_FOUND'
  | 'ASSESSMENT_RESULT_INVALID'
  | 'INSUFFICIENT_EVIDENCE'
  | 'INSUFFICIENT_INDEPENDENT_EVIDENCE'
  | 'CONTRADICTORY_EVIDENCE_UNRESOLVED'
  | 'INVALID_MASTERY_TRANSITION'
  | 'MASTERY_VERSION_CONFLICT'
  | 'PREREQUISITE_GRAPH_UNAVAILABLE'
  | 'DESTINATION_NOT_FOUND'
  | 'UNLOCK_POLICY_NOT_FOUND'
  | 'REVIEW_SCHEDULE_INVALID'
  | 'DUPLICATE_COMMAND_CONFLICT'
  | 'IDENTITY_ATTRIBUTION_UNCERTAIN'
```

Failures MUST be machine-readable and safe for downstream projection.

---

## 41. Idempotency and Concurrency

Mastery evaluation commands MUST carry stable command identity or correlation identity.

The runtime MUST protect against:

- duplicate assessment delivery;
- concurrent mastery evaluation;
- stale record updates;
- repeated unlock events;
- review scheduling duplication;
- replay producing duplicate side effects.

```ts
interface MasteryWriteResult {
  status: 'WRITTEN' | 'IDEMPOTENT_REPLAY' | 'VERSION_CONFLICT' | 'REJECTED'
  masteryRecordId: string
  recordVersion: number
  state: MasteryState
}
```

---

## 42. Replay and Determinism

Given the same:

- ordered valid assessment results;
- mastery policy version;
- prerequisite graph version;
- review policy version;
- evaluation timestamp where time is an explicit input;

the runtime MUST produce the same mastery and progression decisions.

Any non-deterministic dependency MUST be captured as an explicit versioned input.

---

## 43. Auditability

Every mastery state change MUST answer:

- which evidence was considered;
- which evidence was excluded;
- which policy version was used;
- which dimensions passed or failed;
- whether evidence was independent;
- whether contradiction existed;
- why the transition was allowed;
- what unlock consequences followed.

The audit trail MUST preserve historical decisions even when policy evolves.

---

## 44. Privacy and Child Safety

Mastery data is sensitive educational data.

The system MUST:

- minimize personally identifying data in runtime events;
- separate educational evidence from public social identity;
- restrict administrative correction authority;
- prevent public leaderboards based on weakness or regression;
- avoid shame-based labels;
- expose only role-appropriate projections;
- retain evidence according to explicit policy;
- support deletion or anonymization where legally required.

---

## 45. Equity Rules

Progression policy MUST avoid punishing learners for:

- disability-related access needs;
- slower interaction speed;
- language-light navigation needs;
- requesting help;
- taking longer to build durable understanding;
- learning above or below nominal grade level.

Accessibility assistance must be distinguished from mathematical assistance.

Payment status MUST NOT alter mastery truth.

Commercial policy MAY affect access to services, but MUST NOT rewrite educational evidence or falsely declare mastery.

---

## 46. Ratio and Proportional Reasoning Validation Slice

This slice validates the architecture against ratio reasoning.

### 46.1 Target

The learner understands multiplicative comparison and preserves equivalent ratios across representations and contexts.

### 46.2 Candidate evidence set

1. Builds two quantities in a correct ratio using world objects.
2. Scales both quantities by the same factor independently.
3. Detects that additive change breaks the relationship.
4. Moves from object groups to a ratio table.
5. Solves a new recipe or construction context after delay.
6. Explains or behaviorally demonstrates why both quantities must scale together.

### 46.3 Insufficient evidence examples

- completes one ratio mission after a direct hint;
- copies a peer's object arrangement;
- selects the correct option after repeated answer exposure;
- succeeds only with identical numbers and identical layout;
- finishes quickly but cannot detect an invalid additive strategy;
- performs a procedure without showing multiplicative meaning.

### 46.4 Example mastery policy

```ts
const ratioMasteryPolicy: MasteryPolicy = {
  policyId: 'ratio-core-mastery',
  policyVersion: '1.0.0',
  targetId: 'ratio-multiplicative-comparison',
  minimumDimensions: {
    conceptualUnderstanding: 0.8,
    proceduralFluency: 0.7,
    representationFlexibility: 0.65,
    reasoningQuality: 0.75,
    independence: 0.75,
    durability: 0.6,
    transferBreadth: 0.6,
  },
  requiredEvidenceCount: 5,
  requiredIndependentEvidenceCount: 3,
  requiredDistinctContexts: 2,
  requiredDistinctRepresentations: 2,
  minimumObservationSpanHours: 24,
  maximumContradictionRatio: 0.2,
  requireDelayedConfirmation: true,
  delayedConfirmationMinimumHours: 12,
  requireTransferConfirmation: false,
  masteryStateOnPass: 'MASTERED',
  reviewSchedule: {
    initialReviewDelayHours: 168,
    subsequentReviewDelaysHours: [336, 720, 1440],
    accelerateOnRisk: true,
    postponeOnStrongTransfer: true,
    maximumReviewGapHours: 2160,
  },
}
```

### 46.5 Example progression behavior

- Strong same-session evidence may move the learner to `PROVISIONAL`.
- Delayed independent evidence may move the learner to `MASTERED`.
- Success in a new scaling context may move the learner to `TRANSFER_CONFIRMED`.
- Repeated additive reasoning errors may apply a progression hold.
- Phase 16H receives the misconception and fragile prerequisite context for remediation planning.

---

## 47. Downstream Contract to Phase 16H

Phase 16G supplies Phase 16H with:

```ts
interface RemediationHandoff {
  learnerId: string
  targetId: string
  currentMasteryState: MasteryState
  fragileDimensions: Array<keyof MasteryDimensions>
  misconceptionIds: string[]
  failedPrerequisiteIds: string[]
  assistanceDependencySignals: string[]
  contradictionSummary: string[]
  recentAssessmentIds: string[]
  progressionHoldCodes: ProgressionHoldCode[]
  recommendedUrgency: 'LOW' | 'MEDIUM' | 'HIGH'
  correlationId: string
}
```

Phase 16G decides that progression is unsafe or mastery is fragile.

Phase 16H decides how the learner should rebuild understanding.

---

## 48. Downstream Contract to Phase 16I

Phase 16I may project:

- current mastery state;
- confidence band;
- strengths by dimension;
- review due status;
- progression holds in understandable language;
- recent independent confirmation;
- meaningful improvement over time.

Phase 16I MUST NOT expose raw internal labels in a way that shames or misleads families or teachers.

---

## 49. Downstream Contract to Phase 16J

Phase 16J may analyze:

- mastery transition distributions;
- time-to-mastery;
- assistance dependence patterns;
- retention outcomes;
- regression rates;
- progression hold frequency;
- policy performance;
- fairness across groups;
- false-positive and false-negative mastery risk.

Analytics MUST NOT become an alternative authority for individual mastery truth.

---

## 50. Invariants

A conforming implementation MUST preserve these invariants:

1. No mastery without valid assessment evidence.
2. No mastery solely from task completion.
3. No mastery solely from dependent evidence.
4. No silent removal of contradictory evidence.
5. No unlock without progression eligibility evaluation.
6. No historical mastery rewrite without audit.
7. No grade-level assumption overriding prerequisite truth.
8. No payment state altering mastery truth.
9. No regression from a single low-confidence failure.
10. No permanent penalty for requesting support.
11. No direct `UNOBSERVED → MASTERED` transition under normal policy.
12. No mastery policy execution without a version.
13. No duplicate command producing duplicate side effects.
14. No re-lock without an explicit safety or dependency rationale.
15. No composite score concealing a failed hard prerequisite.

---

## 51. Acceptance Criteria

Phase 16G foundation is complete when:

- mastery states are explicit and versioned;
- mastery dimensions are separated;
- evidence sufficiency includes independence, diversity, and time;
- provisional mastery is distinct from mastery;
- transfer confirmation is distinct from familiar-context success;
- prerequisites drive progression eligibility;
- unlock decisions are auditable;
- review and retention are defined;
- regression is possible without erasing history;
- hint and mentor attribution affects evidence correctly;
- API-oriented contracts are defined;
- idempotency and concurrency rules are explicit;
- ratio reasoning validates the architecture;
- the Phase 16H handoff is explicit.

---

## 52. Foundation Decision

Phase 16G establishes the progression authority for Math Learning World.

The system now has a complete path from learning target to durable learner progression:

```text
Learning Target
        ↓
Cognitive Transformation
        ↓
Learner Diagnosis
        ↓
Mission Planning
        ↓
World Activity
        ↓
Mathematical Evidence
        ↓
Assessment
        ↓
Hint / Mentor Attribution
        ↓
Mastery Evaluation
        ↓
Progression Eligibility
        ↓
Unlock + Review
```

The next architecture phase is:

```text
16H — Remediation
```

Phase 16H will define how the system rebuilds fragile or missing understanding without reducing remediation to repetition, punishment, or grade-level rollback.
