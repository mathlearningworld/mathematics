# 26D — Readiness Evaluation Runtime

## Status

- Chapter: 26 — Assessment Engine Architecture
- Slice: 26D
- State: READINESS RUNTIME DEFINED
- Depends on: 26A Assessment Engine Foundation, 26B Assessment Evidence Runtime, 26C Assessment Model Runtime

---

## 1. Purpose

The Readiness Evaluation Runtime determines whether a learner is sufficiently prepared for a specific next goal, mission, concept cluster, challenge, or formal progression boundary.

Readiness is not a global trait and is never represented as a permanent label on the learner. It is a scoped, versioned, evidence-bound claim relative to explicit requirements.

---

## 2. Runtime Position

```text
Target Goal / Mission
+ Requirement Graph
+ Assessment Evidence Set
+ Learning State
+ Mastery / Transfer Claims
+ Readiness Policy
        ↓
Readiness Evaluation Runtime
        ↓
Readiness Claim
+ Risk Profile
+ Requirement Coverage
+ Explanation
+ Review Conditions
```

---

## 3. Core Principle

The runtime answers:

> Is this learner ready for this exact target, under this exact requirement and policy version, with what risks and limitations?

It must not answer:

> Is this learner generally smart, advanced, weak, or behind?

---

## 4. Readiness Authority

The runtime owns:

- target requirement resolution,
- prerequisite closure analysis,
- requirement coverage evaluation,
- risk weighting,
- blocking and non-blocking gap classification,
- partial-readiness semantics,
- support-conditioned readiness,
- readiness explanation,
- readiness supersession and reevaluation.

It does not own:

- curriculum authoring,
- knowledge graph mutation,
- learning-state mutation,
- mastery creation,
- mission execution,
- recommendation ranking,
- UI unlocking by direct command.

---

## 5. Readiness Target

```ts
export interface ReadinessTarget {
  targetType:
    | 'MISSION'
    | 'CONCEPT'
    | 'CONCEPT_CLUSTER'
    | 'GRADE_EXPECTATION'
    | 'CHALLENGE'
    | 'EXAM_OBJECTIVE'
    | 'WORLD_REGION'
    | 'CUSTOM_GOAL';
  targetId: string;
  targetVersion: string;
  requirementGraphRef: string;
  policyRef: string;
}
```

A readiness claim is invalid without an explicit target version.

---

## 6. Requirement Model

```ts
export interface ReadinessRequirement {
  requirementId: string;
  conceptId: string;
  requirementType:
    | 'FOUNDATIONAL'
    | 'CORE'
    | 'SUPPORTING'
    | 'TRANSFER'
    | 'REPRESENTATION'
    | 'STRATEGY'
    | 'RETENTION'
    | 'INDEPENDENCE';
  criticality: 'BLOCKING' | 'HIGH' | 'MEDIUM' | 'LOW';
  minimumClassification: string;
  acceptedEvidenceKinds: string[];
  maximumEvidenceAge?: string;
  supportPolicy?: 'INDEPENDENT_ONLY' | 'LIMITED_SUPPORT' | 'SUPPORTED_ALLOWED';
}
```

Requirements are not inferred from display labels. They come from a versioned requirement graph.

---

## 7. Requirement Closure

The runtime expands the target into a closed requirement set.

```text
Direct Target Requirements
        ↓
Prerequisite Graph Expansion
        ↓
Policy-Based Depth and Boundary Rules
        ↓
Deduplicated Requirement Closure
```

Closure must record:

- direct requirements,
- inherited prerequisites,
- optional enrichment requirements,
- excluded requirements,
- graph version,
- expansion policy version.

Circular dependencies must be detected and rejected or explicitly resolved by graph policy.

---

## 8. Readiness Dimensions

Readiness is evaluated across independent dimensions:

```text
FOUNDATION_COVERAGE
CORE_REQUIREMENT_COVERAGE
TRANSFER_COVERAGE
REPRESENTATION_COVERAGE
CONTEXT_COVERAGE
RETENTION_STABILITY
INDEPENDENCE
SUPPORT_DEPENDENCE
ERROR_RECOVERY
CONTRADICTION_BURDEN
EVIDENCE_RECENCY
EVIDENCE_SUFFICIENCY
MISSION_SPECIFIC_FIT
```

