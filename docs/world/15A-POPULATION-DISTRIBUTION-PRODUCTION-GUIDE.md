# 15A — Population Distribution Production Guide

**Project:** Math Learning World  
**World Slice:** Builder's Valley  
**Phase:** 15 — NPC & Population System  
**Document Type:** Production Guide / Distribution Authority  
**Status:** Production Ready  
**Parent Authority:** `15-NPC-AND-POPULATION-SYSTEM-GUIDE.md`

---

## 1. Purpose

This guide defines how NPC population is distributed across Builder's Valley.

It converts the population doctrine established by the Phase 15 parent guide into production rules for:

- resident placement;
- district capacity;
- visitor flow;
- ambient crowds;
- worker and learner presence;
- simulation density;
- activation and streaming boundaries;
- population budgeting;
- spawn and despawn authority;
- persistence and recovery;
- validation and evidence.

This document is the authoritative production reference for deciding **who belongs where, how many NPCs may be present, why they are present, and how their presence remains believable and performant**.

It does not define full daily schedules, professions, conversations, reputation, merchant pricing, or event behavior. Those responsibilities belong to later Phase 15 documents.

---

## 2. Production Outcome

A conforming implementation must produce a valley that:

1. feels inhabited without appearing overcrowded;
2. places NPCs according to world meaning rather than random decoration;
3. preserves important residents and relationships across save/load;
4. adapts visible population to device capability and player location;
5. supports work, learning, trade, mentorship, travel, and events;
6. avoids duplicated, stranded, or contextless NPCs;
7. remains deterministic enough to debug and validate;
8. degrades gracefully under performance pressure;
9. protects critical gameplay actors from density reduction;
10. exposes measurable evidence for final validation.

---

## 3. Authority Hierarchy

Population distribution must obey this authority order:

1. **Narrative and gameplay-critical placement**
2. **Persistent resident identity and residency contract**
3. **Active quest, lesson, mentorship, or event requirements**
4. **Profession and service coverage requirements**
5. **District capacity and semantic suitability**
6. **Schedule demand**
7. **Player proximity and visibility**
8. **Performance budget**
9. **Ambient variety**

A lower authority must never invalidate a higher one.

Examples:

- An ambient density reduction may remove decorative passersby, but not the teacher required by an active lesson.
- A market crowd generator may not occupy a workshop station reserved by a persistent craftsperson.
- A regional cap may delay optional visitors, but may not silently delete a resident returning home.

---

## 4. Core Population Model

Builder's Valley population is organized into five production classes.

### 4.1 Persistent Residents

Persistent residents have durable identity and a stable relationship with the world.

Examples:

- named builders;
- teachers;
- mentors;
- merchants;
- workshop owners;
- recurring learners;
- household members;
- local service NPCs.

Required characteristics:

- unique stable identifier;
- assigned home region;
- residency record;
- persistent relationship and progression state where applicable;
- recoverable location after save/load;
- protected status during density reduction.

### 4.2 Persistent Visitors

Persistent visitors have durable identity but do not permanently reside in the current district.

Examples:

- travelling instructors;
- recurring traders;
- visiting family members;
- tournament participants;
- story-linked guests.

Required characteristics:

- unique stable identifier;
- home region or external origin;
- visit purpose;
- arrival and departure authority;
- persistence while the visit remains active;
- no permanent occupancy claim unless explicitly converted to resident status.

### 4.3 Dynamic Functional Population

Dynamic functional NPCs exist to satisfy world services and gameplay functions but may not require unique long-term identity.

Examples:

- temporary workers;
- generic learners;
- delivery personnel;
- queue participants;
- maintenance staff;
- transport assistants.

Required characteristics:

- functional role;
- valid district reason;
- bounded lifetime;
- safe abstraction outside active simulation;
- no ownership of unique progression unless promoted to persistent identity.

### 4.4 Ambient Population

Ambient NPCs create visual and social life without carrying essential gameplay authority.

Examples:

- passersby;
- spectators;
- casual shoppers;
- background workers;
- distant learners;
- plaza visitors.

Required characteristics:

- low persistence requirement;
- poolable or reconstructible identity;
- no critical quest or lesson state;
- immediate eligibility for density reduction;
- semantic behavior appropriate to the district.

### 4.5 Event Population

Event population is temporarily introduced by a declared event authority.

Examples:

- festival visitors;
- competition teams;
- public lesson participants;
- market-day traders;
- ceremony guests;
- emergency responders.

Required characteristics:

- event identifier;
- start and end authority;
- reserved capacity;
- explicit cleanup behavior;
- conflict resolution with normal district population;
- restoration of baseline distribution after event completion.

---

## 5. Population Identity Rules

Every active NPC instance must resolve to one distribution identity type:

```text
PERSISTENT_RESIDENT
PERSISTENT_VISITOR
DYNAMIC_FUNCTIONAL
AMBIENT
EVENT
```

An NPC must not simultaneously hold contradictory identity types.

Allowed transitions include:

```text
AMBIENT -> DYNAMIC_FUNCTIONAL
DYNAMIC_FUNCTIONAL -> PERSISTENT_RESIDENT
PERSISTENT_VISITOR -> PERSISTENT_RESIDENT
EVENT -> PERSISTENT_VISITOR
```

Each promotion must be explicit and must create any newly required durable data.

Silent promotion through incidental interaction is prohibited.

---

## 6. Spatial Distribution Hierarchy

Population placement is evaluated through the following hierarchy:

```text
World
  -> Region
    -> District
      -> Zone
        -> Venue
          -> Semantic Anchor
```

### 6.1 World

The full Builder's Valley simulation authority.

World-level distribution controls:

- total population envelope;
- global identity registry;
- cross-region travel;
- global event reservations;
- save/load reconstruction;
- platform quality profile.

### 6.2 Region

A major geographical and functional area.

Examples may include:

- central valley;
- workshop ridge;
- learning quarter;
- residential terraces;
- market basin;
- river approach;
- farming edge.

Region-level distribution controls:

- resident population range;
- dominant professions;
- visitor attraction;
- travel connectivity;
- streaming authority;
- broad simulation tier.

### 6.3 District

A locally coherent population unit with a clear purpose.

Examples:

- market district;
- workshop district;
- school district;
- residential district;
- civic plaza;
- riverfront service district.

District-level distribution controls:

- population capacity;
- role mix;
- peak and off-peak density;
- venue occupancy;
- crowd behavior;
- service coverage;
- local validation route.

### 6.4 Zone

A smaller area within a district used for density and behavior control.

Examples:

- market stalls;
- school courtyard;
- workshop lane;
- housing cluster;
- plaza perimeter;
- loading area.

Zone-level distribution controls:

- maximum simultaneous actors;
- navigation pressure;
- visual density;
- active animation cost;
- queue and gathering space;
- spawn eligibility.

### 6.5 Venue

A named or typed interior/exterior place with specific occupancy rules.

Examples:

- classroom;
- workshop;
- shop;
- home;
- guild hall;
- training yard;
- dining area.

Venue-level distribution controls:

- opening state;
- occupancy count;
- role restrictions;
- reserved stations;
- interaction capacity;
- emergency evacuation behavior.

### 6.6 Semantic Anchor

A precise meaningful destination used by schedule and activity systems.

Examples:

- workbench;
- teacher position;
- learner seat;
- merchant counter;
- bed;
- dining seat;
- queue marker;
- observation point.

Semantic anchors are never generic spawn points. They express why an NPC is present.

---

## 7. District Classification

Every populated district must declare one primary classification and may declare secondary classifications.

Primary classifications:

```text
RESIDENTIAL
LEARNING
WORKSHOP
COMMERCIAL
CIVIC
AGRICULTURAL
TRANSIT
RECREATIONAL
EVENT
MIXED_USE
```

Each classification must define:

- expected resident share;
- expected worker share;
- expected learner share;
- expected visitor share;
- ambient density range;
- active hours;
- peak windows;
- quiet windows;
- essential services;
- performance sensitivity.

### 7.1 Residential District

Priorities:

- stable resident identity;
- household coherence;
- morning and evening activity;
- low commercial crowding;
- safe sleep and return-home capacity.

### 7.2 Learning District

Priorities:

- teacher and learner coverage;
- classroom and courtyard capacity;
- lesson transition flow;
- mentorship visibility;
- protected learning actors.

### 7.3 Workshop District

Priorities:

- profession coverage;
- station ownership;
- safe work spacing;
- delivery and material flow;
- reduced decorative crowding near machinery.

### 7.4 Commercial District

Priorities:

- merchant coverage;
- customer turnover;
- queue capacity;
- peak density management;
- market-day event reservation.

### 7.5 Civic District

Priorities:

- gathering capacity;
- public information access;
- ceremonies and announcements;
- broad social mixing;
- event conversion capability.

### 7.6 Transit District

Priorities:

- movement rather than long-term occupancy;
- route clarity;
- arrival/departure handling;
- low stationary congestion;
- visitor handoff between regions.

---

## 8. Capacity Model

