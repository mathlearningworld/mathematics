# Chapter 28A — Mission Engine Foundation

## 1. Purpose

The Mission Engine turns verified recommendations into bounded, actionable learning commitments that a learner may accept, defer, modify through an authorized actor, or decline.

It is the bridge between recommendation and gameplay:

```text
Assessment
  ↓
Recommendation
  ↓
Mission Engine
  ↓
Gameplay Runtime
  ↓
Evidence
  ↓
Assessment
```

The Mission Engine does not decide what the learner understands. It governs what work is proposed, accepted, activated, executed, completed, abandoned, or superseded.

## 2. Core responsibility

The Mission Engine owns:

- mission identity and lifecycle
- mission proposal intake
- mission acceptance and activation
- mission scope and bounded objectives
- mission progress aggregation
- mission completion semantics
- mission cancellation, expiry, and supersession
- mission-to-gameplay handoff
- mission evidence routing
- mission persistence and replay
- mission projections for learner, parent, teacher, mentor, and operations

The Mission Engine does not own:

- assessment claims
- mastery interpretation
- recommendation confidence
- recommendation prioritization
- lesson delivery
- practice-item generation
- gameplay mechanics
- curriculum truth
- payment or entitlement policy

## 3. Authority boundaries

```text
Recommendation Engine proposes why and what should happen next.
Mission Engine governs whether and how that proposal becomes an active mission.
Gameplay Runtime delivers the playable or interactive experience.
Assessment Engine interprets evidence produced by the experience.
```

No downstream runtime may silently strengthen an upstream meaning.

Examples:

- a high-priority recommendation is not automatically mandatory
- an activated mission is not proof of readiness
- a completed mission is not proof of mastery
- a gameplay success is evidence, not an assessment conclusion

## 4. Mission definition

A mission is a durable, bounded commitment with:

- one learner scope
- one owning tenant or learning context
- one explicit purpose
- one or more measurable objectives
- a declared source and rationale
- activation policy
- completion policy
- evidence expectations
- lifecycle state
- versioned history

A mission is not merely a task list. It is an operational contract between recommendation intent, learner action, gameplay delivery, and evidence return.

## 5. Mission categories

Initial mission categories:

```text
FOUNDATION
LEARNING
PRACTICE
ASSESSMENT
TRANSFER
PREPARATION
REMEDIATION
EXPLORATION
CHALLENGE
RETENTION
MENTOR_SUPPORTED
PARENT_SUPPORTED
TEACHER_GUIDED
```

Category does not determine authority. Every category still follows the same lifecycle and evidence rules.

## 6. Mission origin

A mission may originate from:

```text
RECOMMENDATION
LEARNER_GOAL
PARENT_PLAN
TEACHER_PLAN
MENTOR_PLAN
SYSTEM_SCHEDULE
CURRICULUM_REQUIREMENT
RECOVERY_POLICY
EXPLORATION_DISCOVERY
```

Every origin must be traceable. A mission with no authoritative origin cannot be activated.

## 7. Mission optionality

```text
REQUIRED_BY_ACCEPTED_PLAN
RECOMMENDED
OPTIONAL
EXPLORATORY
HUMAN_DECISION_REQUIRED
```

Optionality is part of mission truth. Projection and gameplay cannot silently turn OPTIONAL into REQUIRED.

## 8. Mission lifecycle overview

```text
DRAFT
  ↓
PROPOSED
  ↓
ELIGIBLE
  ↓
ACCEPTED
  ↓
ACTIVE
  ↓
IN_PROGRESS
  ├── PAUSED
  ├── BLOCKED
  ├── ABANDONED
  ├── EXPIRED
  ├── SUPERSEDED
  └── COMPLETED
```

Terminal states:

```text
COMPLETED
ABANDONED
EXPIRED
SUPERSEDED
REJECTED
CANCELLED
```

Lifecycle transitions must be explicit, authorized, versioned, and auditable.

## 9. Mission identity

A mission identity includes:

```text
missionId
tenantId
learnerId
missionVersion
missionType
originType
originId
createdAt
```

Identity rules:

- mission IDs are immutable
- learner scope cannot change after creation
- tenant scope cannot change after creation
- a changed objective requires a new version or replacement mission
- supersession creates history; it does not overwrite the prior mission

## 10. Mission objective model

A mission contains one or more objectives:

```text
objectiveId
objectiveType
targetRef
purpose
successEvidenceSpec
minimumEvidence
completionContribution
ordering
optional
```

Objective types may include:

```text
LEARN_CONCEPT
PRACTICE_SKILL
ASSESS_READINESS
APPLY_IN_CONTEXT
TRANSFER_REPRESENTATION
RETAIN_KNOWLEDGE
COMPLETE_GAMEPLAY_CHALLENGE
REQUEST_HUMAN_SUPPORT
```

Objectives must remain bounded. A mission may not use vague goals such as “be good at mathematics.”

## 11. Mission contract

A mission contract should contain at least:

```text
MissionContract {
  missionId
  tenantId
  learnerId
  version
  type
  title
  purpose
  rationale
  sourceRefs[]
  objectives[]
  optionality
  eligibilityPolicy
  activationPolicy
  progressPolicy
  completionPolicy
  evidencePolicy
  expirationPolicy
  supportPolicy
  state
  createdAt
  updatedAt
}
```

