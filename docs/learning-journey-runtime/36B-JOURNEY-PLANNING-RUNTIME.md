# 36B — Journey Planning Runtime

## 1. Purpose

The Journey Planning Runtime transforms an authorized learning objective into a durable, explainable, versioned multi-session plan.

It coordinates long-horizon structure without taking authority away from Curriculum, Skill Graph, Diagnostic, Recommendation, Intervention, Assessment, Mission, or Mastery runtimes.

## 2. Planning Boundary

```text
Objective authorization
    ↓
Context assembly
    ↓
Prerequisite resolution
    ↓
Phase and milestone synthesis
    ↓
Evidence requirement planning
    ↓
Session intent planning
    ↓
Risk and intervention planning
    ↓
Plan validation
    ↓
Plan acceptance
```

Planning proposes a route. Acceptance makes that route authoritative for the journey.

## 3. Core Distinctions

```text
Recommendation ≠ Plan
Plan ≠ Execution
Sequence ≠ Mastery order
Prerequisite hypothesis ≠ Proven gap
Planned evidence ≠ Collected evidence
Estimated duration ≠ Learner obligation
Optimization ≠ Authorization
```

## 4. Planning Inputs

```ts
interface JourneyPlanningInput {
  tenantId: string;
  learnerId: string;
  journeyId: string;
  objectiveRef: JourneyObjectiveRef;
  missionContextRef?: string;
  curriculumContextRef: string;
  skillGraphVersion: string;
  diagnosticRefs: string[];
  recommendationRefs: string[];
  progressSnapshotRef?: string;
  interventionRefs: string[];
  learnerPreferenceRefs: string[];
  accessibilityProfileRef?: string;
  policyVersion: string;
  requestedAt: string;
}
```

Missing authoritative context must be represented explicitly. The planner must not invent certainty.

## 5. Planning Context Snapshot

The planner freezes a reproducible context snapshot.

```ts
interface JourneyPlanningContextSnapshot {
  snapshotId: string;
  journeyId: string;
  objectiveRef: JourneyObjectiveRef;
  curriculumVersion: string;
  skillGraphVersion: string;
  diagnosticVersions: Record<string, string>;
  recommendationVersions: Record<string, string>;
  interventionVersions: Record<string, string>;
  progressCursor?: string;
  policyVersion: string;
  capturedAt: string;
}
```

A later change in source runtimes does not silently mutate an accepted plan.

## 6. Prerequisite Resolution

The planner produces explicit prerequisite claims.

```ts
interface JourneyPrerequisiteClaim {
  claimId: string;
  skillRef: string;
  source:
    | 'CURRICULUM'
    | 'SKILL_GRAPH'
    | 'DIAGNOSTIC'
    | 'ASSESSMENT'
    | 'INTERVENTION'
    | 'HUMAN';
  status:
    | 'CONFIRMED_READY'
    | 'LIKELY_READY'
    | 'UNKNOWN'
    | 'LIKELY_GAP'
    | 'CONFIRMED_GAP';
  confidence?: number;
  evidenceRefs: string[];
  resolutionPolicy:
    | 'PROCEED'
    | 'VERIFY_IN_SESSION'
    | 'INSERT_FOUNDATION_PHASE'
    | 'REQUEST_DIAGNOSTIC'
    | 'REQUEST_HUMAN_REVIEW';
}
```

Unknown is a valid state. Unknown must not be converted into failure without evidence.

## 7. Planning Strategies

Supported strategies:

```text
FOUNDATION_FIRST
TARGET_FIRST_WITH_BACKFILL
SPIRAL_REVISIT
EXAM_DEADLINE_BACKWARD_PLAN
REMEDIATION_FOCUSED
EXPLORATION_BRANCHING
TEACHER_CURATED
HYBRID_AUTHORIZED
```

The selected strategy must be stored with rationale and policy version.

## 8. Phase Synthesis

