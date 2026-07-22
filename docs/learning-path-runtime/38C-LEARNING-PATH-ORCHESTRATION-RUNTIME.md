# Chapter 38C — Learning Path Orchestration Runtime

## 1. Purpose

Learning Path Orchestration Runtime coordinates execution of an approved learning path.

It turns an active path into safe next actions while preserving authority boundaries between path planning, mastery, sessions, activities, evidence, and human review.

```text
Approved Active Path
  ↓
Resolve Current Execution State
  ↓
Select Eligible Node
  ↓
Authorize Next Action
  ↓
Coordinate Session / Activity Runtime
  ↓
Receive Execution Outcome
  ↓
Advance, Pause, Block, or Replan
```

## 2. Orchestration Boundary

Orchestration Runtime owns:

- active-node selection
- node eligibility checks
- next-action authorization
- path execution cursor
- coordination with session runtime
- branch resolution
- checkpoint handling
- pause and resume coordination
- block detection
- replan triggers
- execution lineage
- duplicate-outcome protection

It does not own:

- path design
- mastery confirmation
- raw evidence acceptance
- curriculum truth
- skill graph truth
- activity rendering
- final path authority transitions outside its delegated commands

## 3. Core Doctrine

```text
Planning decides what may be learned.
Orchestration decides what may execute now.
Session Runtime executes the bounded learning work.
```

Orchestration must never convert a recommendation into execution authority without validating the active path and node state.

## 4. Execution State

Minimum execution state:

```text
pathId
pathVersion
status
activeNodeId?
executionCursor
completedNodeIds
skippedNodeIds
blockedNodeIds
pendingCheckpointIds
activeSessionId?
lastOutcomeId?
updatedAt
```

## 5. Execution Cursor

The cursor identifies the runtime's current position without redefining path structure.

Minimum cursor fields:

```text
cursorId
pathId
pathVersion
currentNodeId?
branchContext
attemptNumber
lastTransitionAt
cursorVersion
```

Cursor history must remain reconstructable.

## 6. Eligible Node Resolution

A node is eligible only when:

- the path is `ACTIVE`
- node status permits entry
- all hard prerequisite nodes are satisfied
- branch conditions select the node
- no higher-priority mandatory node blocks it
- required content is available
- required runtime capability is available
- no safety or review gate is unresolved

Eligibility must be deterministic for the same execution state.

## 7. Node Runtime Status

Recommended statuses:

```text
PENDING
ELIGIBLE
READY
IN_PROGRESS
WAITING_FOR_EVIDENCE
WAITING_FOR_REVIEW
BLOCKED
COMPLETED
SKIPPED
SUPERSEDED
FAILED_OPERATIONALLY
```

Educational non-completion must be distinguished from operational failure.

## 8. Next Action Contract

The runtime emits a bounded next-action instruction:

```text
nextActionId
pathId
pathVersion
nodeId
nodeType
objectiveIds
skillIds
allowedActivityTypes
sessionConstraints
completionRule
branchContext
expiresAt?
authorizationHash
```

The instruction is authority-scoped and must not be reused after expiration or path-version change.

## 9. Session Coordination

When a node requires a learning session, Orchestration Runtime requests session creation with:

```text
pathId
pathVersion
nodeId
objectiveIds
skillIds
activityPolicy
completionRule
learnerContextVersion
correlationId
```

Session Runtime returns:

```text
sessionId
acceptedPathVersion
acceptedNodeId
sessionStatus
```

A mismatch must fail before execution begins.

## 10. Outcome Intake

The runtime may receive outcomes such as:

```text
SESSION_STARTED
SESSION_PAUSED
SESSION_COMPLETED
SESSION_ABORTED
ACTIVITY_COMPLETED
CHECKPOINT_REACHED
EVIDENCE_PACKAGE_AVAILABLE
CONTENT_UNAVAILABLE
TECHNICAL_FAILURE
LEARNER_EXITED
HUMAN_REVIEW_REQUESTED
```

Every outcome must include identity, version, correlation, and idempotency metadata.

## 11. Outcome Validation

Before applying an outcome, validate:

- tenant identity
- learner identity
- path identity
- expected path version
- node identity
- session identity when applicable
- correlation lineage
- outcome uniqueness
- temporal plausibility
- allowed current state

An outcome from an older superseded path must not advance the current path.

## 12. Node Completion

Node completion requires its declared completion rule.

Examples:

```text
ACTIVITY_SET_COMPLETED
CHECKPOINT_SUBMITTED
EVIDENCE_PACKAGE_CREATED
HUMAN_REVIEW_APPROVED
TIME_BOUND_PRACTICE_COMPLETED
```

Completion does not imply mastery unless Mastery Runtime later authorizes that decision.

## 13. Branch Resolution

Branch decisions may depend on:

- session outcome
- checkpoint outcome
- authoritative mastery update
- evidence availability
- operational capability
- human review

Branch rules must be versioned and deterministic.

The selected branch must record:

```text
branchRuleId
inputReferences
selectedNodeId
reasonCode
resolvedAt
resolverVersion
```

## 14. Checkpoints

Checkpoints synchronize path execution with educational truth.

A checkpoint may:

- request assessment
- request mastery reevaluation
- require teacher review
- verify retention
- verify readiness for acceleration
- determine remediation depth

Orchestration must wait for authoritative results where the path policy requires them.

## 15. Pause and Resume

Pause may be initiated by:

- learner request
- parent or teacher authority
- operational interruption
- fatigue or safety policy
- pending review
- system maintenance

Resume requires revalidation of:

- path freshness
- node eligibility
- content availability
- learner context
- policy compatibility

A long pause may trigger replanning rather than direct resume.

## 16. Blocking

A path or node may become blocked by:

```text
PREREQUISITE_UNSATISFIED
MASTERY_STATE_STALE
EVIDENCE_CONTRADICTION
CONTENT_UNAVAILABLE
SESSION_CAPABILITY_UNAVAILABLE
POLICY_REVIEW_REQUIRED
ACCESSIBILITY_MISMATCH
CURRICULUM_VERSION_CHANGED
SKILL_GRAPH_VERSION_CHANGED
HUMAN_REVIEW_PENDING
```

Blocking must preserve a concrete reason and recovery action.

## 17. Replan Triggers

Orchestration may request replanning when:

- active node becomes invalid
- mastery changes materially
- prerequisite state changes
- repeated attempts exceed policy
- content remains unavailable
- learner schedule changes materially
- accessibility needs change
- mission or journey priority changes
- path inputs become stale

It requests a replan; it does not silently rewrite the path.

## 18. Attempt Management

Attempts must be tracked per node and activity scope.

Minimum attempt fields:

```text
attemptId
nodeId
attemptNumber
sessionId?
startedAt
endedAt?
outcome
operationalFailure?
```

Repeated operational failures must not be interpreted as repeated learning failures.

## 19. Retry Policy

Retry must distinguish:

- safe technical retry
- resumed learner attempt
- new educational attempt
- alternate representation
- escalation to review

A retry must never duplicate a completed transition.

## 20. Idempotency

Every command and outcome requires a stable identity.

Duplicate delivery of the same semantic outcome must return the previously applied result.

Conflicting payloads under the same outcome identity must be rejected.

## 21. Concurrency

Concurrent orchestration actions may arise from:

- learner device
- teacher action
- automated checkpoint
- session completion callback
- replan approval

All mutations require expected versions.

Only one active node may hold exclusive execution authority unless the path explicitly permits parallel nodes.

## 22. Parallel Execution

Parallel nodes are allowed only when:

- their objectives do not violate prerequisite order
- the path policy explicitly permits concurrency
- completion rules are independent or coordinated
- session limits are respected

Parallel execution must use a declared execution group.

## 23. Human Review

When automated authority is insufficient, the runtime creates a review request:

```text
reviewRequestId
pathId
nodeId
reasonCode
requiredAuthority
contextReferences
createdAt
status
```

The path must not advance through the gated transition until an authorized decision exists.

## 24. Cancellation and Supersession

When a path is cancelled or superseded:

- no new next-action authorization may be issued
- active session behavior follows explicit policy
- pending outcomes remain recorded
- historical execution is preserved
- downstream consumers receive the terminal signal

## 25. Completion Coordination

Before requesting path completion, Orchestration verifies:

- all mandatory nodes reached terminal completion
- no hard blocker remains
- required checkpoints are resolved
- required evidence packages exist
- final mastery reevaluation request was issued when required
- active sessions are closed or reconciled

Path Decision authority performs the final completion transition.

## 26. Outbound Signals

Recommended signals:

```text
LearningPathNodeActivated
LearningPathSessionRequested
LearningPathNodeCompleted
LearningPathNodeBlocked
LearningPathCheckpointReached
LearningPathReplanRequested
LearningPathReviewRequested
LearningPathCompletionRequested
```

Signals are facts or requests, not hidden cross-runtime mutations.

## 27. Recovery

After interruption, recovery must begin from durable state:

1. load authoritative path and cursor
2. inspect active session reference
3. reconcile pending outcomes
4. revalidate node eligibility
5. detect ambiguous commands
6. resume, block, or request replan

Conversation state or transient memory is never recovery authority.

## 28. Observability

Operational telemetry should include:

```text
path_activation_count
node_activation_count
node_completion_count
blocked_path_count
replan_request_count
review_request_count
outcome_duplicate_count
version_conflict_count
session_reconciliation_count
operational_failure_count
```

Telemetry must not expose sensitive learner data unnecessarily.

## 29. Failure Codes

Recommended codes:

```text
PATH_NOT_ACTIVE
PATH_VERSION_CONFLICT
NODE_NOT_ELIGIBLE
NODE_ALREADY_COMPLETED
INVALID_BRANCH_OUTCOME
SESSION_IDENTITY_MISMATCH
OUTCOME_ALREADY_APPLIED
OUTCOME_PAYLOAD_CONFLICT
CHECKPOINT_PENDING
HARD_BLOCKER_PRESENT
REPLAN_REQUIRED
REVIEW_REQUIRED
CONTENT_UNAVAILABLE
ACCESSIBILITY_MISMATCH
SUPERSEDED_PATH
```

## 30. Orchestration Invariants

1. Only an active path may issue next actions.
2. Node eligibility is checked immediately before authorization.
3. A next-action instruction is bound to path and node versions.
4. Session outcomes cannot redefine mastery.
5. Node completion follows explicit completion rules.
6. Branch decisions are deterministic and recorded.
7. Operational failure is not learning failure.
8. Replanning never overwrites the current path silently.
9. Duplicate outcomes never duplicate transitions.
10. Version conflicts fail safely.
11. Human-review gates cannot be bypassed automatically.
12. Superseded paths cannot issue new work.
13. Recovery starts from durable authority.
14. Path completion requires reconciliation of active execution.
15. Every orchestration action has traceable lineage.

## 31. Closing Definition

```text
Learning Path Orchestration Runtime safely converts
an approved active path into bounded executable next actions,
coordinates their outcomes, and preserves educational authority
across every transition.
```
