# 17B — Specialized Learning Runtime Modules

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 17B — Specialized Learning Runtime Modules  
**Document Type:** Runtime Architecture / Module Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/runtime/17A-LEARNING-RUNTIME-CORE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16B-LEARNER-READINESS-AND-COGNITIVE-DIAGNOSIS.md`, `docs/world/16C-COGNITIVE-MISSION-PLANNING-AND-GENERATION.md`, `docs/world/16D-WORLD-ACTIVITY-BINDING.md`, `docs/world/16E-MATHEMATICAL-EVIDENCE-AND-ASSESSMENT.md`, `docs/world/16F-HINT-AND-MENTOR-SUPPORT.md`, `docs/world/16G-MASTERY-AND-PROGRESSION.md`, `docs/world/16H-REMEDIATION.md`, `docs/world/16I-PARENT-AND-TEACHER-PROJECTION.md`, `docs/world/16J-ANALYTICS-AND-GOVERNANCE.md`  
**Downstream Consumers:** Phase 17C runtime event contracts, Phase 17D recovery and snapshot architecture, Phase 18 domain model, application command handlers, persistence adapters, API contracts, frontend runtime

---

## 1. Purpose

This guide defines the specialized runtime modules that execute the learning lifecycle under the authority of `LearningRuntime`.

The central doctrine is:

> A specialized runtime module owns one bounded learning decision, produces explicit events, and returns authority to the top-level Learning Runtime; no module may silently advance the global lifecycle or mutate another module's truth.

A conforming module architecture must answer:

> Which module owns the current decision, what input authority it requires, which invariant governs execution, which result it returns, which events prove the result, and how the top-level runtime safely continues, suspends, retries, or recovers?

Phase 17B converts the blueprint layers from 16A–16J into executable runtime boundaries without collapsing them into one large service.

---

## 2. Architectural Position

```text
Learning Mission System Blueprint (16A–16J)
        ↓
Learning Runtime Core (17A)
        ↓
Specialized Runtime Modules (17B)
        ↓
Runtime Event Contracts (17C)
        ↓
Recovery and Snapshot Architecture (17D)
        ↓
Domain Model (18)
```

`LearningRuntime` remains the top-level lifecycle authority.

Specialized runtime modules are decision authorities only inside their own bounded contexts.

---

## 3. Module Topology

```text
LearningRuntime
├── TargetRuntime
├── DiagnosisRuntime
├── MissionPlanningRuntime
├── WorldActivityRuntime
├── EvidenceRuntime
├── AssessmentRuntime
├── SupportRuntime
├── MasteryRuntime
├── ProgressionRuntime
├── RemediationRuntime
├── ProjectionRuntime
└── AnalyticsEmissionRuntime
```

The topology is intentionally explicit.

No generic `LearningService` may replace these boundaries.

No module may become a shared dumping ground for cross-cutting business logic.

---

## 4. Common Module Contract

Every specialized runtime module must implement the same conceptual contract.

```ts
interface SpecializedRuntimeModule<Command, State, Result, Event> {
  admit(command: Command, context: RuntimeContext): AdmissionDecision;
  execute(command: Command, state: State, context: RuntimeContext): Result;
  produceEvents(result: Result, context: RuntimeContext): Event[];
}
```

This is an architectural contract, not a required literal TypeScript interface.

Each module must define:

- module identity;
- owned command types;
- owned state;
- required upstream references;
- invariant set;
- deterministic transition rules;
- emitted event types;
- completion result;
- suspension reasons;
- retry policy;
- recovery policy;
- idempotency key semantics;
- policy version dependencies;
- audit fields;
- prohibited side effects.

---

## 5. Shared Runtime Context

Every module receives a qualified runtime context.

```text
RuntimeContext
├── runtimeId
├── tenantId
├── learnerId
├── runtimeVersion
├── expectedRuntimeVersion
├── commandId
├── correlationId
├── causationId
├── actor
├── issuedAt
├── executionStartedAt
├── policyVersionSet
├── locale
├── consentScope
├── traceContext
└── replayMode
```

Modules must not infer identity, consent, policy version, or replay status from global process state.

All consequential context must be explicit.

---

## 6. Module Execution Law

Every module execution follows this sequence:

```text
Command Received
        ↓
