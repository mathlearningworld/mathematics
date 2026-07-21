# Chapter 28J — Mission Runtime Invariants

## Status

Final architecture specification for the non-negotiable invariants of Chapter 28 Mission Engine.

This document closes the Mission Engine architecture by defining the truths that every implementation, adapter, persistence model, projection, verifier, replay process, and gameplay integration must preserve.

---

## 1. Purpose

Mission Runtime Invariants answer:

> What must always remain true, regardless of implementation language, storage technology, UI design, scale, retry behavior, concurrency, offline activity, policy evolution, or runtime failure?

An implementation is not Mission Engine conformant merely because it has Mission-shaped tables or screens. It is conformant only when these invariants are enforced and verifiable.

---

## 2. Mission Engine Position

```text
Assessment
    ↓
Recommendation
    ↓
Mission Engine
    ↓
Gameplay / Learning / Practice Delivery
    ↓
Evidence
    ↓
Assessment
```

Mission Engine governs operational commitment and execution lifecycle.

It does not own learning interpretation.

---

## 3. Authority Invariants

### INV-AUTH-001

Recommendation proposes; Mission Engine decides whether and how a Mission becomes operational.

### INV-AUTH-002

Mission Engine never changes Assessment claims, confidence, readiness, or misconception state.

### INV-AUTH-003

Mission Engine never changes Recommendation history or priority decisions.

### INV-AUTH-004

Gameplay reports activity; Gameplay does not directly mutate authoritative Mission state.

### INV-AUTH-005

Assessment interprets evidence; Mission completion does not create mastery.

### INV-AUTH-006

Projection is read authority only.

### INV-AUTH-007

Verification may constrain or reject; Verification may not strengthen or execute.

---

## 4. Identity Invariants

### INV-ID-001

Every Mission has one immutable `missionId`.

### INV-ID-002

Every Mission belongs to exactly one tenant and one learner scope.

### INV-ID-003

Tenant and learner identity cannot be reassigned after Mission creation.

### INV-ID-004

Candidate, proposal, Mission, projection, event, evidence envelope, and replay identities are distinct.

### INV-ID-005

Cross-tenant and cross-learner references are rejected or quarantined.

### INV-ID-006

Every durable mutation records actor, command, correlation, causation, and policy identity where applicable.

---

## 5. Source and Provenance Invariants

### INV-SRC-001

Every Mission is traceable to an authorized source set.

### INV-SRC-002

Candidate generation never fabricates Assessment or Recommendation truth.

### INV-SRC-003

Merged candidates preserve all material provenance and limitations.

### INV-SRC-004

A withdrawn or superseded source cannot silently remain current.

### INV-SRC-005

Missing authoritative provenance prevents publication or activation.

---

## 6. Candidate Invariants

### INV-CAN-001

Candidate is not Mission.

### INV-CAN-002

Candidate generation has no operational side effect.

### INV-CAN-003

Candidate deduplication is deterministic.

### INV-CAN-004

Blocking prerequisites cannot be averaged away or hidden by candidate score.

### INV-CAN-005

Candidate merging cannot broaden authority beyond the union of valid source authority.

### INV-CAN-006

Expired or stale candidates cannot be activated without revalidation.

---

## 7. Proposal and Activation Invariants

### INV-ACT-001

Proposal is not acceptance.

### INV-ACT-002

Acceptance is not approval.

### INV-ACT-003

Approval is not activation.

### INV-ACT-004

Activation requires current source, valid prerequisites, required approvals, available delivery capability, active-load allowance, and version match.

### INV-ACT-005

Activation verification success does not itself activate.

### INV-ACT-006

Activation is durable before publication.

### INV-ACT-007

Duplicate active Mission policy is enforced transactionally.

### INV-ACT-008

Mission activation is not evidence of learner readiness.

---

## 8. Lifecycle Invariants

### INV-LIFE-001

Mission state changes only through explicit typed transitions.

### INV-LIFE-002

Every transition validates source state, target state, actor authority, expected version, and required reason.

### INV-LIFE-003

Terminal Missions are never silently reopened.

### INV-LIFE-004

Pause, block, expiration, cancellation, abandonment, supersession, and completion remain semantically distinct.

### INV-LIFE-005

A lifecycle label is not a mastery label.

### INV-LIFE-006

