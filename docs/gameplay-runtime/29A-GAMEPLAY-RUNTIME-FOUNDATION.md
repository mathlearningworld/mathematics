# Chapter 29A — Gameplay Runtime Foundation

Status: Architecture Definition
Chapter: 29 — Gameplay Runtime
Slice: 29A

## 1. Purpose

Gameplay Runtime is the authoritative execution boundary for learner activity that occurs inside an interactive world, scene, challenge, simulation, or game session.

It converts real player interaction into durable operational facts without claiming learning mastery, readiness, or recommendation success.

The runtime exists to answer:

- what gameplay session is active;
- which mission and objectives the session is allowed to serve;
- what interactions occurred;
- which events are accepted as evidence candidates;
- what gameplay state can be resumed;
- what facts may be handed to Mission and Assessment;
- what must be rejected, held, quarantined, or replayed.

## 2. Architectural Position

```text
World / Scene
    ↓
Gameplay Runtime
    ↓
Gameplay Evidence Envelope
    ↓
Mission Progress Runtime
    ↓
Assessment Engine
    ↓
Recommendation Engine
```

Gameplay Runtime consumes authorized context from Mission Engine but does not replace Mission authority.

## 3. Core Boundary

Gameplay Runtime owns:

- gameplay session identity;
- scene and world binding;
- player interaction intake;
- objective execution context;
- event ordering;
- resumable gameplay state;
- evidence candidate production;
- gameplay completion facts;
- gameplay projections;
- gameplay history and replay.

Gameplay Runtime does not own:

- curriculum truth;
- learning content authority;
- mastery decisions;
- misconception claims;
- recommendation generation;
- mission activation authority;
- reward economy authority;
- parent or teacher policy.

## 4. Foundational Doctrine

```text
Gameplay activity ≠ learning mastery
Gameplay completion ≠ mission completion
Mission completion ≠ assessment confirmation
Score ≠ understanding
Time spent ≠ progress quality
Interaction count ≠ competence
```

Gameplay Runtime records operational truth only.

## 5. Runtime Aggregate

Primary aggregate:

```text
GameplaySession
```

Required identity:

- tenantId;
- learnerId;
- gameplaySessionId;
- missionId when mission-bound;
- missionVersion;
- sceneId;
- worldId;
- runtimeVersion;
- policyVersion;
- createdAt;
- sourceDeviceId where available.

## 6. Session Categories

Gameplay sessions may be:

- MISSION_BOUND;
- PRACTICE_BOUND;
- LEARNING_BOUND;
- DISCOVERY_BOUND;
- SANDBOX;
- DIAGNOSTIC;
- TUTOR_GUIDED;
- TEACHER_GUIDED.

A session category must be explicit. Sandbox activity must never be silently promoted into mission evidence.

## 7. Authoritative Inputs

Gameplay Runtime may consume:

- verified learner identity;
- active mission snapshot;
- authorized objective bindings;
- scene manifest;
- interaction contract;
- evidence policy;
- device and runtime metadata;
- accessibility configuration;
- approved assist configuration.

Every external input must include source provenance and version information.

## 8. Command Families

Foundation command families:

- OpenGameplaySession;
- ResumeGameplaySession;
- PauseGameplaySession;
- RecordGameplayInteraction;
- RecordObjectiveSignal;
- RecordAssistUsage;
- RecordRuntimeFault;
- RequestGameplayCompletion;
- CloseGameplaySession;
- AbandonGameplaySession.

Commands must be tenant-safe, learner-safe, idempotent, and version-checked.

## 9. Event Families

Foundation event families:

- GameplaySessionOpened;
- GameplaySessionResumed;
- GameplaySessionPaused;
- GameplayInteractionAccepted;
- GameplayInteractionRejected;
- ObjectiveSignalRecorded;
- AssistUsageRecorded;
- GameplayRuntimeFaultRecorded;
- GameplayCompletionRequested;
- GameplaySessionCompleted;
- GameplaySessionClosed;
- GameplaySessionAbandoned;
- GameplayEvidencePrepared;
- GameplayEvidencePublished.

## 10. Source Provenance

Every accepted interaction must preserve:

- eventId;
- sourceType;
- sourceRuntime;
- sourceRuntimeVersion;
- sourceDeviceId;
- sourceSequence;
- sourceTimestamp;
- receivedAt;
- recordedAt;
- correlationId;
- causationId;
- payloadHash.

