# 26E — Misconception Assessment Runtime

## Status

- Chapter: 26 — Assessment Engine Architecture
- Slice: 26E
- State: MISCONCEPTION RUNTIME DEFINED
- Depends on: 26A Assessment Engine Foundation, 26B Assessment Evidence Runtime, 26C Assessment Model Runtime, 26D Readiness Evaluation Runtime

---

## 1. Purpose

The Misconception Assessment Runtime identifies, tests, classifies, and tracks plausible misconception hypotheses from learner evidence.

It does not equate an incorrect answer with a misconception. A misconception is a bounded explanatory hypothesis supported by repeated, patterned, or strategically meaningful evidence.

---

## 2. Runtime Position

```text
Assessment Evidence Set
+ Error and Strategy Evidence
+ Learning State
+ Knowledge Graph
+ Misconception Policy
        ↓
Misconception Assessment Runtime
        ↓
Misconception Hypotheses
        ↓
Validated / Uncertain / Rejected Claims
+ Recovery Evidence Requirements
```

---

## 3. Core Principle

The runtime asks:

> What coherent idea or rule may explain this learner's observed pattern, and how strong is the evidence for that explanation?

It must not ask:

> Which label should be attached to the learner because an answer was wrong?

---

## 4. Authority Boundary

The runtime owns:

- error-pattern normalization,
- misconception candidate generation,
- hypothesis comparison,
- evidence-for and evidence-against analysis,
- representation and context localization,
- confidence classification,
- misconception supersession and resolution tracking,
- recovery evidence requirements.

It does not own:

- raw event truth,
- diagnosis of medical or psychological conditions,
- learning-state mutation,
- direct remediation scheduling,
- recommendation ranking,
- punitive progression decisions,
- permanent learner labeling.

---

## 5. Error Is Not Misconception

An error may arise from:

```text
ACCIDENTAL_SLIP
ATTENTION_LAPSE
LANGUAGE_MISREADING
INTERFACE_CONFUSION
MEMORY_RETRIEVAL_FAILURE
PROCEDURAL_BREAKDOWN
REPRESENTATION_MISMATCH
INCOMPLETE_KNOWLEDGE
UNSTABLE_STRATEGY
SYSTEMATIC_MISCONCEPTION
UNKNOWN_CAUSE
```

Only evidence that supports a stable explanatory pattern may justify a misconception claim.

---

## 6. Misconception Hypothesis

```ts
export interface MisconceptionHypothesis {
  hypothesisId: string;
  learnerId: string;
  conceptScope: string[];
  misconceptionCode: string;
  descriptionCode: string;
  candidateRule: string;
  representationScope: string[];
  contextScope: string[];
  supportingEvidenceRefs: string[];
  contradictingEvidenceRefs: string[];
  alternativeHypothesisIds: string[];
  status:
    | 'CANDIDATE'
    | 'SUPPORTED'
    | 'STRONGLY_SUPPORTED'
    | 'UNCERTAIN'
    | 'CONTRADICTED'
    | 'RESOLVING'
    | 'RESOLVED'
    | 'REJECTED';
  confidence: number;
  modelVersion: string;
  policyVersion: string;
}
```

---

## 7. Misconception Taxonomy

Taxonomy categories may include:

```text
CONCEPT_SUBSTITUTION
OVERGENERALIZED_RULE
UNDERGENERALIZED_RULE
INVERSE_RELATION_CONFUSION
OPERATION_SELECTION_ERROR
EQUALITY_MISINTERPRETATION
PLACE_VALUE_MISCONCEPTION
FRACTION_MAGNITUDE_MISCONCEPTION
PROPORTIONAL_REASONING_MISCONCEPTION
SIGN_AND_DIRECTION_CONFUSION
VARIABLE_MEANING_CONFUSION
REPRESENTATION_TRANSLATION_FAILURE
PROCEDURE_WITHOUT_CONCEPT
CONTEXT_TRIGGERED_MISAPPLICATION
NEGATIVE_TRANSFER
STRATEGY_FIXATION
```

Taxonomy entries are versioned and may be curriculum-specific, but claims must preserve their conceptual meaning across projections.

---

## 8. Evidence Pattern

