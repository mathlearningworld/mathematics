# 18A — Domain Core Architecture

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 18A — Domain Core  
**Document Type:** Domain Architecture / Core Model Authority  
**Status:** Foundation Complete  
**Runtime Authorities:** `docs/runtime/17A-LEARNING-RUNTIME-CORE.md`, `docs/runtime/17B-SPECIALIZED-LEARNING-RUNTIME-MODULES.md`, `docs/runtime/17C-RUNTIME-EVENT-CONTRACTS.md`, `docs/runtime/17D-RUNTIME-RECOVERY-AND-SNAPSHOT.md`  
**Upstream Authorities:** Learning Mission System Blueprint 16A–16J  
**Downstream Consumers:** Phase 18B aggregate boundaries, Phase 18C value objects, Phase 18D domain events, application services, persistence, APIs, projections, analytics, and frontend runtime

---

## 1. Purpose

This document defines the authoritative domain language, bounded contexts, ownership rules, invariants, and collaboration model for Math Learning World.

The central doctrine is:

> The domain model protects the meaning of learning. Runtime coordinates execution, persistence stores evidence, projections explain outcomes, and interfaces support people; none of them may redefine domain truth.

Phase 18A establishes the language and decision boundaries that every downstream implementation must preserve. It does not define database tables, API routes, UI components, or framework-specific code.

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

The blueprint defines product and learning intent. The runtime foundation defines execution, event, replay, and recovery semantics. The domain layer defines authoritative business meaning and rules.

---

## 3. Domain Philosophy

### 3.1 Core domain

The core domain is building durable mathematical understanding through explicit targets, dependency-aware learning, observable evidence, trustworthy assessment, mastery decisions, appropriate support, and meaningful progression.

### 3.2 Progress is not activity

Time spent, clicks, attempts, rewards, and completed animations are activity signals. They are not proof of understanding by themselves.

### 3.3 Grade is not mastery

Grade level is a curriculum classification. It must remain distinct from skill dependency, task difficulty, learner readiness, and mastery.

### 3.4 Remediation is not punishment

Remediation is a targeted response to an identified gap or misconception. It must be evidence-based and connected to the original learning target.

### 3.5 Game mechanics serve learning

World activities and rewards may support engagement, but they may not grant mathematical mastery without valid evidence.

### 3.6 Human authority is explicit

Learners, parents, teachers, mentors, and platform operators have different domain responsibilities and may not be collapsed into one generic role.

---

## 4. Domain Authority Boundary

### 4.1 Phase 18A owns

- ubiquitous language;
- bounded-context topology;
- core, supporting, and generic domain classification;
- identity principles;
- aggregate ownership principles;
- invariant categories;
- cross-context collaboration rules;
- policy ownership;
- evidence semantics;
- human authority distinctions;
- anti-corruption requirements;
- privacy and consent meaning;
- domain verification requirements.

### 4.2 Phase 18A does not own

- concrete aggregate structures;
- final value-object schemas;
- detailed domain-event payloads;
- application command handlers;
- repositories and database schema;
- API routes;
- UI components;
- infrastructure products.

### 4.3 Runtime and domain separation

Runtime answers when execution occurs, which module executes, how commands are admitted, how events are recorded, and how retry and recovery work.

Domain answers what a target means, whether evidence is admissible, whether assessment is valid, whether mastery may change, whether progression is allowed, and which authority may approve an action.

Runtime may invoke domain decisions. It may not invent them.

---

## 5. Ubiquitous Language

### Learner

A person whose mathematical understanding, evidence, mastery, and progression are represented by the system. A learner is not merely an account.

### Account

A security and access identity. Account identity and learner identity are related but not interchangeable.

### Learning Target

A precise mathematical understanding or capability that the learner is expected to demonstrate.

### Skill

A reusable mathematical capability that may participate in dependency relationships and multiple curriculum mappings.

### Concept

A mathematical idea whose meaning may be represented, reasoned about, connected, and applied.

### Dependency

A directed learning relationship indicating that one capability materially supports another.

### Curriculum Requirement

