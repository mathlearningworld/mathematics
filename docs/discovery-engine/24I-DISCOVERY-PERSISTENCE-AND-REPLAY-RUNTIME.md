# Chapter 24 — Discovery Engine Architecture

# 24I — Discovery Persistence and Replay Runtime

## Status

- Chapter: 24
- Slice: 24I
- Authority: Discovery Engine Architecture
- Depends on: Chapter 23 persistence runtime and Chapter 24A–24H

## Purpose

The Discovery Persistence and Replay Runtime stores the evidence trail, derived hypotheses, progression transitions, assistance context, and mentor-facing interpretations required to reconstruct Discovery Engine state deterministically.

Its role is not merely to save the latest discovery state.
It must preserve enough provenance to explain how that state was reached, recover after interruption, migrate interpretations safely, and replay past world evidence under a known rule version.

## Core Principle

> Persist evidence first, persist interpretations with versioned provenance, and never treat a cached projection as the source of truth.

## Runtime Position

```text
Authoritative World Events
  → Discovery Evidence Ledger
    → Versioned Evaluators
      → Pattern / Concept / Progression State
        → Persisted Projections
          → Replay and Recovery
```

## Persistence Layers

The runtime separates durable data into four layers.

### Layer 1 — Source References

References to authoritative events produced by World Runtime.

```ts
interface DiscoverySourceReference {
  sourceEventId: string
  sourceStreamId: string
  sourceSequence: number
  sourceRuntimeVersion: string
  occurredAt: string
  integrityHash?: string
}
```

Discovery storage should not duplicate the entire world state unless required by retention or offline policy.

### Layer 2 — Evidence Ledger

Append-only discovery evidence derived from source events.

```ts
interface PersistedDiscoveryEvidence {
  evidenceId: string
  learnerId: string
  source: DiscoverySourceReference
  evidenceType: string
  payload: unknown
  context: EvidenceContext
  assistance: AssistanceContext
  evaluatorVersion: string
  evidenceSchemaVersion: number
  createdAt: string
  status: 'ACTIVE' | 'REVOKED' | 'SUPERSEDED' | 'QUARANTINED'
}
```

### Layer 3 — Interpretation Ledger

Versioned decisions produced from evidence.

```ts
interface DiscoveryInterpretationRecord {
  interpretationId: string
  learnerId: string
  interpretationType: 'PATTERN' | 'CONCEPT' | 'PROGRESSION' | 'CONTRADICTION' | 'GUIDANCE_DECISION'
  targetId: string
  previousState?: unknown
  nextState: unknown
  supportingEvidenceIds: string[]
  contradictingEvidenceIds: string[]
  evaluatorVersion: string
  knowledgeGraphVersion: string
  policyVersion: string
  effectiveAt: string
  recordedAt: string
}
```

### Layer 4 — Projections and Snapshots

Optimized read models for game, learner, mentor, and analytics surfaces.

Snapshots are disposable and rebuildable.

```ts
interface DiscoverySnapshot {
  learnerId: string
  snapshotVersion: number
  sourceWatermark: SourceWatermark
  evaluatorBundleVersion: string
  state: DiscoveryAggregateState
  createdAt: string
  checksum: string
}
```

## Source of Truth

The authority order is:

```text
Authoritative World Event
  > Discovery Evidence Ledger
    > Interpretation Ledger
      > Snapshot
        > UI Projection
```

A lower layer must never override a higher layer.

## Aggregate Boundary

Discovery state may be partitioned by learner and concept domain.

Example aggregate keys:

```text
learner:{learnerId}:discovery
learner:{learnerId}:domain:{domainId}
learner:{learnerId}:concept:{conceptId}
```

Partitioning must preserve causal ordering for evidence that affects the same claim.

## Ordering

The runtime distinguishes:

- source event order
- ingestion order
- evaluation order
- effective interpretation time
- persistence time

Late-arriving evidence must be accepted without pretending it occurred recently.

