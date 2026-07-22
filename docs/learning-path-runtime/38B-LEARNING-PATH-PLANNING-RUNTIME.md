# Chapter 38B — Learning Path Planning Runtime

## 1. Purpose

Learning Path Planning Runtime converts authoritative learning context into a deterministic candidate path.

It proposes what should happen next. It does not activate, mutate, or complete a path by itself.

```text
Authoritative Inputs
  ↓
Normalize Context
  ↓
Resolve Goals
  ↓
Analyze Gaps
  ↓
Resolve Prerequisites
  ↓
Generate Candidate Nodes
  ↓
Sequence and Constrain
  ↓
Validate Plan
  ↓
Candidate Learning Path
```

## 2. Planning Boundary

Planning Runtime owns:

- input normalization
- goal decomposition
- prerequisite analysis
- gap analysis
- node generation
- remediation planning
- retention planning
- acceleration planning
- sequence optimization
- constraint resolution
- candidate-path explanation
- deterministic planning result

Planning Runtime does not own:

- path activation
- path mutation authority
- mastery decisions
- curriculum definitions
- skill graph definitions
- session execution
- evidence acceptance

## 3. Planning Request

Minimum request contract:

```text
requestId
learnerId
tenantId
missionId?
journeyId?
masterySnapshot
curriculumSnapshot
skillGraphSnapshot
learnerContext
planningPolicyVersion
requestedAt
```

Optional constraints:

```text
targetDate
availableTimeBudget
preferredSessionLength
contentAvailability
teacherConstraints
parentConstraints
accessibilityContext
operationalLimits
```

## 4. Deterministic Planning Pipeline

Canonical pipeline:

```text
1. Validate Identity and Versions
2. Freeze Input Context
3. Resolve Path Goals
4. Build Target Skill Set
5. Expand Prerequisite Closure
6. Classify Current Readiness
7. Identify Learning Gaps
8. Generate Candidate Nodes
9. Apply Remediation Policy
10. Apply Retention Policy
11. Apply Acceleration Policy
12. Sequence Nodes
13. Apply Time and Operational Constraints
14. Validate Reachability
15. Calculate Plan Quality Metrics
16. Produce Candidate Plan
```

Given the same frozen inputs and policy version, the planner must produce the same result.

## 5. Goal Resolution

Goals may originate from:

- mission targets
- journey milestones
- curriculum minimums
- teacher-authorized objectives
- learner-selected exploration
- remediation obligations
- retention obligations

Conflicting goals require explicit resolution.

Goal precedence must be policy-driven and recorded.

Example precedence:

```text
Safety and prerequisite repair
  > mandatory curriculum requirement
  > mission deadline
  > teacher priority
  > learner exploration preference
```

This order is configurable but must be versioned.

## 6. Target Skill Set

The planner creates a target set containing:

```text
targetSkillId
requiredMasteryLevel
requiredCoverage
priority
sourceGoalId
requiredByDate?
```

Duplicate targets are merged only when their semantics are compatible.

The strongest compatible requirement wins; incompatible requirements trigger review.

## 7. Prerequisite Closure

For each target skill, the planner traverses the skill graph to derive prerequisite closure.

The traversal must detect:

- cycles
- missing nodes
- incompatible graph versions
- optional prerequisites
- alternative prerequisite routes
- compensatable prerequisites

A cycle in a supposedly acyclic prerequisite graph must block automated planning.

## 8. Readiness Classification

Each skill is classified using authoritative mastery state:

```text
READY
PARTIALLY_READY
NOT_READY
UNKNOWN
CONTRADICTED
STALE
```

Planning treatment:

- `READY`: may proceed to target work
- `PARTIALLY_READY`: targeted foundation or checkpoint may be inserted
- `NOT_READY`: remediation required
- `UNKNOWN`: diagnostic or evidence-gathering node required
- `CONTRADICTED`: review or reevaluation required
- `STALE`: retention/checkpoint node may be required

## 9. Gap Analysis

A learning gap is a structured difference between required and observed readiness.

Minimum gap fields:

```text
gapId
skillId
requiredLevel
observedLevel
coverageDeficit
confidenceDeficit
freshnessDeficit
contradictionState
severity
sourceGoalIds
```

Gap severity must not be calculated from score difference alone.

## 10. Candidate Node Generation

The planner maps each need into one or more candidate node types.

Examples:

- missing concept → `FOUNDATION`
- procedural weakness → `PRACTICE`
- unknown readiness → `ASSESSMENT`
- decayed evidence → `RETENTION`
- transfer weakness → `TRANSFER`
- hard gap → `REMEDIATION`
- high readiness → `ACCELERATION`
- conflict → `REVIEW`

Each node must include a planning rationale.

## 11. Remediation Planning

A remediation plan must be minimal but sufficient.

It should:

- target the earliest blocking prerequisite
- avoid reteaching already secure skills
- include a reevaluation checkpoint
- provide an exit rule
- avoid infinite repetition
- escalate when repeated repair attempts fail

Escalation options:

```text
ALTERNATE_REPRESENTATION
DIAGNOSTIC_DEEP_DIVE
TEACHER_REVIEW
ACCESSIBILITY_REVIEW
HUMAN_SUPPORT_RECOMMENDED
```

## 12. Retention Planning

