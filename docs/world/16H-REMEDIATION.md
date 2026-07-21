# 16H — Remediation

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16H — Remediation  
**Document Type:** Child Architecture / Production Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16B-LEARNER-READINESS-AND-COGNITIVE-DIAGNOSIS.md`, `docs/world/16C-COGNITIVE-MISSION-PLANNING-AND-GENERATION.md`, `docs/world/16D-WORLD-ACTIVITY-BINDING.md`, `docs/world/16E-MATHEMATICAL-EVIDENCE-AND-ASSESSMENT.md`, `docs/world/16F-HINT-AND-MENTOR-SUPPORT.md`, `docs/world/16G-MASTERY-AND-PROGRESSION.md`  
**Downstream Consumers:** 16I Parent/Teacher Projection, 16J Analytics & Governance, diagnosis runtime, mission runtime, remediation runtime, progression runtime, mentor runtime

---

## 1. Purpose

This guide defines how Math Learning World responds when a learner's current understanding is insufficient, unstable, overly assisted, context-bound, or blocked by an earlier dependency.

The central doctrine is:

> Remediation must rebuild the missing structure of understanding, not merely repeat the failed task.

A conforming remediation system must answer:

> What underlying obstacle produced the failure, what learning structure must be rebuilt, what new experience is most likely to produce that change, and what evidence is required before the learner safely returns to normal progression?

Remediation is therefore not punishment, repetition, delay, or a lower-status track. It is a targeted reconstruction pathway.

---

## 2. Architectural Position

```text
Assessment and Mastery Signals
        ↓
Remediation Trigger Evaluation
        ↓
Root-Cause Hypothesis Resolution
        ↓
Remediation Target Selection
        ↓
Strategy and Representation Selection
        ↓
Remediation Mission Plan
        ↓
World Activity Binding
        ↓
Supported Learning Experience
        ↓
Fresh Mathematical Evidence
        ↓
Reassessment
        ↓
Remediation Exit or Adaptation
        ↓
Updated Learner Path
```

Phase 16H is the authority for remediation entry, remediation planning, adaptive reconstruction, remediation lifecycle, and safe exit back into the normal learning path.

It does not own curriculum definitions, learning-target truth, diagnosis truth, evidence interpretation, mastery declaration, parent-facing language, or governance policy.

---

## 3. Authority Boundary

### 3.1 Phase 16H owns

- remediation trigger contracts;
- remediation eligibility;
- root-cause hypothesis resolution;
- remediation target selection;
- dependency-gap repair planning;
- misconception-focused reconstruction;
- representation switching;
- scaffold sequencing;
- remediation mission constraints;
- adaptation during remediation;
- retry and variation policy;
- remediation completion criteria;
- remediation exit criteria;
- re-entry requests into the mastery pipeline;
- remediation provenance and audit;
- remediation failure handling;
- remediation safety and dignity rules.

### 3.2 Phase 16H does not own

- redefining curriculum requirements;
- inventing evidence;
- rewriting diagnosis without evidence;
- declaring mastery;
- lowering mastery standards to force progression;
- ranking learners against peers;
- exposing stigmatizing labels;
- repeating the same failed experience indefinitely;
- treating time spent as proof of recovery;
- charging the learner merely because remediation was triggered.

---

## 4. Core Principles

### 4.1 Repair cause, not symptom

A wrong answer is an observable symptom. The remediation system must seek the smallest defensible explanation for why the learner produced it.

Possible causes include:

- missing prerequisite;
- unstable concept image;
- procedural imitation without meaning;
- representation mismatch;
- language or reading load;
- working-memory overload;
- overdependence on hints;
- transfer failure;
- attention interruption;
- accidental error;
- world-control or interface difficulty.

### 4.2 New experience before repeated experience

The system should not default to presenting the same task again. It should first consider a different representation, scale, context, interaction, decomposition, or sequence.

### 4.3 Preserve the mastery standard

Remediation may change the route, pacing, representation, and support. It must not silently weaken the target being mastered.

### 4.4 Preserve learner dignity

Remediation must be presented as a normal learning path, never as public failure, punishment, or removal from the world.

### 4.5 Fresh evidence is mandatory

A remediation plan is not complete because the learner finished the remediation activity. Completion requires fresh evidence relevant to the repaired structure.

---

## 5. Remediation Trigger Model

```ts
export type RemediationTriggerCode =
  | 'PREREQUISITE_GAP'
  | 'REPEATED_MISCONCEPTION'
  | 'ASSISTANCE_DEPENDENCE'
  | 'INSUFFICIENT_INDEPENDENT_EVIDENCE'
  | 'TRANSFER_FAILURE'
  | 'MASTERY_REGRESSION'
  | 'REVIEW_FAILURE'
  | 'PROGRESSION_HOLD'
  | 'REPRESENTATION_LOCK'
  | 'STRATEGY_RIGIDITY'
  | 'COGNITIVE_OVERLOAD'
  | 'MANUAL_REFERRAL';
