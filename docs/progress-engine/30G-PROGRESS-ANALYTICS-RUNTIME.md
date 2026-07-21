# 30G — Progress Analytics Runtime

## 1. Purpose

The Progress Analytics Runtime converts verified progress timelines and aggregates into explainable analytical observations without inventing new learning truth.

Analytics exists to answer questions such as:

- What is changing over time?
- Where is progress stable, accelerating, slowing, regressing, or uncertain?
- Which dimensions are contributing to an observed outcome?
- Which learners, skills, missions, or curriculum areas require attention?
- What evidence and policies support an analytical statement?

Analytics is not an assessment authority, mastery authority, recommendation authority, or intervention authority.

## 2. Runtime Boundary

Authorized flow:

```text
Verified Progress Timeline
        +
Verified Progress Aggregates
        +
Analytics Policy Version
        ↓
Progress Analytics Runtime
        ↓
Explainable Analytical Observations
        ↓
Analytics Projection / Alert Candidate / Research Export
```

Forbidden flow:

```text
Raw activity → mastery claim
Gameplay completion → understanding claim
High velocity → high quality claim
Low activity → low ability claim
Analytics observation → automatic intervention
```

## 3. Core Laws

1. Analytics never strengthens source meaning.
2. Correlation is not causation.
3. Absence of data is not absence of progress.
4. A trend is not a diagnosis.
5. A cohort pattern is not an individual truth.
6. A predicted risk is not a confirmed failure.
7. Analytical confidence must be explicit.
8. Every published observation must be reproducible from versioned inputs.
9. Sensitive segmentation must obey privacy and minimum-group policies.
10. Analytics cannot mutate the progress ledger or source aggregates.

## 4. Analytics Subjects

Supported analytical subjects include:

- learner skill progress
- learner concept progress
- learner objective progress
- learner mission progress
- learner curriculum progress
- learner learning-path progress
- subject progress
- grade-band progress
- world-region progress
- cohort progress
- instructional program progress

Every subject must carry tenant, learner or cohort scope, curriculum version, policy version, source sequence range, and freshness.

## 5. Analytical Dimensions

Analytics may operate independently across:

- exposure
- practice volume
- accuracy
- reasoning quality
- independence
- retention
- transfer
- consistency
- breadth
- depth
- curriculum coverage
- mission advancement
- recovery after regression
- evidence diversity
- support dependence

A single composite score may be produced only as a labeled convenience projection. It must not replace the underlying dimensions.

## 6. Observation Families

### 6.1 Trend Observation

States:

```text
IMPROVING
STABLE
DECLINING
VOLATILE
INSUFFICIENT_DATA
CONFLICTED
```

Required fields:

- subject identity
- dimension
- comparison windows
- baseline value
- current value
- confidence
- freshness
- source aggregate versions
- policy version
- limitations

### 6.2 Velocity Observation

Velocity describes rate of change only. It must not be presented as learning quality.

```text
ACCELERATING
STEADY
SLOWING
REVERSING
UNDETERMINED
```

### 6.3 Regression Observation

Regression may be indicated when prior verified performance weakens under comparable conditions.

Regression must distinguish:

- temporary fluctuation
- evidence conflict
- support removal effect
- retention decay
- curriculum or policy migration effect
- confirmed sustained regression

### 6.4 Recovery Observation

Recovery tracks restoration after regression and may be:

```text
NOT_STARTED
PARTIAL
SUSTAINED
FRAGILE
COMPLETE_BY_POLICY
```

### 6.5 Coverage Observation

Coverage describes encountered or completed scope. It must never be labeled mastery unless Assessment Engine provides an authorized mastery claim.

### 6.6 Risk Candidate

Risk candidates are operational signals, not learner judgments.

Examples:

- repeated unresolved prerequisite weakness
- declining retention confidence
- prolonged mission stagnation
- high supported success with low independent success
- narrow evidence diversity
- stale progress state

