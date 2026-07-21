# 26C — Assessment Model Runtime

## Status

- Chapter: 26 — Assessment Engine Architecture
- Slice: 26C
- State: MODEL RUNTIME DEFINED
- Depends on: 26A Assessment Engine Foundation, 26B Assessment Evidence Runtime

---

## 1. Purpose

The Assessment Model Runtime evaluates a versioned Assessment Evidence Set against an explicit assessment policy and produces explainable, scoped Assessment Claims.

It owns the rules for interpretation. It does not own evidence collection, learning-state mutation, mission execution, recommendation ranking, or audience-specific presentation.

---

## 2. Runtime Position

```text
Assessment Evidence Set
+ Learning State References
+ Mastery / Transfer Claims
+ Assessment Policy
        ↓
Assessment Model Runtime
        ↓
Assessment Claims
+ Explanation
+ Limitations
+ Review Conditions
```

---

## 3. Core Principle

The model must answer:

> Given this exact evidence set and policy version, what bounded conclusion is justified now?

It must not answer:

> What label would be convenient to display?

---

## 4. Model Authority

The runtime owns:

- policy resolution,
- dimension evaluation,
- evidence sufficiency checks,
- contradiction handling,
- claim classification,
- confidence classification,
- limitation generation,
- explanation construction,
- supersession and reevaluation semantics.

It does not own:

- raw event truth,
- discovered concept truth,
- learner concept-state transitions,
- mastery policy evaluation,
- recommendation ranking,
- parent or teacher wording.

---

## 5. Assessment Model

```ts
export interface AssessmentModel {
  modelId: string;
  modelVersion: string;
  supportedPurposes: AssessmentPurpose[];
  requiredEvidenceDimensions: AssessmentDimension[];
  policyCompatibility: string[];
  evaluatorVersion: string;
  explanationSchemaVersion: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'RETIRED';
}
```

The model version is recorded on every result.

---

## 6. Assessment Dimensions

```text
EVIDENCE_SUFFICIENCY
CONCEPT_UNDERSTANDING
INDEPENDENCE
STABILITY
RETENTION
REPRESENTATION_COVERAGE
CONTEXT_COVERAGE
TRANSFER_BREADTH
STRATEGY_FLEXIBILITY
ERROR_RECOVERY
SUPPORT_DEPENDENCE
CONTRADICTION_BURDEN
FOUNDATION_ALIGNMENT
MISSION_REQUIREMENT_COVERAGE
```

Dimensions remain separate through evaluation and explanation.

---

## 7. Dimension Result

```ts
export interface AssessmentDimensionResult {
  dimension: AssessmentDimension;
  classification: DimensionClassification;
  confidence: number;
  supportingEvidenceRefs: string[];
  contradictingEvidenceRefs: string[];
  limitations: AssessmentLimitation[];
  explanationCodes: string[];
}
```

Classifications:

```text
NOT_EVALUATED
INSUFFICIENT
WEAK
EMERGING
SUPPORTED
STRONG
ROBUST
CONTEXT_BOUND
SUPPORT_DEPENDENT
CONTRADICTED
STALE
```

---

## 8. Assessment Policy

```ts
export interface AssessmentPolicy {
  policyId: string;
  policyVersion: string;
  purpose: AssessmentPurpose;
  targetClaimTypes: AssessmentClaimType[];
  requiredDimensions: AssessmentDimensionRequirement[];
  minimumEvidenceRules: MinimumEvidenceRule[];
  contradictionRules: ContradictionRule[];
  recencyRules: RecencyRule[];
  supportRules: SupportRule[];
  outcomeRules: AssessmentOutcomeRule[];
  reviewRules: AssessmentReviewRule[];
}
```

Policy rules are data or domain contracts, not scattered conditionals in UI components.

---

## 9. Purpose-Specific Models

The same evidence may yield different claims under different purposes.

### Mission readiness

Requires alignment with declared mission prerequisites and current independence.

### Learning diagnosis

May include older and contradictory evidence to explain patterns.

### Retention check

Requires temporal separation from initial acquisition.

### Transfer readiness

Requires source-target structural comparison and target-context evidence.

### Parent explanation

May consume an existing assessment claim, but must not generate a weaker hidden policy simply for simplicity.

---

## 10. Evaluation Request

```ts
export interface EvaluateAssessmentCaseCommand {
  assessmentCaseId: string;
  assessmentEvidenceSetId: string;
  evidenceSetVersion: number;
  policyRef: AssessmentPolicyRef;
  modelRef: {
    modelId: string;
    modelVersion: string;
  };
  expectedAssessmentCaseVersion: number;
  evaluatedAt: string;
  correlationId: string;
}
```

---

## 11. Evaluation Result

