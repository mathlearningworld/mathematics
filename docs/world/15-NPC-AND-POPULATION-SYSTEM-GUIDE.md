# 15 — NPC & Population System Guide

## Document identity

- **Document:** `15-NPC-AND-POPULATION-SYSTEM-GUIDE.md`
- **World slice:** Builder's Valley
- **System:** NPC & Population
- **Status:** Production foundation
- **Authority level:** Parent architecture and production contract for Phase 15
- **Applies to:** Game design, world design, AI, gameplay engineering, narrative systems, technical art, audio, QA, analytics, and live operations
- **Depends on:** Builder's Valley world and environment documentation, including Phase 14 and 14A–14J
- **Child documents:** 15A–15J

---

# 1. Purpose

This guide defines the parent architecture for all non-player inhabitants, workers, learners, mentors, merchants, visitors, animals, and simulated population activity inside Builder's Valley.

The system must make the world feel inhabited, understandable, responsive, and educationally meaningful without turning every NPC into an expensive full simulation.

This document establishes the shared language, invariants, ownership boundaries, lifecycle, simulation tiers, persistence rules, interaction contracts, validation expectations, and production gates that every Phase 15 child document must follow.

The child documents may add implementation detail, but they must not redefine the fundamental population model established here.

---

# 2. Core outcome

The NPC and population system succeeds when the player experiences Builder's Valley as a coherent living community where:

- inhabitants appear to belong to the world;
- daily activity is readable and purposeful;
- NPC roles support learning, construction, trade, guidance, and social progression;
- the world responds to player actions;
- repeated encounters remain consistent enough to build trust;
- simulation cost stays within runtime budgets;
- population activity never obstructs core learning interaction;
- narrative, economy, quests, reputation, and events can build on one shared population authority.

The target is not maximum simulation complexity.

The target is **maximum meaningful life per unit of production and runtime cost**.

---

# 3. Population doctrine

## 3.1 The world is a community, not a crowd

NPC quantity alone does not create life. Population must express relationships between place, role, schedule, need, and player activity.

A smaller population with clear purpose is preferred over a large population with random motion.

## 3.2 Meaning before motion

An NPC should not move merely because an idle world looks empty. Movement must communicate one or more of the following:

- destination;
- occupation;
- social intent;
- response to an event;
- environmental need;
- gameplay availability;
- world-state consequence.

## 3.3 Readability before realism

NPC behavior should be legible to children and adults without requiring heavy dialogue.

When realism conflicts with clarity, clarity wins unless realism is essential to the learning objective.

## 3.4 Simulation is layered

Only NPCs close to the player or directly relevant to active gameplay receive high-fidelity simulation.

Distant or inactive population is represented through lower-cost state updates, aggregate counts, scheduled transitions, or authored world signals.

## 3.5 Persistence must preserve meaning

The system should persist relationships, commitments, profession state, reputation, learning relevance, quest state, and major schedule consequences.

It should not persist meaningless transient details such as exact idle pose, minor path detours, or every ambient reaction.

## 3.6 The player must never feel punished by invisible simulation

Critical opportunities, educational guidance, essential services, or progression requirements must not disappear because an NPC happened to be sleeping, off-screen, blocked, or unloaded.

The system must provide fallback availability rules.

## 3.7 Population supports the learning world

NPCs are not decorative extras. They may serve as:

- mentors;
- learners;
- collaborators;
- clients;
- workers;
- evaluators;
- merchants;
- witnesses;
- event participants;
- examples of mathematical behavior in context.

NPC activity should reinforce understanding through action, observation, and consequence rather than excessive exposition.

---

# 4. Scope

This phase governs:

- population composition;
- residency and visitor models;
- identity and archetypes;
- NPC roles and professions;
- schedules and routines;
- activity selection;
- needs and priorities;
- world-event participation;
- interaction availability;
- conversation entry conditions;
- reputation projection;
- merchant presence;
- mentor and learner presence;
- spawn, activation, deactivation, and despawn;
- simulation fidelity;
- pathing expectations;
- crowd and occupancy limits;
- persistence and recovery;
- debugging and observability;
- validation and release authority.

This parent guide does not fully define:

- quest content;
- final economy balancing;
- final dialogue writing;
- multiplayer authority;
- save-file implementation details;
- live event operations;
- combat AI;
- advanced emotional simulation.

Those systems may consume population contracts but must not silently override them.

---

# 5. Phase 15 document map

The parent guide is implemented through the following production documents:

| Document | Authority |
|---|---|
| **15** | NPC and population architecture, doctrine, shared contracts, lifecycle, and system boundaries |
| **15A** | Population distribution, density, residency, placement, occupancy, and regional composition |
| **15B** | Daily schedules, routines, temporal transitions, availability windows, and fallback behavior |
| **15C** | NPC roles, identity, archetypes, responsibilities, and gameplay-facing capabilities |
| **15D** | Profession system, work sites, production behavior, expertise, tools, and profession progression |
| **15E** | Merchant presence, service availability, inventory projection, trade behavior, and economy integration |
| **15F** | Conversation entry rules, dialogue availability, contextual prompts, interruption, and recovery |
| **15G** | Interaction rules, proximity, focus, priority, animation handoff, refusal, and completion |
| **15H** | Reputation projection, social memory, trust states, consequences, and relationship visibility |
| **15I** | Event participation, gathering, emergency response, celebration, work events, and learning events |
| **15J** | Final population validation, evidence package, failure classification, acceptance, and release gate |

Every child document must explicitly reference this parent guide and identify any deliberate exception.

---

# 6. Population taxonomy

## 6.1 Resident NPC

A persistent inhabitant with a stable home region, identity, role, schedule, and relationship state.

Residents are the strongest source of continuity and should be reused across learning, profession, social, and event systems.

## 6.2 Worker NPC

An NPC whose primary visible activity is tied to a profession, work site, service, production chain, maintenance task, or construction activity.

A worker may also be a resident, mentor, merchant, or event participant.

## 6.3 Mentor NPC

An NPC authorized to guide, demonstrate, diagnose, scaffold, or confirm learning activity.

Mentors must not replace the player's agency. They should reveal structure, offer hints, demonstrate process, or support reflection.

## 6.4 Learner NPC

An NPC who practices, struggles, collaborates, asks questions, or demonstrates progression.

Learner NPCs help normalize mistakes and make mathematical development visible inside the world.

## 6.5 Merchant NPC

An NPC who exposes trade, exchange, crafting service, tool service, resource access, or economic explanation.

Merchant behavior must remain compatible with the economy system while preserving reliable access to essential gameplay functions.

## 6.6 Service NPC

An NPC who provides a non-merchant function such as registration, transport, repair, storage, training access, event management, or world navigation.

## 6.7 Visitor NPC

A temporary inhabitant whose presence is tied to time, events, region conditions, player progress, seasonal activity, or authored encounters.

Visitors may use lighter persistence than residents.

## 6.8 Ambient NPC

A low-authority population actor whose main purpose is environmental life, occupancy, visual context, or social atmosphere.

Ambient NPCs must never hold unique progression authority unless promoted to a persistent identity.

## 6.9 Event NPC

An NPC activated or reconfigured by a world event, ceremony, market, lesson, emergency, celebration, or community project.

## 6.10 Animal population

Non-human inhabitants governed by simplified habitat, movement, reaction, and occupancy rules.

Animals must remain distinct from human role and profession systems, while sharing compatible simulation-tier and world-activation infrastructure where practical.

## 6.11 System-critical NPC

An NPC whose function is required for progression, recovery, education, or access to a core service.

System-critical NPCs require explicit availability fallback and cannot depend solely on ambient simulation.

---

# 7. Identity model

Every persistent NPC must have a stable identity key.

Recommended minimum identity contract:

```ts
interface NpcIdentity {
  npcId: string;
  displayNameKey: string;
  populationCategory: PopulationCategory;
  homeRegionId: string | null;
  archetypeId: string;
  primaryRoleId: string;
  professionId: string | null;
  persistenceClass: PersistenceClass;
  systemCritical: boolean;
}
```

Identity is separate from presentation.

Changing an outfit, animation set, current role state, or location must not produce a new identity unless the design explicitly creates a different individual.

Identity must remain stable across:

- save and load;
- scene unload and reload;
- schedule transitions;
- event participation;
- temporary profession changes;
- quality levels;
- localization;
- visual LOD changes.

---

# 8. Archetype model

Archetypes provide reusable production defaults without erasing individual identity.

An archetype may define:

- body and presentation family;
- default movement set;
- default social posture;
- common schedule template;
- common role capabilities;
- default voice or vocalization family;
- interaction radius;
- navigation preferences;
- simulation cost class;
- typical profession compatibility;
- baseline reaction profile.

Archetypes must not directly own persistent relationship state, unique quest state, or individual progression.

An NPC instance may override archetype defaults through explicit authored data.

---

# 9. Role model

A role describes what an NPC is authorized to do in gameplay.

Examples:

- builder;
- farmer;
- carpenter;
- merchant;
- mentor;
- learner;
- event steward;
- workshop keeper;
- transporter;
- surveyor;
- craft specialist;
- village coordinator.

Roles must be capability-based rather than purely cosmetic.

Recommended capability contract:

```ts
interface NpcRoleCapabilitySet {
  canOfferConversation: boolean;
  canOfferLearningSupport: boolean;
  canTrade: boolean;
  canJoinWorkActivity: boolean;
  canJoinEvent: boolean;
  canIssueTask: boolean;
  canReceiveTaskResult: boolean;
  canDemonstrate: boolean;
  canEvaluate: boolean;
  canProvideService: boolean;
}
```

