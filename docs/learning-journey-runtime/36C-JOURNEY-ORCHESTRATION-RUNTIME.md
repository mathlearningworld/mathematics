# 36C — Journey Orchestration Runtime

## 1. Purpose

The Journey Orchestration Runtime coordinates the live execution of an accepted journey plan across phases, milestones, sessions, interruptions, blockers, and dependent runtimes.

It turns an accepted plan into controlled progress while preserving authority, idempotency, recoverability, and learner safety.

## 2. Orchestration Boundary

```text
Accepted Journey Plan
    ↓
Readiness Evaluation
    ↓
Journey Activation
    ↓
Phase Activation
    ↓
Milestone Activation
    ↓
Session Intent Dispatch
    ↓
Session Outcome Intake
    ↓
Advance / Adapt / Block / Replan / Intervene
    ↓
Journey Completion Verification
```

Orchestration executes an accepted plan. It does not silently redesign the plan.

## 3. Core Distinctions

```text
Plan accepted ≠ Journey active
Journey active ≠ Session active
Session success ≠ Milestone satisfied
Milestone satisfied ≠ Phase complete
Phase complete ≠ Journey complete
Retry ≠ Duplicate execution
Resume ≠ Restart
Blocker ≠ Failure
```

## 4. Runtime Controller

```ts
interface JourneyRuntimeController {
  journeyId: string;
  tenantId: string;
  learnerId: string;
  aggregateVersion: number;
  planVersion: number;
  status: LearningJourneyStatus;
  activePhaseId?: string;
  activeMilestoneId?: string;
  activeSessionIntentId?: string;
  activeSessionId?: string;
  executionLease?: JourneyExecutionLease;
  lastTransitionAt: string;
  runtimeVersion: string;
}
```

The controller is a projection of persisted authority and cannot replace the aggregate ledger.

## 5. Readiness Evaluation

Before activation, the orchestrator verifies:

- accepted plan exists
- objective authority is still valid
- journey is not terminal
- required curriculum and graph versions are supported
- blocking prerequisite claims are resolved or explicitly deferred
- policy and accessibility requirements are satisfied
- no conflicting active journey execution lease exists
- dependent runtimes required for the first phase are available or safely degradable

```ts
interface JourneyReadinessResult {
  journeyId: string;
  ready: boolean;
  blockingReasons: string[];
  warnings: string[];
  evaluatedAgainstPlanVersion: number;
  policyVersion: string;
  evaluatedAt: string;
}
```

## 6. Execution Lease and Fencing

Only one orchestrator may hold active execution authority for a journey.

```ts
interface JourneyExecutionLease {
  leaseId: string;
  journeyId: string;
  holderId: string;
  fencingToken: number;
  acquiredAt: string;
  expiresAt: string;
  renewedAt?: string;
}
```

Every state-changing command from the orchestrator must carry the active fencing token.

A stale holder must be refused even if its command is otherwise valid.

## 7. Activation

Activation sequence:

```text
Validate command identity
    ↓
Check expected aggregate version
    ↓
Acquire execution lease
    ↓
Re-evaluate readiness
    ↓
Persist JourneyActivated
    ↓
Activate first eligible phase
    ↓
Create operational checkpoint
    ↓
Publish projections and outbox messages
```

Activation must be idempotent by command ID.

## 8. Phase Orchestration

A phase may be:

```text
LOCKED
READY
ACTIVE
COMPLETED
SKIPPED
BLOCKED
```

Canonical rules:

- only one phase is active unless the plan explicitly permits parallel branches
- a phase cannot activate before entry criteria are satisfied
- a phase cannot complete before exit criteria are verified
- skipping requires explicit plan or human authority
- a blocked phase preserves its last valid state and blocker references

```ts
interface ActivateJourneyPhaseCommand {
  journeyId: string;
  phaseId: string;
  expectedJourneyVersion: number;
  expectedPlanVersion: number;
  commandId: string;
  fencingToken: number;
  actorId: string;
  activatedAt: string;
}
```

## 9. Milestone Orchestration

Milestone orchestration determines which bounded target should drive the next session intent.

