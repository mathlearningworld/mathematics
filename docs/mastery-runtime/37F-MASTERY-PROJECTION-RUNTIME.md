# Chapter 37F — Mastery Projection Runtime

## 1. Purpose

Mastery Projection Runtime transforms authoritative mastery decisions, evidence summaries, review states, and adaptation signals into role-appropriate read models.

It explains current mastery without becoming write authority.

> Projection communicates educational truth. It does not create it.

## 2. Scope

This runtime owns:

- learner mastery views
- parent and guardian views
- teacher workbench views
- operational and audit views
- skill mastery summaries
- confidence and coverage presentation
- evidence-summary presentation
- review and appeal status
- freshness and staleness indicators
- projection checkpoints
- rebuild and reconciliation
- role-based redaction
- projection schema versioning

It does not own:

- mastery evaluation
- mastery decisions
- evidence qualification
- curriculum truth
- skill graph truth
- intervention authorization
- journey replanning

## 3. Projection Principles

1. Authority is always traceable to a mastery decision.
2. Uncertainty is visible, not hidden.
3. Stale data is labeled.
4. Role views differ by purpose, not by educational truth.
5. Sensitive evidence is minimized.
6. Historical decisions remain inspectable where authorized.
7. Projection failures never mutate mastery state.

## 4. Projection Inputs

Canonical input events include:

- `MasteryEvaluationCompleted`
- `MasteryDecisionAuthorized`
- `MasteryConfirmed`
- `MasteryLevelChanged`
- `MasteryMarkedAtRisk`
- `MasteryReviewRequested`
- `MasteryRevoked`
- `MasteryDecisionSuperseded`
- `MasteryAppealOpened`
- `MasteryAppealResolved`
- `MasteryEvidenceBundleFrozen`
- `MasteryEvidenceCorrected`
- `MasteryEvidenceWithdrawn`
- `MasteryAdaptationPlanned`
- `MasteryAdaptationAccepted`

Only authoritative events may change authoritative fields in a read model.

## 5. Read Model Families

### 5.1 Learner Mastery View

Designed to answer:

- What do I understand now?
- What is still developing?
- Why is the system saying this?
- What should I do next?
- Is this result recent and reliable?

### 5.2 Parent or Guardian View

Designed to answer:

- Which foundations are strong?
- Which gaps need support?
- Is the learner progressing?
- Is review required?
- What support is appropriate without exposing unnecessary sensitive detail?

### 5.3 Teacher Workbench

Designed to answer:

- Which learners need attention?
- Which dimensions are missing?
- Which mastery states are at risk?
- What evidence supports the conclusion?
- Which cases need human review?

### 5.4 Operational View

Designed for:

- projection health
- lag
- failed events
- rebuild status
- version drift
- reconciliation

### 5.5 Audit View

Designed for authorized review of:

- decision lineage
- policy versions
- evidence bundle references
- overrides
- appeals
- corrections
- redactions

## 6. Learner Mastery Summary

```ts
export interface LearnerMasterySummaryProjection {
  tenantId: string;
  learnerId: string;
  skillId: string;
  masteryRecordId: string;
  status:
    | 'NOT_EVALUATED'
    | 'DEVELOPING'
    | 'PROVISIONAL'
    | 'MASTERED'
    | 'AT_RISK'
    | 'REVIEW_REQUIRED'
    | 'REVOKED';
  level?: number;
  confidenceBand: 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH';
  coverageBand: 'INSUFFICIENT' | 'PARTIAL' | 'ADEQUATE' | 'BROAD';
  explanationSummary: string;
  nextAction?: MasteryNextActionProjection;
  effectiveAt?: string;
  freshness: ProjectionFreshness;
  decisionId?: string;
  projectionVersion: number;
}
```

Raw confidence precision is not required in learner views unless educationally useful.

## 7. Teacher Mastery Detail

```ts
export interface TeacherMasteryDetailProjection {
  learnerId: string;
  skillId: string;
  status: string;
  level?: number;
  confidenceScore?: number;
  coverageByDimension: Record<string, number>;
  evidenceSourceSummary: Record<string, number>;
  unresolvedContradictions: number;
  retentionStatus: string;
  prerequisiteRisks: string[];
  reviewStatus?: string;
  recommendedAttention: string[];
  activeDecisionId?: string;
  evidenceBundleId?: string;
  policyVector: Record<string, string>;
  freshness: ProjectionFreshness;
}
```

