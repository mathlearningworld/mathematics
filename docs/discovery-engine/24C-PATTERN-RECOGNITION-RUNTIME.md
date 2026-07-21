# Chapter 24 — Discovery Engine Architecture

# 24C — Pattern Recognition Runtime

## Status

- Chapter: 24
- Slice: 24C
- Authority: Discovery Engine Architecture
- Scope: Pattern hypotheses, sequence recognition, variation, repetition, counterevidence, confidence, and runtime invariants

## Purpose

The Pattern Recognition Runtime identifies recurring, structured relationships across Discovery Evidence.

It does not decide that a player has mastered a mathematical concept. It recognizes that observed actions may instantiate a meaningful pattern strongly enough to justify a discovery hypothesis.

## Core Principle

> A pattern is recognized from governed structure across evidence, not from repeated animation, event count alone, or a single successful outcome.

## Runtime Position

```text
Discovery Evidence Ledger
  → Candidate Selection
    → Pattern Matching
      → Counterevidence Evaluation
        → Pattern Hypothesis
          → Concept Formation Runtime
```

## Pattern Definition

A pattern definition describes a semantic relationship that may appear across different world contexts.

```ts
interface PatternDefinition {
  patternId: string;
  version: number;
  family: string;
  requiredPredicates: string[];
  variableBindings: VariableBindingRule[];
  sequencePolicy?: SequencePolicy;
  repetitionPolicy?: RepetitionPolicy;
  variationPolicy?: VariationPolicy;
  contradictionPolicy?: ContradictionPolicy;
  minimumConfidence: number;
}
```

Examples:

- equal spacing is preserved across repeated placements,
- a quantity is partitioned into equal groups,
- two constructions preserve a constant ratio,
- a player varies one dimension while holding another constant,
- an arrangement is transformed while area remains unchanged,
- a route strategy consistently chooses a shorter valid path.

## Pattern Hypothesis

```ts
interface PatternHypothesis {
  hypothesisId: string;
  ownerId: string;
  patternId: string;
  patternVersion: number;
  evidenceRefs: string[];
  supportingContexts: PatternContext[];
  contradictingEvidenceRefs: string[];
  confidence: number;
  status: 'CANDIDATE' | 'SUPPORTED' | 'CONTRADICTED' | 'SUPERSEDED';
  revision: number;
  createdAt: string;
  updatedAt: string;
}
```

A hypothesis is not a mastery record and not a reward trigger by itself.

## Candidate Selection

The runtime should narrow evidence before matching.

Candidate selection may use:

- evidence predicates,
- entity or construction type,
- spatial relation,
- activity context,
- simulation-time window,
- learner identity,
- assistance context,
- relevant concept family.

Candidate selection is an optimization boundary and must not alter semantic outcomes.

## Structural Matching

Pattern matching binds variables across evidence.

Example:

```text
Evidence A: spacing(block1, block2) = 32
Evidence B: spacing(block2, block3) = 32
Evidence C: spacing(block3, block4) = 32

→ Candidate pattern: uniform interval
```

The matcher must operate on normalized semantic values, not pixel coincidence.

## Sequence Recognition

Some patterns depend on order.

```ts
interface SequencePolicy {
  orderedPredicates: string[];
  allowInterleaving: boolean;
  maximumGap?: number;
  resetPredicates?: string[];
}
```

Examples:

- estimate → measure → revise,
- build → compare → adjust,
- group → count groups → infer total,
- attempt → detect contradiction → change strategy.

The runtime must not combine unrelated actions merely because they occurred close in time.

## Repetition

Repetition strengthens a pattern only when repeated evidence is meaningfully independent.

Three duplicate events from one retried mutation do not count as three observations.

Repeated actions may be discounted when they share:

- the same source mutation,
- identical copied state,
- one scripted automation,
- one uninterrupted mechanical loop without decision variation.

## Variation

Variation is important because discovery should generalize beyond one exact arrangement.

```ts
interface VariationPolicy {
  requiredDimensions: string[];
  minimumDistinctContexts: number;
  allowedConstants?: string[];
  transferRequired?: boolean;
}
```

Variation dimensions may include:

- object size,
- quantity,
- orientation,
- spatial region,
- visual appearance,
- tool used,
- representation,
- mission context.

## Invariance Recognition

A powerful discovery signal is recognizing what remains unchanged while something else changes.

Examples:

- area remains constant after rearrangement,
- ratio remains constant across scale,
- total remains constant after regrouping,
- symmetry remains after reflection,
- distance changes predictably with repeated equal steps.

