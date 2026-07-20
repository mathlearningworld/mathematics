# 15B — Daily Schedule Production Guide

**Project:** Math Learning World  
**World Slice:** Builder's Valley  
**Phase:** 15 — NPC & Population System  
**Document Type:** Production Guide / Schedule Authority  
**Status:** Production Ready  
**Parent Authority:** `15-NPC-AND-POPULATION-SYSTEM-GUIDE.md`  
**Distribution Authority:** `15A-POPULATION-DISTRIBUTION-PRODUCTION-GUIDE.md`

---

## 1. Purpose

This guide defines how NPC time, routine, movement, occupancy, work, learning, rest, travel, and exceptional behavior are scheduled across Builder's Valley.

It converts the population and occupancy doctrine established by Phase 15 and 15A into production rules for:

- world time;
- daily routine construction;
- schedule ownership;
- home, work, school, market, and social occupancy;
- travel between activities;
- schedule priority and interruption;
- weather and event overrides;
- time skip and catch-up;
- unloaded simulation;
- save/load reconstruction;
- recovery from invalid or blocked activities;
- schedule observability;
- performance budgeting;
- validation and evidence.

This document is the authoritative production reference for deciding **what an NPC should be doing now, where that activity belongs, how the NPC transitions to it, and how the schedule remains believable when the world is interrupted, unloaded, accelerated, or recovered**.

It does not define detailed profession mechanics, merchant prices, dialogue content, reputation scoring, or final event participation logic. Those responsibilities belong to later Phase 15 documents.

---

## 2. Production Outcome

A conforming implementation must produce NPC behavior that:

1. makes the valley feel alive and temporally coherent;
2. gives persistent NPCs recognizable routines without making them robotic;
3. ensures homes, schools, workshops, markets, and social spaces become active at believable times;
4. respects gameplay-critical lessons, quests, mentorship, and services;
5. avoids impossible teleportation, duplicate occupancy, and stranded actors;
6. supports schedule variation without losing determinism;
7. reconstructs correct state after save/load and time skip;
8. degrades safely when areas are unloaded or simulation budgets are reduced;
9. exposes clear reasons for every active or deferred schedule decision;
10. remains testable through deterministic fixtures and evidence routes.

---

## 3. Schedule Doctrine

Builder's Valley schedules follow these doctrines.

### 3.1 Meaning Before Motion

An NPC must move because a meaningful activity requires a location, not because the simulation needs visual motion.

### 3.2 Authority Before Variety

Required lessons, active quests, safety states, and service commitments take precedence over routine variety.

### 3.3 State Before Animation

The authoritative activity state must be valid before locomotion or animation begins.

### 3.4 Travel Is Part of the Schedule

Travel consumes world time and must be represented as an activity, not hidden between two appointments.

### 3.5 Recovery Is a First-Class Outcome

A blocked destination, missing station, invalid route, or interrupted activity must transition into an explicit recovery state.

### 3.6 Unloaded Does Not Mean Unscheduled

NPCs outside active simulation continue to advance through authoritative schedule state using abstract simulation.

### 3.7 Variation Must Be Seeded

Routine variation must be deterministic for a given world seed, day, NPC, and schedule revision unless live authority changes it.

### 3.8 Critical Actors Are Never Silently Dropped

An NPC required by an active lesson, quest, service, mentorship, or event may be delayed or recovered, but never removed without an explicit failure state.

---

## 4. Authority Hierarchy

Schedule decisions must obey this order:

1. **Safety and emergency authority**
2. **Active player-bound lesson, quest, mentorship, or story authority**
3. **Declared event authority**
4. **Persistent appointment or service commitment**
5. **Profession, school, household, and civic obligation**
6. **Recovery obligation**
7. **Base daily routine**
8. **Contextual social opportunity**
9. **Ambient variation**
10. **Visual population convenience**

A lower authority must never invalidate a higher one.

Examples:

- A teacher scheduled for casual lunch may be retained for a player-bound lesson.
- A market-day event may override a merchant's normal workshop routine.
- Rain may move an outdoor break indoors, but may not cancel an emergency evacuation.
- Ambient idling may be removed under performance pressure, but required mentorship may not.

---

## 5. World Time Model

### 5.1 Authoritative Time

The schedule system must read from one authoritative world clock.

Minimum clock state:

```text
worldDayIndex
worldDate
seasonId
dayOfWeek
minuteOfDay
timeScale
isPaused
calendarRevision
```

`minuteOfDay` is the canonical daily scheduling unit.

Recommended range:

```text
0..1439
```

### 5.2 Display Time Versus Simulation Time

Displayed clock formatting may vary by locale, but schedule evaluation must use canonical simulation time.

### 5.3 Time Scale

The world clock may advance faster than real time, but schedule evaluation must remain stable under:

- normal play;
- pause;
- slow motion;
- accelerated travel;
- sleep or rest skip;
- offline or unloaded catch-up;
- debugging time jumps.

### 5.4 Boundary Processing

Crossing a schedule boundary must produce exactly one transition decision per NPC schedule revision.

Repeated evaluation within the same boundary must be idempotent.

### 5.5 Calendar Authority

Calendar data may define:

- weekdays;
- weekends;
- holidays;
- school days;
- market days;
- seasonal work days;
- festivals;
- special closures;
- emergency declarations.

Calendar overrides must be versioned and traceable.

---

## 6. Schedule Data Model

Each persistent NPC schedule should expose at least:

```text
npcId
scheduleProfileId
scheduleRevision
timezoneOrWorldRegion
homeLocationId
currentActivityId
currentActivityState
currentActivityStartedAt
nextEvaluationAt
activeOverrideIds
recoveryState
variationSeed
lastResolvedDayIndex
```

Each schedule activity definition should expose:

```text
activityId
activityType
startWindow
endWindow
durationPolicy
priority
locationPolicy
stationPolicy
travelPolicy
attendancePolicy
interruptPolicy
completionPolicy
fallbackPolicy
conditions
metadata
```

---

## 7. Schedule Activity Types

The production schedule vocabulary must be finite and explicit.

Recommended activity types:

```text
SLEEP
WAKE
PERSONAL_CARE
MEAL
HOUSEHOLD
TRAVEL
WORK
LEARN
TEACH
MENTOR
TRADE
SERVICE
DELIVERY
MAINTENANCE
SOCIAL
RECREATION
EXERCISE
WORSHIP_OR_CEREMONY
EVENT
WAIT
QUEUE
IDLE_CONTEXTUAL
RETURN_HOME
SHELTER
EMERGENCY
RECOVERY
OFFSTAGE
```

Projects may extend the list, but new types must define:

- occupancy meaning;
- completion rules;
- interruption rules;
- simulation-tier behavior;
- persistence requirements;
- recovery behavior;
- observability fields.

---

## 8. Daily Routine Architecture

### 8.1 Base Routine

A base routine is a reusable template assigned by role, life stage, household, profession, school status, and district.

Examples:

- school-age learner weekday;
- workshop craftsperson weekday;
- merchant market day;
- elder resident routine;
- travelling instructor visit day;
- household caregiver routine.

### 8.2 Personal Overlay

A personal overlay modifies the base routine for a named NPC.

Examples:

- opens the shop earlier;
- takes lunch at home;
- teaches only on selected days;
- visits a relative after work;
- avoids a location due to story state.

### 8.3 Day-Type Overlay

A day-type overlay adapts the routine for:

- weekday;
- weekend;
- school holiday;
- market day;
- festival day;
- seasonal work day;
- closure day.

### 8.4 Live Override

A live override is introduced by runtime authority.

Examples:

- active lesson;
- quest appointment;
- emergency;
- weather shelter order;
- event participation;
- service request;
- recovery action.

### 8.5 Resolution Formula

The resolved schedule is conceptually:

```text
resolvedSchedule =
  baseRoutine
  + personalOverlay
  + dayTypeOverlay
  + seasonalOverlay
  + activeLiveOverrides
  - invalidatedActivities
  + recoveryActivities
```

The implementation may use another representation, but authority order must remain equivalent.

---

## 9. Activity Windows

Activities should use windows rather than exact timestamps whenever natural variation is desirable.

Example:

```text
Breakfast window: 06:30–07:30
Work arrival window: 07:45–08:15
Lunch window: 11:30–13:00
```

A window definition must declare:

- earliest start;
- preferred start;
- latest start;
- minimum duration;
- preferred duration;
- maximum duration;
- late policy;
- missed policy.

### 9.1 Exact Appointments

Exact times are reserved for activities requiring synchronization, such as:

- classes;
- ceremonies;
- transport departures;
- player appointments;
- competitions;
- shop opening guarantees.

### 9.2 Flexible Activities

Flexible activities include:

- meals;
- household tasks;
- recreation;
- social visits;
- contextual idling.

### 9.3 Opportunistic Activities

Opportunistic activities run only when time, capacity, and context allow.

Examples:

- greeting a neighbor;
- browsing the market;
- watching construction;
- resting on a bench.

They must never delay higher-priority commitments beyond their allowed lateness threshold.

---

## 10. Duration Policy

Supported duration policies should include:

```text
FIXED
RANGE
UNTIL_WINDOW_END
UNTIL_TASK_COMPLETE
UNTIL_INTERRUPTED
UNTIL_SERVICE_COMPLETE
UNTIL_PLAYER_RELEASE
```

Each activity must declare whether partial completion is meaningful.

