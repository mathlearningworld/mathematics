# 37J — Mastery Runtime Invariants

## Purpose

This document is the permanent invariant catalog for Chapter 37 — Mastery Runtime.

These rules define the non-negotiable behavior of mastery authority across evidence, evaluation, decision, adaptation, projection, persistence, replay, verification, and evolution.

An implementation may vary in language, framework, database, and deployment topology. It may not violate these invariants.

---

## A. Authority Invariants

1. Mastery Runtime owns mastery authority for a learner-skill pair.
2. Evidence Runtime does not confirm mastery.
3. Evaluation Runtime computes candidates but does not authorize transitions.
4. Decision Runtime is the only runtime component that authorizes mastery state changes.
5. Adaptive Runtime proposes reevaluation, review, or correction but cannot mutate mastery directly.
6. Projection Runtime communicates derived state and cannot create authority.
7. Persistence adapters store accepted authority and cannot invent transitions.
8. Downstream runtimes may consume mastery facts but cannot rewrite them.
9. Human overrides require explicit governed authority.
10. Every authoritative change must be attributable to a command and decision lineage.

---

## B. Identity and Tenant Invariants

11. Every mastery aggregate belongs to exactly one tenant.
12. Every mastery aggregate belongs to exactly one learner.
13. Every mastery aggregate addresses exactly one skill identity at a time.
14. Tenant ID is required on every read, write, replay, and projection rebuild path.
15. Learner identity cannot change after aggregate creation.
16. Skill identity cannot be silently replaced after aggregate creation.
17. Cross-tenant evidence references are forbidden.
18. Cross-tenant command idempotency collisions are forbidden.
19. Tenant mismatch is an authorization failure.
20. Public opaque IDs do not replace tenant-scoped authority checks.

---

## C. Evidence Invariants

21. Evidence supports mastery but is not mastery.
22. Every evidence item retains source identity and source version.
23. Frozen evidence bundles are immutable.
24. Evidence corrections create new authority records; they do not edit historical evidence silently.
25. Evidence withdrawal remains historically visible.
26. Duplicate evidence does not increase independent support.
27. Repeated dependent attempts do not inflate confidence.
28. Evidence quantity does not imply evidence diversity.
29. Missing evidence remains unknown and is not converted to success or failure by default.
30. Contradictory evidence must remain visible to evaluation.
31. Evidence freshness is explicit.
32. Retention evidence is distinct from initial acquisition evidence.
33. Accessibility context must travel with relevant evidence interpretation.
34. Human-contributed evidence must identify actor, role, and authority context.
35. Evidence bundles require stable hashes.
36. A decision cannot reference an unresolved evidence bundle.
37. Evidence source trust classification is versioned.
38. Evidence dimensions must distinguish conceptual, procedural, application, and transfer where policy requires them.
39. Evidence redaction must not fabricate educational facts.
40. Historical evidence lineage must remain auditable where legally permitted.

---

## D. Evaluation Invariants

41. Evaluation runs only against frozen inputs.
42. Identical frozen inputs and version vector produce identical evaluation results.
43. Evaluation input order cannot change the normalized result.
44. Evaluation records algorithm version.
45. Evaluation records policy version.
46. Evaluation records curriculum version.
47. Evaluation records skill graph version.
48. Evaluation records evidence bundle version.
49. Evaluation records accessibility-policy context.
50. Evaluation cannot silently discard contradiction evidence.
51. Evaluation distinguishes insufficient evidence from failed mastery.
52. Evaluation confidence cannot be derived from raw activity count alone.
53. Evaluation produces an explainable candidate.
54. Evaluation result hashes must be reproducible.
55. A stale evaluation cannot authorize a current decision.
56. Evaluation may request human review without confirming mastery.
57. Evaluation may identify coverage gaps without prescribing unauthorized state changes.
58. Evaluation cannot rewrite source evidence.
59. Evaluation cannot use current policy to impersonate historical policy during replay.
60. Evaluation failures must not partially change mastery authority.

---

## E. Decision Invariants

61. Every authoritative mastery transition requires an explicit decision command.
62. Every decision references an evaluation or an explicitly governed override basis.
63. Decision applicability is checked before transition authorization.
64. Expected aggregate version is required for state-changing decisions.
65. Expected decision version is required where decision lineage can race.
66. Stale commands are rejected.
67. Forbidden transitions are rejected with stable failure codes.
68. A decision runtime may accept, reject, request review, or request reevaluation; it may not secretly alter evaluation output.
69. Mastery confirmation requires policy-qualified evidence.
70. High score alone cannot confirm mastery.
71. Activity completion alone cannot confirm mastery.
72. Journey completion alone cannot confirm mastery.
73. Prerequisite completion alone cannot confirm mastery.
74. Revocation requires explicit rationale and lineage.
75. Supersession preserves the superseded decision.
76. Appeals are durable and attributable.
77. Governed overrides are visible and reviewable.
78. Decision events and aggregate state commit atomically.
79. A committed decision has a unique decision ID and version.
80. Duplicate decision commands return the original result idempotently.

