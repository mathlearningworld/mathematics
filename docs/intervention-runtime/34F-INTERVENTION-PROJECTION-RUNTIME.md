# 34F — Intervention Projection Runtime

## Status

- Chapter: 34 — Intervention Runtime
- Slice: 34F
- Authority: Architecture specification
- Depends on: 34A–34E, Progress Engine, Diagnostic Runtime, Recommendation Runtime, Mission Engine, Learning Engine

## Purpose

Intervention Projection Runtime creates audience-specific read models from intervention authority without changing the meaning of plans, executions, adaptations, or effectiveness evaluations.

It allows learners, parents, teachers, administrators, and downstream engines to see the same intervention through different operational views while preserving uncertainty, freshness, access control, and traceability.

## Core Doctrine

> Projection may simplify presentation, but it may not promote a plan into an execution fact, completion into effectiveness, or a hypothesis into truth.

Required distinctions:

```text
Projection ≠ Authority
Summary ≠ Evidence
Status color ≠ Meaning
Completion bar ≠ Effectiveness
Recommendation card ≠ Authorization
Stale read model ≠ Current runtime state
```

## Responsibilities

This runtime owns:

1. intervention read-model families,
2. audience-specific field selection,
3. freshness and rebuild status,
4. traceability to authority records,
5. uncertainty-preserving summaries,
6. timeline projections,
7. workload and schedule projections,
8. effectiveness and adaptation summaries,
9. access and privacy filtering,
10. downstream engine feeds.

It does not own:

- plan authorization,
- intervention execution,
- adaptation decisions,
- effectiveness evaluation,
- diagnosis,
- progress authority,
- curriculum authority.

## Projection Families

```text
LEARNER_INTERVENTION_VIEW
PARENT_INTERVENTION_SUMMARY
TEACHER_INTERVENTION_WORKBENCH
TUTOR_EXECUTION_BRIEF
ADMIN_INTERVENTION_AUDIT
INTERVENTION_TIMELINE
INTERVENTION_SCHEDULE
ACTIVE_INTERVENTION_QUEUE
ADAPTATION_HISTORY
EFFECTIVENESS_SUMMARY
STRATEGY_OUTCOME_COMPARISON
DIAGNOSTIC_FEEDBACK_FEED
RECOMMENDATION_FEEDBACK_FEED
MISSION_ENGINE_FEED
LEARNING_ENGINE_FEED
PROGRESS_ENGINE_FEED
```

Each family has an explicit schema, audience, authority source set, privacy policy, and freshness policy.

## Projection Envelope

```ts
interface InterventionProjectionEnvelope<T> {
  projectionId: string;
  projectionType: InterventionProjectionType;
  subjectRef: string;
  interventionId?: string;
  data: T;
  sourceEventPosition: string;
  sourceVersions: SourceVersionRef[];
  freshness: ProjectionFreshness;
  confidence?: ProjectionConfidence;
  limitations: string[];
  generatedAt: string;
  accessPolicyVersion: string;
}
```

## Freshness States

```text
CURRENT
STALE_NON_BLOCKING
STALE_BLOCKING
REBUILDING
FAILED
UNKNOWN
```

Rules:

- `CURRENT` means the projection includes all required authority events through its declared position.
- `STALE_NON_BLOCKING` may be shown with a visible warning for low-impact use.
- `STALE_BLOCKING` must not drive execution, adaptation, or high-impact decisions.
- `REBUILDING` must expose the last trustworthy position.
- `FAILED` must not silently fall back to empty or successful state.
- `UNKNOWN` requires conservative behavior.

## Learner Projection

The learner view should answer:

- What am I working on now?
- Why is this activity being offered in learner-safe language?
- What is the next action?
- How long is the current session expected to take?
- Can I pause, ask for help, or request another representation?
- What progress has been observed without labeling ability?

It must avoid:

- opaque risk scores,
- deficit labels,
- speculative root-cause language,
- pressure-inducing comparative rankings,
- hidden escalation or monetization signals.

Example:

```ts
interface LearnerInterventionView {
  interventionId: string;
  title: string;
  learnerSafePurpose: string;
  currentPhase: string;
  nextAction: LearnerAction;
  expectedDuration?: number;
  supportOptions: SupportOption[];
  pauseAllowed: boolean;
  status: LearnerInterventionStatus;
  progressSummary?: string;
  freshness: ProjectionFreshness;
}
```

## Parent Projection

The parent summary should expose:

- target area,
- planned support,
- participation and schedule,
- observed outcomes,
- uncertainty and pending evidence,
- safe ways to support,
- whether teacher or specialist review is requested.

It must distinguish:

```text
Planned support
Support delivered
Evidence observed
Effectiveness judgment
Next review point
```

## Teacher Workbench

The teacher projection may include:

- active and pending interventions,
- target skills and diagnostic rationale,
- plan versions,
- execution fidelity,
- adaptation triggers,
- evidence gaps,
- retention and transfer status,
- review and escalation queues,
- learner workload across interventions.

