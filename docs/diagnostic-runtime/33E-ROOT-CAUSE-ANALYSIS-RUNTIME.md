# 33E — Root Cause Analysis Runtime

## 1. Purpose

Root Cause Analysis Runtime evaluates competing explanations for a learner’s observed difficulty and determines which causes are most plausible, most actionable, and most strongly supported by evidence.

It exists to separate:

- symptom from cause,
- prerequisite weakness from surface error,
- persistent misconception from temporary performance noise,
- and high-confidence explanation from unresolved uncertainty.

The runtime does not claim certainty where evidence does not justify it.

---

## 2. Core Principle

```text
Observed Error ≠ Root Cause
Graph Path ≠ Causal Proof
Correlation ≠ Learner-Specific Causation
Most Likely ≠ Proven
Actionable ≠ Certain
```

Root cause analysis is a comparative inference process, not a label assignment process.

---

## 3. Runtime Authority

Root Cause Analysis Runtime is authoritative for:

- root cause analysis identity,
- candidate cause registration,
- evidence linkage,
- causal comparison results,
- confidence and uncertainty state,
- review state,
- and analysis lifecycle.

It is not authoritative for:

- skill graph meaning,
- assessment scoring,
- learner mastery,
- intervention execution,
- curriculum placement,
- or final human educational judgment.

---

## 4. Aggregate Model

```ts
interface RootCauseAnalysis {
  analysisId: string;
  diagnosticCaseId: string;
  learnerId: string;
  tenantId: string;

  observedProblemSkillVersionIds: string[];
  graphVersionId: string;
  state: RootCauseAnalysisState;

  candidates: RootCauseCandidate[];
  primaryCandidateId?: string;
  unresolvedQuestions: DiagnosticQuestion[];

  createdAt: string;
  evaluatedAt?: string;
  reviewedAt?: string;
  version: number;
}
```

---

## 5. Analysis Lifecycle

```text
OPEN
CANDIDATES_GENERATED
EVIDENCE_EVALUATING
COMPARISON_READY
PRIMARY_CAUSE_PROPOSED
HUMAN_REVIEW_REQUIRED
CONFIRMED_FOR_ACTION
INCONCLUSIVE
DISPROVEN
CLOSED
```

### 5.1 Transition rules

- `OPEN → CANDIDATES_GENERATED` requires at least one authorized observation.
- `CANDIDATES_GENERATED → EVIDENCE_EVALUATING` requires valid candidate identities and evidence references.
- `EVIDENCE_EVALUATING → COMPARISON_READY` requires support and contradiction evaluation for every active candidate.
- `COMPARISON_READY → PRIMARY_CAUSE_PROPOSED` requires a declared comparison policy.
- `PRIMARY_CAUSE_PROPOSED → CONFIRMED_FOR_ACTION` requires policy gates and any required human review.
- Any active state may become `INCONCLUSIVE` when evidence cannot discriminate candidates safely.
- Any candidate or analysis may become `DISPROVEN` when stronger evidence invalidates the explanation.
- `CLOSED` preserves the final analysis state and history.

All transitions use optimistic concurrency.

---

## 6. Candidate Cause Categories

```text
FOUNDATIONAL_SKILL_GAP
MISCONCEPTION
PROCEDURAL_FRAGILITY
REPRESENTATION_MISMATCH
LANGUAGE_COMPREHENSION_BARRIER
SYMBOL_INTERPRETATION_GAP
STRATEGY_SELECTION_FAILURE
TRANSFER_FAILURE
ATTENTION_OR_EXECUTION_NOISE
WORKING_MEMORY_LOAD
ASSESSMENT_CONDITION_EFFECT
INSTRUCTIONAL_MISMATCH
UNKNOWN_OR_COMPOSITE
```

Categories are hypotheses, not diagnoses in a medical sense.

---

## 7. Candidate Model

