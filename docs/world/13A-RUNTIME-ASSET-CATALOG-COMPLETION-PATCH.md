# 13A — Runtime Asset Catalog Completion Patch

## 1 Document Identity

| Field | Value |
|---|---|
| Document ID | MLW-DOC-013A |
| Parent | MLW-DOC-013 — Production Environment Slice 001A: Runtime Asset Catalog |
| Version | 1.0 |
| Status | COMPLETION PATCH — ACTIVE |
| Classification | Production Specification Patch |

## 2 Purpose and Patch Authority

This document completes the missing acceptance package for MLW-DOC-013 without deleting or rewriting the existing asset registry. Where MLW-DOC-013 is truncated or incomplete, this patch is authoritative. All unaffected asset entries in MLW-DOC-013 remain valid.

This patch:

- repairs the incomplete `13.3 Navigation Cues` registry entry;
- supplies conventions and runtime policies promised by the parent document;
- defines measurable validation and acceptance gates;
- closes Production Environment Slice 001A at the documentation-contract level.

## 3 Correction — Navigation Cues

The complete registry entry for `13.3 Navigation Cues` is:

| Field | Value |
|---|---|
| AssetID | BV_READY_NAV_001 |
| Category | Gameplay Readability |
| Subcategory | Navigation Cues |
| Description | Subtle environmental cues that guide the player along the intended route. Includes path-surface contrast, sightline framing, landmark visibility, directional vegetation gaps, and readable transitions between zones. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | N/A — integrated environmental composition |
| Max Draw Calls | 0 — integrated into other assets |
| Material Slots | N/A |
| Texture Resolution | N/A |
| Collision Type | None |
| Culling Group | Readability |
| Scale Range | N/A |
| Density Limit | N/A — governed by composition readability |
| Placement Rule | Navigation Cue Placement |
| Acceptance Gate | Production Slice Gate |

## 17 Naming Convention

Runtime asset identifiers use:

```text
BV_<CATEGORY>_<SUBCATEGORY>_<SEQUENCE>
```

Rules:

- `BV` identifies Builder's Valley.
- Category and subcategory tokens use uppercase ASCII abbreviations.
- Sequence is a three-digit number beginning at `001`.
- Variant suffixes may be appended only after the sequence, for example `_A`, `_B`, or `_DAMAGED`.
- File names, registry IDs, prefab names, and evidence references must use the same canonical asset ID.
- Renaming an accepted asset requires registry and dependency updates in the same change.

## 18 Folder Convention

```text
Assets/BuildersValley/
  Terrain/
  Water/
  Vegetation/
  Rock/
  Architecture/
  Workshop/
  Readability/
  Landmarks/
  FX/
  Audio/
  Materials/
  Textures/
  Prefabs/
  Validation/
```

Rules:

- Source files and runtime-ready files must not be mixed.
- Each category owns its production files.
- Shared materials and textures live only in their dedicated libraries.
- Temporary exports must remain outside runtime folders.
- No asset may be referenced from an ungoverned `Temp`, `Misc`, or personal folder.

## 19 Prefab Convention

Each reusable runtime assembly must have one authoritative prefab.

```text
PF_<ASSET_ID>
```

Prefab requirements:

- root transform uses zero rotation, unit scale, and a documented pivot;
- render, collision, interaction, audio, and FX children have explicit names;
- nested prefabs are allowed only when ownership and replacement boundaries are clear;
- scene-local overrides must not silently redefine the authoritative prefab;
- accepted prefabs must expose their LOD, culling, collision, and material assignments.

## 20 Material Library

Canonical material families:

| Family | Purpose |
|---|---|
| MAT_BV_TERRAIN | Grass, soil, mud, path, and rocky terrain blends |
| MAT_BV_WATER | River, waterfall, shallow water, foam, and edge transitions |
| MAT_BV_TIMBER | Bridge and workshop timber variants |
| MAT_BV_STONE | Valley rock and architectural stone |
| MAT_BV_VEGETATION | Foliage and ground-cover surfaces |
| MAT_BV_READABILITY | Interaction, placement, state, and safe-zone communication |
| MAT_BV_FX | Mist, dust, ripple, light-shaft, firefly, and leaf effects |

