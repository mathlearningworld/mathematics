# 35F — Session Projection Runtime

## Status

**Chapter:** 35 — Learning Session Runtime  
**Slice:** 35F  
**Authority:** Architecture specification  
**Purpose:** Define read models that expose session state, evidence, progress, adaptation, and operational status to learners, families, teachers, tutors, administrators, and downstream runtimes without becoming execution authority.

---

## 1. Problem

Learning Session Runtime contains rich authoritative history, but each consumer needs a different view:

- the learner needs the next clear action;
- a parent needs a safe summary;
- a teacher needs evidence and intervention context;
- a tutor needs execution guidance;
- operations need failures and recovery state;
- downstream runtimes need stable machine-readable feeds.

Serving every consumer directly from write-side aggregates would increase coupling, expose inappropriate detail, and create accidental authority in UI code. Projection Runtime creates purpose-specific, rebuildable read models.

---

## 2. Core Distinctions

```text
Projection ≠ Authority
Read model ≠ Aggregate
Visible progress ≠ Mastery
Session completion ≠ Learning success
Summary ≠ Evidence
Fresh-looking UI ≠ Fresh data
Learner view ≠ Teacher view
Operational status ≠ Learner judgment
```

---

## 3. Runtime Responsibility

Session Projection Runtime owns:

- consuming authoritative session events;
- building versioned read models;
- presenting audience-specific language and detail;
- preserving freshness and provenance metadata;
- supporting rebuild and replay;
- exposing machine-readable feeds;
- preventing projection state from mutating authoritative runtime state.

It does not own:

- advancing session state;
- applying adaptations;
- accepting evidence;
- declaring mastery;
- changing plans;
- issuing rewards;
- resolving diagnosis or intervention outcomes.

---

## 4. Projection Families

Canonical projection families:

```text
LEARNER_ACTIVE_SESSION
LEARNER_SESSION_SUMMARY
PARENT_SESSION_SUMMARY
TEACHER_SESSION_WORKBENCH
TUTOR_SESSION_BRIEF
ADMIN_SESSION_AUDIT
ACTIVE_SESSION_QUEUE
SESSION_TIMELINE
SESSION_EVIDENCE_SUMMARY
SESSION_ADAPTATION_HISTORY
SESSION_RECOVERY_STATUS
LEARNING_ENGINE_FEED
PROGRESS_ENGINE_FEED
INTERVENTION_RUNTIME_FEED
DIAGNOSTIC_RUNTIME_FEED
```

Each family has its own purpose, schema, access policy, freshness requirement, and redaction policy.

---

## 5. Projection Envelope

```text
ProjectionEnvelope<T>
  projectionType
  projectionId
  tenantId
  subjectId
  sourceAggregateId
  sourceVersion
  projectionVersion
  schemaVersion
  freshnessState
  lastEventPosition
  generatedAt
  policyVersion
  accessScope
  data: T
```

The envelope must make staleness visible to consumers.

---

## 6. Freshness States

```text
CURRENT
STALE_NON_BLOCKING
STALE_BLOCKING
REBUILDING
FAILED
UNKNOWN
```

Rules:

- `CURRENT` means processed through the expected source position.
- `STALE_NON_BLOCKING` may be shown with a freshness warning.
- `STALE_BLOCKING` must not support safety-sensitive or authority-sensitive decisions.
- `REBUILDING` indicates temporary unavailability or partial data.
- `FAILED` requires operational attention.
- `UNKNOWN` must not be presented as current.

---

## 7. Learner Active Session Projection

Purpose: show the learner what to do now with minimal cognitive load.

```text
LearnerActiveSession
  sessionId
  displayTitle
  currentPhase
  currentActivity
  nextAction
  optionalSupports[]
  pauseAllowed
  resumeAvailable
  approximateRemainingTime?
  progressIndicator
  accessibilitySettings
  supportiveMessage?
  connectivityState
  freshness
```

Learner view must not expose:

- diagnostic labels;
- risk scores;
- hidden confidence calculations;
- teacher-only notes;
- negative ability labels;
- internal adaptation rationale that may stigmatize;
- administrative or technical error detail.

---

## 8. Learner Session Summary

Purpose: explain what was practiced and what happens next.

```text
LearnerSessionSummary
  sessionId
  completedAt?
  practicedObjectives[]
  activitiesCompleted
  supportsUsed[]
  achievements[]
  nextRecommendedStep?
  continuationAvailable
  evidencePending
  friendlyStatus
```

