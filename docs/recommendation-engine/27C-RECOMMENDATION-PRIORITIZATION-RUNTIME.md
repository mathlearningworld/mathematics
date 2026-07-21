# 27C — Recommendation Prioritization Runtime

## Status

- Chapter: 27 — Recommendation Engine Architecture
- Slice: 27C
- State: PRIORITIZATION RUNTIME DEFINED
- Depends on: 27A Recommendation Engine Foundation, 27B Recommendation Candidate Runtime

---

## 1. Purpose

The Recommendation Prioritization Runtime converts an immutable eligible candidate set into an explainable, stable, bounded order of recommended actions.

It answers:

> Of the actions that are allowed and grounded, which should come first, which may follow, and which should remain alternatives?

Prioritization does not create new candidates, alter assessment truth, or execute any action.

---

## 2. Runtime Position

```text
Frozen Recommendation Candidate Set
+ Prioritization Policy
+ Goal Context
+ Learning History
+ Delivery Constraints
+ Outcome History
          ↓
Blocking Rule Evaluation
          ↓
Priority Factor Evaluation
          ↓
Dominance and Dependency Ordering
          ↓
Tie Resolution
          ↓
Recommendation Ranking
          ↓
Prioritized Recommendation Set
```

---

## 3. Core Principle

```text
Eligibility answers: may this action be considered?
Prioritization answers: where should it appear relative to other eligible actions?
```

A high priority score cannot make an ineligible candidate eligible.

---

## 4. Priority Model

Prioritization must use explicit factors rather than an opaque single score.

Initial factor families:

```text
BLOCKING_PREREQUISITE
LEARNING_RISK
READINESS_DISTANCE
MISCONCEPTION_RISK
TRANSFER_NEED
EVIDENCE_NEED
GOAL_RELEVANCE
CURRICULUM_RELEVANCE
RETENTION_RISK
EXPECTED_LEARNING_VALUE
ACTION_FEASIBILITY
LEARNER_FRICTION
RECENCY_AND_REPETITION
DIVERSITY_VALUE
HUMAN_SUPPORT_VALUE
EXPLORATION_VALUE
```

Each factor requires:

```text
factorCode
factorValue
factorBand
sourceReferences[]
policyRuleId
explanation
limitations[]
```

---

## 5. Priority Bands

The runtime uses ordered semantic bands before numeric or ordinal tie-breaking.

```text
P0_CRITICAL_BLOCKER
P1_FOUNDATIONAL
P2_HIGH_VALUE
P3_MAINTENANCE
P4_OPTIONAL
P5_DEFERRED
```

Meaning:

- `P0_CRITICAL_BLOCKER`: action required before progress in the active scope can be trusted.
- `P1_FOUNDATIONAL`: closes an important prerequisite or high-risk understanding gap.
- `P2_HIGH_VALUE`: strongly advances learning or goal readiness.
- `P3_MAINTENANCE`: protects retention or fluency.
- `P4_OPTIONAL`: exploration, enrichment, or non-blocking challenge.
- `P5_DEFERRED`: eligible in principle but should not be surfaced now.

Priority bands are policy-owned and versioned.

---

## 6. Blocking Priority

Blocking prerequisites are handled by dominance rules, not by ordinary weighted averaging.

```text
If Candidate A resolves a verified blocking prerequisite
and Candidate B depends on that prerequisite,
then A must rank before B.
```

A strong goal deadline, learner preference, or engagement estimate must not override a verified blocker unless policy explicitly allows a human-reviewed exception.

---

## 7. Dependency Ordering

The runtime must respect directed dependencies among candidates.

```text
REVIEW prerequisite
        ↓
PRACTICE target representation
        ↓
TRANSFER target skill
        ↓
CHALLENGE application
```

Ordering must record:

- dependency edge,
- graph version,
- dominance reason,
- whether the dependency is blocking or supportive,
- unresolved conflicts.

Dependency cycles must be rejected or held for review.

---

## 8. Readiness-Aware Priority

Readiness outcomes may influence ordering without being rewritten.

Examples:

```text
NOT_READY with blocker
  → prerequisite action dominates

READY_WITH_LIMITATIONS
  → target action may proceed with limitation-aware support

INSUFFICIENT_EVIDENCE
  → targeted ASSESS or OBSERVE may dominate content progression

READY
  → transfer, challenge, or next-scope candidates may advance
```

The prioritization runtime references readiness claims; it does not generate them.

---

## 9. Misconception-Aware Priority

A misconception hypothesis may raise the priority of a contrastive or diagnostic action when:

- the hypothesis is publishable for this consumer,
- evidence coverage is adequate,
- the proposed action can distinguish the misconception from alternatives,
- repetition policy allows it.

One wrong answer must not produce critical misconception priority by itself.

---

## 10. Evidence-Gathering Priority