Examples:

- Eating may complete after minimum duration.
- A class may require full attendance or an explicit early-exit state.
- A delivery completes only after handoff or declared failure.

---

## 11. Location Resolution

An activity must resolve a semantic destination before pathfinding.

Location policies may include:

```text
HOME_PRIMARY
HOME_ANY_VALID_SLOT
ASSIGNED_WORKPLACE
ASSIGNED_STATION
ASSIGNED_CLASSROOM
NEAREST_VALID_SERVICE
DISTRICT_SOCIAL_SPACE
EVENT_RESERVED_LOCATION
CURRENT_SAFE_LOCATION
DYNAMIC_REQUEST_LOCATION
OFFSTAGE_ABSTRACT_LOCATION
```

Resolution order:

1. explicit reserved destination;
2. assigned persistent destination;
3. valid semantic alternative in the same facility;
4. valid semantic alternative in the district;
5. declared fallback location;
6. recovery state.

Random coordinates are not valid schedule destinations.

---

## 12. Station and Capacity Contracts

Activities that require a station must declare:

- station type;
- reservation need;
- exclusivity;
- capacity;
- arrival grace period;
- release policy;
- fallback station type;
- queue eligibility.

Examples:

- workshop bench;
- classroom seat;
- merchant counter;
- meal seat;
- bed;
- mentorship table;
- event position.

A schedule must not assume station availability merely because a building exists.

---

## 13. Travel Scheduling

### 13.1 Travel Activity

Travel is represented as an explicit activity between origin and destination commitments.

Required travel state:

```text
originLocationId
destinationLocationId
routeIdOrPolicy
expectedDepartureAt
expectedArrivalAt
travelMode
routeStatus
recoveryAttempts
```

### 13.2 Departure Time

Departure time must be calculated from:

- destination start window;
- estimated travel duration;
- preparation buffer;
- congestion allowance;
- accessibility constraints;
- weather modifier;
- NPC mobility profile.

### 13.3 Early Arrival

An NPC arriving early may:

- wait at a valid staging area;
- perform a short opportunistic activity;
- enter the destination if policy permits.

### 13.4 Late Arrival

Late handling must be explicit:

```text
JOIN_LATE
SHORTEN_ACTIVITY
DEFER
RESCHEDULE
FAIL_COMMITMENT
ENTER_RECOVERY
```

### 13.5 Teleportation Policy

Visible teleportation is forbidden during normal active simulation.

Abstract relocation is allowed only when:

- both origin and destination are outside active observation;
- travel completion is valid under elapsed time;
- no player-bound interaction is in progress;
- the relocation is recorded as abstract travel completion;
- arrival occupancy is valid.

---

## 14. Household Schedule Rules

Household routines must coordinate:

- sleeping slots;
- wake windows;
- shared meals;
- dependent care;
- school departure;
- work departure;
- evening return;
- household tasks;
- visitor capacity.

### 14.1 Household Coherence

Household members should not all leave dependents unattended unless a valid care arrangement exists.

### 14.2 Bed Authority

Sleeping requires a valid bed or declared alternate sleep location.

### 14.3 Shared Meals

Shared meals are preferred social anchors but may be split by work, school, event, or gameplay authority.

### 14.4 Return Home

Persistent residents must have a valid end-of-day return policy unless they are:

- on an active overnight visit;
- travelling;
- assigned to overnight work;
- participating in a declared event;
- under emergency shelter authority.

---

## 15. School and Learning Schedules

Learning schedules must define:

- school day eligibility;
- class periods;
- breaks;
- teacher assignment;
- learner cohort;
- classroom or learning space;
- capacity;
- attendance policy;
- late policy;
- cancellation authority;
- player participation rules.

### 15.1 Teacher Guarantee

A scheduled class must not enter active delivery without a valid teacher or explicit substitute authority.

### 15.2 Learner Attendance

Named learners may have persistent attendance state.

Ambient learners may be reconstructed according to class capacity and population budget.

### 15.3 Player-Bound Lessons

A lesson involving the player has higher authority than the teacher's ordinary routine.

The system must define:

- appointment window;
- preparation state;
- waiting state;
- player-late policy;
- cancellation or reschedule policy;
- teacher release condition.

### 15.4 Remediation and Mentorship

Remediation sessions and mentorship appointments must reserve both participant availability and a valid learning location.

---

## 16. Work and Profession Schedules

Profession schedules must define:

- work days;
- opening or shift window;
- assigned workplace;
- required station;
- break policy;
- service coverage;
- closing procedure;
- replacement authority;
- seasonal variation.

### 16.1 Service Coverage

Critical services may require coverage even when an individual worker is absent.

Coverage must be solved through:

- substitute worker;
- reduced service mode;
- scheduled closure;
- explicit unavailable state.

