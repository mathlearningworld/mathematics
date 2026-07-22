# Chapter 31A — Curriculum Runtime Foundation

## 1. Purpose

Curriculum Runtime is the authoritative runtime for organizing formal learning expectations without turning curriculum structure into learner truth.

It owns the versioned structure that answers:

- Which jurisdiction or standards body published a curriculum?
- Which curriculum version is active for a given context?
- Which subjects, grade bands, strands, standards, indicators, and learning objectives belong to that version?
- How are curriculum entities related, ordered, localized, superseded, and retired?
- Which curriculum references may other engines safely consume?

Curriculum Runtime does not determine whether a learner understands an objective. It defines what the objective is and how it belongs to an approved curriculum structure.

## 2. Architectural Position

```text
Jurisdiction / Standards Authority
                │
                ▼
       Curriculum Runtime
                │
      ┌─────────┼─────────┐
      ▼         ▼         ▼
 Learning   Assessment   Mission
 Engine      Engine       Engine
      │         │           │
      └─────────┼───────────┘
                ▼
          Progress Engine
```

Curriculum Runtime is upstream structural authority. Downstream engines may reference curriculum entities, but they may not silently redefine them.

## 3. Source-of-Truth Boundary

Curriculum Runtime is authoritative for:

- curriculum identity;
- jurisdiction identity;
- publishing authority;
- curriculum version lifecycle;
- subject and learning-area structure;
- grade and grade-band structure;
- strand, domain, standard, indicator, and learning-objective structure;
- curriculum ordering and containment;
- effective dates and supersession lineage;
- localization and official labels;
- curriculum reference resolution;
- publication state and audience visibility.

Curriculum Runtime is not authoritative for:

- learner mastery;
- assessment validity;
- pedagogical sequencing;
- skill prerequisites;
- lesson content;
- exercise difficulty;
- recommendations;
- mission completion;
- gameplay completion;
- progress interpretation.

## 4. Core Runtime Laws

```text
Curriculum membership ≠ Learner mastery
Grade placement ≠ Learner capability
Curriculum order ≠ Pedagogical dependency
Coverage ≠ Understanding
Published objective ≠ Taught objective
Taught objective ≠ Assessed objective
Assessed objective ≠ Mastered objective
Localized label ≠ New curriculum entity
Curriculum version ≠ Mutable document
```

## 5. Core Entity Model

### 5.1 Jurisdiction

Represents the geographic or institutional scope in which a curriculum is recognized.

Required identity:

- `jurisdictionId`
- `jurisdictionType`
- `canonicalCode`
- `officialName`
- `status`

Examples of jurisdiction types:

- COUNTRY
- PROVINCE
- STATE
- SCHOOL_NETWORK
- EXAMINATION_AUTHORITY
- INTERNATIONAL_STANDARD_BODY

### 5.2 Curriculum Authority

Represents the organization that publishes or governs a curriculum.

Required fields:

- `authorityId`
- `jurisdictionId`
- `authorityType`
- `officialName`
- `verificationStatus`

A curriculum may not be treated as official unless its authority provenance is verified.

### 5.3 Curriculum

Stable identity across versions.

Required fields:

- `curriculumId`
- `jurisdictionId`
- `authorityId`
- `canonicalName`
- `subjectScope`
- `educationStageScope`

### 5.4 Curriculum Version

Immutable published interpretation of a curriculum at a point in time.

Required fields:

- `curriculumVersionId`
- `curriculumId`
- `versionLabel`
- `versionSequence`
- `effectiveFrom`
- `effectiveTo`
- `publicationState`
- `sourceReference`
- `contentHash`
- `supersedesVersionId`

Once published, curriculum-version content is immutable. Corrections create a new version or an explicit correction record.

### 5.5 Subject

Represents an official subject or learning area in a curriculum version.

Required fields:

- `subjectId`
- `curriculumVersionId`
- `canonicalCode`
- `canonicalName`
- `ordinal`

### 5.6 Grade and Grade Band

Grade is an official placement label. Grade band groups multiple grades where the curriculum defines shared expectations.

Required fields:

- `gradeId`
- `curriculumVersionId`
- `canonicalCode`
- `ordinal`
- `ageGuidance` when officially available

Grade must never be used as a proxy for learner ability.

### 5.7 Curriculum Node

A generic hierarchical node for official curriculum structure.

Supported node types:

- LEARNING_AREA
- DOMAIN
- STRAND
- STANDARD
- BENCHMARK
- INDICATOR
- LEARNING_OBJECTIVE
- COMPETENCY
- OUTCOME

Required fields:

- `curriculumNodeId`
- `curriculumVersionId`
- `subjectId`
- `nodeType`
- `canonicalCode`
- `canonicalTitle`
- `officialDescription`
- `parentNodeId`
- `ordinal`
- `gradeScope`
- `status`

Node type semantics are explicit per curriculum version. Two jurisdictions using the same label do not automatically share meaning.

## 6. Identity Rules

Curriculum identities are stable, opaque, and never derived solely from display text.