```ts
interface JourneyPhasePlan {
  phaseId: string;
  sequence: number;
  purpose:
    | 'ORIENTATION'
    | 'FOUNDATION'
    | 'CORE_LEARNING'
    | 'PRACTICE'
    | 'TRANSFER'
    | 'REVIEW'
    | 'ASSESSMENT_PREP'
    | 'REMEDIATION'
    | 'EXPLORATION';
  objectiveRefs: string[];
  prerequisiteClaimRefs: string[];
  milestonePlans: JourneyMilestonePlan[];
  entryCriteria: JourneyCriterion[];
  exitCriteria: JourneyCriterion[];
  adaptationEnvelopeRef: string;
  riskRefs: string[];
}
```

Phase boundaries exist to preserve meaning and recovery, not merely to group content.

## 9. Milestone Planning

```ts
interface JourneyMilestonePlan {
  milestoneId: string;
  sequence: number;
  targetRefs: string[];
  intendedLearningMeaning: string;
  sessionIntentPlans: JourneySessionIntentPlan[];
  evidenceRequirementPlans: JourneyEvidenceRequirementPlan[];
  completionRuleRef: string;
  retryPolicyRef: string;
  interventionTriggerRefs: string[];
}
```

Milestones should be small enough to verify and large enough to represent meaningful progress.

## 10. Session Intent Planning

```ts
interface JourneySessionIntentPlan {
  sessionIntentTemplateId: string;
  phaseId: string;
  milestoneId?: string;
  objectiveRefs: string[];
  activityClassRefs: string[];
  prerequisiteVerificationRefs: string[];
  evidenceRequirementRefs: string[];
  expectedDurationBand?: {
    minMinutes: number;
    targetMinutes: number;
    maxMinutes: number;
  };
  schedulingConstraints?: string[];
  adaptationEnvelopeRef: string;
  completionRuleRef: string;
}
```

Duration bands are planning aids, not pressure contracts against the learner.

## 11. Evidence Requirement Planning

```ts
interface JourneyEvidenceRequirementPlan {
  requirementId: string;
  claimType:
    | 'EXPOSURE'
    | 'ATTEMPT'
    | 'ACCURACY'
    | 'STRATEGY_USE'
    | 'EXPLANATION'
    | 'TRANSFER'
    | 'RETENTION'
    | 'FLUENCY'
    | 'HUMAN_OBSERVATION';
  targetRef: string;
  minimumQualifiedEvidence: number;
  sourceDiversityRule?: string;
  recencyRule?: string;
  reliabilityThreshold?: number;
  requiredBeforeMilestoneSatisfaction: boolean;
}
```

The Journey Runtime plans requirements but does not forge evidence or infer mastery beyond authorized contracts.

## 12. Sequencing Policy

Sequencing considers:

- prerequisite dependencies
- cognitive load
- retrieval spacing
- interleaving opportunities
- learner fatigue
- confidence recovery
- deadline constraints
- accessibility needs
- teacher or parent availability
- intervention windows
- content availability

A sequence must remain explainable through recorded reasons.

```ts
interface JourneySequenceDecision {
  decisionId: string;
  beforeRef?: string;
  afterRef: string;
  reasonCodes: string[];
  sourceRefs: string[];
  policyVersion: string;
}
```

## 13. Adaptation Envelope Planning

The plan establishes bounded freedoms for runtime adaptation.

```ts
interface JourneyAdaptationEnvelopePlan {
  envelopeId: string;
  allowedChanges: Array<
    | 'PACE'
    | 'SESSION_FREQUENCY'
    | 'SESSION_ORDER_WITHIN_PHASE'
    | 'OPTIONAL_PRACTICE_VOLUME'
    | 'HINT_SUPPORT'
    | 'REPRESENTATION_MODE'
    | 'FOUNDATION_INSERTION'
    | 'REVIEW_INSERTION'
  >;
  prohibitedChanges: Array<
    | 'PRIMARY_OBJECTIVE'
    | 'MASTERY_STANDARD'
    | 'CURRICULUM_AUTHORITY'
    | 'SAFETY_POLICY'
    | 'CERTIFICATION_POLICY'
  >;
  replanTriggers: string[];
  humanApprovalTriggers: string[];
}
```