```ts
interface RootCauseCandidate {
  candidateId: string;
  category: RootCauseCategory;
  anchorSkillVersionIds: string[];
  graphPathEdgeIds: string[];
  contextScope: string[];

  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  missingEvidenceRequirements: string[];

  causalStrength: CausalStrength;
  actionability: Actionability;
  confidence: DiagnosticConfidence;
  state: RootCauseCandidateState;
}
```

Candidate states:

```text
GENERATED
SUPPORTED
WEAKLY_SUPPORTED
COMPETING
CONTRADICTED
BLOCKED
REJECTED
PRIMARY
```

---

## 8. Candidate Generation

Candidate generation may use:

- direct evidence features,
- misconception classifiers,
- skill dependency paths,
- prerequisite status,
- error recurrence,
- context differences,
- intervention outcomes,
- and prior diagnostic history.

Hard rules:

1. Candidate generation must record the model or policy version used.
2. Every generated candidate must expose why it was generated.
3. Skill graph paths may suggest candidates but cannot establish them.
4. Sensitive demographic attributes must not be used as causal shortcuts.
5. At least one non-deficit or condition-based alternative should be considered when evidence permits.

---

## 9. Symptom–Cause Separation

The runtime distinguishes:

```text
SYMPTOM
PROXIMAL_CAUSE
FOUNDATIONAL_CAUSE
CONTEXTUAL_FACTOR
AMPLIFYING_FACTOR
UNKNOWN
```

Example:

```text
Symptom: incorrect solution to a word equation
Proximal cause: incorrect variable translation
Foundational cause: weak equality meaning
Contextual factor: language-heavy wording
Amplifying factor: multi-step working-memory load
```

The runtime may retain more than one level simultaneously.

---

## 10. Causal Comparison Dimensions

Each candidate is compared across independent dimensions:

```ts
interface RootCauseComparisonDimensions {
  directEvidenceSupport: number;
  contradictionPenalty: number;
  graphPlausibility: number;
  recurrenceConsistency: number;
  contextConsistency: number;
  transferConsistency: number;
  interventionResponseSupport: number;
  temporalConsistency: number;
  evidenceIndependence: number;
  alternativeExplanationPenalty: number;
}
```

A combined score may be used, but the individual dimensions must remain visible.

---

## 11. Causal Strength

```text
DIRECTLY_SUPPORTED
STRONGLY_PLAUSIBLE
PLAUSIBLE
WEAKLY_PLAUSIBLE
CONTRADICTED
INCONCLUSIVE
```

`DIRECTLY_SUPPORTED` requires direct learner evidence that discriminates the candidate from alternatives.

Graph structure alone can never produce `DIRECTLY_SUPPORTED`.

---

## 12. Alternative Explanations

The runtime must actively preserve alternative explanations.

Examples:

- performance condition effects,
- language or accessibility barriers,
- unfamiliar representation,
- temporary execution error,
- low motivation in a specific context,
- or insufficient task clarity.

A primary cause may be proposed only after material alternatives have been evaluated or explicitly marked as unresolved.

---

## 13. Discriminating Evidence

When candidates remain close, the runtime should request evidence that best separates them.

```ts
interface DiagnosticQuestion {
  questionId: string;
  targetCandidateIds: string[];
  expectedDiscrimination: string;
  requiredEvidenceType: string;
  burdenClass: 'LOW' | 'MODERATE' | 'HIGH';
  priority: number;
}
```

Examples:

- compare symbolic and visual representations,
- use a transfer task,
- isolate language complexity,
- test a prerequisite directly,
- or observe a worked solution step.

The runtime should prefer lower-burden evidence when diagnostic value is comparable.

---

## 14. Composite Causes

Some difficulties have multiple interacting causes.

```ts
interface CompositeRootCause {
  componentCandidateIds: string[];
  interactionType:
    | 'ADDITIVE'
    | 'AMPLIFYING'
    | 'CONDITIONAL'
    | 'SEQUENTIAL'
    | 'UNKNOWN';
  combinedSupportEvidenceIds: string[];
  confidence: DiagnosticConfidence;
}
```