An NPC may have multiple roles, but one role must be designated as the current primary projection for readability.

---

# 10. Profession model

Profession defines long-duration work identity and production behavior.

A profession may specify:

- work sites;
- working hours;
- tools;
- resources;
- visible outputs;
- expertise tier;
- service capability;
- work animation family;
- environmental dependencies;
- teaching opportunities;
- profession-specific events.

Profession is not identical to role.

For example, a carpenter profession may project the roles of worker, merchant, mentor, and quest participant depending on context.

Profession simulation must support both:

1. **authored visible work** near the player;
2. **abstract work resolution** when the NPC is not actively simulated.

---

# 11. Population state model

Recommended high-level state:

```ts
interface NpcRuntimeState {
  npcId: string;
  lifecycleState: NpcLifecycleState;
  simulationTier: SimulationTier;
  currentRegionId: string;
  currentAnchorId: string | null;
  currentActivityId: string | null;
  currentRoleId: string;
  scheduleSegmentId: string | null;
  interactionState: InteractionState;
  eventId: string | null;
  lastMeaningfulUpdateAt: number;
}
```

Persistent state and runtime state must remain separate.

Runtime state may be reconstructed.

Persistent state must preserve player-facing consequences.

---

# 12. NPC lifecycle

The canonical lifecycle is:

```text
REGISTERED
  -> ELIGIBLE
  -> SCHEDULED
  -> ACTIVATING
  -> ACTIVE
  -> SUSPENDED
  -> DEACTIVATING
  -> ABSTRACTED
  -> ACTIVE
```

Optional terminal or exceptional states:

```text
DISABLED
RETIRED
REMOVED
RECOVERING
```

## 12.1 REGISTERED

Identity and population data exist, but the NPC is not yet available to world simulation.

## 12.2 ELIGIBLE

World, progression, region, and event conditions allow the NPC to participate.

## 12.3 SCHEDULED

The schedule authority has resolved the NPC's intended activity, region, and time window.

## 12.4 ACTIVATING

Assets, runtime state, location, navigation, and presentation are being prepared.

## 12.5 ACTIVE

The NPC is represented in the world with an appropriate simulation tier.

## 12.6 SUSPENDED

The NPC remains present but normal activity is temporarily paused by interaction, cutscene, emergency, event authority, loading, or conflict resolution.

## 12.7 DEACTIVATING

The NPC is leaving high-fidelity world representation safely.

## 12.8 ABSTRACTED

The NPC continues to exist and progress through low-cost simulation without a fully instantiated world actor.

## 12.9 RECOVERING

The runtime detected invalid location, missing anchor, navigation failure, conflicting authority, or incomplete transition and is restoring a safe state.

No NPC may jump directly between arbitrary states without a declared transition rule.

---

# 13. Simulation tiers

## Tier 0 — Narrative or system authority

Reserved for NPCs currently required by active progression, learning, critical service, or authored sequence.

Characteristics:

- strongest availability guarantee;
- full interaction authority;
- protected from ambient despawn;
- explicit recovery behavior;
- highest observability.

## Tier 1 — Near-field active

NPCs within the player's meaningful interaction area.

Characteristics:

- full locomotion;
- local avoidance;
- animation state;
- perception of nearby events;
- contextual interaction;
- frequent updates.

## Tier 2 — Mid-field visible

NPCs visible or regionally relevant but outside immediate interaction range.

Characteristics:

- simplified locomotion;
- reduced perception;
- limited reaction set;
- lower update frequency;
- coarse path correction.

## Tier 3 — Far-field representative

NPCs used to imply population beyond direct interaction.

Characteristics:

- low-frequency movement;
- simplified animation;
- no expensive local reasoning;
- no unique interaction authority;
- replaceable by crowd proxies when appropriate.

## Tier 4 — Abstracted

No instantiated world actor.

Characteristics:

- schedule progression through data;
- profession output through aggregate rules;
- event attendance through state membership;
- location represented by region or anchor;
- transitions resolved without full path simulation.

Simulation tier selection must be deterministic enough for debugging and stable enough to avoid visible popping or contradictory behavior.

---

# 14. Population authority hierarchy

When multiple systems request control of an NPC, authority resolves in this order:

1. safety and recovery;
2. critical learning sequence;
3. critical progression or service availability;
4. explicit player interaction;
5. active authored event;
6. profession task;
7. daily schedule;
8. ambient activity;
9. idle behavior.

A lower authority may request participation but may not steal control from a higher authority.

Every authority transfer must define:

- request source;
- reason;
- start condition;
- interruption policy;
- completion condition;
- restoration destination;
- failure fallback.

---

# 15. Schedule architecture

Schedules should describe intent, not micromanage every second.