Identity and Runtime Context Validation
        ↓
Expected Version Validation
        ↓
Module Admission
        ↓
Upstream Reference Validation
        ↓
Invariant Evaluation
        ↓
Deterministic Decision
        ↓
Module Result
        ↓
Module Events
        ↓
Return to LearningRuntime
        ↓
Top-level Lifecycle Transition
```

A specialized module may recommend the next lifecycle transition.

Only `LearningRuntime` authorizes and records the top-level transition.

---

## 7. TargetRuntime

### 7.1 Responsibility

`TargetRuntime` resolves the learner's active learning target against the authoritative cognitive transformation graph.

### 7.2 Owns

- target admission;
- target reference validation;
- target eligibility evaluation;
- prerequisite reference resolution;
- target activation result;
- target policy version binding.

### 7.3 Does not own

- diagnosis;
- mission generation;
- mastery declaration;
- curriculum editing;
- learner progression mutation.

### 7.4 Commands

```text
SelectLearningTarget
ReplaceLearningTarget
ConfirmTargetEligibility
DeactivateLearningTarget
```

### 7.5 Results

```text
TARGET_ACTIVATED
TARGET_REJECTED
TARGET_REQUIRES_DIAGNOSIS
TARGET_BLOCKED_BY_PREREQUISITE
TARGET_DEACTIVATED
```

### 7.6 Events

```text
LearningTargetSelected
LearningTargetActivated
LearningTargetRejected
LearningTargetDeactivated
TargetDiagnosisRequired
```

---

## 8. DiagnosisRuntime

### 8.1 Responsibility

`DiagnosisRuntime` coordinates readiness checks and produces a bounded diagnosis result with explicit confidence and uncertainty.

### 8.2 Owns

- diagnosis cycle lifecycle;
- diagnostic evidence request;
- readiness classification;
- misconception hypothesis set;
- confidence qualification;
- freshness and expiry;
- diagnosis completion result.

### 8.3 Does not own

- mastery;
- remediation placement;
- mission completion;
- permanent learner labeling;
- curriculum truth.

### 8.4 Commands

```text
StartDiagnosis
SubmitDiagnosticObservation
CompleteDiagnosis
ExpireDiagnosis
InvalidateDiagnosis
```

### 8.5 Results

```text
DIAGNOSIS_STARTED
DIAGNOSIS_AWAITING_EVIDENCE
DIAGNOSIS_COMPLETED
DIAGNOSIS_INCONCLUSIVE
DIAGNOSIS_EXPIRED
DIAGNOSIS_INVALIDATED
```

### 8.6 Events

```text
DiagnosisStarted
DiagnosticObservationRecorded
DiagnosisCompleted
DiagnosisDeclaredInconclusive
DiagnosisExpired
DiagnosisInvalidated
```

---

## 9. MissionPlanningRuntime

### 9.1 Responsibility

`MissionPlanningRuntime` converts an active target and qualified learner state into an executable cognitive mission plan.

### 9.2 Owns

- mission candidate generation boundary;
- mission plan selection;
- mission objective binding;
- step ordering;
- difficulty and support budget;
- mission policy version;
- mission issue result.

### 9.3 Does not own

- world rendering;
- evidence interpretation;
- mastery;
- direct remediation assignment;
- analytics conclusions.

### 9.4 Commands

```text
GenerateMissionPlan
SelectMissionPlan
IssueMission
ReviseMissionPlan
CancelMissionPlan
```

### 9.5 Results

```text
MISSION_PLAN_GENERATED
MISSION_PLAN_SELECTED
MISSION_ISSUED
MISSION_REQUIRES_REPLAN
MISSION_CANCELLED
```

### 9.6 Events

```text
MissionPlanGenerated
MissionPlanSelected
MissionIssued
MissionReplanRequested
MissionPlanCancelled
```

---

## 10. WorldActivityRuntime

### 10.1 Responsibility

`WorldActivityRuntime` binds a cognitive mission step to an executable world activity without allowing game mechanics to redefine learning intent.

### 10.2 Owns

- activity binding;
- activity instance lifecycle;
- interaction eligibility;
- world completion signal qualification;
- activity interruption state;
- activity completion result.

### 10.3 Does not own

- mathematical correctness;
- mastery;
- diagnosis;
- final evidence interpretation;
- physics implementation.

### 10.4 Commands

```text
BindWorldActivity
StartWorldActivity
RecordWorldInteraction
PauseWorldActivity
ResumeWorldActivity
CompleteWorldActivity
AbandonWorldActivity
```

### 10.5 Results

```text
ACTIVITY_BOUND
ACTIVITY_RUNNING
ACTIVITY_PAUSED
ACTIVITY_COMPLETED
ACTIVITY_ABANDONED
ACTIVITY_REJECTED
```

### 10.6 Events

```text
WorldActivityBound
WorldActivityStarted
WorldInteractionRecorded
WorldActivityPaused
WorldActivityResumed
WorldActivityCompleted
WorldActivityAbandoned
```

---

## 11. EvidenceRuntime

### 11.1 Responsibility

`EvidenceRuntime` captures, qualifies, and seals mathematical learning evidence generated through world activity.

### 11.2 Owns

- evidence cycle lifecycle;
- evidence item identity;
- provenance;
- capture qualification;
- evidence completeness;
- evidence sealing;
- evidence rejection reasons.

### 11.3 Does not own

- assessment conclusions;
- mastery;
- diagnosis truth;
- learner ranking;
- world completion authority.

### 11.4 Commands

```text
OpenEvidenceCycle
CaptureEvidence
QualifyEvidence
RejectEvidence
SealEvidenceCycle
ReopenEvidenceCycle
```

### 11.5 Results

```text
EVIDENCE_CYCLE_OPENED
EVIDENCE_CAPTURED
EVIDENCE_QUALIFIED
EVIDENCE_REJECTED
EVIDENCE_CYCLE_SEALED
EVIDENCE_CYCLE_INCOMPLETE
```

### 11.6 Events

```text
EvidenceCycleOpened
EvidenceCaptured
EvidenceQualified
EvidenceRejected
EvidenceCycleSealed
EvidenceCycleReopened
```

---

## 12. AssessmentRuntime

### 12.1 Responsibility

`AssessmentRuntime` interprets sealed evidence against an explicit assessment policy and produces a bounded assessment result.

### 12.2 Owns

- assessment cycle lifecycle;
- rubric and policy binding;
- evidence sufficiency evaluation;
- correctness interpretation;
- partial understanding representation;
- confidence and uncertainty;
- assessment completion result.

### 12.3 Does not own

- mastery declaration;
- progression unlocking;
- remediation placement;
- curriculum authoring;
- evidence mutation after sealing.

### 12.4 Commands

```text
StartAssessment
EvaluateEvidence
RequestAdditionalEvidence
CompleteAssessment
InvalidateAssessment
```

### 12.5 Results

```text
ASSESSMENT_STARTED
ASSESSMENT_AWAITING_EVIDENCE
ASSESSMENT_COMPLETED
ASSESSMENT_INCONCLUSIVE
ASSESSMENT_INVALIDATED
```

### 12.6 Events

```text
AssessmentStarted
EvidenceEvaluated
AdditionalEvidenceRequested
AssessmentCompleted
AssessmentDeclaredInconclusive
AssessmentInvalidated
```

---

## 13. SupportRuntime

### 13.1 Responsibility

`SupportRuntime` coordinates hints and mentor assistance while preserving evidence attribution and learner agency.

### 13.2 Owns

- hint eligibility;
- hint level progression;
- support budget;
- mentor request lifecycle;
- mentor intervention attribution;
- dependency indicators;
- support completion result.

### 13.3 Does not own

- assessment outcome;
- mastery;
- remediation policy;
- parent projection;
- unbounded answer revelation.

### 13.4 Commands

```text
RequestHint
DeliverHint
EscalateHint
RequestMentorSupport
RecordMentorIntervention
CloseSupportCycle
```

### 13.5 Results

```text
HINT_GRANTED
HINT_REJECTED
HINT_ESCALATED
MENTOR_SUPPORT_REQUESTED
MENTOR_INTERVENTION_RECORDED
SUPPORT_CYCLE_CLOSED
```

### 13.6 Events

```text
HintRequested
HintDelivered
HintEscalated
MentorSupportRequested
MentorInterventionRecorded
SupportCycleClosed
```

---

## 14. MasteryRuntime

### 14.1 Responsibility

`MasteryRuntime` evaluates qualified assessment history against versioned mastery policy and produces a mastery decision without erasing uncertainty.

### 14.2 Owns

- mastery evaluation cycle;
- mastery policy binding;
- evidence window selection;
- confidence threshold evaluation;
- mastery status transition proposal;
- mastery decision explanation;
- mastery expiry or review requirement.

### 14.3 Does not own

- target graph authoring;
- assessment mutation;
- progression unlocking;
- remediation execution;
- parent wording.

### 14.4 Commands

```text
StartMasteryEvaluation
EvaluateMastery
ConfirmMastery
WithholdMastery
ExpireMastery
InvalidateMasteryDecision
```

### 14.5 Results

```text
MASTERY_CONFIRMED
MASTERY_WITHHELD
MASTERY_INCONCLUSIVE
MASTERY_EXPIRED
MASTERY_INVALIDATED
```

### 14.6 Events

```text
MasteryEvaluationStarted
MasteryConfirmed
MasteryWithheld
MasteryDeclaredInconclusive
MasteryExpired
MasteryDecisionInvalidated
```

---

## 15. ProgressionRuntime

### 15.1 Responsibility

`ProgressionRuntime` applies progression policy to verified mastery and determines what learning opportunities become available.

### 15.2 Owns

- progression eligibility;
- unlock decision;
- progression path update proposal;
- prerequisite satisfaction projection;
- progression hold reasons;
- next-target recommendation boundary.

### 15.3 Does not own

- mastery;
- diagnosis;
- curriculum graph mutation;
- mission generation;
- learner ranking.

### 15.4 Commands

```text
EvaluateProgression
UnlockLearningOpportunity
HoldProgression
RecommendNextTarget
RevokeProgressionUnlock
```

### 15.5 Results

```text
PROGRESSION_UNLOCKED
PROGRESSION_HELD
NEXT_TARGET_RECOMMENDED
UNLOCK_REVOKED
```

### 15.6 Events

```text
ProgressionEvaluated
LearningOpportunityUnlocked
ProgressionHeld
NextTargetRecommended
ProgressionUnlockRevoked
```

---

## 16. RemediationRuntime

### 16.1 Responsibility

`RemediationRuntime` creates and manages a bounded recovery pathway when the learner lacks prerequisite understanding or repeated evidence remains insufficient.

### 16.2 Owns

- remediation eligibility;
- remediation plan lifecycle;
- prerequisite recovery target selection;
- remediation intensity;
- re-entry criteria;
- remediation completion and escalation.

### 16.3 Does not own

- permanent learner labels;
- mastery declaration;
- diagnosis truth;
- payment policy;
- punitive progression blocking outside policy.

### 16.4 Commands

```text
EvaluateRemediationNeed
CreateRemediationPlan
StartRemediation
RecordRemediationProgress
CompleteRemediation
EscalateRemediation
CancelRemediation
```

### 16.5 Results

```text
REMEDIATION_NOT_REQUIRED
REMEDIATION_PLAN_CREATED
REMEDIATION_ACTIVE
REMEDIATION_COMPLETED
REMEDIATION_ESCALATED
REMEDIATION_CANCELLED
```

### 16.6 Events

```text
RemediationNeedEvaluated
RemediationPlanCreated
RemediationStarted
RemediationProgressRecorded
RemediationCompleted
RemediationEscalated
RemediationCancelled
```

---

## 17. ProjectionRuntime

### 17.1 Responsibility

`ProjectionRuntime` transforms authoritative learning records into consent-aware parent and teacher projections.

### 17.2 Owns

- audience resolution;
- relationship validation;
- consent and visibility enforcement;
- projection model selection;
- confidence and freshness presentation;
- recommendation publication;
- acknowledgement lifecycle.

### 17.3 Does not own

- diagnosis;
- mastery;
- remediation decisions;
- analytics findings;
- raw learner state mutation.

### 17.4 Commands

```text
GenerateParentProjection
GenerateTeacherProjection
PublishProjection
AcknowledgeProjection
ExpireProjection
WithdrawProjection
```

### 17.5 Results

```text
PROJECTION_GENERATED
PROJECTION_PUBLISHED
PROJECTION_ACKNOWLEDGED
PROJECTION_EXPIRED
PROJECTION_WITHDRAWN
PROJECTION_DENIED
```

### 17.6 Events

```text
ParentProjectionGenerated
TeacherProjectionGenerated
ProjectionPublished
ProjectionAcknowledged
ProjectionExpired
ProjectionWithdrawn
```

---

## 18. AnalyticsEmissionRuntime

### 18.1 Responsibility

`AnalyticsEmissionRuntime` emits privacy-qualified, lineage-complete analytics events from authoritative runtime outcomes.

### 18.2 Owns

- analytics event eligibility;
- privacy qualification;
- lineage attachment;
- metric input contract versioning;
- emission acknowledgement;
- emission failure isolation.

### 18.3 Does not own

- metric computation;
- governance decisions;
- learner truth;
- mastery;
- runtime lifecycle progression.

### 18.4 Commands

```text
QualifyAnalyticsEmission
EmitAnalyticsEvent
RetryAnalyticsEmission
SuppressAnalyticsEmission
```

### 18.5 Results

```text
ANALYTICS_EVENT_EMITTED
ANALYTICS_EVENT_SUPPRESSED
ANALYTICS_EMISSION_RETRY_REQUIRED
ANALYTICS_EMISSION_FAILED
```

### 18.6 Events

```text
AnalyticsEmissionQualified
AnalyticsEventEmitted
AnalyticsEmissionSuppressed
AnalyticsEmissionRetryScheduled
AnalyticsEmissionFailed
```

Analytics emission failure must not roll back a valid learner-facing learning transition unless a mandatory compliance policy explicitly requires blocking.

---

## 19. Orchestration Rules

### 19.1 Single active decision owner

At any moment, only one specialized module may own the active consequential decision for a `LearningRuntime`.

Background projection and analytics emission may occur asynchronously but may not mutate the active learning lifecycle.

### 19.2 No direct module-to-module mutation

A module must not call another module and mutate its internal state directly.

The permitted pattern is:

```text
Module A Result
        ↓
