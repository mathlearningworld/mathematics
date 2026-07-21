# 16J — Analytics & Governance

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16J — Analytics & Governance  
**Document Type:** Child Architecture / Production Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16B-LEARNER-READINESS-AND-COGNITIVE-DIAGNOSIS.md`, `docs/world/16C-COGNITIVE-MISSION-PLANNING-AND-GENERATION.md`, `docs/world/16D-WORLD-ACTIVITY-BINDING.md`, `docs/world/16E-MATHEMATICAL-EVIDENCE-AND-ASSESSMENT.md`, `docs/world/16F-HINT-AND-MENTOR-SUPPORT.md`, `docs/world/16G-MASTERY-AND-PROGRESSION.md`, `docs/world/16H-REMEDIATION.md`, `docs/world/16I-PARENT-AND-TEACHER-PROJECTION.md`  
**Downstream Consumers:** platform operations, curriculum governance, learning-quality review, product analytics, research exports, compliance review, incident response, model evaluation, executive reporting

---

## 1. Purpose

This guide defines how Math Learning World observes, measures, audits, explains, and governs the Learning Mission System without allowing analytics to become a hidden authority over learner truth.

The central doctrine is:

> Analytics may observe and evaluate the learning system, but must never silently redefine the learner, the curriculum, the evidence, or the meaning of mastery.

A conforming analytics and governance system must answer:

> What is happening, how confidently do we know it, which authoritative records support the conclusion, who is permitted to act, what intervention is justified, and how can every consequential decision be replayed and challenged?

Analytics is not a substitute for pedagogy. Governance is not a dashboard. Together they form the accountability layer that keeps the learning engine effective, fair, explainable, privacy-preserving, and operationally trustworthy.

---

## 2. Architectural Position

```text
Authoritative Learning Runtime Records
        ↓
Event Qualification and Lineage Resolution
        ↓
Privacy and Consent Enforcement
        ↓
Metric and Cohort Computation
        ↓
Quality / Fairness / Safety Evaluation
        ↓
Governance Rule Evaluation
        ↓
Finding, Alert, or Review Case
        ↓
Authorized Human Decision
        ↓
Policy / Content / Runtime Change Process
        ↓
Versioned Rollout and Monitoring
        ↓
