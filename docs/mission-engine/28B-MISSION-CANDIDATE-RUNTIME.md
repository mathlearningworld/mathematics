# Chapter 28B — Mission Candidate Runtime

## 1. Purpose

The Mission Candidate Runtime converts eligible upstream intents into explicit mission candidates before any mission is proposed or activated.

```text
Recommendation / Learner Goal / Human Plan / Curriculum Need
  ↓
Candidate Generation
  ↓
Candidate Validation
  ↓
Candidate Deduplication
  ↓
Candidate Ranking Inputs
  ↓
Mission Proposal Runtime
```

A candidate is not a mission. It is a structured possibility that may later be rejected, deferred, merged, or proposed.

## 2. Responsibility

The runtime owns:

- candidate generation from authoritative sources
- source normalization
- candidate identity
- eligibility prechecks
- duplicate and overlap detection
- candidate grouping
- prerequisite and dependency annotation
- delivery-capability annotation
- candidate expiration
- candidate provenance

It does not own:

- final mission activation
- final learner choice
- assessment interpretation
- recommendation prioritization changes
- gameplay execution
- mastery claims

## 3. Candidate sources

Supported sources:

```text
VERIFIED_RECOMMENDATION
LEARNER_SELECTED_GOAL
PARENT_PLAN
TEACHER_PLAN
MENTOR_PLAN
CURRICULUM_OBLIGATION
RETENTION_SCHEDULE
RECOVERY_TRIGGER
EXPLORATION_DISCOVERY
SYSTEM_OPERATIONAL_NEED
```

Every source must provide:

```text
sourceType
sourceId
sourceVersion
sourceState
sourceCreatedAt
sourceExpiresAt?
tenantId
learnerId
rationale
```

## 4. Candidate contract

```text
MissionCandidate {
  candidateId
  tenantId
  learnerId
  candidateVersion
  missionType
  purpose
  sourceRefs[]
  objectiveDrafts[]
  optionality
  priorityInput
  prerequisiteRefs[]
  blockerRefs[]
  deliveryRequirements[]
  supportRequirements[]
  estimatedEffort
  expirationAt?
  candidateState
  createdAt
  updatedAt
}
```

## 5. Candidate states

```text
GENERATED
VALIDATED
BLOCKED
DEFERRED
DUPLICATE
MERGED
ELIGIBLE_FOR_PROPOSAL
PROPOSED
EXPIRED
REJECTED
SUPERSEDED
```

State changes must be explicit and versioned.

## 6. Generation rules

Candidate generation must be deterministic for the same:

- source version
- learner scope
- policy version
- curriculum graph version
- delivery capability snapshot

The runtime may create multiple candidates from one recommendation when the recommendation contains multiple operationally distinct actions.

Example:

```text
Recommendation:
Repair fraction equivalence before equation word problems

Candidates:
1. Foundation learning mission: fraction equivalence
2. Representation mission: verbal-to-symbolic translation
3. Later preparation mission: equation word problems
```

## 7. Candidate granularity

A candidate must be small enough to be actionable and large enough to produce meaningful evidence.

Reject candidates that are:

- unbounded
- purely aspirational
- impossible to verify
- unrelated to an authoritative source
- too broad for one mission lifecycle
- too fragmented to produce useful evidence

## 8. Objective drafting

Each candidate objective draft includes:

```text
objectiveDraftId
objectiveType
targetRef
purpose
expectedEvidenceTypes[]
minimumEvidence
completionContribution
required
sequenceHint
```

Objective drafts are proposals, not final mission objectives.

## 9. Prerequisite annotation

The runtime must preserve prerequisite truth from Recommendation and curriculum sources.

```text
Candidate target
  ↓
Required prerequisite set
  ↓
Blocking prerequisites
  ↓
Candidate eligibility annotation
```

A blocking prerequisite cannot be averaged away by strong performance elsewhere.

## 10. Blocker model

Representative blockers:

```text
PREREQUISITE_NOT_READY
SOURCE_STALE
SOURCE_WITHDRAWN
SOURCE_NOT_VERIFIED
DUPLICATE_ACTIVE_MISSION
DELIVERY_CAPABILITY_UNAVAILABLE
LEARNER_LOAD_LIMIT
HUMAN_APPROVAL_REQUIRED
ENTITLEMENT_REQUIRED
SAFETY_RESTRICTION
SCHEDULE_CONFLICT
DEPENDENCY_MISSION_INCOMPLETE
INSUFFICIENT_EVIDENCE
```

A blocked candidate may remain durable for later reevaluation.

## 11. Duplicate detection

Candidates are potential duplicates when they share material equivalence across:

- learner
- target
- purpose
- mission type
- source recommendation family
- active time window
- evidence expectation

Duplicate detection outcomes:

```text
NOT_DUPLICATE
EXACT_DUPLICATE
OVERLAPPING
SUBSUMED_BY_EXISTING
CAN_MERGE
MUST_REMAIN_SEPARATE
```

Deduplication must not erase source provenance.

## 12. Merge policy

