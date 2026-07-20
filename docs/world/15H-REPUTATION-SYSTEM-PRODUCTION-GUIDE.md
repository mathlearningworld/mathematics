# 15H — Reputation System Production Guide

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 15 — NPC & Population System  
**Guide:** 15H — Reputation System  
**Status:** Production Ready  
**Authority Level:** World Foundation Contract  
**Upstream Dependencies:** 15A, 15B, 15C, 15D, 15E, 15F, 15G  
**Downstream Handoff:** 15I — Event Participation

---

## 1. Purpose

This guide defines the authoritative reputation model for Builder's Valley.

The reputation system gives the world persistent social memory.

It governs how actions become remembered, how memories become judgments, how judgments affect future interactions, and how trust may be earned, damaged, repaired, transferred, or forgotten.

The system must preserve the principle:

> Reputation is not a decorative score. It is an auditable projection of remembered conduct that changes future world behavior.

The reputation system must ensure that:

- the same action produces deterministic reputation evidence,
- reputation effects are contextual rather than universal,
- actors do not know events they could not reasonably observe or hear about,
- rumors are distinguishable from witnessed facts,
- positive and negative memories may decay at different rates,
- serious misconduct cannot be erased by trivial positive actions,
- restoration requires proportionate conduct,
- reputation affects interactions without replacing explicit permissions,
- save/load restores all reputation state deterministically,
- all visible reputation consequences can be traced to authoritative evidence.

---

## 2. Scope

This guide covers:

- reputation authority,
- reputation subjects and observers,
- personal reputation,
- household and family reputation,
- neighborhood reputation,
- village reputation,
- profession reputation,
- merchant trust,
- school and learning reputation,
- civic reputation,
- safety and misconduct reputation,
- relationship-specific trust,
- witnessed events,
- reported events,
- rumors,
- evidence confidence,
- reputation dimensions,
- scores and bands,
- thresholds,
- modifiers,
- propagation,
- locality,
- memory formation,
- memory consolidation,
- decay,
- forgiveness,
- restitution,
- rehabilitation,
- contradiction resolution,
- identity and household association,
- NPC behavior integration,
- merchant integration,
- profession integration,
- conversation integration,
- interaction integration,
- event participation handoff,
- persistence,
- save/load,
- telemetry,
- validation,
- production exit criteria.

This guide does not define:

- event participation policy,
- population-wide final validation,
- combat faction systems,
- political elections,
- unrestricted social simulation,
- real-world moral scoring,
- hidden monetization effects.

Those concerns belong to later guides or separate systems.

---

## 3. Reputation Doctrine

### 3.1 Evidence before score

No reputation value may change without an authoritative reputation event.

### 3.2 Context before generalization

An actor may be trusted as a carpenter and distrusted as a merchant.

A single universal score is insufficient.

### 3.3 Knowledge before judgment

An observer may only update reputation from:

- direct observation,
- trusted testimony,
- institutionally recorded evidence,
- rumor accepted with explicit confidence.

### 3.4 Memory before projection

Visible labels, dialogue variants, discounts, refusals, invitations, and social reactions are projections of stored reputation state.

### 3.5 Proportionality before convenience

Minor positive actions must not erase severe negative conduct.

### 3.6 Repair before reset

Reputation recovery requires time, restitution, repeated evidence, or formal forgiveness where appropriate.

### 3.7 Locality before omniscience

Knowledge spreads through social and institutional paths.

The entire village must not instantly know every action.

### 3.8 Determinism before drama

Narrative presentation may vary, but reputation mutation must remain deterministic and testable.

### 3.9 Children are protected actors

Learning mistakes, failed attempts, and age-appropriate experimentation must not create punitive social reputation.

### 3.10 Reputation must never become a coercive real-world judgment system

The system applies only to fictional world behavior inside Builder's Valley.

---

## 4. Reputation Authority

The authoritative reputation system consists of:

1. reputation event ledger,
2. subject reputation profiles,
3. observer knowledge records,
4. relationship trust records,
5. propagation records,
6. decay schedules,
7. restitution and forgiveness records,
8. reputation projections.

UI labels, icons, dialogue text, color treatments, merchant prices, NPC animation, and event invitations are not authority.

The authority chain is:

```text
World Action
    ↓
Reputation Event
    ↓
Observer Knowledge
    ↓
Memory Record
    ↓
Dimension Update
    ↓
Threshold Evaluation
    ↓
Behavior Projection
```

No projection may bypass this chain.

---

## 5. Core Identity Model

Every reputation record must identify:

- `subjectType`,
- `subjectId`,
- `observerType`,
- `observerId`,
- `contextType`,
- `contextId`,
- `dimension`,
- `sourceEventId`,
- `knowledgeType`,
- `confidence`,
- `effectiveWeight`,
- `occurredAt`,
- `learnedAt`,
- `expiresAt` where applicable,
- `version`.

Supported subject types include:

- PLAYER,
- NPC,
- HOUSEHOLD,
- FAMILY,
- BUSINESS,
- PROFESSION_GROUP,
- SCHOOL_GROUP,
- CIVIC_GROUP.

