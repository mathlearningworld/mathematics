# 17C — Runtime Event Contracts

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 17C — Runtime Event Contracts  
**Document Type:** Runtime Architecture / Event Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/runtime/17A-LEARNING-RUNTIME-CORE.md`  
**Module Authority:** `docs/runtime/17B-SPECIALIZED-LEARNING-RUNTIME-MODULES.md`  
**Upstream Authorities:** Learning Mission System Blueprint 16A–16J  
**Downstream Consumers:** Phase 17D recovery and snapshot architecture, Phase 18 domain model, application command handlers, event persistence, projections, analytics, audit tooling, API contracts, frontend runtime

---

## 1. Purpose

This guide defines the authoritative event language used by `LearningRuntime` and every specialized runtime module.

The central doctrine is:

> A runtime event is immutable evidence that an authorized transition occurred; it is not an instruction, a mutable record, a UI notification, or an analytics interpretation.

A conforming event architecture must answer:

> What happened, to which aggregate, under which authority, at which version, because of which command or prior event, under which policy versions, in what order, with what replay and compatibility guarantees, and with what evidence for audit and recovery?

Runtime events form the durable causal history of the learning lifecycle. They must therefore remain explicit, deterministic, traceable, replayable, privacy-aware, and evolution-safe.

---

## 2. Architectural Position

```text
Learning Mission System Blueprint (16A–16J)
        ↓
Learning Runtime Core (17A)
        ↓
Specialized Runtime Modules (17B)
        ↓
Runtime Event Contracts (17C)
        ↓
Recovery and Snapshot Architecture (17D)
        ↓
Domain Model (18)
        ↓
Application / Persistence / Projection Infrastructure
```

Phase 17C defines the event contract shared by all runtime boundaries.

It does not define database tables, broker products, serialization libraries, transport protocols, or implementation frameworks.

---

## 3. Event Authority Boundary

### 3.1 Phase 17C owns

- runtime event identity;
- event naming rules;
- event envelope fields;
- aggregate identity and version semantics;
- event schema versioning;
- correlation and causation rules;
- command-to-event linkage;
- event ordering guarantees;
- timestamp semantics;
- actor and tenant attribution;
- policy-version attribution;
- privacy classification;
- replay behavior;
- compatibility and upcasting rules;
- publication status semantics;
- duplicate detection semantics;
- audit requirements;
- event validation rules;
- event failure taxonomy;
- module event-family boundaries.

### 3.2 Phase 17C does not own

- command admission;
- transition authorization;
- cognitive diagnosis algorithms;
- mission planning algorithms;
- mastery or remediation policy content;
- database schema;
- message broker configuration;
- projection query models;
- analytics metric definitions;
- frontend notification behavior;
- human-readable parent or teacher wording.

An event records an authorized result. It never grants authority by itself.

---

## 4. Event Doctrine

Every runtime event must satisfy all of the following:

1. **Past tense** — it records something that has already happened.
2. **Immutable** — it is never edited after acceptance.
3. **Aggregate-scoped** — it belongs to exactly one aggregate stream.
4. **Versioned** — it advances aggregate history by exactly one version.
5. **Causally linked** — it identifies the command or event that caused it.
6. **Deterministic** — replaying accepted events yields the same aggregate state.
7. **Policy-attributed** — consequential decisions identify the policy versions used.
8. **Tenant-qualified** — event ownership is explicit and cannot be inferred globally.
9. **Privacy-classified** — sensitive payload handling is declared.
10. **Schema-evolvable** — future consumers can interpret historical events safely.

Events must never be treated as mutable rows representing current truth.

Current truth is derived by applying the accepted event stream under the owning aggregate contract.

---

## 5. Canonical Runtime Event Envelope

Every accepted runtime event uses the following conceptual envelope:

```ts
interface RuntimeEventEnvelope<Payload> {
  eventId: string;
  eventName: string;
  eventSchemaVersion: number;

  aggregateType: string;
  aggregateId: string;
  aggregateVersion: number;

  runtimeId: string;
  tenantId: string;
  learnerId?: string;
  moduleId: string;

  commandId?: string;
  correlationId: string;
  causationId: string;

  occurredAt: string;
  recordedAt: string;

  actor: RuntimeActorRef;
  policyVersionSet: PolicyVersionSet;
  privacyClass: PrivacyClass;