## 12. Eligibility principle

A proposed mission must be checked before activation.

Eligibility may consider:

- learner identity and tenant scope
- recommendation publication state
- prerequisite blockers
- current mission load
- duplicate or overlapping missions
- learner age or safety constraints
- entitlement constraints
- required human approval
- stale or superseded source recommendation
- gameplay capability availability

Eligibility does not reassess the learner. It validates whether the mission may operationally proceed.

## 13. Activation principle

Activation is a separate authority decision.

```text
PROPOSED ≠ ACTIVE
ELIGIBLE ≠ ACTIVE
ACCEPTED ≠ ACTIVE
```

Activation requires:

- eligible mission
- accepted optionality policy
- valid actor authority
- available delivery capability
- no critical blocker
- idempotent activation command
- optimistic version match

## 14. Progress principle

Mission progress is operational progress, not learning truth.

Examples of valid progress:

- 3 of 5 activities delivered
- 8 of 10 practice items attempted
- one required representation completed
- gameplay checkpoint reached
- mentor review submitted

Invalid inference:

```text
80% mission progress = 80% mastery
```

## 15. Completion principle

Mission completion means the mission contract’s completion conditions were satisfied.

It does not mean:

- mastery confirmed
- misconception resolved
- readiness confirmed
- recommendation fulfilled permanently
- curriculum standard achieved

Correct loop:

```text
Mission completed
  ↓
Evidence finalized
  ↓
Assessment interprets evidence
  ↓
Recommendation recalculates next action
```

## 16. Evidence boundary

The Mission Engine may package and route evidence but must not interpret it as assessment truth.

Mission evidence may include:

- attempts
- responses
- timing
- hints used
- representations used
- gameplay decisions
- completion artifacts
- human observations
- learner reflections

Evidence must retain provenance, timestamps, source activity, mission identity, and learner scope.

## 17. Human authority

Authorized human actors may:

- approve a proposed mission
- defer or reject a mission
- modify allowed scheduling parameters
- add support arrangements
- pause or cancel a mission
- review mission evidence

They may not silently rewrite historical mission state or fabricate assessment claims.

## 18. Concurrency and idempotency

All mission-changing commands require:

- commandId
- expectedVersion
- actor identity
- tenant identity
- learner identity
- correlationId
- timestamp

Repeated commands with the same commandId must return the same durable outcome.

No last-write-wins behavior is allowed for mission lifecycle changes.

## 19. Failure model

Representative failure codes:

```text
MISSION_NOT_FOUND
MISSION_SCOPE_MISMATCH
MISSION_VERSION_CONFLICT
MISSION_SOURCE_INVALID
MISSION_SOURCE_STALE
MISSION_NOT_ELIGIBLE
MISSION_ALREADY_ACTIVE
MISSION_ALREADY_TERMINAL
MISSION_TRANSITION_INVALID
MISSION_ACTOR_UNAUTHORIZED
MISSION_DELIVERY_UNAVAILABLE
MISSION_DUPLICATE_ACTIVE
MISSION_BLOCKED_BY_PREREQUISITE
MISSION_EVIDENCE_POLICY_INVALID
```

Failures must be explicit and must not partially mutate mission state.

## 20. Foundation invariants

1. Recommendation proposes; Mission Engine activates.
2. Mission activation never changes recommendation truth.
3. Mission completion never declares mastery.
4. Mission progress never becomes assessment confidence.
5. Every mission has one learner scope and one tenant scope.
6. Mission history is append-only.
7. Terminal missions cannot silently return to ACTIVE.
8. Supersession preserves the superseded mission.
9. Evidence is routed, not interpreted, by the Mission Engine.
10. Projection may simplify mission meaning but cannot strengthen it.
11. Human approval cannot erase provenance.
12. Gameplay cannot mutate mission lifecycle without an authorized command.
13. Duplicate activation is idempotent.
14. Version conflicts fail closed.
15. Stale or withdrawn source recommendations cannot create new active missions.

## 21. Initial runtime modules

```text
mission-engine/
  domain/
    mission.ts
    mission-objective.ts
    mission-policy.ts
    mission-transition.ts
  application/
    propose-mission.ts
    evaluate-mission-eligibility.ts
    accept-mission.ts
    activate-mission.ts
    pause-mission.ts
    resume-mission.ts
    complete-mission.ts
    abandon-mission.ts
    supersede-mission.ts
  infrastructure/
    mission-repository.ts
    mission-event-store.ts
  projection/
    learner-mission-view.ts
    parent-mission-view.ts
    teacher-mission-view.ts
  verification/
    mission-verifier.ts
```

## 22. Acceptance criteria for 28A

Chapter 28A is satisfied when the architecture clearly establishes:

- Mission Engine purpose and boundaries
- mission identity and contract
- lifecycle vocabulary
- source and optionality semantics
- activation separation
- progress and completion semantics
- evidence boundary
- human authority
- concurrency and idempotency rules
- foundational invariants

## 23. Closing statement

The Mission Engine exists to convert trustworthy recommendations into trustworthy action without confusing action with understanding.

```text
Recommendation explains the next best direction.
Mission governs the commitment.
Gameplay delivers the experience.
Assessment determines what the evidence means.
```
