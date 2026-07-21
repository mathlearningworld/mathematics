# 29D — Gameplay Interaction Runtime

## Status

Architecture definition for Chapter 29D.

This slice defines how raw player, device, world, and system signals become authorized, ordered, durable Gameplay Interactions without allowing the gameplay layer to invent learning truth.

---

## 1. Purpose

Gameplay Interaction Runtime is the authority for accepting, validating, normalizing, ordering, and routing actions that occur inside an active Gameplay Session.

It answers:

- What happened?
- Who or what initiated it?
- In which session, world, scene, and objective context did it occur?
- Was the action authorized?
- Was it accepted, rejected, ignored, deferred, or quarantined?
- Which objective runtime may observe it?
- Can it contribute to an evidence candidate?

It does not answer:

- Did the learner understand?
- Was a skill mastered?
- Was the mission completed?
- What should the learner do next?

Those decisions remain with Assessment, Mission, and Recommendation authorities.

---

## 2. Runtime Position

```text
Input Device / World System / UI / Network
                    ↓
        Gameplay Interaction Runtime
                    ↓
      Authorized Interaction Record
             ↙              ↘
Objective Runtime       Evidence Runtime
```

The interaction runtime is the semantic firewall between noisy world signals and downstream learning-sensitive consumers.

---

## 3. Core Principles

1. Raw input is not an interaction.
2. Proximity is not authorization.
3. Animation completion is not objective completion.
4. Client timestamps are evidence, not authority.
5. Duplicate delivery must not duplicate meaning.
6. Rejected input must never mutate objective progress.
7. Accessibility input must preserve semantic equivalence.
8. System-generated interactions must remain distinguishable from learner-generated interactions.
9. Collaborative actions must preserve individual contribution identity.
10. Interaction history is append-only.

---

## 4. Interaction Sources

Supported source classes:

```text
PLAYER_INPUT
ACCESSIBILITY_INPUT
WORLD_TRIGGER
PHYSICS_EVENT
UI_ACTION
SCRIPTED_SYSTEM
NETWORK_PEER
TEACHER_FACILITATION
MENTOR_FACILITATION
RECOVERY_REPLAY
ADMINISTRATIVE_REPAIR
```

Every accepted interaction must retain its source class.

A `SCRIPTED_SYSTEM` event may move world state, but it must not be represented as learner evidence unless an explicit policy allows that interpretation.

---

## 5. Interaction Types

Canonical interaction families include:

```text
MOVE
APPROACH
FOCUS
SELECT
PICK_UP
DROP
PLACE
ROTATE
BUILD
REPAIR
COMBINE
SEPARATE
ACTIVATE
DEACTIVATE
INSPECT
DISCOVER
COLLECT
CONSUME
ANSWER
EXPLAIN
COMPARE
SORT
MATCH
MEASURE
ESTIMATE
SIMULATE
CONFIRM
CANCEL
REQUEST_HINT
USE_HINT
REQUEST_HELP
COLLABORATE
SUBMIT
UNDO
REDO
```

Product modules may define additional typed interactions, but each type must declare:

- semantic name,
- source constraints,
- required payload,
- authorization policy,
- idempotency strategy,
- objective compatibility,
- evidence eligibility,
- privacy classification.

---

## 6. Canonical Interaction Record

```ts
interface GameplayInteractionRecord {
  interactionId: string;
  tenantId: string;
  learnerId: string;
  actorId: string;
  actorType: InteractionActorType;

  sessionId: string;
  sessionVersion: number;
  missionId?: string;
  missionVersion?: number;
  objectiveId?: string;
  objectiveVersion?: number;

  worldId: string;
  sceneId: string;
  runtimeInstanceId: string;
  deviceId?: string;

  interactionType: GameplayInteractionType;
  sourceClass: InteractionSourceClass;
  payload: unknown;

  clientSequence?: number;
  serverSequence: number;
  occurredAt?: string;
  receivedAt: string;
  acceptedAt?: string;

  idempotencyKey: string;
  correlationId: string;
  causationId?: string;

  authorizationDecision: InteractionAuthorizationDecision;
  processingDecision: InteractionProcessingDecision;
  evidenceEligibility: EvidenceEligibility;

  schemaVersion: string;
  policyVersion: string;
  integrityHash: string;
}
```

