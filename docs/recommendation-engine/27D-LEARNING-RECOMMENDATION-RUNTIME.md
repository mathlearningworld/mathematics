# 27D — Learning Recommendation Runtime

Status: LEARNING RECOMMENDATION RUNTIME DEFINED  
Depends on: 27A–27C, Learning Engine, Assessment Engine  
Chapter: 27 — Recommendation Engine Architecture

---

## 1. Purpose

Learning Recommendation Runtime determines which learning action should be proposed when the learner needs new understanding, prerequisite repair, conceptual reconstruction, representation expansion, or guided transfer preparation.

It answers:

> What should the learner learn next, why should it come next, and what evidence must exist before the recommendation changes?

It does not teach the lesson, execute the activity, alter mastery, or declare readiness. It creates an explainable proposal for a downstream learning experience.

---

## 2. Runtime Position

```text
Assessment Claims
+ Readiness State
+ Misconception State
+ Curriculum Graph
+ Learning History
+ Available Learning Assets
+ Learner Goal Context
        ↓
Learning Recommendation Runtime
        ↓
Prioritized Learning Recommendations
        ↓
Learning Engine / Mission Engine / Projection Runtime
```

The runtime consumes claims owned by upstream authorities and publishes recommendations without mutating those claims.

---

## 3. Authority Boundary

Learning Recommendation Runtime owns:

- deciding whether a learning recommendation is eligible;
- choosing the appropriate learning target;
- selecting the intended learning purpose;
- ordering prerequisite repair before dependent learning;
- selecting the required representation or conceptual perspective;
- attaching reasons, evidence references, limitations, and reevaluation triggers;
- proposing a learning sequence when one action is insufficient.

It does not own:

- mastery state;
- assessment truth;
- misconception confirmation;
- curriculum requirements;
- lesson content;
- instructional delivery;
- mission acceptance;
- learner completion;
- rewards or progression unlocks.

```text
Assessment owns claims.
Curriculum owns requirements and dependency structure.
Learning Engine owns instruction and learning events.
Recommendation owns next-learning proposals.
Mission Engine owns accepted goals.
```

---

## 4. Learning Recommendation Definition

A Learning Recommendation is a traceable proposal that a learner should engage with a defined learning target through a defined instructional purpose.

```ts
interface LearningRecommendation {
  recommendationId: string
  recommendationSetId: string
  learnerId: string
  scopeId: string

  targetType: 'SKILL' | 'CONCEPT' | 'REPRESENTATION' | 'STRATEGY' | 'RELATIONSHIP'
  targetId: string
  learningPurpose: LearningPurpose

  priorityBand: PriorityBand
  sequencePosition: number
  dependencyDepth: number

  reasonCodes: LearningRecommendationReasonCode[]
  sourceClaimRefs: SourceClaimRef[]
  curriculumRefs: CurriculumRef[]
  prerequisiteRefs: PrerequisiteRef[]

  confidence: RecommendationConfidence
  limitations: RecommendationLimitation[]
  deliveryConstraints: DeliveryConstraint[]
  reevaluationTriggers: ReevaluationTrigger[]

  generatedAt: string
  contextVersion: string
  policyVersion: string
}
```

A recommendation is not a lesson instance. It is an architectural decision record for what the learning system should consider delivering.

---

## 5. Learning Purposes

```text
INTRODUCE
REBUILD_FOUNDATION
CLARIFY_CONCEPT
REPAIR_PREREQUISITE
EXPAND_REPRESENTATION
CONNECT_CONCEPTS
DEVELOP_STRATEGY
PREPARE_TRANSFER
CONSOLIDATE_UNDERSTANDING
RESOLVE_CONFLICTING_MODEL
```

### INTRODUCE

Use when the learner has sufficient prerequisites but lacks meaningful evidence of prior exposure.

### REBUILD_FOUNDATION

Use when later learning is blocked by weak or unstable foundational understanding.

### CLARIFY_CONCEPT

Use when evidence suggests partial understanding, ambiguity, or inconsistent explanation.

### REPAIR_PREREQUISITE

Use when a prerequisite is a direct blocker for a goal or curriculum requirement.

### EXPAND_REPRESENTATION

Use when the learner understands one form but cannot interpret or translate another form.

### CONNECT_CONCEPTS

Use when individual concepts exist but their relationship is missing or fragile.

### DEVELOP_STRATEGY

Use when the learner lacks a reliable method for approaching a class of problems.

### PREPARE_TRANSFER

Use before transfer practice when conceptual knowledge exists but application context changes.