An externally governed expectation mapping targets or skills to a curriculum, grade band, strand, or standard. It does not own learner mastery.

### Learning Mission

A bounded learning objective with a clear target, rationale, entry conditions, expected evidence, and completion semantics. It is not merely a task list.

### World Activity

A game-world interaction designed to create learning opportunities and observable evidence. Completing an activity does not necessarily establish mastery.

### Attempt

One bounded learner interaction intended to produce a result or evidence.

### Evidence

An immutable, attributable observation relevant to a learning target.

### Assessment

An authorized interpretation process that evaluates evidence against explicit criteria.

### Diagnosis

A reasoned interpretation of strengths, gaps, misconceptions, uncertainty, and prerequisite risk.

### Mastery

A scoped domain state indicating that accepted evidence satisfies an explicit versioned mastery policy.

### Learning Gap

A recognized absence, weakness, misconception, or unstable dependency affecting a target.

### Remediation

A targeted learning response intended to repair a recognized gap or misconception.

### Support Intervention

Authorized assistance that helps the learner continue without falsely satisfying the target on the learner's behalf.

### Progression

An authorized change in the learner's available path based on prerequisites, mastery, policy, and safety constraints.

### Readiness

A contextual judgment that available evidence and prerequisites make a target appropriate to begin or continue. Readiness is not mastery.

### Learning Path

An ordered or partially ordered set of targets and dependencies available to a learner.

### Mentor

A person authorized to support a learner within a defined scope. Mentorship does not automatically grant mastery authority.

### Tenant

An organizational boundary governing data ownership, policy, access, and operational responsibility.

### Policy Version Set

The complete set of versioned domain policies used for a consequential decision.

### Learning Record

The durable history of accepted learning-related facts for a learner. It is not a mutable dashboard row.

---

## 6. Domain Classification

### 6.1 Core domain

- learning-target meaning;
- skill and concept dependency;
- evidence admissibility;
- assessment interpretation;
- diagnosis;
- mastery evaluation;
- remediation selection;
- progression authorization;
- learner-path adaptation.

### 6.2 Supporting domains

- curriculum mapping;
- mission authoring;
- world-activity design;
- mentorship coordination;
- classroom coordination;
- parent oversight;
- learning support;
- learning-linked rewards;
- learning analytics interpretation.

### 6.3 Generic domains

- authentication;
- account security;
- generic notifications;
- file storage;
- payments;
- job scheduling;
- infrastructure observability.

Generic domains must not leak their models into core learning language.

---

## 7. Bounded Context Topology

### 7.1 Learner Identity Context

Owns learner identity, guardian relationships, authorized actor relationships, tenant association, and consent references. It does not own authentication credentials or mastery.

### 7.2 Knowledge Model Context

Owns skills, concepts, dependency graph, prerequisites, target definitions, and mathematical scope identity. It does not own learner-specific progress.

### 7.3 Curriculum Context

Owns curriculum versions, grade and strand classifications, requirements, and mappings from requirements to targets and skills. It does not own mastery decisions.

### 7.4 Learning Planning Context

Owns goals, target selection, mission planning, sequencing, readiness constraints, and plan revision rationale.

### 7.5 Learning Activity Context

Owns world activities, attempts, activity rules, task-completion facts, and raw learning observations. It does not grant mastery directly.

### 7.6 Evidence Context

Owns evidence identity, provenance, admissibility, classification, relationships, and evidence claims.

### 7.7 Assessment Context

Owns assessment definitions, criteria, scoring interpretation, misconception detection, outcomes, validity, and assessor authority.

### 7.8 Mastery Context

Owns mastery policy, evaluation, state, evidence basis, and reevaluation semantics.

### 7.9 Progression Context

Owns unlock rules, path transitions, prerequisite satisfaction, above-grade access, progression holds, and progression authorization.

### 7.10 Diagnosis and Remediation Context

Owns gap identification, misconception hypotheses, remediation objectives, remediation plans, outcomes, and escalation rules.

### 7.11 Support and Mentorship Context

