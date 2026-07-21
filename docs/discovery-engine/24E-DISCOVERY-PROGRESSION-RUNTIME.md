# Chapter 24 — Discovery Engine Architecture

# 24E — Discovery Progression Runtime

## Status

- Chapter: 24
- Slice: 24E
- Authority: Discovery Engine Architecture
- Scope: discovery-state lifecycle, evidence accumulation, confidence transitions, transfer, contradiction, and downstream readiness

## Purpose

The Discovery Progression Runtime defines how a possible discovery changes over time as the player produces new evidence across repeated and varied world interactions.

It does not assign mastery, grades, or curriculum completion. It governs the lifecycle of discovery hypotheses and records why they became stronger, weaker, transferred, contradicted, or dormant.

## Core Principle

> Discovery progression is the governed evolution of a hypothesis under evidence, not a linear experience bar.

More events do not automatically mean stronger understanding. Progression depends on evidence quality, independence, variation, transfer, assistance level, contradiction, and recency.

## Runtime Position

```text
Discovery Evidence
  → Pattern Hypothesis
    → Concept Hypothesis
      → Discovery Progression Evaluation
        → Discovery State Transition
          → Learning Engine Readiness Signal
```

## Discovery Lifecycle

```text
UNSEEN
  → OBSERVED
    → EMERGING
      → SUPPORTED
        → TRANSFERABLE
          → STABLE

OBSERVED | EMERGING | SUPPORTED
  → CONTRADICTED
  → DORMANT
  → REVOKED
```

These states describe the evidence condition of a discovery claim. They do not claim that the learner has mastered the underlying mathematical concept.

## State Meaning

### UNSEEN

No qualifying evidence has been observed.

### OBSERVED

At least one relevant evidence item exists, but it is insufficient to support a stable pattern.

### EMERGING

Multiple related observations suggest a pattern, but evidence may still be narrow, assisted, repetitive, or context-bound.

### SUPPORTED

The hypothesis has multiple independent supporting evidence items and survives basic counterexample checks.

### TRANSFERABLE

The player has produced supporting evidence across materially different representations, contexts, or tasks.

### STABLE

The hypothesis remains supported across time, variation, and reasonable contradiction checks.

### CONTRADICTED

New evidence conflicts with the current hypothesis strongly enough that confidence must be reduced or the claim re-evaluated.

### DORMANT

The hypothesis remains historically valid but has not received recent evidence under the configured recency policy.

### REVOKED

The claim is no longer considered valid because source evidence was invalidated, duplicated, corrupted, or reinterpreted under a corrected rule.

## Runtime Model

```ts
interface DiscoveryProgressionState {
  discoveryId: string;
  learnerId: string;
  conceptRef: string;
  state:
    | 'UNSEEN'
    | 'OBSERVED'
    | 'EMERGING'
    | 'SUPPORTED'
    | 'TRANSFERABLE'
    | 'STABLE'
    | 'CONTRADICTED'
    | 'DORMANT'
    | 'REVOKED';
  confidence: number;
  supportingEvidenceRefs: string[];
  contradictingEvidenceRefs: string[];
  contextRefs: string[];
  representationRefs: string[];
  assistanceProfile: AssistanceProfile;
  revision: number;
  firstObservedAt?: string;
  lastEvaluatedAt: string;
}
```

## Evidence Dimensions

Progression evaluation should consider at least:

- evidence independence,
- temporal separation,
- context diversity,
- representation diversity,
- task variation,
- assistance level,
- success consistency,
- counterexample handling,
- transfer behavior,
- evidence recency,
- source reliability.

## Independence

Repeated events from one uninterrupted action sequence must not be counted as fully independent evidence.

Examples of weak independence:

- retry delivery of the same event,
- many placements produced by one drag action,
- repeated automation-generated behavior,
- cloned tasks with identical structure,
- one scripted tutorial sequence.

Examples of stronger independence:

- the same relation rediscovered later,
- the same structure used in a new location,
- the same concept expressed through a different tool,
- a self-initiated strategy after prior guidance has ended.

## Assistance Profile

```ts
interface AssistanceProfile {
  unassistedCount: number;
  hintedCount: number;
  guidedCount: number;
  demonstratedCount: number;
  automatedCount: number;
}
```

