# 27J — Recommendation Runtime Invariants

Status: RUNTIME INVARIANTS DEFINED  
Depends on: 27A–27I

## 1. Purpose

This document defines non-negotiable invariants for Recommendation Engine runtime behavior.

An invariant is a condition that must remain true across generation, prioritization, recommendation, projection, persistence, replay, verification, publication, and downstream consumption.

If an invariant is violated, the runtime must reject, hold, quarantine, or otherwise prevent unsafe publication or mutation.

## 2. Global Authority Invariants

### REC-AUTH-001

```text
Assessment owns assessment claims.
Recommendation must not rewrite assessment truth.
```

### REC-AUTH-002

```text
Recommendation proposes next actions.
Recommendation does not activate missions.
```

### REC-AUTH-003

```text
Mission Engine owns mission acceptance and activation.
```

### REC-AUTH-004

```text
Learning Engine owns learning delivery.
Practice Engine owns practice delivery.
Gameplay owns gameplay experience.
```

### REC-AUTH-005

```text
Verification may constrain or reject a recommendation.
Verification may not strengthen it.
```

## 3. Identity Invariants

### REC-ID-001

Every recommendation belongs to exactly one tenant, learner, recommendation case, and recommendation set version.

### REC-ID-002

Cross-tenant and cross-learner source contamination is forbidden.

### REC-ID-003

Recommendation identity is stable across projections.

### REC-ID-004

A superseded recommendation retains its original identity and links to a successor; it is never reused as the successor.

### REC-ID-005

Correlation and causation metadata must not substitute for aggregate identity.

## 4. Scope Invariants

### REC-SCOPE-001

A recommendation must not exceed the scope of its supporting evidence.

### REC-SCOPE-002

Evidence for one representation does not automatically support all representations.

### REC-SCOPE-003

Evidence for one curriculum context does not silently authorize another curriculum context.

### REC-SCOPE-004

Audience projection may narrow disclosure but may not expand authority.

### REC-SCOPE-005

A goal-aligned recommendation must preserve required foundation dependencies.

## 5. Evidence Invariants

### REC-EVID-001

```text
No evidence ≠ learner is weak.
```

### REC-EVID-002

Missing evidence requires uncertainty, observation, assessment, waiting, or review—not fabricated mastery conclusions.

### REC-EVID-003

Every material recommendation reason must trace to eligible source claims or explicit policy.

### REC-EVID-004

Ineligible evidence cannot be made eligible through aggregation.

### REC-EVID-005

Late-arriving evidence creates a new recommendation cycle; it does not rewrite the earlier cycle.

### REC-EVID-006

Conflicting evidence must remain visible until legitimately resolved by an authorized upstream process.

## 6. Assessment Boundary Invariants

### REC-ASMT-001

Recommendation must not create, modify, confirm, or delete mastery claims.

### REC-ASMT-002

Recommendation must not increase assessment confidence.

### REC-ASMT-003

Recommendation priority is not mastery.

### REC-ASMT-004

Recommendation confidence is not mastery confidence and not probability of success.

### REC-ASMT-005

Recommendation completion does not prove understanding.

## 7. Candidate Invariants

### REC-CAND-001

```text
Candidate ≠ Recommendation.
```

### REC-CAND-002

Every candidate must have a canonical target, source trace, eligibility state, limitations, and blocking conditions.

### REC-CAND-003

Deduplication must preserve every contributing source reference.

### REC-CAND-004

Dependency traversal must be deterministic, bounded, and cycle-safe.

### REC-CAND-005

Blocked, ineligible, or quarantined candidates cannot silently enter the publishable set.

### REC-CAND-006

An empty candidate set must have an explicit reason.

## 8. Prioritization Invariants

### REC-PRIO-001

```text
Blocking rule wins over weighted score.
```

### REC-PRIO-002

Blocking prerequisites cannot be averaged away.

### REC-PRIO-003

Dependency ordering must be preserved unless an explicit verified exception applies.

### REC-PRIO-004

Tie resolution must be deterministic and traceable.

### REC-PRIO-005

Priority may be high even when confidence is low; the projection must preserve both facts.