  payload: Payload;
  metadata: RuntimeEventMetadata;
}
```

This is an architectural contract, not a mandatory literal TypeScript declaration.

Implementations may use different language constructs but may not weaken the semantics.

---

## 6. Envelope Field Semantics

### 6.1 `eventId`

A globally unique immutable identifier for one event occurrence.

Requirements:

- generated once;
- never reused;
- stable across retries after durable acceptance;
- used for duplicate detection;
- never derived solely from payload hashing.

### 6.2 `eventName`

A stable past-tense semantic name.

Examples:

```text
LearningRuntimeStarted
TargetActivated
DiagnosisCompleted
MissionPlanned
WorldActivityStarted
EvidenceSubmitted
AssessmentCompleted
MasteryEvaluationCompleted
RemediationActivated
ProjectionPublished
AnalyticsEmissionRecorded
```

Prohibited examples:

```text
StartRuntime
RunDiagnosis
UpdateMission
SaveEvidence
ProcessMastery
```

Commands are imperative. Events are facts.

### 6.3 `eventSchemaVersion`

The version of the event payload contract, beginning at `1`.

It is independent from aggregate version.

Changing event payload shape may require a new schema version even when aggregate semantics remain unchanged.

### 6.4 `aggregateType`

The authoritative aggregate family that owns the event stream.

Examples:

```text
LEARNING_RUNTIME
TARGET_RUNTIME
DIAGNOSIS_RUNTIME
MISSION_RUNTIME
WORLD_ACTIVITY_RUNTIME
EVIDENCE_RUNTIME
ASSESSMENT_RUNTIME
SUPPORT_RUNTIME
MASTERY_RUNTIME
PROGRESSION_RUNTIME
REMEDIATION_RUNTIME
PROJECTION_RUNTIME
ANALYTICS_EMISSION_RUNTIME
```

### 6.5 `aggregateId`

The immutable identifier of the owning aggregate instance.

No event may belong to more than one aggregate stream.

Cross-aggregate consequences require separate events in separate streams connected through correlation and causation.

### 6.6 `aggregateVersion`

The version reached after applying this event.

Rules:

- first accepted event is version `1`;
- each accepted event increments exactly by `1`;
- no gaps are permitted inside one aggregate stream;
- no two accepted events may share the same aggregate version;
- optimistic concurrency compares the expected prior version with the current persisted version.

### 6.7 `runtimeId`

The top-level `LearningRuntime` identity coordinating the current learning flow.

Specialized module events must carry the owning top-level runtime reference.

### 6.8 `tenantId`

The explicit ownership and isolation boundary.

Events without a qualified tenant are invalid, except narrowly defined system-bootstrap events outside the learning lifecycle.

### 6.9 `learnerId`

The learner affected by the event when applicable.

It may be absent only for events that genuinely do not identify a learner, such as a system-level policy publication event outside this runtime contract.

### 6.10 `moduleId`

The specialized runtime module that produced the event.

Examples:

```text
learning-runtime
target-runtime
diagnosis-runtime
mission-planning-runtime
world-activity-runtime
evidence-runtime
assessment-runtime
support-runtime
mastery-runtime
progression-runtime
remediation-runtime
projection-runtime
analytics-emission-runtime
```

### 6.11 `commandId`

The unique command that directly produced the event, when the event originated from a command.

All events emitted atomically by one command share the same `commandId`.

### 6.12 `correlationId`

The identity of the complete causal business flow.

A single learner flow may include many commands and events while preserving one correlation chain.

### 6.13 `causationId`

The immediate cause of this event.

Rules:

- command-originated event: `causationId = commandId`;
- event-triggered reaction: `causationId = source eventId`;
- scheduled runtime action: `causationId = scheduler invocation id`;
- recovery action: `causationId = recovery command or finding id`.

### 6.14 `occurredAt`

The logical time at which the domain fact occurred.

It must be supplied by the qualified runtime clock and remain stable during retries.

### 6.15 `recordedAt`

The infrastructure time at which the event became durably accepted.

`recordedAt` may be later than `occurredAt`.

Replay must use `occurredAt` for domain semantics and may use `recordedAt` only for infrastructure analysis.

### 6.16 `actor`

The actor under whose authority the transition occurred.

```ts
interface RuntimeActorRef {
  actorType: 'LEARNER' | 'PARENT' | 'TEACHER' | 'MENTOR' | 'SYSTEM' | 'ADMIN';
  actorId: string;
  authorityScope: string[];
}
```

Actor identity must not be inferred from transport authentication after the event is recorded.

### 6.17 `policyVersionSet`

The complete set of consequential policy versions used to make the decision.

Examples:

- curriculum graph version;
- diagnosis policy version;
- mission generation policy version;
- assessment rubric version;
- mastery policy version;
- remediation policy version;
- consent policy version;
- projection policy version.

### 6.18 `privacyClass`

One of:

```text
PUBLIC_RUNTIME
INTERNAL_RUNTIME
LEARNER_SENSITIVE
EDUCATIONAL_RECORD
GUARDIAN_RESTRICTED
ANALYTICS_RESTRICTED
```

Privacy classification governs projection, retention, export, masking, and analytics eligibility.

### 6.19 `payload`

The event-specific immutable fact data.

Payloads must contain facts needed to interpret the event without requiring mutable external state for historical meaning.

Payloads must not duplicate entire aggregate snapshots unless the event semantics genuinely require it.

### 6.20 `metadata`

Non-domain operational context.

```ts
interface RuntimeEventMetadata {
  traceId?: string;
  source?: string;
  replayMode?: boolean;
  recoveryMode?: boolean;
  locale?: string;
  consentScope?: string[];
  checksum?: string;
}
```

Metadata must not contain hidden business decisions.

---

## 7. Command-to-Event Contract

The authoritative flow is:

```text
Command Received
        ↓