The system must never display a service as available when no valid provider exists.

### 16.2 Shift Handover

Where shifts overlap, handover may be modeled as an activity or station transfer.

### 16.3 Work Completion

An NPC may not abandon a critical in-progress task without following the task's interruption policy.

---

## 17. Merchant Hours

Merchant schedules must distinguish:

```text
PREPARE
OPEN
TEMPORARILY_AWAY
CLOSING
CLOSED
EVENT_MODE
EMERGENCY_CLOSED
```

A merchant's visible presence, service availability, shop UI availability, and economic authority must agree.

### 17.1 Opening Guarantee

If a shop advertises guaranteed hours, the schedule must provide either:

- the assigned merchant;
- an authorized substitute;
- an explicit closure notice.

### 17.2 Temporary Absence

Short breaks may retain shop availability only if the interaction model supports waiting or substitute service.

### 17.3 Market Day

Market-day stalls may use event authority and temporary merchants, but each stall must have explicit attendance and opening windows.

---

## 18. Meal Cycles

Meal activities must support:

- breakfast;
- midday meal;
- evening meal;
- optional snacks;
- shared household meals;
- workplace meals;
- event meals.

Meals should affect routine believability, but exact nutritional simulation is outside this guide unless required by gameplay.

Missed meals may produce schedule variation or status effects only when another system owns that behavior.

---

## 19. Sleep Cycles

Sleep schedules must define:

- preferred sleep window;
- minimum sleep duration;
- assigned bed or alternate location;
- wake window;
- overnight interruption policy;
- oversleep policy;
- night-shift inversion where applicable.

### 19.1 Sleep Reconstruction

When loading during a sleep window, the NPC may be reconstructed in a valid sleep state without simulating every prior movement step.

### 19.2 Wake Transition

Wake should transition through a short preparation state before major commitments unless emergency authority bypasses it.

---

## 20. Social and Recreation Scheduling

Social activities may be driven by:

- household relationship;
- friendship;
- district habit;
- shared profession;
- mentorship;
- event participation;
- proximity opportunity.

Social scheduling must respect:

- location capacity;
- relationship eligibility;
- privacy boundaries;
- higher-priority commitments;
- curfew or household constraints where applicable.

Ambient social groups must not capture named NPCs required elsewhere.

---

## 21. Weekday and Weekend Rules

Day-type behavior should be meaningfully different without forcing every NPC into identical patterns.

Weekdays may emphasize:

- school;
- work;
- deliveries;
- public services;
- structured learning.

Weekends may emphasize:

- family activity;
- market activity;
- recreation;
- community events;
- reduced institutional schedules.

NPCs with rotating shifts or special roles may use alternate calendars.

---

## 22. Seasonal Schedules

Seasonal overlays may modify:

- daylight-linked activity windows;
- farming or gathering work;
- construction hours;
- school calendars;
- weather-sensitive travel;
- market frequency;
- festivals;
- indoor versus outdoor recreation.

Seasonal changes must not rewrite persistent schedule identity. They should resolve through overlays or calendar rules.

---

## 23. Weather Overrides

Weather authority may:

- move outdoor activities indoors;
- delay travel;
- reduce optional visits;
- cancel unsafe work;
- activate shelter behavior;
- alter merchant or event hours.

Weather overrides must declare:

- severity threshold;
- affected activity types;
- replacement location;
- start and release conditions;
- recovery after weather clears.

A light rain should not produce the same override as a dangerous storm unless explicitly designed.

---

## 24. Event Overrides

An event schedule must define:

- event authority ID;
- participant list or population rule;
- setup window;
- arrival window;
- active window;
- departure window;
- reserved locations;
- critical roles;
- fallback roles;
- cancellation policy;
- cleanup state.

Event authority may override normal routines only within its declared scope.

After the event, NPCs must resume through one of:

```text
RETURN_TO_BASE_SCHEDULE
RETURN_HOME
CONTINUE_NEXT_VALID_ACTIVITY
RECOVERY
```

---

## 25. Emergency Schedules

Emergency behavior has highest schedule priority.

Emergency activities may include:

- evacuate;
- shelter;
- assist;
- secure workplace;
- gather household;
- provide medical or civic service;
- remain offstage for safety.

Emergency schedules must define:

- activation authority;
- affected population;
- safe destinations;
- role-based exceptions;
- completion condition;
- restoration policy.

When emergency authority ends, NPCs must not blindly resume an activity whose time window has already expired.

---

## 26. Interruption Model

Every activity must declare an interruption policy.

Supported policies:

```text
NOT_INTERRUPTIBLE
INTERRUPTIBLE_RESUME
INTERRUPTIBLE_RESTART
INTERRUPTIBLE_COMPLETE_EARLY
INTERRUPTIBLE_CANCEL
PLAYER_RELEASE_REQUIRED
```

