# 15I — Event Participation Production Guide

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 15 — NPC & Population System  
**Guide:** 15I — Event Participation  
**Status:** Production Ready  
**Authority Level:** World Foundation Contract  
**Upstream Dependencies:** 15A, 15B, 15C, 15D, 15E, 15F, 15G, 15H  
**Downstream Handoff:** 15J — Population Validation

---

## 1. Purpose

This guide defines the authoritative event-participation model for Builder's Valley.

The event system coordinates many actors, locations, schedules, professions, merchants, families, schools, reputations, and interactions around a shared time-bounded purpose.

It governs how:

- events are defined,
- events are proposed,
- events are approved,
- invitations are issued,
- eligibility is evaluated,
- attendance intent is recorded,
- schedules are reserved,
- roles are assigned,
- capacity is managed,
- participants arrive,
- participation is observed,
- obligations are completed,
- disruptions are handled,
- rewards and consequences are applied,
- reputation is affected,
- event outcomes become durable world evidence,
- save/load restores the event deterministically,
- population-wide validation can verify that the world remained coherent.

The system must preserve the principle:

> An event is not a decorative calendar entry. It is an authoritative temporary operating context that coordinates real world-state transitions across multiple actors.

---

## 2. Scope

This guide covers:

- event authority,
- event identity,
- event definitions,
- event instances,
- event categories,
- event lifecycle,
- event ownership,
- event sponsorship,
- event hosts,
- event organizers,
- invitations,
- announcements,
- discovery,
- registration,
- eligibility,
- exclusion,
- accessibility,
- capacity,
- waitlists,
- participant intent,
- attendance commitment,
- arrival,
- check-in,
- presence,
- role assignment,
- volunteer duties,
- profession obligations,
- school obligations,
- merchant participation,
- household participation,
- child participation,
- guardian rules,
- schedule reservation,
- conflict resolution,
- travel allowance,
- preparation windows,
- cleanup windows,
- event interactions,
- event resources,
- event inventories,
- event spaces,
- stalls,
- stages,
- classrooms,
- workshops,
- competitions,
- ceremonies,
- festivals,
- markets,
- school events,
- public works,
- emergency events,
- participation evidence,
- contribution tracking,
- completion,
- failure,
- cancellation,
- postponement,
- evacuation,
- rewards,
- penalties,
- reputation effects,
- relationship effects,
- economy effects,
- education effects,
- persistence,
- save/load,
- telemetry,
- validation,
- production exit criteria.

This guide does not define:

- the complete population simulation validation suite,
- combat encounters,
- unrestricted crowd physics,
- arbitrary player-authored event scripting,
- global cross-world event federation,
- final seasonal narrative design.

Those concerns belong to later phases or separate systems.

---

## 3. Event Doctrine

Builder's Valley events follow these doctrines.

### 3.1 Authority before presentation

Banners, music, decorations, countdowns, crowd animations, and UI notices are projections.

The authoritative event record determines whether an event exists.

### 3.2 Instance before attendance

No actor may attend an event definition directly.

Attendance always targets a concrete event instance with a stable identity, time window, location, capacity, and lifecycle state.

### 3.3 Eligibility before commitment

An actor must satisfy deterministic eligibility rules before a participation commitment becomes authoritative.

### 3.4 Commitment before schedule mutation

Schedules are not altered because an invitation exists.

Schedule reservations occur only after an accepted commitment or mandatory assignment.

### 3.5 Capacity before admission

Capacity-constrained events must reserve a place before admitting a participant.

### 3.6 Role before responsibility

An actor does not acquire event obligations merely by being nearby.

Responsibilities arise from an explicit event role assignment.

### 3.7 Presence before contribution

Contribution credit requires authoritative presence or an explicitly accepted remote contribution contract.

### 3.8 Evidence before reward

Rewards, reputation changes, and completion outcomes require participation evidence.

### 3.9 Cancellation is a transition

Cancellation, postponement, abandonment, and evacuation are explicit lifecycle transitions, not deleted data.

### 3.10 Recovery preserves history

Save/load, crash recovery, and offline resumption must preserve event identity, participant commitments, capacity reservations, completed contributions, and applied consequences.

---

## 4. Event Authority Model

The event subsystem owns:

- event definitions,
- event instances,
- event lifecycle state,
- event time windows,
- event locations,
- participant commitments,
- event roles,
- capacity reservations,
- event contribution records,
- event completion records,
- event outcome records.

The event subsystem does not own:

- the actor's canonical identity,
- the actor's base schedule definition,
- profession definitions,
- merchant inventory authority,
- reputation balances,
- relationship state,
- educational mastery state,
- world-object ownership.

Those systems remain authoritative and are integrated through explicit commands, queries, and outcome contracts.

### 4.1 Required authority boundaries

Every integration must make clear:

- who owns the data,
- who proposes the change,
- who validates the change,
- who commits the change,
- who publishes the evidence,
- who projects the result.

### 4.2 Forbidden authority leaks

The event system must not:

- directly rewrite profession definitions,
- directly mutate merchant balances,
- directly set reputation totals,
- directly grant mastery,
- silently overwrite household schedules,
- infer attendance from rendered proximity alone,
- create participants from animation state,
- delete failed events to hide inconsistency.

---

## 5. Core Event Entities

### 5.1 EventDefinition

An `EventDefinition` describes a reusable event pattern.

Required fields:

- `eventDefinitionId`
- `eventCode`
- `nameKey`
- `category`
- `defaultDurationMinutes`
- `defaultLocationPolicy`
- `defaultCapacityPolicy`
- `eligibilityPolicyId`
- `participationPolicyId`
- `rewardPolicyId`
- `consequencePolicyId`
- `schedulePolicyId`
- `enabled`
- `version`

### 5.2 EventInstance

An `EventInstance` is the concrete authoritative event.

Required fields:

- `eventInstanceId`
- `eventDefinitionId`
- `worldId`
- `settlementId`
- `titleKey`
- `category`
- `hostActorId`
- `organizerActorIds`
- `sponsorEntityIds`
- `locationId`
- `registrationOpenAt`
- `registrationCloseAt`
- `startsAt`
- `endsAt`
- `preparationStartsAt`
- `cleanupEndsAt`
- `capacity`
- `lifecycleState`
- `visibility`
- `version`
- `createdAt`
- `updatedAt`