A schedule segment should specify:

- time window;
- preferred region;
- preferred anchor or anchor category;
- activity class;
- role projection;
- priority;
- interruptibility;
- fallback activity;
- essential availability override;
- event compatibility.

Recommended model:

```ts
interface NpcScheduleSegment {
  segmentId: string;
  startMinute: number;
  endMinute: number;
  activityClass: string;
  preferredRegionId: string;
  preferredAnchorTag: string | null;
  priority: number;
  interruptPolicy: InterruptPolicy;
  fallbackSegmentId: string | null;
}
```

Schedules must tolerate:

- missed transitions;
- delayed loading;
- blocked paths;
- player interaction;
- event override;
- save/load in the middle of a segment;
- time skipping;
- region unloading;
- absence of the preferred anchor.

The NPC should resolve to a meaningful current state rather than replay every missed movement.

---

# 16. Activity architecture

Activities are reusable behavioral units such as:

- travel;
- work;
- practice;
- teach;
- trade;
- rest;
- eat;
- socialize;
- observe;
- gather;
- repair;
- carry;
- inspect;
- celebrate;
- wait for player;
- participate in lesson;
- recover from invalid state.

Each activity must define:

- eligibility;
- required capability;
- required anchor;
- required assets;
- start behavior;
- active loop;
- interruption behavior;
- completion behavior;
- failure behavior;
- abstract-resolution behavior;
- evidence hooks.

Activities must not directly mutate unrelated systems without going through declared contracts.

---

# 17. Anchor system

NPCs should navigate toward semantic anchors rather than raw coordinates whenever possible.

Anchor examples:

- home entrance;
- bed;
- workbench;
- merchant counter;
- teaching position;
- learner position;
- gathering point;
- queue position;
- stage marker;
- rest spot;
- observation point;
- event seat;
- emergency safe point.

Anchor contract:

```ts
interface PopulationAnchor {
  anchorId: string;
  regionId: string;
  tags: string[];
  capacity: number;
  reservationPolicy: ReservationPolicy;
  accessibilityClass: string;
  fallbackAnchorIds: string[];
}
```

Anchors must declare capacity. Two NPCs must not silently occupy the same exclusive anchor.

When no valid anchor exists, the NPC must select a declared fallback or enter recovery.

---

# 18. Spawn and activation rules

Persistent NPCs are not conceptually spawned from nothing. They are activated into a world representation.

Activation must consider:

- current abstract region;
- schedule intent;
- player distance;
- line of sight;
- camera direction;
- event authority;
- system-critical status;
- anchor availability;
- navigation validity;
- density budget;
- platform quality level.

Visible pop-in near the player is unacceptable unless explicitly masked by a doorway, transport arrival, crowd transition, visual effect, or authored event.

NPC activation must never occur:

- inside player collision;
- inside invalid geometry;
- on inaccessible surfaces;
- in a reserved cinematic lane;
- at an occupied exclusive anchor;
- in a way that blocks required gameplay.

---

# 19. Deactivation and despawn rules

Deactivation must preserve meaningful state before removing the world actor.

The system must capture at minimum:

- resolved region;
- intended destination or activity;
- active authority owner;
- interaction safety;
- event membership;
- schedule segment;
- persistent consequence state.

An NPC cannot deactivate while:

- actively interacting with the player;
- holding a critical quest handoff;
- demonstrating an active learning step;
- carrying an unresolved required object;
- being observed in a protected authored sequence;
- participating in a non-interruptible event segment.

Ambient NPCs may be removed more aggressively, but the result must not create obvious disappearance in the player's view.

---

# 20. Navigation contract

NPC navigation must be robust before it is sophisticated.

Required behavior:

- choose valid destinations;
- reserve constrained anchors;
- tolerate short-term blockage;
- detect stalled movement;
- attempt bounded recovery;
- avoid permanent crowd deadlock;
- respect gameplay lanes;
- preserve interaction approach space;
- avoid pushing the player during learning interactions.

Navigation recovery order:

1. local replanning;
2. wait with bounded timeout;
3. alternate approach point;
4. alternate anchor;
5. abstract transition when not visible;
6. safe relocation under recovery authority;
7. disable and report if no valid state exists.

Repeated teleport correction in view is a release-blocking symptom unless explicitly authored.

---

# 21. Interaction availability

Every interactable NPC must expose a clear state:

- available;
- busy but interruptible;
- busy and unavailable;
- waiting for player;
- temporarily disabled;
- service available through fallback;
- recovering.

Availability must be communicated through consistent presentation such as posture, icon, prompt, queue state, location, or animation.

The player should not need to guess why an interaction failed.

System-critical NPCs require one or more fallback mechanisms:

- schedule override;
- summon or call interaction;
- alternate NPC with equivalent capability;
- service object;
- remote interaction;
- automatic appointment;
- event-independent access point.

