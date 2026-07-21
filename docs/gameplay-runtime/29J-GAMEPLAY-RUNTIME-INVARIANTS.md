# Chapter 29J — Gameplay Runtime Invariants

## Status

Final architecture law set for Chapter 29 Gameplay Runtime.

## Purpose

This chapter locks the non-negotiable invariants that every Gameplay Runtime implementation, adapter, projection, persistence layer, replay worker, verifier, and consumer must preserve.

```text
Session
→ Objective
→ Interaction
→ Evidence
→ Completion
→ Projection
→ Persistence / Replay
→ Verification
```

No layer may create stronger educational meaning than the authoritative facts support.

## Foundational Invariants

1. Gameplay Runtime owns gameplay execution truth, not educational mastery truth.
2. Gameplay activity is not mastery.
3. Gameplay completion is not Mission completion.
4. Mission completion is not Assessment mastery.
5. Score, time spent, speed, repetition, and animation completion are observations only.
6. Assessment Engine alone owns Assessment claims.
7. Mission Engine alone owns Mission lifecycle decisions.
8. Recommendation Engine alone owns Recommendation decisions.
9. Projection is never Source of Truth.
10. Cache, snapshot, checkpoint, client state, and replay output are never Source of Truth.

## Authority Invariants

- Every transition has one declared owning runtime.
- A consumer may request a transition but may not perform it on behalf of the owner.
- Visible UI action is not authorization.
- Client acceptance is not server acceptance.
- Verification is not execution.
- Publication is not transition authority.
- Human review authority must be explicit, scoped, time-valid, and durable.

## Identity and Isolation Invariants

- Tenant identity is mandatory on every durable record and command.
- Learner identity is mandatory for learner-bound gameplay.
- Actor identity is distinct from learner identity.
- Device identity is not actor identity.
- Collaboration group identity does not replace individual attribution.
- No cross-tenant, cross-learner, cross-family, or cross-classroom data flow is implicit.
- Aggregate identifiers cannot be trusted without tenant and learner scope.
- Redaction must prevent direct and inferential leakage.

## Session Invariants

- Session creation does not imply active interaction intake.
- OPEN does not mean ACTIVE.
- ACTIVE requires valid policy, compatibility, binding, and authority.
- Pause preserves history and does not fabricate inactivity reasons.
- Resume requires revalidation.
- Heartbeat proves liveness, not learning activity.
- Lease ownership is explicit and versioned.
- Device handoff cannot create two simultaneous authorities.
- Expiration, abandonment, failure, and completion remain distinct outcomes.
- Terminal session states cannot be reopened without an explicit new session or approved recovery transition.
- Runtime fault is not learner failure.

## Objective Invariants

- Objective candidate is not bound objective.
- Bound objective is not available objective.
- Available objective is not active objective.
- In-progress objective is not satisfied objective.
- Satisfied objective is not mastered skill.
- Waived is not satisfied.
- Optional is not required.
- Hidden is not completed.
- Blocked is not failed by the learner.
- Objective order follows declared sequencing policy.
- Prerequisites, blockers, holds, waivers, and supersession remain visible in truth.
- Objective-local progress cannot silently mutate Mission progress.
- Objective satisfaction rules are versioned and replayable.

## Interaction Invariants

- Raw input is not an authorized interaction.
- Proximity is not authorization.
- UI animation completion is not world mutation success.
- Client timestamp is not ordering authority.
- Client acknowledgement is not durable acceptance.
- Every interaction retains actor, source, session, objective, ordering, and policy provenance.
- System-generated action remains distinct from learner-generated action.
- Mentor or teacher action remains distinct from learner action.
- Accessibility adaptation remains visible where it affects interpretation.
- Assistance level remains attached to relevant interactions.
- Duplicate delivery cannot create duplicate semantic effects.
- Offline interactions remain provisional until reconciled.
- Reconciliation cannot silently discard conflicts to manufacture success.

## World Mutation Invariants

- Requested mutation is not applied mutation.
- Applied mutation is not educational evidence by itself.
- World state changes require authoritative outcome records.
- Conflicting mutations require explicit resolution.
- Replay must identify the exact ledger position and runtime compatibility version.
- Visual state may lag authoritative state and must not be treated as stronger truth.