Candidate merging is allowed only when:

- learner and tenant scope match
- objectives are compatible
- optionality is not strengthened
- completion semantics remain clear
- evidence requirements remain traceable
- source rationale is preserved

Merged candidates retain all source references.

## 13. Candidate priority inputs

The candidate runtime may expose inputs such as:

```text
blockingSeverity
learningImpact
readinessUrgency
goalAlignment
retentionRisk
misconceptionRisk
curriculumImportance
learnerPreference
humanPreference
effortEstimate
deliveryAvailability
```

It does not own the final recommendation priority truth. It only prepares mission-operational ranking inputs.

## 14. Effort estimation

Estimated effort may include:

```text
estimatedActivities
estimatedMinutes
estimatedSessions
estimatedSupportLevel
estimatedCognitiveLoad
```

Effort is advisory and cannot become a mastery estimate.

## 15. Delivery requirements

Candidate delivery requirements may include:

```text
LESSON_RUNTIME
PRACTICE_RUNTIME
ASSESSMENT_RUNTIME
GAMEPLAY_SCENE
MENTOR_SESSION
PARENT_REVIEW
TEACHER_REVIEW
DEVICE_CAPABILITY
NETWORK_CAPABILITY
ACCESSIBILITY_SUPPORT
```

A candidate cannot become eligible for proposal when a mandatory delivery capability is unavailable unless an authorized fallback exists.

## 16. Candidate expiration

Candidates may expire when:

- source recommendation expires
- learner context changes materially
- curriculum plan changes
- a superseding candidate is accepted
- evidence invalidates the original need
- delivery window closes

Expiration must preserve history.

## 17. Candidate commands

Representative commands:

```text
GenerateMissionCandidates
ValidateMissionCandidate
BlockMissionCandidate
DeferMissionCandidate
MergeMissionCandidates
RejectMissionCandidate
MarkCandidateEligibleForProposal
ExpireMissionCandidate
SupersedeMissionCandidate
```

Each command requires actor, tenant, learner, commandId, correlationId, expectedVersion, and policy version.

## 18. Candidate events

```text
MissionCandidateGenerated
MissionCandidateValidated
MissionCandidateBlocked
MissionCandidateDeferred
MissionCandidateDuplicateDetected
MissionCandidatesMerged
MissionCandidateEligibleForProposal
MissionCandidateProposed
MissionCandidateExpired
MissionCandidateRejected
MissionCandidateSuperseded
```

Events are append-only.

## 19. Idempotency

Generation must avoid duplicate durable candidates when the same source event is processed repeatedly.

Recommended idempotency key:

```text
hash(tenantId, learnerId, sourceType, sourceId, sourceVersion, policyVersion, candidatePurpose)
```

## 20. Candidate invariants

1. Candidate is not mission.
2. Candidate is not active work.
3. Candidate cannot declare mastery.
4. Candidate learner and tenant scope are immutable.
5. Every candidate has authoritative provenance.
6. Withdrawn source cannot generate a new eligible candidate.
7. Duplicate handling cannot erase provenance.
8. Merge cannot strengthen optionality.
9. Merge cannot weaken evidence requirements without explicit policy.
10. Blocking prerequisites remain explicit.
11. Candidate eligibility is not mission activation.
12. Candidate history is append-only.
13. Candidate generation is idempotent.
14. Version conflicts fail closed.
15. Delivery unavailability remains visible.

## 21. Verification scenarios

The runtime must verify at least:

- one recommendation generates one deterministic candidate
- one recommendation may generate multiple bounded candidates
- repeated source delivery does not duplicate candidates
- cross-learner source is rejected
- stale recommendation is blocked
- withdrawn recommendation cannot generate proposal-eligible candidate
- exact duplicate is detected
- compatible candidates merge while preserving provenance
- incompatible optionality prevents merge
- blocking prerequisite prevents proposal eligibility
- unavailable mandatory gameplay capability blocks candidate
- supersession preserves prior candidate history

## 22. Output to 28C

The Candidate Runtime emits proposal-ready records:

```text
ProposalReadyMissionCandidate {
  candidateId
  candidateVersion
  learnerId
  missionType
  purpose
  objectiveDrafts[]
  optionality
  sourceRefs[]
  blockers: []
  deliveryRequirements[]
  supportRequirements[]
  expirationAt?
  eligibilityEvidence[]
}
```

Only candidates with no unresolved critical blockers may proceed.

## 23. Acceptance criteria for 28B

Chapter 28B is satisfied when:

- candidate and mission are clearly separated
- sources and provenance are defined
- candidate lifecycle is explicit
- duplicate and merge semantics are bounded
- blockers and prerequisites are preserved
- delivery capability is represented
- idempotency and concurrency rules exist
- proposal-ready output is defined
- verification scenarios are specified

## 24. Closing statement

The Candidate Runtime protects the Mission Engine from converting every signal into immediate work.

```text
A need may create a candidate.
A candidate may become a proposal.
A proposal may be accepted.
Only an authorized accepted proposal may become active work.
```
