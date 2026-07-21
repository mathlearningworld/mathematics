# Chapter 28I — Mission Verification Runtime

## Status

Architecture specification for verifying Mission integrity before activation, publication, progression, completion, replay acceptance, and downstream consumption.

---

## 1. Purpose

Mission Verification Runtime answers:

> Is this Mission state, transition, projection, completion decision, and persisted history safe, traceable, authorized, internally consistent, and semantically faithful enough to publish or consume?

Verification constrains authority. It does not create stronger authority.

---

## 2. Core Doctrine

```text
Verification may approve, limit, hold, quarantine, or reject.
Verification may never strengthen Mission meaning.
```

Verification cannot:

- increase readiness;
- infer mastery;
- erase blockers;
- activate a Mission;
- complete a Mission;
- override human authority;
- rewrite history;
- turn optional work into required work.

---

## 3. Verification Scope

Mission Verification covers:

- Mission creation integrity;
- source provenance;
- candidate and proposal integrity;
- activation prerequisites;
- lifecycle transition validity;
- objective and progress consistency;
- completion decision integrity;
- evidence handoff completeness;
- projection fidelity;
- persistence and replay integrity;
- permission and identity safety;
- publication readiness;
- downstream contract compatibility.

---

## 4. Verification Pipeline

```text
Structural Integrity
        ↓
Identity and Scope Integrity
        ↓
Source Provenance
        ↓
Policy Availability
        ↓
Authority and Permission
        ↓
Lifecycle Transition Integrity
        ↓
Objective and Progress Integrity
        ↓
Blocker / Hold Preservation
        ↓
Completion Integrity
        ↓
Evidence Handoff Integrity
        ↓
Projection Fidelity
        ↓
Persistence Integrity
        ↓
Replay Integrity
        ↓
Publication Decision
```

Each stage emits typed findings and never silently suppresses an earlier critical finding.

---

## 5. Verification Input Contract

A verification request includes:

```text
verificationId
verificationPurpose
missionId
missionVersion
tenantId
learnerId
sourceWatermark
requestedAt
requestedBy
policyBundleVersions
candidatePayload?
commandPayload?
transitionPayload?
projectionPayload?
completionPayload?
replayPayload?
```

The verifier must reject ambiguous or mixed scope.

---

## 6. Verification Purposes

```text
PRE_CREATION
PRE_PROPOSAL
PRE_ACTIVATION
PRE_TRANSITION
PRE_PROGRESS_APPLY
PRE_COMPLETION
PRE_PUBLICATION
PROJECTION_CHECK
PERSISTENCE_CHECK
REPLAY_CHECK
RECOVERY_CHECK
AUDIT_CHECK
```

A verification result is valid only for its declared purpose, source watermark, policy versions, and Mission version.

---

## 7. Structural Integrity

Checks include:

- required fields present;
- identifiers valid;
- enums supported;
- payload schema version supported;
- objective identifiers unique;
- milestone identifiers unique;
- transition payload compatible with command type;
- completion payload compatible with completion policy;
- timestamps valid;
- version numbers monotonic where required.

Structural validity is necessary but not sufficient.

---

## 8. Identity and Scope Integrity

The verifier must prove:

```text
request.tenantId == mission.tenantId
request.learnerId == mission.learnerId
source.tenantId == mission.tenantId
source.learnerId == mission.learnerId
projection scope is permitted
actor belongs to allowed authority scope
```

Critical failures:

```text
CROSS_TENANT_SCOPE
CROSS_LEARNER_SCOPE
IDENTITY_MISMATCH
UNAUTHORIZED_RELATIONSHIP
```

These findings require quarantine or rejection.

---

## 9. Source Provenance

Every Mission must remain traceable to one or more authorized sources:

```text
Verified Recommendation
Learner-selected Goal
Parent Plan
Teacher Plan
Mentor Plan
Curriculum Obligation
Retention Schedule
Recovery Trigger
Exploration Discovery
```

The verifier checks:

- source exists;
- source identity matches;
- source is not withdrawn;
- source version is known;
- source was eligible at decision time;
- source limitations remain preserved;
- provenance chain is complete.

Missing authoritative provenance is critical.

---

## 10. Policy Availability

The verifier requires the exact policy versions used for:

- candidate generation;
- proposal eligibility;
- activation;
- lifecycle transitions;
- progress allocation;
- completion;
- projection;
- persistence;
- replay.

Missing historical policy during replay returns `UNREPLAYABLE` rather than reconstructing with guesses.

---

## 11. Actor Authority

