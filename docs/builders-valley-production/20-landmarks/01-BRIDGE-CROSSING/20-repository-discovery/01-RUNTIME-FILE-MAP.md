# Bridge Crossing Repository Discovery — Runtime File Map

## Discovery Scope

The repository was searched for runtime-related names and responsibilities, including world scene, landmark, terrain, camera, interaction, persistence, projection, verification, and source entry points.

## File Map

| Responsibility | Actual repository path | Discovery status | Implementation action |
| --- | --- | --- | --- |
| World registration | None found | MISSING | Create during runtime skeleton phase |
| Landmark state owner | None found | MISSING | Create inside Bridge Crossing module |
| Interaction controller | None found | MISSING | Create inside Bridge Crossing module |
| Visual projection | None found | MISSING | Create inside Bridge Crossing module |
| Terrain integration | None found | MISSING | Define adapter boundary; do not create duplicate terrain authority |
| Camera integration | None found | MISSING | Define request boundary; do not create duplicate camera authority |
| Persistence integration | None found | MISSING | Define port first; durable adapter deferred |
| Verification entry point | None found | MISSING | Create contract and runtime verifier entry points |

## Existing Contract Paths

```text
docs/builders-valley-production/20-landmarks/01-BRIDGE-CROSSING/
├── 00-MISSION.md
├── 01-TERRAIN.md
├── 02-COMPOSITION.md
├── 03-GAMEPLAY.md
├── 04-ASSET-RULES.md
├── 05-ACCEPTANCE.md
└── 10-runtime/
    ├── 00-RUNTIME-MAPPING.md
    ├── 01-DATA-FLOW.md
    ├── 02-STATE-MACHINE.md
    ├── 03-INTERACTION-FLOW.md
    └── 04-EVIDENCE-REQUIREMENTS.md
```

## Mapping Rule

A missing runtime path must remain `MISSING` until a concrete repository file is committed. Planned names must not be presented as actual ownership evidence.