The runtime should preserve both changed and invariant variables in the hypothesis.

## Counterevidence

Pattern recognition must actively search for contradictory evidence.

Examples:

- equal spacing occurs once but becomes inconsistent when orientation changes,
- a ratio is preserved only when a hint overlay is visible,
- grouping succeeds for one quantity but fails under transfer,
- a strategy produces success accidentally and is not repeated.

Counterevidence may:

- lower confidence,
- keep a hypothesis at candidate status,
- mark it contradicted,
- reveal a narrower boundary condition.

## Accidental Success

A successful world outcome is not automatically evidence of pattern recognition.

The runtime should consider:

- whether the player made a meaningful choice,
- whether alternatives existed,
- whether success came from automation,
- whether the behavior transfers,
- whether the player corrected errors consistently,
- whether hints revealed the governing rule.

## Context Independence

A supported pattern should record the contexts in which it appeared.

```ts
interface PatternContext {
  contextId: string;
  worldRegion?: string;
  activityType?: string;
  representation?: string;
  variableSignature: string;
  assistanceLevel: number;
}
```

This allows later systems to distinguish narrow procedural familiarity from broader discovery.

## Confidence

Pattern confidence may combine:

- evidence quality,
- structural fit,
- independent repetition,
- variation,
- transfer,
- contradiction rate,
- assistance level,
- temporal stability.

Confidence must be explainable through a breakdown.

```ts
interface PatternConfidenceBreakdown {
  evidenceQuality: number;
  structuralFit: number;
  independence: number;
  variation: number;
  transfer: number;
  contradictionPenalty: number;
  assistanceAdjustment: number;
}
```

## Thresholds

Thresholds govern runtime status, not educational judgment.

```text
Below candidate threshold     → no durable hypothesis
Candidate threshold reached   → CANDIDATE
Support threshold reached     → SUPPORTED
Contradiction threshold       → CONTRADICTED
```

Threshold definitions must be versioned per pattern family.

## Incremental Evaluation

Pattern recognition should update incrementally when new evidence arrives.

```text
New Evidence
  → Find Relevant Hypotheses
    → Rebind Variables
      → Recalculate Support and Contradiction
        → Persist Revision
```

Full-history reevaluation may be used for migration, audit, or model-version changes.

## Pattern Families

Potential families include:

- repetition and sequence,
- grouping and partitioning,
- equivalence and conservation,
- proportion and scaling,
- ordering and comparison,
- spatial transformation,
- symmetry,
- measurement and unitization,
- dependency and cause,
- optimization and strategy.

Pattern families organize definitions but must not hard-code curriculum grade boundaries.

## Boundary with Machine Learning

The initial architecture should prefer deterministic, explainable pattern rules for high-value educational evidence.

Statistical or machine-learning models may assist candidate ranking later, but they must not become untraceable authority over discovery claims.

Any model-assisted result should record:

- model identity and version,
- input evidence references,
- confidence,
- explanation or feature summary,
- fallback behavior,
- human-review policy where required.

## Persistence and Replay

Pattern hypotheses must be replayable from:

- evidence ledger state,
- pattern definition version,
- evaluation policy version,
- governed ordering.

A definition upgrade must create an explicit re-evaluation result rather than rewriting historical meaning silently.

## Observability

Telemetry should expose:

- candidates evaluated,
- hypotheses created,
- support transitions,
- contradiction transitions,
- average evidence count,
- context diversity,
- duplicate suppression,
- evaluation latency,
- definition-version distribution,
- replay divergence.

## Runtime Invariants

1. Repeated event delivery cannot strengthen a pattern.
2. One successful outcome cannot prove a general pattern by itself.
3. Matching uses normalized semantic facts rather than visual coincidence.
4. Sequence boundaries are explicit.
5. Variation and context are preserved.
6. Counterevidence is evaluated and retained.
7. Assistance context influences interpretation without erasing evidence.
8. Pattern hypotheses do not equal mastery.
9. Definition and threshold versions are preserved.
10. Model-assisted recognition cannot become unexplained authority.

## Verification Targets

Verification must cover:

- variable binding,
- ordered sequences,
- interleaved unrelated events,
- duplicate evidence,
- repeated but non-independent behavior,
- context variation,
- transfer evidence,
- contradiction handling,
- accidental success,
- replay after definition version changes.

## Architectural Outcome

This slice establishes explainable pattern recognition over durable discovery evidence.

It allows the system to detect meaningful regularity, variation, invariance, and strategy without confusing repetition with understanding or statistical confidence with educational truth.