# 23D — Interaction & Intent Runtime

## Status

- Chapter: 23 — Game Runtime & World Architecture
- Slice: 23D
- Authority: Architecture documentation
- Scope: Player intent, focus, targeting, interaction resolution, execution, feedback, recovery, and invariants

## 1. Purpose

The Interaction Runtime defines how player input becomes meaningful action inside the world.

It governs the path from raw input to world mutation without allowing scene code, UI widgets, physics callbacks, or individual tools to invent their own interaction meaning.

Examples include:

- approaching a resource and selecting the correct pickup tool,
- focusing a placed block,
- converting an occupied placement candidate into pickup intent,
- placing the currently selected resource,
- consuming an item,
- activating a mission object,
- speaking with an NPC,
- cancelling or recovering an interrupted action.

## 2. Core Principle

> Input expresses possibility; intent expresses player meaning; interaction policy decides what the world may do.

Raw input is not authority.

A pointer click, key press, collision overlap, or proximity event must never mutate the world directly.

## 3. Runtime Position

```text
Input Adapter
    ↓
Intent Interpreter
    ↓
Focus & Target Resolver
    ↓
Interaction Policy
    ↓
Command Execution
    ↓
World Mutation
    ↓
Projection & Feedback
```

Each stage has a distinct responsibility.

## 4. Input Boundary

The input boundary normalizes device-specific signals into semantic input events.

```ts
interface SemanticInputEvent {
  source: 'keyboard' | 'pointer' | 'touch' | 'gamepad' | 'assistive';
  action: string;
  phase: 'started' | 'continued' | 'completed' | 'cancelled';
  worldPoint?: WorldPoint;
  screenPoint?: ScreenPoint;
  occurredAt: number;
}
```

Examples of semantic actions:

- `MOVE`
- `PRIMARY_INTERACT`
- `SECONDARY_INTERACT`
- `CONFIRM_PLACEMENT`
- `CANCEL`
- `SELECT_SLOT`

Device-specific details end at this boundary.

## 5. Intent Model

Intent represents what the runtime believes the player is trying to accomplish.

```ts
interface PlayerIntent {
  intentId: string;
  actorEntityId: string;
  kind: InteractionIntentKind;
  source: IntentSource;
  targetEntityId?: string;
  targetPoint?: WorldPoint;
  inventoryRef?: InventoryReference;
  confidence: number;
  createdAt: number;
}
```

Suggested intent kinds:

```ts
type InteractionIntentKind =
  | 'MOVE'
  | 'INSPECT'
  | 'PICKUP'
  | 'PLACE'
  | 'USE_TOOL'
  | 'CONSUME'
  | 'ACTIVATE'
  | 'TALK'
  | 'DROP'
  | 'CANCEL';
```

## 6. Explicit and Inferred Intent

Intent may be explicit or inferred.

### Explicit intent

The player directly selects a tool, slot, target, or action.

Explicit intent has priority unless it is invalid, expired, or overridden by a safety rule.

### Inferred intent

The runtime derives likely intent from:

- proximity,
- facing,
- current focus,
- selected inventory item,
- current tool,
- recent successful action,
- occupancy at the candidate placement point,
- mission context,
- interaction history.

Inferred intent must be reversible and must not silently perform destructive actions.

## 7. Intent Precedence

Default precedence:

```text
Safety refusal
    > explicit cancel
    > explicit player selection
    > active committed action
    > stable focused target
    > contextual inferred intent
    > previous useful selection
    > neutral fallback
```

This ordering prevents automation from fighting the player.

## 8. Interaction Context

Every resolution cycle receives one immutable interaction context.

```ts
interface InteractionContext {
  actor: RuntimeEntitySnapshot;
  focusedEntity?: RuntimeEntitySnapshot;
  nearbyCandidates: InteractionCandidate[];
  selectedSlot?: InventorySlotSnapshot;
  activeTool?: ToolSnapshot;
  placementCandidate?: PlacementCandidate;
  worldRevision: number;
  now: number;
}
```

All decisions in one cycle must derive from the same context revision.

## 9. Candidate Discovery

Candidate discovery identifies entities or points that could participate in interaction.

Discovery may use:

- collision adjacency,
- interaction footprints,
- facing cones,
- line-of-sight,
- grid adjacency,
- reach policy,
- entity capabilities,
- mission constraints.

Discovery does not choose the winner and does not mutate focus.

## 10. Candidate Shape

```ts
interface InteractionCandidate {
  entityId: string;
  capabilities: ReadonlySet<string>;
  distance: number;
  directionalAlignment: number;
  overlapDepth?: number;
  priorityClass: string;
  eligible: boolean;
  refusalReason?: string;
}
```

