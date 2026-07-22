# 33A — Diagnostic Runtime Foundation

## 1. Purpose

Diagnostic Runtime converts authorized learning evidence into an explainable, time-bound hypothesis about what may be blocking a learner and what evidence should be collected next.

It exists to answer five distinct questions without collapsing them into one:

1. What was directly observed?
2. What pattern can reasonably be inferred?
3. Which prerequisite gaps may explain that pattern?
4. How confident is the inference?
5. What is the safest next diagnostic or learning action?

Diagnostic Runtime does not award mastery, rewrite progress, alter curriculum authority, or create skill dependencies. It consumes authority from Assessment, Progress, Curriculum, and Skill Graph runtimes and produces diagnostic hypotheses with explicit provenance and uncertainty.

---

## 2. Core Runtime Law

> Diagnostic Runtime may organize evidence and produce explainable hypotheses. It must never convert incomplete evidence into fact, correlation into causation, or a temporary learning difficulty into a permanent learner label.

---

## 3. Boundary Model

### Inputs

- assessment attempts and response evidence;
- observation metadata;
- skill and skill-version references;
- prerequisite paths from Skill Graph Runtime;
- curriculum context and version;
- progress snapshots and historical transitions;
- intervention outcomes;
- teacher or mentor observations;
- evidence freshness and reliability metadata.

### Outputs

- diagnostic case;
- diagnostic hypothesis;
- confidence and uncertainty statement;
- candidate root causes;
- understanding-debt signals;
- recommended evidence request;
- recommended remediation target;
- projection-safe explanation;
- verification status.

### Explicitly outside authority

Diagnostic Runtime must not:

- declare mastery;
- mutate learner progress directly;
- publish curriculum meaning;
- add or strengthen Skill Graph edges;
- assign medical, psychological, or disability diagnoses;
- create punitive labels;
- infer intent, effort, character, or intelligence from academic evidence;
- treat grade placement as evidence of understanding.

---

## 4. Diagnostic Aggregate

A `DiagnosticCase` is the durable boundary for one diagnostic investigation.

```ts
interface DiagnosticCase {
  diagnosticCaseId: string
  learnerId: string
  tenantId: string
  targetSkillVersionIds: string[]
  curriculumVersionId?: string
  graphVersionId: string
  openedAt: string
  status: DiagnosticCaseStatus
  evidenceWindow: EvidenceWindow
  activeHypothesisIds: string[]
  verificationStatus: DiagnosticVerificationStatus
  version: number
}
```

### Status

```text
OPEN
COLLECTING_EVIDENCE
INFERENCE_READY
HYPOTHESIS_ACTIVE
ACTION_RECOMMENDED
AWAITING_OUTCOME
RESOLVED
INCONCLUSIVE
CANCELLED
```

A case may end as `INCONCLUSIVE`. The runtime must not force a conclusion merely because a workflow expects one.

---

## 5. Evidence, Observation, Inference, Decision

The runtime must preserve four different semantic layers.

### 5.1 Observation

A direct event or measurement, such as:

- learner selected an incorrect operation;
- learner solved four equivalent items correctly;
- response latency increased sharply;
- teacher recorded a specific misconception;
- performance changed after a targeted hint.

### 5.2 Derived Feature

A computed representation such as:

- error-category frequency;
- consistency score;
- transfer gap;
- response-pattern stability;
- evidence freshness;
- item coverage.

### 5.3 Diagnostic Hypothesis

A reversible claim that may explain observations.

```ts
interface DiagnosticHypothesis {
  hypothesisId: string
  diagnosticCaseId: string
  hypothesisType: DiagnosticHypothesisType
  targetSkillVersionId: string
  suspectedCauseSkillVersionIds: string[]
  supportingEvidenceIds: string[]
  contradictingEvidenceIds: string[]
  confidence: DiagnosticConfidence
  uncertaintyReasons: string[]
  createdAt: string
  expiresAt?: string
  status: HypothesisStatus
}
```

### 5.4 Recommended Action

A proposal for collecting more evidence or delivering an intervention. It is not proof that the hypothesis is correct.

---

## 6. Hypothesis Types

```text
PREREQUISITE_GAP
MISCONCEPTION_PATTERN
PROCEDURAL_INSTABILITY
CONCEPTUAL_INSTABILITY
REPRESENTATION_TRANSFER_GAP
LANGUAGE_OR_PROMPT_COMPREHENSION_GAP
EVIDENCE_TOO_SPARSE
EVIDENCE_CONTRADICTORY
KNOWLEDGE_REACTIVATION_NEEDED
CONTEXT_SPECIFIC_DIFFICULTY
POSSIBLE_UNDERSTANDING_DEBT
NO_CURRENT_BLOCKER_DETECTED
```

`NO_CURRENT_BLOCKER_DETECTED` means the inspected evidence did not reveal a blocker. It does not prove universal mastery.