Checks include:

- actor identity authenticated;
- actor role permitted;
- learner consent where required;
- parent, teacher, or mentor relationship current;
- human approval not fabricated;
- automated actor restricted to declared policy authority;
- actor cannot approve its own restricted action where separation of duty is required.

---

## 12. Candidate and Proposal Integrity

Verification confirms:

- candidate is not already a Mission;
- proposal is not already activation;
- duplicate active Mission policy respected;
- prerequisite blockers preserved;
- optionality preserved;
- delivery requirements are explicit;
- expiration is valid;
- source has not been superseded;
- candidate merge did not erase provenance.

---

## 13. Activation Integrity

Before activation, verify:

```text
Proposal accepted
Required approvals complete
Candidate remains current
Source remains eligible
Prerequisites valid
No prohibited duplicate active Mission
Delivery capability available
Resource reservation valid
Active-load policy satisfied
Expected Mission version matches
```

Verification success does not itself activate the Mission.

---

## 14. Lifecycle Transition Integrity

For every transition:

- current state matches expected source state;
- target transition is allowed;
- actor has authority;
- required reason is present;
- blocker/hold policy satisfied;
- terminal state reopening is prohibited unless explicit recovery authority exists;
- supersession and expiration semantics are preserved;
- optimistic concurrency succeeds;
- idempotency is valid.

---

## 15. Progress Integrity

The verifier checks:

- activity belongs to the Mission;
- activity maps to valid objectives;
- allocation totals are valid;
- attempts and successes are not conflated;
- assisted and independent work remain distinct;
- offline timestamps satisfy acceptance policy;
- duplicates are rejected or idempotently returned;
- compensation references valid prior records;
- progress never exceeds contract limits;
- progress does not assert mastery.

---

## 16. Objective Integrity

Each objective must preserve:

```text
objectiveId
objectiveVersion
objectiveType
sequencePolicy
completionRule
requiredEvidenceType
supportPolicy
waiverPolicy
```

The verifier must reject objective mutation that would retroactively make unfinished work appear complete without an explicit versioned waiver or Mission revision.

---

## 17. Blocker and Hold Preservation

A Mission cannot be published as actionable when an authoritative blocker or hold prohibits action.

The verifier checks:

- blockers are current;
- resolution actor is authorized;
- hold reason preserved;
- projection exposes appropriate limitation;
- completion cannot bypass unresolved mandatory holds;
- supersession does not silently disappear blockers from history.

---

## 18. Completion Integrity

Before confirming completion, verify:

```text
Mission is in a completable lifecycle state
Required objectives satisfied or explicitly waived
Required milestones satisfied
Required evidence references exist
Independent evidence requirements satisfied
Human approvals complete
Completion policy version available
No mandatory blocker or hold remains
Expected Mission version matches
Completion command is idempotent
```

Completion verification must preserve:

```text
Mission completed ≠ mastery confirmed
```

---

## 19. Evidence Handoff Integrity

Checks include:

- evidence envelope identity valid;
- source activities traceable;
- integrity hash matches;
- learner and tenant scope match;
- capture and submission times valid;
- duplicates detectable;
- Assessment handoff status durable;
- Mission Engine did not insert a mastery conclusion.

---

## 20. Projection Fidelity

Projection verification confirms:

- projection source watermark matches;
- Mission state is not strengthened;
- optionality preserved;
- blockers and holds preserved;
- completion not mislabeled mastery;
- redaction policy correct;
- audience authorized;
- action affordances are valid proposals only;
- stale state clearly marked;
- cross-learner data absent.

---

## 21. Persistence Integrity

Checks include:

- append-only event history;
- monotonic Mission version;
- event sequence continuity;
- event and materialized state agreement;
- audit record present;
- idempotency record present where required;
- outbox record present for publishable events;
- snapshot integrity hash valid;
- no last-write-wins mutation;
- supersession history retained.

---

## 22. Replay Integrity

Replay verification confirms:

- replay type declared;
- exact input range known;
- required policies available;
- event order deterministic;
- clock inputs controlled;
- schema upcasters valid;
- historical replay does not use current policy silently;
- simulation is labeled simulation;
- divergence preserved;
- replay does not rewrite Mission history.

---

## 23. Verification Findings

Finding severity:

```text
INFO
WARNING
LIMITATION
ERROR
CRITICAL
```

Every finding includes:

```text
findingCode
severity
stage
missionId
missionVersion
fieldPath?
sourceReference?
messageKey
repairability
createdAt
```

---

