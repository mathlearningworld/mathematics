# 23F — Inventory & Resource Runtime

## Status

- Chapter: 23 — Game Runtime & World Architecture
- Slice: 23F
- Authority: Architecture documentation
- Scope: Inventory ownership, slots, stacks, tools, resource transfer, pickup, placement consumption, drop, use, reservation, recovery, and invariants

## 1. Purpose

The Inventory Runtime defines how resources and usable objects move between the player, world entities, containers, and gameplay systems.

It governs:

- inventory ownership,
- slot and stack semantics,
- pickup and collection,
- placement consumption,
- dropping resources back into the world,
- tool selection and readiness,
- use and consumption,
- transfers between containers,
- resource reservation,
- optimistic projection,
- recovery after interrupted operations.

## 2. Core Principle

> Inventory is an authoritative resource ledger, not a toolbar projection.

The visible hotbar, selected slot, icons, and counts are projections of inventory state. They do not own quantities or prove that a transfer committed.

## 3. Runtime Position

```text
World / Interaction Intent
    ↓
Inventory Policy
    ↓
Reservation and Validation
    ↓
Inventory Transaction
    ↓
World Mutation or Consumption
    ↓
Projection and Feedback
```

## 4. Inventory Ownership

Every inventory belongs to a stable owner.

```ts
interface InventoryIdentity {
  inventoryId: string;
  ownerType: 'player' | 'entity' | 'container' | 'world' | 'system';
  ownerId: string;
  worldId: string;
}
```

An inventory must not be identified only by a UI panel, scene object, or array reference.

## 5. Inventory Record

```ts
interface InventoryState {
  identity: InventoryIdentity;
  revision: number;
  capacityPolicy: CapacityPolicy;
  slots: ReadonlyArray<InventorySlot>;
  reservations: ReadonlyArray<ResourceReservation>;
}
```

The inventory revision advances after every committed inventory mutation.

## 6. Inventory Slot

```ts
interface InventorySlot {
  slotId: string;
  index: number;
  item?: InventoryItemStack;
  constraints?: SlotConstraint[];
}
```

Slot identity must remain stable when items move or counts change.

The UI index is not sufficient identity for durable commands.

## 7. Item Stack

```ts
interface InventoryItemStack {
  itemTypeId: string;
  quantity: number;
  stackKey: string;
  metadata?: Readonly<Record<string, unknown>>;
  itemInstanceIds?: ReadonlyArray<string>;
}
```

`stackKey` defines whether two items are stack-compatible.

Items with different durability, ownership, quality, learning state, customization, or provenance may require separate stacks.

## 8. Resource and Item Categories

The runtime may distinguish:

- fungible resources,
- unique durable tools,
- consumables,
- placeable constructions,
- quest or mission items,
- containers,
- currencies or credits,
- temporary session resources.

Category determines policy, not UI appearance.

## 9. Item Specification

```ts
interface ItemSpecification {
  itemTypeId: string;
  category: string;
  maxStackSize: number;
  placeableConstructionTypeId?: string;
  toolCapabilities?: string[];
  consumableEffectId?: string;
  droppable: boolean;
  transferable: boolean;
  persistent: boolean;
}
```

Specifications are semantic authority. Icon files and sprite names are projection details.

## 10. Capacity Policy

Capacity may be constrained by:

- number of slots,
- stack sizes,
- weight,
- volume,
- item category,
- owner capability,
- mission restrictions.

```ts
interface CapacityPolicy {
  maxSlots?: number;
  maxWeight?: number;
  maxVolume?: number;
  allowedCategories?: string[];
}
```

A transfer must evaluate the complete policy before commitment.

## 11. Selection Runtime

Selection is separate from possession.

```ts
interface InventorySelection {
  inventoryId: string;
  slotId?: string;
  source: 'explicit' | 'contextual' | 'recovery' | 'default';
  selectedAt: number;
}
```

Changing selection does not mutate resource quantity.

## 12. Explicit and Contextual Selection

Explicit selection reflects a player choice.

Contextual selection may temporarily improve readiness, for example:

- selecting a pickup tool near a pickup target,
- selecting the most recently collected placeable resource,
- returning to a still-available placement stack after leaving pickup range.

Contextual selection must not permanently erase the player's explicit preference.

