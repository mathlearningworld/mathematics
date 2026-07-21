# Chapter 24 — Discovery Engine Architecture

# 24G — Hint & Guidance Runtime

## Status

- Chapter: 24
- Slice: 24G
- Authority: Discovery Engine Architecture
- Scope: guidance eligibility, intervention levels, timing, assistance evidence, anti-spoiler policy, adaptation, and runtime invariants

## Purpose

The Hint & Guidance Runtime defines how the system may support a player without replacing discovery with instruction or converting the world into a sequence of forced tutorials.

It governs when guidance is appropriate, how much help is allowed, what form it may take, how assistance is recorded, and when the system should remain silent.

## Core Principle

> Guidance should preserve the learner’s opportunity to notice, test, and form a relation independently whenever safe and productive.

The runtime must prefer the least intrusive intervention that can reopen productive exploration.

## Runtime Position

```text
Discovery Progression State
  + Current World Context
  + Player Intent
  + Friction Signals
  + Guidance Policy
    → Guidance Eligibility
      → Intervention Selection
        → Guidance Delivery Request
          → Assistance Evidence
```

## Guidance Is Not Teaching Authority

The Hint & Guidance Runtime does not define mathematical truth and does not certify understanding.

It may:

- draw attention,
- reduce irrelevant complexity,
- reveal a usable affordance,
- pose a contrast,
- suggest a next experiment,
- provide a partial representation,
- or demonstrate an action under explicit policy.

It must not silently mutate discovery state because a hint was shown.

## Guidance Lifecycle

```text
INELIGIBLE
  → ELIGIBLE
    → OFFERED
      → ACCEPTED
        → DELIVERED
          → OBSERVED

OFFERED
  → DECLINED
  → EXPIRED

DELIVERED
  → WITHDRAWN
```

Delivery and learner response must be recorded separately.

## Intervention Ladder

Guidance should generally follow an escalation ladder.

### Level 0 — Silence

Allow continued exploration.

### Level 1 — Attention Cue

Highlight or gently emphasize a relevant object, relation, or area without explaining it.

### Level 2 — Reflective Prompt

Invite observation.

Examples:

- What stayed the same?
- Which gap looks different?
- Can this be built another way?

Prompts should be language-light where possible.

### Level 3 — Constraint Reduction

Temporarily remove irrelevant options, stabilize a tool, or simplify the environment while preserving the target relation.

### Level 4 — Experiment Suggestion

Suggest a meaningful action or comparison without giving the result.

### Level 5 — Partial Strategy

Reveal part of a process while leaving a consequential step to the learner.

### Level 6 — Demonstration

Show a complete action or strategy. This is the most intrusive level and must remain distinguishable from independent discovery.

## Eligibility Inputs

Guidance eligibility may depend on:

- repeated non-progressing attempts,
- oscillation between incompatible strategies,
- long inactivity while an actionable affordance is available,
- contradiction without productive follow-up,
- explicit request for help,
- accessibility needs,
- emotional-friction signals where safely and ethically available,
- mission or world safety constraints.

A single mistake is not sufficient evidence that guidance is needed.

## Productive Struggle Window

The runtime should preserve a configurable period for productive struggle.

```ts
interface ProductiveStrugglePolicy {
  minimumObservationWindowMs?: number;
  minimumIndependentAttempts?: number;
  maximumRepeatedEquivalentFailures?: number;
  allowImmediateHelpRequest: boolean;
}
```

The policy must distinguish repeated equivalent failure from varied experimentation.

## Guidance Decision

```ts
interface GuidanceDecision {
  decisionId: string;
  learnerId: string;
  worldId: string;
  targetDiscoveryId?: string;
  eligibility: 'INELIGIBLE' | 'ELIGIBLE' | 'REQUIRED_FOR_ACCESSIBILITY';
  recommendedLevel: number;
  reasonCodes: string[];
  blockedReasonCodes: string[];
  policyVersion: number;
  evidenceRefs: string[];
}
```

## Anti-Spoiler Policy

Guidance must not reveal more semantic structure than necessary.

Examples:

- point to spacing before naming equal intervals,
- invite comparison before showing a formula,
- reveal a measuring tool before supplying a measurement,
- suggest changing one variable before explaining the invariant.

The system should not jump directly from uncertainty to explanation merely because an explanation is available.

## Player-Controlled Help

Players should be able to request help explicitly.

The runtime may still choose a lower intervention level first, but it must not punish help-seeking or conceal that assistance occurred.

Declining a hint must not be treated as failure.