### CONSOLIDATE_UNDERSTANDING

Use when evidence is positive but narrow, recent, or dependent on heavy support.

### RESOLVE_CONFLICTING_MODEL

Use when evidence supports competing interpretations and direct instruction is safer than premature practice.

---

## 6. Input Contract

```ts
interface LearningRecommendationInput {
  recommendationCaseId: string
  learnerId: string
  scope: RecommendationScope
  frozenAt: string

  assessmentClaims: AssessmentClaimSnapshot[]
  readinessClaims: ReadinessClaimSnapshot[]
  misconceptionClaims: MisconceptionClaimSnapshot[]
  transferClaims: TransferClaimSnapshot[]

  curriculumGraph: CurriculumGraphSnapshot
  learningHistory: LearningHistorySnapshot
  availableAssets: LearningAssetCatalogSnapshot
  learnerContext: LearnerContextSnapshot
  goalContext?: GoalContextSnapshot

  candidateSet: RecommendationCandidateSet
  prioritizationPolicy: PrioritizationPolicySnapshot
  learningPolicy: LearningRecommendationPolicySnapshot
}
```

Every input must be versioned or frozen. Live mutable reads during a recommendation run are prohibited.

---

## 7. Output Contract

```ts
interface LearningRecommendationResult {
  recommendationCaseId: string
  recommendationSetId: string
  status:
    | 'LEARNING_RECOMMENDATIONS_CREATED'
    | 'NO_LEARNING_ACTION_REQUIRED'
    | 'INSUFFICIENT_EVIDENCE'
    | 'NO_ELIGIBLE_ASSET'
    | 'HUMAN_REVIEW_REQUIRED'
    | 'QUARANTINED'

  recommendations: LearningRecommendation[]
  excludedCandidates: ExcludedLearningCandidate[]
  unresolvedDependencies: UnresolvedDependency[]
  limitations: RecommendationLimitation[]
  generatedAt: string
  inputDigest: string
}
```

An empty recommendation list must always include an explicit status and reason.

---

## 8. Eligibility Rules

A learning candidate is eligible only when:

1. its target identity is canonical and resolvable;
2. its source claims belong to the same learner and scope;
3. its curriculum references are valid for the frozen graph version;
4. it is not blocked by a more fundamental unresolved prerequisite;
5. an appropriate learning asset exists, or the recommendation explicitly requests content creation or human support;
6. the action does not contradict a stronger verified claim;
7. the action is permitted by policy and learner safety constraints;
8. its purpose is learning rather than practice disguised as instruction.

A candidate may remain eligible with limitations when the evidence is incomplete but the proposed action is low-risk and reversible.

---

## 9. Learning-versus-Practice Decision

Learning is recommended when the learner needs a new or reconstructed mental model.

Practice is recommended when an adequate model exists and the learner needs fluency, retention, variation, or transfer.

```text
No stable concept model
        → LEARN
Stable model, weak fluency
        → PRACTICE
Conflicting evidence
        → ASSESS or LEARN WITH LIMITATIONS
Strong supported performance
        → TRANSFER / CHALLENGE / OBSERVE
```

The runtime must not send a learner into repeated practice when evidence indicates a conceptual misunderstanding.

---

## 10. Knowledge Gap Classification

```text
UNSEEN
PARTIALLY_SEEN
CONCEPTUALLY_WEAK
REPRESENTATION_LIMITED
STRATEGY_MISSING
PREREQUISITE_BLOCKED
RELATIONSHIP_MISSING
TRANSFER_UNPREPARED
CONFLICTING_UNDERSTANDING
EVIDENCE_INSUFFICIENT
```

Gap classification is used to select learning purpose, not to create a new assessment claim.

---

## 11. Prerequisite Navigation

The runtime resolves prerequisites before proposing dependent learning.

```text
Requested Goal
   ↓
Target Skill
   ↓
Blocking Prerequisite
   ↓
Deepest Actionable Gap
   ↓
Recommended Learning Sequence
```

Rules:

- blocking prerequisites cannot be averaged away;
- dependency traversal must be deterministic;
- cycles must be detected and quarantined;
- maximum traversal depth must be policy-controlled;
- unresolved prerequisite identities must be surfaced;
- non-blocking prerequisites may influence priority but must not falsely block progress;
- already verified prerequisites must not be reintroduced without new contradictory evidence.

---

## 12. Sequence Construction

A learning sequence is required when one recommendation cannot safely reach the target.