---

# 22. Conversation boundary

Conversation is a consumer of population state, not the owner of NPC identity or schedule.

The conversation system may:

- request temporary control;
- face the player;
- suspend current activity;
- select context;
- project role and relationship state;
- complete with a declared consequence.

It must return control cleanly to the previous authority or an explicitly resolved next activity.

Conversation must handle:

- player walking away;
- world event escalation;
- save/load;
- missing voice assets;
- unavailable localization;
- duplicate interaction input;
- NPC schedule transition during dialogue.

---

# 23. Learning integration

NPC participation in learning must preserve pedagogical intent.

Possible learning functions:

- demonstrate a process;
- model a misconception;
- ask a meaningful question;
- provide a hint;
- observe player action;
- confirm evidence;
- collaborate on construction;
- compare strategies;
- celebrate mastery;
- redirect to prerequisite practice.

Rules:

- NPC guidance must not solve the task before the player has a meaningful chance to act;
- dialogue must not replace spatial or graphical explanation where interaction can teach more clearly;
- repeated mistakes should produce progressively useful support;
- support level should be recoverable and observable;
- learning-critical behavior must have deterministic completion conditions;
- mentor availability must not depend on fragile ambient schedules.

---

# 24. Social and relationship model

Relationships should be represented as meaningful, bounded state rather than unrestricted emotional simulation.

Possible dimensions:

- familiarity;
- trust;
- respect;
- gratitude;
- professional confidence;
- mentorship bond;
- community standing.

Relationship state must change only through declared events.

Recommended event contract:

```ts
interface NpcRelationshipEvent {
  eventId: string;
  npcId: string;
  playerId: string;
  eventType: string;
  magnitude: number;
  sourceSystem: string;
  occurredAt: number;
  correlationId: string;
}
```

Visual and behavioral projection must remain understandable and should not expose raw numbers unless the product design explicitly requires them.

---

# 25. Reputation boundary

Population may consume reputation and project consequences, but the reputation system owns durable reputation calculation.

NPC-facing reputation effects may include:

- greeting style;
- willingness to teach;
- service priority;
- event invitation;
- trade option availability;
- trust-based task access;
- social acknowledgment;
- skepticism or caution.

Critical educational access must not be permanently blocked by reputation.

---

# 26. Merchant and service boundary

Merchant NPCs project service access, but the economy system owns prices, transactions, currency, and durable inventory authority.

Population owns:

- presence;
- current service posture;
- interaction entry;
- visual work activity;
- queue behavior;
- schedule and fallback availability.

Economy owns:

- item authority;
- price authority;
- transaction validation;
- balance mutation;
- purchase result;
- durable stock state.

A merchant animation must never imply a completed transaction before the economy authority confirms it.

---

# 27. Event participation

Events may temporarily reorganize population behavior.

Event participation must define:

- eligible NPCs;
- required roles;
- target attendance;
- assembly locations;
- arrival window;
- participation activity;
- interruption policy;
- departure behavior;
- absence fallback;
- system-critical replacements;
- post-event restoration.

The event system may not permanently overwrite an NPC's home, profession, identity, or relationship state unless the event explicitly emits a durable transition.

---

# 28. Crowd and density principles

Population density must support readability and performance.

Density should respond to:

- region purpose;
- time of day;
- active event;
- player progression;
- device quality level;
- navigation capacity;
- interaction need;
- visual composition.

Hard crowd rules:

- preserve clear player movement lanes;
- preserve readable learning spaces;
- avoid covering interaction objects;
- avoid blocking camera framing;
- cap simultaneous local avoidance actors;
- prevent endless queue growth;
- use aggregate or proxy representation for excess population.

Crowd reduction at lower quality levels must preserve important named NPCs and event meaning.

---

# 29. Presentation rules

NPC presentation must communicate role and state through multiple signals:

- silhouette;
- clothing or equipment;
- location;
- activity;
- animation;
- prop usage;
- iconography;
- sound;
- interaction prompt;
- relationship response.

No single color cue should carry all meaning.

Named and system-critical NPCs must remain visually distinguishable at practical gameplay distance.

Animation must not contradict authority state. An NPC marked available should not appear deeply asleep, fleeing, or engaged in non-interruptible work.

---

# 30. Audio rules

Population audio includes:

- footsteps;
- work sounds;
- vocal reactions;
- greetings;
- crowd beds;
- profession-specific sounds;
- event participation;
- interaction confirmation;
- failure or refusal cues.

Audio density must scale independently from visual density where needed.

Repeated vocal lines require cooldowns and variation.

Crowd audio must not mask learning instructions, feedback, or important interaction cues.

---

# 31. Persistence classes

## P0 — Critical persistent

Used for system-critical named NPCs, major mentors, major relationship actors, and progression authorities.

