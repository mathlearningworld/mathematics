# 31F — Curriculum Projection Runtime

## Status

Architecture definition for Chapter 31, Slice F.

## Purpose

The Curriculum Projection Runtime defines how authoritative curriculum truth is transformed into audience-specific read models without strengthening, weakening, or silently rewriting curriculum meaning.

It serves catalog browsing, curriculum-node detail, grade views, subject maps, institution overlays, localization, alignment summaries, and downstream runtime consumption.

## Core Principle

Projection is interpretation for reading.

Projection is not authority.

A projection may reorganize and summarize curriculum truth, but it must never manufacture stronger meaning than the source version and policy permit.

## Runtime Ownership

The Curriculum Projection Runtime owns:

- curriculum read models
- audience-specific views
- hierarchy materialization
- localized labels and descriptions
- catalog summaries
- effective-version visibility
- overlay composition views
- alignment summary projections
- freshness metadata
- projection rebuild and invalidation
- projection query contracts

It does not own:

- curriculum version lifecycle
- publication decisions
- curriculum content mutation
- pedagogical prerequisite truth
- mastery, recommendation, or mission decisions

## Projection Families

### CurriculumCatalogProjection

Used for browsing available curricula.

Fields include:

- curriculumId
- currentResolvableVersionId
- canonicalName
- localizedName
- jurisdiction
- authority
- subject
- lifecycleSummary
- effectiveWindow
- discoverable
- selectable
- authoritative
- warnings
- projectionFreshness

### CurriculumTreeProjection

Materialized hierarchy for one exact curriculum version.

Supports:

- root nodes
- child ordering
- depth
- path
- node type
- stable code
- localized title
- official text reference
- grade placement
- parent identity
- lifecycle visibility

### CurriculumNodeDetailProjection

Audience-specific detail for a curriculum node.

May include:

- canonical identity
- official wording
- localized rendering
- structural path
- effective version
- provenance
- source artifact reference
- alignment summary
- supersession status
- historical warnings

### GradeSubjectMapProjection

Groups curriculum nodes by declared grade and subject.

This view must state clearly:

```text
Declared grade placement ≠ learner capability
Declared order ≠ prerequisite order
```

### AlignmentSummaryProjection

Summarizes reviewed relationships to lessons, assessments, missions, gameplay contexts, or other curricula.

A summary may show counts and relationship classes, but must not imply validity beyond the underlying alignment decisions.

### VersionComparisonProjection

Presents structured differences between curriculum versions.

It must distinguish:

- textual difference
- structural difference
- declared semantic change
- unresolved semantic review
- downstream revalidation requirement

### InstitutionOverlayProjection

Combines official curriculum with institution-specific overlays for viewing.

The official layer and overlay layer must remain distinguishable at every node.

## Projection Identity

Every projection record must include enough identity to prevent version ambiguity.

Minimum identity:

- projectionType
- projectionId
- curriculumId
- curriculumVersionId
- sourceVersion
- policyVersion
- locale
- audienceClass
- generatedAt

Overlay projections also include:

- institutionId
- overlayVersionId
- compositionPolicyVersion

## Audience Classes

Supported classes may include:

- PUBLIC
- LEARNER
- PARENT
- TEACHER
- INSTITUTION_ADMIN
- CURRICULUM_REVIEWER
- SYSTEM_INTEGRATION
- AUDITOR

Audience affects presentation and visible metadata, not curriculum meaning.

## Projection Semantics

### Safe Transformation

Allowed transformations include:

- sorting
- grouping
- localization
- path materialization
- summary counts
- visibility filtering
- audience-safe metadata reduction
- precomputed search tokens
- explicit overlay composition

### Forbidden Strengthening

A projection must not transform:

- alignment into equivalence
- coverage into mastery
- grade placement into capability
- curriculum ordering into dependency
- publication visibility into authority
- approximate mapping into interchangeability
- text similarity into semantic identity

## Localization

Localization is a rendering layer.

Rules:

- canonical official wording remains traceable
- translated text identifies locale and translation provenance
- fallback locale is explicit
- machine-generated translation is labeled
- localization does not modify curriculum-node identity
- translation disagreement does not silently replace official wording

Localization states:

- OFFICIAL
- AUTHORITY_APPROVED
- REVIEWED_TRANSLATION
- MACHINE_TRANSLATED
- FALLBACK
- UNAVAILABLE

## Overlay Composition

Projection may compose:

1. official curriculum layer
2. institution overlay
3. teacher overlay
4. local presentation metadata