```ts
export interface MisconceptionPattern {
  patternId: string;
  requiredObservations: number;
  minimumContextDiversity: number;
  minimumRepresentationDiversity: number;
  temporalWindow?: string;
  expectedErrorFeatures: string[];
  expectedStrategyFeatures: string[];
  disconfirmingFeatures: string[];
  compatibleConceptScopes: string[];
}
```

A pattern definition is a search aid, not an automatic verdict.

---

## 9. Candidate Generation

```text
Normalize Error and Strategy Evidence
        ↓
Extract Observable Features
        ↓
Match Candidate Patterns
        ↓
Generate Competing Hypotheses
        ↓
Collect Supporting and Disconfirming Evidence
```

Multiple hypotheses may remain active when evidence cannot distinguish among them.

---

## 10. Competing Hypotheses

Example:

```text
Observed:
Learner writes 3 + 4 for a repeated-grouping problem.

Possible explanations:
A. operation-selection misconception
B. language parsing failure
C. accidental slip
D. interface action mismatch
E. incomplete multiplication concept
```

The runtime must preserve alternatives until evidence supports discrimination.

---

## 11. Representation Scope

Misconceptions may be representation-specific.

```text
Objects: stable
Diagram: emerging
Words: unstable
Symbols: systematically reversed
```

The runtime must not generalize a symbolic misconception to all understanding when other representations contradict that conclusion.

---

## 12. Context Scope

Misconceptions may appear only under particular contexts:

```text
TIME_PRESSURE
HIGH_LANGUAGE_DENSITY
UNFAMILIAR_CONTEXT
MULTI_STEP_TASK
NO_VISUAL_SUPPORT
NEGATIVE_NUMBERS
FRACTION_COMPARISON
WORD_TO_EQUATION_TRANSLATION
```

Context scope is part of claim meaning.

---

## 13. Confidence Evaluation

Confidence considers:

- recurrence,
- consistency,
- temporal stability,
- context diversity,
- representation diversity,
- strategy evidence,
- evidence provenance,
- alternative explanations,
- disconfirming evidence,
- support conditions,
- successful recovery behavior.

Confidence must not be derived from error count alone.

---

## 14. Misconception Claim

```ts
export interface MisconceptionClaim {
  misconceptionClaimId: string;
  learnerId: string;
  hypothesisId: string;
  misconceptionCode: string;
  classification:
    | 'POSSIBLE'
    | 'PROBABLE'
    | 'STRONGLY_SUPPORTED'
    | 'CONTEXT_BOUND'
    | 'REPRESENTATION_BOUND'
    | 'RESOLVING'
    | 'RESOLVED'
    | 'NOT_SUPPORTED';
  conceptScope: string[];
  representationScope: string[];
  contextScope: string[];
  confidence: number;
  supportingEvidenceRefs: string[];
  contradictingEvidenceRefs: string[];
  alternativeHypotheses: string[];
  recoveryEvidenceRequirements: string[];
  evidenceSetId: string;
  modelVersion: string;
  policyVersion: string;
  createdAt: string;
  reviewAfter?: string;
  supersedesClaimId?: string;
}
```

---

## 15. Claim Thresholds

### POSSIBLE

A coherent explanation exists, but evidence is too limited for instructional reliance.

### PROBABLE

The pattern repeats and is more plausible than alternatives, but important uncertainty remains.

### STRONGLY_SUPPORTED

The pattern is stable, discriminated from alternatives, and supported across policy-required evidence.

### CONTEXT_BOUND

The pattern is supported only in specified contexts.

### REPRESENTATION_BOUND

The pattern is supported only in specified representations.

### RESOLVING

Recent evidence contradicts the prior pattern, but stability is not yet established.

### RESOLVED

Sufficient independent evidence shows the pattern no longer governs performance within the claim scope.

---

## 16. Negative Transfer

Negative transfer receives explicit treatment.

```text
Prior Valid Strategy
        ↓
Applied Beyond Valid Scope
        ↓
Systematic Error Pattern
        ↓
NEGATIVE_TRANSFER Hypothesis
```

This distinction matters because the learner may possess useful prior knowledge that needs boundary refinement, not replacement.

---

## 17. Recovery Evidence

The runtime identifies what evidence would confirm improvement or resolution.

```ts
export interface RecoveryEvidenceRequirement {
  requirementId: string;
  conceptScope: string[];
  representation: string;
  context: string;
  supportCondition: string;
  minimumIndependentSuccesses: number;
  requiredErrorRecovery?: boolean;
  maximumAge?: string;
}
```

