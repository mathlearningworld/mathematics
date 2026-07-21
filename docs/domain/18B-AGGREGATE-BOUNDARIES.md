# 18B — Aggregate Boundaries

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 18B — Aggregate Boundaries  
**Document Type:** Domain Architecture / Aggregate Authority  
**Status:** Foundation Complete  
**Parent Authority:** `docs/domain/18A-DOMAIN-CORE.md`  
**Runtime Authorities:** `docs/runtime/17A-LEARNING-RUNTIME-CORE.md`, `docs/runtime/17B-SPECIALIZED-LEARNING-RUNTIME-MODULES.md`, `docs/runtime/17C-RUNTIME-EVENT-CONTRACTS.md`, `docs/runtime/17D-RUNTIME-RECOVERY-AND-SNAPSHOT.md`  
**Upstream Authorities:** Learning Mission System Blueprint 16A–16J  
**Downstream Consumers:** Phase 18C value objects, Phase 18D domain events, application commands, repositories, persistence adapters, projections, APIs, analytics, audit tooling, and frontend runtime

---

## 1. Purpose

This document defines the authoritative aggregate boundaries for Math Learning World.

The central doctrine is:

> An aggregate is the smallest authoritative consistency boundary that can protect a domain invariant through one atomic decision. It is not a database module, screen model, API resource, workflow container, or convenience grouping.

A conforming aggregate model must answer:

> Which aggregate owns each invariant, which state must change atomically, which identities may be referenced without loading another aggregate, which decisions require asynchronous collaboration, how concurrency is controlled, and what evidence proves that no boundary has been bypassed?

Phase 18B converts the domain language and bounded contexts of 18A into explicit aggregate ownership rules. It does not define final TypeScript classes, Prisma models, tables, HTTP endpoints, queue products, or frontend state stores.

---

## 2. Architectural Position

```text
Learning Mission System Blueprint (16A–16J)
        ↓
Learning Runtime Foundation (17A–17D)
        ↓
Domain Core Architecture (18A)
        ↓
Aggregate Boundaries (18B)
        ↓
Value Objects (18C)
        ↓
Domain Events (18D)
        ↓
Application / Persistence / API / Frontend Runtime
```

18A defines authoritative language, bounded contexts, and domain meaning.

18B defines which aggregate protects each decision and invariant.

18C will define immutable semantic values used inside these boundaries.

18D will define domain facts emitted when an aggregate accepts a transition.

---

## 3. Aggregate Doctrine

Every aggregate must satisfy all of the following:

1. **One aggregate root** — all external mutation enters through one authoritative root.
2. **Invariant ownership** — every protected rule has exactly one aggregate owner.
3. **Atomic scope** — one aggregate transaction changes only one aggregate stream.
4. **Identity references** — cross-aggregate links use stable identities, not live object graphs.
5. **Versioned decisions** — accepted changes advance aggregate version exactly once per event.
6. **Deterministic behavior** — the same prior state and command produce the same accepted result.
7. **No projection authority** — read models may inform interfaces but may not authorize domain transitions.
8. **No repository authority** — repositories retrieve and persist aggregates; they do not make domain decisions.
9. **No UI authority** — screens may propose commands but may not enforce the only copy of an invariant.
10. **Explicit collaboration** — cross-aggregate effects occur through application coordination and domain events.

A large object graph is not evidence of a good aggregate. Smaller boundaries are preferred when invariants can remain explicit and coordination can be safely eventual.

---

## 4. Aggregate Authority Boundary

### 4.1 Phase 18B owns

- aggregate-root identification;
- aggregate identity rules;
- aggregate lifecycle boundaries;
- invariant ownership;
- atomic consistency boundaries;
- transaction boundaries;
- cross-aggregate reference rules;
- command targeting rules;
- aggregate version semantics;
- optimistic concurrency expectations;
- repository-per-aggregate principles;
- event emission ownership;
- deletion and archival semantics;
- cross-context collaboration rules;
- aggregate failure taxonomy;
- aggregate verification requirements.

### 4.2 Phase 18B does not own

- database table layout;
- ORM relation design;
- endpoint paths;
- HTTP status codes;
- serialization format;
- UI state shape;
- queue technology;
- cache topology;
- projection denormalization;
- analytics dimensions;
- final implementation class names.

Implementation may rename technical types, but it may not weaken the ownership or consistency semantics defined here.

---

## 5. Aggregate Design Principles

### 5.1 Protect behavior, not storage shape

An aggregate exists because a decision requires authoritative state and invariant protection. It must not be designed by copying a relational schema or UI form.

### 5.2 Prefer explicit boundaries

A child entity belongs inside an aggregate only when its lifecycle and mutations must be governed atomically by that root.

### 5.3 Avoid universal aggregates

`Learner`, `Account`, or `LearningRuntime` must not become universal containers for every concern associated with a person or session.

### 5.4 Avoid cross-aggregate transactions