Out-of-order events cannot move Mission state backward through last-write-wins behavior.

### INV-LIFE-007

Lifecycle history is append-only.

---

## 9. Progress Invariants

### INV-PROG-001

Mission progress is operational fact, not learning interpretation.

### INV-PROG-002

Time spent is not success.

### INV-PROG-003

Activity count is not understanding.

### INV-PROG-004

Attempt and success are distinct.

### INV-PROG-005

Assisted and independent activity are distinct.

### INV-PROG-006

Objective satisfaction does not imply skill mastery.

### INV-PROG-007

Progress records are append-only; corrections use compensating records.

### INV-PROG-008

Offline and delayed activity retain source time and recorded time separately.

### INV-PROG-009

Duplicate activity cannot create duplicate semantic progress.

### INV-PROG-010

Progress Runtime may signal potential completion eligibility but cannot complete the Mission.

---

## 10. Objective and Milestone Invariants

### INV-OBJ-001

Objective identity and version are explicit.

### INV-OBJ-002

Objective completion rules are versioned.

### INV-OBJ-003

Sequencing policy is authoritative and explicit.

### INV-OBJ-004

Required objectives cannot disappear without an explicit Mission revision, waiver, or supersession.

### INV-OBJ-005

Waivers record actor, authority, reason, scope, and policy.

### INV-OBJ-006

Milestones are operational checkpoints, not mastery claims.

---

## 11. Blocker and Hold Invariants

### INV-BLOCK-001

Blocking prerequisites cannot be bypassed by aggregate priority or progress percentage.

### INV-BLOCK-002

Unresolved mandatory blockers prevent prohibited actions.

### INV-BLOCK-003

Holds remain visible in authoritative projections.

### INV-BLOCK-004

Only authorized actors or policies can resolve blockers and holds.

### INV-BLOCK-005

Blocker removal is a durable event.

### INV-BLOCK-006

Supersession never erases historical blockers.

---

## 12. Completion Invariants

### INV-COMP-001

Mission completed is not mastery confirmed.

### INV-COMP-002

Mission completed is not misconception resolved.

### INV-COMP-003

Mission completed is not readiness confirmed.

### INV-COMP-004

Mission completed is not Recommendation success by itself.

### INV-COMP-005

Completion requires a valid lifecycle state, required objectives, required milestones, evidence completeness, required independent evidence, required approvals, no mandatory holds, and version match.

### INV-COMP-006

Completion decision is `CONFIRM`, `REJECT`, or `HOLD`; ambiguity is not silently treated as success.

### INV-COMP-007

Completion is durable before downstream publication.

### INV-COMP-008

Completion policy is versioned and replayable.

### INV-COMP-009

Completion emits evidence for Assessment; it does not write Assessment conclusions.

---

## 13. Evidence Invariants

### INV-EVID-001

Every evidence handoff is traceable to source activities.

### INV-EVID-002

Evidence tenant and learner scope match the Mission.

### INV-EVID-003

Evidence integrity hash mismatch causes hold or quarantine.

### INV-EVID-004

Mission Engine stores handoff facts, not fabricated learning conclusions.

### INV-EVID-005

Delayed evidence does not rewrite historical event time.

### INV-EVID-006

Duplicate evidence handoff is idempotent.

---

## 14. Projection Invariants

### INV-PROJ-001

Projection never changes Mission truth.

### INV-PROJ-002

Projection may simplify but never strengthen.

### INV-PROJ-003

Optionality, blockers, holds, expiration, supersession, and limitations are preserved.

### INV-PROJ-004

Projection never labels Mission completion as mastery.

### INV-PROJ-005

Visible action is an affordance, not an executed transition.

### INV-PROJ-006

Stale projection cannot silently appear current.

### INV-PROJ-007

Machine projections and human projections have separate contracts.

### INV-PROJ-008

Cache is not Source of Truth.

### INV-PROJ-009

Every projection is traceable to Mission version, source watermark, audience scope, and policy version.

---

## 15. Persistence Invariants

### INV-PERS-001

Mission history is append-only.

### INV-PERS-002

Mission versions increase monotonically.

### INV-PERS-003

Every authoritative mutation writes event, audit, and idempotency metadata where required.

### INV-PERS-004

External events are published only after durable commit.

