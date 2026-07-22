# Bridge Crossing Implementation Skeleton — Package Layout

## Purpose

This document defines the repository package layout required before Bridge Crossing runtime behavior is implemented.

The layout establishes ownership boundaries. It does not certify runtime completion.

## Proposed Runtime Root

```text
src/
└── builders-valley/
    ├── world/
    ├── landmarks/
    │   └── bridge-crossing/
    ├── runtime-ports/
    └── verification/
```

## World Runtime Packages

```text
src/builders-valley/world/
├── world-composition-root.ts
├── landmark-registry.ts
├── world-runtime.types.ts
└── index.ts
```

Responsibilities:

- compose approved world runtime dependencies
- register landmarks through one registry authority
- expose world-level read and request boundaries
- avoid owning landmark-specific workflow

## Bridge Crossing Package

```text
src/builders-valley/landmarks/bridge-crossing/
├── application/
│   ├── bridge-crossing-controller.ts
│   └── bridge-crossing.commands.ts
├── domain/
│   ├── bridge-crossing-state.ts
│   ├── bridge-crossing-machine.ts
│   └── bridge-crossing.errors.ts
├── projection/
│   ├── bridge-crossing-projection.ts
│   └── bridge-crossing-view-model.ts
├── runtime/
│   ├── bridge-crossing-registration.ts
│   ├── bridge-crossing-interaction.ts
│   └── bridge-crossing-completion-verifier.ts
├── ports/
│   └── bridge-crossing.ports.ts
├── bridge-crossing.contract.ts
└── index.ts
```

Bridge Crossing owns only its state machine, commands, workflow-bound projection, interaction coordination, registration metadata, and completion verification.

## Runtime Ports

```text
src/builders-valley/runtime-ports/
├── camera.port.ts
├── terrain.port.ts
├── persistence.port.ts
├── player-observation.port.ts
├── lighting.port.ts
├── material.port.ts
└── index.ts
```

Ports define requests to global authorities. They do not authorize Bridge Crossing to implement duplicate global authorities.

## Verification Package

```text
src/builders-valley/verification/
├── bridge-crossing.contract.spec.ts
├── bridge-crossing.state-machine.spec.ts
├── bridge-crossing.integration.spec.ts
└── index.ts
```

## Ownership Rules

1. One package owns each runtime responsibility.
2. Landmark-specific UI and workflow remain inside the landmark package.
3. Global camera, terrain, persistence, lighting, material, and player observation remain behind ports.
4. Public imports must pass through package indexes.
5. No shared workflow component may be introduced merely for possible future reuse.
6. Naming may change during implementation only when ownership remains equivalent and the mapping record is updated.

## Readiness Rule

Runtime implementation may begin only after the remaining skeleton documents define composition, ports, public exports, and verification entry points.