Owns support relationships, mentor scope, interventions, support records, hint attribution, and human verification requests.

### 7.12 World Progress Context

Owns world resources, construction progression, game unlocks, rewards, and narrative progression. It does not own mathematical mastery.

### 7.13 Learning Analytics Context

Owns derived metrics, trend interpretation, cohort analysis, risk signals, explanatory projections, and governance reports. It is never the source of learner truth.

### 7.14 Governance Context

Owns policy publication, activation, review authority, audit requirements, exceptional overrides, and data-governance classifications.

---

## 8. Context Relationship Rules

- Contexts collaborate through explicit contracts, domain events, stable identifiers, and versioned policies.
- Direct access to another context's internal model is prohibited.
- No two contexts share one mutable domain object as common authority.
- Cross-context references use stable identities such as `LearnerId`, `LearningTargetId`, `SkillId`, `MissionId`, `EvidenceId`, and `PolicyVersionId`.
- A reference does not transfer ownership.
- Eventual consistency must be explicit.
- Where a decision requires current authoritative state, the owning context or required version must be consulted.
- Published contracts should be narrower than internal models.

---

## 9. Entity Identity Principles

- Identity remains stable across state changes, retries, rehydration, migrations, and projections.
- Names, labels, usernames, grade labels, and display codes are not sufficient identity.
- Tenant-owned identity must be tenant-qualified at authority boundaries.
- `LearnerId`, `AccountId`, `ActorId`, and external school identifiers are distinct.
- Retired or superseded entities must preserve historical interpretability.

---

## 10. Aggregate Ownership Principles

Phase 18B defines concrete aggregates. Phase 18A establishes these rules:

- every invariant has exactly one synchronous authority;
- aggregates remain small consistency boundaries;
- foreign aggregates are referenced by identity, not embedded wholesale;
- commands target one primary aggregate owner;
- cross-aggregate outcomes use application coordination and events;
- aggregate version is authoritative;
- aggregate design must not mirror database tables, REST resources, frontend screens, or queue messages;
- consequential learning decisions retain their evidence and policy basis.

---

## 11. Domain Invariants

### 11.1 Identity

- learner actions are attributable to the correct learner;
- actors act only within authorized scope;
- tenant boundaries are explicit;
- historical evidence retains original attribution.

### 11.2 Learning targets

- every mission references an active, interpretable target;
- target scope is explicit;
- target revisions do not silently reinterpret historical evidence;
- deprecated targets preserve historical mappings.

### 11.3 Evidence

- accepted evidence is immutable;
- evidence provenance is mandatory;
- learner and helper contributions remain distinguishable;
- evidence cannot be reassigned to another learner;
- inadmissible evidence cannot satisfy mastery;
- duplicate evidence cannot be counted as independent evidence merely because it was delivered twice.

### 11.4 Assessment

- criteria are versioned;
- outcomes identify evidence used;
- unsupported assessment authority is rejected;
- assessment certainty cannot exceed policy;
- invalidated evidence triggers explicit reevaluation.

### 11.5 Mastery

- mastery is target-scoped;
- mastery requires a versioned policy and admissible evidence;
- mastery retains its evidence basis;
- activity completion alone cannot imply mastery;
- rewards cannot create mastery;
- mastery expiry, revocation, or reduction is explicit and auditable.

### 11.6 Progression

- progression identifies authority and policy;
- prerequisites are satisfied, explicitly waived, or governed by an approved alternative path;
- above-grade learning is not blocked solely by chronological grade when prerequisites are met;
- critical gaps may create a progression hold with reason and release condition.

### 11.7 Remediation and support

- remediation references a diagnosed gap or preventive objective;
- remediation completion does not automatically establish mastery;
- support is attributable;
- hints affecting evidence independence are recorded;
- mentors may not submit evidence as though the learner produced it;
- overrides require authority and rationale.

### 11.8 Curriculum and world

- curriculum versions are immutable after publication;
- mappings identify effective versions;
- curriculum grade placement does not overwrite knowledge dependency meaning;
- world progression may depend on learning outcomes;
- learning outcomes may not depend on spending or cosmetic ownership;
- game-resource loss does not erase accepted learning evidence;
- reward retries do not create duplicate durable rewards.