Teacher access is tenant-, class-, purpose-, and relationship-scoped.

## 8. Projection Freshness

```ts
export interface ProjectionFreshness {
  sourceEventPosition: string;
  projectedAt: string;
  lagMilliseconds: number;
  state: 'CURRENT' | 'DELAYED' | 'STALE' | 'REBUILDING' | 'UNKNOWN';
  lastReconciledAt?: string;
}
```

A stale projection must not present itself as current.

## 9. Explanation Projection

Explanations are derived from authoritative reason codes and evidence summaries.

Required fields:

- decision outcome
- principal reason codes
- observed strengths
- missing evidence dimensions
- contradiction status
- retention status
- next review timing
- human-review status

Forbidden behavior:

- inventing reasons not present in authority records;
- exposing hidden model internals as educational truth;
- presenting one score as the entire explanation;
- disclosing protected accommodations without authorization.

## 10. Mastery Timeline

Timeline entries include:

- initial evaluation
- provisional state
- confirmation
- level increase or decrease
- at-risk transition
- review request
- appeal
- revocation
- supersession
- correction-driven re-evaluation

```ts
export interface MasteryTimelineEntry {
  timelineEntryId: string;
  masteryRecordId: string;
  eventType: string;
  occurredAt: string;
  effectiveAt: string;
  decisionId?: string;
  summary: string;
  visibilityClass: string;
  sourceEventPosition: string;
}
```

Timeline ordering uses authoritative event order, not client receipt time.

## 11. Skill Map Projection

The skill map combines mastery decisions with Skill Graph read-only context.

It may display:

- mastered skills
- developing skills
- prerequisite gaps
- at-risk foundations
- next reachable skills
- blocked paths

Skill Graph remains authority for relationships. Mastery Runtime remains authority for mastery states.

## 12. Curriculum Readiness Projection

Curriculum readiness is derived from:

- required skill set version
- active mastery states
- prerequisite policies
- coverage rules
- curriculum mapping version

Readiness is a projection, not a new mastery decision.

It must disclose:

- curriculum standard
- version
- coverage denominator
- unresolved or not-evaluated skills
- staleness

## 13. Next Action Projection

```ts
export interface MasteryNextActionProjection {
  actionType:
    | 'CONTINUE_PRACTICE'
    | 'COLLECT_MORE_EVIDENCE'
    | 'RETENTION_CHECK'
    | 'REVIEW_PREREQUISITE'
    | 'TEACHER_REVIEW'
    | 'NO_ACTION_REQUIRED';
  reasonCodes: string[];
  targetSkillId?: string;
  urgency: 'LOW' | 'NORMAL' | 'HIGH';
  authorizedBy?: string;
}
```

Projection may communicate an authorized recommendation but must not create intervention authority.

## 14. Attention Queue

Teacher and operational queues may include:

- severe contradiction
- review overdue
- at-risk mastery
- evidence withdrawal impact
- prolonged not-evaluated state
- projection reconciliation failure
- policy version incompatibility

Queue priority cannot depend on payment tier.

## 15. Event Ordering

Projection consumers enforce:

- tenant partition ordering
- mastery-record ordering
- monotonic aggregate version
- decision version ordering
- duplicate event idempotency

Out-of-order events are buffered or reconciled. They must not regress a newer projection.

## 16. Projection Checkpoint

```ts
export interface MasteryProjectionCheckpoint {
  projectionName: string;
  tenantId: string;
  partitionId: string;
  sourcePosition: string;
  projectionSchemaVersion: number;
  updatedAt: string;
  checksum: string;
}
```

Checkpoint advancement and projection writes must be atomic within the projection store boundary.

## 17. Idempotency

Projection application key:

```text
projectionName + tenantId + eventId
```

Reprocessing the same event produces no duplicate timeline entries, queue items, or counters.

## 18. Rebuild

A rebuild:

1. selects a projection schema version;
2. establishes an event-source boundary;
3. replays authoritative events;
4. verifies checksums and counts;
5. catches up from the boundary;
6. reconciles against aggregate authority;
7. atomically switches the active read model.