---

## 7. Confidence Model

Confidence must be explainable and evidence-bound.

```text
VERY_LOW
LOW
MODERATE
HIGH
VERY_HIGH
```

Confidence is influenced by:

- number and diversity of observations;
- directness of evidence;
- item validity;
- repeated pattern consistency;
- recency;
- transfer coverage;
- prerequisite-path authority;
- contradictory evidence;
- intervention response;
- human confirmation.

Confidence must not be derived from a single opaque score without retaining its contributing factors.

---

## 8. Temporal Semantics

Every diagnostic conclusion is bound to:

- an evidence window;
- a Skill Graph version;
- skill-version identities;
- curriculum context where relevant;
- inference policy version;
- timestamp of evaluation.

Historical evidence must never silently float to a new skill version or graph version.

A hypothesis may become stale when:

- relevant evidence expires;
- the learner demonstrates contradictory transfer;
- the graph evolves;
- the target skill meaning changes;
- the inference policy changes materially;
- a remediation outcome invalidates the prior explanation.

---

## 9. Understanding Debt Boundary

Understanding debt is a time-bound diagnostic signal describing a plausible unresolved prerequisite burden.

It is not:

- a permanent learner trait;
- a debt owed by the learner;
- a moral judgment;
- a synonym for low score;
- a synonym for low grade placement;
- proof of a single root cause.

A valid understanding-debt signal must expose:

- affected target skill;
- suspected prerequisite skills;
- supporting and contradicting evidence;
- graph paths used;
- confidence;
- estimated impact scope;
- evidence gaps;
- expiry or review condition.

---

## 10. Cross-Engine Contracts

### Assessment Engine

Provides response-level evidence. Diagnostic Runtime may classify patterns but must not alter original scoring or evidence.

### Progress Engine

Provides historical state and change. Diagnostic Runtime may explain instability but must not author progress transitions.

### Skill Graph Runtime

Provides authorized dependency structure. Diagnostic Runtime may traverse graph paths but must not transform path existence into learner-specific causation.

### Curriculum Runtime

Provides placement and context. Curriculum sequence may inform investigation but does not independently prove cognitive dependency.

### Recommendation Engine

Consumes verified diagnostic outputs to propose actions. Recommendation must preserve diagnostic uncertainty and provenance.

### Learning Engine

Executes diagnostic tasks or remediation experiences and returns new evidence. It must not report completion as proof that the diagnosis was correct.

---

## 11. Safety and Fairness

The runtime must:

- minimize unnecessary sensitive attributes;
- distinguish language accessibility from mathematical understanding;
- account for insufficient item coverage;
- avoid penalizing learners for missing data;
- expose model or policy limitations;
- permit human review and correction;
- preserve dissenting evidence;
- avoid ranking learners by diagnostic severity as a default operational view.

Protected or sensitive attributes must not be used to strengthen a diagnostic claim unless explicitly authorized for a legitimate accessibility purpose and governed by policy.

---

## 12. Failure Semantics

```text
DIAGNOSTIC_CASE_NOT_FOUND
EVIDENCE_NOT_FOUND
EVIDENCE_VERSION_MISMATCH
SKILL_VERSION_NOT_FOUND
GRAPH_VERSION_NOT_FOUND
INSUFFICIENT_EVIDENCE
CONTRADICTORY_EVIDENCE
HYPOTHESIS_STALE
HYPOTHESIS_ALREADY_RESOLVED
INFERENCE_POLICY_NOT_FOUND
UNSUPPORTED_EVIDENCE_TYPE
AUTHORITY_BOUNDARY_VIOLATION
CONCURRENT_MODIFICATION
```

`INSUFFICIENT_EVIDENCE` and `CONTRADICTORY_EVIDENCE` are valid diagnostic outcomes, not technical failures to hide.

---

## 13. Minimum Audit Record

Every material inference must retain:

- actor or runtime identity;
- diagnostic case and hypothesis IDs;
- learner and tenant scope;
- evidence IDs and versions;
- skill and graph versions;
- inference policy version;
- supporting and contradicting evidence;
- confidence factors;
- output timestamp;
- requested or executed next action;
- subsequent outcome when available.

---

## 14. Foundational Invariants

1. Observation, inference, and recommendation remain distinct.
2. A diagnostic hypothesis is reversible and time-bound.
3. Missing evidence never becomes negative evidence by default.
4. Curriculum order never independently proves prerequisite causation.
5. A graph path never independently proves learner-specific causation.
6. Confidence must expose its contributing evidence and uncertainty.
7. Historical diagnostic meaning remains bound to original versions.
8. Understanding debt is a signal, not a learner identity.
9. `INCONCLUSIVE` is a legitimate final state.
10. Diagnostic outputs cannot directly mutate mastery or progress authority.
