# 30B — Progress Timeline Runtime

## Status

- Chapter: 30 — Progress Engine
- Slice: 30B
- State: Defined

## Purpose

Progress Timeline Runtime transforms accepted authoritative source records into an ordered, durable, explainable learner history.

The timeline is not a dashboard feed. It is the chronological semantic ledger used to understand what changed, why it changed, and which authority caused the change.

## Boundary

```text
Authorized Source Records
        ↓
Timeline Ingestion
        ↓
Normalized Progress Events
        ↓
Ordered Learner Timeline
        ↓
Aggregation / Projection / Replay
```

## Timeline Laws

```text
Occurred first ≠ Received first
Received first ≠ Semantically prior
Late arrival ≠ Invalid event
Correction ≠ Deletion
Replay ≠ Reassessment
Timeline entry ≠ Progress claim strength
```

## Timeline Entry Contract

```text
ProgressTimelineEntry
- timelineEntryId
- tenantId
- learnerId
- ledgerSequence
- sourceEngine
- sourceRecordId
- sourceRecordVersion
- sourceSequence
- eventType
- subjectType
- subjectId
- semanticPayload
- effectiveAt
- sourceOccurredAt
- sourceRecordedAt
- receivedAt
- committedAt
- policyVersion
- provenanceHash
- supersedesEntryId?
- supersededByEntryId?
- limitations[]
- visibilityClass
- publicationState
```

## Publication States

- PENDING
- PUBLISHED
- PUBLISHED_WITH_LIMITATIONS
- HELD
- QUARANTINED
- SUPERSEDED
- WITHDRAWN

Held or quarantined entries remain auditable but must not influence public progress projections.

## Timeline Ingestion Pipeline

```text
1. Receive source envelope
2. Validate tenant and learner scope
3. Validate source authority
4. Validate source version and provenance
5. Resolve idempotency key
6. Normalize event semantics
7. Resolve subject bindings
8. Determine effective ordering metadata
9. Detect conflicts and supersession
10. Append timeline entry
11. Update source cursor
12. Emit aggregate invalidation
13. Publish transactional outbox record
```

## Source Envelope

Required fields:

- sourceEngine
- sourceRecordType
- sourceRecordId
- sourceRecordVersion
- tenantId
- learnerId
- actorId or systemAuthorityId
- correlationId
- causationId
- occurredAt
- recordedAt
- policyVersion
- payloadHash
- payload

Optional fields:

- sourceSequence
- sessionId
- missionId
- assessmentId
- gameplaySessionId
- curriculumVersion
- assistanceContext
- accessibilityContext
- collaborationContext

## Semantic Normalization

Source-specific terminology must be translated into Progress Engine terminology without changing its strength.

Examples:

```text
Assessment: MASTERY_CONFIRMED
→ Progress: MASTERY_STATUS_CHANGED

Mission: OBJECTIVE_COMPLETED
→ Progress: MISSION_ADVANCED

Gameplay: COMPLETED_WITH_LIMITATIONS
→ Progress: GAMEPLAY_OBJECTIVE_COMPLETED + limitations

Learning: PRACTICE_SESSION_COMPLETED
→ Progress: PRACTICE_RECORDED
```

Forbidden normalization:

```text
Gameplay objective completed
→ Mastery confirmed

Mission completed
→ Curriculum complete

High score
→ Understanding increased

Long session
→ Strong learning gain
```

## Ordering Model

Timeline maintains multiple clocks:

- sourceOccurredAt
- sourceRecordedAt
- receivedAt
- effectiveAt
- committedAt
- ledgerSequence

Canonical display order may use effectiveAt, but deterministic replay order uses ledgerSequence plus explicit semantic ordering rules.

### Ordering Priority

1. Explicit sourceSequence within the same source authority
2. Source version lineage
3. Authoritative effectiveAt
4. Source recordedAt
5. Server receivedAt
6. Ledger sequence as deterministic tie-breaker

## Late Arrival

Late events are valid when provenance and source version are valid.

When a late event changes historical interpretation:

- append the event at current ledger sequence
- preserve original effectiveAt
- invalidate affected aggregates from the earliest impacted point
- rebuild forward deterministically
- mark projections stale until rebuild completes
- never rewrite earlier ledger sequence

## Duplicate Handling

Duplicate classes:

- EXACT_DUPLICATE
- SAME_VERSION_DIFFERENT_PAYLOAD
- NEW_VERSION_SAME_MEANING
- NEW_VERSION_CHANGED_MEANING
- RETRIED_DELIVERY

Policy:

- exact duplicate: acknowledge without append
- same version, different payload: quarantine
- new version, same meaning: optionally append audit marker; no semantic double count
- new version, changed meaning: append superseding entry
- retried delivery: resolve through idempotency record

## Supersession

Supersession must be explicit and traceable.

