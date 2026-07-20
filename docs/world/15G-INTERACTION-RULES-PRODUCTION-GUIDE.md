# 15G — Interaction Rules Production Guide

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 15 — NPC & Population System  
**Guide:** 15G — Interaction Rules  
**Status:** Production Ready  
**Authority Level:** World Foundation Contract  
**Upstream Dependencies:** 15A, 15B, 15C, 15D, 15E, 15F  
**Downstream Handoff:** 15H — Reputation System

---

## 1. Purpose

This guide defines the authoritative interaction model for Builder's Valley.

The interaction system turns world state into permitted, observable, interruptible, and auditable actions.

It governs how:

- players interact with NPCs,
- players interact with world objects,
- NPCs interact with players,
- NPCs interact with other NPCs,
- NPCs interact with tools, workstations, buildings, resources, and merchants,
- schedules, roles, professions, conversations, economy, education, and later reputation affect action eligibility,
- simultaneous interaction requests are ordered,
- ownership and locks prevent contradictory world state,
- failures are projected to UI without corrupting runtime authority,
- save/load restores interaction state deterministically.

The system must preserve the principle:

> No visible interaction may exist without an authoritative world-state transition, and no authoritative transition may occur without observable evidence.

---

## 2. Scope

This guide covers:

- interaction authority,
- actor and target identity,
- interaction definitions,
- eligibility and preconditions,
- proximity and reachability,
- line-of-sight where required,
- consent and social boundaries,
- ownership and access rights,
- tool requirements,
- inventory requirements,
- profession and skill requirements,
- schedule and role constraints,
- interaction initiation,
- reservation and locking,
- execution,
- progress,
- interruption,
- cancellation,
- completion,
- failure,
- cooldown,
- retry,
- queueing,
- concurrency,
- player-to-NPC interactions,
- player-to-object interactions,
- NPC-to-player interactions,
- NPC-to-NPC interactions,
- NPC-to-object interactions,
- merchant interactions,
- production interactions,
- crafting interactions,
- education interactions,
- construction interactions,
- gathering interactions,
- transport and carrying interactions,
- rest and recovery interactions,
- conversation integration,
- economy integration,
- schedule integration,
- runtime state,
- persistence,
- save/load,
- telemetry,
- validation,
- evidence,
- production exit criteria.

This guide does not define:

- reputation scoring itself,
- event participation policy,
- final population-wide validation,
- combat systems,
- unrestricted physics simulation,
- arbitrary user-authored scripting.

Those concerns belong to later guides or separate systems.

---

## 3. Interaction Doctrine

Builder's Valley interactions follow these doctrines.

### 3.1 Authority before animation

Animation, sound, particles, prompts, and UI are projections.

The authoritative interaction record determines whether the action exists.

### 3.2 Eligibility before reservation

An actor must pass deterministic eligibility checks before reserving a target.

### 3.3 Reservation before mutation

A target that can be contested must be reserved before world state changes.

### 3.4 One owner per mutable interaction

Exactly one runtime authority owns an active interaction instance.

### 3.5 Explicit terminal outcomes

Every started interaction must end as:

- completed,
- cancelled,
- interrupted,
- failed,
- expired.

### 3.6 Evidence over implication

Completion is proved by state transition and evidence, not by animation ending.

### 3.7 Context over global permission

Permission depends on actor, target, location, time, role, profession, relationship, inventory, and world state.

### 3.8 Safe refusal

Invalid actions fail without partial mutation.

### 3.9 Deterministic recovery

After save/load or runtime restart, the system must resolve incomplete interactions predictably.

### 3.10 Learning remains real

Educational interactions must preserve actual mathematical meaning and cannot be bypassed by decorative actions.

---

## 4. Core Terminology

### Actor

An entity capable of requesting or executing an interaction.

Examples:

- player avatar,
- NPC,
- service agent,
- authorized world process.

### Target

The entity or location receiving the interaction.

Examples:

- NPC,
- item,
- workstation,
- building,
- resource node,
- merchant stall,
- learning object,
- ground placement cell.

### Interaction Definition

A stable contract describing what an interaction means.

### Interaction Request

A runtime proposal by an actor to execute a definition against a target.

### Interaction Instance

The authoritative lifecycle record created after request acceptance.

### Reservation

Temporary exclusive or shared claim over required resources.

### Lock

Runtime enforcement preventing incompatible mutation.

### Effect

An authoritative state change produced by successful completion.

### Projection

Visual, audio, UI, and animation representation of interaction state.

### Evidence

Persisted or observable proof that an interaction reached an outcome.

---

## 5. Interaction Identity

Every interaction instance must include:

```ts
interface InteractionIdentity {
  interactionId: string;
  definitionId: string;
  definitionVersion: number;
  worldId: string;
  zoneId: string;
  actorType: 'PLAYER' | 'NPC' | 'SYSTEM';
  actorId: string;
  targetType: string;
  targetId: string;
  correlationId: string;
  causationId?: string;
  requestedAt: string;
}
```

Rules:

- `interactionId` is globally unique.
- `definitionId` is stable across save files.
- `definitionVersion` prevents silent semantic drift.
- actor and target identity cannot change after acceptance.
- zone identity must match authoritative target location at reservation time.
- retries use a new interaction ID unless the command is explicitly idempotent.
- `correlationId` groups related action chains.
- `causationId` links derived interactions to their initiating event.

---

## 6. Interaction Definition Contract