```ts
interface LearningSequence {
  sequenceId: string
  ultimateTargetId: string
  steps: LearningSequenceStep[]
  completionLogic: SequenceCompletionLogic
  reevaluationPoints: ReevaluationPoint[]
}
```

Example:

```text
1. Rebuild fraction equivalence
2. Connect fraction equivalence to ratio
3. Introduce equation balance model
4. Connect balance model to word equations
```

Sequence rules:

- order by dependency before convenience;
- keep the sequence minimal;
- insert reassessment when uncertainty would change the next step;
- do not prescribe every future action beyond reliable evidence;
- allow the sequence to terminate early when new evidence changes the case.

---

## 13. Representation-aware Recommendation

A learner may understand a concept in one representation and fail in another.

Supported representation dimensions may include:

```text
CONCRETE_OBJECT
PICTORIAL
NUMBER_LINE
SYMBOLIC
TABLE
GRAPH
VERBAL
WORD_PROBLEM
SPATIAL
DYNAMIC_MODEL
```

The runtime should prefer representation expansion when:

- mastery evidence is representation-specific;
- translation between forms is weak;
- a goal depends on a missing representation;
- repeated errors cluster around interpretation rather than computation.

It must not collapse all representation evidence into one generic mastery value.

---

## 14. Goal Alignment

Goal context may increase relevance but cannot override prerequisites or safety.

```text
Goal relevance
      influences priority
Goal urgency
      influences sequence pressure
Goal identity
      influences target selection
Goal acceptance
      does not create mastery
```

Examples:

- entrance-exam goal may prioritize word-equation preparation;
- curriculum catch-up goal may prioritize blocking foundations;
- free exploration may broaden optional recommendations;
- teacher-assigned focus may raise relevance but not suppress contradictory evidence.

---

## 15. Curriculum Alignment

Every curriculum-aligned recommendation must reference:

- curriculum authority;
- curriculum version;
- grade or stage mapping;
- requirement identity;
- prerequisite path when relevant;
- whether the recommendation is required, supportive, or exploratory.

```text
REQUIRED
SUPPORTIVE
ENRICHMENT
EXPLORATORY
```

The runtime must distinguish learner need from administrative grade placement.

A learner in Grade 5 may receive a Grade 3 foundation recommendation when verified dependency evidence requires it, without redefining the learner's grade identity.

---

## 16. Asset Matching

The runtime may select only assets whose metadata matches the recommendation intent.

```ts
interface LearningAssetEligibility {
  targetMatch: boolean
  purposeMatch: boolean
  representationMatch: boolean
  languageFit: boolean
  accessibilityFit: boolean
  supportLevelFit: boolean
  ageAppropriateness: boolean
  policyAllowed: boolean
}
```

Asset ranking must not replace recommendation ranking. The target and purpose are decided first; asset selection occurs within that decision.

When no eligible asset exists, the runtime must produce `NO_ELIGIBLE_ASSET` or a human/content-authoring escalation rather than silently substituting unrelated content.

---

## 17. Support Level

Recommended support level may be:

```text
INDEPENDENT
LIGHT_GUIDANCE
GUIDED
SCAFFOLDED
MENTOR_SUPPORTED
TEACHER_SUPPORTED
PARENT_SUPPORTED
```

Support level must be based on evidence and delivery constraints. It is not a label of learner ability.

Repeated failure under independent delivery may justify additional support, but it must not automatically justify a stronger negative learning claim.

---

## 18. Confidence

Learning recommendation confidence expresses confidence that the proposed action is appropriate under the frozen context.

It does not express:

- mastery probability;
- expected score;
- guaranteed success;
- certainty of misconception;
- quality of the underlying lesson.

```text
Recommendation confidence
≤ confidence supportable by source evidence and policy
```

Confidence must decrease when:

- evidence is stale;
- sources conflict;
- dependency graph resolution is incomplete;
- asset coverage is weak;
- learner context is missing;
- the proposed sequence depends on unverified assumptions.

---

## 19. Explanation Contract

Every published learning recommendation must explain:

```text
WHAT should be learned
WHY this target matters now
WHICH evidence supports the decision
WHICH prerequisite or goal it serves
WHY learning is preferred over practice or assessment
WHAT limitations remain
WHEN the recommendation should be reevaluated
```

Example:

```text
Recommend: Rebuild fraction equivalence using pictorial and symbolic forms.
Reason: Equation word-problem readiness is blocked by unstable fraction relationships.
Evidence: Recent assessment claims show correct procedures in familiar items but inconsistent equivalence explanations.
Limitation: Transfer to unfamiliar contexts has not yet been assessed.
Reevaluate: After completing the learning activity and collecting explanation evidence.
```

