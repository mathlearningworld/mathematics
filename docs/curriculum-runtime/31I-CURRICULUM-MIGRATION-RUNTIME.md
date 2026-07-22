# 31I — Curriculum Migration Runtime

## 1. Purpose

This slice defines how Curriculum Runtime moves references, alignments, overlays, projections, and operational consumers from one curriculum version to another without deleting history, overstating equivalence, or corrupting downstream meaning.

The central rule is:

> Migration changes operational references; it does not rewrite historical curriculum truth.

A migration must preserve the ability to explain:

- which source version was used
- which destination version replaced it operationally
- how each node was mapped
- what meaning was preserved
- what meaning changed
- what could not be mapped safely
- which downstream entities require revalidation

---

## 2. Scope

Migration Runtime owns migration semantics for:

- curriculum version transitions
- curriculum node mappings
- split-node and merged-node transitions
- grade and subject restructuring
- curriculum-code changes
- alignment revalidation
- overlay compatibility
- publication activation handoff
- projection rebuild coordination
- downstream reference migration
- rollback and recovery evidence

It does not own:

- authoring the destination curriculum
- approving publication
- learner mastery reinterpretation
- automatic skill equivalence
- automatic assessment validity
- lesson content rewriting
- policy approval

---

## 3. Migration Model

A migration is an explicit, versioned operation between:

- one source curriculum version
- one destination curriculum version
- one migration policy version
- one mapping set version

The operation may be global, institution-scoped, product-surface-scoped, or staged.

A migration must never be inferred solely because a newer curriculum version exists.

Supersession does not automatically migrate consumers.

---

## 4. Migration Lifecycle

Recommended states:

- DRAFT
- MAPPING_IN_PROGRESS
- READY_FOR_VERIFICATION
- VERIFIED
- SCHEDULED
- EXECUTING
- PARTIALLY_EXECUTED
- COMPLETED
- ROLLED_BACK
- FAILED
- CANCELLED

State transitions must be explicit and append-only.

A failed or cancelled migration remains historically visible.

---

## 5. Migration Identity

Every migration must include:

- migrationId
- sourceCurriculumId
- sourceVersionId
- destinationCurriculumId
- destinationVersionId
- mappingSetId
- mappingSetVersion
- policyVersion
- scope
- requestedBy
- approvedBy when required
- scheduledAt when applicable
- correlationId

The source and destination may belong to the same long-lived curriculum identity or to different curriculum identities when jurisdiction or authority changes.

---

## 6. Node Mapping Types

Supported mapping types:

- SAME_MEANING
- APPROXIMATELY_EQUIVALENT
- SOURCE_BROADER
- SOURCE_NARROWER
- SPLIT_INTO_MULTIPLE
- MERGED_FROM_MULTIPLE
- MOVED_WITHOUT_SEMANTIC_CHANGE
- RENAMED_WITHOUT_SEMANTIC_CHANGE
- REPLACED_WITH_SEMANTIC_CHANGE
- DEPRECATED_WITHOUT_REPLACEMENT
- NEW_IN_DESTINATION
- NO_SAFE_MAPPING

Critical rule:

> Approximate mapping is not interchangeability.

Mappings must expose confidence, evidence, and reviewer basis.

---

## 7. Mapping Record

Each node mapping must include:

- mappingId
- sourceNodeId and sourceNodeVersion
- destinationNodeId or destinationNodeIds
- mappingType
- confidence classification
- evidence references
- semantic-change summary
- review status
- reviewer identity or policy basis
- createdAt
- verifiedAt when applicable

For split and merge mappings, cardinality must be explicit.

No implicit many-to-many mapping is permitted.

---

## 8. Mapping Confidence

Recommended confidence values:

- VERIFIED_EXACT
- VERIFIED_HIGH
- REVIEWED_APPROXIMATE
- PROVISIONAL
- UNKNOWN

Only `VERIFIED_EXACT` may support automatic transfer where downstream policy explicitly permits it.

`REVIEWED_APPROXIMATE`, `PROVISIONAL`, and `UNKNOWN` must not silently transfer authority-bearing claims.

---

## 9. Downstream Consumer Classes

Migration policy must distinguish consumers:

### 9.1 Historical records

Examples:

- completed assessments
- prior learner progress events
- historical mission records
- prior reports

Historical records remain bound to the original curriculum version.

### 9.2 Active operational references

Examples:

- current lesson assignments
- active missions
- current curriculum browsing context
- institution curriculum selection

These may be migrated according to explicit policy.

### 9.3 Derived projections

These should be rebuilt from authoritative source and migration records.

### 9.4 Alignment records

These require revalidation unless the mapping policy permits safe inheritance.

### 9.5 Overlays

These require compatibility verification against the destination version.

---

