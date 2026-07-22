# 33C — Diagnostic Inference Runtime

## 1. Purpose

Diagnostic Inference Runtime evaluates admissible evidence against authorized skill, prerequisite, curriculum, and progress context to produce explainable diagnostic hypotheses.

Its role is not to discover a single hidden truth at any cost. Its role is to compare plausible explanations, expose uncertainty, identify missing evidence, and recommend the smallest safe next step.

---

## 2. Core Runtime Law

> Inference must remain proportional to evidence. The runtime may rank hypotheses, but it must never erase alternatives, conceal contradiction, or present probability as certainty.

---

## 3. Authority Boundary

Diagnostic Inference Runtime may:

- evaluate evidence patterns;
- traverse authorized prerequisite paths;
- generate candidate hypotheses;
- score support and contradiction;
- compare alternative explanations;
- calculate confidence;
- mark a case inconclusive;
- request targeted evidence;
- recommend a diagnostic or remediation target.

It must not:

- mutate source evidence;
- modify Skill Graph authority;
- create curriculum alignment;
- declare learner mastery;
- write progress state directly;
- convert statistical correlation into causal authority;
- issue medical or psychological diagnoses;
- suppress a plausible alternative merely because one hypothesis ranks first.

---

## 4. Inference Request

```ts
interface DiagnosticInferenceRequest {
  requestId: string
  tenantId: string
  learnerId: string
  diagnosticCaseId: string
  targetSkillVersionIds: string[]
  evidenceWindowId: string
  graphVersionId: string
  curriculumVersionId?: string
  progressSnapshotVersion?: string
  inferencePolicyVersion: string
  requestedAt: string
  requestedBy: string
}
```

Every inference is reproducible only when all referenced versions remain available.

---

## 5. Inference Pipeline

```text
1. Validate request authority
2. Resolve evidence window
3. Verify evidence admissibility
4. Resolve target skill meanings
5. Resolve authorized prerequisite neighborhood
6. Extract diagnostic features
7. Generate candidate hypotheses
8. Evaluate supporting evidence
9. Evaluate contradicting evidence
10. Compare alternatives
11. Calculate confidence and uncertainty
12. Apply safety and policy gates
13. Produce hypothesis set
14. Recommend next evidence or action
15. Persist inference event and audit record
```

A pipeline stage may stop with `INCONCLUSIVE` or `BLOCKED`. It must not manufacture downstream output after a blocking failure.

---

## 6. Candidate Hypothesis Generation

Candidates may come from:

- direct error patterns;
- repeated procedural breakdown;
- prerequisite-path inspection;
- representation-specific differences;
- transfer failure;
- pre/post-intervention comparison;
- historical instability;
- stale knowledge patterns;
- teacher-confirmed observations;
- contradictory performance contexts.

Candidate generation must record why each hypothesis was created.

```ts
interface CandidateHypothesis {
  candidateId: string
  type: DiagnosticHypothesisType
  targetSkillVersionId: string
  suspectedCauseSkillVersionIds: string[]
  generationReasons: string[]
  graphPathIds: string[]
  policyRuleIds: string[]
}
```

---

## 7. Inference Features

Feature extraction may include:

```text
ERROR_PATTERN_FREQUENCY
ERROR_PATTERN_STABILITY
CORRECTNESS_CONSISTENCY
PROCEDURAL_STEP_BREAKDOWN
REPRESENTATION_VARIANCE
TRANSFER_VARIANCE
HINT_DEPENDENCE
LATENCY_SHIFT
REACTIVATION_PATTERN
PREREQUISITE_COVERAGE
INTERVENTION_RESPONSE
CONTRADICTION_DENSITY
EVIDENCE_FRESHNESS
EVIDENCE_DIVERSITY
ITEM_COVERAGE
```

Features must retain source evidence IDs. A feature value without traceable evidence is not admissible for authoritative inference.

---

## 8. Support and Contradiction

Each hypothesis must maintain separate support and contradiction ledgers.

```ts
interface HypothesisEvidenceAssessment {
  hypothesisId: string
  supporting: EvidenceContribution[]
  contradicting: EvidenceContribution[]
  neutral: EvidenceContribution[]
  unresolved: EvidenceContribution[]
}
```

