# Chapter 24 — Discovery Engine Architecture

# 24J — Discovery Verification and Runtime Invariants

## Status

- Chapter: 24
- Slice: 24J
- Authority: Discovery Engine Architecture
- Depends on: 24A–24I and Chapter 23 World Verification

## Purpose

This document defines the verification model, fault boundaries, deterministic scenarios, and runtime invariants required to trust the Discovery Engine.

The Discovery Engine interprets learner action. A defect in this layer can misrepresent understanding, hide contradiction, over-credit assisted performance, expose private information, or drive inappropriate guidance.

Verification must therefore prove not only that the runtime executes, but that its interpretations remain traceable, bounded, reversible, privacy-safe, and consistent with authoritative world evidence.

## Core Principle

> Discovery verification proves the chain from world evidence to human-facing interpretation without allowing any derived layer to invent authority.

## Verification Chain

```text
World Event
  → Observation Fact
    → Discovery Evidence
      → Pattern Hypothesis
        → Concept Hypothesis
          → Progression Transition
            → Guidance Decision
              → Mentor Projection
                → Persistence / Replay
```

Every arrow is a contract boundary and a verification point.

## Verification Objectives

The verification system must establish that:

- source evidence is authentic and ordered
- evidence derivation is deterministic
- duplicates do not inflate confidence
- assistance is preserved
- contradictions remain visible
- pattern recognition requires meaningful structure
- concept formation requires representation and context diversity
- progression follows explicit policy
- hints do not manufacture discovery
- mentor projections use evidence-safe language
- persistence can reconstruct current state
- replay detects semantic divergence
- privacy policies constrain all projections

## Verification Layers

### Layer A — Contract Verification

Validates schemas, enums, public exports, required provenance, and failure codes.

### Layer B — Evaluator Verification

Validates evidence, pattern, concept, progression, and guidance evaluators in isolation.

### Layer C — Aggregate Verification

Validates transitions across a learner discovery aggregate, including contradiction, revocation, dormancy, and claim split.

### Layer D — Integration Verification

Validates World Runtime event ingestion through persisted discovery projections.

### Layer E — Scenario Verification

Validates complete gameplay situations with deterministic world inputs.

### Layer F — Operational Verification

Validates runtime behavior under delay, retry, crash, offline sync, version migration, and partial infrastructure failure.

### Layer G — Human Interpretation Verification

Validates that learner and mentor surfaces communicate evidence accurately and safely.

## Authority Verification

The following authority order must always hold:

```text
World Runtime Evidence
  > Discovery Evidence
    > Interpretation Record
      > Snapshot
        > Projection
          > UI State
```

Verification must fail if a lower layer can create or override a higher-layer fact.

## Foundational Invariants

1. Discovery is inferred only from authoritative evidence.
2. UI state, dialogue progress, animation completion, and button clicks are not discovery authority.
3. Evidence must retain source provenance.
4. Evidence confidence is not learner worth.
5. Discovery state is not mastery state.
6. Activity volume is not evidence quality.
7. Assisted performance remains assisted.
8. Contradiction is preserved until explicitly resolved by policy.
9. Derived projections are rebuildable.
10. Human annotations cannot rewrite world history.

## Evidence Runtime Invariants

1. One semantic source event cannot create duplicate active evidence under retry.
2. Evidence windows use explicit ordering and time semantics.
3. Negative and contradictory evidence remain distinguishable.
4. Revoked evidence cannot continue supporting active claims.
5. Superseded evidence preserves historical traceability.
6. Evidence derived from automation cannot be classified as independent learner action.
7. Missing provenance causes rejection or quarantine, never silent acceptance.
8. Late evidence retains original effective time.

## Pattern Recognition Invariants

1. Repetition alone cannot establish a pattern.
2. Duplicate events cannot increase independence count.
3. Pattern support requires a declared structural relation.
4. Context variation must be measured explicitly.
5. Counterexamples must be retained.
6. A pattern hypothesis cannot claim broader scope than its evidence supports.
7. Accidental success and automation must be discounted by policy.
8. Pattern confidence must be reproducible from its evidence set and evaluator version.

## Concept Formation Invariants

1. A concept is not identical to one representation.
2. Concept hypotheses require traceable supporting patterns or direct evidence policy.
3. Transfer claims require evidence from a distinct context or representation.
4. Boundary conditions must remain attached to concept scope.
5. A misconception signal is not a permanent learner label.
6. Curriculum mappings cannot redefine canonical concept identity.
7. Concept merge and split operations preserve evidence provenance.
8. Unsupported historical evidence cannot be copied into every split concept.

## Progression Invariants