```ts
interface JourneyMilestoneRuntimeState {
  milestoneId: string;
  phaseId: string;
  status: 'PENDING' | 'READY' | 'ACTIVE' | 'SATISFIED' | 'FAILED' | 'WAIVED';
  attemptCount: number;
  sessionOutcomeRefs: string[];
  qualifiedEvidenceRefs: string[];
  openBlockerRefs: string[];
  lastEvaluatedAt?: string;
}
```

A milestone is satisfied only through its completion rule, not merely because its scheduled sessions ended.

## 10. Session Intent Dispatch

The orchestrator materializes one accepted session intent at a time unless parallel execution is explicitly authorized.

```ts
interface DispatchJourneySessionIntentCommand {
  journeyId: string;
  sessionIntentId: string;
  expectedJourneyVersion: number;
  expectedPlanVersion: number;
  commandId: string;
  fencingToken: number;
  dispatchPolicyRef: string;
  dispatchedAt: string;
}
```

Dispatch pipeline:

```text
Select eligible session intent
    ↓
Validate phase and milestone ownership
    ↓
Validate no conflicting active session
    ↓
Bind current journey checkpoint
    ↓
Persist dispatch event
    ↓
Publish to Learning Session Runtime
    ↓
Await acknowledgement or apply retry policy
```

## 11. Session Acknowledgement

The Session Runtime returns an acknowledgement containing:

```ts
interface JourneySessionAcknowledgement {
  journeyId: string;
  sessionIntentId: string;
  sessionId: string;
  accepted: boolean;
  refusalCode?: string;
  sessionRuntimeVersion: string;
  acknowledgedAt: string;
}
```

A timeout is not proof of rejection. The orchestrator must reconcile before redispatching.

## 12. Session Outcome Intake

```ts
interface JourneySessionOutcome {
  journeyId: string;
  sessionIntentId: string;
  sessionId: string;
  outcomeType:
    | 'COMPLETED'
    | 'PARTIAL'
    | 'PAUSED'
    | 'ABANDONED'
    | 'BLOCKED'
    | 'FAILED'
    | 'CANCELLED';
  objectiveOutcomeRefs: string[];
  evidenceRefs: string[];
  prerequisiteFindingRefs: string[];
  adaptationRefs: string[];
  interventionSignalRefs: string[];
  recoveryRef?: string;
  sessionCompletedAt?: string;
  reportedAt: string;
}
```

The orchestrator records the outcome exactly once and routes it for milestone evaluation.

## 13. Outcome Classification

```text
Session outcome received
    ↓
Validate identity and lineage
    ↓
Deduplicate by session + outcome version
    ↓
Classify effect
    ├─ Continue milestone
    ├─ Satisfy milestone
    ├─ Insert bounded adaptation
    ├─ Block journey
    ├─ Request replan
    ├─ Request intervention
    └─ Enter recovery
```

The orchestrator must not infer mastery from a local outcome.

## 14. Pause and Resume

Pause captures an explicit reason and resume condition.

```ts
interface JourneyPauseRecord {
  pauseId: string;
  journeyId: string;
  reasonCode:
    | 'LEARNER_REQUEST'
    | 'SCHEDULE'
    | 'DEVICE_OR_NETWORK'
    | 'DEPENDENCY_RUNTIME'
    | 'HUMAN_REVIEW'
    | 'SAFETY'
    | 'POLICY'
    | 'OTHER';
  resumable: boolean;
  resumeConditionRefs: string[];
  activePhaseId?: string;
  activeMilestoneId?: string;
  activeSessionIntentId?: string;
  pausedAt: string;
}
```

Resume rules:

- re-read persisted state
- validate the original journey and plan lineage
- reconcile any active or uncertain session
- re-evaluate blockers and policy
- acquire a fresh execution lease
- continue from the latest valid checkpoint

Resume never assumes that the prior process state is still authoritative.

## 15. Blocker Handling

```text
Detect blocker
    ↓
Persist blocker with owner and severity
    ↓
Stop only the affected execution scope
    ↓
Publish actionable projection
    ↓
Await resolution evidence or command
    ↓
Verify resolution
    ↓
Resume, adapt, or replan
```

Critical safety blockers halt all journey execution.

Non-blocking issues may permit bounded continuation if policy allows.