Events lacking sufficient provenance cannot become strong evidence.

## 11. Ordering Model

Gameplay Runtime must distinguish:

- source order;
- receive order;
- durable record order;
- effective gameplay order.

Offline and delayed events must not be interpreted using receive time alone.

Conflicting order must produce an explicit resolution outcome rather than last-write-wins behavior.

## 12. Runtime States

Initial session states:

```text
CREATED
→ OPEN
→ ACTIVE
→ PAUSED
→ ACTIVE
→ COMPLETION_PENDING
→ COMPLETED
→ CLOSED
```

Exceptional states:

```text
BLOCKED
FAULTED
ABANDONED
EXPIRED
QUARANTINED
```

Terminal states may not be silently reopened.

## 13. Evidence Strength

Gameplay evidence candidates may be classified as:

- OBSERVATIONAL;
- INTERACTION_CONFIRMED;
- OUTCOME_CONFIRMED;
- INDEPENDENT_OUTCOME;
- ASSISTED_OUTCOME;
- HUMAN_VERIFIED;
- SYSTEM_VERIFIED.

Evidence strength is descriptive. Gameplay Runtime may not translate evidence strength directly into mastery.

## 14. Assistance Boundary

The runtime must record assistance such as:

- hint shown;
- hint level;
- solution preview;
- retry guidance;
- teacher intervention;
- parent intervention;
- automated correction;
- accessibility accommodation.

Accessibility accommodation must not automatically be treated as learning assistance.

## 15. Failure Model

Typed foundation failures include:

- GAMEPLAY_SESSION_NOT_FOUND;
- GAMEPLAY_SESSION_ALREADY_OPEN;
- GAMEPLAY_SESSION_TERMINAL;
- MISSION_BINDING_INVALID;
- OBJECTIVE_BINDING_INVALID;
- SCENE_BINDING_INVALID;
- RUNTIME_VERSION_UNSUPPORTED;
- POLICY_VERSION_UNAVAILABLE;
- EVENT_DUPLICATE;
- EVENT_OUT_OF_ORDER;
- EVENT_PROVENANCE_INVALID;
- ACTOR_UNAUTHORIZED;
- CROSS_TENANT_SCOPE;
- CROSS_LEARNER_SCOPE;
- OPTIMISTIC_CONCURRENCY_CONFLICT.

## 16. Persistence Doctrine

Gameplay history is append-only.

Corrections occur through compensating events. Previously accepted interaction facts are never silently rewritten.

Snapshots may accelerate loading but are not the source of truth.

## 17. Security and Privacy

Gameplay data must be scoped by tenant and learner.

Sensitive telemetry must be minimized. Raw input streams, voice, camera, location, or biometric data require explicit product policy and consent before collection.

## 18. Determinism

Given the same:

- authorized inputs;
- interaction event stream;
- policy versions;
- runtime versions;
- ordering decisions;

Gameplay replay must produce the same operational result or declare divergence.

## 19. Integration Contracts

Mission Engine receives:

- objective-relevant operational facts;
- progress candidate signals;
- gameplay completion facts;
- blocker and fault facts.

Assessment Engine receives:

- evidence envelopes;
- assistance context;
- timing and attempt context;
- outcome facts;
- provenance and verification metadata.

Neither consumer may assume more meaning than the gameplay evidence actually contains.

## 20. Foundation Invariants

1. No gameplay event crosses tenant or learner boundaries.
2. A session cannot bind to an unauthorized mission version.
3. A sandbox session cannot silently become mission evidence.
4. Duplicate events do not duplicate progress.
5. Assistance context is never discarded.
6. Gameplay completion does not assert mission completion.
7. Gameplay success does not assert mastery.
8. Terminal sessions are immutable except through explicit correction records.
9. Projection state is never the source of truth.
10. Replay divergence is recorded, not hidden.

## 21. Acceptance Gate

29A is architecturally complete when implementation can prove:

- explicit gameplay aggregate ownership;
- tenant and learner isolation;
- mission and scene binding validation;
- idempotent command handling;
- event provenance preservation;
- ordered and offline-safe event intake;
- assistance recording;
- append-only history;
- typed failures;
- strict separation between gameplay facts and learning claims.