1. Progression transitions use explicit policy and previous state.
2. Invalid state transitions are rejected.
3. `TRANSFERABLE` requires genuine transfer evidence.
4. `STABLE` requires evidence quality beyond repetition.
5. `CONTRADICTED` does not erase earlier support.
6. `DORMANT` does not mean forgotten or failed.
7. High-level assistance cannot silently produce unassisted progression.
8. A transition records supporting and contradicting evidence identities.
9. Replay under the same versions yields the same transition history.

## Knowledge Graph Invariants

1. Canonical concept identity is language-neutral and curriculum-neutral.
2. Learner state is stored outside the canonical graph.
3. Every graph edge uses a declared semantic type.
4. Cycles in prerequisite relations are rejected unless explicitly modeled and permitted.
5. Deprecated nodes retain migration mappings.
6. Representation nodes cannot masquerade as concept nodes.
7. Misconception nodes describe evidence patterns, not people.
8. Graph version is recorded on every graph-dependent interpretation.

## Hint and Guidance Invariants

1. Guidance selects the least intrusive effective intervention allowed by policy.
2. A single ordinary error does not automatically escalate assistance.
3. Productive struggle windows are bounded and configurable.
4. Accessibility support is not automatically classified as conceptual assistance.
5. Demonstration success remains demonstrated performance.
6. Guidance cannot directly create discovery or mastery records.
7. Player refusal of a hint is not a failure signal.
8. Every intervention records source, level, reason, and outcome.
9. Escalation is rate-limited.
10. Guidance policies are replayable and versioned.

## Mentor Observation Invariants

1. Mentor projections derive from authorized, traceable evidence.
2. Access is relationship-scoped and policy-audited.
3. Learner descriptions use evidence language rather than fixed labels.
4. Mentor annotations are append-only contextual records.
5. Offline observation remains distinguishable from world evidence.
6. Sensitive raw evidence is minimized by default.
7. Stale or incomplete projections declare their limitations.
8. Alerts are evidence-backed, explainable, and rate-limited.
9. Observation requests do not prescribe hidden answers.
10. Mentor actions cannot mutate discovery state directly.

## Persistence and Replay Invariants

1. Evidence ingestion is idempotent.
2. Aggregate writes use optimistic concurrency.
3. Related interpretation records commit atomically.
4. Snapshots record watermark, versions, and checksum.
5. Projections are disposable and rebuildable.
6. Replay is deterministic for identical inputs and versions.
7. Semantic migration requires replay or explicit compatibility mapping.
8. Corrupt records are quarantined.
9. Counterfactual replay is isolated from production authority.
10. Offline projections cannot overwrite server-derived semantic state.
11. Revocation preserves audit history.
12. Replay divergence is a first-class failure.

## Deterministic Scenario Catalog

### Scenario 1 — Repeated Equal Spacing

Player places blocks with equal intervals across several sockets.

Expected:

- unique placement events become evidence
- retries are deduplicated
- a uniform-spacing pattern may emerge
- no concept transfer is claimed yet

### Scenario 2 — Equal Spacing Across Representation

Player later marks equal intervals on a measurement line.

Expected:

- context diversity increases
- representation transfer is recorded
- a concept hypothesis may advance according to policy

### Scenario 3 — Assisted Construction

Player succeeds after a partial strategy hint.

Expected:

- success evidence is retained
- assistance level is attached
- independent evidence count does not increase as unassisted
- progression cannot falsely advance to stable independent understanding

### Scenario 4 — Demonstrated Solution

System demonstrates the complete construction and player repeats it.

Expected:

- action is classified as demonstrated performance
- no spontaneous discovery claim is created
- later unassisted variation may create new evidence

### Scenario 5 — Contradictory Orientation

Player maintains equal spacing horizontally but becomes inconsistent vertically.

Expected:

- horizontal support remains
- contradiction is attached to broader generalization
- the system narrows or delays the claim rather than erasing success

### Scenario 6 — Duplicate Network Delivery

The same world event arrives three times.

Expected:

- one active evidence record
- duplicate metric increments
- no confidence inflation
- deterministic state checksum

### Scenario 7 — Late Offline Evidence

An older offline session syncs after newer evidence.

Expected:

- original event time is preserved
- aggregate is reevaluated in causal order
- projection is rebuilt
- no fabricated recent activity

### Scenario 8 — Knowledge Graph Split

A broad concept is split into two narrower concepts.

Expected:

- migration mapping exists
- evidence is redistributed only where provenance supports it
- unresolved evidence remains unresolved
- replay produces explainable divergence from the old graph version

### Scenario 9 — Snapshot Corruption

Latest snapshot checksum fails.

Expected:

- snapshot is rejected
- previous valid snapshot or full ledger replay is used
- corrupted snapshot is quarantined
- projection reports recovery state if temporarily incomplete