## 14. Risk Planning

```ts
interface JourneyPlanRisk {
  riskId: string;
  type:
    | 'PREREQUISITE_UNCERTAINTY'
    | 'DEADLINE_PRESSURE'
    | 'LOW_CONFIDENCE'
    | 'REPEATED_REMEDIATION'
    | 'ATTENDANCE_GAP'
    | 'ACCESSIBILITY_MISMATCH'
    | 'CONTENT_GAP'
    | 'DEPENDENCY_RUNTIME';
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigationRefs: string[];
  triggerRefs: string[];
  ownerRuntime?: string;
}
```

High-impact risks require explicit mitigation or plan refusal.

## 15. Intervention Planning

The plan may include intervention trigger policies:

```text
Repeated unsuccessful attempts
Evidence conflict persists
Prerequisite gap confirmed
Learner distress signal
Extended inactivity
Session abandonment pattern
Accessibility barrier
Deadline becomes infeasible
Human concern submitted
```

The Journey Runtime requests an intervention. The Intervention Runtime owns intervention execution and resolution.

## 16. Scheduling Model

The planner may propose a schedule while preserving learner and human authority.

```ts
interface JourneySchedulePlan {
  timezone: string;
  preferredDays?: string[];
  preferredTimeBands?: string[];
  sessionFrequencyBand?: {
    minPerWeek: number;
    targetPerWeek: number;
    maxPerWeek: number;
  };
  blackoutPeriods?: Array<{ start: string; end: string }>;
  deadline?: string;
  schedulingPolicyRef: string;
}
```

A proposed schedule must degrade gracefully when life interrupts learning.

## 17. Deadline Feasibility

For exam or mission deadlines, the planner records feasibility:

```ts
interface JourneyDeadlineFeasibility {
  deadline: string;
  status: 'FEASIBLE' | 'TIGHT' | 'UNLIKELY' | 'UNKNOWN';
  assumptions: string[];
  riskRefs: string[];
  minimumRequiredConditions: string[];
  evaluatedAt: string;
}
```

The runtime must not promise outcomes from schedule compliance alone.

## 18. Alternative Plans

The planner may produce bounded alternatives:

```text
PRIMARY_PLAN
LOWER_LOAD_PLAN
DEADLINE_PRIORITY_PLAN
FOUNDATION_PRIORITY_PLAN
ACCESSIBILITY_PRIORITY_PLAN
HUMAN_CURATED_PLAN
```

Only one accepted plan version is authoritative at a time.

## 19. Plan Validation

Validation domains:

- identity and tenant consistency
- objective authorization
- curriculum reference validity
- skill graph reference validity
- phase reachability
- milestone completeness
- prerequisite handling
- evidence requirement completeness
- adaptation boundary safety
- schedule feasibility
- risk mitigation
- cross-runtime contract compatibility
- privacy and accessibility compliance

## 20. Plan Acceptance

```ts
interface AcceptJourneyPlanCommand {
  tenantId: string;
  learnerId: string;
  journeyId: string;
  commandId: string;
  expectedJourneyVersion: number;
  proposedPlanId: string;
  proposedPlanVersion: number;
  actorId: string;
  actorAuthorityRef: string;
  acceptedAt: string;
}
```

Acceptance creates authoritative lineage and invalidates no historical plan.

## 21. Replanning

Replanning can be triggered by:

- confirmed prerequisite gap
- objective amendment by source authority
- intervention outcome
- deadline change
- repeated session failure
- learner preference change
- accessibility profile change
- curriculum or policy migration
- prolonged pause
- phase completion reveals new evidence

