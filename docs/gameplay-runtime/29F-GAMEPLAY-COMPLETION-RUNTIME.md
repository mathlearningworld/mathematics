# 29F — Gameplay Completion Runtime

## Status

Architecture definition for Chapter 29F.

This slice defines how a Gameplay Session or Gameplay Objective reaches an operationally complete state, how completion is verified, and how completion evidence is handed to Mission and Assessment without allowing Gameplay Runtime to overclaim learning success.

---

## 1. Purpose

Gameplay Completion Runtime is responsible for deciding whether gameplay execution has reached a valid terminal or handoff-ready state.

It answers:

- Has the required gameplay work been performed?
- Are all required objectives resolved?
- Are blockers, holds, waivers, and failures represented correctly?
- Is the world state stable enough to close?
- Is the interaction and evidence history durable?
- What completion result may be published to Mission Runtime?
- What evidence bundle may be published to Assessment?

It does not decide:

- mastery,
- proficiency,
- readiness,
- curriculum completion,
- recommendation priority,
- mission success beyond the Mission contract.

---

## 2. Authority Boundary

```text
Gameplay Session + Objective Runtime
                ↓
     Gameplay Completion Runtime
          ↙                 ↘
Mission Completion Input    Evidence Handoff
          ↓                 ↓
     Mission Runtime    Assessment Engine
```

The Gameplay Completion decision is an operational execution statement.

```text
Gameplay complete ≠ Mission complete
Mission complete ≠ Skill mastered
Objective satisfied ≠ Understanding proven
```

---

## 3. Completion Subjects

Completion may be evaluated for:

```text
GAMEPLAY_OBJECTIVE
OBJECTIVE_GROUP
SCENE_PHASE
GAMEPLAY_SESSION
GAMEPLAY_ATTEMPT
MISSION_GAMEPLAY_BINDING
```

Each subject has an explicit completion contract and version.

---

## 4. Completion States

```text
NOT_READY
ELIGIBLE
COMPLETION_PENDING
COMPLETED
COMPLETED_WITH_LIMITATIONS
BLOCKED
HELD_FOR_REVIEW
ABANDONED
EXPIRED
INVALIDATED
SUPERSEDED
QUARANTINED
```

`COMPLETED_WITH_LIMITATIONS` is a valid operational state, but limitations must remain visible to downstream consumers.

---

## 5. Completion Request

A completion request may originate from:

```text
LEARNER
GAMEPLAY_RUNTIME
OBJECTIVE_RUNTIME
WORLD_RUNTIME
TEACHER
MENTOR
SYSTEM_TIMEOUT
RECOVERY_RUNTIME
```

A request must include:

- tenant and learner scope,
- actor identity,
- session and objective versions,
- completion subject,
- expected completion contract version,
- latest authoritative sequence,
- evidence handoff status,
- idempotency key,
- correlation and causation identifiers.

A request is not a completion decision.

---

## 6. Completion Contract

```ts
interface GameplayCompletionContract {
  contractId: string;
  contractVersion: string;
  subjectType: GameplayCompletionSubjectType;

  requiredObjectiveRules: ObjectiveCompletionRule[];
  optionalObjectiveRules: ObjectiveCompletionRule[];
  blockerPolicy: BlockerPolicy;
  waiverPolicy: WaiverPolicy;
  evidencePolicy: CompletionEvidencePolicy;
  worldStatePolicy: WorldStateCompletionPolicy;
  assistancePolicy: CompletionAssistancePolicy;
  collaborationPolicy: CompletionCollaborationPolicy;
  timeoutPolicy: CompletionTimeoutPolicy;

  allowedOutcomes: GameplayCompletionOutcome[];
  policyVersion: string;
}
```

The contract must be immutable once used for a historical completion decision.

---

## 7. Completion Pipeline

```text
Receive Completion Request
          ↓
Resolve Subject and Contract
          ↓
Validate Scope and Authority
          ↓
Lock Expected Versions
          ↓
Evaluate Required Objectives
          ↓
Evaluate Blockers / Holds / Waivers
          ↓
Validate World State
          ↓
Validate Interaction Durability
          ↓
Validate Evidence Handoff Readiness
          ↓
Evaluate Assistance / Collaboration Limits
          ↓
Decide Completion Outcome
          ↓
Persist Decision and Outbox Atomically
          ↓
Publish Mission and Assessment Handoffs
```