Rebuild must not dispatch downstream commands or duplicate notifications.

## 19. Reconciliation

Reconciliation compares:

- active mastery decision
- projected mastery status
- aggregate version
- decision version
- evidence bundle reference
- projection event position
- policy vector

Mismatch classes:

- `MISSING_PROJECTION`
- `STALE_PROJECTION`
- `AHEAD_OF_AUTHORITY`
- `STATUS_MISMATCH`
- `DECISION_MISMATCH`
- `VERSION_MISMATCH`
- `REDACTION_POLICY_MISMATCH`

Repairs are deterministic and auditable.

## 20. Projection Versioning

Projection schemas evolve independently from write models.

Compatibility strategies:

- additive fields
- dual-read models
- shadow rebuild
- versioned endpoints
- consumer capability negotiation
- controlled cutover

A projection migration cannot reinterpret authority without an approved policy and traceable transformation.

## 21. Redaction

Redaction considers:

- viewer role
- learner relationship
- tenant policy
- age
- consent
- evidence sensitivity
- accommodation sensitivity
- appeal confidentiality

The same authoritative decision may have different detail levels but must not produce contradictory status claims across roles.

## 22. Notification Projection

Notifications are derived from projection changes such as:

- mastery confirmed
- review required
- mastery at risk
- appeal resolved
- evidence invalidation affecting status

Notification creation is idempotent and policy-controlled.

Projection replay must not resend historical notifications unless explicitly running a notification recovery workflow.

## 23. API Surface

Suggested read endpoints:

```text
GET /learners/:learnerId/mastery
GET /learners/:learnerId/mastery/:skillId
GET /learners/:learnerId/mastery-timeline
GET /classes/:classId/mastery-attention
GET /classes/:classId/mastery-map
GET /mastery/:masteryRecordId/audit
GET /operations/mastery-projections/health
```

Every endpoint enforces tenant and relationship authorization.

## 24. Performance

Projection design should support:

- learner summary under interactive latency targets;
- class overview without per-learner write-model queries;
- pagination for timelines;
- precomputed attention queues;
- bounded skill-map expansion;
- tenant-partitioned rebuilds;
- independently scalable consumers.

Performance optimization must not remove uncertainty or freshness disclosure.

## 25. Observability

Required metrics:

- consumer lag
- event apply latency
- duplicate event count
- out-of-order event count
- rebuild duration
- reconciliation mismatch count
- stale projection count
- redaction denial count
- endpoint latency
- notification deduplication count

## 26. Failure Handling

- event-consumer failure retries safely;
- poison events enter quarantine with alerting;
- partial writes roll back;
- stale views show stale state;
- unavailable explanation detail degrades explicitly;
- authorization uncertainty fails closed;
- rebuild failure preserves the prior active projection;
- projection failure never changes mastery authority.

## 27. Cross-Runtime Boundaries

### Mastery Decision Runtime

Provides authoritative state changes.

### Mastery Evidence Runtime

Provides privacy-safe evidence summaries and bundle references.

### Adaptive Mastery Runtime

Provides pending adaptation and review context.

### Curriculum Runtime

Provides standard and requirement context.

### Skill Graph Runtime

Provides dependency topology.

### Journey and Recommendation Runtimes

Consume authorized read models or events, not internal projection guesses.

## 28. Runtime Invariants

1. Projection is never write authority.
2. Every authoritative status maps to a decision event.
3. Staleness is visible.
4. Replay is side-effect safe.
5. Rebuild cannot duplicate notifications.
6. Role views may redact detail but not contradict truth.
7. Event ordering cannot regress aggregate version.
8. Attention priority is educational and safety-based.
9. Sensitive evidence is minimized.
10. Projection failure cannot modify mastery.
11. Reconciliation is deterministic and auditable.
12. Payment tier never changes status or queue priority.

## 29. Completion Criteria

37F is complete when the system can demonstrate:

- learner, parent, teacher, operational, and audit views;
- authority-traceable explanations;
- visible freshness;
- deterministic event application;
- idempotent timelines and notifications;
- role-safe redaction;
- rebuild without side effects;
- aggregate-to-projection reconciliation;
- versioned projection evolution;
- clean separation from mastery write authority.
