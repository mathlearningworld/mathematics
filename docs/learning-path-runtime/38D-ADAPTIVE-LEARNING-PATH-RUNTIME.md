# Chapter 38D — Adaptive Learning Path Runtime

## 1. Purpose

The Adaptive Learning Path Runtime governs how an active learning path changes when new evidence, mastery decisions, constraints, or operational conditions make the current path no longer optimal, safe, or reachable.

Its responsibility is not to continuously rewrite the learner's route. Its responsibility is to detect justified adaptation conditions, propose bounded changes, preserve historical lineage, and activate a new path version only through explicit authority.

The central distinction is:

> Orchestration executes the approved path. Adaptive Learning Path Runtime determines when the approved path should be reconsidered.

Adaptation must remain explainable, deterministic, tenant-safe, reversible where policy allows, and compatible with all upstream and downstream runtime contracts.

---

## 2. Runtime Boundary

Adaptive Learning Path Runtime owns:

- adaptation trigger intake
- trigger qualification
- adaptation urgency classification
- adaptive candidate generation
- safe mutation boundary detection
- path delta construction
- replan request creation
- adaptation approval workflow
- adaptation activation coordination
- adaptation lineage
- adaptation audit evidence
- adaptation suppression and cooldown
- rollback eligibility metadata

It does not own:

- mastery determination
- assessment execution
- session activity execution
- curriculum authority
- skill graph authority
- final persistence mechanics
- read-model rendering

Those responsibilities remain with their owning runtimes.

---

## 3. Core Model

### 3.1 Adaptation Trigger

```ts
interface LearningPathAdaptationTrigger {
  triggerId: string
  tenantId: string
  learnerId: string
  pathId: string
  pathVersion: number
  triggerType:
    | 'MASTERY_CHANGED'
    | 'PREREQUISITE_INVALIDATED'
    | 'RETENTION_RISK'
    | 'REPEATED_FAILURE'
    | 'RAPID_MASTERY_GAIN'
    | 'CURRICULUM_CHANGED'
    | 'CONTENT_UNAVAILABLE'
    | 'ACCESSIBILITY_CONSTRAINT_CHANGED'
    | 'TIME_BUDGET_CHANGED'
    | 'HUMAN_REQUESTED_REPLAN'
    | 'SAFETY_POLICY_CHANGED'
    | 'EXECUTION_STALLED'
  sourceRuntime: string
  sourceReferenceId: string
  occurredAt: string
  payloadVersion: number
  payload: Record<string, unknown>
}
```

### 3.2 Adaptation Assessment

```ts
interface LearningPathAdaptationAssessment {
  assessmentId: string
  triggerId: string
  pathId: string
  pathVersion: number
  disposition:
    | 'IGNORE'
    | 'DEFER'
    | 'PATCH_CURRENT_SEGMENT'
    | 'REPLAN_FROM_CHECKPOINT'
    | 'REPLAN_ENTIRE_REMAINDER'
    | 'PAUSE_AND_REQUIRE_REVIEW'
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  confidence: number
  reasons: string[]
  impactedNodeIds: string[]
  safeBoundaryNodeId?: string
  evaluatedAt: string
  policyVersion: string
}
```

### 3.3 Adaptation Candidate

```ts
interface LearningPathAdaptationCandidate {
  candidateId: string
  pathId: string
  basePathVersion: number
  adaptationAssessmentId: string
  candidateType:
    | 'INSERT_REMEDIATION'
    | 'REMOVE_REDUNDANT_NODE'
    | 'REORDER_REMAINDER'
    | 'INSERT_RETENTION_CHECK'
    | 'ACCELERATE'
    | 'SUBSTITUTE_CONTENT'
    | 'BRANCH_TO_ALTERNATE_ROUTE'
    | 'PAUSE_PATH'
  proposedDelta: LearningPathDelta
  expectedEffects: ExpectedPathEffects
  riskClassification: 'LOW' | 'MEDIUM' | 'HIGH'
  requiresHumanApproval: boolean
  generatedAt: string
  planningVersion: string
}
```

---

## 4. Adaptation Pipeline

```text
Receive Trigger
→ Validate Tenant, Learner, Path, and Version
→ Deduplicate Trigger
→ Classify Trigger
→ Evaluate Current Execution State
→ Determine Safe Mutation Boundary
→ Assess Adaptation Necessity
→ Generate Candidate Deltas
→ Validate Reachability and Policy
→ Score Candidate Quality
→ Select Candidate or Escalate
→ Request Approval when Required
→ Create New Path Version
→ Coordinate Activation
→ Publish Adaptation Evidence
```