## Idempotency

Evidence ingestion must be idempotent.

A stable identity may include:

```text
sourceRuntime + sourceStream + sourceSequence + evaluatorVersion + evidenceType
```

Retries must not produce duplicate evidence or duplicate progression transitions.

## Optimistic Concurrency

Writes to discovery aggregates use expected revision.

```ts
interface DiscoveryWriteCommand {
  learnerId: string
  expectedRevision: number
  commandId: string
  correlationId: string
  causationId: string
  records: DiscoveryPersistenceRecord[]
}
```

A revision conflict triggers re-read and deterministic re-evaluation rather than blind overwrite.

## Transaction Boundary

When a single evaluation creates multiple related records, persistence must be atomic.

Example:

```text
new evidence
+ pattern hypothesis update
+ concept contradiction
+ progression transition
+ projection invalidation
```

Either all records commit or none commit.

## Snapshot Policy

Snapshots may be created based on:

- evidence count threshold
- replay time budget
- major evaluator version boundary
- learner session completion
- scheduled maintenance

Snapshots must record the exact source watermark and evaluator bundle version.

## Replay Modes

### Recovery Replay

Rebuild current state after crash, lost projection, or snapshot corruption.

### Verification Replay

Run the same evidence through the same versions and confirm deterministic output.

### Migration Replay

Run historical evidence through a newer evaluator or knowledge graph version.

### Diagnostic Replay

Inspect why a claim transitioned, contradicted, split, or became dormant.

### Counterfactual Replay

Evaluate alternative policy or guidance rules without changing production state.

Counterfactual output must remain isolated and clearly labeled non-authoritative.

## Replay Contract

```ts
interface DiscoveryReplayRequest {
  learnerId: string
  fromWatermark?: SourceWatermark
  toWatermark?: SourceWatermark
  evaluatorBundleVersion: string
  knowledgeGraphVersion: string
  policyVersion: string
  mode: DiscoveryReplayMode
  persistResult: boolean
}
```

A replay result includes:

- processed source range
- evidence count
- ignored duplicate count
- quarantined record count
- state checksum
- divergence report
- elapsed time
- persistence outcome

## Determinism

Given identical:

- source evidence
- evaluator versions
- knowledge graph version
- policy version
- seeded randomness, if any
- ordering rules

replay must produce the same state checksum.

Wall-clock time, process scheduling, or database row order must not change semantic results.

## Rule Versioning

Each semantic decision records all rule versions that influenced it.

```text
evidence evaluator version
pattern evaluator version
concept evaluator version
progression policy version
hint policy version
knowledge graph version
schema version
```

A generic application version is insufficient provenance.

## Migration Strategy

Migrations fall into three categories.

### Structural Migration

Changes storage schema without changing meaning.

### Semantic Migration

Changes how evidence is interpreted.

### Graph Migration

Changes concept identity, relation, representation, or prerequisite topology.

Semantic and graph migrations require replay or an explicit compatibility adapter.

## Concept Identity Migration

Knowledge graph evolution may:

- rename a concept
- merge duplicate concepts
- split an overly broad concept
- supersede a misconception definition
- change representation mappings

Migration records must preserve old identifiers and explain the mapping.

```ts
interface ConceptIdentityMigration {
  migrationId: string
  fromConceptIds: string[]
  toConceptIds: string[]
  strategy: 'RENAME' | 'MERGE' | 'SPLIT' | 'SUPERSEDE'
  graphVersionFrom: string
  graphVersionTo: string
  effectiveAt: string
}
```

## Claim Split Replay

When a broad claim is split, historical evidence must be redistributed only when provenance supports the narrower claims.

Unsupported evidence remains attached to the historical claim or is marked unresolved. It must not be copied optimistically into every new claim.

## Revocation and Supersession

Evidence is append-only but may be revoked or superseded.

A revocation record must include:

- target evidence identity
- reason code
- authority
- timestamp
- replacement evidence, when applicable
- affected projections

