# The Builder’s Valley — Vertical Slice Contract v1

**Status:** ARCHITECT DRAFT — AWAITING HUMAN APPROVAL  
**Product:** Math Learning World  
**Slice Type:** 2D Sandbox Product — First Playable Vertical Slice  
**Target Play Session:** 10–15 minutes  
**Primary Testers:** Family Alpha — learners with different ages and prior experience  
**Authority:** This contract governs the first 2D Sandbox slice. It does not replace the Product Blueprint.

---

## 1. Purpose

The Builder’s Valley must prove that Math Learning World can be a real sandbox game in which mathematical understanding grows through building, experimenting, observing consequences, and choosing tools—not through leaving the game to answer a worksheet.

The slice must answer four questions:

1. Does the player want to move, collect, build, destroy, and try again without being instructed step-by-step?
2. Can one mathematical idea emerge naturally from construction?
3. Can the system record meaningful learning evidence without labeling the learner as weak, indebted, or failed?
4. Can the game rules, learning semantics, and visual assets be separated well enough to support mass production and a future 3D client?

---

## 2. Experience Promise

> The player enters a small living valley, explores freely, gathers materials, and builds something that changes the world. When construction creates a problem of length or fit, the world offers visual tools that help the player continue building. The player remains inside the game at all times.

The slice is successful only if a learner can begin playing with minimal explanation and produce a personally meaningful structure.

---

## 3. Product Identity

This slice is:

- a 2D sandbox game;
- a small persistent world;
- a construction system with multiple valid outcomes;
- a visual learning environment;
- an evidence-producing runtime;
- the first production pattern for future mathematical mechanics.

This slice is not:

- a lesson-selection screen;
- a sequence of fixed questions;
- a disguised multiple-choice exercise;
- a level that requires one prescribed bridge design;
- a grade-placement test;
- a complete mathematics curriculum;
- a prototype of multiplayer, economy, billing, or parent analytics.

---

## 4. First World

### 4.1 World Boundary

The first world is one compact valley containing:

- a safe starting area;
- trees and loose wood;
- stone deposits;
- a shallow stream;
- two banks with several possible crossing locations;
- a small workshop or storage point;
- open ground for free construction;
- a few harmless ambient creatures;
- day lighting and lightweight environmental effects.

The world must be large enough to allow choice but small enough that a new player understands its possibilities within two minutes.

### 4.2 Perspective

The initial authority is **2D top-down / three-quarter view** with grid-based construction. Exact art style and camera scale are presentation decisions; world rules must not depend on a particular sprite sheet.

### 4.3 Persistence

The following state must survive reload:

- player position;
- inventory;
- removed resource nodes where applicable;
- placed and removed blocks;
- completed structures inferred by the runtime;
- current optional mission state;
- append-oriented evidence events or a reliable local queue.

For the Graybox, local persistence is sufficient. Online accounts and server synchronization are deferred.

---

## 5. Core Player Verbs

The Graybox must support these verbs:

| Verb | Player meaning | Minimum feedback |
| --- | --- | --- |
| Move | Explore the valley | animation and footstep cue |
| Run | Move quickly through known space | faster movement and dust cue |
| Select | Choose a hotbar item or tool | visible highlight and held-item change |
| Mine / Gather | Obtain wood or stone | impact, particles, sound, resource change |
| Pick Up | Add a world item to inventory | motion toward player and inventory feedback |
| Place | Add a block or construction part | preview, valid/invalid state, placement feedback |
| Remove | Undo or redesign construction | reversible removal and returned material policy |
| Inspect | See useful visual properties | visual overlay, not a paragraph |
| Measure | Compare a span with available parts | world-aligned measurement representation |
| Split / Join | Change usable construction units | visible conservation of the original quantity |

Walking, gathering, placing, and removing must feel understandable before mathematical adaptation is added.

---

## 6. Core Game Loop

The player may enter the loop from any point:

1. **Explore** — discover resources, spaces, and unfinished possibilities.
2. **Gather** — collect materials through direct action.
3. **Build** — place, remove, and combine parts freely.
4. **Observe** — see whether the structure reaches, aligns, supports, or functions.
5. **Use a Tool** — optionally measure, split, compare, or preview.
6. **Revise** — change the structure without punishment.
7. **Create** — leave a persistent result in the world.

There is no mandatory numbered sequence presented to the learner. Optional missions may suggest a purpose, but normal world interaction must remain available.

---

## 7. First Construction Opportunity

### 7.1 The Stream Crossing

The valley contains a stream that does not block all play. Crossing it is useful because resources or an interesting area exist on the other bank, but the player is not forced into a single bridge blueprint.

Valid player responses may include:

- building a straight bridge at one location;
- choosing a narrower part of the stream;
- using different material combinations;
- rebuilding after an inefficient attempt;
- building platforms or stepping paths;
- delaying the crossing and constructing elsewhere.

The runtime may recognize useful structures, but it must not require one visual answer.

### 7.2 Completion Meaning

A crossing is considered functional when world rules determine that a traversable connected path exists between valid bank regions. Completion is derived from world state, not from matching a screenshot.

---

## 8. First Mathematical Mechanic

### 8.1 Mechanic Authority

The first mechanic is **composition and comparison of length**. Fractions may appear as one representation of length, but the experience begins with physical fit, not symbolic calculation.

### 8.2 Natural Trigger

A mathematical opportunity occurs when, for example:

- a beam is shorter than a remaining span;
- two or more parts may compose the required span;
- a long piece can be split into reusable equal parts;
- different compositions produce the same total length;
- excess material extends beyond a support region.

These conditions are generated from actual world and construction state.

### 8.3 World Tools

The player may use:

- a measuring rope or ruler overlay;
- snap points and equal-segment markers;
- a cutting/splitting bench;
- ghost previews of candidate placements;
- grouped parts that preserve total length;
- an optional equivalence lens that highlights equal spans.

Tools must make thinking easier inside the game. The player must never be required to leave the world and calculate on a separate worksheet.

### 8.4 Symbol Policy

Symbols such as `1/2 = 2/4` are optional revelations after the player has experienced the relationship visually. Symbols must name an observed relationship; they must not gate the ability to continue playing.

---

## 9. Freedom Contract

The slice must preserve these freedoms:

- no single mandated construction design;
- no forced remediation screen;
- no lockout because a learner has not demonstrated a school grade;
- no red failure state for experimentation;
- no penalty for removing and rebuilding;
- no requirement to use the most advanced tool;
- no assumption that age determines which tool the player must use;
- no interruption of free building to display a conventional quiz.

The system may adapt which optional opportunities and tools become salient, but it may not seize control of the player’s goal.

---

## 10. Assistance Contract

Help is progressive and player-controlled:

1. **Environmental cue** — highlight a gap, support, or alignment relationship.
2. **Manipulable representation** — offer snap segments, previews, or measurement.
3. **Worked visual action** — demonstrate one possible manipulation in the world.
4. **Symbolic revelation** — show mathematical notation only after visual meaning exists.

Help must:

- keep the player in the game;
- preserve agency;
- be dismissible;
- avoid completing the entire structure automatically;
- stop escalating once the player can continue independently.

Repeated tool use is evidence for scheduling future opportunities, not proof that the player is weak.

---

## 11. Optional Mission Contract

The first optional mission may communicate:

> Create a way to reach the resource area across the stream.

Communication should use world markers, character gestures, images, and short text only when needed.

Mission rewards are world capabilities or materials, such as:

- a new construction material;
- an improved cutting tool;
- a blueprint-stamp for saving a reusable structure;
- access to a new build area.

Rewards must not be grades, intelligence scores, or competitive rank.

---

## 12. Semantic Action Contract

Visual input must be translated into stable semantic actions before becoming learning evidence.

