# Chapter 39J — Learning Activity Runtime Invariants

## 1. Purpose

This document is the permanent invariant catalog for the Learning Activity Runtime. It consolidates the non-negotiable rules established across Chapters 39A–39I and defines the conditions that must remain true across implementation, persistence, replay, projection, migration, recovery, and operation.

An invariant is stronger than a guideline. If an invariant is violated, the runtime is incorrect even when the visible result appears acceptable.

## 2. Authority Invariants

1. Learning Path decides what should be attempted next.
2. Learning Activity owns the bounded executable unit of learning work.
3. Learning Session performs the activity work but does not own activity authority.
4. Evidence Runtime owns evidence acceptance and evidence integrity.
5. Mastery Runtime owns mastery interpretation.
6. Projection Runtime explains state but never authorizes state.
7. Persistence records accepted authority but does not create policy decisions.
8. Replay reconstructs accepted authority but does not re-decide policy.
9. Adaptation creates explicit new decision lineage.
10. Human review authority must be explicit and auditable.

## 3. Identity Invariants

11. Every activity has a stable activityId.
12. Every activity belongs to exactly one tenant.
13. Every activity belongs to exactly one learner.
14. Tenant identity never changes during the aggregate lifecycle.
15. Learner identity never changes during the aggregate lifecycle.
16. activityId alone is insufficient for repository access; tenant scope is mandatory.
17. Cross-runtime references must use stable identifiers and explicit versions.
18. Attempt identity must be stable and unique within an activity.
19. Session bindings must reference a stable sessionId.
20. Adaptation lineage must identify source and replacement activities.

## 4. Versioning Invariants

21. Every accepted aggregate mutation increments aggregateVersion exactly once.
22. Rejected commands do not increment aggregateVersion.
23. Expected-version mismatch fails without mutation.
24. Event versions are contiguous and strictly ordered.
25. Definitions are immutable by version.
26. Policies are identified by explicit versions when they affect decisions.
27. Historical meaning is evaluated under the versions recorded at decision time.
28. Projection version is independent from aggregate version but must reference its source position.
29. Snapshot version must identify the aggregate version it represents.
30. Migration version must be explicit and durable.

## 5. Lifecycle Invariants

31. Activity lifecycle transitions are explicit.
32. Illegal transitions fail closed.
33. Terminal states cannot return to active states.
34. CREATED does not imply authorization.
35. AUTHORIZED does not imply execution.
36. READY means start conditions are satisfied at the recorded version.
37. IN_PROGRESS requires a valid active session binding.
38. PAUSED preserves a resumable checkpoint when the activity type supports resume.
39. COMPLETED means activity completion criteria were accepted, not that mastery was achieved.
40. CLOSED requires all closure obligations to be satisfied.
41. CANCELLED is distinct from ABORTED.
42. EXPIRED is distinct from FAILED.
43. SUPERSEDED preserves the source activity history.
44. Terminal timestamps are immutable once accepted.
45. Lifecycle state is never inferred solely from projection state.

## 6. Authorization Invariants

46. A path recommendation is not activity authorization.
47. Activity visibility is not execution permission.
48. Authorization is learner-scoped and tenant-scoped.
49. Authorization records the policy version that produced it.
50. Authorization must identify its validity window when time-limited.
51. Expired authorization cannot start an activity.
52. Revoked authorization cannot start or resume an activity unless a new authorization is issued.
53. Prerequisite validation is evaluated under explicit source versions.
54. Attempt limits are enforced before start.
55. Retry eligibility is explicit.
56. Accessibility requirements are authorization inputs where relevant.
57. Safety review requirements are explicit.
58. Human approval requirements are explicit.
59. Authorization replacement supersedes rather than edits prior authorization.
60. Authorization failure does not mutate activity execution state.

## 7. Orchestration Invariants

