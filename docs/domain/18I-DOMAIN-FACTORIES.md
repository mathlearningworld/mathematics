# 18I — Domain Factories

## 1. Purpose

This document defines the architectural contract for Domain Factories in Math Learning World.

Domain Factories are responsible for creating valid domain objects when construction requires more than a simple constructor call. They protect domain invariants at the moment of creation, make creation intent explicit, and separate new aggregate creation from persistence reconstitution.

This document is the Source of Truth for:

- when a factory is required;
- what a factory may and may not do;
- how aggregate, entity, and value-object factories differ;
- how identity, timestamps, policies, and domain events participate in creation;
- how new creation differs from hydration and reconstitution;
- how factories collaborate with repositories, domain services, policies, and specifications;
- how factory behavior must be tested;
- which anti-patterns are forbidden.

The goal is not to create factories for every object. The goal is to use factories only where creation is a meaningful domain operation.

---

## 2. Scope

This document covers:

- Domain Factory definition
- Factory ownership
- Factory selection rules
- Aggregate factories
- Entity factories
- Value Object factories
- Creation commands and creation inputs
- Creation policies
- Specification-assisted creation
- Identity assignment
- Time assignment
- Version initialization
- Domain event emission
- Child entity creation
- Collection initialization
- New creation vs reconstitution
- Factory vs constructor
- Factory vs builder
- Factory vs assembler
- Factory vs mapper
- Factory vs application service
- Factory vs domain service
- Factory vs repository
- Error modeling
- Determinism
- Transaction boundaries
- Idempotency considerations
- Testing strategy
- Reference examples
- Anti-patterns
- Completion criteria

This document does not define:

- persistence implementation details;
- API request validation;
- ORM hydration mechanics;
- UI form construction;
- transport DTO mapping;
- database-generated identity strategy implementation;
- application use-case orchestration beyond the factory boundary.

Those concerns belong to their respective layers.

---

## 3. Definition

A Domain Factory is a domain-layer component that creates a valid domain object or aggregate from explicitly supplied creation facts.

A factory is justified when one or more of the following are true:

1. object creation requires enforcing multiple invariants;
2. creation requires coordinating several value objects or child entities;
3. the constructor would otherwise expose too many technical or internal parameters;
4. creation has domain meaning that deserves an explicit name;
5. creation requires domain policy evaluation;
6. creation initializes domain events;
7. creation differs materially from reconstitution;
8. creation must choose among valid domain variants;
9. creation requires stable identity, time, or sequence providers;
10. the same creation rules must be reused across multiple application flows.

A Domain Factory must return either:

- a fully valid domain object; or
- an explicit domain failure.

It must never return a partially valid object.

---

## 4. Core Principle

> A factory creates a valid beginning, not a temporary object that becomes valid later.

The object produced by a factory must satisfy all invariants required for its initial lifecycle state.

A factory must not rely on callers to remember a follow-up sequence such as:

```text
construct
set identity
set initial status
add required child
set timestamps
emit created event
```

If all of those are required for validity, they belong inside one atomic creation operation.

---

## 5. Factory Ownership

Factories belong to the domain area that owns the object being created.

Examples:

```text
LearnerProfileFactory
SkillProgressFactory
MasteryPathwayFactory
LearningMissionFactory
MentorshipRelationshipFactory
CurriculumRequirementFactory
RewardCreditFactory
```

Ownership rules:

- The aggregate factory belongs with the aggregate module.
- An entity factory belongs with its owning aggregate module.
- A value-object factory belongs with the value object when normalization or parsing is domain-significant.
- A cross-context object must not be created by a factory owned by another bounded context.
- A shared generic factory is forbidden unless the concept is truly shared and domain-neutral.

Do not create a central `FactoryService` that knows how to construct every domain object.

---

## 6. Factory Selection Rule

Use the smallest valid creation mechanism.

### 6.1 Use a constructor when

- creation is simple;
- all required inputs fit naturally in a small parameter set;
- no external domain collaborator is required;
- no variant selection is required;
- no complex child graph is created;
- no creation event is required beyond what the object can emit internally.

### 6.2 Use a static named constructor when

- construction has one or two meaningful variants;
- creation intent benefits from a domain name;
- no external collaborator is required.

Example:

```ts
SkillProgress.start(...)
SkillProgress.restore(...)
```

### 6.3 Use a dedicated factory when

- creation logic spans multiple domain objects;
- policies or specifications must be evaluated;
- identity or time providers are needed;
- a complex initial graph is built;
- multiple creation strategies exist;
- creation must remain reusable and independently testable.

### 6.4 Do not use a factory merely to hide `new`

This is not sufficient justification:

```ts
class SkillFactory {
  create(name: string) {
    return new Skill(name);
  }
}
```

The factory must carry domain meaning or protect domain integrity.

---

## 7. Creation Is a Domain Operation

Creation is not always a technical concern.

In Math Learning World, examples of domain-significant creation include:

- starting a learner's progress for a skill;
- opening a mastery pathway;
- creating a remediation plan after repeated weakness is confirmed;
- establishing a mentorship relationship;
- creating a reward-credit transaction;
- creating a learning mission from a diagnosed need;
- creating a curriculum requirement from a national standard;
- opening a learner account with an initial grade mapping.

Each of these has initial business meaning, not just object allocation.

A factory should expose this meaning explicitly.

Examples:

```ts
skillProgressFactory.startProgress(...)
masteryPathwayFactory.openPathway(...)
remediationPlanFactory.createForConfirmedGap(...)
mentorshipFactory.establishRelationship(...)
learningMissionFactory.createFromDiagnosis(...)
```

---

## 8. Factory Contract

A factory contract should make the creation operation explicit.

Example:

```ts
export interface SkillProgressFactory {
  start(input: StartSkillProgressInput): DomainResult<SkillProgress>;
}
```

A factory contract should declare:

- operation name;
- required creation facts;
- returned aggregate or entity;
- possible domain failures;
- deterministic collaborators;
- whether domain events are emitted;
- whether identity is supplied or generated through an injected port.