---

## 12. Domain Decision Categories

### Deterministic decisions

The same authoritative state, command, policy versions, and accepted evidence must produce the same result.

Examples include prerequisite satisfaction, duplicate detection, mastery evaluation, progression eligibility, and permission validation.

### Interpretive decisions

Human judgment, probabilistic models, or heuristics may support misconception hypotheses, remediation recommendations, and confidence estimates.

Interpretive decisions must record method, input evidence, model or rubric version, authority, uncertainty, and whether human confirmation is required.

### Overrides

Every override records authority, original decision, overridden rule, rationale, scope, effective time, and review or expiry condition where applicable.

Overrides never rewrite historical events.

---

## 13. Domain Services

Domain services are appropriate only when a meaningful operation does not naturally belong to one entity or aggregate.

Potential services include prerequisite resolution, evidence admissibility, mastery evaluation, progression eligibility, curriculum mapping resolution, remediation candidate selection, policy resolution, and authority-scope evaluation.

Domain services must use domain language, remain infrastructure-independent, accept explicit inputs, expose deterministic behavior where required, return typed domain results, avoid hidden global state, and avoid direct persistence or transport publication.

---

## 14. Policy Ownership

Policies affecting learning meaning are explicit, versioned, reviewable, and attributable.

Examples include mastery policy, evidence policy, progression policy, remediation policy, support-independence policy, curriculum mapping policy, retention policy, and guardian verification policy.

Every consequential decision captures the policy version set used. Policy changes are prospective and do not silently reinterpret history. Tenant policy may specialize behavior but may not weaken platform safety, child privacy, evidence integrity, or audit requirements.

---

## 15. Evidence Authority Model

The domain distinguishes five layers:

1. Observation — what occurred.
2. Accepted Evidence — an observation admitted under policy.
3. Assessment Outcome — interpretation of accepted evidence.
4. Mastery Decision — policy-governed conclusion about a target.
5. Progression Decision — authorization based on mastery, prerequisites, and policy.

No layer may be skipped for implementation convenience.

Evidence provenance identifies producer, learner, target, source activity or assessment, time, support present, transformations, and admission policy.

New evidence may supersede an interpretation but does not delete historical evidence or decisions.

---

## 16. Human Authority Model

### Learner

May act, attempt, explain, choose permitted paths, request help, reflect, and produce evidence. A learner may not self-grant restricted mastery.

### Parent or guardian

May grant consent, observe progress, verify selected activities, approve support relationships, receive alerts, and request review according to policy.

### Teacher

May assign targets, review evidence, conduct assessments, verify outcomes, add qualitative observations, authorize interventions, and request reevaluation within scope.

### Mentor

May support and provide attributable guidance within granted scope. Mentor contribution remains distinguishable from learner performance.

### Platform operator

May manage governance, safety, policy publication, and operational integrity. Operational access does not automatically grant educational authority.

---

## 17. Anti-Corruption Layer Principles

External systems require translation boundaries, including curriculum datasets, school systems, assessment providers, identity providers, payments, analytics platforms, AI providers, content formats, game engines, and notifications.

An external score is not automatically mastery. An LMS completion is not automatically mission completion. An AI confidence score is not diagnosis truth. A grade label is not a skill dependency. A payment entitlement is not learning progression authority.

---

## 18. Failure Semantics

Domain failures are meaningful refusals, not generic technical errors.

Failure families include identity mismatch, tenant violation, unauthorized actor, unknown target, unmet prerequisite, inadmissible evidence, duplicate evidence, unsupported assessment authority, invalid policy version, insufficient mastery evidence, progression blocked, unresolved gap, invalid support attribution, stale version, incompatible curriculum mapping, prohibited override, and historical integrity violation.

Technical failures such as database timeout or network loss remain runtime or infrastructure failures unless they create a domain-relevant unresolved state.

---

## 19. Domain Event Ownership