The runtime must not compute confidence from supporting evidence alone.

Examples of contradiction:

- target skill succeeds reliably in an independent transfer context;
- suspected prerequisite is demonstrated directly and recently;
- proposed misconception disappears under equivalent wording;
- intervention targeting the suspected cause has no effect;
- another hypothesis explains the evidence with fewer unsupported assumptions.

---

## 9. Alternative Hypotheses

The output must support multiple active hypotheses.

```text
PRIMARY
PLAUSIBLE_ALTERNATIVE
LOW_SUPPORT_ALTERNATIVE
CONTRADICTED
INSUFFICIENT_EVIDENCE
REJECTED_BY_POLICY
```

`PRIMARY` means best-supported among evaluated candidates. It does not mean proven.

The system should prefer a smaller, more testable hypothesis over a broader explanation when both fit current evidence similarly.

---

## 10. Prerequisite Path Use

Skill Graph paths may narrow investigation but do not prove learner causation.

Path evaluation must expose:

- graph version;
- edge identities;
- relationship types;
- edge authority and provenance;
- path depth;
- contextual conditions;
- alternate paths;
- deprecated or approximate mappings.

Rules:

1. Hard prerequisite paths may strengthen plausibility but still require learner evidence.
2. Soft prerequisites cannot be treated as mandatory blockers.
3. Curriculum sequence cannot substitute for a graph edge.
4. Long paths require stronger evidence than direct paths.
5. Contextual paths apply only when their conditions match.
6. Cycles or unresolved graph states block path-based inference.

---

## 11. Confidence Calculation

Confidence is computed from inspectable factors.

```ts
interface DiagnosticConfidenceAssessment {
  level: DiagnosticConfidence
  supportStrength: number
  contradictionStrength: number
  evidenceQuality: number
  evidenceDiversity: number
  pathAuthority: number
  temporalRelevance: number
  interventionConfirmation: number
  alternativeSeparation: number
  uncertaintyReasons: string[]
  policyVersion: string
}
```

No single factor may silently dominate unless the policy explicitly declares and justifies it.

High confidence requires, at minimum:

- admissible evidence;
- adequate target-skill coverage;
- direct evidence for the suspected cause or a validated intervention response;
- limited unresolved contradiction;
- valid version bindings;
- no blocking safety or authority violations.

---

## 12. Inference Outcomes

```text
HYPOTHESIS_SUPPORTED
HYPOTHESIS_SUPPORTED_WITH_WARNINGS
MULTIPLE_PLAUSIBLE_HYPOTHESES
MORE_EVIDENCE_REQUIRED
CONTRADICTORY_EVIDENCE
NO_CURRENT_BLOCKER_DETECTED
INCONCLUSIVE
BLOCKED
```

`NO_CURRENT_BLOCKER_DETECTED` is scoped to the inspected evidence window and target skills.

---

## 13. Evidence Requests

When confidence is insufficient, the runtime should request the smallest discriminating evidence set.

```ts
interface DiagnosticEvidenceRequest {
  evidenceRequestId: string
  diagnosticCaseId: string
  purpose: string
  candidateHypothesisIds: string[]
  requestedSkillVersionIds: string[]
  requestedEvidenceTypes: DiagnosticEvidenceType[]
  requiredContexts: string[]
  stopConditions: string[]
  expiryAt?: string
}
```

Examples:

- one transfer task separating procedural recall from conceptual understanding;
- a direct prerequisite probe;
- the same mathematical structure with reduced language load;
- a pre/post-hint comparison;
- a delayed reactivation item;
- a teacher observation during a specific step.

The runtime should avoid unnecessary testing when existing evidence already supports a safe action.

---

## 14. Intervention Confirmation

A remediation outcome may strengthen or weaken a hypothesis.

```text
CONFIRMED_BY_TARGETED_IMPROVEMENT
PARTIALLY_SUPPORTED
NO_MEANINGFUL_CHANGE
CONTRADICTED_BY_OUTCOME
OUTCOME_INCONCLUSIVE
```