### REC-PRIO-006

Optional exploration cannot become mandatory solely because of a high score.

### REC-PRIO-007

Priority factors must come from versioned policy and eligible inputs.

## 9. Learning Recommendation Invariants

### REC-LEARN-001

Conceptual absence or instability should not be treated as a mere fluency problem.

### REC-LEARN-002

A learning recommendation must state its learning purpose.

### REC-LEARN-003

Prerequisite repair must target the deepest actionable blocker, not blindly restart the entire curriculum.

### REC-LEARN-004

Representation-specific gaps must remain representation-specific unless evidence supports generalization.

### REC-LEARN-005

Learning sequence order must preserve dependency logic.

### REC-LEARN-006

Learning delivery details remain owned by Learning Engine.

## 10. Practice Recommendation Invariants

### REC-PRAC-001

Practice is recommended only when the target concept is sufficiently established for the intended practice purpose.

### REC-PRAC-002

Every practice recommendation has bounded dosage.

### REC-PRAC-003

Every practice recommendation has stopping rules.

### REC-PRAC-004

Persistent failure, misconception signals, fatigue, or contradiction must alter or stop the practice path.

### REC-PRAC-005

```text
Practice completed ≠ mastery confirmed.
```

### REC-PRAC-006

Repeated identical remediation without new evidence must trigger loop protection.

### REC-PRAC-007

Difficulty must remain within readiness and policy bounds.

### REC-PRAC-008

Practice variation must not silently change the assessed target.

## 11. Mission Recommendation Invariants

### REC-MISS-001

```text
Recommendation proposes.
Mission Engine decides.
```

### REC-MISS-002

Mission recommendation cannot create or activate a mission.

### REC-MISS-003

Mission optionality must be explicit and preserved across projections.

### REC-MISS-004

Foundation path and goal path may coexist; goal proximity does not erase foundation blockers.

### REC-MISS-005

Mission success evidence contract must be explicit.

### REC-MISS-006

```text
Mission completed ≠ mastery confirmed.
```

### REC-MISS-007

Exploration and challenge remain optional unless an accepted plan explicitly and lawfully requires them.

## 12. Confidence Invariants

### REC-CONF-001

Recommendation confidence cannot exceed its supportable source confidence bound.

### REC-CONF-002

Projected confidence cannot exceed recommendation confidence.

### REC-CONF-003

Verification cannot increase confidence.

### REC-CONF-004

Conflicting evidence cannot be published as high confidence.

### REC-CONF-005

Confidence cannot be used as a hidden substitute for priority, mastery, readiness, or learner ability.

### REC-CONF-006

Confidence reductions and limitations must remain visible downstream.

## 13. Readiness Invariants

### REC-READY-001

Recommendation does not own readiness truth.

### REC-READY-002

Blocking readiness requirements cannot be averaged away.

### REC-READY-003

A high-value action cannot bypass a mandatory readiness gate.

### REC-READY-004

Optional challenges may be offered only within safety and authority constraints.

### REC-READY-005

Readiness uncertainty must be preserved and may require ASSESS, OBSERVE, WAIT, or HUMAN REVIEW.

## 14. Misconception Invariants

### REC-MISC-001

```text
Wrong answer once ≠ misconception.
```

### REC-MISC-002

A misconception hypothesis must remain a hypothesis until Assessment authority confirms otherwise.

### REC-MISC-003

Recommendation wording must not strengthen misconception status.

### REC-MISC-004

Practice that repeatedly reinforces a suspected misconception must stop or change.

### REC-MISC-005

Contradictory misconception evidence requires visible uncertainty or human review.

## 15. Projection Invariants

### REC-PROJ-001

```text
One recommendation truth → many audience views.
```

### REC-PROJ-002

Projection may omit restricted detail but may not alter recommendation meaning.

### REC-PROJ-003

Projection cannot change target, recommendation type, canonical priority, optionality, or supersession state.

### REC-PROJ-004

Projection confidence cannot exceed source confidence.

### REC-PROJ-005

Material limitations cannot be dropped.

### REC-PROJ-006

Localized wording must preserve semantic meaning.

### REC-PROJ-007