## 10. Historical Preservation

Migration must never mutate historical records to appear as if they originally referenced the destination curriculum.

Historical reports may offer a translated or current-curriculum view, but must label it as interpretation.

The system must preserve:

- original curriculum version
- original node identity
- original event time
- migration mapping used for any translated view
- destination interpretation version

Translated historical view is not original historical truth.

---

## 11. Alignment Migration

Alignment migration rules:

- exact safe mapping may be eligible for inherited alignment
- renamed or moved nodes require identity and meaning confirmation
- approximate mappings require review
- split mappings require source alignment distribution review
- merge mappings require conflict review
- semantic-change mappings require full revalidation
- no-safe-mapping invalidates automatic inheritance

Inherited alignment must record:

- original alignment identity
- source version
- mapping identity
- inheritance policy version
- revalidation status

---

## 12. Assessment Migration

Assessment alignment to a curriculum node must not be migrated merely because a node name is similar.

Automatic migration may occur only when:

- the node mapping is exact
- assessment target meaning is preserved
- assessment version remains compatible
- governing policy permits transfer

Otherwise the assessment alignment becomes `REVALIDATION_REQUIRED`.

Assessment results already completed remain tied to their original curriculum version.

---

## 13. Lesson and Content Migration

Lessons, explanations, and exercises may be transferred when their declared target meaning remains valid.

Migration outcomes:

- TRANSFERRED
- TRANSFERRED_WITH_REVIEW
- PARTIALLY_TRANSFERRED
- REVALIDATION_REQUIRED
- NOT_TRANSFERABLE

Content migration must not imply that the destination curriculum is fully covered.

---

## 14. Mission Migration

Active missions referencing curriculum targets require policy decisions for:

- exact target replacement
- approximate target substitution
- target expansion after split
- target consolidation after merge
- mission continuation under the original version
- mission cancellation or redesign

A mission must never silently change its learner-facing goal.

Material goal changes require explicit mission-version transition or user-visible confirmation.

---

## 15. Progress Interpretation

Historical progress remains bound to the curriculum version under which it was recorded.

Current-curriculum interpretation may derive mapped progress views, but must expose:

- mapping coverage
- unmapped progress
- approximate mappings
- confidence
- interpretation policy version

Mapped progress is not new mastery evidence.

---

## 16. Overlay Migration

Institution and teacher overlays must be classified:

- COMPATIBLE
- COMPATIBLE_WITH_REVIEW
- PARTIALLY_COMPATIBLE
- INCOMPATIBLE
- UNKNOWN

An overlay must not become active on the destination version until compatibility verification passes.

Official curriculum migration must not absorb overlay meaning into official records.

---

## 17. Migration Planning

A migration plan must include:

- scope
- source and destination versions
- mapping summary
- unresolved mappings
- consumer inventory
- batch strategy
- effective date
- publication dependencies
- projection rebuild plan
- verification plan
- rollback plan
- observability plan
- communication plan for material user-facing changes

Plans must be immutable after approval. Material changes create a new plan version.

---

## 18. Execution Modes

### 18.1 Dry run

Produces impact and outcome previews without authoritative changes.

### 18.2 Shadow migration

Applies changes in an isolated environment and compares outputs.

### 18.3 Staged migration

Migrates bounded consumer cohorts or surfaces in phases.

### 18.4 Full migration

Migrates all in-scope active references in one controlled operation.

### 18.5 On-access migration

Migrates a reference when accessed. This is allowed only for non-critical references with deterministic, idempotent mapping.

Authority-bearing migrations should prefer explicit batch execution.

---

## 19. Transaction and Batch Boundaries

Large migrations may run in batches.

Each batch must record:

- batchId
- migrationId
- target scope
- source checkpoint
- destination checkpoint
- item count
- success count
- skipped count
- failure count
- digest
- startedAt
- completedAt

Batch completion does not imply overall migration completion.

Partial execution must remain explicit.

---

## 20. Idempotency

Migration commands and batches must be idempotent.

Repeating a completed batch must not duplicate mappings, references, or events.

A changed payload under the same command or batch identity must be rejected.

Each migrated reference should preserve a migration receipt linking source, destination, mapping, and operation identity.

---

## 21. Verification Before Execution

Execution must be blocked unless:

- source version resolves
- destination version resolves
- destination publication state permits migration preparation
- mapping set verifies
- unresolved mappings comply with policy
- rollback strategy exists
- persistence replay test passes
- downstream impact inventory is complete enough for the selected scope

Activation of the destination version may require migration completion or an explicit coexistence policy.

---

## 22. Verification After Execution

Post-migration verification must compare:

- migrated reference counts
- unmapped reference counts
- duplicate references
- invalid destination identities
- alignment revalidation states
- overlay compatibility states
- projection digests
- replay digests
- publication resolution behavior

