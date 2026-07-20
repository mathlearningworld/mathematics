# 15C — NPC Roles Production Guide

**Project:** Math Learning World  
**World Slice:** Builder's Valley  
**Phase:** 15 — NPC & Population System  
**Document Type:** Production Guide / Role Authority  
**Status:** Production Ready  
**Parent Authority:** `15-NPC-AND-POPULATION-SYSTEM-GUIDE.md`  
**Upstream Dependencies:** `15A-POPULATION-DISTRIBUTION-PRODUCTION-GUIDE.md`, `15B-DAILY-SCHEDULE-PRODUCTION-GUIDE.md`

---

## 1. Purpose

This guide defines how NPC roles are represented, assigned, activated, combined, suspended, recovered, and validated across Builder's Valley.

It converts the Phase 15 population doctrine into production rules for:

- durable NPC identity;
- primary and secondary roles;
- social, educational, civic, household, service, and gameplay roles;
- role eligibility and capability;
- role activation by place, time, and world state;
- multi-role conflict resolution;
- temporary role overlays;
- role progression and retirement;
- runtime role projection;
- persistence, recovery, and observability;
- validation and evidence.

This document is authoritative for deciding **what an NPC is responsible for, what authority that responsibility grants, when that responsibility is active, and how the world behaves when multiple responsibilities compete**.

It does not define detailed profession progression, merchant pricing, conversation content, interaction mechanics, reputation scoring, or event orchestration. Those responsibilities belong to later Phase 15 documents.

---

## 2. Production Outcome

A conforming implementation must produce NPCs whose roles:

1. are understandable from world behavior;
2. remain consistent with identity and location;
3. support learning, mentorship, building, trade, family, and civic life;
4. do not collapse into one universal interaction type;
5. can be combined without ambiguous authority;
6. remain stable through save/load and time skip;
7. can temporarily change without corrupting durable identity;
8. degrade safely when an assigned NPC is unavailable;
9. expose deterministic runtime state for debugging;
10. provide measurable evidence for final validation.

---

## 3. Core Doctrine

### 3.1 Identity Is Not Role

An NPC identity answers:

- Who is this person?
- What relationships and history belong to them?
- What state must persist?

A role answers:

- What responsibility are they currently authorized to perform?
- What services or behavior may they provide?
- What world expectations depend on them?

The implementation must never use a role identifier as the sole persistent identity of an NPC.

### 3.2 Role Is Responsibility, Not Costume

A visual outfit may communicate a role, but appearance alone does not grant authority.

A valid role assignment requires:

- role definition;
- eligible actor;
- assignment source;
- activation conditions;
- valid location or service context where applicable;
- lifecycle state;
- persistence policy.

### 3.3 One NPC May Hold Multiple Roles

Builder's Valley supports multi-role people.

Examples:

- a parent who is also a carpenter;
- a merchant who mentors arithmetic;
- a learner who assists in a workshop;
- a teacher who organizes a festival;
- a resident who temporarily serves as an emergency coordinator.

Multi-role support must preserve clear priority and prevent contradictory simultaneous authority.

### 3.4 Roles Must Be Legible Through Behavior

Players should infer important roles through:

- location;
- schedule;
- tools and stations;
- interaction affordances;
- nearby signage or environmental cues;
- recurring behavior;
- relationship context.

Text labels may reinforce a role, but must not be the only signal.

---

## 4. Authority Hierarchy

Role behavior must obey this authority order:

1. **Safety and emergency authority**
2. **Active story, lesson, quest, or required progression authority**
3. **Persistent identity and relationship invariants**
4. **Explicit role assignment contract**
5. **Active event role override**
6. **Scheduled primary role**
7. **Scheduled secondary role**
8. **Household and social obligations**
9. **Optional service coverage**
10. **Ambient behavior**

A lower authority must never invalidate a higher authority.

Examples:

- An ambient social animation cannot interrupt a required lesson.
- A merchant shift cannot override an emergency evacuation role.
- A temporary festival role cannot permanently replace an NPC's durable profession.
- A household obligation may delay an optional service, but not silently abandon a critical learner interaction.