Identity / Tenant / Authority Qualification
        ↓
Idempotency Check
        ↓
Aggregate Load
        ↓
Expected Version Check
        ↓
Command Admission
        ↓
Invariant Evaluation
        ↓
Deterministic Decision
        ↓
Event Construction
        ↓
Atomic Event Acceptance
        ↓
Aggregate Version Advance
        ↓
Publication / Projection / Follow-up Scheduling
```

A command may produce:

- zero events because it was rejected;
- one event;
- multiple events accepted atomically under one aggregate transaction.

A rejected command must never produce a success event.

A duplicate command that has already succeeded must return the previously accepted result rather than create semantically duplicate events.

---

## 8. Event Families by Runtime Module

### 8.1 Learning Runtime

Representative events:

```text
LearningRuntimeStarted
LearningRuntimeSuspended
LearningRuntimeResumed
LearningRuntimeCompleted
LearningRuntimeRecoveryEntered
LearningRuntimeRecovered
LearningRuntimeAborted
```

### 8.2 Target Runtime

```text
LearningTargetActivated
LearningTargetChanged
LearningTargetSatisfied
LearningTargetReleased
```

### 8.3 Diagnosis Runtime

```text
DiagnosisStarted
DiagnosticEvidenceRequested
DiagnosticEvidenceAccepted
DiagnosisCompleted
DiagnosisInconclusive
DiagnosisExpired
```

### 8.4 Mission Planning Runtime

```text
MissionPlanningStarted
MissionCandidateGenerated
MissionPlanSelected
MissionPlanned
MissionPlanRejected
MissionReplanned
```

### 8.5 World Activity Runtime

```text
WorldActivityBound
WorldActivityStarted
WorldInteractionRecorded
WorldActivityPaused
WorldActivityCompleted
WorldActivityAbandoned
```

### 8.6 Evidence Runtime

```text
EvidenceCycleOpened
EvidenceRequested
EvidenceSubmitted
EvidenceAccepted
EvidenceRejected
EvidenceSuperseded
EvidenceCycleClosed
```

### 8.7 Assessment Runtime

```text
AssessmentStarted
AssessmentCriterionEvaluated
AssessmentCompleted
AssessmentInconclusive
AssessmentInvalidated
```

### 8.8 Support Runtime

```text
SupportNeedDetected
HintOffered
HintAccepted
HintDeclined
MentorSupportRequested
MentorSupportCompleted
SupportEscalated
```

### 8.9 Mastery Runtime

```text
MasteryEvaluationStarted
MasteryEvidenceQualified
MasteryEvaluationCompleted
MasteryGranted
MasteryMaintained
MasteryConfidenceReduced
MasteryRevoked
```

### 8.10 Progression Runtime

```text
ProgressionEvaluationStarted
ProgressionUnlocked
ProgressionDeferred
ProgressionBlocked
ProgressionPathChanged
```

### 8.11 Remediation Runtime

```text
RemediationNeedConfirmed
RemediationPlanCreated
RemediationActivated
RemediationStepCompleted
RemediationReassessed
RemediationCompleted
RemediationEscalated
```

### 8.12 Projection Runtime

```text
ProjectionBuildRequested
ParentProjectionPublished
TeacherProjectionPublished
ProjectionWithheld
ProjectionCorrected
```

### 8.13 Analytics Emission Runtime

```text
AnalyticsEmissionQualified
AnalyticsEmissionRecorded
AnalyticsEmissionWithheld
GovernanceFindingRaised
```

These names are representative contract families. Exact payload contracts are defined downstream and must preserve the authority boundaries established here.

---

## 9. Ordering Contract

### 9.1 Aggregate-local ordering

Within one aggregate stream, `aggregateVersion` is the only authoritative order.

Infrastructure timestamps must not replace aggregate version ordering.

### 9.2 Cross-aggregate ordering

No total global ordering is assumed.

Cross-aggregate reasoning uses:

- `correlationId`;
- `causationId`;
- event-specific references;
- durable publication checkpoints.

### 9.3 Concurrent reactions

Two modules may react to the same source event independently.

Their resulting events may be concurrent and must not rely on arrival order unless an explicit orchestration rule exists.

### 9.4 Late delivery

Consumers must tolerate delivery after later events from another aggregate.

Consumers must use event identity and aggregate version, not delivery time, to determine processing correctness.

---

## 10. Atomicity Contract

When one command emits multiple events for the same aggregate:

- all events are accepted atomically;
- versions are contiguous;
- either the full set is durable or none is durable;
- publication occurs only after durable acceptance;
- retries return the accepted event set.

Cross-aggregate writes are not assumed atomic.

Cross-aggregate workflows use explicit orchestration, reaction events, and recovery rules rather than distributed transaction assumptions.

---

## 11. Idempotency Contract

Every command capable of producing events must have an idempotency identity.

Minimum key scope:

```text
tenantId + aggregateType + aggregateId + commandId
```

Rules:

1. The same command identity and semantically identical command may return the prior result.
2. The same command identity with different semantic content must be rejected.
3. Publication retries must not create new runtime events.
4. Projection retries must not mutate the event stream.
5. Consumer duplicate delivery must be safe.
6. Event deduplication uses `eventId`, not payload equality.

---

## 12. Correlation and Causation Contract

A valid causal chain may look like:

```text
StartLearningRuntime command
  └── LearningRuntimeStarted event
        └── ActivateLearningTarget command
              └── LearningTargetActivated event
                    └── StartDiagnosis command
                          └── DiagnosisStarted event
                                └── CompleteDiagnosis command
                                      └── DiagnosisCompleted event