A candidate with missing eligibility evidence must not be treated as valid.

## 11. Deterministic Target Resolution

Target resolution must be deterministic for the same world state and actor state.

A recommended ordering is:

1. valid currently locked target,
2. valid explicit target,
3. nearest eligible candidate in the active interaction direction,
4. highest semantic priority,
5. stable entity identifier as final tie-breaker.

The resolver must not depend on scene child order, array insertion order, frame timing, or unstable floating-point equality.

## 12. Focus Runtime

Focus is the runtime's current best interaction target.

```ts
interface InteractionFocus {
  entityId: string;
  acquiredAt: number;
  source: 'explicit' | 'proximity' | 'direction' | 'placement-occupancy';
  confidence: number;
  worldRevision: number;
}
```

Focus is not selection authority and is not action execution.

## 13. Focus Stability

Focus must resist accidental oscillation.

A focus change requires one of:

- current focus becomes invalid,
- a materially better candidate appears,
- the player explicitly targets another entity,
- a committed action completes or cancels,
- the actor leaves the valid interaction region,
- world revision invalidates the focused entity.

Small distance changes must not cause rapid switching between adjacent candidates.

## 14. Focus Hysteresis

Recommended policy:

```text
Acquire threshold < Release threshold
```

The runtime may acquire a target when the actor enters a close boundary but retain it until the actor crosses a slightly wider release boundary.

This prevents flicker at geometric edges.

## 15. Automatic Tool and Slot Selection

Automation may select a useful tool or resource slot when context is unambiguous.

Examples:

- approaching a pickup-capable object selects the relevant pickup tool,
- successfully picking up a resource selects that resource for placement,
- leaving pickup range returns to the last still-useful placement item,
- approaching a new interactable temporarily overrides placement selection.

The selection system must preserve:

```ts
interface SelectionMemory {
  explicitSelection?: SelectionRef;
  contextualSelection?: SelectionRef;
  lastUsefulPlacementSelection?: SelectionRef;
  lastSuccessfulInteraction?: InteractionIntentKind;
}
```

## 16. Automation Policy

Automatic selection is permitted only when:

- it is reversible,
- it does not consume or destroy resources,
- it does not override a fresh explicit player choice,
- it improves immediate action readiness,
- the reason can be explained by current context.

Automation must return control to the player when ambiguity increases.

## 17. Occupied Placement Conversion

When the active placement candidate is occupied by a pickup-capable placed entity, the runtime may reinterpret the situation.

```text
PLACE intent
    + occupied valid candidate
    + occupant is pickup eligible
    + actor is within pickup policy
        ↓
PICKUP focus suggestion
```

This is an intent reinterpretation, not an immediate pickup command.

The player still confirms the action unless product policy explicitly permits safe automatic execution.

## 18. Interaction Policy

Interaction policy answers:

- Is the actor allowed to perform this intent?
- Is the target valid?
- Is the actor within range?
- Is the required tool or resource available?
- Is the world state compatible?
- Would the operation violate another committed action?
- Is confirmation required?

```ts
interface InteractionDecision {
  allowed: boolean;
  resolvedIntent: PlayerIntent;
  command?: WorldCommand;
  refusal?: InteractionRefusal;
  feedback?: InteractionFeedback;
}
```

## 19. Refusal Model

Refusal is a first-class outcome.

```ts
interface InteractionRefusal {
  code: string;
  category: 'range' | 'state' | 'authority' | 'resource' | 'conflict' | 'safety';
  recoverable: boolean;
  playerMessageKey?: string;
}
```

Refusal must not be represented only by console logs or silent no-op behavior.

## 20. Command Creation

A permitted interaction becomes a command with expected state.

```ts
interface InteractionCommand {
  commandId: string;
  intentId: string;
  actorEntityId: string;
  targetEntityId?: string;
  expectedWorldRevision: number;
  expectedEntityRevision?: number;
  payload: unknown;
  issuedAt: number;
}
```

Expected revisions protect against stale focus and changed occupancy.

## 21. Commit Boundary

An interaction is committed only after the authoritative world runtime accepts its command.

Visual preview, animation start, sound, vibration, or optimistic UI do not prove commitment.

## 22. Interaction Lifecycle

```text
DISCOVERED
    ↓
FOCUSED
    ↓
INTENDED
    ↓
VALIDATING
    ├── REFUSED
    └── ACCEPTED
            ↓
        EXECUTING
            ├── CANCELLED
            ├── FAILED
            └── COMMITTED
                    ↓
                PROJECTED
```

