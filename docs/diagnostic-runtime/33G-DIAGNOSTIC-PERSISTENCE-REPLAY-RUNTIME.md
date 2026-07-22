# 33G — Diagnostic Persistence & Replay Runtime

## 1. Purpose

This runtime defines durable authority for diagnostic cases, evidence references, hypotheses, understanding-debt signals, root-cause analyses, projections, and historical reconstruction.

The purpose is not merely to save the latest diagnostic summary. The runtime must preserve how the system arrived at a conclusion, which evidence and model versions were used, what uncertainty existed at that time, and whether later events changed or disproved the conclusion.

Diagnostic persistence therefore supports:

- durable case history,
- append-oriented event authority,
- temporal reconstruction,
- deterministic replay,
- projection rebuild,
- model-version traceability,
- audit and dispute resolution,
- recovery after partial failure,
- migration without rewriting historical meaning.

---

## 2. Core Persistence Principle

> Diagnostic history is an evidence-backed temporal record, not a mutable profile label.

The persistence model must preserve the distinction between:

- source evidence,
- derived features,
- diagnostic hypotheses,
- root-cause candidates,
- understanding-debt signals,
- recommended actions,
- observed outcomes,
- later revisions.

A later diagnostic interpretation may supersede an earlier one, but it must not erase the fact that the earlier interpretation existed under a particular evidence and model context.

---

## 3. Persistence Authorities

### 3.1 Diagnostic Event Ledger

The event ledger is the durable chronological authority for state transitions affecting a diagnostic case.

Each event records at minimum:

- `eventId`
- `caseId`
- `learnerId`
- `tenantId`
- `eventType`
- `occurredAt`
- `recordedAt`
- `actorType`
- `actorId`
- `correlationId`
- `causationId`
- `expectedCaseVersion`
- `resultingCaseVersion`
- `payloadSchemaVersion`
- `diagnosticModelVersion`
- `skillGraphVersion`
- `curriculumVersion`
- `policyVersion`
- `payload`

The ledger must be append-oriented. Corrections are represented by new events rather than destructive replacement of prior history.

### 3.2 Diagnostic Case Aggregate

The aggregate is the write-side consistency boundary for a diagnostic case.

It owns:

- lifecycle state,
- current version,
- evidence links,
- active hypothesis set,
- selected primary hypothesis,
- understanding-debt references,
- root-cause analysis references,
- action recommendations,
- outcome observations,
- resolution state,
- authority metadata.

The aggregate does not own the original source content of external assessment or learning events. It stores durable references and diagnostic interpretation metadata.

### 3.3 Evidence Reference Store

Source evidence remains owned by its originating runtime where possible. The diagnostic runtime stores immutable evidence references containing:

- source runtime,
- source entity ID,
- source event ID,
- evidence type,
- occurred-at time,
- source version,
- integrity hash when available,
- accessibility and context metadata,
- ingestion disposition.

Derived evidence may be stored inside the diagnostic boundary, but must declare its parent evidence lineage.

### 3.4 Snapshot Store

Snapshots accelerate reconstruction but are never the primary historical authority.

A snapshot contains:

- case ID,
- case version,
- lifecycle state,
- active hypotheses,
- debt signals,
- root-cause candidates,
- current recommendation references,
- source version vector,
- last applied event ID,
- snapshot schema version,
- checksum.

Snapshots must be replaceable and reproducible from the event ledger.

### 3.5 Projection Store

Projection persistence supports learner, parent, teacher, audit, and engine-facing read models.

Each projection records:

- projection type,
- projection key,
- source case version,
- model and graph versions,
- built-at time,
- freshness state,
- rebuild token,
- projection schema version,
- diagnostic certainty metadata.

A projection is not diagnostic write authority.

---

## 4. Event Families

The ledger should support events such as:

### Case Lifecycle

- `DiagnosticCaseOpened`
- `DiagnosticCaseCollectionStarted`
- `DiagnosticCaseInferenceMarkedReady`
- `DiagnosticCaseMarkedInconclusive`
- `DiagnosticCaseResolved`
- `DiagnosticCaseCancelled`
- `DiagnosticCaseReopened`

### Evidence

- `DiagnosticEvidenceLinked`
- `DiagnosticEvidenceRejected`
- `DiagnosticEvidenceSuperseded`
- `DerivedEvidenceCreated`
- `ContradictoryEvidenceObserved`
- `EvidenceIntegrityInvalidated`

### Inference

- `HypothesisGenerated`
- `HypothesisSupportUpdated`
- `HypothesisContradicted`
- `PrimaryHypothesisSelected`
- `PrimaryHypothesisWithdrawn`
- `DiscriminatingEvidenceRequested`

### Understanding Debt

- `UnderstandingDebtSignalDetected`
- `UnderstandingDebtSignalPrioritized`
- `UnderstandingDebtRemediationStarted`
- `UnderstandingDebtMonitoringStarted`
- `UnderstandingDebtResolved`
- `UnderstandingDebtDisproven`
- `UnderstandingDebtMarkedStale`