---

## 20. Reevaluation Triggers

```text
NEW_ASSESSMENT_CLAIM
LEARNING_ACTIVITY_COMPLETED
MISCONCEPTION_STATUS_CHANGED
PREREQUISITE_VERIFIED
GOAL_CHANGED
CURRICULUM_VERSION_CHANGED
ASSET_AVAILABILITY_CHANGED
POLICY_VERSION_CHANGED
HUMAN_REVIEW_COMPLETED
RECOMMENDATION_EXPIRED
```

A recommendation must not remain active indefinitely without reevaluation.

---

## 21. Human Review

Human review is required when:

- high-impact claims conflict;
- the prerequisite graph is cyclic or unresolved;
- no safe automated learning path exists;
- learner support needs may exceed system authority;
- curriculum policy and verified learner need materially conflict;
- repeated recommendation loops fail to produce new evidence;
- a recommendation would significantly change an accepted goal path.

Human review may approve, limit, defer, or reject a recommendation. It cannot rewrite historical evidence.

---

## 22. Failure Codes

```text
LEARNING_REC_INPUT_SCOPE_MISMATCH
LEARNING_REC_CLAIM_PROVENANCE_INVALID
LEARNING_REC_TARGET_UNRESOLVED
LEARNING_REC_PREREQUISITE_CYCLE
LEARNING_REC_PREREQUISITE_UNRESOLVED
LEARNING_REC_CONTRADICTS_STRONGER_CLAIM
LEARNING_REC_NO_ELIGIBLE_ASSET
LEARNING_REC_POLICY_PROHIBITED
LEARNING_REC_NON_DETERMINISTIC_ORDER
LEARNING_REC_CONFIDENCE_EXCEEDS_EVIDENCE
LEARNING_REC_EXPLANATION_INCOMPLETE
LEARNING_REC_STALE_CONTEXT
LEARNING_REC_HUMAN_REVIEW_REQUIRED
LEARNING_REC_QUARANTINED
```

---

## 23. Determinism

For identical frozen inputs and policy versions, the runtime must produce:

- the same eligible recommendation identities;
- the same dependency ordering;
- the same purpose classification;
- the same priority bands;
- the same explanation reason codes;
- the same exclusions and limitations.

Timestamps, generated identifiers, and non-semantic metadata may differ only when explicitly excluded from deterministic comparison.

---

## 24. Observability

Runtime telemetry should record:

```text
learning candidates evaluated
eligible learning recommendations
excluded recommendations by reason
prerequisite depth
unresolved dependencies
asset coverage failures
human-review escalations
recommendation confidence distribution
recommendation age
reevaluation trigger frequency
```

Telemetry must not expose sensitive learner data beyond authorized operational scope.

---

## 25. Example — Word Equation Preparation

Frozen evidence:

```text
Fractions: procedural success, weak explanation
Equation balance: limited evidence
Word-problem translation: low readiness
Goal: prepare for Grade 7 entrance examination
```

Unsafe recommendation:

```text
PRACTICE harder word equations repeatedly
```

Safer recommendation sequence:

```text
1. REBUILD_FOUNDATION — fraction equivalence
2. EXPAND_REPRESENTATION — verbal ↔ symbolic relationships
3. INTRODUCE — equation balance model
4. CONNECT_CONCEPTS — balance model ↔ word statements
5. Reassess before full word-equation practice
```

The goal affects relevance and urgency, but prerequisite evidence determines the sequence.

---

## 26. Acceptance Criteria

27D is satisfied when the architecture ensures that:

- learning recommendations are distinct from lessons and practice;
- every recommendation is traceable to frozen evidence;
- prerequisites are navigated deterministically;
- conceptual repair is preferred over blind repetition;
- representation gaps remain visible;
- curriculum and learner goals influence but do not corrupt evidence;
- no eligible asset is handled explicitly;
- confidence is bounded by source support;
- every publication includes explanation and reevaluation logic;
- identical inputs replay to the same semantic result.

---

## 27. Completion Statement

Learning Recommendation Runtime is defined as the recommendation authority for proposing what understanding should be introduced, repaired, clarified, connected, or expanded next.

It preserves the separation between evidence, decision, instruction, and learner outcome:

```text
Evidence describes the learner.
Recommendation proposes the next learning action.
Learning Engine delivers the experience.
Assessment evaluates what changed.
```
