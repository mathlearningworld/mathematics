# 36J — Journey Runtime Invariants

## Status

- Chapter: 36 — Learning Journey Runtime
- Slice: 36J
- Authority: Final invariant set for Chapter 36
- Scope: Non-negotiable rules across foundation, planning, orchestration, adaptation, evidence, projection, persistence, verification, and evolution

---

## 1. Purpose

This document consolidates the permanent invariants of Learning Journey Runtime.

An invariant is not a preference, implementation detail, or temporary recommendation. It is a rule that must remain true across implementations, deployments, migrations, integrations, and recovery scenarios.

When implementation and invariant conflict, the implementation is wrong until the architecture is explicitly revised.

---

## 2. Authority Invariants

1. Journey Runtime owns journey execution state, not the learner's entire educational truth.
2. Mission Runtime owns mission intent and objective authority.
3. Session Runtime owns session execution authority.
4. Assessment or Mastery authority owns educational judgment.
5. Curriculum Runtime owns curriculum structure and prerequisite truth.
6. Recommendation Runtime provides advice, not mandatory execution authority.
7. Projection Runtime owns derived views only.
8. Persistence infrastructure stores authority but does not invent domain meaning.
9. A journey may reference external authority but may not silently replace it.
10. Journey completion must never be represented as mastery certification.

---

## 3. Identity and Tenant Invariants

11. Every journey has a stable journey identity.
12. Every journey command and event is tenant-scoped.
13. Journey ID alone is never sufficient for cross-tenant authority.
14. Learner identity cannot change after journey creation without explicit governed migration.
15. Mission and objective bindings must remain traceable for the full journey lifetime.
16. Session intents must carry stable identities across retries and recovery.
17. Duplicate external delivery must resolve through stable source identity.
18. Correlation and causation lineage must survive persistence and replay.
19. Cross-runtime references must include source version or equivalent immutable lineage.
20. Identity mismatch is a refusal, not an automatic repair opportunity.

---

## 4. Lifecycle Invariants

21. Journey lifecycle transitions must be explicit and validated.
22. Draft is not active.
23. Accepted plan is not active journey execution.
24. Paused journey cannot dispatch new non-recovery sessions.
25. Blocked journey cannot progress past the unresolved blocking boundary.
26. Cancelled journey preserves history.
27. Completed journey is terminal except for explicit archival or governed correction semantics.
28. Archived journey remains historically readable according to retention policy.
29. Resume continues from persisted state; it does not recreate the journey.
30. Illegal transitions must be rejected with stable failure meaning.

---

## 5. Planning Invariants

31. Recommendation is not an accepted journey plan.
32. Plan acceptance requires explicit authority.
33. Planned evidence is not collected evidence.
34. Estimated duration is not a learner obligation.
35. Every accepted plan has a stable identity and version.
36. Accepted plans are immutable; changes create successor plans.
37. Plan lineage must be preserved through adaptation and migration.
38. Prerequisite claims must remain attributable to their authority source.
39. A planner must not silently rewrite the mission objective.
40. Planning must expose infeasible deadlines rather than fabricating certainty.
41. Alternative plans must preserve mandatory safety and authority constraints.
42. Plan activation requires lifecycle readiness, not document existence alone.

---

## 6. Orchestration Invariants

43. Only one authoritative orchestrator may progress a journey epoch.
44. Stale fencing tokens cannot commit.
45. Session dispatch must be idempotent.
46. Session outcome intake must validate journey, learner, and intent binding.
47. Duplicate session outcomes cannot duplicate journey progress.
48. Session success does not automatically satisfy a milestone.
49. Milestone satisfaction requires its defined criteria.
50. Orchestration must persist intent before external dispatch.
51. External dispatch ambiguity must be reconciled by stable identity.
52. Blind duplicate dispatch is prohibited.
53. Retry continues the same intent unless an explicit replacement decision is committed.
54. Process memory is never recovery authority.
55. A journey cannot complete while mandatory unresolved blockers remain.
56. Completion requires an explicit authoritative transition.

---

## 7. Adaptation Invariants

57. Adaptation changes the route, not historical truth.
58. Adaptation cannot rewrite collected evidence.
59. Adaptation cannot change mission intent without mission authority.
60. Active session continuity takes precedence over non-critical optimization.
61. Every accepted adaptation preserves predecessor plan lineage.
62. Adaptation signals must be attributable and freshness-aware.
63. Conflicting signals must remain visible until resolved.
64. Safety constraints cannot be weakened by optimization policy.
65. Human approval is required where policy or authority demands it.
66. Adaptation rollback must not delete committed history.
67. Repeated adaptation commands must remain idempotent.
68. Adaptation from stale or incomplete context must be explicitly bounded or refused.

---

## 8. Evidence Invariants

69. Journey evidence must reference immutable source identity and version.
70. Evidence collected is not automatically evidence trusted.
71. Evidence coverage is not mastery.
72. Milestone completion is not proof of understanding by itself.
73. Evidence conflicts must not be hidden by aggregation.
74. Superseded evidence remains historically traceable.
75. Revoked evidence must not silently continue to support current claims.
76. Human-contributed evidence must retain contributor and trust classification.
77. Learner reflection must not be misrepresented as objective assessment.
78. Privacy classification travels with the evidence reference.
79. Journey evidence packages are derived artifacts with lineage.
80. Journey Runtime may assemble evidence but must not exceed assessment authority.

---

## 9. Projection Invariants

