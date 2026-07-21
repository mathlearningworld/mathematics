# Chapter 24 — Discovery Engine Architecture

# 24B — Discovery Evidence Runtime

## Status

- Chapter: 24
- Slice: 24B
- Authority: Discovery Engine Architecture
- Scope: Evidence intake, normalization, lineage, confidence, durability, deduplication, and discovery evidence invariants

## Purpose

The Discovery Evidence Runtime defines the canonical evidence model used to recognize that a player may have discovered a meaningful relationship through world interaction.

It separates raw world events from interpreted discovery claims.

A world event states what happened. Discovery evidence states why that event, or a governed sequence of events, is relevant to a possible discovery.

## Core Principle

> Discovery evidence must preserve its lineage back to authoritative world events and must never claim more meaning than the observed actions support.

The runtime may infer that evidence is relevant. It must not silently promote uncertain evidence into confirmed understanding.

## Runtime Position

```text
World Runtime
  → Authoritative Domain Events
    → Evidence Intake
      → Evidence Normalization
        → Discovery Evidence Ledger
          → Pattern Recognition Runtime
```

## Evidence Layers

The architecture distinguishes four layers.

### 1. World Event

An authoritative statement that a world mutation or interaction occurred.

Examples:

- a block was placed,
- an object was moved,
- a resource was grouped,
- a route was traversed,
- a measurement was compared,
- a construction was revised.

### 2. Observation Fact

A normalized semantic fact extracted from one or more world events.

Examples:

- three blocks were placed with uniform spacing,
- two lengths were compared using the same reference unit,
- a failed arrangement was replaced by a symmetrical one,
- the player repeated a construction with one variable changed.

### 3. Discovery Evidence

A durable record that an observation fact may support one or more discovery hypotheses.

### 4. Discovery Claim

A higher-level interpretation produced later by Pattern Recognition or Concept Formation Runtime.

Evidence and claims must remain distinct.

## Canonical Evidence Model

```ts
interface DiscoveryEvidence {
  evidenceId: string;
  ownerId: string;
  worldId: string;
  sessionId?: string;
  evidenceType: string;
  subjectRefs: string[];
  observation: ObservationFact;
  sourceEventRefs: SourceEventRef[];
  occurredFrom: string;
  occurredTo: string;
  confidence: number;
  status: 'PROVISIONAL' | 'CORROBORATED' | 'REVOKED' | 'SUPERSEDED';
  definitionVersion: number;
  revision: number;
  createdAt: string;
}

interface ObservationFact {
  predicate: string;
  variables: Record<string, string | number | boolean>;
  context: Record<string, string | number | boolean>;
}

interface SourceEventRef {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateRevision: number;
  sequence?: number;
}
```

## Evidence Identity

Evidence identity must be stable across retries and replay.

A deterministic evidence key may be derived from:

- owner identity,
- evidence definition,
- ordered source event identities,
- governed context boundary,
- evidence definition version.

The same source evidence must not create duplicate ledger entries.

## Intake Boundary

The runtime accepts only events that satisfy declared discovery contracts.

```ts
interface DiscoveryEventContract {
  eventType: string;
  payloadVersion: number;
  requiredFields: string[];
  semanticRole: string;
}
```

Unknown or incompatible event versions must be rejected, quarantined, or routed through an explicit adapter.

## Normalization

Normalization converts heterogeneous gameplay events into comparable semantic facts.

For example:

```text
EntityPlaced + PlacementSocket + BlockDimensions
  → placed object at governed socket with measured spacing
```

Normalization must remove presentation-only details while preserving semantic variables needed for discovery.

Presentation properties such as sprite frame, animation progress, camera zoom, or UI selection must not become evidence unless the product explicitly defines them as meaningful player actions.

## Evidence Windows

Some evidence depends on a sequence rather than one event.

```ts
interface EvidenceWindow {
  windowId: string;
  ownerId: string;
  worldId: string;
  openedAtSequence: number;
  closedAtSequence?: number;
  policyId: string;
  eventRefs: string[];
}
```

Windows may be bounded by:

- elapsed simulation time,
- mission or activity context,
- spatial region,
- entity set,
- explicit player reset,
- semantic completion.

Window policy must be explicit so unrelated actions are not combined into false evidence.

## Positive and Negative Evidence