### Scenario 10 — Unauthorized Mentor Access

Observer requests a learner projection without a valid relationship.

Expected:

- access denied
- no learner data returned
- audit event recorded
- no existence-leaking detail beyond policy

## Property-Based Verification

Property tests should generate variations in:

- event order
- duplicate count
- assistance level
- context identity
- representation identity
- contradiction placement
- graph topology
- retry timing
- snapshot boundaries
- migration versions

Key properties include:

```text
Deduplication does not change semantic output.
Replay segmentation does not change final checksum.
Projection deletion followed by rebuild restores equivalent output.
Adding contradictory evidence cannot silently increase confidence.
Increasing assistance cannot be interpreted as greater independence.
Unauthorized scope never expands returned data.
```

## Metamorphic Verification

The runtime should verify relationships between transformed inputs.

Examples:

- reordering independent events preserves final state
- adding a network duplicate preserves final state
- replacing UI labels preserves discovery state
- changing animation duration preserves evidence meaning
- changing locale preserves canonical concept identity
- hiding a mentor panel does not alter learner progression

## Fault Injection

Inject faults at:

- world event delivery
- evidence persistence
- interpretation transaction
- snapshot write
- knowledge graph load
- policy version resolution
- mentor authorization
- replay execution
- projection publication

Required outcomes:

- no partial semantic commit
- explicit failure code
- safe retry or quarantine path
- preserved audit trail
- no unauthorized data leakage

## Failure Codes

```text
DISCOVERY_AUTHORITY_VIOLATION
DISCOVERY_PROVENANCE_MISSING
DISCOVERY_DUPLICATE_SEMANTIC_RECORD
DISCOVERY_INVALID_TRANSITION
DISCOVERY_ASSISTANCE_MISCLASSIFIED
DISCOVERY_CONTRADICTION_DROPPED
DISCOVERY_GRAPH_INVARIANT_FAILED
DISCOVERY_POLICY_VERSION_MISSING
DISCOVERY_REPLAY_DIVERGED
DISCOVERY_SNAPSHOT_INVALID
DISCOVERY_PROJECTION_STALE
DISCOVERY_MENTOR_ACCESS_DENIED
DISCOVERY_PRIVACY_SCOPE_VIOLATION
DISCOVERY_RECORD_QUARANTINED
```

## Verification Evidence Package

A Chapter 24 verification package should include:

- changed paths
- public contracts and exports
- evaluator fixtures
- deterministic scenario fixtures
- knowledge graph fixture version
- policy fixture versions
- snapshot and replay checksums
- failure injection results
- mentor authorization cases
- privacy minimization cases
- migration replay report
- repository diff and commit authority

## Verification Gates

### Gate A — Repository Gate

Requires:

- architecture files 24A–24J present
- internal terminology consistent
- authority boundaries explicit
- invariants documented
- no unresolved contract contradiction
- repository state and commit history verified

Outcome:

```text
DISCOVERY ARCHITECTURE — REPOSITORY PASS
```

### Gate B — Runtime Gate

Requires executable implementation evidence:

- evaluator tests
- typecheck
- build
- deterministic replay
- persistence integration
- migration fixtures
- fault injection

Outcome:

```text
DISCOVERY RUNTIME — RUNTIME PASS
```

### Gate C — Operational Gate

Requires a running system path:

```text
Player Action
  → World Event
    → Discovery Evidence
      → Pattern / Concept State
        → Guidance / Mentor Projection
          → Persistence
            → Recovery Replay
```

Outcome:

```text
DISCOVERY ENGINE — OPERATIONAL PASS
```

Repository PASS must never be reported as Runtime PASS or Operational PASS.

## Chapter 24 Completion Criteria

Chapter 24 Architecture is complete when:

1. Discovery Engine is an independent semantic layer above World Runtime.
2. Evidence provenance and authority are explicit.
3. Pattern and concept formation remain hypothesis-driven.
4. Progression distinguishes observation, transfer, stability, contradiction, and dormancy.
5. Knowledge Graph identity is separated from curriculum and learner state.
6. Guidance preserves learner agency and assistance provenance.
7. Mentor observation supports humans without surveillance or authority mutation.
8. Persistence preserves evidence-first reconstruction.
9. Replay, migration, and corruption handling are defined.
10. Verification gates and cross-runtime invariants are explicit.

## Architectural Outcome

Chapter 24 establishes a complete Discovery Engine Architecture from evidence ingestion through pattern recognition, concept formation, progression, knowledge mapping, guidance, mentor observation, persistence, replay, and verification.

The resulting system can recognize meaningful learning emerging from play while remaining cautious about what it claims, transparent about how it knows, and respectful of learner agency and privacy.