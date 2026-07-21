# 27E — Practice Recommendation Runtime

Status: PRACTICE RECOMMENDATION RUNTIME DEFINED  
Depends on: 27A–27D, Learning Engine, Assessment Engine  
Chapter: 27 — Recommendation Engine Architecture

---

## 1. Purpose

Practice Recommendation Runtime determines which practice action should be proposed when the learner already has enough conceptual basis to benefit from rehearsal, variation, retrieval, fluency building, retention support, or transfer.

It answers:

> What should the learner practice next, in what form, for what purpose, and under what stopping or reevaluation conditions?

It does not execute practice, award mastery, assign scores, confirm misconception, or guarantee readiness.

---

## 2. Runtime Position

```text
Assessment Claims
+ Learning History
+ Retention Signals
+ Transfer Evidence
+ Misconception State
+ Available Practice Assets
+ Goal Context
        ↓
Practice Recommendation Runtime
        ↓
Prioritized Practice Recommendations
        ↓
Learning Engine / Mission Engine / Projection Runtime
```

Practice recommendations consume verified or bounded upstream evidence. They must never manufacture stronger learner claims than the evidence supports.

---

## 3. Authority Boundary

Practice Recommendation Runtime owns:

- determining whether practice is appropriate;
- selecting a practice target;
- selecting a practice purpose;
- choosing variation, retrieval, spacing, interleaving, or transfer intent;
- proposing difficulty and support bounds;
- limiting repetition and detecting stale loops;
- attaching evidence, reasons, limitations, stopping rules, and reevaluation triggers.

It does not own:

- instructional explanation;
- lesson design;
- assessment truth;
- mastery status;
- curriculum authority;
- reward logic;
- mission acceptance;
- practice completion truth;
- learner identity or grade placement.

---

## 4. Practice Recommendation Definition

```ts
interface PracticeRecommendation {
  recommendationId: string
  recommendationSetId: string
  learnerId: string
  scopeId: string

  targetType: 'SKILL' | 'CONCEPT_RELATIONSHIP' | 'REPRESENTATION' | 'STRATEGY' | 'TRANSFER_PATTERN'
  targetId: string
  practicePurpose: PracticePurpose

  difficultyBand: PracticeDifficultyBand
  supportLevel: PracticeSupportLevel
  variationProfile: PracticeVariationProfile
  dosage: PracticeDosage

  priorityBand: PriorityBand
  sequencePosition: number

  reasonCodes: PracticeRecommendationReasonCode[]
  sourceClaimRefs: SourceClaimRef[]
  historyRefs: LearningHistoryRef[]
  assetRefs: PracticeAssetRef[]

  confidence: RecommendationConfidence
  limitations: RecommendationLimitation[]
  stoppingRules: PracticeStoppingRule[]
  reevaluationTriggers: ReevaluationTrigger[]

  generatedAt: string
  contextVersion: string
  policyVersion: string
}
```

A practice recommendation is a bounded proposal, not an endless queue of exercises.

---

## 5. Practice Purposes

```text
RETRIEVE
BUILD_FLUENCY
STABILIZE
RETAIN
VARY_REPRESENTATION
INTERLEAVE
DISCRIMINATE
APPLY
TRANSFER
RECOVER_AFTER_GAP
VERIFY_INDEPENDENCE
PREPARE_ASSESSMENT
```

### RETRIEVE

Recall previously learned knowledge without relying on immediate re-teaching.

### BUILD_FLUENCY

Improve reliable and efficient execution after conceptual understanding exists.

### STABILIZE

Reduce fragile or inconsistent performance across nearby task variants.

### RETAIN

Revisit knowledge at an appropriate interval to reduce forgetting risk.

### VARY_REPRESENTATION

Practice across multiple equivalent forms without changing the core concept target.

### INTERLEAVE

Mix related task families to strengthen selection of the correct strategy.

### DISCRIMINATE

Practice distinguishing similar concepts, operators, or problem types.

### APPLY

Use knowledge in a meaningful but still supported context.

### TRANSFER

Use knowledge in a materially different context, representation, or problem structure.

### RECOVER_AFTER_GAP

Restore accessibility after a long period without use.

### VERIFY_INDEPENDENCE

Check whether performance remains stable after scaffolding is removed.

### PREPARE_ASSESSMENT

Provide limited familiarization with assessment form without teaching to the exact item set.

---

## 6. Input Contract