## 13. Selection Memory

```ts
interface InventorySelectionMemory {
  explicitSlotId?: string;
  contextualSlotId?: string;
  lastCollectedSlotId?: string;
  lastPlacementSlotId?: string;
  lastUsefulSlotId?: string;
}
```

Selection memory is reconciled whenever inventory revisions invalidate a referenced slot or stack.

## 14. Automatic Selection Policy

Automation may change the active projection when:

- the target context is unambiguous,
- the selected item is available,
- the change is reversible,
- it does not consume an item,
- it does not override a fresh explicit selection without clear reason.

Automation may not fabricate possession or select an empty incompatible slot.

## 15. Inventory Reference

Commands use stable inventory references.

```ts
interface InventoryReference {
  inventoryId: string;
  slotId: string;
  itemTypeId: string;
  expectedInventoryRevision: number;
  expectedQuantity?: number;
}
```

This protects against stale toolbar state.

## 16. Resource Transfer

A resource transfer moves quantity from one authority to another.

```ts
interface ResourceTransfer {
  transferId: string;
  itemTypeId: string;
  quantity: number;
  source: ResourceEndpoint;
  destination: ResourceEndpoint;
  reason: string;
}
```

A transfer cannot create or destroy resources unless the reason explicitly defines production or consumption.

## 17. Resource Endpoint

```ts
type ResourceEndpoint =
  | { kind: 'inventory'; inventoryId: string; slotId?: string }
  | { kind: 'world-entity'; entityId: string }
  | { kind: 'system-source'; sourceId: string }
  | { kind: 'system-sink'; sinkId: string };
```

System sources and sinks require explicit policy and audit evidence.

## 18. Pickup Operation

Pickup transfers a world resource into an inventory.

```text
VALIDATE TARGET
    ↓
VALIDATE RANGE AND TOOL
    ↓
VALIDATE DESTINATION CAPACITY
    ↓
LOCK / RESERVE WORLD RESOURCE
    ↓
ADD TO INVENTORY
    ↓
REMOVE OR UPDATE WORLD ENTITY
    ↓
COMMIT
```

Pickup is not complete when the sprite disappears. It is complete when inventory and world state commit consistently.

## 19. Pickup Command

```ts
interface PickupResourceCommand {
  commandId: string;
  actorEntityId: string;
  targetEntityId: string;
  destinationInventoryId: string;
  expectedTargetRevision: number;
  expectedInventoryRevision: number;
  requestedQuantity?: number;
}
```

## 20. Partial Pickup

When capacity is insufficient, policy must choose explicitly:

- refuse the entire pickup,
- accept a partial quantity,
- split the world stack,
- redirect to another eligible container.

Partial pickup must return exact committed quantity.

## 21. Placement Consumption

Placing a construction consumes or transforms inventory resources.

The placement transaction coordinates:

- source stack validation,
- resource reservation,
- world placement validation,
- entity creation,
- quantity decrement,
- selection reconciliation.

No quantity may be deducted for a refused placement.

## 22. Repeated Placement Flow

After a successful placement:

- if the source stack still contains placeable quantity, it may remain selected,
- if another compatible stack exists, policy may continue with it,
- if no compatible quantity remains, contextual selection must clear or return to a valid fallback,
- entering a new pickup context may temporarily select the relevant pickup tool,
- leaving that context may restore the last useful placement selection.

This preserves a smooth gather-and-build loop.

## 23. Tool Model

Tools may be unique entities or inventory items with capabilities.

```ts
interface ToolRuntimeState {
  itemTypeId: string;
  itemInstanceId?: string;
  capabilities: ReadonlySet<string>;
  durability?: number;
  charges?: number;
  cooldownUntil?: number;
}
```

The toolbar does not grant capability; the selected valid tool state does.

## 24. Tool Readiness

A tool is ready only when:

- it is possessed,
- it is selected or otherwise permitted,
- its capability matches the interaction,
- durability or charges are sufficient,
- cooldown has elapsed,
- actor and world state allow its use.

## 25. Tool Use Transaction

A tool operation may coordinate:

- world command,
- durability decrement,
- charge consumption,
- cooldown start,
- produced resources,
- target mutation.

These effects must commit under one declared transaction boundary or a recoverable saga.

## 26. Consume Operation