No single dimension may silently stand in for the entire readiness decision.

---

## 9. Requirement Evaluation

```ts
export interface RequirementEvaluation {
  requirementId: string;
  status:
    | 'SATISFIED'
    | 'SATISFIED_WITH_LIMITATIONS'
    | 'PARTIALLY_SATISFIED'
    | 'UNSATISFIED'
    | 'CONTRADICTED'
    | 'STALE'
    | 'NOT_EVALUABLE';
  confidence: number;
  supportingEvidenceRefs: string[];
  contradictingEvidenceRefs: string[];
  limitationCodes: string[];
  riskCodes: string[];
}
```

A missing requirement is not treated as failed performance. It is classified according to evidence sufficiency.

---

## 10. Blocking Logic

A readiness claim cannot be `READY` when any blocking requirement is:

- unsatisfied,
- contradicted at high confidence,
- stale beyond policy,
- not evaluable because required evidence is absent.

Non-blocking gaps may produce `READY_WITH_RISK`, `READY_WITH_SUPPORT`, or `PARTIALLY_READY` depending on policy.

---

## 11. Readiness Classifications

```text
READY
READY_WITH_RISK
READY_WITH_SUPPORT
PARTIALLY_READY
NOT_YET_READY
READINESS_UNCERTAIN
EVIDENCE_INSUFFICIENT
TARGET_REQUIREMENTS_INVALID
```

### READY

All blocking requirements are satisfied and residual risk is within policy.

### READY_WITH_RISK

The learner may proceed, but a bounded non-blocking risk remains visible.

### READY_WITH_SUPPORT

The learner may proceed only when an explicit support condition is provided.

### PARTIALLY_READY

A meaningful subset of the target is available, but the complete target should not yet be treated as safe.

### NOT_YET_READY

At least one blocking gap is supported by sufficient evidence.

### READINESS_UNCERTAIN

Evidence is contradictory or confidence is below the decision threshold.

### EVIDENCE_INSUFFICIENT

The runtime cannot justify a readiness conclusion.

---

## 12. Risk Model

```ts
export interface ReadinessRisk {
  riskType:
    | 'FOUNDATION_GAP'
    | 'TRANSFER_GAP'
    | 'REPRESENTATION_GAP'
    | 'RETENTION_RISK'
    | 'SUPPORT_DEPENDENCE'
    | 'MISCONCEPTION_RISK'
    | 'CONTRADICTORY_EVIDENCE'
    | 'STALE_EVIDENCE'
    | 'LOW_CONTEXT_DIVERSITY'
    | 'LOW_STRATEGY_FLEXIBILITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedRequirementIds: string[];
  evidenceRefs: string[];
  mitigationCodes: string[];
}
```

Risk is never hidden inside a composite score.

---

## 13. Support-Conditioned Readiness

A learner may be ready under one support condition and not ready under another.

Examples:

```text
READY with visual model
PARTIALLY_READY without visual model
READY_WITH_SUPPORT with worked-example access
NOT_YET_READY under independent timed conditions
```

Support conditions are part of the claim scope and must be preserved in projections.

---

## 14. Partial Readiness

Partial readiness is not failure. It allows the runtime to expose the safe portion of a larger target.

```ts
export interface PartialReadinessBoundary {
  availableSubtargets: string[];
  deferredSubtargets: string[];
  blockingRequirements: string[];
  safeSupportConditions: string[];
}
```

This supports non-linear progression without erasing foundational risk.

---

## 15. Readiness Claim

```ts
export interface ReadinessClaim {
  readinessClaimId: string;
  learnerId: string;
  target: ReadinessTarget;
  classification: string;
  confidence: number;
  requirementEvaluations: RequirementEvaluation[];
  risks: ReadinessRisk[];
  partialBoundary?: PartialReadinessBoundary;
  evidenceSetId: string;
  assessmentModelVersion: string;
  readinessPolicyVersion: string;
  requirementGraphVersion: string;
  supportConditions: string[];
  limitations: string[];
  generatedAt: string;
  reviewAfter?: string;
  supersedesClaimId?: string;
}
```

---

## 16. Decision Procedure