61. At most one active session may be bound to an activity at a time.
62. A session cannot be bound before a valid start transition.
63. Duplicate start commands are idempotent.
64. Conflicting start commands resolve through optimistic concurrency.
65. Pause requires an active activity.
66. Resume requires a paused activity and valid resume conditions.
67. Completion references the correct attempt and active session context.
68. Completion acceptance is an Activity Runtime decision.
69. Session completion alone does not close an activity.
70. Close cannot occur before required evidence linkage or closure obligations.
71. Cancellation does not rewrite completed attempts.
72. Abort preserves execution history.
73. Expiry preserves authorization and timing evidence.
74. Timeout behavior is deterministic under a controlled clock.
75. Recovery resumes from durable state, not in-memory assumptions.
76. Command retries use stable commandId values.
77. Ambiguous outcomes are resolved from durable records.
78. Orchestration failure emits typed failure information.
79. Orchestration never sets mastery state directly.
80. Orchestration never mutates Learning Path authority.

## 8. Attempt and Retry Invariants

81. Every execution attempt has a stable attemptId.
82. Attempt numbers are monotonic within an activity.
83. Consumed attempts are never erased.
84. Retry policy version is recorded.
85. Retry eligibility is evaluated explicitly.
86. Retry creation does not rewrite the failed attempt.
87. Retry with variation records the variation source.
88. Retry cooldown is enforced deterministically.
89. Retry exhaustion is explicit.
90. A retry may require new authorization.
91. Duplicate retry commands are idempotent.
92. Retry and adaptation races resolve by aggregate version.
93. Attempt evidence remains linked to the original attempt.
94. Attempt completion does not imply activity closure.
95. Attempt score does not imply mastery.

## 9. Adaptation Invariants

96. Adaptation requires an explicit trigger.
97. Adaptation trigger qualification is deterministic under recorded inputs.
98. Adaptation decisions record policy version.
99. Adaptation creates explicit lineage.
100. Completed history remains immutable.
101. Activity substitution creates a distinct activity identity unless explicitly modeled as a versioned safe-boundary replacement.
102. Difficulty change is explicit and versioned.
103. Remediation insertion preserves source context.
104. Acceleration preserves prerequisite evidence.
105. Defer and cancel are distinct decisions.
106. Cooldown prevents uncontrolled oscillation.
107. Anti-thrashing rules are deterministic.
108. Human review decisions are auditable.
109. Concurrent adaptation requests resolve through optimistic concurrency.
110. Adaptation activation failure preserves the prior authoritative state.
111. New adaptive activity requires independent authorization.
112. Adaptation does not reinterpret prior evidence.
113. Adaptation does not set mastery directly.
114. Adaptation projections are explanatory only.
115. Re-evaluation under a new policy creates new lineage.

## 10. Evidence Invariants

116. Activity evidence references tenantId, learnerId, activityId, and attemptId where applicable.
117. Evidence acceptance remains Evidence Runtime authority.
118. Activity completion evidence is not mastery evidence.
119. Activity score is not mastery state.
120. Evidence bundles are immutable after acceptance.
121. Corrections use supersession or explicit correction records.
122. Withdrawal is explicit.
123. Quarantined evidence cannot feed mastery evaluation.
124. Duplicate evidence linking is idempotent.
125. Cross-tenant evidence links fail closed.
126. Evidence integrity metadata is verifiable.
127. Evidence lineage preserves source activity versions.
128. Evidence timestamps distinguish occurrence from recording time.
129. Evidence replay does not re-run activity policy.
130. Missing required evidence blocks closure when closure policy requires it.
131. Projection does not fabricate evidence completeness.
132. Evidence redaction does not mutate authoritative evidence.
133. Evidence export respects tenant and role boundaries.
134. Evidence contract version is explicit.
135. Historical evidence meaning is preserved across evolution.

## 11. Projection Invariants

