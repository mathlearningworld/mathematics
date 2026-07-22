# Chapter 38F — Learning Path Projection Runtime

## 1. Purpose

The Learning Path Projection Runtime transforms authoritative learning-path state and evidence into role-appropriate, explainable, rebuildable read models.

Its responsibility is not to decide the learner's route and not to alter execution authority. It provides clear projections for learners, parents, teachers, operators, and internal runtimes while preserving the distinction between planned work, active work, completed work, mastery, and forecast.

> Projection explains the path. It does not own the path.

---

## 2. Runtime Boundary

This runtime owns:

- learning-path read models
- learner roadmap projection
- parent roadmap projection
- teacher planning projection
- operator projection
- path progress summaries
- next-action explanation
- completion forecast projection
- blocker and review projection
- adaptation-history projection
- projection versioning
- projection rebuild and recovery
- projection freshness metadata
- role-based redaction

It does not own:

- path planning
- orchestration commands
- adaptation approval
- mastery decisions
- evidence acceptance
- session execution
- curriculum or skill graph authority

---

## 3. Projection Principles

All projections must be:

- derived from authoritative events or snapshots
- rebuildable
- version-aware
- tenant-safe
- role-appropriate
- explainable
- eventually consistent with declared freshness
- non-authoritative for commands

A projection may be stale. It must never pretend to be command authority.

---

## 4. Canonical Projection Envelope

```ts
interface LearningPathProjectionEnvelope<T> {
  tenantId: string
  learnerId: string
  pathId: string
  pathVersion: number
  projectionType: string
  projectionVersion: number
  sourcePosition: string
  generatedAt: string
  freshnessState: 'CURRENT' | 'LAGGING' | 'REBUILDING' | 'DEGRADED'
  data: T
}
```

Every projection must expose enough metadata to identify the path version and source position from which it was built.

---

## 5. Learner Roadmap Projection

The learner projection should minimize complexity while preserving truthful meaning.

```ts
interface LearnerRoadmapProjection {
  title: string
  goalSummary: string
  currentStage: LearnerStageProjection
  nextAction?: LearnerNextActionProjection
  upcomingStages: LearnerStageProjection[]
  completedStageCount: number
  totalRequiredStageCount: number
  progressState: 'NOT_STARTED' | 'IN_PROGRESS' | 'PAUSED' | 'BLOCKED' | 'COMPLETED'
  encouragement?: string
  blocker?: LearnerBlockerProjection
  lastUpdatedAt: string
}
```

Learner-facing rules:

- use simple language
- show one primary next action
- avoid exposing internal confidence formulas
- distinguish practice completion from mastery
- explain route changes without blame
- avoid ranking language that may discourage the learner
- preserve accessibility and language preferences

---

## 6. Parent Roadmap Projection

Parent projections emphasize understanding, support needs, and meaningful progress.

```ts
interface ParentRoadmapProjection {
  learnerSummary: string
  currentGoal: string
  currentFocusAreas: FocusAreaProjection[]
  demonstratedStrengths: StrengthProjection[]
  supportNeeded: SupportNeedProjection[]
  upcomingMilestones: MilestoneProjection[]
  recentPathChanges: PathChangeProjection[]
  completionForecast?: ForecastProjection
  evidenceFreshness: EvidenceFreshnessProjection
}
```

Parent-facing rules:

- do not represent scores as full understanding
- explain why remediation was inserted
- explain why acceleration is justified
- expose practical support suggestions when authorized
- avoid unnecessary sensitive evidence details
- distinguish system recommendation from teacher decision

---

## 7. Teacher Planning Projection

Teacher projections require greater structural detail.

```ts
interface TeacherLearningPathProjection {
  learnerId: string
  pathId: string
  pathVersion: number
  missionReferences: string[]
  objectiveCoverage: ObjectiveCoverageProjection[]
  prerequisiteStatus: PrerequisiteProjection[]
  activeNode?: TeacherNodeProjection
  eligibleNodes: TeacherNodeProjection[]
  blockedNodes: TeacherNodeProjection[]
  remediationNodes: TeacherNodeProjection[]
  retentionNodes: TeacherNodeProjection[]
  accelerationNodes: TeacherNodeProjection[]
  pendingReviews: ReviewProjection[]
  evidenceSummary: PathEvidenceSummaryProjection
  adaptationHistory: PathChangeProjection[]
  forecast: ForecastProjection
}
```

Teacher-facing rules:

- show source versions
- expose evidence gaps
- show why nodes are blocked or eligible
- distinguish hard prerequisites from soft preferences
- display human-review requirements
- support authorized override workflows without embedding command authority in the projection

---

## 8. Operator Projection

