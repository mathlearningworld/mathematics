# 35J — Session Runtime Invariants

## 1. Purpose

This document closes Chapter 35 by defining the permanent invariants of Learning Session Runtime.

These invariants are architectural constraints, not implementation suggestions. Any implementation, migration, adapter, projection, optimization, or future chapter that violates them is non-conformant even when individual tests pass.

---

## 2. Authority Invariants

1. A session must have one authoritative identity and tenant boundary.
2. A session may begin only from an authorized plan or explicitly authorized recovery path.
3. Client navigation, local storage, or UI memory cannot establish session authority.
4. Actor, learner, tenant, plan, and objective identities must match the authority context.
5. Human-only decisions cannot be silently automated.
6. System-only recovery commands cannot be forged by client input.
7. Expired or revoked authority cannot advance session state.
8. Objective authority cannot be expanded by adaptation alone.

---

## 3. Planning Invariants

9. Session intent is distinct from executable session plan.
10. Unknown prerequisite state cannot be silently treated as satisfied.
11. Evidence requirements must exist before activity execution.
12. Safety, accessibility, burden, and time constraints are plan inputs, not optional UI concerns.
13. Every authorized plan must have valid entry, continuation, stop, and terminal rules.
14. Fallback channels must be authorized before use.
15. No-safe-plan is a valid and explicit planning outcome.
16. An authorized plan is immutable except through an explicit authorized migration or re-planning decision.

---

## 4. Lifecycle Invariants

17. Session lifecycle transitions are explicit and validated.
18. Terminal states remain terminal unless a separately authorized correction process exists.
19. Paused, waiting, interrupted, abandoned, cancelled, expired, failed, and completed states remain semantically distinct.
20. Paused or waiting time cannot be counted as active learning time.
21. Activity completion cannot be inferred from route changes, component state, or client acknowledgement alone.
22. Session completion does not establish mastery.
23. Channel failure does not establish learner failure.
24. Learner inactivity does not automatically establish abandonment unless policy conditions are met and recorded.

---

## 5. Orchestration Invariants

25. Only one valid fenced executor may advance a session at a time.
26. A stale lease or fencing token cannot mutate session state.
27. Every external effect requires durable intent before delivery.
28. Duplicate command delivery must not duplicate state transitions.
29. Retry must not duplicate score, reward, progress, evidence, notification, or activity completion.
30. Unknown external outcomes must remain explicit until reconciled.
31. Recovery must re-read authoritative state before deciding the next action.
32. An orchestration optimization cannot bypass lifecycle validation.

---

## 6. Adaptation Invariants

33. Observation is not automatically an adaptation command.
34. Adaptation may change only dimensions permitted by the active adaptation envelope.
35. Pacing, hint, sequence, channel, and activity changes remain distinct from objective or diagnostic changes.
36. Learner friction is not proof of inability.
37. Accessibility support cannot be removed by adaptation.
38. Adaptation loops must have termination and escalation rules.
39. Protected criteria, objectives, safety policy, and diagnostic claims cannot be silently rewritten.
40. Every applied adaptation must be explainable from recorded evidence or authorized policy.

---

## 7. Evidence Invariants

41. Runtime event, observation, evidence, inference, assessment, and mastery remain distinct concepts.
42. Every evidence item must retain provenance to learner, activity, objective, plan, source event, capture channel, and qualification policy.
43. Correctness alone does not establish understanding.
44. Completion alone does not establish competence.
45. Duplicate evidence cannot increase confidence more than once.
46. Contradictory evidence cannot be silently discarded.
47. Corrections and retractions append lineage; they do not erase history.
48. Retracted evidence cannot contribute to active inference.
49. Accessibility and capture context must remain available for evidence interpretation.
50. Learning Session Runtime cannot bypass Assessment or Progress authority when publishing educational conclusions.

---

## 8. Persistence Invariants

51. The append-only event ledger is the authoritative historical record.
52. Every accepted state-changing command must produce durable proof.
53. Session versions are monotonic and protected by optimistic concurrency.
54. A repeated command identity with changed payload is an idempotency violation.
55. Events, aggregate version updates, and required outbox records must share the declared atomic boundary.
56. Snapshots are derived accelerators and cannot replace ledger history.
57. Corrupt snapshots must be rejected and rebuilt.
58. Historical events cannot be mutated in place.
59. Tenant isolation applies to every command, event, snapshot, checkpoint, lease, outbox, and evidence repository operation.
60. Persistence failure cannot be reclassified as learner failure.

---

## 9. Replay and Recovery Invariants

61. Replay reducers must be deterministic and side-effect free.
62. Replay cannot read wall-clock time, randomness, network state, or mutable projections as authority.
63. Full replay and valid snapshot-plus-tail replay must produce equivalent state.
64. Replay cannot re-award irreversible effects.
65. Unknown schema versions must fail explicitly.
66. Recovery begins from persisted authority and the current valid fencing context.
67. Checkpoints are restart boundaries, not completion evidence.
68. Recovery may resume only after ledger, checkpoint, effect, and invariant validation.
69. Previously verified failure evidence may support recovery without reproducing the same failure, provided durable state and current Git/runtime authority are revalidated.
70. A recovery response or wake signal alone cannot prove session recovery completion.

---