Supported observer types include:

- NPC,
- HOUSEHOLD,
- BUSINESS,
- PROFESSION_GROUP,
- SCHOOL_GROUP,
- VILLAGE_AUTHORITY,
- SYSTEM_INSTITUTION.

---

## 6. Reputation Contexts

Reputation must be scoped.

Required contexts include:

- PERSONAL,
- RELATIONSHIP,
- HOUSEHOLD,
- NEIGHBORHOOD,
- VILLAGE,
- PROFESSION,
- MERCHANT,
- SCHOOL,
- CIVIC,
- SAFETY,
- PROPERTY,
- COOPERATION,
- LEARNING_SUPPORT.

A reputation profile may contain multiple independent dimensions across multiple contexts.

Example:

```text
Subject: Player A
Observer: Merchant B
MERCHANT / PAYMENT_RELIABILITY = HIGH
MERCHANT / FAIR_DEALING = MEDIUM
PERSONAL / KINDNESS = HIGH
PROPERTY / RESPECT = LOW
```

---

## 7. Reputation Dimensions

The minimum production dimensions are:

### 7.1 Reliability

Measures whether the subject completes accepted responsibilities.

Evidence includes:

- finishing agreed work,
- arriving when expected,
- returning borrowed items,
- keeping promises,
- abandoning commitments.

### 7.2 Honesty

Measures truthfulness and transaction integrity.

Evidence includes:

- truthful reporting,
- accurate counting,
- honest trade,
- concealment,
- false claims,
- manipulation.

### 7.3 Helpfulness

Measures constructive assistance.

Evidence includes:

- helping with work,
- teaching,
- rescuing a blocked activity,
- sharing needed resources,
- refusing reasonable assistance without cause.

### 7.4 Respect

Measures treatment of people, property, rules, and boundaries.

Evidence includes:

- asking permission,
- respecting queues,
- returning tools,
- damaging property,
- interrupting repeatedly,
- ignoring explicit boundaries.

### 7.5 Skill Confidence

Measures observed competence in a profession or task domain.

Evidence includes:

- successful work,
- quality output,
- safe tool use,
- verified mastery,
- repeated avoidable mistakes.

Skill confidence must not punish ordinary learning attempts.

### 7.6 Fair Dealing

Measures transaction fairness.

Evidence includes:

- paying agreed prices,
- accurate change,
- transparent offers,
- exploitative behavior,
- broken trade commitments.

### 7.7 Safety

Measures safe conduct around people, tools, buildings, and resources.

Evidence includes:

- following safety procedures,
- reporting hazards,
- preventing harm,
- reckless tool use,
- creating hazards,
- repeated unsafe conduct.

### 7.8 Stewardship

Measures care for shared spaces and resources.

Evidence includes:

- maintaining public areas,
- cleaning work zones,
- conserving shared resources,
- littering,
- waste,
- destructive harvesting.

### 7.9 Learning Support

Measures support for teaching and learning.

Evidence includes:

- patient mentoring,
- explaining methods,
- encouraging effort,
- humiliating learners,
- blocking access to learning,
- giving misleading guidance.

### 7.10 Civic Contribution

Measures contribution to community readiness and shared goals.

Evidence includes:

- event support,
- public work,
- emergency assistance,
- community preparation,
- repeated non-cooperation after commitment.

---

## 8. Score Model

Each dimension uses an internal normalized score:

```text
-1000 to +1000
```

The score is authoritative but should not normally be shown directly to players.

Recommended bands:

| Score | Band | Meaning |
|---:|---|---|
| -1000 to -701 | SEVERE_DISTRUST | Strong active distrust |
| -700 to -401 | DISTRUSTED | Significant negative expectation |
| -400 to -151 | WARY | Caution and verification required |
| -150 to +150 | UNKNOWN_OR_NEUTRAL | Insufficient or balanced evidence |
| +151 to +400 | FAMILIAR | Mild positive expectation |
| +401 to +700 | TRUSTED | Strong positive expectation |
| +701 to +1000 | DEEPLY_TRUSTED | Exceptional proven trust |

Band boundaries must be configurable by context but versioned.

---

## 9. Reputation Event Contract

Every reputation-changing event must include:

```text
ReputationEvent {
  eventId
  eventType
  sourceActionId
  subjectType
  subjectId
  initiatorType
  initiatorId
  targetType?
  targetId?
  worldLocationId
  contextType
  contextId?
  dimensionImpacts[]
  severity
  intentClassification?
  outcomeClassification
  occurredAt
  evidenceRefs[]
  witnessRefs[]
  institutionalRecordRefs[]
  version
}
```

Each dimension impact must include:

```text
DimensionImpact {
  dimension
  baseDelta
  maxPropagationDepth
  decayPolicyId
  repairPolicyId?
}
```

---

## 10. Event Severity

Required severity classes:

- TRIVIAL,
- MINOR,
- MODERATE,
- MAJOR,
- SEVERE,
- CRITICAL.

Severity affects:

- score delta,
- memory duration,
- propagation probability,
- required confidence,
- decay speed,
- repair burden,
- institutional escalation.

A trivial event must never create severe distrust.

A critical event must never be erased by routine low-impact actions.

---

## 11. Outcome Classification

Required outcomes include:

- SUCCESS,
- PARTIAL_SUCCESS,
- GOOD_FAITH_FAILURE,
- NEGLIGENCE,
- INTENTIONAL_MISCONDUCT,
- ACCIDENT,
- PREVENTED_HARM,
- REPAIRED_HARM,
- UNRESOLVED.

Good-faith learning failure must not be classified as misconduct.

Intent classification may influence weight only when supported by authoritative evidence.

---

## 12. Knowledge Types

Required knowledge types:

### 12.1 DIRECT_WITNESS

The observer perceived the event directly.

Default confidence: very high.

### 12.2 PARTICIPANT

The observer participated in the event.

Default confidence: highest.

### 12.3 INSTITUTIONAL_RECORD

The event was recorded by an authorized institution.

Default confidence: high, subject to record validity.

### 12.4 TRUSTED_REPORT

The observer learned from a trusted source.

Default confidence: medium to high.

### 12.5 ORDINARY_REPORT

The observer learned from a normal social source.

Default confidence: medium.

### 12.6 RUMOR

The observer learned through uncertain propagation.

Default confidence: low.

### 12.7 CORRECTED_REPORT

Earlier knowledge was explicitly corrected.

This may reduce or reverse prior impact.

---

## 13. Observer Knowledge Record

Each observer stores a knowledge record rather than directly copying global truth.

```text
ObserverKnowledge {
  knowledgeId
  observerType
  observerId
  sourceEventId
  knowledgeType
  sourceObserverId?
  confidence
  distortion
  learnedAt
  lastReinforcedAt?
  contradictedBy[]
  state
  version
}
```

Knowledge states:

- ACTIVE,
- DOUBTED,
- CORRECTED,
- DISPROVEN,
- FORGOTTEN,
- ARCHIVED.

---

## 14. Witness Eligibility

An NPC may become a direct witness only when:

- present in the relevant location,
- awake and active,
- capable of perception,
- line-of-sight or equivalent sensory rule passes,
- not fully occupied by a blocking interaction,
- event visibility permits observation.

Witness registration must occur during the authoritative world action.

Witnesses must not be inferred afterward from proximity alone.

---

## 15. Institutional Knowledge

Institutions may know events through formal records.

Examples:

- merchant transaction ledger,
- school progress record,
- workshop completion record,
- property access log,
- civic contribution record,
- safety incident record.

Institutional records must specify:

- recording authority,
- retention policy,
- access policy,
- correction procedure,
- confidence level.

---

## 16. Relationship Reputation

Relationship reputation is observer-specific.

It answers:

- Does this NPC trust this subject?
- Does this merchant expect payment?
- Does this teacher believe the subject will practice?
- Does this neighbor expect respectful conduct?

Relationship reputation must be stored separately from village reputation.

Strong personal trust may coexist with weak village reputation, and vice versa.

---

## 17. Personal Reputation

Personal reputation is the aggregated view held by one observer about one subject.

It must include:

- dimension scores,
- confidence per dimension,
- evidence count,
- unresolved contradictions,
- last meaningful evidence time,
- current bands,
- active modifiers.

NPC decision logic should consume bands and confidence, not raw event lists alone.

---

## 18. Household and Family Reputation

Household reputation represents shared expectations about a household or family unit.

Rules:

- household reputation must not automatically overwrite individual reputation,
- individual actions may influence household reputation only through explicit propagation policy,
- children must not inherit punitive reputation from adults,
- household positive contribution may create familiarity but not guaranteed individual trust,
- household membership changes must be versioned.

---

## 19. Neighborhood Reputation

Neighborhood reputation is local and spatial.

It may affect:

- greetings,
- willingness to lend ordinary tools,
- informal help,
- local warnings,
- invitations to small activities,
- observation and rumor spread.

Neighborhood boundaries must come from world geography, not arbitrary distance alone.

---

## 20. Village Reputation

Village reputation represents broad community expectation.

It must be derived from:

- multiple independent memories,
- institutional records,
- meaningful propagation,
- sufficient confidence.

Village reputation must not update instantly from a private interaction.

Required safeguards:

- minimum observer diversity,
- maximum contribution per event,
- confidence weighting,
- anti-duplication,
- rumor caps,
- correction support.

---

## 21. Profession Reputation

Profession reputation is scoped to a profession.

Examples:

- carpenter reliability,
- merchant fairness,
- builder safety,
- teacher helpfulness,
- farmer stewardship.

Profession reputation may affect:

- job offers,
- task difficulty,
- supervision level,
- access to advanced work,
- mentorship opportunities,
- workshop trust,
- professional dialogue.

Profession reputation must not be used as a universal moral score.

---

## 22. Merchant Trust

Merchant trust must be distinct from general friendliness.

Required dimensions:

- payment reliability,
- fair dealing,
- return behavior,
- property respect,
- transaction honesty.