An interruption record should include:

```text
interruptedActivityId
interruptingAuthority
interruptedAt
progressState
resumeEligibility
resumeDeadline
```

### 26.1 Resume Rules

An activity may resume only if:

- its validity window remains open;
- required location and station remain valid;
- no higher authority remains active;
- resume policy permits it.

Otherwise, the scheduler must choose the next valid activity or recovery.

---

## 27. Priority Conflict Resolution

When multiple valid activities compete, compare in this order:

1. authority tier;
2. explicit reservation;
3. appointment exactness;
4. lateness impact;
5. persistent obligation;
6. travel feasibility;
7. activity priority;
8. seeded variation tie-breaker.

The winning decision must expose a reason code.

Suggested reason codes:

```text
SAFETY_OVERRIDE
PLAYER_COMMITMENT
EVENT_COMMITMENT
SERVICE_GUARANTEE
WORK_OBLIGATION
SCHOOL_OBLIGATION
RECOVERY_REQUIRED
BASE_ROUTINE
CONTEXTUAL_OPPORTUNITY
AMBIENT_VARIATION
```

---

## 28. Schedule State Machine

Recommended top-level states:

```text
UNRESOLVED
PLANNED
PREPARING
TRAVELLING
WAITING
ACTIVE
INTERRUPTED
COMPLETING
COMPLETED
DEFERRED
MISSED
CANCELLED
RECOVERING
OFFSTAGE
```

Valid transition examples:

```text
PLANNED -> PREPARING
PREPARING -> TRAVELLING
TRAVELLING -> WAITING
TRAVELLING -> ACTIVE
WAITING -> ACTIVE
ACTIVE -> COMPLETING
COMPLETING -> COMPLETED
ACTIVE -> INTERRUPTED
INTERRUPTED -> ACTIVE
INTERRUPTED -> CANCELLED
ANY_NONTERMINAL -> RECOVERING
RECOVERING -> PLANNED
RECOVERING -> OFFSTAGE
```

Invalid transitions must be rejected or explicitly mapped through recovery.

---

## 29. Evaluation Cadence

Schedule evaluation must not require full per-frame planning for every NPC.

Recommended cadence:

- event-driven evaluation at boundary changes;
- immediate evaluation on authority changes;
- immediate evaluation on activity completion or failure;
- coarse periodic verification for active NPCs;
- sparse periodic verification for background NPCs;
- abstract catch-up for unloaded NPCs.

Evaluation frequency must be independent from animation update frequency.

---

## 30. Simulation Tiers

### 30.1 Tier 0 — Fully Active

Used for NPCs near or interacting with the player.

Includes:

- locomotion;
- animation;
- station use;
- collision-aware routing;
- live interaction;
- fine activity progress.

### 30.2 Tier 1 — Nearby Abstract

Used for NPCs in loaded but non-critical areas.

Includes:

- coarse navigation;
- reduced animation;
- station occupancy;
- event-driven schedule progress.

### 30.3 Tier 2 — Regional Abstract

Used for NPCs outside direct observation but within the simulated region.

Includes:

- semantic location state;
- abstract travel completion;
- schedule boundary resolution;
- service and event attendance state.

### 30.4 Tier 3 — Offstage

Used for distant or unloaded NPCs.

Includes:

- authoritative current activity;
- semantic destination;
- expected completion time;
- next evaluation time;
- no physical actor requirement.

Critical schedule meaning must survive every tier.

---

## 31. Activation and Deactivation

### 31.1 Activation

When an NPC becomes active, reconstruction must validate:

1. current world time;
2. authoritative activity;
3. semantic location;
4. physical spawn point;
5. station reservation;
6. active overrides;
7. player visibility safety.

### 31.2 Deactivation

Before deactivation, persist or derive:

- current activity state;
- semantic location;
- travel progress or expected arrival;
- station ownership;
- interruption state;
- next evaluation time.

### 31.3 No Pop-In Rule

An NPC must not appear in the player's immediate view without a valid narrative or transition reason.

Use:

- hidden spawn points;
- doorway emergence;
- route entry points;
- off-camera activation;
- explicit arrival events.

---

## 32. Time Skip

Time skip may occur through:

- sleep;
- travel;
- player rest;
- debug control;
- offline progression;
- loading a later world state.

### 32.1 Time-Skip Resolution

For each affected NPC:

1. read the last authoritative schedule state;
2. determine elapsed world time;
3. process critical commitments crossed during the interval;
4. resolve durable outcomes;
5. avoid simulating every minute;
6. determine the valid activity at target time;
7. reconstruct semantic location;
8. queue consequences or missed-commitment records;
9. schedule the next evaluation.

