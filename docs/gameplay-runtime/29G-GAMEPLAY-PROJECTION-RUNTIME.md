# Chapter 29G — Gameplay Projection Runtime

## Status

Architecture specification for the Gameplay Projection Runtime.

## Purpose

Gameplay Projection Runtime converts authoritative gameplay truth into audience-specific, permission-safe, freshness-aware read models without changing the underlying meaning of sessions, objectives, interactions, evidence, or completion decisions.

```text
Gameplay Ledger
      ↓
Projection Runtime
      ↓
Learner / Parent / Teacher / Mentor / Mission / Assessment / Operations / Replay Views
```

Projection is a read boundary. It is not a command boundary and is never Source of Truth.

## Core Doctrine

```text
Projection may contain less information.
Projection must never contain stronger meaning.
```

A projection may summarize, translate, group, redact, rank, or format. It must not:

- turn activity into learning success;
- turn objective satisfaction into mastery;
- turn gameplay completion into mission completion;
- hide blockers, holds, assistance, limitations, or uncertainty;
- fabricate learner intent or learner action;
- mutate session, objective, evidence, or completion state;
- authorize transitions;
- replace durable records.

## Source Inputs

The runtime consumes versioned authoritative records from:

- Gameplay Session Runtime;
- Gameplay Objective Runtime;
- Gameplay Interaction Runtime;
- Gameplay Evidence Runtime;
- Gameplay Completion Runtime;
- Mission bindings;
- policy and localization registries;
- actor and audience authorization context.

Every projection must retain source version, source sequence, policy version, generated time, freshness state, and limitation metadata.

## Projection Audiences

### Learner Projection

Shows current playable state, available actions, objective progress, blockers the learner can act on, assistance used, recoverable errors, pause/resume state, and completion status.

It must avoid exposing internal scoring heuristics, hidden assessment rules, private teacher notes, security signals, or cross-learner data.

### Parent Projection

Shows understandable activity summaries, support context, mission relation, broad progress, completion limitations, and when adult review is required.

It must not label a learner as mastered, weak, careless, or failing based only on gameplay activity.

### Teacher Projection

Shows objective attempts, evidence availability, assistance context, operational interruptions, collaboration attribution, and handoff readiness for Assessment.

Teacher views may contain more detail but still may not convert observations into Assessment claims.

### Mentor Projection

Shows only the information required to support the learner, including current objective, permitted hints, prior assistance, blockers, and privacy-safe evidence summaries.

### Mission Projection

Provides Mission Engine with session binding, objective resolution, completion decision, holds, waivers, limitations, and handoff identifiers.

It never commands Mission state changes.

### Assessment Projection

Provides Assessment Engine with immutable evidence references, provenance, assistance, accessibility context, collaboration attribution, integrity status, and limitations.

It never publishes mastery or correctness claims on Assessment's behalf.

### Operations Projection

Shows runtime health, queue lag, replay status, quarantine counts, lease conflicts, persistence failures, and publication state without exposing unnecessary learner content.

### Audit and Replay Projection

Shows exact source versions, ordering, policy versions, verification decisions, replay outcomes, and divergence evidence.

## Projection Families

- Session Summary Projection
- Active Gameplay Projection
- Objective Board Projection
- Interaction Timeline Projection
- Evidence Inventory Projection
- Completion Projection
- Mission Handoff Projection
- Assessment Handoff Projection
- Operational Health Projection
- Historical Replay Projection

Each family must declare its audience, source records, freshness contract, redaction policy, command affordances, and failure behavior.

## Freshness Model

```text
CURRENT
AGING
STALE
SUPERSEDED
WITHDRAWN
UNAVAILABLE
```

A stale projection must be visibly marked and must not expose commands whose safety depends on current state. A superseded or withdrawn projection must not present itself as active truth.

## Command Affordances

Projection may expose possible actions such as pause, resume, retry, request help, submit, or close only when those affordances are derived from current authoritative state and policy.

Affordance visibility is not authorization. Every command must be revalidated by its owning runtime.

```text
Visible Action ≠ Authorized Action
```

## Redaction and Privacy

Projection applies least-privilege disclosure across tenant, learner, guardian, teacher, mentor, classroom, collaboration group, and operations boundaries.

Redaction must be deterministic, policy-versioned, and auditable. Hidden fields must not leak through counts, identifiers, error text, ordering, or timing metadata.

## Localization and Accessibility

Localization may change wording but not meaning. Accessibility projections may alter presentation, timing guidance, input modality, and interaction affordances without weakening evidence provenance or mislabeling assisted actions as independent actions.

## Failure Semantics

Typed failures include:

- PROJECTION_SOURCE_MISSING
- PROJECTION_SOURCE_VERSION_CONFLICT
- PROJECTION_POLICY_UNAVAILABLE
- PROJECTION_AUDIENCE_UNAUTHORIZED
- PROJECTION_REDACTION_FAILED
- PROJECTION_FRESHNESS_UNKNOWN
- PROJECTION_MEANING_ESCALATION
- PROJECTION_COMMAND_UNSAFE
- PROJECTION_QUARANTINED

Failures must not silently fall back to a stronger or less restricted view.

## Determinism

Given identical source records, policy versions, audience context, locale, and clock input, projection output must be semantically deterministic.

Non-semantic differences such as field ordering or translated phrasing must be explicitly classified.

## Acceptance Gates

Implementation is acceptable only when automated verification proves:

1. audience isolation;
2. tenant and learner isolation;
3. no projection meaning escalation;
4. blocker, hold, waiver, assistance, and limitation preservation;
5. stale projection safety;
6. command revalidation at the owning runtime;
7. deterministic redaction;
8. localization meaning fidelity;
9. replay projection fidelity;
10. cache cannot become Source of Truth.

## Chapter Boundary

29G defines read models only. Durable storage and replay belong to 29H. Verification decisions belong to 29I. Cross-runtime invariants belong to 29J.
