# 15F — Conversation Rules Production Guide

**Project:** Math Learning World  
**World Slice:** Builder's Valley  
**Phase:** 15 — NPC & Population System  
**Document Type:** Production Guide / Conversation Authority  
**Status:** Production Ready  
**Parent Authority:** `15-NPC-AND-POPULATION-SYSTEM-GUIDE.md`  
**Direct Dependencies:** `15A-POPULATION-DISTRIBUTION-PRODUCTION-GUIDE.md`, `15B-DAILY-SCHEDULE-PRODUCTION-GUIDE.md`, `15C-NPC-ROLES-PRODUCTION-GUIDE.md`, `15D-PROFESSION-SYSTEM-PRODUCTION-GUIDE.md`, `15E-MERCHANT-ECONOMY-PRODUCTION-GUIDE.md`

---

## 1. Purpose

This guide defines how conversations are authorized, selected, delivered, interrupted, remembered, resumed, and validated across Builder's Valley.

It converts population, schedule, role, profession, merchant, relationship, learning, and world-state information into a coherent dialogue runtime.

The system must allow NPCs to communicate as believable participants in a living world without becoming a free-form text generator detached from game truth.

This document is the authoritative production reference for deciding:

- whether a conversation may begin;
- who may speak;
- what subjects are eligible;
- which world facts may be revealed;
- how tone and wording are selected;
- how conversations react to profession, schedule, relationship, reputation, mood, location, safety, economy, and learning context;
- how NPC-to-NPC and player-to-NPC exchanges differ;
- how conversation state is stored and recovered;
- how deterministic evidence is produced for debugging and validation.

It does not define physical interaction authority, full reputation mathematics, event participation policy, or population-wide final validation. Those responsibilities belong to later Phase 15 documents.

---

## 2. Production Outcome

A conforming implementation must produce a conversation system that:

1. treats dialogue as a projection of world truth rather than an isolated content layer;
2. prevents speakers from revealing facts they do not know;
3. distinguishes public, relational, professional, private, protected, and secret knowledge;
4. respects active schedules and workplace obligations;
5. supports low-language and language-light interaction;
6. provides clear player intent choices without requiring long reading;
7. supports NPC-to-NPC ambient conversation without blocking core simulation;
8. supports merchant, education, profession, mission, and social dialogue through shared authority rules;
9. remains deterministic enough to reproduce and test;
10. degrades safely when content, localization, memory, or simulation detail is unavailable;
11. never permits dialogue to override stronger gameplay authority;
12. preserves continuity across save/load, interruption, scene transition, and time skip.

---

## 3. Core Principle: Conversation Is a World Projection

Conversation must not invent the world.

Conversation must project the world.

The runtime receives authoritative facts from upstream systems and produces an eligible communication surface from those facts.

The minimum projection chain is:

```text
World State
  -> Speaker Knowledge
  -> Listener Eligibility
  -> Conversation Intent
  -> Topic Eligibility
  -> Response Plan
  -> Delivery Form
  -> Consequence
  -> Memory Evidence
```

Rules:

- Dialogue content must be derived from known state.
- Unknown facts must not appear as certainty.
- Rumors must be marked as uncertain knowledge.
- A line of dialogue must never silently mutate economy, inventory, mission, profession, or relationship authority.
- Any mutation caused by a conversation must be executed by the owning system through an explicit command.
- Conversation is not an escape hatch around permissions.

---

## 4. Authority Hierarchy

Conversation decisions must obey this order:

1. child safety and protected-content policy;
2. physical and situational safety;
3. identity and speaker authenticity;
4. knowledge ownership and secrecy;
5. interaction permission;
6. schedule and duty constraints;
7. active mission or transaction state;
8. relationship and reputation rules;
9. profession and role context;
10. mood and emotional projection;
11. content variety and ambient flavor.

A lower authority must never override a higher authority.

Examples:

- A friendly mood may not reveal protected personal information.
- A merchant may not complete a sale through dialogue when inventory authority rejects the transaction.
- A teacher may not certify mastery merely because the player selected a flattering response.
- A quest line may not make an NPC abandon an emergency duty.
- Ambient flavor may not contradict a named world event.

---

## 5. Conversation Participants

### 5.1 Speaker

The speaker is the entity currently authorized to emit a communication act.

A speaker must have:

- stable identity;
- active world presence or a supported remote-channel authority;
- communication capability;
- eligible topic knowledge;
- no blocking state that forbids communication.

### 5.2 Listener

The listener is the intended receiver of the communication act.

The listener may be:

- the player;
- one NPC;
- a small conversation group;
- a class or audience;
- a transaction participant;
- a mission party.

