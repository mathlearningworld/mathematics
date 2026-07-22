# 31D — Curriculum Versioning Runtime

## Status

Architecture definition for Chapter 31, Slice D.

## Purpose

The Curriculum Versioning Runtime defines how curriculum authorities create, review, activate, supersede, retire, and correct curriculum versions without weakening provenance, identity, or historical truth.

It exists to guarantee that every curriculum reference used by Learning, Assessment, Mission, Gameplay, and Progress resolves to an explicit and durable version.

## Core Principle

A curriculum is a long-lived identity.

A curriculum version is an immutable, time-bounded expression of that identity.

Published meaning must never be rewritten in place.

## Runtime Ownership

The Curriculum Versioning Runtime owns:

- curriculum-version identity
- version lifecycle state
- effective-date windows
- supersession chains
- correction records
- compatibility declarations
- version comparison metadata
- version-resolution decisions
- version provenance
- version activation and retirement eligibility

It does not own:

- learner mastery
- pedagogical prerequisite truth
- lesson content
- assessment validity
- institution-specific delivery plans
- cross-curriculum equivalence

## Core Entities

### CurriculumIdentity

Stable identity of a curriculum across all versions.

Required fields:

- curriculumId
- jurisdictionId
- authorityId
- subjectId
- stableCode
- canonicalName
- provenanceClass
- createdAt

### CurriculumVersion

Immutable curriculum publication candidate or published version.

Required fields:

- curriculumVersionId
- curriculumId
- versionLabel
- semanticVersion
- editionCode
- lifecycleState
- effectiveFrom
- effectiveTo
- publicationAuthorityId
- sourceArtifactRef
- contentDigest
- createdAt
- approvedAt
- activatedAt
- supersedesVersionId
- correctionOfVersionId

### VersionChangeSet

Structured declaration of differences from a prior version.

Change categories:

- METADATA_ONLY
- STRUCTURE_ADDED
- STRUCTURE_REMOVED
- STRUCTURE_REORDERED
- OBJECTIVE_ADDED
- OBJECTIVE_REMOVED
- OBJECTIVE_REWORDED
- CODE_CHANGED
- GRADE_PLACEMENT_CHANGED
- EFFECTIVE_WINDOW_CHANGED
- PROVENANCE_CORRECTED
- ERRATUM_APPLIED

### VersionCompatibilityDeclaration

Explicit compatibility statement between two versions.

Compatibility classes:

- FULLY_COMPATIBLE
- BACKWARD_COMPATIBLE
- FORWARD_COMPATIBLE
- PARTIALLY_COMPATIBLE
- INCOMPATIBLE
- UNKNOWN

Compatibility declarations must state scope and evidence. They must never be inferred from matching labels alone.

## Lifecycle

```text
DRAFT
UNDER_REVIEW
APPROVED
SCHEDULED
ACTIVE
SUPERSEDED
RETIRED
REVOKED
```

### DRAFT

Editable working version. Not available for authoritative resolution.

### UNDER_REVIEW

Content frozen for review. Only review findings and review-state metadata may change.

### APPROVED

Approved by the declared authority but not yet active.

### SCHEDULED

Approved with a future effective date.

### ACTIVE

Authoritative for its declared effective window.

### SUPERSEDED

Replaced by a later active version. Remains valid for historical interpretation.

### RETIRED

No longer valid for new assignments but still available for historical records and replay.

### REVOKED

Withdrawn because it must not be used for authoritative interpretation. Historical references remain visible with revocation status.

## Transition Rules

Allowed transitions:

```text
DRAFT -> UNDER_REVIEW
UNDER_REVIEW -> DRAFT
UNDER_REVIEW -> APPROVED
APPROVED -> SCHEDULED
APPROVED -> ACTIVE
SCHEDULED -> ACTIVE
ACTIVE -> SUPERSEDED
ACTIVE -> RETIRED
ACTIVE -> REVOKED
SUPERSEDED -> RETIRED
SUPERSEDED -> REVOKED
RETIRED -> REVOKED
```

Forbidden transitions include:

- ACTIVE -> DRAFT
- SUPERSEDED -> ACTIVE without a new version
- RETIRED -> ACTIVE without a new version
- REVOKED -> ACTIVE
- direct mutation of approved or published content

## Immutability Boundary

After APPROVED, the following become immutable:

- curriculum node identity set
- hierarchy
- objective text and codes
- grade placement
- source artifact reference
- content digest
- declared provenance
- compatibility basis