Material rules:

- prefer shared material instances over unique materials;
- gameplay readability must remain visible under approved lighting conditions;
- material variation must not introduce new visual-language rules;
- transparent materials require explicit overdraw review;
- every material must identify its owning family and runtime cost class.

## 21 Texture Policy

- Default environment texture size: `1024 × 1024`.
- Landmark and hero assemblies may use `2048 × 2048` when evidence demonstrates need.
- Small props, readability assets, and FX use `512 × 512` or lower.
- Use trim sheets, atlases, tiling textures, and channel packing where appropriate.
- Texture dimensions must be power-of-two unless the runtime platform explicitly supports an exception.
- Compression and mipmaps are required for runtime textures unless prohibited by asset function.
- Source textures remain separate from runtime imports.
- No texture may exceed its registry target without approval evidence.

## 22 Placement Rules

1. Preserve the primary route from Arrival Overlook to River Corridor, Workshop Terrace, and Bridge Crossing.
2. Keep primary landmarks visible from their required orientation points.
3. Do not obstruct interaction zones, placement zones, or safe traversal corridors.
4. Use foreground framing without blocking gameplay-critical sightlines.
5. Place environmental detail in clusters, not uniform scatter.
6. Maintain readable separation between traversable surfaces and non-traversable terrain.
7. Audio and FX emitters must support spatial meaning and must not become visual or acoustic noise.
8. Any procedural placement must be reproducible from a recorded seed or deterministic rule set.

## 23 Density Rules

- Density limits in the parent registry are hard maxima, not placement targets.
- Primary interaction zones require a minimum clear radius defined during assembly validation.
- Vegetation density must decrease near paths, landmarks, and placement surfaces.
- Repeated props require visible spacing and rotation variation without breaking authored composition.
- FX emitters are limited to the smallest number needed to communicate the intended atmosphere.
- Density must be evaluated per zone and for the complete visible frame.

## 24 Scale Rules

- World scale is consistent across all Builder's Valley assets.
- Structural assets and traversal surfaces use fixed scale unless explicitly registered as modular.
- Natural assets may vary only inside their registry scale range.
- Non-uniform scale is prohibited for collision-critical or modular assets unless validated.
- Player reach, step height, path width, bridge width, workbench height, and interaction distance are reference anchors.
- Scale changes that alter gameplay meaning require design review, not only art review.

## 25 Collision Rules

- Use the simplest collision form that preserves traversal and interaction meaning.
- Decorative vegetation, small stones, decals, and ambient FX use no collision by default.
- Traversable architecture requires stable, continuous collision surfaces.
- Water boundaries use explicit safe barriers where entry is not supported.
- Collision meshes must not exceed visual bounds in ways that confuse player movement.
- Interaction triggers and physical collision are separate responsibilities.
- Every collision-critical asset must pass approach, traversal, edge, and recovery tests.

## 26 LOD Policy

- Assets follow the LOD count specified in their registry entry.
- LOD transitions must preserve silhouette and landmark recognition.
- Interaction-critical forms must remain readable at every usable distance.
- LOD0 is reserved for close or hero presentation; distant views must use reduced geometry.
- LOD transitions must not create obvious popping in the target camera path.
- Missing LODs require an explicit exception with performance evidence.

## 27 Culling Policy

- Assets are assigned to the culling group defined in the registry.
- Culling distance is based on visual role, physical size, and navigation importance.
- Primary landmarks must remain visible at required orientation points.
- Small props and ground detail should cull before structural or navigation assets.
- Audio and FX use independent distance and activation rules.
- Occlusion settings must not remove assets that communicate route, state, or safety.

## 28 Runtime Performance Targets

Slice-level targets for the approved target frame:

| Metric | Target |
|---|---|
| Frame rate | Stable target-platform frame rate during the complete traversal route |
| Frame-time spikes | No repeatable asset-loading or visibility spike that interrupts control |
| Draw calls | Within the engine-approved scene budget; category excess requires evidence |
| Visible triangles | Within the approved target-frame budget using active LODs |
| Texture memory | Within the platform budget with no unapproved oversized texture |
| Transparent overdraw | Limited to water and approved FX regions |
| Runtime loading | No blocking load during normal zone traversal |
| Audio voices | Limited to meaningful active zone layers |

Exact engine counters must be recorded during implementation because this document remains engine-neutral. Acceptance requires measured evidence rather than visual confidence alone.

## 29 Zone Allocation

| Zone | Primary Asset Responsibility |
|---|---|
| Arrival Overlook | Orientation, full-valley composition, initial navigation cue |
| River Corridor | River flow, path continuity, vegetation framing, ambient movement |
| Workshop Terrace | Human craft, material staging, interaction readability, secondary landmark |
| Bridge Crossing | Primary landmark, construction meaning, placement and state communication |
| Waterfall Vista | Natural anchor, depth, water FX, distant-to-close audio transition |

Cross-zone assets must state one primary owner zone and any secondary visibility zones.

## 30 Runtime Validation Checklist

### Registry integrity

- [ ] Every runtime asset has a unique AssetID.
- [ ] Required registry fields are populated.
- [ ] File, prefab, and registry naming agree.
- [ ] Lifecycle state reflects actual production state.

### Visual and gameplay meaning

- [ ] Primary route is readable without UI overlays.
- [ ] Landmarks remain identifiable from required viewpoints.
- [ ] Interaction and placement zones are visually understandable.
- [ ] Environmental detail does not obscure gameplay-critical information.
- [ ] Asset scale supports player movement and interaction.

### Runtime construction

- [ ] Materials and textures comply with shared-library policy.
- [ ] Collision matches traversal and interaction intent.
- [ ] LODs and culling behave without disruptive popping.
- [ ] Procedural placement is deterministic or reproducible.
- [ ] No runtime reference points to temporary or ungoverned folders.

### Performance evidence

- [ ] Target route has been profiled on the target platform.
- [ ] Frame-time, draw-call, geometry, texture, FX, and audio evidence is recorded.
- [ ] No unapproved budget exception remains.
- [ ] Loading and zone transitions remain responsive.

## 31 Acceptance Gates

### Gate 1 — Registry Gate

Passes when taxonomy, identifiers, lifecycle states, ownership, and required fields are complete and internally consistent.

### Gate 2 — Asset Conformance Gate

Passes when geometry, materials, textures, scale, collision, LOD, culling, and prefab structure conform to this catalog and higher authorities.

### Gate 3 — Composition and Readability Gate

Passes when the target frame, route, landmarks, interaction zones, and environmental cues preserve the approved visual and gameplay hierarchy.

### Gate 4 — Runtime Performance Gate

Passes only with measured target-platform evidence demonstrating that the assembled slice remains within runtime budgets.

### Gate 5 — Operational Traversal Gate

Passes when a player can enter, orient, traverse, interact, place or construct as applicable, recover from edges, and complete the slice loop without ambiguity or blocking defects.

### Slice Acceptance Rule

Production Environment Slice 001A is accepted only when all five gates pass. Repository documentation completion alone does not claim runtime or operational acceptance.

## 32 Future Expansion

Future asset categories may be added for:

- seasonal and weather variants;
- additional workshop functions;
- bridge construction states;
- educational interaction props;
- region-transition assets;
- accessibility and readability variants;
- target-platform optimization variants.

Expansion must preserve canonical IDs, authority order, zone ownership, visual language, and measurable runtime gates. New categories require registry updates before production begins.

## 33 Completion Declaration

Together, MLW-DOC-013 and this patch provide the complete Runtime Asset Catalog documentation package for Builder's Valley Production Environment Slice 001A.

Documentation status:

```text
REGISTRY PACKAGE: COMPLETE WITH PATCH
RUNTIME IMPLEMENTATION: NOT CLAIMED
OPERATIONAL ACCEPTANCE: NOT CLAIMED
```