Each transition must be observable in runtime diagnostics.

## 23. Single-Action Concurrency

The actor may have at most one exclusive committed interaction unless an interaction explicitly declares concurrency compatibility.

Examples of exclusive actions:

- pickup transfer,
- placement mutation,
- resource consumption,
- dialogue commitment.

Movement and non-authoritative preview may continue when policy allows.

## 24. Cancellation

Cancellation must distinguish:

- cancelling before commitment,
- interrupting an executing action,
- compensating after partial external completion.

A committed durable mutation cannot be undone merely by hiding its animation.

## 25. Interaction Feedback

Feedback is derived from decision and execution state.

Possible feedback:

- focus highlight,
- ghost validity,
- tool readiness,
- range indication,
- refusal reason,
- progress indicator,
- confirmed success,
- recovery warning.

Feedback must not become a parallel source of interaction truth.

## 26. Projection Contract

Scene and UI projections consume runtime interaction state.

```ts
interface InteractionProjection {
  focusedEntityId?: string;
  suggestedIntent?: InteractionIntentKind;
  selectedAction?: string;
  status: 'idle' | 'ready' | 'validating' | 'executing' | 'refused' | 'recovering';
  feedbackKey?: string;
}
```

Projection code must not independently resolve candidates.

## 27. Prediction and Confirmation

Safe interactions may project predicted feedback before authoritative confirmation.

Prediction rules:

- predictions are visually distinguishable when needed,
- predicted state cannot become persistence evidence,
- rejection restores or recomputes selection and focus,
- confirmation reconciles against authoritative revisions.

## 28. Recovery

On interruption, reload, or uncertain completion, the runtime must recover from durable world state and command evidence.

Recovery procedure:

1. suspend new conflicting interactions,
2. reload authoritative entity and inventory revisions,
3. determine whether the command committed,
4. rebuild focus and selection from current context,
5. clear invalid transient locks,
6. resume only when invariants hold.

## 29. Learning Boundary

The Interaction Runtime may emit evidence that an action occurred.

Examples:

- object compared,
- quantity placed,
- tool chosen,
- structure modified,
- repeated strategy attempted.

It must not decide mathematical mastery.

Learning systems consume interaction evidence but do not redefine world interaction rules.

## 30. Diagnostics

Minimum diagnostics include:

- semantic input action,
- inferred intent,
- candidate set summary,
- focus transition,
- policy decision,
- command identifier,
- expected revisions,
- execution result,
- refusal or recovery reason.

Diagnostics must support replaying the reasoning path without requiring private UI state.

## 31. Failure Modes

The architecture explicitly prevents:

- direct mutation from input callbacks,
- focus flicker between nearby objects,
- stale target execution,
- tool automation overriding explicit choice,
- pickup and placement using incompatible target geometry,
- scene projection becoming target authority,
- silent refusal,
- duplicate action commitment,
- predicted feedback being mistaken for durable success.

## 32. Runtime Invariants

1. Every committed interaction originates from a validated intent.
2. Raw input never mutates canonical world state directly.
3. Target resolution is deterministic for the same runtime snapshot.
4. Focus references an existing eligible entity or is empty.
5. Automatic selection never performs an irreversible action by itself.
6. Explicit player selection outranks contextual automation unless invalid or unsafe.
7. Placement preview and placement command share one candidate authority.
8. Pickup eligibility uses the declared pickup geometry and range policy.
9. At most one exclusive committed interaction exists per actor.
10. Refused interactions produce structured refusal evidence.
11. Projection state cannot prove command commitment.
12. Recovery rebuilds focus and selection from authoritative world state.

## 33. Verification Expectations

Verification should cover:

- deterministic candidate ordering,
- focus acquisition and release thresholds,
- focus stability with two nearby entities,
- explicit selection versus automatic override,
- pickup-to-placement selection memory,
- occupied placement conversion,
- stale revision rejection,
- duplicate command protection,
- cancellation before and after commitment,
- interaction recovery after reload.

## 34. Relationship to Other Slices

- 23A defines world lifecycle and authority.
- 23B defines spatial and interaction geometry.
- 23C defines entities, capabilities, and revisions.
- 23E governs construction mutations requested through interaction commands.
- 23F governs inventory and resource transfers.
- 23I governs durable command recovery and replay.
- 23J verifies cross-system interaction invariants.

## 35. Completion Statement

23D establishes one governed path from player input to meaningful world action.

The world now has a defined interaction language in which focus, intent, automation, validation, execution, and feedback remain coordinated without collapsing into scene-specific behavior.