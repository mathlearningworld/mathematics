# 15D — Profession System Production Guide

**Project:** Math Learning World  
**World Slice:** Builder's Valley  
**Phase:** 15 — NPC & Population System  
**Document Type:** Production Guide / Profession Authority  
**Status:** Production Ready  
**Parent Authority:** `15-NPC-AND-POPULATION-SYSTEM-GUIDE.md`  
**Direct Dependencies:** `15A-POPULATION-DISTRIBUTION-PRODUCTION-GUIDE.md`, `15B-DAILY-SCHEDULE-PRODUCTION-GUIDE.md`, `15C-NPC-ROLES-PRODUCTION-GUIDE.md`

---

## 1. Purpose

This guide defines how professions exist, develop, produce value, and remain operationally coherent across Builder's Valley.

It converts the NPC role model into a production-ready profession system covering:

- profession taxonomy;
- entry requirements;
- capability and mastery;
- apprenticeship and supervised practice;
- certification and authorization;
- workplace assignment;
- career progression;
- production output;
- service coverage;
- workforce balancing;
- profession runtime state;
- save/load and recovery;
- validation and evidence.

This document is the authoritative production reference for deciding **what work an NPC is qualified to perform, where that work may occur, what progression is required, what value is produced, and how the world remains believable when workers are absent, interrupted, promoted, reassigned, or simulated offstage**.

It does not define merchant prices, full dialogue behavior, reputation scoring, or event participation policy. Those responsibilities belong to later Phase 15 documents.

---

## 2. Production Outcome

A conforming implementation must produce a profession system that:

1. distinguishes social role from trained profession;
2. ties professional authority to evidence of capability;
3. supports learning through observation, practice, mentorship, and certification;
4. prevents unqualified NPCs from performing protected work;
5. keeps workplaces staffed without creating impossible schedules;
6. permits progression without erasing prior identity or relationships;
7. creates visible economic and educational consequences;
8. supports player understanding with low-language visual signals;
9. remains deterministic enough to debug and validate;
10. degrades safely under simulation and performance constraints.

---

## 3. Profession and Role Boundary

A role describes **how an NPC participates in a context**. A profession describes **a durable capability domain through which the NPC performs recognized work**.

Examples:

- `PARENT` is a role, not a profession.
- `STUDENT` is a role, not a profession.
- `MENTOR` may be a role activated by capability and relationship.
- `CARPENTER` is a profession.
- `MERCHANT` may be both a role family and a profession specialization, depending on authority.
- `TEACHER` is a profession when it requires verified instructional capability and workplace authority.

Rules:

- Every profession may project one or more roles.
- Not every role requires a profession.
- Temporary role activation must not silently grant professional qualification.
- Profession state must remain durable unless explicitly revoked, expired, or retired.

---

## 4. Authority Hierarchy

Profession decisions must obey this order:

1. safety and protected-work policy;
2. certification and legal authority;
3. verified capability and mastery;
4. active supervision contract;
5. workplace assignment;
6. schedule availability;
7. service demand;
8. career preference;
9. workforce balancing;
10. ambient simulation needs.

A lower authority must never override a higher one.

Examples:

- Workforce shortage may not authorize an uncertified NPC to perform protected electrical work.
- A schedule opening may not activate a profession whose certification is suspended.
- Ambient crowd generation may not duplicate a named professional already assigned elsewhere.

---

## 5. Profession Taxonomy

Builder's Valley professions are grouped into production families.

### 5.1 Construction and Craft

Examples:

- carpenter;
- mason;
- metalworker;
- toolmaker;
- painter;
- repair technician;
- structural planner.

Primary outputs:

- structures;
- components;
- repairs;
- tools;
- upgrades;
- safety inspection evidence.

### 5.2 Education and Mentorship

Examples:

- classroom teacher;
- mathematics instructor;
- workshop trainer;
- curriculum guide;
- assessor;
- learning-support specialist.

Primary outputs:

- lessons;
- demonstrations;
- assessment evidence;
- mastery recommendations;
- remediation plans;
- mentorship capacity.

### 5.3 Trade and Distribution

Examples:

- shopkeeper;
- wholesaler;
- purchasing agent;
- inventory clerk;
- delivery coordinator;
- market organizer.

Primary outputs:

- item availability;
- order fulfillment;
- stock movement;
- market access;
- demand signals.

### 5.4 Resource and Production

Examples:

- farmer;
- grower;
- gatherer;
- mill operator;
- material processor;
- production planner.

Primary outputs:

- food;
- raw materials;
- processed resources;
- production capacity;
- seasonal supply.

### 5.5 Service and Care

Examples:

- healer;
- caretaker;
- cook;
- cleaner;
- transport operator;
- lodging keeper.

Primary outputs:

- recovery;
- daily support;
- food service;
- sanitation;
- mobility;
- accommodation.

### 5.6 Civic and Safety

Examples:

- safety inspector;
- emergency responder;
- town coordinator;
- records keeper;
- public works operator;
- dispute facilitator.

Primary outputs:

- safety status;
- emergency response;
- public continuity;
- trusted records;
- infrastructure maintenance.

### 5.7 Creative and Cultural

Examples:

- musician;
- storyteller;
- designer;
- sculptor;
- festival producer;
- cultural teacher.

Primary outputs:

- performances;
- visual identity;
- cultural events;
- morale;
- community memory.

---

## 6. Profession Definition Contract

Every profession definition must include:

```text
professionId
professionFamily
nameKey
visualIconKey
primaryCapabilityDomains[]
entryRequirements[]
protectedTasks[]
allowedWorkplaceTypes[]
progressionTrack[]
certificationPolicy
supervisionPolicy
economicOutputTypes[]
educationalOutputTypes[]
serviceCoverageTags[]
retirementPolicy
version
```

Optional fields may include:

```text
seasonalAvailability
requiredTools[]
requiredFacilities[]
healthRestrictions[]
relationshipRequirements[]
regionalVariants[]
```

Profession definitions are content authority. Runtime records reference them by stable identifier and version.

---

## 7. Capability Model

Professional capability is represented by verified capability domains rather than a single level number.

A capability record contains:

```text
capabilityId
npcId
domainId
proficiencyBand
evidenceIds[]
lastPracticedAt
confidence
verifiedBy
expiresAt?
```

Recommended proficiency bands:

1. `AWARE`
2. `NOVICE`
3. `GUIDED`
4. `INDEPENDENT`
5. `ADVANCED`
6. `MASTER`

Rules:

- A profession may require different bands across multiple domains.
- Progress must be evidence-backed.
- Repetition without demonstrated understanding must not automatically grant mastery.
- Long inactivity may reduce confidence but must not erase historical evidence.
- Protected work requires current authorization, not merely historical proficiency.

---

## 8. Entry Requirements

An NPC may enter a profession track only when all mandatory requirements are satisfied.

Requirement classes:

- minimum capability;
- prerequisite profession or apprenticeship;
- age or maturity gate where appropriate;
- health and safety eligibility;
- tool familiarity;
- facility access;
- mentor availability;
- relationship trust;
- narrative unlock;
- player or institution approval.

Entry evaluation must return explicit evidence:

```text
ELIGIBLE
ELIGIBLE_WITH_SUPERVISION
BLOCKED_MISSING_CAPABILITY
BLOCKED_MISSING_MENTOR
BLOCKED_MISSING_CERTIFICATION
BLOCKED_SAFETY_POLICY
BLOCKED_WORKPLACE_CAPACITY
BLOCKED_NARRATIVE_LOCK
```

---

## 9. Apprenticeship System

Apprenticeship is the primary bridge from learner role to professional authority.

An apprenticeship contract must include:

```text
apprenticeshipId
apprenticeNpcId
mentorNpcId
professionId
workplaceId
startAt
targetCapabilities[]
supervisionLevel
allowedTasks[]
forbiddenTasks[]
reviewCadence
completionCriteria
status
```

Statuses:

```text
PROPOSED
ACTIVE
PAUSED
REVIEW_REQUIRED
COMPLETED
TERMINATED
```

Rules:

- An active mentor must have sufficient capability and authority.
- One mentor may supervise only a bounded number of apprentices.
- Apprenticeship work must fit both mentor and apprentice schedules.
- Supervised tasks must be visibly distinguishable from independent work.
- Completion requires evidence, not elapsed time alone.

---

## 10. Practice and Evidence

Profession progression is based on observable work evidence.

Evidence types:

- completed task;
- quality result;
- safety compliance;
- repair success;
- customer or learner outcome;
- mentor observation;
- assessment challenge;
- repeated independent performance;
- recovery from failure;
- explanation or demonstration.

Evidence records must capture:

```text
evidenceId
npcId
professionId
capabilityDomain
taskType
workplaceId
performedAt
supervisionMode
qualityBand
safetyResult
outcomeReference
validatorId
```

Failed attempts may still produce learning evidence but must not be misclassified as successful production output.

---

## 11. Certification and Authorization

Certification confirms that an NPC has met declared standards. Authorization determines whether that NPC may currently perform specific work.

Certification states:

```text
NOT_STARTED
IN_TRAINING
ASSESSMENT_READY
CERTIFIED
CONDITIONAL
SUSPENDED
EXPIRED
REVOKED
```

Authorization rules:

- Certification may be profession-wide or task-specific.
- Protected tasks require explicit authorization.
- Conditional certification must declare supervision or tool constraints.
- Suspension blocks new protected work but preserves historical records.
- Revocation requires reason and audit evidence.
- Expiration may require refresher practice or reassessment.

---

## 12. Assessment Model

Assessment must evaluate applied capability rather than memorized labels alone.

Assessment modes:

- practical demonstration;
- supervised live task;
- simulated failure scenario;
- explanation and teach-back;
- quality inspection;
- safety protocol check;
- portfolio review.

Assessment result:

```text
assessmentId
candidateNpcId
professionId
capabilityDomains[]
result
strengths[]
gaps[]
remediationActions[]
assessorNpcId
completedAt
```

Results:

```text
PASS
PASS_WITH_CONDITIONS
RETRY_AFTER_PRACTICE
FAIL_SAFETY
INVALID_ASSESSMENT
```

---

## 13. Career Progression

Profession progression is modeled as capability and responsibility growth, not only title escalation.

Recommended track:

```text
EXPLORER
APPRENTICE
JUNIOR
PRACTITIONER
SENIOR
SPECIALIST
MASTER
RETIRED_EXPERT
```

Rules:

- Titles must correspond to actual authority.
- Progression may branch into specialist paths.
- Management responsibility must not be treated as automatic mastery.
- An NPC may remain a highly capable practitioner without becoming a manager.
- Regression in active duty may occur through suspension, health limits, or retirement, while historical mastery remains recorded.

---

## 14. Multi-Profession NPCs

NPCs may hold multiple professions, but runtime activation is bounded.

Each profession record must declare:

```text
primaryProfession
secondaryProfessions[]
activeProfessionContext
conflictPolicy
```

Rules:

- Only one profession may own a single work task.
- Secondary professions may support or substitute when qualified.
- Schedule overlap must be resolved before profession activation.
- Protected-task authorization is evaluated independently per profession.
- Multi-profession NPCs must not count twice in workforce totals.

---

## 15. Workplace Assignment

A workplace assignment connects professional authority to a valid operational location.

Assignment contract:

```text
assignmentId
npcId
professionId
workplaceId
positionType
shiftPattern
capacityClaim
startAt
endAt?
status
```

Statuses:

```text
PLANNED
ACTIVE
TEMPORARY
PAUSED
ENDED
```

A valid assignment requires:

- compatible workplace type;
- available station or service capacity;
- schedule compatibility;
- required certification;
- required tools and facilities;
- no higher-priority conflicting assignment.

---

## 16. Workplace Capacity

Every workplace must declare profession capacity separately from visible NPC capacity.

Example:

```text
workplaceId: valley-workshop-a
professionSlots:
  carpenter: 3
  toolmaker: 1
  apprentice: 2
serviceStations:
  cuttingBench: 2
  assemblyBench: 2
  inspectionDesk: 1
```

Rules:

- Profession slots represent staffing authority.
- Service stations represent simultaneous work capacity.
- A workplace may be staffed but temporarily unable to produce if tools or materials are missing.
- Over-capacity assignment must be rejected or explicitly queued.

---

## 17. Schedule Integration

Profession activation depends on 15B schedule authority.

Runtime sequence:

1. Resolve current schedule block.
2. Resolve active role context.
3. Resolve profession assignment.
4. Verify certification and capability.
5. Reserve workplace and station.
6. Start work activity.
7. Record output and evidence.

Schedule rules:

- Professional work cannot silently override sleep, emergency, or protected family obligations.
- Shift changes must release old workplace reservations.
- Late arrival must reduce available production time rather than teleport productivity.
- Time skip must reconcile expected work output using bounded simulation rules.

---

## 18. Population Integration

Profession demand influences population distribution but does not own it.

Integration rules:

- 15A decides where residents and visitors belong.
- 15D declares workforce demand and professional presence requirements.
- Population balancing may recruit visitors or dynamic workers when permitted.
- Critical named professionals remain persistent.
- Ambient workers must not satisfy protected service coverage unless explicitly qualified.

---

## 19. Service Coverage

Each district may declare minimum service coverage.

Example coverage tags:

```text
basic-repair
food-service
learning-support
health-response
market-access
transport-support
safety-inspection
```

Coverage states:

```text
FULL
LIMITED
DEGRADED
UNAVAILABLE
EMERGENCY_ONLY
```

Rules:

- Coverage is calculated from currently authorized and available professionals.
- Offstage NPCs may contribute only when schedule and travel make that plausible.
- Shortage must become visible through service delay, closure, queue, or request for help.
- The system must never fake full coverage from nonexistent workers.

---

## 20. Workforce Balancing

Workforce balancing protects world continuity without erasing meaningful scarcity.

Inputs:

- district population;
- service demand;
- active workplaces;
- profession availability;
- apprenticeship pipeline;
- seasonal demand;
- event demand;
- player progression;
- device simulation tier.

Allowed responses:

- shift reassignment;
- temporary visitor recruitment;
- reduced opening hours;
- service queue;
- apprenticeship opportunity;
- player assistance mission;
- delayed noncritical production.

Forbidden responses:

- silently granting certification;
- duplicating named NPCs;
- teleporting workers without travel reconciliation;
- counting one NPC in overlapping workplaces;
- hiding critical service failure.

---

## 21. Production Output

Professional work may produce physical, educational, service, or informational output.

Output record:

```text
outputId
producerNpcId
professionId
workplaceId
outputType
quantity
qualityBand
startedAt
completedAt
inputReferences[]
evidenceIds[]
```

Quality bands:

```text
UNUSABLE
BASIC
STANDARD
HIGH
EXPERT
MASTERWORK
```

Rules:

- Output quality derives from capability, tools, materials, supervision, fatigue, and task difficulty.
- Randomness may vary outcome within bounded deterministic ranges.
- High quality must not appear without corresponding capability evidence.
- Failed work must consume time and may consume materials where appropriate.

---

## 22. Educational Integration

Professions must support the learning purpose of Math Learning World.

Professional activity may expose:

- measurement;
- counting;
- estimation;
- geometry;
- ratios;
- arithmetic;
- resource planning;
- sequencing;
- error checking;
- pattern recognition.

Rules:

- Mathematical meaning must arise from real work context.
- Learning challenges must not be cosmetic gates unrelated to the task.
- Mentors should demonstrate before requiring independent performance.
- Difficulty must adapt to learner capability while preserving the real structure of the work.
- Profession progression and academic mastery are related but not identical.

---

## 23. Player Participation

The player may participate as:

- observer;
- helper;
- apprentice;
- independent practitioner;
- mentor;
- inspector;
- workplace coordinator.

Player authority must be constrained by the same task and certification rules where applicable.

The system must not grant professional status merely because the player completed one simplified interaction.

---

## 24. Profession Runtime State

Runtime state for an NPC profession should include:

```text
npcId
professionId
careerStage
certificationState
activeAssignmentId?
activeWorkplaceId?
activeTaskId?
activeSupervisionId?
fatigueBand
availabilityState
lastTransitionAt
version
```

Availability states:

```text
AVAILABLE
SCHEDULED
WORKING
TRAVELLING
ON_BREAK
OFF_DUTY
SUSPENDED
UNAVAILABLE
```

---

## 25. Profession State Machine

Recommended lifecycle:

```text
DISCOVERED
→ ELIGIBLE
→ IN_TRAINING
→ SUPERVISED_PRACTICE
→ ASSESSMENT_READY
→ AUTHORIZED
→ ACTIVE_PRACTICE
→ ADVANCED_PRACTICE
→ RETIRED
```

Exceptional transitions:

```text
AUTHORIZED → SUSPENDED
SUSPENDED → AUTHORIZED
AUTHORIZED → REVOKED
ACTIVE_PRACTICE → REASSIGNED
IN_TRAINING → PAUSED
```

Every transition must record reason, authority, timestamp, and evidence reference.

---

## 26. Simulation Tiers

Profession simulation must operate across three tiers.

### Tier 1 — Full Simulation

Used near the player or during active professional interaction.

Includes:

- navigation;
- tool use;
- station reservation;
- task animation;
- interruption handling;
- detailed output evidence.