When uncertainty is material, evidence-gathering may outrank instruction.

Examples:

```text
ASSESS alternate representation
OBSERVE unaided performance
TRANSFER to novel context
WAIT for current task outcome
TEACHER_REVIEW contradictory evidence
```

The runtime must explain why additional evidence is more valuable than immediate remediation.

---

## 11. Goal Relevance

Goals may raise priority for actions that shorten the verified path toward the goal.

Goal relevance must consider:

- goal identity,
- goal deadline,
- target dependency distance,
- readiness blockers,
- required curriculum coverage,
- available learning time.

Goal urgency cannot transform an unsafe or blocked candidate into a valid recommendation.

---

## 12. Expected Learning Value

Expected learning value estimates the likely educational benefit of performing an action under the current context.

It may consider:

- prerequisite leverage,
- number of downstream skills supported,
- concept centrality,
- current readiness distance,
- representation coverage,
- transfer opportunity,
- retention risk.

It must not be represented as guaranteed learning gain.

---

## 13. Feasibility

Feasibility influences ordering among educationally valid alternatives.

Possible inputs:

```text
asset availability
estimated duration
device capability
connectivity
accessibility support
language availability
mentor availability
classroom constraints
```

Feasibility may lower priority or defer an action, but it must not conceal that a pedagogically stronger action was unavailable.

---

## 14. Learner Friction

Learner friction may include:

- repeated decline,
- recent fatigue signal,
- excessive task length,
- representation aversion,
- repeated failure without support,
- context-switch cost.

Friction can influence presentation and sequencing, but it must not permanently suppress foundational needs.

The runtime should prefer a more accessible path to the same learning purpose when available.

---

## 15. Recency and Repetition

Prioritization must prevent harmful repetition.

Rules may include:

```text
avoid immediate duplicate recommendation
avoid reassessment without intervening learning
avoid repeated identical representation
cool down recently declined optional actions
promote spaced review when retention window opens
```

Suppression must have an expiry or reevaluation condition.

---

## 16. Diversity

A published set may intentionally include different roles:

```text
PRIMARY_ACTION
SECONDARY_ACTION
EVIDENCE_ACTION
SUPPORT_ACTION
OPTIONAL_EXPLORATION
```

Diversity is applied after blockers and safety rules.

A lower-value candidate must not displace the only action that resolves a critical blocker merely to create variety.

---

## 17. Priority Calculation Stages

```text
Stage 1 — Validate frozen candidate set
Stage 2 — Exclude non-prioritizable states
Stage 3 — Apply blocking dominance
Stage 4 — Apply dependency ordering
Stage 5 — Assign semantic priority bands
Stage 6 — Evaluate within-band factors
Stage 7 — Resolve ties deterministically
Stage 8 — Apply set-size and diversity policy
Stage 9 — Generate ordering explanation
Stage 10 — Freeze prioritized set
```

No later stage may violate an earlier blocking decision.

---

## 18. Weighted Factors

Within a semantic band, policy may use weighted factors.

Example conceptual form:

```text
withinBandValue =
  learningValue
+ goalRelevance
+ retentionValue
+ feasibility
- repetitionPenalty
- frictionPenalty
```

Requirements:

- factor weights are versioned,
- every factor value is traceable,
- missing material factors are explicit,
- numeric value never overrides a blocking rule,
- raw score is not exposed as learner ability.

---

## 19. Dominance Rules

A candidate may dominate another when a versioned rule applies.

Examples:

```text
blocking prerequisite dominates dependent target
safety review dominates automatic action
assessment dominates remediation when evidence is insufficient
available equivalent action dominates unavailable action
less intrusive evidence action dominates invasive support escalation
```

Dominance must record the winning candidate, losing candidate, rule, and rationale.

---

## 20. Tie Resolution

Ties must be resolved deterministically.

Tie-break sequence may include:

```text
lower dependency depth
higher source confidence
higher expected learning value
lower learner friction
lower estimated effort
older unmet need
canonical candidate ID
```

If policy permits exploration randomization, it applies only after all semantic ties and safety constraints, and the seed must be recorded.

---

## 21. Stable Ordering

Minor non-material context changes should not cause unnecessary recommendation churn.

The runtime may use stability rules such as:

- preserve current primary action when still valid,
- require a material priority delta before replacement,
- avoid reorder caused only by timestamp noise,
- protect an already-started action from optional alternatives.

Stability must never preserve a newly blocked or unsafe action.

---

## 22. Recommendation Rank Contract

Each prioritized candidate receives:

```text
rank
priorityBand
roleInSet
priorityFactors[]
dominanceFindings[]
dependencyFindings[]
tieBreakFindings[]
orderingRationale
```

Rank is local to one frozen recommendation set and must not be compared as a universal learner score.

---

## 23. Prioritized Set Contract

