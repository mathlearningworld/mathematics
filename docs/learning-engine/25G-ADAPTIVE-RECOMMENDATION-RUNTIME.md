# 25G — Adaptive Recommendation Runtime

## 1. Purpose

The Adaptive Recommendation Runtime converts authoritative learning evidence into a small, explainable set of next learning opportunities.

It does not decide what the learner must become, does not assign permanent labels, and does not manufacture evidence. Its responsibility is narrower:

> Select the next useful opportunity from the learner's current state, goals, constraints, and available world experiences.

The runtime sits between Learning Path authority and Mission opportunity selection.

```text
Learning State
  + Mastery Claims
  + Transfer Claims
  + Learning Path
  + Knowledge Graph
  + Available Opportunities
  + Learner Context
        ↓
Adaptive Recommendation Runtime
        ↓
Ranked Recommendation Set
        ↓
Mission / Experience Selection
```

---

## 2. Architectural Boundary

### The runtime owns

- candidate eligibility
- pedagogical usefulness scoring
- urgency and readiness balancing
- novelty and repetition balancing
- support-level matching
- overload and fatigue protection
- recommendation diversity
- explanation generation
- recommendation lifecycle
- recommendation invalidation
- auditability and replay

### The runtime does not own

- world truth
- discovery truth
- learning-state mutation
- mastery policy
- transfer evaluation
- curriculum definition
- mission execution
- reward economy
- parent or teacher authority
- learner identity classification

A recommendation is advice produced from current evidence. It is not a command and not a fact about the learner.

---

## 3. Core Principle

The runtime must optimize for the **next useful learning opportunity**, not the highest score, shortest completion time, or most content consumed.

A good recommendation should balance:

```text
Learning Value
+ Learner Readiness
+ Goal Relevance
+ Evidence Need
+ Transfer Opportunity
+ Retention Timing
+ Motivation Fit
- Cognitive Overload
- Redundant Repetition
- Support Dependence Risk
- Misconception Reinforcement Risk
```

No single scalar may erase the underlying reasons.

---

## 4. Recommendation Inputs

### 4.1 Learner Concept State

Relevant dimensions include:

- learning status
- confidence
- stability
- transfer breadth
- retention condition
- support dependence
- contradiction burden
- representation coverage
- strategy flexibility

### 4.2 Mastery Claims

Recommendations may respond to:

- insufficient evidence
- provisional mastery
- context-bound mastery
- support-dependent mastery
- robust mastery
- dormant mastery
- contradicted mastery

Mastery claims must be read with their scope, policy version, limitations, and evidence references.

### 4.3 Transfer Claims

Transfer evidence helps determine whether the next opportunity should be:

- variation within the same representation
- near transfer
- cross-representation transfer
- cross-context transfer
- strategy transfer
- far transfer
- misconception contrast after negative transfer

### 4.4 Learning Path

The path provides intent and route structure. The recommendation runtime does not rewrite the path silently. It may select among eligible path steps or propose a path revision request.

### 4.5 Available Opportunity Catalog

Every opportunity must declare metadata sufficient for safe matching:

```text
Opportunity
- opportunityId
- version
- conceptTargets
- prerequisiteExpectations
- representationProfile
- contextProfile
- strategyDemand
- supportProfile
- estimatedEffort
- cognitiveLoad
- transferDistance
- misconceptionExposure
- accessibilityRequirements
- missionTemplateRef
- availabilityWindow
```

An opportunity without declared learning semantics must not be treated as an authoritative recommendation candidate.

### 4.6 Learner Context

Context may include:

- current session duration
- recent frustration signals
- recent success pattern
- support recently used
- preferred interaction mode
- accessibility settings
- device constraints
- available time window
- learner-declared goal
- teacher or parent goal constraints

Sensitive context must be minimized, consent-aware, and purpose-bound.

---

## 5. Recommendation Types

The runtime may emit recommendation intents such as:

```text
DISCOVERY_OPPORTUNITY
STABILIZATION_PRACTICE
VARIATION_PRACTICE
REPRESENTATION_BRIDGE
NEAR_TRANSFER_CHALLENGE
FAR_TRANSFER_CHALLENGE
RETENTION_CHECK
MISCONCEPTION_CONTRAST
FOUNDATION_RECOVERY
STRATEGY_EXPANSION
INTEGRATION_TASK
OPEN_EXPLORATION
REST_OR_DEFER
MENTOR_REVIEW_SUGGESTION
```

`REST_OR_DEFER` is a valid recommendation. The runtime must be able to decide that another task is not currently useful.

---

## 6. Candidate Generation

Candidate generation begins with the active learning path and knowledge graph.

```text
Active Goals
  → Eligible Path Steps
    → Knowledge Graph Expansion
      → Available Opportunity Match
        → Candidate Pool
```

### Eligibility checks

A candidate may be excluded when:

- required prerequisite evidence is absent
- opportunity version is incompatible
- required world affordance is unavailable
- accessibility constraints are not met
- the same opportunity was recently overused
- the candidate would reinforce a known misconception
- the support level is mismatched
- the learner is already overloaded
- the opportunity is outside consent or policy boundaries