No completion projection may appear before the durable decision exists.

---

## 8. Objective Resolution

Each objective must resolve to one of:

```text
SATISFIED
WAIVED
BLOCKED
FAILED_OPERATIONALLY
ABANDONED
EXPIRED
SUPERSEDED
INVALIDATED
UNRESOLVED
```

Rules:

- `WAIVED` is never rewritten as `SATISFIED`.
- Optional objectives do not become required because they were attempted.
- Failed operational objectives do not imply learner failure.
- Superseded objectives are evaluated under supersession policy, not silently ignored.
- Hidden or locked objectives must be treated according to their contract role.

---

## 9. Completion Outcomes

```text
SUCCESS
SUCCESS_WITH_LIMITATIONS
PARTIAL
BLOCKED
ABANDONED
EXPIRED
INVALIDATED
QUARANTINED
```

Meaning:

- `SUCCESS`: gameplay completion contract fully satisfied.
- `SUCCESS_WITH_LIMITATIONS`: operational completion is valid, but evidence or execution limitations exist.
- `PARTIAL`: meaningful work exists, but the full completion contract is not satisfied.
- `BLOCKED`: completion cannot proceed due to an active blocker or hold.
- `ABANDONED`: execution was explicitly ended without satisfying completion.
- `EXPIRED`: completion window closed under policy.
- `INVALIDATED`: prior execution context is no longer valid.
- `QUARANTINED`: integrity or authority failure prevents publication.

---

## 10. Blockers and Holds

Completion blockers may include:

```text
REQUIRED_OBJECTIVE_UNRESOLVED
REQUIRED_WORLD_STATE_INVALID
EVIDENCE_HANDOFF_INCOMPLETE
INTERACTION_SEQUENCE_GAP
SESSION_INTEGRITY_FAILURE
MISSION_BINDING_STALE
ACTOR_AUTHORITY_MISSING
COLLABORATION_ATTRIBUTION_UNRESOLVED
ASSISTANCE_LIMIT_EXCEEDED
SAFETY_REVIEW_REQUIRED
MANUAL_REVIEW_REQUIRED
```

A blocker may be resolved, waived by authorized policy, superseded, or retained.

It must never disappear without a durable transition record.

---

## 11. Waivers

A waiver requires:

- authorized actor or policy,
- exact waived requirement,
- reason code,
- scope,
- effective time,
- expiration where applicable,
- supporting evidence or administrative context,
- immutable audit record.

Rules:

```text
Waiver ≠ Satisfaction
Waiver ≠ Mastery
Waiver ≠ Evidence
```

Completion projections must distinguish waived requirements from satisfied requirements.

---

## 12. World State Validation

World state validation may check:

- required objects exist,
- construction topology is valid,
- placement constraints are satisfied,
- simulation is stable,
- no pending mutation remains,
- required resources are reconciled,
- scene state matches the completion checkpoint,
- world snapshot integrity hash matches.

Visual appearance alone is insufficient when semantic state is required.

---

## 13. Interaction Durability

Before completion:

- all accepted interactions through the completion sequence must be persisted,
- duplicate and rejected interactions must have stable decisions,
- offline batches must be reconciled or explicitly excluded,
- sequence gaps must be resolved or limited,
- the authoritative final sequence must be frozen for the decision.

Late interactions after the frozen sequence require a new completion evaluation or a superseding decision.

---

## 14. Evidence Handoff Readiness

Completion evaluates whether expected evidence processing is:

```text
READY
READY_WITH_LIMITATIONS
NOT_REQUIRED
PENDING
FAILED_OPERATIONALLY
QUARANTINED
```

Gameplay completion may succeed when evidence is not required by contract.

When evidence is required, a missing handoff may block completion or produce `SUCCESS_WITH_LIMITATIONS` according to policy.

Completion must not manufacture evidence to satisfy its own gate.

---

## 15. Assistance Limits

Assistance may influence completion labeling without changing objective history.

Examples:

- Gameplay execution may complete after a hint.
- A direct-answer exposure may cause evidence limitation.
- Teacher facilitation may permit session completion but require individual assessment later.
- Accessibility accommodations must not be treated as disqualifying assistance by default.

Assistance policy belongs to the completion contract and evidence contract, not ad hoc UI logic.

---

## 16. Collaboration Completion

Collaborative completion separates:

```text
GROUP_EXECUTION_COMPLETION
SHARED_WORLD_COMPLETION
INDIVIDUAL_CONTRIBUTION_RESOLUTION
INDIVIDUAL_EVIDENCE_READINESS
```

A group may complete the shared gameplay task while one or more individual evidence handoffs remain partial or unavailable.

The runtime must never convert group success into equal individual success.

---

## 17. Canonical Completion Decision

```ts
interface GameplayCompletionDecision {
  completionDecisionId: string;
  tenantId: string;
  learnerId: string;
  actorId: string;

  subjectType: GameplayCompletionSubjectType;
  subjectId: string;
  subjectVersion: number;

  sessionId: string;
  missionId?: string;
  missionVersion?: number;

  contractId: string;
  contractVersion: string;
  policyVersion: string;

  outcome: GameplayCompletionOutcome;
  objectiveResolutionSummary: unknown;
  activeBlockers: string[];
  appliedWaivers: string[];
  limitations: string[];

  finalInteractionSequence: number;
  worldSnapshotId?: string;
  evidenceBundleIds: string[];
  evidenceHandoffStatus: string;

  decidedAt: string;
  effectiveAt: string;
  recordedAt: string;

  correlationId: string;
  causationId?: string;
  idempotencyKey: string;
  integrityHash: string;
}
```

---

## 18. Mission Handoff

Gameplay Completion publishes a typed result to Mission Runtime.

The handoff may state:

- gameplay subject completed,
- completion outcome,
- objective resolution summary,
- limitations,
- waivers,
- blockers,
- completion time,
- evidence handoff references.

Mission Runtime independently decides whether its mission completion contract is satisfied.

Gameplay Runtime cannot set Mission state directly.

---

## 19. Assessment Handoff

Assessment receives evidence candidates or bundles, not the Gameplay Completion label as a mastery conclusion.

The completion decision may provide context such as:

- task finished,
- objective path used,
- assistance conditions,
- collaboration conditions,
- final world outcome,
- limitations.

Assessment remains free to accept, defer, limit, contradict, or reject the implied interpretation.

---

## 20. Session Closure

Session completion and session closure are separate.

```text
COMPLETION DECIDED
        ↓
HANDOFFS PERSISTED
        ↓
OUTBOX PUBLISHED OR RECOVERABLE
        ↓
RESOURCES RECONCILED
        ↓
SESSION CLOSED
```

Closure must not delete replay or audit data.

A completed session may remain open temporarily for projection, acknowledgment, or safe resource cleanup.

---

## 21. Idempotency and Concurrency

Completion uses optimistic concurrency against:

- session version,
- objective versions,
- mission binding version,
- final interaction sequence,
- completion contract version.

Rules:

- No last-write-wins.
- Duplicate requests return the original decision.
- Concurrent valid requests converge on one durable decision per subject version.
- A changed source version requires re-evaluation.
- A terminal decision may only be changed through explicit supersession or invalidation policy.

---

## 22. Supersession and Invalidation

A completion decision may be superseded when:

- late durable interactions alter the source range,
- source integrity is later disproven,
- objective or mission binding was invalid,
- administrative repair is authorized,
- replay identifies a deterministic divergence,
- a completion contract defect is formally corrected.

Supersession creates a new linked decision.

Historical decisions remain queryable and are never rewritten in place.

---

## 23. Recovery

Recovery handles:

- persisted decision with unpublished handoff,
- published handoff with missing acknowledgment,
- interrupted world snapshot finalization,
- incomplete session closure,
- duplicated completion requests,
- offline evidence arrival,
- stale projection after completion.

Recovery resumes from durable state. It must not infer completion from client UI state alone.

---

## 24. Replay

Replay modes:

```text
HISTORICAL_COMPLETION_REPLAY
CURRENT_POLICY_SIMULATION
MISSION_HANDOFF_REPLAY
ASSESSMENT_HANDOFF_REPLAY
RECOVERY_REPLAY
DIAGNOSTIC_REPLAY
```

Historical replay uses original contract and policy versions where available.

Current-policy simulation is non-authoritative and must not overwrite the original decision.

---

## 25. Persistence Records

```text
GameplayCompletionRequestRecord
GameplayCompletionEvaluationRecord
GameplayCompletionDecisionRecord
GameplayCompletionBlockerRecord
GameplayCompletionWaiverRecord
GameplayCompletionSupersessionRecord
GameplayCompletionHandoffRecord
GameplayCompletionVerificationRecord
GameplaySessionClosureRecord
GameplayCompletionOutboxRecord
GameplayCompletionIdempotencyRecord
```

All semantic history is append-only.

---

## 26. Publication Decisions

```text
PUBLISH
PUBLISH_WITH_LIMITATIONS
HOLD
QUARANTINE
REJECT
```

Publication refers to downstream handoffs and projections. It does not strengthen the completion outcome.

A quarantined decision must not be consumed as successful completion.

---

## 27. Failure Codes

```text
GAMEPLAY_COMPLETION_SCOPE_MISMATCH
GAMEPLAY_COMPLETION_ACTOR_UNAUTHORIZED
GAMEPLAY_COMPLETION_SUBJECT_NOT_FOUND
GAMEPLAY_COMPLETION_VERSION_CONFLICT
GAMEPLAY_COMPLETION_CONTRACT_UNAVAILABLE
GAMEPLAY_COMPLETION_REQUIRED_OBJECTIVE_UNRESOLVED
GAMEPLAY_COMPLETION_BLOCKER_ACTIVE
GAMEPLAY_COMPLETION_WORLD_STATE_INVALID
GAMEPLAY_COMPLETION_SEQUENCE_INCOMPLETE
GAMEPLAY_COMPLETION_EVIDENCE_NOT_READY
GAMEPLAY_COMPLETION_COLLABORATION_UNRESOLVED
GAMEPLAY_COMPLETION_INTEGRITY_FAILED
GAMEPLAY_COMPLETION_ALREADY_TERMINAL
GAMEPLAY_COMPLETION_HANDOFF_FAILED
GAMEPLAY_COMPLETION_QUARANTINED
```

Operational failure codes must not be represented as learner misunderstanding.

---

## 28. Required Invariants

1. A completion request is not a completion decision.
2. Gameplay completion never directly changes Mission state.
3. Gameplay completion never claims mastery.
4. Required objectives cannot disappear from evaluation.
5. Waived objectives remain distinguishable from satisfied objectives.
6. Active blockers cannot be silently erased.
7. The final interaction sequence is immutable for a decision.
8. Evidence limitations survive every handoff.
9. Group completion does not imply equal individual evidence.
10. Accessibility accommodation is not disqualifying assistance by default.
11. Duplicate requests cannot create duplicate completion meaning.
12. Terminal history is append-only and corrected through supersession.
13. Completion publication occurs only after durable persistence.
14. Session closure occurs only after handoffs are durable or recoverable.
15. Operational failure is never learner failure.

---

## 29. Verification Scenarios

Minimum automated verification must cover:

- successful required-objective completion,
- unresolved required objective blocking,
- optional objective non-escalation,
- waiver-versus-satisfaction distinction,
- active blocker preservation,
- stale session and objective version rejection,
- duplicate completion idempotency,
- concurrent request convergence,
- final interaction sequence freeze,
- late interaction supersession,
- world-state validation,
- evidence handoff limitation propagation,
- collaboration separation,
- accessibility and assistance distinction,
- Mission handoff without direct state mutation,
- Assessment handoff without mastery claim,
- outbox recovery,
- historical replay determinism,
- quarantine on integrity failure,
- session closure ordering.

---

## 30. Completion Condition

29F is architecturally complete when Gameplay Runtime can produce a durable, replayable, limitation-aware operational completion decision and hand it to Mission and Assessment authorities without erasing blockers, converting waivers into satisfaction, or representing gameplay success as learning mastery.
