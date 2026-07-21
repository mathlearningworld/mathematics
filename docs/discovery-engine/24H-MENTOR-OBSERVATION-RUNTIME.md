# Chapter 24 — Discovery Engine Architecture

# 24H — Mentor Observation Runtime

## Status

- Chapter: 24
- Slice: 24H
- Authority: Discovery Engine Architecture
- Depends on: 24B Discovery Evidence, 24C Pattern Recognition, 24D Concept Formation, 24E Discovery Progression, 24F Knowledge Graph, 24G Hint & Guidance

## Purpose

The Mentor Observation Runtime projects trustworthy discovery evidence into a human-readable view for parents, teachers, tutors, and approved mentors.

It does not expose raw telemetry as judgment.
It does not convert observations into grades.
It does not allow a mentor to overwrite learner evidence.

Its responsibility is to help an authorized adult understand what the learner appears to be exploring, where evidence is strong or uncertain, what assistance has already occurred, and what kind of next observation may be useful.

## Core Principle

> A mentor observes the learner's evidence trail; the mentor does not become the authority that manufactures discovery.

## Runtime Position

```text
World Runtime
  → Discovery Evidence
    → Pattern / Concept Hypotheses
      → Discovery Progression
        → Mentor Observation Projection
          → Human Interpretation
```

Mentor input may return as contextual evidence, annotation, or guidance intent, but it must never rewrite authoritative world history.

## Authority Boundaries

### Discovery Engine owns

- evidence identity
- evidence provenance
- pattern hypotheses
- concept hypotheses
- progression state
- assistance classification
- contradiction history
- replayable interpretation

### Mentor Observation Runtime owns

- authorized observation projections
- learner-safe summaries
- evidence-backed alerts
- mentor annotations
- observation requests
- intervention recommendations
- visibility and privacy policy enforcement

### Mentor does not own

- discovery creation
- mastery declaration
- evidence deletion
- confidence mutation
- curriculum truth
- learner ranking

## Observation Projection

A mentor projection should contain only information needed for responsible support.

```ts
interface MentorObservationProjection {
  learnerId: string
  observerId: string
  observerRole: MentorRole
  scope: ObservationScope
  generatedAt: string
  sourceRevision: string
  activeDiscoveries: DiscoveryObservation[]
  emergingPatterns: PatternObservation[]
  conceptSignals: ConceptObservation[]
  assistanceHistory: AssistanceObservation[]
  contradictions: ContradictionObservation[]
  suggestedNextObservations: ObservationSuggestion[]
  privacyPolicyVersion: string
}
```

## Observer Roles

```text
PARENT_OR_GUARDIAN
TEACHER
TUTOR
FAMILY_MENTOR
PROGRAM_MENTOR
LEARNER_SELF_VIEW
SYSTEM_SUPPORT
```

Every role has an explicit data scope. Role names alone do not grant access; access requires a valid relationship and policy decision.

## Observation Scope

Observation scope may be constrained by:

- learner identity
- class or cohort
- subject domain
- concept family
- mission or world region
- date window
- evidence sensitivity
- guardian consent
- organization policy

A projection must be generated from the narrowest authorized scope.

## Discovery Observation

```ts
interface DiscoveryObservation {
  discoveryClaimId: string
  conceptId?: string
  state: DiscoveryProgressionState
  confidenceBand: 'LOW' | 'MEDIUM' | 'HIGH'
  evidenceCount: number
  independentEvidenceCount: number
  contextDiversity: number
  assistanceBand: AssistanceBand
  lastObservedAt: string
  learnerSafeSummary: string
  provenanceAvailable: boolean
}
```

The projection should favor evidence quality over activity volume.

## Learner-Safe Language

Mentor summaries must describe evidence, not label the learner.

Preferred:

```text
Observed equal spacing in two different building contexts.
The second success followed a reflective prompt.
Transfer to a measurement context has not yet been observed.
```

Prohibited:

```text
The learner is weak at ratios.
The learner does not understand measurement.
The learner is careless.
```

## Evidence Bands

The mentor view may simplify internal confidence into broad bands, but the underlying evidence remains available for authorized inspection.

```text
LOW     insufficient or highly assisted evidence
MEDIUM  repeated evidence with limited diversity
HIGH    independent evidence across varied contexts
```

A band is an observation aid, not a score.

## Assistance Visibility

Mentors need to know how success occurred.

```text
UNASSISTED
ATTENTION_CUE
REFLECTIVE_PROMPT
CONSTRAINT_REDUCTION
EXPERIMENT_SUGGESTION
PARTIAL_STRATEGY
DEMONSTRATION
AUTOMATED_ACTION
```

Assisted success remains valuable evidence, but it must not be represented as independent discovery.

## Contradiction Visibility

The runtime preserves meaningful contradictions.

Examples:

- a pattern succeeded in one representation but failed in another
- equal spacing was maintained until orientation changed
- a concept claim was supported only after demonstration
- a previously stable behavior became inconsistent after a long gap

Contradictions should be presented as questions for observation, not accusations.

## Productive Mentor Actions

The runtime may offer actions such as:

- observe without intervening
- ask the learner to explain a choice
- invite a similar experiment in a new context
- request the learner to predict before acting
- compare two constructions
- revisit a dormant concept through play
- acknowledge effort without revealing the solution

## Prohibited Mentor Actions

The system must not encourage mentors to:

- complete the task for the learner
- force a specific strategy when alternatives are valid
- treat speed as understanding
- repeatedly quiz during active exploration
- reveal hidden system judgments
- compare siblings or classmates
- convert uncertainty into punishment

## Mentor Annotation

Mentors may add contextual notes without changing evidence authority.

```ts
interface MentorAnnotation {
  annotationId: string
  learnerId: string
  observerId: string
  createdAt: string
  scope: ObservationScope
  relatedClaimIds: string[]
  category: MentorAnnotationCategory
  note: string
  visibility: AnnotationVisibility
  source: 'HUMAN_OBSERVATION'
}
```

Possible categories:

```text
LEARNER_EXPLANATION
OFFLINE_CONTEXT
ACCESSIBILITY_CONTEXT
MOTIVATION_CONTEXT
STRATEGY_OBSERVATION
MISCONCEPTION_SUSPECTED
FOLLOW_UP_REQUESTED
```

Annotations are append-only records. Corrections create a new annotation that supersedes the previous one.

## Offline Observation

A mentor may witness reasoning outside the game. Such evidence must remain distinguishable from runtime-generated evidence.

```text
WORLD_AUTHORITY_EVIDENCE
MENTOR_REPORTED_OBSERVATION
LEARNER_SELF_REPORT
IMPORTED_ASSESSMENT_EVIDENCE
```

The Discovery Engine may consider external evidence only through explicit policy and provenance rules.

## Observation Request

A mentor can request a future opportunity to observe a concept without scripting the learner's answer.

```ts
interface ObservationRequest {
  requestId: string
  learnerId: string
  requestedBy: string
  targetConceptId: string
  preferredContextTypes: string[]
  assistanceCeiling: AssistanceBand
  expiresAt?: string
  status: 'OPEN' | 'SATISFIED' | 'EXPIRED' | 'CANCELLED'
}
```

The world may later surface a natural affordance that can produce relevant evidence.

## Alert Policy

Alerts are reserved for meaningful situations, such as:

- persistent contradiction across contexts
- repeated dependence on high-level assistance
- prolonged absence of expected prerequisite evidence
- rapid progression that may benefit from enrichment
- recurring frustration signals with low evidence yield
- accessibility barriers affecting evidence quality

Alerts must be rate-limited, evidence-backed, and explainable.

## No Surveillance Doctrine

The mentor view must not become a surveillance dashboard.

The runtime should avoid:

- continuous minute-by-minute monitoring
- productivity rankings
- punitive inactivity indicators
- raw clickstream exposure
- hidden behavioral scoring
- attention inference without explicit, validated evidence

The goal is supportive interpretation, not control.

## Privacy and Consent

Every projection requires:

- authenticated observer
- valid learner relationship
- active consent or lawful authority
- scoped purpose
- retention policy
- audit record

Sensitive learner data must follow data minimization. Raw evidence should be hidden unless the observer has a legitimate need to inspect provenance.

## Auditability

Every mentor projection records:

- who viewed it
- which learner scope was accessed
- which policy authorized access
- which source revision produced the projection
- whether sensitive evidence was expanded
- whether an annotation or intervention request was created

## Failure Handling

If evidence is incomplete, stale, or replay is pending, the projection must say so explicitly.

The runtime must prefer:

```text
Evidence unavailable
Interpretation pending
Insufficient context
```

over fabricated certainty.

## Runtime Invariants

1. A mentor projection must be derived from traceable discovery evidence.
2. A mentor cannot directly mutate discovery state.
3. Mentor annotations never replace authoritative world evidence.
4. Assisted performance must remain visibly assisted.
5. Contradictory evidence must not be silently removed.
6. Learner descriptions must use evidence language, not fixed labels.
7. Access must be relationship-scoped and policy-audited.
8. External observations must retain source provenance.
9. Observation requests must not prescribe a hidden answer.
10. Alerts must be explainable and rate-limited.
11. Privacy minimization must apply before projection generation.
12. A stale or incomplete projection must declare its limitations.

## Architectural Outcome

The Mentor Observation Runtime turns Discovery Engine state into responsible human support without surrendering evidence authority, learner agency, or privacy.

It establishes a trustworthy bridge between the player's lived activity in the world and the adults who help the learner continue growing.