Operator projections focus on runtime health and recoverability.

Required fields may include:

- path execution status
- active path version
- orchestration cursor
- pending commands
- unresolved adaptation triggers
- projection lag
- inbox/outbox state references
- ambiguous outcome state
- failed rebuild state
- tenant and correlation identifiers

Operational projections must avoid exposing unnecessary educational details.

---

## 9. Node Projection

```ts
interface LearningPathNodeProjection {
  nodeId: string
  objectiveId: string
  nodeType: string
  sequenceIndex: number
  status:
    | 'PLANNED'
    | 'ELIGIBLE'
    | 'AUTHORIZED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'FAILED'
    | 'BLOCKED'
    | 'SKIPPED'
    | 'REPLACED'
  prerequisiteStatus: 'SATISFIED' | 'PARTIAL' | 'UNSATISFIED' | 'UNKNOWN'
  required: boolean
  reasonSummary: string
  evidenceState: 'NONE' | 'PARTIAL' | 'SUFFICIENT' | 'COMPLETE'
  sessionReferenceId?: string
  terminalAt?: string
}
```

A node status must be derived from authoritative path and orchestration state, not inferred from UI navigation.

---

## 10. Next-Action Projection

The next-action projection explains what the learner may do now.

```ts
interface LearningPathNextActionProjection {
  actionType:
    | 'START_NODE'
    | 'RESUME_SESSION'
    | 'WAIT_FOR_REVIEW'
    | 'RESOLVE_BLOCKER'
    | 'REVIEW_PATH_CHANGE'
    | 'PATH_COMPLETE'
  nodeId?: string
  label: string
  explanation: string
  authorizationReference?: string
  expiresAt?: string
}
```

Rules:

- a displayed action must correspond to current orchestration authorization
- projections must not fabricate eligibility
- expired authorization must not remain actionable
- stale projections must degrade safely

---

## 11. Progress Projection

Path progress must not be represented by a misleading percentage alone.

The projection should distinguish:

- required nodes completed
- optional nodes completed
- objectives addressed
- current blockers
- remediation added
- path version changes
- evidence pending
- mastery confirmed separately

Representative structure:

```ts
interface LearningPathProgressProjection {
  requiredCompleted: number
  requiredTotal: number
  optionalCompleted: number
  optionalTotal: number
  objectivesAddressed: number
  objectivesTotal: number
  blockedRequiredNodes: number
  pendingEvidenceNodes: number
  operationalCompletionPercent: number
  masteryStateSummary: string
}
```

`operationalCompletionPercent` must be labeled as path progress, never mastery percentage.

---

## 12. Forecast Projection

Forecasting estimates possible completion under declared assumptions.

```ts
interface LearningPathForecastProjection {
  status: 'AVAILABLE' | 'INSUFFICIENT_DATA' | 'UNSTABLE_PATH' | 'BLOCKED'
  earliestCompletionAt?: string
  expectedCompletionAt?: string
  latestReasonableCompletionAt?: string
  confidenceBand?: 'LOW' | 'MEDIUM' | 'HIGH'
  assumptions: string[]
  riskFactors: string[]
  generatedFromPathVersion: number
  forecastPolicyVersion: string
}
```

Forecast rules:

- forecasts are not promises
- assumptions must be visible
- path changes invalidate or regenerate forecasts
- blocked paths must not show false precision
- learner-facing forecasts should avoid pressure-inducing language

---

## 13. Adaptation Projection

Every meaningful route change should be explainable.

```ts
interface LearningPathChangeProjection {
  changeId: string
  previousVersion: number
  newVersion: number
  changedAt: string
  changeType: string
  summary: string
  reasons: string[]
  insertedCount: number
  removedFutureCount: number
  reorderedCount: number
  reviewState?: 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED'
}
```

Role-specific descriptions may differ, but they must refer to the same underlying adaptation lineage.

---

## 14. Blocker Projection

Blockers must state both the condition and the resolution path.

```ts
interface LearningPathBlockerProjection {
  blockerId: string
  blockerType:
    | 'PREREQUISITE'
    | 'EVIDENCE_PENDING'
    | 'HUMAN_REVIEW'
    | 'CONTENT_UNAVAILABLE'
    | 'SESSION_RECOVERY'
    | 'POLICY_RESTRICTION'
    | 'TECHNICAL_FAILURE'
  summary: string
  affectedNodeIds: string[]
  resolutionOwner: string
  suggestedResolution?: string
  createdAt: string
}
```

Technical failure must not be presented to the learner as academic failure.

---

## 15. Projection Build Pipeline

