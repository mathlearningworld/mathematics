# 34B — Intervention Planning Runtime

## 1. Purpose

The Intervention Planning Runtime converts an authorized learner-support intent into an executable, bounded, versioned plan.

Its job is not to invent support from vague intuition. It must resolve targets, compare strategies, bind execution channels, define dosage, preserve uncertainty, establish evidence requirements, and reject plans that cannot be governed safely.

---

## 2. Planning Inputs

A planning request may include:

- learner and tenant identity,
- diagnostic case reference,
- active diagnostic hypotheses and alternatives,
- understanding debt signals,
- recommendation candidates,
- skill graph and prerequisite context,
- curriculum context,
- progress and recent learning history,
- accessibility and language context,
- scheduling and operational constraints,
- human preferences or restrictions,
- available content, mission, gameplay, teacher, parent, or tutor channels.

Every input must carry its source and relevant version.

---

## 3. Planning Pipeline

```text
Validate authority
      │
      ▼
Resolve target and rationale
      │
      ▼
Resolve constraints and safeguards
      │
      ▼
Load eligible strategies
      │
      ▼
Generate plan candidates
      │
      ▼
Evaluate fit, risk, cost, and evidence value
      │
      ▼
Compare alternatives
      │
      ▼
Select or defer
      │
      ▼
Bind dosage, schedule, channels, and versions
      │
      ▼
Emit draft intervention plan
```

A planning result may be `PLAN_READY`, `HUMAN_REVIEW_REQUIRED`, `MORE_EVIDENCE_REQUIRED`, `NO_SAFE_PLAN`, or `INCONCLUSIVE`.

---

## 4. Plan Aggregate

```ts
interface InterventionPlan {
  planId: string
  interventionId: string
  tenantId: string
  learnerId: string
  rationale: InterventionRationale
  targets: PlannedTarget[]
  strategy: PlannedStrategy
  phases: InterventionPhase[]
  evidencePlan: InterventionEvidencePlan
  adaptationPlan: InterventionAdaptationPlan
  safetyPlan: InterventionSafetyPlan
  executionBindings: ExecutionBinding[]
  status: InterventionPlanStatus
  versionPins: InterventionVersionPins
  createdAt: string
  expiresAt?: string
}
```

---

## 5. Rationale Model

```ts
interface InterventionRationale {
  diagnosticCaseId?: string
  primaryHypothesisId?: string
  alternativeHypothesisIds: string[]
  understandingDebtIds: string[]
  recommendationId?: string
  confidenceBand: 'LOW' | 'MODERATE' | 'HIGH' | 'UNKNOWN'
  uncertaintyNotes: string[]
  expectedMechanism: string
  rejectedAlternatives: RejectedPlanAlternative[]
}
```

The expected mechanism explains why this intervention might help. It is not a statement of proven causation.

---

## 6. Target Resolution

Target selection must distinguish:

```text
Immediate target
Foundational target
Supporting target
Observation-only target
Do-not-target constraint
```

Planning rules:

1. A visible error is not automatically the primary target.
2. A prerequisite may be selected only when learner-specific evidence supports relevance.
3. Broad skill clusters must be decomposed before high-dose execution.
4. Contextual barriers may require support without redefining the mathematical target.
5. Targets must remain traceable to evidence or explicit human authority.

---

## 7. Strategy Registry

```ts
interface InterventionStrategyDefinition {
  strategyId: string
  version: string
  interventionClass: string
  supportedTargetTypes: string[]
  contraindications: string[]
  requiredCapabilities: string[]
  supportedChannels: string[]
  defaultDosagePolicy: string
  evidenceRequirements: string[]
  adaptationOptions: string[]
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH'
  humanReviewPolicy?: string
}
```

A strategy may not be selected when its required capability, content, language, accessibility, or supervision condition is unavailable.

---

## 8. Candidate Evaluation

Each plan candidate should be evaluated across independent dimensions:

```text
Target fit
Mechanism plausibility
Diagnostic confidence alignment
Learner context fit
Accessibility fit
Language fit
Prior response history
Operational availability
Time and dosage feasibility
Evidence generation value
Psychological safety
Human review burden
Cost and resource demand
Reversibility
```

