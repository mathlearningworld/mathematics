# 37H — Mastery Verification Runtime

## Purpose

Mastery Verification Runtime defines how the system proves that mastery behavior is correct across repository structure, executable runtime, persistence, integrations, operational use, and future evolution.

Mastery is an educational authority. Verification must therefore test more than code execution. It must prove that evidence, evaluation, decision, persistence, replay, projection, and cross-runtime effects preserve their boundaries.

> A green build does not prove a correct mastery decision.

---

## Verification Objectives

The verification system must prove:

- only authorized runtime components can change mastery authority;
- evidence cannot silently become a decision;
- evaluation is deterministic for frozen inputs;
- decisions obey transition and policy contracts;
- adaptation cannot bypass decision authority;
- persistence is atomic and replayable;
- projections remain derived and non-authoritative;
- cross-runtime signals preserve identity and version context;
- accessibility and fairness policies are respected;
- evolution does not reinterpret active mastery silently.

---

## Verification Domains

Verification is organized into ten domains:

1. Contract Verification
2. Authority Verification
3. Evidence Verification
4. Evaluation Verification
5. Decision Verification
6. Adaptation Verification
7. Persistence and Replay Verification
8. Projection Verification
9. Safety, Fairness, and Privacy Verification
10. Cross-Runtime Verification

No single domain can substitute for the others.

---

## Gate Model

### Gate A — Repository Gate

Proves static architecture and repository conformance.

Evidence includes:

- required documents and public contracts;
- module ownership and dependency direction;
- schema definitions;
- verifier wiring;
- transition matrices;
- event and failure-code catalogs;
- snapshot or contract fixtures;
- absence of forbidden imports or shared workflow ownership.

Repository PASS means the intended architecture is represented in source control.

It does not prove executable behavior.

### Gate B — Runtime Gate

Proves executable mastery behavior in an isolated environment.

Evidence includes:

- build and typecheck;
- unit tests;
- deterministic evaluation tests;
- state-transition tests;
- idempotency tests;
- policy gate tests;
- serialization and schema tests;
- replay hash tests.

### Gate C — Integration Gate

Proves contracts with neighboring runtimes.

Evidence includes:

- evidence intake from Assessment and Learning Session runtimes;
- curriculum and skill graph version resolution;
- Journey and Recommendation signal consumption;
- Progress projection updates;
- inbox/outbox delivery;
- tenant and learner identity preservation.

### Gate D — Operational Gate

Proves the complete running flow:

```text
Learner Activity
→ Evidence
→ Frozen Evidence Bundle
→ Evaluation
→ Decision
→ Durable Mastery Event
→ Projection
→ Journey / Recommendation / Progress Response
→ User-visible explanation
```

Operational PASS requires runtime evidence from a real environment.

### Gate E — Evolution Gate

Proves compatibility during rollout, migration, replay, rollback, and mixed-version operation.

---

## Required Separation of Claims

The following claims must remain separate:

```text
Repository PASS ≠ Runtime PASS
Runtime PASS ≠ Integration PASS
Integration PASS ≠ Operational PASS
Operational PASS ≠ Educational outcome proof
```

A verifier may prove implementation behavior. It cannot by itself prove that a learner truly understands mathematics in every context.

---

## Contract Verification

Contract verification must cover:

- command schemas;
- event schemas;
- evaluation request and result schemas;
- decision command and result schemas;
- evidence bundle references;
- projection contracts;
- failure contracts;
- version vectors;
- idempotency fields;
- tenant and learner identity fields.

Tests must reject:

- missing version fields;
- unknown status values;
- malformed evidence references;
- cross-tenant identity combinations;
- candidate decisions without evaluation lineage;
- authoritative events without decision IDs.

---

## Authority Verification

Authority tests must prove:

- Evidence Runtime cannot confirm mastery;
- Evaluation Runtime cannot persist a decision directly;
- Adaptive Runtime can only propose reevaluation or review;
- Projection Runtime cannot mutate aggregate state;
- Persistence adapters cannot invent transitions;
- human overrides require explicit governed authority;
- downstream runtimes consume published mastery facts but do not rewrite them.