### 5.3 Observer

An observer is present within perception range but is not the primary listener.

Observers may:

- hear public dialogue;
- react visibly;
- update rumor knowledge when allowed;
- join only through an explicit join rule;
- become a witness for future evidence.

### 5.4 Conversation Group

A conversation group is a bounded set of participants sharing one active conversation context.

Rules:

- One participant is the active speaker at a time.
- The runtime must maintain turn authority.
- Group size must be capped for interactive dialogue.
- Large audiences must use broadcast or presentation mode.
- Leaving the valid range removes a participant unless the channel supports distance.

---

## 6. Communication Channels

Supported channels include:

- face-to-face conversation;
- gesture and icon exchange;
- shop counter dialogue;
- classroom or workshop instruction;
- public announcement;
- mission briefing;
- NPC ambient exchange;
- remote board, note, message, or device channel when explicitly supported.

Each channel defines:

- distance rules;
- privacy level;
- interruption policy;
- delivery speed;
- eligible content forms;
- persistence requirements;
- audience capacity.

Face-to-face conversation is the default interactive channel.

---

## 7. Conversation Eligibility

A conversation may begin only when all required checks pass.

Minimum checks:

- speaker exists and is active;
- listener exists and is reachable;
- both support the selected channel;
- distance and line-of-sight rules pass when required;
- neither participant is in a blocking state;
- no higher-priority emergency prevents engagement;
- schedule policy permits interruption;
- the selected topic has at least one eligible response;
- cooldown and repetition rules allow activation.

Common blocking states:

- unconscious;
- fleeing danger;
- performing protected work;
- sleeping;
- already in an exclusive conversation;
- transition or teleport state;
- unresolved transaction lock;
- scripted safety sequence;
- explicit refusal state.

---

## 8. Conversation Request Model

A conversation request should contain:

```text
conversationRequestId
initiatorId
targetParticipantIds
channel
requestedIntent
requestedTopicId
worldTimestamp
locationId
correlationId
```

Optional fields:

```text
missionId
transactionId
learningSessionId
sourceInteractionId
requestedPrivacy
continuationToken
```

The runtime returns one of:

```text
STARTED
REFUSED
DEFERRED
REDIRECTED
RESUMED
```

A refusal must include a stable reason code.

---

## 9. Conversation Intents

Conversation intent describes what the initiator is trying to accomplish.

Primary intents:

- greet;
- ask information;
- request help;
- offer help;
- teach;
- learn;
- trade;
- negotiate;
- report;
- warn;
- apologize;
- thank;
- invite;
- decline;
- confirm;
- challenge;
- reassure;
- celebrate;
- ask for permission;
- close conversation.

Intent is not the same as exact wording.

The same intent may produce different delivery forms based on age, language level, relationship, culture, mood, profession, and urgency.

---

## 10. Topic Authority

A topic is eligible only when the speaker has authority to address it.

Topic authority may derive from:

- direct observation;
- profession knowledge;
- role assignment;
- relationship knowledge;
- mission participation;
- transaction participation;
- public announcement;
- verified rumor;
- teaching authority;
- personal memory.

A speaker must not answer beyond the strongest available knowledge class.

Supported knowledge classes:

```text
UNKNOWN
HEARD_UNVERIFIED
BELIEVED
OBSERVED
VERIFIED
AUTHORIZED
```

Response certainty must match knowledge class.

Examples:

- `HEARD_UNVERIFIED` should produce uncertain language or rumor markers.
- `OBSERVED` may describe what the NPC personally saw.
- `AUTHORIZED` may provide official instruction or confirmation.
- `UNKNOWN` must produce an honest lack-of-knowledge response.

---

## 11. Knowledge Scope

Knowledge must be scoped by subject and access.

Knowledge scopes:

- public;
- local-community;
- workplace;
- profession;
- relationship;
- household;
- mission-party;
- transaction;
- private-personal;
- protected;
- secret.

Rules:

- Public knowledge may be shared unless temporarily restricted.
- Workplace knowledge may require role or assignment.
- Relationship knowledge must not leak to unrelated participants.
- Protected knowledge must require explicit authority.
- Secret knowledge must include a disclosure policy.
- Observers must not automatically receive private dialogue facts.

---

## 12. Greeting Rules

Greetings establish context and signal availability.

Greeting selection considers:

- first meeting versus repeat meeting;
- time since last meeting;
- current schedule;
- urgency;
- relationship tier;
- recent unresolved event;
- workplace role;
- cultural and localization profile;
- mood;
- whether a previous conversation ended abruptly.