Improvement after intervention is not automatically causal proof. The runtime must consider practice effects, item similarity, hints, and time.

---

## 15. Understanding Debt Inference

A possible understanding-debt signal may be produced when:

- the target difficulty is repeated or materially blocking;
- one or more prerequisite gaps are plausible;
- the prerequisite relationship is authorized;
- learner-specific evidence supports the gap;
- contradictory evidence does not dominate;
- the signal includes confidence and review conditions.

The signal must distinguish:

```text
LOCALIZED
BRANCHING
CASCADING
REACTIVATION
CONTEXT_SPECIFIC
UNRESOLVED
```

Debt severity must not be used as a moral or comparative learner score.

---

## 16. Policy Versioning

Inference policy controls:

- candidate-generation rules;
- minimum evidence thresholds;
- confidence thresholds;
- contradiction treatment;
- path-depth limits;
- evidence freshness;
- human confirmation requirements;
- sensitive-context restrictions;
- action eligibility.

A material policy change creates a new policy version. Historical inference remains bound to the version originally used.

---

## 17. Commands

```text
RunDiagnosticInference
ReevaluateDiagnosticHypotheses
RequestDiscriminatingEvidence
AcceptHumanDiagnosticReview
RecordDiagnosticDissent
InvalidateStaleHypothesis
ResolveDiagnosticCase
MarkDiagnosticCaseInconclusive
```

Commands require actor, tenant, learner, case, correlation, command, policy, and expected aggregate version identities.

---

## 18. Events

```text
DiagnosticInferenceRequested
DiagnosticInferenceStarted
CandidateHypothesisGenerated
HypothesisEvidenceEvaluated
DiagnosticHypothesisActivated
DiagnosticAlternativeRetained
DiagnosticEvidenceRequested
DiagnosticHypothesisConfidenceChanged
DiagnosticHypothesisInvalidated
DiagnosticCaseResolved
DiagnosticCaseMarkedInconclusive
DiagnosticInferenceBlocked
```

Event history must preserve previous hypotheses and confidence changes.

---

## 19. Failure Codes

```text
DIAGNOSTIC_CASE_NOT_FOUND
INFERENCE_REQUEST_ALREADY_PROCESSED
EVIDENCE_WINDOW_NOT_FOUND
NO_ADMISSIBLE_EVIDENCE
TARGET_SKILL_NOT_FOUND
GRAPH_VERSION_NOT_FOUND
INVALID_PREREQUISITE_PATH
INFERENCE_POLICY_NOT_FOUND
INFERENCE_POLICY_BLOCKED
HYPOTHESIS_NOT_FOUND
HYPOTHESIS_STALE
UNRESOLVED_VERSION_MAPPING
AUTHORITY_BOUNDARY_VIOLATION
CONCURRENT_MODIFICATION
```

---

## 20. Explainability Contract

Every projected hypothesis must answer:

1. What was observed?
2. What is inferred?
3. Which evidence supports it?
4. Which evidence contradicts it?
5. Which graph relationships were used?
6. How confident is the runtime?
7. Why is confidence not higher?
8. What alternative explanations remain?
9. What evidence would distinguish them?
10. When should the hypothesis be reviewed or expire?

An explanation that cannot answer these questions is not sufficient for authoritative diagnostic use.

---

## 21. Runtime Invariants

1. Candidate generation and hypothesis confirmation are distinct.
2. Supporting and contradicting evidence remain separate and visible.
3. A primary hypothesis is not a proven fact.
4. Graph paths inform plausibility but never independently establish learner causation.
5. Confidence is proportional to admissible evidence and exposed uncertainty.
6. Multiple plausible hypotheses may remain active.
7. `INCONCLUSIVE` is never silently promoted to success.
8. Historical inference remains bound to evidence, graph, curriculum, progress, and policy versions.
9. Recommended actions preserve hypothesis uncertainty.
10. Diagnostic inference cannot directly mutate mastery or progress.
11. Understanding debt remains a reversible signal, not a learner identity.
12. The runtime prefers discriminating evidence over broad repeated testing.