A factory should not accept vague bags such as:

```ts
Record<string, unknown>
any
Partial<SkillProgress>
```

Creation input must be explicit and typed.

---

## 9. Creation Input Objects

Creation input objects represent facts required to begin a domain lifecycle.

Example:

```ts
export type StartSkillProgressInput = {
  learnerId: LearnerId;
  skillId: SkillId;
  curriculumId: CurriculumId;
  initialEvidence?: LearningEvidence;
  initiatedBy: ActorId;
};
```

Creation input rules:

- Use domain types, not primitive obsession.
- Include only facts required for creation.
- Do not include persistence fields that are not domain facts.
- Do not accept lifecycle state directly when the factory determines it.
- Do not accept version directly for new creation.
- Do not accept internal flags used only by ORM or serializers.
- Avoid optional fields unless absence is domain-valid.
- Use separate input types for materially different creation modes.

Bad:

```ts
type CreateProgressInput = Partial<SkillProgressProps>;
```

Good:

```ts
type StartSkillProgressInput = {
  learnerId: LearnerId;
  skillId: SkillId;
  curriculumId: CurriculumId;
  initiatedBy: ActorId;
};
```

---

## 10. Factory Result Model

Factories must use an explicit result model when creation can fail for expected domain reasons.

Example:

```ts
export type DomainResult<T> =
  | { ok: true; value: T }
  | { ok: false; failure: DomainFailure };
```

Typical factory failures include:

```text
LEARNER_NOT_ELIGIBLE
SKILL_NOT_AVAILABLE
PATHWAY_ALREADY_EXISTS
PREREQUISITES_NOT_SATISFIED
INVALID_INITIAL_STATE
CURRICULUM_MAPPING_MISSING
MENTORSHIP_NOT_ALLOWED
CREDIT_RULE_NOT_SATISFIED
CREATION_POLICY_REJECTED
```

Expected domain rejection must not be reported as an infrastructure exception.

Exceptions are reserved for unexpected programming or environmental failures.

---

## 11. Aggregate Factories

An Aggregate Factory creates a complete aggregate root in a valid initial state.

Responsibilities may include:

- generating or accepting aggregate identity;
- creating required value objects;
- creating required child entities;
- selecting initial lifecycle state;
- initializing version;
- assigning creation timestamp;
- applying creation policies;
- establishing internal collections;
- emitting initial domain events;
- verifying initial invariants.

An aggregate factory must not:

- persist the aggregate;
- begin a database transaction;
- call external APIs;
- publish domain events directly;
- mutate another aggregate;
- return an aggregate whose required children are missing.

---

## 12. Aggregate Factory Example

```ts
export class DefaultSkillProgressFactory implements SkillProgressFactory {
  constructor(
    private readonly identity: SkillProgressIdentityProvider,
    private readonly clock: DomainClock,
    private readonly startPolicy: SkillProgressStartPolicy,
  ) {}

  start(input: StartSkillProgressInput): DomainResult<SkillProgress> {
    const policyResult = this.startPolicy.evaluate(input);

    if (!policyResult.allowed) {
      return {
        ok: false,
        failure: policyResult.failure,
      };
    }

    const progressId = this.identity.next();
    const startedAt = this.clock.now();

    const progress = SkillProgress.start({
      id: progressId,
      learnerId: input.learnerId,
      skillId: input.skillId,
      curriculumId: input.curriculumId,
      status: SkillProgressStatus.notStarted(),
      mastery: MasteryLevel.initial(),
      attemptCount: AttemptCount.zero(),
      startedAt,
      initiatedBy: input.initiatedBy,
    });

    return { ok: true, value: progress };
  }
}
```

This example illustrates:

- explicit dependencies;
- domain-level policy evaluation;
- injected identity and time;
- valid initial state;
- no persistence;
- explicit result handling.

---

## 13. Entity Factories

Entity Factories create entities that live inside an aggregate boundary.

The aggregate root remains responsible for adding and governing the entity.

Example entities might include:

- mastery pathway steps;
- mission objectives;
- assessment evidence entries;
- mentorship sessions;
- reward transaction lines;
- curriculum requirement items.

An entity factory may be useful when:

- child creation is complex;
- child identity generation is required;
- multiple value objects must be coordinated;
- child variants exist;
- creation policy is reusable;
- the aggregate root would otherwise become overloaded with construction details.

The factory does not bypass the root.

Correct:

```ts
const step = pathwayStepFactory.create(input);
pathway.addStep(step);
```

Incorrect:

```ts
pathwayStepRepository.save(step);
```

A child entity must remain inside its aggregate lifecycle and persistence boundary.

---

## 14. Value Object Factories

Most Value Objects should be created directly through constructors or named constructors.

A dedicated Value Object Factory is justified only when creation includes meaningful domain interpretation such as:

- parsing curriculum codes;
- normalizing grade identifiers across national systems;
- constructing mastery thresholds from policy-defined bands;
- interpreting evidence scores from different assessment models;
- converting external curriculum representations into canonical domain values.

Example:

```ts
export interface GradeLevelFactory {
  fromNationalStandard(
    country: CountryCode,
    externalGrade: ExternalGradeCode,
  ): DomainResult<GradeLevel>;
}
```

A Value Object Factory must not become a generic mapping layer for transport DTOs.

---

## 15. New Creation vs Reconstitution

New creation and persistence reconstitution are different operations and must remain separate.

### 15.1 New creation

New creation:

- applies current creation rules;
- chooses the initial lifecycle state;
- initializes version;
- may emit creation events;
- may generate identity;
- uses current domain policies;
- represents a new domain fact.

### 15.2 Reconstitution

Reconstitution:

- restores a previously valid historical state;
- preserves stored identity;
- preserves stored timestamps;
- preserves stored version;
- must not emit new creation events;
- must not re-run current creation eligibility rules;
- must not silently migrate historical meaning;
- should validate structural integrity without pretending the object is newly created.

### 15.3 Separate APIs

Example:

```ts
SkillProgress.start(newCreationProps)
SkillProgress.reconstitute(snapshot)
```

or:

```ts
skillProgressFactory.start(input)
skillProgressReconstitutor.restore(snapshot)
```

Never use one ambiguous operation such as:

```ts
SkillProgressFactory.create(props, isExisting)
```

---

## 16. Factory vs Constructor

A constructor establishes object validity.

A factory coordinates creation when validity requires more than the object alone should know.

Use constructors for local invariants:

- numeric ranges;
- non-empty identifiers;
- valid enum values;
- value normalization;
- immutable value creation.

Use factories for coordinated creation:

- identity generation;
- time assignment;
- policy selection;
- child graph construction;
- creation strategy selection;
- multi-object initialization.

A factory must not weaken constructor invariants.

The constructor or named constructor must still prevent invalid internal state.

---

## 17. Factory vs Named Constructor

A named constructor is preferred when the object can own its own creation logic without external collaborators.

Example:

```ts
MasteryLevel.initial()
AttemptCount.zero()
SkillProgress.start(props)
```

A dedicated factory is preferred when external domain collaborators are required.

Example:

```ts
LearningMissionFactory.createFromDiagnosis(
  diagnosis,
  missionPolicy,
  identityProvider,
  clock,
)
```

Do not create both a large factory and a large named constructor that duplicate the same rules.

One must be the clear creation authority.

---

## 18. Factory vs Builder

A Builder incrementally assembles a complex representation.

A Domain Factory performs an atomic domain creation operation.

Builders are appropriate for:

- test fixtures;
- complex technical configuration;
- optional presentation structures;
- non-domain document assembly.

Builders are dangerous for domain creation because they can expose invalid intermediate states.

Forbidden production pattern:

```ts
const progress = new SkillProgressBuilder()
  .withLearner(...)
  .withSkill(...)
  .withStatus(...)
  .build();
```

unless the builder itself is strictly internal and the final build operation fully enforces all invariants.

A factory should generally accept one complete creation input and return one result.

---

## 19. Factory vs Assembler

An Assembler translates between representations.

Examples:

- API DTO to application command;
- domain snapshot to persistence record;
- query projection to response DTO.

A Domain Factory creates a new domain fact.

An assembler must not be treated as a domain factory merely because it constructs an object.

Key distinction:

```text
Assembler: representation conversion
Factory: domain creation
```

---

## 20. Factory vs Mapper

A Mapper converts data between forms.

A factory decides how a valid domain lifecycle begins.

A mapper may prepare domain-typed inputs, but it must not decide:

- whether a learner is eligible;
- which initial state applies;
- whether remediation should be created;
- whether mentorship is allowed;
- whether domain events should be emitted.

Those are domain responsibilities.

---

## 21. Factory vs Application Service

The Application Service orchestrates a use case.

It may:

- load required aggregates;
- obtain external facts;
- authorize the actor;
- begin a transaction;
- call policies and factories;
- persist the result;
- publish committed domain events;
- return an application result.

The Domain Factory creates the domain object.

Example orchestration:

```ts
const learner = await learnerRepository.getById(command.learnerId);
const skill = await skillRepository.getById(command.skillId);

const result = skillProgressFactory.start({
  learner,
  skill,
  curriculumId: command.curriculumId,
  initiatedBy: command.actorId,
});

if (!result.ok) return result;

await skillProgressRepository.save(result.value);
```

The factory must not absorb the entire application workflow.

---

## 22. Factory vs Domain Service

A Domain Service performs domain behavior that does not naturally belong to one entity or value object.

A Domain Factory performs creation.

A factory may collaborate with a domain service when creation requires a domain calculation.

Example:

```text
MasteryPlacementService calculates the correct starting placement.
MasteryPathwayFactory creates the pathway using that placement.
```

The service computes or decides.
The factory creates.

Do not merge both into an unbounded service that calculates, creates, persists, and publishes.

---

## 23. Factory vs Repository

A Repository retrieves and persists aggregates.

A Factory creates aggregates.

Repository responsibilities:

- load by identity;
- save with version checks;
- remove if the domain permits;
- query according to repository contracts.

Factory responsibilities:

- create valid new aggregates;
- initialize domain state;
- emit initial domain events.

A repository may use a reconstitutor internally, but it must not call the new-creation factory to load existing state.

Forbidden:

```ts
repository.findById(id) {
  const row = database.load(id);
  return skillProgressFactory.start(row);
}
```

This would re-run creation rules and emit incorrect meaning.

---

## 24. Creation Policies

A creation policy determines whether creation is allowed or which creation strategy applies.

Examples:

- learner eligibility policy;
- prerequisite policy;
- mastery pathway opening policy;
- remediation creation policy;
- mentorship eligibility policy;
- reward-credit issuance policy;
- curriculum applicability policy.

Factories may consume policy results, but they should not hide policy identity.

Example:

```ts
const decision = remediationCreationPolicy.evaluate(context);

if (!decision.allowed) {
  return DomainResult.fail(decision.failure);
}

return remediationPlanFactory.create(decision.creationPlan);
```

Policy outputs should be domain-typed and explainable.

---

## 25. Specification-Assisted Creation

Factories may use Domain Specifications for reusable predicates.

Examples:

```text
LearnerIsEligibleForSkillSpecification
PrerequisitesSatisfiedSpecification
RepeatedWeaknessConfirmedSpecification
MentorCanSupportSkillSpecification
CurriculumRequirementActiveSpecification
```

Use Specifications when the rule is a reusable boolean or explainable predicate.

Use Policies when rules produce a decision, strategy, limit, or creation plan.

Use the Factory to perform the actual construction after the decision is made.

---

## 26. Identity Assignment

Identity assignment is part of creation semantics but the mechanism must remain abstract.

Accepted strategies:

1. identity supplied by the application layer;
2. identity generated by an injected domain identity provider;
3. deterministic identity derived from stable domain inputs when explicitly required;
4. identity reserved before persistence through an application/infrastructure capability.

Factory rules:

- Do not import a database client.
- Do not call random UUID functions directly if deterministic tests are required.
- Do not use mutable global identity generators.
- Do not derive identity from unstable display names.
- Do not reuse another aggregate's identity unless the model explicitly defines shared identity.

Example port:

```ts
export interface SkillProgressIdentityProvider {
  next(): SkillProgressId;
}
```

---

## 27. Deterministic Identity

Deterministic identity may be appropriate when the domain requires uniqueness by business key.

Example:

```text
one SkillProgress per learner + skill + curriculum mapping
```

However, deterministic identity must not replace repository uniqueness enforcement.

If deterministic identity is used:

- the derivation rule must be documented;
- canonical input normalization must be defined;
- collision behavior must be specified;
- changing the derivation rule requires migration planning;
- security-sensitive values must not be exposed through predictable IDs.

---

## 28. Time Assignment

Factories must not call the system clock directly.

Use an injected domain clock:

```ts
export interface DomainClock {
  now(): DomainInstant;
}
```

Benefits:

- deterministic tests;
- explicit timezone handling;
- consistent timestamps within one creation operation;
- support for historical simulations;
- reproducible event payloads.

The factory should obtain time once per atomic creation operation unless the domain explicitly requires multiple instants.

Bad:

```ts
createdAt: new Date(),
openedAt: new Date(),
eventAt: new Date(),
```

Good:

```ts
const now = clock.now();

createdAt: now,
openedAt: now,
eventAt: now,
```

---

## 29. Initial Version

New aggregates begin with the domain-defined initial version.

The factory must not accept arbitrary version values for new creation.

Recommended model:

```text
New aggregate version: 0 before first durable write
or
New aggregate version: 1 after first committed write
```

The chosen convention must match repository contracts and optimistic concurrency rules.

The factory owns only the initial in-memory version convention.
The repository owns durable version advancement.

---

## 30. Initial Lifecycle State

The factory determines the valid initial lifecycle state.

Callers must not pass arbitrary status values unless the creation operation explicitly supports distinct creation modes.

Bad:

```ts
createSkillProgress({ status: command.status })
```

Good:

```ts
startSkillProgress(...)
importHistoricalSkillProgress(...)
```

Different lifecycle origins should use different operations and contracts.

Examples of valid initial states:

```text
SkillProgress -> NOT_STARTED
MasteryPathway -> OPEN
LearningMission -> PLANNED
RemediationPlan -> PROPOSED
MentorshipRelationship -> PENDING_ACCEPTANCE
RewardCreditTransaction -> PENDING
```

These states must be defined by aggregate lifecycle documentation.

---

## 31. Required Child Entities

If an aggregate is invalid without one or more child entities, the factory must create them atomically.

Example:

```text
A LearningMission may require at least one objective.
A MasteryPathway may require an entry checkpoint.
A RemediationPlan may require at least one target gap.
```

The factory must not return an empty shell that the application layer must repair.

Example:

```ts
const objective = missionObjectiveFactory.createPrimary(input.primaryGoal);

const mission = LearningMission.plan({
  id,
  learnerId,
  objectives: [objective],
  plannedAt,
});
```

---

## 32. Collection Initialization

Collections must be initialized according to domain meaning.

Rules:

- required non-empty collections must be created with at least one valid element;
- optional collections should initialize empty internally;
- callers should not supply mutable arrays that remain externally mutable;
- duplicate prevention must be enforced;
- ordering semantics must be explicit;
- maximum size constraints must be enforced at creation.

Factories should pass immutable domain collections or copies.

---

## 33. Domain Event Emission

Creation may produce a domain event when the new object represents a meaningful domain fact.

Examples:

```text
SkillProgressStarted
MasteryPathwayOpened
LearningMissionPlanned
RemediationPlanCreated
MentorshipRelationshipRequested
RewardCreditIssued
CurriculumRequirementRegistered
```

Rules:

- The aggregate records the event.
- The factory may supply the facts required by the aggregate.
- The factory must not publish the event.
- Reconstitution must not re-emit the event.
- Event time must use the same domain clock instant as creation when appropriate.
- Event identity must follow the domain event contract.
- Event payload must contain stable domain facts, not infrastructure objects.

---

## 34. Event Ownership

The aggregate root should normally record its own creation event through a named constructor.

Example:

```ts
const progress = SkillProgress.start(props);
```

Inside `start`, the aggregate records `SkillProgressStarted`.

This protects the rule that every valid start emits the correct event.

The factory should not manually attach events after construction unless the aggregate API explicitly owns that operation.

Bad:

```ts
const progress = new SkillProgress(props);
progress.events.push(new SkillProgressStarted(...));
```

---

## 35. Factory Determinism

Given the same:

- creation input;
- policy decisions;
- identity provider output;
- clock output;
- domain configuration;

A factory must produce the same domain result.

Factories must not depend on:

- ambient time;
- mutable global state;
- implicit locale;
- unordered external collections;
- random values without an injected provider;
- current database contents unless those facts were explicitly loaded and supplied;
- environment variables directly.

Determinism enables reliable tests and auditability.

---

## 36. Side-Effect Freedom

Domain Factories should be side-effect free except for consuming explicitly injected deterministic providers such as identity and clock abstractions.

Factories must not:

- write to a database;
- publish messages;
- send email;
- call external services;
- read files;
- log sensitive domain data;
- modify unrelated aggregates;
- mutate caller-owned collections.

Any required external information must be obtained before calling the factory and supplied as domain facts.

---

## 37. Repository Interaction Rules

A Domain Factory must not depend on a repository by default.

If creation requires knowledge of existing state, the Application Service should load that state and pass the relevant domain facts or aggregates.

Preferred:

```ts
const existing = await progressRepository.findByLearnerAndSkill(...);
const result = factory.start({
  learner,
  skill,
  existingProgress: existing,
});
```

Avoid:

```ts
class SkillProgressFactory {
  constructor(private readonly repository: SkillProgressRepository) {}
}
```

