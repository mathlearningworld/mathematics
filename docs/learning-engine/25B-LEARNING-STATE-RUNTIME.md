# Chapter 25 — Learning Engine Architecture

# 25B — Learning State Runtime

## Status

- Chapter: 25
- Slice: 25B
- Authority: Learning State Runtime
- Depends on: 25A Learning Engine Foundation

## Purpose

The Learning State Runtime maintains the learner-specific, versioned interpretation of understanding for each canonical concept or capability.

Its responsibility is not to count attempts. Its responsibility is to preserve the current state of a Learning Claim and apply only valid transitions supported by governed evidence.

## Core Principle

> Learning State is a projection of evidence under an explicit evaluation policy, not an editable profile field.

## Aggregate Boundary

The primary aggregate is `LearnerConceptState`.

```ts
interface LearnerConceptState {
  learnerId: string;
  conceptId: string;
  claimId: string;
  status: LearningStatus;
  confidence: number;
  stability: number;
  transferBreadth: number;
  retention: RetentionState;
  supportDependence: SupportDependence;
  scope: LearningScope;
  evidenceCursor: EvidenceCursor;
  supportingEvidenceIds: string[];
  contradictoryEvidenceIds: string[];
  activeMisconceptionHypotheses: string[];
  version: number;
  policyVersion: string;
  graphVersion: string;
  lastTransitionAt: string;
}
```

The aggregate is learner-specific and concept-specific.

A single aggregate may reference many representations, strategies, world contexts, and assessment surfaces, but it must not collapse several unrelated concepts into one state.

## Learning Status Model

```text
UNOBSERVED
OBSERVED
EMERGING
SUPPORTED
TRANSFERABLE
STABLE
CONTEXT_BOUND
CONTRADICTED
DORMANT
RECOVERING
REVOKED
```

### UNOBSERVED

No governed evidence currently supports a learning interpretation.

### OBSERVED

Relevant evidence exists, but it is insufficient to infer an emerging understanding.

### EMERGING

Evidence suggests a coherent concept or capability is beginning to form.

### SUPPORTED

Multiple sufficiently independent pieces of evidence support the claim within a defined scope.

### TRANSFERABLE

The learner has applied the concept successfully across materially different contexts or representations.

### STABLE

The claim is supported by independent, delayed, and transferable evidence with no unresolved contradiction large enough to invalidate it.

### CONTEXT_BOUND

The learner performs successfully in a narrow representation, tool, or scenario, but evidence does not support broader understanding.

### CONTRADICTED

Material evidence conflicts with the active claim and requires narrowing, re-evaluation, or additional evidence.

### DORMANT

The claim was previously supported, but there is insufficient recent evidence to assert active availability. Dormancy is not equivalent to forgetting.

### RECOVERING

Previously dormant or contradicted understanding is being re-established through new evidence.

### REVOKED

The interpretation is no longer valid due to invalid source evidence, evaluator defects, migration, or a governed correction.

## State Is Multi-Dimensional

Status alone is insufficient.

The runtime tracks at least:

- confidence;
- stability;
- transfer breadth;
- retention state;
- assistance dependence;
- context scope;
- contradiction burden;
- evidence freshness;
- evidence diversity.

Two learners may both be `SUPPORTED` while having very different profiles.

```text
Learner A:
High confidence, low transfer breadth, unassisted

Learner B:
Moderate confidence, broad transfer, still prompt-dependent
```

These states must remain distinguishable.

## Learning Scope

A claim must declare the scope in which it is supported.

```ts
interface LearningScope {
  worldContexts: string[];
  representations: string[];
  strategies: string[];
  taskFamilies: string[];
  constraintRanges: ScopeConstraint[];
  excludedContexts: string[];
}
```

Scope prevents the engine from generalizing beyond available evidence.

Example:

```text
Supported scope:
- equal spacing of identical blocks on a horizontal axis

Not yet supported:
- vertical spacing
- variable unit size
- symbolic multiplication
```

## Evidence Cursor

The aggregate records which evidence has already been interpreted.

```ts
interface EvidenceCursor {
  lastEvidenceSequence: number;
  lastEvidenceTimestamp: string;
  discoveryLedgerVersion: string;
  replayGeneration: number;
}
```

The cursor supports:

- idempotent processing;
- replay;
- late evidence;
- offline synchronization;
- evaluator upgrades;
- audit.

## Transition Command

```ts
interface EvaluateLearningStateCommand {
  learnerId: string;
  conceptId: string;
  expectedVersion: number;
  evidenceBatch: LearningEvidenceReference[];
  evaluatorVersion: string;
  policyVersion: string;
  graphVersion: string;
  correlationId: string;
  evaluatedAt: string;
}
```

The command does not contain a desired target status.

The evaluator determines the next state from evidence and policy.

This prevents callers from issuing commands such as `markStable` or `setMastered` without evidence evaluation.

## Transition Result

```ts
interface LearningStateEvaluationResult {
  learnerId: string;
  conceptId: string;
  previousStatus: LearningStatus;
  currentStatus: LearningStatus;
  transitionReason: TransitionReason;
  appliedEvidenceIds: string[];
  deferredEvidenceIds: string[];
  newVersion: number;
  stateChanged: boolean;
  evaluatedAt: string;
}
```

## Valid Transition Rules

The runtime permits non-linear transitions.

Examples:

```text
UNOBSERVED → OBSERVED
OBSERVED → EMERGING
EMERGING → SUPPORTED
SUPPORTED → TRANSFERABLE
TRANSFERABLE → STABLE
SUPPORTED → CONTEXT_BOUND
SUPPORTED → CONTRADICTED
STABLE → DORMANT
DORMANT → RECOVERING
RECOVERING → SUPPORTED
ANY → REVOKED
```