Module A Events
        ↓
LearningRuntime
        ↓
Top-level Transition
        ↓
Command to Module B
```

### 19.3 Explicit reference transfer

Cross-module handoff uses immutable references.

```text
RuntimeReference
├── type
├── id
├── version
├── status
├── issuedAt
└── policyVersion
```

### 19.4 No hidden orchestration

Database triggers, ORM hooks, UI route changes, queue consumers, or analytics jobs may not silently advance the learning lifecycle.

---

## 20. Recommended Top-Level Lifecycle Mapping

```text
CREATED
  → TARGET_ACTIVE
  → DIAGNOSIS_ACTIVE
  → MISSION_PLANNING
  → MISSION_READY
  → ACTIVITY_ACTIVE
  → EVIDENCE_ACTIVE
  → ASSESSMENT_ACTIVE
  → MASTERY_EVALUATION
  → PROGRESSION_EVALUATION
  → COMPLETED
```

Conditional branches:

```text
DIAGNOSIS_ACTIVE
  → DIAGNOSIS_INCONCLUSIVE
  → SUSPENDED

ACTIVITY_ACTIVE
  → SUPPORT_ACTIVE
  → ACTIVITY_ACTIVE

ASSESSMENT_ACTIVE
  → ADDITIONAL_EVIDENCE_REQUIRED
  → EVIDENCE_ACTIVE