Eligibility is a hard gate. Ranking cannot resurrect an ineligible candidate.

---

## 7. Recommendation Dimensions

Each candidate is evaluated across explicit dimensions.

### 7.1 Goal relevance

How directly does the opportunity contribute to the active learning goal?

### 7.2 Evidence value

What unresolved learning question could this opportunity clarify?

Examples:

- whether understanding persists after time
- whether a strategy transfers to a new representation
- whether success was independent
- whether a contradiction is stable or accidental

### 7.3 Readiness fit

Is the learner likely to engage productively without the task being trivial or overwhelming?

### 7.4 Transfer value

Does the opportunity broaden understanding beyond the current context?

### 7.5 Retention timing

Is this an appropriate moment for a delayed revisit?

### 7.6 Support match

Does the offered scaffolding align with current support dependence?

### 7.7 Diversity value

Does the recommendation add representation, strategy, or context variety?

### 7.8 Motivation fit

Does it align with current learner intent, chosen theme, or open exploration?

### 7.9 Risk

Potential risks include:

- overload
- frustration escalation
- repetitive drilling
- false confidence
- misconception reinforcement
- dependency on hints
- narrowing to a single strategy

---

## 8. Ranking Without Opaque Authority

The runtime may calculate internal scores, but the result must retain dimension-level reasons.

```text
CandidateEvaluation
- candidateId
- eligibility
- goalRelevance
- evidenceValue
- readinessFit
- transferValue
- retentionValue
- supportMatch
- diversityValue
- motivationFit
- riskProfile
- policyVersion
- evidenceRefs
- explanationReasons
```

The selected recommendation must be reproducible from:

- input snapshot
- candidate catalog version
- policy version
- evaluation rules
- deterministic tie-break rules

Machine-learned ranking may assist only when bounded by these explicit constraints and must never become the sole authority for pedagogical decisions.

---

## 9. Diversity and Anti-Loop Policy

The runtime must prevent recommendation loops that repeatedly offer the same form of activity.

Diversity controls should consider:

- concept diversity
- representation diversity
- context diversity
- strategy diversity
- transfer distance
- activity modality
- support level

Example anti-loop rule:

```text
If the last three accepted opportunities used the same representation,
prefer an eligible representation bridge unless evidence explicitly requires repetition.
```

Repetition is valid when it serves a declared purpose, such as stabilization or retention. Unexplained repetition is not adaptive learning.

---

## 10. Support Adaptation

Recommendations must distinguish between changing the task and changing the support.

Possible actions:

```text
KEEP_TASK_REDUCE_SUPPORT
KEEP_TASK_INCREASE_SUPPORT
SIMPLIFY_REPRESENTATION
REDUCE_CONSTRAINTS
ADD_ATTENTION_CUE
OFFER_REFLECTIVE_PROMPT
OFFER_EXPERIMENT_SUGGESTION
DEFER_AND_REVISIT
```

The runtime must not silently escalate to demonstration when lighter guidance would preserve productive struggle.

Guidance policy from the Discovery Engine remains authoritative for hint behavior.

---

## 11. Foundation Recovery and Advanced Exploration

The runtime must support simultaneous routes:

```text
Advanced Exploration Track
        +
Targeted Foundation Recovery Track
```

A foundational gap does not automatically block all above-level exploration. The recommendation policy should ask:

- Does the gap make the current opportunity unsafe or meaningless?
- Can the learner continue exploration while receiving targeted support?
- Is the gap causing repeated negative transfer?
- Does the learner's stated goal require immediate remediation?

The recommendation must expose the reason for any recovery step and avoid framing it as punishment.

---

## 12. Learner Agency

Recommendations are selectable opportunities, not mandatory assignments, except where explicit institutional policy applies.

The learner should be able to:

- accept
- defer
- choose an alternative
- request more challenge
- request more support
- continue open exploration

The runtime should learn from these choices only as preference evidence, not as proof of mathematical understanding.

---

## 13. Parent and Teacher Influence

Parents and teachers may provide goals, constraints, or review requests, but they must not directly fabricate learning state.

Valid influences include:

- prioritize a curriculum goal
- request a retention check
- request foundation review
- limit session duration
- require accessibility support

Invalid influences include:

- mark concept mastered
- erase contradiction evidence
- force a permanent learner label
- suppress unfavorable evidence

All external influence must be auditable and visible in recommendation explanations.

---

## 14. Recommendation Lifecycle

```text
PROPOSED
ELIGIBLE
RANKED
OFFERED
ACCEPTED
DECLINED
DEFERRED
STARTED
COMPLETED
EXPIRED
INVALIDATED
SUPERSEDED
```

A completed opportunity does not imply successful learning. Completion produces world and discovery evidence that must be evaluated separately.

### Invalidation examples

- learning state changed
- prerequisite claim was revoked
- opportunity became unavailable
- mission template version changed
- policy changed
- learner context changed materially

---

## 15. Recommendation Contract

```text
AdaptiveRecommendation
- recommendationId
- learnerId
- goalId
- pathId
- pathVersion
- opportunityId
- opportunityVersion
- recommendationType
- rank
- createdAt
- expiresAt
- policyVersion
- inputSnapshotVersion
- evidenceRefs
- reasons
- limitations
- alternatives
- lifecycleStatus
```