Learner projection must not use harmful deficit labeling.

### REC-PROJ-008

Mission projection cannot imply mission activation.

### REC-PROJ-009

Stale or superseded recommendations cannot appear current.

### REC-PROJ-010

Audience disclosure follows least privilege.

## 16. Persistence Invariants

### REC-PERS-001

```text
Recommendation history is append-only.
```

### REC-PERS-002

Claims and recommendations are superseded, never overwritten.

### REC-PERS-003

No Last-write-wins behavior is permitted for authoritative state.

### REC-PERS-004

Every authoritative write uses optimistic concurrency or an equivalent explicit conflict mechanism.

### REC-PERS-005

Idempotent retries must not create conflicting duplicate authority.

### REC-PERS-006

Recommendation ordering is durable decision data.

### REC-PERS-007

Publication is recorded separately from recommendation creation.

### REC-PERS-008

Consumption does not mutate the original recommendation.

### REC-PERS-009

Current-state projections must be rebuildable from durable history.

### REC-PERS-010

Cache is never Source of Truth.

## 17. Replay Invariants

### REC-REPLAY-001

```text
Historical replay ≠ reassessment.
```

### REC-REPLAY-002

Historical replay uses historical source snapshots and policy versions.

### REC-REPLAY-003

Current-policy replay is a simulation and must be labeled as such.

### REC-REPLAY-004

Replay cannot mutate historical records.

### REC-REPLAY-005

Equivalent canonical inputs must produce equivalent canonical outputs or a recorded divergence.

### REC-REPLAY-006

Replay divergence must never be hidden.

### REC-REPLAY-007

Missing replay dependencies produce UNREPLAYABLE, not fabricated reconstruction.

### REC-REPLAY-008

Operational timestamp differences do not count as semantic divergence.

## 18. Verification Invariants

### REC-VERIFY-001

Every published recommendation set must have a verification decision.

### REC-VERIFY-002

Verification results are immutable and versioned.

### REC-VERIFY-003

Verification cannot invent missing provenance.

### REC-VERIFY-004

Critical violations result in QUARANTINE or REJECT.

### REC-VERIFY-005

Warnings allowed under PUBLISH_WITH_LIMITATIONS must remain visible.

### REC-VERIFY-006

Equivalent subject and verification policy produce equivalent verification meaning.

### REC-VERIFY-007

Human judgment is an explicit input, never hidden nondeterminism.

### REC-VERIFY-008

Verification cannot reorder recommendations or change their targets.

## 19. Publication Invariants

### REC-PUB-001

Only verified recommendation output may be published.

### REC-PUB-002

Projection publication authority cannot exceed source publication authority.

### REC-PUB-003

PUBLISH_WITH_LIMITATIONS must expose the limitations to the intended audience where relevant.

### REC-PUB-004

HOLD_FOR_REVIEW cannot be presented as an active recommendation.

### REC-PUB-005

QUARANTINED output cannot reach normal consumers.

### REC-PUB-006

Withdrawn output retains audit history.

### REC-PUB-007

Expiration and freshness state must be enforced at delivery time.

## 20. Temporal Invariants

### REC-TIME-001

Evidence time, decision time, and publication time are distinct.

### REC-TIME-002

Decision time cannot precede required source evidence time.

### REC-TIME-003

Publication cannot precede decision and verification.

### REC-TIME-004

Supersession is not retroactive.

### REC-TIME-005

Stale evidence cannot silently support a current recommendation.

### REC-TIME-006

Late evidence creates new authority rather than rewriting old authority.

## 21. Human Authority Invariants

### REC-HUMAN-001

Required human review cannot be bypassed by automated scoring.

### REC-HUMAN-002

Human review records actor, scope, reason, decision, and time.

### REC-HUMAN-003

Human review may approve an exception only within explicit policy authority.

### REC-HUMAN-004

Human decisions do not erase underlying evidence or automated verification history.

### REC-HUMAN-005

Parent, teacher, mentor, and operator authority scopes remain distinct.

## 22. Security and Privacy Invariants

### REC-SEC-001

Tenant boundaries are enforced at every source, write, projection, replay, and publication boundary.