```ts
interface InteractionDefinition {
  id: string;
  version: number;
  category: InteractionCategory;
  actorKinds: string[];
  targetKinds: string[];
  durationModel: DurationModel;
  reservationPolicy: ReservationPolicy;
  interruptionPolicy: InterruptionPolicy;
  retryPolicy: RetryPolicy;
  eligibilityRules: EligibilityRule[];
  requiredCapabilities: string[];
  requiredTools: ToolRequirement[];
  requiredItems: ItemRequirement[];
  effects: InteractionEffect[];
  evidenceRequirements: EvidenceRequirement[];
  projectionKey: string;
}
```

Definitions are immutable after release.

Behavior changes require a version increment.

A save file may reference older versions; migration must be explicit.

---

## 7. Interaction Categories

Authoritative categories are:

```ts
type InteractionCategory =
  | 'SOCIAL'
  | 'CONVERSATION'
  | 'MERCHANT'
  | 'WORK'
  | 'CRAFTING'
  | 'BUILDING'
  | 'GATHERING'
  | 'EDUCATION'
  | 'INVENTORY'
  | 'TOOL_USE'
  | 'TRANSPORT'
  | 'REST'
  | 'CARE'
  | 'ENVIRONMENT'
  | 'SYSTEM';
```

Categories support routing and validation.

They do not replace definition-specific rules.

---

## 8. Interaction Authority

The Interaction Runtime is the sole authority for active interaction lifecycle.

It may consult:

- population authority,
- schedule authority,
- role authority,
- profession authority,
- merchant economy authority,
- conversation authority,
- inventory authority,
- spatial authority,
- education authority,
- later reputation authority.

The runtime must not duplicate those systems' source-of-truth state.

It consumes snapshots or validated decisions and records the versions used.

---

## 9. Authority Boundary

The Interaction Runtime owns:

- request validation,
- interaction instance creation,
- reservation acquisition,
- active lifecycle,
- progress state,
- interruption state,
- completion decision,
- terminal outcome,
- interaction evidence.

It does not own:

- NPC profession assignment,
- daily schedule generation,
- merchant price authority,
- inventory ledger authority,
- learning mastery authority,
- reputation ledger authority.

Effects on external authorities must use explicit commands and acknowledgements.

---

## 10. Request Contract

```ts
interface RequestInteractionCommand {
  requestId: string;
  actorId: string;
  actorType: 'PLAYER' | 'NPC' | 'SYSTEM';
  definitionId: string;
  targetId: string;
  targetType: string;
  expectedWorldVersion?: number;
  clientObservedAt?: string;
  input?: Record<string, unknown>;
}
```

The request must be rejected when:

- identity is incomplete,
- definition is unknown,
- actor type is not allowed,
- target type is not allowed,
- actor or target does not exist,
- expected authority version is stale where required,
- the input schema is invalid,
- the request duplicates a completed idempotent command.

---

## 11. Eligibility Pipeline

Eligibility checks execute in this order:

1. request schema,
2. definition availability,
3. actor existence and active status,
4. target existence and active status,
5. world and zone consistency,
6. actor state,
7. target state,
8. schedule constraints,
9. role constraints,
10. profession constraints,
11. relationship or consent constraints,
12. ownership and access rights,
13. spatial constraints,
14. tool constraints,
15. inventory constraints,
16. economy constraints,
17. education constraints,
18. cooldown constraints,
19. concurrency constraints,
20. custom definition rules.

The first authoritative failure stops the pipeline.

All checks must be side-effect free.

---

## 12. Actor State Rules

An actor cannot begin a normal interaction while:

- inactive,
- despawned,
- in an incompatible terminal state,
- already committed to an exclusive interaction,
- being transported by an incompatible system,
- lacking control authority,
- inside a non-interactive cinematic lock,
- under a world pause policy that forbids initiation.

An actor may be allowed to begin limited interactions while:

- seated,
- resting,
- conversing,
- waiting,
- carrying an item,

only when the definition explicitly permits it.

---

## 13. Target State Rules

A target must be rejected when:

- deleted,
- disabled,
- hidden from the actor by authority,
- already consumed,
- in an incompatible lock,
- under construction when interaction requires completion,
- damaged beyond the interaction's tolerance,
- reserved exclusively by another interaction,
- outside the active simulation zone,
- not yet replicated to the authoritative runtime.

Target state must be revalidated immediately before effect commit.

---

## 14. Spatial Eligibility

Spatial eligibility may include:

- maximum distance,
- minimum distance,
- reachable navigation path,
- same floor or platform,
- line of sight,
- facing tolerance,
- target interaction socket,
- free standing position,
- collision clearance,
- zone boundary permission.

Distance alone is insufficient when navigation or obstruction matters.

The runtime records the spatial snapshot version used for acceptance.

---

## 15. Proximity Classes

Recommended proximity classes:

| Class | Intended Use |
|---|---|
| TOUCH | direct pickup, button, tool use |
| CLOSE | conversation, trading, teaching |
| WORK | workstation and construction |
| NEAR | contextual assistance and observation |
| REMOTE | system-approved non-physical interaction |

Exact values belong to world configuration.

Definitions reference classes rather than hard-coding arbitrary distances.

---

## 16. Reachability

A target is reachable only when:

- an allowed path exists,
- the destination interaction slot is valid,
- the path does not cross forbidden access areas,
- required locomotion capability exists,
- projected arrival does not violate timing policy.

NPC requests may enter `APPROACHING` before reservation when target contention is low.

High-contention targets may require provisional reservation before approach.

---

## 17. Ownership and Access

Access policies include:

```ts
type AccessPolicy =
  | 'PUBLIC'
  | 'OWNER_ONLY'
  | 'HOUSEHOLD'
  | 'PROFESSION'
  | 'ROLE'
  | 'MERCHANT_CUSTOMER'
  | 'TEACHER_STUDENT'
  | 'INVITED'
  | 'SYSTEM_ONLY';
```

Rules:

- ownership must be resolved by the owning authority,
- visual availability must not imply access,
- private storage cannot be opened through generic interaction,
- merchant stock requires merchant authority,
- profession equipment may require active duty status,
- school resources may require an active lesson or open-use policy.

---

## 18. Consent and Social Boundaries

Social interactions require a consent policy.

Consent may be:

- implicit for harmless greetings,
- contextual for routine service,
- explicit for invitations, teaching, trading, following, or assistance,
- prohibited by relationship or safety state.

NPC consent is derived from:

- current activity,
- schedule urgency,
- relationship,
- role,
- profession,
- conversation state,
- later reputation,
- privacy policy,
- emotional projection.

The interaction runtime consumes the decision but does not invent relationship state.

---

## 19. Tool Requirements

A tool requirement specifies:

```ts
interface ToolRequirement {
  capability: string;
  minimumTier?: number;
  minimumCondition?: number;
  mustBeEquipped?: boolean;
  consumesDurability?: number;
}
```

Rules:

- capability is authoritative; item name is not enough,
- broken tools do not satisfy requirements,
- equipped requirements are checked at start and commit,
- durability consumption is atomic with completion,
- shared tools require reservation,
- tool loss during execution causes interruption or failure according to policy.

---

## 20. Inventory Requirements

Inventory requirements may be:

- presence-only,
- reserved quantity,
- consumed quantity,
- transformed quantity,
- container-capacity requirement,
- free-slot requirement.

Reserved items cannot be spent by another interaction.

Consumption occurs only at the configured commit point.

Failed interactions must release reservations.

Partial consumption requires an explicit staged-effect definition.

---

## 21. Profession and Capability Rules

Profession checks may require:

- profession identity,
- active assignment,
- duty status,
- certification,
- skill tier,
- workstation authorization,
- mentor supervision,
- apprentice eligibility.

A profession label alone never grants every action.

Each interaction references specific capabilities.

---

## 22. Schedule Integration

Schedule authority affects interactions as follows:

- scheduled duties may increase priority,
- urgent duties may block optional interaction,
- break periods may permit social interaction,
- closed merchant hours block customer transactions,
- school sessions control education interaction,
- sleep periods block normal initiation,
- travel blocks stationary work,
- emergency overrides may suspend schedules.

An interaction crossing a schedule boundary follows its definition policy:

- continue,
- complete current unit then stop,
- pause,
- interrupt,
- refuse before start.

---

## 23. Interaction Lifecycle

Authoritative states are:

```ts
type InteractionState =
  | 'REQUESTED'
  | 'VALIDATING'
  | 'QUEUED'
  | 'APPROACHING'
  | 'RESERVING'
  | 'READY'
  | 'EXECUTING'
  | 'PAUSED'
  | 'COMMITTING'
  | 'COMPLETED'
  | 'CANCELLING'
  | 'CANCELLED'
  | 'INTERRUPTING'
  | 'INTERRUPTED'
  | 'FAILED'
  | 'EXPIRED';
```

Terminal states are:

- `COMPLETED`,
- `CANCELLED`,
- `INTERRUPTED`,
- `FAILED`,
- `EXPIRED`.

---

## 24. State Transition Rules

Allowed primary transitions:

```text
REQUESTED -> VALIDATING
VALIDATING -> QUEUED | APPROACHING | RESERVING | FAILED
QUEUED -> APPROACHING | RESERVING | EXPIRED | CANCELLED
APPROACHING -> RESERVING | INTERRUPTED | FAILED | CANCELLED
RESERVING -> READY | QUEUED | FAILED | CANCELLED
READY -> EXECUTING | CANCELLED | INTERRUPTED
EXECUTING -> PAUSED | COMMITTING | CANCELLING | INTERRUPTING | FAILED
PAUSED -> EXECUTING | CANCELLING | INTERRUPTING | EXPIRED
COMMITTING -> COMPLETED | FAILED
CANCELLING -> CANCELLED
INTERRUPTING -> INTERRUPTED
```

Direct mutation to a terminal state without transition evidence is forbidden.

---

## 25. Request Acceptance

Acceptance creates an interaction instance only after basic identity validation.

Full eligibility may continue in `VALIDATING`.

The acceptance response includes:

```ts
interface InteractionAccepted {
  interactionId: string;
  state: InteractionState;
  acceptedAt: string;
  estimatedStartAt?: string;
  queuePosition?: number;
}
```

Acceptance does not mean completion is guaranteed.

---

## 26. Reservation Model

Reservation types:

- actor commitment,
- target exclusive lock,
- target shared read lock,
- workstation slot,
- position slot,
- tool reservation,
- inventory quantity reservation,
- merchant stock reservation,
- currency reservation,
- learning-session slot.

All reservations have:

- owner interaction ID,
- resource identity,
- reservation mode,
- acquired time,
- expiry time,
- release reason.

---

## 27. Reservation Ordering

To prevent deadlocks, resources are reserved in stable order:

1. actor commitment,
2. zone slot,
3. target,
4. workstation or position,
5. tool,
6. inventory,
7. currency or merchant stock,
8. external authority slot.

Definitions may omit resource classes but may not reorder them casually.

A custom order requires architectural review and deadlock evidence.

---

