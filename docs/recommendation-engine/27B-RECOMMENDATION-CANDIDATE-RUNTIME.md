# 27B — Recommendation Candidate Runtime

## Status

- Chapter: 27 — Recommendation Engine Architecture
- Slice: 27B
- State: CANDIDATE RUNTIME DEFINED
- Depends on: 27A Recommendation Engine Foundation

---

## 1. Purpose

The Recommendation Candidate Runtime creates the bounded set of actions that are eligible to be considered for recommendation.

It answers:

> What actions are plausible, allowed, sufficiently grounded, and relevant within this frozen recommendation context?

Candidate generation must be broader than final recommendation selection but narrower than the entire catalog of possible actions.

A candidate is not yet a recommendation.

---

## 2. Runtime Position

```text
Frozen Recommendation Context
+ Verified Assessment Claims
+ Learning State
+ Curriculum and Dependency Graph
+ Available Learning Assets
+ Recommendation Policy
          ↓
Candidate Source Adapters
          ↓
Candidate Generation
          ↓
Eligibility Evaluation
          ↓
Deduplication and Normalization
          ↓
Recommendation Candidate Set
          ↓
27C Prioritization Runtime
```

The Candidate Runtime owns inclusion eligibility. It does not own final order or publication.

---

## 3. Candidate Definition

A `RecommendationCandidate` is a versioned proposal for one bounded next action.

Required fields:

```text
candidateId
recommendationCaseId
candidateType
targetType
targetId
sourceKind
sourceReferences[]
eligibilityState
rationaleSeed
expectedLearningPurpose
constraints[]
limitations[]
createdAt
```

Optional fields:

```text
prerequisiteTargets[]
dependencyDepth
estimatedEffort
deliveryModes[]
audienceRestrictions[]
noveltyClass
recentExposureReference
```

---

## 4. Candidate Sources

Candidate sources may include:

```text
ASSESSMENT_GAP
READINESS_BLOCKER
MISCONCEPTION_HYPOTHESIS
TRANSFER_GAP
PREREQUISITE_GRAPH
LEARNING_PATH
CURRICULUM_REQUIREMENT
SPACED_REVIEW_POLICY
MISSION_PREPARATION
LEARNER_GOAL
TEACHER_CONSTRAINT
MENTOR_SUPPORT_OPTION
EXPLORATION_POLICY
EVIDENCE_GATHERING_NEED
```

Each candidate must identify at least one source kind and one traceable source reference.

---

## 5. Candidate Types

The Candidate Runtime uses the controlled action families established in 27A:

```text
LEARN
PRACTICE
REVIEW
ASSESS
TRANSFER
EXPLORE
CHALLENGE
MISSION
MENTOR
PARENT_SUPPORT
TEACHER_REVIEW
WAIT
OBSERVE
```

A source adapter must not invent a new candidate type without a versioned contract change.

---

## 6. Candidate Generation Strategies

### 6.1 Claim-driven generation

Generate candidates directly from assessment claims.

Examples:

```text
Readiness blocker       → REVIEW prerequisite
Low representation span → PRACTICE alternate representation
Insufficient evidence   → ASSESS targeted opportunity
Transfer uncertainty    → TRANSFER task
Misconception hypothesis→ PRACTICE diagnostic contrast
```

### 6.2 Dependency expansion

A target may be expanded into prerequisite candidates when dependency policy requires it.

```text
Target Skill
   ↓
Blocking Prerequisite A
   ↓
Blocking Prerequisite B
```

Expansion must preserve:

- dependency graph version,
- edge type,
- dependency depth,
- blocking versus supportive status,
- cycle detection result.

### 6.3 Goal-driven generation

An active learner goal or mission-preparation context may add candidates that close the distance to the goal.

Goal pressure must not bypass readiness or safety constraints.

### 6.4 Maintenance generation

Spaced review, retention risk, and dormant mastery may produce maintenance candidates even when no current weakness exists.

### 6.5 Exploration generation

Exploration candidates may be generated when policy permits and core blockers do not require exclusive attention.

Exploration is optional and must never be mislabeled as required remediation.

---

## 7. Eligibility States

Every candidate receives one explicit state:

```text
ELIGIBLE
ELIGIBLE_WITH_LIMITATIONS
REQUIRES_HUMAN_REVIEW
DEFERRED
BLOCKED
INELIGIBLE
QUARANTINED
```

Only `ELIGIBLE` and `ELIGIBLE_WITH_LIMITATIONS` proceed automatically to prioritization.

`REQUIRES_HUMAN_REVIEW` may proceed only through a policy-authorized review path.

---

## 8. Eligibility Rules

A candidate is eligible only when all required conditions hold:

```text
identity is valid
scope matches the case
source claims are publishable for the consumer
source references resolve
candidate target exists
candidate type is allowed by policy
blocking prerequisites are represented
required delivery capability exists or is explicitly deferred
confidence is sufficient for the action type
material limitations are attached
privacy and audience constraints are satisfied
```

