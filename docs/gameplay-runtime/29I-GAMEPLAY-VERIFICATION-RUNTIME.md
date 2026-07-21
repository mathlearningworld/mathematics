# Chapter 29I — Gameplay Verification Runtime

## Status

Architecture specification for verifying gameplay records, transitions, evidence, projections, persistence, replay, and outbound publication.

## Purpose

Gameplay Verification Runtime determines whether gameplay truth is structurally valid, correctly scoped, provenance-safe, policy-compatible, semantically faithful, and safe to publish.

Verification may approve, limit, hold, quarantine, or reject. It must never strengthen gameplay meaning.

```text
Gameplay Records
      ↓
Verification Pipeline
      ↓
Publish / Publish with Limitations / Hold / Quarantine / Reject
```

## Core Doctrine

```text
Verification ≠ Execution
Verification ≠ Assessment
Verification ≠ Mastery
Verification never strengthens truth.
```

A verified gameplay record means only that it satisfies declared gameplay integrity and publication rules for a specific version and context.

## Verification Pipeline

```text
Structural Integrity
↓
Tenant / Learner / Actor Identity
↓
Source Provenance
↓
Policy and Runtime Compatibility
↓
Session and Lease Integrity
↓
Objective Binding Integrity
↓
Interaction Authorization and Ordering
↓
World Mutation Integrity
↓
Evidence Integrity
↓
Completion Integrity
↓
Projection Fidelity
↓
Persistence and Outbox Integrity
↓
Replay Integrity
↓
Publication Decision
```

Every stage produces typed findings. Critical findings stop publication unless an explicit quarantine policy applies.

## Verification Subjects

- Gameplay session creation and transitions
- Lease and device handoff records
- Objective binding and lifecycle
- Interaction records
- Offline synchronization batches
- World mutation results
- Evidence candidates
- Completion decisions
- Mission and Assessment handoffs
- Audience projections
- Persistence records and outbox messages
- Replay outputs and divergences

## Identity and Scope Verification

Verification must prove:

- tenant identity matches every source and target;
- learner identity matches the session and mission binding;
- actor identity and authority are valid at decision time;
- collaboration participants are explicitly scoped;
- no cross-classroom, cross-family, cross-learner, or cross-tenant leakage occurs;
- aggregate identifiers and correlation chains are consistent.

## Provenance Verification

Every meaningful gameplay fact must trace to an authorized source, including learner interaction, system-generated event, mentor action, accessibility adaptation, world simulation, offline client, or administrative recovery.

System-generated actions must never be represented as learner-generated actions. Missing provenance cannot be repaired by inference.

## Session Verification

Checks include:

- legal state transition;
- expected version;
- valid lease or approved offline mode;
- runtime compatibility;
- checkpoint integrity;
- heartbeat interpretation;
- pause/resume authority;
- expiration and abandonment rules;
- terminal state protection.

Heartbeat proves connectivity, not learner activity.

## Objective Verification

Checks include:

- objective source and version;
- session binding;
- availability and prerequisite state;
- sequencing policy;
- blocker and hold preservation;
- waiver authority;
- optionality preservation;
- assistance context;
- collaboration attribution;
- satisfaction rule version.

Waived objectives must not be published as satisfied objectives.

## Interaction Verification

Checks include:

- schema and command family;
- actor authorization;
- session activity state;
- objective eligibility;
- authoritative ordering;
- duplicate detection;
- world mutation result;
- client/server time relationship;
- accessibility and assistance attribution;
- offline reconciliation outcome.

Raw input, proximity, animation completion, or client acknowledgement alone cannot establish an authorized gameplay interaction.

## Evidence Verification

Checks include:

- immutable source interaction references;
- evidence family and schema;
- skill or claim mapping provenance;
- evidence strength classification;
- completeness and limitations;
- assistance and hint level;
- accessibility context;
- collaborative contribution attribution;
- overlap and independence;
- integrity hash;
- freshness and supersession.

Verification may establish that evidence is safe to hand off. It must not create Assessment claims.

## Completion Verification

Checks include:

- required objective resolution;
- optional objective policy;
- blocker and hold resolution;
- waiver authority;
- final world-state validation;
- frozen interaction sequence;
- evidence handoff readiness;
- collaboration resolution;
- durable decision and outbox atomicity;
- session closure compatibility.