## 28. Lock Compatibility

Lock modes:

```ts
type LockMode =
  | 'EXCLUSIVE'
  | 'SHARED_READ'
  | 'SHARED_PARTICIPATION'
  | 'CAPACITY_SLOT';
```

Examples:

- pickup requires exclusive target lock,
- multiple observers may use shared read,
- group conversation may use shared participation,
- a workbench may expose capacity slots,
- merchant service may allow one active customer per service slot.

---

## 29. Queueing

Queueing is allowed when temporary contention is expected.

A queued request records:

- enqueue time,
- priority class,
- fairness weight,
- target queue,
- expiry policy,
- revalidation policy,
- estimated wait where available.

Queued requests must be revalidated before reservation.

A request may expire if context becomes invalid.

---

## 30. Priority

Priority sources include:

- safety and emergency,
- active duty schedule,
- world-critical system action,
- education session authority,
- merchant service order,
- normal player request,
- normal NPC request,
- ambient optional behavior.

Priority must not bypass eligibility.

Fairness prevents permanent starvation of lower-priority requests.

---

## 31. Execution Model

An executing interaction may be:

- instant,
- timed,
- progress-based,
- staged,
- cooperative,
- repeating,
- channelled,
- input-driven.

The definition declares its duration model.

Runtime progression is authoritative and independent from frame rate.

---

## 32. Progress

```ts
interface InteractionProgress {
  interactionId: string;
  state: 'EXECUTING' | 'PAUSED';
  progress01: number;
  stage?: string;
  authoritativeTick: number;
  updatedAt: string;
}
```

Rules:

- progress never decreases unless the definition explicitly supports regression,
- progress cannot exceed 1,
- projection interpolation cannot mutate authority,
- stage changes are evidence events,
- completion requires effect commit, not merely `progress01 === 1`.

---

## 33. Commit Point

The commit point is where effects become authoritative.

Before commit:

- final eligibility is checked,
- reservations are verified,
- target version is checked,
- external command preconditions are confirmed.

During commit:

- effects apply atomically where possible,
- external authority acknowledgements are recorded,
- evidence is emitted.

After commit:

- reservations release,
- projections update,
- downstream events publish.

---

## 34. Atomicity

An interaction requiring multiple authority mutations must use one of:

- single transactional boundary,
- orchestrated saga with compensating actions,
- staged interaction with explicit intermediate states.

Silent partial completion is forbidden.

If compensation fails, the instance enters a recoverable failure state with operator evidence.

---

## 35. Cancellation

Cancellation is a voluntary stop requested by:

- player,
- NPC decision authority,
- owning system,
- world shutdown coordinator.

Cancellation policy declares:

- cancellable states,
- cancellation delay,
- consumed resources,
- progress retention,
- cooldown,
- reservation release.

Cancellation after commit begins is normally rejected.

---

## 36. Interruption

Interruption is caused by external context change.

Examples:

- actor moves away,
- target becomes unavailable,
- tool breaks,
- schedule emergency begins,
- navigation path becomes invalid,
- required participant leaves,
- world safety event occurs,
- authority version conflict appears.

Interruption is distinct from failure because the interaction may remain conceptually valid but cannot continue now.

---

## 37. Pause and Resume

Pause is allowed only for definitions declaring resumability.

A paused instance retains only explicitly permitted reservations.

Resume requires:

- actor availability,
- target availability,
- restored spatial conditions,
- valid reservations,
- unchanged critical versions,
- unexpired resume window.

Otherwise the instance becomes interrupted or expired.

---

## 38. Failure Model

Canonical failure codes include:

```ts
type InteractionFailureCode =
  | 'DEFINITION_NOT_FOUND'
  | 'DEFINITION_VERSION_UNSUPPORTED'
  | 'ACTOR_NOT_FOUND'
  | 'ACTOR_UNAVAILABLE'
  | 'TARGET_NOT_FOUND'
  | 'TARGET_UNAVAILABLE'
  | 'OUT_OF_RANGE'
  | 'UNREACHABLE'
  | 'LINE_OF_SIGHT_BLOCKED'
  | 'ACCESS_DENIED'
  | 'CONSENT_DENIED'
  | 'SCHEDULE_BLOCKED'
  | 'ROLE_REQUIRED'
  | 'PROFESSION_REQUIRED'
  | 'CAPABILITY_REQUIRED'
  | 'TOOL_REQUIRED'
  | 'TOOL_BROKEN'
  | 'ITEM_REQUIRED'
  | 'INSUFFICIENT_QUANTITY'
  | 'INSUFFICIENT_FUNDS'
  | 'TARGET_RESERVED'
  | 'ACTOR_BUSY'
  | 'COOLDOWN_ACTIVE'
  | 'STALE_WORLD_VERSION'
  | 'COMMIT_CONFLICT'
  | 'EXTERNAL_AUTHORITY_REJECTED'
  | 'INTERACTION_EXPIRED'
  | 'INTERNAL_INVARIANT_VIOLATION';
```

Failure payloads must be safe for UI and diagnostic enough for evidence.

---

## 39. Retry Policy

Retries are classified as:

- not retryable,
- immediate retryable,
- retry after context change,
- retry after cooldown,
- system-managed retry.

The runtime must not automatically retry:

- access denial,
- consent denial,
- missing capability,
- invalid definition,
- irreversible commit conflict.

System retries require bounded attempts and backoff.

---

## 40. Cooldowns

Cooldowns may apply to:

- actor,
- target,
- actor-target pair,
- definition,
- category,
- zone.

