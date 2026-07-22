# Chapter 38A — Learning Path Runtime Foundation

## 1. Purpose

Learning Path Runtime is the authority responsible for turning current educational truth into an explicit, versioned, actionable sequence of learning intentions.

It does not merely list content. It governs why a learner should study something next, what constraints apply, how path state changes, and how every change remains explainable.

The runtime sits between strategic learning intent and concrete execution:

```text
Mission
  ↓
Learning Journey
  ↓
Mastery State
  ↓
Learning Path
  ↓
Learning Sessions and Activities
  ↓
New Evidence
```

## 2. Core Boundary

Learning Path Runtime owns:

- path identity
- path lifecycle
- ordered learning objectives
- prerequisite-aware sequencing
- remediation and acceleration branches
- path versioning
- path authority decisions
- path execution state
- path lineage
- path compatibility with curriculum and skill graph versions
- path explainability

It does not own:

- raw assessment scoring
- mastery confirmation
- curriculum truth
- skill graph truth
- session execution details
- content rendering
- recommendation ranking outside path authority

## 3. Fundamental Doctrine

```text
Mastery describes what is currently justified.
Learning Path describes what should happen next.
```

A path must never silently redefine mastery.

A path may react to mastery, but it may not manufacture it.

## 4. Path Aggregate

The primary aggregate is `LearningPath`.

Minimum identity fields:

```text
pathId
learnerId
tenantId
missionId?
journeyId?
curriculumVersion
skillGraphVersion
pathPolicyVersion
pathVersion
status
createdAt
updatedAt
```

Minimum semantic state:

```text
goals
entryContext
orderedNodes
branchRules
completionPolicy
replanPolicy
activeNodeId?
blockedReasons
lineage
```

## 5. Path Lifecycle

Canonical lifecycle:

```text
DRAFT
  ↓
PLANNED
  ↓
ACTIVE
  ↓
PAUSED
  ↓
ACTIVE
  ↓
COMPLETED
```

Alternative terminal states:

```text
CANCELLED
SUPERSEDED
ABANDONED
```

Safety states:

```text
BLOCKED
REVIEW_REQUIRED
STALE
```

## 6. State Meaning

### DRAFT

Inputs may still be incomplete. No execution authority exists.

### PLANNED

A deterministic plan exists and has passed authority checks.

### ACTIVE

The path is eligible to drive session and activity selection.

### PAUSED

Execution is temporarily suspended without invalidating prior history.

### BLOCKED

The path cannot safely advance because a hard prerequisite, policy, evidence, curriculum, or operational constraint is unresolved.

### REVIEW_REQUIRED

Automated authority is insufficient. Human or governed review is required.

### STALE

The path was valid under older inputs but cannot be trusted as current.

### COMPLETED

The path completion policy has been satisfied.

### SUPERSEDED

A newer path has replaced this path while preserving lineage.

## 7. Path Node Model

A path contains ordered `LearningPathNode` elements.

Minimum node fields:

```text
nodeId
nodeType
skillIds
objectiveIds
prerequisiteNodeIds
recommendedActivityTypes
completionRule
entryRule
exitRule
priority
sequenceIndex
status
```

Node types may include:

```text
FOUNDATION
CORE
PRACTICE
ASSESSMENT
REMEDIATION
RETENTION
TRANSFER
ACCELERATION
REVIEW
CHECKPOINT
```

## 8. Path Authority

Only Learning Path Decision authority may:

- approve a planned path
- activate a path
- pause or resume a path
- block progression
- supersede a path
- complete a path
- authorize a replan result

Planning components may propose.

Orchestration components may execute.

Projection components may explain.

Persistence components may record.

None of these may replace path decision authority.

## 9. Inputs

Authoritative inputs may include:

- current mastery decisions
- mastery confidence and coverage
- curriculum requirements
- skill graph prerequisites
- mission targets
- journey constraints
- learner profile constraints
- accessibility accommodations
- teacher-authorized constraints
- time and schedule constraints
- content availability
- intervention requirements

All inputs must carry version or freshness metadata.

## 10. Path Entry Context

The path must freeze its entry context:

```text
masterySnapshotVersion
curriculumVersion
skillGraphVersion
missionVersion?
journeyVersion?
policyVersion
learnerContextVersion
createdAt
inputHash
```

