# 30H — Progress Replay Runtime

## 1. Purpose

The Progress Replay Runtime reconstructs historical progress state from durable, versioned records. Replay exists for recovery, audit, policy comparison, migration validation, incident investigation, and deterministic rebuild.

Replay never rewrites history and never silently reassesses a learner.

## 2. Authority Model

```text
Append-only Progress Timeline Ledger
        +
Versioned Policies
        +
Versioned Curriculum / Taxonomy
        +
Replay Request
        ↓
Progress Replay Runtime
        ↓
Reconstructed State + Replay Report
```

Authority order:

1. durable timeline ledger
2. correction and supersession lineage
3. versioned policy references
4. aggregate contribution records
5. snapshots and checkpoints as optional accelerators
6. projections as non-authoritative read models

## 3. Core Laws

1. Historical replay is not reassessment.
2. Replay cannot mutate original timeline records.
3. Snapshot is an optimization, not source of truth.
4. Replay must bind to explicit policy and curriculum versions.
5. Missing historical dependencies must be reported, not guessed.
6. Historical truth and current-policy interpretation are separate outputs.
7. Replay must be deterministic for identical inputs and runtime version.
8. Corrections append lineage; they do not erase prior records.
9. Last-write-wins is forbidden.
10. Replay divergence blocks publication.

## 4. Replay Modes

### 4.1 Historical Reconstruction

Rebuilds the state exactly as it should have been interpreted under the policy, curriculum, and runtime versions effective at the historical point.

### 4.2 Current-Policy Reinterpretation

Reprocesses historical authorized inputs under a named current policy version. Output must be labeled reinterpretation and must not overwrite historical results.

### 4.3 Point-in-Time Replay

Reconstructs state at a selected effective time or ledger sequence.

### 4.4 Full-Ledger Rebuild

Reconstructs all supported aggregates and projections from the beginning of the ledger.

### 4.5 Incremental Replay

Reprocesses a bounded sequence range after late arrival, correction, supersession, migration, or runtime repair.

### 4.6 Incident Replay

Reproduces the state around a suspected defect with frozen inputs and runtime identifiers.

### 4.7 Shadow Replay

Runs a candidate policy or runtime in parallel without publishing results to learner-facing state.

## 5. Replay Request Contract

Required fields:

```text
replayId
tenantId
subjectScope
mode
sourceSequenceFrom
sourceSequenceTo
pointInTime
historicalPolicyVersion
requestedPolicyVersion
curriculumVersion
runtimeVersion
projectionVersion
requestedBy
reason
requestedAt
publicationMode
```

The request must define exactly which authority and interpretation are being reconstructed.

## 6. Replay Pipeline

```text
Authorize Request
↓
Resolve Tenant and Subject Scope
↓
Freeze Ledger Range
↓
Resolve Corrections and Supersessions
↓
Resolve Historical Dependencies
↓
Validate Policy / Curriculum Compatibility
↓
Load Trusted Checkpoint if Eligible
↓
Replay Timeline in Deterministic Order
↓
Rebuild Aggregates
↓
Rebuild Projections if Requested
↓
Verify Determinism and Semantic Boundaries
↓
Compare with Existing State
↓
Publish, Hold, or Quarantine
```

## 7. Ordering Rules

Replay ordering must use explicit semantics:

- ledger sequence is the durable processing order;
- effective time controls semantic placement where policy permits;
- source occurred time is evidence context, not storage order;
- received time must not override semantic ordering;
- correction and supersession records follow explicit lineage rules.

When ordering cannot be resolved deterministically, replay must stop with conflict status.

## 8. Snapshot Eligibility

A checkpoint may be used only when all match:

- tenant and subject scope
- ledger sequence boundary
- aggregate schema version
- policy version
- curriculum version
- runtime version compatibility
- checksum
- verification status

If any condition fails, replay begins from an earlier trusted checkpoint or the ledger origin.

## 9. Replay Outputs

