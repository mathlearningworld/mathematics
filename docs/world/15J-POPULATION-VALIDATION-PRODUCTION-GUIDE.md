# 15J — Population Validation Production Guide

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 15 — NPC & Population System  
**Guide:** 15J — Population Validation  
**Status:** Production Ready  
**Authority Level:** Phase Completion Contract  
**Parent Authority:** `15-NPC-AND-POPULATION-SYSTEM-GUIDE.md`  
**Upstream Dependencies:** 15A, 15B, 15C, 15D, 15E, 15F, 15G, 15H, 15I  
**Downstream Handoff:** Phase 15 completion and integration into later world systems

---

## 1. Purpose

This guide defines the authoritative validation model for the complete NPC and population system of Builder's Valley.

It converts the design and production rules established by Phase 15 into observable, testable, diagnosable, and releasable evidence.

The validation system must determine whether:

- every resident belongs to a valid population structure;
- every NPC has a coherent identity, role, home, schedule, and simulation state;
- required professions and services are available;
- households remain structurally valid;
- merchants are reachable and economically coherent;
- conversations are reachable and contextually valid;
- interactions respect permissions, distance, state, and cooldown rules;
- reputation changes propagate to the correct actors and scopes;
- event participation respects capacity, eligibility, schedule, and attendance rules;
- save/load restores the same authoritative population state;
- streaming and simulation-tier transitions do not duplicate, lose, or corrupt NPCs;
- the player can always access critical learning, guidance, trade, recovery, and progression services;
- population density remains believable and within runtime budgets;
- failures produce useful evidence instead of silently degrading the world.

This document establishes the final production gate for Phase 15.

The governing principle is:

> Population validation does not ask whether NPCs merely exist. It proves that the community remains coherent, reachable, deterministic, affordable, and safe for progression.

---

## 2. Scope

This guide covers validation of:

- population authority;
- identity uniqueness;
- resident distribution;
- district capacity;
- household integrity;
- home assignment;
- daily schedules;
- route feasibility;
- NPC roles;
- profession coverage;
- service availability;
- merchant economy participation;
- conversation reachability;
- interaction eligibility;
- reputation propagation;
- event participation;
- simulation tiers;
- activation and deactivation;
- streaming boundaries;
- persistence;
- save/load determinism;
- failure recovery;
- telemetry;
- diagnostics;
- automated validation;
- manual QA;
- production exit criteria;
- live-operations monitoring.

This guide does not redefine the gameplay rules of 15A–15I. It verifies that implementations conform to those authorities.

---

## 3. Validation Outcomes

A conforming implementation must produce four levels of evidence.

### 3.1 Structural evidence

Structural evidence proves that authored and persisted data is internally valid before runtime simulation begins.

Examples:

- unique NPC identifiers;
- valid district references;
- valid household membership;
- valid profession references;
- valid schedule blocks;
- valid merchant inventory profiles;
- valid reputation scopes;
- valid event-role definitions.

### 3.2 Runtime evidence

Runtime evidence proves that the active population behaves coherently while the world is running.

Examples:

- NPCs reach scheduled destinations;
- services open when expected;
- interactions become available at valid distance;
- event attendees arrive without exceeding capacity;
- simulation tiers transition without duplication;
- navigation failure triggers recovery.

### 3.3 Persistence evidence

Persistence evidence proves that authoritative state survives save, load, reconnect, restart, and version migration.

Examples:

- the same NPC remains the same person after loading;
- household membership is preserved;
- schedule position is restored from authoritative time;
- reputation values do not reset or double-apply;
- completed event obligations are not replayed;
- merchant stock does not duplicate.

### 3.4 Experience evidence

Experience evidence proves that population systems support the intended player experience.

Examples:

- the world feels inhabited rather than random;
- critical services are understandable and reachable;
- the player is not blocked by an absent NPC;
- NPC reactions remain consistent with prior actions;
- crowds do not obstruct learning interactions;
- event participation remains readable;
- failures recover without breaking progression.

A system is not production-ready if it passes structural checks but fails runtime or experience evidence.

---

## 4. Validation Authority

### 4.1 Source-of-truth hierarchy

When validation sources disagree, authority is resolved in this order:

1. Phase 15 parent guide;
2. applicable child guide 15A–15I;
3. versioned population schema;
4. authored population manifest;
5. persisted runtime state;
6. runtime projection;
7. rendered scene state;
8. telemetry and logs.

The rendered scene is evidence, not authority.

An NPC visible in the world but absent from the authoritative population registry is invalid.

An NPC present in the registry but intentionally dormant is not invalid merely because it is not rendered.

### 4.2 Validation ownership

| Area | Primary owner | Required collaborators |
|---|---|---|
| Population schema | Gameplay engineering | World design, QA |
| Authored resident data | World design | Narrative, gameplay engineering |
| Schedule validation | AI/gameplay engineering | Level design, QA |
| Profession coverage | Systems design | World design, economy design |
| Merchant validation | Economy engineering | Systems design, QA |
| Conversation validation | Narrative systems | Gameplay engineering, localization |
| Reputation validation | Gameplay systems | Narrative, analytics |
| Event validation | Event systems | AI, world design, QA |
| Runtime budgets | Engineering | Technical art, QA |
| Production gate | Phase owner | All contributing disciplines |

### 4.3 No silent correction rule

The runtime may recover from known operational failures, but it must not silently rewrite authored authority in ways that hide defects.

Permitted examples:

- move a blocked NPC to a nearby recovery anchor;
- skip an optional ambient task;
- defer a noncritical visitor spawn;
- substitute an approved backup service provider.

Prohibited examples:

- permanently changing an NPC profession because coverage is missing;
- inventing a household assignment during load;
- resetting reputation to remove an invalid value;
- deleting duplicate identities without recording evidence;
- marking an event obligation complete merely to unblock the state machine.

---

## 5. Validation Severity Model

Every finding must use one of the following severities.

### 5.1 BLOCKER

A blocker prevents release or requires immediate live mitigation.

Examples:

- duplicate authoritative NPC identity;
- player progression permanently blocked by absent required service;
- save/load duplicates or deletes residents;
- cross-household ownership corruption;
- event state causes unrecoverable population deadlock;
- reputation corruption grants or removes progression incorrectly;
- population update crashes the game or corrupts a save.

### 5.2 CRITICAL

A critical defect threatens core coherence, progression, or large-scale reliability.

Examples:

- required profession unavailable for a substantial period;
- many NPCs fail schedules because of a common navigation defect;
- merchants repeatedly open without valid inventory authority;
- conversation entry points are unreachable for a required quest;
- event capacity is exceeded and participants overlap or deadlock.

### 5.3 MAJOR

A major defect significantly harms believability or usability but has a workaround.

Examples:

- a household member repeatedly sleeps at the wrong home;
- a backup merchant opens later than the defined recovery target;
- reputation reaction appears one session late;
- one district exceeds density targets during a recurring event;
- noncritical NPCs repeatedly fail a route.

