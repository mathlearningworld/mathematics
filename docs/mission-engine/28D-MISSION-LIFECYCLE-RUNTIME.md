# Chapter 28D — Mission Lifecycle Runtime

## 1. Purpose

Mission Lifecycle Runtime is the authority that governs every valid state transition of a durable mission after activation.

It answers:

> What state is this mission in, which transitions are legal now, who may request them, and what durable evidence must be written when the state changes?

It does not decide whether learning occurred. It does not infer mastery. It does not rewrite Recommendation truth.

```text
Recommendation proposes direction
Mission Activation creates commitment
Mission Lifecycle governs commitment state
Gameplay produces activity evidence
Assessment interprets learning evidence
```

---

## 2. Authority Boundary

Mission Lifecycle Runtime owns:

- canonical mission state
- legal transition policy
- transition preconditions
- actor authority for transitions
- lifecycle versioning
- pause, resume, block, abandon, expire, supersede, and completion transitions
- transition idempotency
- transition audit records
- lifecycle events published after durable commit

Mission Lifecycle Runtime does not own:

- Assessment claims
- mastery confidence
- misconception interpretation
- Recommendation priority
- lesson delivery
- practice item generation
- gameplay mechanics
- reward economy
- learner identity authority

---

## 3. Canonical Mission States

```text
DRAFT
PROPOSED
ELIGIBLE
ACCEPTED
ACTIVE
IN_PROGRESS
PAUSED
BLOCKED
COMPLETION_PENDING
COMPLETED
ABANDONED
EXPIRED
SUPERSEDED
CANCELLED
```

### 3.1 Pre-commitment states

- `DRAFT`: internal mission construction only
- `PROPOSED`: visible proposal exists
- `ELIGIBLE`: proposal passed eligibility checks
- `ACCEPTED`: required acceptance exists, but activation has not completed

### 3.2 Active commitment states

- `ACTIVE`: mission is durably activated and available for execution
- `IN_PROGRESS`: at least one accepted execution activity has begun
- `PAUSED`: intentionally suspended but resumable
- `BLOCKED`: cannot continue until an explicit blocker is resolved
- `COMPLETION_PENDING`: completion conditions appear satisfied and await verification

### 3.3 Terminal states

- `COMPLETED`
- `ABANDONED`
- `EXPIRED`
- `SUPERSEDED`
- `CANCELLED`

Terminal states are immutable except through a new corrective mission or an append-only administrative correction record. A terminal mission is never silently reopened.

---

## 4. Canonical Transition Graph

```text
DRAFT
  ↓ propose
PROPOSED
  ↓ qualify
ELIGIBLE
  ↓ accept
ACCEPTED
  ↓ activate
ACTIVE
  ↓ begin
IN_PROGRESS
  ├── pause ───────────────→ PAUSED
  │                            ↓ resume
  │                         IN_PROGRESS
  ├── block ───────────────→ BLOCKED
  │                            ↓ unblock
  │                         ACTIVE | IN_PROGRESS
  ├── request completion ─→ COMPLETION_PENDING
  │                            ├── confirm → COMPLETED
  │                            └── reject  → IN_PROGRESS | BLOCKED
  ├── abandon ─────────────→ ABANDONED
  ├── expire ──────────────→ EXPIRED
  ├── supersede ───────────→ SUPERSEDED
  └── cancel ──────────────→ CANCELLED
```

No implementation may infer transitions that are not explicitly listed by policy.

---

## 5. Transition Command Contract

```ts
interface MissionTransitionCommand {
  tenantId: string
  learnerId: string
  missionId: string
  expectedVersion: number
  transitionType: MissionTransitionType
  actor: MissionActorRef
  reasonCode?: string
  reasonText?: string
  correlationId: string
  causationId?: string
  idempotencyKey: string
  requestedAt: string
  metadata?: Record<string, unknown>
}
```

Every command must bind:

- tenant
- learner
- mission
- expected aggregate version
- actor identity and authority
- requested transition
- idempotency key
- correlation identity