```

A trigger is a request for remediation evaluation, not proof that remediation is required.

```ts
export interface RemediationTrigger {
  triggerId: string;
  learnerId: string;
  targetId: string;
  code: RemediationTriggerCode;
  sourceAuthority: 'DIAGNOSIS' | 'ASSESSMENT' | 'MASTERY' | 'MENTOR' | 'TEACHER' | 'PARENT' | 'SYSTEM';
  sourceReferenceId: string;
  observedAt: string;
  evidenceReferences: string[];
  urgency: 'LOW' | 'NORMAL' | 'HIGH';
}
```

---

## 6. Remediation Eligibility

A learner becomes eligible when at least one trigger is supported by sufficient evidence and the issue cannot be resolved through ordinary in-mission support alone.

Eligibility must distinguish:

```ts
export type RemediationEligibility =
  | 'NOT_REQUIRED'
  | 'MONITOR'
  | 'SUPPORT_FIRST'
  | 'ELIGIBLE'
  | 'REQUIRED'
  | 'DEFERRED';
```

Typical decisions:

- accidental errors → `MONITOR`;
- temporary obstacle resolvable with a small hint → `SUPPORT_FIRST`;
- stable misconception across contexts → `ELIGIBLE`;
- prerequisite gap blocking progression → `REQUIRED`;
- fatigue, interruption, or unsafe context → `DEFERRED`.

---

## 7. Root-Cause Hypothesis

Remediation planning must operate from explicit hypotheses rather than opaque difficulty scores.

```ts
export interface RemediationHypothesis {
  hypothesisId: string;
  learnerId: string;
  targetId: string;
  causeType:
    | 'MISSING_PREREQUISITE'
    | 'MISCONCEPTION'
    | 'FRAGILE_REPRESENTATION'
    | 'PROCEDURAL_WITHOUT_CONCEPTUAL'
    | 'CONCEPTUAL_WITHOUT_PROCEDURAL'
    | 'TRANSFER_LIMITATION'
    | 'ASSISTANCE_DEPENDENCE'
    | 'LANGUAGE_BARRIER'
    | 'INTERFACE_BARRIER'
    | 'COGNITIVE_LOAD'
    | 'UNKNOWN';
  confidence: number;
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  createdAt: string;
}
```

The runtime may carry multiple competing hypotheses. It must not collapse uncertainty into a false single diagnosis.

---

## 8. Remediation Target Selection

The remediation target is the smallest repairable learning structure that can plausibly unblock the intended target.

```ts
export interface RemediationTarget {
  remediationTargetId: string;
  learnerId: string;
  intendedTargetId: string;
  repairTargetId: string;
  targetKind: 'PREREQUISITE' | 'MISCONCEPTION' | 'REPRESENTATION' | 'STRATEGY' | 'TRANSFER' | 'INDEPENDENCE';
  rationale: string;
  successEvidenceRequirements: string[];
}
```

Rules:

1. Prefer the nearest causal dependency.
2. Avoid broad grade-level rollback.
3. Do not remediate already secure knowledge.
4. Do not assume the latest error identifies the earliest gap.
5. Keep the intended target visible so the learner's journey remains coherent.

---

## 9. Remediation Strategy Catalogue

```ts
export type RemediationStrategy =
  | 'CONCRETE_RECONSTRUCTION'
  | 'REPRESENTATION_SWITCH'
  | 'DECOMPOSE_AND_REBUILD'
  | 'CONTRAST_CASES'
  | 'ERROR_ANALYSIS'
  | 'BOUNDARY_CASES'
  | 'MULTIPLE_STRATEGIES'
  | 'PREREQUISITE_BRIDGE'
  | 'LANGUAGE_LIGHT_REFRAME'
  | 'REDUCED_COGNITIVE_LOAD'
  | 'GUIDED_TO_INDEPENDENT_FADE'
  | 'TRANSFER_LADDER'
  | 'SPACED_REVISIT';
