# 27A — Recommendation Engine Foundation

## Status

- Chapter: 27 — Recommendation Engine Architecture
- Slice: 27A
- State: FOUNDATION DEFINED
- Depends on: Chapter 25 Learning Engine, Chapter 26 Assessment Engine

---

## 1. Purpose

The Recommendation Engine converts verified learning and assessment truth into explainable next-action proposals.

It answers:

> Given what is currently known, what action is most appropriate next, for whom, and why?

The engine is a decision-support runtime. It does not own mastery, readiness, misconceptions, curriculum truth, mission completion, scheduling, or gameplay execution.

Its responsibility is to produce bounded, versioned, reviewable recommendations that downstream runtimes may accept, defer, adapt, or reject according to their own authority.

---

## 2. Core Principle

```text
Assessment establishes what the evidence supports.
Recommendation proposes what should happen next.
Mission turns an accepted proposal into an intentional goal.
Gameplay delivers the experience.
```

Recommendation must never rewrite the evidence that informed it.

---

## 3. Runtime Position

```text
World / Discovery Runtime
          ↓
Learning Runtime
          ↓
Assessment Runtime
          ↓
Verified Assessment Claims
+ Learning State
+ Goal Context
+ Curriculum Policy
+ Delivery Constraints
          ↓
Recommendation Engine
          ↓
Recommendation Set
          ↓
Mission / Learning / Practice / Mentor / Projection Consumers
```

The Recommendation Engine consumes authoritative upstream facts and produces advisory downstream decisions.

---

## 4. Authority Boundary

### 4.1 The Recommendation Engine owns

- recommendation-case lifecycle,
- candidate generation orchestration,
- candidate eligibility decisions,
- prioritization and ordering,
- recommendation rationale,
- confidence and limitation propagation,
- recommendation supersession,
- recommendation-set publication state,
- recommendation decision lineage.

### 4.2 The Recommendation Engine does not own

- assessment claims,
- mastery state,
- curriculum definitions,
- prerequisite graph truth,
- mission state,
- lesson content,
- practice-item generation,
- teacher or parent consent,
- calendar scheduling,
- reward allocation,
- gameplay progression,
- automatic remediation purchase decisions.

### 4.3 Forbidden authority escalation

The engine must not:

- raise assessment confidence,
- convert unknown into weak,
- erase contradictions,
- mark misconceptions resolved,
- declare readiness without Assessment authority,
- unlock curriculum content directly,
- assign mandatory missions without downstream policy,
- hide material limitations,
- replace a human decision where policy requires human review.

---

## 5. Recommendation Philosophy

The engine recommends the **best next action**, not merely the next content item.

A recommendation may be:

- continue learning,
- practice a representation,
- review a prerequisite,
- gather more evidence,
- attempt a transfer task,
- pause and observe,
- request mentor support,
- invite parent support,
- propose a mission,
- explore an optional challenge.

The correct next action may therefore be `ASSESS`, `WAIT`, or `REVIEW` rather than `LEARN`.

---

## 6. Primary Aggregate

### 6.1 RecommendationCase

`RecommendationCase` is the aggregate root for one bounded recommendation decision context.

Required identity:

```text
recommendationCaseId
tenantId
learnerId
scopeType
scopeId
caseVersion
createdAt
updatedAt
```

Required authority references:

```text
assessmentClaimSetId
assessmentClaimSetVersion
learningStateVersion
curriculumPolicyVersion
recommendationPolicyVersion
```

Optional context references:

```text
activeMissionId
learnerGoalId
classroomContextId
parentSupportContextId
deliveryEnvironmentId
```

### 6.2 Scope

A case must have an explicit scope such as:

```text
SKILL
CONCEPT
PREREQUISITE_CHAIN
CURRICULUM_UNIT
MISSION_PREPARATION
TRANSFER_CAPABILITY
LEARNING_HEALTH
```

A case must not silently combine unrelated scopes.

---

## 7. Recommendation Lifecycle

```text
OPEN
  ↓
CONTEXT_FROZEN
  ↓
CANDIDATES_GENERATED
  ↓
CANDIDATES_EVALUATED
  ↓
PRIORITIZED
  ↓
VERIFIED
  ↓
PUBLISHED
```

Alternative terminal or control states:

```text
HELD_FOR_REVIEW
QUARANTINED
SUPERSEDED
EXPIRED
CANCELLED
```

### 7.1 Transition authority

Only the Recommendation Engine may transition recommendation-case state.

Downstream consumers may report:

- accepted,
- declined,
- deferred,
- started,
- completed,
- abandoned,

