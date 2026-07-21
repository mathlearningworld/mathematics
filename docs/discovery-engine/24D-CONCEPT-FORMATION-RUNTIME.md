# Chapter 24 — Discovery Engine Architecture

# 24D — Concept Formation Runtime

## Status

- Chapter: 24
- Slice: 24D
- Authority: Discovery Engine Architecture
- Scope: Concept hypotheses, abstraction, boundary conditions, transfer, misconception signals, explanation lineage, and runtime invariants

## Purpose

The Concept Formation Runtime transforms supported pattern hypotheses into structured concept hypotheses that higher-level learning systems may interpret.

It answers a narrow architectural question:

> What broader idea may explain the patterns the player has repeatedly produced or recognized across varied world contexts?

It does not declare mastery, assign grades, or decide curriculum completion.

## Core Principle

> A concept hypothesis must emerge from multiple related patterns, preserved context, and explicit boundary evidence; it must never be inferred from one label, one mission completion, or one successful construction.

## Runtime Position

```text
Supported Pattern Hypotheses
  → Concept Candidate Mapping
    → Abstraction Evaluation
      → Boundary and Counterexample Evaluation
        → Concept Hypothesis
          → Discovery Progression / Learning Engine
```

## Concept Definition

A concept definition describes a semantic idea independently from one visual representation or curriculum label.

```ts
interface ConceptDefinition {
  conceptId: string;
  version: number;
  family: string;
  requiredPatternFamilies: string[];
  optionalPatternFamilies?: string[];
  boundaryRules: ConceptBoundaryRule[];
  transferPolicy: ConceptTransferPolicy;
  contradictionPolicy: ConceptContradictionPolicy;
  relatedConceptRefs: ConceptRelationRef[];
}
```

Examples:

- equal groups,
- unit iteration,
- conservation of quantity,
- proportional relationship,
- equivalence,
- symmetry,
- area preservation,
- variable dependence,
- inverse relationship.

## Concept Hypothesis

```ts
interface ConceptHypothesis {
  hypothesisId: string;
  ownerId: string;
  conceptId: string;
  conceptVersion: number;
  supportingPatternRefs: string[];
  contradictingEvidenceRefs: string[];
  representations: string[];
  contexts: string[];
  boundaryState: 'UNKNOWN' | 'PARTIAL' | 'SUPPORTED' | 'CONTRADICTED';
  transferState: 'UNTESTED' | 'NARROW' | 'TRANSFERRED' | 'FAILED';
  confidence: number;
  status: 'CANDIDATE' | 'SUPPORTED' | 'CONTRADICTED' | 'SUPERSEDED';
  revision: number;
  createdAt: string;
  updatedAt: string;
}
```

## Abstraction

Abstraction identifies common structure across different pattern instances.

Example:

```text
Equal spacing of blocks
Repeated equal movement steps
Repeated unit marks on a measuring line

→ Candidate abstraction: iteration of a constant unit
```

The runtime must preserve the source representations so later systems can explain how the abstraction was formed.

## Representation Independence

A concept becomes stronger when the same relationship appears in varied representations.

Possible representations include:

- spatial construction,
- grouped objects,
- movement paths,
- symbolic notation,
- number line,
- measurement tool,
- table or graph,
- verbal explanation,
- collaborative demonstration.

A concept definition must not equate one representation with the concept itself.

## Boundary Conditions

Concept formation requires evidence about where a relationship applies and where it does not.

Examples:

- equal spacing requires a constant interval,
- proportional scaling requires both quantities to change consistently,
- area preservation may hold under rearrangement but not arbitrary resizing,
- symmetry depends on a governed axis or center.

```ts
interface ConceptBoundaryRule {
  ruleId: string;
  condition: string;
  expectedRelation: string;
  requiredEvidenceTypes: string[];
}
```

Boundary evidence protects the system from overgeneralizing accidental patterns.

## Counterexamples

Counterexamples are valuable discovery evidence.

A contradiction may show that:

- the candidate concept is too broad,
- a boundary condition is missing,
- the learner is applying a rule mechanically,
- two concepts are being confused,
- a representation is misleading.

Counterexamples should refine or narrow a hypothesis rather than merely subtracting points.

## Concept Relations

Concepts form a graph rather than a flat checklist.

```ts
interface ConceptRelationRef {
  targetConceptId: string;
  relationType:
    | 'PREREQUISITE'
    | 'GENERALIZES'
    | 'SPECIALIZES'
    | 'EQUIVALENT_VIEW'
    | 'CONTRASTS_WITH'
    | 'APPLIES_TO';
  strength: number;
}
```

The runtime may use concept relations to find candidate abstractions, but relation existence alone cannot create evidence.

## Transfer

Transfer asks whether a discovered relationship survives a meaningful change of context.

```ts
interface ConceptTransferPolicy {
  requiredContextDimensions: string[];
  minimumDistinctRepresentations: number;
  minimumDistinctContexts: number;
  delayedTransferRequired?: boolean;
}
```