Unknown divergence blocks final completion.

---

## 23. Rollback

Rollback must be modeled as a new, auditable operation.

Rollback must not delete the migration history.

Rollback strategies:

- reference pointer restoration
- projection rollback and rebuild
- destination activation reversal
- staged cohort rollback
- compensating alignment events

Historical records created during the migration window must remain historically accurate.

A rollback cannot pretend that the migration never occurred.

---

## 24. Coexistence

Some jurisdictions or institutions may require source and destination versions to coexist.

Coexistence policy must define:

- eligible audiences
- effective periods
- default resolution
- explicit version selection
- reporting separation
- alignment and content compatibility
- retirement conditions

Coexistence must not cause silent version floating.

---

## 25. Failure Codes

Recommended failure codes:

- CURRICULUM_MIGRATION_SOURCE_NOT_FOUND
- CURRICULUM_MIGRATION_DESTINATION_NOT_FOUND
- CURRICULUM_MIGRATION_MAPPING_INCOMPLETE
- CURRICULUM_MIGRATION_MAPPING_AMBIGUOUS
- CURRICULUM_MIGRATION_SEMANTIC_LOSS
- CURRICULUM_MIGRATION_ALIGNMENT_REVALIDATION_REQUIRED
- CURRICULUM_MIGRATION_OVERLAY_INCOMPATIBLE
- CURRICULUM_MIGRATION_BATCH_CONFLICT
- CURRICULUM_MIGRATION_IDEMPOTENCY_CONFLICT
- CURRICULUM_MIGRATION_REPLAY_DIVERGENCE
- CURRICULUM_MIGRATION_ROLLBACK_FAILED
- CURRICULUM_MIGRATION_PARTIAL_FAILURE
- CURRICULUM_MIGRATION_POLICY_VIOLATION

---

## 26. Runtime Contracts

### CreateCurriculumMigrationPlanCommand

- commandId
- sourceCurriculumVersionId
- destinationCurriculumVersionId
- mappingSetVersion
- policyVersion
- scope
- requestedBy
- correlationId

### ExecuteCurriculumMigrationCommand

- commandId
- migrationId
- expectedMigrationVersion
- executionMode
- batchScope when applicable
- requestedBy
- correlationId

### CurriculumMigrationResult

- migrationId
- migrationVersion
- state
- sourceVersionId
- destinationVersionId
- migratedCount
- unresolvedCount
- revalidationRequiredCount
- failedCount
- digest
- completedAt when applicable

---

## 27. Observability

Metrics should include:

- migrations by state
- mapping coverage percentage
- exact versus approximate mapping counts
- unresolved node mappings
- references migrated
- references requiring review
- failed batches
- rollback count
- replay divergence count
- time spent in each lifecycle state

Logs must include migration, batch, correlation, source-version, and destination-version identities.

---

## 28. Security and Governance

Only authorized actors may approve or execute migration.

Institution-scoped migrations must remain tenant-safe.

Official curriculum migration and overlay migration require separate authority boundaries.

High-impact migrations should require separation of duties among planner, verifier, and approver.

Migration evidence must be auditable and exportable.

---

## 29. Verification Gates for 31I

### Repository gate

- migration lifecycle defined
- mapping taxonomy defined
- downstream consumer policies defined
- rollback and coexistence defined
- contracts and failure codes defined

### Runtime gate

- exact mapping transfer test
- approximate mapping review test
- split and merge mapping tests
- historical reference preservation test
- idempotent batch retry test
- partial failure recovery test
- rollback test
- replay comparison test

### Operational gate

- dry run reports complete impact
- shadow migration produces deterministic digest
- staged migration preserves unaffected scopes
- active references migrate without rewriting historical records
- invalid mappings block completion
- rollback restores operational resolution while retaining history

---

## 30. Runtime Invariants

1. Migration never rewrites historical curriculum truth.
2. Source and destination versions are always explicit.
3. Supersession does not imply automatic migration.
4. Approximate mapping is never treated as exact equivalence.
5. Historical learner and assessment records remain bound to original versions.
6. Active references migrate only under explicit policy.
7. Alignments require revalidation unless safe inheritance is proven.
8. Every migrated reference has an auditable receipt.
9. Migration execution is idempotent.
10. Partial completion remains explicit.
11. Unknown semantic loss blocks completion.
12. Rollback is auditable and does not erase migration history.
13. Coexisting versions never silently float.
14. Mapped progress does not create new mastery evidence.

---

## 31. Completion Criteria

31I is complete when Curriculum Runtime can plan, verify, execute, observe, and roll back version migrations while preserving historical references, distinguishing exact and approximate mappings, coordinating downstream revalidation, and preventing silent semantic loss.