Teacher actions remain commands against authority runtimes; changing a projection does not mutate the intervention.

## Tutor Execution Brief

This projection provides only the information required to deliver an authorized intervention:

- current phase,
- permitted strategy and representation,
- dosage and timing,
- accommodations,
- stop conditions,
- evidence to capture,
- escalation route.

It should exclude unrelated diagnostic history and sensitive learner data.

## Admin Audit Projection

The audit view supports governance and investigation:

- full authority chain,
- actor and role history,
- model and policy versions,
- plan and execution versions,
- adaptations,
- evidence references,
- effectiveness evaluations,
- overrides and safety blocks,
- projection rebuild history.

Audit projection access must be separately authorized and logged.

## Timeline Projection

Timeline entries must preserve event meaning.

```text
PLAN_CREATED
PLAN_AUTHORIZED
EXECUTION_STARTED
PHASE_COMPLETED
EXECUTION_PAUSED
ADAPTATION_TRIGGERED
ADAPTATION_APPLIED
EVIDENCE_RECEIVED
EXECUTION_COMPLETED
EFFECTIVENESS_EVALUATED
REVIEW_REQUESTED
INTERVENTION_CLOSED
```

A timeline may merge low-level technical events for readability, but every entry must retain links to source authority records.

## Active Queue Projection

The active queue supports operational coordination and may sort by:

- safety priority,
- overdue review,
- blocked execution,
- learner availability,
- scheduled time,
- evidence deadline,
- adaptation pending,
- human review required.

Sorting is not truth. The projection must expose the ranking policy and must not conceal lower-ranked safety signals.

## Effectiveness Summary Projection

The summary must show:

- classification,
- evaluation window,
- execution fidelity,
- evidence coverage,
- confidence band,
- limitations,
- next recommended action.

It must not compress `INCONCLUSIVE` into neutral success or represent `PARTIALLY_EFFECTIVE` as complete resolution.

## Downstream Engine Feeds

### Mission Engine Feed

May expose:

- active intervention obligations,
- authorized mission bindings,
- scheduling constraints,
- completion state,
- pending adaptation or review.

### Learning Engine Feed

May expose:

- authorized next phase,
- delivery strategy version,
- learner-safe parameters,
- accommodation requirements,
- evidence-capture contract.

### Progress Engine Feed

May expose only verified outcome evidence and effectiveness state, never a projection-only inference.

### Diagnostic and Recommendation Feedback

May expose:

- outcome evidence references,
- strategy context,
- execution fidelity,
- contradiction signals,
- request for hypothesis or recommendation review.

## Privacy and Minimum Necessary Data

Every projection family must define:

- allowed audience roles,
- allowed fields,
- masking rules,
- retention policy,
- export policy,
- audit requirements.

A downstream engine receives the minimum data necessary for its authorized decision.

## Rebuild Strategy

Projection rebuild must support:

1. full replay from event authority,
2. snapshot-assisted rebuild,
3. targeted learner rebuild,
4. targeted intervention rebuild,
5. version-aware schema migration,
6. checkpoint verification,
7. atomic publication of rebuilt results.

A partially rebuilt projection must never be published as current.

## Failure Codes

```text
PROJECTION_SOURCE_MISSING
PROJECTION_SOURCE_STALE
PROJECTION_VERSION_UNSUPPORTED
PROJECTION_REBUILD_REQUIRED
PROJECTION_REBUILD_FAILED
PROJECTION_CHECKPOINT_MISMATCH
PROJECTION_ACCESS_DENIED
PROJECTION_FIELD_FORBIDDEN
PROJECTION_FRESHNESS_BLOCKED
PROJECTION_AUTHORITY_TRACE_MISSING
PROJECTION_PUBLICATION_CONFLICT
```

## Events

```text
InterventionProjectionRequested
InterventionProjectionBuilt
InterventionProjectionPublished
InterventionProjectionMarkedStale
InterventionProjectionRebuildStarted
InterventionProjectionRebuildCompleted
InterventionProjectionRebuildFailed
InterventionProjectionAccessDenied
```

## Acceptance Criteria

34F is complete when:

- every projection links to source authority,
- audience views preserve the distinctions among plan, execution, adaptation, and effectiveness,
- stale projections cannot drive high-impact actions,
- learner-facing views avoid deficit labeling,
- privacy uses minimum necessary data,
- downstream feeds contain only authorized semantics,
- rebuild behavior is versioned and auditable.

## Runtime Invariants

1. Projection never creates intervention authority.
2. Projection never changes completion into effectiveness.
3. Projection never converts uncertainty into certainty.
4. Stale-blocking projections cannot authorize execution or adaptation.
5. Every displayed operational status must be traceable to source authority.
6. Learner-facing projections must not expose speculative deficit labels.
7. Downstream feeds must contain only the minimum authorized data.
8. Failed projection rebuilds must remain visible and must not publish partial truth.
