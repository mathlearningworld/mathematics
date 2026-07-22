# 36A — Learning Journey Runtime Foundation

## 1. Purpose

The Learning Journey Runtime owns the durable coordination of a learner's multi-session path toward an authorized educational objective.

It exists above the Learning Session Runtime and below long-term mastery, certification, and portfolio concerns.

The runtime connects:

- Mission Runtime
- Diagnostic Runtime
- Recommendation Runtime
- Intervention Runtime
- Learning Session Runtime
- Progress Engine
- Curriculum Runtime
- Skill Graph Runtime
- Assessment Engine

Its responsibility is not to decide every learning action itself. Its responsibility is to preserve the meaning, continuity, authority, and recoverability of a learner journey across many sessions and interruptions.

## 2. Core Distinction

```text
Mission ≠ Journey
Journey ≠ Session
Session ≠ Activity
Activity completion ≠ Evidence
Evidence ≠ Mastery
Progress ≠ Certification
```

A mission expresses an intended destination.

A journey is the governed, evolving route toward that destination.

A session is one bounded execution window within the journey.

## 3. Runtime Ownership

The Learning Journey Runtime owns:

- journey identity
- journey lifecycle
- journey objective binding
- journey plan lineage
- multi-session continuity
- phase and milestone coordination
- prerequisite continuity across sessions
- interruption and return semantics
- authorized adaptation boundaries
- journey-level evidence references
- journey-level projection authority
- handoff contracts to mastery, intervention, and mission runtimes
- durable replay and recovery semantics

It does not own:

- curriculum truth
- skill dependency truth
- assessment item truth
- session-local execution details
- final mastery determination
- certification authority
- parent or teacher policy authority
- billing or entitlement decisions

## 4. Journey Aggregate

A journey is modeled as an aggregate with stable identity and versioned authority.

```ts
type LearningJourneyId = string;

type LearningJourneyStatus =
  | 'DRAFT'
  | 'PLANNED'
  | 'READY'
  | 'ACTIVE'
  | 'PAUSED'
  | 'BLOCKED'
  | 'COMPLETION_PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

interface LearningJourneyAggregate {
  journeyId: LearningJourneyId;
  tenantId: string;
  learnerId: string;
  missionId?: string;
  objectiveRef: JourneyObjectiveRef;
  status: LearningJourneyStatus;
  planVersion: number;
  aggregateVersion: number;
  activePhaseId?: string;
  activeMilestoneId?: string;
  activeSessionId?: string;
  startedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

## 5. Journey Objective

The objective must be explicit, authorized, and traceable.

```ts
interface JourneyObjectiveRef {
  objectiveId: string;
  objectiveType:
    | 'FOUNDATION'
    | 'MISSION'
    | 'REMEDIATION'
    | 'ADVANCEMENT'
    | 'EXPLORATION'
    | 'EXAM_PREPARATION';
  sourceRuntime: string;
  sourceVersion: string;
  targetSkillRefs: string[];
  curriculumContextRef?: string;
  masteryTargetRef?: string;
  effectiveFrom: string;
}
```

The Journey Runtime may execute an objective but may not silently redefine it.

## 6. Journey Composition

A journey contains ordered and optionally branching structures:

```text
Journey
  ├─ Phases
  │   ├─ Milestones
  │   │   ├─ Session Intents
  │   │   └─ Evidence Requirements
  │   └─ Transition Rules
  ├─ Adaptation Envelope
  ├─ Recovery Policy
  ├─ Progress Policy
  └─ Completion Contract
```

## 7. Lifecycle

Canonical lifecycle:

```text
DRAFT
  ↓
PLANNED
  ↓
READY
  ↓
ACTIVE
  ↙      ↓       ↘
PAUSED  BLOCKED  COMPLETION_PENDING
  ↓       ↓              ↓
ACTIVE  ACTIVE        COMPLETED