### Root Cause

- `RootCauseCandidateAdded`
- `RootCauseCandidateRanked`
- `RootCauseCandidateRejected`
- `CompositeCauseProposed`
- `RootCauseMarkedUncertain`

### Action and Outcome

- `DiagnosticActionRecommended`
- `DiagnosticActionAccepted`
- `DiagnosticActionDeclined`
- `DiagnosticOutcomeObserved`
- `DiagnosticOutcomeLinked`

### Projection and Recovery

- `DiagnosticProjectionBuilt`
- `DiagnosticProjectionInvalidated`
- `DiagnosticReplayCompleted`
- `DiagnosticReplayFailed`
- `DiagnosticRecoveryApplied`

---

## 5. Versioning Model

Diagnostic replay depends on multiple version dimensions.

### 5.1 Aggregate Version

The case aggregate version increases monotonically with accepted state-changing events.

### 5.2 Event Schema Version

Each event payload declares its schema version independently.

### 5.3 Diagnostic Model Version

The inference rules, feature extraction logic, confidence calibration, and candidate generation version must be captured.

### 5.4 Skill Graph Version

The graph version used for prerequisite and downstream-impact reasoning must be preserved.

### 5.5 Curriculum Version

The relevant curriculum authority must be captured because skill expectations can evolve.

### 5.6 Policy Version

Human-review thresholds, risk limits, and actionability policies must be versioned.

### 5.7 Projection Version

Read-model schemas evolve separately from write-side diagnostic meaning.

---

## 6. Optimistic Concurrency

Diagnostic case writes must use expected-version semantics.

A command must fail safely when:

- the expected case version does not match,
- the case has changed lifecycle state,
- evidence was added concurrently,
- a primary hypothesis changed,
- the case was resolved or reopened concurrently.

The runtime must not silently overwrite a newer diagnostic interpretation.

Recommended conflict result:

```text
DIAGNOSTIC_CASE_VERSION_CONFLICT
```

The caller must reload current authority and reconsider the command.

---

## 7. Idempotency

Event ingestion and command processing must be idempotent.

Idempotency should be based on stable keys such as:

- source event ID,
- command ID,
- correlation ID plus operation type,
- evidence reference identity,
- projection rebuild token.

Duplicate delivery must not:

- link the same evidence twice,
- increase confidence twice,
- duplicate debt signals,
- duplicate recommendations,
- advance aggregate version incorrectly.

An idempotent response should return the already accepted result when semantically equivalent.

---

## 8. Replay Modes

### 8.1 Full Case Replay

Reconstruct the aggregate from event zero to the requested version.

Use for:

- audit,
- corruption recovery,
- verifier execution,
- migration testing.

### 8.2 Snapshot-Assisted Replay

Load the latest valid snapshot before the target version, then apply subsequent events.

Use for normal runtime recovery and efficient projection rebuild.

### 8.3 Temporal Replay

Reconstruct state as of:

- a case version,
- event ID,
- recorded-at time,
- occurred-at time where policy permits.

The distinction between `occurredAt` and `recordedAt` must remain visible.

### 8.4 Projection Replay

Rebuild one or more projections from diagnostic events without mutating write-side authority.

### 8.5 Comparative Replay

Replay the same historical case under two model versions for evaluation.

Comparative replay must not rewrite historical conclusions. Its outputs are evaluation artifacts.

---

## 9. Deterministic Replay Requirements

A replay is deterministic only when all required authorities are pinned.

The replay input must identify:

- event sequence,
- event schemas,
- diagnostic model version,
- feature extraction version,
- skill graph version,
- curriculum version,
- policy version,
- locale and relevant interpretation context,
- deterministic ordering rules.

External calls, current time, random generation, and latest-version lookup must not influence historical replay unless explicitly recorded as replay inputs.

---

## 10. Event Ordering

Events must be ordered by aggregate version for case reconstruction.

Timestamps alone are insufficient because:

- events can arrive late,
- clocks can differ,
- source observations may predate ingestion,
- corrections can be recorded after the original event.

The runtime must preserve:

- aggregate sequence,
- source occurred-at time,
- diagnostic recorded-at time.

Late evidence may trigger a new diagnostic event while retaining its original occurrence time.

---

## 11. Snapshot Validation

Before using a snapshot, verify:

- aggregate ID match,
- snapshot version is not ahead of ledger authority,
- last event ID exists,
- checksum validity,
- schema compatibility,
- source version vector integrity.

If validation fails, discard the snapshot and replay from an earlier valid snapshot or the beginning.

Snapshot failure must not destroy the event ledger.

---

## 12. Projection Rebuild

Projection rebuild must support:

- one case,
- one learner,
- one projection family,
- one tenant,
- bounded time ranges,
- complete rebuild.

A rebuild must record:

- requested scope,
- source version boundary,
- rebuild token,
- started and completed time,
- success or failure,
- skipped or quarantined cases,
- output schema version.