## Assistance Evidence

Every delivered intervention produces assistance evidence.

```ts
interface AssistanceEvidence {
  assistanceId: string;
  learnerId: string;
  worldId: string;
  discoveryId?: string;
  interventionLevel: number;
  guidanceType: string;
  offeredAt: string;
  acceptedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  response: 'ACCEPTED' | 'DECLINED' | 'IGNORED' | 'PARTIALLY_USED';
  sourceDecisionId: string;
  policyVersion: number;
}
```

Discovery evaluation must be able to distinguish evidence produced before, during, and after assistance.

## Post-Guidance Observation

After guidance, the runtime should look for:

- whether the learner used the suggested affordance,
- whether they copied a demonstrated sequence,
- whether they adapted it,
- whether they later reproduced the relation independently,
- whether transfer occurred in a new context.

Immediate success after a demonstration is assisted performance, not independent discovery.

## Guidance Cooldown

Repeated prompts can become noise or coercion.

The runtime must support cooldown by:

- learner,
- discovery target,
- guidance level,
- world context,
- session.

A declined hint should normally increase the cooldown unless safety or accessibility policy overrides it.

## Context Sensitivity

Guidance should be grounded in current world state.

A hint must not refer to:

- an entity that no longer exists,
- an unavailable tool,
- a completed relation,
- a blocked placement socket,
- stale mission state,
- or a representation the learner cannot currently access.

## Guidance Delivery Boundary

The runtime selects semantic guidance intent. Presentation systems decide how to render it.

```text
Guidance Intent
  → UI / World Projection Adapter
    → visual cue, animation, sound, text, gesture, or accessibility output
```

Presentation must not change intervention level or semantic meaning silently.

## Adaptive Guidance

Adaptation may use prior evidence such as:

- preferred representations,
- successful prior hint levels,
- repeated assistance dependency,
- accessibility configuration,
- language preference,
- context-specific friction.

Adaptation must not use opaque judgments to restrict opportunity or permanently classify the learner.

## Accessibility

Some guidance is an accessibility accommodation rather than instructional help.

Examples:

- stronger contrast,
- longer interaction window,
- alternative input,
- audio description,
- reduced motor precision requirements.

Accessibility support must not automatically reduce discovery confidence unless it changes the semantic work performed by the learner.

## Safety and Well-Being

The system must avoid manipulative urgency, shame, repeated interruption, or emotionally loaded performance labels.

For children, guidance language should remain respectful, reversible, and focused on the current activity rather than personal ability.

## Multiplayer and Mentor Boundary

In shared worlds, guidance may come from:

- system prompts,
- another player,
- a family mentor,
- a teacher,
- or an NPC projection.

The source and intervention level must be recorded. Mentor contribution does not automatically imply the learner understood the relation.

## Failure and Recovery

Guidance delivery may fail because presentation state changed, the world advanced, or a device disconnected.

A delivery failure must not be recorded as accepted assistance. Retried guidance must remain idempotent by `assistanceId`.

## Observability

Telemetry should expose:

- eligibility decisions,
- reason codes,
- intervention levels offered,
- acceptance and decline rates,
- time to independent retry,
- repeated escalation,
- post-guidance transfer,
- stale-context rejection,
- accessibility overrides.

## Runtime Invariants

1. Guidance never creates discovery or mastery by itself.
2. The least intrusive productive intervention is preferred.
3. Assistance level and source remain traceable.
4. A single error does not automatically trigger guidance.
5. Declining help is not failure.
6. Immediate post-demonstration success remains assisted evidence.
7. Stale world context cannot produce valid guidance.
8. Accessibility support is not automatically treated as conceptual assistance.
9. Guidance delivery is idempotent and recoverable.
10. Presentation cannot silently alter semantic guidance level.
11. Guidance must not shame, coerce, or permanently label the learner.
12. Independent opportunity is restored after intervention whenever possible.

## Verification Targets

Verification must cover:

- productive-struggle timing,
- intervention escalation,
- explicit help requests,
- decline cooldown,
- stale-context refusal,
- assistance evidence recording,
- post-demonstration classification,
- accessibility distinction,
- idempotent delivery retry,
- multiplayer guidance source,
- anti-spoiler boundaries,
- independent follow-up evidence.

## Architectural Outcome

This slice establishes guidance as a governed, minimal, evidence-aware intervention layer.

It allows the game to help without stealing the discovery, while preserving a truthful record of what the learner did independently, with a cue, with a partial strategy, or after demonstration.