Recovery evidence is not itself a recommendation. It becomes an input to downstream recommendation or mission design.

---

## 18. Resolution Tracking

A misconception is not resolved by one correct answer.

Resolution may require:

- independent success,
- multiple contexts,
- multiple representations,
- delayed retention evidence,
- explanation or strategy evidence,
- resistance to the former error trigger,
- successful self-correction.

Historical claims remain available after resolution.

---

## 19. Readiness Interaction

Misconception claims may affect readiness only through explicit readiness policy.

```text
Misconception Claim
        ↓
Readiness Policy Mapping
        ↓
Blocking Risk / Non-Blocking Risk / No Effect
```

A possible misconception must not automatically block progression.

---

## 20. Recommendation Interaction

The runtime may publish:

- misconception scope,
- confidence,
- evidence gaps,
- safe challenge boundaries,
- recovery evidence requirements,
- unsuitable task patterns.

Recommendation Runtime remains responsible for choosing the next opportunity.

---

## 21. Human Observation

Teacher, parent, or mentor observations may contribute context, but they must be marked by provenance and cannot silently override runtime evidence.

```text
HUMAN_OBSERVATION
HUMAN_INTERPRETATION
SYSTEM_EVIDENCE
SYSTEM_HYPOTHESIS
```

These categories remain distinct.

---

## 22. Sensitive Language Policy

Projections must avoid identity labels such as:

```text
bad at fractions
weak learner
careless child
cannot understand algebra
```

Preferred language is scoped and evidence-based:

```text
Current evidence suggests the learner often compares fraction denominators directly when visual support is absent.
```

---

## 23. Deterministic Evaluation

For identical:

- evidence set,
- taxonomy version,
- pattern version,
- model version,
- policy version,
- knowledge graph version,

the runtime must produce equivalent hypotheses and classifications.

---

## 24. Failure Codes

```text
MISCONCEPTION_EVIDENCE_SET_INVALID
MISCONCEPTION_TAXONOMY_NOT_FOUND
MISCONCEPTION_PATTERN_VERSION_MISMATCH
MISCONCEPTION_SCOPE_INVALID
MISCONCEPTION_HYPOTHESIS_CONFLICT
MISCONCEPTION_MODEL_FAILURE
MISCONCEPTION_RESULT_NON_DETERMINISTIC
MISCONCEPTION_RESOLUTION_EVIDENCE_INSUFFICIENT
MISCONCEPTION_PROVENANCE_INVALID
```

Runtime failures must not be projected as learner misconceptions.

---

## 25. Invariants

1. Incorrect performance alone cannot create a misconception claim.
2. Every claim is scoped by concept, representation, and context where applicable.
3. Supporting and contradicting evidence remain visible.
4. Competing hypotheses are preserved until discriminated.
5. Confidence is not based on error count alone.
6. Human observations retain provenance.
7. Misconception claims cannot mutate learning state.
8. Misconception claims cannot directly schedule remediation.
9. Resolution requires policy-defined recovery evidence.
10. Historical claims are immutable.
11. New evaluation supersedes rather than rewrites prior claims.
12. Runtime failure cannot become a learner label.

---

## 26. Verification Scenarios

Required scenarios include:

- isolated accidental error,
- repeated stable pattern,
- language parsing failure that resembles concept error,
- representation-bound misconception,
- context-bound misconception,
- negative transfer,
- competing plausible hypotheses,
- strong disconfirming evidence,
- support-dependent disappearance of error,
- partial recovery,
- delayed resolution evidence,
- deterministic reevaluation,
- human observation with conflicting system evidence.

---

## 27. Completion Criteria

26E is complete when:

- errors and misconceptions are formally separated,
- candidate and competing hypotheses are represented,
- taxonomy and pattern versions are explicit,
- representation and context scope are preserved,
- confidence uses evidence quality and alternatives,
- recovery evidence and resolution semantics are defined,
- downstream readiness and recommendation boundaries are explicit,
- historical claims remain explainable and auditable.

---

## 28. Architectural Outcome

The Misconception Assessment Runtime turns repeated errors into careful, testable explanations rather than permanent labels.

It enables the platform to respond to the learner's actual reasoning pattern, while preserving uncertainty, alternative explanations, and the evidence required to demonstrate recovery.