Replayable Audit Record
```

Phase 16J is the authority for analytics contracts, metric semantics, data lineage, governance workflows, quality monitoring, fairness review, privacy-aware reporting, research boundaries, auditability, and controlled intervention.

It does not own curriculum truth, diagnosis truth, assessment conclusions, mastery declarations, remediation placement, parent or teacher interpretation, or direct mutation of learner runtime state.

---

## 3. Authority Boundary

### 3.1 Phase 16J owns

- analytics event contracts;
- metric definitions and versions;
- aggregation semantics;
- data lineage and provenance;
- cohort eligibility rules;
- privacy-preserving computation;
- retention and deletion policy enforcement;
- learning-system quality indicators;
- mission effectiveness analysis;
- assessment-quality monitoring;
- mastery-model monitoring;
- remediation effectiveness analysis;
- hint and mentor dependency analysis;
- projection-quality monitoring;
- fairness and bias review;
- anomaly detection;
- governance findings;
- governance review cases;
- policy versioning;
- decision records;
- change approval workflow;
- rollout monitoring;
- audit, replay, and traceability;
- research export boundaries;
- incident escalation;
- dashboard and report contracts.

### 3.2 Phase 16J does not own

- creating or redefining curriculum requirements;
- changing a diagnosis directly;
- inventing evidence;
- declaring mastery;
- placing a learner into remediation;
- ranking children for competitive display by default;
- treating correlation as causation;
- using a dashboard result as an execution command;
- silently changing metric meaning;
- exposing personally identifiable learner data without authority;
- allowing research use to override consent or product safety;
- hiding uncertainty, missingness, or data-quality limitations.

---

## 4. Governing Principles

### 4.1 Runtime truth remains upstream

Analytics consumes authoritative records. It does not replace them.

Every analytic output must identify:

- source record types;
- source versions;
- event-time window;
- processing-time window;
- metric definition version;
- inclusion and exclusion rules;
- confidence or data-quality status.

### 4.2 Metric meaning is a contract

A metric name alone is insufficient. Every metric must define:

- educational question;
- numerator;
- denominator;
- unit of analysis;
- time window;
- eligible population;
- excluded cases;
- minimum sample size;
- confidence treatment;
- privacy treatment;
- known limitations;
- owner and review cadence.

Changing any of these creates a new metric version.

### 4.3 No silent authority escalation

An analytic finding may:

- open a review;
- recommend investigation;
- pause a rollout under an approved safety rule;
- request content review;
- request model review;
- request data-quality repair.

It may not silently:

- downgrade mastery;
- change a learner path;
- remove access;
- assign remediation;
- notify a family of a conclusion;
- alter curriculum authority.

### 4.4 Evidence before intervention

Governance action must be proportional to evidence quality, impact, reversibility, and urgency.

### 4.5 Dignity and privacy are system properties

Privacy is not only field masking. The system must also prevent:

- re-identification through small cohorts;
- stigmatizing labels;
- permanent learner categorization;
- unnecessary cross-context joins;
- unrestricted raw-event access;
- misleading comparison across unequal learning conditions.

---

## 5. Analytics Domains

### 5.1 Learner-path analytics

Questions include:

- Are learners moving through prerequisites in coherent order?
- Where do progression holds cluster?
- Which concepts show unstable mastery?
- Where does transfer fail across contexts?
- How often does mastery regress after delay?

Learner-path analytics must not become public peer ranking.

### 5.2 Mission analytics

Questions include:

- Does a mission produce the intended evidence?
- Does it create excessive hint dependency?
- Does completion correlate with durable understanding?
- Which mission variants work for which readiness profiles?
- Where do learners abandon or repeat without progress?

Core mission metrics may include:

- start rate;
- completion rate;
- evidence sufficiency rate;
- independent evidence rate;
- transfer confirmation rate;
- retry rate;
- hint escalation rate;
- mentor escalation rate;
- time-to-valid-evidence;
- post-mission retention rate.

Completion rate must never be used alone as mission quality.

### 5.3 Assessment analytics

Questions include:

- Are evidence rules producing consistent conclusions?
- Are some representations over-rewarded?
- Are assistance levels correctly reflected?
- Are false-confidence patterns detectable?
- Are assessment outcomes stable across equivalent tasks?

### 5.4 Mastery analytics

Questions include:

- How often is provisional mastery confirmed?
- How often does declared mastery later regress?
- Which prerequisite rules are too strict or too weak?
- Are independent-evidence requirements functioning?
- Are mastery decisions consistent across comparable evidence sets?

### 5.5 Remediation analytics

Questions include:

- Does remediation address the diagnosed root cause?
- How often does representation switching help?
- Which scaffold sequences lead to independent success?
- How often do learners cycle repeatedly without reconstruction?
- When is mentor or teacher escalation necessary?

### 5.6 Support analytics

Hint and mentor analytics must distinguish:

- productive support;
- dependency;
- premature answer exposure;
- delayed escalation;
- support mismatch;
- successful fading of assistance.

### 5.7 Parent and teacher projection analytics

Projection analytics may evaluate:

- whether views are opened;
- whether actions are acknowledged;
- whether recommendations are followed;
- whether alerts are timely;
- whether confidence and freshness are understood;
- whether projections create unintended anxiety or punitive behavior.

It must not optimize engagement at the expense of truth or dignity.

---

## 6. Data Contracts

### 6.1 AnalyticsEvent

```text
AnalyticsEvent {
  eventId
  eventType
  occurredAt
  recordedAt
  tenantId?
  learnerId?
  actorId?
  sessionId?
  missionId?
  targetId?
  aggregateType
  aggregateId
  aggregateVersion
  sourceDocumentVersion?
  payloadSchemaVersion
  consentScope?
  privacyClass
  correlationId
  causationId?
}
```

Requirements:

- globally unique `eventId`;
- immutable event payload;
- explicit schema version;
- event time separate from processing time;
- correlation and causation when available;
- no undeclared personal fields;
- idempotent ingestion.

### 6.2 MetricDefinition

```text
MetricDefinition {
  metricKey
  version
  title
  educationalQuestion
  numeratorDefinition
  denominatorDefinition
  unitOfAnalysis
  eligibilityRule
  exclusionRule
  windowRule
  minimumSampleSize
  privacyRule
  confidenceRule
  owner
  status
  effectiveFrom
  supersedesVersion?
}
```

### 6.3 GovernanceFinding

```text
GovernanceFinding {
  findingId
  findingType
  severity
  scope
  metricReferences[]
  evidenceReferences[]
  confidence
  affectedVersions[]
  detectedAt
  status
  owner
  reviewDueAt?
  resolution?
}
```

### 6.4 GovernanceDecision

```text
GovernanceDecision {
  decisionId
  findingId
  decisionType
  authority
  rationale
  evidenceSnapshot
  approvedBy[]
  decidedAt
  effectiveAt?
  rollbackPlan?
  monitoringPlan?
}
```

---

## 7. Data Lineage and Provenance

Every reportable result must be traceable through:

```text
Dashboard Cell
    → Metric Result
    → Metric Definition Version
    → Aggregation Job Version
    → Qualified Event Set
    → Authoritative Runtime Records