Every region, district, zone, and venue must declare a population capacity profile.

Required capacity fields:

```text
baseCapacity
softCapacity
hardCapacity
criticalReservedCapacity
visitorReservedCapacity
eventReservedCapacity
ambientCapacity
```

### 8.1 Base Capacity

Normal intended occupancy for believable daily operation.

### 8.2 Soft Capacity

Occupancy may exceed base capacity temporarily without immediate failure.

Crossing soft capacity must trigger monitoring and reduced optional spawning.

### 8.3 Hard Capacity

Absolute occupancy limit for that spatial unit.

Hard capacity must account for:

- navigation;
- interaction access;
- camera readability;
- emergency movement;
- CPU and animation cost;
- collision and physics cost.

No optional actor may be admitted beyond hard capacity.

### 8.4 Critical Reserved Capacity

Capacity held for gameplay-critical actors.

Examples:

- required teacher;
- active quest NPC;
- mentor;
- emergency responder;
- story visitor.

Ambient systems may never consume critical reserved capacity.

### 8.5 Visitor Reserved Capacity

Capacity reserved for normal visitor flow.

### 8.6 Event Reserved Capacity

Capacity activated only by an event authority.

### 8.7 Ambient Capacity

Maximum number of ambient NPCs allowed after all higher priorities are satisfied.

---

## 9. Population Budget Formula

A production implementation should calculate available optional capacity using a rule equivalent to:

```text
optionalCapacity =
  min(
    hardCapacity - criticalOccupancy - functionalOccupancy,
    qualityProfileCapacity,
    performanceAvailableCapacity
  )
```

Ambient allocation must then remain within:

```text
ambientAllocation <= min(optionalCapacity, ambientCapacity)
```

The exact implementation may differ, but the authority relationship must remain intact.

---

## 10. Population Density Bands

Each district must support density bands.

```text
EMPTY
QUIET
NORMAL
BUSY
PEAK
EVENT
```

### EMPTY

Used only when semantically valid, such as closed venues or remote areas.

### QUIET

Minimal service coverage and low ambient presence.

### NORMAL

Default believable operating density.

### BUSY

Increased functional and ambient population during predictable activity windows.

### PEAK

High but controlled occupancy near soft capacity.

### EVENT

Event-specific occupancy using reserved capacity and special routing.

Density bands are semantic states, not merely numeric multipliers.

---

## 11. Time-Based Distribution

Population distribution must respond to world time.

Minimum time windows:

```text
PRE_DAWN
MORNING
MIDDAY
AFTERNOON
EVENING
NIGHT
```

Each district must declare:

- opening window;
- closing window;
- worker arrival window;
- learner arrival window;
- visitor peak window;
- resident return window;
- night occupancy rules.

Detailed schedule generation belongs to Phase 15B, but 15A owns the required spatial capacity for those schedule outcomes.

A schedule may request occupancy only where capacity has been declared.

---

## 12. Residency Distribution

Every persistent resident must have one residency record.

Required fields:

```text
residentId
homeRegionId
homeDistrictId
homeVenueId
householdId
residencyStatus
residencyPriority
```

Allowed residency statuses:

```text
ACTIVE
TEMPORARILY_AWAY
RELOCATING
DISPLACED
INACTIVE
```

### Residency Rules

1. A resident must not have two active permanent homes.
2. A household venue must not exceed its resident capacity.
3. Relocation must be transactional.
4. A missing or invalid home must trigger recovery, not deletion.
5. Residents temporarily away still retain their home claim unless explicitly released.
6. Home assignment must respect district meaning and household compatibility.

---

## 13. Household Distribution

Households are distribution units, not merely relationship labels.

A household may contain:

- adults;
- children or learners;
- elders;
- guardians;
- apprentices;
- temporary guests.

Household placement must consider:

- venue capacity;
- sleeping capacity;
- accessibility;
- proximity to work or learning where intended;
- narrative requirements;
- relocation history.

Randomly splitting a household across unrelated homes is prohibited unless explicitly authored.

---

## 14. Profession Coverage Distribution

Every operational district must declare minimum profession coverage.

Example coverage declaration:

```text
WORKSHOP_DISTRICT:
  builder: 2
  repair_specialist: 1
  material_handler: 1
  mentor: 1 optional
```

Coverage may be satisfied by:

- persistent residents;
- persistent visitors;
- dynamic functional NPCs.

Ambient NPCs may not satisfy essential service coverage.

When coverage fails, the system must expose a reason such as:

```text
PROFESSION_COVERAGE_MISSING
REQUIRED_ACTOR_UNAVAILABLE
VENUE_CLOSED
CAPACITY_BLOCKED
TRAVEL_DELAYED
```

---

## 15. Learning Population Distribution

Learning spaces must distinguish:

- teachers;
- mentors;
- enrolled learners;
- visiting learners;
- observers;
- ambient learners.

Protected learning actors include:

- the teacher assigned to an active lesson;
- the learner currently controlled or followed by the player;
- a mentor in an active mentorship interaction;
- assessment participants;
- required tutorial actors.

Learning venue capacity must include:

```text
teachingCapacity
learnerCapacity
observerCapacity
interactionCapacity
safeOverflowCapacity
```

Ambient crowding must never obstruct lesson readability or access to required learning interactions.

---

## 16. Visitor Distribution

Visitors require a declared reason for presence.

Valid visitor reasons include:

```text
TRADE
LEARNING
MENTORSHIP
DELIVERY
SOCIAL_VISIT
CIVIC_SERVICE
EVENT
STORY
TRANSIT
```

Visitor distribution must define:

- origin;
- destination;
- arrival window;
- expected duration;
- required venue capacity;
- departure condition;
- persistence class;
- recovery destination.

Visitors may not spawn directly inside a full venue unless specifically authored and validated.

---

## 17. Ambient Distribution

Ambient population exists to support atmosphere and readability.

Ambient generation must use district-specific archetype pools.

Examples:

### Workshop Ambient Pool

- assistant worker;
- material carrier;
- observer;
- resting craftsperson.

### Market Ambient Pool

- shopper;
- courier;
- stall browser;
- social visitor.

### Learning Ambient Pool

- learner walking between spaces;
- observer;
- study group participant;
- caretaker.

Ambient generation must not:

- create duplicate named characters;
- impersonate critical roles;
- own persistent inventory;
- issue essential quests;
- block semantic anchors;
- exceed ambient capacity;
- appear in semantically invalid districts.

---

## 18. Spawn Authority

An NPC may enter active simulation only through a valid spawn authority.

Allowed authorities:

```text
RESIDENCY_LOAD
SCHEDULE_ARRIVAL
TRAVEL_ARRIVAL
VENUE_OPEN
SERVICE_COVERAGE
EVENT_ACTIVATION
QUEST_REQUIREMENT
LESSON_REQUIREMENT
AMBIENT_DENSITY
RECOVERY
```

Every spawn request must include:

```text
actorIdentity
populationClass
authority
requestedRegion
requestedDistrict
requestedZone
requestedVenue optional
semanticPurpose
priority
lifetimePolicy
```

A spawn point alone is insufficient authority.

---

## 19. Spawn Candidate Validation

Before activation, a spawn candidate must pass:

1. identity uniqueness check;
2. authority validity check;
3. district semantic compatibility;
4. capacity check;
5. anchor availability check when required;
6. navigation validity check;
7. player visibility safety check;
8. platform budget check;
9. conflict check with save state;
10. event and schedule consistency check.

Failed ambient candidates may be discarded quietly with metrics.

Failed critical candidates must produce a recoverable failure state and diagnostic evidence.

---

## 20. Spawn Visibility Rules

Optional NPCs must not visibly appear from nothing in the player's direct focus.

Preferred activation contexts:

- beyond camera view;
- behind occlusion;
- inside valid entrances;
- during travel handoff;
- during scene transition;
- at distant route nodes;
- after venue streaming completion.

Critical recovery may violate ideal visibility only when necessary to prevent gameplay blockage. Such recovery must still use the least disruptive valid location.

---

## 21. Despawn and Deactivation Authority

An active NPC may leave active simulation through:

```text
SCHEDULE_DEPARTURE
TRAVEL_DEPARTURE
VENUE_CLOSE
EVENT_END
DISTANCE_DEACTIVATION
STREAMING_DEACTIVATION
QUALITY_REDUCTION
AMBIENT_RECYCLE
RECOVERY_RELOCATION
```

Critical actors may be abstracted but must not be destroyed.

A deactivation must preserve all state required by the actor's population class.

### Ambient Despawn

Ambient actors may be recycled when:

- not visible;
- not interacting;
- not referenced by active gameplay;
- outside protected radius;
- no persistent state was acquired.

### Persistent Actor Deactivation

Persistent actors must serialize:

- identity;
- logical location;
- current activity;
- destination;
- schedule context;
- relationship changes;
- inventory or progression changes where owned by that system.

---

## 22. Streaming Integration

Population simulation must align with world streaming.

Each region must expose:

```text
UNLOADED
ABSTRACT
BACKGROUND
ACTIVE
FOCUSED
```

### UNLOADED

No actor instances are active. Durable state remains available.

### ABSTRACT

Population exists as counts and logical state only.

### BACKGROUND

Important transitions are simulated at reduced frequency.

### ACTIVE

Nearby actors receive normal simulation.

### FOCUSED

Actors relevant to current gameplay receive highest fidelity.

Population state must transition between tiers without duplication or state loss.

---

## 23. Simulation Fidelity by Population Class

| Population Class | Unloaded | Abstract | Background | Active | Focused |
|---|---|---|---|---|---|
| Persistent Resident | durable state | logical schedule | reduced simulation | full local simulation | full priority |
| Persistent Visitor | durable visit state | logical travel | reduced simulation | full local simulation | full priority |
| Dynamic Functional | reconstructible state | functional count | reduced activity | normal simulation | promoted when needed |
| Ambient | none/count only | density token | optional | lightweight | rarely promoted |
| Event | event state | event count | event progression | active event behavior | event-critical |

---

## 24. Player-Centered Distribution

Visible population may adapt around the player, but world meaning must remain authoritative.

Player-centered logic may influence:

- activation timing;
- LOD and animation fidelity;
- ambient count;
- route selection;
- visibility-safe spawning;
- focused interaction actors.

Player-centered logic may not:

- relocate named residents without reason;
- create required services only when observed;
- erase consequences outside view;
- duplicate visitors across districts;
- violate event attendance records.

---

## 25. Quality Profiles

Minimum supported quality profiles:

```text
LOW
MEDIUM
HIGH
ULTRA
```

Each profile must define:

- maximum active NPCs;
- maximum background NPCs;
- maximum ambient NPCs per district;
- animation update budget;
- pathfinding request budget;
- crowd avoidance fidelity;
- visible event crowd scale;
- maximum interaction-ready actors.

Quality reduction order:

1. distant ambient actors;
2. off-camera ambient actors;
3. background animation fidelity;
4. ambient variety;
5. optional dynamic functional actors;
6. event spectators not required for logic.

Never reduce:

- active lesson actors;
- active quest actors;
- player interaction target;
- required merchant or teacher coverage;
- emergency or recovery actor;
- named resident identity.

---

## 26. Performance Budget Principles

Population cost must be budgeted across:

- CPU simulation;
- animation;
- navigation;
- avoidance;
- rendering;
- memory;
- audio emitters;
- interaction scanning;
- save-state tracking.

Each district must declare a measured population budget, not only a design target.

Recommended measurement points:

```text
activeNpcCount
backgroundNpcCount
ambientNpcCount
pathRequestsPerSecond
animationUpdatesPerFrame
crowdAvoidanceCost
npcRenderCost
populationMemory
spawnFailures
capacityDeferrals
```

Detailed global performance acceptance remains governed by Phase 14I and Phase 14J.

---

## 27. Navigation Pressure Rules

Population capacity must reflect navigation reality.

A zone must reserve:

- primary movement corridor;
- emergency path;
- interaction approach path;
- queue space;
- doorway clearance;
- player movement clearance.

An apparently spacious area may still require low capacity when:

- entrances are narrow;
- paths intersect;
- interaction anchors cluster tightly;
- camera readability is poor;
- avoidance cost is high.

Capacity must be validated in runtime, not inferred from surface area alone.

---

## 28. Venue Occupancy Rules

Every venue must expose occupancy state.

```text
CLOSED
AVAILABLE
LIMITED
FULL
RESERVED
EVACUATING
```

Admission rules:

- `CLOSED`: only explicitly authorized actors may remain.
- `AVAILABLE`: normal admission.
- `LIMITED`: critical and functional admission only.
- `FULL`: no optional admission.
- `RESERVED`: event or authored allocation applies.
- `EVACUATING`: no new admission; actors leave through safe routes.

Venue occupancy must be atomic enough to prevent two actors claiming the same exclusive anchor.

---

## 29. Distribution Conflict Resolution

When multiple actors request limited capacity, resolve in this order:

1. active player interaction target;
2. active lesson, quest, or event-critical actor;
3. persistent resident with required venue authority;
4. required profession coverage;
5. persistent visitor with reservation;
6. dynamic functional actor;
7. optional visitor;
8. ambient actor.

Equal-priority conflicts should use deterministic tie-breaking based on stable identifiers and request timestamps.

Random conflict resolution is prohibited for durable actors.

---

## 30. Overflow Behavior

When capacity is unavailable, valid overflow responses include:

```text
WAIT_AT_ORIGIN
WAIT_AT_ENTRY
REROUTE_TO_ALTERNATE_VENUE
DEFER_ACTIVITY
ABSTRACT_PARTICIPATION
REDUCE_AMBIENT_COUNT
CANCEL_OPTIONAL_VISIT
TRIGGER_RECOVERY
```

Invalid responses include:

- stacking actors at one point;
- teleporting into an occupied anchor;
- deleting persistent actors;
- silently dropping critical participation;
- exceeding hard capacity without evidence.

---

## 31. Travel Distribution

Cross-district travel must maintain one authoritative logical location.

Travel states:

```text
AT_ORIGIN
DEPARTING
IN_TRANSIT
ARRIVING
AT_DESTINATION
INTERRUPTED
RECOVERING
```

An actor in transit must not also be counted as active occupancy at origin and destination.

Capacity may be reserved before arrival for high-priority actors.

Optional visitors may travel without reservation but must accept deferral or alternate destinations.

---

## 32. Event Distribution Reservation

Events must reserve population capacity before activation.

An event reservation must declare:

```text
eventId
regionId
districtId
venueIds
criticalParticipantCount
functionalParticipantCount
spectatorTargetCount
spectatorMaximumCount
startWindow
endWindow
cleanupPolicy
```

Event setup must not evict persistent residents from required homes or essential workspaces without an authored override.

After event completion:

- event actors depart or convert explicitly;
- reserved capacity is released;
- normal schedules resume;
- displaced functional actors recover;
- ambient density returns gradually, not explosively.

---

## 33. Save and Load Distribution

Save data must preserve enough information to reconstruct a coherent population.

Minimum durable fields for persistent actors:

```text
actorId
populationClass
logicalRegionId
logicalDistrictId
logicalVenueId optional
homeAuthority
currentActivity
travelState optional
visitState optional
reservedAnchor optional
lastAuthoritativeTimestamp
```

On load, reconstruction order is:

1. global identity registry;
2. persistent residency;
3. active lesson, quest, and event authorities;
4. travel and visitor state;
5. profession coverage;
6. dynamic functional population;
7. ambient population.

Ambient population should be regenerated from current district context rather than serialized actor-by-actor unless a specific interaction promoted an actor's identity.

---

## 34. Time-Skip Reconstruction

When time advances while a region is inactive, the population system must calculate a logical result rather than replaying every movement step.

Time-skip reconstruction must consider:

- destination validity;
- venue opening state;
- completed visits;
- event transitions;
- residency changes;
- travel completion;
- schedule phase;
- capacity conflicts at the new time.

If the expected destination is invalid, use a declared recovery hierarchy.

Recommended recovery hierarchy:

```text
valid scheduled venue
-> home venue
-> district recovery anchor
-> region recovery anchor
-> global safe recovery location
```

---

## 35. Recovery Rules

Recovery exists to restore valid authority, not to hide systemic defects.

Recovery cases include:

- missing venue;
- deleted anchor;
- invalid navigation;
- duplicate active identity;
- impossible occupancy;
- interrupted travel;
- stale event reservation;
- district unload during interaction;
- corrupted logical location.

Required recovery outcomes:

- preserve identity;
- select a safe meaningful location;
- release invalid reservations;
- restore a valid activity or idle state;
- record failure code and evidence;
- avoid repeated recovery loops.

---

## 36. Distribution Failure Codes

Minimum failure code set:

```text
POPULATION_IDENTITY_DUPLICATED
POPULATION_IDENTITY_MISSING
RESIDENCY_INVALID
HOUSEHOLD_CAPACITY_EXCEEDED
DISTRICT_CAPACITY_EXCEEDED
ZONE_CAPACITY_EXCEEDED
VENUE_CAPACITY_EXCEEDED
CRITICAL_CAPACITY_UNAVAILABLE
SEMANTIC_ANCHOR_MISSING
SEMANTIC_ANCHOR_CONFLICT
SPAWN_AUTHORITY_INVALID
SPAWN_LOCATION_INVALID
SPAWN_VISIBILITY_VIOLATION
PROFESSION_COVERAGE_MISSING
LEARNING_COVERAGE_MISSING
VISITOR_RESERVATION_INVALID
EVENT_RESERVATION_INVALID
TRAVEL_LOCATION_CONFLICT
STREAMING_DUPLICATION
DEACTIVATION_STATE_LOST
TIME_SKIP_RECONSTRUCTION_FAILED
POPULATION_RECOVERY_LOOP
PERFORMANCE_BUDGET_EXCEEDED
AMBIENT_DENSITY_INVALID
```