### 5.3 EventParticipant

An `EventParticipant` represents one actor's relationship to one event instance.

Required fields:

- `eventParticipantId`
- `eventInstanceId`
- `actorId`
- `householdId`
- `participationSource`
- `invitationId`
- `eligibilityDecisionId`
- `commitmentState`
- `attendanceState`
- `primaryRoleId`
- `secondaryRoleIds`
- `capacityReservationId`
- `checkInAt`
- `checkOutAt`
- `completionState`
- `version`

### 5.4 EventRoleAssignment

An `EventRoleAssignment` gives an actor defined responsibilities.

Required fields:

- `eventRoleAssignmentId`
- `eventInstanceId`
- `actorId`
- `roleCode`
- `dutyDefinitionIds`
- `startsAt`
- `endsAt`
- `required`
- `acceptedAt`
- `releasedAt`
- `completionState`

### 5.5 EventContribution

An `EventContribution` records verifiable participation.

Required fields:

- `eventContributionId`
- `eventInstanceId`
- `actorId`
- `contributionType`
- `quantity`
- `qualityBand`
- `evidenceRefs`
- `recordedAt`
- `verifiedBy`
- `status`

### 5.6 EventOutcome

An `EventOutcome` records the durable result.

Required fields:

- `eventOutcomeId`
- `eventInstanceId`
- `completionState`
- `attendanceSummary`
- `contributionSummary`
- `resourceSummary`
- `economicSummary`
- `reputationSummary`
- `educationSummary`
- `incidentSummary`
- `completedAt`
- `version`

---

## 6. Event Categories

The initial production event categories are:

1. `COMMUNITY_FESTIVAL`
2. `WEEKLY_MARKET`
3. `SCHOOL_SESSION`
4. `SCHOOL_CEREMONY`
5. `PROFESSION_GATHERING`
6. `PUBLIC_WORKS`
7. `HARVEST_ACTIVITY`
8. `CRAFT_WORKSHOP`
9. `BUILDING_PROJECT`
10. `SPORT_OR_GAME`
11. `COMPETITION`
12. `CULTURAL_CEREMONY`
13. `HOUSEHOLD_CELEBRATION`
14. `MERCHANT_PROMOTION`
15. `TOWN_MEETING`
16. `VOLUNTEER_ACTIVITY`
17. `WELCOME_EVENT`
18. `FAREWELL_EVENT`
19. `EMERGENCY_RESPONSE`
20. `RECOVERY_ACTIVITY`

### 6.1 Category rules

Each category must define:

- default visibility,
- default capacity behavior,
- invitation mode,
- schedule priority,
- age policy,
- guardian policy,
- reputation sensitivity,
- profession relevance,
- reward policy,
- cancellation policy,
- validation profile.

### 6.2 Category extensibility

New categories may be added only when:

- their authority model is explicit,
- their lifecycle maps to the standard lifecycle,
- their schedule priority is defined,
- their participation evidence is testable,
- their persistence needs are understood,
- their validation profile exists.

---

## 7. Event Lifecycle

### 7.1 Lifecycle states

The canonical event lifecycle is:

```text
DRAFT
  -> PROPOSED
  -> APPROVED
  -> ANNOUNCED
  -> REGISTRATION_OPEN
  -> REGISTRATION_CLOSED
  -> PREPARING
  -> ACTIVE
  -> CLOSING
  -> COMPLETED
```

Exceptional terminal or transitional states:

```text
REJECTED
CANCELLED
POSTPONED
ABANDONED
EVACUATING
FAILED
```

### 7.2 DRAFT

The event exists only as an editable proposal.

No invitations, reservations, or schedule effects are allowed.

### 7.3 PROPOSED

The event has been submitted for approval.

The proposal must include:

- purpose,
- host,
- organizer,
- time window,
- location,
- expected capacity,
- required resources,
- safety profile,
- schedule priority,
- budget or sponsorship source where applicable.

### 7.4 APPROVED

The event has passed policy checks.

Approval authorizes announcement preparation but does not yet admit participants.

### 7.5 ANNOUNCED

The event is discoverable according to visibility rules.

Announcements may be projected through:

- notice boards,
- school notices,
- merchant posters,
- NPC conversation,
- household reminders,
- calendar UI,
- village messenger behavior.

### 7.6 REGISTRATION_OPEN

Eligible actors may commit, decline, or join a waitlist.

### 7.7 REGISTRATION_CLOSED

New voluntary commitments are blocked unless an authorized override applies.

### 7.8 PREPARING

Organizers, assigned workers, vendors, and volunteers may begin setup duties.

### 7.9 ACTIVE

The event accepts check-in, presence, activities, contributions, incidents, and live role transitions.

### 7.10 CLOSING

New attendance is normally blocked.

Outstanding duties, check-out, resource return, payment, cleanup, and evidence finalization occur here.

### 7.11 COMPLETED

All required outcome records are finalized and downstream consequences have been requested exactly once.

### 7.12 CANCELLED

The event will not occur.

Commitments and reservations must be released with clear reason codes.

### 7.13 POSTPONED

The event remains valid but receives a replacement schedule.

Participant commitments must be re-confirmed when the time change exceeds policy tolerance.

### 7.14 EVACUATING

The event is ending immediately because safety authority has overridden normal operation.

### 7.15 FAILED

The event could not complete its essential purpose.

Failure does not erase participation evidence.

---

## 8. Event Creation and Approval

### 8.1 Creation authority

An event may be created by:

- settlement authority,
- school authority,
- profession authority,
- merchant authority,
- household authority for private events,
- emergency authority,
- approved player action,
- deterministic seasonal scheduler.

### 8.2 Required validation

Before approval, the system must verify:

- host authority,
- location availability,
- time-window validity,
- organizer availability,
- required resource feasibility,
- category policy,
- safety policy,
- age restrictions,
- capacity configuration,
- schedule-priority validity,
- conflict with protected world events,
- duplicate event detection.

