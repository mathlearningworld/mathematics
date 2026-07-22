# 39F — Learning Activity Projection Runtime

## 1. Purpose

Learning Activity Projection Runtime converts authoritative activity, authorization, orchestration, adaptation, session, and evidence events into role-specific read models.

It exists to answer operational questions quickly without transferring authority away from the owning runtimes.

> Projection explains activity state.
>
> Projection does not authorize, execute, complete, or adapt an activity.

## 2. Runtime Boundary

Learning Activity Projection Runtime owns:

- projection definitions,
- event consumption,
- read-model materialization,
- learner activity views,
- parent and guardian views,
- teacher planning and monitoring views,
- operator runtime views,
- activity queues,
- progress and blocker summaries,
- attempt and retry summaries,
- adaptation summaries,
- projection freshness,
- rebuild and repair,
- role-aware redaction,
- stale-action suppression.

It does not own:

- activity aggregate state,
- authorization decisions,
- orchestration commands,
- adaptation decisions,
- evidence authority,
- mastery interpretation,
- path authority.

## 3. Projection Sources

Projection consumes committed facts from:

- Learning Activity Runtime,
- Activity Authorization Runtime,
- Activity Orchestration Runtime,
- Adaptive Learning Activity Runtime,
- Learning Session Runtime,
- Learning Activity Evidence Runtime,
- Learning Path Runtime,
- Mastery Runtime,
- Curriculum Runtime,
- Skill Graph Runtime,
- Content Runtime.

Projection must never infer authority solely from missing or delayed events.

## 4. Core Read Models

### 4.1 Learner Activity View

Shows:

- current activity,
- activity purpose,
- current status,
- next available action,
- progress within the activity,
- attempts used,
- retry availability,
- hints or supports available,
- blockers,
- adaptation pending,
- completion acknowledgement,
- freshness state.

### 4.2 Learner Activity Queue

Shows:

- ready activities,
- blocked activities,
- deferred activities,
- review activities,
- optional activities,
- estimated order,
- required vs elective distinction,
- authorization freshness.

### 4.3 Parent or Guardian View

Shows:

- current activity category,
- recent completion summary,
- repeated retry indicators,
- support needs,
- teacher-review indicators,
- safe progress explanation,
- privacy-appropriate evidence summaries.

### 4.4 Teacher Activity View

Shows:

- assigned learners,
- current and queued activities,
- blockers,
- attempt patterns,
- adaptation history,
- intervention flags,
- content and objective references,
- projection freshness,
- evidence completeness.

### 4.5 Operator Runtime View

Shows:

- aggregate version,
- projection version,
- event offset,
- authorization status,
- session binding,
- pending outbox or inbox conditions,
- adaptation decision state,
- evidence obligations,
- integrity alerts,
- replay and rebuild status.

## 5. Canonical Projection Model

```ts
interface LearningActivityProjection {
  tenantId: string;
  learnerId: string;
  activityId: string;
  activityVersion: number;
  projectionVersion: number;
  activityType: string;
  activityStatus: string;
  authorizationStatus?: string;
  pathId?: string;
  pathVersion?: number;
  currentSessionId?: string;
  objectiveIds: string[];
  title?: string;
  learnerFacingPurpose?: string;
  progress: ActivityProgressProjection;
  attemptSummary: ActivityAttemptSummaryProjection;
  blockerSummary: ActivityBlockerProjection[];
  retrySummary?: ActivityRetryProjection;
  adaptationSummary?: ActivityAdaptationProjection;
  nextAction?: ActivityNextActionProjection;
  evidenceStatus: ActivityEvidenceStatusProjection;
  freshness: ProjectionFreshness;
  sourceOffsets: Record<string, string>;
  updatedAt: string;
}
```

## 6. Status Projection

Projected status must map from authoritative aggregate state.

Representative states:

```text
PLANNED
PENDING_AUTHORIZATION
READY
STARTING
IN_PROGRESS
PAUSED
COMPLETION_PENDING
COMPLETED
CLOSING
CLOSED
CANCELLED
ABORTED
EXPIRED
FAILED
REPLACED
```

Projection may create display groupings but must retain the underlying authoritative state.

## 7. Next Action Projection