Consumption moves an item to a system sink and applies an effect.

```text
VALIDATE ITEM
    ↓
VALIDATE ACTOR STATE
    ↓
RESERVE QUANTITY
    ↓
APPLY EFFECT
    ↓
DECREMENT STACK
    ↓
COMMIT
```

If the effect cannot be committed, the item must not silently disappear.

## 27. Drop Operation

Dropping moves resources from inventory into the world.

Validation includes:

- item is droppable,
- quantity is available,
- destination point is valid,
- world can create or merge the resource entity,
- no protected mission rule forbids the drop.

Drop must coordinate quantity decrement and world entity creation atomically.

## 28. Transfer Between Inventories

Container-to-container transfer validates:

- source ownership and access,
- destination access,
- source quantity,
- destination capacity,
- stack compatibility,
- expected revisions.

Both inventory revisions advance on commit.

## 29. Stack Merge and Split

Merge requires identical stack compatibility keys.

Split creates a new stack identity or slot assignment while conserving total quantity.

```text
quantity before = quantity after across all affected endpoints
```

Except when an explicit production or consumption event is part of the same transaction.

## 30. Reservation Model

Reservations prevent concurrent commands from spending the same resources.

```ts
interface ResourceReservation {
  reservationId: string;
  commandId: string;
  inventoryId: string;
  slotId: string;
  itemTypeId: string;
  quantity: number;
  expiresAt: number;
}
```

Available quantity is:

```text
committed quantity - active reserved quantity
```

## 31. Reservation Rules

- Reservations are temporary.
- Reservations do not change projected committed quantity unless UI explicitly shows reserved state.
- Expired reservations are released.
- A reservation belongs to one command.
- Commit consumes the reservation exactly once.
- Cancellation releases it exactly once.

## 32. Inventory Transaction Result

```ts
interface InventoryTransactionResult {
  transactionId: string;
  status: 'COMMITTED' | 'REFUSED' | 'CONFLICT' | 'UNCERTAIN';
  inventoryRevisions: Record<string, number>;
  transfers: ResourceTransfer[];
  refusal?: InventoryRefusal;
}
```

## 33. Refusal Model

```ts
interface InventoryRefusal {
  code: string;
  category: 'quantity' | 'capacity' | 'compatibility' | 'authority' | 'state' | 'conflict';
  recoverable: boolean;
  inventoryId?: string;
  slotId?: string;
}
```

Refusal is structured gameplay feedback, not an exceptional crash condition.

## 34. Idempotency

Every durable inventory mutation command has an idempotency identifier.

Replaying the same committed command must return the prior result without applying the transfer twice.

This is essential for pickup, placement, consume, drop, and remote synchronization.

## 35. Optimistic Projection

The UI may predict:

- selected slot,
- pending quantity change,
- pickup animation,
- placement count decrement.

Predicted inventory state must be marked internally and reconciled with authoritative revisions.

Prediction cannot become persistence evidence.

## 36. Inventory Projection

```ts
interface InventoryProjection {
  inventoryId: string;
  revision: number;
  slots: InventorySlotProjection[];
  selectedSlotId?: string;
  pendingTransactionIds: string[];
  status: 'ready' | 'syncing' | 'conflicted' | 'recovering';
}
```

UI components consume this projection and emit intent only.

## 37. Selection Reconciliation

After any committed mutation:

1. preserve current explicit selection when still valid,
2. preserve current contextual selection when context still applies,
3. prefer remaining compatible stack after placement,
4. prefer the newly collected stack after pickup when policy allows,
5. restore the last useful selection after temporary contextual override,
6. fall back to a deterministic valid slot,
7. clear selection when no valid slot exists.

## 38. Empty Stack Handling

When quantity reaches zero:

- remove the stack or mark the slot empty according to slot policy,
- release related reservations,
- invalidate stale stack references,
- reconcile selection,
- emit a committed inventory event.

An empty stack must not remain usable through cached UI state.

## 39. Persistence

Durable inventory state includes:

- inventory identity,
- owner identity,
- revision,
- capacity policy reference,
- slots and stack state,
- unique item instances,
- durable metadata.

Transient selection memory may be persisted separately when product continuity requires it.

Active reservations are normally recovered from command evidence rather than blindly restored.

## 40. Recovery