```text
Consume Authoritative Event
→ Validate Tenant and Aggregate Identity
→ Validate Event Version
→ Load Existing Projection State
→ Apply Deterministic Projector
→ Validate Projection Invariants
→ Persist Projection and Source Position Atomically
→ Publish Projection Updated Signal
```

Projectors must be idempotent.

---

## 16. Ordering and Concurrency

Projection processing must account for:

- duplicate events
- out-of-order delivery
- concurrent path and orchestration events
- delayed evidence events
- path-version activation transitions

Required controls:

- aggregate sequence number
- source position
- event ID deduplication
- expected projection version
- retry-safe updates
- dead-letter handling

A future event must not be applied before required predecessors.

---

## 17. Rebuild

Every projection must support full rebuild from authoritative history.

Rebuild procedure:

```text
Mark Projection REBUILDING
→ Select Authoritative Source Range
→ Clear or Shadow Existing Read Model
→ Replay Events through Current Compatible Projector
→ Validate Counts, Versions, and Invariants
→ Atomically Swap Projection
→ Mark CURRENT
```

During rebuild:

- command authority remains elsewhere
- the UI must show freshness state
- stale data must not produce unsafe actions
- previous projection may remain readable if policy permits

---

## 18. Projection Versioning

Projection schema and projector behavior must be independently versioned.

```ts
interface ProjectionVersionVector {
  projectionSchemaVersion: number
  projectorVersion: string
  pathContractVersion: string
  evidenceContractVersion: string
  curriculumVersion: string
  skillGraphVersion: string
}
```

A projection must be rebuildable under declared compatibility rules.

---

## 19. Freshness and Degradation

Freshness states:

- `CURRENT`: caught up to authoritative source
- `LAGGING`: behind but within operational tolerance
- `REBUILDING`: undergoing deterministic reconstruction
- `DEGRADED`: unable to guarantee normal projection quality

Degradation rules:

- hide or disable action controls that depend on uncertain authorization
- show last-updated metadata where useful
- never convert stale absence into confirmed completion
- preserve safe read-only access when possible

---

## 20. Privacy and Role Projection

Projection must enforce field-level visibility.

Examples:

- learner sees simple next steps
- parent sees support-oriented summaries
- teacher sees prerequisite and evidence detail
- operator sees runtime health without unnecessary educational detail
- analytics consumers receive de-identified aggregates where required

Redaction must occur before projection delivery, not solely in the client.

---

## 21. Caching

Caching may improve read performance but must preserve:

- tenant isolation
- path-version keys
- role-sensitive keys
- projection-version keys
- freshness metadata
- invalidation on path activation
- invalidation on evidence withdrawal

A cache hit must not bypass authorization.

---

## 22. Events

Representative events:

```text
LearningPathProjectionUpdated
LearningPathProjectionLagDetected
LearningPathProjectionRebuildStarted
LearningPathProjectionRebuildCompleted
LearningPathProjectionRebuildFailed
LearningPathProjectionDegraded
LearningPathForecastInvalidated
LearningPathRoleProjectionRegenerated
```

---

## 23. Observability

Minimum metrics:

- projection update latency
- projection lag by tenant
- rebuild duration
- rebuild failure rate
- duplicate event rate
- out-of-order event rate
- stale-action suppression count
- forecast regeneration count
- role-projection access failures
- cache hit and invalidation rates
- projection invariant failures

---

## 24. Cross-Runtime Contracts

### Inputs

- Learning Path Runtime: path lifecycle and version events
- Planning Runtime: approved plan structure
- Orchestration Runtime: cursor and node execution events
- Adaptive Runtime: path change lineage
- Evidence Runtime: evidence and bundle updates
- Mastery Runtime: mastery summary references
- Mission and Journey Runtime: goal and journey context

### Outputs

- Learner UI: roadmap and next action
- Parent UI: support and milestone summary
- Teacher UI: planning and evidence view
- Operator UI: health and recovery view
- Notification Runtime: meaningful path change summaries
- Analytics Runtime: privacy-safe read data

---

## 25. Acceptance Criteria

Learning Path Projection Runtime is acceptable only when:

- projections are rebuildable
- projectors are idempotent
- path version is always explicit
- stale projections cannot authorize unsafe actions
- role-based redaction is enforced server-side
- path progress is distinguished from mastery
- forecasts expose assumptions and uncertainty
- adaptation changes remain explainable
- event ordering is protected
- rebuild produces invariant-equivalent read models
- tenant isolation is verified

---

## 26. Final Boundary

A projection is a truthful, role-appropriate view of authoritative runtime state.

It may summarize, explain, and forecast. It may not decide, authorize, or rewrite.

> The Learning Path Projection Runtime makes the route understandable without confusing visibility with authority.