### REC-SEC-002

Learner data is disclosed only to authorized audiences.

### REC-SEC-003

Operational logs must not contain unnecessary sensitive learner evidence.

### REC-SEC-004

Audit access is authorized and traceable.

### REC-SEC-005

Redaction decisions are recorded and deterministic under policy.

### REC-SEC-006

Security violations cannot be downgraded to ordinary warnings.

## 23. Determinism Invariants

### REC-DET-001

Candidate generation is deterministic for equivalent frozen inputs and policy.

### REC-DET-002

Prioritization and tie-breaking are deterministic.

### REC-DET-003

Projection meaning is deterministic for equivalent source, audience, locale, and policy.

### REC-DET-004

Verification meaning is deterministic for equivalent subject and policy.

### REC-DET-005

Any permitted randomness requires a persisted seed and explicit policy.

### REC-DET-006

Hidden runtime order, clock timing, or worker identity must not alter recommendation meaning.

## 24. Failure Handling Invariants

### REC-FAIL-001

Failure must not produce partially authoritative output.

### REC-FAIL-002

Unknown state is not treated as success.

### REC-FAIL-003

Critical integrity failure is quarantined.

### REC-FAIL-004

Retry is idempotent and version-aware.

### REC-FAIL-005

Recovery resumes from durable state, not conversational assumption or transient memory.

### REC-FAIL-006

A failed downstream projection does not invalidate the persisted source recommendation, but it blocks that projection's publication.

## 25. Consumer Boundary Invariants

### REC-CONS-001

Downstream consumers receive a versioned contract.

### REC-CONS-002

Consumer acceptance, modification, deferment, or rejection is recorded separately.

### REC-CONS-003

Consumer behavior cannot retroactively alter recommendation history.

### REC-CONS-004

Learning, practice, and mission completion generate evidence for Assessment; they do not directly mutate Assessment claims.

### REC-CONS-005

A consumer must not treat optionality as hidden obligation.

## 26. Non-Negotiable Summary

The following statements must always remain true:

```text
No evidence ≠ learner is weak.
Wrong answer once ≠ misconception.
Candidate ≠ recommendation.
Priority ≠ mastery.
Recommendation confidence ≠ success probability.
Blocking prerequisites cannot be averaged away.
Recommendation proposes; Mission Engine decides.
Practice completed ≠ mastery confirmed.
Mission completed ≠ mastery confirmed.
Projection confidence ≤ source confidence.
Historical replay ≠ reassessment.
Recommendation history is append-only.
No Last-write-wins.
Recommendations are superseded, never overwritten.
Verification cannot strengthen recommendations.
Critical violations are quarantined.
Cache is not Source of Truth.
```

## 27. Invariant Violation Response

Required response classes:

```text
REJECT_COMMAND
HOLD_FOR_REVIEW
QUARANTINE_RECORD
WITHDRAW_PUBLICATION
REBUILD_PROJECTION
START_NEW_RECOMMENDATION_CASE
RECORD_REPLAY_DIVERGENCE
RAISE_SECURITY_INCIDENT
```

The response must be selected by versioned policy and recorded durably.

## 28. Minimum Runtime Gate

A Recommendation Engine implementation cannot claim conformance unless automated verification covers at least:

- cross-tenant rejection,
- source traceability,
- confidence ceiling,
- contradiction preservation,
- blocker precedence,
- deterministic tie-break,
- practice dosage and stopping rules,
- mission activation boundary,
- projection fidelity,
- append-only persistence,
- optimistic concurrency,
- idempotent retry,
- supersession history,
- deterministic replay,
- replay divergence handling,
- critical violation quarantine.

## 29. Completion Rule

27J is complete when the Recommendation Engine has an explicit, testable, non-negotiable invariant set governing authority, identity, scope, evidence, candidates, priority, learning, practice, missions, confidence, readiness, misconceptions, projections, persistence, replay, verification, publication, time, human authority, security, determinism, failure recovery, and consumer boundaries.

With 27J, Chapter 27 defines a complete Recommendation Engine architecture from candidate generation through durable, explainable, replayable, verified publication.