### 5.4 MINOR

A minor defect is visible but does not materially threaten progression or authority.

Examples:

- an ambient arrival is slightly late;
- a low-priority idle animation is inconsistent;
- a nonessential conversation greeting repeats too frequently;
- a cosmetic visitor distribution differs from target within tolerance.

### 5.5 INFORMATIONAL

An informational finding records an observation, trend, or optimization opportunity.

No release decision may treat a BLOCKER or CRITICAL finding as merely informational.

---

## 6. Validation Execution Modes

### 6.1 Authoring-time validation

Runs when population content is created or changed.

It must reject invalid references, impossible values, malformed schedules, incomplete role definitions, and unsupported state combinations before content is merged.

### 6.2 Build-time validation

Runs against the complete world dataset.

It must evaluate cross-file and population-wide constraints that cannot be validated in a single asset.

### 6.3 Startup validation

Runs when a world instance starts.

It must verify schema version, migration result, population registry integrity, required service coverage, and save compatibility.

### 6.4 Continuous runtime validation

Runs incrementally while the simulation is active.

It must be budgeted, sampled where appropriate, and capable of detecting drift without performing expensive full-world scans every frame.

### 6.5 Checkpoint validation

Runs at authoritative lifecycle boundaries such as:

- day start;
- day end;
- event open;
- event close;
- save creation;
- save load;
- district activation;
- district deactivation;
- major quest transition;
- population migration.

### 6.6 Offline soak validation

Runs accelerated or unattended simulation over many world days.

It must detect gradual drift, resource leaks, schedule starvation, reputation divergence, population accumulation, visitor retention, and event residue.

### 6.7 Release-candidate validation

Runs the complete mandatory suite against the exact release candidate.

A prior branch result is not sufficient evidence for a different candidate.

---

## 7. Canonical Validation Record

Every automated or manual validation finding must be representable as a structured record.

```ts
export interface PopulationValidationFinding {
  findingId: string;
  ruleId: string;
  severity: 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFORMATIONAL';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'MITIGATED' | 'RESOLVED' | 'WAIVED';
  source: 'AUTHORING' | 'BUILD' | 'STARTUP' | 'RUNTIME' | 'CHECKPOINT' | 'SOAK' | 'MANUAL';
  worldId: string;
  districtId?: string;
  npcId?: string;
  householdId?: string;
  professionId?: string;
  merchantId?: string;
  conversationId?: string;
  reputationScopeId?: string;
  eventId?: string;
  timestamp: string;
  worldTime?: string;
  summary: string;
  expected: unknown;
  observed: unknown;
  evidenceRefs: string[];
  recoveryAction?: string;
  buildVersion: string;
  schemaVersion: string;
}
```

Required properties:

- findings are uniquely identifiable;
- repeated observations may be grouped without losing count;
- the first occurrence and latest occurrence are retained;
- evidence can be traced to the affected authority;
- a recovery action does not automatically resolve the root finding;
- waivers require owner, reason, scope, and expiration.

---

## 8. Global Population Invariants

The following invariants apply to every world state.

### INV-POP-001 — Unique identity

Every authoritative NPC has exactly one stable `npcId` within the world namespace.

No two residents, visitors, projections, event participants, or dormant records may share the same authoritative identity.

### INV-POP-002 — One authoritative registry entry

Every NPC represented by runtime state must resolve to exactly one authoritative population registry entry.

### INV-POP-003 — Valid lifecycle state

Every NPC lifecycle state must be one of the versioned supported states.

A dead, retired, departed, dormant, active, visiting, or event-bound state must obey its own transition rules.

### INV-POP-004 — Valid place relationship

Every resident has a valid home settlement relationship unless explicitly modeled as unhoused, transient, or institutional.

Every active NPC has a valid current district or approved transit state.

### INV-POP-005 — Valid time relationship

Every scheduled action must reference a valid world-time interval and must not create impossible overlapping mandatory commitments.

### INV-POP-006 — Valid role relationship

Every profession, merchant, mentor, learner, host, organizer, or service role must resolve to a supported role definition.

### INV-POP-007 — Critical service continuity

The population must preserve access to all critical services within defined availability windows or activate an approved fallback.

### INV-POP-008 — No unrecoverable route dependency

No mandatory progression step may rely on an NPC reaching a destination through a route that has no recovery path.

### INV-POP-009 — Deterministic persistence

Saving and loading without intervening authoritative time progression must preserve equivalent population authority.

### INV-POP-010 — No duplicate reward or consequence

Population-triggered rewards, reputation changes, inventory transfers, and event outcomes must be idempotent.

### INV-POP-011 — Simulation-budget compliance

Population simulation must remain within defined CPU, memory, navigation, animation, and rendering budgets for each target device tier.

### INV-POP-012 — Learning-first safety

Population density, motion, interaction prompts, conversations, and events must not obstruct required mathematical learning interactions.

---

## 9. Population Distribution Validation

This section validates conformance to 15A.

### 9.1 Resident count validation

For each district, validate:

- authored resident count;
- persisted resident count;
- active resident count;
- dormant resident count;
- visitor count;
- ambient proxy count;
- event participant count;
- maximum supported visible population;
- maximum supported simulated population.

The following identity must hold:

```text
registered population
= active authoritative NPCs
+ dormant authoritative NPCs
+ approved absent residents
+ approved visitors currently owned by another population authority
```

Rendered crowd proxies must not be counted as authoritative residents unless explicitly promoted.

### 9.2 District capacity validation

Each district must define:

- normal occupancy target;
- soft capacity;
- hard capacity;
- event capacity;
- evacuation or overflow destination;
- simulation budget;
- visible-density budget.

Validation must detect:

- sustained occupancy above hard capacity;
- recurring occupancy above soft capacity;
- zero-capacity locations receiving scheduled NPCs;
- event plans exceeding event capacity;
- overflow routes that lead to another saturated district;
- density that blocks player navigation or learning stations.

### 9.3 Spawn and despawn validation

Validate that:

- an authoritative NPC is not spawned twice;
- despawn does not delete authority;
- respawn restores the correct state;
- event activation does not create a duplicate participant;
- streaming boundaries cannot leave both source and destination instances active;
- ambient proxies cannot inherit authoritative inventory or reputation;
- visitor departure removes temporary presence without deleting durable history.

### 9.4 Distribution acceptance rules

A district passes distribution validation when:

- resident ownership is complete;
- no authoritative identity is duplicated;
- expected services are represented;
- density remains within target tolerance;
- required destinations are reachable;
- event peaks remain within approved overflow plans;
- dormant and active counts reconcile.

---

## 10. Household Validation

### 10.1 Household structural rules

Every household must have:

- a unique `householdId`;
- at least one valid member unless marked dissolved;
- a valid home or approved temporary residence;
- a supported household type;
- valid ownership or tenancy authority;
- valid guardian relationships where required;
- no member duplicated within the same household;
- no member assigned to multiple primary households unless the model explicitly supports shared custody or split residence.