```text
Observe change
    ↓
Classify within adaptation envelope?
    ├─ Yes → runtime adaptation
    └─ No  → request replan
                 ↓
          build proposed plan
                 ↓
          validate and compare
                 ↓
          authorized acceptance
```

## 22. Plan Comparison

A replan proposal must explain changes:

```ts
interface JourneyPlanDiff {
  fromPlanVersion: number;
  toPlanVersion: number;
  addedPhaseIds: string[];
  removedPhaseIds: string[];
  reorderedRefs: string[];
  changedEvidenceRequirementRefs: string[];
  changedRiskRefs: string[];
  changedScheduleRefs: string[];
  unchangedProtectedBoundaries: string[];
  reasonCodes: string[];
}
```

## 23. Planner Determinism

Given the same:

- objective
- context snapshot
- policies
- planner version
- seed where stochastic ranking is allowed

The planner must produce reproducible output or record why nondeterminism is permitted.

## 24. Planner Versioning

```ts
interface JourneyPlannerVersion {
  plannerVersion: string;
  policyVersion: string;
  curriculumCompatibility: string[];
  skillGraphCompatibility: string[];
  evidenceSchemaCompatibility: string[];
  releasedAt: string;
}
```

Accepted plans remain pinned to their planner lineage until adaptation or replan authority changes them.

## 25. Planning Commands

```text
RequestJourneyPlan
GenerateJourneyPlanProposal
ValidateJourneyPlanProposal
RejectJourneyPlanProposal
AcceptJourneyPlan
RequestJourneyReplan
GenerateJourneyReplanProposal
CompareJourneyPlans
AcceptJourneyReplan
```

## 26. Planning Events

```text
JourneyPlanRequested
JourneyPlanningContextCaptured
JourneyPlanProposed
JourneyPlanValidationFailed
JourneyPlanRejected
JourneyPlanAccepted
JourneyReplanRequested
JourneyReplanProposed
JourneyPlanCompared
JourneyReplanAccepted
```

## 27. Failure Codes

```text
JOURNEY_PLANNING_OBJECTIVE_UNAUTHORIZED
JOURNEY_PLANNING_CONTEXT_INCOMPLETE
JOURNEY_PLANNING_PREREQUISITE_UNRESOLVED
JOURNEY_PLANNING_PHASE_UNREACHABLE
JOURNEY_PLANNING_EVIDENCE_REQUIREMENT_INVALID
JOURNEY_PLANNING_ADAPTATION_ENVELOPE_UNSAFE
JOURNEY_PLANNING_DEADLINE_INFEASIBLE
JOURNEY_PLANNING_RISK_UNMITIGATED
JOURNEY_PLANNING_VERSION_CONFLICT
JOURNEY_PLANNING_POLICY_INCOMPATIBLE
JOURNEY_PLANNING_DEPENDENCY_UNAVAILABLE
```

## 28. Planning Invariants

1. Every plan is bound to one journey and one objective lineage.
2. An accepted plan is immutable; changes create a new version.
3. Unknown prerequisite status remains explicit.
4. Planning evidence requirements does not create evidence.
5. Scheduling does not guarantee outcomes.
6. Adaptation boundaries are planned before runtime adaptation occurs.
7. Protected objective and mastery boundaries cannot be silently changed.
8. Replanning is explicit, versioned, explainable, and authorized.
9. Planner output is reproducible from preserved inputs and versions.
10. Learner safety and accessibility override optimization goals.

## 29. Definition of Done

36B is complete when the architecture establishes:

- planning input and context snapshot contracts
- prerequisite claim resolution
- planning strategies
- phase, milestone, and session-intent synthesis
- evidence requirement planning
- sequencing and scheduling policies
- adaptation envelope planning
- risk and intervention planning
- deadline feasibility
- plan validation, acceptance, comparison, and replan semantics
- planner determinism and versioning
- commands, events, failures, and invariants