Revocation never erases the audit trail.

## Corruption Detection

The runtime should detect:

- invalid schema version
- broken source reference
- checksum mismatch
- missing causal predecessor
- impossible progression transition
- duplicate semantic identity
- unknown concept mapping
- unsupported evaluator version

Corrupted records enter quarantine instead of being silently discarded.

## Quarantine

```ts
interface QuarantinedDiscoveryRecord {
  quarantineId: string
  originalRecordId: string
  reasonCode: string
  detectedAt: string
  detectorVersion: string
  rawPayloadReference: string
  resolutionStatus: 'OPEN' | 'REPAIRED' | 'DISCARDED_WITH_AUDIT'
}
```

Production projections must disclose when quarantined data may affect completeness.

## Crash Recovery

After interruption, the runtime:

1. loads the latest valid snapshot
2. verifies its checksum and version compatibility
3. reads evidence after the snapshot watermark
4. replays deterministically
5. writes missing projections
6. advances the recovery watermark atomically

A partially persisted evaluation must not appear as completed.

## Offline and Sync

Offline discovery evidence may be staged locally with stable source identities.

Sync must handle:

- duplicate upload
- out-of-order arrival
- divergent local projections
- expired evaluator versions
- revoked world events
- multiple devices

Server authority resolves semantic state from evidence. Client projections are advisory caches.

## Retention

Retention policy must distinguish:

- required evidence provenance
- learner-facing history
- mentor annotations
- sensitive raw context
- diagnostic payloads
- anonymized aggregate analytics

Deleting personal data must follow legal and product policy while preserving only legitimately required non-identifying audit structure.

## Export and Portability

A learner export should provide understandable discovery history without exposing internal security data.

Exported records should include:

- concept and pattern identifiers with human-readable names
- progression history
- assistance context
- evidence provenance summary
- mentor annotations within authorized scope
- version metadata

## Observability

Persistence observability includes:

- evidence ingestion lag
- duplicate rate
- replay duration
- snapshot age
- projection rebuild count
- quarantine count
- revision conflict rate
- divergence count
- migration completion rate

Operational metrics must not become learner scoring signals.

## Failure Semantics

Examples:

```text
DISCOVERY_SOURCE_REFERENCE_MISSING
DISCOVERY_EVIDENCE_DUPLICATE
DISCOVERY_REVISION_CONFLICT
DISCOVERY_SNAPSHOT_CORRUPT
DISCOVERY_REPLAY_DIVERGED
DISCOVERY_EVALUATOR_VERSION_UNAVAILABLE
DISCOVERY_GRAPH_VERSION_UNAVAILABLE
DISCOVERY_RECORD_QUARANTINED
DISCOVERY_MIGRATION_INCOMPLETE
```

Failures must be explicit, retry-safe where appropriate, and observable.

## Runtime Invariants

1. Authoritative source references precede discovery interpretations.
2. Evidence ingestion is idempotent.
3. Interpretation records preserve supporting and contradicting evidence identities.
4. Cached projections are rebuildable and never authoritative.
5. Replay under identical versions and inputs is deterministic.
6. Every semantic decision records evaluator and graph versions.
7. Late evidence retains original effective time.
8. Revision conflicts cannot be resolved by blind overwrite.
9. Multi-record evaluation writes are atomic.
10. Snapshot validity requires checksum and watermark verification.
11. Semantic migrations require replay or explicit compatibility rules.
12. Revocation preserves audit history.
13. Corrupt records are quarantined, not silently deleted.
14. Offline clients cannot overwrite server-derived semantic authority.
15. Counterfactual replay cannot mutate production state.
16. Persistence metrics cannot be repurposed as learner scores.

## Architectural Outcome

The Discovery Persistence and Replay Runtime makes discoveries durable, explainable, recoverable, and evolvable.

It ensures that the system can change its interpretations over time without losing the evidence trail that protects learner trust and architectural integrity.