Gameplay completion must not be published as mission completion or mastery.

## Projection Verification

Projection verification proves audience authorization, source version, freshness, redaction, limitation preservation, and absence of semantic escalation.

```text
Projection may simplify.
Projection may not strengthen.
```

## Persistence and Replay Verification

Checks include append-only history, version continuity, idempotency behavior, outbox atomicity, snapshot provenance, replay environment fingerprint, historical policy availability, divergence classification, and quarantine handling.

Historical replay must not silently use current policy and present the result as historical truth.

## Publication Decisions

```text
PUBLISH
PUBLISH_WITH_LIMITATIONS
HOLD_FOR_REVIEW
QUARANTINE
REJECT
```

### PUBLISH

All required checks pass and no unresolved limitation affects consumer interpretation.

### PUBLISH_WITH_LIMITATIONS

Safe to publish only when explicit limitations travel with the record and are preserved by consumers.

### HOLD_FOR_REVIEW

Human or authorized system review is required before publication.

### QUARANTINE

The record is preserved but isolated because integrity, security, identity, or provenance is unsafe.

### REJECT

The proposed transition or publication is invalid and must not become authoritative truth.

## Critical Violations

- CROSS_TENANT_SCOPE
- CROSS_LEARNER_SCOPE
- FABRICATED_ACTOR
- FABRICATED_SOURCE
- UNAUTHORIZED_SESSION_START
- UNAUTHORIZED_INTERACTION
- ILLEGAL_OBJECTIVE_TRANSITION
- BLOCKER_ERASURE
- OPTIONALITY_ESCALATION
- WAIVER_AS_SATISFACTION
- SYSTEM_ACTION_AS_LEARNER_ACTION
- EVIDENCE_HASH_MISMATCH
- GAMEPLAY_COMPLETION_AS_MASTERY
- GAMEPLAY_COMPLETION_AS_MISSION_COMPLETION
- HISTORICAL_MUTATION
- REPLAY_POLICY_MASQUERADE
- PROJECTION_MEANING_ESCALATION
- OUTBOX_STATE_DIVERGENCE

Critical violations require quarantine or rejection and durable audit evidence.

## Verification Versioning

A verification result is bound to:

- subject identity;
- subject version or ledger range;
- verifier version;
- policy versions;
- runtime compatibility version;
- actor and audience context;
- verification time;
- source hashes.

A previous verification result cannot authorize a changed record.

## Human Review

Human review is reserved for declared ambiguous, sensitive, safety-related, or policy-defined cases. Reviewers may approve a limited publication or require correction, but may not rewrite history or relabel activity as mastery.

Reviewer identity, authority, reason, evidence viewed, and decision must be durable.

## Failure Semantics

Typed failures include:

- VERIFICATION_SUBJECT_MISSING
- VERIFICATION_VERSION_CONFLICT
- VERIFICATION_POLICY_UNAVAILABLE
- VERIFICATION_SOURCE_UNVERIFIABLE
- VERIFICATION_SCOPE_VIOLATION
- VERIFICATION_ORDERING_CONFLICT
- VERIFICATION_EVIDENCE_INTEGRITY_FAILED
- VERIFICATION_PROJECTION_ESCALATION
- VERIFICATION_REPLAY_DIVERGED
- VERIFICATION_PUBLICATION_UNSAFE
- VERIFICATION_QUARANTINED

Verification service failure must default to safe non-publication, not implicit approval.

## Acceptance Gates

Implementation is acceptable only when automated verification proves:

1. tenant, learner, and actor isolation;
2. source provenance cannot be fabricated;
3. legal session and objective transitions;
4. lease and optimistic concurrency enforcement;
5. authoritative interaction ordering;
6. duplicate and idempotency behavior;
7. blocker, hold, waiver, assistance, and limitation preservation;
8. system actions remain distinct from learner actions;
9. evidence handoff cannot become an Assessment claim;
10. gameplay completion cannot become mission completion or mastery;
11. projection meaning cannot escalate;
12. append-only history and outbox atomicity;
13. historical replay policy fidelity;
14. divergence and critical violations are quarantined;
15. verification results are version-bound;
16. verifier outage fails closed.

## Chapter Boundary

29I defines publication verification. It does not own gameplay transitions, persistence, projection construction, Assessment interpretation, Mission decisions, or human educational judgment. Cross-runtime laws are finalized in 29J.
