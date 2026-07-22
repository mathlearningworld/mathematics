# 36D — Adaptive Journey Runtime

## 1. Purpose

Adaptive Journey Runtime governs how an active learning journey changes over time without losing authority, continuity, explainability, or safety.

A journey spans many sessions, phases, milestones, interventions, and external constraints. Its adaptation rules must therefore operate at a higher level than session adaptation.

This runtime answers:

- When should the journey change?
- What may change safely?
- What must remain stable?
- Which authority may approve the change?
- How is the change explained and replayed?
- How does adaptation affect current and future sessions?

## 2. Core Rule

> Journey adaptation changes the authorized route toward an objective; it does not rewrite past learning evidence or silently redefine the objective.

## 3. Authority Boundary

Adaptive Journey Runtime owns:

- journey-level adaptation eligibility
- adaptation proposal synthesis
- adaptation impact analysis
- safe adaptation envelopes
- phase and milestone replanning requests
- session-intent regeneration requests
- adaptation acceptance and rejection records
- adaptation lineage
- adaptation rollback decisions

It does not own:

- mission objective authority
- curriculum truth
- mastery certification
- diagnostic truth
- intervention policy authority
- session execution authority
- evidence creation authority

## 4. Adaptation Inputs

Adaptation may consume versioned snapshots from:

- current journey aggregate
- accepted journey plan
- completed and active phases
- milestone status
- session outcomes
- diagnostic findings
- progress projections
- intervention recommendations
- learner availability
- deadline constraints
- curriculum changes
- accessibility requirements
- safety restrictions
- teacher or parent authorized decisions

Every input must include source runtime, source version, observed time, and confidence where applicable.

## 5. Adaptation Triggers

### 5.1 Learning Triggers

- prerequisite weakness discovered
- repeated failure pattern
- unexpectedly rapid mastery
- evidence conflict
- stalled progress
- retention regression
- transfer weakness

### 5.2 Operational Triggers

- learner availability changed
- deadline changed
- session capacity reduced
- device or connectivity limitations
- content unavailable
- intervention scheduled

### 5.3 Policy Triggers

- safety policy update
- curriculum requirement update
- accessibility accommodation update
- human authority override

### 5.4 Trigger Rules

A trigger is not automatically an adaptation.

Each trigger becomes an `AdaptationSignal` and must pass:

1. authenticity validation
2. freshness validation
3. relevance validation
4. duplication check
5. authority check
6. materiality threshold

## 6. Adaptation Signal Model

```text
AdaptationSignal
- signalId
- journeyId
- signalType
- sourceRuntime
- sourceEntityId
- sourceVersion
- observedAt
- confidence
- severity
- affectedScope
- supportingEvidenceRefs[]
- deduplicationKey
```

Signals are immutable observations.

## 7. Adaptation Decision Lifecycle

```text
SIGNAL_RECEIVED
→ ELIGIBILITY_CHECKED
→ IMPACT_ANALYZED
→ PROPOSAL_CREATED
→ AUTHORITY_REVIEWED
→ ACCEPTED | REJECTED | DEFERRED
→ APPLIED
→ EFFECT_OBSERVED
→ CONFIRMED | ROLLED_BACK
```

Each transition must be persisted.

## 8. Adaptation Scope

Adaptation scope may be:

- scheduling only
- session sequencing
- session frequency
- phase duration
- milestone criteria routing
- prerequisite insertion
- remediation insertion
- enrichment insertion
- intervention insertion
- content modality adjustment
- support-intensity adjustment
- target pacing adjustment
- plan branch switch

Adaptation must not silently change:

- learner identity
- mission identity
- authorized objective
- historical evidence
- completed event history
- certified mastery outcome

## 9. Safe Adaptation Envelope

Every active journey has an `AdaptationEnvelope` defining what can change automatically.

```text
AdaptationEnvelope
- envelopeVersion
- autoAdjustableScopes[]
- reviewRequiredScopes[]
- prohibitedScopes[]
- maxPacingChange
- maxPhaseExpansion
- maxInsertedSessions
- deadlineFlexibility
- safetyConstraints[]
- accessibilityConstraints[]
- humanApprovalRules[]
```

Changes outside the envelope require explicit authority.

## 10. Adaptation Proposal

```text
JourneyAdaptationProposal
- proposalId
- journeyId
- baseJourneyVersion
- basePlanVersion
- triggerSignalIds[]
- proposedChanges[]
- expectedBenefits[]
- expectedRisks[]
- affectedPhases[]
- affectedMilestones[]
- affectedSessionIntents[]
- evidenceBasis[]
- reversibilityClass
- reviewRequirement
- createdByPolicyVersion
- createdAt
```

A proposal is not executable authority.

## 11. Impact Analysis

Before acceptance, runtime must evaluate:

- objective continuity
- prerequisite validity
- milestone reachability
- deadline feasibility
- learner load
- intervention conflicts
- active session impact
- pending command impact
- evidence requirement impact
- projection impact
- rollback feasibility
- cross-runtime compatibility

Impact analysis must be deterministic for identical input versions and policy versions.

## 12. Active Session Protection

An accepted adaptation must not mutate an already active session plan in place.

Allowed strategies:

- apply after current session
- cancel and recreate only with explicit session authority
- mark future intent superseded
- defer adaptation until safe checkpoint

Default rule:

> Active session continuity takes precedence over non-critical journey optimization.

## 13. Plan Lineage

Every accepted adaptation creates a new plan version.

```text
JourneyPlanVersion
- planVersion
- parentPlanVersion
- adaptationDecisionId
- effectiveFrom
- supersededAt
- migrationPolicy
```