## Evidence Invariants

- Observation is not interpretation.
- Evidence candidate is not Assessment claim.
- Correct outcome is not proof of understanding.
- Incorrect outcome is not proof of no understanding.
- Final outcome alone may be weaker than process evidence.
- Assisted success is not independent success.
- Group success is not individual evidence.
- Evidence limitations travel with the evidence.
- Contradictory evidence is preserved.
- Evidence provenance is immutable.
- Source interaction references cannot be fabricated or replaced silently.
- Evidence strength is classified, not assumed.
- Evidence overlap and dependence must be represented.
- Accessibility context must not be mislabeled as assistance unless policy declares it so.
- Gameplay Runtime may prepare evidence but may not issue mastery, misconception, readiness, or placement claims.

## Completion Invariants

- Completion request is not completion decision.
- Objective satisfaction is not session completion.
- Session completion is not Mission completion.
- Mission completion is not mastery.
- Required objective policy is versioned.
- Optional objective policy cannot be escalated silently.
- Waiver authority is explicit and durable.
- Blockers and holds cannot be erased by projection or retry.
- Completion limitations remain attached to the decision and every handoff.
- Operational failure cannot become learner failure.
- Completion and outbound handoff are atomically durable through state plus outbox.
- Session closure cannot precede required durable completion work.
- Completion decisions are immutable; corrections use superseding or invalidating records.

## Projection Invariants

- Projection may contain less information but never stronger meaning.
- Projection may summarize but cannot reinterpret activity as learning success.
- Projection freshness is explicit.
- Stale projection cannot expose unsafe commands as current.
- Affordance visibility is not authorization.
- Redaction is deterministic, policy-versioned, and auditable.
- Localization changes wording, not semantics.
- Learner, parent, teacher, mentor, Mission, Assessment, operations, and audit views have distinct disclosure contracts.
- Projection cache cannot become Source of Truth.
- Superseded and withdrawn projections cannot masquerade as current.

## Persistence Invariants

- Gameplay history is append-only.
- No last-write-wins for authoritative state.
- Every state-changing command uses optimistic concurrency or an equivalent deterministic guard.
- Idempotency keys are scoped and durable.
- Same key plus different semantic input is a conflict.
- Snapshot is not Source of Truth.
- Checkpoint is not Source of Truth.
- Local offline storage is not Source of Truth.
- Corrections create new records; they do not rewrite history.
- State change and outbox publication intent commit atomically.
- Publication retry is idempotent.
- Retention and privacy actions cannot falsely rewrite educational history.

## Ordering and Concurrency Invariants

- Authoritative sequence is explicit.
- Client order is evidence, not final authority.
- Concurrent objective, interaction, lease, and completion updates are detected.
- Duplicate, late, and out-of-order records are handled by declared policy.
- Conflict resolution is durable and replayable.
- Two devices cannot both silently own the same exclusive lease.
- Reconciliation cannot depend on arrival order when semantic ordering information exists.

## Replay Invariants

- Historical replay is not reassessment.
- Current-policy simulation is not historical truth.
- Replay input range, policy version, runtime version, and environment fingerprint are explicit.
- Replay divergence is evidence and is never hidden.
- Unreplayable is a valid typed outcome.
- Replay cannot overwrite original decisions.
- Recovery replay must prove ledger position before accepting new commands.
- Projection replay must preserve historical audience and redaction policy where required.
- World replay cannot infer missing learner actions.

## Verification Invariants

- Verification may publish, publish with limitations, hold, quarantine, or reject.
- Verification may never strengthen gameplay meaning.
- Verified gameplay evidence is still not an Assessment claim.
- Verified completion is still not Mission completion or mastery.
- Verification result is bound to exact subject version and source hashes.
- A changed subject requires new verification.
- Critical identity, provenance, integrity, or semantic violations fail closed.
- Verifier outage does not imply approval.
- Quarantined records remain durable and isolated.
- Human review cannot rewrite history or convert activity into mastery.

## Assistance and Accessibility Invariants

