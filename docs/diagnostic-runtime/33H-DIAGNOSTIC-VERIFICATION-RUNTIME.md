# 33H — Diagnostic Verification Runtime

## 1. Purpose

This runtime defines how the Diagnostic Runtime proves structural, semantic, temporal, cross-runtime, and policy correctness without confusing successful execution with diagnostic truth.

Verification must answer whether the system:

- preserved evidence meaning,
- applied the correct model and graph versions,
- produced internally consistent hypotheses,
- exposed uncertainty honestly,
- rebuilt deterministic state,
- respected policy and privacy boundaries,
- remained safe when evidence was insufficient or contradictory.

---

## 2. Verification Principle

> A diagnostic result is verified when its process, authority, traceability, and constraints are correct—not when the hypothesis is assumed to be true.

Verification therefore distinguishes:

- runtime correctness,
- evidence integrity,
- inference consistency,
- calibration quality,
- outcome validity,
- causal truth.

Only the first four can be verified directly by this runtime. Outcome validity and causal truth require later evidence and may remain uncertain.

---

## 3. Verification Layers

### 3.1 Structural Verification

Confirms that required entities, fields, versions, references, and transitions exist and conform to contracts.

### 3.2 Semantic Verification

Confirms that meanings are not collapsed or misrepresented, such as treating a symptom as a root cause or a graph path as proof.

### 3.3 Evidence Verification

Confirms source lineage, integrity, chronology, quality dimensions, contradiction visibility, and derivation lineage.

### 3.4 Inference Verification

Confirms candidate generation, support and contradiction accounting, alternative preservation, confidence calculation, and terminal-state handling.

### 3.5 Temporal Verification

Confirms event sequence, occurred-at versus recorded-at distinctions, replay determinism, and historical reconstruction.

### 3.6 Projection Verification

Confirms that read models reflect authoritative case state, freshness, uncertainty, audience policy, and source versions.

### 3.7 Cross-Runtime Verification

Confirms contracts with Assessment, Learning, Skill Graph, Curriculum, Recommendation, Mission, and Progress runtimes.

### 3.8 Policy Verification

Confirms privacy, access, risk, human-review, and actionability policies.

---

## 4. Verification Outcomes

Every verification produces one of:

```text
PASS
PASS_WITH_WARNINGS
FAIL
BLOCKED
INCONCLUSIVE
NOT_APPLICABLE
```

Definitions:

- `PASS`: required checks succeeded.
- `PASS_WITH_WARNINGS`: safe to proceed, but non-blocking risks remain visible.
- `FAIL`: a required invariant or contract was violated.
- `BLOCKED`: required authority or dependency was unavailable.
- `INCONCLUSIVE`: evidence is insufficient to establish verification outcome.
- `NOT_APPLICABLE`: the check does not apply to the target scope.

`INCONCLUSIVE` must not be converted to `PASS` for reporting convenience.

---

## 5. Verification Target

A verification run identifies:

- target type,
- target ID,
- tenant ID,
- learner ID where applicable,
- case version or event boundary,
- verification profile,
- diagnostic model version,
- graph version,
- curriculum version,
- policy version,
- requested checks,
- execution time,
- verifier version.

Supported targets include:

- diagnostic case,
- evidence item,
- hypothesis set,
- debt signal,
- root-cause analysis,
- projection,
- event stream,
- snapshot,
- replay result,
- cross-runtime contract.

---

## 6. Structural Checks

Minimum structural checks include:

- required identifiers exist,
- tenant and learner identities are consistent,
- case versions are monotonic,
- event sequence has no unexplained gaps,
- required schema versions are present,
- lifecycle transitions are legal,
- evidence references resolve or are explicitly quarantined,
- derived evidence has parent lineage,
- selected primary hypothesis belongs to the active candidate set,
- resolved cases have a valid resolution event,
- stale projections declare freshness state.

---

## 7. Semantic Checks

Semantic verification enforces distinctions established by earlier slices.

Examples:

- observation is not labeled as root cause,
- wrong answer is not automatically treated as understanding debt,
- remediation completion is not treated as debt resolution,
- high confidence is not displayed as certainty,
- graph reachability is not described as learner-specific causation,
- priority is not displayed as severity,
- stale is not displayed as resolved,
- projection ranking is not displayed as truth,
- learner identity is not reduced to a deficit label.

---

## 8. Evidence Checks

Evidence verification must inspect:

- source runtime identity,
- source entity and event identifiers,
- integrity hash where available,
- occurrence time,
- recording time,
- quality dimensions,
- context and accessibility metadata,
- direct versus derived status,
- parent evidence lineage,
- duplication,
- contradiction visibility,
- supersession history.

Failure examples:

```text
EVIDENCE_SOURCE_UNRESOLVED
EVIDENCE_LINEAGE_BROKEN
EVIDENCE_DUPLICATED
EVIDENCE_CONTEXT_LOST
EVIDENCE_CONTRADICTION_HIDDEN
EVIDENCE_INTEGRITY_FAILED
```

---

## 9. Inference Checks

Inference verification must confirm:

1. Candidate generation used an available model version.
2. Supporting and contradicting evidence remained separate.
3. Plausible alternatives were not deleted merely because a primary hypothesis was chosen.
4. Confidence calculation used the declared calibration version.
5. Missing evidence did not become negative evidence.
6. Graph paths contributed only to plausibility.
7. Discriminating evidence requests were connected to unresolved alternatives.
8. `INCONCLUSIVE` was allowed when evidence was inadequate.
9. Human overrides retained rationale and actor identity.
10. Rejected hypotheses retained rejection reasons where policy requires.

---

## 10. Confidence and Calibration Verification

Confidence verification must not assert that a confidence value is correct merely because it falls between zero and one.

Checks include:

- calibration model version present,
- input dimensions complete,
- confidence range valid,
- confidence band mapped correctly,
- uncertainty reasons exposed,
- contradictory evidence penalty applied,
- evidence independence assumptions declared,
- stale evidence penalty applied where configured,
- low-support alternatives remain visible,
- confidence language matches policy.

Recommended language bands:

```text
VERY_LOW
LOW
MODERATE
HIGH
VERY_HIGH
```

Even `VERY_HIGH` must not be rendered as proven causation.

---

## 11. Understanding Debt Verification

Checks include:

- signal is linked to evidence,
- affected skill identity resolves,
- severity and priority are independently derived,
- downstream impact uses a pinned graph version,
- propagation is not presented as proof,
- remediation state is distinct from resolution,
- stale state is explicit,
- disproven signals no longer drive recommendations,
- resolved signals have outcome evidence,
- learner-facing language is non-stigmatizing.

---

## 12. Root-Cause Verification

Checks include:

- symptom and cause are distinct,
- candidate category is declared,
- proximal and foundational causes are not collapsed,
- contextual factors can coexist with skill gaps,
- alternative candidates remain auditable,
- composite causes declare components,
- ranking rationale is traceable,
- actionability does not replace certainty,
- causal claims are bounded by evidence,
- human review thresholds are enforced.

---

## 13. Replay Verification

Replay verification compares:

- full replay,
- snapshot-assisted replay,
- target-version replay,
- projection rebuild,
- optional comparative model replay.

Required checks:

- final aggregate state equality,
- event count equality,
- source version equality,
- hypothesis set equality,
- debt signal equality,
- root-cause candidate equality,
- deterministic ordering,
- stable checksums where applicable,
- no hidden current-time dependency,
- no latest-version lookup during historical replay.

---

## 14. Projection Verification

Each projection must verify:

- source case version,
- projection schema version,
- freshness state,
- audience authorization,
- uncertainty preservation,
- privacy minimization,
- terminology policy,
- no unsupported causal language,
- no stale-blocking use for high-impact decisions,
- rebuild reproducibility.

Audience-specific verification profiles should exist for:

- learner,
- parent,
- teacher,
- administrator,
- recommendation engine,
- mission engine,
- learning engine.

---

## 15. Cross-Runtime Contract Verification

### Assessment Runtime

Verify evidence identifiers, attempt versions, response chronology, scoring interpretation, and assessment context.

### Learning Runtime

Verify worked-solution, hint, practice, remediation, and outcome evidence semantics.

### Skill Graph Runtime

Verify skill identity, graph version, relationship types, and path semantics.

### Curriculum Runtime

Verify curriculum identity, expectation version, grade or stage context, and jurisdiction scope.

### Recommendation Runtime

Verify diagnostic projection consumption, uncertainty handling, stale-state refusal, and action traceability.

### Mission Runtime

Verify that diagnostic needs inform mission design without missions becoming diagnostic authority.

### Progress Runtime

Verify progress transitions are not interpreted as proof of understanding without required evidence.

---

## 16. Policy Checks

Policy verification includes:

- tenant isolation,
- learner access boundaries,
- role-based projection visibility,
- sensitive field minimization,
- human-review thresholds,
- high-impact action restrictions,
- accessibility context preservation,
- retention and anonymization rules,
- audit logging,
- explanation requirements.