A repository-dependent factory may be considered only when the domain model clearly defines a domain-level creation service whose core responsibility requires repository-backed uniqueness or lookup. Even then, prefer a Domain Service with an explicit name over hiding I/O inside a factory.

---

## 38. Transaction Boundary

A factory does not own the transaction boundary.

The Application Service owns transaction orchestration.

Typical sequence:

```text
1. authorize actor
2. load required state
3. begin transaction if required
4. evaluate policies/specifications
5. call factory
6. persist aggregate
7. commit transaction
8. publish committed events
```

The factory only performs step 5.

It must not commit or roll back anything.

---

## 39. Idempotency

Factories are not automatically idempotent.

Calling a factory twice may create two different identities and two valid new aggregates.

Use-case idempotency belongs primarily to the Application Layer and persistence boundary.

However, factories should support idempotent workflows by:

- accepting externally reserved identities when appropriate;
- not performing hidden writes;
- producing deterministic results from deterministic providers;
- making natural business keys explicit;
- not using ambient random values.

A factory must not claim idempotency unless the identity and creation semantics guarantee it.

---

## 40. Authorization vs Creation Policy

Authorization answers:

> Is this actor allowed to invoke this use case?

Creation policy answers:

> Is creation valid according to domain rules?

Examples:

```text
Authorization: Parent may create a learning mission for their child.
Domain policy: A remediation mission may be created only after confirmed repeated weakness.
```

The factory must not substitute actor permission checks for domain validity.

Authorization normally belongs in the Application Layer.
Domain policy belongs in the Domain Layer.

---

## 41. Validation Layers During Creation

Creation passes through several validation layers.

### 41.1 Transport validation

Checks:

- required JSON fields;
- primitive formats;
- request size;
- syntactic validity.

### 41.2 Application validation

Checks:

- referenced resources can be loaded;
- actor identity exists;
- command correlation and tenancy are valid;
- use-case prerequisites are available.

### 41.3 Domain factory validation

Checks:

- creation policy;
- initial aggregate invariants;
- valid child graph;
- valid initial state;
- cross-fact consistency;
- permitted domain variant.

### 41.4 Persistence validation

Checks:

- uniqueness constraints;
- optimistic concurrency;
- durable referential constraints.

The factory must not absorb all validation concerns.

---

## 42. Factory Failure Codes

Factory failures should use stable machine-readable codes.

Recommended structure:

```ts
export type DomainFailure = {
  code: DomainFailureCode;
  message: string;
  details?: Readonly<Record<string, DomainScalar>>;
};
```

Rules:

- codes are stable contracts;
- messages are human-readable but not relied upon for program logic;
- details contain non-sensitive explainable facts;
- failures must not expose stack traces;
- failures must distinguish business rejection from invalid programming state.

Example codes:

```text
FACTORY_INPUT_INCONSISTENT
INITIAL_INVARIANT_VIOLATED
CREATION_POLICY_REJECTED
REQUIRED_CHILD_MISSING
DUPLICATE_INITIAL_CHILD
INVALID_CREATION_VARIANT
PREREQUISITE_NOT_SATISFIED
LEARNER_NOT_ELIGIBLE
CURRICULUM_NOT_APPLICABLE
```

---

## 43. Explainable Creation Failure

For educational systems, explainability matters.

When a learner cannot begin a skill or pathway, the domain should often return reasons such as:

```text
missing prerequisite skill
mastery threshold not reached
curriculum mapping unavailable
learner already has an active pathway
assessment evidence insufficient
mentor relationship not active
```

The factory should preserve policy explanations rather than replacing them with a generic `INVALID_INPUT` failure.

This supports:

- parent guidance;
- teacher diagnosis;
- learner-facing next steps;
- audit trails;
- future localization.

---

## 44. Factory Naming

Factory names should describe the object or creation operation.

Accepted:

```text
SkillProgressFactory
MasteryPathwayFactory
LearningMissionFactory
RemediationPlanFactory
MentorshipRelationshipFactory
RewardCreditFactory
```

Operation names should use domain verbs:

```text
start
open
plan
createFromDiagnosis
establish
issue
register
```

Avoid vague names:

```text
make
buildData
generateObject
process
handle
createThing
```

---

## 45. Factory Interface Granularity

Prefer one focused factory per aggregate or tightly related creation family.

Good:

```ts
interface LearningMissionFactory {
  planFromGoal(...): DomainResult<LearningMission>;
  planFromDiagnosis(...): DomainResult<LearningMission>;
}
```

Potentially too broad:

```ts
interface DomainObjectFactory {
  create(type: string, payload: unknown): unknown;
}
```

A factory interface may contain multiple operations only when they create the same aggregate with clearly related domain origins.

Separate materially different lifecycle roots.

---

## 46. Factory Implementation Placement

Recommended module structure:

```text
src/modules/<bounded-context>/domain/
  aggregates/
  entities/
  value-objects/
  events/
  policies/
  specifications/
  factories/
    <aggregate>-factory.ts
    <aggregate>-factory.types.ts
    <aggregate>-factory.errors.ts
```

Alternative colocated structure:

```text
<aggregate>/
  <aggregate>.ts
  <aggregate>.events.ts
  <aggregate>.factory.ts
  <aggregate>.factory.spec.ts
```

Choose one repository convention and apply it consistently.

Do not place domain factories under:

```text
controllers/
api/
prisma/
database/
utils/
shared/helpers/
```

---

## 47. Dependency Direction

A Domain Factory may depend on:

- aggregates;
- entities;
- value objects;
- domain policies;
- domain specifications;
- domain services;
- domain event types;
- domain ports such as identity and clock abstractions.

A Domain Factory must not depend on:

- Express;
- Prisma;
- HTTP DTOs;
- controllers;
- UI models;
- environment configuration directly;
- queue clients;
- email providers;
- analytics SDKs;
- infrastructure repository implementations.

Dependency direction must always point inward toward domain concepts.

---

## 48. Factory Composition

Large creation workflows may compose smaller focused factories.

Example:

```text
LearningMissionFactory
  -> MissionObjectiveFactory
  -> MissionCheckpointFactory
  -> MissionRewardPlanFactory
```

Composition rules:

- one top-level factory owns aggregate creation;
- child factories create only child domain objects;
- failures propagate explicitly;
- identity and clock providers should be coordinated;
- child factories must not publish or persist;
- the final aggregate must validate the complete graph.

Avoid circular factory dependencies.

---

## 49. Variant Selection

Factories may choose among domain variants when selection is based on domain rules.

Example mission variants:

```text
FOUNDATION
GRADE_LEVEL
ADVANCEMENT
REMEDIATION
EXAM_PREPARATION
MENTOR_GUIDED
```

Variant selection must be:

- explicit;
- policy-driven;
- testable;
- represented as a domain type;
- explainable when selection fails.

Do not use arbitrary string switches scattered across application code.

---

## 50. Historical Import

Historical import is not ordinary new creation.

If the system imports prior learning records, create a separate domain operation such as:

```ts
SkillProgress.importHistorical(input)
```

Historical import rules must specify:

- whether creation events are emitted;
- whether historical timestamps are accepted;
- how trust level is represented;
- how evidence provenance is stored;
- how initial version is handled;
- whether current eligibility rules apply;
- whether imported mastery can unlock new content immediately.

Do not overload normal factories with undocumented import flags.

---

## 51. Migration and Legacy Data

Migration reconstitution should use dedicated migration or reconstitution paths.

Factories that enforce current creation policies must not be used to reconstruct legacy rows because:

- old data may have been valid under previous rules;
- current requirements may reject historical state;
- new creation events may be emitted incorrectly;
- timestamps and identities may be replaced;
- initial states may overwrite historical lifecycle state.

Migration belongs to controlled infrastructure/application tooling with explicit domain compatibility rules.

---

## 52. Factory Security Considerations

Factories must assume creation inputs are domain-typed but not automatically trustworthy.

Rules:

- never trust caller-supplied lifecycle status without an explicit operation;
- never trust caller-supplied version for new aggregates;
- never trust caller-supplied audit timestamps unless importing history through a dedicated path;
- never expose secret values in domain failures;
- never derive authorization from a field inside creation input;
- never allow caller-supplied child identity collisions;
- never permit mutable references to escape into the aggregate.

Security-sensitive checks that depend on actor permissions remain in the Application Layer.

---

## 53. Observability

Factories should not perform direct logging.

Observability belongs around the use case boundary.

The Application Layer may record:

- factory operation name;
- success or failure code;
- correlation ID;
- aggregate identity after successful creation;
- duration;
- actor and tenant references according to privacy policy.

Do not log full learner data, assessment evidence, or sensitive family information from inside domain factories.

---

## 54. Testing Strategy

Factory tests must verify domain creation behavior without infrastructure.

Required test categories:

1. successful creation;
2. initial lifecycle state;
3. required child creation;
4. initial collection state;
5. identity assignment;
6. timestamp assignment;
7. version initialization;
8. domain event recording;
9. policy rejection;
10. specification rejection;
11. invariant failure;
12. variant selection;
13. deterministic behavior;
14. no mutation of caller inputs;
15. no creation event during reconstitution.

---

## 55. Unit Test Example

```ts
it('starts skill progress in the valid initial state', () => {
  const identity = new FixedSkillProgressIdentityProvider('progress-1');
  const clock = new FixedDomainClock('2026-07-21T00:00:00.000Z');
  const policy = new AllowSkillProgressStartPolicy();

  const factory = new DefaultSkillProgressFactory(
    identity,
    clock,
    policy,
  );

  const result = factory.start(validInput);

  expect(result.ok).toBe(true);

  if (!result.ok) return;

  expect(result.value.id.value).toBe('progress-1');
  expect(result.value.status).toEqual(SkillProgressStatus.notStarted());
  expect(result.value.version).toBe(0);
  expect(result.value.startedAt.toISOString()).toBe(
    '2026-07-21T00:00:00.000Z',
  );
  expect(result.value.pullDomainEvents()).toContainEqual(
    expect.objectContaining({ type: 'SkillProgressStarted' }),
  );
});
```

---

## 56. Policy Rejection Test

```ts
it('rejects creation when prerequisites are not satisfied', () => {
  const policy = new RejectingSkillProgressStartPolicy(
    DomainFailure.of('PREREQUISITES_NOT_SATISFIED'),
  );

  const factory = createFactory({ policy });
  const result = factory.start(validInput);

  expect(result).toEqual({
    ok: false,
    failure: expect.objectContaining({
      code: 'PREREQUISITES_NOT_SATISFIED',
    }),
  });
});
```

The test must also confirm that identity and time providers were not consumed if policy evaluation rejects before creation, unless provider ordering is intentionally part of the contract.

---

## 57. Determinism Test

Use fixed collaborators.

```ts
const first = factory.start(input);
const second = factory.start(input);
```

If the identity provider returns the same identity and the clock returns the same instant, both results should be structurally equivalent.

If identity providers intentionally advance, test the provider contract separately and verify that all other fields remain deterministic.

---

## 58. Mutation Safety Test

Factories must not retain mutable caller-owned collections.

Example test:

```ts
const goals = [goalA];
const result = factory.plan({ ...input, goals });

goals.push(goalB);

expect(result.value.goals).toHaveLength(1);
```

Domain objects should receive immutable collections or defensive copies.

---

## 59. Event Test

Factory tests must verify:

- correct event type;
- correct aggregate identity;
- correct timestamp;
- required payload facts;
- no infrastructure fields;
- event recorded exactly once;
- reconstitution records no new event.

Avoid snapshotting an entire event if that makes harmless field additions brittle. Assert the contractually important fields.

---

## 60. Contract Tests

If multiple implementations of a factory interface exist, define shared contract tests.

Example variants:

```text
DefaultLearningMissionFactory
CountrySpecificLearningMissionFactory
ExperimentalAdaptiveMissionFactory
```

All implementations must satisfy:

- valid initial state;
- invariant protection;
- failure-code contract;
- event contract;
- deterministic dependency rules;
- no persistence side effects.

---

## 61. Test Doubles

Recommended test doubles:

```text
FixedDomainClock
FixedIdentityProvider
SequenceIdentityProvider
AllowPolicy
RejectPolicy
SatisfiedSpecification
UnsatisfiedSpecification
StubDomainCalculationService
```

Avoid mocking every internal method.
Prefer small deterministic fakes implementing domain ports.

---

## 62. Anti-Pattern: Factory for Everything

Do not introduce factories for trivial value objects or entities.

Excessive factories cause:

- indirection;
- fragmented invariants;
- discoverability problems;
- unnecessary interfaces;
- testing overhead;
- anemic domain objects.

Use factories only when creation complexity or domain meaning justifies them.

---

## 63. Anti-Pattern: God Factory

Forbidden:

```text
DomainFactory.create(type, payload)
```

A God Factory centralizes unrelated bounded contexts and destroys ownership.

Symptoms:

- string-based type switching;
- `unknown` payloads;
- imports from every module;
- dozens of branches;
- unrelated creation policies;
- frequent merge conflicts.

Replace it with focused factories owned by each domain module.

---

## 64. Anti-Pattern: Persistence Inside Factory

Forbidden:

```ts
async create(input) {
  const aggregate = ...;
  await prisma.skillProgress.create(...);
  return aggregate;
}
```

This mixes domain creation with infrastructure persistence and transaction ownership.

The Application Service must persist the factory result through a repository.

---

## 65. Anti-Pattern: Factory Returns Partial Object

Forbidden:

```ts
return {
  learnerId,
  skillId,
  status: undefined,
};
```

or:

```ts
return new SkillProgress({ ...partialProps });
```

A factory must return a fully valid object or a failure.

---

## 66. Anti-Pattern: Caller Chooses Initial State

Forbidden generic input:

```ts
{
  status: string,
  version: number,
  createdAt: string,
}
```

This lets callers bypass lifecycle rules.

Use named operations representing valid origins.

---

## 67. Anti-Pattern: Current Time in Domain Code

Forbidden:

```ts
Date.now()
new Date()
```

inside factory logic.

Use `DomainClock`.

---

## 68. Anti-Pattern: Random Identity in Domain Code

Avoid:

```ts
crypto.randomUUID()
Math.random()
```

inside factories.

Use an injected identity provider so tests and deterministic workflows remain reliable.

---

## 69. Anti-Pattern: Reusing New Factory for Reconstitution

This causes:

- duplicate creation events;
- reset versions;
- replaced timestamps;
- current-policy rejection of historical data;
- corrupted lifecycle state.

Use a dedicated reconstitution path.

---

## 70. Anti-Pattern: Infrastructure DTO as Factory Input

Forbidden:

```ts
factory.create(req.body)
factory.create(prismaRow)
```

Transport and persistence representations must be translated into explicit domain inputs or snapshots before crossing the domain boundary.

---

## 71. Anti-Pattern: Generic Exception for Expected Rejection

Forbidden:

```ts
throw new Error('Cannot create');
```

for expected business rejection.

Return an explicit domain failure with a stable code.

---

## 72. Anti-Pattern: Hidden Global Configuration

Factories must not read:

```text
process.env
singleton configuration
mutable feature flags
ambient locale
```

Domain configuration must be supplied explicitly as typed values or policy collaborators.

---

## 73. Anti-Pattern: Factory Bypasses Aggregate API

Factories must not mutate private aggregate collections or state through technical escape hatches.

Forbidden patterns include:

```ts
aggregate.props.status = ...
aggregate._children.push(...)
Object.assign(aggregate, raw)
```

The aggregate must expose valid construction or mutation APIs.

---

## 74. Math Learning World Factory Catalog

The following factory candidates are recognized for future implementation.

### 74.1 Learner context

```text
LearnerProfileFactory
LearnerGradePlacementFactory
LearnerCurriculumEnrollmentFactory
```

### 74.2 Skill and progress

```text
SkillProgressFactory
SkillAttemptFactory
LearningEvidenceFactory
MasteryAssessmentFactory
```

### 74.3 Pathway and mission

```text
MasteryPathwayFactory
PathwayStepFactory
LearningMissionFactory
MissionObjectiveFactory
MissionCheckpointFactory
RemediationPlanFactory
```

### 74.4 Mentorship

```text
MentorshipRelationshipFactory
MentorshipSessionFactory
MentorshipRecommendationFactory
```

### 74.5 Curriculum

```text
CurriculumRequirementFactory
GradeMappingFactory
SkillDependencyFactory
NationalCurriculumFactory
```

### 74.6 Credit and rewards

```text
RewardCreditFactory
CreditTransactionFactory
AccountDiscountCreditFactory
```

This is a candidate catalog, not a requirement to implement every factory immediately.

Each factory must be justified by actual creation complexity.

---

## 75. Skill Progress Creation Reference

A valid `SkillProgressFactory.start` flow should conceptually follow:

```text
Input
  learner identity
  skill identity
  curriculum identity
  initiating actor
  relevant eligibility facts

Evaluate
  learner eligibility
  curriculum applicability
  prerequisite satisfaction
  duplicate active progress rule

Create
  progress identity
  initial mastery
  attempt count zero
  initial lifecycle status
  creation timestamp

Record
  SkillProgressStarted event

Return
  valid SkillProgress aggregate
```

Persistence is not part of this flow.

---

## 76. Mastery Pathway Creation Reference

A valid `MasteryPathwayFactory.open` flow may follow:

```text
Input
  learner
  target mastery goal
  diagnosed current state
  applicable curriculum
  active pathway facts

Evaluate
  pathway opening policy
  prerequisite graph
  duplicate pathway rule
  target reachability

Calculate
  entry point
  required sequence
  checkpoints
  minimum mastery thresholds

Create
  pathway root
  ordered pathway steps
  entry checkpoint
  initial OPEN state

Record
  MasteryPathwayOpened event
```