Assisted evidence remains valuable, but it must not be treated as equivalent to independent discovery.

## Transition Policy

Transitions must be policy-driven.

```ts
interface DiscoveryTransitionPolicy {
  minimumIndependentEvidence: number;
  minimumContextDiversity: number;
  minimumRepresentationDiversity: number;
  maximumContradictionRatio: number;
  transferRequiredForStable: boolean;
  dormancyAfterMs?: number;
}
```

The numeric thresholds are product policy and may vary by concept family. They are not universal mathematical truths.

## Transfer

Transfer is evidence that the learner can recognize or use the same underlying relation beyond the original surface form.

Examples:

- equal spacing with blocks and then with movement steps,
- grouping objects and then grouping lengths,
- symmetry in construction and then in visual pattern completion,
- ratio through resource recipes and then through map scale.

Transfer requires semantic equivalence with meaningful surface variation.

## Contradiction Handling

Contradicting evidence must be retained, not discarded merely because it lowers confidence.

```text
New Counterevidence
  → Validate Source
    → Compare Against Current Hypothesis
      → Reduce Confidence, Split Claim, or Revoke
```

A contradiction may indicate:

- accidental prior success,
- context dependence,
- misconception,
- an overly broad concept claim,
- invalid source evidence,
- or a legitimate exception.

## Claim Splitting

When one broad hypothesis is supported in only part of its scope, the runtime may split it.

Example:

```text
Broad claim: understands equal spacing
  ↓ contradiction in diagonal placement
Split into:
  - equal spacing on horizontal sockets
  - equal spacing across arbitrary orientation (unsupported)
```

This prevents false confidence caused by overgeneralization.

## Decay and Dormancy

Discovery evidence should not disappear merely because time passes.

Dormancy means the system has insufficient recent evidence to rely on the claim operationally. Historical evidence remains traceable.

Decay policy should affect confidence or readiness, not rewrite the past.

## Reinstatement

A dormant or contradicted claim may become supported again when new high-quality evidence appears.

Reinstatement must preserve prior history and identify which evidence changed the state.

## Progression Events

```ts
interface DiscoveryProgressionChanged {
  eventId: string;
  discoveryId: string;
  previousState: string;
  nextState: string;
  previousConfidence: number;
  nextConfidence: number;
  causeEvidenceRefs: string[];
  policyVersion: number;
  occurredAt: string;
}
```

## Downstream Readiness

The Discovery Engine may emit readiness signals such as:

- ready for varied challenge,
- ready for transfer probe,
- contradiction requires observation,
- assistance dependency detected,
- concept claim too broad,
- evidence currently dormant.

These are advisory inputs. The Learning Engine remains responsible for instructional or mastery interpretation.

## Player Experience Boundary

Discovery progression may influence:

- what worlds or experiments become available,
- whether the game offers a new representation,
- whether a gentle prompt appears,
- whether the system waits for further independent evidence.

It must not expose opaque confidence scores as judgments of the child.

## Runtime Invariants

1. Progression is based on evidence quality, not event count alone.
2. Duplicate or dependent evidence cannot inflate confidence.
3. Assisted and unassisted evidence remain distinguishable.
4. Contradicting evidence is preserved and evaluated.
5. Transfer requires meaningful context or representation variation.
6. Dormancy does not erase historical evidence.
7. State transitions record policy version and causal evidence.
8. Discovery progression never claims curriculum mastery.
9. Broad unsupported claims may be narrowed or split.
10. Re-evaluation is deterministic for the same evidence and policy version.

## Verification Targets

Verification must cover:

- duplicate evidence suppression,
- assisted versus unassisted weighting,
- transition threshold boundaries,
- contradiction and confidence reduction,
- claim splitting,
- transfer across representations,
- dormancy and reinstatement,
- policy-version replay,
- deterministic state reconstruction,
- downstream readiness signals.

## Architectural Outcome

This slice makes discovery growth explicit, reversible, and evidence-traceable.

It prevents the Discovery Engine from collapsing into an experience bar while giving future Learning systems a reliable account of how a discovery emerged, transferred, weakened, and stabilized.