### 8.3 Duplicate prevention

Duplicate detection should consider:

- definition,
- settlement,
- location,
- start time,
- host,
- seasonal key,
- recurrence key.

A duplicate candidate must be rejected or linked explicitly as a replacement.

---

## 9. Visibility, Discovery, and Announcement

### 9.1 Visibility modes

- `PUBLIC`
- `SETTLEMENT_ONLY`
- `MEMBERS_ONLY`
- `INVITE_ONLY`
- `HOUSEHOLD_ONLY`
- `ROLE_ONLY`
- `EMERGENCY_BROADCAST`

### 9.2 Discovery does not imply eligibility

An actor may know about an event without being allowed to participate.

### 9.3 Announcement evidence

For targeted announcements, the system should record:

- recipient actor or audience segment,
- announcement channel,
- published timestamp,
- delivery status,
- acknowledged timestamp where required.

### 9.4 Conversation integration

NPC conversation may reveal events only when:

- the speaker knows the event,
- the event is visible to the listener,
- disclosure is permitted,
- timing is appropriate,
- the conversation system receives an authoritative event-fact projection.

---

## 10. Invitation System

### 10.1 Invitation types

- `OPEN_INVITATION`
- `DIRECT_INVITATION`
- `HOUSEHOLD_INVITATION`
- `PROFESSION_INVITATION`
- `SCHOOL_INVITATION`
- `MERCHANT_INVITATION`
- `VOLUNTEER_REQUEST`
- `MANDATORY_ASSIGNMENT`
- `EMERGENCY_SUMMONS`

### 10.2 Invitation states

```text
PENDING
DELIVERED
VIEWED
ACCEPTED
DECLINED
EXPIRED
REVOKED
SUPERSEDED
```

### 10.3 Invitation contract

Every invitation must specify:

- event instance,
- target actor or target segment,
- invitation type,
- response deadline,
- offered role,
- mandatory or voluntary status,
- capacity reservation behavior,
- guardian requirement,
- decline consequence policy,
- revocation policy.

### 10.4 Decline handling

Declining a voluntary invitation must not create a penalty by default.

A consequence may apply only when:

- the actor previously accepted a duty,
- the event is mandatory under a valid authority,
- the actor abandons a protected obligation without an accepted reason,
- the policy explicitly defines the consequence.

---

## 11. Eligibility Engine

### 11.1 Eligibility inputs

Eligibility may consider:

- actor existence,
- actor status,
- age band,
- guardian availability,
- household membership,
- settlement membership,
- profession,
- profession rank,
- school enrollment,
- skill prerequisites,
- reputation thresholds,
- relationship requirements,
- invitation possession,
- schedule availability,
- health and energy status,
- required equipment,
- legal or safety restrictions,
- prior suspension,
- event-specific completion prerequisites.

### 11.2 Eligibility decision

The decision must produce:

- `ELIGIBLE`
- `ELIGIBLE_WITH_CONDITIONS`
- `INELIGIBLE`
- `REQUIRES_GUARDIAN`
- `REQUIRES_OVERRIDE`
- `WAITLIST_ONLY`

### 11.3 Decision evidence

Each decision must preserve:

- policy version,
- evaluated inputs,
- decision,
- reason codes,
- conditions,
- evaluator timestamp.

### 11.4 Reputation integration

Reputation may:

- unlock honorary roles,
- unlock trusted merchant access,
- unlock leadership eligibility,
- affect invitation priority,
- require supervision,
- block sensitive responsibilities,
- alter contribution verification requirements.

Reputation must not silently remove a public actor from ordinary civic access unless an explicit policy permits it.

---

## 12. Capacity and Waitlists

### 12.1 Capacity policies

- `UNLIMITED_SOFT`
- `FIXED_HARD`
- `ROLE_BASED`
- `LOCATION_DERIVED`
- `HOUSEHOLD_QUOTA`
- `PROFESSION_QUOTA`
- `AGE_BAND_QUOTA`
- `STALL_CAPACITY`

### 12.2 Capacity reservation lifecycle

```text
REQUESTED
HELD
CONFIRMED
RELEASED
EXPIRED
CONSUMED
```

### 12.3 Waitlist ordering

Waitlists must use an explicit deterministic ordering policy, such as:

1. mandatory role,
2. direct invitation priority,
3. profession need,
4. household fairness,
5. registration timestamp,
6. stable actor-id tie-breaker.

### 12.4 Promotion

When capacity becomes available:

- select the next eligible candidate,
- re-evaluate time-sensitive eligibility,
- create a temporary hold,
- notify the candidate,
- require confirmation within policy timeout,
- release the hold on expiration.

---

## 13. Commitment and Registration

### 13.1 Commitment states

```text
NONE
INTERESTED
WAITLISTED
ACCEPTED
CONFIRMED
WITHDRAWN
REVOKED
MANDATED
```

### 13.2 Registration transaction

A successful registration must atomically coordinate:

- eligibility decision,
- capacity reservation,
- participant record,
- role offer if applicable,
- schedule-reservation request,
- notification projection.

### 13.3 Withdrawal

Withdrawal must:

- record reason,
- release capacity,
- release event role,
- request schedule restoration,
- promote waitlisted actors where appropriate,
- evaluate consequences only under explicit policy.

### 13.4 Late registration

Late registration requires:

- event state permitting admission,
- remaining capacity,
- current eligibility,
- host or policy authority,
- no conflict with safety or closing rules.

---

## 14. Schedule Integration

### 14.1 Schedule reservation windows

An event may reserve:

- preparation time,
- travel-to-event time,
- attendance time,
- duty time,
- recovery time,
- cleanup time,
- travel-home time.

### 14.2 Priority classes

Recommended priority classes:

1. `EMERGENCY`
2. `MANDATORY_CIVIC`
3. `MANDATORY_SCHOOL`
4. `REQUIRED_PROFESSION`
5. `CONFIRMED_ROLE`
6. `CONFIRMED_ATTENDANCE`
7. `OPTIONAL_ATTENDANCE`
8. `DISCOVERY_ONLY`