### INV-PERS-005

Last-write-wins is prohibited for authoritative Mission state.

### INV-PERS-006

Snapshots are rebuildable acceleration artifacts.

### INV-PERS-007

Supersession never deletes history.

### INV-PERS-008

Corrections are compensating records, not mutation of old records.

### INV-PERS-009

Event sequence gaps are detected.

### INV-PERS-010

Outbox retry cannot duplicate semantic effects.

---

## 16. Concurrency Invariants

### INV-CONC-001

Every authoritative command uses expected Mission version.

### INV-CONC-002

Version conflict produces typed refusal.

### INV-CONC-003

Concurrent completion, cancellation, supersession, and expiration cannot all succeed against the same version.

### INV-CONC-004

Idempotent retry returns the first semantic result.

### INV-CONC-005

Same idempotency key with different command fingerprint is rejected.

### INV-CONC-006

Out-of-order projection events use monotonic watermarks.

---

## 17. Replay Invariants

### INV-REPLAY-001

Historical replay uses historical inputs and historical policy.

### INV-REPLAY-002

Current policy replay is labeled simulation.

### INV-REPLAY-003

Historical replay is not reassessment.

### INV-REPLAY-004

Replay never rewrites Mission history.

### INV-REPLAY-005

Missing required historical policy yields `UNREPLAYABLE`.

### INV-REPLAY-006

Replay divergence is recorded, not hidden.

### INV-REPLAY-007

Deterministic replay controls event order, clocks, policy versions, schema upcasting, rounding, and tie-breaks.

### INV-REPLAY-008

Recovery replay must pass invariant verification before reconstructed state becomes authoritative.

---

## 18. Verification Invariants

### INV-VER-001

Verification may approve, limit, hold, quarantine, or reject.

### INV-VER-002

Verification may not strengthen Mission meaning.

### INV-VER-003

Verification success does not execute a command.

### INV-VER-004

Critical identity and provenance violations cannot be downgraded.

### INV-VER-005

Stale verification cannot authorize a newer Mission version.

### INV-VER-006

Every verification decision is traceable to findings and policy versions.

### INV-VER-007

Historical mutation and evidence fabrication are critical violations.

---

## 19. Human Authority Invariants

### INV-HUMAN-001

Learner choice is preserved where Mission optionality permits choice.

### INV-HUMAN-002

Parent, teacher, and mentor authority is explicit, scoped, and revocable.

### INV-HUMAN-003

Required approvals cannot be fabricated by automation.

### INV-HUMAN-004

Human override exists only where policy explicitly grants it.

### INV-HUMAN-005

Human override cannot authorize cross-tenant access, fabricate evidence, or rewrite history.

### INV-HUMAN-006

High priority does not automatically mean mandatory.

---

## 20. Security and Privacy Invariants

### INV-SEC-001

Tenant isolation is enforced at every read and write boundary.

### INV-SEC-002

Learner isolation is enforced at every read and write boundary.

### INV-SEC-003

Role permission alone is insufficient where relationship or consent is required.

### INV-SEC-004

Redaction cannot make a downstream consumer infer that a hidden blocker is absent.

### INV-SEC-005

Audit access is controlled and immutable.

### INV-SEC-006

Operational views minimize personally identifiable information.

### INV-SEC-007

Integrity failures trigger hold, quarantine, or rejection.

---

## 21. Determinism Invariants

### INV-DET-001

Candidate generation is deterministic for equal inputs and policies.

### INV-DET-002

Deduplication and merge use stable tie-break rules.

### INV-DET-003

Lifecycle validation is deterministic.

### INV-DET-004

Progress allocation is deterministic.

### INV-DET-005

Completion decision is deterministic for equal durable inputs and policy.

### INV-DET-006

Projection semantic output is deterministic for equal source watermark and audience policy.

### INV-DET-007

Verification finding codes and semantic decision are deterministic.

---

## 22. Failure Handling Invariants

### INV-FAIL-001

Failures are typed.

### INV-FAIL-002

Unknown or ambiguous state fails closed for authoritative mutation.

### INV-FAIL-003

Partial durable writes are prohibited.

### INV-FAIL-004

Publication failure does not roll back a committed Mission change; outbox retry handles delivery.

### INV-FAIL-005

Projection failure does not destroy Mission truth.