---

## 7. Intake Pipeline

```text
Receive Raw Signal
      ↓
Parse and Schema Validate
      ↓
Resolve Tenant / Learner / Actor
      ↓
Resolve Session and Runtime Instance
      ↓
Check Session State and Lease
      ↓
Check Objective Binding
      ↓
Authorize Interaction Type
      ↓
Deduplicate by Idempotency Key
      ↓
Assign Authoritative Sequence
      ↓
Normalize Payload
      ↓
Persist Interaction Decision
      ↓
Publish to Authorized Consumers
```

No objective consumer may observe a raw signal before the interaction decision is durably recorded.

---

## 8. Authorization

Authorization evaluates:

- tenant and learner scope,
- actor identity,
- active session state,
- current scene and world binding,
- objective availability,
- tool or inventory authority,
- interaction distance and line-of-sight policy,
- cooldown or rate limits,
- accessibility equivalence,
- collaboration role,
- runtime compatibility,
- safety restrictions.

Decision values:

```text
AUTHORIZED
AUTHORIZED_WITH_LIMITATIONS
DEFERRED
DENIED
QUARANTINED
```

Authorization failure is not learner failure.

---

## 9. Processing Decisions

```text
ACCEPTED
IGNORED_DUPLICATE
IGNORED_NON_SEMANTIC
DEFERRED_OUT_OF_ORDER
REJECTED_INVALID
REJECTED_UNAUTHORIZED
REJECTED_STALE_CONTEXT
QUARANTINED_INTEGRITY_FAILURE
```

Every non-accepted decision must be observable for diagnostics without being projected as learner-facing failure unless product policy explicitly requires it.

---

## 10. Ordering and Concurrency

Authoritative ordering is assigned per Gameplay Session.

Required fields:

```text
clientSequence       optional producer order
serverSequence       authoritative session order
correlationId        groups one user intent
causationId          points to prior causal interaction
```

Rules:

- No last-write-wins for semantic interactions.
- Gaps in client sequence are tolerated but recorded.
- Conflicting interactions are resolved by policy, not arrival time alone.
- Offline batches are merged deterministically.
- A stale objective version may cause defer, reject, or rebind; it may never silently update another objective version.

---

## 11. Idempotency

An interaction must be idempotent across retries, reconnects, and replay.

The idempotency boundary includes:

```text
tenantId
learnerId
sessionId
runtimeInstanceId
interactionType
idempotencyKey
```

A duplicate interaction returns the original processing decision and never creates duplicate objective progress or evidence.

---

## 12. Interaction Context

Context may include:

- selected tool,
- held object,
- target entity,
- world position,
- scene region,
- objective binding,
- active assistance level,
- collaboration group,
- input mode,
- accessibility mode,
- network state.

Context snapshots support interpretation but do not replace durable authority records from owning modules.

---

## 13. Assistance and Hints

Hint interactions must be explicit:

```text
REQUEST_HINT
HINT_OFFERED
HINT_VIEWED
HINT_APPLIED
HELP_REQUESTED
HELP_RECEIVED
```

Assistance metadata must accompany any downstream evidence candidate.

Accessibility adaptation is not automatically assistance. The system must distinguish accommodation from instructional help.

---

## 14. Collaboration

Collaborative interactions require:

- group session identity,
- individual actor identity,
- contribution type,
- shared-object identity,
- coordination context,
- contribution confidence.

A group interaction may update shared world state while producing zero, one, or many individual evidence candidates.

Group success must never be projected as identical individual performance.

---

## 15. World Mutation Boundary