During rebuild, projections may be marked `REBUILDING` or served from a known-safe prior version according to policy.

---

## 13. Recovery Model

Recovery states include:

- `RECOVERY_NOT_REQUIRED`
- `RECOVERY_PENDING`
- `REPLAYING`
- `REBUILDING_PROJECTIONS`
- `RECOVERY_COMPLETE`
- `RECOVERY_FAILED`
- `QUARANTINED`

Recovery may be required after:

- partial event write,
- snapshot corruption,
- projection drift,
- model migration failure,
- evidence-reference integrity failure,
- duplicate or out-of-order delivery.

The system must prefer evidence-preserving recovery over destructive cleanup.

---

## 14. Integrity Controls

Recommended controls include:

- immutable event IDs,
- event payload hashes,
- source-evidence hashes,
- aggregate sequence uniqueness,
- tenant and learner identity consistency,
- correlation and causation traceability,
- snapshot checksum,
- projection source-version markers.

Integrity failure must result in explicit quarantine or failure, not silent acceptance.

---

## 15. Retention and Privacy

Diagnostic history may contain sensitive learner information.

Persistence policy must support:

- tenant isolation,
- least-privilege access,
- purpose-limited projections,
- redaction of unnecessary free text,
- retention schedules,
- lawful deletion or anonymization workflows,
- audit logging for access and mutation,
- preservation of aggregate consistency during anonymization.

Deletion policy must distinguish between:

- removing personally identifying data,
- retaining anonymous operational evidence,
- retaining legally required audit records,
- deleting derived projections.

---

## 16. Failure Codes

Recommended failure codes:

```text
DIAGNOSTIC_CASE_NOT_FOUND
DIAGNOSTIC_CASE_VERSION_CONFLICT
DIAGNOSTIC_EVENT_DUPLICATE
DIAGNOSTIC_EVENT_SEQUENCE_GAP
DIAGNOSTIC_EVENT_SCHEMA_UNSUPPORTED
DIAGNOSTIC_MODEL_VERSION_UNAVAILABLE
SKILL_GRAPH_VERSION_UNAVAILABLE
CURRICULUM_VERSION_UNAVAILABLE
DIAGNOSTIC_SNAPSHOT_INVALID
DIAGNOSTIC_REPLAY_NON_DETERMINISTIC
DIAGNOSTIC_PROJECTION_REBUILD_FAILED
DIAGNOSTIC_EVIDENCE_REFERENCE_BROKEN
DIAGNOSTIC_HISTORY_QUARANTINED
```

---

## 17. Replay Verification Scenarios

The runtime must verify at least:

1. Full replay equals snapshot-assisted replay.
2. Duplicate event delivery has no additional effect.
3. Late evidence preserves both event order and occurred-at time.
4. Projection rebuild reproduces the accepted read model.
5. Missing historical model version fails explicitly.
6. Snapshot corruption falls back safely.
7. Concurrent commands produce a version conflict.
8. Reopened cases reconstruct correctly.
9. Superseded hypotheses remain visible historically.
10. Comparative replay does not mutate historical authority.

---

## 18. Cross-Runtime Contracts

### Assessment Runtime

Provides source evidence and assessment-event identity.

### Learning Runtime

Provides worked-solution, hint, practice, and remediation outcome evidence.

### Skill Graph Runtime

Provides pinned graph versions and skill identity resolution.

### Curriculum Runtime

Provides pinned expectation and curriculum versions.

### Recommendation Runtime

Consumes diagnostic projections and records action references.

### Mission Runtime

Consumes accepted diagnostic needs without becoming diagnostic authority.

### Progress Runtime

Provides learner progress transitions and consumes resolved diagnostic outcomes where appropriate.

---

## 19. Non-Goals

This runtime does not:

- declare a diagnosis correct merely because it was persisted,
- treat snapshots as historical authority,
- rewrite old conclusions using the latest model,
- copy all source evidence into the diagnostic store without need,
- infer causation from persistence order,
- expose sensitive diagnostic history to every consumer.

---

## 20. Acceptance Criteria

33G is complete when:

- diagnostic events are append-oriented and versioned,
- aggregate writes use optimistic concurrency,
- source evidence lineage remains traceable,
- snapshots are reproducible and disposable,
- replay can reconstruct historical case state,
- projections can be rebuilt independently,
- model, graph, curriculum, and policy versions are pinned,
- duplicate delivery is idempotent,
- integrity failure is explicit,
- privacy and retention boundaries are defined.

---

## 21. Runtime Laws

1. **Persisted does not mean proven.**
2. **Historical meaning must not be rewritten silently.**
3. **Snapshots accelerate authority; they do not replace it.**
4. **Replay requires pinned versions.**
5. **Duplicate delivery must not duplicate diagnostic meaning.**
6. **Late evidence must remain temporally honest.**
7. **Projection rebuild must not mutate write-side authority.**
8. **Recovery must preserve evidence before convenience.**
9. **Integrity failure must be explicit.**
10. **Sensitive diagnostic history must remain purpose-limited.**