---

## 5. Role Model

Each role definition should contain at minimum:

```text
roleId
roleFamily
roleName
roleVersion
responsibilities
capabilities
eligibilityRules
activationRules
allowedLocations
requiredStations
schedulePolicy
interactionPolicy
conversationScope
persistencePolicy
priorityClass
fallbackPolicy
observabilityTags
```

Each NPC role assignment should contain at minimum:

```text
assignmentId
npcId
roleId
assignmentType
sourceId
assignedAt
activeFrom
activeUntil
status
priorityOffset
contextBindings
progressionState
suspensionReason
lastActivatedAt
```

---

## 6. Role Families

Builder's Valley uses the following production role families.

### 6.1 Identity Roles

Identity roles describe durable social placement.

Examples:

- resident;
- visitor;
- household member;
- guardian;
- child;
- elder;
- community member.

Identity roles normally persist and should not be activated or deactivated like a work shift unless the underlying relationship changes.

### 6.2 Learning Roles

Learning roles support the educational purpose of Math Learning World.

Examples:

- learner;
- peer learner;
- tutor;
- mentor;
- teacher;
- assessor;
- learning guide;
- practice partner.

Learning roles must define:

- permitted subject or skill scope;
- learner eligibility;
- supervision requirements;
- progress-write authority;
- assessment authority;
- session initiation rules;
- interruption and recovery behavior.

### 6.3 Workshop and Building Roles

Examples:

- builder;
- carpenter;
- mason;
- designer;
- workshop owner;
- workshop assistant;
- inspector;
- material coordinator.

These roles may reserve tools, workstations, construction zones, or material access.

### 6.4 Merchant and Service Roles

Examples:

- shopkeeper;
- market trader;
- supplier;
- repair provider;
- courier;
- innkeeper;
- food vendor;
- service clerk.

These roles grant service authority but do not independently define price calculation or economy rules.

### 6.5 Civic Roles

Examples:

- village coordinator;
- registrar;
- event organizer;
- public works steward;
- safety officer;
- mediator;
- information guide.

Civic roles require explicit boundaries so they do not become universal administrative authority.

### 6.6 Household Roles

Examples:

- caregiver;
- guardian;
- dependent;
- household provider;
- host;
- guest;
- sibling;
- family tutor.

Household roles influence schedule and relationship behavior but must not automatically grant professional or educational authority.

### 6.7 Social Roles

Examples:

- friend;
- neighbor;
- teammate;
- club member;
- trusted contact;
- rival;
- acquaintance.

Social roles usually shape availability, tone, and interaction preference rather than world service authority.

### 6.8 Event Roles

Examples:

- participant;
- spectator;
- judge;
- host;
- announcer;
- competitor;
- volunteer;
- emergency responder.

Event roles are temporary overlays with explicit start, end, and restoration rules.

### 6.9 Ambient Roles

Examples:

- passerby;
- shopper;
- audience member;
- background worker;
- plaza visitor.

Ambient roles must never own critical progression or unique authority.

---

## 7. Assignment Types

Every role assignment must declare one assignment type.

### 7.1 Durable Assignment

Used for long-lived responsibilities.

Examples:

- teacher at the valley school;
- owner of a workshop;
- household guardian;
- permanent resident coordinator.

Durable assignments persist until explicitly changed.

### 7.2 Scheduled Assignment

Active during recurring schedule windows.

Examples:

- morning market seller;
- afternoon tutor;
- evening innkeeper;
- rotating workshop supervisor.

### 7.3 Contextual Assignment

Active only when a declared context exists.

Examples:

- mentor for a specific learner;
- guide for a specific quest;
- inspector for a particular construction project.

### 7.4 Temporary Assignment

Used for bounded short-term responsibilities.

Examples:

- festival volunteer;
- substitute teacher;
- emergency shelter coordinator.

### 7.5 Emergent Assignment

Created by runtime conditions under a controlled policy.

Examples:

- nearest qualified adult assists a lost learner;
- available safety officer responds to an incident;
- qualified workshop assistant temporarily covers an absent owner.