```

Lineage must support:

- exact replay where retention permits;
- explanation of inclusion and exclusion;
- identification of late events;
- identification of corrected records;
- comparison across metric versions;
- invalidation when upstream data is withdrawn or corrected.

A derived dataset without lineage is not governance-grade evidence.

---

## 8. Data Quality

Data quality dimensions include:

- completeness;
- validity;
- timeliness;
- uniqueness;
- consistency;
- lineage coverage;
- consent coverage;
- schema conformity.

Every important metric must expose a data-quality status such as:

```text
HEALTHY
DEGRADED
INCOMPLETE
STALE
INVALID
SUPPRESSED
```

A dashboard must not present degraded data as normal without visible qualification.

---

## 9. Fairness and Bias Governance

Fairness review must consider differences by relevant, legally and ethically permitted dimensions, including where appropriate:

- age or grade band;
- language context;
- device quality;
- connectivity constraints;
- disability accommodation;
- school or home learning context;
- prior exposure;
- assistance availability;
- mission representation type.

The system must avoid simplistic parity rules. A disparity is a signal for investigation, not automatic proof of bias.

Fairness analysis must examine:

- access;
- opportunity;
- evidence capture;
- assessment conclusions;
- mastery decisions;
- remediation placement;
- progression delay;
- adult-facing alerts;
- support availability.

Small cohorts must be suppressed or combined to prevent re-identification.

---

## 10. Privacy, Consent, and Retention

### 10.1 Data minimization

Collect only data required for declared educational, operational, safety, or research purposes.

### 10.2 Purpose limitation

Data gathered for learning operations may not automatically be reused for unrelated commercial profiling.

### 10.3 Access tiers

Recommended access tiers:

```text
TIER_0 — public aggregate
TIER_1 — de-identified operational aggregate
TIER_2 — authorized educational cohort
TIER_3 — identified learner support
TIER_4 — restricted incident / compliance investigation
```

### 10.4 Retention

Retention policy must define:

- data class;
- retention period;
- legal or educational basis;
- archival rules;
- deletion behavior;
- derived-data invalidation;
- backup expiration;
- research-export handling.

### 10.5 Deletion and withdrawal

When data must be deleted or consent withdrawn, the platform must determine:

- which raw records are removed;
- which aggregates require recomputation;
- which exports require revocation or notification;
- which audit records must remain for lawful accountability;
- how remaining records are de-identified.

---

## 11. Governance Workflow

```text
Signal Detected
      ↓
Finding Created
      ↓
Severity and Scope Qualified
      ↓
Evidence Review
      ↓
Authority Assigned
      ↓
Decision
      ↓
Change Plan
      ↓
Approval
      ↓
Controlled Rollout
      ↓
Monitoring
      ↓