Greeting classes:

- first encounter;
- routine familiar;
- professional;
- merchant service;
- teacher or mentor;
- urgent interruption;
- reconciliation;
- celebration;
- unavailable or busy;
- nonverbal acknowledgement.

Rules:

- Repeated greetings must be suppressed within a short cooldown.
- A busy NPC may acknowledge without opening a full conversation.
- Urgent state overrides decorative greetings.
- First encounter must not assume an existing relationship.

---

## 13. Availability Projection

Conversation availability must be visible before selection when possible.

Visual projections may include:

- ready icon;
- busy icon;
- danger icon;
- shop icon;
- teaching icon;
- question icon;
- mission icon;
- privacy icon;
- cooldown indicator;
- gesture-only indicator.

The UI must avoid offering actions that are guaranteed to fail.

When an action remains visible but blocked, the reason should be understandable through a short label, icon, or animation.

---

## 14. Schedule-Aware Dialogue

Daily schedule is authoritative.

Conversation rules must distinguish:

- free time;
- routine work;
- interruptible work;
- protected work;
- break;
- travel;
- sleep;
- emergency duty;
- event participation.

Examples:

- A merchant at an open counter may enter shop dialogue.
- The same merchant while restocking may provide a short acknowledgement but defer trade.
- A teacher during instruction may answer lesson-related questions but defer unrelated chat.
- A sleeping NPC should not begin normal conversation.
- A worker performing hazardous work may reject interruption completely.

Deferred conversations should optionally produce a future availability hint.

---

## 15. Role-Aware Dialogue

Active roles shape what the NPC is expected to communicate.

Examples:

- A parent role may discuss household concerns.
- A student role may ask questions and report progress.
- A mentor role may provide guidance.
- A witness role may report an observed event.
- A host role may welcome participants.
- A customer role may ask about price or stock.

Temporary role activation must not grant unrelated professional authority.

---

## 16. Profession-Aware Dialogue

Profession affects vocabulary, confidence, topic depth, and service authority.

Profession dialogue must project:

- qualification level;
- specialization;
- current workplace;
- active duty;
- certification status;
- confidence and mastery;
- known limitations.

Rules:

- Apprentices must not present themselves as fully certified.
- Suspended professionals must not issue protected instructions.
- Experts may explain at greater depth when the listener is ready.
- Profession dialogue must support language-light demonstrations and visual references.
- Technical claims must remain grounded in profession knowledge state.

---

## 17. Merchant Dialogue

Merchant dialogue is a projection of the merchant economy.

Eligible merchant intents include:

- browse;
- ask price;
- ask stock;
- ask alternative;
- reserve item;
- buy;
- sell;
- return;
- refund inquiry;
- special order;
- delivery inquiry;
- service inquiry;
- close transaction.

Rules:

- Displayed price must come from current price authority.
- Stock claims must come from current inventory projection.
- Dialogue must not promise reserved stock without reservation authority.
- A merchant may explain scarcity but may not fabricate supply.
- A completed sale requires transaction success from the economy system.
- Return and refund wording must match policy state.
- Price negotiation is allowed only when price policy permits it.
- Merchant mood may alter tone but not authoritative price or stock facts.

---

## 18. Education Dialogue

Education dialogue must support learning without turning the system into answer dumping.

Supported education intents:

- ask what to do;
- ask for a hint;
- ask for a demonstration;
- explain reasoning;
- verify understanding;
- request another example;
- request easier representation;
- request challenge extension;
- reflect on mistake;
- close lesson.

Rules:

- Hints should follow the active learning policy.
- The system must not reveal final answers when the learning design forbids it.
- Explanation depth must match learner readiness.
- Teachers and mentors must distinguish error, misconception, and missing prerequisite.
- Mastery claims require assessment authority.
- Dialogue should prefer visual, manipulable, and contextual representations.
- Encouragement must not falsely certify correctness.
- Repeated failure should trigger remediation guidance rather than shame.

---

## 19. Mission and Quest Dialogue

Mission dialogue must project mission truth.

Supported states:

```text
NOT_DISCOVERED
AVAILABLE
OFFERED
ACCEPTED
IN_PROGRESS
BLOCKED
READY_TO_COMPLETE
COMPLETED
FAILED
EXPIRED
```

Rules:

- A mission must not be offered when prerequisites fail.
- A completed mission must not be re-offered unless repeatable.
- Dialogue must distinguish blocked from failed.
- Mission hints must respect discovery policy.
- Rewards must be granted by mission authority, not by dialogue text.
- Conversation may trigger a mission command but may not mutate mission state directly.

---