Emergent assignments must be deterministic, auditable, and automatically expire.

---

## 8. Primary and Secondary Roles

### 8.1 Primary Role

The primary role is the NPC's dominant durable world responsibility.

It influences:

- default schedule generation;
- default service location;
- core visual language;
- profession linkage;
- common interaction affordances;
- fallback behavior.

An NPC may have only one active primary role per role domain unless a specific domain policy permits otherwise.

### 8.2 Secondary Role

Secondary roles add valid responsibilities without replacing the primary role.

Examples:

- carpenter + mentor;
- merchant + parent;
- learner + workshop assistant;
- teacher + event organizer.

Secondary roles must declare:

- activation window;
- priority relative to the primary role;
- valid context;
- whether the role can interrupt the primary role;
- restoration behavior.

### 8.3 Temporary Overlay Role

A temporary overlay modifies current behavior while preserving durable assignments.

Examples:

- emergency responder;
- festival judge;
- substitute instructor;
- quest guide.

When the overlay ends, runtime must restore the correct underlying role rather than guessing from appearance or location.

---

## 9. Role Eligibility

Role eligibility may depend on:

- age band;
- capability level;
- profession qualification;
- learning mastery;
- relationship state;
- residency status;
- health or availability state;
- assigned workplace;
- required equipment access;
- reputation threshold;
- story progression;
- certification or mentorship status.

Eligibility checks must run:

1. when a role is assigned;
2. when a durable prerequisite changes;
3. when activating a high-authority role;
4. during save migration where role schema changed;
5. during validation.

A failed eligibility check must not silently delete the assignment. The assignment should enter a visible suspended or invalid state with a reason code.

---

## 10. Capability Model

Roles grant capabilities rather than directly hard-coding every UI action.

Example capabilities:

```text
CAN_TEACH_SKILL
CAN_ASSESS_MASTERY
CAN_OPEN_SHOP
CAN_TRADE_GOODS
CAN_RESERVE_WORKSTATION
CAN_SUPERVISE_LEARNER
CAN_ASSIGN_PRACTICE
CAN_REPAIR_OBJECT
CAN_AUTHORIZE_BUILD
CAN_HOST_EVENT
CAN_RESPOND_TO_EMERGENCY
CAN_WRITE_LEARNING_PROGRESS
```

Rules:

- Capabilities must be derived from active role authority.
- Inactive or suspended roles must not leak capabilities.
- Capability checks must include context, not only role name.
- Critical writes require explicit write authority.
- UI affordances must reflect current capability state.

---

## 11. Role Activation

A role becomes active only when its activation contract is satisfied.

Activation inputs may include:

- world time;
- schedule state;
- NPC location;
- service location readiness;
- event state;
- player or learner context;
- quest state;
- required equipment;
- safety state;
- substitution assignment;
- performance simulation tier.

Activation states:

```text
INACTIVE
PENDING
ACTIVATING
ACTIVE
INTERRUPTED
SUSPENDED
COMPLETING
EXPIRED
INVALID
```

### 11.1 Activation Invariant

An NPC must not expose role-specific authority before activation completes.

### 11.2 Deactivation Invariant

Deactivation must release:

- station reservations;
- interaction locks;
- service queues;
- temporary capabilities;
- event bindings;
- contextual navigation targets.

---

## 12. Multi-Role Conflict Resolution

When two roles request incompatible behavior, resolve them in this order:

1. compare authority class;
2. compare explicit context priority;
3. compare active commitment state;
4. compare interruption policy;
5. compare schedule window urgency;
6. compare substitution availability;
7. apply deterministic tie-breaker.

A deterministic tie-breaker may use:

- assignment priority offset;
- assignment start time;
- stable assignment identifier.

Random selection must not decide critical authority conflicts.

### 12.1 Compatible Concurrency

Some roles may operate together.

Examples:

- parent and resident;
- merchant and arithmetic mentor during a shop lesson;
- builder and quest guide at the construction site.

Compatible concurrency must be explicitly declared. It must not be inferred merely because no error occurred.

### 12.2 Incompatible Concurrency

Examples:

- actively teaching in school and selling at a distant market;
- sleeping and operating a shop;
- evacuating civilians and performing ambient plaza behavior.

The lower-priority role must wait, suspend, delegate, or expire according to policy.

---

## 13. Educational Role Boundaries

### 13.1 Teacher

A teacher may:

- lead structured learning sessions;
- present approved learning content;
- supervise groups;
- record permitted learning outcomes;
- initiate approved assessments.

A teacher may not automatically:

- modify national curriculum authority;
- override parent controls;
- grant mastery without evidence;
- act outside assigned subject scope.

### 13.2 Mentor

A mentor supports guided practice and confidence building.

A mentor assignment must define:

- learner binding;
- skill scope;
- session limit;
- assistance level;
- reward or credit rules;
- escalation path.

Mentors must not replace formal mastery validation unless specifically authorized.

### 13.3 Peer Tutor

A peer tutor may support another learner within a bounded skill range.

The system must prevent:

- tutoring above verified capability;
- unauthorized progress writes;
- reward farming through repeated invalid sessions;
- coercive or unbalanced mentorship loops.

### 13.4 Assessor

Assessment authority must remain separate from ordinary teaching authority where required by the learning contract.

An assessor role must define:

- eligible assessment types;
- evidence requirements;
- retry policy;
- conflict-of-interest constraints;
- result-write authority.

---

## 14. Household and Family Role Boundaries

Household roles affect:

- home access;
- daily schedule coordination;
- caregiving behavior;
- meal and sleep grouping;
- family mentorship eligibility;
- emergency reunification;
- social interaction priority.

Household membership must not automatically grant:

- unrestricted inventory access;
- financial authority;
- mastery approval;
- professional station access;
- universal guardian permissions.

Each sensitive capability requires an explicit policy.

---

## 15. Service Coverage

Critical world services must declare coverage requirements.

Example service contract:

```text
serviceId
requiredRole
serviceLocation
coverageWindows
minimumCoverage
substitutionPool
closurePolicy
playerFacingStatus
```

When the assigned NPC is unavailable, the system must choose one declared outcome:

- substitute actor;
- reduced service;
- delayed opening;
- temporary closure;
- remote or abstract service;
- explicit recovery state.

The system must never leave a service visually open while no valid role authority exists.

---

## 16. Role Substitution

A substitute must satisfy:

- required capability;
- eligibility rules;
- availability;
- travel feasibility;
- no higher-priority conflict;
- substitution duration;
- restoration plan.

Substitution priority:

1. designated substitute;
2. qualified same-location actor;
3. qualified same-district actor;
4. abstract service fallback;
5. declared closure.

Substitution must generate an audit record for critical roles.

---

## 17. Role Progression

Role progression may include:

```text
CANDIDATE
APPRENTICE
ASSISTANT
QUALIFIED
SENIOR
MASTER
RETIRED
```

Not every role requires all stages.

Progression must depend on explicit evidence such as:

- verified skill mastery;
- completed supervised tasks;
- trust or reputation requirements;
- time-in-role where appropriate;
- assessment outcome;
- mentor endorsement;
- story or world progression.

Progression must not be inferred solely from NPC level or elapsed time.

---

## 18. Role Suspension, Revocation, and Retirement

### 18.1 Suspension

Suspension preserves assignment history but blocks activation.

Reasons may include:

- temporary unavailability;
- missing qualification;
- unresolved conflict;
- health or safety state;
- service location unavailable;
- disciplinary or story condition.

### 18.2 Revocation

Revocation permanently removes current authority while preserving history.

Revocation requires:

- authoritative source;
- reason;
- timestamp;
- downstream cleanup;
- fallback handling.

### 18.3 Retirement

Retirement ends active service but may preserve social identity, mentorship history, and community status.

Retired NPCs must not retain active service capabilities unless a temporary explicit assignment is created.

---

## 19. Runtime Role Projection

Runtime systems should consume a resolved role projection rather than independently interpreting all assignments.

Recommended projection:

```text
npcId
resolvedAt
primaryRole
activeRoles
suspendedRoles
capabilities
serviceBindings
learningBindings
interactionProfile
conversationProfile
visualRoleCues
currentAuthorityClass
resolutionTraceId
```