```ts
interface PracticeRecommendationInput {
  recommendationCaseId: string
  learnerId: string
  scope: RecommendationScope
  frozenAt: string

  assessmentClaims: AssessmentClaimSnapshot[]
  readinessClaims: ReadinessClaimSnapshot[]
  misconceptionClaims: MisconceptionClaimSnapshot[]
  transferClaims: TransferClaimSnapshot[]

  learningHistory: LearningHistorySnapshot
  practiceHistory: PracticeHistorySnapshot
  retentionSignals: RetentionSignalSnapshot[]
  availableAssets: PracticeAssetCatalogSnapshot
  learnerContext: LearnerContextSnapshot
  goalContext?: GoalContextSnapshot

  candidateSet: RecommendationCandidateSet
  prioritizationPolicy: PrioritizationPolicySnapshot
  practicePolicy: PracticeRecommendationPolicySnapshot
}
```

All inputs must be frozen and versioned for the duration of the run.

---

## 7. Output Contract

```ts
interface PracticeRecommendationResult {
  recommendationCaseId: string
  recommendationSetId: string
  status:
    | 'PRACTICE_RECOMMENDATIONS_CREATED'
    | 'NO_PRACTICE_REQUIRED'
    | 'LEARNING_REQUIRED_INSTEAD'
    | 'ASSESSMENT_REQUIRED_INSTEAD'
    | 'INSUFFICIENT_EVIDENCE'
    | 'NO_ELIGIBLE_ASSET'
    | 'HUMAN_REVIEW_REQUIRED'
    | 'QUARANTINED'

  recommendations: PracticeRecommendation[]
  excludedCandidates: ExcludedPracticeCandidate[]
  loopWarnings: PracticeLoopWarning[]
  limitations: RecommendationLimitation[]
  generatedAt: string
  inputDigest: string
}
```

An empty result is valid only when the reason is explicit.

---

## 8. Practice Eligibility

Practice is eligible only when:

1. the target concept or strategy has enough positive evidence to support rehearsal;
2. a conceptual blocker is not the dominant explanation for failure;
3. the learner has not exceeded repetition or fatigue limits;
4. the practice asset matches the target and purpose;
5. the proposed difficulty stays within policy bounds;
6. the recommendation does not contradict stronger evidence;
7. the practice purpose is explicit;
8. stopping and reevaluation rules are defined.

Practice should not be recommended merely because the learner answered incorrectly.

---

## 9. Learning-versus-Practice Gate

```text
Concept model absent or unstable
        → LEARNING_REQUIRED_INSTEAD
Repeated patterned error with misconception evidence
        → LEARNING or HUMAN REVIEW
Positive concept evidence, weak fluency
        → PRACTICE
Positive familiar-context evidence, weak novel-context evidence
        → TRANSFER PRACTICE
Evidence too sparse or conflicting
        → ASSESSMENT_REQUIRED_INSTEAD
```

The gate prevents repeated practice from hiding a conceptual problem.

---

## 10. Practice Target Classification

```text
FACT_RECALL
PROCEDURAL_STEP
STRATEGY_SELECTION
REPRESENTATION_TRANSLATION
CONCEPT_DISCRIMINATION
MULTI_STEP_COORDINATION
WORD_PROBLEM_MODELING
TRANSFER_APPLICATION
RETENTION_RETRIEVAL
INDEPENDENT_EXECUTION
```

The target classification helps determine practice form and dosage. It does not redefine curriculum identity.

---

## 11. Difficulty Model

```text
D0_REENTRY
D1_SUPPORTED
D2_FAMILIAR
D3_VARIATION
D4_INTEGRATED
D5_TRANSFER
D6_CHALLENGE
```

Rules:

- difficulty must be bounded by verified readiness;
- higher difficulty cannot compensate for poor target alignment;
- difficulty changes should be incremental unless strong evidence supports a jump;
- repeated failure should reduce uncertainty through reassessment, not only reduce difficulty;
- repeated success should not automatically imply mastery or transfer;
- challenge difficulty is optional and must not block required foundation work.

---

## 12. Support Model

```text
FULLY_SCAFFOLDED
GUIDED
HINT_AVAILABLE
LIGHT_SUPPORT
INDEPENDENT
DELAYED_FEEDBACK
```

Support may be reduced to verify independence, but only within safe progression rules.

The runtime must record whether success occurred under support. Supported success and independent success are different evidence conditions.

---

## 13. Practice Variation

A variation profile may include:

```ts
interface PracticeVariationProfile {
  representationVariation: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH'
  contextVariation: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH'
  numericalVariation: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH'
  strategyVariation: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH'
  languageVariation: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH'
  distractorVariation: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH'
}
```

Variation must serve a learning purpose. Random change without an evidence-backed purpose is not adaptive practice.

---

## 14. Spacing and Retention

Retention recommendations may be produced when:

- the target was previously learned;
- evidence is old enough to create forgetting risk;
- the target remains relevant to current goals or dependencies;
- recent retrieval evidence is absent or weak;
- practice frequency does not exceed policy limits.