Forbidden-path tests should intentionally attempt each boundary violation and expect stable rejection codes.

---

## Evidence Verification

Evidence tests cover:

- source registration;
- trust classification;
- source-version preservation;
- independent evidence grouping;
- duplicate detection;
- freshness calculation;
- withdrawal and correction handling;
- contradiction representation;
- accessibility accommodation context;
- frozen bundle hashing;
- bundle immutability.

Critical property:

> Repeating the same dependent evidence must not inflate independence, coverage, or confidence.

---

## Evaluation Verification

Evaluation tests must prove deterministic behavior from frozen inputs.

For an identical set of:

- evidence bundle;
- policy version;
- curriculum version;
- skill graph version;
- evaluation algorithm version;
- accessibility context;

…the result hash must be identical.

Evaluation tests must cover:

- conceptual coverage;
- procedural fluency;
- application;
- transfer;
- retention;
- contradiction severity;
- candidate level;
- confidence band;
- human-review trigger;
- insufficient-evidence outcome.

Property-based tests should vary evidence ordering and prove order-independent normalization.

---

## Decision Verification

Decision tests must verify the complete transition matrix.

Representative states:

```text
UNASSESSED
EVIDENCE_ACCUMULATING
EVALUATION_READY
UNDER_REVIEW
MASTERED
AT_RISK
REVOKED
SUPERSEDED
```

Tests must cover:

- allowed transitions;
- forbidden transitions;
- stale evaluation rejection;
- stale aggregate version rejection;
- stale decision version rejection;
- duplicate command handling;
- governed override requirements;
- appeal lifecycle;
- revocation rationale;
- supersession lineage;
- downstream event publication.

A decision test is incomplete if it checks only the final status and not the emitted lineage and version changes.

---

## Adaptive Verification

Adaptive tests must prove that new signals produce safe proposals rather than direct mutations.

Signals include:

- new evidence;
- corrected or withdrawn evidence;
- retention decay;
- contradiction increase;
- prerequisite change;
- curriculum change;
- skill graph change;
- accessibility-context change;
- teacher review request;
- learner appeal.

Tests must verify:

- deduplication of adaptation signals;
- proposal idempotency;
- impact analysis;
- active-session protection;
- policy envelope;
- escalation to human review;
- no rewriting of historical evidence.

---

## Persistence Verification

Persistence tests must prove transactional consistency across:

- aggregate update;
- event append;
- command receipt;
- decision lineage;
- evidence bundle reference;
- outbox message.

Fault injection should fail after each transaction step and prove that no partial authority is visible.

Concurrency tests must attempt competing decisions against the same expected version and prove only one can commit.

---

## Replay Verification

Replay tests must cover:

- empty stream;
- complete stream;
- snapshot plus tail events;
- invalid snapshot fallback;
- event version gap;
- duplicate event;
- conflicting event hash;
- event upcasting;
- historical policy context;
- audit replay;
- projection replay;
- shadow replay.

Replay must not publish notifications, invoke external assessment, or mutate evidence.

The replayed aggregate hash must match the persisted authority hash.

---

## Projection Verification

Projection tests must verify:

- event ordering by aggregate version;
- duplicate-event idempotency;
- stale marker behavior;
- learner-safe explanation;
- parent view redaction;
- teacher attention queue;
- audit view lineage completeness;
- rebuild from event history;
- reconciliation with aggregate authority;
- notification deduplication.

Projection lag must not be represented as current data.

Projection failure must not roll back an accepted mastery decision.

---

## Cross-Runtime Verification

The Mastery Runtime integrates with:

- Assessment Engine;
- Learning Session Runtime;
- Learning Journey Runtime;
- Curriculum Runtime;
- Skill Graph Runtime;
- Progress Engine;
- Recommendation Engine;
- Intervention Runtime.

Contract tests must prove:

- identity propagation;
- tenant propagation;
- source event versioning;
- curriculum and graph version pinning;
- no circular write authority;
- idempotent message consumption;
- explicit stale-input handling;
- downstream compatibility.

---

## Safety and Fairness Verification

Tests must ensure:

- accessibility accommodations do not lower conceptual truth while allowing equivalent expression;
- language complexity does not falsely become mathematical weakness;
- protected attributes are not used as unjustified mastery predictors;
- confidence is not inflated by activity volume alone;
- low evidence coverage is visible;
- contradictory evidence cannot be silently discarded;
- teacher overrides are attributable and reviewable;
- learner appeals are preserved and traceable.

Bias and fairness verification requires curated scenario suites, not only generic unit tests.

---

## Privacy Verification

Privacy verification covers:

- tenant isolation;
- learner authorization;
- role-based projection redaction;
- audit access;
- evidence-content minimization;
- retention policy;
- governed deletion and redaction;
- metrics without protected content;
- export traceability.

Cross-tenant access tests are mandatory.

---

## Golden Scenarios

The verification repository should maintain stable golden scenarios such as:

### Scenario 1 — Strong Independent Evidence

Multiple independent evidence groups across conceptual, procedural, application, and transfer dimensions produce a high-confidence mastery candidate and authorized confirmation.

### Scenario 2 — High Score, Low Coverage

A single high score with narrow coverage must not become full mastery.

### Scenario 3 — Repeated Dependent Attempts

Many retries of the same task do not inflate source independence.

### Scenario 4 — Contradictory Transfer Evidence

Procedural success with repeated transfer failure produces review or partial status, not silent mastery.

### Scenario 5 — Retention Decay

Previously confirmed mastery with later retention evidence may move to `AT_RISK` through an authorized decision.

### Scenario 6 — Evidence Withdrawal

Withdrawal of a critical evidence item triggers reevaluation; history remains intact.

### Scenario 7 — Concurrent Decisions

Two commands race; one commits and the other receives a version conflict.

### Scenario 8 — Replay Recovery

A process crashes after commit but before response; retry returns the original result without duplicate events.

### Scenario 9 — Curriculum Evolution

A curriculum version changes while active mastery remains historically interpretable and explicitly migrated only under policy.

### Scenario 10 — Accessibility Equivalent Expression

Alternative input modality demonstrates equivalent mathematical understanding and is handled under explicit accommodation context.

---

## Mutation and Negative Testing

Verification must include tests that deliberately corrupt assumptions:

- remove tenant predicates;
- bypass expected version;
- alter evidence bundle hash;
- duplicate outbox delivery;
- reorder events;
- change policy version during evaluation;
- mutate projection as authority;
- reuse command ID with another payload;
- omit contradiction evidence;
- replay with a missing upcaster.

The suite passes only when these mutations are detected.

---

## Verification Evidence Package

Each delivery milestone should capture:

```text
VerificationEvidence
├── repositoryCommit
├── changedPaths
├── contractVersion
├── verifierVersions
├── gateResults
├── testCounts
├── goldenScenarioResults
├── replayHashes
├── migrationResults?
├── operationalEvidence?
├── knownLimitations
└── reviewerDecision
```

Evidence must distinguish automated verification from human operational validation.

---

## Failure Reporting

A failed verification report must include:

- failed gate;
- exact contract or invariant;
- observed value;
- expected value;
- reproduction command;
- affected mastery surface;
- whether authority may be compromised;
- recovery or quarantine recommendation.

“Tests failed” alone is insufficient.

---

## Completion Criteria

37H is complete when:

- every mastery authority boundary has positive and negative tests;
- evaluation determinism is proven;
- decision transitions are exhaustively checked;
- persistence fault injection proves atomicity;
- replay equivalence is checked by hash;
- projections rebuild without changing authority;
- cross-runtime contracts preserve identity and version context;
- fairness, accessibility, privacy, and appeals have explicit scenarios;
- gate claims remain separate;
- operational completion requires real runtime evidence.

---

## Permanent Rules

1. Build success is not mastery correctness.
2. Evidence quantity is not evidence independence.
3. Evaluation determinism must be reproducible.
4. Decision authority must be tested through forbidden paths.
5. Persistence atomicity requires fault injection.
6. Replay must prove equivalent state and no side effects.
7. Projection correctness cannot authorize mastery.
8. Repository, runtime, integration, and operational gates are distinct.
9. Accessibility and fairness are verification domains, not optional polish.
10. Educational outcome claims require evidence beyond software verification.