### 10.2 Household lifecycle validation

Supported transitions may include:

```text
FORMING -> ACTIVE -> RELOCATING -> ACTIVE
ACTIVE -> SPLITTING -> ACTIVE + ACTIVE
ACTIVE -> DISSOLVING -> DISSOLVED
ACTIVE -> TEMPORARILY_DISPLACED -> ACTIVE
```

Validation must reject:

- transition without required destination;
- dissolved household retaining active home ownership unintentionally;
- child or dependent left without valid guardian coverage when the game model requires it;
- household move that leaves schedules permanently targeting the former home;
- duplicated possessions caused by relocation replay.

### 10.3 Home occupancy validation

For every residence, verify:

- supported occupant capacity;
- primary household assignment;
- guest policy;
- sleeping-space requirements if modeled;
- access permissions;
- schedule compatibility;
- no impossible simultaneous exclusive ownership.

### 10.4 Household experience validation

Manual and automated checks must confirm that:

- members plausibly return home;
- household relationships are reflected in greetings and reactions;
- home access is coherent;
- a relocation becomes visible within the intended time window;
- family event participation does not create contradictory commitments;
- absence, travel, or work explains missing members.

---

## 11. Daily Schedule Validation

This section validates conformance to 15B.

### 11.1 Schedule syntax validation

Every schedule block must include:

- stable block identity;
- start condition;
- end condition;
- activity type;
- destination or approved location-free activity;
- priority;
- interruption policy;
- fallback behavior;
- recurrence rule where applicable.

Reject:

- negative duration;
- end before start;
- unsupported recurrence;
- invalid destination;
- impossible mandatory overlap;
- missing fallback for critical activity;
- circular dependency between schedule conditions.

### 11.2 Schedule coverage

Each persistent NPC must have valid behavior for the complete simulation day.

Coverage may be explicit or provided by an approved default state.

The validator must detect:

- uncovered time gaps;
- indefinite blocking states;
- schedules that never reach rest or reset;
- repeated mandatory tasks with no travel time;
- work shifts longer than policy permits;
- learner schedules that conflict with required learning periods;
- merchant schedules that contradict published opening hours.

### 11.3 Travel feasibility

For consecutive mandatory blocks:

```text
available transition time >= estimated route time + transition margin
```

Validation must account for:

- district boundaries;
- door and gate hours;
- event closures;
- accessibility requirements;
- transport availability;
- known congestion;
- weather or hazard modifiers where applicable.

### 11.4 Schedule runtime drift

Track:

- planned start time;
- actual start time;
- planned destination;
- actual destination;
- reason for delay;
- recovery action;
- completion or abandonment.

Recommended thresholds:

| Schedule class | Warning drift | Failure drift |
|---|---:|---:|
| Critical service opening | 2 world minutes | 5 world minutes |
| Required quest meeting | 2 world minutes | 5 world minutes |
| School or mentor session | 5 world minutes | 10 world minutes |
| Normal profession work | 10 world minutes | 20 world minutes |
| Social activity | 15 world minutes | 30 world minutes |
| Ambient activity | sampled only | no hard failure unless systemic |

Project-specific tuning may change these values, but every class must define thresholds.

### 11.5 Schedule starvation

A schedule item is starved when higher-priority interruptions repeatedly prevent it from executing.

Validation must detect starvation across multiple days, not only within one day.

Critical rest, food, service, learning, and recovery tasks must never starve indefinitely.

---

## 12. NPC Role Validation

This section validates conformance to 15C.

### 12.1 Role assignment rules

Every role assignment must specify:

- role identity;
- owning NPC;
- scope;
- effective start;
- effective end or open-ended status;
- authority level;
- required capabilities;
- exclusivity policy;
- substitution policy.

### 12.2 Capability validation

An NPC may be assigned to a role only when required capabilities are satisfied.

Examples:

- a mentor must have the required subject and level authority;
- a merchant must have a valid merchant profile;
- an event host must have host permissions;
- a profession supervisor must satisfy profession rank rules;
- a guide must have valid destination knowledge;
- a repair role must have the required trade capability.

### 12.3 Conflicting roles

Validation must detect:

- two exclusive primary roles active at the same time;
- simultaneous service obligations in distant districts;
- event assignment conflicting with required merchant opening;
- mentor assignment conflicting with school duty;
- temporary role that never expires;
- role replacement that leaves stale interaction permissions.

### 12.4 Role reachability

A valid role is not sufficient if the player cannot reach the NPC when the role is required.

Validate:

- location access;
- schedule window;
- interaction permission;
- route availability;
- conversation entry point;
- fallback provider;
- event override behavior.

---

## 13. Profession Coverage Validation

This section validates conformance to 15D.

### 13.1 Coverage classes

Professions must be classified as:

- critical progression service;
- critical world operation;
- important recurring service;
- optional enrichment;
- ambient support.

Each class defines:

- minimum providers;
- maximum simultaneous absence;
- service window;
- substitution rules;
- recovery target;
- escalation severity.

### 13.2 Minimum coverage

For every profession and service window:

```text
available qualified providers - unavailable providers >= required minimum coverage
```

Unavailable providers include NPCs who are:

- outside reachable range;
- in conflicting mandatory events;
- incapacitated;
- not yet active;
- retired;
- missing from the population registry;
- blocked by navigation beyond the recovery threshold.

### 13.3 Backup provider validation

A backup is valid only if:

- explicitly authorized;
- qualified for the service;
- reachable within the recovery target;
- not already committed to an incompatible critical role;
- able to expose the correct interaction or conversation;
- able to complete required persistence effects.

### 13.4 Profession progression validation

Where professions support ranks or apprenticeship, validate:

- valid prerequisite chain;
- no impossible promotion requirement;
- mentor availability;
- preserved earned progress;
- no rank downgrade during save/load;
- authority changes propagated to role and interaction systems.

---

## 14. Merchant Economy Validation

This section validates conformance to 15E.

### 14.1 Merchant identity and authority

Every merchant must resolve to:

- one authoritative NPC or approved institutional provider;
- one merchant profile;
- one or more valid sales channels;
- an inventory authority;
- a price authority;
- an opening schedule;
- a location or approved mobile route;
- supported currencies;
- transaction persistence.

### 14.2 Inventory validation

Validate:

- no negative stock unless explicitly supported;
- no duplicated unique items;
- stock ownership matches merchant authority;
- restock source exists;
- reserved stock is not simultaneously sold;
- event stock returns or transitions correctly;
- save/load does not duplicate stock;
- failed transactions are atomic;
- displayed stock equals authoritative purchasable stock within projection tolerance.

### 14.3 Price validation

Validate:

- price is finite and nonnegative;
- currency is supported;
- reputation modifiers remain within bounds;
- event modifiers have valid scope and expiry;
- discounts do not stack beyond policy;
- purchase and refund use compatible authority;
- UI projection matches transaction authority;
- rounding is deterministic.