### INV-FAIL-006

Corrupt snapshots are discarded and rebuilt.

### INV-FAIL-007

Poison events are quarantined, not dropped.

### INV-FAIL-008

Recovery does not advance authority until Git/runtime evidence confirms durable state.

---

## 23. Consumer Boundary Invariants

### INV-CONS-001

Gameplay cannot bypass Mission commands by writing Mission tables directly.

### INV-CONS-002

Learning and Practice engines receive delivery contracts, not Mission authority.

### INV-CONS-003

Assessment receives evidence context, not a predetermined conclusion.

### INV-CONS-004

Recommendation receives Mission facts and recalculates independently.

### INV-CONS-005

Reward systems consume verified completion facts and their own reward policy.

### INV-CONS-006

No consumer treats a projection cache as authoritative Mission state.

---

## 24. Minimum Runtime Gate

An implementation may not claim Mission Engine conformance until automated verification covers at least:

```text
Tenant isolation
Learner isolation
Source provenance
Candidate determinism
Candidate deduplication
Blocking prerequisite preservation
Activation approval boundary
Duplicate active Mission prevention
Lifecycle transition matrix
Terminal-state protection
Optimistic concurrency
Idempotency conflict
Offline activity ordering
Duplicate progress prevention
Assisted-vs-independent separation
Completion hold behavior
Completion-versus-mastery boundary
Evidence integrity
Projection fidelity
Projection freshness
Append-only history
Outbox atomicity
Supersession retention
Snapshot rebuild
Historical replay
Current-policy simulation labeling
Replay divergence
Critical violation quarantine
Human authority boundaries
```

---

## 25. Required Test Families

### Contract Tests

Validate schemas, enums, public exports, failure codes, and version compatibility.

### State Machine Tests

Validate every allowed and denied lifecycle transition.

### Property Tests

Validate invariant preservation across generated command sequences.

### Concurrency Tests

Validate conflicting writes, retries, and event ordering.

### Persistence Tests

Validate atomic writes, append-only history, outbox, snapshots, and recovery.

### Replay Tests

Validate deterministic historical reconstruction and explicit divergence.

### Projection Tests

Validate audience fidelity, redaction, freshness, and limitation preservation.

### Security Tests

Validate tenant, learner, relationship, role, and consent boundaries.

### Operational Tests

Validate Browser/Gameplay → Mission Command → Persistence → Projection → Evidence Handoff flow.

---

## 26. Chapter 28 Completion Matrix

```text
28A Mission Engine Foundation          ✅
28B Mission Candidate Runtime          ✅
28C Mission Activation Runtime         ✅
28D Mission Lifecycle Runtime          ✅
28E Mission Progress Runtime           ✅
28F Mission Completion Runtime         ✅
28G Mission Projection Runtime         ✅
28H Mission Persistence & Replay       ✅
28I Mission Verification Runtime       ✅
28J Mission Runtime Invariants         ✅
```

---

## 27. Complete Mission Runtime Flow

```text
Verified Recommendation / Goal / Human Plan
                    ↓
            Mission Candidate
                    ↓
              Mission Proposal
                    ↓
       Acceptance and Required Approval
                    ↓
          Activation Revalidation
                    ↓
              Active Mission
                    ↓
         Lifecycle and Progress
                    ↓
        Completion Eligibility
                    ↓
        Completion Verification
                    ↓
      Durable Completion Decision
                    ↓
          Evidence Handoff
                    ↓
             Assessment
                    ↓
          Recommendation Recalculation
```

At every boundary:

```text
Identity
Authority
Version
Policy
Provenance
Idempotency
Audit
```

must remain explicit.

---

## 28. Architecture Completion Statement

Chapter 28 defines a Mission Engine that can safely convert recommendations and human goals into bounded operational commitments while preserving learner choice, prerequisite truth, human authority, lifecycle integrity, evidence traceability, durable history, replayability, and the strict boundary between doing a Mission and understanding mathematics.

The architecture is complete at repository specification level.

Runtime implementation, persistence adapters, automated verification, browser integration, and operational certification remain separate delivery gates.

---

## 29. Final Doctrine

```text
A Mission is a governed commitment to act.
It is not proof that learning occurred.

Mission Engine governs the journey.
Assessment decides what the journey means.
```