81. Projection is derived interpretation, not write authority.
82. A projection may be rebuilt from authoritative history.
83. Duplicate events cannot duplicate projected effects.
84. Event ordering must be preserved or reconciled explicitly.
85. Stale projection state must be visibly stale.
86. Projection freshness is not inferred solely from render time.
87. Learner, parent, teacher, and operator views may expose different authorized fields.
88. Redaction must be enforced by policy, not presentation convention alone.
89. Projection failure cannot mutate journey authority.
90. Projection checkpoint is consumer progress, not aggregate version authority.
91. Rebuild must preserve canonical business meaning.
92. Projection schema evolution must remain replayable from supported history.

---

## 10. Persistence Invariants

93. Every accepted state mutation has corresponding durable event history.
94. Aggregate state and event append must share an atomic write boundary.
95. Command idempotency result must be durable.
96. Same command identity with different intent must be rejected.
97. Optimistic concurrency must protect against lost updates.
98. Snapshot is acceleration, not historical authority.
99. Invalid snapshot must be discarded, not trusted.
100. Event ledger is append-only.
101. Event sequence gaps are integrity failures.
102. Tenant isolation applies to every read, write, replay, and checkpoint.
103. Pending external effects must be represented durably.
104. External delivery success must be independently recorded.

---

## 11. Replay and Recovery Invariants

105. Replay must be deterministic for the same versioned inputs.
106. Replay must not query mutable external state to reconstruct historical decisions.
107. Historical replay must not redispatch external effects.
108. Recovery begins from persisted authority.
109. Recovery must validate aggregate, event, snapshot, inbox, and outbox consistency.
110. Ambiguous external effects must be reconciled before continuation.
111. A stale worker cannot regain authority merely because its process resumes.
112. Missing historical events cannot be fabricated.
113. Replay divergence is an integrity incident.
114. Projection rebuild and aggregate reconstruction are distinct operations.
115. Incident replay must be isolated from production effects.
116. Recovery must preserve stable journey and session-intent identities.

---

## 12. Verification Invariants

117. Repository PASS is not Runtime PASS.
118. Runtime PASS is not Integration PASS.
119. Integration PASS is not Operational PASS.
120. Operational PASS is not educational outcome proof.
121. Every verification claim identifies its gate and evidence.
122. Known limitations must be disclosed.
123. Deferred verification cannot be reported as passing.
124. Negative refusal cases are required verification evidence.
125. Integrity and safety failures cannot be hidden by aggregate pass counts.
126. A successful UI render is not proof of authoritative transition.
127. A successful session is not proof of journey correctness by itself.
128. Verification must use the exact repository/runtime version under claim.

---

## 13. Evolution Invariants

129. Deployment does not silently migrate active journey meaning.
130. Historical events are never rewritten for convenience.
131. Active journeys retain readable version bindings.
132. Active session contracts cannot change mid-session without explicit safety authority.
133. Accepted plans are migrated through successor lineage, not in-place mutation.
134. Shadow execution cannot commit authority or external effects.
135. Canary rollout has explicit stop and rollback conditions.
136. Code rollback does not imply state rollback.
137. Committed history is never deleted as rollback.
138. Incompatible consumers must receive explicit unsupported-version failure.
139. Destructive schema contraction follows verified reader migration.
140. Migration completion requires evidence and version reconciliation.

---

## 14. Cross-Runtime Invariants

141. Mission-to-journey handoff preserves objective authority.
142. Recommendation-to-journey handoff remains advisory unless explicitly accepted.
143. Journey-to-session handoff uses stable intent identity and versioned contract.
144. Session-to-journey outcome validates source and binding.
145. Journey-to-assessment handoff does not predeclare assessment outcome.
146. Intervention decisions remain attributable to Intervention Runtime.
147. Diagnostic results remain versioned external inputs.
148. Curriculum changes do not silently rewrite historical plans.
149. Cross-runtime retries must remain idempotent.
150. Contract deprecation requires consumer visibility and migration path.

---

## 15. Safety, Privacy, and Accessibility Invariants

151. Safety policy overrides non-critical optimization.
152. Missing safety authority results in pause, refusal, or escalation.
153. Learner workload limits must be enforced at journey level where applicable.
154. Sensitive evidence must not leak through projections or logs.
155. Parent and teacher visibility follows explicit authorization.
156. Accessibility requirements are runtime constraints, not optional decoration.
157. Emergency suspension preserves audit evidence.
158. Privacy deletion and retention obligations must distinguish history, projections, and transient data.
159. Cross-tenant data exposure is an emergency integrity failure.
160. Safety-critical policy downgrade requires explicit governed authority.

---

## 16. Operational Invariants

161. The runtime must expose current journey status and blocking reason.
162. Outbox backlog and projection lag must be observable.
163. Recovery and migration state must be inspectable.
164. Operational metrics must avoid exposing sensitive learner content.
165. Long inactivity must not erase journey continuity.
166. A resumed journey must revalidate time-sensitive constraints.
167. Dead-lettered effects require explicit operational handling.
168. Manual intervention must leave durable audit evidence.
169. Operational repair cannot bypass domain transition validation.
170. Production incidents must preserve evidence for deterministic analysis.

---

## 17. Chapter-Level Completion Rule

Chapter 36 is architecturally complete only when all of the following are defined:

- Foundation
- Planning
- Orchestration
- Adaptation
- Evidence
- Projection
- Persistence & Replay
- Verification
- Evolution
- Invariants

Implementation completion remains separate and must pass the applicable repository, runtime, integration, operational, and evolution gates.

---

## 18. Final Runtime Boundary

```text
Learning Journey Runtime owns the correctness and continuity of a learner's multi-session journey.

It does not own mission intent, session execution internals, curriculum truth, or mastery certification.
```

This boundary is permanent unless explicitly revised through architecture authority.

---

## 19. Completion Statement

36J closes Chapter 36 by establishing the invariant set that every Learning Journey Runtime implementation, verifier, migration, and operational workflow must preserve.