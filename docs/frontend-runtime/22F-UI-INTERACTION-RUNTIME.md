# 22F — UI Interaction Runtime

## 1. Purpose

This document defines how user intent becomes safe, observable, recoverable frontend interaction in Math Learning World.

It governs:

- interaction ownership;
- event-to-intent mapping;
- focus and selection;
- form and command interaction;
- pending and uncertain state;
- gesture and keyboard behavior;
- modal and overlay rules;
- feedback and accessibility;
- gameplay interaction authority;
- interruption and recovery;
- interaction testing obligations.

---

## 2. Core Principle

> The UI must interpret user input into explicit intent before it changes application or gameplay state.

Raw clicks, taps, keys, and pointer movement are transport signals. They are not business meaning by themselves.

---

## 3. Interaction Flow

```text
physical input
  → platform event
  → interaction adapter
  → semantic user intent
  → feature controller/runtime
  → command, navigation, or local transition
  → projected feedback
```

This separation allows the same intent to be triggered by mouse, touch, keyboard, assistive technology, controller, or automation.

---

## 4. Interaction Ownership

Each feature module owns the interaction runtime for its workflow.

Examples:

- practice owns answer selection and submission;
- assessment owns item navigation and final submission;
- mentorship owns invitation actions;
- learner path owns goal and skill selection;
- gameplay owns target selection, pickup, placement, and tool intent.

A shared component may emit neutral events, but it must not absorb module-specific workflow policy.

---

## 5. Semantic Intents

Prefer explicit intent names:

```ts
type PracticeIntent =
  | { type: 'ANSWER_SELECTED'; itemId: ItemId; answerId: AnswerId }
  | { type: 'ANSWER_CLEARED'; itemId: ItemId }
  | { type: 'ANSWER_SUBMITTED'; itemId: ItemId }
  | { type: 'NEXT_REQUESTED' }
  | { type: 'SESSION_COMPLETION_REQUESTED' };
```

Avoid event handlers whose meaning exists only in implementation names such as `handleClick2` or `onThingChanged`.

---

## 6. Local, Application, and Domain Intent

Interaction runtime must distinguish:

### 6.1 Local UI intent

- open panel;
- focus field;
- expand explanation;
- move selection;
- show preview.

### 6.2 Application intent

- start practice session;
- submit answer;
- accept invitation;
- complete assessment;
- save learner preference.

### 6.3 Domain decision

- whether mastery is earned;
- whether a transition is allowed;
- whether a reward is granted;
- whether an assessment may be finalized.

The frontend owns the first category, invokes the second, and displays the result of the third.

---

## 7. Interaction State Machine

Complex interactions should be modeled as states and transitions.

```ts
type SubmissionState =
  | { status: 'editing' }
  | { status: 'confirming' }
  | { status: 'submitting'; commandId: string }
  | { status: 'confirmed'; resultId: string }
  | { status: 'rejected'; errorCode: string }
  | { status: 'uncertain'; commandId: string };
```

State machines prevent accidental duplicate transitions and make recovery testable.

---

## 8. One Primary Action

Each focused screen or step should expose one dominant primary action.

Secondary actions must be visually and semantically subordinate.

This principle is especially important for children, mobile screens, assessments, confirmations, and irreversible commands.

---

## 9. Action Availability

A disabled action must have a clear reason in runtime state.

Examples:

- required input missing;
- command already pending;
- session expired;
- resource version stale;
- action not permitted;
- network required;
- prerequisite not met.

Do not disable controls solely through hidden CSS or without an accessible explanation when the reason matters.

---

## 10. Duplicate Activation

The runtime must guard against duplicate activation caused by:

- double click;
- repeated tap;
- key repeat;
- slow network;
- browser resubmission;
- reconnect replay;
- multiple controls triggering the same command.

Protection may include:

- command state gates;
- idempotency keys;
- short local suppression windows;
- serialized mutations;
- operation identity.

Visual disabling alone is not sufficient.

---

## 11. Pending Feedback

When an action is pending, feedback should appear near the initiating control and preserve context.

The UI should communicate:

- what is happening;
- whether the user may continue elsewhere;
- whether cancel is possible;
- whether leaving the screen is safe.

Avoid replacing the entire screen with a spinner when only one action is pending.

---

## 12. Success Feedback

Success feedback should match the magnitude of the action.

Examples:

- inline state update for simple preference changes;
- clear completion projection for practice or assessment;
- durable receipt or reference for credits and submissions;
- navigation to a result route when the new state has its own location.

Do not show success before authoritative confirmation unless the state is explicitly labeled predicted.

---

## 13. Failure Feedback

Failures should preserve user work whenever safe.

A failure projection should answer:

- what could not be completed;
- whether input was preserved;
- whether retry is safe;
- whether the user must refresh or reauthenticate;
- whether the outcome is uncertain.

Raw backend messages are not automatically suitable user copy.

---

## 14. Uncertain Interaction Outcomes

