# 27H — Recommendation Persistence & Replay

Status: PERSISTENCE AND REPLAY DEFINED  
Depends on: 27A–27G

## 1. Purpose

Recommendation Persistence & Replay defines how recommendation decisions, evidence references, priority reasoning, publication state, projections, and supersession history are stored and reconstructed without rewriting history.

The runtime must answer:

> What was recommended, why was it recommended, under which policy and evidence state, what happened next, and can the same historical state be reproduced?

## 2. Core Principle

```text
Recommendation history is append-only.
Claims are superseded, never overwritten.
Historical replay is not reassessment.
```

Persistence preserves the decision that was made at that time. Replay reconstructs that historical decision from the historical inputs and policy versions.

## 3. Authority Boundary

Persistence owns durable recording of recommendation state.

Replay owns deterministic reconstruction and comparison.

Neither persistence nor replay may:

- create new assessment evidence,
- reinterpret historical evidence using current policy unless explicitly requested,
- strengthen confidence,
- activate missions,
- alter historical priority,
- erase rejected or quarantined decisions,
- replace the original recommendation record.

## 4. Persisted Aggregate Model

Primary durable records:

```text
RecommendationCaseRecord
RecommendationContextSnapshot
RecommendationCandidateRecord
RecommendationPriorityDecision
RecommendationRecord
RecommendationSetRecord
RecommendationVerificationRecord
RecommendationProjectionRecord
RecommendationPublicationRecord
RecommendationSupersessionRecord
RecommendationConsumptionRecord
RecommendationReplayRecord
```

## 5. Recommendation Case Record

Required fields:

```text
recommendationCaseId
learnerId
tenantId
caseVersion
caseStatus
openedAt
closedAt
triggerType
triggerRef
contextSnapshotId
policyBundleId
correlationId
causationId
```

A case groups one recommendation evaluation cycle.

## 6. Context Snapshot

A context snapshot freezes all decision-relevant references:

```text
assessmentClaimRefs
readinessRefs
misconceptionRefs
learningHistoryRef
curriculumGraphVersion
learnerGoalRefs
missionStateRefs
assetAvailabilityVersion
recommendationPolicyVersion
prioritizationPolicyVersion
projectionPolicyVersion
capturedAt
```

The snapshot stores stable references or immutable values sufficient for replay.

## 7. Candidate Persistence

Each candidate record preserves:

```text
candidateId
candidateVersion
sourceTypes
sourceRefs
target
recommendationType
eligibilityState
blockingConditions
limitations
deduplicationKey
derivationTrace
createdAt
```

Candidate records are immutable once included in a finalized candidate set.

## 8. Priority Decision Persistence

Priority decisions preserve more than a final score.

Required fields:

```text
priorityDecisionId
candidateId
priorityBand
blockingRuleResults
factorValues
dependencyOrder
tieBreakTrace
policyVersion
limitations
reasonCodes
decidedAt
```

A numeric score alone is insufficient for durable explainability.

## 9. Recommendation Record

Required fields:

```text
recommendationId
recommendationVersion
recommendationCaseId
recommendationSetId
recommendationType
target
purpose
priorityBand
confidence
optionality
status
reasonModel
sourceRefs
limitations
stoppingRules
reviewTrigger
validFrom
validUntil
createdAt
```

## 10. Recommendation Set Record

A recommendation set freezes ordered output:

```text
recommendationSetId
setVersion
caseId
orderedRecommendationRefs
orderingPolicyVersion
publicationState
verificationState
createdAt
```

Order is part of the persisted decision and cannot be reconstructed from current sorting rules alone.

## 11. Verification Persistence

Verification records include:

```text
verificationId
subjectType
subjectRef
verificationPolicyVersion
checks
violations
warnings
publicationDecision
reviewRequirement
verifiedAt
```

Verification cannot be overwritten by a later verification. A new verification creates a new record.

## 12. Projection Persistence

Projection records preserve:

```text
projectionId
projectionVersion
audience
locale
sourceRecommendationVersion
projectionPolicyVersion
payloadHash
redactions
publicationState
createdAt
supersededAt
```

The projection payload or a durable canonical representation must be recoverable.

## 13. Publication Record

Publication is a durable event:

```text
publicationId
subjectRef
audience
publicationDecision
channel
publishedAt
expiresAt
withdrawnAt
withdrawalReason
```

Publishing and recommendation creation are separate facts.

## 14. Supersession Record

Supersession never deletes history.

```text
supersessionId
supersededRecommendationRef
successorRecommendationRef
reason
sourceChangeRefs
effectiveAt
createdAt
```

Supported reasons:

```text
NEW_EVIDENCE
GOAL_CHANGED
POLICY_CHANGED
CONTEXT_CHANGED
ASSET_AVAILABILITY_CHANGED
HUMAN_DECISION
STALE_RECOMMENDATION
VERIFICATION_FAILURE
```

## 15. Consumption Record

Downstream use is recorded separately:

```text
consumptionId
recommendationRef
consumerType
consumerRef
action
result
occurredAt
```

Examples:

```text
MISSION_PROPOSAL_ACCEPTED
MISSION_PROPOSAL_MODIFIED
LEARNING_ACTIVITY_STARTED
PRACTICE_ACTIVITY_COMPLETED
PARENT_VIEW_OPENED
TEACHER_REVIEW_REQUESTED
```

Consumption does not mutate the original recommendation.

## 16. Event Model

Representative events:

```text
RecommendationCaseOpened
RecommendationContextFrozen
RecommendationCandidateGenerated
RecommendationCandidateBlocked
RecommendationCandidatesDeduplicated
RecommendationPrioritized
RecommendationSetFinalized
RecommendationVerified
RecommendationPublished
RecommendationProjected
RecommendationConsumed
RecommendationSuperseded
RecommendationWithdrawn
RecommendationReplayRequested
RecommendationReplayCompleted
RecommendationReplayDiverged
```

## 17. Append-Only Rule

The durable history must preserve every meaningful transition.

Forbidden patterns:

```text
UPDATE recommendation SET reason = new_reason
DELETE old recommendation
replace historical confidence with current confidence
reuse one row as mutable current truth without history
```

Current-state tables may exist as projections, but the source history remains append-only.

## 18. Optimistic Concurrency

Writes require expected version checks.

```text
expectedCaseVersion
expectedRecommendationVersion
expectedSetVersion
```

Conflicts produce explicit failures:

```text
CASE_VERSION_CONFLICT
RECOMMENDATION_VERSION_CONFLICT
SET_VERSION_CONFLICT
```

No Last-write-wins behavior is allowed.

## 19. Idempotency

Commands that may be retried require stable idempotency keys.

Examples:

```text
freeze-context:{caseId}:{caseVersion}
finalize-set:{caseId}:{candidateSetVersion}
publish:{recommendationSetId}:{audience}:{version}
supersede:{oldRecommendationId}:{newRecommendationId}
```

A duplicate command returns the original result or an explicit equivalent result.

## 20. Transaction Boundary

A finalized recommendation set should atomically persist:

- ordered recommendation references,
- priority decisions,
- source snapshot association,
- status transition,
- correlation metadata.

Publication and projection may occur in later transactions but must reference the exact finalized set version.

## 21. Replay Types

```text
HISTORICAL_REPLAY
CURRENT_POLICY_REPLAY
DIAGNOSTIC_REPLAY
PROJECTION_REPLAY
```

### Historical Replay

Uses historical evidence references, context snapshot, policy versions, and deterministic rules.

### Current Policy Replay

Uses the same historical context with current policy. This produces a simulation, not a replacement historical truth.

### Diagnostic Replay

Executes selected stages to investigate divergence.

### Projection Replay

Rebuilds audience projections from a historical recommendation source.

## 22. Historical Replay Rule

```text
Historical replay ≠ reassessment
Historical replay ≠ new recommendation
Historical replay ≠ mutation
```

Replay output is stored separately and labeled with replay type.

## 23. Replay Input Bundle

A replay bundle includes:

```text
caseSnapshot
assessmentRefs
candidateRulesVersion
prioritizationPolicyVersion
recommendationPolicyVersions
verificationPolicyVersion
projectionPolicyVersion
runtimeVersion
randomSeedOrNoRandomness
```

Any missing required dependency makes deterministic replay unavailable.

## 24. Determinism

