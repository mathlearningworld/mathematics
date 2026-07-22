# 33D — Understanding Debt Runtime

## 1. Purpose

Understanding Debt Runtime models unresolved prerequisite weakness that continues to affect later mathematical work.

It exists to answer:

- Which unresolved skill gaps are currently affecting the learner?
- How confident is the system that a debt signal is real?
- How far downstream could the impact reasonably extend?
- Which debts should be investigated or remediated first?
- Has a debt signal weakened, strengthened, or been resolved over time?

Understanding debt is not a permanent learner label. It is a reversible, evidence-bound diagnostic signal.

---

## 2. Core Principle

```text
Understanding Debt ≠ Learner Identity
Understanding Debt ≠ Low Ability
Understanding Debt ≠ Single Wrong Answer
Understanding Debt ≠ Curriculum Delay
Understanding Debt ≠ Proven Root Cause
```

The runtime must preserve the distinction between:

- observed difficulty,
- inferred unresolved prerequisite weakness,
- downstream impact,
- confidence,
- remediation priority,
- and confirmed resolution.

---

## 3. Runtime Authority

Understanding Debt Runtime is authoritative only for:

- debt signal identity,
- debt signal lifecycle,
- supporting and contradicting evidence references,
- affected skill scope,
- impact estimates,
- confidence state,
- review requirements,
- and resolution history.

It is not authoritative for:

- learner mastery,
- skill graph semantics,
- curriculum authority,
- assessment scoring,
- intervention delivery,
- or final educational judgment.

---

## 4. Aggregate Model

```ts
interface UnderstandingDebtCase {
  debtCaseId: string;
  learnerId: string;
  tenantId: string;

  anchorSkillVersionId: string;
  graphVersionId: string;
  curriculumVersionIds: string[];

  state: UnderstandingDebtState;
  severity: UnderstandingDebtSeverity;
  confidence: DiagnosticConfidence;

  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  affectedSkillVersionIds: string[];
  downstreamImpactClaims: DownstreamImpactClaim[];

  firstDetectedAt: string;
  lastEvaluatedAt: string;
  nextReviewAt?: string;
  resolvedAt?: string;

  version: number;
}
```

---

## 5. Debt Lifecycle

```text
SIGNAL_DETECTED
EVIDENCE_ACCUMULATING
PLAUSIBLE
PRIORITIZED
REMEDIATION_ACTIVE
MONITORING
RESOLVED
DISPROVEN
INCONCLUSIVE
STALE
```

### 5.1 Transition rules

- `SIGNAL_DETECTED → EVIDENCE_ACCUMULATING` requires at least one authorized observation.
- `EVIDENCE_ACCUMULATING → PLAUSIBLE` requires minimum evidence coverage and no blocking contradiction.
- `PLAUSIBLE → PRIORITIZED` requires an explicit prioritization policy.
- `PRIORITIZED → REMEDIATION_ACTIVE` requires an accepted remediation plan reference.
- `REMEDIATION_ACTIVE → MONITORING` requires post-intervention evidence collection.
- `MONITORING → RESOLVED` requires evidence that the original impact no longer persists under required contexts.
- Any active state may become `DISPROVEN` when stronger evidence contradicts the hypothesis.
- Any active state may become `INCONCLUSIVE` when evidence is insufficient or materially conflicting.
- Any active state may become `STALE` when freshness requirements expire.

Transitions use optimistic concurrency and preserve prior state history.

---

## 6. Debt Signal Types

```text
PREREQUISITE_INSTABILITY
MISCONCEPTION_PERSISTENCE
PROCEDURAL_FRAGILITY
REPRESENTATION_GAP
TRANSFER_GAP
LANGUAGE_MEDIATED_GAP
SYMBOL_SENSE_GAP
WORKING_MEMORY_LOAD_SIGNAL
STRATEGY_SELECTION_GAP
FOUNDATIONAL_FLUENCY_GAP
```

Signal types describe the current hypothesis category. They do not establish cause by themselves.

---

## 7. Severity Model

```text
LOW
MODERATE
HIGH
CRITICAL
UNKNOWN
```

Severity must be derived from separate dimensions:

```ts
interface UnderstandingDebtSeverityFactors {
  prerequisiteDepth: number;
  downstreamReach: number;
  recurrenceRate: number;
  transferFailureRate?: number;
  persistenceDurationDays: number;
  currentLearningBlockage: number;
  evidenceConfidence: number;
}
```

A severity level must expose the factors and policy version used to calculate it.

`UNKNOWN` is required when the runtime cannot justify a severity level.

---

## 8. Debt Accumulation

Debt accumulation may be inferred when all relevant conditions are met:

1. A prerequisite or support relationship is authorized by the referenced graph version.
2. Repeated evidence indicates instability in the anchor skill.
3. Later skill failures are contextually compatible with that instability.
4. Alternative explanations remain visible.
5. Evidence freshness and independence requirements are satisfied.

The runtime must never infer accumulation solely from:

- elapsed time,
- age or grade level,
- content completion,
- a single low score,
- or curriculum position.

---

## 9. Downstream Impact Claims

```ts
interface DownstreamImpactClaim {
  claimId: string;
  sourceSkillVersionId: string;
  targetSkillVersionId: string;
  graphPathEdgeIds: string[];
  relationshipStrength: 'DIRECT' | 'INDIRECT' | 'CONDITIONAL';
  impactType: 'BLOCKING' | 'FRAGILITY' | 'EFFICIENCY' | 'TRANSFER' | 'UNKNOWN';
  supportEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  confidence: DiagnosticConfidence;
  validAt: string;
}
```

A graph path supports plausibility. It does not prove learner-specific causal impact.

---

## 10. Debt Propagation Rules

Propagation is bounded by:

- graph version,
- relationship type,
- context,
- maximum path depth,
- policy version,
- evidence freshness,
- and confidence threshold.

Hard rules:

1. `HARD_PREREQUISITE` edges may support stronger propagation than `SOFT_PREREQUISITE` edges.
2. `SUPPORTS` and `TRANSFER_RELEVANT_TO` edges cannot be projected as blocking without additional evidence.
3. Conditional edges require their declared context.
4. Cyclic paths cannot multiply severity.
5. Propagated claims remain weaker than directly observed instability unless independently supported.
6. Propagation never creates learner mastery or failure facts.

---

## 11. Prioritization

Debt prioritization is a policy-bound decision based on:

- current blockage,
- prerequisite centrality,
- confidence,
- remediation feasibility,
- expected benefit,
- learner burden,
- mission relevance,
- and urgency.

```ts
interface UnderstandingDebtPriority {
  priorityClass: 'NOW' | 'SOON' | 'MONITOR' | 'DEFER' | 'NO_ACTION';
  score?: number;
  reasonCodes: string[];
  policyVersion: string;
}
```

Priority is not severity. A high-severity debt may be deferred when evidence is inconclusive or a safer prerequisite investigation is needed first.

---

## 12. Remediation Linkage

Understanding Debt Runtime may reference, but does not own:

- recommended learning activities,
- missions,
- teacher interventions,
- assessment probes,
- or gameplay tasks.

Every remediation link must record:

- target debt case,
- target skill version,
- expected diagnostic outcome,
- intervention authority,
- start time,
- and post-intervention evidence requirements.

Completion of remediation content does not resolve debt automatically.

---

## 13. Resolution

A debt case may be resolved only when:

1. The original instability is no longer supported at the required confidence.
2. Evidence covers the relevant contexts.
3. Downstream performance is no longer materially affected, where such impact was claimed.
4. Contradicting evidence is evaluated rather than discarded.
5. The resolution policy version is recorded.

Resolution does not delete the case. It closes the current diagnostic interpretation while preserving history.

A resolved case may be reopened only through an explicit new transition with new evidence.

---

## 14. Decay and Staleness

Confidence may decay when:

- evidence becomes old,
- the learner has completed relevant intervention,
- the skill graph version changes,
- assessment conditions materially change,
- or contradictory evidence appears.

Staleness must not silently convert a debt case to resolved.

```text
STALE ≠ RESOLVED
NO RECENT EVIDENCE ≠ NO DEBT
```

---

## 15. Contradiction Handling

Contradictory evidence must remain first-class.

Examples:

- stable performance in one representation but failure in another,
- strong classroom work but weak timed assessment performance,
- successful direct skill tasks but weak transfer,
- teacher observation conflicting with automated inference.

The runtime may split one debt case into narrower context-specific cases when the evidence supports that distinction.

---

## 16. Human Review

Human review is required when:

- severity is `CRITICAL`,
- the proposed action has high learner burden,
- evidence contains accessibility or language concerns,
- competing root causes remain close,
- a debt signal could affect major placement decisions,
- or policy explicitly requires review.

Human review must record:

- reviewer identity,
- decision,
- rationale,
- evidence inspected,
- and timestamp.

Human review does not rewrite source evidence.

---

## 17. Privacy and Fairness

Understanding debt is sensitive learner data.

Runtime requirements:

- tenant isolation,
- least-privilege access,
- purpose-bound projection,
- audit logging,
- retention policy,
- explainability,
- and protection against stigmatizing labels.

Protected or demographic attributes must not be used as causal shortcuts.

Accessibility and language context may explain evidence conditions but must not be converted into learner deficit labels.

---

## 18. Failure Codes

```text
UNDERSTANDING_DEBT_CASE_NOT_FOUND
UNDERSTANDING_DEBT_VERSION_CONFLICT
UNDERSTANDING_DEBT_EVIDENCE_MISSING
UNDERSTANDING_DEBT_EVIDENCE_STALE
UNDERSTANDING_DEBT_GRAPH_VERSION_UNAVAILABLE
UNDERSTANDING_DEBT_INVALID_TRANSITION
UNDERSTANDING_DEBT_PROPAGATION_BLOCKED
UNDERSTANDING_DEBT_POLICY_UNAVAILABLE
UNDERSTANDING_DEBT_REVIEW_REQUIRED
UNDERSTANDING_DEBT_RESOLUTION_NOT_SUPPORTED
UNDERSTANDING_DEBT_ACCESS_DENIED
```

Failures must be explicit and machine-readable.

---

## 19. Verification Gates

Before prioritization or remediation activation, verify:

- evidence authority,
- learner and tenant identity,
- graph version availability,
- path validity,
- context compatibility,
- contradiction visibility,
- confidence policy,
- freshness,
- and human-review requirements.

Before resolution, additionally verify:

- post-intervention evidence,
- relevant context coverage,
- downstream impact reassessment,
- and resolution policy version.

---

## 20. Runtime Invariants

1. Understanding debt is always a hypothesis-bound signal.
2. Source evidence is never rewritten by debt evaluation.
3. Missing evidence is never interpreted as failure.
4. Graph propagation never establishes causation by itself.
5. Severity and priority remain separate.
6. Contradictory evidence remains visible.
7. Staleness never becomes resolution silently.
8. Remediation completion never becomes resolution automatically.
9. Resolution preserves historical evidence and interpretation.
10. Understanding debt must never become a permanent learner identity.

---

## 21. Completion Criteria

33D is complete when the architecture defines:

- debt identity and lifecycle,
- signal and severity models,
- bounded propagation,
- prioritization,
- remediation linkage,
- resolution and reopening,
- staleness and contradiction handling,
- privacy and human review,
- failure contracts,
- and enforceable runtime invariants.