Cooldown is authoritative world time, not UI time.

Save/load preserves remaining cooldown deterministically.

Cooldown must not be used to hide concurrency defects.

---

## 41. Player-to-NPC Interaction

Player-to-NPC actions include:

- greet,
- start conversation,
- ask contextual question,
- request service,
- trade,
- offer item,
- request teaching,
- ask for help,
- invite participation,
- assign permitted task,
- inspect public role information.

Rules:

- visible options derive from eligibility snapshots,
- selecting an option triggers authoritative revalidation,
- conversation options belong to 15F authority,
- service and trade effects belong to their owning systems,
- NPC availability follows schedule and current activity,
- refusal must have a stable reason category,
- UI must not expose private NPC knowledge.

---

## 42. NPC-to-Player Interaction

NPCs may initiate:

- greeting,
- service prompt,
- assistance offer,
- lesson invitation,
- task request,
- warning,
- schedule reminder,
- event invitation later in 15I.

Rules:

- initiation respects player interruption settings,
- critical control is never stolen without explicit policy,
- repeated prompts use cooldown,
- optional prompts may be deferred,
- active player interaction has priority unless safety overrides,
- refusal or dismissal closes the invitation cleanly.

---

## 43. Player-to-Object Interaction

Object actions include:

- inspect,
- pick up,
- place,
- move,
- rotate,
- open,
- close,
- activate,
- deactivate,
- use tool on,
- insert item,
- remove item,
- repair,
- clean,
- build,
- harvest,
- study.

Each object exposes interaction definitions from authoritative capabilities.

UI cannot infer actions from model name alone.

---

## 44. NPC-to-Object Interaction

NPC behavior may request the same authoritative definitions as players.

NPCs do not receive hidden shortcuts unless a system definition explicitly permits them.

Rules:

- NPC navigation and reservation are visible to the same runtime,
- work quality derives from profession capability,
- tools and materials are real resources,
- production effects enter the same ledgers,
- NPC failures produce recoverable behavior decisions,
- ambient animation cannot claim completed work.

---

## 45. NPC-to-NPC Interaction

NPC-to-NPC actions include:

- greet,
- converse,
- exchange item,
- request assistance,
- coordinate work,
- teach,
- trade where allowed,
- share workstation,
- hand off responsibility.

Group interactions require participant slots.

All required participants must accept before execution unless the definition permits late join.

---

## 46. Group Interaction

```ts
interface ParticipantSlot {
  slotId: string;
  requiredActorKind: string;
  requiredCapability?: string;
  minimumCount: number;
  maximumCount: number;
  optional: boolean;
}
```

Rules:

- required slots must be filled,
- every participant has an actor commitment,
- one participant may be coordinator,
- participant loss follows interruption policy,
- rewards and effects declare distribution rules,
- group animations are projections of one interaction instance or an explicit parent-child interaction graph.

---

## 47. Merchant Interaction

Merchant interactions integrate with 15E.

Supported actions include:

- browse,
- request quote,
- reserve stock,
- purchase,
- sell,
- exchange,
- request service,
- collect completed order.

Rules:

- merchant must be open or explicitly available,
- merchant service slot may be reserved,
- price quote has version and expiry,
- stock reservation precedes payment commit,
- currency and stock mutate atomically or by compensated saga,
- cancelled transactions release stock and funds,
- UI display is not price authority.

---

## 48. Crafting Interaction

Crafting requires:

- recipe authority,
- workstation capability,
- profession or skill capability where applicable,
- materials,
- tool condition,
- free output capacity,
- valid work slot.

Completion must produce:

- consumed input evidence,
- produced output evidence,
- quality result where supported,
- tool durability effect,
- profession progression event where owned elsewhere.

Crafting animation alone never creates inventory.

---

## 49. Production Interaction

Production interactions may be staged:

1. acquire materials,
2. prepare workstation,
3. process inputs,
4. inspect quality,
5. package output,
6. store or hand off output.

Each stage may be a child interaction linked by `causationId`.

The production parent completes only when required stages and effects complete.

---

## 50. Building and Construction Interaction

Construction actions include:

- preview placement,
- validate placement,
- reserve footprint,
- deliver materials,
- build stage,
- inspect stage,
- complete structure,
- repair,
- dismantle.

Rules:

- preview is non-authoritative,
- placement commit reserves world cells,
- collision and access routes are validated,
- construction consumes materials by declared stage,
- incomplete structures expose limited capabilities,
- dismantling returns only policy-approved resources,
- simultaneous builders use cooperative slots rather than duplicate progress.

---

## 51. Gathering Interaction

Gathering requires:

- resource node availability,
- remaining yield,
- tool capability where required,
- reachability,
- inventory capacity,
- zone permission.

Rules:

- node yield is reserved before commit,
- output quantity is determined authoritatively,
- depletion is atomic with output creation,
- regrowth belongs to resource authority,
- multiple gatherers use capacity or quantity reservations,
- cancellation before commit does not reduce yield unless staged extraction is defined.

---

## 52. Tool Use Interaction

Tool use is an interaction category, not a direct item mutation shortcut.

A tool-use definition declares:

- valid target capabilities,
- valid actor capabilities,
- equipped state,
- use duration,
- durability cost,
- output effect,
- failure effect,
- sound and animation projection keys.

Automatic tool selection by UI is advisory.

The authoritative runtime validates the selected tool.

---

## 53. Carrying and Transport

Carrying interactions include:

- pick up,
- attach,
- carry,
- hand over,
- place,
- load,
- unload.

Rules:

- carried entities remain authoritative world entities,
- one carrier owns the carry attachment,
- capacity and weight limits are validated,
- transfer uses coordinated reservation,
- actor interruption must resolve held objects safely,
- save/load restores attachment or performs deterministic safe placement.

---

## 54. Rest and Recovery

Rest interactions may require:

- valid rest location,
- access permission,
- free capacity slot,
- no urgent duty,
- acceptable safety conditions.

Rest effects may update external needs or recovery authority.

Time acceleration, if supported, is a world-level decision and not owned by a single rest interaction.

---

## 55. Education Interaction

Education interactions must preserve real learning authority.

Supported forms include:

- observe demonstration,
- manipulate learning object,
- answer challenge,
- request hint,
- receive guided explanation,
- mentor practice,
- validate mastery evidence.

Rules:

- answer correctness belongs to education authority,
- interaction runtime owns participation lifecycle,
- decorative completion cannot grant mastery,
- hints and retries are recorded,
- mentor and learner identities are explicit,
- physical world actions may represent mathematical operations but must map to real concepts,
- save/load preserves the current learning step without fabricating success.

---

## 56. Conversation Integration

Conversation from 15F may:

- expose an interaction option,
- request consent,
- collect structured input,
- explain failure,
- confirm transaction,
- coordinate a group action.

Conversation does not directly mutate interaction effects.

It issues a request to the Interaction Runtime.

The runtime returns accepted, queued, refused, or completed outcomes for projection back into dialogue.

---

## 57. Contextual Interaction Menu

The contextual menu is a projection of candidate definitions.

Candidate generation may filter by:

- actor kind,
- target kind,
- broad range,
- known capabilities,
- current mode.

Final selection must be authoritatively revalidated.

Menu ordering may consider:

- relevance,
- current tool,
- recent action,
- schedule context,
- player preference,
- tutorial priority.

Ordering cannot change eligibility.

---

## 58. Automatic Tool and Action Selection

The system may suggest or automatically highlight a likely action.

Rules:

- suggestion is non-authoritative,
- proximity may change highlighted tools,
- the last gathered or placed object may influence selection,
- remaining inventory may keep a placement tool selected,
- approaching a new actionable target may override the prior suggestion,
- automatic selection must not execute without the configured player intent,
- accessibility settings may permit alternate confirmation methods,
- the runtime always validates the actual submitted definition and tool.

---

## 59. Input Semantics

Input modes may include:

- press,
- hold,
- toggle,
- point-and-confirm,
- drag-and-place,
- contextual auto-focus,
- queued command.

Input interpretation belongs to client controls.

The command sent to authority must express semantic intent, not raw device events.

Example:

```ts
{ definitionId: 'place.resource.stone', targetId: 'cell-18-42' }
```

not:

```ts
{ mouseDown: true, x: 813, y: 442 }
```

---

## 60. Projection Contract

Interaction projection may include:

- prompt,
- highlight,
- path preview,
- reservation indicator,
- progress bar,
- actor animation,
- target animation,
- sound,
- particles,
- success feedback,
- refusal feedback,
- interruption feedback.

Projection must tolerate delayed authority updates.

Optimistic visuals must be reversible and cannot display irreversible success before commit acknowledgement.

---

## 61. Animation Synchronization

Animation synchronization rules:

- authority starts first or provides a scheduled start tick,
- animation events may request stage advancement only when definition permits,
- missing animation cannot block authoritative recovery indefinitely,
- animation completion cannot force business completion,
- late clients reconstruct from current state and stage,
- multiplayer observers receive interaction state, not device input.

---

## 62. Runtime Record

```ts
interface InteractionRecord {
  identity: InteractionIdentity;
  state: InteractionState;
  actorVersion: number;
  targetVersion: number;
  scheduleVersion?: number;
  professionVersion?: number;
  conversationContextId?: string;
  reservations: ReservationRecord[];
  progress?: InteractionProgress;
  startedAt?: string;
  committedAt?: string;
  endedAt?: string;
  outcome?: InteractionOutcome;
  failure?: InteractionFailure;
  evidenceIds: string[];
}
```

The record is append-transitioned or versioned.

In-place unversioned mutation is forbidden.

---

## 63. Runtime Invariants

The runtime must enforce:

1. one terminal outcome per interaction,
2. no completion without commit evidence,
3. no active exclusive interaction without actor commitment,
4. no target mutation without compatible reservation,
5. no reservation owned by a terminal interaction,
6. no progress outside executing or paused state,
7. no commit after cancellation is accepted,
8. no actor-target identity change,
9. no silent definition version substitution,
10. no duplicate external effect acknowledgement,
11. no queue entry after terminal state,
12. no save snapshot containing unowned locks.

---

## 64. Idempotency

Commands that may be retried must include stable request IDs.

The runtime stores request outcome by authority scope.

Repeated identical requests return the prior result.

Repeated request IDs with different payloads fail as invariant violations.

External effect commands also require idempotency keys derived from interaction and effect identity.

---

## 65. Event Model

Canonical events include:

```text
InteractionRequested
InteractionValidated
InteractionQueued
InteractionApproachStarted
InteractionReservationAcquired
InteractionReady
InteractionStarted
InteractionProgressed
InteractionPaused
InteractionResumed
InteractionCommitStarted
InteractionEffectApplied
InteractionCompleted
InteractionCancellationRequested
InteractionCancelled
InteractionInterrupted
InteractionFailed
InteractionExpired
InteractionReservationReleased
```

Events must include interaction ID, authority version, world tick, and timestamp.

---

