# 23G — Mission & Progression Runtime

## Status

- Chapter: 23 — Game Runtime & World Architecture
- Slice: 23G
- Authority: Architecture documentation
- Scope: Mission identity, objective evaluation, progression authority, rewards, unlocks, recovery, and runtime invariants

## 1. Purpose

The Mission & Progression Runtime defines how the world recognizes meaningful player progress without turning missions into scene scripts or UI checklists.

A mission is a governed runtime contract between:

- a world state,
- a player or party,
- one or more observable objectives,
- completion policy,
- progression consequences,
- and evidence that can be verified independently from presentation.

## 2. Core Principle

> Progress is earned from authoritative world evidence; UI, animation, dialogue, and scene flow may explain progress but must not create it.

Mission state is not owned by:

- a quest panel,
- a dialogue box,
- a scene-local boolean,
- a progress bar,
- or a one-time animation callback.

## 3. Runtime Position

```text
World Runtime
  → Domain Events
    → Mission Evaluation
      → Objective State
        → Mission Transition
          → Progression Consequence
            → Projection
```

Mission evaluation consumes world meaning. It must not infer completion from pixels, sprite presence, or UI state.

## 4. Mission Identity

```ts
interface MissionIdentity {
  missionId: string;
  missionType: string;
  worldId: string;
  ownerId: string;
  instanceId: string;
}
```

Rules:

- `missionId` identifies the authored mission definition.
- `instanceId` identifies one runtime execution.
- `ownerId` identifies the player, party, class, or account scope.
- Mission identity must survive scene reloads and reconnection.

## 5. Mission Definition and Runtime Instance

Definitions are authored policy. Instances are mutable runtime state.

```ts
interface MissionDefinition {
  missionId: string;
  version: number;
  objectives: ObjectiveDefinition[];
  prerequisites: ProgressionRequirement[];
  completionPolicy: CompletionPolicy;
  rewards: RewardDefinition[];
  failurePolicy?: FailurePolicy;
}

interface MissionInstance {
  identity: MissionIdentity;
  definitionVersion: number;
  lifecycle: MissionLifecycleState;
  objectiveStates: ObjectiveState[];
  revision: number;
  startedAt?: string;
  completedAt?: string;
}
```

A runtime instance must record the definition version used to create it.

## 6. Mission Lifecycle

```text
LOCKED
  → AVAILABLE
    → ACTIVE
      → COMPLETION_PENDING
        → COMPLETED

ACTIVE
  → SUSPENDED
  → FAILED
  → CANCELLED
```

Transitions must be explicit and validated.

`COMPLETION_PENDING` exists so rewards and progression consequences can be committed atomically before the mission is projected as complete.

## 7. Objective Model

Objectives are semantic predicates over authoritative evidence.

Examples:

- collect a resource,
- place a valid structure,
- repair an object,
- reach a location,
- discover a relationship,
- demonstrate a mathematical strategy,
- help another player,
- complete a sequence under constraints.

```ts
interface ObjectiveState {
  objectiveId: string;
  status: 'PENDING' | 'ACTIVE' | 'SATISFIED' | 'REVOKED';
  progress: number;
  target: number;
  evidenceRefs: string[];
  revision: number;
}
```

## 8. Evidence-Driven Evaluation

Mission progress should normally be driven by domain events.

```text
World Command
  → World Mutation
    → Domain Event
      → Mission Evaluator
        → Objective Mutation
```

Examples:

- `ResourcePickedUp`
- `EntityPlaced`
- `StructureCompleted`
- `AreaEntered`
- `PatternDiscovered`
- `MeasurementVerified`

The event must describe semantic facts, not rendering details.

## 9. Idempotent Evaluation

Every evidence item must be safe to evaluate more than once.

```ts
interface MissionEvidence {
  evidenceId: string;
  eventType: string;
  aggregateId: string;
  aggregateRevision: number;
  occurredAt: string;
}
```

The runtime must prevent duplicate progress from replayed events, retries, reconnection, or recovery.

## 10. Objective Composition

Supported composition policies may include:

- all objectives required,
- any objective sufficient,
- ordered sequence,
- threshold completion,
- optional bonus objectives,
- mutually exclusive branches.

Composition must be declared in policy. UI order must not become hidden completion logic.

## 11. Progression Authority