### 32.2 Critical Commitment Crossing

A time skip must not silently erase:

- player appointments;
- lessons;
- deliveries with durable outcomes;
- event participation;
- merchant closures with pending transactions;
- emergency states.

### 32.3 Compression Policy

Routine activities may be compressed into summary outcomes.

Examples:

- sleep completed;
- work shift completed;
- meals assumed completed;
- travel completed;
- social activity elapsed.

Compression must not invent unique rewards, relationship changes, or progression unless the owning system authorizes them.

---

## 33. Save and Load

A save must preserve enough schedule state to reproduce a valid world.

Minimum persistent state for named NPCs:

```text
npcId
scheduleProfileId
scheduleRevision
currentActivityType
currentActivityState
semanticLocationId
activityStartedAt
expectedCompletionAt
activeOverrideIds
interruptionRecord
recoveryState
nextEvaluationAt
lastResolvedDayIndex
```

### 33.1 Load Reconciliation

Load must reconcile:

- saved world time;
- current calendar revision;
- schedule profile revision;
- changed world geometry;
- missing locations or stations;
- expired overrides;
- active player-bound commitments.

### 33.2 Revision Mismatch

If schedule data changed after the save:

1. preserve durable identity and commitments;
2. map old activity to the nearest valid semantic type;
3. validate location;
4. resume when safe;
5. otherwise enter recovery;
6. record the migration reason.

---

## 34. Recovery Architecture

Recovery is required when:

- destination is missing;
- route is invalid;
- station is unavailable;
- activity window expired;
- required participant is absent;
- an override conflicts with a higher authority;
- NPC is outside valid world bounds;
- save state references deleted content;
- schedule loop is detected;
- repeated path failure occurs.

Recommended recovery states:

```text
REPLAN_DESTINATION
WAIT_FOR_CAPACITY
FIND_ALTERNATE_STATION
RETURN_TO_SAFE_ANCHOR
RETURN_HOME
RESCHEDULE_COMMITMENT
MARK_MISSED
ABSTRACT_RELOCATE
OFFSTAGE_HOLD
ESCALATE_CRITICAL_FAILURE
```

### 34.1 Recovery Attempt Limits

Repeated recovery must be bounded.

After the configured limit, the system must:

- choose a deterministic safe fallback;
- release stale reservations;
- preserve critical commitment evidence;
- emit an escalation record.

### 34.2 Safe Anchor

Every persistent NPC should have one or more safe anchors:

- home entrance;
- workplace entrance;
- district arrival point;
- civic recovery point;
- offstage holding state.

---

## 35. Navigation Failure Policy

Navigation failures must distinguish:

```text
NO_ROUTE
ROUTE_BLOCKED_TEMPORARY
ROUTE_BLOCKED_PERSISTENT
DESTINATION_INVALID
DESTINATION_FULL
ACTOR_STUCK
NAVIGATION_TIMEOUT
```

Each classification must map to a defined schedule response.

Example:

- Temporary blockage: wait, retry, or choose alternate route.
- Destination full: queue or use alternate station.
- Persistent no-route: replan destination or recover to safe anchor.
- Actor stuck: local unstuck, hidden relocation if unobserved, then escalation.

---

## 36. Queue and Waiting Rules

Waiting must occur only at valid waiting anchors.

Queue state must include:

```text
queueId
position
joinedAt
maximumWait
serviceTarget
fallbackPolicy
```

NPCs must leave a queue when:

- served;
- maximum wait expires;
- higher authority interrupts;
- service closes;
- queue becomes invalid.

Unbounded waiting is forbidden.

---

## 37. Player Interaction Boundaries

When the player initiates interaction, the schedule system must decide whether the NPC can:

```text
PAUSE_AND_TALK
CONTINUE_CONTEXTUAL_INTERACTION
REFUSE_DUE_TO_CRITICAL_TASK
DEFER_INTERACTION
COMPLETE_CURRENT_STEP_THEN_TALK
```

The interaction layer may not silently destroy the current schedule commitment.

After interaction ends, the scheduler must:

- resume the activity;
- replan if the window changed;
- mark the activity late;
- or select the next valid activity.

---

## 38. Player Blocking and Escort

If the player blocks a route or physically delays an NPC:

- short delays may be tolerated;
- repeated obstruction should trigger alternate routing;
- critical commitments may use protected routing behavior;
- visible teleportation remains prohibited;
- unresolved obstruction must enter recovery.

Escort activities must declare whether the player's presence is required for progress.

---

## 39. Deterministic Variation

Variation may affect:

- start time within a window;
- selected meal seat;
- social destination;
- route choice;
- recreation activity;
- optional visit attendance;
- idle animation set.

Variation seed should derive from stable inputs such as:

```text
worldSeed + npcId + worldDayIndex + scheduleRevision + activityId
```

