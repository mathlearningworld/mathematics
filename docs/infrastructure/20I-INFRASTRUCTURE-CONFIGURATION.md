# 20I — Infrastructure Configuration

## 1. Purpose

This document defines how infrastructure configuration is declared, loaded, validated, protected, and evolved in Math Learning World.

Configuration connects deployable software to its environment. It must be explicit, validated at startup, and separated from domain behavior.

## 2. Core Principle

> Configuration is an external contract, not scattered runtime guesswork.

The application must fail clearly when required configuration is missing or invalid.

## 3. Configuration Categories

Configuration should be classified into:

```text
APPLICATION
DATABASE
MESSAGING
CACHE
OBJECT_STORAGE
EXTERNAL_SERVICE
SECURITY
OBSERVABILITY
RUNTIME_LIMIT
FEATURE_POLICY
```

Business rules that require auditability and runtime administration should normally live in durable application data rather than deployment environment variables.

## 4. Source Precedence

A deployment must define deterministic precedence, for example:

```text
safe code defaults
  < environment-specific file for local use
  < process environment
  < secret manager injection
  < explicit startup arguments where supported
```

Production must not depend on untracked local files.

## 5. Central Configuration Module

Infrastructure configuration must be loaded through a single composition boundary.

Recommended shape:

```ts
interface InfrastructureConfig {
  environment: RuntimeEnvironment;
  database: DatabaseConfig;
  objectStorage: ObjectStorageConfig;
  messaging: MessagingConfig;
  cache: CacheConfig;
  externalServices: ExternalServicesConfig;
  observability: ObservabilityConfig;
  limits: RuntimeLimits;
}
```

Modules consume typed configuration objects, not raw `process.env` access.

## 6. Startup Validation

Validation must occur before the server begins accepting traffic.

Validation includes:

- required value presence;
- correct type and format;
- allowed enum values;
- URL and hostname validity;
- numeric bounds;
- timeout and pool constraints;
- mutually exclusive settings;
- environment-specific restrictions.

Invalid configuration must produce actionable errors without exposing secret values.

## 7. Environment Model

Supported runtime environments should be explicit, such as:

```text
development
 test
 staging
 production
```

Environment names must not implicitly change business behavior. They may select infrastructure adapters, logging defaults, and operational safeguards.

## 8. Secrets

Secrets include:

- database credentials;
- API keys;
- signing keys;
- encryption keys;
- webhook secrets;
- object-storage credentials;
- message-broker credentials.

Secrets must:

- never be committed to Git;
- never be printed in logs;
- be injected through approved secret channels;
- be scoped to the minimum required permissions;
- support rotation;
- be revoked when compromised.

## 9. `.env` Policy

`.env` files are acceptable for local development only.

Repository requirements:

- commit `.env.example` with names and safe examples;
- ignore real `.env` files;
- document required variables;
- never include production credentials;
- avoid values that resemble real secrets.

## 10. Typed Parsing

Every value must be parsed once into its target type.

Examples:

- strings trimmed and normalized;
- integers parsed with bounds;
- booleans accept explicit forms only;
- durations converted to milliseconds;
- comma-separated lists converted to arrays;
- URLs parsed with a URL parser.

Do not repeatedly parse environment strings throughout the codebase.

## 11. Configuration Naming

Names should be stable and scoped:

```text
DATABASE_URL
DATABASE_POOL_MAX
OBJECT_STORAGE_ENDPOINT
OBJECT_STORAGE_BUCKET
CACHE_URL
MESSAGE_BROKER_URL
EXTERNAL_AI_TIMEOUT_MS
LOG_LEVEL
```

Avoid vague names such as `URL`, `TOKEN`, or `TIMEOUT`.

## 12. Defaults

Defaults are allowed only when safe and unsurprising.

Production-sensitive settings should require explicit values when an accidental default could cause:

- data loss;
- insecure access;
- cross-environment connection;
- excessive cost;
- uncontrolled retries;
- public exposure.

## 13. Environment-Specific Guardrails

Production startup should reject unsafe combinations, including:

- debug mode enabled;
- wildcard trusted origins without approval;
- local filesystem storage for durable production assets;
- disabled TLS where required;
- placeholder secrets;
- destructive migration flags;
- unrestricted provider credentials.

## 14. Connection Configuration

Database, cache, broker, and external clients must define:

- endpoint;
- credentials reference;
- connection timeout;
- operation timeout;
- pool size;
- retry policy;
- TLS policy;
- shutdown behavior.

Timeouts and retries must be bounded.

## 15. Feature Flags and Product Policy

Deployment configuration may enable technical rollout controls, but durable product policy should not be hidden in environment variables.

Feature flags require:

- owner;
- purpose;
- default;
- scope;
- expiry or review date;
- fallback behavior;
- observability.

Permanent flags must be converted into explicit product configuration or removed.

## 16. Dynamic Configuration

Configuration loaded at startup is immutable for the process unless a capability is explicitly designed for safe dynamic refresh.

Dynamic configuration requires:

- versioning;
- validation;
- atomic replacement;
- audit trail;
- failure fallback;
- consistency expectations across instances.

## 17. Configuration and Dependency Injection

The composition root creates infrastructure adapters using validated configuration and injects them into application services.

```text
Raw external values
  -> parse and validate
  -> typed config
  -> construct adapters
  -> wire application
  -> start runtime
```

Domain entities must not receive infrastructure configuration.

## 18. Error Reporting

Configuration errors should report:

- configuration key;
- expected form;
- reason for failure;
- safe remediation guidance.

They must not report secret content or connection strings containing credentials.

## 19. Observability

At startup, the system may log a sanitized configuration summary containing:

- environment;
- enabled adapters;
- non-secret endpoints where safe;
- timeout classes;
- pool sizes;
- feature-flag names and states;
- configuration schema version.

Secrets and signed material must be redacted.

## 20. Configuration Versioning

Breaking configuration changes must be documented and coordinated with deployment.

Use one or more of:

- configuration schema version;
- backward-compatible aliases during migration;
- startup warnings for deprecated keys;
- deployment runbooks;
- explicit removal dates.

## 21. Local Development

Local setup should be reproducible from repository documentation and `.env.example`.

A new developer or executor should be able to determine:

- required services;
- required variables;
- optional variables;
- safe local defaults;
- verification commands;
- expected health response.

## 22. Testing

Required tests include:

- valid configuration parsing;
- missing required key failure;
- malformed value failure;
- boundary-value validation;
- production guardrail enforcement;
- secret redaction;
- precedence behavior;
- deprecated-key behavior;
- adapter construction from typed config.

Tests must isolate process environment changes and restore state after execution.

## 23. Anti-Patterns

Do not:

- access `process.env` throughout modules;
- silently coerce malformed values;
- use environment variables as a general database;
- commit secrets;
- log configuration wholesale;
- allow production to start with placeholder credentials;
- change domain rules based on environment name;
- maintain undocumented configuration keys;
- create hidden defaults for destructive operations.

## 24. Operational Checklist

Before deployment, verify:

- configuration schema matches the release;
- required secrets exist;
- secret permissions are minimal;
- endpoints target the correct environment;
- timeouts and pools are bounded;
- migrations are configured separately from application startup where required;
- unsafe development settings are disabled;
- sanitized startup diagnostics are available.

## 25. Completion Criteria

Infrastructure configuration is complete when:

- all raw values enter through one boundary;
- typed validation occurs before serving traffic;
- secrets are protected and rotatable;
- production guardrails are enforced;
- configuration is documented and versioned;
- adapters receive typed settings through dependency injection;
- errors are actionable and safely redacted;
- parsing and guardrails are covered by tests.