### 14.3 Conflict resolution

When schedules conflict, the resolver must consider:

- priority class,
- prior commitment,
- mandatory status,
- replaceability,
- household obligations,
- profession coverage,
- school attendance policy,
- travel feasibility,
- actor fatigue,
- player choice where allowed.

### 14.4 No teleport assumption

An actor cannot attend two geographically separated events merely because the clock windows do not overlap exactly.

Travel time must be included.

### 14.5 Schedule restoration

Cancellation or withdrawal must restore displaced schedule items when still feasible.

Restoration must not duplicate previously completed activities.

---

## 15. Household and Guardian Participation

### 15.1 Household response modes

A household may respond:

- individually,
- as a group,
- through a guardian,
- through a delegated household representative.

### 15.2 Child participation

Child participation may require:

- guardian consent,
- guardian presence,
- school authorization,
- age-appropriate role,
- protected travel plan,
- curfew compliance.

### 15.3 Guardian continuity

If a required guardian withdraws:

- dependent participants become conditionally invalid,
- replacement guardians may be evaluated,
- capacity must remain held only for the policy grace period,
- the system must avoid leaving children with impossible attendance plans.

### 15.4 Household fairness

Quota policies should avoid allowing one household to consume all limited public capacity unless the event is household-specific.

---

## 16. Profession Participation

### 16.1 Profession involvement modes

- attendee,
- service provider,
- vendor,
- organizer,
- judge,
- instructor,
- safety officer,
- performer,
- builder,
- supplier,
- cleanup worker.

### 16.2 Required coverage

Profession-critical events must define minimum coverage.

Examples:

- market requires merchant coverage,
- school event requires teacher coverage,
- construction event requires builder supervision,
- emergency event requires designated responders.

### 16.3 Coverage validation

Before activation, verify:

- required roles filled,
- assigned actors available,
- backups assigned where policy requires,
- required tools present,
- profession credentials valid.

### 16.4 Profession consequences

Completion may affect:

- profession reputation,
- experience evidence,
- duty reliability,
- access to future assignments,
- payment eligibility.

The event system requests these changes; profession and reputation systems remain authoritative.

---

## 17. Merchant and Market Events

### 17.1 Stall participation

A market vendor requires:

- merchant eligibility,
- stall reservation,
- inventory declaration,
- setup window,
- pricing policy compliance,
- payment channel readiness.

### 17.2 Merchant capacity

Capacity may be controlled by:

- number of stalls,
- stall type,
- product category,
- safety spacing,
- merchant reputation,
- rotation fairness.

### 17.3 Inventory authority

Event setup may reserve inventory, but merchant inventory remains authoritative.

Sale completion must use the merchant economy transaction path.

### 17.4 Market evidence

Market outcomes may summarize:

- vendor attendance,
- customer attendance,
- transaction count,
- goods categories,
- stockouts,
- disputes,
- stall cleanup,
- merchant reliability.

### 17.5 Promotional events

Promotions must not bypass pricing, ownership, or payment rules.

---

## 18. School and Learning Events

### 18.1 School event types

- scheduled lesson,
- group practice,
- assessment session,
- exhibition,
- parent meeting,
- school ceremony,
- tutoring workshop,
- mentorship event,
- field activity.

### 18.2 Learning participation

Attendance alone does not grant mastery.

The education system may consume:

- presence evidence,
- completed activity evidence,
- assessment evidence,
- mentor evidence,
- reflection or practice evidence.

### 18.3 Parent and guardian events

Parent meetings may require:

- household invitation,
- learner linkage,
- privacy scope,
- teacher role,
- scheduled time slot.

### 18.4 Learning safety

Events must not shame learners publicly through reputation projections.

Educational weakness remains protected information unless policy and consent permit disclosure.

---

## 19. Community Festivals and Ceremonies

### 19.1 Festival phases

A festival commonly includes:

- planning,
- sponsorship,
- preparation,
- decoration,
- opening,
- activity blocks,
- shared meal or market,
- ceremony,
- closing,
- cleanup,
- outcome review.

### 19.2 Activity blocks

Each block may define:

- local capacity,
- separate eligibility,
- participant role,
- start and end time,
- location zone,
- required resources,
- completion evidence.

### 19.3 Ceremony roles

Ceremonial roles may depend on:

- profession,
- community reputation,
- household status,
- prior contribution,
- age band,
- seasonal tradition.

### 19.4 Cultural consistency

Ceremony content must be data-driven and locally authored.

Runtime must not invent cultural rules from generic assumptions.

---

## 20. Public Works and Building Events

### 20.1 Public works examples

- road repair,
- bridge repair,
- irrigation maintenance,
- school improvement,
- public garden work,
- cleanup day,
- community construction.

### 20.2 Work package model

Large events should divide work into packages with:

- package identity,
- location,
- required profession,
- required tools,
- required materials,
- participant limit,
- dependencies,
- completion criteria,
- safety rules.

### 20.3 Contribution credit

Contribution credit must be based on verified work, not only check-in.

### 20.4 Material authority

Materials consumed by the event must pass through inventory or construction authority.

---

## 21. Emergency Events

### 21.1 Emergency priority

Emergency events may override:

- optional events,
- ordinary schedules,
- non-critical profession duties,
- normal invitation deadlines.

### 21.2 Emergency summons

Emergency summons must target only actors whose role, skill, location, and condition make participation plausible.

### 21.3 Civilian behavior

Non-responder actors may receive:

- evacuation instruction,
- shelter assignment,
- avoidance zones,
- household reunification tasks.

### 21.4 Emergency completion

Completion requires:

- responder accountability,
- civilian accountability where applicable,
- unresolved incident records,
- released danger zones,
- recovery handoff.

---

## 22. Event Roles and Duties

### 22.1 Standard roles

- host,
- organizer,
- coordinator,
- attendee,
- volunteer,
- vendor,
- instructor,
- performer,
- judge,
- guard,
- medic,
- builder,
- cleaner,
- registrar,
- messenger,
- photographer or recorder where world policy permits.