```text
Original entry
    ↓ referenced by
Correction / replacement entry
    ↓
Original becomes SUPERSEDED
Replacement becomes effective
```

Supersession never removes the original event from replay history.

## Subject Binding

A timeline entry may bind to more than one subject, but one binding must be primary.

```text
Primary: SKILL / fractions-equivalent
Secondary:
- CURRICULUM_REQUIREMENT / TH-P5-MATH-FRACTIONS
- MISSION_OBJECTIVE / entrance-prep-01
- WORLD_REGION / builders-valley-market
```

Secondary bindings may support navigation and aggregation. They must not create duplicate progress magnitude.

## Timeline Segments

For efficient reconstruction, timelines may be segmented by:

- learner
- calendar period
- curriculum version
- aggregate checkpoint
- source family

Segmentation is storage optimization only. It must not change semantic order.

## Checkpoints

Timeline checkpoints contain:

- learnerId
- throughLedgerSequence
- aggregate snapshot hashes
- source cursor map
- policy versions
- checkpointCreatedAt

Checkpoint laws:

```text
Checkpoint ≠ Source of Truth
Checkpoint must be reproducible
Invalid checkpoint must be discarded
Replay may begin after verified checkpoint
```

## Visibility Classes

- LEARNER_VISIBLE
- PARENT_VISIBLE
- EDUCATOR_VISIBLE
- OPERATIONS_ONLY
- AUDIT_ONLY
- RESTRICTED

Visibility does not affect progress truth. It affects only authorized projection access.

## Timeline Query Contracts

### Learner timeline

```text
getLearnerTimeline(
  tenantId,
  learnerId,
  cursor,
  filters,
  audience
)
```

### Subject timeline

```text
getSubjectTimeline(
  tenantId,
  learnerId,
  subjectType,
  subjectId,
  throughTime
)
```

### Change explanation

```text
explainProgressChange(
  tenantId,
  learnerId,
  aggregateVersion
)
```

The explanation must return source references, limitations, and policy version—not invented natural-language certainty.

## Conflict Handling

Conflict families:

- SOURCE_SEQUENCE_CONFLICT
- EFFECTIVE_TIME_CONFLICT
- SUBJECT_BINDING_CONFLICT
- POLICY_VERSION_CONFLICT
- SUPERSESSION_CONFLICT
- IDENTITY_CONFLICT
- PAYLOAD_HASH_CONFLICT

Decisions:

- ACCEPT
- ACCEPT_WITH_LIMITATIONS
- HOLD
- QUARANTINE
- REJECT

No conflict is resolved through last-write-wins.

## Offline and Batch Import

Offline records and historical imports must include provenance class:

- ONLINE_AUTHORITATIVE
- OFFLINE_SIGNED
- OFFLINE_UNVERIFIED
- HISTORICAL_VERIFIED
- HISTORICAL_PARTIAL
- ADMINISTRATIVE_IMPORT

Unverified offline records may appear in an audit timeline but must not influence authoritative progress until verified.

## Transactional Requirements

The following must commit atomically:

- timeline entry
- idempotency record
- source cursor update
- aggregate invalidation marker
- outbox record

Partial publication is forbidden.

## Failure Recovery

Recovery steps:

1. Read durable source cursor
2. Read last verified timeline sequence
3. Reconcile incomplete idempotency records
4. Reprocess unpublished outbox records
5. Rebuild invalidated aggregates
6. Verify checkpoint hashes
7. Resume ingestion

A restart must not duplicate entries or skip valid source records.

## Observability

Required metrics:

- ingestion latency
- late-arrival rate
- duplicate rate
- quarantine rate
- timeline lag per source engine
- invalidation backlog
- rebuild duration
- source cursor divergence
- outbox publication lag
- supersession frequency

## Security

- tenant and learner scope validated before source lookup
- payload hashes verified before normalization
- raw sensitive payload separated from broad timeline projection
- privileged timeline reads audited
- export operations must preserve redaction policy

## Timeline Invariants

1. Every published entry has authoritative provenance.
2. Every entry belongs to exactly one tenant and learner.
3. Timeline history is append-only.
4. Supersession is explicit.
5. No last-write-wins conflict resolution.
6. Late arrival never rewrites ledger sequence.
7. Display order and replay order are separately defined.
8. Secondary bindings never double count progress.
9. Held and quarantined entries do not affect public aggregates.
10. Checkpoints are disposable and reproducible.
11. Idempotency survives process restart.
12. Timeline publication and outbox publication are transactionally coordinated.

## Acceptance Gate

30B is satisfied when architecture and implementation can demonstrate:

- ordered append-only learner timeline
- multi-clock ordering model
- late-arrival handling
- duplicate and version conflict handling
- explicit supersession
- subject binding without double counting
- verified checkpoints
- atomic timeline/outbox persistence
- restart-safe recovery
- audience-aware timeline queries without semantic escalation