Cross-tenant and cross-learner commands are rejected before state evaluation.

---

## 6. Transition Decision Contract

```ts
interface MissionTransitionDecision {
  missionId: string
  previousState: MissionState
  nextState: MissionState
  previousVersion: number
  nextVersion: number
  decision: 'APPLIED' | 'NO_OP' | 'REJECTED'
  reasonCode: string
  decidedAt: string
  eventIds: string[]
}
```

`NO_OP` is valid only for an idempotent replay of an already-applied transition with the same semantic payload.

---

## 7. Actor Authority

Possible actor categories:

```text
LEARNER
PARENT
TEACHER
MENTOR
SYSTEM_POLICY
MISSION_ENGINE
GAMEPLAY_RUNTIME
OPERATIONS
ADMINISTRATOR
```

Authority is transition-specific.

Examples:

- learner may pause or resume an optional mission
- teacher may block a teacher-guided mission with a reason
- system policy may expire a time-bounded mission
- Mission Engine may supersede a mission when its source recommendation is replaced
- Gameplay Runtime may request `IN_PROGRESS`, but may not directly mark `COMPLETED`
- Assessment Engine may publish evidence but may not mutate mission lifecycle state

Human authority must not be replaced by automation where policy requires consent.

---

## 8. Transition Preconditions

Every transition evaluates:

1. identity scope
2. current state
3. expected version
4. actor authority
5. transition policy
6. temporal constraints
7. source recommendation validity where required
8. prerequisite status where required
9. duplicate active mission rules
10. idempotency history

A failed precondition produces a typed refusal and no state mutation.

---

## 9. Pause and Resume

Pause is a durable lifecycle transition, not a UI flag.

Pause reasons may include:

```text
LEARNER_BREAK
SCHEDULE_CONFLICT
FATIGUE_SIGNAL
SUPPORT_REQUIRED
RESOURCE_UNAVAILABLE
TEACHER_REQUEST
PARENT_REQUEST
SYSTEM_SAFETY
```

Pause must preserve:

- progress snapshot reference
- active objective
- remaining constraints
- expiry calculation policy
- resume eligibility

Resume must revalidate:

- mission not expired or superseded
- prerequisite still valid
- delivery capability available
- actor authorized
- active-load policy allows continuation

---

## 10. Blocking and Unblocking

Blocked state means execution cannot responsibly continue.

Blocker categories:

```text
PREREQUISITE_GAP
CONTENT_UNAVAILABLE
DELIVERY_CAPABILITY_UNAVAILABLE
HUMAN_SUPPORT_REQUIRED
SAFETY_RESTRICTION
CONFLICTING_EVIDENCE
POLICY_HOLD
TECHNICAL_FAILURE
```

A blocker record must include:

- blocker identity
- blocker type
- created time
- source
- explanation
- resolution condition
- owner responsible for resolution

Unblocking never implies progress or mastery. It only restores execution eligibility.

---

## 11. Expiration

Expiration is policy-driven and deterministic.

A mission may expire because:

- proposal validity ended before activation
- active mission deadline passed
- source plan ended
- curriculum window closed
- recommendation became too stale
- required capability was unavailable beyond tolerance

Expiration must not be used as a synonym for failure.

Expired missions remain historically visible and replayable.

---

## 12. Supersession

A mission is superseded when a newer authoritative mission replaces its purpose.

Supersession requires:

- successor mission or successor proposal reference
- supersession reason
- policy version
- actor authority
- preserved history

```text
Old mission → SUPERSEDED
New mission → independent lifecycle
```

Supersession never overwrites the original mission.

---

## 13. Abandonment and Cancellation

`ABANDONED` records a deliberate end to an accepted or active commitment.

`CANCELLED` records an authoritative withdrawal before meaningful completion.

Neither state means:

- learner failed
- learner lacks mastery
- recommendation was wrong

Assessment may interpret activity evidence separately, but lifecycle labels must remain operational facts only.

---

