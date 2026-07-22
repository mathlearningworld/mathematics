# Chapter 38J — Learning Path Runtime Invariants

## 1. Purpose

This document defines the non-negotiable invariants of the Learning Path Runtime. These rules constrain design, implementation, persistence, replay, projection, adaptation, integration, and evolution.

An implementation that violates an invariant is not merely incomplete; it is architecturally incorrect.

## 2. Authority Invariants

1. Learning Path Runtime owns durable learning-path authority.
2. Planning may propose a path but may not activate it.
3. Orchestration may authorize bounded execution but may not infer mastery.
4. Adaptation may propose or approve a new path version but may not rewrite prior path history.
5. Projection may explain authority but may not mutate it.
6. UI state is never authoritative path state.
7. External callbacks cannot bypass local command validation.
8. A successful transport response is not proof of durable commit.
9. Durable commit is the boundary of authoritative state change.
10. Human overrides must be explicit, authorized, and auditable.

## 3. Identity and Tenant Invariants

11. Every path belongs to exactly one tenant.
12. Tenant identity is immutable within a path stream.
13. Every aggregate read and write is tenant-scoped.
14. Every event is tenant-scoped.
15. Every snapshot is tenant-scoped.
16. Every command result is tenant-scoped.
17. Every outbox and inbox record is tenant-scoped.
18. A path ID without tenant ID is insufficient storage authority.
19. Cross-tenant replay is forbidden.
20. Cross-tenant projection rebuild is forbidden.
21. Learner identity cannot change within an active path version.
22. Actor identity must be recorded for every authority-changing command.

## 4. Version Invariants

23. Aggregate version increases monotonically.
24. Aggregate event versions are contiguous.
25. Duplicate aggregate versions are invalid.
26. Missing aggregate versions are integrity failures.
27. Path version is distinct from aggregate version.
28. A new approved plan creates a new path version when semantics change.
29. Historical path versions remain immutable.
30. Supersession must identify both old and new path versions.
31. Policy versions that affect meaning must be persisted.
32. Curriculum and skill-graph versions must be pinned where used.
33. Replay must not substitute current versions for historical versions.

## 5. Planning Invariants

34. Identical frozen inputs and policy versions produce deterministic plans.
35. Planning must validate goal identity.
36. Planning must validate curriculum compatibility.
37. Planning must validate skill-graph compatibility.
38. Planning must compute prerequisite closure before authorizing target execution.
39. Unmet required prerequisites must not be silently ignored.
40. Cyclic prerequisite graphs must fail explicitly.
41. Unreachable goals must fail or route to explicit review.
42. Remediation nodes must identify the gap they address.
43. Retention nodes must identify the supported mastery at risk.
44. Acceleration requires explicit eligibility evidence.
45. High recent score alone is insufficient acceleration authority.
46. Repetition of near-identical tasks is not broad transfer evidence.
47. Time budgets may constrain a plan but may not falsify prerequisite status.
48. Content availability must be checked before activation.
49. Accessibility constraints must participate in candidate selection.
50. Planning explanations must preserve decision reasons.
51. Planning output is a candidate until explicitly approved or activated.

## 6. Orchestration Invariants

52. Only an approved active path may authorize execution.
53. Only an eligible node may become the next authorized action.
54. A node blocked by unmet prerequisites cannot be authorized.
55. An unavailable-content node cannot be authorized.
56. A completed node cannot become active again without explicit retry or restoration semantics.
57. A node cannot be both active and completed.
58. Session creation requires a valid node authorization.
59. Session outcomes must reference the authorized node and path version.
60. Duplicate session outcomes must not duplicate path progress.
61. Stale outcomes must not mutate a newer path version.
62. Pause must stop new authorizations according to policy.
63. Resume must reload current durable authority.
64. Cancellation must be explicit and durable.
65. Completion requires all required completion conditions.
66. Operational path completion does not create mastery.
67. Orchestration checkpoints cannot advance beyond committed state.
68. External completion is not local completion until committed.

## 7. Adaptation Invariants

