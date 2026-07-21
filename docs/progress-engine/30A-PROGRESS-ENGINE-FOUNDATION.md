# 30A — Progress Engine Foundation

## Status

- Chapter: 30 — Progress Engine
- Slice: 30A
- Authority: Architecture definition
- State: Defined

## Purpose

Progress Engine owns the durable, explainable representation of how a learner is moving through the learning system over time.

It does not decide mastery, recommend the next action, complete missions, or execute gameplay. It consumes authorized outcomes from those engines and produces a separate progress interpretation under explicit policy.

## Core Boundary

```text
Learning Engine
Assessment Engine
Recommendation Engine
Mission Engine
Gameplay Runtime
        ↓
Authorized Progress Inputs
        ↓
Progress Engine
        ↓
Progress Timeline / Aggregates / Projections
```

## Fundamental Laws

```text
Activity ≠ Progress
Completion ≠ Mastery
Mastery ≠ Curriculum completion
Score increase ≠ Understanding increase
Time spent ≠ Learning gain
Projection ≠ Source of Truth
```

Progress Engine may summarize and contextualize authoritative outcomes. It must never strengthen the meaning of upstream records.

## Responsibilities

Progress Engine owns:

- progress event acceptance and normalization
- learner progress timeline
- skill and concept progress aggregation
- curriculum and mission progress views
- progress trend calculation
- regression and recovery representation
- confidence and freshness metadata
- progress snapshot generation
- progress explanation records
- progress projection contracts
- durable progress ledger
- replay and reconstruction
- verification and invariants

Progress Engine does not own:

- assessment judgments
- mastery decisions
- recommendation ranking
- mission lifecycle transitions
- gameplay objective completion
- curriculum authoring
- reward issuance
- parent or teacher policy decisions

## Source Authorities

Accepted source families include:

- LearningSessionOutcome
- AssessmentDecision
- AssessmentEvidenceDisposition
- RecommendationDecision
- MissionStateTransition
- MissionCompletionDecision
- GameplayCompletionDecision
- GameplayEvidenceCandidateDisposition
- CurriculumMappingUpdate
- AdministrativeCorrection

Every accepted input must include:

- tenantId
- learnerId
- sourceEngine
- sourceRecordId
- sourceRecordVersion
- sourceOccurredAt
- sourceRecordedAt
- sourcePolicyVersion
- correlationId
- integrity hash or equivalent provenance marker

## Progress Event Model

```text
ProgressEvent
- progressEventId
- tenantId
- learnerId
- sourceEngine
- sourceRecordId
- sourceRecordVersion
- eventType
- subjectType
- subjectId
- direction
- magnitude
- confidence
- effectiveAt
- recordedAt
- policyVersion
- limitations[]
- provenance
```

### Event Types

- EXPOSURE_RECORDED
- PRACTICE_RECORDED
- ASSESSMENT_RESULT_ACCEPTED
- MASTERY_STATUS_CHANGED
- MISSION_ADVANCED
- MISSION_COMPLETED
- GAMEPLAY_OBJECTIVE_COMPLETED
- EVIDENCE_ACCEPTED
- EVIDENCE_LIMITED
- REGRESSION_DETECTED
- RECOVERY_DETECTED
- CURRICULUM_REQUIREMENT_CHANGED
- ADMINISTRATIVE_CORRECTION
- HISTORICAL_IMPORT

### Direction

- ADVANCE
- MAINTAIN
- REGRESS
- RECOVER
- NEUTRAL
- UNKNOWN

Direction is descriptive. It is not permission to alter mastery or mission authority.

## Progress Subject Types

- SKILL
- CONCEPT
- LEARNING_OBJECTIVE
- CURRICULUM_REQUIREMENT
- MISSION
- MISSION_OBJECTIVE
- LEARNING_PATH
- GRADE_BAND
- SUBJECT
- WORLD_REGION
- GAMEPLAY_CAPABILITY

## Progress Dimensions

Progress may be represented across multiple independent dimensions:

- exposure
- practice volume
- demonstrated accuracy
- demonstrated reasoning
- independence
- retention
- transfer
- consistency
- pace
- confidence
- breadth
- depth
- mission advancement
- curriculum coverage

No single dimension may silently stand in for another.

## Aggregate Model

```text
ProgressAggregate
- tenantId
- learnerId
- subjectType
- subjectId
- aggregateVersion
- status
- dimensions
- currentBand
- trend
- confidence
- freshness
- limitations[]
- lastAuthoritativeSource
- effectiveThrough
- updatedAt
```

### Aggregate Status