Merchant trust may affect:

- credit eligibility,
- deposit requirements,
- reserved stock access,
- willingness to negotiate,
- transaction verification,
- special-order acceptance.

It must not create hidden punitive pricing against children.

---

## 23. School Reputation

School reputation must focus on learning conduct, not academic rank alone.

Required dimensions:

- persistence,
- cooperation,
- honesty in attempts,
- respect for learning spaces,
- mentoring helpfulness,
- responsibility for shared materials.

Wrong answers and failed practice must not reduce reputation.

Constructive effort may improve learning reputation even before mastery.

---

## 24. Civic Reputation

Civic reputation reflects contribution to shared village readiness.

It may include:

- participation in public work,
- helping during disruptions,
- maintaining shared spaces,
- honoring civic commitments,
- reporting hazards,
- supporting community events.

Civic reputation must feed 15I Event Participation only through explicit thresholds.

---

## 25. Safety and Misconduct Reputation

Safety reputation must be evidence-sensitive and proportionate.

Required safeguards:

- accidents are distinguished from negligence,
- negligence is distinguished from intentional harm,
- child learning errors are protected,
- repeated unsafe conduct may increase severity,
- repaired harm does not erase the original event but may add restorative evidence,
- critical safety incidents may require institutional memory.

---

## 26. Reputation Mutation Formula

A production implementation may use:

```text
appliedDelta =
  baseDelta
  × severityWeight
  × outcomeWeight
  × knowledgeConfidence
  × observerRelevance
  × contextAffinity
  × repetitionModifier
  × antiFarmingModifier
  × propagationAttenuation
```

All factors must be deterministic and versioned.

The final delta must be clamped to configured limits.

---

## 27. Repetition Rules

Repeated identical low-value actions must have diminishing impact.

Required repetition controls:

- same action type diminishing return,
- same observer diminishing return,
- same target diminishing return,
- daily contribution cap,
- context-specific cooldown,
- severe-event exemption where appropriate.

Repeated misconduct may increase impact when recurrence is meaningful.

---

## 28. Anti-Farming Rules

The system must prevent reputation farming.

Prohibited exploit patterns include:

- endlessly repeating trivial greetings,
- returning the same item repeatedly,
- canceling and restarting assistance loops,
- trading the same item without economic consequence,
- coordinating artificial witness loops,
- repeatedly repairing intentionally created harmless damage.

Anti-farming rules must not block genuine varied contribution.

---

## 29. Propagation Model

Reputation knowledge propagates through edges.

Supported edge types:

- FAMILY,
- HOUSEHOLD,
- FRIEND,
- NEIGHBOR,
- COWORKER,
- PROFESSION,
- MERCHANT_NETWORK,
- SCHOOL,
- CIVIC,
- INSTITUTIONAL.

Propagation must specify:

- source observer,
- destination observer,
- edge type,
- trust weight,
- attenuation,
- distortion probability,
- propagation depth,
- timestamp.

---

## 30. Propagation Constraints

A propagation attempt must fail when:

- source does not know the event,
- edge is inactive,
- maximum depth reached,
- confidence falls below threshold,
- destination already holds stronger equivalent knowledge,
- event is private and policy forbids sharing,
- cooldown prevents repeated transmission.

---

## 31. Rumor System

Rumors are uncertain social knowledge.

A rumor must never be stored as direct fact.

Each rumor must include:

- origin reference where known,
- current source,
- confidence,
- distortion,
- spread count,
- last spread time,
- correction state.

Rumor effects must be capped below direct-witness effects unless corroborated.

---

## 32. Rumor Distortion

Distortion may alter:

- severity,
- intent interpretation,
- target identity confidence,
- location certainty,
- outcome certainty.

Distortion must never fabricate prohibited or unsafe content.

Distortion must remain bounded and deterministic from a seeded rule where simulation reproducibility is required.

---

## 33. Corroboration

Multiple independent sources may increase confidence.

Corroboration requires:

- independent source paths,
- non-duplicate originating evidence,
- compatible event identity,
- matching time window,
- matching subject identity.

Repeated transmission of the same rumor is not independent corroboration.

---

## 34. Contradiction Resolution

When evidence conflicts:

1. preserve both records,
2. compare evidence authority,
3. compare confidence,
4. compare directness,
5. compare timestamp,
6. apply institution correction where authorized,
7. mark unresolved contradictions,
8. update projections conservatively.

The system must not silently delete inconvenient evidence.

---

## 35. Memory Formation

A memory is created when observer knowledge exceeds the configured significance threshold.

Memory significance depends on:

- severity,
- personal relevance,
- emotional salience,
- relationship closeness,
- repetition,
- institutional importance,
- novelty.

Trivial events may influence short-term familiarity without creating long-term memory.

---

## 36. Memory Record

```text
ReputationMemory {
  memoryId
  observerType
  observerId
  subjectType
  subjectId
  sourceEventId
  contextType
  dimension
  signedWeight
  confidence
  formedAt
  lastReinforcedAt
  decayPolicyId
  state
  repairLinks[]
  version
}
```

