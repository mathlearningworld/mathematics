# 31H — Curriculum Verification Runtime

## 1. Purpose

This slice defines the verification pipeline that determines whether curriculum data, versions, publication states, alignments, migrations, and projections are structurally valid, semantically coherent, provenance-safe, and eligible for publication or operational use.

The central rule is:

> Verification may confirm whether declared curriculum meaning is internally and operationally valid; it must never invent stronger curriculum truth than the evidence supports.

Verification is an independent runtime concern. It does not replace editorial review, policy approval, publication authority, or domain expertise.

---

## 2. Scope

This runtime verifies:

- curriculum identity
- curriculum version identity
- lifecycle transitions
- jurisdiction and authority provenance
- curriculum tree structure
- node identity and placement
- grade and subject mapping
- localization completeness
- alignment validity
- publication readiness
- effective-date coherence
- overlay isolation
- persistence integrity
- replay determinism
- migration readiness
- projection consistency

This runtime does not own:

- curriculum authoring
- final policy approval
- learner mastery decisions
- assessment validity beyond declared alignment evidence
- skill dependency truth
- recommendation decisions

---

## 3. Verification Principles

1. Verification is evidence-based.
2. Verification is version-bound.
3. Verification is policy-bound.
4. Verification is deterministic for fixed inputs.
5. Verification failure must be explainable.
6. Verification never silently repairs authority-bearing data.
7. Verification never upgrades provisional or approximate relationships into authoritative ones.
8. Publication and migration require explicit verification outcomes.

---

## 4. Verification Targets

A verification target must identify:

- target type
- target identity
- target version
- curriculum version
- policy version
- schema version
- provenance context
- requested verification profile
- correlation identity

Supported target types:

- CURRICULUM
- CURRICULUM_VERSION
- CURRICULUM_NODE
- ALIGNMENT_SET
- PUBLICATION_PACKAGE
- OVERLAY
- MIGRATION_PLAN
- PROJECTION
- REPLAY_RESULT

---

## 5. Verification Profiles

### 5.1 Draft profile

Used during authoring. Allows incomplete data but reports missing requirements.

### 5.2 Review profile

Used before approval. Requires structural completeness, provenance, and review evidence.

### 5.3 Publication profile

Used before publication or activation. Requires all blocking gates to pass.

### 5.4 Migration profile

Used before version migration. Requires mapping completeness, preservation rules, and rollback readiness.

### 5.5 Recovery profile

Used after persistence restore or replay. Requires ledger integrity and deterministic reconstruction.

### 5.6 Projection profile

Used before exposing rebuilt read models. Requires source-version and freshness consistency.

Profiles may differ in severity thresholds, but they must not reinterpret the underlying facts.

---

## 6. Verification Pipeline

The standard verification pipeline is:

1. target resolution
2. identity verification
3. schema verification
4. provenance verification
5. structural verification
6. temporal verification
7. semantic verification
8. relationship verification
9. publication or migration gate verification
10. persistence and replay verification
11. projection verification
12. outcome classification
13. evidence publication

A failed blocking stage may stop later stages when their results would be misleading.

---

## 7. Identity Verification

Identity verification must ensure:

- curriculum identity is stable and unique
- curriculum version belongs to the declared curriculum
- node identity is unique within the version scope
- external references resolve to explicit versions where required
- overlays reference valid base identities
- alignment records reference existing source and target versions
- publication packages reference exactly one curriculum version

Ambiguous identity resolution is blocking.

Name matching is not identity verification.

---

## 8. Schema Verification

Schema verification must confirm:

- required fields are present
- enums contain supported values
- identifiers conform to contract
- version fields are parseable
- timestamps are valid
- language tags are valid
- relation types are supported
- payload schema versions are recognized

Unknown authority-bearing schema versions must block verification.

---

## 9. Provenance Verification

Every curriculum version and node must expose provenance sufficient to establish:

- jurisdiction
- publishing authority
- source classification
- source document or source record reference
- edition or version reference
- ingestion or authoring actor
- review actor where required
- effective-date basis

Provenance classifications:

- OFFICIAL
- INSTITUTIONAL_OVERLAY
- TEACHER_OVERLAY
- COMMUNITY_DRAFT

A lower-authority source must never be presented as a higher-authority source.

Missing official provenance is blocking for official publication.

---

## 10. Structural Verification

Structural verification must examine:

- root count
- parent-child consistency
- acyclic hierarchy
- stable ordering
- orphan nodes
- duplicate node identities
- invalid cross-branch placement
- grade placement consistency
- subject placement consistency
- domain, strand, standard, indicator, and objective hierarchy
- required node-type transitions

