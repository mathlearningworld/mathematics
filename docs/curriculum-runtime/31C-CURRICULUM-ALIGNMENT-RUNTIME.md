# Chapter 31C — Curriculum Alignment Runtime

## 1. Purpose

Curriculum Alignment Runtime records and resolves explicit relationships between curriculum entities and downstream learning artifacts without allowing alignment to become evidence of learner understanding.

It answers:

- Which lesson, assessment target, mission objective, gameplay activity, or progress dimension claims alignment to a curriculum node?
- Who created and approved the alignment?
- Which curriculum version and artifact version were aligned?
- What is the strength, direction, scope, and status of the relationship?
- Has the alignment become stale because either side changed?

Alignment is a governed relationship. It is not inferred truth merely because labels appear similar.

## 2. Architectural Position

```text
Curriculum Runtime
        │
        ▼
Curriculum Alignment Runtime
        │
 ┌──────┼───────────┬───────────┐
 ▼      ▼           ▼           ▼
Lesson Assessment  Mission    Gameplay
        │
        ▼
Progress and Reporting
```

The alignment runtime references authoritative entities from both sides. It does not take ownership of those entities.

## 3. Ownership Boundary

Alignment Runtime owns:

- alignment-record identity;
- source and target references;
- relationship type;
- alignment scope;
- alignment rationale;
- reviewer and approval evidence;
- confidence and limitations;
- lifecycle state;
- version binding;
- supersession and withdrawal;
- staleness detection;
- cross-curriculum mapping provenance.

Alignment Runtime does not own:

- curriculum definitions;
- lesson content;
- assessment validity;
- mission completion;
- gameplay completion;
- learner mastery;
- progress aggregation;
- recommendation decisions;
- skill prerequisite truth.

## 4. Core Runtime Laws

```text
Alignment ≠ Equivalence
Alignment ≠ Coverage
Alignment ≠ Instruction
Alignment ≠ Assessment validity
Alignment ≠ Learner mastery
Text similarity ≠ Alignment
Shared code ≠ Shared meaning
One artifact ≠ One curriculum objective
Approved alignment ≠ Permanent alignment
```

## 5. Alignment Record

A minimum alignment record contains:

- `alignmentId`
- `tenantScope`
- `sourceEntityType`
- `sourceEntityId`
- `sourceEntityVersion`
- `targetCurriculumVersionId`
- `targetCurriculumNodeId`
- `relationshipType`
- `alignmentScope`
- `alignmentStrength`
- `rationale`
- `createdBy`
- `reviewedBy`
- `approvalState`
- `effectiveFrom`
- `effectiveTo`
- `limitations`
- `contentHash`
- `supersedesAlignmentId`

Both source and target versions are mandatory for approved alignments.

## 6. Relationship Types

Supported relationship types include:

- INTRODUCES
- TEACHES
- PRACTICES
- REINFORCES
- ASSESSES
- PROVIDES_EVIDENCE_FOR
- SUPPORTS_MISSION_TARGET
- CONTEXTUALIZES
- REPORTS_AGAINST
- PARTIALLY_COVERS
- FULLY_COVERS_BY_DECLARED_POLICY
- MAPS_TO_EQUIVALENT_SCOPE
- MAPS_TO_BROADER_SCOPE
- MAPS_TO_NARROWER_SCOPE

Each relationship type has explicit semantics. Consumers may not reinterpret `PRACTICES` as `ASSESSES`, or `ASSESSES` as `MASTERED`.

## 7. Alignment Scope

Alignment scope may be:

- WHOLE_ARTIFACT
- SECTION
- STEP
- QUESTION
- RESPONSE_OPTION
- RUBRIC_CRITERION
- MISSION_OBJECTIVE
- GAMEPLAY_OBJECTIVE
- EVIDENCE_TYPE
- PROGRESS_DIMENSION

Partial alignments must identify the exact sub-resource. Whole-artifact alignment must not be used when only one fragment is relevant.

## 8. Alignment Strength

Alignment strength expresses declared relationship strength, not learner outcome.

Allowed values:

- INCIDENTAL
- SUPPORTING
- SUBSTANTIAL
- PRIMARY

Strength must be justified by review policy. A high strength does not imply full curriculum coverage unless an approved coverage policy explicitly says so.

## 9. Lifecycle

```text
DRAFT
SUBMITTED
UNDER_REVIEW
APPROVED
ACTIVE
STALE
SUPERSEDED
WITHDRAWN
REJECTED
```

Rules:

- DRAFT alignments are not available to production consumers.
- APPROVED records become ACTIVE only within their effective window.
- A source or curriculum version change may mark an alignment STALE.
- SUPERSEDED records remain auditable.
- WITHDRAWN records must not be used for new decisions.
- REJECTED records remain available to authorized reviewers for traceability.

## 10. Version Binding

An alignment is valid only for the versions it names.

A source content update does not inherit prior alignment automatically.

A curriculum supersession does not transfer alignment automatically.

Revalidation outcomes:

- CONFIRMED_UNCHANGED
- CONFIRMED_WITH_LIMITATIONS
- REQUIRES_REVISION
- REJECTED_FOR_NEW_VERSION
- NOT_REVIEWED

No runtime may silently carry alignment across versions based only on stable IDs.

## 11. Cross-Curriculum Mapping

Cross-curriculum mapping is a special alignment between nodes from different curriculum versions or jurisdictions.

Mapping types:

- EQUIVALENT_DECLARED
- APPROXIMATELY_EQUIVALENT
- SOURCE_BROADER
- SOURCE_NARROWER
- PARTIAL_OVERLAP
- NO_VALID_MAPPING

Required evidence:

- both qualified node references;
- mapper identity;
- review authority;
- rationale;
- limitations;
- effective dates;
- mapping policy version.

```text
Approximate mapping ≠ Interchangeability
```

## 12. Artifact Alignment Contracts

### 12.1 Lesson Alignment

A lesson may introduce, teach, practice, or reinforce curriculum objectives.

Required considerations:

- intended learner context;
- instructional depth;
- prerequisite assumptions;
- supported versus independent activity;
- lesson version.

### 12.2 Assessment Alignment

An assessment item or rubric criterion may assess a curriculum objective.

Assessment Engine remains responsible for:

- evidence admissibility;
- validity;
- scoring;
- claim strength;
- mastery interpretation.

Curriculum alignment alone cannot establish assessment validity.

### 12.3 Mission Alignment

A mission objective may support one or more curriculum objectives.

Mission completion does not establish curriculum mastery or complete coverage.

### 12.4 Gameplay Alignment

Gameplay objectives may contextualize, practice, or produce evidence candidates related to curriculum nodes.

Gameplay engagement is not learning proof.

### 12.5 Progress Alignment

Progress dimensions may be reported against curriculum scope.

Curriculum coverage and mastery must remain separate dimensions.

## 13. Alignment Resolution

Consumers request alignment by:

- source entity and version;
- curriculum version;
- relationship types;
- approval state;
- effective date;
- audience scope.

Resolution returns:

- active alignment records;
- exact relationship semantics;
- source and target versions;
- freshness status;
- review provenance;
- limitations;
- supersession lineage.

No result must be represented as “not aligned” unless the search scope was complete and authoritative.

## 14. Staleness Detection

An alignment becomes potentially stale when:

- source content hash changes;
- source semantic version changes;
- curriculum node content hash changes;
- curriculum version is superseded;
- alignment policy changes materially;
- reviewer authority is revoked;
- effective date expires;
- referenced sub-resource is deleted or moved.

Staleness states:

- CURRENT
- REVIEW_RECOMMENDED
- REVIEW_REQUIRED
- INVALID_REFERENCE
- EXPIRED

Stale alignment may remain visible for audit but must not silently drive current production decisions.

## 15. Approval Policy

Approval may require different reviewer classes depending on relationship type.

Examples:

- teacher review for local lesson support;
- subject expert review for primary teaching alignment;
- assessment specialist review for `ASSESSES`;
- curriculum authority review for official cross-curriculum equivalence.

Approval evidence includes:

- reviewer identity;
- role and authority scope;
- review timestamp;
- policy version;
- rationale;
- decision;
- digital content hash.

## 16. Failure Model

Representative failure codes:

- ALIGNMENT_NOT_FOUND
- ALIGNMENT_REFERENCE_INVALID
- SOURCE_VERSION_REQUIRED
- TARGET_VERSION_REQUIRED
- SOURCE_VERSION_MISMATCH
- CURRICULUM_VERSION_MISMATCH
- RELATIONSHIP_TYPE_INVALID
- ALIGNMENT_SCOPE_INVALID
- ALIGNMENT_REVIEW_REQUIRED
- REVIEWER_NOT_AUTHORIZED
- ALIGNMENT_STALE
- ALIGNMENT_WITHDRAWN
- ALIGNMENT_SUPERSEDED
- CROSS_CURRICULUM_MAPPING_AMBIGUOUS
- ALIGNMENT_MEANING_ESCALATION
- PARTIAL_SCOPE_MISREPRESENTED

## 17. Persistence Model

Alignment history is append-only.

Durable record families:

- CurriculumAlignmentRecord
- AlignmentReviewRecord
- AlignmentDecisionRecord
- AlignmentSupersessionRecord
- AlignmentWithdrawalRecord
- AlignmentStalenessRecord
- AlignmentRevalidationRecord
- AlignmentOutboxRecord

Corrections create new records and preserve prior state.

No last-write-wins resolution is allowed for conflicting approved alignments.

## 18. Projection Model

Audience projections may simplify detail but must preserve:

- relationship type;
- version scope;
- approval status;
- freshness;
- limitations;
- official-versus-local provenance.

Projection must never transform:

- PRACTICES into TEACHES;
- TEACHES into ASSESSES;
- ASSESSES into MASTERED;
- PARTIAL into FULL;
- APPROXIMATE into EQUIVALENT.

## 19. Observability

Minimum telemetry:

- alignment creation and review decisions;
- active alignments by relationship type;
- stale alignment count;
- source or target version mismatch;
- cross-curriculum mapping usage;
- withdrawn alignment access;
- approval-policy failures;
- alignment resolution latency;
- projection freshness;
- conflicting alignment detections.

## 20. Verification Gates

Minimum automated gates:

1. source and target version-binding tests;
2. relationship-semantic tests;
3. partial-scope integrity tests;
4. reviewer-authorization tests;
5. lifecycle-transition tests;
6. staleness-detection tests;
7. supersession-lineage tests;
8. cross-curriculum mapping tests;
9. projection non-escalation tests;
10. append-only persistence tests;
11. withdrawn-alignment exclusion tests;
12. deterministic resolution tests.

## 21. Completion Criteria

31C is complete when the repository defines:

- explicit, version-bound alignment records;
- governed relationship semantics;
- scope and strength distinctions;
- review and approval authority;
- cross-curriculum mapping rules;
- staleness and revalidation behavior;
- append-only history;
- projection non-escalation;
- alignment verification gates.

## 22. Final Principle

> Curriculum Alignment Runtime may declare and govern relationships between approved curriculum truth and versioned learning artifacts. It must never turn alignment metadata into stronger claims about instruction, assessment validity, coverage, or learner mastery.