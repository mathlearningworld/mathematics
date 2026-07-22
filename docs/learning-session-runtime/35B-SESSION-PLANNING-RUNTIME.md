# Chapter 35B — Session Planning Runtime

## 1. Purpose

Session Planning Runtime converts approved learning intent into a versioned, executable, safe, evidence-aware learning session plan.

It determines what the session will attempt, why it exists, what sequence of activities is permitted, which channels may execute it, what evidence is required, and when the plan must stop, adapt, defer, or escalate.

## 2. Planning Boundary

Planning owns:

- authority validation,
- objective resolution,
- prerequisite resolution,
- activity candidate generation,
- activity sequencing,
- channel selection,
- dosage and pacing,
- evidence planning,
- accessibility and safety constraints,
- session duration bounds,
- checkpoint policy,
- completion and stop policies,
- plan versioning.

Planning does not own:

- live activity execution,
- real-time learner adaptation,
- evidence interpretation beyond plan eligibility,
- diagnostic revision,
- mastery declaration,
- long-term progress aggregation.

## 3. Planning Inputs

A planning request may include:

```text
planningRequestId
learnerId
tenantId
sessionKind
sourceAuthorityType
sourceAuthorityId
objectiveRequests
availableTimeWindow
preferredChannels
requiredChannels
accessibilityProfileRef
safetyPolicyRef
learnerPreferenceRef
interventionPlanRef
missionRef
assessmentConfigRef
curriculumContextRef
skillGraphContextRef
correlationId
```

All referenced authorities must be resolved to immutable versions before plan authorization.

## 4. Planning Pipeline

Authoritative pipeline:

```text
Receive request
Validate identity and authority
Resolve learner context
Resolve objectives
Resolve prerequisite constraints
Resolve policy and safety constraints
Resolve available channels
Generate activity candidates
Score candidate suitability
Construct sequence candidates
Evaluate duration and burden
Define evidence plan
Define checkpoint and recovery plan
Define completion and stop rules
Select plan or defer
Persist immutable plan version
Request authorization
```

A pipeline stage may return `BLOCKED`, `DEFERRED`, `INCONCLUSIVE`, or `REQUIRES_HUMAN_REVIEW` rather than forcing a plan.

## 5. Session Plan Aggregate

A `LearningSessionPlan` must include:

```text
planId
sessionId
planVersion
status
createdAt
createdBy
sourceAuthorityRefs
learnerContextVersion
objectiveBindings
phaseDefinitions
activityBindings
channelBindings
timeBudget
pacingPolicy
evidencePlan
checkpointPolicy
adaptationEnvelope
completionPolicy
stopPolicy
safetyConstraints
accessibilityConstraints
expiryPolicy
recoveryPolicy
```

The plan becomes immutable once authorized. Any change creates a new version.

## 6. Plan Status

```text
DRAFT
CANDIDATE
PENDING_REVIEW
AUTHORIZED
REJECTED
SUPERSEDED
EXPIRED
WITHDRAWN
```

Only an `AUTHORIZED` plan may be activated by Session Orchestration Runtime.

## 7. Objective Resolution

Each requested objective is classified as:

```text
REQUIRED
IMPORTANT
OPTIONAL
CONDITIONAL
EXCLUDED
```

Planning must detect:

- conflicting objectives,
- impossible objectives for the available duration,
- objectives without executable activities,
- objectives blocked by prerequisites,
- objectives requiring unavailable human support,
- objectives prohibited by safety or accessibility policy.

Planning must prefer an honest reduced plan over an overloaded plan.

## 8. Prerequisite Handling

Prerequisites may be:

```text
SATISFIED
LIKELY_SATISFIED
UNKNOWN
UNSATISFIED
BLOCKING
```

An unknown prerequisite must not be silently treated as satisfied.

The planner may:

- include a lightweight readiness check,
- add a prerequisite repair phase,
- defer the target objective,
- split the work into multiple sessions,
- request diagnostic review.

## 9. Activity Candidate Model

Each candidate must expose:

```text
activityDefinitionId
activityVersion
supportedObjectiveTypes
supportedSkillRefs
channelRequirements
estimatedDuration
estimatedCognitiveLoad
estimatedInteractionLoad
evidenceCapabilities
accessibilityCapabilities
safetyClass
retryCharacteristics
prerequisiteRequirements
```

Candidate ranking must never override hard safety, policy, or authority constraints.

## 10. Sequence Construction

A session plan is divided into phases such as:

```text
ORIENTATION
READINESS_CHECK
EXPLANATION
MODELED_EXAMPLE
GUIDED_PRACTICE
INDEPENDENT_PRACTICE
RETRIEVAL
TRANSFER
REFLECTION
CLOSURE
```

A phase definition includes:

```text
phaseId
phaseType
objectiveRefs
entryConditions
activityRefs
exitConditions
maxDuration
requiredCheckpoint
```

The sequence must preserve pedagogical dependencies without assuming that more steps always produce better learning.

## 11. Time Budget

The time model distinguishes:

- planned total duration,
- maximum total duration,
- expected active learning duration,
- break allowance,
- transition allowance,
- human-support allowance,
- recovery allowance.

The planner must account for learner age, fatigue, accessibility needs, and session kind.

## 12. Pacing Policy

Pacing may be:

```text
LEARNER_CONTROLLED
SYSTEM_GUIDED
HUMAN_GUIDED
FIXED_WINDOW
ADAPTIVE_WITHIN_BOUNDS
```

Pacing policy must define:

- minimum exposure,
- maximum repetition,
- wait limits,
- hint policy,
- skip policy,
- break policy,
- escalation policy.

