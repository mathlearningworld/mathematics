# Chapter 34J — Intervention Runtime Invariants

## 1. Purpose

This document defines the permanent invariants of Chapter 34 — Intervention Runtime.

These rules protect the architecture from collapsing recommendation, planning, execution, adaptation, evaluation, projection, persistence, verification, and evolution into one ambiguous process.

## 2. Core Meaning Invariants

```text
I-CORE-01  Recommendation is not authorization.
I-CORE-02  Authorization is not planning.
I-CORE-03  Planning is not execution.
I-CORE-04  Execution is not engagement.
I-CORE-05  Engagement is not completion.
I-CORE-06  Completion is not effectiveness.
I-CORE-07  Immediate improvement is not retention.
I-CORE-08  Retention is not transfer.
I-CORE-09  Intervention effectiveness does not prove the original diagnosis.
I-CORE-10  Escalation is not punishment.
```

## 3. Authority Invariants

```text
I-AUTH-01  Every intervention belongs to one tenant and one learner authority boundary.
I-AUTH-02  Every authoritative transition records actor, time, correlation, and version.
I-AUTH-03  Recommendation Runtime may propose but may not authorize intervention execution.
I-AUTH-04  Projection Runtime may display but may not mutate intervention authority.
I-AUTH-05  Execution adapters may deliver but may not redefine the plan.
I-AUTH-06  Human approval records scope and rationale and never erases uncertainty.
I-AUTH-07  Policy and safety rules override optimization and scheduling.
I-AUTH-08  Competing authoritative writes require optimistic concurrency control.
```

## 4. Planning Invariants

```text
I-PLAN-01  Every plan has a traceable target and rationale.
I-PLAN-02  Every plan pins strategy, policy, skill graph, and curriculum versions.
I-PLAN-03  Every plan defines dosage, phases, channels, and scheduling constraints.
I-PLAN-04  Every plan defines evidence requirements before execution.
I-PLAN-05  Every plan defines an adaptation envelope.
I-PLAN-06  Every plan defines safety, stop, and review conditions.
I-PLAN-07  No safe plan is preferable to an unsafe or misleading plan.
I-PLAN-08  Activated plans are immutable; material changes create a new plan version.
I-PLAN-09  Concurrent interventions must be checked for burden and conflict.
I-PLAN-10  Accessibility constraints are planning constraints, not optional polish.
```

## 5. Execution Invariants

```text
I-EXEC-01  Execution records what happened, not what was intended.
I-EXEC-02  Planned but undelivered activity is never reported as executed.
I-EXEC-03  Dispatch boundaries are idempotent.
I-EXEC-04  Phase ordering is enforced unless an authorized adaptation changes it.
I-EXEC-05  Delivered dosage never silently exceeds the authorized envelope.
I-EXEC-06  Pause, resume, interruption, retry, and completion remain distinct states.
I-EXEC-07  Completion always records an explicit completion reason.
I-EXEC-08  Execution evidence preserves source and timing.
I-EXEC-09  Replay never triggers external execution side effects.
I-EXEC-10  Low execution fidelity limits downstream effectiveness claims.
```

## 6. Adaptation Invariants

```text
I-ADAPT-01  Adaptation requires observable trigger evidence.
I-ADAPT-02  Observe-only, parameter adjustment, phase adjustment, re-plan, diagnostic review, and human escalation remain distinct.
I-ADAPT-03  Adjustment within the envelope does not silently become re-planning.
I-ADAPT-04  Re-planning creates a new plan version.
I-ADAPT-05  Re-planning does not silently create a new diagnosis.
I-ADAPT-06  Repeated ineffectiveness never causes automatic unlimited intensification.
I-ADAPT-07  Learner friction is evidence to investigate, not learner failure.
I-ADAPT-08  Adaptation outside approved bounds requires escalation.
I-ADAPT-09  No-change decisions remain durable and auditable.
I-ADAPT-10  Safety signals can pause or stop adaptation immediately.
```

## 7. Effectiveness Invariants