## 20. Relationship-Aware Dialogue

Relationship state changes access, tone, willingness, and topic depth.

Relationship inputs may include:

- familiarity;
- trust;
- affection;
- respect;
- conflict;
- obligation;
- mentorship;
- family connection;
- recent help or harm;
- unresolved promise.

Rules:

- Familiarity must not equal trust.
- High trust may unlock private topics but not protected secrets without policy.
- Conflict may change tone and refusal probability.
- Family relationships may create special greeting and concern patterns.
- Mentorship relationships may increase teaching dialogue access.
- Relationship changes must be produced by the relationship system.

---

## 21. Reputation-Aware Dialogue

Reputation influences expectation before direct relationship is established.

Conversation may consider:

- local reputation;
- profession reputation;
- merchant reputation;
- learning reputation;
- event reputation;
- group or faction reputation.

Rules:

- Reputation must not overwrite direct evidence.
- Rumor-based reputation should produce uncertainty.
- Negative reputation may cause caution, refusal, or guarded topics.
- Positive reputation may improve initial openness but not bypass permissions.
- Reputation changes belong to Phase 15H authority.

---

## 22. Mood and Emotion Projection

Mood affects delivery, not truth authority.

Mood dimensions may include:

- calm;
- happy;
- worried;
- tired;
- frustrated;
- proud;
- curious;
- afraid;
- grieving;
- excited.

Mood may alter:

- response length;
- animation;
- voice energy;
- willingness to continue;
- topic preference;
- greeting class;
- interruption tolerance.

Mood must not:

- fabricate facts;
- bypass safety;
- grant authority;
- change prices outside merchant policy;
- certify learning;
- reveal secrets automatically.

---

## 23. Tone Policy

Tone is selected from context rather than authored as a global personality only.

Tone inputs:

- speaker personality;
- current mood;
- relationship;
- profession;
- urgency;
- listener age and readiness;
- cultural profile;
- location;
- topic sensitivity.

Tone classes:

- warm;
- neutral;
- formal;
- concise;
- instructional;
- cautious;
- apologetic;
- celebratory;
- urgent;
- firm.

The same factual response may be delivered in different tones while preserving meaning.

---

## 24. Language-Light Conversation

Builder's Valley must support players with limited reading ability.

The conversation surface should support:

- icons;
- gesture previews;
- object references;
- number and quantity visuals;
- map markers;
- item cards;
- emotion faces;
- short phrases;
- optional voice;
- replay;
- slow delivery;
- visual confirmation.

Rules:

- Critical choices must not depend on subtle wording alone.
- Transaction totals must be visually shown.
- Learning instructions should use manipulable examples when possible.
- Refusal reasons should be short and clear.
- The player should be able to recognize intent before selecting it.

---

## 25. Dialogue Content Structure

A dialogue response should be represented as structured content rather than only raw text.

Recommended form:

```text
responseId
speakerId
intent
semanticActs[]
contentTokens[]
visualReferences[]
audioCue
animationCue
certainty
privacy
consequenceRequests[]
nextChoices[]
```

Semantic acts may include:

- greet;
- inform;
- ask;
- confirm;
- deny;
- warn;
- suggest;
- instruct;
- offer;
- accept;
- refuse;
- apologize;
- thank;
- close.

This structure allows localization and language-light rendering without losing authority.

---

## 26. Player Choice Design

Player choices should express intent clearly.

Good choice forms:

- Ask about work
- Buy this item
- Show my solution
- Ask for a hint
- Apologize
- Leave

Avoid:

- choices that differ only by hidden tone;
- choices whose consequences are impossible to predict;
- decorative choices that all produce the same outcome without reason;
- long paragraphs as buttons;
- choices that promise unavailable actions.

Choice availability must be recomputed when authoritative state changes.

---

## 27. Conversation State Machine

Recommended runtime states:

```text
IDLE
REQUESTED
ELIGIBILITY_CHECK
OPENING
ACTIVE
WAITING_FOR_PLAYER
WAITING_FOR_SYSTEM
INTERRUPTED
DEFERRED
CLOSING
CLOSED
FAILED
RECOVERING
```

Valid transitions must be explicit.

Examples:

```text
IDLE -> REQUESTED
REQUESTED -> ELIGIBILITY_CHECK
ELIGIBILITY_CHECK -> OPENING
ELIGIBILITY_CHECK -> FAILED
OPENING -> ACTIVE
ACTIVE -> WAITING_FOR_PLAYER
ACTIVE -> WAITING_FOR_SYSTEM
ACTIVE -> INTERRUPTED
ACTIVE -> CLOSING
INTERRUPTED -> ACTIVE
INTERRUPTED -> DEFERRED
CLOSING -> CLOSED
FAILED -> CLOSED
```