Variation must not alter critical authority outcomes.

---

## 40. Group Scheduling

Group activities require a group authority record.

Examples:

- class;
- household meal;
- work crew;
- mentorship session;
- event team;
- social gathering.

Group state should define:

```text
groupActivityId
leaderOrAuthorityId
requiredParticipants
optionalParticipants
minimumAttendance
locationId
startWindow
lateJoinPolicy
cancelPolicy
```

A group activity must not wait forever for missing optional participants.

---

## 41. Schedule and Population Distribution Integration

15A determines who may exist and where population capacity is available.

15B determines when those NPCs claim occupancy.

Integration rules:

1. schedule demand may request occupancy but cannot exceed hard safety capacity;
2. critical actors receive protected reservation authority;
3. dynamic and ambient population yields before named persistent actors;
4. district density may shift through travel rather than direct respawn;
5. offstage schedules must not reserve scarce visible stations indefinitely;
6. event reservations must be declared before crowd population is admitted;
7. schedule recovery must release invalid population claims.

---

## 42. Performance Budget

The schedule system must budget:

- active planners;
- path requests;
- station reservations;
- transition evaluations;
- group synchronization;
- time-skip catch-up work;
- observability records.

### 42.1 Budget Priority

Under pressure, reduce in this order:

1. ambient optional planning frequency;
2. social variation;
3. non-visible route detail;
4. background animation state;
5. dynamic population fidelity.

Do not reduce:

- critical commitment correctness;
- persistent identity;
- save/load integrity;
- station exclusivity;
- emergency behavior;
- player-bound schedule authority.

### 42.2 Catch-Up Budget

Large time skips must be processed in bounded batches.

Priority order:

1. player-bound NPCs;
2. active event participants;
3. service-critical NPCs;
4. nearby persistent residents;
5. other persistent residents;
6. dynamic population;
7. ambient population.

---

## 43. Observability

Every schedule decision should be inspectable.

Recommended diagnostic snapshot:

```text
npcId
worldTime
resolvedDayType
scheduleProfileId
scheduleRevision
currentActivity
activityState
activityAuthority
resolvedDestination
stationReservation
travelState
activeOverrides
nextEvaluationAt
lastDecisionReason
recoveryState
simulationTier
```

### 43.1 Decision Trace

A bounded decision trace should record:

```text
timestamp
candidateActivities
selectedActivity
rejectedReasons
authorityComparison
locationResolution
recoveryAction
```

### 43.2 Debug Views

Recommended views:

- NPC current schedule label;
- planned timeline;
- district occupancy timeline;
- station reservation map;
- route intent;
- active overrides;
- missed commitments;
- recovery counters;
- simulation tier.

---

## 44. Failure Classification

Recommended schedule failure codes:

```text
SCHEDULE_PROFILE_MISSING
SCHEDULE_REVISION_INVALID
NO_VALID_ACTIVITY
ACTIVITY_WINDOW_EXPIRED
DESTINATION_MISSING
DESTINATION_INVALID
STATION_MISSING
STATION_CAPACITY_EXHAUSTED
RESERVATION_CONFLICT
NO_ROUTE
TRAVEL_TIMEOUT
NPC_STUCK
REQUIRED_PARTICIPANT_MISSING
GROUP_MINIMUM_NOT_MET
OVERRIDE_CONFLICT
CALENDAR_RULE_INVALID
TIME_SKIP_RECONCILIATION_FAILED
SAVE_STATE_SCHEDULE_INVALID
RECOVERY_LIMIT_EXCEEDED
CRITICAL_COMMITMENT_UNRESOLVED
SCHEDULE_LOOP_DETECTED
```

Each failure must define:

- severity;
- retry eligibility;
- player-visible consequence;
- safe fallback;
- logging fields;
- evidence requirement.

---

## 45. Validation Layers

### 45.1 Static Validation

Validate schedule assets for:

- missing profiles;
- invalid windows;
- overlapping non-interruptible activities;
- missing destinations;
- missing station types;
- impossible travel time;
- invalid priority values;
- fallback loops;
- undefined interruption policies;
- unknown activity types.

### 45.2 Simulation Validation

Run deterministic multi-day simulations to detect:

- stranded NPCs;
- missed critical appointments;
- repeated lateness;
- occupancy overflow;
- station deadlock;
- schedule loops;
- unresolved recovery;
- impossible household coverage;
- empty guaranteed services.

### 45.3 Runtime Validation

Validate during active play:

- visible transition quality;
- path completion;
- player interruption behavior;
- save/load continuity;
- time skip correctness;
- event override restoration;
- weather override restoration;
- performance under population load.

### 45.4 Operational Validation

Validate full flows:

```text
World Clock
-> Schedule Resolution
-> Destination Reservation
-> Travel
-> Activity Execution
-> Completion
-> Next Activity
-> Save
-> Load
-> Correct Reconstruction
```

---

## 46. Required Test Scenarios

The minimum scenario suite must include:

1. normal weekday from wake to sleep;
2. weekend routine variation;
3. school day with teacher and learners;
4. merchant opening, break, and closing;
5. work shift with station reservation;
6. household meal synchronization;
7. player-bound lesson appointment;
8. late player arrival;
9. NPC late arrival due to travel;
10. weather moving outdoor activity indoors;
11. event overriding normal routines;
12. emergency overriding all ordinary schedules;
13. blocked route recovery;
14. destination capacity exhaustion;
15. station reservation conflict;
16. save during travel and reload;
17. save during activity and reload;
18. time skip across multiple activities;
19. time skip across a critical appointment;
20. schedule revision mismatch after load;
21. activation from offstage state;
22. deactivation during travel;
23. player interruption of interruptible activity;
24. refusal during non-interruptible activity;
25. group activity with optional participant missing;
26. group activity below minimum attendance;
27. repeated recovery reaching limit;
28. performance degradation preserving critical actors;
29. midnight and day-boundary transition;
30. seasonal calendar transition.

---

## 47. Evidence Package

A production-ready 15B implementation must provide:

### 47.1 Authority Evidence

- schedule schema;
- activity vocabulary;
- authority hierarchy;
- interruption matrix;
- recovery matrix;
- calendar and override policy.

### 47.2 Content Evidence

- representative schedule profiles;
- weekday and weekend examples;
- school schedule;
- work schedule;
- merchant schedule;
- household schedule;
- event override example;
- weather override example.

### 47.3 Runtime Evidence

- schedule inspector captures;
- station reservation evidence;
- travel transition evidence;
- save/load reconstruction evidence;
- time-skip evidence;
- recovery evidence;
- simulation-tier evidence.

### 47.4 Performance Evidence

- active planner counts;
- path request rates;
- catch-up processing time;
- schedule evaluation cost;
- degradation behavior under population load.

### 47.5 Failure Evidence

- blocked route case;
- missing station case;
- missed appointment case;
- schedule loop detection;
- recovery-limit escalation.

---

## 48. Acceptance Criteria

15B is accepted only when:

1. one authoritative world clock drives all NPC schedules;
2. schedule authority hierarchy is explicit and enforced;
3. named NPCs have valid daily routines and semantic locations;
4. travel is represented and budgeted as schedule time;
5. work, school, household, merchant, and social routines resolve correctly;
6. weather, event, and emergency overrides restore safely;
7. save/load reconstructs valid activity and location state;
8. time skip preserves critical commitments and durable outcomes;
9. unloaded NPCs continue through abstract schedule state;
10. blocked activities enter bounded recovery;
11. critical actors survive performance degradation;
12. schedule decisions are observable and explainable;
13. deterministic multi-day validation passes;
14. no unresolved critical failure remains;
15. the evidence package is complete.

---

## 49. Exit Gate

The phase may advance to 15C only when the following statement is true:

> Builder's Valley NPCs now possess authoritative, deterministic, recoverable daily schedules that coordinate home life, work, learning, trade, travel, social activity, events, weather, emergencies, save/load, and time skip without sacrificing critical gameplay commitments or simulation performance.

Required gate result:

```text
15B_DAILY_SCHEDULE_PRODUCTION_GUIDE = PASS
```

Blocking results:

```text
15B_DAILY_SCHEDULE_PRODUCTION_GUIDE = BLOCKED
15B_DAILY_SCHEDULE_PRODUCTION_GUIDE = FAIL
```

A blocked or failed result must identify:

- violated authority;
- affected NPC class;
- affected activity;
- schedule state;
- world time and day type;
- location or station impact;
- recovery status;
- required corrective action;
- evidence still missing.

---

## 50. Handoff to 15C

15B establishes **when NPCs act and where their activities occur**.

15C must define **what authority, responsibilities, capabilities, permissions, obligations, and gameplay meaning each NPC role carries**.

The handoff contract requires 15C to consume:

- schedule activity types;
- service commitments;
- school and mentorship commitments;
- station requirements;
- interruption policy;
- event and emergency priority;
- recovery expectations;
- population class boundaries from 15A.

15C must not redefine the world clock, schedule state machine, time-skip policy, or schedule authority hierarchy unless a documented architecture revision is approved.

---

# Final Production Statement

A believable population is not created merely by placing NPCs in the world.

It is created when each NPC belongs to time as clearly as they belong to place.

Builder's Valley must therefore schedule meaning, obligation, movement, presence, absence, interruption, and recovery as one coherent system.

The daily schedule is the temporal spine of the population simulation.