- Hint, scaffold, direct answer, mentor action, and system automation are distinct assistance categories.
- Assistance context is never silently removed.
- Accessibility accommodation is not automatically evidence weakness.
- Interpretation policy must distinguish accessibility from instructional assistance.
- Reduced input complexity cannot be presented as independent execution unless the policy supports that claim.
- Learner dignity and privacy are preserved in all audience projections.

## Collaboration Invariants

- Group identity does not replace individual identity.
- Shared world outcome is not individual contribution evidence.
- Individual contribution requires attributable source records.
- Mentor, teacher, peer, and system contributions remain distinct.
- Collaboration policy is versioned.
- A group completion decision cannot create individual mastery claims.
- Privacy boundaries apply within collaboration groups.

## Security and Privacy Invariants

- Least privilege applies to commands, records, projections, replay, and operations.
- Sensitive learner content is encrypted according to policy.
- Audit access is itself auditable.
- Error messages cannot leak cross-scope identifiers or hidden policy.
- Integrity hashes and signatures are verified before trusted publication.
- Security quarantine cannot be bypassed through projection or replay.
- Privacy withdrawal is explicit and cannot fabricate an alternate historical outcome.

## Failure Handling Invariants

- Failures are typed.
- Unknown failure does not default to success.
- Operational failure is not learner failure.
- Retry does not duplicate semantic effects.
- Partial success is explicit.
- Silent data loss is prohibited.
- Silent limitation removal is prohibited.
- Recovery prefers durable evidence over client memory.
- Quarantine is preferred over unsafe publication.

## Consumer Boundary Invariants

### Mission Engine

- Receives completion and objective handoffs.
- Revalidates and owns Mission transitions.
- Gameplay Runtime cannot close a Mission directly.

### Assessment Engine

- Receives evidence candidates with provenance and limitations.
- Owns interpretation and Assessment claims.
- Gameplay Runtime cannot declare mastery or misconception.

### Recommendation Engine

- Consumes verified downstream claims and mission state.
- Gameplay activity alone cannot create authoritative recommendations unless the declared contract explicitly permits a limited operational recommendation.

### World and UI Runtime

- Render and collect inputs.
- Do not become durable authority.
- Must tolerate projection lag and command rejection safely.

### Operations

- Observes health and failures.
- Cannot rewrite learner truth through administrative shortcuts.

## Determinism Invariants

- Identical authoritative inputs, versions, policies, and clock values produce semantically identical decisions.
- Randomness affecting gameplay outcomes is seeded, recorded, and replayable where those outcomes matter.
- Localization and formatting differences are non-semantic.
- Hidden environment dependencies are prohibited in authoritative decisions.
- Policy fallback is explicit and cannot silently change meaning.

## Minimum Automated Runtime Gate

Before Chapter 29 implementation can be called Runtime PASS, automated verification must cover at least:

1. tenant and learner isolation;
2. actor and source provenance;
3. session transition matrix;
4. lease and device handoff conflicts;
5. terminal-state protection;
6. objective sequencing and prerequisite preservation;
7. optionality, waiver, blocker, and hold preservation;
8. authorized interaction intake;
9. authoritative ordering and offline reconciliation;
10. idempotency and optimistic concurrency;
11. system action versus learner action separation;
12. evidence provenance, limitations, assistance, and collaboration attribution;
13. contradictory evidence preservation;
14. completion-versus-Mission-versus-mastery boundaries;
15. projection meaning fidelity and stale safety;
16. append-only persistence;
17. state plus outbox atomicity;
18. checkpoint and snapshot fallback;
19. historical replay and current-policy simulation separation;
20. replay divergence persistence;
21. verification version binding;
22. critical violation quarantine;
23. privacy-safe redaction;
24. verifier outage fail-closed behavior.

## Chapter 29 Completion Rule

Chapter 29 architecture is complete only when Chapters 29A through 29J are present and consistent with these invariants.

Implementation completion remains separate:

```text
Architecture COMPLETE
≠ Repository Implementation PASS
≠ Runtime PASS
≠ Operational PASS
```

The Gameplay Runtime is trustworthy only when the implemented system preserves these laws under normal execution, retry, concurrency, offline use, recovery, replay, and failure.