```ts
interface ActivityNextActionProjection {
  actionType:
    | 'REQUEST_AUTHORIZATION'
    | 'START'
    | 'CONTINUE'
    | 'RESUME'
    | 'SUBMIT'
    | 'RETRY'
    | 'WAIT_FOR_REVIEW'
    | 'VIEW_RESULT'
    | 'RETURN_TO_PATH'
    | 'NONE';
  enabled: boolean;
  reasonCode?: string;
  expectedActivityVersion: number;
  authorizationId?: string;
  expiresAt?: string;
}
```

The UI must still submit a command to the authoritative runtime. The projection does not execute the action.

## 8. Stale-Action Suppression

An action must be disabled when:

- projection freshness is outside tolerance,
- expected activity version is unknown,
- authorization has expired,
- authorization revocation may be pending,
- activity has a newer aggregate version,
- session binding is unresolved,
- evidence completion obligations are unresolved,
- adaptation activation is pending,
- tenant or learner context is ambiguous.

## 9. Progress Projection

Activity progress may include:

```ts
interface ActivityProgressProjection {
  mode: 'ITEMS' | 'STEPS' | 'TIME' | 'MILESTONES' | 'UNKNOWN';
  completedUnits?: number;
  totalUnits?: number;
  percent?: number;
  currentStepLabel?: string;
  activeDurationMs?: number;
  estimatedRemainingMs?: number;
  isEstimate: boolean;
}
```

Progress percentage is operational progress, not mastery percentage.

```text
Activity progress ≠ Mastery progress
```

## 10. Attempt Summary

```ts
interface ActivityAttemptSummaryProjection {
  attemptsStarted: number;
  attemptsSubmitted: number;
  attemptsAccepted: number;
  correctCount?: number;
  incorrectCount?: number;
  partialCount?: number;
  hintsUsed: number;
  scaffoldsUsed: number;
  lastAttemptAt?: string;
  currentAttemptId?: string;
}
```

Role-specific views may redact raw responses and detailed scoring.

## 11. Retry Projection

Retry projection must show:

- whether retry is available,
- retry mode,
- attempts remaining,
- cooldown,
- remediation requirement,
- human-review requirement,
- authorization requirement,
- replacement activity when created.

Retry availability in projection is advisory until authoritative command acceptance.

## 12. Blocker Projection

```ts
interface ActivityBlockerProjection {
  blockerType:
    | 'AUTHORIZATION'
    | 'PREREQUISITE'
    | 'CONTENT_UNAVAILABLE'
    | 'SESSION_CONFLICT'
    | 'COOLDOWN'
    | 'HUMAN_REVIEW'
    | 'EVIDENCE_INCOMPLETE'
    | 'ADAPTATION_PENDING'
    | 'DEVICE_INCOMPATIBLE'
    | 'ACCESSIBILITY'
    | 'TIME_WINDOW'
    | 'RUNTIME_RECOVERY';
  severity: 'INFO' | 'WARNING' | 'BLOCKING';
  learnerMessage?: string;
  operatorCode: string;
  sourceRuntime: string;
  sourceVersion?: string;
  expectedResolutionAt?: string;
}
```

Blocker text must not expose sensitive operational details to learners.

## 13. Adaptation Projection

Adaptation projection may show:

- adaptation requested,
- adaptation reason category,
- review pending,
- replacement being prepared,
- retry with variation,
- remediation inserted,
- activity replaced,
- cooldown active.

It must preserve source and target lineage references for authorized roles.

## 14. Evidence Status Projection

```ts
interface ActivityEvidenceStatusProjection {
  requiredEvidenceCount?: number;
  committedEvidenceCount?: number;
  evidenceComplete: boolean;
  bundleId?: string;
  integrityStatus: 'UNKNOWN' | 'VALID' | 'WARNING' | 'INVALID';
  masteryConsumptionStatus?: 'NOT_READY' | 'READY' | 'CONSUMED' | 'REJECTED';
}
```

Evidence summary does not replace evidence authority.

## 15. Queue Ordering

Activity queue ordering may reflect:

- path order,
- authorization status,
- dependency readiness,
- timing windows,
- urgency,
- review spacing,
- teacher priority,
- learner choice constraints.

Queue ordering must expose whether it is:

```text
AUTHORITATIVE_ORDER
RECOMMENDED_ORDER
DISPLAY_ORDER
```