but these are response facts, not permission to rewrite the original recommendation decision.

---

## 8. Input Contract

A recommendation request must include or resolve:

```text
Request Identity
+ Learner Identity
+ Tenant Identity
+ Recommendation Scope
+ Verified Assessment Claims
+ Learning State Snapshot
+ Curriculum / Dependency Context
+ Recommendation Policy
+ Audience / Consumer Context
```

Optional inputs:

```text
Learner Goal
Active Mission
Recent Recommendation Outcomes
Available Time Window
Delivery Modality
Accessibility Needs
Teacher Constraints
Parent Support Availability
```

### 8.1 Required upstream status

Assessment-derived inputs must carry a publication decision compatible with the intended recommendation consumer.

Examples:

```text
PUBLISH                     → generally eligible
PUBLISH_WITH_LIMITATIONS    → eligible with propagated limitations
RESTRICTED_AUDIENCE         → audience check required
HOLD_FOR_REVIEW             → not eligible for automatic recommendation
QUARANTINE                  → prohibited
REJECT                      → prohibited
```

---

## 9. Output Contract

The engine produces a versioned `RecommendationSet`.

```text
recommendationSetId
recommendationCaseId
recommendationCaseVersion
policyVersion
generatedAt
recommendations[]
setLimitations[]
publicationDecision
verificationReference
```

Each recommendation requires:

```text
recommendationId
type
targetType
targetId
priorityBand
rank
rationale
sourceClaimReferences[]
confidence
limitations[]
blockingConditions[]
expectedOutcome
expiryPolicy
```

---

## 10. Recommendation Types

Initial controlled vocabulary:

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

Types describe the proposed action family. They do not grant execution authority.

---

## 11. Confidence Semantics

Recommendation confidence describes confidence that the action is appropriate under the frozen context.

It is not mastery confidence and not probability of success.

A recommendation confidence must be bounded by:

- source-claim confidence,
- source coverage,
- contradiction severity,
- policy certainty,
- dependency certainty,
- context freshness.

```text
recommendation confidence
≤ confidence justified by its weakest material dependency
```

The engine must not average away a blocking uncertainty.

---

## 12. Rationale Contract

Every published recommendation must explain:

```text
WHAT is recommended
WHY it is recommended
WHICH evidence or claims support it
WHY it is ordered before alternatives
WHAT limitations remain
WHAT condition should cause reevaluation
```

Forbidden rationale:

```text
AI selected this
system thinks this is best
low score
because the learner is weak
```

Required rationale language must distinguish:

- observed evidence,
- interpreted claims,
- policy decisions,
- recommendation judgment.

---

## 13. Limitation Propagation

Material upstream limitations must be preserved.

Examples:

```text
STALE_EVIDENCE
LIMITED_REPRESENTATION_COVERAGE
CONTRADICTORY_EVIDENCE
SUPPORT_DEPENDENT_EVIDENCE
INSUFFICIENT_TRANSFER_EVIDENCE
INCOMPLETE_PREREQUISITE_COVERAGE
POLICY_VERSION_MISMATCH
DELIVERY_CONSTRAINT_UNKNOWN
```

A projection may simplify wording, but no consumer-facing projection may remove a limitation that changes the meaning or safety of the recommendation.

---

## 14. Recommendation Policy

Recommendation behavior must be controlled by an explicit, versioned policy.

A policy may define:

- eligible recommendation types,
- blocking requirements,
- priority bands,
- freshness windows,
- confidence thresholds,
- human-review thresholds,
- maximum recommendation-set size,
- diversity requirements,
- repetition suppression,
- expiry rules,
- audience restrictions.

Policy changes apply prospectively unless a deliberate comparison or replay operation is requested.

---

## 15. Determinism

Given the same:

```text
frozen input context
+ policy version
+ model version
+ dependency graph version
+ clock
+ random seed, when used
```

candidate generation and prioritization must be reproducible.

Non-deterministic exploration is permitted only when:

- the policy explicitly allows it,
- the random seed is recorded,
- all eligible alternatives are traceable,
- safety and blocking rules are applied before random selection.

---

## 16. Idempotency

A recommendation command must carry:

```text
commandId
correlationId
expectedCaseVersion
```

Repeated execution of the same accepted command must return the previously recorded result or an explicit idempotent replay outcome.

It must not create duplicate recommendations.

---

## 17. Concurrency

Recommendation cases use optimistic concurrency.

Possible outcomes:

```text
WRITTEN
IDEMPOTENT_REPLAY
VERSION_CONFLICT
CONTEXT_STALE
POLICY_MISMATCH
INTEGRITY_FAILURE
```