69. Adaptation requires a qualified trigger.
70. Noisy signals alone must not thrash a path.
71. Cooldown policy must be explicit where repeated replanning is possible.
72. Adaptation must occur at a safe boundary.
73. Active evidence commit boundaries must not be interrupted by silent mutation.
74. Active sessions must not be silently retargeted.
75. Adaptation preserves completed historical work.
76. Adaptation creates explicit lineage.
77. Evidence withdrawal triggers reconsideration according to policy.
78. Mastery changes trigger reconsideration rather than direct mutation.
79. Curriculum changes do not silently reinterpret historical objectives.
80. Content removal may block or substitute future nodes but cannot erase completed nodes.
81. Accessibility substitution must preserve objective meaning.
82. Human-review-required adaptations cannot auto-activate.
83. Superseded path versions cannot continue authorizing new work.
84. Failed activation must leave a recoverable prior authority state.

## 8. Evidence Invariants

85. Path evidence is distinct from mastery evidence.
86. Path completion evidence cannot be converted directly into mastery authority.
87. Evidence records are immutable after commit.
88. Corrections use supersession or withdrawal, not destructive edit.
89. Evidence provenance must be preserved.
90. Evidence integrity metadata must be verifiable.
91. Evidence linkage must identify path and path version.
92. Execution evidence must identify node and authorization.
93. Adaptation evidence must identify trigger and decision lineage.
94. Outcome evidence must not overstate educational meaning.
95. Sensitive evidence access is role-scoped.
96. Evidence from another tenant must never be linked.
97. Missing required evidence must produce explicit uncertainty or block.

## 9. Persistence Invariants

98. State-changing commands commit atomically.
99. Events, aggregate state, command result, and outbox records commit together when part of one decision.
100. Partial authority commit is forbidden.
101. Every state-changing external command has a stable command ID.
102. Repeating the same command ID and canonical payload returns the prior result.
103. Reusing a command ID with a different canonical payload is rejected.
104. Expected-version conflicts are rejected.
105. Concurrent writers are never silently merged.
106. Event history is append-only.
107. Stored historical events are never rewritten by upcasters.
108. Aggregate state must reconcile with event history.
109. Snapshots cannot claim events that are not committed.
110. Checkpoints cannot claim progress that is not committed.
111. Persistence failures must not return authoritative success.
112. Ambiguous outcomes must be resolved by command identity.

## 10. Replay and Recovery Invariants

113. Replay applies events in aggregate-version order.
114. Replay is deterministic.
115. Replay performs no external side effects.
116. Replay does not call current planning policy.
117. Replay does not re-decide historical authority.
118. Replay does not use ambient current time.
119. Unknown event versions fail explicitly unless an approved upcaster exists.
120. Corrupt snapshots fall back to event replay.
121. Event stream gaps fail integrity verification.
122. Recovery begins from persisted authority.
123. Process memory is not recovery authority.
124. Crash after commit before response must not duplicate transition.
125. Crash before commit must not create a transition.
126. Outbox delivery is at-least-once and consumers deduplicate.
127. Inbox processing is idempotent.
128. Recovery actions that change state are auditable.

## 11. Projection Invariants

129. Projection is derived state.
130. Projection may be rebuilt from authoritative history.
131. Projection lag does not change aggregate authority.
132. Stale projections must be detectable.
133. Stale projections must not expose unsafe actions as current.
134. Learner views reveal only learner-appropriate information.
135. Parent views obey relationship and privacy policy.
136. Teacher views obey assignment and tenant scope.
137. Operator views do not bypass privacy controls.
138. Projection consumers deduplicate events.
139. Projection rebuild converges to the same result for the same history and schema.
140. Projection cannot write authoritative events.
141. Path progress percentage is not mastery percentage.
142. Forecasts are explicitly non-authoritative.

## 12. Lifecycle Invariants

143. Lifecycle transitions are explicit.
144. Forbidden transitions fail with stable failure codes.
145. Terminal states cannot silently return to active.
146. Draft paths cannot authorize work.
147. Approved but inactive paths cannot authorize work unless activation is part of the same valid command.
148. Paused paths cannot authorize new work.
149. Superseded paths cannot authorize new work.
150. Cancelled paths cannot authorize new work.
151. Completed paths cannot authorize new required work.
152. Restoration requires explicit policy and a new durable transition.

## 13. Cross-Runtime Invariants

153. Mastery Runtime owns mastery authority.
154. Learning Journey Runtime owns journey authority.
155. Session Runtime owns bounded session execution authority.
156. Curriculum Runtime owns curriculum definitions and versions.
157. Skill Graph Runtime owns dependency graph definitions and versions.
158. Learning Path Runtime consumes versioned mastery context; it does not overwrite mastery.
159. Learning Path Runtime consumes journey context; it does not overwrite journey history.
160. Session outcomes require stable correlation to path authorization.
161. Curriculum changes require explicit compatibility handling.
162. Skill graph changes require explicit compatibility handling.
163. Content unavailability cannot be treated as learner failure.
164. Analytics signals cannot mutate learning-path authority.
165. Notifications cannot mutate learning-path authority.