Any non-terminal state may transition to CANCELLED when authorized.
COMPLETED or CANCELLED may later transition to ARCHIVED.
```

### Transition Rules

- `DRAFT → PLANNED` requires an accepted journey plan.
- `PLANNED → READY` requires prerequisite, policy, and authorization checks.
- `READY → ACTIVE` requires runtime activation authority.
- `ACTIVE → PAUSED` requires a persisted pause reason.
- `ACTIVE → BLOCKED` requires a blocking condition with ownership and recovery path.
- `ACTIVE → COMPLETION_PENDING` requires all required journey conditions to be provisionally satisfied.
- `COMPLETION_PENDING → COMPLETED` requires final journey completion verification.
- Terminal states cannot return to active execution without an explicit new journey or approved restoration protocol.

## 8. Journey Identity and Correlation

Every command and event must carry:

```ts
interface JourneyRuntimeIdentity {
  tenantId: string;
  learnerId: string;
  journeyId: string;
  correlationId: string;
  causationId?: string;
  commandId?: string;
  actorId?: string;
  actorType?: string;
  expectedVersion?: number;
}
```

Identity mismatch is a refusal condition, not a recoverable warning.

## 9. Journey Participants

Participants are projected into explicit roles:

- learner
- parent or guardian
- teacher
- tutor or mentor
- system planner
- session runtime
- intervention runtime
- mission runtime
- authorized administrator

A participant role does not automatically grant command authority.

Authority must be checked per operation.

## 10. Journey Plan Lineage

The runtime preserves every accepted plan revision.

```ts
interface JourneyPlanLineage {
  journeyId: string;
  planVersion: number;
  supersedesPlanVersion?: number;
  createdBy: string;
  reasonCode: string;
  sourceEvidenceRefs: string[];
  sourceDiagnosticRefs: string[];
  sourceRecommendationRefs: string[];
  acceptedAt: string;
}
```

A new plan never erases the meaning of a prior plan.

## 11. Phase and Milestone Model

```ts
interface JourneyPhase {
  phaseId: string;
  sequence: number;
  title: string;
  objectiveRefs: string[];
  milestoneIds: string[];
  entryCriteria: JourneyCriterion[];
  exitCriteria: JourneyCriterion[];
  status: 'LOCKED' | 'READY' | 'ACTIVE' | 'COMPLETED' | 'SKIPPED' | 'BLOCKED';
}