```text
1. Resolve target and target version
2. Resolve requirement graph and policy
3. Expand prerequisite closure
4. Validate evidence set compatibility
5. Evaluate each requirement
6. Detect blocking gaps
7. Evaluate readiness dimensions
8. Construct risk profile
9. Apply support-condition policy
10. Classify readiness
11. Generate explanation and limitations
12. Persist immutable claim
```

The same inputs and versions must produce the same result.

---

## 17. Explanation Contract

Every readiness result must explain:

- what target was evaluated,
- which requirements were satisfied,
- which requirements remain weak or unknown,
- which evidence supports the result,
- which contradictions matter,
- what support conditions change the result,
- what would justify reevaluation.

Example:

```text
PARTIALLY_READY

Supported:
- equality representation with objects
- multiplication as grouping

Blocking:
- symbolic equation translation remains unstable

Risk:
- success decreases when language density increases

Next evidence needed:
- two independent word-to-equation tasks across different contexts
```

---

## 18. Reevaluation

Reevaluation is triggered by:

- new eligible evidence,
- changed learning state,
- new mastery or transfer claim,
- requirement graph revision,
- policy revision,
- evidence staleness,
- target version change,
- human review request.

A new claim supersedes the old claim. Historical claims remain immutable.

---

## 19. Readiness and Progression

Readiness may inform progression, but it does not directly mutate progression state.

```text
Readiness Claim
        ↓
Recommendation / Mission / Progression Policy
        ↓
Separate Runtime Decision
```

This prevents the assessment layer from becoming an uncontrolled unlock authority.

---

## 20. Readiness and Exploration

Above-level exploration remains available unless an explicit safety or policy boundary applies.

The runtime may distinguish:

```text
FORMALLY_READY
EXPLORATION_ALLOWED
SUPPORTED_EXPLORATION_ONLY
NOT_RECOMMENDED_NOW
```

Formal readiness and exploratory access are separate concepts.

---

## 21. Failure Codes

```text
READINESS_TARGET_NOT_FOUND
READINESS_TARGET_VERSION_MISMATCH
REQUIREMENT_GRAPH_NOT_FOUND
REQUIREMENT_GRAPH_INVALID
REQUIREMENT_CYCLE_UNRESOLVED
EVIDENCE_SET_INCOMPATIBLE
POLICY_NOT_FOUND
POLICY_VERSION_MISMATCH
BLOCKING_REQUIREMENT_NOT_EVALUABLE
READINESS_MODEL_FAILURE
READINESS_RESULT_NON_DETERMINISTIC
```

Failures must not be converted into learner weakness labels.

---

## 22. Invariants

1. Every readiness claim is scoped to a target and target version.
2. Every claim references a frozen evidence set.
3. Every claim records requirement graph, model, and policy versions.
4. Blocking gaps cannot be hidden by strength in unrelated dimensions.
5. Missing evidence cannot be treated as proven weakness.
6. Support-conditioned readiness must record the support condition.
7. Readiness cannot mutate learning state.
8. Readiness cannot create mastery claims.
9. Historical claims are immutable.
10. Reevaluation creates a new claim and supersession link.
11. Exploration permission is not equivalent to formal readiness.
12. Human-facing projections may simplify wording but not alter classification meaning.

---

## 23. Verification Scenarios

Required scenarios include:

- all blocking requirements satisfied,
- one blocking foundational gap,
- strong direct evidence but weak transfer,
- ready only with visual support,
- contradictory evidence across representations,
- stale evidence,
- insufficient evidence,
- partial target availability,
- graph version change,
- policy version change,
- deterministic reevaluation with identical inputs,
- exploration allowed while formal readiness is not established.

---

## 24. Completion Criteria

26D is complete when:

- readiness targets and requirements are versioned,
- prerequisite closure is explicit,
- blocking and non-blocking logic are defined,
- partial and support-conditioned readiness are represented,
- risk remains multidimensional and visible,
- explanations are evidence-linked,
- reevaluation and supersession are deterministic,
- readiness remains advisory to downstream progression authority.

---

## 25. Architectural Outcome

The Readiness Evaluation Runtime turns assessment evidence into a precise answer about what the learner can safely attempt next.

It replaces score-based promotion with target-specific, evidence-based readiness while preserving learner agency, exploratory access, and visible foundational risk.