Not every possible transition must be direct.

For example, `OBSERVED → STABLE` should normally be rejected because stable learning requires a history that cannot be compressed into one transition without replayed evidence.

## Transition Preconditions

A state transition may require:

- minimum independent evidence groups;
- minimum context diversity;
- assistance ceiling;
- successful delayed retrieval;
- absence of unresolved high-severity contradiction;
- valid source provenance;
- compatible Knowledge Graph version;
- evaluator policy compatibility;
- complete evidence window.

These are policy-governed and versioned.

## Idempotency

Evidence application must be idempotent.

The same evidence may arrive through:

- retry;
- replay;
- offline synchronization;
- duplicate delivery;
- restored queue processing.

The aggregate must recognize already-applied evidence and avoid double counting or duplicate transitions.

## Optimistic Concurrency

All writes require `expectedVersion`.

When concurrent evidence batches target the same learner and concept:

1. one evaluation writes successfully;
2. the other receives a version conflict;
3. the failed evaluation reloads current state;
4. evidence is re-evaluated against the new state;
5. no evidence is silently lost.

## Late Evidence

Evidence may arrive after later evidence has already been processed.

Late evidence must not simply be appended to the current interpretation if ordering matters.

The runtime may:

- apply it incrementally when order-independent;
- schedule bounded replay;
- mark state as `REPLAY_REQUIRED`;
- defer projection updates until replay completes.

## Contradiction Handling

Contradiction is represented explicitly.

```ts
interface ContradictionRecord {
  contradictionId: string;
  evidenceIds: string[];
  affectedScope: LearningScope;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'RESOLVED' | 'SUPERSEDED';
  interpretation: string;
}
```

A contradiction can:

- lower confidence;
- narrow scope;
- move status to `CONTEXT_BOUND`;
- move status to `CONTRADICTED`;
- create a misconception hypothesis;
- trigger further evidence collection.

It must not be converted automatically into failure or remediation punishment.

## Misconception Relationship

Misconception hypotheses are attached to the learning state by reference.

They retain:

- source evidence;
- applicable contexts;
- confidence;
- alternative explanations;
- resolution evidence;
- version history.

Resolving a misconception does not delete its history.

## Retention State

```text
NOT_EVALUATED
IMMEDIATE_ONLY
SHORT_DELAY_RETRIEVED
LONG_DELAY_RETRIEVED
DORMANT
REACTIVATED
```

Retention is based on retrieval opportunities separated by meaningful time, not merely elapsed wall-clock duration.

## Support Dependence

```ts
interface SupportDependence {
  dominantAssistanceLevel: string;
  independentSuccessRatio: number;
  supportReductionTrend: 'IMPROVING' | 'STABLE' | 'INCREASING' | 'UNKNOWN';
  lastIndependentEvidenceAt?: string;
}
```

The runtime must recognize growth when assistance decreases over time, even before fully independent performance is reached.

## Confidence Semantics

Confidence represents confidence in the claim interpretation, not a score for the learner.

High confidence can exist for a negative or narrow conclusion, such as:

```text
"High confidence that current success is context-bound to the block-placement representation."
```

Confidence must never be displayed as a personal worth metric.

## Aggregate Events

The runtime may emit:

```text
LearningStateObserved
LearningStateEmerging
LearningStateSupported
LearningStateBecameTransferable
LearningStateStabilized
LearningStateBecameContextBound
LearningStateContradicted
LearningStateBecameDormant
LearningStateRecoveryStarted
LearningStateRecovered
LearningStateRevoked
LearningScopeChanged
LearningConfidenceChanged
MisconceptionHypothesisLinked
```

Events carry before/after versions and evidence references.

## Projection Boundary

The aggregate is authoritative for learner-specific learning state.

UI, parent dashboards, teacher dashboards, and recommendation services consume projections.

They must not read internal fields and invent their own state transitions.

## Access and Privacy

State access must be scoped by role and relationship.

Possible projections include:

- learner self-view;
- parent view;
- teacher classroom view;
- mentor view;
- system recommendation view;
- assessment view.

Each projection exposes only necessary detail.

## Failure Codes

```text
LEARNING_STATE_NOT_FOUND
EXPECTED_VERSION_CONFLICT
EVIDENCE_ALREADY_APPLIED
SOURCE_EVIDENCE_MISSING
SOURCE_EVIDENCE_REVOKED
GRAPH_VERSION_MISMATCH
POLICY_VERSION_UNSUPPORTED
INVALID_STATE_TRANSITION
REPLAY_REQUIRED
EVALUATION_DEFERRED
UNAUTHORIZED_LEARNING_STATE_ACCESS
```

## Runtime Invariants

1. Callers cannot directly choose the resulting Learning Status.
2. Every state transition must reference governed evidence.
3. Evidence must be applied idempotently.
4. Aggregate writes require optimistic concurrency.
5. Status must never be interpreted without its scope and dimensions.
6. Contradictory evidence must remain attached until explicitly resolved or superseded.
7. Dormancy must not erase prior evidence.
8. Revocation must preserve audit history.
9. Assistance dependence must remain distinguishable from independent performance.
10. Late evidence must trigger safe incremental evaluation or replay.
11. Canonical Knowledge Graph state must not be stored inside the learner aggregate.
12. Projection consumers cannot mutate authoritative state.
13. Confidence is confidence in interpretation, not learner worth.
14. A state marked stable must include delayed and sufficiently diverse evidence under the active policy.
15. Every aggregate version must be reproducible from its evidence and interpretation history.

## Architectural Outcome

The Learning State Runtime provides a governed, versioned learner model that can evolve with evidence while resisting simplistic progress bars, direct status mutation, duplicate events, unsupported generalization, and irreversible labeling.