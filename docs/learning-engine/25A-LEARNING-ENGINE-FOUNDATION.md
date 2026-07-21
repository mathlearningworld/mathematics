# Chapter 25 — Learning Engine Architecture

# 25A — Learning Engine Foundation

## Status

- Chapter: 25
- Slice: 25A
- Authority: Learning Engine Architecture
- Depends on: Chapter 24 — Discovery Engine Architecture
- Downstream consumers: Learning Path, Assessment, Parent/Teacher Projection, Recommendation

## Purpose

The Learning Engine is responsible for transforming durable discovery evidence into an evolving model of learner understanding.

It does not replace the World Runtime, Discovery Engine, curriculum, teaching, or assessment.

It answers a narrower and more important question:

> Given the discoveries, patterns, concepts, transfer attempts, assistance context, and contradictions observed so far, what can the system responsibly claim about the learner's current understanding?

## Core Principle

> Learning state is inferred from a history of evidence across time and context. It is never created by a single success, a UI action, a mission completion flag, or a score alone.

## Runtime Position

```text
World Runtime
  → Authoritative World Events
    → Discovery Engine
      → Discovery Evidence and Concept Hypotheses
        → Learning Engine
          → Learning State
            → Learning Paths / Recommendations / Assessment Inputs
```

## Authority Boundary

The Learning Engine owns:

- learner-specific understanding state;
- evidence-backed learning claims;
- stability, retention, transfer, and contradiction interpretation;
- progression of learning state over time;
- learning dependencies as applied to one learner;
- explainable recommendations for the next learning opportunity.

The Learning Engine does not own:

- physical world truth;
- gameplay outcomes;
- discovery evidence creation;
- canonical concept definitions;
- curriculum requirements;
- grade placement;
- mission completion;
- rewards;
- final assessment certification;
- mentor opinion as authoritative truth.

## Discovery State Is Not Learning State

Discovery Engine outputs may indicate that a learner:

- noticed a pattern;
- repeated a strategy;
- formed a concept hypothesis;
- transferred an idea;
- contradicted a prior hypothesis;
- used a hint or demonstration.

Learning Engine state interprets the longitudinal meaning of those outputs.

```text
Discovery claim:
"The learner produced equal intervals in this construction."

Learning claim:
"The learner is developing a context-independent understanding of constant units, supported by multiple independent representations."
```

The second claim requires broader evidence, time, and verification.

## Foundational Distinctions

### Performance

What happened in a particular attempt.

### Discovery

What meaningful pattern or concept may have been recognized from authoritative evidence.

### Learning

How understanding changes across evidence, contexts, time, assistance, contradiction, and retrieval.

### Mastery

A policy-governed judgment that a learning state satisfies a required standard. Mastery is defined later in Chapter 25 and is not equivalent to learning itself.

### Assessment

A structured attempt to gather evidence under controlled conditions. Assessment contributes evidence; it does not directly overwrite learning state.

## Learning Unit

The smallest governed learner-specific unit is a `LearningClaim`.

A Learning Claim references a canonical concept or capability and summarizes the system's current interpretation.

```ts
interface LearningClaim {
  claimId: string;
  learnerId: string;
  conceptId: string;
  state: LearningState;
  confidence: number;
  stability: number;
  transferBreadth: number;
  retentionStatus: RetentionStatus;
  assistanceProfile: AssistanceProfile;
  evidenceSummary: EvidenceSummary;
  contradictionSummary: ContradictionSummary;
  version: number;
  lastEvaluatedAt: string;
}
```

A claim is not a label attached permanently to a learner. It is a versioned, revisable interpretation.

## Learning State Characteristics

A useful learning state must be:

- evidence-backed;
- concept-specific;
- learner-specific;
- time-aware;
- assistance-aware;
- context-aware;
- contradiction-aware;
- replayable;
- explainable;
- reversible when evidence changes;
- independent from presentation language;
- independent from one curriculum mapping.

## Evidence Inputs

The Learning Engine may consume:

- discovery evidence;
- pattern hypotheses;
- concept hypotheses;
- transfer evidence;
- retrieval evidence;
- delayed-use evidence;
- contradiction evidence;
- misconception signals;
- guidance and assistance records;
- mentor observations with provenance;
- structured assessment evidence;
- persistence replay outputs.

Every input must preserve provenance to the source evidence chain.

## Evidence Quality Dimensions

Learning interpretation must consider more than success or failure.

Important dimensions include:

- independence: whether evidence came from genuinely separate attempts;
- diversity: whether contexts and representations differ;
- assistance: how much support shaped the result;
- recency: when the evidence occurred;
- spacing: whether successful retrieval occurred after time gaps;
- transfer: whether understanding moved to a new context;
- consistency: whether behavior remains coherent;
- contradiction: whether evidence conflicts with the claim;
- authenticity: whether the learner or automation produced the action;
- difficulty: whether the situation demanded the claimed understanding.

## Learning Is Not Monotonic

Learning state can strengthen, weaken, split, merge, become uncertain, or be contradicted.

```text
Emerging understanding
  → Supported understanding
    → Transferable understanding
      → Stable understanding

But also:

Supported understanding
  → Contradicted
  → Context-bound
  → Dormant
  → Recovered
```

The engine must never assume that progress only moves upward.

## Time and Retention

The engine distinguishes:

- immediate performance;
- short-delay retrieval;
- long-delay retrieval;
- reactivation after dormancy;
- repeated dependence on guidance;
- stable independent use.

Absence of recent evidence is not automatically forgetting.