When a submitted command may have reached the server but confirmation was lost:

- freeze duplicate logical submission;
- preserve command identity;
- show confirmation-pending state;
- query or retry using the same identity;
- reconcile final state;
- provide support correlation data when necessary.

The user must not be asked to blindly submit again.

---

## 15. Forms

Form runtime owns:

- draft values;
- touched and dirty state;
- client syntax validation;
- server validation projection;
- submit state;
- reset and recovery policy.

Business validation remains server authoritative.

---

## 16. Form Validation

Validation should occur at appropriate moments:

- syntax validation while editing when helpful;
- field validation on blur;
- full validation on submit;
- server validation after command execution.

Do not overwhelm children with errors before they have attempted an answer.

---

## 17. Draft Preservation

Meaningful drafts may be preserved across:

- accidental route change;
- browser refresh;
- temporary offline state;
- authentication refresh.

Draft persistence must be scoped, expiring, versioned, and cleared after confirmed completion.

Sensitive assessment content may require stricter policy.

---

## 18. Confirmation

Confirmation is required when an action is:

- destructive;
- irreversible;
- financially meaningful;
- likely to discard work;
- a final assessment submission;
- difficult to understand from the initiating control.

Confirmation should restate the consequence, not merely ask “Are you sure?”.

---

## 19. Modal and Overlay Authority

A modal represents a temporary interaction layer, not a substitute route for every workflow.

Use a modal when:

- context must remain visible;
- the task is short and bounded;
- Back/close semantics are obvious;
- deep linking is unnecessary.

Use a route when:

- the task has durable location;
- refresh/deep link matters;
- the flow contains several steps;
- browser history should represent progress.

---

## 20. Modal Stack Rules

Avoid stacked modal workflows.

The overlay runtime should define:

- one active blocking modal by default;
- focus trap;
- escape/back behavior;
- scroll locking;
- restoration of prior focus;
- safe mobile viewport handling.

Nested nonblocking popovers may exist, but their ownership and dismissal order must be deterministic.

---

## 21. Focus Runtime

Focus is part of application state.

After interactions, focus should move predictably:

- to the first invalid field after failed submit;
- to a success heading after major completion;
- back to the trigger after closing an overlay;
- to the newly active item after keyboard navigation;
- to the route root after meaningful navigation.

Never remove visible focus without providing an equivalent accessible indicator.

---

## 22. Keyboard Interaction

Every core workflow must support keyboard use where the platform supports it.

Rules:

- Enter activates the expected primary action only when safe;
- Space activates button-like controls;
- arrow keys move within composite widgets;
- Escape dismisses temporary layers where safe;
- Tab order follows visual and semantic order;
- shortcuts must not conflict with text input.

Keyboard shortcuts should be discoverable and optional.

---

## 23. Touch and Pointer Interaction

Touch targets must be appropriately sized and spaced.

The runtime should account for:

- tap versus drag threshold;
- long press;
- pointer cancellation;
- multi-touch rejection where unsupported;
- viewport safe areas;
- accidental edge gestures;
- coarse versus fine pointer capability.

Do not rely on hover for required information or actions.

---

## 24. Gesture Semantics

Gestures must map to explicit intent and have an accessible alternative.

Examples:

- swipe between practice items;
- drag to place a game object;
- pinch to zoom a world view;
- long press for context information.

A destructive gesture should require confirmation or easy undo.

---

## 25. Undo

Undo is preferable to confirmation for fast, low-risk, reversible actions.

Undo requires:

- clear rollback authority;
- bounded time window;
- stable operation identity;
- conflict handling if server state changed;
- accessible activation.

Do not offer undo when the action cannot actually be reversed reliably.

---

## 26. Selection Model

Selection state must identify:

- selected entity;
- selection source;
- selection confidence where inferred;
- whether selection is user-locked;
- fallback when entity disappears.

This is especially important in gameplay, lists, diagrams, and skill maps.

---

## 27. Automatic Selection

Automatic selection may reduce repetitive user input, but it must obey clear priority rules.

Example gameplay priority:

```text
explicit user selection
  > immediate valid interaction target
  > resumable placement intent
  > last safe tool selection
  > neutral fallback
```

Automatic selection should not fight a recent explicit user choice.

---

## 28. Gameplay Interaction Runtime

Gameplay interaction translates player movement and context into semantic intents such as:

```ts
type GameplayIntent =
  | { type: 'MOVE_REQUESTED'; direction: Direction }
  | { type: 'PICKUP_REQUESTED'; targetId: WorldObjectId }
  | { type: 'PLACEMENT_REQUESTED'; materialId: MaterialId; tile: Tile }
  | { type: 'TOOL_SELECTED'; toolId: ToolId; source: SelectionSource }
  | { type: 'INTERACTION_CANCELED' };
```

The runtime owns interaction arbitration, not learning mastery decisions.

---

## 29. Interaction Target Scoring

When several targets are possible, scoring must be deterministic and explainable.

Possible factors:

- distance;
- front-facing tile alignment;
- line of sight;
- target type;
- current mission relevance;
- explicit user lock;
- current placement inventory;
- recent interaction;
- hysteresis to prevent flicker.

Tie-breaking must be stable.

---

## 30. Pickup and Placement Arbitration

Pickup and placement may have different interaction distances and priorities.

A recommended policy:

```text
if explicit tool lock is active:
  honor lock while valid
else if pickup target is within pickup range:
  select pickup intent
else if resumable material remains and placement tile is valid:
  restore placement intent
else:
  use safe fallback
```

Walking out of pickup range should restore the previous valid placement intent when material remains.

---

## 31. Interaction Hysteresis

Automatic targeting must avoid rapid switching near boundaries.

Use hysteresis such as:

- enter range smaller than exit range;
- minimum target hold duration;
- score margin before replacing current target;
- recent explicit selection cooldown;
- stable front-tile preference.

This prevents UI flicker and control instability.

---

## 32. Prediction and Confirmation

Gameplay may show predicted outcomes such as placement previews.

Predicted state must be visually distinguishable and replaced by confirmed world state after the authoritative transition.

A rejected prediction should restore a valid prior intent rather than leaving a stale tool or target selected.

---

## 33. Interaction Queue

Sequential interaction requests may use a queue when immediate execution is unsafe.

The queue must define:

- ordering;
- deduplication;
- cancellation;
- expiration;
- target revalidation;
- behavior after one request fails.

Do not execute a queued interaction against an entity that is no longer valid.

---

## 34. Interruption

Interactions may be interrupted by:

- navigation;
- modal opening;
- session expiration;
- incoming authoritative state;
- connectivity loss;
- world reset;
- device backgrounding.

Each interaction state must define whether it is canceled, paused, persisted, or reconciled.

---

## 35. Animation Boundary

Animation presents state transitions but does not own their truth.

Business completion must not depend solely on animation-end events.

The runtime must handle:

- reduced motion;
- skipped animation;
- tab backgrounding;
- interrupted animation;
- slow devices.

---

## 36. Feedback Channels

Feedback may use:

- visual state;
- sound;
- haptic response;
- text;
- iconography;
- motion.

Critical meaning must never rely on only one channel.

Sound and haptics must respect user and platform preferences.

---

## 37. Child-Centered Interaction

For younger learners:

- controls should be concrete and consistent;
- required text should be minimal;
- mistakes should be recoverable;
- feedback should teach rather than shame;
- repeated failure should trigger support, not random difficulty changes;
- interaction complexity should grow with mastery.

The runtime must not manipulate engagement through misleading rewards or hidden penalties.

---

## 38. Authorization Changes During Interaction

If access changes while an interaction is active:

- stop new protected commands;
- preserve safe local draft where policy allows;
- reconcile pending commands;
- explain the context change;
- route to a safe destination.

Hidden controls are not an authorization mechanism.

---

## 39. Telemetry

Interaction telemetry may record:

- intent type;
- interaction source;
- pending duration;
- failure category;
- recovery path;
- target-switch frequency;
- duplicate suppression;
- accessibility input mode.

Do not record answer content, sensitive free text, tokens, or unnecessary child identifiers.

---

## 40. Testing Obligations

Tests must cover:

- platform-event to semantic-intent mapping;
- duplicate activation;
- pending, success, rejection, and uncertainty;
- form validation and draft preservation;
- modal focus and dismissal;
- keyboard and touch parity;
- action availability reasons;
- undo boundaries;
- automatic selection priority;
- target scoring and tie-breaking;
- pickup/placement distance separation;
- hysteresis;
- restoration of placement intent after leaving pickup range;
- queued interaction revalidation;
- interrupted animation;
- reduced motion;
- session expiration during interaction.

---

## 41. Non-Negotiable Rules

1. Raw platform events are translated into semantic intent.
2. Feature modules own workflow interaction policy.
3. Domain decisions are never inferred from UI state alone.
4. Duplicate activation is prevented beyond visual disabling.
5. Predicted, pending, confirmed, rejected, and uncertain states remain distinguishable.
6. Core interactions support accessible alternatives.
7. Modal stacks and focus behavior are deterministic.
8. Automatic selection respects explicit user intent and stable priority.
9. Gameplay targeting uses deterministic scoring and hysteresis.
10. Animation and feedback present state; they do not define authority.

---

## 42. Completion Standard

UI Interaction Runtime is architecturally complete when:

- input is mapped to typed semantic intent;
- local, application, and domain responsibilities are separated;
- forms, commands, confirmation, and uncertainty have explicit states;
- focus, keyboard, touch, gestures, and overlays are governed;
- duplicate activation and interruption are safe;
- automatic targeting and gameplay arbitration are deterministic;
- pickup and placement behavior supports stable intent restoration;
- feedback is accessible and child-appropriate;
- interaction telemetry respects privacy;
- contract, runtime, and operational tests can verify the complete interaction loop.