Every stage must be deterministic for the same authoritative inputs and policy versions.

---

## 5. Trigger Qualification

A trigger must not automatically cause a replan.

Trigger qualification must answer:

1. Is the trigger authoritative?
2. Does it refer to the active path version?
3. Has it already been processed?
4. Does it materially affect reachability, suitability, safety, or efficiency?
5. Is the adaptation urgency greater than the disruption cost?
6. Is the learner currently inside a protected execution segment?
7. Is a cooldown active?
8. Does policy require human review?

A qualified trigger produces an adaptation assessment. An unqualified trigger produces a durable ignored or deferred disposition.

---

## 6. Safe Mutation Boundaries

An active path must never be mutated arbitrarily while a session or assessment is in flight.

Safe boundaries include:

- before a node is authorized
- after a node reaches a terminal outcome
- at an explicit checkpoint
- after a session closes cleanly
- after an assessment decision is finalized
- after human review confirms interruption is acceptable

Unsafe boundaries include:

- during a scored attempt
- while evidence is still being committed
- while a session outcome is ambiguous
- during persistence recovery
- while the current node has non-idempotent external side effects

When no safe boundary exists, the adaptation must be deferred or the path paused according to urgency and policy.

---

## 7. Adaptive Strategies

### 7.1 Remediation Insertion

Use when:

- a prerequisite gap is newly discovered
- repeated failure exceeds policy thresholds
- mastery confidence drops
- transfer evidence contradicts prior readiness

Rules:

- remediation must target the smallest justified prerequisite set
- remediation must not erase completed history
- the insertion must preserve lineage to the blocked objective
- completion of remediation does not automatically confirm mastery

### 7.2 Retention Reinforcement

Use when:

- retention confidence decays
- a previously mastered skill is required soon
- delayed evidence is insufficient

Rules:

- retention nodes should be lightweight when risk is low
- repeated retention failure may escalate to remediation
- retention checks must remain distinguishable from original instruction

### 7.3 Acceleration

Use when:

- the learner demonstrates strong evidence across breadth, transfer, and retention
- planned nodes are provably redundant
- prerequisites remain satisfied

Rules:

- acceleration may remove or compress future work, never rewrite history
- acceleration must not rely on score alone
- acceleration must preserve required curriculum coverage unless policy explicitly permits alternate equivalence

### 7.4 Content Substitution

Use when:

- content is unavailable
- accessibility needs change
- modality mismatch is detected
- operational constraints prevent the planned activity

Rules:

- substitute content must satisfy the same learning objective contract
- evidence comparability must be declared
- the reason for substitution must be preserved

### 7.5 Route Reordering

Use when:

- multiple eligible branches exist
- time budget changes
- dependency ordering remains valid
- learner engagement or fatigue indicators justify a safer order

Rules:

- hard prerequisites may never be violated
- soft preferences may be reordered only within policy
- deterministic tie-breaking is required

---

## 8. Adaptation Decision Policy

The adaptation policy evaluates:

```text
educational benefit
+ safety improvement
+ reachability restoration
+ expected efficiency gain
- disruption cost
- uncertainty cost
- switching cost
- learner burden
```

No single metric may dominate unless a safety rule explicitly requires it.

A candidate may be auto-approved only when:

- policy classifies risk as low
- no protected segment is active
- no human approval requirement applies
- all affected contracts remain compatible
- the candidate is fully explainable
- rollback metadata is available where required

---

## 9. Versioning and Lineage

Every activated adaptation creates a new immutable path version.

```ts
interface LearningPathAdaptationLineage {
  pathId: string
  previousVersion: number
  newVersion: number
  triggerIds: string[]
  assessmentId: string
  candidateId: string
  activationDecisionId: string
  changedNodeIds: string[]
  retainedNodeIds: string[]
  removedFutureNodeIds: string[]
  insertedNodeIds: string[]
  activatedAt: string
}
```

Historical versions must remain reconstructable.

Adaptation must never:

- overwrite completed-node history
- remove evidence already accepted
- rewrite mastery decisions
- disguise a changed route as the original route

---

## 10. Cooldown and Stability Controls

Without stability controls, frequent evidence updates may cause path thrashing.