```

### 9.1 Concrete reconstruction

Rebuild meaning through manipulable world objects before returning to symbols.

### 9.2 Representation switch

Move between objects, diagrams, number lines, tables, equations, spatial layouts, or verbal forms.

### 9.3 Decompose and rebuild

Separate a complex transformation into smaller relationships and then recombine them.

### 9.4 Contrast cases

Present carefully selected examples that expose the difference between two ideas the learner is conflating.

### 9.5 Error analysis

Allow the learner to inspect, test, and repair a plausible incorrect construction.

### 9.6 Guided-to-independent fade

Begin with support, then remove it in explicit stages until independent performance is observed.

---

## 10. Representation Policy

A representation is not cosmetic. It is part of the mathematical structure presented to the learner.

```ts
export interface RepresentationPlan {
  primary: string;
  alternatives: string[];
  bridgeSequence: string[];
  symbolIntroductionPoint?: string;
  forbiddenRepresentations?: string[];
}
```

The runtime should avoid returning immediately to a representation already shown to be fragile unless the purpose is explicit comparison or transfer confirmation.

---

## 11. Scaffold Ladder

```ts
export type ScaffoldLevel =
  | 'S0_INDEPENDENT'
  | 'S1_ATTENTION_CUE'
  | 'S2_STRUCTURE_HIGHLIGHT'
  | 'S3_PARTIAL_DECOMPOSITION'
  | 'S4_GUIDED_STEP'
  | 'S5_MODELED_EXAMPLE'
  | 'S6_CO_CONSTRUCTION';
```

A remediation plan must define both escalation and fading.

```ts
export interface ScaffoldPolicy {
  startLevel: ScaffoldLevel;
  maximumLevel: ScaffoldLevel;
  escalationConditions: string[];
  fadingConditions: string[];
  independentConfirmationRequired: boolean;
}
```

Assistance must remain attributable under Phase 16F evidence rules.

---

## 12. Remediation Plan Contract

```ts
export interface RemediationPlan {
  planId: string;
  learnerId: string;
  intendedTargetId: string;
  remediationTargets: RemediationTarget[];
  hypotheses: RemediationHypothesis[];
  strategies: RemediationStrategy[];
  representationPlan: RepresentationPlan;
  scaffoldPolicy: ScaffoldPolicy;
  missionConstraints: {
    maximumActiveMissions: number;
    preferredWorldContext?: string;
    languageLoad: 'MINIMAL' | 'LOW' | 'NORMAL';
    sessionLengthClass: 'MICRO' | 'SHORT' | 'STANDARD';
  };
  successCriteria: string[];
  exitCriteria: string[];
  adaptationRules: string[];
  createdAt: string;
  version: number;
}
```

---

## 13. Mission Generation Boundary

Phase 16H does not directly author playable missions. It produces remediation intent and constraints for Phase 16C.

```text
16H Remediation Plan
        ↓
16C Mission Planning
        ↓
16D World Activity Binding
        ↓
Playable Remediation Experience
```

The generated mission must preserve:

- target identity;
- root-cause rationale;
- required representation;
- scaffold policy;
- evidence requirements;
- independence requirements;
- adaptation limits.

---

## 14. Runtime Adaptation

During remediation, the system may adapt when incoming evidence contradicts the active hypothesis.

```ts
export type RemediationAdaptationAction =
  | 'CONTINUE'
  | 'FADE_SUPPORT'
  | 'ESCALATE_SUPPORT'
  | 'SWITCH_REPRESENTATION'
  | 'CHANGE_STRATEGY'
  | 'REVISE_HYPOTHESIS'
  | 'PAUSE'
  | 'REFER_TO_MENTOR'
  | 'REQUEST_REASSESSMENT';
```

Adaptation rules must be bounded. The runtime must not mutate educational intent unpredictably while the learner is active.

---

## 15. Retry and Variation Policy

Retries must provide informative variation.

A retry may change:

- numerical values;
- object scale;
- world context;
- representation;
- action sequence;
- available tools;
- feedback timing;
- decomposition depth.

A retry must not change the underlying learning target without creating a new plan version.

Repeated identical failure should trigger hypothesis review rather than unlimited repetition.

---

## 16. Remediation Lifecycle

```ts
export type RemediationStatus =
  | 'PROPOSED'
  | 'ELIGIBILITY_CONFIRMED'
  | 'PLANNED'
  | 'ACTIVE'
  | 'ADAPTING'
  | 'EVIDENCE_PENDING'
  | 'REASSESSMENT_PENDING'
  | 'EXIT_ELIGIBLE'
  | 'COMPLETED'
  | 'PAUSED'
  | 'REFERRED'
  | 'CANCELLED';
