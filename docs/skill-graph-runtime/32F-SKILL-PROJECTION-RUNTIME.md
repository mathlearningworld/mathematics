# 32F — Skill Projection Runtime

## Purpose

Skill Projection Runtime defines the read models used to expose the Skill Graph safely to learners, parents, teachers, administrators, and downstream engines.

Its purpose is to transform authoritative graph, identity, prerequisite, and progression data into audience-appropriate views without changing semantic authority or hiding uncertainty.

---

## Core Rule

```text
Projection is not authority.
Visualization is not proof.
Filtering changes visibility, not meaning.
Ranking changes order, not truth.
Localization changes presentation, not identity.
```

Every projection must remain traceable to the exact graph version, skill versions, edge identities, progression records, and policy versions used to build it.

---

## Runtime Boundary

Skill Projection Runtime owns:

- audience-specific read models;
- graph traversal views;
- prerequisite map views;
- learner progression views;
- diagnostic and remediation views;
- route and milestone projections;
- localized labels and descriptions;
- projection freshness and rebuild state;
- explainable visibility filtering;
- projection cache contracts.

It does not own:

- skill identity authority;
- dependency authority;
- learner mastery authority;
- recommendation ranking authority;
- curriculum publication;
- assessment scoring;
- mission completion.

---

## Projection Context

```ts
type SkillProjectionContext = {
  graphVersionId: string;
  audience:
    | 'LEARNER'
    | 'PARENT'
    | 'TEACHER'
    | 'ADMINISTRATOR'
    | 'ENGINE';
  learnerId?: string;
  curriculumVersionId?: string;
  missionId?: string;
  institutionId?: string;
  locale: string;
  projectionPolicyId: string;
  asOf: string;
};
```

The runtime must never silently replace an explicitly requested graph version with the latest version.

---

## Projection Freshness

```ts
type ProjectionFreshnessState =
  | 'CURRENT'
  | 'STALE_NON_BLOCKING'
  | 'STALE_BLOCKING'
  | 'REBUILDING'
  | 'FAILED'
  | 'UNKNOWN';
```

Authoritative operational decisions must not rely on `STALE_BLOCKING`, `FAILED`, or `UNKNOWN` projections.

A stale non-blocking projection may be shown only when:

- the audience is informed;
- the stale window is policy-approved;
- no semantic incompatibility exists;
- no safety-critical decision depends on it.

---

## Common Projection Envelope

```ts
type SkillProjectionEnvelope<T> = {
  projectionId: string;
  projectionType: string;
  graphVersionId: string;
  projectionPolicyId: string;
  audience: string;
  locale: string;
  generatedAt: string;
  asOf: string;
  freshness: ProjectionFreshnessState;
  sourceVersions: {
    skillVersionIds: string[];
    edgeIds: string[];
    progressionStateVersions: number[];
    evidenceSnapshotIds: string[];
  };
  warnings: ProjectionWarning[];
  data: T;
};
```

---

## Skill Catalog Projection

The catalog exposes discoverable skill identities without flattening version semantics.

```ts
type SkillCatalogProjection = {
  skills: Array<{
    skillId: string;
    skillVersionId: string;
    canonicalKey: string;
    label: string;
    shortDescription?: string;
    domainPath: string[];
    status: string;
    curriculumPlacements: CurriculumPlacementSummary[];
    tags: string[];
  }>;
};
```

Catalog search must never imply equivalence merely because labels or keywords are similar.

---

## Skill Detail Projection

```ts
type SkillDetailProjection = {
  skillId: string;
  skillVersionId: string;
  canonicalKey: string;
  label: string;
  description: string;
  examples: string[];
  nonExamples: string[];
  prerequisiteSummary: PrerequisiteSummary;
  dependentSkillSummary: DependentSkillSummary;
  curriculumPlacements: CurriculumPlacementSummary[];
  progressionSummary?: LearnerSkillProgressionSummary;
  provenanceSummary: ProvenanceSummary;
  versionNotice?: SkillVersionNotice;
};
```

Examples and non-examples are presentation aids. They do not redefine the skill contract.

---

## Graph Neighborhood Projection

```ts
type SkillGraphNeighborhoodProjection = {
  centerSkillVersionId: string;
  depth: number;
  nodes: ProjectedSkillNode[];
  edges: ProjectedSkillEdge[];
  traversal: {
    direction: 'UPSTREAM' | 'DOWNSTREAM' | 'BOTH';
    includedEdgeTypes: string[];
    excludedByContextEdgeIds: string[];
    truncated: boolean;
    pathLimit: number;
  };
};
```

Every displayed edge must retain:

- edge identity;
- edge type;
- confidence;
- provenance summary;
- context scope;
- status;
- effective time.