Persist:

- identity;
- major role state;
- relationship state;
- profession state;
- progression commitments;
- event commitments;
- major location meaning;
- unresolved handoffs.

## P1 — Standard persistent

Used for recurring residents and workers.

Persist:

- identity;
- home region;
- profession;
- schedule template;
- relationship summary;
- major world-state consequences.

## P2 — Session persistent

Used for visitors or event actors that should remain consistent during a play session or event window.

## P3 — Ephemeral

Used for ambient population with no unique durable authority.

Ephemeral NPCs must not receive unique quest, relationship, or progression responsibility.

---

# 32. Save, load, and time-skip behavior

On load, the population system must reconstruct the meaningful present, not replay all missed simulation.

Required load sequence:

1. restore persistent NPC records;
2. resolve current world time;
3. resolve schedule segment;
4. apply durable event overrides;
5. apply progression and service requirements;
6. resolve abstract location;
7. select simulation tier;
8. activate only required world actors;
9. run consistency validation;
10. expose recovery telemetry.

Time skip must:

- complete or cancel incompatible interactions safely;
- advance schedules deterministically;
- resolve abstract profession outputs through owned systems;
- update event attendance;
- preserve critical availability;
- avoid visible mass teleportation when control returns.

---

# 33. Failure recovery

Common failure categories:

- missing anchor;
- invalid region;
- blocked navigation;
- duplicate identity;
- conflicting authority;
- unavailable required asset;
- schedule gap;
- event restoration failure;
- interaction lock;
- merchant service unavailable;
- mentor unavailable;
- persistence mismatch;
- animation state mismatch;
- excessive density;
- repeated activation churn.

Recovery must prefer a safe meaningful state over strict simulation continuity.

The system must never silently delete a critical NPC to hide an error.

---

# 34. Observability

Production builds should expose structured population telemetry appropriate to the platform and environment.

Minimum diagnostics:

- active NPC count by tier;
- abstract NPC count;
- activation and deactivation rate;
- authority owner by NPC;
- current schedule segment;
- current activity;
- current anchor;
- navigation stall count;
- recovery count;
- interaction availability;
- event membership;
- density budget usage;
- simulation update cost;
- system-critical NPC availability.

Recommended debug commands or views:

- inspect NPC identity;
- inspect authority stack;
- force schedule transition;
- show anchors and capacity;
- show simulation tiers;
- show path intent;
- abstract or activate selected NPC;
- validate all critical NPCs;
- simulate time skip;
- report population inconsistencies.

---

# 35. Performance principles

The population system must comply with the Phase 14I performance authority.

Specific rules:

- high-frequency reasoning is limited to near-field relevant NPCs;
- perception checks are budgeted and staggered;
- path requests are rate-limited;
- animation complexity scales by tier;
- local avoidance actor count is capped;
- distant NPCs use simplified movement or proxies;
- abstract simulation uses batched updates;
- schedule transitions avoid synchronized spikes;
- audio emitters are pooled or virtualized;
- outfit and material variety must respect draw-call budgets;
- system-critical NPCs receive priority without removing global caps.

Performance degradation must reduce fidelity before reducing meaning.

---

# 36. Determinism and reproducibility

The system does not need perfect deterministic simulation across all hardware, but critical behavior must be reproducible.

Deterministic domains include:

- identity;
- eligibility;
- current schedule resolution;
- authority priority;
- system-critical availability;
- interaction completion;
- durable relationship events;
- event membership;
- save/load restoration.

Ambient variations may use seeded randomness.

Random choice must not control whether the player can access required learning, progression, or service functionality.

---

# 37. Data ownership boundaries

| Data | Owning system |
|---|---|
| NPC identity | Population |
| NPC lifecycle | Population |
| Schedule intent | Population / Schedule child authority |
| Current activity | Population |
| Navigation runtime | Navigation |
| Dialogue content | Conversation/Narrative |
| Conversation availability projection | Population + Conversation contract |
| Quest state | Quest |
| Reputation score | Reputation |
| NPC reputation response | Population projection |
| Prices and transactions | Economy |
| Profession identity | Population/Profession |
| Profession production result | Profession or economy authority |
| Learning mastery | Learning system |
| Mentor participation | Population + Learning contract |
| Event definition | Event system |
| NPC event membership | Event + Population contract |
| Visual assets | Character/Art pipeline |
| Animation graph | Animation system |
| Audio content | Audio system |

No child document may move durable authority between systems without an explicit architecture decision.

---

# 38. Public contract expectations

The implementation should expose explicit commands, queries, and events rather than allowing arbitrary direct mutation.

Illustrative commands:

```ts
ActivateNpc
DeactivateNpc
RequestNpcAuthority
ReleaseNpcAuthority
StartNpcInteraction
CompleteNpcInteraction
InterruptNpcActivity
AssignNpcToEvent
RemoveNpcFromEvent
AdvancePopulationTime
RecoverNpcState
```