## 14. Completion Pending

Mission Lifecycle Runtime must not jump directly from `IN_PROGRESS` to `COMPLETED` when completion requires verification.

```text
IN_PROGRESS
  ↓ completion request
COMPLETION_PENDING
  ↓ completion verification
COMPLETED | IN_PROGRESS | BLOCKED
```

Completion verification belongs to Chapter 28F.

---

## 15. Optimistic Concurrency

Every mutation requires `expectedVersion`.

```text
storedVersion == expectedVersion
  → transition may proceed
storedVersion != expectedVersion
  → reject with MISSION_VERSION_CONFLICT
```

Last-write-wins is prohibited.

---

## 16. Idempotency

Transition idempotency key scope:

```text
tenantId + missionId + transitionType + idempotencyKey
```

Repeated semantically identical commands return the original result.

Repeated commands with the same key but different semantic content are rejected as `IDEMPOTENCY_CONFLICT`.

---

## 17. Durable Transaction Boundary

One lifecycle transition transaction writes:

- mission aggregate state
- aggregate version
- transition record
- actor decision record
- blocker or pause record where applicable
- idempotency record
- audit record
- outbox events

Events publish only after the transaction commits.

---

## 18. Lifecycle Events

```text
MissionProposed
MissionEligible
MissionAccepted
MissionActivated
MissionStarted
MissionPaused
MissionResumed
MissionBlocked
MissionUnblocked
MissionCompletionRequested
MissionCompleted
MissionAbandoned
MissionExpired
MissionSuperseded
MissionCancelled
```

Events are facts, not commands.

---

## 19. Failure Codes

```text
MISSION_NOT_FOUND
MISSION_SCOPE_MISMATCH
MISSION_VERSION_CONFLICT
TRANSITION_NOT_ALLOWED
ACTOR_NOT_AUTHORIZED
MISSION_ALREADY_TERMINAL
MISSION_EXPIRED
MISSION_SUPERSEDED
PREREQUISITE_BLOCKED
SOURCE_RECOMMENDATION_STALE
DELIVERY_CAPABILITY_UNAVAILABLE
ACTIVE_LOAD_LIMIT_REACHED
IDEMPOTENCY_CONFLICT
TRANSITION_PRECONDITION_FAILED
```

Failures are typed and durable where operational review is required.

---

## 20. Determinism

Given the same:

- mission snapshot
- command
- policy version
- authority context
- clock input

The transition decision must be identical.

Runtime code must not depend on unordered collection traversal or implicit current time.

---

## 21. Lifecycle Invariants

1. A mission has exactly one canonical state at a version.
2. State changes only through explicit transition commands.
3. Terminal missions are not silently reopened.
4. Completion is never inferred from UI navigation or session closure.
5. Gameplay may request transitions but cannot bypass lifecycle authority.
6. Mission state does not assert mastery.
7. Every transition is tenant- and learner-scoped.
8. Every mutation uses optimistic concurrency.
9. History is append-only.
10. Events publish after durable commit.
11. Pause and block are semantically distinct.
12. Supersession preserves predecessor and successor references.
13. Idempotent replay cannot create duplicate transitions.
14. Policy refusal never partially mutates mission state.

---

## 22. Verification Scenarios

Minimum automated scenarios:

- activate then begin
- pause then resume
- block then unblock
- reject illegal terminal transition
- reject stale expected version
- reject unauthorized actor
- expire by deterministic clock
- supersede with successor reference
- idempotent duplicate transition
- conflicting idempotency payload
- completion request enters pending state
- transaction rollback emits no event
- cross-tenant command rejected
- cross-learner command rejected

---

## 23. Architectural Result

After 28D, Mission Engine has a durable state machine that protects commitment meaning.

```text
Mission Candidate
  ↓
Activation
  ↓
Lifecycle Authority
  ↓
Progress Runtime
  ↓
Completion Runtime
```

The next slice defines how mission activity becomes bounded, durable progress without turning activity counters into learning claims.