Eligibility is conjunctive for blocking conditions. Strong performance elsewhere cannot compensate for a failed blocker.

---

## 9. Blocking Conditions

Initial blocking vocabulary:

```text
SOURCE_CLAIM_UNPUBLISHABLE
SOURCE_CLAIM_QUARANTINED
TARGET_NOT_FOUND
TARGET_OUTSIDE_SCOPE
PREREQUISITE_UNKNOWN
PREREQUISITE_NOT_READY
DEPENDENCY_CYCLE
CONTENT_NOT_AVAILABLE
DELIVERY_MODE_UNAVAILABLE
CONSENT_REQUIRED
AUDIENCE_NOT_ELIGIBLE
POLICY_PROHIBITED
CONFIDENCE_BELOW_ACTION_THRESHOLD
CONTRADICTION_REQUIRES_REVIEW
RECENTLY_COMPLETED
DUPLICATE_ACTIVE_ACTION
```

A blocked candidate remains part of decision lineage unless policy permits omission from external projection.

---

## 10. Candidate Normalization

Source adapters may produce different source-specific structures. The runtime must normalize them into one candidate contract.

Normalization includes:

- canonical target identity,
- canonical candidate type,
- normalized source references,
- explicit scope,
- limitation codes,
- dependency metadata,
- effort estimate semantics,
- delivery capability requirements.

Normalization must not alter upstream claim meaning.

---

## 11. Candidate Identity

Candidate identity must be stable within a frozen case.

A deterministic identity key should derive from:

```text
recommendationCaseId
candidateType
targetType
targetId
sourcePurpose
policyVersion
```

Equivalent candidate proposals from multiple source adapters should converge on one candidate identity with multiple source references.

---

## 12. Deduplication

Deduplication combines semantically equivalent candidates.

Example:

```text
Assessment gap → REVIEW FRACTION_EQUIVALENCE
Prerequisite graph → REVIEW FRACTION_EQUIVALENCE
Mission preparation → REVIEW FRACTION_EQUIVALENCE
```

becomes one candidate with three supporting source references.

Deduplication must not merge candidates when any of these differ materially:

- action type,
- target,
- learning purpose,
- required delivery mode,
- audience,
- blocking condition,
- expected outcome.

---

## 13. Contradictory Sources

Contradictory source claims must be preserved.

Possible outcomes:

```text
candidate remains eligible with contradiction limitation
candidate requires human review
candidate is deferred pending evidence
candidate becomes ASSESS rather than LEARN or PRACTICE
```

The runtime must never silently choose the more convenient claim.

---

## 14. Empty Candidate Sets

An empty candidate set is a valid outcome only when accompanied by a reason.

Possible reasons:

```text
NO_ACTION_REQUIRED
INSUFFICIENT_CONTEXT
ALL_CANDIDATES_BLOCKED
ALL_CANDIDATES_RECENTLY_COMPLETED
DELIVERY_CAPABILITY_UNAVAILABLE
HUMAN_REVIEW_REQUIRED
POLICY_PROHIBITS_AUTOMATION
```

An empty set must not be interpreted as learner mastery.

---

## 15. Candidate Set Contract

```text
candidateSetId
recommendationCaseId
caseVersion
contextSnapshotId
policyVersion
dependencyGraphVersion
generatedAt
generationRunId
candidates[]
blockedCandidateCount
reviewCandidateCount
setLimitations[]
emptySetReason
```

The set is immutable once frozen for prioritization.

---

## 16. Source Adapter Contract

Each adapter must declare:

```text
adapterId
adapterVersion
supportedSourceKinds[]
supportedCandidateTypes[]
requiredInputs[]
outputSchemaVersion
determinismClass
```

Adapter output requires:

```text
proposedCandidateKey
candidateType
targetReference
sourceReferences[]
rationaleSeed
constraints[]
limitations[]
```

Adapters cannot publish recommendations directly.

---

## 17. Dependency Graph Safety

Dependency expansion must enforce:

- graph-version pinning,
- tenant and curriculum scope,
- cycle detection,
- maximum traversal depth,
- explicit edge semantics,
- unresolved-node handling,
- deterministic traversal order.

A cycle must produce a finding and must not be traversed indefinitely.

---

## 18. Availability and Delivery Constraints

A pedagogically appropriate action may still be operationally unavailable.

Examples:

- lesson asset missing,
- practice renderer unsupported,
- mentor unavailable,
- accessibility requirement unsupported,
- offline mode lacks the asset,
- target language unavailable.

The Candidate Runtime records this as a constraint or blocker. It does not fabricate availability.

---

## 19. Repetition Control

Candidate generation must consider recent recommendation and execution history.

Policy may suppress or limit:

- identical unfinished actions,
- recently completed actions,
- repeated declined actions,
- excessive practice of one representation,
- repeated assessment without new learning opportunity.