Invalid transitions must be rejected and logged.

---

## 28. Turn Authority

Only the participant holding turn authority may produce the next interactive act.

Turn authority rules:

- system events may interrupt any turn when higher priority;
- the player owns the turn while a choice is pending;
- an NPC owns the turn while delivering a response;
- a transaction service owns resolution while a purchase command is pending;
- a learning service owns resolution while an answer is being assessed;
- group conversations require an explicit next-speaker selection.

The runtime must prevent duplicate responses caused by repeated input.

---

## 29. Interruptions

Conversation interruption causes include:

- danger;
- schedule transition;
- participant leaves range;
- mission state changes;
- transaction failure;
- event start;
- network or scene failure;
- player cancel;
- higher-priority NPC duty.

Interruption policy:

- pause when safe and resumable;
- close immediately when context becomes invalid;
- preserve unresolved authoritative commands separately;
- provide a visible reason;
- create a continuation token only when resumption is valid.

---

## 30. Resumption

A conversation may resume only when:

- participants remain valid;
- topic remains eligible;
- authoritative state has not invalidated prior choices;
- continuation age is within policy;
- no stronger conversation has replaced it.

On resume, the runtime must revalidate:

- schedule;
- location;
- knowledge;
- mission state;
- transaction state;
- relationship state;
- safety state.

A continuation must not replay a completed consequence.

---

## 31. Closing Rules

A conversation closes when:

- the player leaves;
- the speaker closes;
- no eligible choices remain;
- a transaction completes;
- a lesson segment completes;
- an interruption invalidates the context;
- timeout policy activates;
- all participants agree to end.

Closing should produce:

- final semantic act;
- consequence status;
- memory evidence;
- cooldown state;
- continuation eligibility;
- UI teardown signal.

---

## 32. NPC-to-NPC Conversation

NPC-to-NPC conversation supports world believability and information flow.

Ambient conversation must:

- use real participants;
- respect schedules;
- avoid duplicating exclusive NPC presence;
- use eligible topics;
- remain performance-bounded;
- stop when participants leave range;
- avoid revealing private facts to the player unless audible and permitted.

Ambient conversation tiers:

- full nearby simulation;
- simplified semantic exchange;
- offstage summary event;
- no simulation when irrelevant.

Offstage conversations should store outcomes, not full line-by-line transcripts, unless required by evidence policy.

---

## 33. Rumor Propagation

Rumors are uncertain knowledge transferred through conversation.

Rumor records should contain:

```text
rumorId
subjectId
claimType
claimPayload
sourceId
currentHolderId
certainty
createdAt
lastTransferredAt
decayPolicy
```

Rules:

- Rumors must never be promoted to verified facts without evidence.
- Certainty may decay across transfers.
- Speakers may refuse to repeat sensitive rumors.
- The system should avoid infinite rumor duplication.
- Rumors must respect age and safety policy.
- The player must be able to distinguish rumor from official information.

---

## 34. Privacy and Eavesdropping

Conversation privacy levels:

```text
PUBLIC
LOCAL
GROUP_ONLY
PRIVATE
PROTECTED
```

Rules:

- Public dialogue may be heard by nearby observers.
- Local dialogue has limited radius.
- Group-only dialogue requires membership.
- Private dialogue must reduce observer eligibility.
- Protected dialogue must not be exposed through ambient subtitles or logs.
- Eavesdropping mechanics, when supported, must be explicit gameplay systems rather than accidental leakage.

---

## 35. Memory Model

Conversation memory should store semantic outcomes, not every rendered word by default.

Memory examples:

- first introduction occurred;
- promise was made;
- warning was delivered;
- player asked for help;
- merchant explained shortage;
- teacher provided hint level two;
- apology was accepted;
- private fact was disclosed;
- conversation ended due to emergency.

Recommended memory record:

```text
memoryId
conversationId
participantIds
semanticType
subjectId
payload
privacy
worldTimestamp
expiryPolicy
sourceEvidenceId
```

---

## 36. Repetition Control

The runtime must prevent repetitive dialogue from feeling mechanical.

Controls include:

- greeting cooldown;
- topic cooldown;
- semantic repetition detection;
- recent-response history;
- variant rotation;
- state-aware replacement;
- suppression after completion;
- escalation after repeated asking.

Variation must never change authoritative meaning.

A price response may vary in wording, but the number and policy must remain identical.

---

## 37. Localization

Conversation content must be localization-ready.

Rules:

- Store semantic intent separately from rendered text.
- Avoid embedding numbers, item names, and names inside opaque sentences when token replacement is possible.
- Support pluralization and grammar rules.
- Support short and extended variants.
- Support right-to-left layout where needed.
- Support voice and subtitle timing independently.
- Missing localization must fall back safely without exposing internal keys.

---

## 38. Content Selection

Response selection must use weighted eligibility, not unrestricted randomness.

Selection inputs:

- semantic correctness;
- authority class;
- context match;
- recent repetition;
- tone match;
- language profile;
- delivery duration;
- accessibility profile;
- content availability.

Deterministic seed inputs may include:

```text
conversationId
turnIndex
speakerId
responsePoolVersion
worldDay
```

This allows reproducible tests while retaining controlled variety.

---

## 39. Fallback Behavior

When a specialized response is unavailable, the runtime must degrade safely.

Fallback order:

1. exact authored response;
2. semantic template for the same intent;
3. profession or role-neutral response;
4. language-light icon or gesture response;
5. honest unavailable response;
6. safe conversation close.

Fallback must not invent unsupported facts.

---

## 40. Consequence Requests

Conversation may request consequences from owning systems.

Examples:

- start transaction;
- reserve item;
- accept mission;
- record apology;
- request lesson hint;
- schedule meeting;
- reveal map marker;
- invite to event;
- update relationship evidence.

Each consequence request must include:

```text
requestId
conversationId
ownerSystem
commandType
payload
expectedVersion
correlationId
```

The conversation waits for success or failure and then projects the result.

---

## 41. Failure Handling

Stable failure codes should include:

```text
CONVERSATION_SPEAKER_UNAVAILABLE
CONVERSATION_LISTENER_UNAVAILABLE
CONVERSATION_CHANNEL_UNSUPPORTED
CONVERSATION_OUT_OF_RANGE
CONVERSATION_BLOCKED_BY_SAFETY
CONVERSATION_BLOCKED_BY_SCHEDULE
CONVERSATION_TOPIC_NOT_ELIGIBLE
CONVERSATION_KNOWLEDGE_INSUFFICIENT
CONVERSATION_PRIVACY_DENIED
CONVERSATION_ALREADY_ACTIVE
CONVERSATION_STALE_CONTINUATION
CONVERSATION_INVALID_TRANSITION
CONVERSATION_CONTENT_MISSING
CONVERSATION_CONSEQUENCE_FAILED
CONVERSATION_PARTICIPANT_LEFT
CONVERSATION_INTERRUPTED
```

Failures must be observable without showing technical details to the player.

---

## 42. Save and Load

Persistent conversation state should include only what is needed for continuity and evidence.

Persist when appropriate:

- conversation identity;
- participant identities;
- current semantic state;
- turn index;
- pending consequence request;
- continuation token;
- relevant memory outputs;
- cooldowns;
- interruption reason;
- content version.

Do not persist:

- transient animation frame;
- temporary UI focus;
- duplicated rendered text when semantic content is sufficient;
- invalid stale choices.

Load must revalidate authoritative state before resuming.

---

## 43. Time Skip

Time skip may invalidate active conversations.

Rules:

- Short pauses may resume when participants remain valid.
- Long time skips should close active conversations and preserve only outcomes.
- Pending transactions must be resolved by transaction authority before skip completion.
- Deferred conversations may expire.
- Schedule changes must be applied before any resumed dialogue.
- NPC-to-NPC ambient exchanges may be summarized rather than replayed.

---

## 44. Performance Tiers

Conversation simulation should use tiers.

### Tier 1 — Interactive

Full turn state, choices, animations, localization, and consequences.

### Tier 2 — Nearby Ambient

Simplified semantic exchange with visible cues.

### Tier 3 — Offstage Semantic

Outcome-only exchange for rumor, relationship, or coordination.

### Tier 4 — Suppressed

No conversation simulation when no meaningful state change is possible.

Tier changes must preserve semantic continuity.

---

## 45. Accessibility

Required accessibility support:

- subtitle control;
- text size scaling;
- replay last line;
- pause while reading;
- reduced animation;
- icon plus text pairing;
- color-independent meaning;
- input alternatives;
- clear focus order;
- audio cue captions;
- simplified language mode.

Conversation timing must not punish slower readers.

---

## 46. Child Safety

Math Learning World is designed for children and families.

Conversation rules must:

- reject sexual content;
- reject grooming behavior;
- reject exploitative requests;
- avoid humiliating or abusive teaching language;
- avoid manipulative monetization language;
- protect personal information;
- prevent NPCs from requesting real-world secrets;
- provide safe reporting and exit behavior;
- ensure merchant dialogue does not pressure children into spending real money;
- keep conflict age-appropriate.