A valid curriculum reference includes:

```text
jurisdictionId
curriculumId
curriculumVersionId
curriculumNodeId
```

Display labels may change through localization or correction without changing node identity.

Cross-version identity requires explicit lineage:

- `equivalentTo`
- `replaces`
- `splitFrom`
- `mergedFrom`
- `retiredWithoutReplacement`

No runtime may infer cross-version equivalence from matching titles alone.

## 7. Version Lifecycle

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

Lifecycle rules:

- DRAFT content is not consumable by production engines.
- APPROVED content is valid but not yet necessarily effective.
- ACTIVE content may be selected for new learner contexts.
- SUPERSEDED content remains resolvable for historical records.
- RETIRED content remains auditable but is not selectable for new contexts.
- REVOKED content is blocked from use except controlled audit and incident analysis.

## 8. Publication Boundary

Publication requires:

- verified authority provenance;
- unique canonical codes within required scope;
- valid parent-child structure;
- acyclic containment graph;
- valid grade and subject references;
- complete effective-date rules;
- deterministic ordering;
- content hash;
- localization fallback;
- supersession integrity;
- review and approval evidence.

Publication is atomic. Partial curriculum-version publication is forbidden.

## 9. Localization

Localization is a projection over canonical curriculum truth.

Required localization identity:

- `curriculumEntityId`
- `locale`
- `translationVersion`
- `translationStatus`
- `sourceLanguage`

Translation statuses:

- OFFICIAL
- VERIFIED
- COMMUNITY_REVIEWED
- MACHINE_ASSISTED
- UNVERIFIED

A translation must not strengthen, weaken, or reinterpret the official curriculum meaning.

## 10. Cross-Engine Contracts

### Learning Engine

May reference curriculum objectives when defining instructional alignment.

It must not claim that curriculum order is the best teaching order.

### Assessment Engine

May reference curriculum objectives as assessment targets.

It remains responsible for assessment claims and evidence validity.

### Recommendation Engine

May use curriculum scope as a constraint.

It must not recommend solely because an objective is next in official document order.

### Mission Engine

May define curriculum-aligned mission targets.

Mission completion must not mutate curriculum truth.

### Gameplay Runtime

May display or contextualize curriculum-aligned activity.

Gameplay activity does not establish curriculum completion.

### Progress Engine

May aggregate curriculum coverage and alignment.

Coverage is not mastery and must remain dimensionally separate.

## 11. Failure Model

Representative failure codes:

- CURRICULUM_NOT_FOUND
- CURRICULUM_VERSION_NOT_FOUND
- VERSION_NOT_PUBLISHED
- VERSION_NOT_EFFECTIVE
- VERSION_REVOKED
- AUTHORITY_NOT_VERIFIED
- INVALID_JURISDICTION_SCOPE
- DUPLICATE_CANONICAL_CODE
- INVALID_PARENT_REFERENCE
- CURRICULUM_CYCLE_DETECTED
- INVALID_GRADE_SCOPE
- INVALID_SUBJECT_SCOPE
- SUPERSESSION_LINEAGE_INVALID
- LOCALIZATION_NOT_AVAILABLE
- CURRICULUM_REFERENCE_AMBIGUOUS
- CROSS_VERSION_REFERENCE_FORBIDDEN

Failures must be explicit. Silent fallback to a different curriculum version is forbidden.

## 12. Security and Tenancy

Official public curriculum records may be globally readable, but authoring, approval, and publication remain authority-scoped.

Tenant-authored curriculum overlays must remain distinguishable from official curriculum truth.

Required provenance categories:

- OFFICIAL
- INSTITUTIONAL_OVERLAY
- TEACHER_OVERLAY
- COMMUNITY_DRAFT

An overlay may reference official nodes but may not impersonate the official authority.

## 13. Observability

Minimum telemetry:

- curriculum version selected;
- reference-resolution outcome;
- publication lifecycle transition;
- failed validation category;
- localization fallback;
- superseded-version access;
- revoked-version access attempt;
- cross-version mapping usage;
- cache freshness;
- projection version.

Logs must avoid learner-sensitive data unless operationally necessary.

## 14. Foundation Verification Gates

Minimum automated gates:

1. stable identity verification;
2. authority-provenance verification;
3. lifecycle-transition verification;
4. hierarchy acyclicity verification;
5. canonical-code uniqueness verification;
6. grade and subject scope verification;
7. immutable published-version verification;
8. supersession-lineage verification;
9. localization fidelity verification;
10. cross-engine boundary verification.

## 15. Completion Criteria

31A is complete when the repository defines:

- clear Curriculum Runtime ownership;
- immutable curriculum-version semantics;
- stable entity identities;
- official-versus-overlay provenance;
- publication lifecycle;
- cross-engine boundaries;
- explicit failure behavior;
- foundational verification gates.

## 16. Final Principle

> Curriculum Runtime defines the approved structure of expected learning. It must never convert formal placement, document order, or curriculum coverage into learner understanding.