---

## F. State and Lifecycle Invariants

81. Mastery state transitions follow an explicit transition matrix.
82. `UNASSESSED` does not imply weakness.
83. `EVIDENCE_ACCUMULATING` does not imply failure.
84. `EVALUATION_READY` does not imply mastery.
85. `UNDER_REVIEW` blocks automatic confirmation where policy requires review.
86. `MASTERED` is a governed educational assertion.
87. `AT_RISK` does not erase historical mastery.
88. `REVOKED` preserves the prior confirmation lineage.
89. `SUPERSEDED` identifies a newer authoritative interpretation.
90. State names used in events, persistence, and projections must map unambiguously.

---

## G. Adaptive Invariants

91. Adaptation changes the interpretation path, not historical evidence.
92. Adaptation signals are deduplicated.
93. Adaptive proposals are idempotent.
94. New evidence may trigger reevaluation but not direct mastery mutation.
95. Evidence withdrawal may trigger reevaluation but not silent historical deletion.
96. Retention decay may trigger review or reevaluation under policy.
97. Curriculum changes do not automatically revoke mastery.
98. Skill graph changes do not automatically revoke mastery.
99. Accessibility-context changes require explicit reinterpretation context.
100. Active learner continuity takes precedence over non-critical adaptation.
101. Adaptive impact analysis must identify affected learner-skill aggregates.
102. Unsafe or ambiguous adaptation escalates to governed review.
103. Adaptive Runtime cannot bypass optimistic concurrency.
104. Adaptive Runtime cannot publish authoritative mastery events.
105. Adaptation history is durable and explainable.

---

## H. Persistence Invariants

106. Aggregate state, event history, command receipt, decision lineage, evidence reference, and outbox records commit atomically.
107. Event history is append-only.
108. Aggregate versions are contiguous.
109. Every accepted state change advances aggregate version.
110. Every accepted decision advances decision version where applicable.
111. Stale writes cannot overwrite newer authority.
112. Command idempotency survives process restart.
113. Same command ID with different request hash is rejected.
114. Persistence never silently retries with changed semantics.
115. Historical events are never edited in place.
116. Corrections are represented by new events.
117. Evidence bundle references are hash-verifiable.
118. Missing lineage blocks authoritative reconstruction.
119. Outbox publication failure does not roll back committed authority.
120. Partial authoritative writes are forbidden.

---

## I. Replay and Recovery Invariants

121. Replay is deterministic.
122. Replay is side-effect free.
123. Replay applies events by aggregate version.
124. Event version gaps block replay.
125. Conflicting events for one aggregate version are integrity failures.
126. Duplicate identical events are handled idempotently.
127. Replay does not redispatch notifications.
128. Replay does not regenerate evidence.
129. Replay does not invoke external learning activities.
130. Historical policy context is preserved during replay.
131. Snapshots accelerate replay but do not replace event authority.
132. Invalid snapshots are discarded.
133. Recovery starts from persisted authority.
134. Ambiguous command outcomes resolve through durable command receipts.
135. Replay result hashes must match authoritative state hashes.

---

## J. Projection Invariants

136. Projection is derived interpretation.
137. Projection is not write authority.
138. Projection lag is visible.
139. Stale projection data must not be presented as fresh.
140. Projection failure cannot roll back mastery authority.
141. Projection rebuild cannot change mastery authority.
142. Projection applies events idempotently.
143. Projection preserves aggregate event order.
144. Learner views use safe, understandable explanations.
145. Parent views respect authorization and redaction.
146. Teacher views expose evidence gaps and review needs without fabricating certainty.
147. Audit views preserve decision lineage.
148. Notifications are derived from authoritative events and are deduplicated.
149. Projection versions are explicit.
150. Projection reconciliation compares against authority rather than replacing it.

---

## K. Verification Invariants

