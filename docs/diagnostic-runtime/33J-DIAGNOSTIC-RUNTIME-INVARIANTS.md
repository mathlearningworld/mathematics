# 33J — Diagnostic Runtime Invariants

## 1. Purpose

This document consolidates the permanent invariants of Chapter 33 — Diagnostic Runtime.

These laws govern evidence collection, inference, understanding debt, root-cause analysis, projection, persistence, verification, and evolution. They are system constraints, not optional implementation preferences.

---

## 2. Authority Invariants

1. Diagnostic authority belongs to the Diagnostic Runtime, not to projections or consumers.
2. Source evidence remains owned by its originating runtime unless explicitly copied under policy.
3. A diagnostic projection is never write-side authority.
4. A recommendation or mission must not become diagnostic authority.
5. A learner-facing explanation must preserve the source diagnostic uncertainty.
6. Human overrides must retain actor identity, rationale, and time.
7. Historical diagnostic conclusions must remain traceable to the versions that produced them.

---

## 3. Evidence Invariants

1. Missing evidence is not negative evidence.
2. Contradictory evidence must remain visible.
3. Derived evidence must declare parent lineage.
4. Source evidence must not be silently rewritten.
5. Duplicate delivery must not duplicate diagnostic meaning.
6. Evidence context and accessibility metadata must be preserved.
7. Occurred-at and recorded-at times must remain distinct.
8. Evidence integrity failure must be explicit.
9. Evidence quality is multidimensional and must not collapse into a single unexplained score.
10. Human interpretation must remain distinguishable from direct observation.

---

## 4. Inference Invariants

1. A hypothesis is not a fact.
2. A primary hypothesis is not proven causation.
3. Supporting and contradicting evidence must remain separate.
4. Plausible alternatives must remain auditable.
5. Graph reachability may inform plausibility but must not establish learner-specific causation.
6. Confidence must expose uncertainty and calibration version.
7. `INCONCLUSIVE` is a legitimate final state.
8. High confidence must not be rendered as certainty.
9. Discriminating evidence requests must target unresolved alternatives.
10. Rejected hypotheses must retain rejection rationale where policy requires.

---

## 5. Understanding Debt Invariants

1. Understanding debt is a reversible signal, not learner identity.
2. One incorrect answer does not automatically establish debt.
3. Severity and priority are separate dimensions.
4. Downstream graph impact is not causal proof.
5. Remediation completion is not debt resolution.
6. `STALE` is not `RESOLVED`.
7. Disproven debt must stop driving recommendations.
8. Resolution requires outcome evidence appropriate to the claim.
9. Learner-facing language must avoid stigma.
10. Debt propagation must remain bounded by pinned graph authority.

---

## 6. Root-Cause Invariants

1. Observed error is not root cause.
2. Symptom, proximal cause, foundational cause, contextual factor, and amplifying factor must remain distinct.
3. Most likely does not mean proven.
4. Actionable does not mean certain.
5. Composite causes must declare their components.
6. Alternative causes must remain visible until rejected by evidence or policy.
7. Root-cause ranking must be traceable.
8. Contextual barriers may coexist with skill gaps.
9. Graph paths must not be narrated as causal proof.
10. High-impact root-cause claims may require human review.

---

## 7. Projection Invariants

1. Projection is not authority.
2. Summary is not proof.
3. Visualization is not diagnosis.
4. Ranking is not truth.
5. Projection freshness is part of correctness.
6. `STALE_BLOCKING` projections must not drive high-impact decisions.
7. Audience-specific projections must enforce purpose limitation.
8. Uncertainty must survive projection transformation.
9. Sensitive diagnostic fields must be minimized by audience.
10. Projection rebuild must not mutate case authority.

---

## 8. Persistence Invariants

1. Persisted does not mean proven.
2. Diagnostic history is append-oriented.
3. Corrections must not erase prior historical meaning.
4. Aggregate versions must increase monotonically.
5. Writes must use expected-version semantics.
6. Snapshots accelerate replay but do not replace event authority.
7. Replay requires pinned model, graph, curriculum, and policy versions.
8. Historical replay must not use latest-version lookup.
9. Duplicate commands and events must be idempotent.
10. Integrity failure must result in failure or quarantine, not silent acceptance.

---

## 9. Replay Invariants

1. Full replay and snapshot-assisted replay must converge.
2. Event ordering uses aggregate sequence, not timestamps alone.
3. Late evidence must retain original occurrence time.
4. Comparative replay must not mutate historical authority.
5. Missing historical versions must block deterministic replay explicitly.
6. Projection replay must be independent of write-side mutation.
7. External time, randomness, or network state must not influence historical reconstruction unless recorded.
8. Reopened cases must retain prior resolution history.
9. Superseded hypotheses must remain historically visible.
10. Replay failure must preserve the original ledger.