```

All items share the same `correlationId`.

Each child identifies its immediate parent using `causationId`.

The chain must remain inspectable without relying on log text.

---

## 13. Policy Attribution Contract

Any event representing a consequential learning decision must record all policy versions necessary to reproduce or explain that decision.

Examples:

- `DiagnosisCompleted` records diagnosis policy and curriculum graph versions;
- `MissionPlanned` records mission generation and world-binding policy versions;
- `AssessmentCompleted` records rubric and evidence qualification versions;
- `MasteryGranted` records mastery policy and qualified evidence basis;
- `RemediationPlanCreated` records remediation policy and diagnosis basis;
- projection events record projection policy and consent versions.

A policy identifier without a version is insufficient.

---

## 14. Replay Contract

Replay reconstructs aggregate state from accepted historical events.

During replay:

- no new runtime event is produced;
- no external side effect is executed;
- no notification is sent;
- no analytics emission is duplicated;
- no current policy silently replaces historical policy semantics;
- event application is deterministic;
- unknown incompatible event versions stop replay safely.

Conceptual aggregate contract:

```ts
interface ReplayableAggregate<State, Event> {
  initialState(): State;
  apply(state: State, event: Event): State;
}
```

Event application must not query mutable external services.

---

## 15. Schema Evolution Contract

### 15.1 Compatible additions

A field may be added to an event schema when:

- older consumers can ignore it;
- it does not change existing field meaning;
- a safe default exists for historical events;
- schema validation remains explicit.

### 15.2 Breaking changes

A new `eventSchemaVersion` is required when:

- a field meaning changes;
- a required field is introduced without a historical default;
- an enum changes semantic interpretation;
- payload structure changes incompatibly;
- privacy classification changes interpretation;
- historical replay would produce a different state.

### 15.3 Event names are stable

Do not rename an accepted historical event merely for stylistic preference.

A genuinely new semantic fact receives a new event name.

### 15.4 Upcasting

Historical events may be transformed into the current in-memory contract through deterministic upcasters.

Upcasters must:

- be pure;
- be version-specific;
- preserve historical meaning;
- never access mutable external state;
- never overwrite the durable original event;
- be covered by replay tests.

### 15.5 Downcasting

Downcasting is not an authoritative runtime mechanism.

Older consumers should be upgraded or consume a stable projection contract.

---

## 16. Event Immutability and Correction

Accepted events are never edited or deleted to correct business meaning.

Corrections use new compensating or superseding events.

Examples:

```text
EvidenceAccepted
        ↓