Composition rules:

- official nodes cannot be hidden in audit views
- overlay nodes cannot impersonate official nodes
- overlay changes cannot mutate official hierarchy
- every displayed node retains layer provenance
- conflicts are surfaced, not silently resolved

## Freshness Model

Projection freshness states:

```text
CURRENT
STALE_NON_BLOCKING
STALE_BLOCKING
REBUILDING
FAILED
UNKNOWN
```

Freshness is evaluated against:

- curriculum version revision
- publication revision
- alignment revision
- localization revision
- overlay revision
- projection policy version

A stale projection may remain readable when policy allows, but authoritative selection may be blocked.

## Projection Build Pipeline

```text
Authoritative curriculum/version state
  -> admission validation
  -> source snapshot binding
  -> policy resolution
  -> hierarchy materialization
  -> localization resolution
  -> overlay composition
  -> alignment summary join
  -> audience filtering
  -> digest generation
  -> projection publication
```

Every build must bind to one source-state watermark.

## Incremental Projection

Incremental updates are allowed only when they preserve deterministic equivalence with full rebuild.

Triggers include:

- curriculum version publication
- version activation
- withdrawal or revocation
- localization update
- approved alignment change
- overlay update
- policy activation

When equivalence cannot be proven, perform a full rebuild.

## Query Contract

Input:

```text
projectionType
curriculumId?
curriculumVersionId?
nodeId?
asOfDate?
locale
audienceContext
institutionContext?
includeHistorical?
consistencyRequirement
```

Output includes:

```text
data
resolvedCurriculumVersionId
projectionVersion
sourceWatermark
freshnessState
policyVersion
warnings[]
```

## Consistency Requirements

Supported query levels:

- EVENTUAL
- FRESH_IF_AVAILABLE
- REQUIRE_CURRENT
- HISTORICAL_EXACT

`REQUIRE_CURRENT` must fail rather than return a stale projection.

`HISTORICAL_EXACT` must bind to the requested curriculum version and historical policy context when available.

## Search Projection

Search indexes may include:

- canonical names
- localized names
- official codes
- objective text
- structural paths
- aliases
- source authority

Search result ranking must not determine authority or equivalence.

Every result returns exact curriculum and version identity.

## Authorization and Visibility

Projection access is evaluated independently from source existence.

A node may be:

- readable
- discoverable
- selectable
- historically visible
- restricted
- hidden from public catalog

Authorization filters must not change source counts presented in audit contexts without disclosure.

## Failure Codes

```text
CURRICULUM_PROJECTION_NOT_FOUND
CURRICULUM_PROJECTION_STALE
CURRICULUM_PROJECTION_REBUILD_REQUIRED
CURRICULUM_PROJECTION_BUILD_FAILED
CURRICULUM_PROJECTION_SOURCE_MISMATCH
CURRICULUM_PROJECTION_POLICY_MISMATCH
CURRICULUM_PROJECTION_LOCALE_UNAVAILABLE
CURRICULUM_PROJECTION_OVERLAY_CONFLICT
CURRICULUM_PROJECTION_VERSION_AMBIGUOUS
CURRICULUM_PROJECTION_ACCESS_DENIED
```

## Verification Rules

A projection is valid only when:

- every record traces to one exact curriculum version
- source watermark is complete
- hierarchy matches authoritative structure
- localization provenance is present
- overlay provenance is visible
- no meaning-strengthening transformation occurred
- freshness is correctly classified
- full rebuild and incremental rebuild are equivalent
- revoked and withdrawn states are represented correctly
- query results are deterministic for the same identity and policy

## Audit Requirements

Record for each build:

- projection type
- source curriculum version
- source watermark
- policy version
- locale set
- audience class
- overlay versions
- build mode
- generated digest
- generatedAt
- failure details when applicable

## Invariants

1. Projection never becomes curriculum authority.
2. Every projected node retains exact curriculumVersionId.
3. Audience filtering changes visibility, not meaning.
4. Localization changes rendering, not identity.
5. Overlays remain distinguishable from official curriculum.
6. Staleness is explicit.
7. Search ranking never establishes equivalence or authority.
8. Incremental rebuild must equal full rebuild.
9. Historical projections never float to the current version.
10. Projection must never strengthen curriculum claims.

## Completion Rule

31F is complete when curriculum truth can be projected into deterministic, localized, audience-specific, version-safe read models with explicit freshness, provenance, overlay boundaries, and no semantic strengthening.