Recommended hierarchy constraints should be policy-configurable but deterministic.

A cycle in the authoritative curriculum tree is always blocking.

---

## 11. Temporal Verification

Temporal verification must ensure:

- effective periods are valid
- publication date precedes or equals activation date
- supersession boundaries do not produce accidental authority overlap
- revoked versions are not resolved as active
- scheduled activation has a valid approved package
- correction events do not rewrite historical effective dates improperly
- overlay validity does not exceed its base-version compatibility window

Explicit overlap may be allowed only when the governing policy and jurisdiction permit it.

---

## 12. Semantic Verification

Semantic verification checks declared meaning without pretending to replace expert judgment.

It may verify:

- title and description coherence
- objective phrasing completeness
- declared node-type semantics
- required measurable outcome fields
- contradiction markers
- unsupported equivalence claims
- prohibited strengthening terms
- grade-scope declarations

Automated semantic checks produce evidence candidates, not unquestionable domain truth.

A semantic warning becomes blocking only when policy explicitly declares it blocking.

---

## 13. Alignment Verification

Every alignment must verify:

- source entity identity and version
- curriculum node identity and version
- relationship type
- evidence basis
- reviewer or policy basis
- confidence classification
- effective period where applicable

Critical rules:

- alignment is not equivalence
- approximate equivalence is not interchangeability
- practice is not assessment
- assessment alignment is not assessment validity
- coverage declaration is not learner mastery

An alignment referencing an updated source version must be revalidated unless policy explicitly supports safe inheritance.

---

## 14. Coverage Verification

Coverage verification may determine whether declared curriculum nodes are represented by content or assessment entities.

Coverage states:

- NOT_COVERED
- PARTIALLY_COVERED
- DECLARED_COVERED
- VERIFIED_COVERED_BY_POLICY
- UNKNOWN

Coverage verification must not infer understanding or mastery.

A percentage alone is insufficient without version, scope, relation-type, and policy context.

---

## 15. Publication Readiness Verification

A publication package must pass:

### Identity gate

All identities and versions resolve explicitly.

### Provenance gate

Authority and source records are complete.

### Structural gate

The curriculum tree is valid and complete under the publication profile.

### Temporal gate

Publication and activation periods are coherent.

### Alignment gate

Required external alignments are valid or explicitly deferred.

### Distribution gate

Locales, package manifests, and delivery metadata are complete.

### Persistence gate

Authoritative records are durable and replayable.

### Governance gate

Required approvals and signatures are present.

Publication must be blocked if any blocking gate fails.

Partial publication must not create partial authority unless the publication model explicitly supports independently authoritative partitions.

---

## 16. Migration Readiness Verification

A migration plan must verify:

- source and destination versions
- mapping policy
- node-level mapping coverage
- unmapped-node treatment
- split and merge handling
- historical-reference preservation
- alignment revalidation policy
- projection rebuild plan
- rollback plan
- replay comparison plan

Unexplained semantic loss is blocking.

A migration with approximate mappings must expose that limitation to downstream consumers.

---

## 17. Persistence and Replay Verification

The verifier must confirm:

- no ledger gaps
- monotonic aggregate versions
- valid event schema versions
- snapshot digest agreement
- deterministic replay
- stable reconstruction digest
- outbox linkage to authoritative events
- idempotency-record consistency

Unknown replay divergence is blocking.

Projection drift may be repaired by rebuild only after authoritative reconstruction passes.

---

## 18. Projection Verification

Projection verification must ensure:

- source curriculum version is explicit
- projection version is explicit
- freshness state is known
- revoked content is excluded according to policy
- overlay visibility respects audience and tenancy
- localization fallback is declared
- search results do not imply authority through ranking
- node counts and digests match authoritative state

A stale blocking projection must not be used for authority-bearing decisions.

---

## 19. Outcome Model

Verification outcome:

- VERIFIED
- VERIFIED_WITH_WARNINGS
- NOT_VERIFIED
- BLOCKED
- INCONCLUSIVE

Each outcome must include:

- verification run identity
- target identity and version
- profile
- policy version
- runtime version
- started and completed timestamps
- checks executed
- findings
- blocking findings
- evidence references
- deterministic digest

`INCONCLUSIVE` must never be treated as success.

---

## 20. Finding Severity

Findings use:

- INFO
- WARNING
- ERROR
- BLOCKING

Severity must be policy-bound and recorded with the verification result.

Changing severity policy later must not rewrite historical verification outcomes.

A new verification run may reinterpret the same target under a new policy, but both outcomes must remain distinguishable.

---

## 21. Finding Categories

Recommended categories:

- IDENTITY
- SCHEMA
- PROVENANCE
- STRUCTURE
- TEMPORAL
- SEMANTIC
- ALIGNMENT
- COVERAGE
- PUBLICATION
- MIGRATION
- PERSISTENCE
- REPLAY
- PROJECTION
- SECURITY
- GOVERNANCE

---

## 22. Verification Evidence

Evidence may include:

- source record references
- content digests
- event positions
- structural paths
- relation records
- approval records
- replay comparison results
- projection comparison results
- localization coverage summaries

Evidence must be immutable once attached to a completed verification run.

Supplementary evidence may be appended through a new evidence record, not by rewriting prior evidence.

---

## 23. Reverification Triggers

Reverification is required when:

- curriculum version changes
- node structure changes
- provenance changes
- publication policy changes
- alignment source version changes
- overlay base version changes
- migration plan changes
- replay runtime changes materially
- event upcaster changes
- projection schema changes
- blocking issue is corrected

A prior verification result does not automatically transfer to a new version.

---

## 24. Failure Codes

Recommended failure codes:

- CURRICULUM_VERIFICATION_TARGET_NOT_FOUND
- CURRICULUM_VERIFICATION_IDENTITY_AMBIGUOUS
- CURRICULUM_VERIFICATION_SCHEMA_UNSUPPORTED
- CURRICULUM_VERIFICATION_PROVENANCE_MISSING
- CURRICULUM_VERIFICATION_TREE_CYCLE
- CURRICULUM_VERIFICATION_ORPHAN_NODE
- CURRICULUM_VERIFICATION_TEMPORAL_CONFLICT
- CURRICULUM_VERIFICATION_ALIGNMENT_INVALID
- CURRICULUM_VERIFICATION_PUBLICATION_BLOCKED
- CURRICULUM_VERIFICATION_MIGRATION_BLOCKED
- CURRICULUM_VERIFICATION_REPLAY_DIVERGENCE
- CURRICULUM_VERIFICATION_PROJECTION_DRIFT
- CURRICULUM_VERIFICATION_INCONCLUSIVE

---

## 25. Runtime Contracts

### VerifyCurriculumTargetCommand

Required fields:

- commandId
- targetType
- targetId
- targetVersion
- profile
- policyVersion
- requestedBy
- correlationId

### CurriculumVerificationResult

Required fields:

- verificationRunId
- targetType
- targetId
- targetVersion
- outcome
- policyVersion
- runtimeVersion
- findings
- blockingFindingCount
- digest
- completedAt

### VerificationFinding

Required fields:

- findingId
- category
- severity
- code
- message
- evidenceReferences
- affectedPath
- policyRule

---

## 26. Security and Separation of Duties

Verification execution may be automated, but publication approval must remain separately authorized.

The same actor may prepare a package and run verification, but policy may require an independent approver.

Verification results must be tenant-scoped where institution overlays are involved.

Sensitive unpublished curriculum drafts must not leak through evidence messages or logs.

---

## 27. Observability

Metrics should include:

- verification runs by profile
- success and block rates
- findings by category and severity
- average verification duration
- replay divergence count
- projection drift count
- publication packages blocked
- migration plans blocked
- reverification frequency

Logs must include correlation identity and target version, but avoid full protected payloads.

---

## 28. Verification Gates for 31H

### Repository gate

- verification profiles defined
- finding model defined
- outcome model defined
- publication and migration gates defined
- contracts and failure codes defined

### Runtime gate

- deterministic repeated-run test
- policy-version binding test
- hierarchy-cycle detection test
- temporal-conflict test
- alignment-version mismatch test
- replay-divergence blocking test
- stale projection blocking test

### Operational gate

- draft package produces warnings without false authority
- valid publication package verifies successfully
- invalid package cannot activate
- corrected package requires a new run
- migration with semantic loss is blocked
- recovery replay must verify before exposure

---

## 29. Runtime Invariants

1. Verification is bound to an explicit target version.
2. Verification is bound to an explicit policy version.
3. Inconclusive is never success.
4. Verification never invents authority.
5. Publication cannot bypass blocking verification gates.
6. Migration cannot bypass semantic preservation gates.
7. A changed version requires reverification.
8. Historical verification outcomes remain immutable.
9. Unknown replay divergence is blocking.
10. Stale blocking projections cannot support authority-bearing decisions.
11. Automated checks do not silently replace expert approval.
12. Verification evidence remains auditable.

---

## 30. Completion Criteria

31H is complete when Curriculum Runtime has deterministic, profile-based, policy-bound verification for identity, provenance, structure, time, semantics, alignment, publication, migration, persistence, replay, and projections; explicit outcomes and findings; and blocking gates that prevent invalid curriculum authority from being published or migrated.