Suppression must be explainable and time-bounded.

---

## 20. Diversity Requirements

A candidate set may be required to preserve meaningful alternatives such as:

```text
core remediation
alternative representation
assessment opportunity
optional exploration
human support path
```

Diversity must not introduce ineligible actions merely to fill categories.

---

## 21. Confidence Handling

Candidate confidence is not final recommendation confidence.

It represents whether the candidate is sufficiently grounded to enter prioritization.

Candidate confidence must derive from:

- source claim strength,
- target identity certainty,
- dependency certainty,
- policy applicability,
- context freshness.

A source adapter may propose confidence factors but the Candidate Runtime owns the normalized eligibility result.

---

## 22. Limitation Handling

Candidate limitations must include all material upstream limitations plus candidate-specific limitations.

Candidate-specific examples:

```text
CONTENT_AVAILABILITY_UNCONFIRMED
ESTIMATED_EFFORT_LOW_CONFIDENCE
DELIVERY_MODE_LIMITED
DEPENDENCY_GRAPH_PARTIAL
RECENT_OUTCOME_UNKNOWN
GOAL_DEADLINE_UNVERIFIED
```

Limitations are additive; normalization must not discard them.

---

## 23. Determinism and Replay

Given the same frozen context, adapters, policies, and graph versions, candidate generation must reproduce:

- candidate identities,
- source references,
- eligibility states,
- blockers,
- limitations,
- deterministic ordering before prioritization.

Any stochastic exploration proposal must record its random seed and eligible population.

---

## 24. Commands

Candidate runtime command families:

```text
GenerateRecommendationCandidates
EvaluateCandidateEligibility
ExpandCandidateDependencies
NormalizeRecommendationCandidates
DeduplicateRecommendationCandidates
FreezeRecommendationCandidateSet
```

Commands require:

```text
commandId
correlationId
recommendationCaseId
expectedCaseVersion
contextSnapshotId
policyVersion
```

---

## 25. Events

Initial event vocabulary:

```text
RECOMMENDATION_CANDIDATE_GENERATION_STARTED
RECOMMENDATION_CANDIDATE_PROPOSED
RECOMMENDATION_CANDIDATE_NORMALIZED
RECOMMENDATION_CANDIDATE_MERGED
RECOMMENDATION_CANDIDATE_BLOCKED
RECOMMENDATION_CANDIDATE_DEFERRED
RECOMMENDATION_CANDIDATE_REQUIRES_REVIEW
RECOMMENDATION_CANDIDATE_SET_FROZEN
RECOMMENDATION_CANDIDATE_SET_EMPTY
```

Events must carry policy and context versions.

---

## 26. Failure Codes

```text
RECOMMENDATION_CONTEXT_NOT_FROZEN
CANDIDATE_SOURCE_ADAPTER_NOT_FOUND
CANDIDATE_SOURCE_INPUT_MISSING
CANDIDATE_TARGET_INVALID
CANDIDATE_SCOPE_MISMATCH
CANDIDATE_TYPE_NOT_ALLOWED
CANDIDATE_SOURCE_UNTRACEABLE
DEPENDENCY_GRAPH_NOT_FOUND
DEPENDENCY_GRAPH_VERSION_MISMATCH
DEPENDENCY_CYCLE_DETECTED
DEPENDENCY_TRAVERSAL_LIMIT_EXCEEDED
CANDIDATE_DEDUPLICATION_CONFLICT
CANDIDATE_ELIGIBILITY_UNRESOLVED
CANDIDATE_SET_ALREADY_FROZEN
CANDIDATE_GENERATION_INTEGRITY_FAILURE
```

---

## 27. Candidate Runtime Invariants

```text
REC-CAN-001  A candidate is not a published recommendation.
REC-CAN-002  Every candidate has a traceable source.
REC-CAN-003  Every candidate target is canonical and scope-valid.
REC-CAN-004  Eligibility blockers cannot be averaged away.
REC-CAN-005  Quarantined source claims cannot produce automatic candidates.
REC-CAN-006  Contradictory sources remain visible.
REC-CAN-007  Deduplication preserves every material source reference.
REC-CAN-008  Dependency traversal is versioned, bounded, and cycle-safe.
REC-CAN-009  Frozen candidate sets are immutable.
REC-CAN-010  Empty candidate sets carry an explicit reason.
REC-CAN-011  Availability is verified or explicitly uncertain.
REC-CAN-012  Candidate generation is reproducible from frozen inputs.
```

---

## 28. Completion Criteria

27B is complete when the repository defines:

- candidate identity and contract,
- candidate source adapters,
- generation strategies,
- eligibility and blocking semantics,
- dependency expansion,
- normalization and deduplication,
- empty-set behavior,
- deterministic candidate-set freezing,
- candidate events, failures, and invariants.

Final recommendation order belongs to 27C.
