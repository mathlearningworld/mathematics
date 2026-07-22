# 35E — Session Evidence Runtime

## Status

**Chapter:** 35 — Learning Session Runtime  
**Slice:** 35E  
**Authority:** Architecture specification  
**Purpose:** Define how learning-session activity becomes trustworthy, contextual, replayable evidence without confusing raw events, interpreted observations, assessment claims, progress updates, or mastery decisions.

---

## 1. Problem

A learning session produces many signals:

- answers;
- gestures and interactions;
- hints requested;
- time spent;
- retries;
- activity completion;
- explanations;
- teacher or parent observations;
- channel failures;
- adaptation outcomes;
- interruptions and resumes.

These signals are not automatically proof of understanding. The platform needs an evidence runtime that preserves what actually happened, qualifies its reliability, binds it to context, and routes it to the correct owning runtime.

---

## 2. Core Distinctions

```text
Event ≠ Observation
Observation ≠ Evidence
Evidence ≠ Inference
Inference ≠ Diagnosis
Correct answer ≠ Understanding
Completion ≠ Competence
Time spent ≠ Effort
Fast response ≠ Mastery
Repeated attempt ≠ Persistence without context
Session evidence ≠ Durable progress authority
```

These distinctions must remain explicit in naming, schemas, APIs, storage, projections, and UI.

---

## 3. Runtime Responsibility

Session Evidence Runtime owns:

- accepting session-originated evidence candidates;
- validating identity, provenance, ordering, and integrity;
- preserving raw event references;
- normalizing evidence envelopes;
- classifying evidence type and strength;
- attaching objective, skill, activity, and session context;
- detecting duplicates and conflicts;
- recording evidence quality and limitations;
- publishing accepted evidence to authorized consumers;
- preserving replay and auditability.

It does not own:

- declaring mastery;
- changing a diagnosis;
- updating curriculum truth;
- inventing missing observations;
- treating telemetry as learning proof by default;
- rewriting historical evidence after later interpretation.

---

## 4. Evidence Pipeline

```text
Runtime Event
    ↓
Evidence Candidate
    ↓
Validation
    ↓
Normalization
    ↓
Qualification
    ↓
Accepted / Rejected / Quarantined
    ↓
Evidence Ledger
    ↓
Authorized Publication
```

Interpretation may occur downstream, but the original evidence remains immutable.

---

## 5. Evidence Candidate

```text
SessionEvidenceCandidate
  candidateId
  tenantId
  learnerId
  sessionId
  sessionVersion
  planId
  planVersion
  activityId
  activityVersion
  objectiveRefs[]
  skillRefs[]
  sourceType
  sourceId
  sourceEventId
  occurredAt
  receivedAt
  sequenceNumber
  payload
  context
  actor?
  device?
  channel?
  integrityMetadata
```

Every candidate must identify where it came from and when it occurred.

---

## 6. Evidence Source Types

Canonical source types:

```text
LEARNER_RESPONSE
LEARNER_ACTION
LEARNER_EXPLANATION
ACTIVITY_RESULT
ASSESSMENT_RESULT
HINT_USAGE
RETRY_PATTERN
PACING_SIGNAL
ENGAGEMENT_SIGNAL
ACCESSIBILITY_INTERACTION
TEACHER_OBSERVATION
PARENT_OBSERVATION
TUTOR_OBSERVATION
SYSTEM_OBSERVATION
CHANNEL_DELIVERY
ADAPTATION_OUTCOME
SESSION_CHECKPOINT
SESSION_COMPLETION
```

Source type does not determine truth by itself. Each source carries specific limitations.

---

## 7. Evidence Classes

```text
PERFORMANCE
PROCESS
EXPLANATION
TRANSFER
RETENTION
ENGAGEMENT
ACCESSIBILITY
EXECUTION_FIDELITY
CONTEXTUAL
HUMAN_OBSERVATION
TECHNICAL
```

Examples:

- A correct answer is `PERFORMANCE` evidence.
- A learner-generated explanation may be `EXPLANATION` evidence.
- Solving a structurally different problem may be `TRANSFER` evidence.
- A channel timeout is `TECHNICAL` evidence, not learner evidence.
- Hint dependence is `PROCESS` evidence and requires context.

---

## 8. Evidence State

```text
RECEIVED
VALIDATING
ACCEPTED
REJECTED
QUARANTINED
SUPERSEDED_BY_CORRECTION
RETRACTED_BY_SOURCE
PUBLISHED
```