The summary may celebrate effort and completed work, but must not claim mastery unless supplied by the owning authority.

---

## 9. Parent Session Summary

Purpose: provide understandable, non-stigmatizing visibility.

```text
ParentSessionSummary
  learnerId
  sessionId
  sessionDate
  plannedFocus[]
  participationSummary
  completedActivities
  supportSummary
  notableStrengths[]
  areasForSupport[]
  followUpStatus
  teacherContactSuggested?
  evidenceConfidenceSummary
  privacyNotice?
```

Parent language should distinguish observation from conclusion and avoid exposing unnecessary child-sensitive detail.

---

## 10. Teacher Session Workbench

Purpose: support professional review and action.

```text
TeacherSessionWorkbench
  learnerId
  sessionId
  planSummary
  objectiveCoverage[]
  executionFidelity
  evidenceSummary[]
  evidenceConflicts[]
  adaptationHistory[]
  prerequisiteSignals[]
  accessibilityContext
  interventionContext?
  diagnosticContext?
  unresolvedItems[]
  recommendedReviewActions[]
  sourceLinks[]
  freshness
```

Teacher views may contain deeper interpretation context but must still preserve evidence provenance and uncertainty.

---

## 11. Tutor Session Brief

Purpose: enable a human tutor to continue authorized support.

```text
TutorSessionBrief
  learnerId
  sessionId
  authorizedObjectives[]
  currentPosition
  allowedSupports[]
  prohibitedChanges[]
  recentEvidenceSummary
  activeAdaptation?
  stopConditions[]
  escalationPath
  requiredObservations[]
```

The brief must not grant authority beyond the session plan or intervention policy.

---

## 12. Admin Session Audit

Purpose: operational and compliance review.

```text
AdminSessionAudit
  sessionIdentity
  authorityChain
  lifecycleHistory[]
  planVersions[]
  dispatchHistory[]
  evidenceLedgerRefs[]
  adaptationDecisions[]
  participantActions[]
  policyChecks[]
  safetyEvents[]
  recoveryHistory[]
  projectionHealth
  outboxHealth
```

Access must be restricted and audited.

---

## 13. Active Session Queue

Purpose: show sessions requiring action.

Queue categories may include:

```text
READY_TO_START
ACTIVE
WAITING_FOR_LEARNER
WAITING_FOR_HUMAN
PAUSED
INTERRUPTED
RECOVERY_PENDING
ADAPTATION_PENDING
COMPLETION_PENDING
FAILED_NEEDS_REVIEW
```

Queue sorting may consider urgency and age, but must not turn learner difficulty into punitive priority.

---

## 14. Session Timeline

Timeline entries may include:

- planned;
- authorized;
- started;
- activity dispatched;
- response received;
- evidence accepted;
- adaptation requested;
- adaptation applied;
- paused;
- interrupted;
- resumed;
- completed;
- cancelled or expired.

Timeline must preserve event order and clearly distinguish occurrence time from processing time.

---

## 15. Evidence Summary Projection

Evidence summaries must aggregate without destroying provenance.

```text
SessionEvidenceSummary
  sessionId
  objectiveSummaries[]
  evidenceClassCounts
  confidenceBands
  conflicts[]
  limitations[]
  accessibilityFlags[]
  pendingEvidenceCount
  rejectedEvidenceCount?
  sourceEvidenceRefs[]
```

A summary cannot expand evidence claim scope.

---

## 16. Adaptation History Projection

```text
SessionAdaptationHistory
  sessionId
  originalPlanVersion
  entries[]
    decisionId
    triggerType
    actionType
    impactLevel
    appliedAt
    approvalActor?
    postActionStatus
    rationaleSummary
  currentPlanExecutionShape
```

Learner-facing adaptation history should use supportive language. Teacher and admin projections may expose technical rationale according to permission.

---

## 17. Recovery Status Projection

```text
SessionRecoveryStatus
  sessionId
  interruptionType
  lastDurableCheckpoint
  lastConfirmedActivity
  unresolvedDispatches[]
  replayPosition
  recoveryEligibility
  resumeTokenState
  requiredHumanAction?
  blockingReason?
```

The projection helps operations and UI, but recovery authority remains with Session Orchestration Runtime.

---

## 18. Machine Feeds

### Learning Engine Feed

Provides:

- completed and pending objectives;
- activity execution shape;
- accepted evidence references;
- adaptation summary;
- session termination reason.

### Progress Engine Feed

Provides:

- qualified evidence references;
- objective coverage;
- completion facts;
- retention or transfer evidence when available.