No accepted plan version may be overwritten.

## 14. Adaptation Classes

### 14.1 Minor

- schedule shift
- equivalent content substitution
- session order adjustment within phase

May be automatic within envelope.

### 14.2 Material

- prerequisite insertion
- phase extension
- milestone route change
- intervention insertion

Usually requires policy or human review.

### 14.3 Objective-Affecting

- target replacement
- deadline commitment change
- mission scope change

Must be delegated to Mission authority and cannot be completed by Journey Runtime alone.

## 15. Replanning Contract

Adaptive Journey Runtime does not directly author a replacement plan.

It issues:

```text
RequestJourneyReplan
- journeyId
- currentPlanVersion
- adaptationDecisionId
- requiredChanges[]
- preservedConstraints[]
- effectiveCheckpoint
```

Journey Planning Runtime returns a candidate plan. Adaptive Runtime then validates that it satisfies the accepted decision.

## 16. Fast Path Adaptation

For low-risk changes, runtime may use a fast path when:

- scope is explicitly auto-adjustable
- no active session is mutated
- objective is unchanged
- evidence criteria are unchanged
- rollback is simple
- deterministic verification passes

Fast path still creates a full decision record.

## 17. Human Authority

Human authority roles may include:

- learner
- parent or guardian
- teacher
- intervention specialist
- curriculum administrator
- platform safety authority

Role permissions must be explicit and tenant-scoped.

A human override must record:

- actor identity
- role
- reason
- affected scope
- prior recommendation
- acknowledgement of risks

## 18. Conflict Resolution

When adaptation signals conflict:

1. safety constraints dominate
2. legal and policy constraints dominate convenience
3. mission authority dominates journey optimization
4. verified evidence dominates weak inference
5. recent evidence does not automatically invalidate longitudinal evidence
6. unresolved conflicts defer material adaptation

## 19. Adaptation History

```text
JourneyAdaptationRecord
- adaptationId
- journeyId
- previousPlanVersion
- nextPlanVersion
- decision
- triggerSignals[]
- acceptedChanges[]
- rejectedChanges[]
- authorityActor
- policyVersion
- appliedAt
- outcomeObservationWindow
- outcomeStatus
```

History is append-only.

## 20. Outcome Observation

After adaptation, runtime evaluates whether expected effects occurred.

Possible outcomes:

- BENEFIT_CONFIRMED
- NEUTRAL
- HARM_DETECTED
- INCONCLUSIVE
- ROLLBACK_REQUIRED

Observation must not fabricate causality. It records correlation and confidence.

## 21. Rollback

Rollback is allowed only when:

- prior plan remains compatible
- no irreversible authority transition occurred
- completed evidence remains preserved
- new session outcomes are reconciled
- current session safety is protected

Rollback creates a new forward version; it never deletes adaptation history.

## 22. Idempotency and Concurrency

Adaptation commands require:

- journey version
- plan version
- idempotency key
- correlation ID
- actor authority
- policy version

Concurrent accepted adaptations must serialize through optimistic concurrency.

## 23. Events

Recommended events:

- `JourneyAdaptationSignalReceived`
- `JourneyAdaptationEligibilityConfirmed`
- `JourneyAdaptationProposalCreated`
- `JourneyAdaptationDeferred`
- `JourneyAdaptationRejected`
- `JourneyAdaptationAccepted`
- `JourneyReplanRequested`
- `JourneyAdaptationApplied`
- `JourneyAdaptationOutcomeObserved`
- `JourneyAdaptationRollbackRequested`
- `JourneyAdaptationRolledBack`

## 24. Failure Codes

- `JOURNEY_NOT_ADAPTABLE`
- `ADAPTATION_SIGNAL_STALE`
- `ADAPTATION_SIGNAL_DUPLICATE`
- `ADAPTATION_OUTSIDE_ENVELOPE`
- `ADAPTATION_AUTHORITY_REQUIRED`
- `ACTIVE_SESSION_PROTECTED`
- `ADAPTATION_BASE_VERSION_CONFLICT`
- `ADAPTATION_OBJECTIVE_CHANGE_FORBIDDEN`
- `ADAPTATION_REPLAN_INVALID`
- `ADAPTATION_ROLLBACK_UNSAFE`

## 25. Observability

Metrics:

- signals received
- proposals created
- automatic acceptance rate
- human review rate
- rejection rate
- rollback rate
- time to adaptation
- active-session deferral rate
- outcome benefit rate
- unresolved conflict rate

Logs must include journey ID, adaptation ID, plan versions, and correlation ID, without exposing sensitive learner data unnecessarily.

## 26. Verification Requirements

Adaptive runtime verification must prove:

- no historical evidence mutation
- no objective mutation without Mission authority
- active session protection
- deterministic impact analysis
- plan lineage preservation
- idempotent signal processing
- concurrency rejection on stale versions
- reversible rollback semantics
- cross-runtime contract compatibility

## 27. Invariants

1. Every applied adaptation references an accepted decision.
2. Every accepted decision references immutable trigger signals.
3. Every material adaptation creates a new plan version.
4. No adaptation deletes past events or evidence.
5. No adaptation silently changes the mission objective.
6. Active sessions are not mutated in place.
7. Automatic adaptation stays within the active envelope.
8. Rollback is represented as a new forward transition.
9. Adaptation outcome is observed, not assumed.
10. Identical versioned inputs and policy versions produce identical analysis.

## 28. Completion Condition

36D is complete when the platform can safely detect journey-level change needs, create explainable proposals, obtain required authority, apply versioned replanning, protect active sessions, observe outcomes, and roll back without rewriting history.