Memory states:

- ACTIVE,
- FADING,
- RESOLVED,
- FORGIVEN,
- CORRECTED,
- ARCHIVED.

---

## 37. Memory Decay

Decay must be policy-driven.

Decay policies may be:

- NONE,
- FAST,
- NORMAL,
- SLOW,
- EVENT_DEPENDENT,
- REPAIR_DEPENDENT,
- INSTITUTIONAL_RETENTION.

Decay must account for:

- severity,
- repetition,
- reinforcement,
- unresolved harm,
- restitution,
- forgiveness,
- relationship closeness.

---

## 38. Positive and Negative Decay

Positive and negative memories need not decay symmetrically.

Rules:

- routine positive familiarity may decay gradually,
- major proven trust should persist longer,
- minor negative awkwardness may fade quickly,
- severe unresolved harm should decay slowly or not at all,
- repaired harm may transition to resolved memory rather than disappear.

---

## 39. Reinforcement

A memory may be reinforced by:

- repeated similar conduct,
- corroborated reports,
- institutional confirmation,
- direct reminder during a related interaction,
- repeated unresolved consequences.

Reinforcement must update `lastReinforcedAt` and may reduce decay.

---

## 40. Forgiveness

Forgiveness is an explicit state transition, not automatic score reset.

Forgiveness may be:

- PERSONAL,
- RELATIONSHIP,
- HOUSEHOLD,
- INSTITUTIONAL,
- COMMUNITY.

Forgiveness requires a policy-defined basis such as:

- apology,
- restitution,
- repair,
- demonstrated change,
- elapsed time,
- formal mediation.

Forgiveness may reduce future behavioral penalties while preserving historical evidence.

---

## 41. Restitution

Restitution records must identify:

- original harm event,
- responsible subject,
- affected target,
- required repair,
- completed repair,
- completion time,
- verifying authority,
- residual unresolved impact.

Restitution creates positive repair evidence but does not erase the original event.

---

## 42. Rehabilitation

Rehabilitation is long-term reputation repair through consistent conduct.

Requirements may include:

- no repeated severe violations,
- completion of repair actions,
- repeated positive evidence,
- time elapsed,
- observer-specific reassessment,
- institutional confirmation where needed.

Rehabilitation must be attainable.

The system must not permanently trap ordinary players in low reputation from recoverable mistakes.

---

## 43. Threshold Effects

Threshold effects must be explicit and context-specific.

Possible effects include:

- greeting tone,
- conversation openness,
- willingness to help,
- willingness to lend,
- need for supervision,
- merchant deposit requirement,
- job eligibility,
- profession mentorship access,
- event invitation eligibility,
- civic responsibility eligibility,
- safety restrictions.

No effect may be activated solely by UI logic.

---

## 44. Hysteresis

Thresholds must use hysteresis where oscillation would be disruptive.

Example:

```text
Enter TRUSTED at +450
Remain TRUSTED until below +380
```

Hysteresis prevents repeated band switching near boundaries.

---

## 45. Confidence Gating

A high score with weak evidence must not be treated as deeply trusted.

Threshold evaluation must consider:

- score,
- confidence,
- evidence diversity,
- evidence recency,
- contradiction state.

Example:

```text
TRUSTED requires score >= 401 and confidence >= 0.65
```

---

## 46. NPC Behavior Integration

NPC behavior may consume reputation through an explicit query:

```text
GetReputationDecisionContext(observerId, subjectId, context)
```

The response may include:

- relevant bands,
- confidence,
- active cautions,
- active trust privileges,
- unresolved incidents,
- repair progress,
- allowed behavior modifiers.

NPC AI must not read raw private memories outside its knowledge scope.

---

## 47. Conversation Integration

15F conversation rules may use reputation to select:

- greeting familiarity,
- willingness to disclose optional information,
- reminder or warning lines,
- apology acceptance responses,
- gratitude responses,
- trust-sensitive offers,
- rumor acknowledgement.

Conversation must not mutate reputation directly.

It must issue an authoritative action that may create reputation evidence.

---

## 48. Interaction Integration

15G interaction eligibility may use reputation for:

- borrowing access,
- credit access,
- supervision requirements,
- private-area invitation,
- advanced workstation access,
- cooperative task acceptance,
- safety restrictions.

Reputation must never override hard safety rules, ownership rules, or permissions.

---

## 49. Merchant Integration

Merchant systems may query:

- payment reliability,
- return history,
- fair dealing,
- active unresolved disputes,
- business-specific trust.

Merchant effects must be explainable through world behavior.

Hidden arbitrary punishment is prohibited.

---

## 50. Profession Integration

Profession systems may query:

- skill confidence,
- reliability,
- safety,
- stewardship,
- teaching helpfulness.

Profession reputation may influence:

- offered responsibilities,
- supervision,
- mentorship,
- access to advanced tasks,
- quality verification frequency.

It must not replace actual skill mastery data.

---

## 51. Learning Integration

The education system must distinguish:

- mastery,
- effort,
- cooperation,
- honesty,
- mentorship conduct.

Reputation must never reduce because a learner needs remediation.

Learning support reputation may increase when a player:

- explains patiently,
- gives useful hints,
- encourages retry,
- avoids giving away answers,
- respects another learner's pace.

---

## 52. Event Participation Handoff

15I may consume reputation eligibility signals such as:

- minimum civic trust,
- profession reliability,
- safety clearance,
- unresolved serious incident flag,
- mentorship trust,
- merchant sponsorship trust.

15H does not define event invitations, capacity, scheduling, or participation lifecycle.

---

## 53. Runtime State

Required runtime stores:

```text
ReputationRuntimeState {
  eventLedgerCursor
  profileVersions
  pendingPropagationQueue
  pendingDecayQueue
  pendingCorrectionQueue
  activeRestitutionCases
  activeForgivenessCases
  lastStableCheckpoint
}
```

Runtime state must be recoverable after interruption.

---

## 54. Reputation Profile Contract

```text
ReputationProfile {
  profileId
  subjectType
  subjectId
  observerType
  observerId
  contexts[]
  createdAt
  updatedAt
  version
}
```

Each context contains:

```text
ReputationContextState {
  contextType
  contextId?
  dimensions[]
  activeThresholds[]
  unresolvedIncidentRefs[]
  confidenceSummary
}
```

Each dimension contains:

```text
ReputationDimensionState {
  dimension
  score
  band
  confidence
  evidenceCount
  lastMeaningfulEvidenceAt
  decayPolicyId
  version
}
```

---

## 55. Command Contracts

Required commands include:

- RecordReputationEvent,
- RegisterObserverKnowledge,
- ApplyReputationImpact,
- QueuePropagation,
- ProcessPropagation,
- ConsolidateMemory,
- ApplyDecay,
- RecordCorrection,
- OpenRestitutionCase,
- CompleteRestitutionAction,
- RecordForgiveness,
- RecalculateProfile,
- RebuildProjection.

Every command must include:

- command ID,
- actor identity,
- expected version where relevant,
- timestamp,
- correlation ID,
- causation ID.

---

## 56. Idempotency

All reputation commands must be idempotent.

Duplicate processing of the same source event must not apply reputation twice.

Required uniqueness guards:

- source event + observer + dimension,
- propagation source + destination + knowledge,
- restitution completion command,
- correction command,
- decay interval application.

---

## 57. Ordering

Reputation processing must preserve causal order.

Required ordering rules:

- original event before correction,
- knowledge creation before propagation,
- memory formation before decay,
- harm before restitution,
- restitution before forgiveness where policy requires,
- profile mutation before projection update.

Late events must be handled deterministically.

---

## 58. Concurrency

Concurrent reputation updates must use optimistic versioning or equivalent transactional protection.

Conflicting writes must:

1. fail safely,
2. reload current authority,
3. re-evaluate deterministic impact,
4. retry only when idempotency remains provable.

Silent last-write-wins is prohibited.

---

## 59. Persistence

Durable persistence must preserve:

- source events,
- observer knowledge,
- memories,
- profile states,
- propagation records,
- corrections,
- restitution,
- forgiveness,
- decay checkpoints,
- versions.

Derived projections may be rebuilt, but authoritative evidence must not be lost.

---

## 60. Save and Load

Save must capture a stable reputation checkpoint.

Load must restore:

- all profile versions,
- pending queues,
- active cases,
- knowledge confidence,
- memory states,
- decay schedule anchors,
- threshold states.

Load must not reapply already processed events.

---

## 61. Migration

Reputation schema migrations must be versioned.

Migration requirements:

- preserve source evidence,
- preserve subject and observer identity,
- map retired dimensions explicitly,
- record score conversion rules,
- rebuild projections deterministically,
- validate band equivalence,
- provide rollback or recovery plan.

---

## 62. Privacy and Visibility

Not every reputation record is visible to the player.

Visibility classes:

- HIDDEN_RUNTIME,
- BEHAVIOR_ONLY,
- INDIRECT_FEEDBACK,
- EXPLICIT_RELATIONSHIP_FEEDBACK,
- INSTITUTIONAL_RECORD_VISIBLE.

The game should communicate meaningful consequences without exposing manipulative numeric optimization targets.

---

## 63. Player Feedback

Allowed player feedback includes:

- NPC behavior changes,
- clear dialogue reactions,
- visible repair requests,
- trust milestones,
- event eligibility explanations,
- merchant requirement explanations,
- civic acknowledgment.

Feedback must avoid shame-heavy design.

The player should understand what conduct mattered and how repair is possible.

---

## 64. Child-Safe Design Requirements

The system must:

- avoid permanent labels for ordinary mistakes,
- distinguish learning failure from misconduct,
- explain repair paths,
- avoid humiliation mechanics,
- avoid public scoreboards of moral worth,
- prevent adult household reputation from punishing children,
- make positive recovery achievable,
- avoid coercive social pressure.

---

## 65. Telemetry

Required telemetry events include:

- reputation_event_recorded,
- observer_knowledge_created,
- rumor_propagated,
- rumor_corrected,
- reputation_dimension_changed,
- threshold_entered,
- threshold_exited,
- memory_formed,
- memory_decayed,
- restitution_opened,
- restitution_completed,
- forgiveness_recorded,
- profile_rebuilt,
- reputation_conflict_detected.

Telemetry must not become authority.

---

## 66. Observability

Operational dashboards should show:

- event processing lag,
- propagation queue depth,
- decay queue depth,
- duplicate suppression count,
- conflict retry count,
- correction rate,
- rumor-to-fact ratio,
- profile rebuild count,
- threshold churn,
- orphaned evidence count.

---

## 67. Failure Handling

Required failure classes:

- EVENT_NOT_FOUND,
- SUBJECT_NOT_FOUND,
- OBSERVER_NOT_FOUND,
- INVALID_CONTEXT,
- INVALID_DIMENSION,
- DUPLICATE_IMPACT,
- VERSION_CONFLICT,
- PROPAGATION_BLOCKED,
- CONFIDENCE_TOO_LOW,
- CORRECTION_TARGET_MISSING,
- RESTITUTION_CASE_NOT_FOUND,
- FORGIVENESS_NOT_ALLOWED,
- DECAY_POLICY_MISSING,
- PROJECTION_REBUILD_FAILED.

Failures must not partially mutate authority.

---

## 68. Recovery

Recovery procedures must support:

- replay from reputation event ledger,
- profile rebuild,
- queue reconstruction,
- correction replay,
- decay checkpoint restoration,
- orphan record detection,
- duplicate impact reconciliation.

Recovery success requires verified persistent state, not only successful process restart.

---

## 69. Validation Invariants

The following invariants are mandatory:

1. No score mutation without a source event.
2. No observer knowledge without a valid knowledge source.
3. No direct-witness record without witness eligibility.
4. No duplicate impact for the same event-observer-dimension tuple.
5. No reputation score outside configured bounds.
6. No threshold state inconsistent with score, confidence, and hysteresis.
7. No rumor treated as direct fact without corroboration or correction.
8. No child penalty from ordinary learning failure.
9. No household penalty automatically copied to a child.
10. No repair record without original harm linkage.
11. No forgiveness record without authorized policy.
12. No decay application before memory formation.
13. No projection version ahead of authority version.
14. No save/load duplicate event application.
15. No event participation decision without explicit 15I policy.

---

## 70. Deterministic Test Matrix

Required deterministic tests include:

### 70.1 Direct positive action

A witnessed helpful action increases helpfulness for the witness.

### 70.2 Private action

A private action does not update unrelated observers.

### 70.3 Rumor propagation

A rumor arrives with attenuated confidence and capped effect.

### 70.4 Duplicate suppression

Reprocessing the same event does not apply a second delta.

### 70.5 Corroboration

Independent evidence raises confidence correctly.

### 70.6 Contradiction

A stronger correction reduces or reverses prior uncertain impact.

### 70.7 Learning protection

A wrong answer produces no negative reputation.

### 70.8 Negligence distinction

A preventable unsafe action differs from a good-faith accident.

### 70.9 Repair

Restitution adds repair evidence without deleting original harm.

### 70.10 Forgiveness

Forgiveness changes active penalties while retaining historical evidence.

### 70.11 Decay

Eligible memories decay according to policy and time anchor.

### 70.12 Save/load

Reload preserves scores, confidence, bands, queues, and idempotency.

---

## 71. Scenario Validation

Required scenario suites:

### Scenario A — Trusted Helper

- player helps multiple residents,
- evidence comes from distinct observers,
- helpfulness rises locally,
- village familiarity grows gradually,
- no instant universal trust occurs.

### Scenario B — Reliable Apprentice

- player completes workshop tasks,
- profession reliability increases,
- skill confidence remains tied to actual verified work,
- advanced task access becomes eligible.

### Scenario C — Merchant Dispute

- incorrect payment creates dispute evidence,
- accidental correction differs from intentional dishonesty,
- restitution resolves transaction consequences,
- merchant trust recovers proportionately.

### Scenario D — False Rumor

- rumor spreads through two social edges,
- confidence attenuates,
- direct evidence contradicts rumor,
- correction propagates,
- affected profiles recalculate.

### Scenario E — Safety Incident

- unsafe conduct is witnessed,
- safety reputation falls,
- supervision requirement activates,
- training and safe repeated conduct support rehabilitation.

### Scenario F — Child Learner

- learner repeatedly fails a puzzle,
- no negative reputation occurs,
- persistence and honest effort may improve learning conduct reputation,
- mastery remains separate.

---

## 72. Performance Requirements

The system must support:

- bounded per-action reputation processing,
- asynchronous non-critical propagation,
- indexed observer-subject-context queries,
- batch decay processing,
- incremental profile updates,
- deterministic rebuilds,
- bounded rumor depth,
- queue backpressure.

Critical interaction paths must not block on village-wide propagation.

---

## 73. Data Retention

Retention policy must distinguish:

- authoritative source events,
- active memories,
- faded memories,
- institutional incidents,
- transient rumor records,
- telemetry.

Critical institutional evidence may require long retention.

Transient low-confidence rumors should expire.

---

## 74. Configuration Authority

Configurable values include:

- dimension score bounds,
- band thresholds,
- confidence thresholds,
- propagation depth,
- attenuation,
- decay rates,
- repetition limits,
- anti-farming caps,
- repair requirements,
- hysteresis margins.

Configuration must be:

- versioned,
- validated,
- environment-controlled,
- included in evidence,
- migration-aware.

---

## 75. Forbidden Implementations

The following are prohibited:

- one universal morality score,
- instant village omniscience,
- reputation mutation in UI components,
- hidden score changes without source evidence,
- punishing wrong academic answers,
- permanent unrecoverable labels for minor mistakes,
- rumor treated as fact by default,
- reputation inherited automatically by children,
- last-write-wins profile updates,
- duplicate event application,
- deleting negative history when repair occurs,
- letting reputation override safety or ownership authority,
- using real-world personal data for fictional reputation.

---

## 76. Implementation Sequence

Recommended implementation order:

1. Define enums and contracts.
2. Implement reputation event ledger.
3. Implement observer knowledge records.
4. Implement direct witness registration.
5. Implement profile dimensions and bands.
6. Implement idempotent impact application.
7. Implement threshold evaluation and hysteresis.
8. Implement relationship reputation queries.
9. Implement profession and merchant contexts.
10. Implement propagation queue.
11. Implement rumor confidence and attenuation.
12. Implement memory records.
13. Implement decay.
14. Implement corrections.
15. Implement restitution and forgiveness.
16. Implement save/load.
17. Implement projections.
18. Integrate 15F and 15G.
19. Add telemetry and recovery.
20. Complete deterministic scenario validation.

---

## 77. Evidence Package

The production evidence package must contain:

- changed file list,
- public contract exports,
- reputation enums,
- event contract evidence,
- profile contract evidence,
- idempotency evidence,
- direct witness test evidence,
- propagation test evidence,
- rumor correction evidence,
- decay evidence,
- restitution evidence,
- forgiveness evidence,
- child-safe learning evidence,
- save/load evidence,
- performance evidence,
- failure and recovery evidence,
- configuration snapshot,
- known limitations,
- final verification summary.

---

## 78. Repository Gate

Repository review must verify:

- document completeness,
- contract coherence,
- dependency alignment with 15A–15G,
- explicit authority boundaries,
- child-safe rules,
- deterministic mutation rules,
- recovery requirements,
- 15I handoff clarity.

Repository PASS does not imply runtime or operational PASS.

---

## 79. Runtime Gate

Runtime verification must confirm:

- contracts compile,
- persistence adapters work,
- event processing is idempotent,
- concurrent updates are safe,
- propagation queues recover,
- decay is deterministic,
- profile rebuild matches incremental state,
- save/load does not duplicate impacts.

---

## 80. Operational Gate

Operational verification must exercise:

```text
World Action
→ Reputation Event
→ Witness/Knowledge
→ Memory
→ Profile Update
→ Threshold
→ NPC/Interaction Projection
→ Save
→ Reload
→ Same Projection
```

At least one positive, one negative, one rumor, one correction, one repair, and one learning-safe scenario must pass end-to-end.

---

## 81. Production Exit Criteria

15H is complete only when:

- reputation authority is explicit,
- contextual dimensions are defined,
- observer knowledge prevents omniscience,
- direct evidence and rumor are distinct,
- propagation is bounded,
- memory and decay are deterministic,
- repair and forgiveness are supported,
- child-safe learning rules are enforced,
- integration boundaries are clear,
- persistence and save/load are specified,
- validation invariants are testable,
- evidence requirements are complete,
- 15I receives a stable reputation query contract.

---

## 82. Handoff to 15I — Event Participation

15H exposes the following stable inputs to 15I:

```text
EventReputationEligibilityContext {
  subjectId
  eventContext
  civicBand
  reliabilityBand
  safetyBand
  professionBand?
  mentorshipBand?
  confidence
  activeRestrictions[]
  activePrivileges[]
  unresolvedSeriousIncident
  evaluatedAt
  reputationVersion
}
```

15I owns:

- event invitation,
- event registration,
- capacity,
- attendance,
- role assignment,
- participation lifecycle,
- event rewards,
- event-specific failure handling.

15H owns only the reputation evidence and eligibility signals consumed by that system.

---

## 83. Final Authority Statement

Builder's Valley must remember conduct without becoming arbitrary, omniscient, punitive, or irreversible.

The reputation system is successful when:

- actions have socially coherent consequences,
- observers know only what they can reasonably know,
- trust grows through meaningful evidence,
- mistakes can be repaired,
- serious harm remains significant,
- learning remains psychologically safe,
- NPC behavior changes consistently,
- every visible consequence can be traced to authoritative world evidence.

This guide is the production authority for reputation behavior in Builder's Valley and the required foundation for 15I — Event Participation.