Business workflows may span multiple aggregates, but one atomic write must not require locking and changing multiple aggregate roots.

Where coordination is required, the application layer must use commands, events, idempotency, and compensating policies.

### 5.5 Historical evidence is not mutable aggregate state

Accepted assessments, evidence records, mastery decisions, and financial ledger entries must retain their historical meaning. Corrections occur through explicit later facts rather than rewriting accepted history.

### 5.6 Derived state is rebuildable

Dashboards, learner summaries, teacher views, recommendations, and analytics are projections. They are not aggregate roots unless they independently own protected domain decisions.

---

## 6. Canonical Aggregate Envelope

Every persisted aggregate conceptually exposes:

```ts
interface AggregateEnvelope<State> {
  aggregateType: string;
  aggregateId: string;
  tenantId: string;
  version: number;
  lifecycleState: string;
  createdAt: string;
  lastChangedAt: string;
  state: State;
  uncommittedEvents: DomainEvent[];
}
```

This is an architectural model, not a mandatory literal implementation.

Required semantics:

- `aggregateId` is stable for the aggregate lifetime;
- `tenantId` is explicit where tenancy applies;
- `version` represents accepted aggregate history;
- lifecycle state is controlled by the root;
- uncommitted events are emitted only after invariant validation;
- persistence clears uncommitted events only after durable acceptance.

---

## 7. Aggregate Identity Rules

### 7.1 Stable identity

Aggregate identity must never depend on mutable names, grade labels, email addresses, curriculum codes, device IDs, or current ownership relations.

### 7.2 Tenant qualification

Any tenant-owned aggregate identity is resolved as:

```text
(tenantId, aggregateType, aggregateId)
```

No repository may load a tenant-owned aggregate solely by `aggregateId` when cross-tenant collision or disclosure is possible.

### 7.3 Human and learning identity separation

The following identities are distinct:

- `AccountId` — authentication and account ownership;
- `LearnerId` — the person whose mathematical learning is modeled;
- `GuardianId` — a parent or guardian authority;
- `TeacherId` — an instructional oversight authority;
- `MentorId` — a mentorship authority;
- `ActorId` — the actor responsible for a command or event.

No implementation may infer that these identities are interchangeable merely because one person currently holds several roles.

### 7.4 External references

External curriculum, school, class, or country identifiers must be wrapped by explicit domain values and may not replace internal aggregate identity.

---

## 8. Aggregate Lifecycle Rules

Every aggregate must define:

- creation preconditions;
- active states;
- suspended or inactive states where applicable;
- completion or closure semantics;
- archival behavior;
- prohibited transitions;
- reactivation rules;
- irreversible transitions;
- emitted facts for every consequential transition.

Hard deletion is prohibited for aggregates whose history contributes to learning evidence, mastery, audit, financial credit, guardian oversight, or institutional accountability.

A closed aggregate may reject new operational mutations while remaining replayable and queryable.

---

## 9. Canonical Aggregate Set

The following aggregate roots form the initial authoritative aggregate map.

They are architectural boundaries, not a guarantee that every aggregate must be implemented in the first delivery slice.

### 9.1 LearnerProfile

**Context:** Learner Identity  
**Identity:** `LearnerId`

Owns:

- learner identity and stable profile state;
- learning-relevant age or education-stage metadata;
- locale and accessibility preferences that affect learning presentation;
- active guardian relationships by identity reference;
- active institutional affiliations by identity reference;
- learner activation, suspension, and archival state.

Does not own:

- authentication credentials;
- curriculum definitions;
- skill progress;
- mastery decisions;
- active missions;
- assessment evidence;
- payment or credit balances.

Primary invariants:

- one learner identity cannot be silently merged into another;
- archived learners cannot start new learning operations;
- guardian or institution links cannot redefine historical evidence ownership;
- profile metadata cannot directly grant mastery or progression.

### 9.2 CurriculumFramework

**Context:** Curriculum  
**Identity:** `CurriculumFrameworkId`

Owns:

- curriculum authority identity;
- country or standards authority reference;
- curriculum version lifecycle;
- grade-band and subject taxonomy;
- publication, deprecation, and replacement metadata.

Does not own:

- learner assignment;
- skill dependency graph state;
- mastery status;
- mission planning;
- assessment attempts.

Primary invariants:

- a published curriculum version is immutable;
- deprecated versions remain historically resolvable;
- replacement does not rewrite past learner decisions;
- curriculum grade labels do not imply mastery.

### 9.3 SkillGraph

**Context:** Skill Knowledge Model  
**Identity:** `SkillGraphId`

Owns:

- skill identities within one graph version;
- prerequisite relationships;
- dependency direction;
- graph publication lifecycle;
- graph-level validation and compatibility metadata.

Does not own:

- learner progress;
- curriculum placement decisions owned elsewhere;
- mission execution;
- assessment scoring;
- remediation activation.

Primary invariants:

- a published graph contains no prohibited dependency cycle;
- referenced skills exist in the same compatible graph authority;
- skill identity remains stable across display-label changes;
- published graph versions are immutable;
- dependency changes create a new version rather than rewriting history.

### 9.4 CurriculumSkillMapping

**Context:** Curriculum Alignment  
**Identity:** `CurriculumSkillMappingId`

Owns:

- mapping between curriculum requirements and skill identities;
- mapping version;
- applicability range;
- mapping publication and deprecation state;
- provenance and authority of the mapping.

Primary invariants:

- both referenced authorities must be version-qualified;
- one mapping cannot silently change historical meaning;
- mapping strength or requirement category is explicit;
- unpublished mappings cannot authorize learner progression.

### 9.5 LearnerTargetPlan

**Context:** Learning Direction  
**Identity:** `LearnerTargetPlanId`

Owns:

- active learning goals for one learner;
- target skill or outcome references;
- target priority and provenance;
- plan activation, replacement, completion, and cancellation;
- parent, teacher, learner, or system proposal attribution.

Does not own:

- mastery itself;
- mission execution;
- assessment results;
- curriculum or skill definitions.

Primary invariants:

- every target references an active compatible skill authority;
- target activation does not claim mastery;
- replacement preserves the history of prior targets;
- authority to set or override a target is explicit;
- conflicting active targets are resolved under a declared policy.

### 9.6 LearnerDiagnosis

**Context:** Diagnosis  
**Identity:** `LearnerDiagnosisId`

Owns:

- one bounded diagnostic process;
- target scope;
- diagnostic observations and accepted evidence references;
- diagnostic conclusion;
- identified gaps and confidence;
- completion, invalidation, and supersession state.

Does not own:

- skill definitions;
- final mastery state;
- mission lifecycle;
- remediation execution;
- UI recommendations.

Primary invariants:

- a diagnosis cannot conclude without sufficient accepted evidence under its policy;
- diagnostic conclusion identifies policy and authority versions;
- later diagnosis may supersede but never rewrite a prior conclusion;
- uncertainty remains explicit;
- incomplete diagnosis cannot be represented as completed.

### 9.7 LearningMission

**Context:** Mission Planning  
**Identity:** `LearningMissionId`

Owns:

- one learner mission definition;
- mission objective and target skill references;
- prerequisite assumptions;
- mission step structure;
- completion criteria;
- mission lifecycle from draft through activation, completion, cancellation, or expiration;
- mission policy-version attribution.

Does not own:

- real-time world execution;
- raw evidence records;
- assessment scoring;
- mastery decisions;
- reward wallet balances.

Primary invariants:

- an activated mission has a complete objective and valid target set;
- mission steps remain compatible with the target skill graph version;
- completed missions cannot be reopened by mutation;
- cancellation does not erase submitted evidence;
- mission completion alone does not grant mastery.

### 9.8 LearningRuntime

**Context:** Runtime Coordination  
**Identity:** `LearningRuntimeId`

Owns:

- one active or historical execution of a learning mission;
- runtime state machine;
- current step and activity references;
- runtime lease and suspension state;
- accepted command sequence;
- coordination references to evidence, assessment, and downstream decisions;
- resume and close semantics.

Does not own:

- the canonical mission definition;
- evidence content;
- assessment judgment;
- mastery status;
- projection state;
- reward ledger balance.

Primary invariants:

- one runtime follows one mission version;
- state transitions obey the runtime state machine;
- commands respect aggregate version and idempotency rules;
- suspended or closed runtimes cannot accept prohibited activity commands;
- replay produces the same authoritative runtime state;
- recovery cannot invent completed work.

### 9.9 WorldActivity

**Context:** World Interaction  
**Identity:** `WorldActivityId`

Owns:

- one bounded educational activity instance in the game world;
- activity configuration version;
- learner interaction lifecycle;
- submitted answer or construction references;
- completion, abandonment, timeout, and invalidation state;
- activity-level evidence candidates.

Does not own:

- mastery decisions;
- learner-wide progress;
- mission completion;
- reward wallet;
- curriculum definitions.

Primary invariants:

- an activity instance is bound to one learner and one runtime;
- completion criteria are version-qualified;
- activity completion is not equivalent to correctness or mastery;
- invalidated interactions cannot be promoted as valid evidence;
- retries are represented explicitly rather than overwriting prior attempts.

### 9.10 LearningEvidence

**Context:** Evidence  
**Identity:** `LearningEvidenceId`

Owns:

- one accepted evidence record or evidence bundle;
- source and provenance;
- learner, skill, mission, runtime, and activity references where applicable;
- content integrity metadata;
- evidence classification;
- acceptance, rejection, invalidation, and correction lifecycle;
- privacy and retention classification.

Does not own:

- assessment interpretation;
- mastery decisions;
- mission lifecycle;
- analytics projections.

Primary invariants:

- accepted evidence has immutable provenance;
- evidence ownership is learner-qualified;
- rejected or invalidated evidence cannot support a new decision unless explicitly reinstated under policy;
- correction creates a new fact linked to the original;
- sensitive evidence follows declared privacy and retention policy.

### 9.11 AssessmentAttempt

**Context:** Assessment  
**Identity:** `AssessmentAttemptId`

Owns:

- one bounded assessment attempt;
- assessment instrument and version reference;
- learner and target references;
- accepted evidence references;
- scoring or judgment process;
- result, confidence, completion, invalidation, and supersession state;
- assessor and policy attribution.

Does not own:

- learner mastery state;
- mission execution;
- curriculum definitions;
- reward allocation.

Primary invariants:

- a completed assessment identifies the instrument and policy versions used;
- results derive only from admissible evidence;
- one attempt preserves one historical judgment;
- invalidation is explicit and auditable;
- an assessment result may recommend but does not itself mutate mastery.

### 9.12 SkillMastery

**Context:** Mastery  
**Identity:** `SkillMasteryId`

Recommended identity composition:

```text
(learnerId, skillId, skillAuthorityVersion)
```

Owns:

- authoritative mastery lifecycle for one learner and one skill authority;
- current mastery state;
- supporting assessment references;
- confidence and evidence sufficiency;
- mastery grant, retention, challenge, revocation, and restoration decisions;
- policy-version attribution.

Does not own:

- raw evidence;
- assessment execution;
- mission execution;
- curriculum definition;
- reward balance.

Primary invariants:

- mastery changes only through an authorized mastery decision;
- sufficient valid evidence is required under the active policy;
- activity completion, grade, payment, reward, or time spent cannot directly grant mastery;
- revocation or challenge preserves prior decision history;
- skill authority version remains explicit;
- confidence cannot exceed what the supporting evidence permits.

### 9.13 RemediationPlan

**Context:** Remediation  
**Identity:** `RemediationPlanId`

Owns:

- one targeted response to identified gaps;
- source diagnosis, assessment, or mastery references;
- remediation objectives;
- prerequisite repair sequence;
- activation, progress, completion, cancellation, and supersession;
- escalation thresholds and support policy attribution.

Does not own:

- mastery state;
- evidence content;
- payment entitlement;
- mission runtime state.

Primary invariants:

- remediation is linked to an explicit learning gap;
- the plan addresses prerequisite meaning rather than merely repeating failed screens;
- completion does not automatically grant mastery;
- paid support status cannot alter learning truth;
- supersession preserves previous plan history.

### 9.14 ProgressionPathway

**Context:** Progression  
**Identity:** `ProgressionPathwayId`

Owns:

- a learner's governed progression through a defined target space;
- unlock decisions;
- blocking prerequisites;
- advancement exceptions;
- current eligible next-step set;
- progression policy and authority versions.

Does not own:

- skill mastery decisions;
- mission execution;
- curriculum definitions;
- frontend navigation state.

Primary invariants:

- progression eligibility derives from authoritative mastery and policy inputs;
- above-grade access may be allowed without rewriting grade placement;
- blocked prerequisites remain explicit;
- an unlock is not a mastery grant;
- override authority and reason are auditable.

### 9.15 MentorshipEngagement

**Context:** Mentorship  
**Identity:** `MentorshipEngagementId`

Owns:

- one learner–mentor engagement;
- role and consent state;
- permitted support scope;
- mentorship sessions and contribution references;
- completion, suspension, and revocation;
- credit-eligibility evidence references.

Does not own:

- mastery decisions;
- learner account ownership;
- wallet balances;
- teacher authority;
- raw private evidence beyond permitted references.

Primary invariants:

- mentorship requires valid authority and consent;
- mentor contribution cannot directly grant mastery;
- credit eligibility requires auditable qualifying contribution;
- revoked authority blocks new mentorship actions;
- learner privacy scope is explicit.

### 9.16 GuardianOversight

**Context:** Family Oversight  
**Identity:** `GuardianOversightId`

Owns:

- guardian authority relationship to a learner;
- consent and visibility scope;
- parent verification responsibilities;
- notification preferences that have domain meaning;
- activation, suspension, expiry, and revocation.

Does not own:

- learner mastery;
- mission state;
- evidence content outside authorized visibility;
- payment ledger.

Primary invariants:

- oversight authority is explicit and time-qualified;
- visibility does not imply mutation authority;
- verification actions are attributable;
- revoked relationships cannot access new protected information;
- one guardian cannot silently override another under equal authority without policy.

### 9.17 ClassroomEnrollment

**Context:** Institutional Learning  
**Identity:** `ClassroomEnrollmentId`

Owns:

- learner enrollment in one instructional group;
- teacher or institution authority references;
- enrollment lifecycle;
- allowed instructional visibility and assignment scope;
- class-level target assignment references.

Does not own:

- learner mastery;
- teacher account identity;
- curriculum content;
- learner-wide progress projections.

Primary invariants:

- enrollment authority and effective period are explicit;
- expired enrollment cannot authorize new actions;
- teacher visibility follows institutional and privacy policy;
- class assignment cannot overwrite learner evidence or mastery.

### 9.18 RewardWallet

**Context:** Learning Economy  
**Identity:** `RewardWalletId`

Owns:

- one account or learner reward balance boundary;
- immutable credit and debit ledger references;
- reservation and release state;
- balance constraints;
- expiry policy where applicable.

Does not own:

- mastery;
- assessment;
- mentorship qualification decision;
- payment processing details.

Primary invariants:

- balance is derived from accepted ledger entries;
- no debit may exceed spendable balance unless policy explicitly permits debt;
- entries are immutable;
- duplicate awards are rejected by idempotency identity;
- reward state cannot alter learning truth.

### 9.19 SupportEntitlement

**Context:** Commercial Support  
**Identity:** `SupportEntitlementId`

Owns:

- access to paid or sponsored support capabilities;
- entitlement source reference;
- scope, limits, effective period, suspension, and expiry;
- consumption counters where atomic consistency is required.

Does not own:

- payment transaction settlement;
- mastery decisions;
- remediation diagnosis;
- learner identity.

Primary invariants:

- entitlement changes access, not learning truth;
- expired or exhausted entitlement cannot authorize new paid service use;
- sponsorship provenance is explicit;
- entitlement consumption is concurrency-safe.

### 9.20 PolicyDefinition

**Context:** Governance  
**Identity:** `PolicyDefinitionId`

Owns:

- one versioned domain policy definition;
- policy type and applicability;
- activation, deprecation, and replacement;
- provenance and approval metadata;
- compatibility constraints.

Primary invariants:

- activated policy versions are immutable;
- consequential decisions retain the exact policy version used;
- replacement affects future decisions unless an explicit migration policy states otherwise;
- policy definitions cannot retroactively rewrite accepted domain facts.

---

## 10. Boundary Classification

Aggregates are classified by consistency character.

### 10.1 Definition aggregates

Examples:

- `CurriculumFramework`;
- `SkillGraph`;
- `CurriculumSkillMapping`;
- `PolicyDefinition`.

Characteristics:

- authored and reviewed before publication;
- immutable after publication;
- replacement through new versions;
- high compatibility requirements.

### 10.2 Operational aggregates

Examples:

- `LearningRuntime`;
- `WorldActivity`;
- `LearningMission`;
- `RemediationPlan`;
- `MentorshipEngagement`.

Characteristics:

- active state machines;
- frequent commands;
- optimistic concurrency;
- suspension and recovery concerns.

### 10.3 Evidence aggregates

Examples:

- `LearningEvidence`;
- `AssessmentAttempt`;
- `LearnerDiagnosis`.

Characteristics:

- provenance-sensitive;
- append-oriented history;
- invalidation rather than destructive rewrite;
- strong audit requirements.

### 10.4 Decision aggregates

Examples:

- `SkillMastery`;
- `ProgressionPathway`;
- `SupportEntitlement`.

Characteristics:

- consequential state;
- explicit policy-version attribution;
- input references to other aggregate facts;
- no hidden projection dependence.

### 10.5 Ledger aggregates

Example:

- `RewardWallet`.

Characteristics:

- immutable entries;
- strict idempotency;
- concurrency-safe balance enforcement;
- no mutation of historical entries.

---

## 11. Aggregate References

### 11.1 Reference by identity

One aggregate may hold another aggregate's stable identity and required authority version.

Example:

```ts
interface SkillRef {
  skillId: string;
  skillGraphId: string;
  skillGraphVersion: number;
}
```

### 11.2 No live aggregate embedding

The following is prohibited across aggregate boundaries:

```ts
class LearningMission {
  learner: LearnerProfile;
  mastery: SkillMastery;
  curriculum: CurriculumFramework;
}
```

The mission may hold identity references and immutable decision inputs, but it may not own or mutate those aggregates.

### 11.3 Snapshot inputs

A decision may capture immutable input facts required for audit, such as:

- assessment result identity and version;
- policy version;
- skill graph version;
- curriculum mapping version;
- actor authority reference.

Captured input facts do not transfer aggregate ownership.

### 11.4 Stale references

Application services must validate reference eligibility before issuing a command when freshness matters.

The aggregate itself must still validate every rule that can be checked from authoritative command input and its own state.

---

## 12. Transaction Boundaries

### 12.1 One aggregate per atomic domain transaction

A normal command transaction consists of:

```text
Load one aggregate stream
        ↓
Validate command identity and expected version
        ↓
Execute aggregate decision
        ↓
Append emitted events atomically
        ↓
Write outbox records in the same persistence transaction
        ↓
Commit
```

### 12.2 Cross-aggregate workflow

A cross-aggregate workflow consists of multiple transactions coordinated by durable facts.

Example:

```text
AssessmentAttemptCompleted
        ↓
Application policy evaluates eligibility
        ↓
Command: EvaluateSkillMastery
        ↓
SkillMasteryChanged
        ↓
Command: RecalculateProgressionPathway
```

No step may pretend that all participating aggregates changed atomically.

### 12.3 Read-before-command

Application coordination may read projections or other aggregates to prepare a command. Any consequential input must be represented explicitly in the command and validated against policy.

### 12.4 Compensation

When a later step fails, compensation must be expressed as a new authorized command or event. Previous accepted history must not be deleted.

---

## 13. Cross-Aggregate Collaboration Rules

### 13.1 Commands target exactly one aggregate

Every domain command identifies:

- target aggregate type;
- target aggregate identity;
- tenant identity where applicable;
- expected version where required;
- command identity;
- actor authority;
- correlation and causation identity;
- policy version inputs;
- immutable supporting references.

### 13.2 Events publish accepted facts

An aggregate emits domain events only for transitions it owns.

Examples:

- `AssessmentAttempt` may emit `AssessmentAttemptCompleted`;
- `SkillMastery` may emit `SkillMasteryGranted`;
- `ProgressionPathway` may emit `ProgressionUnlocked`.

`AssessmentAttempt` must not emit `SkillMasteryGranted`, because it does not own mastery.

### 13.3 Process managers

Long-running coordination may use application-level process managers or sagas.

They may:

- observe events;
- track coordination state;
- issue commands;
- retry safely;
- record failures;
- request compensation.

They may not:

- mutate aggregate state directly;
- bypass expected-version checks;
- reinterpret domain invariants;
- manufacture domain events.

---

## 14. Invariant Ownership Matrix

| Invariant | Authoritative Aggregate |
|---|---|
| Learner identity cannot be silently merged | `LearnerProfile` |
| Published curriculum version is immutable | `CurriculumFramework` |
| Published skill dependency graph is valid and immutable | `SkillGraph` |
| Activated mission has valid objectives and steps | `LearningMission` |
| Runtime transition follows authorized state machine | `LearningRuntime` |
| Activity retry does not overwrite prior attempt | `WorldActivity` |
| Evidence provenance is immutable after acceptance | `LearningEvidence` |
| Assessment result uses admissible evidence | `AssessmentAttempt` |
| Mastery requires sufficient authorized evidence | `SkillMastery` |
| Remediation addresses an identified gap | `RemediationPlan` |
| Progression unlock obeys prerequisite policy | `ProgressionPathway` |
| Mentor authority and consent are valid | `MentorshipEngagement` |
| Guardian visibility and authority are explicit | `GuardianOversight` |
| Classroom authority is bounded by enrollment | `ClassroomEnrollment` |
| Reward balance cannot be duplicated or overspent | `RewardWallet` |
| Paid support access is valid and unexpired | `SupportEntitlement` |
| Activated policy version is immutable | `PolicyDefinition` |

Every downstream implementation must be able to point to exactly one owner for each enforced invariant.

---

## 15. Concurrency Model

### 15.1 Aggregate version

Each accepted aggregate event advances aggregate version by exactly one.

For a stream beginning at version `0`:

```text
Command expectedVersion = 7
Event appended aggregateVersion = 8
New aggregate version = 8
```

### 15.2 Optimistic concurrency

Persistence must reject append when the durable current version differs from the command's expected version.

Required failure meaning:

```text
AGGREGATE_VERSION_CONFLICT
```

The application may reload and retry only when command semantics permit it. It must never silently overwrite a concurrent accepted decision.

### 15.3 Idempotency

A repeated command with the same command identity must not create duplicate domain effects.

Idempotency is distinct from optimistic concurrency:

- concurrency prevents conflicting history;
- idempotency prevents duplicate history.

### 15.4 Hot aggregate warning

If one aggregate receives unrelated high-frequency writes, the boundary is probably too broad.

Examples of prohibited consolidation:

- all learner activities inside `LearnerProfile`;
- all skill mastery records inside one learner aggregate;
- all wallet entries for every user inside one global economy aggregate.

---

## 16. Repository Rules

### 16.1 Repository per aggregate family

Repositories expose aggregate-oriented operations such as:

```ts
interface AggregateRepository<TAggregate> {
  load(identity: AggregateIdentity): Promise<TAggregate | null>;
  append(
    aggregate: TAggregate,
    expectedVersion: number,
  ): Promise<AppendResult>;
}
```

### 16.2 Repository responsibilities

Repositories own:

- stream retrieval;
- event ordering verification;
- expected-version enforcement;
- atomic append;
- snapshot loading where authorized;
- persistence transaction participation;
- durable append result reporting.

Repositories do not own:

- business validation;
- transition selection;
- mastery evaluation;
- mission planning;
- remediation policy;
- authorization policy beyond persistence-level tenant safety;
- projection updates outside the atomic outbox contract.

### 16.3 No generic entity repository