Close / Reopen / Roll Back
```

Governance findings may concern:

- content quality;
- mission effectiveness;
- assessment reliability;
- mastery calibration;
- remediation loops;
- unsafe support behavior;
- projection harm;
- fairness disparity;
- privacy breach;
- data-quality failure;
- operational anomaly.

---

## 12. Severity Model

```text
INFO      — observation; no action required
LOW       — limited weakness; routine review
MEDIUM    — meaningful quality or fairness risk
HIGH      — probable learner harm or major integrity issue
CRITICAL  — active safety, privacy, legal, or systemic integrity incident
```

Severity must consider:

- learner impact;
- affected population;
- duration;
- reversibility;
- evidence confidence;
- legal or privacy exposure;
- whether the issue is continuing.

---

## 13. Change Governance

A governance decision that changes behavior must identify:

- affected contract;
- affected versions;
- migration requirement;
- compatibility impact;
- rollout scope;
- success criteria;
- stop conditions;
- rollback plan;
- monitoring window;
- final approver.

No metric, policy, or learning-rule change may be silently overwritten.

Recommended lifecycle:

```text
DRAFT → REVIEW → APPROVED → ACTIVE → SUPERSEDED → RETIRED
```

Emergency policies may enter `ACTIVE` through an emergency authority path but must receive retrospective review.

---

## 14. Experimentation and Causal Claims

Experiments must define:

- educational hypothesis;
- eligible population;
- consent basis;
- assignment method;
- primary outcome;
- guardrail outcomes;
- minimum duration;
- stopping rule;
- harm monitoring;
- analysis plan;
- decision authority.

The platform must distinguish:

- descriptive observation;
- association;
- quasi-experimental inference;
- randomized evidence;
- expert judgment.

A correlation must not be communicated as proof of educational causation.

---

## 15. Research Boundary

Research exports require:

- approved purpose;
- minimum necessary fields;
- de-identification plan;
- cohort-size protection;
- retention limit;
- access logging;
- onward-sharing restriction;
- publication review where required;
- withdrawal process.

Research datasets must never become an ungoverned copy of production learner history.

---

## 16. Dashboards and Reporting

Dashboards are projections, not truth stores.

Every dashboard should display or make accessible:

- metric version;
- reporting window;
- last refresh;
- data-quality state;
- suppression state;
- filters applied;
- confidence or uncertainty where relevant;
- link to metric definition;
- accountable owner.

Recommended dashboard families:

- learning health;
- mission quality;
- assessment integrity;
- mastery and progression;
- remediation effectiveness;
- support dependency;
- parent and teacher communication;
- fairness and access;
- privacy and consent;
- platform operations.

---

## 17. Alerting

Alerts must be actionable and bounded.

An alert contract must define:

- triggering condition;
- evaluation cadence;
- minimum persistence;
- deduplication key;
- severity;
- audience;
- acknowledgement requirement;
- auto-resolution condition;
- escalation rule;
- suppression rule.

The platform must prevent alert storms, duplicate escalation, and repeated notification without new evidence.

---

## 18. Audit and Replay

Audit records must capture consequential operations including:

- metric-definition changes;
- policy changes;
- access to restricted data;
- research exports;
- governance decisions;
- emergency actions;
- rollout approvals;
- rollback actions;
- manual data corrections;
- suppression overrides.

Replay must support reconstructing:

- what data was available;
- which contract version applied;
- which policy version applied;
- which decision was made;
- who authorized it;
- what changed afterward.

---

## 19. Idempotency and Processing Semantics

Analytics ingestion must be idempotent by `eventId`.

Aggregation jobs must identify:

- job version;
- input watermark;
- output partition;
- retry number;
- completion state;
- checksum or equivalent integrity marker.

Late or corrected events must follow a declared recomputation policy.

Recommended job states:

```text
PLANNED
RUNNING
COMPLETED
COMPLETED_WITH_WARNINGS
FAILED
INVALIDATED
RECOMPUTING
```

---

## 20. Failure Taxonomy

Suggested failure codes:

```text
ANALYTICS_EVENT_SCHEMA_INVALID
ANALYTICS_EVENT_DUPLICATE
ANALYTICS_EVENT_CONSENT_MISSING
ANALYTICS_EVENT_PRIVACY_CLASS_INVALID
METRIC_DEFINITION_NOT_FOUND
METRIC_VERSION_CONFLICT
METRIC_SAMPLE_TOO_SMALL
METRIC_DATA_INCOMPLETE
METRIC_DATA_STALE
METRIC_LINEAGE_INCOMPLETE
AGGREGATION_JOB_FAILED
AGGREGATION_OUTPUT_INVALID
GOVERNANCE_AUTHORITY_MISSING
GOVERNANCE_DECISION_CONFLICT
POLICY_VERSION_NOT_ACTIVE
ROLLOUT_GUARDRAIL_BREACHED
RESEARCH_EXPORT_NOT_AUTHORIZED
RESTRICTED_DATA_ACCESS_DENIED
AUDIT_RECORD_WRITE_FAILED
REPLAY_INPUT_UNAVAILABLE
```

Failures affecting privacy, safety, or audit integrity must fail closed.

---

## 21. API Boundary

Representative APIs may include:

```text
POST   /api/v1/analytics/events
GET    /api/v1/analytics/metrics/:metricKey
GET    /api/v1/analytics/metrics/:metricKey/results
GET    /api/v1/analytics/dashboards/:dashboardKey
POST   /api/v1/governance/findings
GET    /api/v1/governance/findings/:findingId
POST   /api/v1/governance/findings/:findingId/decisions
POST   /api/v1/governance/policies
POST   /api/v1/governance/policies/:policyId/activate
POST   /api/v1/governance/rollouts
POST   /api/v1/governance/rollouts/:rolloutId/rollback
POST   /api/v1/research/exports
GET    /api/v1/audit/records
POST   /api/v1/audit/replay
```

API responses must preserve:

- contract version;
- authorization scope;
- privacy status;
- data-quality status;
- trace or correlation identifier;
- deterministic failure code.

---

## 22. Persistence Model

Representative durable records:

```text
analytics_events
analytics_event_rejections
metric_definitions
metric_results
metric_result_partitions
aggregation_jobs
data_quality_reports
governance_findings
governance_decisions
governance_policies
governance_policy_versions
rollout_plans
rollout_observations
fairness_reviews
privacy_reviews
research_export_requests
research_exports
audit_records
replay_requests
```

Immutable or append-oriented storage is preferred for events, policy versions, decisions, and audit records.

---

## 23. Validation Slice — Ratio Reasoning

The cross-phase validation slice remains ratio reasoning.

A complete 16J validation should demonstrate that the system can:

1. identify the authoritative ratio-reasoning target version;
2. trace diagnosis, mission, evidence, assessment, mastery, remediation, and projection records;
3. compute mission effectiveness without using completion alone;
4. distinguish assisted success from independent success;
5. detect repeated remediation without durable improvement;
6. compare representation variants with declared confidence;
7. suppress unsafe small-cohort reporting;
8. open a governance finding when a quality threshold is breached;
9. record a human decision with rationale and authority;
10. monitor a controlled change and support rollback;
11. replay the final report from versioned inputs;
12. prove that no analytic action directly changed learner mastery or diagnosis.

Expected evidence chain:

```text
Ratio Target vN
  → Qualified Learner Episodes
  → Versioned Metric Definition
  → Mission / Evidence / Mastery Results
  → Quality Finding
  → Governance Review
  → Approved Change
  → Controlled Rollout
  → Post-change Observation
  → Audit Replay