```text
Learning event
      ↓
Initial retrieval
      ↓
Spaced review
      ↓
Delayed retrieval
      ↓
Transfer or maintenance
```

Spacing policy must be versioned. Historical replay must use the policy version active at the original decision time.

---

## 15. Interleaving

Interleaving is appropriate when the learner must select among related strategies or concepts.

It is not appropriate when:

- foundational understanding is still missing;
- task identity is unresolved;
- excessive mixing would make evidence uninterpretable;
- the learner needs an initial stable model.

Interleaving recommendations must identify the comparison set and the discrimination purpose.

---

## 16. Transfer Practice

Transfer practice requires evidence that the learner has enough conceptual and procedural basis to attempt a new context.

Transfer dimensions may include:

```text
NEW_REPRESENTATION
NEW_CONTEXT
NEW_LANGUAGE_FORM
NEW_NUMBER_STRUCTURE
NEW_PROBLEM_STRUCTURE
NEW_TOOL
NEW_DOMAIN
REDUCED_SUPPORT
MULTI_CONCEPT_INTEGRATION
```

The runtime must not interpret one failed transfer attempt as proof that the underlying concept is absent.

---

## 17. Dosage

```ts
interface PracticeDosage {
  minimumItems?: number
  maximumItems?: number
  minimumDurationMinutes?: number
  maximumDurationMinutes?: number
  targetSuccessWindow?: number
  maximumConsecutiveFailures?: number
  maximumConsecutiveSuccesses?: number
  breakRequiredAfterMinutes?: number
}
```

Dosage is a safety and evidence-quality boundary, not a productivity quota.

Rules:

- maximum bounds are mandatory for repetitive practice;
- dosage should be reduced when fatigue or frustration signals appear;
- completion may occur before the maximum when stopping evidence is satisfied;
- more items do not automatically create stronger evidence;
- item count cannot replace evidence diversity.

---

## 18. Stopping Rules

```text
TARGET_EVIDENCE_COLLECTED
STABLE_SUCCESS_WINDOW_REACHED
TRANSFER_EVIDENCE_COLLECTED
MAXIMUM_DOSAGE_REACHED
CONSECUTIVE_FAILURE_LIMIT_REACHED
FATIGUE_SIGNAL_DETECTED
MISCONCEPTION_SIGNAL_DETECTED
CONFLICTING_EVIDENCE_DETECTED
ASSET_QUALITY_FAILURE
LEARNER_REQUESTED_STOP
HUMAN_INTERVENTION_REQUIRED
```

Stopping practice is not the same as declaring mastery.

A stopping rule ends or pauses the current practice recommendation and triggers reassessment or a new decision.

---

## 19. Repetition Loop Protection

The runtime must detect recommendation loops such as:

```text
same target
+ same purpose
+ same difficulty
+ same representation
+ no new evidence
+ repeated recommendation
```

Loop responses may include:

```text
CHANGE_REPRESENTATION
REDUCE_OR_INCREASE_SUPPORT
REQUEST_ASSESSMENT
RECOMMEND_LEARNING
REQUEST_HUMAN_REVIEW
DEFER_TARGET
QUARANTINE_DECISION
```

A learner must not be trapped in infinite remediation because the system keeps reproducing the same action.

---

## 20. Asset Eligibility

```ts
interface PracticeAssetEligibility {
  targetMatch: boolean
  purposeMatch: boolean
  difficultyFit: boolean
  variationFit: boolean
  supportFit: boolean
  languageFit: boolean
  accessibilityFit: boolean
  ageAppropriateness: boolean
  evidenceCaptureFit: boolean
  policyAllowed: boolean
}
```

The asset must be capable of producing evidence relevant to the intended practice purpose.

A visually attractive activity that cannot exercise or observe the target is not eligible.

---

## 21. Explanation Contract

Every published practice recommendation must explain:

```text
WHAT should be practiced
WHY practice is appropriate now
WHICH evidence shows a usable concept model exists
WHICH practice purpose is intended
WHY this difficulty and support level were chosen
WHAT stopping rules apply
WHAT limitations remain
WHEN reevaluation occurs
```

Example:

```text
Recommend: Practice translating short word statements into equations with light hints.
Purpose: Stabilize representation translation before unfamiliar word problems.
Evidence: The learner explains equation balance correctly but is inconsistent when converting verbal relationships into symbols.
Limit: Evidence is limited to one-step statements.
Stop: After a stable success window or three consecutive modeling failures.
Reevaluate: Collect independent translation evidence before increasing complexity.
```

---

## 22. Confidence

Practice recommendation confidence expresses confidence that the proposed practice action is appropriate.

It is not:

- mastery confidence;
- probability of answering correctly;
- expected score;
- proof of retention;
- proof of transfer.