- NOT_STARTED
- INTRODUCED
- IN_PROGRESS
- DEVELOPING
- CONSOLIDATING
- STABLE
- REGRESSING
- RECOVERING
- BLOCKED
- COMPLETE_BY_POLICY
- UNKNOWN
- WITHDRAWN

`COMPLETE_BY_POLICY` is not mastery unless the authoritative Assessment record explicitly says so.

## Confidence Model

- HIGH
- MODERATE
- LOW
- INSUFFICIENT
- CONFLICTED
- UNKNOWN

Confidence must consider:

- evidence freshness
- evidence independence
- source reliability
- policy compatibility
- assistance limitations
- conflicting outcomes
- replay consistency
- sample sufficiency

## Freshness Model

- CURRENT
- AGING
- STALE
- SUPERSEDED
- WITHDRAWN
- UNKNOWN

Progress views must expose stale or superseded state rather than presenting it as current truth.

## Regression and Recovery

Regression is not deletion of prior progress.

```text
Earlier stable performance
        ↓
New authoritative evidence
        ↓
Regression marker
        ↓
Recovery plan or later recovery marker
```

Required principles:

- historical achievement remains visible
- current confidence may decrease
- regression must identify the affected dimension
- recovery must be recorded as a new event
- recovery must not erase regression history

## Correction Policy

Corrections are append-only.

A correction must reference:

- corrected record
- correction reason
- correcting authority
- effective time
- original meaning
- replacement meaning

The original record remains durable and becomes superseded, never silently overwritten.

## Tenant and Learner Isolation

Every read and write must be scoped by tenantId and learnerId.

Forbidden:

- cross-tenant aggregation
- cross-learner merge
- household-level inference presented as learner progress
- group success attributed to an individual without individual authority
- teacher cohort statistics written into learner truth

## Idempotency

The canonical idempotency key is derived from:

```text
sourceEngine + sourceRecordId + sourceRecordVersion + learnerId
```

Duplicate delivery must not duplicate progress.

A new source version may produce a new progress event only after supersession rules are applied.

## Ordering

Ordering authority uses:

1. source semantic version or sequence
2. authoritative effectiveAt
3. server recordedAt
4. progress ledger sequence

Client time is never ordering authority.

Late-arriving events must be inserted into historical meaning without rewriting the ledger.

## Failure Modes

- INVALID_SOURCE
- UNKNOWN_SOURCE_VERSION
- CROSS_TENANT_SCOPE
- CROSS_LEARNER_SCOPE
- DUPLICATE_SOURCE
- OUT_OF_ORDER_SOURCE
- INCOMPATIBLE_POLICY
- UNSUPPORTED_SUBJECT
- AGGREGATE_CONFLICT
- PROVENANCE_FAILURE
- INTEGRITY_FAILURE
- STALE_RECOMPUTATION
- REPLAY_DIVERGENCE
- PROJECTION_ESCALATION

Critical failures must hold or quarantine publication.

## Privacy

Progress Engine must support:

- audience-specific redaction
- minimum necessary disclosure
- separation of learner, parent, teacher, mentor, and operations views
- protection of raw evidence details
- removal of sensitive free text from broad projections
- durable audit of privileged access

## Observability

Required signals:

- accepted events
- rejected events
- duplicate events
- quarantined events
- aggregate rebuild duration
- stale aggregate count
- replay divergence count
- cross-scope attempts
- projection freshness lag
- correction volume

## Initial Runtime Contract

```text
acceptProgressSource(sourceRecord)
  → validate identity and provenance
  → normalize semantic meaning
  → enforce idempotency and ordering
  → append ProgressEvent
  → update affected aggregates
  → emit projection invalidations
  → publish outbox records
```

## Foundation Invariants

1. Progress never becomes stronger than its source authority.
2. Activity alone never proves progress.
3. Completion alone never proves mastery.
4. Time spent alone never proves learning.
5. Group outcomes never become individual progress without individual authority.
6. Corrections append; they do not erase.
7. Projections never become the source of truth.
8. Stale progress must be visibly stale.
9. Cross-tenant and cross-learner aggregation is forbidden.
10. Duplicate source delivery must be idempotent.
11. Historical replay must reproduce historical meaning.
12. Current-policy simulation must not rewrite historical truth.

## Acceptance Gate

30A is satisfied when the implementation architecture can demonstrate:

- explicit Progress Engine ownership
- source authority contracts
- tenant and learner isolation
- append-only event model
- independent progress dimensions
- confidence and freshness metadata
- regression and recovery preservation
- correction and supersession rules
- idempotent ingestion
- no semantic escalation beyond upstream authority
