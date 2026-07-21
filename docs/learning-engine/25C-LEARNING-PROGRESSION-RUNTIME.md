# Chapter 25 — Learning Engine Architecture

# 25C — Learning Progression Runtime

## Status

- Chapter: 25
- Slice: 25C
- Authority: Learning Progression Runtime
- Depends on: 25A Learning Engine Foundation, 25B Learning State Runtime

## Purpose

The Learning Progression Runtime governs how a learner moves through concept states over time without reducing learning to a linear sequence, grade ladder, or experience bar.

Its role is to interpret changes in Learning State across concepts, prerequisites, contexts, retention windows, and assistance patterns.

## Core Principle

> Progression is a change in the quality, breadth, independence, durability, and connectedness of understanding—not merely an increase in completed activities.

## Progression Inputs

The runtime consumes:

- versioned Learning Claims;
- concept relationships from the Knowledge Graph;
- evidence quality summaries;
- transfer and retention signals;
- contradiction and misconception state;
- assistance dependence trends;
- learner goals;
- curriculum mappings as external expectations;
- opportunity history;
- accessibility constraints.

## Progression Dimensions

Progression is multi-dimensional.

```text
Depth
Breadth
Independence
Durability
Transfer
Connectedness
Flexibility
Efficiency
Explainability
```

### Depth

The extent to which the learner can reason about structure, boundary conditions, and implications of a concept.

### Breadth

The range of contexts, representations, and task families in which the concept is usable.

### Independence

The degree to which successful performance occurs without conceptual assistance.

### Durability

The availability of understanding after meaningful time gaps.

### Transfer

The ability to use the concept in a materially different situation.

### Connectedness

The degree to which the concept is linked coherently to related concepts.

### Flexibility

The ability to choose or adapt among multiple valid strategies.

### Efficiency

The reduction of unnecessary steps without sacrificing understanding.

### Explainability

The ability to produce evidence of reasoning through action, representation, or explanation appropriate to the learner.

## Progression Is Not a Single Number

The runtime must not compress learning progression into one authoritative percentage.

A summary score may be created for a bounded display or external policy, but it must remain a projection and must not replace the underlying dimensions.

Example:

```text
Concept: Constant Unit Iteration

Depth: supported
Breadth: emerging
Independence: strong
Durability: not yet evaluated
Transfer: context-bound
Connectedness: emerging
```

This profile is more truthful than `72% complete`.

## Progression Graph

Learning progression follows a graph rather than a universal linear path.

```text
Concept A ──prerequisite_for──> Concept C
Concept B ──supports───────────> Concept C
Concept C ──generalizes_to─────> Concept D
Concept C ──represented_by─────> Representation R
Concept C ──commonly_confused──> Misconception M
```

Different learners may reach Concept C through different valid routes.

The runtime must support:

- alternative prerequisites;
- partial prerequisites;
- parallel concept development;
- concept revisiting;
- remediation loops;
- above-grade exploration;
- skipped formal sequence when evidence supports readiness;
- return to foundations when contradictions reveal structural gaps.

## Progression Node State

```ts
interface ProgressionNodeState {
  learnerId: string;
  conceptId: string;
  learningClaimVersion: number;
  readiness: ReadinessState;
  dependencyStatus: DependencyStatus[];
  opportunityNeed: OpportunityNeed;
  progressionDimensions: ProgressionDimensions;
  blockers: ProgressionBlocker[];
  nextEvidenceNeeds: EvidenceNeed[];
  lastEvaluatedAt: string;
}
```

## Readiness States

```text
NOT_READY
FOUNDATION_NEEDED
READY_WITH_SUPPORT
READY
READY_FOR_TRANSFER
READY_FOR_RETENTION_CHECK
READY_FOR_EXTENSION
DEFERRED
```

Readiness is always relative to a target opportunity or concept.

A learner can be ready for an exploratory activity but not ready for certification.

## Dependency Semantics

Prerequisites are not simple Boolean gates.

A dependency can be:

```text
UNOBSERVED
EMERGING
SUFFICIENT_FOR_EXPLORATION
SUFFICIENT_FOR_SUPPORTED_USE
SUFFICIENT_FOR_INDEPENDENT_USE
CONTRADICTED
WAIVED_BY_ALTERNATIVE_PATH
```

This allows the system to distinguish between:

- what is needed to begin exploring;
- what is needed to work with support;
- what is needed for independent use;
- what is required by an external curriculum policy.

## Minimum Foundation Principle

The runtime must protect foundational understanding while allowing ambitious exploration.

```text
Above-level exploration is allowed.
Foundational debt is not ignored.
```

A learner may access advanced concepts when the activity is safe and meaningful, but the engine must track unresolved foundational dependencies and avoid falsely declaring stable progression.

## Progression Transition

Progression changes when evidence alters one or more dimensions.

Examples:

```text
Context-bound → broader scope
Prompt-dependent → independently retrieved
Immediate success → delayed retrieval
Single strategy → flexible strategy selection
Isolated concept → connected concept network
Repeated imitation → transferable understanding
Contradicted → recovering
Dormant → reactivated
```

## Evidence Need Planning

When progression is uncertain, the runtime should request the smallest useful next evidence opportunity.

```ts
interface EvidenceNeed {
  conceptId: string;
  dimension: ProgressionDimension;
  requiredContextDifference?: string;
  assistanceLimit?: string;
  minimumDelay?: string;
  evidencePurpose: 'CONFIRM' | 'TRANSFER' | 'RETENTION' | 'DISAMBIGUATE' | 'RECOVER';
  priority: number;
}
```