EvidenceInvalidated

AssessmentCompleted
        ↓
AssessmentInvalidated

ParentProjectionPublished
        ↓
ProjectionCorrected
```

The original fact remains part of the audit history.

Privacy-driven deletion or cryptographic erasure is an infrastructure and governance concern and must preserve legally required audit semantics without pretending the original event never existed.

---

## 17. Publication Contract

Durable event acceptance and external publication are separate states.

Authoritative sequence:

```text
Event accepted in aggregate transaction
        ↓
Publication record created atomically
        ↓
Publisher delivers event
        ↓
Consumer acknowledges or safely retries
```

Requirements:

- no event is published before durable acceptance;
- publication retries preserve the same `eventId`;
- publication failure does not roll back accepted runtime truth;
- unpublished accepted events are recoverable;
- consumer processing is idempotent;
- broker delivery order is not treated as universal causal order.

The outbox pattern is a valid implementation, but this architecture does not mandate a specific product or table design.

---

## 18. Projection Contract

Projections consume runtime events but do not own runtime truth.

Projection rules:

- projections may be rebuilt from events;
- projection lag does not invalidate accepted runtime events;
- projection failure must not rewrite the aggregate stream;
- projection checkpoints identify the last processed event or stream version;
- projection corrections remain traceable;
- learner-sensitive events must respect consent and privacy rules;
- parent and teacher projections use owning projection policy, not raw event exposure.

A query model is a derived view, not an event store substitute.

---

## 19. Analytics Contract

Analytics may consume qualified runtime events under 16J governance.

Analytics consumers must not:

- declare mastery;
- alter runtime state;
- reinterpret historical event payloads silently;
- bypass consent classification;
- create causal runtime events directly without an authorized command boundary;
- treat missing events as learner failure without data-quality qualification.

Analytics-derived findings are separate governed artifacts.

If a finding leads to runtime action, an authorized command must enter the normal command pipeline.

---

## 20. Privacy and Data Minimization

Event payloads must contain only data required for durable semantic history.

Prohibited practices:

- storing unnecessary free-form learner text;
- embedding full parent or teacher profiles;
- embedding credentials or access tokens;
- duplicating raw media when a governed evidence reference is sufficient;
- adding analytics convenience fields without runtime need;
- hiding sensitive data inside unclassified metadata.

Sensitive evidence should be represented through governed references where possible.

---

## 21. Event Validation Contract

Before acceptance, every event must pass:

### 21.1 Structural validation

- required fields present;
- identifiers non-empty;
- schema version recognized;
- payload matches the named event schema;
- timestamps valid;
- enum values recognized.

### 21.2 Identity validation

- tenant matches aggregate ownership;
- runtime reference is valid;
- learner reference matches runtime where required;
- actor scope is sufficient;
- module owns the event family.

### 21.3 Version validation

- expected prior aggregate version matches;
- new version increments exactly once;
- event schema version is supported;
- policy versions are qualified.

### 21.4 Causality validation

- correlation identity exists;
- causation identity is qualified;
- command identity matches execution context;
- duplicate event identity does not already exist with conflicting content.

### 21.5 Privacy validation

- privacy class is present;
- payload complies with the class;
- consent scope permits the event data;
- prohibited sensitive fields are absent.

An event failing validation is never accepted as runtime history.

---

## 22. Stable Failure Taxonomy

Representative contract failures:

```text
EVENT_NAME_INVALID
EVENT_SCHEMA_VERSION_UNSUPPORTED
EVENT_PAYLOAD_INVALID
EVENT_ID_CONFLICT
EVENT_DUPLICATE_ACCEPTED
AGGREGATE_IDENTITY_MISMATCH
AGGREGATE_VERSION_CONFLICT
AGGREGATE_VERSION_GAP
RUNTIME_REFERENCE_MISMATCH
TENANT_IDENTITY_MISMATCH
LEARNER_IDENTITY_MISMATCH
MODULE_EVENT_AUTHORITY_VIOLATION
COMMAND_CAUSATION_MISMATCH
CORRELATION_ID_MISSING
CAUSATION_ID_MISSING
POLICY_VERSION_MISSING
PRIVACY_CLASS_MISSING
PRIVACY_SCOPE_VIOLATION
EVENT_PUBLICATION_PENDING
EVENT_PUBLICATION_FAILED
EVENT_REPLAY_INCOMPATIBLE
EVENT_UPCAST_FAILED
EVENT_CHECKSUM_MISMATCH
```

Failure codes are stable machine contracts.

Human-readable messages may evolve independently.

---

## 23. Determinism Rules

Event production must be deterministic with respect to:

- accepted command;
- loaded aggregate state;
- explicit runtime context;
- explicit policy versions;
- qualified runtime clock;
- qualified identifier generator.

Event production must not depend implicitly on:

- system-local timezone;
- random values without injected deterministic authority;
- mutable global configuration;
- unversioned policy lookup;
- UI state;
- asynchronous arrival order from unrelated aggregates;
- current database time during replay.

---

## 24. Snapshot Interaction Boundary

Snapshots accelerate aggregate loading but do not replace events as causal history.

A valid snapshot must identify:

- aggregate type;
- aggregate id;
- aggregate version included;
- snapshot schema version;
- policy interpretation requirements where applicable;
- checksum or integrity proof;
- creation time.

Events after the snapshot version are applied in order.

Snapshot corruption or incompatibility must fall back to replay when possible.

Detailed recovery and snapshot rules belong to Phase 17D.

---

## 25. Cross-Module Reaction Rules

A specialized runtime module may not directly mutate another module's state.

Allowed interaction:

```text
Module A produces accepted event
        ↓