## 14. Evolution Invariants

166. Deployment is not migration.
167. Read compatibility is not behavior compatibility.
168. Behavior-changing policies require explicit versioning.
169. New code does not automatically activate new policy.
170. Historical events remain immutable across evolution.
171. Upcasters are pure and deterministic.
172. Snapshots may be discarded and rebuilt.
173. Historical path meaning remains pinned to historical references.
174. Re-evaluation creates new lineage.
175. Migration is resumable and idempotent where scale requires it.
176. Mixed-version operation is explicitly supported or explicitly rejected.
177. Unsupported version combinations fail closed.
178. Shadow execution emits no authority.
179. Canary rollout is observable and reversible by policy.
180. Code rollback is not state rollback.
181. State restoration creates a new authoritative transition.
182. Feature flags alone are insufficient semantic lineage.
183. Emergency safety changes preserve committed history.

## 15. Verification Invariants

184. Repository PASS does not imply Runtime PASS.
185. Runtime PASS does not imply Integration PASS.
186. Integration PASS does not imply Operational PASS.
187. Operational PASS does not prove educational outcomes.
188. Verification evidence is tied to a specific commit and environment.
189. Untested domains are reported as unverified, not assumed passing.
190. Golden scenarios are version-controlled.
191. Authority boundaries require explicit tests.
192. Tenant isolation requires explicit tests.
193. Idempotency requires explicit tests.
194. Replay determinism requires explicit tests.
195. Safe adaptation boundaries require explicit tests.
196. Projection rebuild requires explicit tests.
197. Evolution paths require explicit tests.
198. Human testing supplements but does not replace automated invariant tests.
199. Failure evidence is retained when it changes release confidence.

## 16. Safety and Fairness Invariants

200. A learner is not penalized for using an accessible equivalent interaction.
201. Accessibility accommodation does not imply lower mastery.
202. Content unavailability does not imply learner weakness.
203. Operational delay does not imply learner failure.
204. Insufficient evidence is represented as uncertainty, not fabricated weakness.
205. Acceleration must not bypass required foundational safety rules.
206. Remediation must identify educational reasons rather than opaque punishment.
207. Human review is available for high-impact ambiguous decisions according to policy.
208. Path explanations must not expose sensitive comparative data.
209. Fairness monitoring cannot itself mutate individual path authority.
210. Safety overrides are scoped, auditable, and reversible where appropriate.

## 17. Privacy and Security Invariants

211. The runtime stores only necessary learner data.
212. Logs avoid unnecessary sensitive payloads.
213. Evidence access is least-privilege.
214. Replay and migration tools require privileged authorization.
215. Object-level authorization is enforced in addition to tenant scope.
216. Command IDs cannot be used to retrieve another tenant's result.
217. Projection endpoints apply role-specific redaction.
218. Integrity failures do not leak sensitive internals in user-facing errors.
219. Data retention follows explicit governance.
220. Legal deletion procedures preserve required authority semantics through governed techniques.

## 18. Operational Invariants

221. Health status does not claim educational correctness.
222. Metrics are non-authoritative observations.
223. Alerts do not mutate state without explicit commands.
224. Reconciliation jobs do not invent educational decisions.
225. Automatic repair is limited to explicitly safe technical repairs.
226. Operator intervention that changes authority is recorded.
227. Backups include all stores needed for consistent restore.
228. Restore verification includes replay reconciliation.
229. Projection backlog does not block authoritative reads unless policy explicitly requires fresh projection.
230. Service restart does not lose committed path authority.

## 19. Final Boundary

```text
Mastery describes what is currently justified.
Learning Path describes what should happen next.
Planning proposes.
Orchestration authorizes bounded execution.
Adaptation creates explicit new lineage.
Persistence makes authority durable.
Replay reconstructs without re-deciding.
Projection explains without owning.
```

## 20. Completion Doctrine

A Learning Path Runtime is complete only when its authority is:

- versioned,
- prerequisite-aware,
- explicitly approved,
- safely orchestrated,
- adaptively reconsidered,
- evidence-linked,
- durably persisted,
- deterministically replayable,
- role-appropriate in projection,
- verifiable across gates,
- evolvable without rewriting history,
- constrained by these invariants.