A composite score may support comparison, but no single score may hide a policy block or safety failure.

---

## 9. Plan Candidate Model

```ts
interface InterventionPlanCandidate {
  candidateId: string
  strategyRef: string
  targetRefs: string[]
  fitAssessment: CandidateFitAssessment
  proposedPhases: InterventionPhase[]
  proposedBindings: ExecutionBinding[]
  expectedEvidence: string[]
  risks: CandidateRisk[]
  policyBlocks: string[]
  reviewRequirement: 'NONE' | 'TEACHER' | 'PARENT' | 'SPECIALIST' | 'ADMIN'
  disposition:
    | 'ELIGIBLE'
    | 'PREFERRED'
    | 'ALTERNATIVE'
    | 'BLOCKED'
    | 'INSUFFICIENT_EVIDENCE'
}
```

---

## 10. Phased Planning

An intervention may be planned as phases:

```text
BASELINE_CONFIRMATION
ORIENTATION
MODELING
GUIDED_PRACTICE
INDEPENDENT_PRACTICE
TRANSFER_CHECK
DELAYED_RETENTION_CHECK
REFLECTION
ESCALATION_REVIEW
```

```ts
interface InterventionPhase {
  phaseId: string
  phaseType: string
  objective: string
  entryCriteria: string[]
  activities: PlannedActivity[]
  exitCriteria: string[]
  evidenceRequirements: string[]
  maximumAttempts?: number
  maximumDuration?: string
}
```

Phase completion must depend on declared exit criteria, not merely elapsed time.

---

## 11. Dosage Planning

Dosage contains:

- number of sessions,
- target duration,
- spacing,
- intensity,
- maximum consecutive attempts,
- rest or cool-down rules,
- retry rules,
- maximum intervention window.

Rules:

1. More dosage is not automatically better.
2. Increased intensity requires evidence and policy authority.
3. Repeated non-response must trigger review before escalation.
4. The plan must protect against endless remediation loops.
5. Dosage changes after activation are adaptations and require history-preserving transitions.

---

## 12. Execution Binding

```ts
interface ExecutionBinding {
  bindingId: string
  channel:
    | 'LEARNING_ENGINE'
    | 'MISSION_ENGINE'
    | 'GAMEPLAY_RUNTIME'
    | 'ASSESSMENT_RUNTIME'
    | 'TEACHER_LED'
    | 'PARENT_SUPPORTED'
    | 'HUMAN_TUTOR'
  capabilityId: string
  capabilityVersion: string
  contentRefs: string[]
  responsibleActor?: string
  schedulePolicy?: string
  fallbackBindingId?: string
}
```

A fallback binding must be explicit and semantically compatible. Silent substitution is prohibited.

---

## 13. Evidence Planning

The plan must define evidence before execution begins.

```ts
interface InterventionEvidencePlan {
  baselineEvidence: PlannedEvidenceRequest[]
  executionEvidence: PlannedEvidenceRequest[]
  immediateOutcomeEvidence: PlannedEvidenceRequest[]
  transferEvidence: PlannedEvidenceRequest[]
  delayedEvidence: PlannedEvidenceRequest[]
  humanObservationEvidence: PlannedEvidenceRequest[]
  minimumDecisionThresholds: EvidenceDecisionThreshold[]
}
```

Evidence plans should distinguish between confirming execution, measuring performance, evaluating understanding, and evaluating transfer or retention.

---

## 14. Adaptation Planning

```ts
interface InterventionAdaptationPlan {
  adaptationTriggers: AdaptationTrigger[]
  permittedAdjustments: string[]
  prohibitedAdjustments: string[]
  maximumAutomaticAdaptations: number
  humanReviewAfter?: number
  rollbackPolicy: string
}
```

Possible triggers:

- repeated identical misconception,
- rapid success,
- excessive hints,
- disengagement,
- frustration signal,
- accessibility mismatch,
- transfer failure,
- unexpected strength,
- contradictory evidence,
- schedule disruption.