```text
I-EFFECT-01  Effectiveness requires an explicit evaluation window.
I-EFFECT-02  Baseline absence is declared, never hidden.
I-EFFECT-03  Execution fidelity is included in every effectiveness interpretation.
I-EFFECT-04  Immediate performance is separated from retention.
I-EFFECT-05  Near transfer is separated from far transfer.
I-EFFECT-06  Confounding factors are recorded.
I-EFFECT-07  Learner burden and adverse signals are part of effectiveness.
I-EFFECT-08  Harmful or unsafe evidence overrides positive score movement.
I-EFFECT-09  INCONCLUSIVE is a valid outcome.
I-EFFECT-10  Later evaluations add temporal conclusions and never overwrite earlier ones.
```

## 8. Evidence Invariants

```text
I-EVID-01  Evidence preserves provenance, schema version, and capture time.
I-EVID-02  Evidence occurrence time and linkage time remain distinct.
I-EVID-03  Duplicated evidence is not counted as independent support.
I-EVID-04  Practice output is not automatically independent assessment evidence.
I-EVID-05  Missing evidence remains explicitly missing.
I-EVID-06  Inadmissible evidence cannot support authoritative conclusions.
I-EVID-07  Evidence access follows tenant, role, consent, and retention policy.
I-EVID-08  Deleting raw evidence does not rewrite the historical fact that it was referenced.
```

## 9. Projection Invariants

```text
I-PROJ-01  Projection is not authority.
I-PROJ-02  Summary is not evidence.
I-PROJ-03  Progress bars do not imply effectiveness or mastery.
I-PROJ-04  Projection freshness is explicit.
I-PROJ-05  Stale-blocking projections cannot present themselves as current.
I-PROJ-06  Projection rebuild publishes atomically.
I-PROJ-07  Learner views use safe, non-stigmatizing language.
I-PROJ-08  Diagnostic labels and risk detail are audience-controlled.
I-PROJ-09  Every material summary remains traceable to authority.
I-PROJ-10  Projection schema evolution never upgrades authority.
```

## 10. Persistence and Replay Invariants

```text
I-PERSIST-01  Authoritative intervention history is append-only.
I-PERSIST-02  Aggregate versions are continuous.
I-PERSIST-03  Plan intent and execution truth are persisted separately.
I-PERSIST-04  Adaptation decisions are durable.
I-PERSIST-05  Effectiveness evaluations are immutable temporal records.
I-PERSIST-06  Snapshots accelerate loading but never replace events.
I-PERSIST-07  Replay requires compatible pinned versions.
I-PERSIST-08  Replay never emits external side effects.
I-PERSIST-09  Event gaps and hash mismatches fail closed.
I-PERSIST-10  Quarantined authority-affecting events are never silently skipped.
```

## 11. Verification Invariants

```text
I-VERIFY-01  Structural validity does not establish semantic validity.
I-VERIFY-02  Valid planning does not establish execution fidelity.
I-VERIFY-03  Verified execution does not establish effectiveness.
I-VERIFY-04  Safety and policy failures block technically valid behavior.
I-VERIFY-05  Late evidence creates a new temporal evaluation.
I-VERIFY-06  Adaptation outside the envelope is a blocking failure.
I-VERIFY-07  Replay mismatch is blocking until resolved.
I-VERIFY-08  Repository, Runtime, and Operational gates remain distinct.
I-VERIFY-09  Human review never converts unsupported certainty into supported certainty.
I-VERIFY-10  Every material claim remains verifier-version traceable.
```

## 12. Evolution Invariants

```text
I-EVOLVE-01  Every authoritative behavior is versioned.
I-EVOLVE-02  Evolution never rewrites historical events.
I-EVOLVE-03  Active cases follow an explicit version policy.
I-EVOLVE-04  Migration never fabricates unavailable facts.
I-EVOLVE-05  Shadow behavior never creates learner-facing side effects.
I-EVOLVE-06  Activation requires evidence and rollback readiness.
I-EVOLVE-07  Comparative evaluation never silently replaces historical conclusions.
I-EVOLVE-08  Policy evolution preserves temporal truth.
I-EVOLVE-09  Retirement preserves replay and explainability.
I-EVOLVE-10  Safety or fairness regression blocks rollout.
```