### 22.2 Duty lifecycle

```text
OFFERED
ACCEPTED
READY
IN_PROGRESS
COMPLETED
FAILED
RELEASED
REASSIGNED
```

### 22.3 Duty requirements

A duty definition must specify:

- role code,
- start and end window,
- location,
- prerequisites,
- required equipment,
- required contribution evidence,
- replacement policy,
- consequence policy.

### 22.4 Reassignment

Reassignment requires:

- release or failure of the prior assignment,
- new actor eligibility,
- schedule availability,
- responsibility handoff evidence.

---

## 23. Arrival, Check-In, and Presence

### 23.1 Attendance states

```text
NOT_EXPECTED
EXPECTED
EN_ROUTE
ARRIVED
CHECKED_IN
PRESENT
TEMPORARILY_AWAY
LEFT_EARLY
CHECKED_OUT
NO_SHOW
EXCUSED
```

### 23.2 Arrival evidence

Arrival may require:

- actor within authorized arrival zone,
- event in a check-in-compatible state,
- valid participant record,
- current eligibility,
- guardian presence where required.

### 23.3 Presence heartbeats

For long events, presence may be sampled through deterministic event-zone checks.

Presence heartbeats are evidence, not actor identity authority.

### 23.4 Temporary absence

Participants may temporarily leave when policy allows.

The system must distinguish:

- restroom or short break,
- assigned external duty,
- temporary household need,
- abandonment,
- early departure.

### 23.5 No-show determination

No-show must occur only after:

- arrival grace period ends,
- actor is not checked in,
- no accepted excuse exists,
- event is active,
- evidence collection is complete enough for the policy.

---

## 24. Event Interaction Integration

All event interactions remain governed by 15G Interaction Rules.

The event system adds context such as:

- event membership,
- event role,
- event location permission,
- event inventory access,
- event target reservation,
- event-specific cooldown,
- event duty requirement.

### 24.1 Event context cannot bypass interaction authority

Being an organizer does not permit arbitrary mutation of world objects.

### 24.2 Shared targets

Stages, stalls, workstations, registration desks, and competition stations must use reservations or queues where contested.

### 24.3 Interaction evidence

Important event interactions should emit evidence references usable by contribution and completion systems.

---

## 25. Resource and Inventory Coordination

### 25.1 Resource classes

- venue resources,
- tools,
- consumables,
- decorations,
- educational materials,
- merchant stock,
- safety equipment,
- food,
- construction materials,
- prizes.

### 25.2 Reservation

Event resource reservation must include:

- owner,
- quantity,
- reservation window,
- purpose,
- return requirement,
- consumption permission.

### 25.3 Check-out and return

Reusable assets must be checked out and returned with condition evidence where applicable.

### 25.4 Shortage handling

A shortage may:

- reduce capacity,
- disable an activity block,
- trigger substitution,
- delay activation,
- cancel the event,
- continue with degraded mode.

The chosen outcome must be explicit.

---

## 26. Contribution Tracking

### 26.1 Contribution types

- attendance,
- duty completion,
- donated goods,
- donated funds,
- teaching,
- mentoring,
- building work,
- cleanup work,
- performance,
- judging,
- merchant service,
- emergency response,
- organization.

### 26.2 Evidence requirements

Contribution evidence may include:

- completed interaction IDs,
- duty completion IDs,
- inventory transfer IDs,
- economy transaction IDs,
- assessment records,
- organizer verification,
- system-observed duration.

### 26.3 Duplicate protection

The same underlying action must not generate duplicate contribution credit.

### 26.4 Quality bands

Where needed:

- `UNVERIFIED`
- `PARTIAL`
- `ACCEPTABLE`
- `STRONG`
- `EXCEPTIONAL`

Quality must be based on explicit policy rather than hidden subjective scoring.

---

## 27. Reputation and Relationship Effects

### 27.1 Reputation inputs

Events may request reputation effects for:

- reliable attendance,
- completed duty,
- leadership,
- generosity,
- fairness,
- professional service,
- no-show after commitment,
- abandonment,
- misconduct,
- restitution,
- emergency assistance.

### 27.2 Bounded effects

A single ordinary event must not dominate long-term reputation.

Effect magnitude must be bounded by:

- event significance,
- role responsibility,
- evidence strength,
- repetition limits,
- existing recovery policy.

### 27.3 Relationship effects

Shared participation may produce relationship evidence, but relationship changes remain owned by the relationship system.

### 27.4 Rumor integration

Public event outcomes may become rumor inputs only after:

- event evidence is finalized,
- visibility is checked,
- private details are removed,
- witness scope is determined.

---

## 28. Rewards and Consequences

### 28.1 Reward classes

- currency,
- goods,
- profession credit,
- education evidence,
- reputation request,
- relationship evidence,
- access unlock,
- badge or title,
- future invitation priority.

### 28.2 Reward eligibility

Rewards may depend on:

- attendance duration,
- duty completion,
- contribution quantity,
- quality band,
- role,
- event completion,
- no unresolved misconduct.

### 28.3 Consequence classes

- forfeited reward,
- reduced future priority,
- reliability evidence,
- duty review,
- repayment obligation,
- temporary suspension from sensitive roles.

### 28.4 No arbitrary punishment

Consequences must be:

- policy-based,
- evidence-based,
- proportionate,
- visible to the affected actor,
- recoverable where appropriate.

---

## 29. Incident Management

### 29.1 Incident types

- participant conflict,
- safety risk,
- missing child,
- medical issue,
- damaged property,
- missing inventory,
- payment dispute,
- overcrowding,
- role abandonment,
- weather disruption,
- infrastructure failure.

### 29.2 Incident lifecycle

```text
REPORTED
ACKNOWLEDGED
CONTAINING
RESOLVED
ESCALATED
CLOSED
```

### 29.3 Incident authority

Incidents may be handled by:

- organizer,
- designated safety role,
- settlement authority,
- school authority,
- merchant authority,
- emergency authority.

### 29.4 Event impact

An incident may:

- pause one activity,
- close one zone,
- remove one participant,
- reduce capacity,
- trigger evacuation,
- fail the event.