## 66. Persistence

Persist:

- identity,
- definition version,
- lifecycle state,
- critical authority versions,
- reservations required for recovery,
- progress and stage,
- terminal outcome,
- failure details,
- external effect acknowledgements,
- evidence references.

Transient projection state is not required for persistence.

---

## 67. Save Policy

Before save, the runtime must produce a consistent interaction snapshot.

Supported strategies:

- freeze at authoritative tick,
- snapshot active records and reservations,
- complete or cancel non-persistable instant transitions,
- mark external commands with acknowledged status.

The save must not contain half-written effects.

---

## 68. Load Policy

On load:

1. load interaction definitions,
2. migrate supported definition versions,
3. restore actor and target authorities,
4. restore interaction records,
5. validate reservations,
6. reconcile external effect acknowledgements,
7. resume eligible interactions,
8. interrupt or expire invalid interactions,
9. rebuild projections,
10. emit recovery evidence.

Load must never blindly replay already acknowledged effects.

---

## 69. Recovery Decisions

An active interaction after load may become:

- resumed,
- paused pending zone activation,
- interrupted due to context mismatch,
- failed due to unsupported version,
- completed if commit evidence proves completion,
- cancelled by explicit safe-shutdown policy.

Recovery decisions are recorded with reasons.

---

## 70. Zone Unload

When a zone unloads:

- instant interactions finish or cancel deterministically,
- persistent timed work may convert to simulation authority,
- non-persistable proximity interactions are interrupted,
- reservations are transferred or released,
- actors retain no ghost commitments,
- reload reconstructs only supported active state.

Zone unload cannot silently complete visible work.

---

## 71. Offline and Background Simulation

Background simulation may execute only definitions explicitly marked simulation-safe.

Simulation-safe interactions must not require:

- active player input,
- frame-specific collision,
- unresolved consent,
- unbounded random choice,
- live conversation selection.

Background completion emits the same authoritative effects and evidence.

---

## 72. Determinism

Given identical:

- interaction definition version,
- authority snapshots,
- input,
- random seed,
- world tick,

eligibility and outcome must be reproducible.

Random outcomes use recorded seeds and result evidence.

Client frame timing cannot change authoritative results.

---

## 73. Telemetry

Recommended telemetry fields:

- interaction definition,
- category,
- actor kind,
- target kind,
- request count,
- acceptance rate,
- refusal code,
- queue duration,
- approach duration,
- execution duration,
- cancellation rate,
- interruption rate,
- commit failure rate,
- retry count,
- recovery outcome,
- projection desynchronization count.

Telemetry must respect privacy and avoid exposing private conversation content.

---

## 74. Observability

Operators must be able to trace:

- why an option was unavailable,
- why a request failed,
- who owned a reservation,
- which authority version was consulted,
- which effect commands were acknowledged,
- whether completion was persisted,
- how load recovery resolved the interaction.

Trace output should be correlation-ID searchable.

---

## 75. Security and Abuse Prevention

The runtime must defend against:

- requesting hidden definitions,
- forged actor identity,
- forged target identity,
- distance bypass,
- duplicate commit requests,
- inventory duplication,
- merchant stock duplication,
- unauthorized private access,
- stale-version overwrite,
- reservation flooding,
- queue starvation attacks,
- client-reported completion.

The client is never authority for eligibility or effect completion.

---

## 76. Performance Budget

The interaction system should:

- use coarse candidate filtering before detailed checks,
- avoid scanning all world objects per request,
- index active reservations by resource,
- batch projection updates,
- expire abandoned requests,
- keep terminal records outside hot runtime after persistence,
- bound queue size,
- cache immutable definition data,
- version authority snapshots.

Optimization must not weaken invariants.

---

## 77. Accessibility

Accessibility support may include:

- larger prompts,
- hold-duration adjustment,
- toggle instead of hold,
- keyboard-only selection,
- controller navigation,
- reduced motion projection,
- audio and visual confirmation,
- automatic contextual focus,
- confirmation timing adjustment.

Accessibility changes input and projection, not interaction authority.

---

## 78. Localization

Interaction definitions use stable semantic IDs.

Labels, prompts, refusal messages, and help text are localized projections.

Logic must not branch on translated text.

Builder's Valley should remain language-light where practical, especially for core object manipulation.

---

## 79. Failure Projection

UI failure projection should provide:

- a concise user-facing reason,
- an optional corrective hint,
- no private authority data,
- no misleading success animation,
- stable behavior across input devices.

Examples:

- move closer,
- equip a suitable tool,
- wait until the shop opens,
- free inventory space,
- target is currently in use,
- complete the required learning step.

---

## 80. Unit Validation

Unit tests must cover:

- eligibility ordering,
- actor-state refusal,
- target-state refusal,
- distance and reachability,
- access policy,
- consent policy,
- tool capability,
- inventory reservation,
- transition legality,
- reservation compatibility,
- queue priority and fairness,
- cancellation,
- interruption,
- pause/resume,
- cooldown,
- idempotency,
- effect commit,
- failure mapping.

---

## 81. Contract Validation

Contract tests must prove:

- stable request schema,
- stable response schema,
- definition version behavior,
- failure-code serialization,
- event payload identity,
- terminal outcome shape,
- persistence snapshot compatibility,
- migration behavior,
- projection contract fields.

---

## 82. Integration Validation

Integration tests must include:

- interaction plus schedule authority,
- interaction plus profession authority,
- interaction plus inventory authority,
- interaction plus merchant authority,
- interaction plus conversation authority,
- interaction plus education authority,
- reservation plus concurrent requests,
- commit plus external effect acknowledgement,
- save/load plus active interaction recovery.