Safety policy has the highest authority.

---

## 47. Observability

Conversation runtime should emit structured events.

Recommended events:

```text
conversation.requested
conversation.started
conversation.refused
conversation.turn_started
conversation.choice_presented
conversation.choice_selected
conversation.response_selected
conversation.consequence_requested
conversation.consequence_resolved
conversation.interrupted
conversation.resumed
conversation.closed
conversation.failed
conversation.memory_written
```

Each event should include:

- conversationId;
- world timestamp;
- participant IDs;
- state transition;
- intent;
- topic ID;
- correlation ID;
- failure code when relevant;
- content version.

Protected content must be redacted from logs.

---

## 48. Determinism

For the same authoritative inputs and deterministic seed, the system should produce the same:

- eligibility decision;
- topic set;
- choice set;
- semantic response;
- consequence request;
- state transition.

Rendered wording may vary only when variation is explicitly seeded and testable.

---

## 49. Validation Scenarios

A production implementation must validate at least the following scenarios.

### 49.1 First Meeting

- Player approaches an unknown NPC.
- First-meeting greeting appears.
- No familiar relationship language is used.
- Introduction memory is written once.

### 49.2 Busy Worker

- Player approaches a worker performing protected work.
- Full conversation is blocked.
- A short safe acknowledgement is used only if policy permits.
- No schedule mutation occurs.

### 49.3 Merchant Stock Inquiry

- Player asks for an item.
- Merchant reports current stock from inventory projection.
- Reserved stock is not falsely offered.
- Price matches price authority.

### 49.4 Merchant Transaction Failure

- Player selects buy.
- Economy system rejects insufficient funds.
- Conversation projects failure without granting item.
- Duplicate input does not create duplicate transactions.

### 49.5 Learning Hint

- Learner requests a hint.
- Hint level matches active policy.
- Final answer is not revealed when forbidden.
- Hint usage is recorded as learning evidence.

### 49.6 Unknown Fact

- Player asks an NPC about an event the NPC did not observe.
- NPC states uncertainty or lack of knowledge.
- The system does not fabricate certainty.

### 49.7 Rumor Transfer

- NPC shares an unverified rumor.
- Listener receives rumor-class knowledge.
- Certainty does not become verified.
- Privacy rules remain intact.

### 49.8 Private Topic

- Player asks about private household information without trust.
- Topic is refused or redirected.
- Protected details do not appear in subtitles or logs.

### 49.9 Interruption by Danger

- Active conversation is interrupted by danger.
- Conversation closes or pauses according to safety policy.
- Participants react to danger.
- Continuation is created only when valid.

### 49.10 Save and Resume

- Conversation pauses in a resumable state.
- Game is saved and loaded.
- State is revalidated.
- Completed consequences are not repeated.

### 49.11 Schedule Transition

- NPC shift ends during conversation.
- Dialogue acknowledges the transition.
- Shop or service mode closes according to authority.
- NPC proceeds to the next schedule block.

### 49.12 NPC-to-NPC Ambient Exchange

- Two eligible NPCs meet.
- A bounded semantic exchange occurs.
- The exchange does not block critical work.
- Offstage summary is used beyond simulation range.

### 49.13 Relationship Conflict

- Player approaches an NPC after a harmful event.
- Greeting and topic access reflect conflict.
- Direct evidence outweighs general positive reputation.

### 49.14 Missing Localization

- A specialized localized line is unavailable.
- Runtime selects a safe fallback.
- Internal localization key is never displayed.
- Authoritative meaning remains correct.

### 49.15 Multi-Party Conversation

- Three participants join an eligible group.
- Turn authority remains singular.
- Private topics are excluded.
- Leaving range removes the participant safely.

---

## 50. Test Layers

### 50.1 Unit Tests

Cover:

- eligibility rules;
- authority ordering;
- knowledge classification;
- topic filtering;
- state transitions;
- cooldowns;
- deterministic selection;
- privacy checks;
- failure-code mapping.

### 50.2 Integration Tests

Cover:

- schedule integration;
- profession integration;
- merchant transaction projection;
- learning hint projection;
- relationship and reputation inputs;
- mission consequence requests;
- save/load recovery.

### 50.3 Scenario Tests

Cover full player and NPC flows across the validation scenarios.

### 50.4 Content Tests

Cover:

- missing responses;
- invalid semantic mappings;
- inaccessible choices;
- localization coverage;
- protected-topic leaks;
- contradictory variants;
- unreachable conversation branches.