An accepted interaction may request a world mutation.

```text
Accepted Interaction
        ↓
World Mutation Command
        ↓
World Runtime Decision
        ↓
World Mutation Result
        ↓
Interaction Outcome Record
```

The interaction runtime records intent and outcome but does not claim that visual success proves learning success.

---

## 16. Interaction Outcomes

```text
SUCCEEDED
PARTIALLY_SUCCEEDED
FAILED_RULE
FAILED_WORLD_STATE
FAILED_RESOURCE
FAILED_RUNTIME
CANCELLED
ROLLED_BACK
UNKNOWN
```

Operational failure must remain separate from academic or learner failure.

---

## 17. Evidence Eligibility

```text
ELIGIBLE
ELIGIBLE_WITH_LIMITATIONS
INELIGIBLE_SYSTEM_GENERATED
INELIGIBLE_EXCESSIVE_ASSISTANCE
INELIGIBLE_UNVERIFIED_ACTOR
INELIGIBLE_INTEGRITY_FAILURE
PENDING_REVIEW
```

Eligibility means only that the interaction may be considered by 29E. It does not mean the interaction is sufficient evidence.

---

## 18. Offline Operation

Offline clients may queue signed interaction envelopes.

On reconnect:

1. validate session continuity,
2. verify envelope integrity,
3. check runtime and schema compatibility,
4. deduplicate,
5. reconcile objective versions,
6. assign authoritative sequence,
7. persist decisions,
8. publish accepted interactions.

An expired session may allow historical intake for audit while refusing progress mutation.

---

## 19. Replay

Replay modes:

```text
HISTORICAL_INTERACTION_REPLAY
OBJECTIVE_DIAGNOSTIC_REPLAY
WORLD_MUTATION_REPLAY
RECOVERY_REPLAY
POLICY_SIMULATION
```

Historical replay reproduces the original decision under the original policy where possible. Policy simulation must never overwrite historical truth.

---

## 20. Failure Codes

```text
INTERACTION_SCHEMA_INVALID
INTERACTION_SCOPE_MISMATCH
INTERACTION_ACTOR_UNVERIFIED
INTERACTION_SESSION_NOT_ACTIVE
INTERACTION_SESSION_LEASE_LOST
INTERACTION_OBJECTIVE_NOT_BOUND
INTERACTION_OBJECTIVE_STALE
INTERACTION_TYPE_NOT_ALLOWED
INTERACTION_DUPLICATE
INTERACTION_OUT_OF_ORDER
INTERACTION_WORLD_CONTEXT_STALE
INTERACTION_RATE_LIMITED
INTERACTION_INTEGRITY_FAILED
INTERACTION_RUNTIME_INCOMPATIBLE
INTERACTION_QUARANTINED
```

---

## 21. Required Invariants

1. Every accepted interaction belongs to exactly one tenant, learner, and session.
2. Every accepted interaction has one authoritative sequence.
3. Duplicate delivery cannot duplicate meaning.
4. Unauthorized interactions cannot mutate objective progress.
5. System-generated interaction cannot masquerade as learner action.
6. Operational failure cannot be reclassified as learner misunderstanding.
7. Accessibility input preserves semantic equivalence.
8. Collaboration preserves individual contribution identity.
9. Evidence eligibility never equals mastery.
10. Interaction history remains append-only.

---

## 22. Verification Scenarios

Minimum automated verification must cover:

- cross-tenant and cross-learner rejection,
- inactive-session rejection,
- stale objective handling,
- duplicate retry idempotency,
- offline ordering,
- collaboration attribution,
- assistance metadata propagation,
- accessibility equivalence,
- system-generated evidence exclusion,
- operational failure separation,
- replay determinism,
- quarantine on integrity failure.

---

## 23. Completion Condition

29D is architecturally complete when a gameplay implementation can accept noisy runtime signals and emit durable, authorized, ordered interaction records without granting the gameplay layer authority over learning, mission, or mastery truth.
