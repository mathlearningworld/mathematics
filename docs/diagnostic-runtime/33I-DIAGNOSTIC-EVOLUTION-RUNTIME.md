# 33I — Diagnostic Evolution Runtime

## 1. Purpose

This runtime defines how the Diagnostic Runtime evolves safely as evidence schemas, inference models, confidence calibration, skill graphs, curriculum expectations, projection contracts, and policy rules change over time.

The goal is to improve diagnostic capability without rewriting historical meaning, breaking replay, silently changing learner outcomes, or making old cases impossible to audit.

---

## 2. Evolution Principle

> Diagnostic capability may evolve; historical authority must remain interpretable under the versions that produced it.

Evolution therefore separates:

- historical reconstruction,
- current production behavior,
- comparative evaluation,
- migration,
- re-diagnosis,
- projection upgrade.

A new model may produce a different conclusion from the same evidence. That difference is an evaluation result until explicitly accepted into current case authority.

---

## 3. Evolution Domains

The runtime supports evolution across:

- evidence schemas,
- evidence quality rules,
- feature extraction,
- candidate generation,
- hypothesis taxonomy,
- root-cause taxonomy,
- understanding-debt rules,
- confidence calibration,
- skill graph versions,
- curriculum versions,
- actionability policies,
- human-review thresholds,
- event schemas,
- snapshot schemas,
- projection schemas,
- explanation templates,
- privacy and retention policy.

Each domain evolves independently but may have declared compatibility dependencies.

---

## 4. Version Registry

Every evolvable authority must be registered with:

- version ID,
- authority type,
- semantic version or monotonic identifier,
- activation state,
- effective-from time,
- compatibility range,
- dependency versions,
- migration requirements,
- replay availability,
- deprecation state,
- owner,
- release evidence,
- rollback target.

Recommended states:

```text
DRAFT
EVALUATING
APPROVED
ACTIVE
DEPRECATED
RETIRED
QUARANTINED
```

Only `ACTIVE` versions may serve as default production authority.

---

## 5. Change Classification

Every change must be classified.

### 5.1 Non-Semantic Change

Examples:

- documentation improvement,
- internal refactoring with identical outputs,
- performance optimization preserving determinism.

### 5.2 Backward-Compatible Semantic Extension

Examples:

- optional evidence metadata,
- new non-required projection field,
- additional hypothesis category not used by old cases.

### 5.3 Behavior-Changing Revision

Examples:

- changed feature extraction,
- changed candidate ranking,
- changed confidence calibration,
- changed debt severity rules.

### 5.4 Breaking Contract Change

Examples:

- removed required field,
- changed event meaning,
- changed skill identity semantics,
- incompatible projection contract.

### 5.5 Policy-Critical Change

Examples:

- changed human-review threshold,
- expanded learner-data visibility,
- changed high-impact action restrictions.

Behavior-changing, breaking, and policy-critical revisions require explicit evaluation and rollout approval.

---

## 6. Historical Meaning Preservation

Historical cases must remain replayable using their original version vector where retention policy permits.

The version vector includes:

- event schema versions,
- evidence schema versions,
- diagnostic model version,
- feature extractor version,
- confidence calibration version,
- skill graph version,
- curriculum version,
- policy version,
- projection schema version.

The runtime must not silently substitute the latest available version when an original version is unavailable.

Required behavior:

```text
HISTORICAL_VERSION_UNAVAILABLE
```

The case may be readable from persisted outputs, but deterministic replay is blocked until the required authority is restored or an explicit certified migration exists.

---

## 7. Migration Types

### 7.1 Read-Time Adapter

Transforms old stored shape into a current compatible representation without changing historical events.

### 7.2 Event Upcaster

Transforms an old event payload into the shape required by current replay code while preserving original semantics.

### 7.3 Snapshot Migration

Rebuilds or converts snapshots. Snapshots may be discarded and recreated when safe.

### 7.4 Projection Migration

Rebuilds read models under a new projection schema.

### 7.5 Case Authority Migration

Changes write-side case representation or accepted diagnostic authority. This requires the highest scrutiny and explicit migration events.

### 7.6 Re-Diagnosis

Runs current diagnostic models over historical evidence to create a new diagnostic interpretation. Re-diagnosis is not migration and must produce a new authority record or case revision.

---

## 8. Upcasting Rules

An event upcaster must:

- preserve event identity,
- preserve original payload access,
- declare source and target schema versions,
- be deterministic,
- avoid external latest-version lookup,
- avoid inventing evidence,
- expose lossy conversion,
- be covered by fixture-based tests.

Upcasting may normalize shape but must not silently reinterpret meaning.

---

## 9. Comparative Evaluation

Before activating behavior-changing revisions, the runtime should compare old and candidate versions on representative cases.

Comparison dimensions include:

- primary hypothesis changes,
- alternative hypothesis coverage,
- confidence distribution,
- inconclusive rate,
- false certainty rate,
- debt signal frequency,
- root-cause category distribution,
- recommendation impact,
- subgroup differences,
- replay determinism,
- human-review escalation rate.

Differences must be classified as:

```text
EXPECTED_IMPROVEMENT
EXPECTED_NEUTRAL_CHANGE
REQUIRES_REVIEW
POTENTIAL_REGRESSION
POLICY_RISK
UNKNOWN
```

---

## 10. Shadow Evaluation

A candidate model may run in shadow mode against live evidence without affecting current authority.

Shadow outputs must:

- remain isolated from production decisions,
- retain candidate version identity,
- avoid learner-facing exposure unless approved,
- be available for aggregate evaluation,
- not advance case version,
- not mutate active projections.

Shadow mode is preferred before broad activation of high-impact changes.

---

## 11. Activation Strategies

Supported strategies:

- all-at-once activation,
- tenant allowlist,
- learner cohort,
- jurisdiction or curriculum scope,
- case-type scope,
- percentage rollout,
- dual-run comparison,
- human-reviewed pilot.

The activation record must include:

- target scope,
- start time,
- version vector,
- guardrails,
- rollback conditions,
- owner,
- approval evidence.

---

## 12. Rollback

Every production activation must define rollback capability.

Rollback may:

- restore previous default model version,
- stop candidate projection consumption,
- disable a new evidence type,
- revert policy thresholds,
- return affected cases to human review.

Rollback must not erase events produced during the activation window. Those events remain historically traceable and may require compensating events.

---

## 13. Re-Diagnosis Policy

Re-diagnosis is permitted when:

- meaningful new evidence arrives,
- a prior case is reopened,
- a certified new model is intentionally applied,
- a graph or curriculum correction materially affects interpretation,
- a previous model defect is confirmed.

Re-diagnosis must record:

- original case or interpretation reference,
- triggering reason,
- old and new version vectors,
- evidence boundary,
- changed hypotheses,
- changed confidence,
- changed debt and root-cause outputs,
- human review where required.

A re-diagnosed output must not masquerade as the original historical conclusion.

---

## 14. Skill Graph Evolution

Graph changes may include:

- new skills,
- deprecated skills,
- split or merged skill identities,
- relationship changes,
- prerequisite-strength changes,
- cycle correction.

Diagnostic evolution must define mapping behavior for historical cases.

Rules:

- old graph version remains available for replay,
- identity mapping is explicit,
- split or merge mappings may be lossy,
- downstream impact must be recomputed only under explicit re-diagnosis or projection rebuild policy,
- graph change alone does not retroactively prove a new cause.

---

## 15. Curriculum Evolution

Curriculum changes may alter expected skill timing or jurisdictional scope.

The runtime must preserve:

- curriculum ID,
- jurisdiction,
- stage or grade expectation,
- effective dates,
- mapping to stable skill identities.

A learner is not automatically classified as having debt merely because a curriculum expectation changed after the original diagnostic event.

---

## 16. Confidence Calibration Evolution

Calibration changes require special treatment because identical raw evidence may produce different confidence values.

The runtime must retain:

- calibration version,
- training or evaluation scope description,
- applicable population constraints,
- confidence-band mapping,
- known limitations,
- activation date.

Historical replay uses the original calibration version. Current re-diagnosis may use a new version and must label the difference.

---

## 17. Taxonomy Evolution

Hypothesis and root-cause categories may evolve.

Taxonomy changes must provide:

- stable identifiers,
- display-label separation,
- parent-child relationships,
- deprecation mappings,
- replacement guidance,
- semantic notes,
- projection compatibility.

Display wording may change without changing stable diagnostic identity.

---

## 18. Projection Evolution

Projection schemas may evolve more rapidly than diagnostic authority.

Projection evolution supports:

- additive fields,
- audience-specific views,
- renamed labels,
- explanation improvements,
- privacy minimization,
- new freshness metadata.