151. Repository PASS is distinct from Runtime PASS.
152. Runtime PASS is distinct from Integration PASS.
153. Integration PASS is distinct from Operational PASS.
154. Operational PASS is not proof of universal educational outcomes.
155. Authority boundaries require negative tests.
156. Evaluation determinism requires reproducible fixtures and hashes.
157. Decision transition coverage must include allowed and forbidden paths.
158. Persistence atomicity requires fault-injection evidence.
159. Replay verification checks state equivalence and absence of side effects.
160. Cross-runtime verification preserves tenant, learner, skill, and version context.
161. Accessibility, fairness, privacy, and appeals are mandatory verification domains.
162. Human validation and automated verification must be reported separately.
163. Verification failures identify the violated contract or invariant.
164. Green builds cannot substitute for mastery correctness evidence.
165. Golden scenarios remain stable and versioned.

---

## L. Evolution Invariants

166. Deployment is not migration.
167. Read compatibility is not behavior compatibility.
168. Every authoritative record retains its version context.
169. In-flight evaluation and decision chains are version-pinned.
170. Historical decisions retain historical policy context.
171. Event upcasters are deterministic and side-effect free.
172. Upcasters do not invent historical facts.
173. Snapshot migration cannot become the only interpretation path.
174. Algorithm changes require shadow comparison before broad authority rollout.
175. Policy changes apply prospectively unless explicit migration or reevaluation is approved.
176. Curriculum skill mappings are explicit.
177. Skill splits do not inherit full mastery automatically without supporting coverage.
178. Re-evaluation creates new decisions and lineage.
179. Migration units are resumable and idempotent.
180. Code rollback is not state rollback.
181. Mixed-version operation is explicit and time-bounded.
182. Old interpreters cannot be removed while they remain necessary for retained authority.
183. Safety regressions block rollout.
184. Fairness regressions block rollout.
185. Active learner continuity takes precedence over rollout speed.

---

## M. Cross-Runtime Invariants

186. Assessment produces evidence, not mastery decisions.
187. Learning Session Runtime produces activity and evidence context, not mastery authority.
188. Learning Journey Runtime consumes mastery facts but does not declare mastery.
189. Curriculum Runtime owns curriculum truth.
190. Skill Graph Runtime owns skill topology truth.
191. Progress Engine derives progress from authoritative facts and cannot rewrite mastery.
192. Recommendation Engine recommends actions and cannot confirm mastery.
193. Intervention Runtime proposes support and cannot revoke mastery directly.
194. Cross-runtime messages are idempotent.
195. Cross-runtime messages carry source version and identity context.
196. Circular write authority is forbidden.
197. Stale upstream inputs are handled explicitly.
198. Downstream failures do not invalidate already committed mastery authority.
199. Contract changes affecting consumers require explicit compatibility handling.
200. No neighboring runtime may infer mastery from projection text alone.

---

## N. Safety, Fairness, Privacy, and Accessibility Invariants

201. Accessibility accommodations may change expression mode without lowering the mathematical truth being assessed.
202. Language difficulty must not be silently equated with mathematical weakness.
203. Protected attributes cannot be unjustified mastery predictors.
204. Contradictory evidence cannot be suppressed to improve reported outcomes.
205. Confidence uncertainty is visible.
206. Low coverage is visible.
207. Human review is attributable.
208. Learner appeals are preserved.
209. Privacy redaction does not alter authoritative educational meaning.
210. Metrics do not expose protected learner content.
211. Cross-tenant access is forbidden.
212. Role-based views reveal only authorized evidence detail.
213. Audit access is itself auditable.
214. Data retention follows explicit policy.
215. Governed deletion preserves required structural integrity.

---

## O. Operational Invariants

216. Authority-impacting failures are observable.
217. Integrity failures are quarantinable.
218. Silent repair of mastery authority is forbidden.
219. Outbox backlog age is monitored.
220. Replay hash mismatches are monitored.
221. Invalid snapshot counts are monitored.
222. Version conflicts are monitored.
223. Duplicate command rates are monitored.
224. Evidence-resolution failures are monitored.
225. Operational metrics do not replace learner-level explanation.
226. Recovery procedures are documented and testable.
227. Emergency changes retain audit authority.
228. Known limitations are recorded in verification evidence.
229. Repository state remains the durable architecture source of truth.
230. Runtime evidence is required before claiming runtime or operational completion.

---

## Final Boundary

Mastery Runtime owns the correctness, durability, explainability, and evolution of mastery authority for a learner-skill relationship.

It does not own:

- curriculum definition;
- skill graph definition;
- learning activity execution;
- evidence source execution;
- journey orchestration;
- recommendation policy;
- intervention delivery;
- user-interface workflow ownership outside its projections.

The final rule of Chapter 37 is:

> Mastery is not a score, completion flag, or optimistic inference. It is a versioned, evidence-supported, explicitly authorized, durable, replayable, and explainable educational decision.