### 14.4 Merchant availability

A published merchant service must be available during its committed window or expose an approved explanation and fallback.

Validation must detect:

- merchant absent while shop appears open;
- merchant present but interaction unavailable;
- merchant trapped behind inaccessible geometry;
- inventory service unavailable because conversation state is invalid;
- shop closed by event without alternative access for critical goods.

### 14.5 Transaction idempotency

Every transaction must have a stable operation identity.

Retrying the same confirmed transaction must not:

- charge twice;
- grant items twice;
- reduce stock twice;
- apply reputation twice;
- create duplicate receipts.

---

## 15. Conversation Validation

This section validates conformance to 15F.

### 15.1 Conversation graph integrity

Validate:

- unique node identifiers;
- valid entry nodes;
- valid outgoing references;
- no required path ending in an unintended dead end;
- condition expressions reference supported state;
- actions reference supported operations;
- localization key exists for all player-visible text;
- fallback line exists where policy requires it;
- graph version is compatible with persisted conversation state.

### 15.2 Reachability

For each required conversation outcome, prove at least one valid path from an available entry point under the intended world conditions.

Required outcomes include:

- tutorial guidance;
- learning support;
- quest acceptance;
- quest completion;
- merchant access;
- service explanation;
- event registration;
- reputation feedback;
- recovery guidance.

### 15.3 Context consistency

Conversation content must be consistent with:

- NPC identity;
- role;
- profession;
- household relationship;
- current schedule state;
- location;
- world time;
- event participation;
- reputation;
- quest state;
- known prior interactions.

### 15.4 Repetition and cooldown validation

Validate that:

- one-time lines do not repeat;
- cooldowns persist correctly;
- fallback greetings remain available;
- repeated interactions do not block required options;
- event lines expire after the event;
- reputation reactions update within the defined propagation window.

### 15.5 Conversation failure recovery

If a graph cannot resolve a valid node, the system must:

1. record the graph, node, conditions, and NPC identity;
2. stop unsafe actions;
3. select an approved fallback response;
4. preserve player progression state;
5. expose diagnostics in development builds;
6. avoid corrupting persisted conversation history.

---

## 16. Interaction Validation

This section validates conformance to 15G.

### 16.1 Interaction eligibility

Every interaction must evaluate:

- actor identity;
- target identity;
- interaction type;
- distance;
- line of access where required;
- target lifecycle state;
- target schedule state;
- permission;
- cooldown;
- required item or capability;
- conflicting modal state;
- event override;
- safety restrictions.

### 16.2 Prompt correctness

An interaction prompt may be shown only when the interaction can reasonably begin.

Validation must detect:

- prompt shown outside range;
- prompt shown through blocked geometry when prohibited;
- prompt shown for inactive NPC;
- prompt missing for eligible critical interaction;
- prompt action differing from executed action;
- stale prompt after target state changes;
- multiple prompts competing without deterministic priority.

### 16.3 Interaction lifecycle

Canonical lifecycle:

```text
DISCOVERABLE -> ELIGIBLE -> OFFERED -> STARTING -> ACTIVE -> COMPLETING -> COMPLETED
                                  \-> REFUSED
                                  \-> INTERRUPTED -> RECOVERED | CANCELLED
```

Every transition must be valid and observable.

### 16.4 Mutual exclusion

Validate whether an NPC may:

- converse with multiple actors;
- trade while moving;
- join an event while serving a merchant interaction;
- accept a new interaction during critical animation;
- be interrupted by schedule transitions;
- be streamed out while interaction is active.

The implementation must follow explicit policy, not accidental engine behavior.

### 16.5 Interaction completion

Completion must be atomic for effects such as:

- item transfer;
- quest progression;
- reputation change;
- service completion;
- event registration;
- payment;
- learned information.

---

## 17. Reputation Validation

This section validates conformance to 15H.

### 17.1 Reputation record integrity

Every reputation record must include:

- subject;
- scope;
- value or tier;
- source evidence;
- effective time;
- version;
- applied operation identity where change is transactional.

### 17.2 Bounds and tier validation

Validate:

- values remain within configured bounds;
- tier mapping has no gaps or overlaps;
- boundary behavior is deterministic;
- modifiers do not bypass clamps;
- decay does not cross protected minimums unexpectedly;
- migration preserves equivalent tier meaning.

### 17.3 Propagation validation

A reputation event may affect:

- one NPC;
- a household;
- a profession group;
- a district;
- an institution;
- the wider valley.

Validate that propagation:

- uses the correct scope;
- applies once;
- reaches intended observers;
- excludes non-observers where required;
- respects delay policy;
- expires when temporary;
- updates conversations, prices, permissions, and event eligibility consistently.

### 17.4 Evidence validation

Reputation must not change without a traceable cause.

The validator must detect:

- unexplained value changes;
- duplicate application;
- lost source evidence;
- source evidence referencing a nonexistent event or interaction;
- stale projection after authoritative change.

### 17.5 Reputation recovery

Recovery must prefer replay from durable evidence over resetting values.

A reset is allowed only through explicit migration or administrative repair with audit evidence.

---

## 18. Event Participation Validation

This section validates conformance to 15I.

### 18.1 Event definition integrity

Validate:

- unique event definition identity;
- supported category;
- valid lifecycle;
- valid venue;
- valid capacity;
- valid organizer;
- valid role definitions;
- valid eligibility policy;
- valid schedule window;
- valid reward and consequence operations;
- valid cancellation and recovery policy.

### 18.2 Invitation and registration

Validate:

- invitation targets exist;
- eligibility is evaluated against authoritative state;
- registration is idempotent;
- waitlist order is deterministic;
- capacity is not exceeded;
- cancellation releases capacity;
- household or group registration follows policy;
- required roles are filled before event activation.

### 18.3 Schedule reservation

An accepted event commitment must reserve or override schedule time according to priority rules.

Detect:

- participant committed to simultaneous mandatory events;
- merchant closure without approved fallback;
- required profession coverage falling below minimum;
- participant route time omitted;
- event cleanup overlapping the next mandatory schedule block.

### 18.4 Arrival and presence

Validate:

- participant starts travel within the expected window;
- participant reaches the correct venue;
- check-in occurs once;
- presence state matches actual authoritative participation;
- streamed-out participants remain logically represented;
- early departure follows policy;
- no-show is recorded accurately;
- event capacity includes all authoritative present participants.

### 18.5 Event completion

Validate that event closure:

- completes each obligation once;
- applies rewards once;
- applies reputation effects once;
- releases schedule reservations;
- releases venue capacity;
- clears temporary roles;
- returns merchants and workers to valid schedules;
- persists attendance history;
- removes temporary interaction overrides;
- leaves no active event residue.

---

## 19. Cross-System Consistency Validation

Individual systems may pass independently while their integration fails.