Complex path calculation may be delegated to a Domain Service.

---

## 77. Learning Mission Creation Reference

A valid `LearningMissionFactory` should support explicit origins.

Examples:

```ts
planFromLearnerGoal(...)
planFromParentGoal(...)
planFromTeacherRecommendation(...)
planFromDiagnosis(...)
planForExamPreparation(...)
```

Each origin may produce different:

- mission type;
- required evidence;
- objective structure;
- minimum completion criteria;
- recommendation metadata;
- initial domain events.

Avoid one generic operation with many optional flags.

---

## 78. Remediation Creation Reference

Remediation must not be created merely because one answer was wrong.

A `RemediationPlanFactory.createForConfirmedGap` should require domain facts such as:

- repeated evidence of weakness;
- affected prerequisite chain;
- confidence of diagnosis;
- learner's current pathway;
- existing remediation status;
- applicable minimum mastery threshold.

The factory should create:

- explicit target gaps;
- ordered recovery objectives;
- reassessment checkpoints;
- completion criteria;
- initial proposed or active state according to policy.

---

## 79. Mentorship Creation Reference

A `MentorshipRelationshipFactory` should enforce:

- valid learner and mentor identities;
- relationship eligibility;
- permitted scope;
- consent requirements;
- active relationship uniqueness;
- initial relationship state;
- start and expiry rules;
- reward eligibility boundaries.

Creation should record a domain event such as:

```text
MentorshipRelationshipRequested
or
MentorshipRelationshipEstablished
```

according to whether acceptance is required.

---

## 80. Reward Credit Creation Reference

A `RewardCreditFactory` should protect financial-like domain integrity.

It must define:

- credit reason;
- earning source;
- beneficiary account;
- amount value object;
- currency or internal credit unit;
- issuance policy;
- expiration policy;
- transaction identity;
- initial transaction state;
- audit facts.

It must not:

- update account balance directly outside the aggregate contract;
- accept negative issuance unless a distinct debit operation exists;
- hide duplicate issuance checks;
- rely on floating-point arithmetic for value.

---

## 81. Factory Evolution

Factories evolve as creation rules evolve.

Evolution rules:

- preserve stable operation names when semantics remain the same;
- introduce a new operation when lifecycle origin changes materially;
- version external application contracts separately from internal factory APIs;
- avoid adding many optional parameters to preserve backward compatibility;
- update domain events when creation meaning changes;
- add migration guidance when historical reconstruction is affected;
- keep failures backward-compatible where consumed by higher layers.

---

## 82. Backward Compatibility

Factory interfaces are internal domain contracts but may still have many consumers.

Safe changes:

- add a new operation;
- add internal collaborators through constructor injection;
- enrich failure details without changing codes;
- introduce a new named creation variant.

Risky changes:

- change initial state;
- change event type;
- change identity semantics;
- change version initialization;
- reinterpret an existing operation name;
- convert a previously valid input into rejection without policy review.

Such changes require architecture review.

---

## 83. Review Checklist

Before accepting a new Domain Factory, verify:

- [ ] Creation is domain-significant or sufficiently complex.
- [ ] A constructor or named constructor alone is insufficient.
- [ ] The factory has one clear owner.
- [ ] Inputs are explicit domain types.
- [ ] The factory returns a valid object or explicit failure.
- [ ] Initial lifecycle state is factory-owned.
- [ ] Identity strategy is explicit.
- [ ] Time comes from an injected clock.
- [ ] Initial version follows repository conventions.
- [ ] Required child entities are created atomically.
- [ ] Collections are immutable or defensively copied.
- [ ] Creation policies/specifications are explicit.
- [ ] Domain events are recorded correctly.
- [ ] Events are not published by the factory.
- [ ] Persistence is not performed by the factory.
- [ ] Reconstitution is separate.
- [ ] Expected rejection uses stable failure codes.
- [ ] Tests cover success, rejection, invariants, and events.
- [ ] No infrastructure dependency leaks into the domain.
- [ ] No generic or God Factory is introduced.

---

## 84. Implementation Readiness Checklist

A factory is ready for implementation when:

- [ ] The aggregate lifecycle is documented.
- [ ] Initial state is unambiguous.
- [ ] Required invariants are documented.
- [ ] Creation inputs are known.
- [ ] Creation policy ownership is known.
- [ ] Required specifications are defined.
- [ ] Identity strategy is chosen.
- [ ] Time semantics are chosen.
- [ ] Domain event contract is defined.
- [ ] Failure codes are defined.
- [ ] Reconstitution strategy is separate.
- [ ] Repository version convention is known.
- [ ] Unit-test scenarios are listed.

Do not implement a factory before these decisions are stable enough to avoid encoding accidental behavior.

---

## 85. Completion Criteria

18I — Domain Factories is complete when the architecture establishes all of the following:

1. Domain Factory purpose and scope are explicit.
2. Factory selection rules prevent unnecessary abstraction.
3. Aggregate, entity, and value-object factory roles are distinguished.
4. New creation and reconstitution are strictly separated.
5. Factory relationships to constructors, builders, assemblers, mappers, services, and repositories are defined.
6. Identity, time, version, lifecycle state, and event rules are explicit.
7. Creation policies and specifications have clear roles.
8. Side effects, persistence, and transaction ownership are prohibited inside factories.
9. Failure handling is explainable and machine-readable.
10. Testing requirements protect initial state and domain meaning.
11. Math Learning World factory candidates and reference flows are documented.
12. Anti-patterns and review gates are clear.

---

## 86. Final Architectural Rule

> A Domain Factory is the authoritative doorway into a new domain lifecycle.

Every object it returns must begin life with:

- valid identity;
- valid initial state;
- satisfied invariants;
- explicit domain meaning;
- deterministic creation facts;
- correct domain events;
- no hidden infrastructure side effects.

When creation is simple, use a constructor or named constructor.
When creation is complex or policy-driven, use a focused Domain Factory.
Never use a factory as a generic object maker, persistence service, or escape hatch around aggregate rules.