A visual arrow must never omit relationship type in a way that makes soft, supporting, and hard prerequisites appear identical.

---

## Prerequisite Map Projection

The prerequisite map explains readiness dependencies for a target skill.

```ts
type PrerequisiteMapProjection = {
  targetSkillVersionId: string;
  readinessStatus?: string;
  hardPrerequisites: ProjectedPrerequisiteNode[];
  softPrerequisites: ProjectedPrerequisiteNode[];
  conditionalPrerequisites: ProjectedPrerequisiteNode[];
  alternateRoutes: ProjectedPrerequisiteRoute[];
  blockers: ProjectedPrerequisiteFinding[];
  risks: ProjectedPrerequisiteFinding[];
  unknowns: ProjectedPrerequisiteFinding[];
};
```

Unknown and inconclusive states must remain visible to authorized audiences.

---

## Learner Projection

Learner views prioritize clarity, agency, and next-action understanding.

```ts
type LearnerSkillWorldProjection = {
  currentFocus: LearnerSkillCard[];
  readyToExplore: LearnerSkillCard[];
  strengthening: LearnerSkillCard[];
  futurePossibilities: LearnerSkillCard[];
  recentProgress: LearnerProgressEventCard[];
  routeSummary?: LearnerRouteSummary;
};
```

Learner-facing rules:

1. avoid permanent ability labels;
2. avoid raw confidence numbers unless pedagogically justified;
3. explain blockers as preparatory opportunities;
4. distinguish “not yet enough evidence” from “not capable”;
5. avoid ranking the learner against others by default;
6. never expose sensitive institutional notes.

---

## Parent Projection

Parent views emphasize understandable progress, evidence freshness, and ways to support learning without pretending to be a clinical diagnosis.

```ts
type ParentSkillProgressProjection = {
  strengths: ParentSkillSummary[];
  developingAreas: ParentSkillSummary[];
  reinforcementAreas: ParentSkillSummary[];
  upcomingMilestones: ParentMilestoneSummary[];
  supportSuggestions: ParentSupportSuggestion[];
  evidenceFreshnessNotice?: string;
};
```

Parent projections must clearly distinguish:

- observed evidence;
- system inference;
- teacher-confirmed information;
- suggested support actions.

---

## Teacher Projection

Teacher views may expose more detail, including evidence, graph paths, confidence, limitations, and cohort aggregation.

```ts
type TeacherSkillDiagnosticProjection = {
  learnerId: string;
  targetSkillVersionId: string;
  currentProgressionState: string;
  prerequisiteReadiness: string;
  supportingEvidence: TeacherEvidenceSummary[];
  suspectedUpstreamGaps: TeacherGapHypothesis[];
  contradictoryEvidence: TeacherEvidenceSummary[];
  recommendedInvestigationTargets: string[];
  graphTrace: TeacherGraphTrace;
  limitations: string[];
};
```

Suspected gaps must be explicitly labeled as hypotheses until verified.

---

## Cohort Projection

```ts
type CohortSkillProjection = {
  cohortId: string;
  skillVersionId: string;
  learnerCount: number;
  stateDistribution: Record<string, number>;
  readinessDistribution: Record<string, number>;
  commonBlockerSkillVersionIds: string[];
  evidenceFreshnessDistribution: Record<string, number>;
  suppressedSmallGroups: boolean;
};
```

Cohort projections must enforce privacy thresholds and must not expose identifiable learner details through small-group inference.

---

## Diagnostic Projection

Diagnostic projections combine graph structure with evidence interpretation while preserving engine boundaries.

```ts
type SkillDiagnosticProjection = {
  observedTargetDifficulty: string;
  candidateSourceSkills: Array<{
    skillVersionId: string;
    relationshipPathEdgeIds: string[];
    evidenceSupport: string;
    confidence: number;
    status: 'HYPOTHESIS' | 'SUPPORTED' | 'WEAKENED' | 'REJECTED';
  }>;
  unresolvedQuestions: string[];
  suggestedEvidenceNeeds: string[];
};
```

A diagnostic projection is not itself an assessment result and cannot mutate learner progress.

---

## Route Projection

```ts
type SkillRouteProjection = {
  routeId: string;
  routeVersionId: string;
  purpose: string;
  milestones: ProjectedRouteMilestone[];
  branches: ProjectedRouteBranch[];
  currentPosition?: ProjectedRoutePosition;
  alternativePaths: ProjectedRouteAlternative[];
  blockedSegments: ProjectedBlockedSegment[];
  estimatedScope?: ProjectedScopeEstimate;
};
```

Scope estimates must be labeled as estimates and must not be represented as guaranteed completion times.

---

## Recommendation Input Projection