```text
prioritizedSetId
candidateSetId
recommendationCaseId
caseVersion
prioritizationPolicyVersion
prioritizationRunId
rankedCandidates[]
excludedCandidates[]
setLimitations[]
generatedAt
```

Excluded candidates remain traceable with exclusion reasons.

---

## 24. Set Size

Policy defines maximum published candidates by consumer and context.

Example:

```text
Learner projection: 1 primary + up to 2 alternatives
Parent projection: 1 action + support guidance
Teacher projection: broader ranked list with evidence detail
Mission consumer: only mission-eligible candidates
```

Set-size truncation must occur after ranking and must preserve excluded-candidate lineage.

---

## 25. Confidence-Aware Ranking

Priority and confidence are distinct.

A candidate may be:

- high priority but low confidence, requiring review,
- lower priority but high confidence,
- urgent because evidence is insufficient,
- foundational even if expected completion is difficult.

The engine must not rank solely by confidence.

---

## 26. Explanation Contract

Every ordered recommendation must explain:

```text
why this action is included
why it has this priority band
why it ranks before the next alternative
which blockers or dependencies matter
which evidence supports the ordering
which uncertainties could change the order
```

The explanation must distinguish policy decisions from evidence facts.

---

## 27. Reprioritization Triggers

A new prioritization run may be required when:

```text
new assessment claim is published
source claim is superseded
learning action completes
active mission changes
goal deadline changes
content availability changes
mentor availability changes
recommendation policy changes
candidate expires
current primary action is declined or abandoned
```

A trigger does not mutate the old set. It creates a new version.

---

## 28. Commands

```text
PrioritizeRecommendationCandidates
ReprioritizeRecommendationCase
ResolveRecommendationPriorityTie
FreezePrioritizedRecommendationSet
```

Required command fields:

```text
commandId
correlationId
recommendationCaseId
expectedCaseVersion
candidateSetId
prioritizationPolicyVersion
```

---

## 29. Events

```text
RECOMMENDATION_PRIORITIZATION_STARTED
RECOMMENDATION_PRIORITY_FACTOR_EVALUATED
RECOMMENDATION_DOMINANCE_APPLIED
RECOMMENDATION_DEPENDENCY_ORDER_APPLIED
RECOMMENDATION_PRIORITY_BAND_ASSIGNED
RECOMMENDATION_TIE_RESOLVED
RECOMMENDATION_CANDIDATE_RANKED
RECOMMENDATION_CANDIDATE_EXCLUDED_FROM_SET
RECOMMENDATION_PRIORITIZED_SET_FROZEN
RECOMMENDATION_REPRIORITIZATION_REQUESTED
```

Events must preserve input, policy, and case versions.

---

## 30. Failure Codes

```text
RECOMMENDATION_CANDIDATE_SET_NOT_FOUND
RECOMMENDATION_CANDIDATE_SET_NOT_FROZEN
RECOMMENDATION_CANDIDATE_NOT_ELIGIBLE
PRIORITIZATION_POLICY_NOT_FOUND
PRIORITIZATION_POLICY_VERSION_MISMATCH
PRIORITY_FACTOR_UNRESOLVED
BLOCKING_RULE_CONFLICT
DEPENDENCY_ORDER_CONFLICT
DEPENDENCY_CYCLE_PREVENTS_ORDERING
TIE_BREAK_RULE_UNRESOLVED
PRIORITIZED_SET_ALREADY_FROZEN
PRIORITIZATION_NOT_EXPLAINABLE
PRIORITIZATION_INTEGRITY_FAILURE
```

---

## 31. Prioritization Invariants

```text
REC-PRI-001  Ineligible candidates cannot be ranked into a publishable set.
REC-PRI-002  Blocking rules dominate weighted factors.
REC-PRI-003  Dependencies are ordered before their dependent actions.
REC-PRI-004  Priority is not learner ability or mastery.
REC-PRI-005  Every rank is explainable from versioned factors and rules.
REC-PRI-006  Priority and confidence remain distinct.
REC-PRI-007  Tie resolution is deterministic or seed-recorded.
REC-PRI-008  Truncated candidates remain traceable.
REC-PRI-009  Reprioritization creates a new version rather than overwriting history.
REC-PRI-010  Stability rules cannot preserve blocked or unsafe actions.
REC-PRI-011  Goal urgency cannot bypass readiness blockers.
REC-PRI-012  Missing evidence may prioritize evidence gathering rather than remediation.
```

---

## 32. Completion Criteria

27C is complete when the repository defines:

- semantic priority bands,
- blocking and dependency dominance,
- factor evaluation,
- goal, readiness, misconception, feasibility, friction, recency, and diversity effects,
- deterministic tie resolution,
- stable ordering,
- prioritized-set contracts,
- reprioritization triggers,
- events, failures, and invariants.

Domain-specific recommendation behavior continues in 27D–27F.
