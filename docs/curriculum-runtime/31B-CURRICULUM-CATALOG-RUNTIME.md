# Chapter 31B — Curriculum Catalog Runtime

## 1. Purpose

Curriculum Catalog Runtime provides deterministic discovery and resolution of curriculum entities across jurisdictions, authorities, subjects, grades, versions, and locales.

It answers:

- Which curricula are available for a learner, school, teacher, or institution?
- Which version is valid for a requested date and context?
- Which official subject, grade, strand, standard, indicator, or objective does a reference identify?
- Which curriculum records are current, superseded, retired, or unavailable?
- Which language and localization should be presented without changing canonical meaning?

The catalog is a read-oriented runtime over published curriculum truth. It does not author curriculum and does not infer learner progress.

## 2. Runtime Position

```text
Published Curriculum Versions
            │
            ▼
   Curriculum Catalog Runtime
            │
   ┌────────┼────────┐
   ▼        ▼        ▼
Search   Resolve   Browse
   │        │        │
   └────────┼────────┘
            ▼
      Downstream Engines
```

The catalog may optimize access, but the underlying published curriculum version remains authoritative.

## 3. Catalog Responsibilities

The catalog owns:

- discoverable curriculum listings;
- jurisdiction and authority filters;
- effective-version resolution;
- curriculum hierarchy browsing;
- canonical-code lookup;
- stable reference resolution;
- localization selection and fallback;
- publication-state filtering;
- supersession navigation;
- overlay visibility rules;
- cache freshness and rebuild status;
- deterministic query contracts.

The catalog does not own:

- curriculum authoring;
- curriculum approval;
- learner placement;
- mastery decisions;
- skill prerequisites;
- assessment alignment quality;
- recommendation ranking;
- curriculum coverage calculations.

## 4. Catalog Views

### 4.1 Jurisdiction Catalog

Returns jurisdictions visible to the requester.

Minimum fields:

- `jurisdictionId`
- `canonicalCode`
- `officialName`
- `jurisdictionType`
- `availableCurriculumCount`
- `status`

### 4.2 Curriculum Catalog

Returns curriculum identities and available versions.

Minimum fields:

- `curriculumId`
- `jurisdictionId`
- `authorityId`
- `canonicalName`
- `subjectScope`
- `educationStageScope`
- `latestActiveVersionId`
- `availableVersions`
- `provenanceCategory`

### 4.3 Curriculum Version Catalog

Returns one immutable version summary.

Minimum fields:

- `curriculumVersionId`
- `versionLabel`
- `publicationState`
- `effectiveFrom`
- `effectiveTo`
- `contentHash`
- `supersedesVersionId`
- `subjectCount`
- `gradeCount`
- `nodeCount`

### 4.4 Curriculum Tree View

Returns hierarchical nodes for browsing.

Every node includes:

- stable identity;
- canonical code;
- node type;
- canonical and localized labels;
- parent identity;
- ordinal;
- grade scope;
- subject scope;
- publication visibility;
- child-presence indicator.

### 4.5 Curriculum Node Detail

Returns full official meaning and relationships for one node.

It may include:

- official description;
- examples when officially published;
- notes from the publishing authority;
- parent and child references;
- grade and subject scope;
- supersession lineage;
- localization provenance;
- downstream alignment counts as non-authoritative metadata.

## 5. Resolution Contracts

### 5.1 Resolve Curriculum Version

Input:

```text
jurisdictionId
curriculumId
effectiveAt
optional requestedVersionId
optional institutionContext
```

Resolution rules:

1. An explicit valid version wins over automatic selection.
2. The explicit version must belong to the requested curriculum.
3. Without an explicit version, choose the version effective at `effectiveAt`.
4. If multiple versions overlap, return an ambiguity failure.
5. Never silently substitute a superseded or retired version.
6. A revoked version is never selected for new activity.

Output:

- resolved curriculum version;
- resolution reason;
- effective-date evidence;
- provenance category;
- warnings and limitations.

### 5.2 Resolve Curriculum Node

Input may use:

- stable node ID;
- canonical code plus version identity;
- qualified external code plus authority identity.

A canonical code without curriculum-version scope is insufficient unless the code is globally qualified and verified.

### 5.3 Resolve Localization

Resolution order:

1. requested official translation;
2. requested verified translation;
3. curriculum default locale;
4. source language;
5. unavailable marker.

Machine-assisted or unverified text must be labeled explicitly.

## 6. Search Runtime

Search is for discovery, not authority resolution.

Supported search dimensions:

- jurisdiction;
- authority;
- curriculum;
- subject;
- grade;
- node type;
- canonical code;
- official title;
- localized title;
- description;
- publication state;
- effective date;
- provenance category.

Search results must return enough identity to perform authoritative resolution.

```text
Search match ≠ Resolved identity
Text similarity ≠ Curriculum equivalence
```

## 7. Query Contracts

Representative operations:

- `listJurisdictions`
- `listCurricula`
- `listCurriculumVersions`
- `resolveCurriculumVersion`
- `browseCurriculumTree`
- `getCurriculumNode`
- `searchCurriculumNodes`
- `resolveCurriculumReference`
- `listSupersessionLineage`
- `listAvailableLocales`

All list operations require:

- deterministic sorting;
- stable cursor pagination;
- explicit visibility scope;
- publication-state filtering;
- version-aware cache keys.

## 8. Deterministic Ordering

Default ordering is never based on database insertion order.

Ordering precedence:

1. authority-defined ordinal;
2. canonical code;
3. stable identity as final tie-breaker.

Localized text is not used as the only ordering authority because locale changes could alter result order unpredictably.

## 9. Pagination

Cursor identity includes:

- query contract version;
- filter hash;
- curriculum version;
- ordering key;
- last returned stable identity;
- projection generation.

A cursor from one curriculum version must not be reused against another.

## 10. Cache Model

Cache keys include:

- tenant or public scope;
- jurisdiction;
- curriculum version;
- locale;
- visibility policy version;
- query contract version;
- projection generation.

Cache states:

- CURRENT
- AGING
- STALE
- REBUILDING
- INVALIDATED
- FAILED

A stale catalog may be shown only with explicit freshness metadata when policy permits. Revocation invalidates affected cache entries immediately.

## 11. Official and Overlay Catalogs

Official and overlay curricula remain distinguishable.

Catalog result fields include:

- `provenanceCategory`
- `publisherIdentity`
- `officialReferenceId` when applicable
- `overlayScope`
- `verificationStatus`

An institutional overlay may extend local organization, but it may not replace the official node's identity or wording without being presented as an overlay.

## 12. Audience Visibility

Potential audiences:

- public learner;
- parent;
- teacher;
- institution administrator;
- curriculum author;
- reviewer;
- auditor;
- internal operations.

Draft and under-review versions are visible only to authorized authoring roles.

Revoked versions are hidden from ordinary discovery but remain accessible to authorized audit workflows.

## 13. Failure Model

Representative failure codes:

- CATALOG_QUERY_INVALID
- CURRICULUM_NOT_DISCOVERABLE
- CURRICULUM_VERSION_AMBIGUOUS
- CURRICULUM_VERSION_NOT_EFFECTIVE
- CURRICULUM_VERSION_REVOKED
- CURRICULUM_REFERENCE_NOT_FOUND
- CURRICULUM_REFERENCE_AMBIGUOUS
- CANONICAL_CODE_SCOPE_REQUIRED
- LOCALIZATION_UNAVAILABLE
- CURSOR_INVALID
- CURSOR_SCOPE_MISMATCH
- CURSOR_VERSION_MISMATCH
- CATALOG_REBUILDING
- CATALOG_STALE_NOT_ALLOWED
- OVERLAY_NOT_VISIBLE

No-result, unavailable, forbidden, and ambiguous are different outcomes and must not be collapsed into one response.

## 14. Observability

Minimum telemetry:

- catalog query type;
- selected curriculum version;
- resolution reason;
- ambiguity count;
- localization fallback path;
- cache state;
- result count;
- cursor validation outcome;
- official-versus-overlay result count;
- revoked or retired reference access;
- query latency;
- projection generation.

## 15. Verification Gates

Minimum automated gates:

1. effective-version resolution tests;
2. overlapping-version ambiguity tests;
3. revoked-version exclusion tests;
4. canonical-code scope tests;
5. deterministic ordering tests;
6. stable pagination tests;
7. cursor scope-isolation tests;
8. localization fallback tests;
9. overlay provenance tests;
10. cache invalidation tests;
11. visibility-policy tests;
12. hierarchy browse consistency tests.

## 16. Completion Criteria

31B is complete when the repository defines:

- deterministic curriculum discovery;
- authoritative version and node resolution;
- version-aware search and browsing;
- stable ordering and pagination;
- localization fallback;
- official-versus-overlay visibility;
- explicit freshness and failure behavior;
- catalog verification gates.

## 17. Final Principle

> The catalog helps consumers find curriculum truth. Discovery convenience must never replace qualified, version-aware reference resolution.