Confidence must be bounded by:

- source claim quality;
- recency;
- context coverage;
- contradiction state;
- asset fit;
- loop history;
- support uncertainty.

---

## 23. Reevaluation Triggers

```text
PRACTICE_COMPLETED
STOPPING_RULE_REACHED
NEW_ASSESSMENT_CLAIM
NEW_MISCONCEPTION_SIGNAL
TRANSFER_RESULT_AVAILABLE
RETENTION_INTERVAL_REACHED
GOAL_CHANGED
ASSET_CATALOG_CHANGED
POLICY_CHANGED
HUMAN_REVIEW_COMPLETED
RECOMMENDATION_EXPIRED
```

---

## 24. Human Review

Human review is required when:

- repeated practice produces no meaningful new evidence;
- performance changes sharply without an explainable cause;
- high frustration or disengagement signals persist;
- misconception evidence conflicts with success evidence;
- available assets cannot isolate the target;
- accessibility or language needs are unresolved;
- the learner repeatedly succeeds only under heavy support;
- practice would displace a critical prerequisite intervention.

Human review may redirect, pause, limit, or reject the recommendation. Historical evidence remains append-only.

---

## 25. Failure Codes

```text
PRACTICE_REC_INPUT_SCOPE_MISMATCH
PRACTICE_REC_CLAIM_PROVENANCE_INVALID
PRACTICE_REC_TARGET_UNRESOLVED
PRACTICE_REC_CONCEPT_NOT_READY
PRACTICE_REC_LEARNING_REQUIRED
PRACTICE_REC_ASSESSMENT_REQUIRED
PRACTICE_REC_DIFFICULTY_OUT_OF_BOUNDS
PRACTICE_REC_SUPPORT_OUT_OF_BOUNDS
PRACTICE_REC_DOSAGE_INVALID
PRACTICE_REC_STOPPING_RULE_MISSING
PRACTICE_REC_LOOP_DETECTED
PRACTICE_REC_NO_ELIGIBLE_ASSET
PRACTICE_REC_CONFIDENCE_EXCEEDS_EVIDENCE
PRACTICE_REC_EXPLANATION_INCOMPLETE
PRACTICE_REC_STALE_CONTEXT
PRACTICE_REC_HUMAN_REVIEW_REQUIRED
PRACTICE_REC_QUARANTINED
```

---

## 26. Determinism

For identical frozen input snapshots and policy versions, the runtime must produce the same semantic result:

- same target identity;
- same practice purpose;
- same difficulty band;
- same support level;
- same variation profile;
- same dosage bounds;
- same stopping rules;
- same exclusions and limitations;
- same ordering.

Generated timestamps and non-semantic IDs may be excluded only by explicit replay policy.

---

## 27. Observability

Recommended telemetry:

```text
practice candidates evaluated
eligible practice recommendations
learning-required redirects
assessment-required redirects
practice purpose distribution
difficulty and support distributions
loop detections
stopping-rule activations
dosage reached
asset eligibility failures
human-review escalations
retention recommendation frequency
transfer recommendation frequency
```

Operational telemetry must preserve privacy and tenant boundaries.

---

## 28. Example — Fractions to Word Equations

Evidence:

```text
Fraction equivalence explanation: stable
Symbolic manipulation: moderate
Verbal-to-symbolic translation: inconsistent
Multi-step word equation transfer: unverified
```

Recommendation:

```text
Target: verbal-to-symbolic translation
Purpose: STABILIZE
Difficulty: D2_FAMILIAR
Support: HINT_AVAILABLE
Variation: moderate language variation, low structural variation
Dosage: 6–10 items
Stop: stable success window or 3 consecutive modeling failures
Reevaluate: independent one-step translation evidence
```

Not yet recommended:

```text
D5_TRANSFER multi-step entrance-exam word equations
```

Reason: transfer readiness is not established.

---

## 29. Acceptance Criteria

27E is satisfied when:

- practice is clearly separated from learning and assessment;
- practice requires a usable conceptual basis;
- every recommendation has a defined practice purpose;
- difficulty, support, variation, and dosage are bounded;
- stopping rules are mandatory;
- repetition loops cannot continue silently;
- asset eligibility includes evidence-capture fitness;
- transfer failure is not misclassified as total concept failure;
- recommendation confidence remains bounded;
- identical frozen inputs yield the same semantic output.

---

## 30. Completion Statement

Practice Recommendation Runtime is defined as the authority for proposing bounded, purposeful, explainable practice actions after conceptual eligibility has been established.

```text
Learning builds or repairs the model.
Practice stabilizes, retrieves, varies, and transfers the model.
Assessment interprets the resulting evidence.
Recommendation decides which action is appropriate next.
```