LearningRuntime or authorized orchestrator observes event
        ↓
Authorized command is issued to Module B
        ↓
Module B admits or rejects command
        ↓
Module B produces its own event
```

Prohibited interaction:

```text
AssessmentRuntime directly edits MasteryRuntime state
MissionRuntime directly inserts EvidenceRuntime rows
Analytics consumer directly marks progression complete
Projection failure rewrites learner mastery
```

This preserves module autonomy and causal traceability.

---

## 26. Audit Contract

For every consequential event, auditors must be able to determine:

- who or what initiated the change;
- which command was admitted;
- which aggregate and version changed;
- which module owned the decision;
- which policies governed the decision;
- which prior event or command caused it;
- when the fact occurred and when it was recorded;
- whether recovery or replay mode was involved;
- which privacy rules applied;
- whether publication and projections completed.

Logs may assist investigation but are not substitutes for the event audit envelope.

---

## 27. Observability Contract

Operational telemetry may include:

- event acceptance latency;
- publication lag;
- projection lag;
- replay duration;
- duplicate delivery count;
- version conflict count;
- upcast failure count;
- privacy rejection count;
- unpublished event backlog;
- correlation-chain completion time.

Telemetry must reference event identities safely and must not expose learner-sensitive payloads unnecessarily.

---

## 28. Testing Contract

### 28.1 Event schema tests

Verify:

- every named event has a registered payload schema;
- schema versions are explicit;
- unknown fields follow declared policy;
- invalid payloads fail deterministically.

### 28.2 Aggregate version tests

Verify:

- version begins at one;
- increments exactly once per event;
- conflicts are rejected;
- gaps are rejected;
- duplicate commands do not advance version.

### 28.3 Causality tests

Verify:

- command and event linkage;
- correlation propagation;
- causation chains;
- event-triggered command identity.

### 28.4 Replay tests

Verify:

- replay reconstructs identical state;
- replay causes no side effects;
- historical schema versions upcast safely;
- incompatible events stop safely.

### 28.5 Publication tests

Verify:

- no publication before commit;
- retry preserves event identity;
- duplicate delivery is safe;
- unpublished events recover.

### 28.6 Privacy tests

Verify:

- classification is mandatory;
- restricted payloads are blocked;
- consent scope is enforced;
- analytics receives only qualified events.

---

## 29. Minimum Event Registry

Implementation must maintain a versioned registry containing at least:

```text
Event name
Owning module
Aggregate type
Current schema version
Historical schema versions
Payload validator
Upcasters
Privacy class default
Retention class
Replay handler
Projection consumers
Analytics eligibility
Deprecation status
```

The registry is a contract inventory, not a mutable source of runtime business policy.

---

## 30. Prohibited Designs

The following designs violate Phase 17C:

- generic `Event` objects with untyped arbitrary payloads;
- events named as commands;
- editing historical events;
- one event belonging to multiple aggregate streams;
- relying on timestamps instead of aggregate versions;
- omitting tenant identity;
- hiding policy versions in logs;
- publishing before durable acceptance;
- treating broker order as global order;
- replay that calls external services;
- analytics that mutates runtime state;
- projections used as authoritative write state;
- silent payload reinterpretation;
- unversioned breaking schema changes;
- direct cross-module state mutation;
- using event payload hashes as the only event identity;
- storing unrestricted sensitive data for convenience.

---

## 31. Initial Implementation Slice

The first implementation slice should remain intentionally narrow.

Recommended scope:

1. Define the canonical event envelope.
2. Define stable identity value objects.
3. Define an event registry.
4. Implement one `LearningRuntimeStarted` event.
5. Implement one specialized event such as `LearningTargetActivated`.
6. Enforce aggregate version increments.
7. Enforce command idempotency.
8. Persist accepted events atomically with an outbox record.
9. Replay one aggregate from version zero.
10. Verify duplicate publication safety.

Do not begin with all event families simultaneously.

The purpose of the first slice is to prove the common contract end to end.

---

## 32. Verification Gates

### Gate A — Repository Gate

Evidence required:

- event envelope contract;
- event registry contract;
- naming and ownership rules;
- schema versioning rules;
- aggregate version rules;
- causation and correlation rules;
- replay and publication rules;
- privacy and audit rules;
- stable failure taxonomy;
- initial implementation slice definition.

### Gate B — Runtime Gate

Evidence required:

- schema validation executes;
- aggregate version conflict test passes;
- duplicate command test passes;
- event replay test passes;
- publication retry test passes;
- upcaster test passes;
- privacy rejection test passes.

### Gate C — Operational Gate

Evidence required:

```text
Client command
    → API boundary
    → Runtime admission
    → Aggregate load
    → Event acceptance
    → Durable event store
    → Outbox publication
    → Projection update
    → Query response
    → Replay / recovery verification