interface JourneyMilestone {
  milestoneId: string;
  phaseId: string;
  sequence: number;
  targetRefs: string[];
  evidenceRequirements: JourneyEvidenceRequirement[];
  sessionIntentRefs: string[];
  status: 'PENDING' | 'READY' | 'ACTIVE' | 'SATISFIED' | 'FAILED' | 'WAIVED';
}
```

Milestone satisfaction is not equivalent to mastery unless an authorized mastery runtime says so.

## 12. Multi-Session Continuity

The runtime maintains continuity across sessions through a journey checkpoint.

```ts
interface JourneyCheckpoint {
  journeyId: string;
  aggregateVersion: number;
  planVersion: number;
  activePhaseId?: string;
  activeMilestoneId?: string;
  lastSessionId?: string;
  pendingSessionIntentRefs: string[];
  unresolvedBlockerRefs: string[];
  openInterventionRefs: string[];
  evidenceCursor?: string;
  projectionCursor?: string;
  checkpointedAt: string;
}
```

The checkpoint is a recovery accelerator, not historical authority.

## 13. Session Handoff

The Journey Runtime issues a bounded session intent.

```ts
interface JourneySessionIntent {
  sessionIntentId: string;
  journeyId: string;
  journeyPlanVersion: number;
  phaseId: string;
  milestoneId?: string;
  objectiveRefs: string[];
  prerequisiteRefs: string[];
  evidenceRequirementRefs: string[];
  adaptationEnvelopeRef: string;
  expectedOutcomeRefs: string[];
  expiresAt?: string;
}
```

The Session Runtime owns session-local execution. The Journey Runtime owns why the session exists within the larger path.

## 14. Interruption and Return

Interruptions include:

- learner stops voluntarily
- device or network loss
- session runtime failure
- prerequisite discovery
- safety or policy hold
- intervention escalation
- schedule gap
- objective invalidation
- external human decision

Every interruption must resolve into one of:

```text
RESUME_SAME_INTENT
REPLAN_CURRENT_PHASE
REPLAN_JOURNEY
ESCALATE_INTERVENTION
WAIT_FOR_EXTERNAL_INPUT
CANCEL_JOURNEY
```

## 15. Blocking Model

```ts
interface JourneyBlocker {
  blockerId: string;
  journeyId: string;
  type:
    | 'PREREQUISITE'
    | 'EVIDENCE_GAP'
    | 'POLICY'
    | 'SAFETY'
    | 'SCHEDULING'
    | 'DEPENDENCY_RUNTIME'
    | 'HUMAN_INPUT'
    | 'TECHNICAL';
  severity: 'NON_BLOCKING' | 'BLOCKING' | 'CRITICAL';
  ownerRuntime?: string;
  ownerActorId?: string;
  openedAt: string;
  resolutionPolicyRef: string;
  resolvedAt?: string;
}
```

A blocked journey must remain explainable and recoverable.

## 16. Completion Contract

Journey completion requires an explicit contract.

```ts
interface JourneyCompletionContract {
  journeyId: string;
  requiredPhaseIds: string[];
  requiredMilestoneIds: string[];
  requiredEvidenceRequirementRefs: string[];
  unresolvedBlockersAllowed: string[];
  masteryHandoffRequired: boolean;
  missionHandoffRequired: boolean;
  verificationPolicyRef: string;
}
```

Completion means the journey fulfilled its authorized execution contract. It does not by itself certify educational mastery.

## 17. Command Surface

Canonical commands:

```text
CreateJourney
AcceptJourneyPlan
MarkJourneyReady
ActivateJourney
PauseJourney
ResumeJourney
BlockJourney
ResolveJourneyBlocker
IssueSessionIntent
RecordSessionOutcome
AdvanceJourneyPhase
SatisfyJourneyMilestone
RequestJourneyReplan
AcceptJourneyReplan
RequestIntervention
EnterCompletionPending
CompleteJourney
CancelJourney
ArchiveJourney
```

Every command must be idempotent and version-aware.

## 18. Event Surface

Canonical events:

```text
JourneyCreated
JourneyPlanAccepted
JourneyMarkedReady
JourneyActivated
JourneyPaused
JourneyResumed
JourneyBlocked
JourneyBlockerResolved
JourneySessionIntentIssued
JourneySessionOutcomeRecorded
JourneyMilestoneSatisfied
JourneyPhaseAdvanced
JourneyReplanRequested
JourneyReplanAccepted
JourneyInterventionRequested
JourneyCompletionPendingEntered
JourneyCompleted
JourneyCancelled
JourneyArchived
```

## 19. Cross-Runtime Contracts

### Mission Runtime

Receives journey status and completion handoff. The Journey Runtime may not close or rewrite a mission without mission authority.

### Diagnostic Runtime

Provides diagnostic hypotheses and prerequisite findings. The Journey Runtime may reference them but may not mutate diagnostic truth.

### Intervention Runtime

Owns intervention lifecycle. The Journey Runtime may request or consume intervention outcomes.

### Learning Session Runtime

Consumes session intents and returns bounded outcomes, evidence references, and recovery information.

### Progress Engine

Consumes authorized journey progress projections. It does not receive permission to infer mastery from journey completion alone.

### Mastery Runtime

Receives evidence and journey completion context for independent mastery determination.

## 20. Safety and Learner Protection

The runtime must protect against:

- endless loops without progress
- excessive remediation without escalation
- hidden objective changes
- inappropriate difficulty acceleration
- punitive response to accessibility needs
- loss of learner progress after interruption
- forced continuation when safety policies require stopping
- exposure of sensitive learner data to unauthorized roles

## 21. Observability

Required observability fields:

```text
journeyId
learnerId
tenantId
planVersion
aggregateVersion
status
activePhaseId
activeMilestoneId
activeSessionId
correlationId
causationId
commandId
actorId
runtimeVersion
policyVersion
```

Operational metrics should include:

- activation latency
- journey age
- pause duration
- blocker age
- session-intent success rate
- replan frequency
- intervention rate
- completion-pending duration
- replay failures
- projection lag

## 22. Failure Codes

Canonical failure codes:

```text
JOURNEY_NOT_FOUND
JOURNEY_IDENTITY_MISMATCH
JOURNEY_VERSION_CONFLICT
JOURNEY_INVALID_TRANSITION
JOURNEY_PLAN_REQUIRED
JOURNEY_NOT_READY
JOURNEY_ALREADY_ACTIVE
JOURNEY_BLOCKED
JOURNEY_TERMINAL
JOURNEY_SESSION_INTENT_CONFLICT
JOURNEY_PREREQUISITE_UNRESOLVED
JOURNEY_COMPLETION_CONTRACT_NOT_MET
JOURNEY_POLICY_REFUSED
JOURNEY_RUNTIME_DEPENDENCY_UNAVAILABLE
```

## 23. Foundational Invariants

1. One journey has one stable identity.
2. Every accepted plan is versioned and preserved.
3. A session cannot redefine the journey objective.
4. A journey cannot redefine curriculum, diagnostic, mastery, or mission truth.
5. Journey completion is not mastery certification.
6. All transitions are explicit, authorized, and replayable.
7. Recovery starts from persisted authority.
8. Projection is not authority.
9. Human roles and system roles require explicit command permissions.
10. Learner safety overrides optimization.

## 24. Definition of Done

36A is complete when the architecture establishes:

- runtime purpose and ownership
- aggregate identity
- lifecycle
- plan lineage
- phase and milestone structure
- multi-session continuity
- session handoff boundaries
- interruption and blocker semantics
- completion contract
- command and event surfaces
- cross-runtime authority boundaries
- safety, observability, and failure semantics

This foundation is the authority base for 36B Journey Planning Runtime and 36C Journey Orchestration Runtime.