---

## 30. Cancellation, Postponement, and Evacuation

### 30.1 Cancellation reasons

- host unavailable,
- location unavailable,
- insufficient required roles,
- insufficient resources,
- weather risk,
- safety risk,
- duplicate event,
- authority revocation,
- world-state incompatibility.

### 30.2 Cancellation effects

The system must:

- close registration,
- release capacity,
- release schedules,
- release resources,
- notify participants,
- refund eligible payments,
- preserve evidence,
- record reason and authority.

### 30.3 Postponement

Postponement creates a schedule revision, not a silent timestamp edit.

Participants must be able to:

- confirm again,
- decline without unfair penalty,
- retain priority where policy allows.

### 30.4 Evacuation

Evacuation overrides normal closing.

The system must prioritize:

- safety instructions,
- dependent accountability,
- responder roles,
- exit-zone tracking,
- unresolved-person records.

---

## 31. Completion and Outcome Finalization

### 31.1 Completion preconditions

An event may complete when:

- event is in `CLOSING`,
- required duties are resolved,
- participants are checked out or accounted for,
- resource returns are resolved or recorded as incidents,
- economy settlements are requested,
- contribution records are finalized,
- outcome summary is generated.

### 31.2 Essential-purpose completion

Each event definition must declare essential outcomes.

Examples:

- market operated for minimum duration,
- school assessment completed,
- public work package accepted,
- ceremony performed,
- emergency population accounted for.

### 31.3 Partial completion

An event may complete with partial success when policy allows.

Partial completion must not be reported as full success.

### 31.4 Finalization idempotency

Outcome application must be idempotent.

Replaying completion after a crash must not duplicate rewards, penalties, reputation effects, payments, or education evidence.

---

## 32. Runtime State Model

Recommended runtime aggregates:

- `EventInstanceAggregate`
- `EventRegistrationAggregate`
- `EventAttendanceAggregate`
- `EventRoleAggregate`
- `EventResourceAggregate`
- `EventOutcomeAggregate`

### 32.1 Event instance state

The runtime should track:

- lifecycle state,
- version,
- active time window,
- active zones,
- capacity summary,
- required-role coverage,
- incident severity,
- closing readiness.

### 32.2 Participant runtime state

The runtime should track:

- commitment,
- reservation,
- attendance,
- assigned roles,
- current duty,
- presence zone,
- contribution progress,
- unresolved incident links.

### 32.3 Deterministic ordering

Simultaneous event commands should use:

- event version,
- command timestamp,
- authority priority,
- stable command ID,
- actor ID tie-breaker where needed.

---

## 33. Command Contracts

Recommended commands include:

- `CreateEventDraft`
- `ProposeEvent`
- `ApproveEvent`
- `RejectEvent`
- `AnnounceEvent`
- `OpenRegistration`
- `InviteParticipant`
- `RespondToInvitation`
- `RegisterParticipant`
- `WithdrawParticipant`
- `PromoteWaitlistedParticipant`
- `AssignEventRole`
- `AcceptEventRole`
- `ReleaseEventRole`
- `StartEventPreparation`
- `ActivateEvent`
- `CheckInParticipant`
- `RecordPresence`
- `RecordContribution`
- `ReportEventIncident`
- `ResolveEventIncident`
- `BeginEventClosing`
- `CheckOutParticipant`
- `CompleteEvent`
- `CancelEvent`
- `PostponeEvent`
- `EvacuateEvent`

Every command should include:

- tenant or world identity,
- event identity,
- actor identity,
- authority context,
- expected version,
- command ID,
- correlation ID,
- timestamp.

---

## 34. Query Contracts

Recommended queries include:

- `ListDiscoverableEvents`
- `GetEventDetails`
- `GetActorEventEligibility`
- `GetActorInvitations`
- `GetActorCommitments`
- `GetHouseholdEventPlan`
- `GetEventCapacity`
- `GetEventWaitlist`
- `GetEventRoleCoverage`
- `GetEventAttendanceSummary`
- `GetEventContributionSummary`
- `GetEventIncidentSummary`
- `GetEventOutcome`

Queries must not mutate event state.

---

## 35. Persistence Model

### 35.1 Durable records

Persist at minimum:

- event definitions,
- event instances,
- lifecycle transitions,
- invitations,
- eligibility decisions,
- registrations,
- capacity reservations,
- role assignments,
- attendance transitions,
- contributions,
- incidents,
- outcomes,
- external effect requests,
- idempotency keys.

### 35.2 Optimistic concurrency

Mutating event commands must validate expected version.

### 35.3 Transaction boundaries

Operations that must be atomic should include:

- registration plus capacity reservation,
- withdrawal plus reservation release,
- role assignment plus coverage update,
- completion plus outcome creation,
- cancellation plus lifecycle closure requests.

### 35.4 Outbox pattern

Cross-system effects should be emitted through a durable outbox or equivalent mechanism.

Examples:

- schedule reservation requests,
- economy settlements,
- reputation effects,
- educational evidence,
- notifications.

---

## 36. Save, Load, and Recovery

### 36.1 Save requirements

A save must preserve:

- current event lifecycle,
- registration state,
- attendance state,
- active duties,
- resource reservations,
- contribution progress,
- unresolved incidents,
- applied-effect markers.

### 36.2 Load requirements

On load:

- restore the event aggregate,
- re-establish active timers from authoritative timestamps,
- reconcile expired holds,
- reconcile participants whose actors are unavailable,
- restore queues and reservations,
- avoid replaying completed external effects.

### 36.3 Offline time passage

If time advanced while the world was unloaded:

- registration may close,
- invitations may expire,
- events may become missed,
- active events may need deterministic catch-up,
- long-past events may finalize through a defined offline policy.

The system must not pretend all actors attended simply because simulation was unloaded.

### 36.4 Crash during completion

Recovery must inspect idempotency markers and resume only unapplied effects.

---

## 37. Telemetry and Observability

Recommended telemetry:

- events created by category,
- approval rejection reasons,
- invitation delivery rate,
- acceptance rate,
- eligibility rejection reasons,
- waitlist size,
- no-show rate,
- role coverage failures,
- late arrival rate,
- incident rate,
- cancellation rate,
- postponement rate,
- completion rate,
- partial completion rate,
- reward application failures,
- persistence recovery count.

### 37.1 Privacy

Telemetry must not expose protected learner data, private household data, or sensitive reputation details beyond authorized diagnostic scope.

### 37.2 Debug evidence

A debug event trace should correlate:

- event ID,
- participant ID,
- command ID,
- transition,
- prior version,
- resulting version,
- external effect status.

---

## 38. Validation Matrix

### 38.1 Lifecycle validation

Verify:

- illegal transitions are rejected,
- terminal events cannot reopen silently,
- cancellation preserves records,
- postponement requires schedule revision,
- completion is idempotent.

### 38.2 Eligibility validation

Verify:

- age restrictions,
- guardian requirements,
- profession requirements,
- reputation thresholds,
- school membership,
- schedule constraints,
- suspended participants.

### 38.3 Capacity validation

Verify:

- hard capacity cannot be exceeded,
- waitlist order is deterministic,
- expired holds release capacity,
- withdrawal promotes the next eligible actor,
- duplicate registration is blocked.

### 38.4 Schedule validation

Verify:

- travel time is included,
- mandatory events override correctly,
- optional commitments do not overwrite critical duties,
- cancellation restores displaced activities where feasible,
- two remote events cannot be attended impossibly.

### 38.5 Attendance validation

Verify:

- check-in requires valid event state,
- required guardian is present,
- no-show uses grace policy,
- temporary absence is distinguished from departure,
- check-out does not erase contribution.

### 38.6 Role validation

Verify:

- only eligible actors accept roles,
- required coverage is enforced,
- reassignment is auditable,
- duty completion requires evidence,
- abandoned roles create the correct outcome.

### 38.7 Reward validation

Verify:

- no reward before evidence,
- no duplicate reward after replay,
- partial completion receives bounded rewards,
- penalties are policy-based,
- external systems retain authority.

### 38.8 Recovery validation

Verify:

- save during registration,
- save during preparation,
- save during active attendance,
- save during incident handling,
- crash during completion,
- offline passage beyond event end.

---

## 39. Scenario Catalogue

Production validation must include at least the following scenarios.

### Scenario 1 — Open public festival

A public festival is announced, fills gradually, activates, completes, and applies bounded community outcomes.

### Scenario 2 — Capacity-limited workshop

Eligible actors register until full; additional actors enter a deterministic waitlist.

### Scenario 3 — Waitlist promotion

A confirmed participant withdraws; the next eligible actor receives a timed capacity hold.

### Scenario 4 — Child with guardian

A child registers with a guardian; guardian withdrawal triggers re-evaluation and replacement search.

### Scenario 5 — Profession duty conflict

A merchant is invited to a festival but has required shop coverage; schedule policy resolves the conflict.

### Scenario 6 — School event

Learners attend an assessment session; attendance evidence is passed to education without granting mastery directly.

### Scenario 7 — Market event

Vendors reserve stalls, bring inventory, transact through merchant authority, and complete cleanup.

### Scenario 8 — Public works event

Actors contribute to work packages; only verified work receives contribution credit.

### Scenario 9 — Reputation-sensitive role

A trusted actor qualifies as event treasurer; an ineligible actor may still attend but cannot hold the sensitive role.

### Scenario 10 — No-show

An actor accepts a required duty and fails to arrive without excuse; evidence-based consequences are requested.

### Scenario 11 — Voluntary decline

An actor declines an optional invitation without penalty.

### Scenario 12 — Postponement

Weather postpones the event; commitments require reconfirmation and schedule reservations are revised.

### Scenario 13 — Cancellation

Resource shortage cancels the event; capacity, schedules, and resources are released.

### Scenario 14 — Emergency evacuation

An active festival enters evacuation; guardians and dependents are accounted for before closure.

### Scenario 15 — Crash during completion

The game crashes after payment effects but before reputation effects; recovery resumes only unapplied effects.

### Scenario 16 — Offline missed event

The world loads after an event ended; no false attendance is generated.

### Scenario 17 — Duplicate command

The same registration command is replayed; one participant and one reservation remain.

### Scenario 18 — Overcapacity race

Two actors request the final place simultaneously; optimistic concurrency admits exactly one.

### Scenario 19 — Role reassignment

An instructor becomes unavailable; a qualified backup takes over with preserved handoff evidence.

### Scenario 20 — Partial success

A festival completes despite one cancelled activity block; the outcome records partial success accurately.

---

## 40. Failure Codes

Recommended failure codes:

- `EVENT_NOT_FOUND`
- `EVENT_DEFINITION_DISABLED`
- `EVENT_INVALID_STATE`
- `EVENT_VERSION_CONFLICT`
- `EVENT_DUPLICATE_INSTANCE`
- `EVENT_NOT_DISCOVERABLE`
- `EVENT_REGISTRATION_NOT_OPEN`
- `EVENT_REGISTRATION_CLOSED`
- `EVENT_PARTICIPANT_INELIGIBLE`
- `EVENT_GUARDIAN_REQUIRED`
- `EVENT_CAPACITY_FULL`
- `EVENT_ALREADY_REGISTERED`
- `EVENT_NOT_REGISTERED`
- `EVENT_INVITATION_EXPIRED`
- `EVENT_INVITATION_REVOKED`
- `EVENT_SCHEDULE_CONFLICT`
- `EVENT_TRAVEL_INFEASIBLE`
- `EVENT_ROLE_NOT_AVAILABLE`
- `EVENT_ROLE_REQUIREMENTS_NOT_MET`
- `EVENT_REQUIRED_COVERAGE_MISSING`
- `EVENT_CHECKIN_TOO_EARLY`
- `EVENT_CHECKIN_TOO_LATE`
- `EVENT_PARTICIPANT_NOT_PRESENT`
- `EVENT_CONTRIBUTION_DUPLICATE`
- `EVENT_RESOURCE_UNAVAILABLE`
- `EVENT_INCIDENT_UNRESOLVED`
- `EVENT_COMPLETION_NOT_READY`
- `EVENT_ALREADY_COMPLETED`
- `EVENT_CANCELLED`
- `EVENT_POSTPONED`
- `EVENT_EVACUATING`
- `EVENT_EXTERNAL_EFFECT_PENDING`