The following cross-system checks are mandatory.

### 19.1 Distribution × Schedule

- scheduled district has capacity;
- destination belongs to the active world topology;
- travel path exists;
- activation rules can represent the NPC at arrival;
- event crowd does not invalidate normal schedule density.

### 19.2 Household × Schedule

- home activities target the correct residence;
- relocation updates future schedule destinations;
- household events do not conflict with mandatory work without policy;
- dependents retain guardian coverage where required.

### 19.3 Role × Profession

- profession grants required capabilities;
- temporary role does not exceed profession authority;
- role expiration removes permissions;
- promotion updates service coverage.

### 19.4 Profession × Merchant

- merchant role has valid profession or institutional authority;
- shop schedule aligns with provider schedule;
- backup provider has transaction authority;
- event participation does not silently remove critical goods access.

### 19.5 Conversation × Interaction

- every offered conversation has a valid interaction entry;
- interaction permission and conversation conditions agree;
- conversation completion returns interaction lifecycle to a valid state;
- interrupted conversation does not duplicate effects.

### 19.6 Reputation × Conversation

- reputation tier selects valid content;
- threshold transitions update available lines;
- temporary reputation modifiers expire from conversation context;
- fallback content remains available at all tiers.

### 19.7 Reputation × Merchant

- price modifier matches authoritative reputation;
- displayed price matches transaction price;
- refund uses correct historical or current price policy;
- reputation change is not applied twice by purchase and conversation completion.

### 19.8 Event × Population coverage

- attendees remain represented in district population totals;
- event assignments preserve critical service coverage;
- venue capacity and district capacity both pass;
- no temporary event NPC survives beyond lifecycle policy.

---

## 20. Simulation-Tier Validation

Population simulation may use multiple levels of detail.

Recommended tiers:

- Tier 0 — authoritative dormant record;
- Tier 1 — coarse schedule simulation;
- Tier 2 — active logical simulation;
- Tier 3 — full local gameplay simulation;
- Tier 4 — direct player interaction or cinematic authority.

### 20.1 Tier transition invariants

During every transition:

- identity remains stable;
- authoritative inventory remains stable;
- schedule intent remains stable;
- current location remains equivalent within permitted projection tolerance;
- reputation remains stable;
- event obligations remain stable;
- no duplicate runtime entity exists;
- no required state is dropped;
- transition is idempotent.

### 20.2 Promotion validation

When promoting to a higher tier, validate:

- correct visual representation;
- correct transform or approved arrival anchor;
- correct animation state;
- correct interaction availability;
- correct inventory projection;
- correct event and schedule context.

### 20.3 Demotion validation

When demoting to a lower tier, validate:

- active interactions are completed, transferred, or safely cancelled;
- movement intent converts to coarse simulation state;
- transient visual effects are not persisted as authority;
- reserved resources are released;
- the NPC can be promoted again without divergence.

### 20.4 Streaming churn test

Repeatedly cross a streaming boundary while tracking selected NPCs.

Pass criteria:

- no identity duplication;
- no count drift;
- no schedule reset;
- no inventory duplication;
- no repeated greetings caused by lost history;
- no event check-in replay;
- no memory growth beyond tolerance.

---

## 21. Navigation and Location Validation

### 21.1 Required location types

Validate navigation for:

- residences;
- workplaces;
- merchant counters;
- schools and mentor spaces;
- public gathering places;
- event venues;
- recovery anchors;
- district entrances;
- transport stops;
- emergency or overflow locations.

### 21.2 Route test classes

- static route test;
- time-dependent gate test;
- congestion test;
- event-closure test;
- accessibility test;
- streaming-boundary test;
- interrupted-route recovery test;
- moving-target interaction test.

### 21.3 Stuck detection

An NPC is considered potentially stuck when one or more conditions hold:

- movement progress remains below threshold for a defined duration;
- repeated path recalculation exceeds limit;
- distance to destination increases continuously without valid detour;
- NPC oscillates between navigation nodes;
- NPC remains outside all valid navigation areas;
- schedule lateness exceeds route-recovery threshold.

### 21.4 Recovery hierarchy

1. recalculate current route;
2. select alternate approved route;
3. wait for temporary obstruction;
4. move to nearest safe recovery anchor;
5. use coarse travel simulation if policy permits;
6. activate approved service backup;
7. record unresolved failure and protect progression.

Teleport recovery must be logged and must never occur visibly in a way that damages player trust unless presented intentionally.

---

## 22. Persistence and Save/Load Validation

### 22.1 Authoritative save content

The population save must preserve, directly or derivably:

- schema version;
- world time;
- NPC identity and lifecycle;
- household membership;
- home assignment;
- profession and role assignments;
- schedule state;
- current coarse location;
- inventory authority;
- merchant state;
- conversation history required for consistency;
- reputation records and evidence;
- event commitments and outcomes;
- pending idempotent operations;
- migration metadata.

### 22.2 Save invariants

A save operation must:

- capture one coherent authority version;
- avoid partial cross-system snapshots;
- retain operation identifiers;
- reject unsupported schema state;
- record validation summary;
- never mark success before durable completion.

### 22.3 Load invariants

A load operation must:

- validate schema compatibility;
- execute required migrations deterministically;
- reconstruct the registry before projections;
- reconcile world time and schedules;
- recover interrupted interactions and events according to policy;
- validate critical service coverage;
- report repair actions;
- fail safely when corruption cannot be repaired.

### 22.4 Round-trip equivalence test

Procedure:

1. capture authoritative population snapshot A;
2. save;
3. destroy runtime projections;
4. load;
5. capture authoritative population snapshot B;
6. normalize permitted transient differences;
7. compare A and B.

Must remain equivalent:

- identities;
- household relationships;
- roles and professions;
- durable inventory;
- reputation;
- event outcomes;
- completed operation identities;
- progression-critical conversation state.

### 22.5 Repeated load test

Loading the same save repeatedly must not accumulate:

- NPCs;
- inventory;
- reputation;
- event attendance;
- rewards;
- schedule reservations;
- telemetry findings treated as authority.

---

## 23. Determinism Validation

### 23.1 Deterministic authority

Given the same:

- initial authoritative state;
- world-time inputs;
- player operations;
- random seed where randomness is authorized;
- content version;
- migration version;

the resulting authoritative population state must be equivalent.

### 23.2 Permitted nondeterminism

Cosmetic variation may be nondeterministic when it does not affect:

- progression;
- economy;
- inventory;
- reputation;
- event eligibility;
- schedule authority;
- service availability;
- durable history.

Examples of permitted cosmetic variation:

- idle animation selection;
- small visual crowd offset;
- nonpersistent ambient chatter timing;
- decorative gaze direction.

### 23.3 Replay validation

Record authoritative operations and replay them against a clean equivalent state.

Compare:

- final registry hash;
- household graph hash;
- profession coverage result;
- merchant inventory hash;
- reputation ledger hash;
- event outcome hash;
- validation finding set.