Illustrative queries:

```ts
GetNpcIdentity
GetNpcAvailability
GetNpcCurrentActivity
GetNpcCurrentLocation
GetNpcRoleCapabilities
GetRegionPopulation
GetCriticalNpcStatus
GetPopulationBudgetStatus
```

Illustrative events:

```ts
NpcActivated
NpcAbstracted
NpcActivityStarted
NpcActivityCompleted
NpcAuthorityChanged
NpcInteractionStarted
NpcInteractionCompleted
NpcScheduleSegmentChanged
NpcJoinedEvent
NpcLeftEvent
NpcRecoveryApplied
CriticalNpcUnavailable
```

Contracts should carry correlation identifiers where cross-system tracing is required.

---

# 39. Production workflow

Phase 15 should follow this sequence:

1. approve this parent guide;
2. define population distribution in 15A;
3. define schedule authority in 15B;
4. define roles in 15C;
5. define professions in 15D;
6. define merchants and services in 15E;
7. define conversation rules in 15F;
8. define interaction rules in 15G;
9. define reputation projection in 15H;
10. define event participation in 15I;
11. execute final validation in 15J.

Each document should produce:

- scope;
- doctrine;
- data contracts;
- runtime rules;
- ownership boundaries;
- edge cases;
- validation matrix;
- evidence requirements;
- exit criteria.

---

# 40. Validation layers

## 40.1 Document validation

Confirms that child documents align with this parent architecture and do not contradict one another.

## 40.2 Data validation

Confirms that identities, roles, schedules, anchors, professions, and persistence classes are complete and valid.

## 40.3 Runtime validation

Confirms lifecycle transitions, activation, abstraction, navigation recovery, interaction availability, and authority handoff.

## 40.4 Gameplay validation

Confirms that population activity supports movement, learning, construction, interaction, quests, trade, and events.

## 40.5 Visual validation

Confirms role readability, density, presentation, animation consistency, and world composition.

## 40.6 Performance validation

Confirms tier budgets, update cost, pathing load, crowd density, memory, animation, and audio cost.

## 40.7 Persistence validation

Confirms save/load, time skip, event restoration, relationship continuity, and critical NPC availability.

## 40.8 Accessibility validation

Confirms that role, availability, and interaction meaning are not communicated through a single inaccessible signal.

---

# 41. Parent acceptance matrix

The Phase 15 parent architecture is acceptable only when all statements below are true.

| Area | Acceptance condition |
|---|---|
| Identity | Persistent NPC identity remains stable across runtime transitions |
| Population categories | Every NPC belongs to a declared category and persistence class |
| Roles | Gameplay capabilities are explicit and queryable |
| Profession | Work behavior can resolve visibly or abstractly |
| Lifecycle | Activation, suspension, abstraction, and recovery transitions are declared |
| Simulation | Fidelity tiers reduce cost without removing critical meaning |
| Schedule | Time resolution tolerates missed transitions and time skip |
| Authority | Competing systems resolve through one priority hierarchy |
| Anchors | Occupancy and fallback behavior are explicit |
| Navigation | Stalls and invalid destinations have bounded recovery |
| Interaction | Availability is understandable and system-critical access is protected |
| Learning | NPC support preserves player agency and pedagogical intent |
| Economy | Merchant presence does not own transaction authority |
| Reputation | Population projects social consequence without owning reputation calculation |
| Events | Temporary participation restores normal state safely |
| Persistence | Meaningful consequences survive save/load |
| Performance | Population complies with 14I budgets and quality scaling |
| Validation | Child documents can be tested against objective gates |

---

# 42. Failure classification

Phase 15 uses these parent failure classes:

## P15-ARCH

Architecture contradiction, undefined ownership, or invalid cross-system authority.

## P15-ID

Duplicate, unstable, missing, or incorrectly replaced NPC identity.

## P15-LIFE

Invalid lifecycle transition, activation churn, failed abstraction, or unsafe deactivation.

## P15-SCHED

Schedule gap, wrong time resolution, failed restoration, or critical availability conflict.

## P15-AUTH

Conflicting authority, stuck ownership, interruption failure, or lost restoration target.

## P15-NAV

Invalid destination, repeated stall, crowd deadlock, unsafe relocation, or blocked gameplay lane.

## P15-INT

Interaction unavailable without explanation, interaction lock, duplicate completion, or broken handoff.

## P15-LEARN

NPC behavior undermines the learning objective, removes agency, gives incorrect guidance, or blocks required support.

## P15-PERSIST

Save/load mismatch, lost relationship consequence, incorrect event restoration, or missing critical NPC.

## P15-PERF

Population exceeds runtime budget, causes frame spikes, pathing overload, animation overload, memory pressure, or audio density failure.