The runtime may preserve both supporting and contradicting observations.

Examples of positive evidence:

- repeated equal spacing,
- consistent ratio preservation,
- successful transfer of a strategy to a new arrangement.

Examples of negative or contradictory evidence:

- inconsistent application,
- accidental success followed by repeated failure,
- reliance on a fixed visual cue that does not generalize.

Negative evidence must not be treated as punishment. It is evidence about uncertainty or boundary conditions.

## Confidence

Confidence represents evidence quality, not learner ability.

Confidence may depend on:

- source authority,
- completeness,
- repetition,
- variation of context,
- independence from hints,
- consistency across attempts,
- evidence recency where policy requires it.

```ts
interface EvidenceConfidenceBreakdown {
  sourceAuthority: number;
  completeness: number;
  repetition: number;
  variation: number;
  independence: number;
  consistency: number;
}
```

Confidence calculation must be versioned and explainable.

## Hint and Assistance Context

Evidence must record relevant assistance context.

```ts
interface AssistanceContext {
  hintLevel: number;
  guidanceSource?: 'SYSTEM' | 'MENTOR' | 'TEACHER' | 'PEER';
  revealedRule?: boolean;
  interventionRef?: string;
}
```

Assistance does not invalidate discovery automatically. It changes how evidence should be interpreted later.

## Corroboration

Evidence becomes corroborated when independent observations satisfy declared policy.

Corroboration may require:

- repeated behavior,
- varied examples,
- transfer to a new context,
- explanation or construction evidence,
- delayed reappearance,
- mentor-confirmed observation.

Corroboration must not be inferred solely from event count.

## Revocation and Supersession

Evidence may be revoked when:

- source events are rolled back,
- corruption is detected,
- an event contract was interpreted incorrectly,
- identity ownership was wrong,
- migration invalidates the prior interpretation.

Evidence may be superseded when a newer evidence model gives a more precise interpretation.

Revocation must preserve history and reason.

```ts
interface EvidenceStatusChange {
  evidenceId: string;
  previousStatus: string;
  nextStatus: string;
  reasonCode: string;
  sourceRef: string;
  changedAt: string;
}
```

## Evidence Ledger

The ledger is append-oriented and traceable.

It must support queries by:

- learner or player,
- world,
- concept candidate,
- evidence type,
- time range,
- source event,
- status,
- assistance context.

The ledger is not a score table.

## Privacy Boundary

Discovery evidence may reveal learning behavior and must be treated more carefully than ordinary gameplay telemetry.

The runtime should support:

- least-data retention,
- role-based access,
- separation from public gameplay history,
- deletion and retention policy,
- pseudonymous analysis where appropriate,
- explicit boundaries for child-related data.

## Replay

Evidence generation should be replayable from governed source events and definition versions.

Replay must produce equivalent evidence identities and semantic facts for the same inputs.

If a new evidence definition changes results, the runtime must distinguish re-evaluation from original historical interpretation.

## Observability

Evidence telemetry should expose:

- accepted and rejected event counts,
- evidence windows opened and closed,
- provisional and corroborated counts,
- duplicate suppression,
- contract-version failures,
- revocations,
- replay divergence,
- confidence calculation version.

## Runtime Invariants

1. Every evidence record traces to authoritative source events.
2. Evidence identity is stable across retry and replay.
3. UI and presentation state cannot create evidence by themselves.
4. Evidence does not equal confirmed understanding.
5. Confidence describes evidence quality, not learner worth or intelligence.
6. Assistance context is preserved when materially relevant.
7. Contradictory evidence is retained rather than hidden.
8. Revocation preserves lineage and reason.
9. Evidence contracts and calculations are versioned.
10. Sensitive discovery data follows stricter privacy policy than ordinary telemetry.

## Verification Targets

Verification must cover:

- event-contract acceptance and rejection,
- deterministic evidence identity,
- duplicate delivery,
- window boundaries,
- source lineage,
- assistance context,
- corroboration policy,
- revocation after rollback,
- replay equivalence,
- privacy-aware query boundaries.

## Architectural Outcome

This slice establishes a durable and explainable evidence layer between world activity and discovery interpretation.

It allows later runtimes to recognize patterns and concepts without confusing raw gameplay events, evidence quality, and genuine learner understanding.