Display order must not be mistaken for path or authorization authority.

## 16. Optional Activities

Optional activities must be clearly distinguished from required activities.

Projection should expose:

- optionality source,
- whether completion affects path progression,
- whether activity is learner-selected,
- whether authorization is pre-granted or on demand.

## 17. Multi-Session Projection

Where an activity may span sessions, projection must show:

- current active session,
- historical session count,
- last checkpoint,
- resume availability,
- session conflict,
- unresolved session closure.

## 18. Concurrency Projection

Projection may observe temporarily inconsistent cross-runtime facts during event propagation.

It must represent uncertainty explicitly:

```text
SYNCING
PENDING_CONFIRMATION
RECOVERY_REQUIRED
```

It must not fabricate a stable state from conflicting versions.

## 19. Projection Freshness

```ts
interface ProjectionFreshness {
  state: 'CURRENT' | 'LAGGING' | 'STALE' | 'REBUILDING' | 'FAILED';
  projectedAt: string;
  sourceEventOccurredAt?: string;
  lagMs?: number;
  lastAppliedActivityVersion?: number;
  expectedActivityVersion?: number;
  lastErrorCode?: string;
}
```

## 20. Freshness Policy

Freshness policy depends on action risk.

Examples:

- viewing history may tolerate moderate lag,
- starting an activity requires current authorization and activity version,
- retry requires current attempt and policy state,
- operator diagnosis may show raw lag details,
- learner UI should suppress unsafe actions when freshness is uncertain.

## 21. Event Ordering

Projection consumers must order activity events by aggregate version, not solely by delivery time.

Handling rules:

- duplicate event → ignore idempotently,
- expected next version → apply,
- future version with gap → buffer or mark lagging,
- older version → ignore after verification,
- conflicting same version → quarantine and alert.

## 22. Idempotent Projection

The projection key must include:

- tenantId,
- learnerId,
- activityId.

Applied event identity or source offset must be stored to ensure idempotent updates.

## 23. Projection Transactions

Applying an event should atomically update:

- read model,
- last applied version,
- consumer offset or inbox state,
- derived queue indexes,
- rebuild metadata where needed.

## 24. Rebuild

Projection rebuild uses authoritative event history and evidence status.

Rebuild flow:

1. mark projection `REBUILDING`,
2. capture rebuild target offset,
3. clear or shadow the target projection,
4. replay events in deterministic order,
5. verify aggregate and projection versions,
6. reconcile derived indexes,
7. atomically activate rebuilt projection,
8. resume live consumption,
9. expose rebuild evidence.

## 25. Shadow Rebuild

High-risk projections should support shadow rebuild and comparison before activation.

Compare:

- activity status,
- authorization status,
- queue membership,
- progress values,
- blockers,
- next action,
- evidence completeness,
- role-based redaction.

## 26. Repair

Repair is distinct from rebuild.

Repair may address:

- missing derived index,
- stale queue membership,
- malformed display label,
- missing redaction field,
- incorrect cached estimate.

Repair must not override authoritative activity state.

## 27. Learner View Principles

Learner views should:

- use simple language,
- emphasize one primary action,
- distinguish waiting from failure,
- avoid exposing internal error codes,
- show progress without implying mastery,
- explain replacement or retry respectfully,
- preserve accessibility preferences.

## 28. Parent View Principles

Parent views should:

- explain progress and support needs,
- avoid overclaiming understanding,
- distinguish repeated practice from failure,
- show teacher-review indicators,
- respect learner privacy and age policy,
- avoid exposing raw sensitive responses by default.

## 29. Teacher View Principles

Teacher views should support:

- cohort filtering,
- activity-state grouping,
- blocker triage,
- retry and remediation review,
- adaptation review,
- evidence completeness,
- objective and prerequisite context,
- intervention notes.

Teacher projection must not allow direct database mutation. Actions remain explicit commands.

## 30. Operator View Principles

Operator views should expose:

- source versions,
- event IDs,
- projection offsets,
- idempotency status,
- evidence obligations,
- outbox/inbox lag,
- replay status,
- integrity alerts,
- correlation IDs.

Operational detail must remain permission-controlled.

## 31. Role-Based Redaction

Redaction policy may hide:

- raw learner responses,
- internal evaluator details,
- safety-sensitive signals,
- operator diagnostics,
- model prompts,
- private teacher notes,
- protected demographic data,
- internal policy thresholds.

Redaction must be applied at projection construction or controlled query boundary, not left solely to the client.

## 32. Tenant Isolation

Every projection query and materialization must enforce tenant identity.

Cross-tenant joins are forbidden unless a separately governed administrative context explicitly permits them.

## 33. Localization

Projection stores stable codes and references separately from localized display text.

Localization should be versioned where text affects user interpretation.

## 34. Accessibility

Projection should expose:

- representation alternatives,
- interaction-mode compatibility,
- text-to-speech availability,
- reduced-motion support,
- language support,
- contrast or display requirements,
- device capability constraints.

## 35. Search and Indexing

Derived indexes may support:

- learner activity queue,
- teacher cohort search,
- status filters,
- blocker filters,
- objective filters,
- retry-needed filters,
- adaptation-review filters.

Indexes are disposable projections and must be rebuildable.

## 36. Caching

Caches must include version or freshness metadata.

An action-bearing response should include expected activity version and authorization reference to support safe command submission.

## 37. Notification Projection

Notifications may be derived for:

- activity ready,
- activity resumed,
- review required,
- retry available,
- remediation inserted,
- completion accepted,
- activity replaced,
- teacher intervention requested.

Notification delivery does not change activity state.

## 38. Analytics Boundary

Analytics projections may aggregate:

- completion rates,
- retry rates,
- average active duration,
- adaptation rates,
- blocker rates,
- evidence lag.

Analytics must not become operational authority or individual mastery authority.

## 39. Failure Handling

On projection failure:

1. preserve consumer offset before the failed event,
2. record failure metadata,
3. mark affected projection stale or failed,
4. suppress unsafe actions,
5. retry idempotently,
6. quarantine malformed events,
7. trigger rebuild when repair is insufficient.

## 40. Observability

Metrics should include:

- event-consumer lag,
- projection update latency,
- out-of-order events,
- version gaps,
- duplicate events,
- rebuild duration,
- repair count,
- stale-action suppression count,
- role-query latency,
- queue divergence,
- redaction failures.

## 41. Verification Scenarios

Minimum scenarios:

1. duplicate events do not double-count attempts,
2. future version creates lag state,
3. stale projection disables start action,
4. revoked authorization removes start action,
5. activity completion does not display mastery completion,
6. retry summary matches committed attempt lineage,
7. adaptation replacement updates queue without erasing history,
8. learner view redacts operator details,
9. teacher view enforces tenant and assignment scope,
10. rebuild produces the same projection,
11. shadow rebuild detects divergence,
12. projection deletion does not affect activity authority,
13. evidence withdrawal changes evidence status summary,
14. session conflict displays a blocker,
15. concurrent event delivery preserves aggregate order.

## 42. Runtime Invariants

1. Projection is never activity authority.
2. Projection is never authorization authority.
3. Projection is never evidence authority.
4. Every projection is tenant-scoped.
5. Activity events apply in aggregate-version order.
6. Duplicate events are idempotent.
7. Version gaps are visible and never silently skipped.
8. Unsafe actions are suppressed when projection freshness is uncertain.
9. Every action-bearing projection includes an expected activity version.
10. Operational progress is not represented as mastery progress.
11. Role-based redaction is enforced server-side or at the projection boundary.
12. Derived indexes are rebuildable.
13. Rebuild does not re-decide adaptation or mastery.
14. Projection failure does not mutate authoritative state.
15. Queue display order does not replace path authority.
16. Retry availability remains subject to authoritative command acceptance.
17. Evidence summaries preserve integrity and withdrawal status.
18. Learner-facing messages do not expose protected operational details.
19. Cross-runtime uncertainty is represented explicitly.
20. Projection freshness accompanies every action-sensitive view.

## 43. Final Boundary

```text
Activity Runtime owns the work.
Authorization Runtime owns permission.
Orchestration Runtime owns execution transitions.
Adaptation Runtime owns explicit reconsideration.
Evidence Runtime proves what occurred.
Projection Runtime makes those facts understandable and queryable.

Projection may suggest an action.
Only the owning runtime may accept it.
```