```ts
export interface EvaluateAssessmentCaseResult {
  assessmentCaseId: string;
  assessmentCaseVersion: number;
  modelRef: {
    modelId: string;
    modelVersion: string;
  };
  policyRef: AssessmentPolicyRef;
  dimensionResults: AssessmentDimensionResult[];
  claims: AssessmentClaim[];
  overallEvidenceClassification: EvidenceStrength;
  evaluatedAt: string;
  resultFingerprint: string;
}
```

There is no mandatory overall score.

---

## 12. Evaluation Pipeline

```text
Validate Assessment Case
    ↓
Validate Evidence-Set Version
    ↓
Resolve Model and Policy
    ↓
Check Purpose Compatibility
    ↓
Evaluate Evidence Sufficiency
    ↓
Evaluate Required Dimensions
    ↓
Apply Contradiction Rules
    ↓
Apply Outcome Rules
    ↓
Generate Limitations
    ↓
Construct Explanation
    ↓
Publish Claims
```

If evidence sufficiency fails, the runtime publishes an explicit insufficiency claim where policy permits; it does not guess.

---

## 13. Evidence Sufficiency Gate

The gate may require:

- minimum eligible observations,
- minimum independent observations,
- representation diversity,
- context diversity,
- temporal separation,
- valid transfer evidence,
- acceptable contradiction burden,
- current evidence within a recency window.

Volume alone cannot satisfy diversity requirements.

---

## 14. Claim Construction

A claim is constructed from:

```text
Claim Subject
+ Assessment Purpose
+ Dimension Results
+ Policy Outcome Rule
+ Evidence References
+ Contradiction References
+ Limitations
+ Validity Window
```

A claim must never be constructed from a display label or a manually supplied final outcome.

---

## 15. Readiness Model Shape

```ts
export interface ReadinessAssessmentDetail {
  targetId: string;
  requirementCoverage: RequirementCoverage[];
  blockingGaps: AssessmentGap[];
  nonBlockingRisks: AssessmentRisk[];
  supportConditions: SupportCondition[];
  readinessOutcome:
    | 'READY'
    | 'READY_WITH_SUPPORT'
    | 'PARTIALLY_READY'
    | 'NOT_YET_READY'
    | 'READINESS_UNCERTAIN';
}
```

Readiness is target-specific. A learner is never globally READY or NOT_READY.

---

## 16. Understanding Model Shape

```ts
export interface UnderstandingAssessmentDetail {
  conceptId: string;
  depth: DimensionClassification;
  representationCoverage: DimensionClassification;
  contextCoverage: DimensionClassification;
  strategyFlexibility: DimensionClassification;
  independence: DimensionClassification;
  stability: DimensionClassification;
  retention: DimensionClassification;
}
```

This prevents a broad understanding claim from hiding a representation-specific weakness.

---

## 17. Confidence

Confidence reflects confidence in the claim, not confidence in the learner as a person.

Confidence considers:

- evidence integrity,
- evidence diversity,
- attribution certainty,
- policy fit,
- contradiction burden,
- temporal relevance,
- replay consistency.

Confidence must not be presented as a probability unless the model is explicitly calibrated for probabilistic interpretation.

---

## 18. Limitations

Common limitations:

```text
LIMITED_REPRESENTATION_COVERAGE
LIMITED_CONTEXT_COVERAGE
INSUFFICIENT_TEMPORAL_SEPARATION
HIGH_SUPPORT_DEPENDENCE
MATERIAL_CONTRADICTION
STALE_EVIDENCE
NO_FAR_TRANSFER_EVIDENCE
UNVERIFIED_ADULT_OBSERVATION
MISSION_REQUIREMENT_PARTIALLY_OBSERVED
POLICY_SCOPE_RESTRICTED
```

Limitations travel with the claim.

---

## 19. Contradiction Rules

Contradiction may:

- lower confidence,
- narrow scope,
- change a claim to CONTEXT_BOUND,
- produce READINESS_UNCERTAIN,
- suspend a previous claim,
- trigger a targeted evidence request.

Contradiction must not automatically mean failure. It may reveal meaningful context dependence.

---

## 20. Support Dependence

The model distinguishes:

- successful with direct answer,
- successful with procedural hint,
- successful with conceptual cue,
- successful with environmental support,
- successful independently,
- successful independently with self-correction.

A policy may permit READY_WITH_SUPPORT while refusing READY.

---

## 21. Model Output Rules

Allowed outputs include:

```text
SUPPORTED UNDERSTANDING
CONTEXT-BOUND UNDERSTANDING
TRANSFER READY
TRANSFER UNCERTAIN
READY WITH SUPPORT
FOUNDATION GAP PRESENT
MISCONCEPTION RISK SIGNAL
EVIDENCE INSUFFICIENT
```

Forbidden outputs include unscoped labels such as:

```text
SMART
WEAK
BAD AT MATH
SLOW LEARNER
LOW ABILITY
```