## 10. Projection Invariants

71. Projections are read models and never session authority.
72. Projection rebuild must be deterministic from authorized source events.
73. Projection freshness must be declared honestly.
74. A visually current screen cannot prove current data.
75. Projection failures cannot mutate ledger state.
76. Duplicate projection event delivery must be idempotent.
77. Authorization and privacy filtering are projection responsibilities that cannot change underlying truth.
78. Learner, parent, teacher, tutor, admin, and machine projections may expose different scopes without creating different histories.
79. Summary text is not evidence.
80. Visible progress is not mastery.

---

## 11. Verification Invariants

81. Verification findings must be reproducible and traceable to evidence.
82. Inconclusive verification cannot be reported as PASS.
83. Repository, runtime, integration, operational, and evolution gates remain separate.
84. A delivery claim cannot exceed the strongest completed gate.
85. Every lifecycle transition requires accepted and rejected-path verification.
86. Replay equivalence is mandatory for recovery certification.
87. Projection verification cannot substitute for ledger verification.
88. Safety-critical failures block session authorization or release according to policy.
89. Cross-runtime effects require contract, identity, and deduplication verification.
90. Automated verification must identify where human validation remains required.

---

## 12. Evolution Invariants

91. Runtime, event, snapshot, plan, policy, projection, and channel versions must be independently interpretable.
92. Historical events cannot be rewritten to manufacture compatibility.
93. Active sessions remain pinned to behavior that can interpret their plans and history.
94. Deploying new code cannot silently migrate active session authority.
95. Event upcasters must be pure and deterministic.
96. Shadow execution cannot mutate authoritative state or emit irreversible effects.
97. Rollback may be claimed only when prior runtime behavior can interpret all persisted writes or an explicit compatibility bridge exists.
98. Projection evolution cannot change ledger truth.
99. Cross-runtime semantic changes require explicit handoff and rollout ordering.
100. Safety-critical evolution may stop a session, but the reason and authority must be durably recorded.

---

## 13. Cross-Runtime Invariants

101. Mission Runtime defines mission authority; Learning Session Runtime executes bounded learning sessions within that authority.
102. Recommendation Runtime may propose but cannot silently authorize session execution.
103. Diagnostic Runtime hypotheses cannot be rewritten by ordinary session adaptation.
104. Intervention Runtime linkage must remain traceable through session history.
105. Assessment Runtime remains authoritative for assessment conclusions within its contract.
106. Progress Runtime remains authoritative for durable progress and mastery state within its contract.
107. Curriculum and Skill Graph references must use stable identities and explicit versions or mappings.
108. Gameplay effects cannot be duplicated through retry, replay, recovery, or migration.
109. Downstream runtime failure cannot erase authoritative session history.
110. Cross-runtime messages require stable identity, correlation, causation, and deduplication semantics.

---

## 14. Safety, Privacy, and Accessibility Invariants

111. Learner safety policy overrides optimization and engagement goals.
112. Session burden and fatigue limits cannot be bypassed by adaptation or reward loops.
113. Accessibility requirements remain active through planning, execution, recovery, and migration.
114. Raw learner interaction data must be minimized and protected.
115. General-purpose logs must not expose sensitive learner responses without explicit authorization.
116. Retention and deletion behavior must be policy-driven by data class.
117. Deletion cannot fabricate or silently rewrite historical events.
118. Human escalation must remain available where policy requires it.
119. Emergency stop behavior must preserve evidence and a safe terminal or waiting state.
120. Learner-facing failure messages must not misclassify infrastructure, channel, or policy failures as learner faults.

---

## 15. Operational Invariants

121. Runtime observability must preserve correlation without unnecessary sensitive content.
122. Session, command, event, plan, policy, lease, and projection versions must be diagnosable.
123. Operational alerts must distinguish learner waiting from system failure.
124. Projection lag, outbox backlog, lease conflict, replay failure, and recovery failure must be observable.
125. An absence of alerts cannot be used as proof of correct educational behavior.
126. Human operational actions must be recorded with actor and reason.
127. Manual repair cannot bypass ledger integrity or tenant boundaries.
128. Every production migration requires restartability, idempotency, verification, and a forward-recovery or rollback plan.

---

## 16. Chapter 35 Completion Contract

Chapter 35 is architecturally complete only when all ten slices remain coherent:

```text
35A Foundation
35B Planning
35C Orchestration
35D Adaptation
35E Evidence
35F Projection
35G Persistence & Replay
35H Verification
35I Evolution
35J Invariants
```

The completed runtime must support this durable loop:

```text
Authorized Learning Intent
        ↓
Executable Session Plan
        ↓
Fenced Orchestration
        ↓
Adaptive Activity Execution
        ↓
Qualified Evidence
        ↓
Durable Ledger and Outbox
        ↓
Read Projections
        ↓
Verification
        ↓
Safe Recovery and Evolution
```

---

## 17. Final Architectural Position

Learning Session Runtime is the bounded runtime that turns authorized educational intent into a durable, adaptive, evidence-producing learning experience.

It does not own every educational conclusion. It owns the integrity of the session execution that produces the evidence other runtimes may use.

Its final rule is:

> Preserve authority, learner safety, durable history, and replayable meaning before optimizing convenience, speed, engagement, or visual continuity.