Automatic adaptation must stay within pre-authorized bounds.

---

## 15. Safety Planning

```ts
interface InterventionSafetyPlan {
  prohibitedLanguage: string[]
  pressureLimits: string[]
  frustrationThresholds?: string[]
  mandatoryPauseConditions: string[]
  humanEscalationConditions: string[]
  privacyConstraints: string[]
  accessibilityRequirements: string[]
}
```

Safety constraints are blocking requirements, not optional scoring factors.

---

## 16. Planning Commands

```text
RequestInterventionPlan
GenerateInterventionPlanCandidates
SelectInterventionPlanCandidate
ReviseInterventionPlan
SubmitInterventionPlanForReview
ApproveInterventionPlan
RejectInterventionPlan
ExpireInterventionPlan
```

Commands must enforce expected plan version and actor authority.

---

## 17. Planning Events

```text
InterventionPlanningRequested
InterventionPlanCandidatesGenerated
InterventionPlanCandidateSelected
InterventionPlanRevised
InterventionPlanSubmittedForReview
InterventionPlanApproved
InterventionPlanRejected
InterventionPlanExpired
InterventionPlanningDeferred
```

Candidate comparison and rejected alternatives must remain auditable.

---

## 18. Planning Status

```text
REQUESTED
GENERATING
CANDIDATES_READY
DRAFT_READY
PENDING_REVIEW
APPROVED
REJECTED
DEFERRED
EXPIRED
CANCELLED
INCONCLUSIVE
```

No execution authority exists before `APPROVED` and subsequent intervention authorization.

---

## 19. Policy Gates

A plan must be blocked or escalated when:

- the diagnostic rationale is stale beyond policy limits,
- required versions are unavailable,
- the target cannot be resolved safely,
- required accessibility support is unavailable,
- the strategy has a contraindication,
- the evidence plan cannot evaluate the objective,
- the requested dosage exceeds allowed bounds,
- a high-impact strategy lacks human review,
- the execution channel cannot guarantee required evidence or safeguards.

---

## 20. Determinism and Idempotency

Given the same:

- planning request,
- strategy registry version,
- policy versions,
- curriculum and skill graph versions,
- learner context snapshot,
- availability snapshot,

candidate generation must be reproducible or explicitly declare nondeterministic inputs.

Repeated commands with the same idempotency key must not create duplicate plans.

---

## 21. Failure Codes

```text
INTERVENTION_PLANNING_INPUT_INVALID
INTERVENTION_TARGET_UNRESOLVED
INTERVENTION_DIAGNOSTIC_STALE
INTERVENTION_STRATEGY_NOT_ELIGIBLE
INTERVENTION_NO_SAFE_CANDIDATE
INTERVENTION_EXECUTION_CHANNEL_UNAVAILABLE
INTERVENTION_EVIDENCE_PLAN_INADEQUATE
INTERVENTION_DOSAGE_POLICY_BLOCKED
INTERVENTION_ACCESSIBILITY_REQUIREMENT_UNMET
INTERVENTION_REVIEW_REQUIRED
INTERVENTION_PLAN_VERSION_CONFLICT
INTERVENTION_PLAN_EXPIRED
INTERVENTION_POLICY_VERSION_UNAVAILABLE
```

---

## 22. Planning Invariants

1. Every plan has a traceable rationale.
2. Every selected strategy has an explicit expected mechanism.
3. Rejected alternatives remain auditable.
4. Safety and policy blocks cannot be overridden by ranking scores.
5. Every plan defines evidence before execution.
6. Every plan defines stop, pause, and adaptation bounds.
7. Automatic adaptation authority is bounded in advance.
8. Every execution binding is versioned.
9. Plan approval does not itself prove diagnostic correctness.
10. No safe plan is preferable to an unsafe or misleading plan.

---

## 23. Completion Condition

34B is complete when the system can reproducibly transform authorized diagnostic and recommendation context into a reviewable intervention plan with explicit targets, candidate comparison, strategy versions, phases, dosage, execution bindings, evidence requirements, adaptation bounds, safety constraints, and policy gates.