## 16. Retry Semantics

Retries are permitted for transport or transient dependency failures, not for invalid domain transitions.

```ts
interface JourneyRetryPolicy {
  policyId: string;
  maxAttempts: number;
  backoffStrategy: 'FIXED' | 'EXPONENTIAL';
  initialDelayMs: number;
  retryableFailureCodes: string[];
  reconciliationRequiredBeforeRetry: boolean;
}
```

Retry invariants:

- same logical command keeps the same command ID
- duplicate command execution returns prior result
- redispatch requires reconciliation when delivery state is uncertain
- retry exhaustion opens a technical blocker or enters recovery

## 17. Reconciliation

Reconciliation resolves uncertain cross-runtime outcomes.

```ts
interface JourneyReconciliationRecord {
  reconciliationId: string;
  journeyId: string;
  operationRef: string;
  expectedState: string;
  observedStates: Array<{ source: string; state: string; observedAt: string }>;
  resolution:
    | 'CONFIRMED_APPLIED'
    | 'CONFIRMED_NOT_APPLIED'
    | 'RETRY_ALLOWED'
    | 'HUMAN_REVIEW_REQUIRED'
    | 'BLOCKED';
  resolvedAt?: string;
}
```

## 18. Recovery Runtime

Recovery begins from persisted journey authority.

```text
Load event ledger
    ↓
Validate aggregate integrity
    ↓
Load compatible snapshot or replay
    ↓
Reconcile leases and active session references
    ↓
Reconcile pending outbox effects
    ↓
Rebuild operational checkpoint
    ↓
Resume, pause, or block safely
```

Possible recovery states:

```text
RECOVERY_REQUIRED
REPLAYING
RECONCILING
WAITING_DEPENDENCY
WAITING_HUMAN
RECOVERED_PAUSED
RECOVERED_ACTIVE
RECOVERY_FAILED
```

## 19. Cross-Runtime Coordination

### Learning Session Runtime

- receives bounded session intents
- acknowledges acceptance or refusal
- returns outcomes and evidence references
- owns session-local recovery

### Intervention Runtime

- receives intervention requests
- returns intervention lifecycle and resolution references
- may temporarily block or reshape journey execution through authorized handoff

### Diagnostic Runtime

- receives requests when prerequisite uncertainty exceeds plan authority
- returns diagnostic references, not direct journey mutations

### Mission Runtime

- receives journey progress and completion handoffs
- retains mission lifecycle authority

### Progress Engine

- receives journey projections and milestones
- does not become command authority for journey transitions

## 20. Scheduling and Wake-up

The orchestrator may schedule future eligibility checks for:

- planned session windows
- pause expiration
- blocker review
- intervention follow-up
- inactivity detection
- deadline risk reassessment

A scheduled wake-up is a trigger to re-read authority. It is not proof that a transition should occur.

## 21. Inactivity Handling

```ts
interface JourneyInactivityPolicy {
  warningAfterDays: number;
  pauseAfterDays?: number;
  replanAfterDays?: number;
  interventionAfterDays?: number;
  cancelAfterDays?: number;
  policyVersion: string;
}
```

Inactivity responses must avoid shame or punitive assumptions.

## 22. Completion Orchestration

Before entering `COMPLETION_PENDING`, the orchestrator verifies:

- all required phases are completed or validly waived
- all required milestones are satisfied
- all required evidence references are present
- no prohibited unresolved blockers remain
- active sessions are closed or reconciled
- all required cross-runtime handoffs are prepared

Final completion requires verification defined by 36H.

## 23. Cancellation

Cancellation must record:

- authority
- reason
- active execution state
- unresolved effects
- learner-visible meaning
- whether a replacement journey is expected
- retention and archival policy

Cancellation is not deletion and must not erase evidence or history.

## 24. Orchestration Commands

```text
EvaluateJourneyReadiness
ActivateJourney
AcquireJourneyExecutionLease
RenewJourneyExecutionLease
ReleaseJourneyExecutionLease
ActivateJourneyPhase
ActivateJourneyMilestone
DispatchJourneySessionIntent
AcknowledgeJourneySession
RecordJourneySessionOutcome
PauseJourney
ResumeJourney
OpenJourneyBlocker
ResolveJourneyBlocker
RequestJourneyReconciliation
CompleteJourneyReconciliation
RequestJourneyReplan
RequestJourneyIntervention
EnterJourneyCompletionPending
CompleteJourney
CancelJourney
```