## 13. Cross-Runtime Invariants

```text
I-XRUNTIME-01  Diagnostic Runtime owns diagnostic hypotheses and re-diagnosis.
I-XRUNTIME-02  Recommendation Runtime owns ranked support options, not intervention authorization.
I-XRUNTIME-03  Intervention Runtime owns authorized support planning and execution coordination.
I-XRUNTIME-04  Learning Engine owns learning activity delivery semantics.
I-XRUNTIME-05  Assessment Engine owns assessment evidence contracts.
I-XRUNTIME-06  Mission Engine goals are not silently rewritten by intervention adaptation.
I-XRUNTIME-07  Progress Engine owns mastery and progress policy.
I-XRUNTIME-08  Skill Graph and Curriculum versions are pinned wherever they affect meaning.
I-XRUNTIME-09  No runtime may infer authority from another runtime's projection alone.
I-XRUNTIME-10  Cross-runtime failures preserve ownership boundaries rather than duplicating logic.
```

## 14. Learner Safety Invariants

```text
I-SAFE-01  The learner is never framed as the failure of an intervention.
I-SAFE-02  Repetition is bounded by burden and safety policy.
I-SAFE-03  Consent withdrawal is respected immediately.
I-SAFE-04  Distress, exclusion, or accessibility mismatch can pause or stop execution.
I-SAFE-05  Automated optimization never outranks learner welfare.
I-SAFE-06  Learner-facing language avoids stigma, diagnosis theater, and punitive framing.
I-SAFE-07  Human escalation is support, not punishment.
I-SAFE-08  Uncertainty is communicated honestly to authorized audiences.
```

## 15. Operational Invariants

```text
I-OPS-01  External delivery uses durable handoff such as an outbox.
I-OPS-02  Consumers tolerate at-least-once delivery through idempotency.
I-OPS-03  Recovery state is visible and not hidden as normal activity.
I-OPS-04  Partial projection rebuild is never published.
I-OPS-05  Partial migration is never reported as complete.
I-OPS-06  Kill switches preserve history while stopping unsafe new behavior.
I-OPS-07  Audit queries can reconstruct authorization, plan, execution, adaptation, and evaluation lineage.
I-OPS-08  Tenant isolation is enforced at every durable and projected boundary.
```

## 16. Forbidden Collapses

The following architectural collapses are prohibited:

```text
Recommendation -> automatic authorization
Plan -> assumed execution
Dispatch -> assumed delivery
Completion -> assumed effectiveness
Score increase -> assumed mastery
Repeated failure -> automatic dosage increase
Adaptation -> silent plan mutation
Migration -> silent re-diagnosis
Projection -> authority
Repository PASS -> Runtime PASS
Runtime PASS -> Operational PASS
```

## 17. Required Case Narrative

For every intervention case, the system must be able to reconstruct this narrative:

```text
Why support was considered
Who authorized it
Which plan and versions were selected
What was actually delivered
What the learner experienced
What evidence was captured
Why the plan changed or did not change
How effectiveness was evaluated
What uncertainty remained
What happened next
```

## 18. Chapter 34 Completion Contract

Chapter 34 is complete only when all ten slices exist and remain mutually consistent:

```text
34A Intervention Runtime Foundation
34B Intervention Planning Runtime
34C Intervention Execution Runtime
34D Adaptive Intervention Runtime
34E Intervention Effectiveness Runtime
34F Intervention Projection Runtime
34G Intervention Persistence & Replay Runtime
34H Intervention Verification Runtime
34I Intervention Evolution Runtime
34J Intervention Runtime Invariants
```

## 19. Final Doctrine

> Intervention Runtime exists to turn an evidence-grounded need for support into a bounded, authorized, observable, adaptable, and verifiable course of action. It must preserve the difference between intention and reality, protect the learner from unsafe optimization, and remain honest about whether support actually worked.