MASTERY_EVALUATION
  → REMEDIATION_ACTIVE
  → REENTRY_EVALUATION

ANY ACTIVE STATE
  → SUSPENDED
  → RECOVERING
  → PREVIOUS AUTHORIZED STATE
```

Projection and analytics emission are side pipelines triggered by authoritative events.

They are not top-level learner lifecycle states unless a future compliance requirement explicitly introduces a blocking state.

---

## 21. Command Ownership Matrix

| Command Family | Owning Module | Top-level Runtime Role |
|---|---|---|
| target selection | TargetRuntime | authorize lifecycle entry |
| readiness diagnosis | DiagnosisRuntime | coordinate and record result |
| mission planning | MissionPlanningRuntime | activate executable mission |
| world activity | WorldActivityRuntime | bind activity and control lifecycle |
| evidence capture | EvidenceRuntime | seal evidence reference |
| assessment | AssessmentRuntime | record bounded assessment result |
| hints and mentor support | SupportRuntime | preserve attribution and return control |
| mastery | MasteryRuntime | accept mastery decision reference |
| progression | ProgressionRuntime | authorize unlock application |
| remediation | RemediationRuntime | enter and exit recovery branch |
| parent/teacher projection | ProjectionRuntime | trigger side pipeline only |
| analytics emission | AnalyticsEmissionRuntime | trigger non-authoritative side pipeline |

---

## 22. Module Idempotency

Each command must define an idempotency scope.

```text
ModuleIdempotencyKey
├── tenantId
├── runtimeId
├── moduleType
├── commandType
├── clientOperationId
└── semanticTargetRef
```

The same accepted idempotency key must return the original result.

It must not produce a second logical decision or duplicate event set.

A reused key with materially different command content must fail with:

```text
IDEMPOTENCY_KEY_CONFLICT
```

---

## 23. Concurrency Law

All consequential module commands require an expected runtime version.

Where the module has an independently versioned aggregate, the command also requires an expected module version.

```text
expectedRuntimeVersion
expectedModuleVersion
```

A mismatch must reject before mutation.

```text
RUNTIME_VERSION_CONFLICT
MODULE_VERSION_CONFLICT
```

The runtime must reload authoritative state before retrying.

Blind automatic retries are prohibited for commands that can change educational meaning.

---

## 24. Suspension Law

A module must suspend rather than invent a result when:

- required upstream references are missing;
- policy versions cannot be resolved;
- evidence is incomplete;
- confidence is below the required threshold;
- consent is unresolved;
- external mentor action is pending;
- a required invariant cannot be evaluated;
- runtime or module version conflicts persist;
- an authoritative dependency is unavailable.

Suspension must record:

```text
SuspensionRecord
├── suspensionId
├── runtimeId
├── moduleType
├── reasonCode
├── suspendedFromState
├── requiredResolution
├── retryEligibility
├── suspendedAt
└── policyVersionSet
```

---

## 25. Recovery Law

Every specialized module must classify failed execution as one of:

```text
RETRYABLE_TRANSIENT
REQUIRES_FRESH_STATE
REQUIRES_ADDITIONAL_INPUT
REQUIRES_HUMAN_REVIEW
POLICY_BLOCKED
CONSENT_BLOCKED
IRRECOVERABLE_CONTRACT_VIOLATION
```

Recovery must resume from verified durable state.

It must not infer completion from a UI response, queue acknowledgement, network success, or emitted notification.

Previously verified failure evidence may be reused during recovery; the system must not reproduce the same failure merely to prove it again.

---

## 26. Failure Taxonomy

Common stable failure codes include:

```text
RUNTIME_NOT_FOUND
MODULE_NOT_ACTIVE
COMMAND_NOT_ADMISSIBLE
INVALID_RUNTIME_STATE
MISSING_UPSTREAM_REFERENCE
STALE_UPSTREAM_REFERENCE
POLICY_VERSION_UNAVAILABLE
INVARIANT_VIOLATION
RUNTIME_VERSION_CONFLICT
MODULE_VERSION_CONFLICT
IDEMPOTENCY_KEY_CONFLICT
INSUFFICIENT_EVIDENCE
INSUFFICIENT_CONFIDENCE
CONSENT_SCOPE_DENIED
RELATIONSHIP_NOT_AUTHORIZED
MODULE_EXECUTION_SUSPENDED
MODULE_RECOVERY_REQUIRED
DETERMINISM_VIOLATION
REPLAY_DIVERGENCE
```

Module-specific codes may extend this list but must not redefine common meanings.

---

## 27. Determinism and Replay

Given the same:

- prior state;
- command;
- policy version set;
- qualified upstream references;
- runtime context;

A module must produce the same logical result and same ordered logical event set.

Non-deterministic inputs such as time, random values, model output, or external recommendations must be captured as explicit qualified inputs before the authoritative decision.

Replay must not call live external systems to reconstruct a historical decision.

---

## 28. Audit Envelope

Every module decision must produce or attach:

```text
ModuleAuditEnvelope
├── runtimeId
├── moduleType
├── moduleInstanceId
├── commandId
├── commandType
├── actor
├── priorRuntimeVersion
├── resultingRuntimeVersion
├── priorModuleVersion
├── resultingModuleVersion
├── invariantSetVersion
├── policyVersionSet
├── inputReferenceSet
├── resultCode
├── eventIds
├── correlationId
├── causationId
├── decidedAt
└── replayMode
```

The audit envelope explains the execution path.

It is not itself learner-facing educational interpretation.

---

## 29. Implementation Boundary

A future implementation should preserve clear module ownership.

```text
src/
├── runtime/
│   ├── core/
│   ├── target/
│   ├── diagnosis/
│   ├── mission-planning/
│   ├── world-activity/
│   ├── evidence/
│   ├── assessment/
│   ├── support/
│   ├── mastery/
│   ├── progression/
│   ├── remediation/
│   ├── projection/
│   └── analytics-emission/
```

Each module should own its own:

- command definitions;
- state model;
- invariants;
- transition functions;
- events;
- failures;
- tests;
- public exports.

Shared code is permitted only for neutral runtime primitives such as IDs, versions, event envelopes, clocks, and result types.

Workflow-specific components must remain inside their owning module.

---

## 30. Validation Slice

The first implementation validation slice should prove one complete, narrow runtime flow:

```text
SelectLearningTarget
        ↓