Required controls include:

- trigger deduplication
- per-trigger-type cooldown
- minimum evidence threshold
- minimum expected benefit threshold
- maximum replans per time window
- suppression while higher-priority recovery is active
- aggregation of closely related triggers
- hysteresis between remediation and acceleration modes

A path may remain intentionally suboptimal for a bounded period when immediate replanning would create more disruption than benefit.

---

## 11. Human Review

Human review may be required when:

- the adaptation changes a declared mission goal
- high-stakes assessment preparation is affected
- curriculum equivalence is uncertain
- safety or accessibility policy requires confirmation
- the learner has repeated severe struggle
- the change removes a large amount of planned work
- the change crosses organizational policy boundaries

The review surface must present:

- what changed
- why it changed
- evidence supporting the change
- risks of accepting
- risks of rejecting
- affected future nodes
- rollback implications

---

## 12. Failure Handling

### 12.1 Trigger Processing Failure

- record durable failure state
- do not discard trigger
- retry idempotently
- escalate after policy threshold

### 12.2 Candidate Generation Failure

- keep current path active if safe
- mark adaptation as unresolved
- pause only when continuation is unsafe or unreachable

### 12.3 Activation Failure

- preserve old active path authority
- do not expose new version as active until commit succeeds
- recover through persisted activation state

### 12.4 Ambiguous Outcome

- query durable authority before retry
- never infer activation from a timeout
- resume from recorded transition state

---

## 13. Runtime Events

Representative events:

```text
LearningPathAdaptationTriggerReceived
LearningPathAdaptationTriggerIgnored
LearningPathAdaptationDeferred
LearningPathAdaptationAssessed
LearningPathAdaptationCandidateGenerated
LearningPathAdaptationCandidateRejected
LearningPathAdaptationReviewRequested
LearningPathAdaptationApproved
LearningPathVersionCreated
LearningPathAdaptationActivated
LearningPathAdaptationActivationFailed
LearningPathAdaptationRolledBack
```

Events must include tenant, learner, path, version, correlation, causation, actor, and policy-version metadata.

---

## 14. Observability

Minimum metrics:

- triggers received by type
- qualified-trigger rate
- ignored-trigger rate
- adaptation rate
- average time to adaptation
- replans per learner per week
- remediation insertion rate
- acceleration rate
- content substitution rate
- human review rate
- activation failure rate
- rollback rate
- path-thrashing rate
- adaptation benefit after execution

Metrics must not expose sensitive learner data beyond authorized operational use.

---

## 15. Security, Privacy, and Fairness

Adaptation must:

- enforce tenant isolation
- minimize sensitive evidence exposure
- avoid protected-attribute discrimination
- preserve explainability
- support accessibility-equivalent routes
- record policy versions
- permit authorized audit
- avoid covert behavioral manipulation

Engagement signals may influence ordering or modality only within explicit educational and safety constraints. They may not silently override mastery, curriculum, or learner-goal authority.

---

## 16. Cross-Runtime Contracts

### Inputs

- Mastery Runtime: new or revised mastery decisions
- Assessment Runtime: finalized outcomes
- Learning Session Runtime: execution completion and failure
- Curriculum Runtime: requirement changes
- Skill Graph Runtime: prerequisite changes
- Mission Runtime: goal changes
- Operational Policy Runtime: time, access, and safety constraints

### Outputs

- Learning Path Planning Runtime: bounded replan request
- Learning Path Orchestration Runtime: activation and cursor-reset instructions
- Projection Runtime: path-version and reason updates
- Evidence Runtime: adaptation evidence bundle
- Notification Runtime: review or meaningful route-change notices

---

## 17. Acceptance Criteria

Adaptive Learning Path Runtime is acceptable only when:

- triggers are idempotently processed
- unsafe mutation is impossible
- every activated adaptation creates a new version
- completed history remains immutable
- planning and activation remain separate authorities
- cooldown prevents uncontrolled oscillation
- high-risk changes require review
- recovery begins from persisted authority
- every change is explainable
- tenant isolation is verified
- replay reproduces the same adaptation lineage

---

## 18. Final Boundary

Adaptive Learning Path Runtime does not chase every new signal.

It performs disciplined change under explicit authority.

> A learning path may adapt only when the expected educational or safety benefit justifies the disruption, the mutation boundary is safe, and the resulting route remains versioned, explainable, and recoverable.