Progression represents durable capability or access changes.

Examples:

- unlock a location,
- unlock a tool family,
- unlock a construction pattern,
- unlock a discovery path,
- increase mastery eligibility,
- expose a new mission chain.

Progression is not the same as mission UI visibility.

```ts
interface ProgressionRecord {
  progressionId: string;
  ownerId: string;
  state: 'LOCKED' | 'AVAILABLE' | 'UNLOCKED' | 'MASTERED';
  sourceRefs: string[];
  revision: number;
}
```

## 12. Prerequisites

Prerequisites must be evaluated from authoritative records.

They may depend on:

- prior mission completion,
- world state,
- inventory capability,
- discovery evidence,
- mastery threshold,
- mentor or teacher approval where product policy requires it.

Prerequisites should return structured reasons when unmet.

## 13. Rewards

Rewards may include:

- resources,
- tools,
- permissions,
- world changes,
- progression unlocks,
- cosmetic projections,
- learning evidence.

Mission completion and reward application must be atomic or recoverable as one transaction boundary.

```text
Completion Validated
  → Reward Reservation
  → Progression Mutation
  → Reward Commit
  → Mission COMPLETED
```

## 14. Branching and Choice

Player choices may create mutually exclusive paths.

The runtime must preserve:

- chosen branch,
- rejected alternatives,
- decision evidence,
- consequences,
- replay-safe identity.

Branch selection must never be inferred from which dialogue button remains visible.

## 15. Repeatable Missions

Repeatability must be explicit.

```ts
interface RepeatPolicy {
  mode: 'ONCE' | 'DAILY' | 'SESSION' | 'UNLIMITED' | 'CONDITIONED';
  cooldownMs?: number;
  maxCompletions?: number;
}
```

Each repetition receives a distinct mission instance identity.

## 16. Failure, Revocation, and Recovery

A mission may fail because:

- a time window expires,
- a protected entity is lost,
- a branch becomes impossible,
- required evidence is revoked,
- or a product rule explicitly declares failure.

Failure must not be used as a generic response to transient infrastructure errors.

Uncertain persistence should move the mission into recovery, not silently re-award or discard progress.

## 17. Mission Projection

The UI may project:

- available missions,
- active objectives,
- progress,
- hints,
- completion feedback,
- blocked reasons.

Projection must derive from mission runtime state.

The UI must not directly mutate objective progress.

## 18. Discovery and Learning Boundary

Mission Runtime may request or consume discovery and learning evidence, but it must not define mathematical truth itself.

```text
World Experience
  → Discovery Evidence
    → Learning Interpretation
      → Mission/Progression Consequence
```

Mission completion may depend on evidence emitted by future Discovery or Learning Engines, while those engines remain independent authorities for their own meaning.

## 19. Multiplayer and Shared Missions

Shared missions require explicit contribution policy.

Possible models:

- any member contribution counts,
- contribution is individually tracked,
- all members must satisfy a condition,
- role-specific objectives,
- leader-authorized completion.

Ownership and reward distribution must be deterministic.

## 20. Observability

Mission transitions should emit structured records containing:

- mission instance identity,
- previous and next state,
- triggering evidence,
- objective changes,
- reward transaction reference,
- progression changes,
- correlation ID.

## 21. Runtime Invariants

1. UI state never creates mission progress.
2. Objective progress is based on authoritative evidence.
3. The same evidence cannot award progress twice.
4. Mission completion and rewards cannot diverge silently.
5. Definition version is preserved on every mission instance.
6. Progression unlocks have traceable sources.
7. Scene reload does not reset durable mission state.
8. Branch choices are explicit and replay-safe.
9. Failure policy is distinct from infrastructure recovery.
10. Mission Runtime does not become the authority for mathematical truth.

## 22. Verification Targets

Verification must cover:

- lifecycle transition legality,
- duplicate evidence handling,
- objective composition,
- prerequisite refusal reasons,
- reward atomicity,
- branch persistence,
- repeat policy,
- reconnection and replay,
- shared mission contribution,
- projection consistency.

## 23. Architectural Outcome

This slice establishes missions as evidence-driven runtime contracts and progression as durable, traceable world capability change.

It prevents scene scripts, dialogue callbacks, and UI widgets from becoming hidden authorities over player progress.