The runtime does not directly create gameplay missions. It emits evidence needs that downstream Learning Path and Recommendation systems may satisfy.

## Productive Challenge

Progression opportunities should aim for productive challenge:

- not so easy that they add no new evidence;
- not so difficult that failure is uninterpretable;
- not so assisted that learner contribution disappears;
- not so repetitive that evidence remains dependent;
- not so novel that prior understanding cannot reasonably transfer.

Difficulty alone is not progression.

## Repetition Semantics

Repetition can serve different purposes:

```text
Fluency repetition
Retention retrieval
Transfer variation
Misconception disambiguation
Confidence rebuilding
Strategy flexibility
```

The runtime must not recommend or interpret repetition without stating its purpose.

Ten identical successes may contribute less progression evidence than one successful delayed transfer to a new representation.

## Regression and Recovery

Progression can move backward or become uncertain.

Possible causes:

- contradictory evidence;
- loss of independent retrieval;
- overreliance on one representation;
- source evidence revocation;
- Knowledge Graph correction;
- long-term dormancy followed by failed retrieval;
- misconception reappearance;
- evaluator policy revision.

Recovery is a governed progression path, not a reset to zero.

The engine preserves prior evidence and identifies what must be reconstructed or reactivated.

## Progression Across Concepts

Concept-level progression may influence neighboring concepts, but must not mutate them automatically.

Example:

```text
Stable understanding of equal groups
  may create readiness evidence for multiplication

It does not automatically mark multiplication as learned.
```

The runtime emits dependency readiness, not borrowed mastery.

## Goal Relationship

Learner goals influence priority, not truth.

Examples:

- prepare for an entrance exam;
- build a structure in the game;
- understand algebraic equations;
- meet a curriculum minimum;
- explore above grade level.

Goals may reorder opportunities, but they cannot alter evidence requirements for learning claims.

## Curriculum Relationship

Curriculum mappings can define:

- target concepts;
- expected sequence;
- minimum evidence policy;
- age or grade expectations;
- required assessment conditions.

The progression runtime may compare learner state against these expectations, but it must preserve the distinction:

```text
Learning progression truth
≠
Curriculum compliance state
```

## Opportunity Eligibility

The runtime may produce eligibility decisions:

```text
ELIGIBLE
ELIGIBLE_WITH_SUPPORT
ELIGIBLE_FOR_EXPLORATION_ONLY
FOUNDATION_RECOMMENDED
NOT_YET_INTERPRETABLE
BLOCKED_BY_SAFETY_OR_POLICY
```

Eligibility decisions must include reasons and policy versions.

## Progression Events

```text
LearningProgressionEvaluated
ReadinessChanged
FoundationNeedDetected
TransferOpportunityRequested
RetentionCheckRequested
RecoveryPathOpened
AlternativePathAccepted
ProgressionBlockerAdded
ProgressionBlockerResolved
ExtensionOpportunityOpened
CurriculumExpectationCompared
```

## Blockers

A blocker is not always a deficit in the learner.

Possible blockers include:

- insufficient evidence;
- inaccessible representation;
- missing prerequisite opportunity;
- repeated automation interference;
- contradictory source events;
- unsupported evaluator version;
- environment not offering the needed context;
- excessive guidance contamination;
- curriculum policy constraint;
- privacy or consent constraint.

The system must distinguish learner-state blockers from system-state blockers.

## Fairness and Accessibility

Accessibility support must not be treated automatically as conceptual assistance.

Examples:

- text-to-speech;
- alternative input device;
- larger controls;
- reduced visual clutter;
- extra response time;
- language translation.

The progression runtime should evaluate mathematical understanding while preserving necessary access accommodations.

## Explainability

Every progression recommendation or readiness state must explain:

- target concept or opportunity;
- current learning state;
- relevant dependencies;
- supporting evidence;
- unresolved contradiction;
- missing progression dimension;
- why this next evidence is useful;
- active policy and graph versions.

## Failure Codes

```text
PROGRESSION_STATE_NOT_FOUND
LEARNING_CLAIM_VERSION_MISMATCH
DEPENDENCY_GRAPH_VERSION_MISMATCH
INSUFFICIENT_EVIDENCE_FOR_READINESS
CONFLICTING_PROGRESSION_SIGNALS
NO_VALID_NEXT_EVIDENCE_NEED
OPPORTUNITY_POLICY_UNSUPPORTED
PROGRESSION_REPLAY_REQUIRED
UNAUTHORIZED_PROGRESSION_ACCESS
```

## Runtime Invariants

1. Progression must not be represented authoritatively by a single percentage.
2. Activity completion alone cannot advance progression.
3. A prerequisite relation cannot directly mutate another concept's Learning State.
4. Readiness must always name its target opportunity or purpose.
5. Curriculum sequence cannot replace evidence-based progression.
6. Above-level exploration must remain possible when policy and safety allow it.
7. Foundational gaps must remain visible even when advanced exploration succeeds.
8. Repetition must have an explicit evidence purpose.
9. Regression must preserve prior evidence and audit history.
10. Accessibility support must remain distinguishable from conceptual assistance.
11. Goals may influence priority but not evidence truth.
12. System blockers must not be mislabeled as learner deficits.
13. Progression decisions must be explainable and versioned.
14. Alternative valid learning paths must be supported.
15. Every requested next opportunity must identify the evidence dimension it intends to strengthen or test.

## Architectural Outcome

The Learning Progression Runtime enables Math Learning World to guide learners through a flexible, evidence-driven concept graph while protecting foundations, supporting advanced exploration, recognizing non-linear growth, and avoiding the false certainty of linear grade ladders and completion bars.