```

---

## 24. Verification Requirements

Repository verification should prove:

- authority boundaries are explicit;
- upstream contracts remain authoritative;
- metric semantics are versioned;
- privacy and consent are enforced;
- small cohorts are protected;
- lineage reaches authoritative records;
- governance decisions require authority;
- analytics cannot mutate learner truth directly;
- failures are deterministic;
- audit and replay contracts exist;
- the ratio-reasoning validation slice is complete.

Runtime verification should prove:

- idempotent event ingestion;
- deterministic aggregation;
- late-event handling;
- privacy suppression;
- access control;
- metric-version coexistence;
- finding and decision lifecycle;
- rollout guardrails;
- rollback behavior;
- replay from retained inputs.

Operational verification should prove the full path:

```text
Learning Runtime
  → Analytics Event
  → Qualified Dataset
  → Metric Result
  → Governance Finding
  → Human Decision
  → Controlled Change
  → Monitoring
  → Audit Replay
```

---

## 25. Completion Criteria

Phase 16J is complete when:

- analytics and governance authority is explicit;
- metric definitions are durable and versioned;
- lineage and replay are first-class contracts;
- privacy, consent, retention, and suppression are enforced;
- quality, fairness, and safety monitoring are defined;
- governance findings and decisions are reviewable;
- controlled rollout and rollback are governed;
- research use is bounded;
- dashboards expose freshness and limitations;
- analytics cannot silently alter learner runtime state;
- failure and API contracts are defined;
- the ratio-reasoning validation slice closes the complete 16A–16J chain.

---

## 26. Final Architecture Statement

With Phase 16J, the Learning Mission System forms a complete governed loop:

```text
Learning Target
      ↓
Diagnosis
      ↓
Mission Planning
      ↓
World Activity
      ↓
Evidence and Assessment
      ↓
Hint and Mentor Support
      ↓
Mastery and Progression
      ↓
Remediation
      ↓
Parent and Teacher Projection
      ↓
Analytics and Governance
      ↓
Versioned System Improvement
```

The governing rule is final:

> The platform may learn about its own performance, but every improvement must remain traceable, reviewable, reversible, privacy-preserving, and subordinate to authoritative educational truth.