Corrections after approval require either:

1. a new CurriculumVersion, or
2. an explicit CorrectionRecord when the change is non-semantic and policy permits it.

## Correction Records

A CorrectionRecord may address:

- typographical errors
- broken source links
- metadata formatting
- non-semantic localization defects
- clerical date mistakes before activation

A correction may not silently alter:

- learning objective meaning
- grade placement
- curriculum hierarchy
- assessment expectations
- official codes
- coverage boundaries

Semantic change always requires a new version.

## Effective-Date Rules

Each active or scheduled version must declare an effective window.

Rules:

- effectiveFrom is inclusive
- effectiveTo is exclusive when present
- overlapping active windows for the same curriculum identity are forbidden unless an explicit parallel-edition policy applies
- scheduled activation must not invalidate historical references
- supersession does not erase the prior effective window

## Version Resolution Contract

Input:

```text
curriculumId
requestedVersionId?
asOfDate?
institutionContext?
resolutionPolicyVersion
```

Output:

```text
resolvedCurriculumVersionId
resolutionReason
lifecycleState
effectiveWindow
provenance
warnings[]
```

Resolution precedence:

1. explicit requestedVersionId
2. institution-bound version when policy permits
3. version active at asOfDate
4. current active version
5. no resolution

The runtime must never silently substitute another version when an explicit version was requested and unavailable.

## Supersession Chain

Every superseding version must reference the version it supersedes.

The chain must be:

- acyclic
- ordered
- queryable
- historically complete
- independently verifiable

A version may not supersede itself or create a loop.

## Version Comparison

The runtime must support deterministic comparison between two curriculum versions.

Comparison output includes:

- nodes added
- nodes removed
- nodes moved
- codes changed
- wording changed
- grade placement changed
- objective meaning-review required
- alignment revalidation required
- dependent projection invalidation required

Text difference alone must not be treated as semantic difference. Semantic classification requires declared review evidence.

## Cross-Engine Boundaries

### Learning Engine

May consume a resolved curriculum version and its objectives.

May not treat curriculum order as pedagogical prerequisite order.

### Assessment Engine

May bind assessment claims to exact curriculum version identifiers.

A version change requires assessment-alignment revalidation.

### Mission Engine

May target curriculum nodes from one explicit version.

Mission targets must not float automatically to a newer version.

### Gameplay Runtime

May contextualize curriculum objectives but cannot reinterpret curriculum authority.

### Progress Engine

Must preserve the curriculum version under which progress evidence was interpreted.

Historical progress must not be rewritten merely because a new curriculum version becomes active.

## Failure Codes

```text
CURRICULUM_VERSION_NOT_FOUND
CURRICULUM_VERSION_NOT_RESOLVABLE
INVALID_VERSION_TRANSITION
PUBLISHED_VERSION_MUTATION_FORBIDDEN
EFFECTIVE_WINDOW_OVERLAP
SUPERSESSION_CYCLE_DETECTED
EXPLICIT_VERSION_UNAVAILABLE
CORRECTION_REQUIRES_NEW_VERSION
CONTENT_DIGEST_MISMATCH
PROVENANCE_MISSING
COMPATIBILITY_UNSUPPORTED
```

## Verification Rules

A curriculum version is publishable only when:

- identity is stable
- source provenance is present
- content digest is reproducible
- hierarchy is valid
- node identifiers are unique
- effective window is valid
- supersession chain is acyclic
- required approvals exist
- change set is complete
- compatibility claims have evidence
- downstream revalidation obligations are declared

## Audit Requirements

Every state transition records:

- actorId
- authorityContext
- priorState
- nextState
- reason
- policyVersion
- occurredAt
- correlationId

All version resolution decisions must be reproducible from stored input and policy version.

## Invariants

1. Published curriculum meaning is immutable.
2. Historical references always retain their original curriculumVersionId.
3. Supersession never deletes prior versions.
4. Revocation never erases history.
5. Effective windows must not overlap without explicit policy.
6. Explicit version requests never silently float.
7. Compatibility is declared and evidenced, never guessed.
8. Curriculum version change does not automatically update lessons, assessments, missions, or progress interpretations.
9. Correction records cannot carry semantic change.
10. Every authoritative resolution is version-bound and policy-bound.

## Completion Rule

31D is complete when curriculum versions can be created, reviewed, approved, activated, superseded, corrected, retired, revoked, resolved, compared, and audited without mutating published historical truth.