136. Projection is not authority.
137. Projection may be deleted and rebuilt without changing aggregate state.
138. Projection rebuild consumes authoritative events.
139. Projection rebuild is deterministic for the same event stream and projection version.
140. Stale projections suppress unsafe actions.
141. Learner projections expose only learner-permitted fields.
142. Parent projections respect guardian scope.
143. Teacher projections respect roster and tenant scope.
144. Operator projections minimize sensitive learner data.
145. Projection freshness is explicit.
146. Projection source position is durable.
147. Projection version advances monotonically.
148. Projection lag does not authorize state changes.
149. Projection failure does not roll back accepted aggregate transitions.
150. Activity progress is not mastery progress.
151. Queue order is explanatory unless an authoritative orchestration command confirms execution order.
152. Projection redaction is role-aware.
153. Projection schema evolution preserves semantic meaning or rebuilds explicitly.
154. Shadow projections are non-authoritative.
155. Existing projections are never recovery authority.

## 12. Persistence Invariants

156. Aggregate state, events, command result, and outbox records commit atomically.
157. Event history is append-only.
158. Historical events are never edited in place.
159. Every accepted state transition emits at least one authoritative event.
160. Every event belongs to exactly one tenant and aggregate stream.
161. Event versions are contiguous.
162. Event gaps fail closed.
163. Duplicate event versions fail closed.
164. Command idempotency uses stable commandId.
165. Same commandId with different payload fails as conflict.
166. Inbox processing is idempotent.
167. Outbox publication retries do not repeat aggregate mutation.
168. Snapshots are optimization artifacts.
169. Corrupt snapshots are invalidated.
170. Event streams remain primary reconstruction authority.
171. Persistence access is tenant-scoped.
172. Sensitive data is minimized in event payloads.
173. Backup sets preserve all authority records required for reconstruction.
174. Restore requires reconciliation before writes resume.
175. Repair operations are explicit and auditable.

## 13. Replay and Recovery Invariants

176. Replay applies events in aggregate-version order.
177. Replay uses deterministic pure transition functions.
178. Replay does not call current policy services.
179. Replay does not use current time.
180. Replay does not use unrecorded randomness.
181. Replay result must match authoritative persisted state at the same version.
182. Replay divergence is a failure, not a warning to ignore.
183. Snapshot-assisted replay verifies snapshot integrity first.
184. Audit replay is read-only.
185. Repair replay requires explicit authorization.
186. Ambiguous command outcomes resolve through command ledger and event history.
187. Crash recovery begins from committed truth.
188. Pending outbox records resume publication after restart.
189. Partially processed inbox messages resume idempotently.
190. Projection rebuild does not mutate aggregate authority.
191. Integrity failure may quarantine the aggregate.
192. Recovery states do not overwrite learner-facing lifecycle state.
193. Missing events are never invented.
194. Aggregate version never decreases during repair.
195. Backup restore is not complete until replay reconciliation passes.

## 14. Cross-Runtime Invariants

196. Learning Path references are versioned.
197. Activity creation from a path does not imply authorization.
198. Session binding does not transfer activity ownership to Session Runtime.
199. Session results are inputs to activity completion, not direct authority over activity state.
200. Evidence linking does not transfer evidence ownership to Activity Runtime.
201. Mastery evaluation consumes governed evidence, not raw projection state.
202. Activity Runtime never writes mastery state.
203. Activity Runtime never rewrites Learning Path history.
204. Cross-runtime messages carry correlation and causation identifiers.
205. Cross-runtime duplicate delivery is safe.
206. Foreign runtime state is referenced, not copied as local authority.
207. Contract incompatibility fails explicitly.
208. Cross-runtime operations preserve tenant identity.
209. Cross-runtime retries preserve idempotency.
210. Operational recovery does not bypass ownership boundaries.

## 15. Evolution Invariants