Risk candidates require human- or policy-authorized downstream handling.

## 7. Windowing and Comparability

Every analysis window must declare:

- time basis: occurred, effective, or committed time
- start and end boundaries
- included timeline sequence range
- policy version
- curriculum version
- minimum evidence threshold
- support-context compatibility
- difficulty compatibility

Comparisons must be rejected or limited when conditions are materially incomparable.

## 8. Confidence Model

Confidence is derived from, but not limited to:

- source verification status
- evidence volume
- evidence diversity
- recency
- consistency
- comparability
- conflict level
- aggregate freshness
- policy stability

Suggested states:

```text
HIGH
MODERATE
LOW
INSUFFICIENT
CONFLICTED
```

Confidence must never be hidden from consumers that can make consequential decisions.

## 9. Explainability Contract

Every analytical observation must expose an explanation graph containing:

- source timeline ranges
- source aggregate versions
- included dimensions
- excluded inputs and reasons
- transformation steps
- thresholds
- weighting policy
- confidence derivation
- known limitations
- publication decision

An observation without reproducible lineage is not publishable.

## 10. Cohort Analytics

Cohort analytics requires:

- explicit cohort definition
- minimum group size
- de-identification policy
- suppression of small cells
- tenant-safe isolation
- no inference from cohort result to individual learner truth

Forbidden:

```text
Cohort underperformance → learner underperformance
Cohort improvement → every learner improved
```

## 11. Privacy and Fairness

Analytics must detect and prevent:

- cross-tenant leakage
- unauthorized learner-level exposure
- re-identification through small cohorts
- protected-attribute proxy use without authority
- unsupported ranking
- punitive use of low-confidence observations

Fairness review metadata must be versioned when analytics affects product behavior.

## 12. Publication Decisions

```text
PUBLISH
PUBLISH_WITH_LIMITATIONS
HOLD_FOR_REVIEW
SUPPRESS_FOR_PRIVACY
QUARANTINE
REJECT
```

Publication is bound to the exact input versions and analytics policy version.

## 13. Failure Codes

Representative failures:

```text
ANALYTICS_SOURCE_UNVERIFIED
ANALYTICS_SCOPE_MISMATCH
ANALYTICS_WINDOW_INVALID
ANALYTICS_COMPARABILITY_FAILED
ANALYTICS_INSUFFICIENT_DATA
ANALYTICS_PRIVACY_THRESHOLD_FAILED
ANALYTICS_CROSS_TENANT_SCOPE
ANALYTICS_POLICY_NOT_FOUND
ANALYTICS_POLICY_INCOMPATIBLE
ANALYTICS_LINEAGE_INCOMPLETE
ANALYTICS_REPRODUCTION_DIVERGENCE
ANALYTICS_MEANING_ESCALATION
```

## 14. Persistence Records

Recommended records:

- ProgressAnalyticsRunRecord
- ProgressAnalyticsObservationRecord
- ProgressAnalyticsExplanationRecord
- ProgressAnalyticsPublicationRecord
- ProgressAnalyticsSuppressionRecord
- ProgressAnalyticsPolicyReference
- ProgressAnalyticsReproductionRecord

Analytical outputs are derived records and never replace timeline authority.

## 15. Verification Gates

Minimum gates:

1. identity and tenant scope
2. source verification
3. source version binding
4. window validity
5. comparability
6. semantic non-escalation
7. confidence derivation
8. privacy threshold
9. lineage completeness
10. deterministic reproduction
11. publication authorization

## 16. Acceptance Criteria

30G is complete when:

- analytics consumes only authorized verified progress inputs;
- observations are multidimensional and explainable;
- trend, velocity, regression, recovery, coverage, and risk semantics are distinct;
- cohort privacy and minimum-size rules are explicit;
- confidence and limitations are always visible;
- analytics cannot create mastery, progress, recommendation, or intervention truth;
- every published observation is reproducible from versioned inputs.