Phase 18D defines detailed event contracts. Phase 18A establishes that:

- events are emitted by the authority owning the transition;
- names are past-tense domain facts;
- events do not command other contexts;
- events retain aggregate, tenant, actor, policy, correlation, and causation attribution according to 17C;
- public event contracts are narrower than internal state;
- historical meaning remains interpretable through schema evolution;
- analytics and UI events do not replace domain events.

Illustrative facts include `LearningTargetDefined`, `MissionPlanned`, `EvidenceAccepted`, `AssessmentCompleted`, `LearningGapIdentified`, `MasteryEstablished`, `ProgressionAuthorized`, `ProgressionHeld`, and `RemediationActivated`.

---

## 20. Privacy, Consent, and Child Safety

Privacy affects who may observe, assess, share, export, retain, and act on learning information.

Consent must be explicit about learner, actor, purpose, data class, tenant, effective time, and expiry or revocation where applicable.

Contexts receive only the minimum information required for an authorized purpose. Sensitive diagnoses and child-risk indicators require stricter authority than ordinary progress views.

Commercial policy may govern service access, but purchases may not create mastery, erase evidence, or rewrite learning truth.

---

## 21. Domain Independence Rules

The domain layer must not depend on Express, React, Prisma, PostgreSQL, HTTP, message brokers, cloud SDKs, game-engine APIs, analytics SDKs, payment-provider types, framework decorators, or global process state.

---

## 22. Downstream Modeling Requirements

### Phase 18B — Aggregate Boundaries

Must define aggregate roots, owned entities, command ownership, invariant ownership, stream identity, cross-aggregate references, lifecycle states, and concurrency boundaries.

### Phase 18C — Value Objects

Must define identity value objects, target scope, evidence provenance, policy references, mastery scope, curriculum coordinates, authority scope, tenant-qualified references, time semantics, validation, and equality.

### Phase 18D — Domain Events

Must define event ownership, names, payloads, schema versions, public and internal events, compatibility rules, privacy classification, and downstream consumers.

---

## 23. Verification Gates

### Repository Gate

Verify the authoritative path, upstream references, ubiquitous language, bounded contexts, ownership clarity, invariants, runtime/domain separation, infrastructure independence, and downstream constraints.

### Runtime Gate

Verify explicit domain boundaries, infrastructure-free domain execution, deterministic replay, policy attribution, aggregate version enforcement, typed failures, and idempotent effects.

### Operational Gate

Demonstrate:

```text
Learner Action
    ↓
Runtime Command Admission
    ↓
Owning Domain Authority
    ↓
Invariant Validation
    ↓
Domain Transition
    ↓
Runtime Event Persistence
    ↓
Projection / Analytics / UI
```

Invalid evidence, unauthorized actors, stale versions, and unmet progression rules must be refused without corrupting accepted history.

---

## 24. Conformance Checklist

A downstream design conforms only when:

- ubiquitous language is consistent;
- learning meaning is independent from UI and infrastructure;
- every invariant has one authority;
- account and learner identity are distinct;
- curriculum placement and mastery are distinct;
- activity, evidence, assessment, mastery, and progression remain separate;
- evidence is immutable and attributable;
- policy versions are explicit;
- human authority is scoped;
- tenant boundaries are explicit;
- overrides are exceptional and auditable;
- cross-context references are identity-based;
- external systems use anti-corruption boundaries;
- historical meaning survives replay and evolution;
- game rewards cannot fabricate mastery;
- commercial access cannot rewrite learning truth.

Any failed item requires architectural correction before implementation proceeds.

---

## 25. Foundation Completion Statement

Phase 18A is complete when the repository contains an authoritative domain-core architecture that establishes learning meaning as the core domain, defines the ubiquitous language and bounded contexts, separates domain authority from runtime and infrastructure, establishes identity, policy, evidence, human-authority, and invariant principles, constrains Phases 18B–18D, and preserves replay, recovery, audit, privacy, and tenant semantics from the runtime foundation.

With this document accepted, Phase 18B may define concrete aggregate boundaries without guessing domain ownership or meaning.