| Raw game input | World action | Mathematical semantic candidate |
| --- | --- | --- |
| click/tap resource | gather material | none by default |
| drag/place beam | place construction part | CONNECT, COMPOSE |
| remove part | revise structure | DECOMPOSE, REVISE |
| open ruler | use measurement tool | MEASURE |
| compare preview with gap | inspect fit | COMPARE_LENGTH |
| split beam at equal marks | create equal parts | SPLIT_EQUAL |
| join adjacent parts | make composite span | COMPOSE_LENGTH |
| align endpoint to support | establish correspondence | ALIGN |

Screen coordinates, sprite names, colors, and animation IDs are not learning evidence. They are presentation details.

---

## 13. Evidence Contract

### 13.1 Evidence Philosophy

The runtime records what the player tried, which representations were used, what changed in the world, and whether understanding transferred to a later opportunity. It does not announce a debt score to the learner.

### 13.2 Minimum Event Envelope

Every evidence-capable event must include:

- `eventId`;
- `sessionId`;
- `worldId`;
- `playerId` or local anonymous identity;
- `occurredAt`;
- `eventType`;
- `worldContext`;
- `actionPayload`;
- `semanticActions` where applicable;
- `activityOpportunityId` where applicable;
- `clientVersion`;
- `schemaVersion`.

### 13.3 Required Slice Events

- `SESSION_STARTED`
- `PLAYER_MOVED`
- `RESOURCE_GATHERED`
- `HOTBAR_ITEM_SELECTED`
- `BLOCK_PREVIEWED`
- `BLOCK_PLACED`
- `BLOCK_REMOVED`
- `TOOL_OPENED`
- `LENGTH_MEASURED`
- `PART_SPLIT`
- `PARTS_COMPOSED`
- `STRUCTURE_FUNCTIONAL`
- `OPTIONAL_MISSION_ACCEPTED`
- `OPTIONAL_MISSION_COMPLETED`
- `SESSION_ENDED`

High-frequency movement events may be sampled or aggregated. Learning-relevant construction and tool events must retain meaningful order.

### 13.4 Projection Boundary

Raw events do not directly write mastery. A separate projection may infer patterns such as:

- independently composed a target length;
- used visual measurement after repeated mismatch;
- transferred equal-length composition to a new span;
- relied on a worked visual action;
- revised construction productively;
- abandoned an opportunity without implying failure.

These are confidence-bearing interpretations and must remain traceable to events.

---

## 14. Adaptive Opportunity Contract

The first slice does not diagnose a learner by grade. It adjusts future optional opportunities using observed interaction.

Examples:

- If the player composes matching lengths independently, later builds may offer more varied segment sizes.
- If the player repeatedly overfills a span, future opportunities may make comparison tools more visible.
- If a tool is used successfully, the game may offer a similar situation with less prompting.
- If the player ignores a mission, free building continues and the mission may return later in a different context.

Adaptation changes frequency, salience, representation, and support. It must not secretly reduce the entire world to a linear lesson path.

---

## 15. Runtime Boundaries

The implementation must separate:

1. **World Runtime** — movement, collision, resources, blocks, structures, persistence.
2. **Game Rules** — placement validity, material behavior, traversal, crafting/splitting.
3. **Mathematical Semantics** — measure, compare, split, compose, align, connect.
4. **Opportunity Engine** — detects situations where a mechanic may become meaningful.
5. **Evidence Recorder** — receives semantic events and stores/queues them.
6. **Learning Projection** — interprets evidence outside the rendering scene.
7. **Presentation** — sprites, particles, audio, UI, localization.

Phaser scenes or rendering components must not own mathematical truth, curriculum mapping, or learning projection logic.

---

## 16. Graybox Scope

### 16.1 Must Build