A generic CRUD repository that saves arbitrary entity graphs is not an acceptable replacement for aggregate repositories.

### 16.4 Missing aggregate

A missing stream must be represented explicitly and must not be silently created unless the command is an authorized creation command.

---

## 17. Aggregate Creation Rules

A creation command must establish:

- aggregate identity;
- tenant identity where applicable;
- creation authority;
- initial policy versions;
- required external references;
- initial lifecycle state;
- creation timestamp semantics;
- first domain event.

An aggregate must not exist durably without at least one accepted creation event.

Creation idempotency must ensure that retried creation does not produce a second aggregate for the same authorized identity.

---

## 18. Closure, Archival, and Deletion

### 18.1 Closure

Closure is a domain transition owned by the aggregate.

A closed aggregate:

- retains identity and history;
- rejects prohibited future commands;
- remains replayable;
- may remain visible through projections;
- may emit final coordination events.

### 18.2 Archival

Archival changes operational discoverability or retention handling. It does not erase historical meaning.

### 18.3 Deletion

Hard deletion is prohibited when the aggregate contributes to:

- learner evidence;
- assessment;
- diagnosis;
- mastery;
- progression;
- guardian or teacher accountability;
- mentorship credit qualification;
- financial or reward ledger history;
- policy audit.

Privacy-driven erasure must use a governed anonymization or cryptographic erasure design that preserves required structural audit evidence without exposing protected personal data.

---

## 19. Failure Taxonomy

Aggregate failures must distinguish at least:

### 19.1 Identity failures

- `AGGREGATE_NOT_FOUND`
- `AGGREGATE_IDENTITY_MISMATCH`
- `TENANT_IDENTITY_MISMATCH`

### 19.2 Lifecycle failures

- `AGGREGATE_NOT_ACTIVE`
- `AGGREGATE_ALREADY_CLOSED`
- `INVALID_LIFECYCLE_TRANSITION`

### 19.3 Invariant failures

- `DOMAIN_INVARIANT_VIOLATION`
- `INSUFFICIENT_EVIDENCE`
- `INCOMPATIBLE_AUTHORITY_VERSION`
- `REFERENCE_NOT_ELIGIBLE`

### 19.4 Concurrency failures

- `AGGREGATE_VERSION_CONFLICT`
- `DUPLICATE_COMMAND`
- `COMMAND_ID_REUSE_CONFLICT`

### 19.5 Authority failures

- `ACTOR_NOT_AUTHORIZED`
- `AUTHORITY_EXPIRED`
- `POLICY_VERSION_REQUIRED`

Failure codes are architectural semantics. Transport layers may map them to protocol-specific responses without changing their meaning.

---

## 20. Anti-Patterns

The following designs are prohibited:

### 20.1 Learner mega-aggregate

One `Learner` object containing missions, runtimes, assessments, evidence, mastery, remediation, rewards, guardians, and classroom history.

Why prohibited:

- unrelated invariants become coupled;
- concurrency becomes excessive;
- replay becomes expensive;
- privacy boundaries become unclear;
- one workflow can block all learner activity.

### 20.2 Aggregate per database table

Treating every table as an aggregate root.

Why prohibited:

- business invariants become distributed across repositories and services;
- child entities become independently mutable;
- atomic boundaries follow storage rather than meaning.

### 20.3 Aggregate per screen

Creating aggregates such as `Dashboard`, `TeacherPage`, or `ParentSummary`.

Why prohibited:

- these are projections or interface compositions;
- they do not own domain truth.

### 20.4 Cross-aggregate object graph

Loading and saving multiple roots as one graph.

Why prohibited:

- transaction scope becomes implicit;
- ownership becomes ambiguous;
- concurrent decisions overwrite one another.

### 20.5 Event ownership leakage

One aggregate emitting an event that claims a decision owned by another aggregate.

Example prohibited behavior:

```text
LearningMission emits SkillMasteryGranted
```

### 20.6 Projection-driven decisions

Granting mastery or progression directly from a dashboard total or denormalized row.

Why prohibited:

- projections may be stale;
- provenance and policy inputs may be absent;
- replay cannot reproduce the decision safely.

### 20.7 Payment-coupled learning truth

Changing mastery, assessment result, or diagnosis because an entitlement was purchased.

Commercial access may change available support, never the truth of learning.

---

## 21. Application Boundary Requirements

The application layer must:

- target one aggregate per command;
- load by tenant-qualified identity;
- provide expected version when required;
- resolve actor authority before command execution;
- provide explicit policy versions;
- coordinate cross-aggregate workflows through events and commands;
- persist aggregate events and outbox atomically;
- distinguish retryable infrastructure failure from domain refusal;
- preserve correlation and causation identity;
- never mutate aggregate internals directly.

The application layer may orchestrate. It may not become the hidden owner of domain invariants.

---

## 22. Persistence Boundary Requirements

Persistence must support:

- ordered event streams by aggregate identity;
- tenant-safe retrieval;
- unique event identity;
- aggregate-version uniqueness;
- command idempotency evidence;
- atomic event and outbox writes;
- snapshot compatibility with 17D;
- immutable accepted event history;
- explicit corruption detection;
- auditable append results.

A relational implementation may use normalized tables, JSON event payloads, or hybrid storage, but storage choices may not change aggregate semantics.

---

## 23. Projection Boundary Requirements

Projections may combine data from many aggregates.

Examples:

- learner learning map;
- parent progress summary;
- teacher class readiness view;
- remediation recommendation queue;
- mentorship contribution history;
- reward balance display;
- curriculum coverage analytics.

Projection rules:

- projection state is derived;
- projection lag is explicit where consequential;
- a projection may trigger consideration but cannot manufacture a domain fact;
- rebuild must be possible from authoritative history;
- privacy filtering occurs before exposure;
- stale projection data cannot bypass aggregate validation.

---

## 24. Audit Evidence

Every consequential aggregate transition must preserve enough evidence to answer:

- which aggregate changed;
- from which version to which version;
- which command requested the change;
- which actor and authority initiated it;
- which policy versions governed it;
- which supporting aggregate facts were referenced;
- which domain events were emitted;
- when the decision occurred and was recorded;
- whether the operation was a retry;
- whether later events invalidated or superseded the decision.

Mastery, progression, diagnosis, assessment, guardian authority, teacher authority, mentorship credit, reward ledger, and support entitlement changes require enhanced audit evidence.

---

## 25. Verification Gates

### 25.1 Gate A — Repository Verification

Repository review must verify:

- 18B exists under `docs/domain/`;
- authority chain from 16A–16J, 17A–17D, and 18A is explicit;
- each canonical aggregate has one root and clear ownership;
- every major invariant has one aggregate owner;
- cross-aggregate references use identities;
- one-command/one-aggregate transaction doctrine is explicit;
- domain events are emitted only by the owning aggregate;
- prohibited mega-aggregate and projection-authority patterns are documented;
- 18C and 18D downstream boundaries remain clear.

Repository verification does not prove executable behavior.

### 25.2 Gate B — Runtime Verification

Executable verification must prove:

- aggregate rehydration is deterministic;
- command execution enforces lifecycle and invariants;
- accepted events advance version correctly;
- stale expected versions are rejected;
- duplicate commands do not duplicate effects;
- repositories preserve tenant isolation;
- one transaction appends one aggregate stream and required outbox records;
- snapshots restore compatible aggregate state;
- cross-aggregate workflows use durable coordination.

### 25.3 Gate C — Operational Verification

A running system must prove representative flows end to end, including:

```text
UI / API command
        ↓
Application authorization and coordination
        ↓
Aggregate load and decision
        ↓
Atomic event + outbox persistence
        ↓
Projection update
        ↓
Visible result
        ↓
Replay / recovery verification
```

Required representative flows include:

- mission activation and runtime start;
- activity completion without false mastery;
- evidence acceptance and assessment completion;
- mastery grant based on sufficient evidence;
- remediation activation after an identified gap;
- progression unlock after authoritative prerequisites;
- mentorship contribution without direct mastery mutation;
- reward credit without duplicate balance effect;
- stale concurrent command rejection;
- recovery from process interruption.

---

## 26. Phase Completion Criteria

Phase 18B is complete when:

- aggregate doctrine is authoritative;
- canonical aggregate roots are identified;
- aggregate responsibilities and exclusions are explicit;
- lifecycle and identity rules are defined;
- invariant ownership is unambiguous;
- transaction and concurrency boundaries are defined;
- cross-aggregate collaboration rules are defined;
- repository responsibilities are constrained;
- failure semantics are explicit;
- verification gates are established;
- 18C can define value objects without reopening aggregate ownership;
- 18D can define domain events without ambiguity about event ownership.

---

## 27. Final Authority Statement

Math Learning World adopts the following aggregate authority model:

> Each domain invariant is protected by one aggregate root. Each command targets one aggregate. Each accepted transition advances one authoritative history. Cross-aggregate outcomes are coordinated through durable facts, never hidden multi-root mutation.

Therefore:

- `LearnerProfile` owns learner identity, not all learner learning state;
- `LearningMission` owns mission definition, not runtime execution or mastery;
- `LearningRuntime` owns execution state, not evidence meaning or assessment judgment;
- `LearningEvidence` owns provenance, not interpretation;
- `AssessmentAttempt` owns one assessment judgment, not mastery;
- `SkillMastery` alone owns mastery lifecycle;
- `RemediationPlan` owns targeted support response, not mastery truth;
- `ProgressionPathway` owns unlock decisions, not prerequisite mastery;
- `RewardWallet` and `SupportEntitlement` own economic access, never mathematical truth;
- repositories and projections preserve or explain domain facts but never create them.

This boundary model is the authority for Phase 18C Value Objects, Phase 18D Domain Events, and all downstream implementation.