Retention nodes may be inserted when:

- evidence is old
- mastery durability is uncertain
- a high-impact prerequisite has not been exercised recently
- upcoming target work depends heavily on the skill

Retention must be proportional. The planner must not flood the path with unnecessary review.

## 13. Acceleration Planning

Acceleration may occur when:

- prerequisites are secure
- coverage is broad enough
- evidence is fresh enough
- no unresolved contradictions exist
- curriculum policy allows extension

Acceleration candidates may include:

- advanced application
- transfer tasks
- above-grade exploration
- compressed sequence
- optional challenge branch

## 14. Sequence Construction

The path is represented as a directed acyclic execution graph with a primary order.

Sequencing must consider:

- prerequisite dependencies
- cognitive load
- interleaving value
- retention spacing
- mission deadlines
- session-length limits
- content availability
- learner fatigue constraints
- accessibility constraints

## 15. Sequence Policies

The planner may use policies such as:

```text
PREREQUISITE_FIRST
MINIMUM_REPAIR
SPACED_RETENTION
INTERLEAVED_PRACTICE
MISSION_CRITICAL_PATH
BALANCED_PROGRESS
ACCELERATED_EXTENSION
```

The active policy set must be versioned.

## 16. Branches

A path may contain conditional branches.

Example:

```text
Checkpoint
  ├─ sufficient evidence → Core Target
  ├─ procedural weakness → Practice
  ├─ conceptual weakness → Foundation
  └─ contradiction → Review Required
```

Every branch must define a deterministic selection rule.

## 17. Time Budget Resolution

When time is constrained, the planner must distinguish:

- mandatory nodes
- deferrable nodes
- optional enrichment
- safety-critical review

It may compress or defer optional work, but it must not silently remove hard prerequisites.

## 18. Content Availability

A valid learning objective may lack executable content.

The planner must then:

- mark the node `CONTENT_UNAVAILABLE`
- search policy-approved alternatives
- preserve the educational objective
- avoid pretending the objective was satisfied

Content availability failure is operational, not evidence of learner weakness.

## 19. Accessibility-Aware Planning

Accessibility changes representation and interaction, not the underlying learning standard.

The planner may choose:

- visual alternatives
- reduced language load
- assistive interaction modes
- additional time
- alternative evidence forms

It must record which accommodation informed planning.

## 20. Plan Quality Metrics

Candidate plans may be scored on:

```text
goalCoverage
prerequisiteCompleteness
estimatedEffort
criticalPathLength
remediationBurden
retentionBalance
accelerationOpportunity
contentAvailabilityCoverage
explainabilityCompleteness
```

These metrics help compare candidate plans but do not replace policy gates.

## 21. Reachability Validation

A candidate plan is invalid when:

- mandatory target is unreachable
- hard prerequisite is absent
- branch has no valid outcome
- completion rule can never be satisfied
- cycle exists
- required content has no permitted substitute
- policy versions are incompatible

## 22. Planning Result

Minimum result:

```text
planningResultId
requestId
inputHash
policyVersion
candidatePath
qualityMetrics
warnings
reviewRequirements
resultHash
createdAt
```

The result must be immutable.

## 23. Replanning Inputs

Planning Runtime may be invoked again when:

- mastery changes
- evidence freshness changes
- curriculum changes
- skill graph changes
- mission priority changes
- path becomes blocked
- content becomes unavailable
- learner schedule changes
- accessibility context changes

Replanning produces a new candidate with lineage. It never mutates historical planning results.

## 24. Human Constraints

Teacher or parent constraints must declare authority and scope.

Examples:

```text
MUST_INCLUDE
MUST_EXCLUDE
PREFER
DEFER_UNTIL
REVIEW_BEFORE_ADVANCE
```

A human preference cannot override a safety or hard prerequisite rule unless governed override authority exists.

## 25. Planning Failure Codes

Recommended codes:

```text
INVALID_IDENTITY
STALE_MASTERY_INPUT
CURRICULUM_VERSION_MISMATCH
SKILL_GRAPH_VERSION_MISMATCH
PREREQUISITE_CYCLE
UNREACHABLE_GOAL
INSUFFICIENT_AUTHORITY
CONTENT_UNAVAILABLE
CONSTRAINT_CONFLICT
ACCESSIBILITY_CONTEXT_INVALID
POLICY_INCOMPATIBLE
REVIEW_REQUIRED
```

## 26. Planning Invariants

1. Planning proposes; it does not activate.
2. Same frozen inputs and policy produce the same result.
3. Hard prerequisites cannot be silently removed.
4. Unknown readiness is not treated as failure.
5. Content unavailability is not learner weakness.
6. Remediation targets a defined gap.
7. Every remediation branch has an exit condition.
8. Acceleration requires evidence-supported readiness.
9. Human constraints require declared authority.
10. Every node traces to a goal, gap, retention need, or governed policy.
11. Cycles invalidate the candidate plan.
12. Replanning creates lineage rather than overwriting history.
13. Accessibility modifies representation, not educational truth.
14. Quality metrics do not bypass policy gates.
15. Candidate paths are immutable planning artifacts.

## 27. Closing Definition

```text
Learning Path Planning Runtime deterministically converts
versioned educational truth and governed constraints
into a safe, explainable candidate path.
```