Projection rules:

- one authoritative resolver;
- deterministic output for identical input state;
- versioned schema;
- observable resolution trace;
- no UI-owned authority inference.

---

## 20. Integration with Population Distribution

15A determines where NPCs belong and what population class they occupy.

15C must respect:

- persistent identity protection;
- district capacity;
- service coverage demand;
- event reservation;
- simulation tier;
- visitor and resident status.

Role assignment must not create duplicate NPC instances to satisfy distribution demand. It must request placement or substitution through population authority.

---

## 21. Integration with Daily Schedule

15B determines when activities occur.

15C determines which role authorizes those activities.

Required contract:

```text
schedule activity
→ requested role
→ role activation check
→ capability resolution
→ location/station validation
→ activity start
```

A schedule entry must not activate invalid role authority by itself.

When role activation fails, the schedule system must receive an explicit result such as:

```text
ROLE_UNAVAILABLE
ROLE_SUSPENDED
ROLE_CONFLICT
MISSING_CAPABILITY
INVALID_LOCATION
STATION_UNAVAILABLE
SUBSTITUTE_PENDING
```

---

## 22. Interaction Boundary

Role determines which interaction families may be offered.

Examples:

- teacher → learn, practice, assess;
- merchant → browse, buy, sell, ask service information;
- builder → inspect project, request help, assign construction task;
- mentor → guided practice, encouragement, review;
- guardian → household guidance, permission-bound actions;
- civic guide → directions, public information, event registration.

Role does not define the complete interaction implementation. Phase 15G owns interaction production rules.

---

## 23. Conversation Boundary

Role may constrain:

- valid topics;
- knowledge scope;
- tone range;
- greeting context;
- service explanation;
- refusal reasons;
- escalation path.

Role must not directly own full dialogue scripts. Phase 15F owns conversation rules.

---

## 24. Reputation Boundary

Reputation may affect:

- eligibility;
- trust-sensitive capabilities;
- service access;
- mentorship willingness;
- promotion or leadership assignment.

Role authority must not directly calculate reputation. Phase 15H owns reputation rules.

---

## 25. Event Boundary

Events may add temporary roles but must not mutate durable roles without an explicit transition.

Required event-role lifecycle:

```text
reserve candidate
→ validate eligibility
→ create temporary assignment
→ activate at event boundary
→ perform role
→ complete or abort
→ release bindings
→ restore underlying role projection
```

Phase 15I owns event participation details.

---

## 26. Persistence

Persist at minimum:

- durable role assignments;
- assignment lifecycle state;
- progression state;
- source authority;
- suspension or revocation reason;
- critical contextual bindings;
- active temporary roles that must survive save/load;
- role schema version.

Do not persist ephemeral animation state as role authority.

### 26.1 Save Invariant

A save must not capture contradictory active role states without also capturing the resolver context needed to reconcile them.

### 26.2 Load Invariant

Load must rebuild role projection from authoritative assignments, not trust stale UI or behavior state.

---

## 27. Time Skip Reconciliation

After time skip:

1. expire ended temporary assignments;
2. apply scheduled assignment transitions;
3. resolve progression or revocation events that occurred;
4. restore service coverage;
5. rebuild active role projection;
6. reconcile location and schedule;
7. emit recovery evidence for conflicts.

The system must not simulate every role tick during long skips when an equivalent deterministic summary is available.

---

## 28. Simulation Tiers

### 28.1 Full Simulation

For nearby or interaction-critical NPCs:

- full role projection;
- live capability checks;
- station binding;
- interaction availability;
- visible role behavior.

### 28.2 Reduced Simulation

For nearby but non-critical NPCs:

- simplified role state;
- coarse schedule execution;
- no unnecessary detailed station behavior;
- preserved critical authority.

### 28.3 Abstract Simulation

For distant NPCs:

- assignment and schedule state only;
- summarized service coverage;
- no physical behavior simulation;
- deterministic reconstruction on activation.

Critical role state must survive simulation-tier changes.

