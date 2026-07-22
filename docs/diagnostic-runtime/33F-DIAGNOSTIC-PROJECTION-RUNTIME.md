# 33F — Diagnostic Projection Runtime

## 1. Purpose

Diagnostic Projection Runtime defines safe, audience-specific read models for diagnostic evidence, hypotheses, understanding debt, root-cause analysis, and recommended next actions.

Its purpose is to make diagnostic meaning visible without weakening uncertainty, leaking sensitive data, or turning an inference into a fact.

---

## 2. Core Principle

```text
Projection ≠ Authority
Summary ≠ Proof
Visualization ≠ Diagnosis
Ranking ≠ Truth
Hidden Detail ≠ Changed Meaning
```

Every projection must preserve the distinction between:

- observations,
- derived features,
- hypotheses,
- confidence,
- contradictions,
- missing evidence,
- and recommended action.

---

## 3. Runtime Authority

Diagnostic Projection Runtime is authoritative only for:

- read model shape,
- projection version,
- audience filtering,
- freshness state,
- localization,
- and traceability metadata.

It is not authoritative for:

- diagnostic conclusions,
- source evidence,
- learner mastery,
- root cause confirmation,
- intervention policy,
- or skill graph meaning.

---

## 4. Projection Families

```text
LEARNER_DIAGNOSTIC_SUMMARY
PARENT_DIAGNOSTIC_SUMMARY
TEACHER_DIAGNOSTIC_WORKBENCH
ADMIN_DIAGNOSTIC_AUDIT
RECOMMENDATION_ENGINE_FEED
MISSION_ENGINE_FEED
LEARNING_ENGINE_FEED
DIAGNOSTIC_CASE_TIMELINE
UNDERSTANDING_DEBT_MAP
ROOT_CAUSE_COMPARISON
EVIDENCE_TRACE
```

Each family must declare:

- audience,
- purpose,
- source authority,
- freshness requirements,
- masking rules,
- and whether it may be used for operational decisions.

---

## 5. Base Projection Envelope

```ts
interface DiagnosticProjectionEnvelope<T> {
  projectionId: string;
  projectionType: string;
  projectionVersion: string;
  tenantId: string;
  learnerId: string;
  diagnosticCaseId: string;

  sourceAggregateVersions: Record<string, number>;
  graphVersionId?: string;
  curriculumVersionIds: string[];
  policyVersionIds: string[];

  generatedAt: string;
  validAt: string;
  freshness: ProjectionFreshness;
  data: T;
}
```

---

## 6. Freshness States

```text
CURRENT
STALE_NON_BLOCKING
STALE_BLOCKING
REBUILDING
FAILED
UNKNOWN
```

Rules:

- `STALE_BLOCKING` projections cannot drive high-stakes or irreversible decisions.
- `UNKNOWN` freshness must be shown explicitly.
- A projection may remain viewable while stale, but its decision permissions must be reduced.
- Rebuild status never changes source authority.

---

## 7. Learner Projection

The learner view should emphasize:

- what the system observed,
- what it is still unsure about,
- what skill to work on next,
- and how progress will be rechecked.

It should avoid:

- stigmatizing language,
- technical causal scores,
- unsupported permanence,
- hidden ranking against peers,
- and labels such as “weak learner.”

Example shape:

```ts
interface LearnerDiagnosticSummary {
  focusSkillLabel: string;
  observedPattern: string;
  confidenceLabel: 'LOW' | 'MODERATE' | 'HIGH' | 'UNKNOWN';
  nextStep: string;
  whyThisStep: string;
  evidenceNeededNext?: string;
  encouragementMessage?: string;
}
```

---

## 8. Parent Projection

The parent view may include:

- current learning blockage,
- suspected prerequisite gaps,
- confidence and uncertainty,
- evidence recency,
- recommended support,
- and change over time.

It must clearly separate:

```text
Observed
Likely
Still Uncertain
Recommended Next Step
```