---

## 10. Verification Invariants

1. Verified process is not proven cause.
2. `INCONCLUSIVE` is not `PASS`.
3. Structural, semantic, evidence, inference, temporal, projection, policy, and cross-runtime checks are distinct.
4. Unresolved `ERROR` or `CRITICAL` findings prevent `PASS`.
5. Confidence requires calibration and explanation.
6. Contradiction hiding is a verification failure.
7. Replay mismatch is a durability failure.
8. Policy failure may block technically valid output.
9. Cross-runtime identity mismatch must fail explicitly.
10. Repository, runtime, and operational gates remain separate.

---

## 11. Evolution Invariants

1. Evolution must not erase history.
2. Latest version is not valid for historical replay unless explicitly recorded.
3. Migration is not re-diagnosis.
4. Projection upgrade is not authority upgrade.
5. Behavior-changing revisions require comparative evidence.
6. Shadow outputs must not influence production authority.
7. Every activation requires rollback capability.
8. Unsupported version combinations must fail explicitly.
9. Graph and curriculum evolution do not create retroactive causal truth.
10. Policy-critical changes require governance beyond technical correctness.

---

## 12. Cross-Runtime Invariants

1. Assessment Runtime provides evidence; it does not own diagnostic conclusions.
2. Learning Runtime provides behavior and outcome evidence; completion alone does not prove understanding.
3. Skill Graph Runtime provides relationship authority; paths are not learner-specific causal proof.
4. Curriculum Runtime provides expectation authority; expectation changes do not retroactively create debt.
5. Recommendation Runtime consumes bounded diagnostic outputs and must preserve uncertainty.
6. Mission Runtime operationalizes needs without becoming diagnostic authority.
7. Progress Runtime records transitions without converting progress state into diagnostic proof.
8. All cross-runtime references must preserve tenant, learner, entity, and version identity.
9. Stale or incompatible diagnostic outputs must be refused by high-impact consumers.
10. Contract failures must be explicit and auditable.

---

## 13. Privacy and Human-Safety Invariants

1. Diagnostic data is sensitive learner information.
2. Access must be least-privilege and purpose-limited.
3. Learner-facing language must avoid permanent deficit labels.
4. Free text must be minimized where structured evidence is sufficient.
5. High-impact actions may require human review.
6. Accessibility context must not be lost during inference or projection.
7. Retention, anonymization, and deletion must preserve required aggregate integrity.
8. Audit access and mutation must be traceable.
9. Technical validity does not override lawful policy.
10. Diagnostic uncertainty must remain visible to humans making consequential decisions.

---

## 14. Lifecycle Invariants

1. Case transitions must be explicit and legal.
2. Resolution requires a valid resolution event.
3. Reopening creates a new active diagnostic phase without erasing prior resolution.
4. Cancellation is distinct from inconclusive and resolved.
5. Evidence can arrive after a prior conclusion and trigger reconsideration.
6. A primary hypothesis may be withdrawn.
7. Debt signals may be disproven.
8. Root-cause candidates may remain unresolved.
9. Projection freshness may diverge temporarily from case state but must be declared.
10. Recovery state must be explicit during replay or rebuild failure.

---

## 15. Chapter 33 Completion Contract

Chapter 33 is architecturally complete when all of the following are defined:

- 33A Diagnostic Runtime Foundation
- 33B Diagnostic Evidence Runtime
- 33C Diagnostic Inference Runtime
- 33D Understanding Debt Runtime
- 33E Root Cause Analysis Runtime
- 33F Diagnostic Projection Runtime
- 33G Diagnostic Persistence & Replay Runtime
- 33H Diagnostic Verification Runtime
- 33I Diagnostic Evolution Runtime
- 33J Diagnostic Runtime Invariants

Architectural completion means the contracts, boundaries, laws, and runtime responsibilities are defined.

It does not by itself mean:

- implementation complete,
- runtime verified,
- operationally validated,
- educational effectiveness proven,
- production deployment approved.

Those remain separate delivery gates.

---

## 16. Final Runtime Doctrine

> The Diagnostic Runtime must help the system understand what may be blocking learning while remaining honest about uncertainty, respectful of the learner, traceable to evidence, reversible when new evidence arrives, and safe to evolve over time.

The runtime succeeds not when it produces the most confident label, but when it produces the most useful, auditable, and appropriately bounded explanation that the available evidence can support.
