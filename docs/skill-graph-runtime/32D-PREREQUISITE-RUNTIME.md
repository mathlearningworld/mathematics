# 32D — Prerequisite Runtime

## Purpose

Prerequisite Runtime defines how the Skill Graph represents, evaluates, explains, and governs prerequisite relationships without confusing curriculum order, statistical association, or learner performance with mathematical dependency authority.

It answers four questions:

1. Which prior skills are required, helpful, contextual, or merely correlated?
2. Under what evidence and policy can a learner be considered ready?
3. How should unmet prerequisite risk influence diagnostics and recommendations?
4. How can the system explain prerequisite reasoning without overstating certainty?

---

## Runtime Boundary

Prerequisite Runtime owns:

- prerequisite relationship policy;
- prerequisite condition evaluation;
- readiness result construction;
- blocker and risk explanation;
- prerequisite path traversal;
- context and policy binding;
- stale-graph detection;
- prerequisite verification contracts.

It does not own:

- learner mastery authority;
- assessment scoring;
- curriculum publication;
- lesson sequencing;
- intervention execution;
- recommendation ranking;
- final teaching decisions.

Those responsibilities remain with their respective engines.

---

## Core Distinctions

```text
Dependency edge ≠ learner state
Prerequisite satisfaction ≠ mastery proof
Curriculum order ≠ prerequisite authority
Correlation ≠ causation
Readiness ≠ guarantee of success
Unmet prerequisite ≠ permanent inability
```

A prerequisite relationship describes an authorized model of skill dependency. It does not describe a learner until learner evidence is evaluated against it.

---

## Prerequisite Types

### HARD_PREREQUISITE

A target skill cannot be interpreted or performed reliably without the source skill under the declared context.

Examples:

- integer subtraction before solving an equation that requires subtracting negative values;
- place-value understanding before standard multi-digit addition algorithms.

Hard prerequisites are publication-blocking when structurally invalid and readiness-blocking when verified learner evidence does not meet the declared threshold.

### SOFT_PREREQUISITE

The source skill materially improves fluency, efficiency, transfer, or error resistance, but the target skill may still be learned through alternate routes.

Soft prerequisites produce readiness risk, not absolute prohibition.

### CONDITIONAL_PREREQUISITE

The dependency applies only under an explicit context such as:

- representation type;
- solution strategy;
- age or instructional policy;
- curriculum jurisdiction;
- tool availability;
- language or notation convention;
- accessibility accommodation.

Conditional prerequisites must never be projected as universal.

### CO_REQUISITE

The source and target skills are intended to develop together. Neither direction alone is authoritative as a hard dependency.

### SUPPORTING_SKILL

The source skill reduces cognitive load or improves transfer but is not required for semantic access to the target.

---

## Prerequisite Edge Contract

```ts
type PrerequisiteEdge = {
  prerequisiteEdgeId: string;
  graphVersionId: string;
  sourceSkillVersionId: string;
  targetSkillVersionId: string;
  prerequisiteType:
    | 'HARD_PREREQUISITE'
    | 'SOFT_PREREQUISITE'
    | 'CONDITIONAL_PREREQUISITE'
    | 'CO_REQUISITE'
    | 'SUPPORTING_SKILL';
  contextPolicyId?: string;
  evidencePolicyId: string;
  minimumConfidence: number;
  provenance: PrerequisiteProvenance;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'DRAFT' | 'VERIFIED' | 'PUBLISHED' | 'RETIRED' | 'REVOKED';
};
```

Every edge is version-bound, provenance-bound, temporally bounded, and policy-bound.

---

## Prerequisite Provenance

Every prerequisite edge must declare why it exists.

```ts
type PrerequisiteProvenance = {
  authorityType:
    | 'MATHEMATICAL_ANALYSIS'
    | 'EXPERT_REVIEW'
    | 'CURRICULUM_SOURCE'
    | 'EMPIRICAL_STUDY'
    | 'INSTITUTIONAL_POLICY'
    | 'MIXED';
  sourceReferences: string[];
  rationale: string;
  reviewedBy: string[];
  reviewedAt?: string;
  confidence: number;
  limitations: string[];
};
```

Empirical association alone cannot create a hard prerequisite. Curriculum sequence alone cannot create a hard prerequisite. Both may support review, but semantic authority must be established separately.

---

## Readiness Evaluation Input

```ts
type EvaluatePrerequisiteReadinessInput = {
  learnerId: string;
  targetSkillVersionId: string;
  graphVersionId: string;
  evaluationTime: string;
  context: {
    curriculumVersionId?: string;
    missionId?: string;
    assessmentContextId?: string;
    locale?: string;
    institutionId?: string;
    accommodationPolicyIds?: string[];
  };
  evidenceSnapshotId: string;
  readinessPolicyId: string;
};
```

The evaluator must not silently substitute a newer graph, policy, skill version, or evidence snapshot.

---

## Readiness Result

```ts
type PrerequisiteReadinessResult = {
  targetSkillVersionId: string;
  graphVersionId: string;
  evidenceSnapshotId: string;
  readinessPolicyId: string;
  evaluatedAt: string;
  status:
    | 'READY'
    | 'READY_WITH_RISK'
    | 'NOT_READY'
    | 'INCONCLUSIVE'
    | 'BLOCKED';
  hardBlockers: PrerequisiteFinding[];
  softRisks: PrerequisiteFinding[];
  satisfied: PrerequisiteFinding[];
  excludedByContext: PrerequisiteFinding[];
  unknown: PrerequisiteFinding[];
  explanation: ReadinessExplanation;
};
```

`INCONCLUSIVE` is not readiness. `READY_WITH_RISK` is not equivalent to `READY`.

---

## Evidence Satisfaction