```

Valid high-level transitions:

```text
PROPOSED
  → ELIGIBILITY_CONFIRMED
  → PLANNED
  → ACTIVE
  → EVIDENCE_PENDING
  → REASSESSMENT_PENDING
  → EXIT_ELIGIBLE
  → COMPLETED
```

Alternative transitions may include `ACTIVE → ADAPTING → ACTIVE`, `ACTIVE → PAUSED`, and `ACTIVE → REFERRED`.

---

## 17. Completion and Exit

Remediation activity completion is not remediation success.

```ts
export interface RemediationExitDecision {
  planId: string;
  decision: 'CONTINUE' | 'ADAPT' | 'EXIT_TO_REVIEW' | 'EXIT_TO_NORMAL_PATH' | 'REFER';
  repairedTargetIds: string[];
  unresolvedTargetIds: string[];
  independentEvidenceIds: string[];
  assistedEvidenceIds: string[];
  confidence: number;
  decidedAt: string;
}
```

Exit to the normal path requires:

1. fresh relevant evidence;
2. sufficient independence;
3. no unresolved blocking prerequisite;
4. success under at least one non-identical context when transfer is part of the target;
5. reassessment through Phase 16E;
6. progression resolution through Phase 16G.

Phase 16H may request reassessment. It may not declare mastery itself.

---

## 18. Re-entry to Mastery Pipeline

```text
Remediation Evidence
        ↓
16E Assessment Interpretation
        ↓
16B Diagnosis Update
        ↓
16G Mastery Evaluation
        ↓
Progression Decision
```

A completed remediation plan may therefore produce:

- restored progression;
- provisional mastery;
- review scheduling;
- continued remediation;
- a revised diagnosis;
- mentor or teacher referral.

---

## 19. Ratio Reasoning Validation Slice

### Scenario

A learner repeatedly solves proportional tasks by adding the same amount to both quantities.

Example observed construction:

```text
2 wood → 6 coins
4 wood → 8 coins
```

The learner preserves additive difference rather than multiplicative relationship.

### Trigger

```text
REPEATED_MISCONCEPTION
```

### Hypothesis

```text
causeType: MISCONCEPTION
rationale: learner interprets paired quantities through additive growth
```

### Repair target

Distinguish multiplicative scaling from additive change.

### Strategy

```text
CONTRAST_CASES
CONCRETE_RECONSTRUCTION
REPRESENTATION_SWITCH
```

### World experience

The learner builds bundles where every crate must contain equal groups. Two constructions are compared:

```text
2 crates × 3 stones = 6 stones
4 crates × 3 stones = 12 stones
```

versus an invalid additive construction:

```text
2 crates = 6 stones
4 crates = 8 stones
```

The world visibly exposes unequal group size in the invalid construction.

### Evidence required

- learner identifies which construction preserves equal groups;
- learner repairs an additive construction;
- learner independently generates a new proportional construction;
- learner succeeds in a second context using a table or diagram;
- no high-magnitude assistance is present in the final confirmation.

### Exit

The learner returns to the intended ratio target only after Phase 16E reassessment and Phase 16G progression resolution.

---

## 20. Mentor and Teacher Referral

Referral is appropriate when:

- hypotheses remain low-confidence after multiple varied experiences;
- the learner shows distress or persistent disengagement;
- language or accessibility barriers dominate;
- repeated strategy changes produce no informative evidence;
- the system suspects a broader prerequisite network gap;
- human judgment is required.

A referral must carry a concise evidence-grounded packet, not a vague label such as "weak at math."

```ts
export interface RemediationReferral {
  learnerId: string;
  planId: string;
  targetIds: string[];
  activeHypotheses: RemediationHypothesis[];
  attemptedStrategies: RemediationStrategy[];
  evidenceSummary: string;
  recommendedHumanObservation: string[];
}
```

---

## 21. Learner Dignity and Safety

The runtime must not:

- display public remediation labels;
- compare remediation count with peers;
- frame support as punishment;
- lock the learner into repetitive low-level content without review;
- use humiliation, urgency, or loss threats;
- reveal sensitive diagnostic details to unauthorized users.

The learner-facing experience should communicate:

- the world is offering another route;
- the target remains achievable;
- prior effort remains meaningful;
- help can decrease as understanding grows.

---

## 22. Persistence Model

Suggested aggregate boundaries:

```text
RemediationCase
  ├── triggers
  ├── hypotheses
  ├── planVersions
  ├── activeMissionReferences
  ├── adaptations
  ├── evidenceReferences
  ├── reassessmentRequests
  ├── exitDecisions
  └── referralEvents