Skill Projection Runtime may provide a normalized input view to Recommendation Engine.

```ts
type RecommendationSkillContextProjection = {
  learnerId: string;
  graphVersionId: string;
  candidateSkillVersionIds: string[];
  progressionStates: Record<string, string>;
  readinessStates: Record<string, string>;
  activeRouteIds: string[];
  missionTargetSkillVersionIds: string[];
  exclusions: Array<{
    skillVersionId: string;
    reasonCode: string;
  }>;
};
```

This projection supplies facts and bounded derived state. It does not rank candidates.

---

## Localization

Localization may change:

- labels;
- descriptions;
- examples;
- explanatory language;
- display ordering appropriate to locale.

Localization must not change:

- SkillId;
- SkillVersionId;
- edge identity;
- relationship type;
- semantic version meaning;
- prerequisite status;
- learner progression state.

If no safe translation exists, the projection must mark the content as unavailable or use an approved fallback. It must not invent terminology that changes meaning.

---

## Visibility Policy

```ts
type SkillProjectionVisibilityPolicy = {
  projectionPolicyId: string;
  audience: string;
  allowedFields: string[];
  redactedFields: string[];
  minimumCohortSize?: number;
  showConfidence: boolean;
  showProvenance: boolean;
  showHypotheses: boolean;
  showHistoricalVersions: boolean;
};
```

Visibility filtering must be deterministic and auditable.

---

## Rebuild and Cache Policy

Projection stores may be rebuilt from authoritative sources.

Rules:

1. cache keys include graph version, policy, audience, locale, and relevant learner state version;
2. incompatible graph updates invalidate affected caches;
3. cache misses do not permit unversioned fallback;
4. rebuilds must be idempotent;
5. shadow rebuilds should compare outputs before replacement;
6. authoritative source state is never overwritten by projection output;
7. failed rebuilds preserve the last known projection with an explicit freshness state when policy permits.

---

## Projection Events

```text
SkillProjectionRequested
SkillProjectionGenerated
SkillProjectionCacheHit
SkillProjectionInvalidated
SkillProjectionRebuildStarted
SkillProjectionRebuildCompleted
SkillProjectionRebuildFailed
SkillProjectionStalenessDetected
SkillProjectionVisibilityApplied
```

Events must include correlation identifiers and source-version references.

---

## Failure Codes

```text
PROJECTION_POLICY_NOT_FOUND
GRAPH_VERSION_NOT_FOUND
SKILL_VERSION_NOT_FOUND
PROGRESSION_RECORD_NOT_FOUND
PREREQUISITE_RESULT_NOT_FOUND
UNSUPPORTED_AUDIENCE
UNSUPPORTED_LOCALE
UNSAFE_LOCALIZATION
PROJECTION_SOURCE_INCOMPATIBLE
PROJECTION_STALE_BLOCKING
PROJECTION_REBUILD_FAILED
PROJECTION_PATH_LIMIT_EXCEEDED
PROJECTION_VISIBILITY_DENIED
COHORT_PRIVACY_THRESHOLD_NOT_MET
PROJECTION_GENERATION_INCONCLUSIVE
```

---

## Cross-Engine Contracts

### Skill Graph Runtime

Provides authoritative skill, edge, identity, and graph-version data.

### Prerequisite Runtime

Provides readiness and blocker results.

### Progress Engine

Provides learner progression records and state versions.

### Assessment Engine

Provides evidence summaries by reference.

### Recommendation Engine

Consumes normalized projections but owns ranking and recommendation decisions.

### Mission Engine

Provides mission target context.

### Curriculum Runtime

Provides authorized curriculum placement and localization context.

---

## Runtime Invariants

1. Projection output never becomes graph authority.
2. Every projection declares its GraphVersionId.
3. Learner-specific projections declare relevant evidence and progression versions.
4. Hard and soft relationships must remain visually distinguishable.
5. Unknown and inconclusive states cannot be rendered as satisfied.
6. Localization cannot change mathematical meaning.
7. Audience filtering cannot change underlying state.
8. Recommendation input projections cannot rank candidates.
9. Diagnostic hypotheses must remain labeled as hypotheses.
10. Cohort projections enforce privacy thresholds.
11. Stale blocking projections cannot drive authoritative decisions.
12. Projection caches are disposable and rebuildable.
13. Historical projections must use historical graph and policy versions.
14. Search similarity cannot create semantic equivalence.

---

## Completion Condition

32F is complete when every major audience can receive a clear, traceable, version-aware view of skill identity, graph structure, prerequisites, progression, routes, and diagnostics; projections can be rebuilt safely; uncertainty remains visible; and no read model can silently strengthen authority, change learner state, or erase the difference between evidence, inference, and truth.