```

Repository completeness must not be confused with runtime or operational completion.

---

## 33. Completion Criteria

Phase 17C is architecturally complete when:

- all runtime modules share one canonical event envelope;
- event identity and aggregate version semantics are explicit;
- naming and module ownership rules are explicit;
- command, correlation, and causation linkage is explicit;
- ordering and atomicity limits are explicit;
- idempotency and duplicate handling are explicit;
- replay behavior is side-effect free and deterministic;
- schema evolution and upcasting rules are explicit;
- publication and projection boundaries are explicit;
- privacy, analytics, and audit boundaries are explicit;
- stable failure codes are defined;
- downstream Phase 17D and Phase 18 can rely on the contract without inventing missing event semantics.

---

## 34. Final Authority Statement

`LearningRuntime` and its specialized modules may emit only events that conform to this contract.

Persistence may store events, brokers may deliver events, projections may derive views, analytics may observe qualified events, and recovery may replay events—but none of those systems may rewrite the semantic fact represented by an accepted runtime event.

The authoritative causal chain is:

```text
Authorized Command
        ↓
Verified Runtime Decision
        ↓
Immutable Versioned Event
        ↓
Durable Acceptance
        ↓
Publication and Derived Consumers
        ↓
Replayable Audit History
```

Phase 17C therefore establishes the stable event language through which the entire Learning Mission System can execute, recover, explain, and evolve without losing authority or historical meaning.