Projection rebuilds may use current projection schemas while preserving the source diagnostic version and original uncertainty.

Projection evolution must not upgrade uncertain hypotheses into facts.

---

## 19. Policy Evolution

Policy-critical changes require:

- explicit approval,
- impact analysis,
- access-control verification,
- privacy review,
- human-review threshold validation,
- rollback plan,
- effective-date recording.

Historical access must follow current lawful policy while preserving audit evidence of past decisions where required.

---

## 20. Compatibility Matrix

The runtime should maintain a machine-readable matrix covering compatibility between:

- event schema and replay engine,
- diagnostic model and feature extractor,
- diagnostic model and skill graph,
- diagnostic model and curriculum,
- confidence calibration and model,
- projection schema and consumer contract,
- policy version and action type.

Unsupported combinations fail explicitly rather than using best-effort guessing.

---

## 21. Evolution Verification

Every candidate version must verify:

- deterministic replay,
- fixture compatibility,
- event upcaster correctness,
- snapshot fallback,
- projection rebuild,
- cross-runtime contracts,
- semantic invariant preservation,
- privacy and policy boundaries,
- rollback readiness,
- comparative evaluation completeness.

For behavior-changing revisions, repository verification alone is insufficient. Runtime and operational evaluation remain required.

---

## 22. Failure Codes

Recommended codes:

```text
DIAGNOSTIC_VERSION_NOT_REGISTERED
DIAGNOSTIC_VERSION_NOT_ACTIVE
DIAGNOSTIC_VERSION_DEPENDENCY_MISMATCH
DIAGNOSTIC_HISTORICAL_VERSION_UNAVAILABLE
DIAGNOSTIC_EVENT_UPCAST_FAILED
DIAGNOSTIC_MIGRATION_LOSSY
DIAGNOSTIC_COMPARATIVE_EVALUATION_FAILED
DIAGNOSTIC_SHADOW_OUTPUT_LEAKED
DIAGNOSTIC_ACTIVATION_POLICY_BLOCKED
DIAGNOSTIC_ROLLBACK_UNAVAILABLE
DIAGNOSTIC_REDIAGNOSIS_REQUIRES_REVIEW
DIAGNOSTIC_COMPATIBILITY_UNSUPPORTED
```

---

## 23. Mandatory Evolution Scenarios

The runtime must verify at least:

1. Old event schema replays through deterministic upcasting.
2. Missing historical model version blocks replay explicitly.
3. New projection schema rebuilds without changing diagnostic authority.
4. Shadow model cannot drive production recommendation.
5. Candidate model comparison preserves old and new outputs.
6. Rollback restores previous default authority.
7. Re-diagnosis creates a new interpretation rather than rewriting history.
8. Skill split mapping exposes lossiness.
9. Curriculum change does not retroactively create debt automatically.
10. Confidence recalibration preserves version identity.
11. Deprecated taxonomy identifiers remain interpretable.
12. Policy-critical activation requires approval.
13. Unsupported version combinations fail.
14. Migration failure leaves original history intact.
15. Partial rollout scope remains auditable.

---

## 24. Non-Goals

This runtime does not:

- guarantee a new model is educationally better without outcome evidence,
- rewrite historical conclusions to match current thinking,
- permit latest-version substitution during replay,
- treat projection migration as case re-diagnosis,
- remove rollback responsibility,
- collapse policy approval into technical deployment.

---

## 25. Acceptance Criteria

33I is complete when:

- every evolvable authority is versioned,
- change classes are explicit,
- historical meaning is preserved,
- migrations and re-diagnosis are distinct,
- upcasting is deterministic and semantics-preserving,
- comparative and shadow evaluation are supported,
- rollout and rollback are auditable,
- graph, curriculum, calibration, taxonomy, and projection evolution are addressed,
- compatibility is machine-checkable,
- policy-critical change has stronger gates.

---

## 26. Runtime Laws

1. **Evolution must not erase history.**
2. **Latest is not valid for historical replay unless explicitly recorded.**
3. **Migration is not re-diagnosis.**
4. **Projection upgrade is not authority upgrade.**
5. **Behavior-changing revisions require comparative evidence.**
6. **Shadow output must not influence production authority.**
7. **Every activation requires rollback.**
8. **Graph and curriculum evolution do not create retroactive causal truth.**
9. **Unsupported version combinations must fail explicitly.**
10. **Policy evolution requires governance beyond technical correctness.**