Failure responses must be stable, machine-readable, and projectable to clear Thai UI messages.

---

## 41. Security, Safety, and Abuse Prevention

The event system must prevent:

- unauthorized event creation,
- forged invitations,
- capacity bypass,
- duplicate reward claims,
- unauthorized child participation,
- private-event disclosure,
- merchant inventory bypass,
- reputation manipulation through event spam,
- forced attendance without authority,
- hiding incidents by deleting events,
- organizer self-verification where separation is required.

### 41.1 Rate and repetition controls

Repeated low-value events must not become an infinite reputation or reward farm.

### 41.2 Sensitive roles

Financial, child-safety, medical, and authority roles require explicit eligibility and audit evidence.

---

## 42. UI Projection Requirements

The UI should make visible:

- event title,
- event category,
- date and time,
- location,
- registration state,
- eligibility status,
- capacity state,
- role assignment,
- guardian requirement,
- schedule conflicts,
- attendance state,
- contribution progress,
- cancellation or postponement reason.

### 42.1 One primary action

Each event screen should expose one clear primary action based on state, such as:

- Register
- Accept invitation
- Join waitlist
- Check in
- Start duty
- Complete duty
- Check out

### 42.2 No false certainty

The UI must not show “Joined” before authoritative registration succeeds.

### 42.3 Accessible explanation

Eligibility failure should present a useful reason without exposing private data belonging to other actors.

---

## 43. Integration Contracts

### 43.1 Population system

Consumes actor identity, household, settlement, age band, and active status.

### 43.2 Schedule system

Receives reservation, conflict, displacement, and restoration requests.

### 43.3 NPC role system

Provides authority and role context.

### 43.4 Profession system

Provides profession eligibility, required coverage, and duty outcomes.

### 43.5 Merchant economy

Handles stalls, inventory, payments, refunds, and settlement.

### 43.6 Conversation system

Projects event knowledge, invitations, reminders, and outcomes.

### 43.7 Interaction system

Executes event-context actions and produces evidence.

### 43.8 Reputation system

Evaluates reputation eligibility and applies requested outcome effects.

### 43.9 Education system

Consumes learning participation evidence and assessment evidence.

### 43.10 Notification system

Delivers invitations, reminders, changes, cancellations, and outcome notices.

---

## 44. Production Invariants

The following invariants are mandatory.

1. Every participant references one existing event instance.
2. Every attendance record references one participant.
3. Hard capacity is never exceeded.
4. One actor cannot hold duplicate active registration for the same event.
5. Mandatory child guardian rules cannot be bypassed.
6. Event schedule changes are explicit revisions.
7. Attendance is not inferred from rendering alone.
8. Contribution credit requires evidence.
9. Rewards are applied at most once.
10. Reputation effects are requested at most once.
11. Cancellation preserves history.
12. Completion does not erase incidents.
13. Merchant transactions remain under economy authority.
14. Learning mastery remains under education authority.
15. Save/load preserves commitments and completed effects.
16. Impossible travel schedules are rejected.
17. Event roles require explicit assignment.
18. Reassignment preserves audit history.
19. External effect failures remain recoverable.
20. Population validation can trace every event outcome to evidence.

---

## 45. Production Exit Criteria

15I is production-ready only when all of the following are satisfied.

### Contract

- event entities are defined,
- lifecycle states are defined,
- transition policy is defined,
- command and query boundaries are defined,
- failure codes are stable.

### Runtime

- registration is authoritative,
- capacity is concurrency-safe,
- schedule integration is deterministic,
- attendance is evidence-based,
- role duties are trackable,
- completion is idempotent.

### Integration

- population integration is explicit,
- schedule integration is explicit,
- profession integration is explicit,
- merchant integration is explicit,
- conversation integration is explicit,
- interaction integration is explicit,
- reputation integration is explicit,
- education integration is explicit.

### Recovery

- active events survive save/load,
- expired holds reconcile,
- offline passage is deterministic,
- completion replay does not duplicate effects,
- unresolved incidents survive recovery.

### Validation

- scenario catalogue passes,
- invariants are checked,
- overcapacity races are tested,
- schedule conflicts are tested,
- guardian rules are tested,
- cancellation and postponement are tested,
- recovery tests pass.

---

## 46. Handoff to 15J — Population Validation

15J must validate the complete NPC and population system using event participation as a high-density integration surface.

The handoff evidence should allow 15J to verify:

- population counts remain stable,
- actors maintain one coherent identity,
- schedules remain feasible,
- roles remain valid,
- professions retain coverage,
- merchants operate through economy authority,
- conversations expose only authorized knowledge,
- interactions preserve world-state authority,
- reputation effects are bounded and traceable,
- events coordinate many actors without duplication or impossible states,
- save/load preserves the complete population runtime.

Required 15J evidence inputs:

- event lifecycle traces,
- registration and capacity traces,
- schedule-conflict traces,
- attendance traces,
- role-coverage traces,
- contribution traces,
- reputation-effect requests,
- economy-effect requests,
- education-effect requests,
- incident traces,
- recovery traces,
- final event outcomes.

---

## 47. Final Authority Statement

Builder's Valley events are temporary but authoritative social operating contexts.

They must coordinate people, work, learning, trade, families, schedules, places, resources, and consequences without weakening the authority of the systems they integrate.

A production event is complete only when:

- its existence was authorized,
- its participants were eligible,
- its capacity remained valid,
- its schedules remained feasible,
- its roles were explicit,
- its attendance was evidenced,
- its contributions were verified,
- its incidents were preserved,
- its outcomes were finalized once,
- its effects were delegated to the correct authorities,
- its history can be recovered and validated.

> Event participation is the point where Builder's Valley proves that its population is not a set of isolated NPCs, but a coherent community capable of coordinating shared purpose over time.