Composite analysis must not hide uncertainty by collapsing weak candidates into one strong label.

---

## 15. Root Cause Prioritization

A candidate may be prioritized for action based on:

- causal plausibility,
- current blockage,
- remediation leverage,
- prerequisite centrality,
- expected diagnostic value,
- learner burden,
- mission relevance,
- and reversibility of the proposed action.

Priority and confidence remain separate.

A low-confidence candidate may be prioritized for a safe diagnostic probe, but not for a high-cost or high-stakes intervention.

---

## 16. Actionability

```text
READY_FOR_LOW_RISK_PROBE
READY_FOR_TARGETED_REMEDIATION
REQUIRES_HUMAN_REVIEW
REQUIRES_MORE_EVIDENCE
NOT_ACTIONABLE
```

Actionability depends on both confidence and intervention risk.

No candidate becomes actionable merely because it ranks first.

---

## 17. Human Review

Human review is required when:

- candidates remain close,
- the proposed intervention is high burden,
- accessibility or language factors may dominate,
- the result affects placement or access,
- the analysis uses sensitive evidence,
- or policy requires review.

Review records must include:

- reviewer identity,
- candidate decision,
- rationale,
- evidence inspected,
- unresolved uncertainty,
- and timestamp.

Human review may accept, reject, narrow, or request more evidence. It must not rewrite source evidence.

---

## 18. Temporal Semantics

Every analysis is bound to:

- evidence event times,
- graph version,
- skill versions,
- policy version,
- and analysis valid time.

A historical root cause analysis must resolve against the versions known at that time unless an explicit retrospective reinterpretation is requested.

Retrospective reinterpretation creates a new analysis record; it does not replace the original.

---

## 19. Failure Codes

```text
ROOT_CAUSE_ANALYSIS_NOT_FOUND
ROOT_CAUSE_VERSION_CONFLICT
ROOT_CAUSE_EVIDENCE_MISSING
ROOT_CAUSE_GRAPH_VERSION_UNAVAILABLE
ROOT_CAUSE_CANDIDATE_INVALID
ROOT_CAUSE_COMPARISON_INCOMPLETE
ROOT_CAUSE_ALTERNATIVES_UNEVALUATED
ROOT_CAUSE_REVIEW_REQUIRED
ROOT_CAUSE_POLICY_UNAVAILABLE
ROOT_CAUSE_INSUFFICIENT_DISCRIMINATION
ROOT_CAUSE_ACCESS_DENIED
```

Failures must be explicit and machine-readable.

---

## 20. Verification Gates

Before proposing a primary cause, verify:

- source evidence authority,
- candidate identity validity,
- graph path validity,
- support and contradiction coverage,
- alternative explanation evaluation,
- temporal compatibility,
- policy version availability,
- and confidence calculation traceability.

Before confirming for action, additionally verify:

- actionability policy,
- learner burden,
- required human review,
- and intervention reversibility.

---

## 21. Runtime Invariants

1. An observed error is never automatically a root cause.
2. A graph path never proves learner-specific causation.
3. The primary candidate remains a hypothesis until confirmation gates pass.
4. Supporting and contradicting evidence remain separate.
5. Material alternatives must remain visible.
6. Confidence and actionability remain separate.
7. High-burden action requires stronger evidence than low-risk probing.
8. Historical analyses are never silently rewritten.
9. Human review never rewrites source evidence.
10. `INCONCLUSIVE` is a valid final state.

---

## 22. Completion Criteria

33E is complete when the architecture defines:

- analysis identity and lifecycle,
- candidate cause model,
- symptom–cause separation,
- candidate generation,
- causal comparison dimensions,
- alternatives and discriminating evidence,
- composite causes,
- actionability and human review,
- temporal semantics,
- failure contracts,
- and enforceable runtime invariants.