Examples:

- use equal grouping with different objects and quantities,
- preserve a ratio in construction and movement,
- identify symmetry in buildings and natural forms,
- apply conservation after a delayed return to the world.

## Narrow Procedural Familiarity

The runtime must distinguish concept formation from memorized workflow.

Signals of narrow familiarity include:

- success only with one object skin,
- success only in one mission layout,
- dependence on one highlighted socket,
- repeated copying without meaningful choice,
- failure when orientation or representation changes.

Such evidence may support a narrow hypothesis while keeping transfer state untested or failed.

## Misconception Signals

The runtime may produce structured misconception candidates when evidence shows a stable but incorrect generalization.

```ts
interface MisconceptionSignal {
  signalId: string;
  ownerId: string;
  candidateType: string;
  relatedConceptIds: string[];
  supportingEvidenceRefs: string[];
  contradictingEvidenceRefs: string[];
  confidence: number;
  status: 'PROVISIONAL' | 'CORROBORATED' | 'RESOLVED';
}
```

Examples:

- larger perimeter always means larger area,
- multiplication always makes a number larger,
- equal-looking shapes must have equal area,
- the denominator counts selected pieces rather than equal total parts.

Misconception signals are not labels attached permanently to a learner.

## Explanation Lineage

Every concept hypothesis should be explainable through a chain.

```text
Concept Hypothesis
  ← Supported Pattern Hypotheses
    ← Discovery Evidence
      ← Authoritative World Events
```

The runtime must be able to answer:

- what patterns supported the concept,
- in which representations,
- under what assistance level,
- what contradictions remain,
- which boundaries were tested,
- which definition versions were used.

## Confidence

Concept confidence may combine:

- pattern quality,
- representation diversity,
- context diversity,
- transfer evidence,
- boundary evidence,
- contradiction rate,
- temporal stability,
- assistance context.

```ts
interface ConceptConfidenceBreakdown {
  patternSupport: number;
  representationDiversity: number;
  contextDiversity: number;
  transferStrength: number;
  boundarySupport: number;
  contradictionPenalty: number;
  assistanceAdjustment: number;
  temporalStability: number;
}
```

Confidence remains a property of the hypothesis, not a permanent rating of the learner.

## Status Transitions

```text
No candidate
  → CANDIDATE
    → SUPPORTED

CANDIDATE or SUPPORTED
  → CONTRADICTED

Any state
  → SUPERSEDED by a new definition or more precise hypothesis
```

Transitions must preserve the previous hypothesis and reason.

## Boundary with Curriculum

Concept definitions are semantic and should not be owned by grade-level curriculum mapping.

Curriculum systems may map a concept to:

- grade expectations,
- national standards,
- prerequisite pathways,
- assessment targets.

Those mappings must not redefine the concept or fabricate discovery evidence.

## Boundary with Learning Engine

Concept Formation Runtime provides hypotheses and evidence lineage.

Learning Engine may later evaluate:

- mastery,
- retention,
- readiness,
- remediation need,
- instructional sequencing.

Discovery Engine must not preempt those decisions.

## Persistence and Reevaluation

Concept hypotheses must preserve:

- concept definition version,
- pattern references,
- evaluation policy version,
- confidence breakdown,
- status history,
- transfer and boundary state.

Definition upgrades should create explicit reevaluation records rather than rewriting historical conclusions silently.

## Observability

Telemetry should expose:

- concept candidates created,
- support and contradiction transitions,
- representation diversity,
- transfer attempts,
- boundary evaluations,
- misconception signals,
- reevaluation outcomes,
- lineage completeness,
- replay divergence.

## Runtime Invariants

1. A concept hypothesis cannot be created from UI state or mission completion alone.
2. One pattern instance cannot prove a broad concept.
3. Representations and contexts are preserved in the hypothesis.
4. Transfer is explicit and cannot be assumed from repetition in one context.
5. Counterexamples refine or contradict hypotheses rather than disappearing.
6. Misconception signals are provisional and evidence-based.
7. Concept confidence does not become a permanent learner score.
8. Curriculum mapping does not own semantic concept definitions.
9. Every concept hypothesis has complete lineage to world evidence.
10. Definition upgrades create traceable reevaluation rather than silent historical mutation.

## Verification Targets

Verification must cover:

- abstraction across multiple pattern families,
- representation diversity,
- narrow procedural familiarity,
- transfer success and failure,
- boundary-condition evidence,
- counterexample handling,
- misconception signal creation and resolution,
- curriculum-boundary separation,
- lineage completeness,
- replay after concept-definition changes.

## Architectural Outcome

This slice establishes concept formation as a cautious, explainable abstraction over supported patterns.

It enables Math Learning World to recognize emerging mathematical ideas while preserving uncertainty, boundaries, transfer evidence, and the strict separation between discovery, curriculum mapping, and true learning mastery.