The projection must not imply medical, psychological, or permanent ability judgments.

---

## 9. Teacher Workbench Projection

The teacher projection may expose deeper diagnostic detail:

```ts
interface TeacherDiagnosticWorkbench {
  observations: DiagnosticObservationView[];
  activeHypotheses: DiagnosticHypothesisView[];
  rootCauseCandidates: RootCauseCandidateView[];
  understandingDebtCases: UnderstandingDebtView[];
  contradictions: ContradictionView[];
  missingEvidence: MissingEvidenceView[];
  recommendedProbes: DiagnosticProbeView[];
  reviewActions: DiagnosticReviewAction[];
}
```

Teacher views must preserve:

- source evidence references,
- graph and skill versions,
- policy versions,
- and confidence dimensions.

Teacher confirmation must be stored as a new review record, not as a projection mutation.

---

## 10. Administrative Audit Projection

Administrative views may expose:

- model and policy versions,
- aggregate versions,
- access decisions,
- projection rebuild history,
- override history,
- and verification status.

They must not expose learner-sensitive data beyond the user’s authorized purpose.

Audit projections are for traceability, not for replacing source event ledgers.

---

## 11. Engine Feed Projections

Downstream engines receive purpose-bound feeds.

### 11.1 Recommendation Engine Feed

May include:

- active hypothesis IDs,
- target skill versions,
- confidence,
- actionability,
- contraindications,
- and safe recommendation boundaries.

### 11.2 Mission Engine Feed

May include:

- prioritized skill targets,
- prerequisite sequence hints,
- required diagnostic checkpoints,
- and learner burden limits.

### 11.3 Learning Engine Feed

May include:

- target misconception or gap category,
- representation preferences to test,
- remediation constraints,
- and post-activity evidence requirements.

No feed may convert a hypothesis into mastery or failure authority.

---

## 12. Understanding Debt Map

```ts
interface UnderstandingDebtMapProjection {
  anchorNodes: UnderstandingDebtNodeView[];
  impactEdges: UnderstandingDebtImpactEdgeView[];
  unresolvedAreas: string[];
  graphVersionId: string;
  pathDepthLimit: number;
  confidenceLegend: Record<string, string>;
}
```

Visualization rules:

1. Direct evidence and propagated impact must use distinct semantics.
2. Blocking and supporting relationships must remain distinguishable.
3. Confidence must not be represented solely by alarming color.
4. Unknown areas must remain visible.
5. A dense graph must not imply severity by visual size alone.

---

## 13. Root Cause Comparison Projection

The projection should show competing causes side by side.

```ts
interface RootCauseComparisonProjection {
  candidates: Array<{
    candidateId: string;
    category: string;
    supportDimensions: Record<string, number | null>;
    contradictionDimensions: Record<string, number | null>;
    confidence: DiagnosticConfidence;
    actionability: string;
    unresolvedQuestions: string[];
  }>;
  proposedPrimaryCandidateId?: string;
  comparisonPolicyVersion: string;
}
```

A primary candidate must not visually erase alternatives.

---

## 14. Evidence Trace Projection

Evidence trace provides explainability from displayed claim back to source authority.

```ts
interface EvidenceTraceProjection {
  claimId: string;
  claimType: string;
  sourceEvidenceIds: string[];
  derivedFeatureIds: string[];
  parentHypothesisIds: string[];
  graphPathEdgeIds: string[];
  transformations: DiagnosticTransformationView[];
  verificationStatus: string;
}
```

Every transformation must expose its version and purpose.

---

## 15. Confidence Presentation

Confidence must be multidimensional where operationally relevant.

Possible dimensions:

```text
Evidence Coverage
Evidence Reliability
Contradiction Level
Context Coverage
Temporal Freshness
Alternative Separation
Graph Plausibility
```

A single percentage may be displayed only when:

- the policy permits it,
- the underlying dimensions remain inspectable,
- and the number is not presented as objective certainty.

---

## 16. Uncertainty Presentation

Required uncertainty states:

```text
SUPPORTED
PLAUSIBLE
WEAKLY_SUPPORTED
CONTRADICTED
INSUFFICIENT_EVIDENCE
INCONCLUSIVE
STALE
```

The UI or consuming engine must never silently collapse these into `PASS` or `FAIL`.

---

## 17. Localization and Language

Localization may change:

- labels,
- explanatory wording,
- examples,
- and display order.

Localization must not change:

- diagnostic identity,
- evidence meaning,
- confidence state,
- causal category,
- or actionability.

Language-sensitive evidence context must remain available to authorized reviewers.

---

## 18. Audience Filtering

Audience filtering may hide:

- internal model details,
- sensitive reviewer notes,
- protected operational metadata,
- or unnecessary source identifiers.

It must not:

- strengthen confidence,
- hide material contradiction,
- convert hypothesis to fact,
- or remove required warnings.

---

## 19. Access Control

Every projection request must verify:

- tenant scope,
- learner relationship,
- audience role,
- purpose,
- data sensitivity,
- and projection family permission.

High-sensitivity views require audit logging.

Projection caching must preserve access boundaries and must never share learner-specific cache entries across tenants or unauthorized audiences.

---

## 20. Rebuild and Replay

Projection rebuilds consume source events or authorized aggregate snapshots.

Rules:

1. Rebuild never writes diagnostic authority.
2. Rebuild output must declare source versions.
3. Unknown events block authoritative rebuild completion.
4. Shadow rebuilds may compare old and new projection versions.
5. Divergence must be explained before replacing a production projection.

---

## 21. Failure Codes

```text
DIAGNOSTIC_PROJECTION_NOT_FOUND
DIAGNOSTIC_PROJECTION_ACCESS_DENIED
DIAGNOSTIC_PROJECTION_STALE_BLOCKING
DIAGNOSTIC_PROJECTION_SOURCE_UNAVAILABLE
DIAGNOSTIC_PROJECTION_VERSION_UNSUPPORTED
DIAGNOSTIC_PROJECTION_POLICY_UNAVAILABLE
DIAGNOSTIC_PROJECTION_REBUILD_FAILED
DIAGNOSTIC_PROJECTION_DIVERGENCE
DIAGNOSTIC_PROJECTION_UNKNOWN_EVENT
DIAGNOSTIC_PROJECTION_PURPOSE_NOT_ALLOWED
```

Failures must be explicit and machine-readable.

---

## 22. Verification Gates

Before publishing or serving an operational projection, verify:

- source aggregate versions,
- evidence authority,
- graph and skill versions,
- projection schema,
- audience policy,
- contradiction visibility,
- confidence traceability,
- freshness,
- localization safety,
- and access scope.

Before a projection drives an action, additionally verify:

- operational decision permission,
- actionability state,
- staleness class,
- and required human review.

---

## 23. Runtime Invariants

1. Projection is never diagnostic authority.
2. Observations and hypotheses remain distinguishable.
3. Contradictions cannot be hidden when material to the displayed conclusion.
4. Ranking never strengthens truth.
5. Audience filtering never changes meaning.
6. Localization never changes identity or confidence.
7. Stale-blocking projections cannot drive high-stakes action.
8. Engine feeds remain purpose-bound.
9. Every claim remains traceable to source authority.
10. Projection rebuild never rewrites diagnostic history.

---

## 24. Completion Criteria

33F is complete when the architecture defines:

- projection families,
- envelope and freshness semantics,
- learner, parent, teacher, and audit views,
- downstream engine feeds,
- debt and root-cause visualizations,
- evidence traceability,
- confidence and uncertainty presentation,
- localization and audience filtering,
- access control,
- rebuild behavior,
- failure contracts,
- and enforceable runtime invariants.