It must not command a progress update.

### Intervention Runtime Feed

Provides:

- intervention-linked execution fidelity;
- dosage delivered;
- supports used;
- adaptation outcomes;
- burden and safety signals;
- completion facts.

### Diagnostic Runtime Feed

Provides:

- evidence references;
- prerequisite signals;
- conflicts;
- review requests;
- diagnostic limitations.

Feeds carry facts and qualified summaries, not ownership transfer.

---

## 19. Event Consumption

Projection Runtime consumes events such as:

```text
LearningSessionPlanned
LearningSessionAuthorized
LearningSessionStarted
SessionActivityDispatched
SessionActivityCompleted
SessionPaused
SessionInterrupted
SessionResumed
SessionAdaptationApplied
SessionEvidenceAccepted
SessionEvidenceConflictDetected
LearningSessionCompleted
LearningSessionCancelled
LearningSessionExpired
LearningSessionFailed
```

Consumers must be idempotent by event identity and source position.

---

## 20. Projection Update Rules

For each event:

```text
1. Validate event identity and schema version.
2. Confirm tenant and aggregate identity.
3. Reject or quarantine invalid ordering.
4. Skip already-applied event identity.
5. Apply deterministic projection transition.
6. Advance source position atomically.
7. Emit projection-updated signal when required.
```

A projection must not call back into the write model to compensate for its own failure.

---

## 21. Rebuild

Projection rebuild must:

- start from an explicit source position;
- use immutable events and evidence records;
- apply deterministic handlers;
- avoid external side effects;
- support shadow rebuild;
- compare rebuilt output with active projection;
- switch only after verification;
- retain audit of rebuild reason and version.

---

## 22. Access Control

Authorization must account for:

- tenant;
- learner identity;
- guardian relationship;
- teacher assignment;
- tutor authorization;
- administrative role;
- purpose of access;
- consent and privacy policy;
- projection sensitivity.

A user permitted to see a session summary is not automatically permitted to see raw evidence or diagnostic context.

---

## 23. Redaction and Language Policy

Projection-specific redaction must remove or transform:

- personally sensitive context not needed by the audience;
- internal identifiers;
- hidden risk or confidence scores;
- unsupported causal claims;
- stigmatizing language;
- free-text notes outside access scope;
- technical details that may confuse the learner.

Redaction changes presentation, not source history.

---

## 24. Caching

Caching is permitted when:

- tenant and access scope are part of the cache key;
- freshness metadata is retained;
- invalidation follows source position;
- sensitive projections use appropriate TTL and encryption;
- stale blocking views cannot be served for authority-sensitive actions.

---

## 25. Failure Handling

Canonical failure codes:

```text
PROJECTION_EVENT_INVALID
PROJECTION_SCHEMA_UNSUPPORTED
PROJECTION_ORDERING_GAP
PROJECTION_SOURCE_MISMATCH
PROJECTION_UPDATE_FAILED
PROJECTION_POSITION_CONFLICT
PROJECTION_REBUILD_FAILED
PROJECTION_ACCESS_DENIED
PROJECTION_REDACTION_FAILED
PROJECTION_STALE_BLOCKING
```

Projection failure must not change session execution state.

---

## 26. Observability

Required metrics:

- projection lag by family;
- stale projection count;
- failed update count;
- ordering gaps;
- duplicate event count;
- rebuild duration;
- rebuild mismatch count;
- access denials;
- redaction failures;
- machine-feed delivery lag;
- per-family read latency.

Alerts should distinguish learner-facing degradation from internal analytical delay.

---

## 27. Verification Requirements

Verification must prove:

- projections cannot advance session state;
- duplicate events are idempotent;
- out-of-order events are handled safely;
- learner views do not expose restricted diagnostic detail;
- evidence summaries preserve claim scope and limitations;
- stale-blocking views cannot support sensitive actions;
- rebuild is deterministic;
- audience access policies differ correctly;
- machine feeds preserve runtime ownership boundaries.

---

## 28. Completion Criteria

35F is complete when the architecture provides:

- explicit projection families;
- learner, parent, teacher, tutor, admin, and machine views;
- freshness, access, and redaction policies;
- deterministic event consumption;
- rebuild and replay behavior;
- evidence and adaptation summaries;
- operational observability;
- strict separation from write authority.

---

## Final Doctrine

> Session Projection Runtime makes learning-session truth usable without becoming the owner of that truth. Every view must be purpose-specific, freshness-aware, privacy-safe, rebuildable, and incapable of silently turning presentation into authority.