Reasons must be human-readable and machine-readable.

Example:

```text
Reason Codes
- NEEDS_REPRESENTATION_VARIATION
- RETENTION_CHECK_DUE
- TRANSFER_EVIDENCE_MISSING
- FOUNDATION_RISK_ACTIVE
- SUPPORT_DEPENDENCE_HIGH
- CONTRADICTION_REQUIRES_CLARIFICATION
- OPEN_EXPLORATION_ALIGNED
```

---

## 16. Explainability

Every recommendation must answer:

1. Why this opportunity?
2. Why now?
3. What evidence gap does it address?
4. What alternatives were considered?
5. What could invalidate it?
6. What will happen if the learner declines?

Example explanation:

> This task is suggested because the learner has stable success with equal groups in a concrete layout, but transfer to a symbolic representation has not yet been observed. A lower-support representation bridge is preferred before a far-transfer challenge.

Explanations must avoid deterministic labels such as “weak learner” or “bad at algebra.”

---

## 17. Persistence and Replay

Recommendation decisions must be replayable from immutable inputs.

Persist:

- recommendation request
- input snapshot references
- candidate set
- eligibility decisions
- dimension evaluations
- selected ranking
- policy version
- lifecycle events
- learner response

Do not overwrite prior decisions when policy changes. Re-evaluate into a new recommendation version.

---

## 18. Concurrency and Idempotency

Recommendation generation must support:

- idempotent request keys
- expected learner-state version
- expected path version
- deterministic generation under the same inputs
- optimistic concurrency rejection
- supersession when newer state exists

A stale recommendation must not silently execute against a materially newer learning state.

---

## 19. Privacy and Fairness

The runtime must not use protected or irrelevant personal attributes as proxies for ability.

Fairness requirements include:

- comparable evidence receives comparable evaluation
- accessibility accommodations do not reduce inferred understanding
- language load is separated from mathematical structure where possible
- socioeconomic data is not used to lower opportunity quality
- preference signals do not become permanent ability labels
- recommendation disparities are measurable and auditable

---

## 20. Failure Modes

### Content treadmill

The system recommends more tasks merely because tasks exist.

### Mastery shortcut

A high score immediately unlocks everything.

### Hidden remediation prison

Foundation recovery blocks exploration indefinitely.

### Repetition loop

The same task form is offered repeatedly without evidence purpose.

### Hint dependency escalation

The runtime responds to struggle by immediately increasing support.

### Opaque ranking

No one can explain why one opportunity was selected.

### Preference-as-ability

The learner declines an activity and is classified as unable.

### Completion-as-learning

Mission completion is treated as proof of understanding.

All are prohibited.

---

## 21. Runtime Invariants

1. No recommendation may mutate learning state directly.
2. No ineligible candidate may be selected by ranking.
3. Every recommendation must reference authoritative input versions.
4. Every recommendation must expose reasons and limitations.
5. Completion must not imply mastery.
6. Learner preference must not be treated as concept evidence.
7. Accessibility support must not lower mastery interpretation.
8. Foundation recovery must not silently block all exploration.
9. Stale recommendations must be invalidated or re-evaluated.
10. Recommendation history must remain replayable.
11. External actors may influence goals but not fabricate learning truth.
12. The runtime must be able to recommend rest, deferment, or open exploration.

---

## 22. Example Flow

```text
Learner Concept State
- concept: proportional comparison
- status: SUPPORTED
- transfer: CONTEXT_BOUND
- retention: UNKNOWN
- support dependence: LOW

Active Goal
- apply ratios across visual and symbolic representations

Candidate A
- repeat same visual task

Candidate B
- symbolic representation bridge

Candidate C
- unrelated advanced geometry exploration

Evaluation
- A: eligible, low diversity value
- B: eligible, high evidence and transfer value
- C: eligible as open exploration alternative

Recommendation Set
1. B — primary learning recommendation
2. C — learner-choice exploration alternative
3. A — deferred unless stabilization evidence becomes necessary
```

---

## 23. Integration Boundary

```text
Learning Path Runtime
        ↓ eligible step intent
Adaptive Recommendation Runtime
        ↓ ranked opportunity
Mission Runtime
        ↓ executable mission
World Runtime
        ↓ authoritative events
Discovery Engine
        ↓ discovery evidence
Learning Engine
        ↓ updated state
Adaptive Recommendation Runtime
```

This closes the adaptive loop without allowing any downstream runtime to manufacture upstream truth.

---

## 24. Completion Criteria

25G is architecturally complete when:

- candidate eligibility is explicit
- ranking dimensions are explainable
- learning path authority is preserved
- learner agency is preserved
- recommendation loops are prevented
- foundation recovery and advanced exploration can coexist
- support adaptation is bounded
- external influence is auditable
- persistence and replay are defined
- stale recommendation handling is deterministic
- privacy and fairness invariants are enforceable

The Adaptive Recommendation Runtime is then ready to supply recommendations to missions and projections without becoming the authority over learning truth.