- one small tile/grid world;
- one controllable placeholder character;
- movement, run, collision, and camera follow;
- wood and stone resource collection;
- five-slot hotbar;
- placement preview;
- place and remove construction blocks;
- one stream and traversability rule;
- local save/load;
- semantic event log inspectable by the Architect;
- one functional-crossing detector;
- one visual measurement tool;
- keyboard/mouse support first, with input abstraction that does not block touch later.

### 16.2 Explicitly Defer

- polished pixel art;
- final animation and sound library;
- combat;
- survival meters;
- large procedural worlds;
- multiplayer and family co-op runtime;
- cloud save and authentication;
- parent dashboard;
- billing, credits, or economy;
- NPC dialogue system;
- crafting tree beyond what the first mechanic needs;
- full adaptive Learning Engine;
- curriculum coverage claims.

---

## 17. Human Play Protocol

The first human test must be observational.

The facilitator may say only:

> “ลองเล่นและสร้างอะไรก็ได้ในพื้นที่นี้ครับ/ค่ะ”

The facilitator must not explain controls unless the player remains blocked after the predefined observation window.

Observe:

- time to first movement;
- time to first resource interaction;
- time to first placement;
- whether the player discovers removal;
- whether the player forms a personal goal;
- whether the stream creates curiosity rather than confusion;
- whether visual tools are discovered and understood;
- whether the player revises after mismatch;
- whether the player wants to continue or return;
- spoken comments, frustration, delight, and requests.

No conclusion about mathematical ability may be drawn from one session.

---

## 18. Definition of Done

The Graybox Vertical Slice is complete only when:

1. A fresh user can enter the world and perform the core verbs without a tutorial paragraph.
2. The player can gather, place, remove, and save a personally chosen construction.
3. At least two structurally different functional crossings are possible.
4. Construction fit is governed by one consistent length model.
5. A player can solve a fit problem through visual tools without external calculation.
6. Symbols are optional and never gate construction.
7. Reload restores the relevant world and inventory state.
8. The event log reconstructs the meaningful construction sequence.
9. Rendering assets can be replaced without changing mathematical semantics.
10. No conventional quiz or mandatory linear lesson appears.
11. Both family testers can complete or meaningfully engage with the slice despite different ages.
12. At least one tester voluntarily continues building after the optional mission objective is already achievable or complete.

---

## 19. Failure Conditions

The slice fails Product Meaning Gate if any of the following occurs:

- the player is taken to a separate exercise screen;
- only one prescribed bridge counts as correct;
- mathematical evidence is inferred from color, asset, or screen position alone;
- a school-grade label determines which world action is permitted;
- repeated attempts trigger payment or a negative learner label;
- the visual tool supplies an answer without preserving player action;
- the construction loop is not enjoyable without rewards;
- the game cannot explain which events support a learning projection;
- art polish hides weak movement, placement, or world feedback.

---

## 20. Delivery Sequence

After this contract is approved:

1. Audit the current frontend and identify reusable domain/evidence code from Fraction Bridge.
2. Decide whether to evolve the existing Phaser frontend or create an isolated sandbox runtime entry point.
3. Lock world grid, coordinate, tile, and input contracts.
4. Implement movement/collision/camera Graybox.
5. Implement gather/inventory/hotbar.
6. Implement place/remove/save/load.
7. Implement functional-crossing detection.
8. Add length semantics and one visual tool.
9. Add evidence event envelope and inspectable log.
10. Run the first silent human play test.
11. Correct interaction before commissioning production pixel art.

Each implementation step receives one bounded Command Pack. Verification is proportional to the change and does not rerun every expensive verifier by default.

---

## 21. Approval Record

Human approval must confirm:

- the 2D Sandbox product direction;
- the 10–15 minute first-session promise;
- composition/comparison of length as the first mathematical mechanic;
- freedom from mandatory grade placement and conventional quizzes;
- Graybox before production art;
- local persistence before online platform integration;
- the Definition of Done and failure conditions.

Once approved, this document becomes the Slice Authority for implementation.