---

## 24. Runtime Budget Validation

### 24.1 Required budgets

Define budgets for each target device tier:

- authoritative population count;
- active logical NPC count;
- fully rendered NPC count;
- navigation agents;
- simultaneous path requests;
- animation update cost;
- conversation evaluators;
- interaction probes;
- event participants;
- population memory;
- save serialization time;
- load reconstruction time.

### 24.2 Measurement rules

Measurements must be taken in:

- quiet baseline scene;
- normal workday peak;
- merchant district peak;
- school or mentor transition;
- major event peak;
- streaming churn scenario;
- save operation;
- load operation;
- extended soak.

### 24.3 Degradation policy

When budgets are threatened, degrade in this order where applicable:

1. reduce cosmetic ambient updates;
2. reduce proxy animation frequency;
3. lower distant visual crowd density;
4. reduce noncritical path recalculation frequency;
5. defer optional visitors;
6. simplify noncritical social simulation;
7. preserve critical services, player interactions, learning support, and authoritative state.

The system must never preserve decorative crowds by sacrificing progression-critical NPC correctness.

---

## 25. Telemetry Requirements

### 25.1 Core counters

Collect at minimum:

- registered residents;
- active residents;
- dormant residents;
- visitors;
- proxies;
- duplicate-identity detections;
- unresolved-reference detections;
- schedule starts;
- schedule lateness;
- schedule abandonment;
- route failures;
- recovery teleports;
- profession coverage failures;
- merchant unavailability;
- conversation fallback use;
- interaction refusals by reason;
- reputation operations;
- duplicate reputation prevention;
- event registrations;
- waitlist promotions;
- no-shows;
- event residue detections;
- save validation failures;
- load repairs;
- tier promotions and demotions;
- frame or tick budget overruns.

### 25.2 Required dimensions

Telemetry should support analysis by:

- build version;
- schema version;
- world version;
- district;
- NPC archetype;
- profession;
- service class;
- event category;
- simulation tier;
- device tier;
- session duration;
- world day.

### 25.3 Privacy and safety

Population telemetry must avoid collecting unnecessary personal player information.

Player identifiers must follow project privacy policy.

Educational performance data must not be embedded in population diagnostics unless explicitly required and protected by the learning-data authority.

### 25.4 Alert examples

Trigger alerts when:

- duplicate identity count is greater than zero;
- required service coverage is absent beyond target;
- save/load round-trip mismatch occurs;
- event residue remains after closure;
- reputation operation duplication is detected;
- merchant transaction atomicity fails;
- route recovery rate rises above baseline;
- active population count drifts continuously during soak;
- memory usage rises per world day without stabilization.

---

## 26. Diagnostic Tooling

Production development builds must provide tools to inspect population authority.

### 26.1 Population inspector

The inspector should display:

- NPC identity;
- lifecycle state;
- household;
- home;
- profession;
- roles;
- current and next schedule block;
- current district and destination;
- navigation state;
- simulation tier;
- active interaction;
- conversation context;
- reputation summary;
- event commitments;
- inventory authority reference;
- recent validation findings.

### 26.2 District dashboard

Display:

- capacity;
- current occupancy;
- residents;
- visitors;
- event attendees;
- active services;
- missing services;
- route failures;
- performance cost;
- streaming state.

### 26.3 Validation overlay

Optional world overlay categories:

- invalid NPC;
- late schedule;
- stuck navigation;
- missing destination;
- duplicate identity;
- unavailable service;
- conversation failure;
- event conflict;
- capacity overflow;
- simulation-budget risk.

### 26.4 Snapshot export

The system should export a normalized snapshot suitable for diffing in tests and bug reports.

The snapshot must avoid unstable cosmetic data unless explicitly requested.

---

## 27. Automated Validation Suite

### 27.1 Schema tests

- supported enum values;
- required fields;
- identifier format;
- reference integrity;
- numeric bounds;
- version compatibility;
- migration coverage.

### 27.2 Population graph tests

- unique NPC identities;
- valid households;
- valid homes;
- valid district ownership;
- valid role and profession graph;
- no forbidden cycles;
- required service reachability.

### 27.3 Schedule tests

- full-day coverage;
- overlap detection;
- route feasibility;
- opening-hour agreement;
- event conflict detection;
- starvation detection;
- interruption recovery.

### 27.4 Merchant tests

- inventory integrity;
- deterministic prices;
- atomic purchase;
- idempotent retry;
- refund behavior;
- event stock lifecycle;
- save/load stock equivalence.

### 27.5 Conversation tests

- graph reachability;
- required outcome reachability;
- localization coverage;
- condition evaluation;
- action idempotency;
- fallback availability;
- version migration.

### 27.6 Interaction tests

- eligibility matrix;
- prompt correctness;
- lifecycle transitions;
- interruption;
- streaming protection;
- atomic completion;
- cooldown persistence.

### 27.7 Reputation tests

- bounds;
- tiers;
- propagation scope;
- evidence linkage;
- duplicate prevention;
- decay;
- save/load equivalence.

### 27.8 Event tests

- invitation eligibility;
- registration;
- capacity;
- waitlist;
- schedule reservation;
- arrival;
- presence;
- completion;
- cancellation;
- residue cleanup.

### 27.9 Soak tests

Minimum soak scenarios:

- 30 normal world days;
- 30 days with recurring market events;
- 30 days with repeated district streaming;
- repeated save/load every world day;
- repeated player absence and return;
- profession provider interruption;
- merchant stock depletion and restock;
- reputation rise and decay;
- event cancellation and recovery.

---

## 28. Manual QA Scenarios

### QA-POP-001 — First arrival

Observe the valley after a clean start.

Pass when:

- population appears purposeful;
- critical services are discoverable;
- no obvious duplication occurs;
- schedules begin coherently;
- learning interactions are unobstructed.

### QA-POP-002 — Full workday

Follow selected NPCs from morning through rest.

Pass when:

- destinations are plausible;
- transitions allow travel time;
- work and rest occur;
- interruptions recover;
- household return is coherent.

### QA-POP-003 — Required merchant unavailable

Force the primary merchant to be absent.

Pass when:

- absence is explained;
- approved fallback activates within target;
- critical purchase remains possible;
- no duplicate merchant authority appears.

### QA-POP-004 — Major event

Run a capacity-near event.

Pass when:

- participants arrive;
- venue remains navigable;
- service coverage remains safe;
- event roles function;
- rewards apply once;
- cleanup completes.

### QA-POP-005 — Reputation reaction

Perform a known reputation-changing action.

Pass when:

- correct scope updates;
- appropriate NPCs react;
- unrelated NPCs do not react incorrectly;
- merchant and conversation projections agree;
- save/load preserves the result.

### QA-POP-006 — Streaming boundary churn

Cross district boundaries repeatedly during NPC travel and interaction.

Pass when:

- no duplicate NPC appears;
- active interaction remains safe;
- destination and schedule remain coherent;
- counts return to baseline.