Each failure record should include:

```text
failureCode
actorId optional
populationClass optional
regionId
districtId optional
venueId optional
authority
worldTime
runtimeTier
qualityProfile
recoveryAction
correlationId
```

---

## 37. Observability Requirements

The runtime must expose population diagnostics suitable for development builds.

Required views:

- world population summary;
- region population counts;
- district occupancy and capacity;
- population count by class;
- critical actor registry;
- active spawn requests;
- deferred requests;
- venue occupancy;
- reserved capacity;
- streaming tier per region;
- duplicate identity detection;
- unresolved recovery cases;
- population performance cost.

Recommended developer overlays:

```text
Population Heatmap
Capacity Overlay
Semantic Anchor Overlay
Active Authority Labels
Travel State Overlay
Streaming Tier Overlay
Spawn/Despawn Event Feed
```

---

## 38. Data Contract Example

Illustrative district distribution contract:

```json
{
  "districtId": "builders-valley.workshop-quarter",
  "classification": "WORKSHOP",
  "capacity": {
    "base": 24,
    "soft": 30,
    "hard": 36,
    "criticalReserved": 6,
    "visitorReserved": 4,
    "eventReserved": 8,
    "ambient": 12
  },
  "coverage": {
    "builder": 4,
    "repairSpecialist": 1,
    "materialHandler": 2
  },
  "densityBands": {
    "morning": "NORMAL",
    "midday": "BUSY",
    "evening": "QUIET",
    "night": "EMPTY"
  }
}
```

Values shown are illustrative only. Production values require runtime validation.

---

## 39. Authoring Workflow

Each district should be authored in this order:

1. define district meaning;
2. classify district;
3. mark boundaries;
4. identify venues;
5. define semantic anchors;
6. establish resident and household requirements;
7. establish profession and learning coverage;
8. define visitor patterns;
9. define capacity profile;
10. define density bands;
11. define event reservations;
12. define streaming behavior;
13. test navigation pressure;
14. profile performance;
15. record validation evidence.

Do not begin with random spawn-point placement.

---

## 40. District Production Checklist

A district is distribution-ready only when all items are resolved:

- [ ] Primary classification assigned
- [ ] Boundary authored
- [ ] Venue list complete
- [ ] Semantic anchors validated
- [ ] Base, soft, and hard capacity set
- [ ] Critical reserved capacity set
- [ ] Visitor and event reservations set
- [ ] Resident population range defined
- [ ] Household capacity verified
- [ ] Profession coverage defined
- [ ] Learning coverage defined where relevant
- [ ] Visitor reasons defined
- [ ] Ambient archetype pool defined
- [ ] Density bands defined
- [ ] Spawn and deactivation locations validated
- [ ] Streaming transition tested
- [ ] Time-skip reconstruction tested
- [ ] Quality-profile scaling tested
- [ ] Failure telemetry verified
- [ ] Evidence captured

---

## 41. Validation Layers

Population distribution validation is divided into six layers.

### Layer A — Data Validation

Verify:

- identifiers are unique;
- district references exist;
- venue references exist;
- capacities are non-negative;
- base capacity does not exceed soft capacity;
- soft capacity does not exceed hard capacity;
- reservations do not exceed hard capacity;
- semantic anchors are valid;
- population classes are recognized.

### Layer B — Static World Validation

Verify:

- district boundaries do not unintentionally overlap;
- venues are reachable;
- recovery anchors exist;
- spawn locations are safe;
- required corridors remain clear;
- exclusive anchors are uniquely assigned.

### Layer C — Runtime Distribution Validation

Verify:

- correct actors appear in correct districts;
- required services are present;
- occupancy respects capacity;
- ambient actors scale appropriately;
- named actors do not duplicate;
- visitors arrive and depart coherently.

### Layer D — Streaming Validation

Verify:

- active-to-background transitions preserve state;
- background-to-active transitions do not duplicate actors;
- unloaded regions reconstruct correctly;
- player travel across boundaries remains coherent;
- interactions survive allowed streaming transitions.

### Layer E — Performance Validation

Verify:

- each quality profile remains within budget;
- density reduction order is correct;
- critical actors remain protected;
- crowd navigation remains stable;
- event population scales safely.

### Layer F — Recovery Validation

Inject and verify:

- missing anchor;
- full venue;
- blocked path;
- stale visitor reservation;
- duplicated identity;
- invalid home;
- interrupted travel;
- time-skip into closed venue.

---

## 42. Required Test Routes

Minimum validation routes:

### Route 1 — Residential Morning

Observe residents leaving homes and district occupancy transitioning from quiet to active.

### Route 2 — Learning Arrival

Observe teachers and learners entering learning venues without exceeding capacity.

### Route 3 — Workshop Peak

Observe required workers, deliveries, visitors, and ambient actors under busy density.

### Route 4 — Market Peak

Observe merchant coverage, customer turnover, queue pressure, and ambient reduction near capacity.

### Route 5 — Cross-Region Travel

Track a persistent visitor from origin through transit to destination and departure.

### Route 6 — Event Activation

Activate an event, reserve capacity, admit critical participants, scale spectators, and restore baseline afterward.

### Route 7 — Streaming Boundary

Move repeatedly between two populated regions and verify no identity duplication or occupancy inflation.

### Route 8 — Save/Load

Save during active travel, active venue occupancy, and event participation; reload and verify coherent reconstruction.

### Route 9 — Low Quality Profile

Run the busiest district on the lowest supported quality profile and confirm graceful ambient reduction.

### Route 10 — Recovery Injection

Invalidate an anchor or block a venue and confirm deterministic safe recovery.

---

## 43. Acceptance Metrics

A production candidate must demonstrate:

- zero duplicate persistent identities during standard validation;
- zero persistent actor loss across save/load;
- zero optional occupancy beyond hard capacity;
- zero critical actor removal caused by quality scaling;
- zero permanent navigation blockage caused by population density;
- deterministic recovery from declared fault cases;
- stable district occupancy after repeated streaming transitions;
- event cleanup returning occupancy to expected baseline;
- measured performance within Phase 14I budgets;
- all required test routes completed with evidence.

Thresholds for warnings and tolerances must be declared per target platform.

---

## 44. Evidence Package

The 15A evidence package must contain:

1. district distribution registry;
2. capacity table for every populated district;
3. population-class counts;
4. resident and household placement report;
5. profession coverage report;
6. learning coverage report;
7. visitor flow report;
8. event reservation report;
9. streaming transition logs;
10. save/load reconstruction evidence;
11. quality-profile comparison;
12. performance captures;
13. failure injection results;
14. screenshots or video of required validation routes;
15. unresolved exceptions with owner and decision.

Evidence must identify:

- build or commit;
- platform;
- quality profile;
- world time;
- test route;
- result;
- observed failures;
- recovery outcome;
- reviewer.

---

## 45. Exit Gate

`15A-POPULATION-DISTRIBUTION-PRODUCTION-GUIDE.md` is satisfied only when:

- all populated districts have declared distribution contracts;
- capacity and reservation rules are implemented;
- persistent residents have valid residency;
- profession and learning coverage can be demonstrated;
- visitor flow is coherent;
- ambient density scales by context and quality profile;
- spawn and deactivation authority is enforced;
- streaming transitions preserve identity and occupancy;
- save/load reconstruction is stable;
- declared recovery cases pass;
- population performance remains within approved budgets;
- evidence package is complete;
- no unresolved critical distribution failure remains.

Passing this exit gate authorizes Phase 15B to define detailed daily schedule behavior against a stable spatial and capacity foundation.

---

## 46. Relationship to Later Phase 15 Documents

This guide establishes the **where and how many** authority.

Later documents extend it as follows:

- **15B — Daily Schedule:** when NPCs move between declared destinations;
- **15C — NPC Roles:** which social and gameplay roles occupy the population;
- **15D — Profession System:** how work authority and profession coverage operate;
- **15E — Merchant Economy:** how commercial actors and customers use distribution capacity;
- **15F — Conversation Rules:** how social availability emerges from valid presence;
- **15G — Interaction Rules:** how players engage with distributed actors;
- **15H — Reputation System:** how persistent social state affects access and behavior;
- **15I — Event Participation:** how event reservation and attendance are governed;
- **15J — Population Validation:** final cross-system acceptance for the complete Phase 15 slice.

No later document may bypass the capacity, identity, residency, or authority rules defined here without an explicit architectural amendment.

---

## 47. Final Production Doctrine

Builder's Valley must not feel populated because NPCs were scattered into empty space.

It must feel populated because every visible person has a believable relationship with place, time, purpose, and community.

Population density is therefore not a decoration setting.

It is a world-state contract connecting:

- identity;
- home;
- work;
- learning;
- travel;
- service;
- social life;
- performance;
- persistence.

The production standard is achieved when the player can move through the valley and intuitively believe that its people belong there—even when the underlying simulation is scaling, streaming, abstracting, and recovering behind the scenes.