## P15-PRESENT

Role, availability, identity, or activity is visually or audibly misleading.

## P15-EVENT

Failed event attendance, duplicate participation, restoration failure, or essential-role absence.

---

# 43. Severity model

## Blocker

Prevents progression, corrupts persistence, removes a critical NPC, breaks learning authority, causes crash, or makes the world state unrecoverable.

## Critical

Frequently blocks interaction, produces major simulation contradiction, causes severe performance instability, or breaks event restoration.

## Major

Damages readability, consistency, schedule behavior, role projection, or population density in a clearly player-visible way.

## Minor

Localized presentation, timing, animation, or ambient behavior issue without major gameplay impact.

## Observation

Potential improvement or risk that does not currently violate acceptance criteria.

No Blocker or Critical issue may remain open at Phase 15 release.

Major issues require explicit disposition by final validation authority.

---

# 44. Evidence expectations

Every child phase should contribute evidence to the final 15J package.

Expected evidence includes:

- document cross-reference map;
- population roster and category report;
- role capability matrix;
- schedule coverage report;
- anchor capacity validation;
- lifecycle transition tests;
- authority handoff tests;
- interaction availability tests;
- navigation stall and recovery tests;
- save/load and time-skip tests;
- critical NPC availability tests;
- event participation tests;
- reputation projection tests;
- mentor and learner behavior tests;
- density and crowd captures;
- performance captures by quality level;
- failure injection evidence;
- unresolved issue register;
- final sign-off record.

Evidence must demonstrate actual system behavior where runtime implementation exists. Documentation alone cannot certify runtime completion.

---

# 45. Parent exit criteria

This parent phase is complete when:

- the architecture is committed to the authoritative branch;
- all child documents can reference a stable parent contract;
- population categories are defined;
- lifecycle and simulation tiers are defined;
- authority priority is defined;
- identity, role, profession, schedule, interaction, event, reputation, and merchant boundaries are defined;
- persistence classes are defined;
- recovery and observability expectations are defined;
- validation and failure frameworks are defined;
- no known contradiction exists with Phase 14 environment and performance authority.

Completion of this guide does not mean the whole NPC and population system is production-complete.

It means Phase 15 has a valid parent architecture from which 15A–15J may proceed.

---

# 46. Final authority statement

`15-NPC-AND-POPULATION-SYSTEM-GUIDE.md` is the governing parent document for Builder's Valley population production.

All NPC and population work must preserve these invariants:

1. identity is stable;
2. meaning is prioritized over motion;
3. critical access is protected;
4. simulation fidelity scales by relevance;
5. authority is explicit;
6. persistence preserves consequence;
7. learning remains player-centered;
8. population supports rather than obstructs the world;
9. runtime cost is budgeted;
10. final release requires evidence.

Any implementation or child document that violates these invariants requires an explicit architecture decision before acceptance.

---

# Appendix A — Initial Builder's Valley population questions

The following questions must be resolved across 15A–15J:

- How many permanent residents belong to each region?
- Which named NPCs are system-critical?
- Which services require always-available fallback?
- Which professions visibly shape the valley?
- Which NPCs may act as mentors or learners?
- How does the population react to construction progress?
- How are work sites shared and reserved?
- How do events alter schedules without destroying continuity?
- Which relationships are persistent?
- Which ambient actors may be safely regenerated?
- How does density scale across platforms?
- How are crowds prevented from blocking learning spaces?
- How does the world communicate that an NPC is busy or unavailable?
- What happens when the player loads during an event?
- What happens when a critical NPC cannot reach the required location?
- How are profession outputs resolved while a region is unloaded?
- How are visitors introduced and removed without obvious pop-in?
- How do animals share space with human population activity?
- What evidence proves that the world feels alive rather than random?

---

# Appendix B — Required child-document header

Every 15A–15J document should begin with:

```md
## Parent authority

This document is governed by:

- `docs/world/15-NPC-AND-POPULATION-SYSTEM-GUIDE.md`

This document may specialize its assigned domain but may not redefine NPC identity, lifecycle, simulation tiers, authority priority, persistence classes, or cross-system ownership without an explicit architecture decision.
```

---

# Appendix C — Recommended implementation slices

A practical implementation sequence is:

1. identity registry and roster;
2. region population composition;
3. anchor registry and occupancy;
4. schedule resolver;
5. abstract population state;
6. activation and deactivation controller;
7. simulation-tier controller;
8. basic locomotion and recovery;
9. role capability projection;
10. interaction availability;
11. profession activities;
12. merchant and service projection;
13. mentor and learner participation;
14. relationship and reputation projection;
15. event participation;
16. persistence and time skip;
17. observability and debug tooling;
18. performance scaling;
19. final validation.

Each slice should be independently reviewable and should preserve repository, runtime, and operational gate separation.