A prerequisite is satisfied only through the declared evidence policy.

Possible evidence sources include:

- recent assessment evidence;
- durable mastery state;
- validated transfer evidence;
- teacher-confirmed evidence;
- diagnostic evidence;
- accepted historical evidence within a freshness window.

The runtime must reject these substitutions unless explicitly authorized:

```text
lesson completion → mastery
single correct answer → durable readiness
curriculum placement → learner understanding
time spent → evidence quality
grade level → prerequisite satisfaction
```

---

## Freshness and Decay

Readiness must account for evidence age and evidence stability.

```ts
type EvidenceFreshnessState =
  | 'CURRENT'
  | 'AGING'
  | 'STALE'
  | 'CONTRADICTED'
  | 'UNKNOWN';
```

A previously satisfied prerequisite may become inconclusive when:

- the evidence exceeds the allowed age;
- newer evidence materially contradicts it;
- the skill version changed semantically;
- the graph policy changed;
- the learner context changed in a relevant way.

The system must never silently preserve readiness through incompatible semantic changes.

---

## Recursive Evaluation

Prerequisite evaluation may traverse upstream paths.

Traversal rules:

1. hard prerequisites are evaluated before soft prerequisites;
2. retired edges remain available for historical replay but are excluded from current evaluation unless explicitly requested;
3. cycles in hard-prerequisite subgraphs block publication and evaluation;
4. traversal depth and path limits must be explicit;
5. every result exposes traversed edge identities;
6. contextual edges must be filtered before readiness aggregation;
7. unknown nodes or edges make the affected path inconclusive.

---

## Understanding Debt Signal

Prerequisite Runtime may emit a bounded signal indicating that unresolved upstream weakness could explain downstream difficulty.

```ts
type UnderstandingDebtSignal = {
  signalId: string;
  learnerId: string;
  targetSkillVersionId: string;
  suspectedSourceSkillVersionIds: string[];
  graphVersionId: string;
  evidenceSnapshotId: string;
  confidence: number;
  status: 'HYPOTHESIS' | 'SUPPORTED' | 'WEAKENED' | 'RESOLVED' | 'EXPIRED';
  rationale: string[];
  generatedAt: string;
};
```

The signal is an inference, not a diagnosis of the learner as a person. It must remain reviewable, time-bound, evidence-bound, and reversible.

---

## Alternative Path Policy

Some target skills may be reachable through more than one valid prerequisite route.

```ts
type PrerequisiteRoutePolicy = {
  routePolicyId: string;
  mode: 'ALL_REQUIRED' | 'ANY_ROUTE' | 'MINIMUM_SET' | 'WEIGHTED';
  routeGroups: Array<{
    routeId: string;
    prerequisiteEdgeIds: string[];
    minimumSatisfiedCount?: number;
    minimumWeight?: number;
  }>;
};
```

The runtime must not collapse alternate routes into a single universal chain.

---

## Explanation Contract

Every readiness decision must provide a human-readable explanation appropriate to its audience.

Learner explanation:

- brief;
- non-judgmental;
- action-oriented;
- avoids technical graph terminology.

Teacher explanation:

- includes evidence and path details;
- distinguishes blockers from risks;
- exposes confidence and limitations.

System explanation:

- includes graph version;
- edge identities;
- policy identities;
- evidence snapshot;
- traversal decisions;
- exclusions and unknowns.

---

## Failure Codes

```text
SKILL_VERSION_NOT_FOUND
GRAPH_VERSION_NOT_FOUND
PREREQUISITE_EDGE_NOT_FOUND
HARD_PREREQUISITE_CYCLE_DETECTED
EVIDENCE_SNAPSHOT_NOT_FOUND
EVIDENCE_POLICY_NOT_FOUND
READINESS_POLICY_NOT_FOUND
CONTEXT_POLICY_NOT_FOUND
INCOMPATIBLE_SKILL_VERSION
STALE_GRAPH_VERSION
STALE_EVIDENCE
UNKNOWN_EDGE_TYPE
UNVERIFIED_EDGE
PREREQUISITE_PATH_LIMIT_EXCEEDED
PREREQUISITE_EVALUATION_INCONCLUSIVE
```

Failures must be explicit. The runtime must never silently downgrade a hard prerequisite to soft or silently ignore an unknown edge.

---

## Cross-Engine Contracts

### Assessment Engine

Provides evidence references and diagnostic observations. It does not author prerequisite edges.

### Progress Engine

Provides durable learner skill state. It does not decide graph authority.

### Recommendation Engine

Consumes readiness results and understanding-debt signals. It does not reinterpret hard blockers as satisfied.

### Mission Engine

May request readiness against mission targets. It does not redefine prerequisite semantics.

### Curriculum Runtime

Provides curriculum context and authorized alignment. Curriculum sequence remains distinct from cognitive dependency.

---

## Runtime Invariants

1. Every prerequisite result is bound to an explicit graph version.
2. Every learner evaluation is bound to an explicit evidence snapshot.
3. Hard prerequisite authority cannot be created from correlation alone.
4. Curriculum order cannot silently become dependency authority.
5. Contextual prerequisites cannot be projected as universal.
6. Unknown prerequisite state cannot be reported as satisfied.
7. Inconclusive readiness cannot be promoted to ready.
8. Alternate valid routes must remain representable.
9. Historical replay must use historical graph and policy versions.
10. Understanding-debt signals remain hypotheses unless separately verified.
11. Learner-facing explanations must not stigmatize or label permanent ability.
12. The runtime may explain risk; it may not guarantee learning outcome.

---

## Completion Condition

32D is complete when prerequisite relationships can be evaluated deterministically, versioned and replayed historically, explained to each audience, and consumed by other engines without confusing graph authority with learner mastery or turning uncertainty into false readiness.