### Tier 2 — Reduced Simulation

Used in loaded but nonfocused districts.

Includes:

- schedule blocks;
- workplace attendance;
- aggregate task progress;
- bounded output calculation;
- essential service coverage.

### Tier 3 — Abstract Simulation

Used in unloaded regions.

Includes:

- profession availability;
- assignment continuity;
- aggregate production;
- apprenticeship progress limits;
- shortage detection;
- return-state reconstruction.

Critical state must remain consistent across tier transitions.

---

## 27. Time Skip Reconciliation

During time skip, the system must determine:

- whether the NPC was scheduled to work;
- whether travel was possible;
- whether workplace and tools were available;
- whether required inputs existed;
- whether an interruption occurred;
- what bounded output was plausible;
- what evidence may legitimately be created.

Time skip must not:

- generate impossible production;
- bypass certification;
- complete an apprenticeship without review evidence;
- ignore workplace closure;
- create duplicate outputs.

---

## 28. Save and Load

Persisted profession state must include:

- profession identity;
- capability records;
- career stage;
- certification and authorization;
- active apprenticeship;
- workplace assignment;
- active task checkpoint;
- output ledger references;
- suspension or restriction reasons;
- progression evidence.

On load, the system must reconcile:

1. definition version;
2. NPC identity;
3. schedule state;
4. workplace validity;
5. active task validity;
6. station reservation;
7. elapsed world time;
8. pending output;
9. certification expiration.

---

## 29. Recovery Architecture

Recovery must prefer safe continuation over silent reset.

Recovery cases:

- missing workplace;
- missing mentor;
- deleted profession definition;
- invalid station reservation;
- expired certification;
- duplicated active assignment;
- interrupted task;
- missing material input;
- schedule mismatch;
- corrupted career transition.

Recovery order:

1. preserve durable identity and evidence;
2. stop unsafe active work;
3. release invalid reservations;
4. reconstruct valid assignment where possible;
5. move NPC to safe schedule state;
6. expose explicit recovery event;
7. require review for unresolved authority conflicts.

---

## 30. Failure Codes

Recommended failure codes:

```text
PROFESSION_DEFINITION_NOT_FOUND
PROFESSION_REQUIREMENT_NOT_MET
PROFESSION_CERTIFICATION_REQUIRED
PROFESSION_CERTIFICATION_EXPIRED
PROFESSION_AUTHORIZATION_SUSPENDED
PROFESSION_PROTECTED_TASK_DENIED
PROFESSION_MENTOR_UNAVAILABLE
PROFESSION_WORKPLACE_INVALID
PROFESSION_WORKPLACE_AT_CAPACITY
PROFESSION_STATION_UNAVAILABLE
PROFESSION_SCHEDULE_CONFLICT
PROFESSION_ASSIGNMENT_DUPLICATED
PROFESSION_INPUT_MISSING
PROFESSION_OUTPUT_INVALID
PROFESSION_TRANSITION_INVALID
PROFESSION_RECOVERY_REQUIRED
```

Failures must include NPC, profession, task, workplace, timestamp, and reason context where available.

---

## 31. Observability

The profession system must expose measurable runtime evidence.

Minimum metrics:

- active professionals by profession;
- certified professionals by district;
- service coverage state;
- workplace staffing ratio;
- apprenticeship count;
- apprenticeship completion rate;
- protected-task denial count;
- station contention count;
- production output by type;
- output quality distribution;
- schedule conflict count;
- recovery event count.

Debug views should allow inspection of one NPC from profession definition through current task and evidence.

---

## 32. Determinism

Profession behavior must be deterministic for identical authoritative inputs.

Any controlled variation must derive from a stable seed containing relevant values such as:

```text
worldSeed
npcId
professionId
taskId
worldDay
workplaceId
```

Variation may affect:

- animation choice;
- minor timing offset;
- bounded quality variation;
- optional task selection.

Variation must not affect:

- certification validity;
- protected-task authorization;
- mandatory service coverage;
- career transition requirements;
- evidence integrity.

---

## 33. Performance Budget

The profession system must prioritize:

1. critical active tasks;
2. protected service coverage;
3. named NPC continuity;
4. apprenticeship supervision;
5. nearby workplace simulation;
6. aggregate production;
7. decorative work behavior.

Under pressure, reduce:

- animation detail;
- nonessential station micro-actions;
- ambient worker count;
- update frequency for distant production;
- optional output variation.

Never reduce:

- qualification checks;
- assignment uniqueness;
- safety policy;
- durable evidence;
- critical service status.

---

## 34. Validation Scenarios

A production implementation must validate at least the following scenarios.

### Scenario A — Profession Entry

An eligible NPC enters apprenticeship with valid mentor, workplace, and schedule.

Expected:

- apprenticeship becomes active;
- allowed tasks are constrained;
- workplace capacity is reserved;
- progression evidence begins.

### Scenario B — Protected Task Denial

An uncertified NPC attempts protected work.

Expected:

- task is denied;
- no output is created;
- explicit failure code is recorded;
- safe alternative behavior is selected.

### Scenario C — Mentor Absence

The mentor becomes unavailable during supervised practice.

Expected:

- protected task pauses;
- apprentice does not continue independently;
- schedule and assignment reconcile safely.

### Scenario D — Workplace Capacity Conflict

Two assignments claim the final profession slot.

Expected:

- one authoritative claim succeeds;
- the second receives explicit capacity failure;
- no duplicate staffing count occurs.

### Scenario E — Multi-Profession Conflict

An NPC is scheduled as teacher and carpenter at overlapping times.

Expected:

- authority hierarchy resolves one active assignment;
- the other is rescheduled, delegated, or marked unavailable;
- the NPC is not double-counted.

### Scenario F — Time Skip Production

The world skips across a full work shift.

Expected:

- plausible aggregate output is generated;
- input and workplace constraints are respected;
- no impossible mastery or certification appears.

### Scenario G — Save During Work

The game saves while an NPC is using a reserved station.

Expected:

- task checkpoint persists;
- load reconciles elapsed time;
- station ownership is restored or safely released.

### Scenario H — Certification Expiration

Certification expires before the next protected shift.

Expected:

- protected work is blocked;
- nonprotected duties may continue if allowed;
- renewal requirement becomes visible.

### Scenario I — Service Shortage

A district loses its only repair professional.

Expected:

- coverage becomes degraded or unavailable;
- the world exposes a meaningful consequence;
- no ambient NPC is silently promoted.

### Scenario J — Recovery from Missing Workplace

A saved assignment references a removed workplace.

Expected:

- unsafe task is cancelled;
- evidence and profession history remain intact;
- NPC enters safe reassignment state;
- recovery event is observable.

---

## 35. Evidence Package

Phase 15D completion requires evidence containing:

- profession definition registry;
- profession-role boundary examples;
- capability and proficiency model;
- apprenticeship contract;
- certification state model;
- protected-task policy;
- workplace assignment model;
- service coverage calculation;
- workforce balancing examples;
- profession runtime state machine;
- save/load reconciliation evidence;
- recovery scenarios;
- failure code coverage;
- deterministic simulation evidence;
- validation scenario results.

---

## 36. Acceptance Criteria

Phase 15D passes only when:

1. profession and role are represented separately;
2. capability evidence governs professional authority;
3. apprentices cannot bypass supervision constraints;
4. certification controls protected work;
5. workplace assignments are unique and capacity-aware;
6. schedule and population integration are explicit;
7. workforce shortages remain visible and meaningful;
8. time skip cannot create impossible outputs;
9. save/load preserves progression and active work safely;
10. recovery preserves evidence and prevents unsafe continuation;
11. validation scenarios are reproducible;
12. implementation evidence is sufficient for Phase 15J review.

---

## 37. Exit Gate

Phase 15D is complete when Builder's Valley can answer, for every professionally active NPC:

- What profession do they hold?
- What capabilities prove that status?
- What work are they authorized to perform?
- Where are they assigned?
- When are they available?
- Who supervises them when required?
- What output are they producing?
- What happens when work cannot continue?
- How does their career progress?
- How is all of this restored after save/load?

If any answer depends on hidden assumptions or random decoration, the profession system is not production ready.

---

## 38. Handoff to Phase 15E

Phase 15E — Merchant Economy may consume:

- profession definitions;
- authorized merchant and production workers;
- workplace assignments;
- production outputs;
- quality bands;
- service coverage;
- workforce shortages;
- trade and distribution profession capacity.

Phase 15E must not redefine professional qualification, certification, workplace authority, or production evidence.

The handoff boundary is:

> **15D determines who can produce and serve. 15E determines how goods, services, prices, demand, and exchange move through the economy.**