Equivalent replay inputs must produce equivalent canonical outputs.

Canonical comparison excludes operationally irrelevant fields such as execution timestamp, worker ID, and trace span ID.

Canonical comparison includes:

- candidate identities,
- eligibility outcomes,
- ordering,
- recommendation types,
- targets,
- priority bands,
- confidence ceilings,
- limitations,
- publication decisions.

## 25. Replay Outcomes

```text
MATCH
MATCH_WITH_NON_SEMANTIC_DIFFERENCE
DIVERGED
UNREPLAYABLE
FAILED
```

## 26. Divergence Record

A divergence must include:

```text
replayId
historicalOutputRef
replayedOutputRef
divergenceStage
divergenceFields
semanticImpact
suspectedCause
runtimeVersion
policyVersions
createdAt
```

Divergence must never silently rewrite historical output.

## 27. Replay Failure Reasons

```text
MISSING_CONTEXT_SNAPSHOT
MISSING_POLICY_VERSION
MISSING_SOURCE_REFERENCE
NON_DETERMINISTIC_RULE
UNSUPPORTED_RUNTIME_VERSION
CORRUPT_EVENT_STREAM
PROJECTION_PAYLOAD_UNAVAILABLE
CANONICALIZATION_FAILED
```

## 28. Current State Projection

A current-state projection may expose:

```text
currentRecommendationSet
activeRecommendations
staleRecommendations
supersededRecommendations
pendingHumanReview
lastPublishedAt
```

It is rebuildable from the append-only history.

## 29. Temporal Semantics

Every recommendation decision has three relevant times:

```text
evidence time
decision time
publication time
```

These must not be collapsed into one timestamp.

Late-arriving evidence does not retroactively alter an earlier decision. It causes a new recommendation cycle.

## 30. Retention

Retention policy must distinguish:

- authoritative event history,
- snapshots,
- projections,
- transient caches,
- operational logs.

Authoritative recommendation and verification history must remain durable according to product and regulatory policy.

## 31. Privacy

Persistence must enforce tenant and learner boundaries.

Required protections:

- tenant-scoped keys,
- audience-aware access,
- encrypted sensitive data where applicable,
- redaction in operational logs,
- auditable access to full evidence traces,
- deletion/anonymization policy that preserves required structural audit facts.

## 32. Schema Evolution

Historical records must remain interpretable after schema changes.

Each durable payload includes:

```text
schemaVersion
runtimeVersion
policyVersion
```

Migration must not change historical semantic meaning.

## 33. Cache Rule

Caches are disposable.

```text
Cache ≠ Source of Truth
Projection table ≠ Event history
Current row ≠ complete audit trail
```

## 34. Recovery

After interruption, runtime recovers from durable state and resumes only valid transitions.

Examples:

- finalized but unpublished set → resume publication,
- published but unprojected audience → rebuild projection,
- supersession recorded but current projection stale → rebuild current projection,
- replay interrupted → restart idempotently.

## 35. Persistence Failure Codes

```text
RECOMMENDATION_CASE_NOT_FOUND
CONTEXT_SNAPSHOT_NOT_FOUND
EXPECTED_VERSION_MISMATCH
DUPLICATE_RECOMMENDATION_ID
INVALID_STATE_TRANSITION
SOURCE_REFERENCE_NOT_DURABLE
TRANSACTION_FAILED
EVENT_APPEND_FAILED
PROJECTION_WRITE_FAILED
SUPERSESSION_CONFLICT
REPLAY_DEPENDENCY_MISSING
REPLAY_DIVERGENCE_DETECTED
```

## 36. Verification Contract

Minimum verification cases:

- append-only history cannot be overwritten,
- optimistic concurrency rejects stale writes,
- duplicate commands are idempotent,
- recommendation order is durably preserved,
- supersession preserves predecessor and successor,
- historical replay uses historical policy,
- current-policy replay is labeled simulation,
- replay divergence is recorded and not hidden,
- current state can rebuild from history,
- tenant isolation is enforced.

## 37. Completion Rule

27H is complete when Recommendation Engine can durably preserve every recommendation decision and its reasoning, reconstruct current state, replay historical behavior deterministically, detect divergence, and retain immutable supersession and publication history without converting replay into reassessment or mutation.