### QA-POP-007 — Save during event

Save while an event is active, reload, and complete it.

Pass when:

- participants restore correctly;
- capacity remains correct;
- check-in does not replay;
- rewards apply once;
- cleanup completes.

### QA-POP-008 — Long absence

Leave the world or district for many world hours and return.

Pass when:

- coarse simulation produces plausible state;
- critical services are available according to current time;
- no impossible backlog replays visibly;
- events and reputation remain coherent.

### QA-POP-009 — Navigation obstruction

Block a common route temporarily.

Pass when:

- NPCs reroute or wait;
- critical schedule items recover;
- no permanent crowd deadlock occurs;
- diagnostics record systemic failure if thresholds are exceeded.

### QA-POP-010 — Learning-space protection

Generate normal and peak population near a learning activity.

Pass when:

- player can see and use the learning interaction;
- NPC collision and prompts do not obstruct it;
- audio and visual noise remain within policy;
- crowd degradation preserves educational clarity.

---

## 29. Failure Catalogue

### POP-VAL-001 — Duplicate NPC identity

Severity: BLOCKER  
Detection: two authoritative records or active entities share one `npcId`.  
Recovery: quarantine duplicate projection, preserve authority, stop unsafe persistence, capture evidence.  
Release: prohibited until root cause is resolved.

### POP-VAL-002 — Orphan NPC

Severity: CRITICAL or MAJOR depending on role.  
Detection: runtime NPC has no registry entry or invalid required ownership.  
Recovery: remove unsafe projection or restore from validated authority.

### POP-VAL-003 — Missing critical service

Severity: BLOCKER or CRITICAL.  
Detection: no reachable qualified provider during required window.  
Recovery: activate approved backup, protect progression, record coverage failure.

### POP-VAL-004 — Schedule deadlock

Severity: CRITICAL.  
Detection: NPC cannot leave a state and mandatory schedule progression stops.  
Recovery: apply state-specific recovery, select safe anchor, retain evidence.

### POP-VAL-005 — Route oscillation

Severity: MAJOR, CRITICAL if service-blocking.  
Detection: repeated movement between nodes without net progress.  
Recovery: alternate route or recovery anchor.

### POP-VAL-006 — Merchant projection mismatch

Severity: CRITICAL if transaction-facing.  
Detection: displayed price or stock differs from authority.  
Recovery: block unsafe transaction, refresh projection.

### POP-VAL-007 — Conversation dead end

Severity: CRITICAL for required progression, otherwise MAJOR.  
Detection: no valid node for required context.  
Recovery: approved fallback, preserve progression.

### POP-VAL-008 — Interaction replay

Severity: BLOCKER when rewards or transfers duplicate.  
Detection: completed operation executes again.  
Recovery: reject duplicate operation by identity and reconcile projection.

### POP-VAL-009 — Reputation divergence

Severity: CRITICAL.  
Detection: ledger and projection disagree beyond propagation window.  
Recovery: rebuild projection from ledger; never guess authority.

### POP-VAL-010 — Event residue

Severity: CRITICAL or MAJOR.  
Detection: temporary roles, reservations, participants, or overrides remain after closure.  
Recovery: idempotent cleanup replay.

### POP-VAL-011 — Save/load population drift

Severity: BLOCKER.  
Detection: normalized authority differs after round trip.  
Recovery: reject unsafe save or migrate with audited repair.

### POP-VAL-012 — Capacity overflow

Severity: CRITICAL if movement or safety is blocked, otherwise MAJOR.  
Detection: district or venue exceeds hard capacity.  
Recovery: defer optional arrivals, activate overflow plan.

### POP-VAL-013 — Simulation-tier duplication

Severity: BLOCKER.  
Detection: old and new tier representations both retain authority.  
Recovery: isolate authority owner, destroy duplicate projection, capture transition trace.

### POP-VAL-014 — Household corruption

Severity: BLOCKER or CRITICAL.  
Detection: invalid guardianship, duplicate primary household, impossible home ownership.  
Recovery: migration or explicit repair from durable evidence.

### POP-VAL-015 — Unbounded runtime growth

Severity: CRITICAL.  
Detection: counts, memory, reservations, or history grow continuously during soak without design justification.  
Recovery: stop leak source, compact approved history, verify authority retention.

---

## 30. Recovery Principles

### 30.1 Preserve authority

Recovery must preserve the most trustworthy durable state.

### 30.2 Protect progression

When population behavior fails, the player must not lose earned progress or become permanently blocked.

### 30.3 Prefer idempotent replay

Cleanup, projection rebuild, and interrupted-operation recovery should be safe to execute more than once.

### 30.4 Separate recovery from resolution

A successful runtime recovery does not close the underlying production defect.

### 30.5 Record evidence before destructive repair

Before deleting, replacing, or rewriting suspect state, capture enough evidence to diagnose the root cause.

### 30.6 Avoid visible trust breaks

Recovery should avoid NPC teleportation, personality reset, duplicated dialogue, or contradictory behavior in front of the player where possible.

---

## 31. Validation Matrix

| Domain | Structural | Runtime | Persistence | Experience | Release blocking |
|---|---:|---:|---:|---:|---:|
| Identity | Required | Required | Required | Required | Yes |
| Distribution | Required | Required | Required | Required | Yes at hard violations |
| Household | Required | Required | Required | Required | Yes for corruption |
| Schedule | Required | Required | Required | Required | Yes for progression/service failure |
| Roles | Required | Required | Required | Required | Yes for authority failure |
| Professions | Required | Required | Required | Required | Yes for critical coverage |
| Merchants | Required | Required | Required | Required | Yes for transaction failure |
| Conversations | Required | Required | Required | Required | Yes for required progression |
| Interactions | Required | Required | Required | Required | Yes for duplicate/blocked effects |
| Reputation | Required | Required | Required | Required | Yes for divergence or duplication |
| Events | Required | Required | Required | Required | Yes for deadlock or residue |
| Simulation tiers | Required | Required | Required | Required | Yes for duplication/loss |
| Navigation | Required | Required | Conditional | Required | Yes for critical reachability |
| Performance | Build config | Required | Save/load timing | Required | Yes when budget breach harms target |

---

## 32. Production Exit Criteria

Phase 15 may be declared production-complete only when all mandatory criteria pass.

### 32.1 Documentation gate

- Parent guide exists and is approved.
- 15A–15J exist and are internally consistent.
- Ownership boundaries are explicit.
- All mandatory invariants have identifiers.
- Failure and recovery policies are documented.

### 32.2 Data gate

- Zero duplicate authoritative NPC identities.
- Zero unresolved required references.
- All households structurally valid.
- All critical roles and professions covered.
- All required merchant profiles valid.
- All required conversation outcomes reachable.
- All event definitions valid.

### 32.3 Runtime gate