211. Accepted history is never silently reinterpreted.
212. Activity definitions are immutable by version.
213. Historical events remain immutable.
214. Upcasters are pure and deterministic.
215. Snapshot migration is optional when replay is available.
216. Deployment is not migration.
217. Read compatibility is not behavioral compatibility.
218. Active activity migration requires a safe boundary.
219. Terminal activities do not migrate in place.
220. Re-evaluation creates new lineage.
221. Shadow execution is non-authoritative.
222. Canary rollout is observable and reversible.
223. Mixed-version operation is explicitly verified.
224. Code rollback is not state rollback.
225. Forward-fix preserves accepted history.
226. Deprecated readers remain while retained history requires them.
227. Migration progress is durable and resumable.
228. Evolution preserves privacy, fairness, and tenant boundaries.
229. Policy deployment alone does not mutate existing activity authority.
230. Version removal requires proof that no retained data depends on it.

## 16. Verification Invariants

231. Repository verification is distinct from runtime verification.
232. Runtime verification is distinct from operational verification.
233. Every Gate passes only with boundary-appropriate evidence.
234. Rejected commands are verified as non-mutating.
235. State-machine tests cover legal and illegal transitions.
236. Property-based tests verify invariant preservation.
237. Concurrency tests prove exactly-one-winner semantics.
238. Fault injection verifies atomicity and recoverability.
239. Replay tests verify deterministic reconstruction.
240. Cross-runtime tests preserve authority boundaries.
241. Accessibility failures are not classified as learner failures.
242. Privacy and tenant isolation are release gates.
243. Evolution changes require compatibility evidence.
244. Waivers are explicit, owned, and temporary.
245. No verification Gate passes by inference alone.

## 17. Safety, Privacy, Accessibility, and Fairness Invariants

246. Unsafe activity execution is blocked explicitly.
247. Accessibility requirements are treated as runtime inputs where relevant.
248. Missing accommodation must not be misclassified as low ability.
249. Role-based projections expose minimum necessary data.
250. Sensitive learner data is excluded from logs and metrics.
251. Guardian access is scope-bound.
252. Teacher access is roster- and tenant-bound.
253. Operator access is audited.
254. Adaptive policies are evaluated for systematic disadvantage.
255. Retry and remediation policy outcomes are measurable for fairness analysis.
256. Safety overrides are explicit and auditable.
257. Privacy-preserving erasure must preserve structural integrity.
258. Cross-tenant access fails closed.
259. Repair operations require elevated authorization.
260. Security controls do not silently alter learning meaning.

## 18. Operational Invariants

261. Critical failures emit typed failure codes.
262. Every authoritative command carries correlation context.
263. Observability preserves tenant-safe context.
264. Metrics do not expose sensitive learner data.
265. Outbox backlog is observable.
266. Projection lag is observable.
267. Replay divergence is observable.
268. Quarantined aggregates are observable.
269. Recovery actions are auditable.
270. Rate limiting and backpressure do not corrupt authority.
271. Operational timeout does not imply command failure without durable lookup.
272. Manual repair requires before/after evidence.
273. Restore operations pause writes until reconciliation passes.
274. Feature flags do not create hidden state mutation.
275. Operational status metadata remains separate from learner lifecycle state.

## 19. Final Runtime Boundary

```text
Learning Path says what should happen next.
Learning Activity owns the bounded executable work.
Authorization permits execution.
Orchestration controls the lifecycle.
Adaptation creates explicit new lineage.
Learning Session performs the work.
Evidence records what occurred.
Mastery interprets justified learning state.
Persistence makes authority durable.
Replay reconstructs without re-deciding.
Projection explains without owning.
Evolution changes the future without erasing the past.
Verification proves each boundary with appropriate evidence.
```

## 20. Completion Rule

Chapter 39 is architecturally complete only when all ten parts are present and consistent:

```text
39A Foundation
39B Authorization
39C Orchestration
39D Adaptive
39E Evidence
39F Projection
39G Persistence & Replay
39H Verification
39I Evolution
39J Runtime Invariants
```

Any implementation claiming Learning Activity Runtime completeness must preserve this invariant catalog or explicitly supersede it through a reviewed architectural decision.