### 9.1 Reconstructed Aggregate Set

Contains versioned aggregate states and contribution lineage.

### 9.2 Reconstructed Projection Set

Optional audience-specific read models. These remain derived and non-authoritative.

### 9.3 Replay Report

Required report fields:

```text
replayId
mode
inputSequenceRange
recordsRead
recordsAccepted
recordsExcluded
recordsQuarantined
checkpointUsed
policyVersions
curriculumVersions
runtimeVersion
outputHashes
existingStateHashes
divergences
limitations
verificationDecision
completedAt
```

### 9.4 Divergence Report

Classifies differences as:

```text
EXPECTED_POLICY_DIFFERENCE
EXPECTED_SCHEMA_MIGRATION
EXPECTED_LATE_ARRIVAL_EFFECT
EXISTING_STATE_STALE
HISTORICAL_DEPENDENCY_MISSING
NON_DETERMINISTIC_RUNTIME
UNEXPLAINED_DIVERGENCE
```

## 10. Publication Modes

```text
DRY_RUN
SHADOW_ONLY
REPORT_ONLY
PUBLISH_IF_IDENTICAL
PUBLISH_VERIFIED_REBUILD
MANUAL_APPROVAL_REQUIRED
```

Current-policy reinterpretation must never replace historical state without explicit migration authority.

## 11. Recovery Semantics

Replay supports recovery after:

- projection corruption
- aggregate corruption
- outbox interruption
- failed incremental processing
- policy deployment defect
- curriculum migration defect
- late-arriving records
- correction or supersession

Recovery success requires verified durable state and output hashes. A successful process invocation alone is insufficient.

## 12. Concurrency and Isolation

Replay must use:

- frozen input sequence ranges;
- replay lease or ownership record;
- optimistic publication checks;
- tenant-safe isolation;
- no direct mutation of active aggregates before verification;
- atomic swap or version promotion for approved rebuilt state.

Concurrent writes after the frozen range belong to a later incremental pass.

## 13. Idempotency

Repeated replay with the same:

- request identity
- ledger range
- policy versions
- curriculum version
- runtime version
- input hashes

must produce the same output hashes and publication decision.

A conflicting duplicate request is quarantined.

## 14. Failure Codes

```text
REPLAY_REQUEST_UNAUTHORIZED
REPLAY_SCOPE_INVALID
REPLAY_LEDGER_RANGE_INVALID
REPLAY_DEPENDENCY_MISSING
REPLAY_POLICY_NOT_FOUND
REPLAY_POLICY_INCOMPATIBLE
REPLAY_CURRICULUM_NOT_FOUND
REPLAY_CHECKPOINT_INVALID
REPLAY_ORDER_CONFLICT
REPLAY_CORRECTION_LINEAGE_BROKEN
REPLAY_SUPERSESSION_LINEAGE_BROKEN
REPLAY_NON_DETERMINISTIC
REPLAY_OUTPUT_HASH_MISMATCH
REPLAY_EXISTING_STATE_CHANGED
REPLAY_PUBLICATION_CONFLICT
REPLAY_CROSS_TENANT_SCOPE
REPLAY_UNEXPLAINED_DIVERGENCE
```

## 15. Verification Gates

1. request authorization
2. scope identity
3. frozen input range
4. complete lineage
5. dependency availability
6. deterministic ordering
7. policy compatibility
8. checkpoint trust
9. aggregate semantic integrity
10. projection non-escalation
11. output hash reproducibility
12. publication concurrency safety

## 16. Acceptance Criteria

30H is complete when:

- all replay modes are explicitly distinguished;
- historical reconstruction and current-policy reinterpretation cannot be confused;
- ledger, correction, and supersession lineage remain immutable;
- checkpoints are optional verified accelerators only;
- identical replay inputs produce identical outputs;
- divergence is classified and unexplained divergence blocks publication;
- rebuilt state is promoted only after verification;
- replay supports recovery without converting activity into mastery or creating new learning truth.