A technically valid diagnostic result may still fail policy verification.

---

## 17. Verification Profiles

Recommended profiles:

```text
FAST_STRUCTURAL
STANDARD_CASE
FULL_DIAGNOSTIC
REPLAY_CERTIFICATION
PROJECTION_CERTIFICATION
CROSS_RUNTIME_CONTRACT
PRIVACY_AND_POLICY
MODEL_MIGRATION
INCIDENT_RECOVERY
```

Profiles define required checks, severity thresholds, and blocking behavior.

---

## 18. Severity Levels

Verification findings use:

```text
INFO
WARNING
ERROR
CRITICAL
```

Guidance:

- `INFO`: observation with no required action.
- `WARNING`: risk or drift that does not currently violate safety.
- `ERROR`: required contract or invariant failure.
- `CRITICAL`: potential corruption, privacy breach, or unsafe high-impact decision.

A verification result cannot be `PASS` when unresolved `ERROR` or `CRITICAL` findings exist.

---

## 19. Verification Record

A durable verification record contains:

- verification run ID,
- target identity and version,
- verifier version,
- profile,
- check results,
- findings,
- evidence references,
- timestamps,
- runtime environment metadata,
- final outcome,
- blocking reasons,
- correlation ID,
- actor identity.

Verification records are audit artifacts, not diagnostic authority.

---

## 20. Failure Codes

Recommended codes:

```text
DIAGNOSTIC_VERIFICATION_TARGET_MISSING
DIAGNOSTIC_VERIFICATION_VERSION_UNAVAILABLE
DIAGNOSTIC_STRUCTURE_INVALID
DIAGNOSTIC_SEMANTIC_COLLAPSE_DETECTED
DIAGNOSTIC_EVIDENCE_INTEGRITY_FAILED
DIAGNOSTIC_INFERENCE_INCONSISTENT
DIAGNOSTIC_CONFIDENCE_UNCALIBRATED
DIAGNOSTIC_REPLAY_MISMATCH
DIAGNOSTIC_PROJECTION_DRIFT
DIAGNOSTIC_CROSS_RUNTIME_CONTRACT_FAILED
DIAGNOSTIC_POLICY_VIOLATION
DIAGNOSTIC_PRIVACY_BOUNDARY_FAILED
DIAGNOSTIC_VERIFICATION_INCONCLUSIVE
```

---

## 21. Mandatory Scenario Matrix

The runtime must verify at least these scenarios:

1. Valid case with consistent evidence and alternatives.
2. Contradictory evidence remains visible.
3. Missing evidence produces `INCONCLUSIVE`.
4. Graph path is not promoted to causation.
5. Duplicate evidence is rejected or idempotently accepted.
6. Stale projection is blocked from high-impact consumption.
7. Full replay equals snapshot-assisted replay.
8. Missing model version blocks historical replay.
9. Remediation completion does not resolve debt automatically.
10. Root-cause ranking retains alternatives.
11. Human override retains rationale.
12. Unauthorized audience cannot access sensitive projection.
13. Projection language preserves uncertainty.
14. Cross-runtime skill identity mismatch fails.
15. Outcome evidence can disprove an earlier hypothesis without erasing history.

---

## 22. Non-Goals

Verification does not:

- prove learner-specific causation,
- guarantee educational effectiveness from structure alone,
- replace outcome studies,
- certify a model as unbiased without evaluation evidence,
- treat a passing build as diagnostic correctness,
- convert repository review into runtime or operational certification.

---

## 23. Acceptance Criteria

33H is complete when:

- verification layers are explicit,
- outcomes include blocked and inconclusive states,
- structural and semantic checks are separated,
- evidence lineage and contradiction checks exist,
- inference and confidence checks preserve uncertainty,
- replay and projection verification are deterministic,
- cross-runtime contracts are verified,
- privacy and policy checks can block use,
- findings are severity-classified,
- verification records remain auditable.

---

## 24. Runtime Laws

1. **Verified process is not proven cause.**
2. **Inconclusive is not pass.**
3. **Contradiction must remain visible.**
4. **Confidence requires calibration and explanation.**
5. **Replay equality is a required durability proof.**
6. **Projection freshness is part of correctness.**
7. **Policy failure can block technically valid output.**
8. **Cross-runtime identity mismatch must fail explicitly.**
9. **Verification records are audit evidence, not diagnostic authority.**
10. **Repository, runtime, and operational gates remain distinct.**