Forgetting or dormancy may be inferred only through governed evidence such as failed retrieval, repeated reconstruction, or loss of transfer.

## Assistance Semantics

Learning evidence must preserve how the learner succeeded.

Example assistance categories:

```text
UNASSISTED
ATTENTION_CUE
REFLECTIVE_PROMPT
CONSTRAINT_REDUCTION
EXPERIMENT_SUGGESTION
PARTIAL_STRATEGY
DEMONSTRATION
AUTOMATED
```

Assisted success is meaningful evidence, but it cannot be treated identically to independent success.

The engine should model assistance dependence rather than penalize help-seeking.

## Context and Representation

Learning claims should not be bound to one visual surface, mission, language, or tool.

A learner may understand a concept in:

- block placement;
- movement distance;
- number lines;
- measurement tools;
- symbolic notation;
- verbal explanation;
- another world or mission.

The engine must distinguish:

- representation familiarity;
- strategy familiarity;
- concept understanding;
- transfer across representations.

## Contradiction and Misconception

Contradictory evidence is first-class data.

The engine must not discard evidence merely because it weakens a previous claim.

Possible outcomes include:

- lower confidence;
- narrower context scope;
- split claim;
- misconception hypothesis;
- targeted retrieval opportunity;
- request for additional evidence;
- revocation of a previous interpretation.

A misconception is an evidence-backed hypothesis about a recurring model or strategy, not a permanent label on the learner.

## Learner Model Separation

Canonical knowledge and learner-specific state are separate.

```text
Knowledge Graph
  defines concepts and relations

Learner Model
  stores evidence-backed state for one learner
```

Changing a curriculum mapping must not rewrite the learner's underlying evidence history.

Changing the Knowledge Graph may require governed reinterpretation or migration, but never silent mutation.

## Curriculum Relationship

Curriculum provides external expectations such as:

- required concepts;
- grade bands;
- local terminology;
- sequencing expectations;
- minimum standards.

Curriculum does not define whether learning occurred.

The same learning claim may map to several curricula, grade systems, or countries.

## Assessment Relationship

Assessment is an evidence-producing subsystem.

The Learning Engine may consume assessment evidence only when it includes:

- task identity;
- concept targets;
- conditions;
- assistance policy;
- attempt history;
- response provenance;
- scoring interpretation;
- confidence limitations.

A score alone is insufficient input.

## Recommendation Relationship

Recommendations must be derived from learning state, not treated as learning evidence.

```text
Learning State
  → Recommendation
  → Learner Opportunity
  → New World / Discovery Evidence
  → Updated Learning State
```

A recommendation cannot mark itself successful merely because it was shown or accepted.

## Privacy and Dignity

Learning state is sensitive learner data.

The engine must support:

- least-privilege access;
- consent-aware projections;
- age-appropriate handling;
- bounded retention;
- auditability;
- correction and review;
- explainable claims;
- separation between operational telemetry and educational interpretation.

The system must avoid labels such as "weak", "slow", or "bad at mathematics" as authoritative learner properties.

## Explainability Contract

Every material learning claim must be explainable through:

```text
Claim
  → Current state
  → Supporting evidence
  → Contradictory evidence
  → Assistance context
  → Context diversity
  → Time and retention evidence
  → Evaluation policy version
```

The explanation must distinguish fact from interpretation.

## Versioning

Learning interpretation depends on policy and model versions.

Every evaluation records:

- evaluator version;
- Knowledge Graph version;
- evidence cut-off;
- policy version;
- resulting claim version;
- previous claim version;
- reason for transition.

This allows replay and audit when policies evolve.

## Failure Handling

When evidence is incomplete, ambiguous, stale, conflicting, or corrupted, the engine must prefer uncertainty over overclaiming.

Valid outcomes include:

- `INSUFFICIENT_EVIDENCE`;
- `CONFLICTING_EVIDENCE`;
- `REPLAY_REQUIRED`;
- `GRAPH_VERSION_MISMATCH`;
- `SOURCE_EVIDENCE_UNAVAILABLE`;
- `EVALUATION_DEFERRED`.

## Foundational Runtime Invariants

1. No Learning Claim may exist without traceable evidence or an explicit migrated legacy basis.
2. A single successful attempt cannot establish stable learning.
3. Mission completion cannot directly mutate Learning State.
4. UI state cannot directly mutate Learning State.
5. Rewards cannot directly mutate Learning State.
6. Recommendations cannot directly mutate Learning State.
7. Curriculum mapping cannot redefine canonical concept identity.
8. Assisted and unassisted evidence must remain distinguishable.
9. Contradictory evidence must not be silently discarded.
10. Learning State must be replayable from governed evidence and interpretation history.
11. Every material transition must record policy and evaluator versions.
12. Learner-specific state must remain separate from the canonical Knowledge Graph.
13. Uncertainty must be represented explicitly.
14. Access to learner projections must be authorized and auditable.
15. Assessment results are evidence inputs, not direct authority over Learning State.

## Chapter 25 Roadmap

```text
25A Learning Engine Foundation
25B Learning State Runtime
25C Learning Progression Runtime
25D Mastery Evaluation Runtime
25E Transfer Learning Runtime
25F Learning Path Runtime
25G Adaptive Recommendation Runtime
25H Parent & Teacher Learning Projection
25I Learning Persistence & Replay
25J Learning Verification & Runtime Invariants
```

## Architectural Outcome

This foundation establishes the Learning Engine as an independent, evidence-driven interpretation layer between Discovery and downstream educational decisions.

It allows Math Learning World to reason about understanding without reducing learning to mission completion, item scores, grade labels, or scripted progression.