## 13. Channel Planning

Channels are selected by capability and authority, not merely availability.

Channel binding contains:

```text
channelId
channelType
channelVersion
supportedActivityRefs
requiredParticipantRoles
fallbackChannelRefs
activationPolicy
failurePolicy
```

A fallback channel must be explicitly authorized before runtime failure occurs.

## 14. Evidence Plan

Every objective must define evidence before execution.

Evidence plan fields:

```text
evidenceRequirementId
objectiveRef
evidenceType
captureSource
minimumQuality
minimumQuantity
timingWindow
validationPolicy
retentionPolicy
privacyClass
```

Evidence types may include:

```text
RESPONSE
WORKED_STEP
ERROR_PATTERN
HINT_USAGE
LATENCY
EXPLANATION
STRATEGY_SELECTION
GAMEPLAY_ACTION
HUMAN_OBSERVATION
ASSESSMENT_RESULT
RETENTION_PROBE
TRANSFER_PROBE
```

Completion without the required evidence must remain distinguishable from objective evidence satisfaction.

## 15. Completion Policy

Completion policy may define:

- required phases,
- required activities,
- minimum active duration,
- required evidence collection,
- allowed skipped activities,
- maximum unresolved errors,
- closure acknowledgment,
- human sign-off requirements.

Session completion is a runtime condition, not a mastery verdict.

## 16. Stop Policy

Stop conditions include:

```text
SAFETY_TRIGGERED
FATIGUE_LIMIT
ACCESSIBILITY_BLOCK
CHANNEL_UNAVAILABLE
HUMAN_SUPPORT_REQUIRED
OBJECTIVE_INVALIDATED
TIME_BUDGET_EXHAUSTED
LEARNER_REQUEST
POLICY_BLOCK
REPEATED_EXECUTION_FAILURE
```

A stop may lead to pause, defer, re-plan, cancel, or escalate depending on policy.

## 17. Adaptation Envelope

The plan defines what may change without full re-planning:

```text
allowedHintChanges
allowedDifficultyRange
allowedActivitySubstitutions
allowedPacingRange
allowedRepetitionRange
allowedBreakChanges
maximumAutomaticAdaptations
replanTriggers
diagnosticReviewTriggers
humanReviewTriggers
```

An adaptation envelope is permission, not an obligation to adapt.

## 18. Checkpoint and Recovery Policy

The plan must identify:

- checkpoint frequency,
- mandatory checkpoint boundaries,
- replay-safe activity boundaries,
- resumable and non-resumable activities,
- evidence cursor behavior,
- channel cursor behavior,
- expiry after interruption,
- human confirmation requirements.

## 19. Plan Quality Evaluation

A candidate plan is evaluated across:

```text
AUTHORITY_FIT
OBJECTIVE_COVERAGE
PREREQUISITE_FIT
PEDAGOGICAL_COHERENCE
CHANNEL_FEASIBILITY
TIME_FEASIBILITY
COGNITIVE_BURDEN
ACCESSIBILITY_FIT
SAFETY_FIT
EVIDENCE_SUFFICIENCY
RECOVERY_READINESS
```

Scores may support ranking but cannot erase a blocking failure.

## 20. Planning Decisions

Planning returns one of:

```text
PLAN_CREATED
PLAN_REDUCED
PLAN_SPLIT_REQUIRED
DEFERRED
BLOCKED
HUMAN_REVIEW_REQUIRED
DIAGNOSTIC_REVIEW_REQUIRED
NO_SAFE_PLAN
```

`NO_SAFE_PLAN` is a valid and preferable result when no compliant plan exists.

## 21. Versioning

Every material change creates a new `planVersion`.

Material changes include:

- objective changes,
- phase changes,
- activity definition changes,
- channel changes,
- evidence requirement changes,
- adaptation envelope changes,
- safety policy changes,
- completion or stop policy changes.

An active session cannot silently adopt a new plan version.

## 22. Planning Commands and Events

Commands:

```text
RequestSessionPlan
GenerateSessionPlanCandidate
SubmitSessionPlanForReview
AuthorizeSessionPlan
RejectSessionPlan
SupersedeSessionPlan
ExpireSessionPlan
```

Events:

```text
SessionPlanningRequested
SessionPlanCandidateGenerated
SessionPlanReduced
SessionPlanReviewRequested
SessionPlanAuthorized
SessionPlanRejected
SessionPlanSuperseded
SessionPlanExpired
SessionPlanningBlocked
```

## 23. Planning Invariants

1. No plan may exist without an authority chain.
2. No objective may be planned without a source reference.
3. No plan may start execution before authorization.
4. Hard safety and policy constraints override candidate ranking.
5. Unknown prerequisites cannot be silently treated as satisfied.
6. Evidence requirements must be defined before execution.
7. Fallback channels must be authorized before use.
8. Automatic adaptation must remain inside the plan envelope.
9. Material changes require a new plan version.
10. An active session cannot silently switch plan versions.
11. Reduced scope is preferable to unsafe overload.
12. No safe plan is an acceptable outcome.

## 24. Acceptance Criteria

35B is complete when the architecture defines:

- planning inputs and pipeline,
- immutable plan structure and status,
- objective, prerequisite, activity, sequence, channel, and time planning,
- evidence, completion, stop, checkpoint, recovery, and adaptation policies,
- quality evaluation and decision outcomes,
- versioning, commands, events, and invariants.

## 25. Final Doctrine

Session Planning Runtime must produce the smallest safe and executable plan that can meaningfully pursue the authorized objectives, collect the required evidence, survive interruption, and remain honest about uncertainty and limits.