## 25. Orchestration Events

```text
JourneyReadinessEvaluated
JourneyExecutionLeaseAcquired
JourneyExecutionLeaseRenewed
JourneyExecutionLeaseReleased
JourneyActivated
JourneyPhaseActivated
JourneyMilestoneActivated
JourneySessionIntentDispatched
JourneySessionAcknowledged
JourneySessionOutcomeRecorded
JourneyPaused
JourneyResumed
JourneyBlockerOpened
JourneyBlockerResolved
JourneyReconciliationRequested
JourneyReconciliationCompleted
JourneyReplanRequested
JourneyInterventionRequested
JourneyCompletionPendingEntered
JourneyCompleted
JourneyCancelled
JourneyRecoveryStarted
JourneyRecovered
JourneyRecoveryFailed
```

## 26. Failure Codes

```text
JOURNEY_ORCHESTRATION_LEASE_CONFLICT
JOURNEY_ORCHESTRATION_STALE_FENCING_TOKEN
JOURNEY_ORCHESTRATION_NOT_READY
JOURNEY_ORCHESTRATION_PHASE_NOT_ELIGIBLE
JOURNEY_ORCHESTRATION_MILESTONE_NOT_ELIGIBLE
JOURNEY_ORCHESTRATION_ACTIVE_SESSION_CONFLICT
JOURNEY_ORCHESTRATION_SESSION_ACK_TIMEOUT
JOURNEY_ORCHESTRATION_OUTCOME_IDENTITY_MISMATCH
JOURNEY_ORCHESTRATION_OUTCOME_DUPLICATE_CONFLICT
JOURNEY_ORCHESTRATION_RECONCILIATION_REQUIRED
JOURNEY_ORCHESTRATION_RETRY_EXHAUSTED
JOURNEY_ORCHESTRATION_BLOCKED
JOURNEY_ORCHESTRATION_COMPLETION_CONTRACT_NOT_MET
JOURNEY_ORCHESTRATION_RECOVERY_FAILED
```

## 27. Observability

Required telemetry dimensions:

```text
journeyId
planVersion
aggregateVersion
phaseId
milestoneId
sessionIntentId
sessionId
leaseId
fencingToken
commandId
correlationId
causationId
runtimeVersion
policyVersion
```

Key metrics:

- readiness failure rate
- activation latency
- phase duration
- milestone attempt count
- session dispatch latency
- acknowledgement timeout rate
- reconciliation frequency
- blocker duration
- pause duration
- replan request rate
- intervention request rate
- recovery success rate
- completion-pending latency

## 28. Orchestration Invariants

1. Only one valid execution lease may control a journey at a time.
2. Stale fencing tokens cannot mutate journey state.
3. Activation always rechecks readiness against persisted authority.
4. Only eligible phases and milestones may activate.
5. A session intent is dispatched within an accepted plan lineage.
6. Uncertain delivery is reconciled before duplicate dispatch.
7. Session outcomes are deduplicated and lineage-validated.
8. Pause and resume preserve exact journey meaning and checkpoint lineage.
9. Recovery starts from ledger authority, not process memory.
10. Retry cannot convert an invalid domain transition into a valid one.
11. Cancellation preserves history.
12. Journey completion requires explicit verification and does not imply mastery.
13. Learner safety may halt execution regardless of optimization goals.

## 29. Definition of Done

36C is complete when the architecture establishes:

- runtime controller and readiness evaluation
- execution lease and fencing authority
- journey, phase, and milestone activation
- session-intent dispatch and acknowledgement
- outcome intake and classification
- pause, resume, blocker, retry, and reconciliation semantics
- durable recovery states and process
- cross-runtime orchestration boundaries
- scheduling, inactivity, completion, and cancellation behavior
- commands, events, failures, telemetry, and invariants

This orchestration runtime is the execution authority base for 36D Adaptive Journey Runtime, 36E Journey Evidence Runtime, and 36F Journey Projection Runtime.
