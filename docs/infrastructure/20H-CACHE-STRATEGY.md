# 20H — Cache Strategy

## 1. Purpose

This document defines how caching may be used in Math Learning World without weakening correctness, authorization, tenant isolation, or domain consistency.

Caching is an optimization. It is never the authoritative source of business truth.

## 2. Core Principle

> Correctness comes from authoritative state; cache exists only to reduce repeated work.

Every cache must have a clear owner, key model, expiry policy, invalidation rule, and fallback behavior.

## 3. Permitted Uses

Caching is appropriate for data that is:

- expensive to compute or retrieve;
- read frequently;
- safe to serve within a bounded staleness window;
- reconstructable from an authoritative source;
- not part of an active transaction decision unless explicitly designed.

Examples:

- public curriculum metadata;
- skill dependency projections;
- generated read models;
- feature configuration snapshots;
- short-lived provider responses;
- rate-limit counters;
- idempotency coordination where durability requirements are satisfied elsewhere.

## 4. Prohibited Uses

Do not use cache as the sole authority for:

- mastery state;
- credit balances;
- payments;
- permissions;
- parent-child relationships;
- durable idempotency records;
- transaction outcomes;
- irreversible workflow state.

## 5. Cache Ownership

Each cache must be owned by one module or infrastructure capability.

The owner defines:

- key format;
- value schema;
- TTL;
- invalidation events;
- fallback behavior;
- observability;
- migration strategy.

Shared caches without ownership become hidden coupling and are prohibited.

## 6. Cache Layers

Possible layers include:

```text
Request-local cache
Process-local cache
Distributed cache
CDN or edge cache
Database-native cache
```

The selected layer must match consistency, scale, and operational needs.

## 7. Request-Local Cache

Request-local caching may deduplicate repeated lookups within one request or application operation.

It must not escape the request boundary and requires no distributed invalidation.

## 8. Process-Local Cache

Process-local cache is suitable for small, immutable, or slowly changing reference data.

Risks include:

- inconsistent values across instances;
- memory pressure;
- stale values after deployment;
- lack of centralized invalidation.

Use only when those risks are acceptable.

## 9. Distributed Cache

A distributed cache may be used when multiple runtime instances require shared cached state.

Infrastructure adapters must isolate client libraries and provider-specific commands from application code.

## 10. Key Design

Cache keys must be deterministic, namespaced, and tenant-safe.

Recommended pattern:

```text
<system>:<environment>:<module>:<tenant>:<resource>:<identity>:<version>
```

Never omit tenant or authorization scope when cached data differs by tenant or actor.

## 11. Value Design

Cached values should contain:

- explicit schema version;
- generatedAt timestamp where useful;
- bounded payload size;
- only necessary fields;
- no secrets;
- no raw provider credentials.

Values must be treated as untrusted input when deserialized.

## 12. Cache-Aside Pattern

Default read strategy:

```text
Read cache
  -> hit: validate and return
  -> miss: load authoritative source
  -> populate cache
  -> return result
```

If the cache is unavailable, the system should normally fall back to the authoritative source unless load protection requires controlled degradation.

## 13. Write Strategy

Preferred write strategy for business state:

```text
Commit authoritative transaction
  -> publish or record invalidation intent
  -> invalidate or refresh cache
```

Cache mutation must not occur before the authoritative transaction is known to have committed.

## 14. Invalidation

Allowed invalidation approaches:

- TTL expiration;
- explicit delete after commit;
- event-driven invalidation;
- versioned keys;
- background refresh.

Every cache must define the consequence of delayed or failed invalidation.

## 15. TTL Policy

TTL must be based on business tolerance, not convenience.

Classify cached data:

```text
IMMUTABLE
SLOW_CHANGING
BOUNDED_STALE
NEAR_REAL_TIME
```

Short TTL does not automatically make unsafe data safe to cache.

## 16. Stampede Protection

High-demand keys should use one or more of:

- single-flight request coalescing;
- distributed locks with bounded expiry;
- stale-while-revalidate;
- jittered TTL;
- background prewarming;
- rate-limited regeneration.

Locks must never become durable business authority.

## 17. Negative Caching

Missing results may be cached briefly to reduce repeated expensive misses.

Negative cache entries must:

- have short TTL;
- distinguish not-found from provider failure;
- be invalidated when the resource is created;
- preserve tenant and authorization scope.

## 18. Authorization Safety

Authorization-sensitive responses must not be reused across actors unless the value is genuinely identical and the key includes every relevant scope.

Where uncertainty exists, cache underlying public/reference data and re-evaluate authorization on every request.

## 19. Consistency Model

Each cache must declare one consistency expectation:

```text
BEST_EFFORT
BOUNDED_STALENESS
INVALIDATE_AFTER_COMMIT
VERSION_SYNCHRONIZED
```

The declaration must match the user-visible and operational consequence of stale reads.

## 20. Failure Behavior

Cache failures must not be confused with authoritative absence.

Stable error classification may include:

```text
CACHE_UNAVAILABLE
CACHE_TIMEOUT
CACHE_VALUE_INVALID
CACHE_WRITE_FAILED
```

Reads should fail open or fail closed according to the specific capability, with that decision documented.

## 21. Resilience

Cache clients require:

- connection timeouts;
- command timeouts;
- bounded retries;
- circuit breaking where useful;
- pool limits;
- payload limits;
- graceful shutdown.

Retry storms against an unhealthy cache must be prevented.

## 22. Observability

Measure:

- hit and miss ratio;
- latency;
- error rate;
- eviction count;
- memory usage;
- key cardinality;
- payload size;
- regeneration time;
- stale-serving count;
- invalidation lag.

Metrics should be segmented by cache owner and operation rather than raw sensitive keys.

## 23. Security

Caches must not contain:

- plaintext passwords;
- permanent provider secrets;
- unrestricted signed URLs;
- unnecessary personal data;
- cross-tenant combined payloads without strict design.

Encryption in transit and provider access controls are required for distributed caches.

## 24. Development and Testing

Development may use an in-memory adapter where behavior is compatible with the production port.

Required tests include:

- key construction tests;
- tenant isolation tests;
- hit/miss behavior;
- TTL behavior;
- invalidation after commit;
- cache outage fallback;
- corrupted value handling;
- stampede protection;
- authorization safety.

## 25. Anti-Patterns

Do not:

- add cache before measuring a problem;
- cache domain aggregates and mutate them as shared state;
- treat cache miss as proof of absence;
- clear the entire cache for routine updates;
- create unbounded keys;
- use wildcard scans in hot paths;
- depend on cache for durable workflow progress;
- hide stale-data behavior from product decisions.

## 26. Adoption Checklist

Before adding a cache, document:

- measured bottleneck;
- authoritative source;
- cache owner;
- key and value schema;
- tenant scope;
- TTL;
- invalidation mechanism;
- outage behavior;
- staleness tolerance;
- observability plan;
- removal strategy.

## 27. Completion Criteria

Cache infrastructure is complete when:

- every cache has explicit ownership;
- keys are namespaced and tenant-safe;
- authoritative fallback exists;
- invalidation follows transaction commit;
- consistency and staleness are declared;
- failure behavior is tested;
- metrics expose effectiveness and risk;
- no durable business truth exists only in cache.