StartDiagnosis
        ↓
CompleteDiagnosis
        ↓
GenerateMissionPlan
        ↓
IssueMission
```

The slice must prove:

- command ownership;
- top-level orchestration;
- version checks;
- idempotency;
- module event production;
- lifecycle transition;
- replay determinism;
- refusal of an invalid cross-module transition.

This slice should remain persistence-neutral until the runtime behavior is verified.

---

## 31. Verification Gates

### Gate A — Repository Gate

Verify:

- all module boundaries are explicit;
- no module owns another module's truth;
- command and event ownership are defined;
- top-level lifecycle authority remains in 17A;
- public runtime structure matches the architecture;
- validation slice is isolated.

### Gate B — Runtime Gate

Verify:

- deterministic module execution;
- command admission;
- idempotent replay;
- optimistic concurrency rejection;
- stable failures;
- valid orchestration;
- invalid direct mutation refusal.

### Gate C — Operational Gate

Verify a real flow through:

```text
Client
  → API
  → LearningRuntime
  → Specialized Module
  → Events
  → Durable State
  → Projection
  → Client Resume
```

Operational PASS requires evidence that interruption and resume preserve the exact authorized module state.

---

## 32. Non-goals

Phase 17B does not define:

- database tables;
- Prisma models;
- transport DTOs;
- REST endpoints;
- UI screens;
- concrete assessment algorithms;
- concrete mastery thresholds;
- recommendation model implementation;
- analytics metric formulas.

Those concerns remain downstream or with their existing blueprint authority.

---

## 33. Completion Criteria

Phase 17B is complete when:

1. every major learning responsibility has one named runtime owner;
2. all modules inherit the common laws of 17A;
3. cross-module communication is event- and reference-based;
4. only `LearningRuntime` advances the top-level lifecycle;
5. projection and analytics remain non-authoritative side pipelines;
6. idempotency, concurrency, suspension, recovery, replay, and audit requirements are explicit;
7. the module topology can be translated into Phase 18 domain boundaries without guessing.

---

## 34. Final Doctrine

> The system is not one learning engine with many helper services. It is one authoritative Learning Runtime coordinating many bounded decision runtimes, each responsible for one kind of educational truth and forbidden from silently taking ownership of another.