---

## 22. Explanation Contract

```ts
export interface AssessmentExplanation {
  summaryCode: string;
  scopeDescription: string;
  reasons: AssessmentReason[];
  supportingEvidenceRefs: string[];
  contradictingEvidenceRefs: string[];
  limitations: AssessmentLimitation[];
  evidenceNeededNext: EvidenceNeed[];
  reviewGuidance?: string[];
}
```

The explanation must be reconstructable without relying on the original evaluator process memory.

---

## 23. Evidence Needed Next

When uncertain, the model may request evidence such as:

```text
INDEPENDENT_ATTEMPT
ALTERNATIVE_REPRESENTATION
NEW_CONTEXT
NEAR_TRANSFER_TASK
FAR_TRANSFER_TASK
DELAYED_RETENTION_CHECK
MISCONCEPTION_CONTRAST_TASK
STRATEGY_EXPLANATION
LOWER_SUPPORT_ATTEMPT
```

This output may inform Recommendation Runtime but does not itself schedule a mission.

---

## 24. Reevaluation

Reevaluation is required when:

- new eligible evidence arrives,
- material contradiction appears,
- the policy version changes,
- the model version changes,
- the claim becomes stale,
- a human contests an interpretation,
- a target mission changes its requirements.

Reevaluation creates new claims and supersedes prior claims where appropriate.

---

## 25. Supersession

Claims are not edited in place.

```text
Prior Claim
    ↓ supersededBy
New Claim
```

The prior claim remains historically auditable with its original evidence and policy references.

---

## 26. Determinism

The result fingerprint includes:

```text
assessmentCaseId
+ evidenceSetId/version
+ policyId/version
+ modelId/version
+ evaluatorVersion
+ normalized dimension results
```

Identical authoritative inputs must yield semantically equivalent outputs.

---

## 27. Version Compatibility

The runtime must reject evaluation when:

- the policy is unsupported by the model,
- the evidence schema is incompatible,
- required dimensions are unavailable,
- the model is retired for new evaluations,
- the assessment purpose differs from the policy purpose.

Historical replay may use archived model implementations.

---

## 28. Failure Codes

```text
ASSESSMENT_CASE_NOT_READY
ASSESSMENT_EVIDENCE_SET_NOT_READY
ASSESSMENT_EVIDENCE_VERSION_CONFLICT
ASSESSMENT_POLICY_NOT_FOUND
ASSESSMENT_MODEL_NOT_FOUND
ASSESSMENT_MODEL_POLICY_INCOMPATIBLE
ASSESSMENT_PURPOSE_MISMATCH
ASSESSMENT_REQUIRED_DIMENSION_UNAVAILABLE
ASSESSMENT_EXPECTED_VERSION_CONFLICT
ASSESSMENT_RESULT_ALREADY_PUBLISHED
ASSESSMENT_REPLAY_MODEL_UNAVAILABLE
```

---

## 29. Testable Model Scenarios

The model must support tests for:

1. strong independent evidence across representations,
2. repeated identical tasks with low diversity,
3. correct outcomes under heavy support,
4. strong concrete evidence but weak symbolic evidence,
5. recent success contradicted by delayed retention failure,
6. near transfer without far transfer,
7. negative transfer pattern,
8. stale evidence,
9. duplicate event delivery,
10. policy-version change,
11. model-version replay,
12. contested adult observation.

---

## 30. Runtime Invariants

1. Every result references one immutable evidence-set version.
2. Every result references one model version and one policy version.
3. Required dimensions cannot be silently skipped.
4. No overall label may erase dimension-level limitations.
5. No contradictory evidence may be hidden.
6. No claim may mutate Learning State.
7. No claim may directly schedule gameplay.
8. Uncertainty produces an explicit outcome.
9. Reevaluation supersedes; it does not rewrite history.
10. Identical inputs produce semantically equivalent outputs.

---

## 31. Chapter Progress

```text
26A Assessment Engine Foundation                 ✅
26B Assessment Evidence Runtime                  ✅
26C Assessment Model Runtime                     ✅
26D Readiness Evaluation Runtime
26E Misconception Assessment Runtime
26F Adaptive Assessment Runtime
26G Assessment Projection Runtime
26H Assessment Persistence & Replay
26I Assessment Verification Runtime
26J Assessment Runtime Invariants
```

---

## 32. Completion Definition

26C is complete when the repository defines:

- model and policy authority,
- assessment dimensions,
- evaluation commands and results,
- evidence sufficiency gates,
- claim, confidence, limitation, and explanation semantics,
- contradiction and support-dependence handling,
- reevaluation and supersession,
- deterministic and version-compatible evaluation.

This document completes Chapter 26 Batch 1 and establishes the interpretation boundary used by readiness, misconception, and adaptive assessment runtimes.