- Critical schedules execute within thresholds.
- Critical services remain available or recover through approved fallback.
- No recurring unrecovered navigation deadlock.
- Interactions complete atomically.
- Reputation projections converge within target.
- Events complete without residue.
- Simulation-tier transitions do not duplicate or lose authority.

### 32.4 Persistence gate

- Save/load round-trip equivalence passes.
- Repeated load test passes.
- Interrupted interaction recovery passes.
- Active event save/load passes.
- Reputation and merchant operation idempotency passes.
- Migration from every supported prior schema passes.

### 32.5 Performance gate

- Target device budgets pass in baseline and peak scenarios.
- Major event peak remains within approved limits.
- Long soak shows no unbounded memory or population growth.
- Save and load complete within target budgets.
- Degradation preserves critical learning and progression services.

### 32.6 Experience gate

- Builder's Valley feels inhabited and purposeful.
- NPC behavior remains understandable.
- Required services are discoverable and reachable.
- Population does not obstruct learning.
- Player actions produce consistent social consequences.
- Events feel coordinated rather than chaotic.
- Recovery avoids obvious contradictions.

### 32.7 Defect gate

Release requires:

- zero open BLOCKER findings;
- zero open CRITICAL findings without approved, time-bounded mitigation;
- all MAJOR findings reviewed by the Phase owner;
- every waiver has owner, reason, scope, risk, and expiration;
- validation evidence is attached to the release candidate.

---

## 33. Release Evidence Package

The Phase 15 evidence package must include:

- content validation report;
- population registry summary;
- district capacity report;
- household integrity report;
- profession coverage report;
- required-service reachability report;
- schedule feasibility and drift report;
- merchant transaction and inventory report;
- conversation reachability report;
- interaction lifecycle report;
- reputation ledger consistency report;
- event lifecycle and residue report;
- save/load equivalence report;
- simulation-tier churn report;
- navigation recovery report;
- target-device performance report;
- soak-test report;
- open findings and waivers;
- manual QA sign-off;
- build, schema, and content versions.

Evidence must identify the exact candidate tested.

---

## 34. Live Operations Validation

After release, monitor:

- missing-service incidents;
- route-recovery trends;
- conversation fallback trends;
- merchant transaction failures;
- reputation divergence;
- event completion and residue;
- save repair frequency;
- district capacity peaks;
- device-tier performance;
- population count drift;
- learning-space obstruction reports.

### 34.1 Post-release escalation

Immediate escalation is required for:

- save corruption;
- identity duplication;
- repeated reward duplication;
- progression blocked by population state;
- merchant charge/item mismatch;
- widespread event deadlock;
- reputation corruption affecting progression;
- crashes caused by population activation.

### 34.2 Content update validation

Every population content update must rerun affected tests plus mandatory global identity, critical-service, save compatibility, and cross-system checks.

A small NPC edit may still affect schedules, profession coverage, conversations, events, and persistence.

---

## 35. Implementation Checklist

### Authority

- [ ] One authoritative population registry exists.
- [ ] Every NPC identity is stable and unique.
- [ ] Projection ownership is explicit.
- [ ] Validation rules reference versioned authority.

### Distribution

- [ ] District normal, soft, hard, and event capacities are defined.
- [ ] Resident, visitor, proxy, and event counts reconcile.
- [ ] Spawn/despawn and streaming duplication tests pass.

### Households

- [ ] Household graph is valid.
- [ ] Home capacity and ownership are valid.
- [ ] Relocation and dissolution transitions are tested.

### Schedules

- [ ] Full-day behavior is covered.
- [ ] Mandatory overlap is absent.
- [ ] Route time is feasible.
- [ ] Drift and starvation monitoring are active.

### Roles and professions

- [ ] Capabilities satisfy assignments.
- [ ] Conflicts are detected.
- [ ] Critical services meet minimum coverage.
- [ ] Backup providers are tested.

### Merchants

- [ ] Inventory and prices are authoritative.
- [ ] Transactions are atomic and idempotent.
- [ ] Availability and fallback are tested.
- [ ] Save/load does not duplicate stock.

### Conversations and interactions

- [ ] Required outcomes are reachable.
- [ ] Context and permissions agree.
- [ ] Fallback behavior is safe.
- [ ] Completion effects execute once.

### Reputation

- [ ] Bounds and tiers are valid.
- [ ] Propagation scopes are tested.
- [ ] Every change has evidence.
- [ ] Projection rebuild passes.

### Events

- [ ] Eligibility, capacity, and waitlist are deterministic.
- [ ] Schedule conflicts are detected.
- [ ] Attendance and presence are coherent.
- [ ] Completion and cleanup are idempotent.

### Persistence

- [ ] Save snapshot is coherent.
- [ ] Load reconstruction order is correct.
- [ ] Round-trip equivalence passes.
- [ ] Repeated load does not accumulate state.
- [ ] Migrations are deterministic.

### Runtime

- [ ] Simulation tiers preserve authority.
- [ ] Navigation recovery is bounded.
- [ ] Peak budgets pass.
- [ ] Soak tests show no drift or leak.

### Release

- [ ] Zero blockers.
- [ ] Critical findings are resolved or formally mitigated.
- [ ] Evidence package identifies the exact candidate.
- [ ] Phase owner has signed off.

---

## 36. Definition of Done

15J is complete when the project can demonstrate, with repeatable evidence, that Builder's Valley population systems are not merely authored but operationally coherent.

The implementation must prove that:

1. every NPC has one authoritative identity;
2. population distribution remains valid across districts and events;
3. households and homes remain coherent;
4. schedules are complete, feasible, and recoverable;
5. roles and professions preserve required service coverage;
6. merchants remain available, atomic, and persistent;
7. conversations and interactions are reachable and safe;
8. reputation is bounded, traceable, and correctly propagated;
9. event participation respects eligibility, capacity, time, and cleanup;
10. streaming and simulation tiers preserve identity and state;
11. save/load is equivalent and idempotent;
12. runtime budgets pass on target devices;
13. learning interactions remain clear and unobstructed;
14. failures generate evidence and recover without corrupting authority;
15. no blocker remains open for the release candidate.

When these conditions are met, Phase 15 can be closed as a validated production foundation.

---

## 37. Phase 15 Completion Statement

The Phase 15 document set is complete when the following authorities are approved together:

- Parent Guide — NPC & Population System;
- 15A — Population Distribution;
- 15B — Daily Schedule;
- 15C — NPC Roles;
- 15D — Profession System;
- 15E — Merchant Economy;
- 15F — Conversation Rules;
- 15G — Interaction Rules;
- 15H — Reputation System;
- 15I — Event Participation;
- 15J — Population Validation.

Together, these documents define how Builder's Valley becomes a coherent community rather than a collection of moving characters.

15J closes the phase by requiring evidence that all preceding population authorities work together under real runtime, persistence, performance, recovery, and player-experience conditions.

> Phase 15 is complete only when the community can be trusted across time, space, interaction, failure, and recovery.