### 50.5 Performance Tests

Cover:

- dense market crowds;
- multiple ambient conversations;
- rapid interaction requests;
- offstage simulation;
- long sessions with memory growth;
- repeated save/load.

---

## 51. Evidence Package

Production completion requires evidence containing:

- conversation authority matrix;
- eligibility test results;
- state-machine transition coverage;
- knowledge and privacy test results;
- merchant dialogue integration evidence;
- education dialogue integration evidence;
- NPC-to-NPC simulation evidence;
- save/load recovery evidence;
- localization fallback evidence;
- accessibility evidence;
- safety-policy evidence;
- performance measurements;
- known limitations;
- content version snapshot.

Screenshots alone are insufficient.

Evidence must demonstrate authoritative behavior and reproducibility.

---

## 52. Implementation Slices

Recommended implementation order:

### Slice 1 — Contract and State Machine

- conversation request/result contracts;
- participant model;
- state transitions;
- stable failures.

### Slice 2 — Eligibility and Topic Authority

- schedule checks;
- safety checks;
- knowledge classes;
- privacy rules;
- topic filtering.

### Slice 3 — Interactive Player Conversation

- greetings;
- player intents;
- choice projection;
- response selection;
- closing.

### Slice 4 — Profession, Merchant, and Education

- profession projection;
- merchant transaction commands;
- learning hint and assessment commands;
- authoritative result projection.

### Slice 5 — Relationship, Reputation, and Mood

- tone policy;
- topic depth;
- refusal and openness;
- direct evidence priority.

### Slice 6 — NPC-to-NPC and Rumors

- ambient semantic exchanges;
- rumor transfer;
- observer rules;
- offstage summary.

### Slice 7 — Persistence and Recovery

- save/load;
- interruption;
- continuation;
- time skip;
- idempotency.

### Slice 8 — Localization, Accessibility, and Validation

- language-light rendering;
- localization fallback;
- accessibility controls;
- evidence package;
- exit-gate verification.

---

## 53. Non-Goals

This guide does not authorize:

- free-form generative dialogue detached from world state;
- arbitrary mutation of inventory or economy;
- arbitrary mission completion;
- arbitrary mastery certification;
- hidden reputation changes without evidence;
- private-data disclosure;
- unlimited ambient simulation;
- real-world financial persuasion;
- physical interaction resolution;
- final population validation.

---

## 54. Production Exit Gate

15F is complete only when all conditions pass.

### Authority

- Conversation authority hierarchy is implemented.
- Dialogue cannot override stronger systems.
- Knowledge and privacy are enforced.

### Runtime

- Eligibility, start, turn, interruption, resume, and close states are explicit.
- Invalid transitions are rejected.
- Duplicate input is safe.

### Integration

- Schedule-aware behavior works.
- Profession dialogue reflects qualifications.
- Merchant dialogue reflects current economy state.
- Education dialogue follows learning policy.
- Relationship and reputation inputs are bounded.

### Experience

- Player intents are understandable.
- Language-light support exists.
- Busy and unavailable states are visible.
- Repetition is controlled.
- Accessibility requirements pass.

### Safety

- Child safety policy passes.
- Protected information is not leaked.
- Logs are redacted.
- Monetization pressure is absent.

### Continuity

- Save/load is safe.
- Interrupted conversations recover correctly.
- Time skip does not duplicate consequences.
- Content fallback is deterministic.

### Evidence

- Required automated tests pass.
- Scenario evidence exists.
- Performance evidence exists.
- Known limitations are documented.

No line count by itself proves completion.

The guide is considered production ready only when its authority, runtime, integration, safety, continuity, and evidence requirements are satisfied together.

---

## 55. Handoff to 15G — Interaction Rules

15F defines what participants may communicate and how conversational consequences are requested.

15G must define what participants may physically or operationally do to one another and to world objects.

The handoff boundary is:

```text
Conversation intent
  -> explicit consequence request
  -> interaction authority evaluation
  -> physical or operational result
  -> conversation projection of result
```

15G must consume:

- participant identity;
- active roles;
- profession authority;
- relationship context;
- safety state;
- conversation-origin correlation ID;
- requested interaction intent;
- world-object authority.

Conversation must never assume interaction success before 15G or another owning system confirms it.

---

## 56. Final Production Rule

A believable NPC does not need to say everything.

A believable NPC must say only what they can know, in a way that fits who they are, what they are doing, who is listening, and what the world currently permits.

The production rule is:

```text
Truth before variety.
Authority before convenience.
Intent before wording.
Safety before engagement.
Evidence before completion.
```