On uncertain transfer:

1. suspend conflicting mutations,
2. reload authoritative inventory and world revisions,
3. find prior transaction result by command identifier,
4. reconcile world entity and resource quantity,
5. release orphaned reservations,
6. rebuild selection from valid inventory state,
7. resume when conservation invariants hold.

## 41. Resource Conservation

For ordinary transfers:

```text
Total quantity before = Total quantity after
```

For explicit production:

```text
Total after = Total before + produced quantity
```

For explicit consumption:

```text
Total after = Total before - consumed quantity
```

Every difference must be attributable to a committed event.

## 42. Event Model

Suggested events:

- `ResourcePickupCommitted`
- `ResourcePickupRefused`
- `InventoryTransferCommitted`
- `InventoryTransferRefused`
- `ResourceReserved`
- `ResourceReservationReleased`
- `ResourceConsumed`
- `ResourceDropped`
- `ToolUsed`
- `InventorySelectionChanged`
- `InventorySelectionRestored`

Selection events are not resource mutation events.

## 43. Learning Boundary

Inventory and resource events may provide evidence about:

- counting,
- grouping,
- conservation,
- ratio and exchange,
- planning quantities,
- repeated addition,
- efficient tool choice,
- resource budgeting.

The Inventory Runtime records factual transfers and choices.

Learning systems interpret them but cannot invent quantities or bypass inventory policy.

## 44. Security and Authority

Client-side inventory projections must not be trusted as durable authority for shared or server-backed worlds.

Commands must validate:

- actor ownership,
- inventory access,
- item possession,
- quantity,
- revision,
- target world state.

Hidden UI elements are not authorization controls.

## 45. Diagnostics

Minimum diagnostics include:

- command and transaction identifiers,
- source and destination endpoints,
- item type and quantity,
- expected and resulting revisions,
- reservation lifecycle,
- refusal reason,
- selection transition reason,
- world entity consequence.

## 46. Failure Modes

The architecture prevents:

- duplicate pickup rewards,
- placement consuming an item without creating a structure,
- structure creation without resource deduction,
- stale toolbar counts,
- contextual automation erasing explicit selection,
- empty slots remaining usable,
- split or merge changing total quantity,
- drop removing inventory without creating a world resource,
- tool capability inferred only from icon state,
- uncertain commands being retried without idempotency.

## 47. Runtime Invariants

1. Every inventory has stable identity and one owner authority.
2. Every committed inventory mutation advances its revision.
3. Available quantity never includes resources reserved by another active command.
4. A resource reservation is consumed or released exactly once.
5. Ordinary transfers conserve total quantity.
6. Production and consumption require explicit committed reasons.
7. Pickup commits world removal and inventory addition consistently.
8. Placement commits inventory deduction and world creation consistently.
9. Drop commits inventory deduction and world creation consistently.
10. Selection never proves possession or quantity.
11. Explicit selection outranks contextual automation when still valid.
12. Empty or invalid stacks cannot remain active through projection cache.
13. Replayed committed commands do not apply twice.
14. Recovery restores authoritative quantity before interaction resumes.

## 48. Verification Expectations

Verification should cover:

- pickup into available capacity,
- full inventory refusal,
- partial pickup policy,
- stack merge compatibility,
- stack split conservation,
- concurrent reservation conflict,
- repeated placement while quantity remains,
- final placement empty-stack reconciliation,
- pickup tool contextual selection,
- return to placement selection after leaving pickup range,
- explicit selection protection,
- stale revision rejection,
- idempotent replay,
- drop atomicity,
- uncertain transaction recovery.

## 49. Relationship to Other Slices

- 23A defines world lifecycle and authority.
- 23B defines spatial endpoints for pickup and drop.
- 23C defines inventory owners, tools, and world resource entities.
- 23D produces pickup, placement, use, consume, and drop intents.
- 23E coordinates construction with inventory resource consumption.
- 23H may produce, transform, or decay resources through simulation.
- 23I persists inventory state and transaction evidence.
- 23J verifies resource conservation and cross-runtime atomicity.

## 50. Completion Statement

23F establishes inventory as a governed resource runtime.

Possession, selection, quantity, tools, pickup, placement, consumption, dropping, reservations, projection, and recovery now operate through explicit authority instead of toolbar-side assumptions.