---

## 29. Performance Principles

1. Resolve role projection only when relevant inputs change.
2. Cache immutable role definitions.
3. Avoid per-frame eligibility evaluation.
4. Batch schedule-triggered activation checks.
5. Use event-driven capability invalidation.
6. Keep ambient role logic lightweight.
7. Protect lesson, quest, safety, and service actors from aggressive degradation.
8. Record resolution traces selectively outside debug mode.

Performance optimization must not create incorrect authority.

---

## 30. Recovery Architecture

Recovery must handle:

- missing role definition;
- invalid assignment source;
- duplicate primary roles;
- unavailable required actor;
- broken service binding;
- expired temporary role left active;
- stale capability projection;
- save-version mismatch;
- impossible schedule-role combination;
- role-location mismatch.

Recovery order:

1. preserve NPC identity;
2. preserve critical progression state;
3. invalidate unsafe authority;
4. rebuild projection;
5. attempt declared substitute;
6. reduce or close affected service;
7. expose diagnostic state;
8. never invent irreversible progression.

---

## 31. Failure Codes

Recommended failure codes:

```text
NPC_ROLE_DEFINITION_MISSING
NPC_ROLE_ASSIGNMENT_INVALID
NPC_ROLE_ELIGIBILITY_FAILED
NPC_ROLE_PRIMARY_CONFLICT
NPC_ROLE_CAPABILITY_MISSING
NPC_ROLE_ACTIVATION_FAILED
NPC_ROLE_LOCATION_INVALID
NPC_ROLE_STATION_UNAVAILABLE
NPC_ROLE_ASSIGNMENT_EXPIRED
NPC_ROLE_SUSPENDED
NPC_ROLE_SUBSTITUTE_UNAVAILABLE
NPC_ROLE_SERVICE_UNCOVERED
NPC_ROLE_PROJECTION_STALE
NPC_ROLE_SAVE_VERSION_UNSUPPORTED
NPC_ROLE_RECOVERY_REQUIRED
```

Every critical failure should include:

- NPC identifier;
- role identifier;
- assignment identifier where available;
- world time;
- location;
- active context;
- failure code;
- recovery action;
- trace identifier.

---

## 32. Observability

Required observability surfaces:

- active roles per NPC;
- primary role conflicts;
- capability grants and denials;
- service coverage gaps;
- substitution events;
- suspended and invalid assignments;
- temporary role leaks;
- role activation latency;
- role projection rebuild count;
- recovery outcomes.

Recommended debug view:

```text
NPC
Identity class
Primary role
Active secondary roles
Temporary overlays
Current capability set
Current schedule activity
Current location
Service binding
Conflict state
Resolution trace
```

---

## 33. Validation Layers

### 33.1 Definition Validation

Verify:

- unique role identifiers;
- valid role families;
- declared capability set;
- valid priority class;
- valid persistence policy;
- no circular inheritance or dependency.

### 33.2 Assignment Validation

Verify:

- valid NPC;
- valid role;
- valid source authority;
- eligibility;
- bounded temporary dates;
- no forbidden primary conflict.

### 33.3 Runtime Validation

Verify:

- correct activation;
- no leaked capability;
- correct multi-role resolution;
- correct station and service binding;
- safe interruption;
- deterministic restoration.

### 33.4 Persistence Validation

Verify:

- save/load stability;
- temporary assignment restoration or expiry;
- projection rebuild correctness;
- schema migration behavior;
- no duplicate durable assignment.

### 33.5 World Validation

Verify:

- important roles are behaviorally legible;
- required services have valid coverage;
- learning roles appear in appropriate contexts;
- household roles do not override professional boundaries;
- ambient roles do not own progression.

---

## 34. Required Validation Scenarios

At minimum, validate these scenarios:

1. Teacher follows school schedule and exposes learning actions only when active.
2. Merchant closes service when no valid merchant role is active.
3. Parent who is also a carpenter resolves household and workshop obligations correctly.
4. Mentor temporarily assists a learner without gaining assessor authority.
5. Festival organizer overlay ends and restores the underlying role.
6. Emergency role interrupts lower-priority behavior and releases cleanly.
7. Substitute teacher covers an unavailable teacher through explicit assignment.
8. Learner role persists while workshop-assistant role activates only during assigned hours.
9. Save during an active temporary role reloads deterministically.
10. Time skip expires a temporary event role.
11. Duplicate primary assignment is detected and does not grant duplicate authority.
12. Missing role definition enters recovery without deleting NPC identity.
13. Distant abstract NPC reconstructs the correct active role on approach.
14. Capability denial is reflected consistently in UI and interaction runtime.
15. Role-location mismatch triggers relocation, suspension, or explicit failure.

---

## 35. Evidence Package

A Phase 15C evidence package should contain:

- role definition catalog;
- role family matrix;
- capability matrix;
- primary/secondary role examples;
- multi-role conflict table;
- service coverage test results;
- role activation traces;
- substitution evidence;
- save/load evidence;
- time-skip evidence;
- simulation-tier reconstruction evidence;
- failure and recovery examples;
- screenshots or recordings showing behavioral role legibility;
- unresolved exceptions.

Evidence must distinguish:

- declared design;
- implemented runtime behavior;
- automated verification;
- human observation;
- deferred validation.

---

## 36. Production Checklist

### Role Definitions

- [ ] Every role has a stable identifier.
- [ ] Every role belongs to a declared family.
- [ ] Responsibilities and capabilities are explicit.
- [ ] Eligibility and activation rules are defined.
- [ ] Persistence and fallback policies are defined.

### Assignments

- [ ] Durable assignments have valid source authority.
- [ ] Temporary assignments have explicit boundaries.
- [ ] Primary role conflicts are prevented or resolved.
- [ ] Secondary roles declare interruption policy.
- [ ] Event overlays restore underlying roles.

### Runtime

- [ ] One authoritative role resolver exists.
- [ ] Capability projection is deterministic.
- [ ] Inactive roles do not leak authority.
- [ ] Role, schedule, location, and station agree.
- [ ] Service coverage failure is visible.

### Persistence and Recovery

- [ ] Save/load rebuilds correct projection.
- [ ] Time skip expires or transitions roles correctly.
- [ ] Missing definitions do not destroy identity.
- [ ] Substitute and closure policies are tested.
- [ ] Failure codes and traces are available.

### Player Experience

- [ ] Important roles are visually and behaviorally understandable.
- [ ] Interaction options match active authority.
- [ ] NPCs do not appear to perform contradictory jobs.
- [ ] Learning roles remain bounded and trustworthy.
- [ ] Role transitions do not produce obvious world discontinuity.

---

## 37. Exit Gate

Phase 15C is complete only when:

1. role families and assignment types are defined;
2. primary, secondary, and temporary roles resolve deterministically;
3. capabilities derive from active role authority;
4. educational and household boundaries are explicit;
5. service coverage and substitution policies exist;
6. schedule and population integration contracts are defined;
7. save/load and time-skip behavior are validated;
8. recovery and failure evidence exists;
9. important roles are legible in the world;
10. downstream documents can consume the role authority without redefining it.

A document-only definition is not sufficient for final product completion. Runtime and operational verification remain required when implementation begins.

---

## 38. Handoff to Phase 15D

Phase 15C defines **what responsibility an NPC holds**.

Phase 15D must define **how professional capability, qualification, practice, advancement, tools, output quality, and profession progression operate over time**.

The handoff contract to 15D includes:

- role identifiers;
- profession-linked role families;
- capability requirements;
- eligibility hooks;
- progression state hooks;
- station and equipment bindings;
- suspension and retirement states;
- service coverage requirements;
- observability and failure interfaces.

15D must not redefine identity, population placement, schedule authority, or generic multi-role resolution.

---

## 39. Final Production Principle

Builder's Valley should not feel populated by interchangeable service terminals wearing different clothes.

Each important NPC must feel like a person with a stable identity, understandable responsibilities, believable limits, and a place within the learning world.

The role system succeeds when players can understand who can help, why they can help, when they are available, and what happens when their responsibilities change—without the world losing continuity or trust.