## 24. Publication Decisions

```text
PUBLISH
PUBLISH_WITH_LIMITATIONS
HOLD_FOR_REVIEW
QUARANTINE
REJECT
```

### PUBLISH

All required checks pass.

### PUBLISH_WITH_LIMITATIONS

Safe to expose only when explicit limitations accompany the Mission.

### HOLD_FOR_REVIEW

Human or operational review is required before publication or transition.

### QUARANTINE

Integrity or security risk requires isolation.

### REJECT

The requested operation is invalid and must not proceed.

---

## 25. Critical Violations

Critical violations include:

```text
CROSS_TENANT_SCOPE
CROSS_LEARNER_SCOPE
FABRICATED_SOURCE
MISSING_AUTHORITATIVE_PROVENANCE
UNAUTHORIZED_ACTIVATION
UNAUTHORIZED_COMPLETION
BLOCKER_ERASURE
OPTIONALITY_ESCALATION
MISSION_COMPLETION_AS_MASTERY
HISTORICAL_MUTATION
REPLAY_REWRITES_HISTORY
EVENT_SEQUENCE_CORRUPTION
EVIDENCE_HASH_MISMATCH
POLICY_VERSION_FABRICATION
```

Critical violations cannot be downgraded by presentation policy.

---

## 26. Verification Result Contract

```text
verificationId
missionId
missionVersion
verificationPurpose
sourceWatermark
policyVersions
stagesExecuted
findings
decision
limitations
verifiedAt
verifierVersion
integrityHash
```

Verification results are durable for audit-sensitive operations.

---

## 27. Freshness and Reuse

A verification result may be reused only when:

- Mission version unchanged;
- source watermark unchanged;
- actor scope unchanged;
- relevant policy versions unchanged;
- result has not expired;
- no new blocker, hold, supersession, or withdrawal exists.

Otherwise re-verification is mandatory.

---

## 28. Human Review

Human review must record:

```text
reviewId
verificationId
reviewerId
reviewerRole
decision
reason
limitations
reviewedAt
```

Human override is allowed only where policy explicitly grants authority.

Human review cannot authorize cross-tenant access, fabricate evidence, or rewrite history.

---

## 29. Failure Model

Typed failures include:

```text
VERIFICATION_INPUT_INVALID
MISSION_NOT_FOUND
MISSION_VERSION_CONFLICT
POLICY_NOT_FOUND
SOURCE_NOT_TRACEABLE
ACTOR_NOT_AUTHORIZED
TRANSITION_NOT_ALLOWED
PROGRESS_INCONSISTENT
COMPLETION_REQUIREMENT_MISSING
PROJECTION_NOT_FAITHFUL
PERSISTENCE_CORRUPT
REPLAY_UNREPLAYABLE
CRITICAL_INTEGRITY_VIOLATION
```

---

## 30. Determinism

Given identical Mission records, policies, actor scope, clock inputs, and verification version, the semantic decision and finding codes must be deterministic.

Diagnostic ordering must use stable rules.

---

## 31. Minimum Verification Invariants

1. Verification never strengthens Mission meaning.
2. Verification success never executes a command.
3. Critical identity failures are quarantined or rejected.
4. Missing provenance never passes.
5. Optionality and blockers are preserved.
6. Mission completion is never interpreted as mastery.
7. Historical mutation never passes.
8. Replay divergence is never hidden.
9. Stale verification cannot authorize a newer Mission version.
10. Every publication decision is traceable to findings and policy versions.

---

## 32. Verification Scenarios

Automated tests must cover:

- valid activation;
- stale source before activation;
- missing parent approval;
- duplicate active Mission;
- invalid lifecycle transition;
- unauthorized pause or completion;
- offline duplicate progress;
- assisted work misreported as independent;
- unresolved completion hold;
- evidence hash mismatch;
- optional Mission projected as required;
- completion projected as mastery;
- missing outbox record;
- event sequence gap;
- historical replay using wrong policy;
- cross-tenant source;
- cross-learner projection;
- human review with permitted and prohibited overrides.

---

## 33. Exit Criteria

28I is complete when:

- verification purposes and stages are explicit;
- every authority boundary is checked;
- publication decisions are typed;
- critical violations are defined;
- verification cannot strengthen Mission meaning;
- stale verification is invalidated;
- durable results support audit and replay;
- automated scenarios cover integrity, security, lifecycle, completion, projection, persistence, and replay.

---

## 34. Final Principle

```text
Verification protects Mission truth.
It does not manufacture Mission truth.
```
