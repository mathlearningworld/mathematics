# PES-001C — Production Asset Pipeline and Integration

**Status:** IMPLEMENTATION STARTED  
**Authority:** PCP-001 / VSC-001 / PES-001B  
**Repository branch:** `main`

## 1. Purpose

PES-001C creates the runtime and repository boundary required to replace Graphics-based environment placeholders with production sprites, tiles, atlases and animations without rewriting gameplay or losing the approved PES-001B composition.

This package builds the integration pipeline. It does not claim that final art assets already exist.

## 2. Core principle

```text
Approved composition anchors
+ Versioned asset manifest
+ Deterministic preload
+ Layer ownership
+ Safe fallback
= Incremental production-art replacement
```

A missing or incomplete production asset must not prevent the Builders Valley runtime from booting. The current authored Graphics foundation remains the fallback until a replacement passes runtime review.

## 3. Scope

PES-001C includes:

1. a versioned Builders Valley asset manifest;
2. asset families for ground, water, cliffs, bridge, workshop, vegetation, props and effects;
3. deterministic preload registration;
4. texture and atlas lookup by stable asset ID;
5. production-layer ownership metadata;
6. fallback status for unavailable assets;
7. runtime inspection through `window.__BUILDERS_VALLEY__`;
8. explicit replacement boundaries for later asset packages.

## 4. Non-goals

PES-001C must not:

- redesign the approved terrain layout;
- alter collision or stream geometry;
- change player movement or interaction;
- silently replace bridge gameplay behavior;
- require all production artwork before runtime boot;
- embed workflow-specific art ownership into a generic shared component;
- delete the PES-001B fallback before production replacements are approved.

## 5. Asset families

```text
GROUND
WATER
CLIFF
BRIDGE
WORKSHOP
VEGETATION
PROP
EFFECT
```

Each asset record must include:

- stable asset ID;
- family;
- source type;
- repository-relative URL;
- version;
- required/optional status;
- intended layer;
- replacement target;
- fallback owner.

Supported source types:

```text
IMAGE
SPRITESHEET
ATLAS
TILEMAP
TILESET
```

## 6. Runtime ownership

```text
BuildersValleyAssetManifest.js
        ↓
BuildersValleyAssetPipelinePatch.js
        ↓
Phaser preload / texture registry
        ↓
Production layer composers
        ↓
Approved PES-001B fallback when unavailable
```

The pipeline owns registration and evidence. Individual production modules own how their assets are composed in the world.

## 7. Layer contract

```text
-30  ground base and terrain tiles
-20  water base and animated water details
-10  cliff and shoreline structures
 40  bridge and workshop architecture
 50  vegetation and environmental props
100+ gameplay objects
200+ player depth projection
```

Exact depth may be refined by dedicated packages, but production assets must not silently cross gameplay depth authority.

## 8. Fallback policy

Every optional production asset has one of these states:

```text
DECLARED
AVAILABLE
LOADED
ACTIVE
FALLBACK_ACTIVE
FAILED
```

Rules:

- absent optional assets use `FALLBACK_ACTIVE`;
- required assets may block only the dedicated production package that owns them, not the entire game;
- failed asset loading must be visible in runtime evidence;
- a production replacement becomes active only after the texture exists and its composer explicitly selects it;
- fallback removal requires runtime screenshots and gameplay verification.

## 9. Runtime inspection contract

The implementation exposes:

```javascript
window.__BUILDERS_VALLEY__.getProductionAssetPipeline()
```

Expected fields:

- standard and package status;
- manifest version;
- declared asset count;
- counts by family and source type;
- loaded, missing and fallback asset IDs;
- layer contract;
- fallback owner;
- gameplay geometry changed flag.

## 10. Repository structure

```text
frontend/src/sandbox/assets/
├── BuildersValleyAssetManifest.js
└── README.md

frontend/src/sandbox/scenes/
└── BuildersValleyAssetPipelinePatch.js

frontend/public/assets/builders-valley/
├── ground/
├── water/
├── cliff/
├── bridge/
├── workshop/
├── vegetation/
├── props/
└── effects/
```

Empty asset directories are represented by documentation until binary art files are delivered.

## 11. Package sequence

After the pipeline is verified, dedicated asset packages proceed incrementally:

```text
PES-001C1  Ground, water and cliff material kit
PES-001C2  Bridge modular production kit
PES-001C3  Workshop and work-yard kit
PES-001C4  Vegetation and foreground kit
PES-001C5  Effects, lighting and atmosphere integration
```

Only one replacement family should be activated at a time unless runtime evidence proves the combined change is safe.

## 12. Acceptance gates

### Repository gate

- manifest schema and stable IDs are explicit;
- preload ownership is isolated;
- no gameplay authority files are modified unnecessarily;
- fallback policy is implemented;
- documentation and inspection metadata agree.

### Runtime gate

- application boots with no production assets present;
- declared optional assets report fallback state;
- a valid test asset can load without changing game logic;
- missing assets do not produce unhandled runtime errors;
- inspector accurately reflects texture availability.

### Integration gate

- approved composition anchors remain unchanged;
- replacement modules can select textures by stable ID;
- fallback and production layers are not simultaneously visible unless intentionally used for transition review;
- pointer, placement and player depth remain aligned.

## 13. Completion rule

PES-001C is complete when the pipeline itself is verified and at least one representative production asset can be loaded, inspected and safely activated with fallback recovery demonstrated.

The existence of the pipeline does not complete the later production-art packages.