An accepted evidence item can later receive a correction or retraction record, but it is never silently mutated.

---

## 9. Qualification Model

```text
EvidenceQualification
  evidenceId
  evidenceClass
  claimScope
  reliability
  completeness
  directness
  contextualFit
  freshness
  independence
  accessibilityFit
  executionFidelity
  confidenceBand
  limitations[]
  conflictRefs[]
  qualificationPolicyVersion
```

Suggested qualitative bands:

```text
HIGH
MODERATE
LOW
UNKNOWN
NOT_APPLICABLE
```

The system must preserve why a band was assigned.

---

## 10. Claim Scope

Evidence must be bounded to what it can support.

```text
ACTIVITY_STEP
ACTIVITY
SESSION_OBJECTIVE
SKILL_COMPONENT
SKILL
PREREQUISITE
RETENTION_WINDOW
TRANSFER_CONTEXT
EXECUTION_ONLY
```

A successful activity step must not be promoted automatically to skill mastery.

---

## 11. Evidence Strength

Evidence strength depends on more than correctness.

Relevant factors include:

- whether assistance was used;
- number and type of retries;
- whether the task matched the intended objective;
- whether the learner explained reasoning;
- whether the response transferred to a new context;
- whether the result was retained later;
- whether the activity executed as designed;
- whether accessibility barriers were present;
- whether the evidence is independent or duplicated;
- whether timing and ordering are trustworthy.

---

## 12. Human Observation

Human observations must include:

```text
observerId
observerRole
relationshipToLearner
observationType
observedAt
recordedAt
structuredCodes[]
freeText?
context
confidence
possibleBiases[]
```

Free text may support review but must not silently become a machine fact. Human observation should be respected without being treated as infallible.

---

## 13. Ordering and Temporal Integrity

Evidence ordering must distinguish:

- event occurrence time;
- ingestion time;
- session sequence;
- activity sequence;
- correction time;
- publication time.

Late-arriving evidence is valid when provenance is trustworthy, but it must not rewrite what downstream systems knew at an earlier point in time.

---

## 14. Duplicate Detection

Duplicate identity may use:

```text
tenantId
sessionId
sourceEventId
sourceType
activityId
```

Semantic duplicate detection may flag likely duplicates but must not remove distinct attempts solely because payloads are similar.

Duplicate ingestion must be idempotent and return the existing evidence identity.

---

## 15. Conflict Handling

Evidence may conflict because:

- two sources disagree;
- a learner succeeds in one context and fails in another;
- a human observation conflicts with activity telemetry;
- a later correction invalidates source data;
- execution fidelity was compromised;
- an accessibility barrier affected performance.

Conflicting evidence must be linked, not averaged into false certainty.

```text
EvidenceConflict
  conflictId
  evidenceRefs[]
  conflictType
  detectedAt
  materiality
  resolutionState
  resolutionAuthority
  notes?
```

---

## 16. Rejection and Quarantine

Canonical rejection reasons:

```text
UNKNOWN_SESSION
IDENTITY_MISMATCH
STALE_OR_INVALID_SESSION_VERSION
UNKNOWN_ACTIVITY
INVALID_SEQUENCE
DUPLICATE_EVENT
MALFORMED_PAYLOAD
UNTRUSTED_SOURCE
INTEGRITY_CHECK_FAILED
POLICY_BLOCKED
UNAUTHORIZED_OBSERVER
```

Quarantine is used when evidence may be valid but needs investigation, for example:

- clock drift;
- partially missing provenance;
- conflicting source metadata;
- suspicious batch duplication;
- unsupported schema version.

---

## 17. Privacy and Data Minimization

The runtime must collect only evidence required for learning, safety, operations, or legitimate audit.

It must not infer sensitive traits from incidental behavior. Device, latency, or interaction telemetry must not become a proxy for intelligence, motivation, disability, or family circumstance.

Sensitive evidence requires:

- explicit purpose;
- access controls;
- retention policy;
- audit trail;
- redaction strategy;
- lawful guardian and learner handling where applicable.

---

## 18. Publication Contracts

Accepted evidence may be published to:

- Assessment Runtime;
- Diagnostic Runtime;
- Progress Engine;
- Intervention Effectiveness Runtime;
- Adaptive Learning Session Runtime;
- teacher or parent projections;
- operational audit and verification.