---

## 83. Scenario Validation

Required scenarios:

### Scenario A — Successful pickup

- player approaches item,
- item is available,
- exclusive reservation is acquired,
- pickup executes,
- inventory effect commits,
- world item state changes,
- completion evidence exists.

### Scenario B — Contested workstation

- two actors request one exclusive slot,
- first actor reserves it,
- second actor queues or fails by policy,
- first completes,
- reservation releases,
- second revalidates before start.

### Scenario C — Merchant purchase

- merchant is open,
- quote is valid,
- stock and funds reserve,
- transaction commits atomically,
- inventory receives item,
- evidence links interaction and transaction.

### Scenario D — Tool breaks mid-work

- tool initially satisfies requirement,
- durability reaches invalid state,
- interaction follows interruption policy,
- no uncommitted output is created,
- reservations release.

### Scenario E — Schedule boundary

- NPC starts allowed work,
- duty period ends,
- definition policy determines continue or stop,
- schedule state remains authoritative,
- outcome is recorded.

### Scenario F — Save during active crafting

- crafting is executing,
- save snapshot captures stage and reservations,
- load restores state,
- effects are not duplicated,
- crafting resumes or safely interrupts by policy.

### Scenario G — Education challenge

- learner starts a real math interaction,
- answer is validated by education authority,
- interaction completes only after authoritative result,
- mastery is not granted by animation alone.

### Scenario H — Automatic tool suggestion

- player has remaining placeable objects,
- placement tool remains highlighted,
- player approaches a new gatherable target,
- UI changes suggestion,
- submitted action is revalidated authoritatively.

---

## 84. Concurrency Validation

Concurrency tests must prove:

- no double pickup,
- no duplicate merchant sale,
- no duplicate resource yield,
- no duplicate crafting output,
- no conflicting building placement,
- no actor executing two exclusive actions,
- no deadlock under ordered reservations,
- no leaked reservation after failure,
- no starvation beyond configured fairness bounds.

---

## 85. Save/Load Validation

Save/load tests must prove:

- terminal interactions remain terminal,
- completed effects do not replay,
- active progress restores correctly,
- unsupported versions fail safely,
- invalid reservations are reconciled,
- carried objects recover safely,
- queued requests revalidate,
- cooldown remains consistent,
- zone unload does not create ghost locks.

---

## 86. Human Validation

Human testing should observe:

- prompts match available actions,
- actions feel responsive without lying about authority,
- refusals are understandable,
- NPCs do not overlap contested work,
- tools behave consistently,
- conversation-to-action transitions are natural,
- merchants do not duplicate stock,
- building and gathering are predictable,
- save/load does not visibly corrupt active work,
- education interactions preserve mathematical meaning.

---

## 87. Evidence Package

A production evidence package must contain:

- guide path and commit SHA,
- interaction definition inventory,
- lifecycle transition table,
- failure-code inventory,
- reservation policy evidence,
- concurrency test results,
- save/load recovery results,
- merchant integration evidence,
- profession integration evidence,
- conversation integration evidence,
- education integration evidence,
- representative runtime traces,
- human validation notes,
- known limitations.

---

## 88. Production Exit Gate

15G passes only when:

- interaction authority is explicit,
- identity and version contracts are stable,
- eligibility order is deterministic,
- lifecycle transitions are enforced,
- contested resources use reservations,
- terminal outcomes are explicit,
- effects require commit evidence,
- cancellation and interruption are distinct,
- queueing and fairness are defined,
- player and NPC interactions share authoritative rules,
- merchant, profession, conversation, and education integrations are bounded,
- save/load recovery is deterministic,
- failure codes are stable,
- concurrency scenarios pass,
- no client-side success can bypass authority,
- evidence package is complete.

Repository documentation completion alone is not runtime certification.

---

## 89. Non-Goals

15G does not attempt to:

- define every future world action,
- replace physics authority,
- replace inventory authority,
- replace merchant authority,
- replace education authority,
- encode reputation policy,
- encode event participation policy,
- permit unrestricted scripting,
- guarantee final game balance.

It provides the stable interaction foundation those systems can use.

---

## 90. Handoff to 15H — Reputation System

15G emits interaction outcomes that 15H may consume.

Potential reputation-relevant evidence includes:

- fulfilled service,
- refused request,
- successful assistance,
- failed commitment,
- fair trade,
- completed teaching,
- respectful conversation follow-through,
- property access violation,
- abandoned shared work,
- repeated reliable participation.

15G must not calculate reputation scores.

It provides:

- actor identity,
- target or participant identity,
- interaction definition,
- context,
- terminal outcome,
- verified effects,
- failure or interruption reason,
- timestamps,
- correlation evidence.

15H decides which outcomes matter and how they affect reputation.

---

## 91. Final Production Statement

Builder's Valley interaction is not a button-to-animation shortcut.

It is a governed world-state transition connecting intent, eligibility, reservation, execution, effect, evidence, projection, and recovery.

A production-ready implementation must make player actions and NPC actions feel natural while preserving strict authority underneath.

The world becomes trustworthy when:

- objects cannot be duplicated,
- NPCs cannot complete impossible work,
- merchants cannot sell unavailable stock,
- tools and materials matter,
- schedules and professions matter,
- conversations lead to real actions,
- educational success remains real,
- interruptions are recoverable,
- save/load preserves meaning,
- every completion can be proved.

That trustworthy action layer is the foundation delivered by 15G.