Last-write-wins is prohibited for recommendation authority.

---

## 18. Supersession and Expiry

Recommendations are not edited in place after publication.

```text
Recommendation V1
        ↓ superseded by
Recommendation V2
```

Supersession must record:

- previous recommendation ID,
- replacement recommendation ID,
- reason,
- triggering evidence or context change,
- timestamp,
- actor or runtime authority.

A recommendation may expire because of:

- new assessment evidence,
- completed target action,
- mission change,
- policy expiry window,
- curriculum revision,
- delivery-context change.

Expiry does not delete history.

---

## 19. Consumer Boundary

Consumers must decide whether to execute or present a recommendation.

Examples:

```text
Learning Runtime → load lesson
Practice Runtime → construct practice session
Mission Runtime  → propose or create goal under mission policy
Mentor Runtime   → request support
Projection       → present role-appropriate explanation
```

A consumer must preserve recommendation identity so outcomes can be traced back to the decision that proposed them.

---

## 20. Outcome Feedback

Recommendation outcomes may inform future recommendation decisions, but they do not retroactively prove the original recommendation was correct or incorrect.

Outcome facts may include:

```text
ACCEPTED
DECLINED
DEFERRED
STARTED
COMPLETED
ABANDONED
NOT_AVAILABLE
SUPERSEDED_BEFORE_START
```

Learning and assessment evidence created during execution must return through their owning runtimes before influencing a new recommendation.

---

## 21. Privacy and Audience Safety

Recommendation generation and projection must respect:

- tenant isolation,
- learner identity boundaries,
- role eligibility,
- consent requirements,
- age-appropriate explanation,
- sensitive inference restrictions,
- minimum necessary disclosure.

A recommendation must not expose diagnostic detail to an audience that is only authorized to receive an action summary.

---

## 22. Foundation Invariants

```text
REC-FND-001  Every recommendation belongs to exactly one RecommendationCase.
REC-FND-002  Every case has explicit learner, tenant, and scope identity.
REC-FND-003  Published recommendations reference frozen authoritative inputs.
REC-FND-004  Recommendation never mutates Assessment truth.
REC-FND-005  Recommendation confidence never upgrades source authority.
REC-FND-006  Material limitations are propagated.
REC-FND-007  Every recommendation is explainable and traceable.
REC-FND-008  Recommendation is advisory until accepted by a downstream authority.
REC-FND-009  Published recommendations are superseded, not overwritten.
REC-FND-010  Repeated commands are idempotent.
REC-FND-011  Version conflicts never fall back to last-write-wins.
REC-FND-012  Quarantined assessment inputs cannot drive automatic recommendations.
```

---

## 23. Failure Codes

Initial failure vocabulary:

```text
RECOMMENDATION_CASE_NOT_FOUND
RECOMMENDATION_CASE_VERSION_CONFLICT
RECOMMENDATION_SCOPE_INVALID
ASSESSMENT_INPUT_NOT_PUBLISHABLE
ASSESSMENT_INPUT_QUARANTINED
SOURCE_CLAIM_MISSING
SOURCE_CLAIM_STALE
POLICY_NOT_FOUND
POLICY_VERSION_MISMATCH
DEPENDENCY_CONTEXT_MISSING
CANDIDATE_SET_EMPTY
RECOMMENDATION_NOT_EXPLAINABLE
RECOMMENDATION_CONFIDENCE_INVALID
LIMITATION_PROPAGATION_FAILED
AUDIENCE_NOT_ELIGIBLE
CONSENT_REQUIRED
IDEMPOTENCY_CONFLICT
RECOMMENDATION_INTEGRITY_FAILURE
```

---

## 24. Public Contract Direction

Future implementation should expose explicit commands and results rather than generic mutation endpoints.

Candidate command families:

```text
OpenRecommendationCase
FreezeRecommendationContext
GenerateRecommendationCandidates
PrioritizeRecommendationCandidates
VerifyRecommendationSet
PublishRecommendationSet
SupersedeRecommendation
ExpireRecommendation
RecordRecommendationOutcome
```

No public command named `SetRecommendationScore`, `ForceRecommendation`, or `MarkLearnerWeak` is permitted.

---

## 25. Completion Criteria

27A is complete when the repository defines:

- Recommendation authority,
- aggregate and lifecycle,
- input and output contracts,
- confidence and limitation semantics,
- deterministic and idempotent execution expectations,
- downstream consumer boundary,
- foundation invariants and failures.

Implementation, persistence, projection, verification, and runtime-wide invariants are defined by later Chapter 27 slices.
