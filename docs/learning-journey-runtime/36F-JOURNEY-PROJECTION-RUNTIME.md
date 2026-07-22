# 36F — Journey Projection Runtime

## 1. Purpose

Journey Projection Runtime converts authoritative journey events and versioned cross-runtime facts into read models for learners, parents, teachers, operators, and downstream services.

It provides understandable current-state views without becoming a second write authority.

## 2. Core Rule

> Projection is a derived interpretation of authority, not authority itself.

## 3. Authority Boundary

Journey Projection Runtime owns:

- projection schemas
- event-to-view transformations
- projection checkpoints and watermarks
- projection freshness state
- audience-specific read models
- replay and rebuild behavior
- projection consistency checks
- redaction and visibility shaping

It does not own:

- journey commands
- lifecycle transitions
- adaptation decisions
- evidence qualification
- mastery decisions
- mission objectives
- source runtime correction

## 4. Projection Audiences

Supported audiences may include:

- learner
- parent or guardian
- teacher
- intervention specialist
- administrator
- system operator
- internal downstream runtime

Each audience receives a purpose-limited model.

## 5. Projection Families

Recommended projection families:

- `JourneySummaryProjection`
- `JourneyTimelineProjection`
- `JourneyPhaseProjection`
- `JourneyMilestoneProjection`
- `JourneyNextActionProjection`
- `JourneyEvidenceCoverageProjection`
- `JourneyRiskProjection`
- `JourneyAdaptationHistoryProjection`
- `JourneyOperationalProjection`
- `JourneyCompletionReviewProjection`

## 6. Journey Summary Projection

```text
JourneySummaryProjection
- journeyId
- learnerId
- missionRef
- objectiveSummary
- lifecycleState
- activePlanVersion
- activePhase
- currentMilestone
- progressSummary
- evidenceCoverageSummary
- blockerSummary
- nextRecommendedAction
- lastMeaningfulActivityAt
- freshness
- sourceWatermark
- projectionVersion
```

This model is optimized for overview, not detailed educational judgment.

## 7. Journey Timeline Projection

The timeline presents authoritative occurrences such as:

- journey created
- plan accepted
- phase activated
- session dispatched
- session completed
- milestone review-ready
- adaptation proposed
- adaptation applied
- intervention inserted
- blocker raised or resolved
- journey paused or resumed
- completion review initiated

Timeline entries must distinguish:

- factual events
- derived summaries
- human annotations
- system recommendations

## 8. Phase Projection

```text
JourneyPhaseProjection
- phaseId
- phaseOrder
- title
- purpose
- status
- startedAt
- completedAt
- milestoneCount
- completedMilestoneCount
- plannedSessionCount
- completedSessionCount
- evidenceCoverage
- blockers[]
- riskLevel
- nextAction
```

## 9. Milestone Projection

```text
JourneyMilestoneProjection
- milestoneId
- phaseId
- title
- status
- targetSkillRefs[]
- requiredEvidenceSummary
- currentEvidenceSummary
- unresolvedConflictCount
- reviewReadiness
- decisionAuthority
- updatedAt
```

A milestone projection must not label a learner as mastered unless that value comes from the authoritative mastery runtime.

## 10. Next Action Projection

The next action model may indicate:

- start planned session
- resume active session
- wait for review
- resolve blocker
- complete diagnostic
- review adaptation
- provide missing evidence
- contact teacher or guardian
- no action available

```text
JourneyNextActionProjection
- actionType
- actionLabel
- reasonCode
- targetRef
- eligibility
- blockedBy[]
- expiresAt
- authoritySource
```

## 11. Learner View

Learner-facing views should emphasize:

- where the learner is
- what comes next
- why the next activity matters
- visible progress
- supportive feedback
- optional reflection

They should avoid:

- opaque risk scoring
- sensitive educator notes
- deterministic predictions of ability
- unnecessary comparison with other learners
- punitive language

## 12. Parent or Guardian View

Parent-facing views may include:

- journey objective
- progress over time
- upcoming commitments
- evidence gaps described plainly
- support suggestions
- review requests
- intervention status allowed by policy

Visibility must respect learner age, consent, and protected educational notes.

## 13. Teacher View

Teacher-facing projections may include:

- class or learner journey status
- milestone readiness
- common blockers
- evidence conflicts
- intervention coordination
- overdue reviews
- prerequisite gaps
- adaptation history

Teacher views remain read models. Teacher decisions become commands through the relevant authoritative runtime.

## 14. Operational View

Operator projections may include:

- projection lag
- stuck journeys
- command backlog
- failed event consumption
- reconciliation state
- lease conflicts
- orphaned session intents
- stale cross-runtime references

Operational views must minimize learner content.

## 15. Source Inputs

Projection inputs may include versioned events from:

- Learning Journey Runtime
- Journey Planning Runtime
- Journey Orchestration Runtime
- Adaptive Journey Runtime
- Journey Evidence Runtime
- Learning Session Runtime
- Progress Engine
- Diagnostic Runtime
- Intervention Runtime
- Mission Runtime
- Mastery Runtime when available

Each source must declare ordering and compatibility semantics.

## 16. Projection Event Envelope

```text
ProjectionEventEnvelope
- eventId
- eventType
- aggregateType
- aggregateId
- aggregateVersion
- tenantId
- occurredAt
- recordedAt
- schemaVersion
- correlationId
- causationId
- payload
```

## 17. Ordering

Ordering is guaranteed only within an explicitly defined stream unless a stronger contract exists.

Projection handlers must support:

- duplicate events
- delayed events
- out-of-order cross-stream delivery
- replayed events
- missing dependency detection

## 18. Idempotency

Every projection handler records processed event identity.

Repeated delivery must not:

- increment counters twice
- duplicate timeline entries
- reopen completed items
- create repeated alerts
- regress source watermark

## 19. Projection Checkpoint

```text
ProjectionCheckpoint
- projectionName
- partitionKey
- lastEventPosition
- lastEventId
- sourceWatermark
- projectionVersion
- updatedAt
```

Checkpoint advancement and projection mutation should be atomic where supported.

## 20. Freshness Model

Freshness states:

- CURRENT
- SLIGHTLY_DELAYED
- STALE
- REBUILDING
- DEGRADED
- UNKNOWN

```text
ProjectionFreshness
- status
- lastProjectedAt
- sourceObservedAt
- lagDuration
- missingSourceRefs[]
- rebuildId
```

User interfaces must not present stale derived data as live without an indicator.

## 21. Rebuild and Replay

Projection rebuild process:

1. select projection schema version
2. create isolated rebuild target
3. replay authoritative events
4. validate counts and invariants
5. compare against active projection
6. atomically switch read alias
7. retain rollback window

Rebuild must not write commands back to source runtimes.

## 22. Partial Failure

If a source dependency is unavailable:

- preserve last valid projection
- mark affected fields stale or unknown
- record missing source reference
- avoid fabricating default success
- continue unaffected projection families when safe

## 23. Cross-Runtime Consistency

Journey projections are usually eventually consistent.

They must clearly distinguish:

- authoritative state
- derived summary
- pending action
- awaiting external confirmation
- unknown due to lag

## 24. Projection Redaction

Redaction is applied based on:

- audience role
- tenant
- learner relationship
- consent
- privacy class
- age policy
- educational record policy
- operational need

Redaction must occur before data leaves the projection boundary.

## 25. Projection Versioning

Each read model has:

- schema version
- transformer version
- source compatibility range
- migration policy
- retirement date where applicable

Consumers must not infer compatibility from field similarity alone.

## 26. API Contract Principles

Read APIs should support:

- tenant-safe identity
- pagination
- stable cursors
- filter semantics
- explicit freshness metadata
- projection version
- sparse or audience-specific fields
- consistent not-found behavior

Read APIs must not expose internal event payloads by default.

## 27. Recommended Read Endpoints

Conceptual endpoints:

```text
GET /journeys/:journeyId/summary
GET /journeys/:journeyId/timeline
GET /journeys/:journeyId/phases
GET /journeys/:journeyId/milestones
GET /journeys/:journeyId/next-action
GET /journeys/:journeyId/evidence-coverage
GET /journeys/:journeyId/adaptations
GET /journeys/:journeyId/completion-review
```

Exact transport design belongs to implementation contracts.

## 28. Alerts and Attention Views

Attention projections may surface:

- blocked journey
- stale plan
- repeated session non-completion
- missing review
- unresolved evidence conflict
- overdue intervention
- inactive journey
- projection degradation

An attention item must include reason, source authority, severity, and clear resolution route.

## 29. Prediction and Forecasting

Forecasts may be displayed only as derived estimates with:

- model or rule version
- input watermark
- confidence or uncertainty
- generated time
- non-guarantee label

Forecasts must not be represented as authoritative learner outcomes.

## 30. Events Emitted by Projection Runtime

Projection Runtime should emit operational events only, such as:

- `JourneyProjectionUpdated`
- `JourneyProjectionLagDetected`
- `JourneyProjectionRebuildStarted`
- `JourneyProjectionRebuildCompleted`
- `JourneyProjectionRebuildFailed`
- `JourneyProjectionDependencyMissing`

These events must not alter journey domain authority.

## 31. Failure Codes

- `PROJECTION_EVENT_UNSUPPORTED`
- `PROJECTION_EVENT_OUT_OF_RANGE`
- `PROJECTION_DEPENDENCY_MISSING`
- `PROJECTION_CHECKPOINT_CONFLICT`
- `PROJECTION_SCHEMA_INCOMPATIBLE`
- `PROJECTION_REBUILD_FAILED`
- `PROJECTION_ACCESS_FORBIDDEN`
- `PROJECTION_REDACTION_FAILED`
- `PROJECTION_STALE`

## 32. Observability

Metrics:

- projection lag by family
- events processed
- duplicate events ignored
- handler failures
- rebuild duration
- reconciliation mismatch count
- stale projection count
- missing dependency count
- read latency
- redaction denial count

Tracing should preserve correlation and causation IDs from source events.

## 33. Reconciliation

Periodic reconciliation compares projections with authoritative summaries.

Checks include:

- journey lifecycle state
- active plan version
- phase and milestone counts
- current session linkage
- blocker count
- evidence coverage watermark
- completion status

Mismatch creates an operational reconciliation record, not a silent overwrite.

## 34. Verification Requirements

Verification must prove:

- deterministic event transformation
- duplicate-event safety
- out-of-order handling policy
- checkpoint correctness
- replay equivalence
- audience redaction
- stale-state indication
- no command-side mutation
- schema compatibility behavior
- reconciliation mismatch detection

## 35. Invariants

1. Every projection field is traceable to an authoritative source or explicit derivation rule.
2. Projection state never becomes command authority.
3. Duplicate events do not duplicate effects.
4. Source watermarks never move backward.
5. Stale data is marked as stale.
6. Sensitive fields are redacted before delivery.
7. Rebuild does not emit domain commands.
8. Unsupported source versions fail visibly.
9. Mastery labels originate only from mastery authority.
10. Reconciliation mismatch is recorded and investigated.

## 36. Completion Condition

36F is complete when the platform can build, serve, replay, rebuild, reconcile, redact, and monitor audience-specific journey read models while preserving source authority, visibility boundaries, idempotency, and explicit freshness semantics.