Publication must include the evidence identity, qualification, limitations, source version, and applicable objective or skill references.

---

## 19. Evidence Events

```text
SessionEvidenceReceived
SessionEvidenceAccepted
SessionEvidenceRejected
SessionEvidenceQuarantined
SessionEvidenceCorrected
SessionEvidenceRetracted
SessionEvidenceConflictDetected
SessionEvidencePublished
```

Events must be replay-safe and side-effect publication must use durable outbox semantics.

---

## 20. Evidence Ledger

The evidence ledger stores:

```text
EvidenceRecord
  evidenceId
  candidateIdentity
  normalizedPayload
  provenance
  qualification
  state
  objectiveRefs[]
  skillRefs[]
  acceptedAt?
  rejectionReason?
  correctionOf?
  retractionOf?
  policyVersion
  schemaVersion
```

Raw high-volume telemetry may be stored separately, but evidence records must retain durable references sufficient for audit.

---

## 21. Session Completion Evidence

Session completion can support claims about:

- planned activity execution;
- objective coverage attempt;
- session participation;
- evidence collection completeness;
- operational completion state.

It cannot by itself support mastery, retention, transfer, or diagnosis resolution.

---

## 22. Adaptation Evidence

For each adaptation, the evidence runtime should preserve:

- trigger evidence;
- pre-adaptation state;
- action applied;
- post-adaptation observations;
- whether stabilization occurred;
- whether burden increased or decreased;
- whether escalation followed.

This enables effectiveness analysis without pretending adaptation caused the outcome with certainty.

---

## 23. Accessibility Context

Evidence qualification must consider whether:

- the presentation was accessible;
- input mode matched learner needs;
- assistive technology was functioning;
- language demands exceeded the mathematical objective;
- sensory or motor barriers influenced the result;
- timing rules were appropriate.

A performance result produced under an accessibility failure must not be interpreted as ordinary skill evidence.

---

## 24. Observability

Required metrics:

- candidates received by source type;
- acceptance, rejection, and quarantine rates;
- duplicate rate;
- late-arrival rate;
- evidence conflict rate;
- correction and retraction rate;
- publication lag;
- missing-context rate;
- accessibility-compromised evidence rate;
- evidence volume per session and objective;
- downstream delivery failures.

Metrics must not expose learner-sensitive details beyond authorized operational need.

---

## 25. Failure Codes

```text
EVIDENCE_IDENTITY_INVALID
SESSION_CONTEXT_MISSING
SESSION_VERSION_MISMATCH
ACTIVITY_CONTEXT_MISSING
SOURCE_NOT_AUTHORIZED
SOURCE_EVENT_DUPLICATE
EVIDENCE_SCHEMA_UNSUPPORTED
EVIDENCE_INTEGRITY_FAILED
EVIDENCE_SEQUENCE_INVALID
EVIDENCE_POLICY_BLOCKED
EVIDENCE_QUALIFICATION_FAILED
EVIDENCE_PUBLICATION_FAILED
```

Failure to publish does not invalidate already accepted evidence. It creates a recoverable delivery failure.

---

## 26. Replay Rules

Replay must:

- reconstruct evidence state from immutable records;
- preserve original policy and schema versions;
- apply corrections and retractions in historical order;
- reproduce conflict links;
- avoid re-emitting external side effects;
- support point-in-time views;
- distinguish original acceptance from later reinterpretation.

Replay must not upgrade weak evidence using newer policy without an explicit requalification record.

---

## 27. Verification Requirements

Verification must prove:

- raw events are not automatically accepted as evidence;
- duplicate ingestion is idempotent;
- evidence scope cannot silently expand;
- correction and retraction preserve history;
- technical failures are not learner failures;
- accessibility context affects qualification;
- human observations retain provenance and limitations;
- downstream publication preserves evidence identity;
- replay returns deterministic evidence state.

---

## 28. Completion Criteria

35E is complete when the architecture provides:

- explicit event, observation, evidence, and inference boundaries;
- canonical evidence candidates and records;
- qualification and claim-scope models;
- duplicate, conflict, correction, and retraction handling;
- privacy and accessibility safeguards;
- durable publication contracts;
- deterministic replay and verification rules.

---

## Final Doctrine

> Session Evidence Runtime preserves what happened and how strongly it can support a claim. It must never turn activity telemetry into certainty, completion into mastery, or technical behavior into a judgment about the learner.