```

Suggested persistence entities:

```text
remediation_cases
remediation_triggers
remediation_hypotheses
remediation_plans
remediation_plan_targets
remediation_plan_strategies
remediation_adaptations
remediation_exit_decisions
remediation_referrals
```

Every state transition must include tenant, learner, actor, correlation, causation, version, and timestamp metadata.

---

## 23. Idempotency and Concurrency

Remediation writes must be idempotent.

Required safeguards:

- trigger deduplication by source reference and code;
- expected-version checks on plan updates;
- one active authoritative plan version per remediation case;
- duplicate evidence references ignored;
- exit decisions immutable after publication;
- concurrent adaptation requests serialized or rejected deterministically.

---

## 24. API-Oriented Contracts

```ts
export interface EvaluateRemediationInput {
  learnerId: string;
  targetId: string;
  triggerIds: string[];
  expectedDiagnosisVersion?: number;
  correlationId: string;
}

export interface CreateRemediationPlanInput {
  remediationCaseId: string;
  selectedHypothesisIds: string[];
  expectedCaseVersion: number;
  correlationId: string;
}

export interface RecordRemediationAdaptationInput {
  planId: string;
  action: RemediationAdaptationAction;
  rationale: string;
  evidenceIds: string[];
  expectedPlanVersion: number;
  correlationId: string;
}

export interface RequestRemediationExitInput {
  planId: string;
  evidenceIds: string[];
  expectedPlanVersion: number;
  correlationId: string;
}
```

---

## 25. Failure Taxonomy

```ts
export type RemediationFailureCode =
  | 'REMEDIATION_CASE_NOT_FOUND'
  | 'TRIGGER_NOT_SUPPORTED'
  | 'REMEDIATION_NOT_REQUIRED'
  | 'NO_DEFENSIBLE_HYPOTHESIS'
  | 'NO_REPAIR_TARGET'
  | 'NO_COMPATIBLE_STRATEGY'
  | 'MISSION_PLAN_REJECTED'
  | 'REPRESENTATION_UNAVAILABLE'
  | 'EVIDENCE_INSUFFICIENT'
  | 'INDEPENDENCE_NOT_CONFIRMED'
  | 'BLOCKING_PREREQUISITE_REMAINS'
  | 'REASSESSMENT_REQUIRED'
  | 'PLAN_VERSION_CONFLICT'
  | 'DUPLICATE_TRIGGER'
  | 'INVALID_LIFECYCLE_TRANSITION'
  | 'REFERRAL_REQUIRED';
```

Failures must preserve educational meaning. A technical failure must not be recorded as learner failure.

---

## 26. Observability

Operational metrics may include:

- trigger-to-plan conversion rate;
- remediation completion rate;
- independent recovery rate;
- median strategy changes per case;
- representation-switch effectiveness;
- recurrence after exit;
- referral rate;
- time in remediation;
- unresolved prerequisite frequency;
- false-positive remediation rate.

Metrics must not become simplistic learner rankings.

---

## 27. Acceptance Criteria

Phase 16H is conforming when:

- remediation entry is evidence-grounded;
- root-cause uncertainty is explicit;
- plans target the smallest defensible repair structure;
- failed tasks are not blindly repeated;
- alternate representations and strategies are first-class;
- assistance is attributable;
- success requires fresh evidence;
- exit requires reassessment;
- mastery remains owned by Phase 16G;
- learner dignity is protected;
- runtime actions are replayable and auditable;
- the ratio validation slice can be implemented without inventing missing policy.

---

## 28. Downstream Handoff

Phase 16H provides Phase 16I with:

- remediation case status;
- learner-safe progress summaries;
- repaired and unresolved target references;
- support intensity;
- referral recommendations;
- evidence-grounded explanations.

Phase 16H provides Phase 16J with:

- remediation policy events;
- plan-version history;
- strategy effectiveness signals;
- representation effectiveness signals;
- failure and referral events;
- audit-ready provenance.

---

## 29. Final Doctrine

> A learner who has not yet mastered an idea does not need more judgment. The learner needs a more accurate route to the missing structure.

Remediation succeeds when the system discovers and repairs what was actually missing, then returns the learner to progression with stronger, more independent, and more transferable understanding.