This allows later reconstruction of why the path was produced.

## 11. Goals

A path goal must be explicit.

Examples:

- achieve prerequisite readiness for a target skill
- prepare for a mission milestone
- repair a known conceptual gap
- retain previously mastered knowledge
- accelerate beyond grade-level minimum
- prepare for a checkpoint assessment

Every goal must specify:

```text
goalId
goalType
targetSkillIds
targetMasteryLevel
targetCoverage
deadline?
priority
sourceAuthority
```

## 12. Prerequisite Semantics

Prerequisites are not simple booleans.

A prerequisite may be:

- hard
- soft
- recommended
- compensatable
- temporarily waived by governed authority

Each prerequisite resolution must record:

```text
prerequisiteId
requiredLevel
observedLevel
resolution
rationale
sourceVersion
```

## 13. Remediation

Remediation exists to repair a specific learning debt.

A remediation node must identify:

- the blocked target
- the missing prerequisite
- evidence supporting the gap
- the intended repair objective
- the reevaluation condition

Remediation must not become endless repetition without a policy transition.

## 14. Acceleration

Acceleration is allowed only when the learner has sufficient evidence, coverage, and prerequisite readiness.

Acceleration must not be inferred from speed alone.

It should require explicit readiness criteria and preserve the ability to return to foundation work when later evidence contradicts readiness.

## 15. Completion

Path completion is not equivalent to mastery.

A path may be complete because all planned nodes were executed, while mastery remains unconfirmed.

Completion policy may require:

- all mandatory nodes completed
- required checkpoints passed
- no unresolved hard blockers
- final evidence package generated
- downstream mastery reevaluation requested

## 16. Lineage

Every path must maintain lineage:

```text
createdFromPathId?
supersedesPathId?
replannedFromVersion?
reasonCode
changeSummary
changedBy
changedAt
```

History is immutable.

A new plan version must not overwrite the meaning of an earlier version.

## 17. Concurrency

All path mutations require optimistic concurrency.

Minimum command fields:

```text
pathId
expectedPathVersion
commandId
actorId
tenantId
occurredAt
```

A command against an outdated version must fail safely.

## 18. Idempotency

Repeated commands with the same command identity and semantic payload must not create duplicate state transitions.

If the same command identity arrives with different semantics, the runtime must reject it as an integrity violation.

## 19. Cross-Runtime Contracts

### From Mastery Runtime

Learning Path consumes authoritative mastery decisions, not raw evidence guesses.

### From Curriculum Runtime

Learning Path consumes curriculum requirements and progression constraints.

### From Skill Graph Runtime

Learning Path consumes prerequisite and dependency structure.

### To Learning Session Runtime

Learning Path emits authorized next-node or next-objective instructions.

### To Recommendation Runtime

Learning Path may provide bounded candidate context, while retaining final path authority.

## 20. Safety and Fairness

The path must never encode hidden punitive logic.

It must distinguish:

- lack of evidence
- contradictory evidence
- accessibility mismatch
- content unavailability
- true prerequisite weakness

Learners must not be trapped in remediation because the system lacks suitable evidence or accessible content.

## 21. Explainability

Every active node must be explainable in plain language:

- why this node is next
- what skill it supports
- what prerequisite it addresses
- what evidence influenced the choice
- what completion will unlock

## 22. Foundation Invariants

1. A path never creates mastery truth.
2. A path never rewrites curriculum truth.
3. A path never bypasses hard prerequisites without governed authority.
4. Every active path has a frozen input context.
5. Every path mutation is version checked.
6. Every replan preserves lineage.
7. Path completion is not mastery confirmation.
8. Projection is never path authority.
9. Stale input cannot silently drive a current path.
10. Remediation must have an exit condition.
11. Acceleration requires readiness evidence.
12. Tenant identity is enforced on every operation.
13. A path must remain reconstructable from durable history.
14. Accessibility context must affect planning without lowering educational truth.
15. Every node must have a reason for existence.

## 23. Closing Definition

```text
A Learning Path is a versioned, authority-approved,
prerequisite-aware, explainable sequence of learning intentions
that converts current mastery truth into safe next actions.
```
