# 13 — Production Environment Slice 001A: Runtime Asset Catalog

## 1 Document Identity

| Field | Value |
|---|---|
| Document ID | MLW-DOC-013 |
| Title | Production Environment Slice 001A: Runtime Asset Catalog |
| Slice | Builder's Valley — Production Environment Slice 001A |
| Version | 1.0 |
| Status | RUNTIME CATALOG — ACTIVE |
| Classification | Production Specification |

## 2 Purpose

This document defines every runtime asset category required for the implementation of Builder's Valley Production Environment Slice 001A. It establishes the complete asset taxonomy, registry schema, naming conventions, placement rules, performance targets, and validation gates necessary to move from creative direction into production-ready runtime assets.

The catalog exists to ensure that:

- every asset has a defined purpose, category, and lifecycle state;
- no asset is produced without a composition or gameplay reason;
- naming, folder, and prefab conventions remain consistent across the slice;
- runtime performance targets are achievable and measurable;
- the educational philosophy and visual language are preserved in every asset category.

## 3 Authority

This document derives authority from the following sources, in order:

1. **00 — Universe Bible** — governs creative intent and non-negotiable boundaries.
2. **02 — World Bible** — governs region identity, emotional geography, and connectivity.
3. **05 — Visual Language** — governs composition hierarchy, shape language, material language, and color doctrine.
4. **06 — Design System** — governs shared design grammar and cross-discipline contracts.
5. **09 — Creative Governance** — governs decision classes, review lenses, and acceptance gates.
6. **10 — Target Frame Conformance** — governs measurable production targets and runtime evidence.
7. **11 — Builder's Valley Production Specification** — governs scene layout, environment layers, and player flow.
8. **12 — Production Environment Slice 001** — governs scene zones, composition grid, camera, lighting, and asset placement rules.

This document does not override higher authorities. It translates them into actionable asset definitions.

## 4 Scope

### In scope

- All runtime asset categories required for Builder's Valley Slice 001A.
- Terrain, water, vegetation, rock, architecture, workshop, gameplay readability, landmark, FX, and ambient audio assets.
- Naming, folder, and prefab conventions.
- Material library, texture policy, placement rules, density rules, scale rules, collision rules, LOD policy, culling policy.
- Runtime performance targets and zone allocation.
- Validation checklist and acceptance gates.
- Asset lifecycle definitions.

### Out of scope

- Gameplay code and interaction logic.
- Engine-specific implementation details.
- UI assets, HUD components, or menu systems.
- Character or NPC assets.
- Animation rigs or state machines.
- Audio music composition (ambient audio only).
- Regions beyond Builder's Valley.
- Full world map or cross-region connectivity assets.

## 5 Asset Taxonomy

All runtime assets in Builder's Valley Slice 001A are organized into the following top-level categories.

```
RUNTIME ASSETS
├── TERRAIN
│   ├── Base Terrain
│   ├── Terrain Layers
│   ├── Path Surfaces
│   └── Terrain Decals
├── WATER
│   ├── River Surface
│   ├── Waterfall
│   ├── Water Edge
│   └── Shallow Water
├── VEGETATION
│   ├── Canopy Trees
│   ├── Understory Trees
│   ├── Shrubs
│   ├── Ground Cover
│   ├── Grass Patches
│   └── Riverbank Plants
├── ROCK
│   ├── Large Formations
│   ├── Medium Boulders
│   ├── Small Stones
│   └── Riverbed Rocks
├── ARCHITECTURE
│   ├── Bridge Structure
│   ├── Bridge Deck
│   ├── Bridge Railings
│   ├── Bridge Supports
│   ├── Path Edges
│   ├── Retaining Walls
│   └── Stairs and Steps
├── WORKSHOP
│   ├── Workshop Building
│   ├── Workbench
│   ├── Tool Rack
│   ├── Material Storage
│   ├── Material Piles
│   ├── Staging Area
│   └── Workshop Props
├── GAMEPLAY READABILITY
│   ├── Interaction Markers
│   ├── Placement Zones
│   ├── Navigation Cues
│   ├── State Indicators
│   └── Safe Zone Boundaries
├── LANDMARK
│   ├── Bridge Crossing (Primary)
│   ├── Workshop Terrace (Secondary)
│   ├── Waterfall Vista (Natural Anchor)
│   └── Arrival Overlook (Orientation)
├── FX
│   ├── Water Surface Ripple
│   ├── Waterfall Mist
│   ├── Waterfall Foam
│   ├── Dust Particles
│   ├── Light Shafts
│   ├── Firefly Ambient
│   └── Leaf Fall
└── AMBIENT AUDIO
    ├── River Flow
    ├── Waterfall Distant
    ├── Waterfall Close
    ├── Wind Through Valley
    ├── Workshop Activity
    ├── Bird Layer
    ├── Insect Layer
    └── Material Handling
```

## 6 Asset Registry Schema

Every registered asset must include the following fields.

| Field | Type | Required | Description |
|---|---|---|---|
| AssetID | String | Yes | Unique identifier following the naming convention |
| Category | String | Yes | Top-level taxonomy category |
| Subcategory | String | Yes | Subcategory within the taxonomy |
| Description | Text | Yes | Purpose, visual intent, and gameplay function |
| Lifecycle | String | Yes | Current lifecycle state |
| Zone | String | Yes | Primary zone assignment |
| LOD Count | Integer | Yes | Number of LOD levels |
| Max Tri Count | Integer | Yes | Maximum triangle count at LOD0 |
| Max Draw Calls | Integer | Yes | Maximum draw calls per instance |
| Material Slots | Integer | Yes | Number of material slots |
| Texture Resolution | String | Yes | Primary texture resolution |
| Collision Type | String | Yes | Collision primitive or mesh type |
| Culling Group | String | Yes | Culling group assignment |
| Scale Range | String | Yes | Allowable scale range |
| Density Limit | String | Yes | Maximum instances per zone |
| Placement Rule | String | Yes | Placement constraint reference |
| Acceptance Gate | String | Yes | Required gate for acceptance |

## 7 Terrain Assets

### 7.1 Base Terrain

| Field | Value |
|---|---|
| AssetID | BV_TER_BASE_001 |
| Category | Terrain |
| Subcategory | Base Terrain |
| Description | The primary ground surface of Builder's Valley. Sculpted to define the river corridor, path routes, workshop terrace, and valley walls. Must support foreground, midground, and background depth layers. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 4 |
| Max Tri Count | 10,000 (per 64m tile) |
| Max Draw Calls | 1 |
| Material Slots | 1 (Terrain Layer Blend) |
| Texture Resolution | 2048×2048 |
| Collision Type | Heightmap |
| Culling Group | Terrain |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 per tile |
| Placement Rule | Terrain Grid |
| Acceptance Gate | Production Slice Gate |

### 7.2 Terrain Layers

| Field | Value |
|---|---|
| AssetID | BV_TER_LAYER_001 |
| Category | Terrain |
| Subcategory | Terrain Layers |
| Description | Blendable surface layers applied to base terrain. Includes grass, soil, path dirt, riverbank mud, and rocky ground. Layers must transition naturally and support gameplay readability. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | N/A (shader blend) |
| Max Tri Count | N/A |
| Max Draw Calls | 0 (blended into base) |
| Material Slots | 1 per layer |
| Texture Resolution | 1024×1024 |
| Collision Type | None |
| Culling Group | Terrain |
| Scale Range | N/A |
| Density Limit | 5 layers per tile |
| Placement Rule | Terrain Paint |
| Acceptance Gate | Production Slice Gate |

### 7.3 Path Surfaces

| Field | Value |
|---|---|
| AssetID | BV_TER_PATH_001 |
| Category | Terrain |
| Subcategory | Path Surfaces |
| Description | Walkable path surfaces from Arrival Overlook through River Corridor to Workshop Terrace and Bridge Crossing. Must contrast visually with surrounding terrain for navigation readability. |
| Lifecycle | PLANNED |
| Zone | Arrival Path, River Corridor, Bridge Crossing, Workshop Terrace |
| LOD Count | 2 |
| Max Tri Count | 500 (per segment) |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | Mesh |
| Culling Group | Terrain |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 path network |
| Placement Rule | Path Layout |
| Acceptance Gate | Production Slice Gate |

### 7.4 Terrain Decals

| Field | Value |
|---|---|
| AssetID | BV_TER_DECAL_001 |
| Category | Terrain |
| Subcategory | Terrain Decals |
| Description | Non-tiling surface details such as mud patches, leaf scatter, foot-worn areas, and water-edge erosion. Used sparingly to add surface interest without visual noise. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | 100 (per decal) |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | None |
| Culling Group | Decal |
| Scale Range | 0.5–2.0 |
| Density Limit | 10 per zone |
| Placement Rule | Manual Placement |
| Acceptance Gate | Production Slice Gate |

## 8 Water Assets

### 8.1 River Surface

| Field | Value |
|---|---|
| AssetID | BV_WAT_RIVER_001 |
| Category | Water |
| Subcategory | River Surface |
| Description | The main river surface flowing through the valley corridor. Must communicate direction, depth, and movement. Supports the emotional geography of connection and flow. |
| Lifecycle | PLANNED |
| Zone | River Corridor |
| LOD Count | 3 |
| Max Tri Count | 2,000 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | None (invisible barrier at edges) |
| Culling Group | Water |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 river system |
| Placement Rule | Water Layout |
| Acceptance Gate | Production Slice Gate |

### 8.2 Waterfall

| Field | Value |
|---|---|
| AssetID | BV_WAT_FALL_001 |
| Category | Water |
| Subcategory | Waterfall |
| Description | The primary waterfall at the head of the river corridor. Establishes depth, direction, and the natural anchor of the valley. Must be readable from the Arrival Overlook and River Corridor. |
| Lifecycle | PLANNED |
| Zone | Waterfall Vista |
| LOD Count | 3 |
| Max Tri Count | 1,500 |
| Max Draw Calls | 2 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | None |
| Culling Group | Water |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

### 8.3 Water Edge

| Field | Value |
|---|---|
| AssetID | BV_WAT_EDGE_001 |
| Category | Water |
| Subcategory | Water Edge |
| Description | Transition geometry between water surface and riverbank. Includes foam, shallow blending, and shoreline definition. Must support natural-looking water-to-land transitions. |
| Lifecycle | PLANNED |
| Zone | River Corridor, Waterfall Vista |
| LOD Count | 2 |
| Max Tri Count | 800 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | None |
| Culling Group | Water |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 per river segment |
| Placement Rule | Water Layout |
| Acceptance Gate | Production Slice Gate |

### 8.4 Shallow Water

| Field | Value |
|---|---|
| AssetID | BV_WAT_SHALLOW_001 |
| Category | Water |
| Subcategory | Shallow Water |
| Description | Transparent shallow water areas near riverbanks and crossing points. Must allow visibility of riverbed rocks and terrain beneath. Supports gameplay readability for crossing and gathering. |
| Lifecycle | PLANNED |
| Zone | River Corridor, Bridge Crossing |
| LOD Count | 2 |
| Max Tri Count | 500 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | None |
| Culling Group | Water |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 per shallow area |
| Placement Rule | Water Layout |
| Acceptance Gate | Production Slice Gate |

## 9 Vegetation Assets

### 9.1 Canopy Trees

| Field | Value |
|---|---|
| AssetID | BV_VEG_CANOPY_001 |
| Category | Vegetation |
| Subcategory | Canopy Trees |
| Description | Large trees forming the upper vegetation layer. Used to frame the valley, define depth layers, and create visual rhythm. Must not obscure landmark silhouettes or navigation paths. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 3 |
| Max Tri Count | 3,000 |
| Max Draw Calls | 1 |
| Material Slots | 2 (trunk, foliage) |
| Texture Resolution | 1024×1024 |
| Collision Type | None (or simple capsule at trunk) |
| Culling Group | Vegetation |
| Scale Range | 0.8–1.2 |
| Density Limit | 15 per zone |
| Placement Rule | Vegetation Mass Placement |
| Acceptance Gate | Production Slice Gate |

### 9.2 Understory Trees

| Field | Value |
|---|---|
| AssetID | BV_VEG_UNDER_001 |
| Category | Vegetation |
| Subcategory | Understory Trees |
| Description | Smaller trees beneath the canopy layer. Adds depth and variety without competing with primary landmarks. Used to soften terrain transitions and frame path edges. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 3 |
| Max Tri Count | 1,500 |
| Max Draw Calls | 1 |
| Material Slots | 2 (trunk, foliage) |
| Texture Resolution | 1024×1024 |
| Collision Type | None |
| Culling Group | Vegetation |
| Scale Range | 0.7–1.1 |
| Density Limit | 20 per zone |
| Placement Rule | Vegetation Mass Placement |
| Acceptance Gate | Production Slice Gate |

### 9.3 Shrubs

| Field | Value |
|---|---|
| AssetID | BV_VEG_SHRUB_001 |
| Category | Vegetation |
| Subcategory | Shrubs |
| Description | Low vegetation used for ground-level variety, path edging, and riverbank definition. Must remain below interaction sightlines. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 2 |
| Max Tri Count | 300 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | None |
| Culling Group | Vegetation |
| Scale Range | 0.6–1.0 |
| Density Limit | 30 per zone |
| Placement Rule | Vegetation Mass Placement |
| Acceptance Gate | Production Slice Gate |

### 9.4 Ground Cover

| Field | Value |
|---|---|
| AssetID | BV_VEG_COVER_001 |
| Category | Vegetation |
| Subcategory | Ground Cover |
| Description | Low-level ground vegetation including ferns, small flowers, and moss patches. Adds surface richness without obstructing navigation or interaction. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | 100 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | None |
| Culling Group | Vegetation |
| Scale Range | 0.5–1.0 |
| Density Limit | 50 per zone |
| Placement Rule | Scatter Placement |
| Acceptance Gate | Production Slice Gate |

### 9.5 Grass Patches

| Field | Value |
|---|---|
| AssetID | BV_VEG_GRASS_001 |
| Category | Vegetation |
| Subcategory | Grass Patches |
| Description | Clumped grass patches used to break up uniform terrain surfaces. Must not interfere with path readability or interaction zones. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | 50 (per patch) |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 256×256 |
| Collision Type | None |
| Culling Group | Vegetation |
| Scale Range | 0.5–1.5 |
| Density Limit | 40 per zone |
| Placement Rule | Scatter Placement |
| Acceptance Gate | Production Slice Gate |

### 9.6 Riverbank Plants

| Field | Value |
|---|---|
| AssetID | BV_VEG_BANK_001 |
| Category | Vegetation |
| Subcategory | Riverbank Plants |
| Description | Specialized vegetation for water-edge zones. Includes reeds, cattails, and moisture-loving plants. Must frame the river corridor without hiding the water surface. |
| Lifecycle | PLANNED |
| Zone | River Corridor, Waterfall Vista |
| LOD Count | 2 |
| Max Tri Count | 200 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | None |
| Culling Group | Vegetation |
| Scale Range | 0.6–1.2 |
| Density Limit | 20 per zone |
| Placement Rule | Riverbank Placement |
| Acceptance Gate | Production Slice Gate |

## 10 Rock Assets

### 10.1 Large Formations

| Field | Value |
|---|---|
| AssetID | BV_ROCK_LARGE_001 |
| Category | Rock |
| Subcategory | Large Formations |
| Description | Large rock formations used as terrain anchors, valley wall definition, and composition framing. Must support the visual hierarchy and provide readable silhouettes. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 3 |
| Max Tri Count | 4,000 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | Mesh |
| Culling Group | Rock |
| Scale Range | 0.8–1.5 |
| Density Limit | 5 per zone |
| Placement Rule | Composition Placement |
| Acceptance Gate | Production Slice Gate |

### 10.2 Medium Boulders

| Field | Value |
|---|---|
| AssetID | BV_ROCK_MED_001 |
| Category | Rock |
| Subcategory | Medium Boulders |
| Description | Medium-sized boulders used for riverbed definition, path edges, and terrain variety. May serve as partial cover or climbable obstacles. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 3 |
| Max Tri Count | 1,000 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | Mesh |
| Culling Group | Rock |
| Scale Range | 0.6–1.2 |
| Density Limit | 15 per zone |
| Placement Rule | Scatter Placement |
| Acceptance Gate | Production Slice Gate |

### 10.3 Small Stones

| Field | Value |
|---|---|
| AssetID | BV_ROCK_SMALL_001 |
| Category | Rock |
| Subcategory | Small Stones |
| Description | Small rocks and stones used for ground-level detail. Adds surface richness without affecting navigation or collision. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | 100 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | None |
| Culling Group | Rock |
| Scale Range | 0.4–1.0 |
| Density Limit | 30 per zone |
| Placement Rule | Scatter Placement |
| Acceptance Gate | Production Slice Gate |

### 10.4 Riverbed Rocks

| Field | Value |
|---|---|
| AssetID | BV_ROCK_BED_001 |
| Category | Rock |
| Subcategory | Riverbed Rocks |
| Description | Submerged and partially submerged rocks visible through shallow water. Must support the visual language of the river corridor and provide depth reference. |
| Lifecycle | PLANNED |
| Zone | River Corridor, Waterfall Vista |
| LOD Count | 2 |
| Max Tri Count | 400 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | None |
| Culling Group | Rock |
| Scale Range | 0.5–1.0 |
| Density Limit | 20 per zone |
| Placement Rule | Riverbed Placement |
| Acceptance Gate | Production Slice Gate |

## 11 Architecture Assets

### 11.1 Bridge Structure

| Field | Value |
|---|---|
| AssetID | BV_ARC_BRIDGE_STR_001 |
| Category | Architecture |
| Subcategory | Bridge Structure |
| Description | The primary load-bearing structure of Bridge Crossing. Must make structural forces, spans, repetition, support, and proportion visible. The bridge is the primary landmark of Builder's Valley. |
| Lifecycle | PLANNED |
| Zone | Bridge Crossing |
| LOD Count | 3 |
| Max Tri Count | 5,000 |
| Max Draw Calls | 2 |
| Material Slots | 2 (timber, stone) |
| Texture Resolution | 2048×2048 |
| Collision Type | Mesh |
| Culling Group | Architecture |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

### 11.2 Bridge Deck

| Field | Value |
|---|---|
| AssetID | BV_ARC_BRIDGE_DECK_001 |
| Category | Architecture |
| Subcategory | Bridge Deck |
| Description | The walkable surface of the bridge. Must communicate safe traversal and support the before-and-after state of the bridge completion. |
| Lifecycle | PLANNED |
| Zone | Bridge Crossing |
| LOD Count | 2 |
| Max Tri Count | 1,000 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | Mesh |
| Culling Group | Architecture |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

### 11.3 Bridge Railings

| Field | Value |
|---|---|
| AssetID | BV_ARC_BRIDGE_RAIL_001 |
| Category | Architecture |
| Subcategory | Bridge Railings |
| Description | Handcrafted railings along the bridge deck. Must demonstrate craft, repetition, and structural rhythm. Provides human-scale reference. |
| Lifecycle | PLANNED |
| Zone | Bridge Crossing |
| LOD Count | 2 |
| Max Tri Count | 800 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | Mesh |
| Culling Group | Architecture |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 2 (left and right) |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

### 11.4 Bridge Supports

| Field | Value |
|---|---|
| AssetID | BV_ARC_BRIDGE_SUP_001 |
| Category | Architecture |
| Subcategory | Bridge Supports |
| Description | Support pillars or abutments anchoring the bridge to the riverbed and banks. Must communicate structural stability and load paths. |
| Lifecycle | PLANNED |
| Zone | Bridge Crossing |
| LOD Count | 2 |
| Max Tri Count | 1,200 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | Mesh |
| Culling Group | Architecture |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 4 |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

### 11.5 Path Edges

| Field | Value |
|---|---|
| AssetID | BV_ARC_PATH_EDGE_001 |
| Category | Architecture |
| Subcategory | Path Edges |
| Description | Stone or timber edging along walkable paths. Defines path boundaries, supports navigation readability, and adds craft detail to the valley. |
| Lifecycle | PLANNED |
| Zone | Arrival Path, River Corridor, Workshop Terrace |
| LOD Count | 2 |
| Max Tri Count | 200 (per segment) |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | Mesh |
| Culling Group | Architecture |
| Scale Range | 0.8–1.0 |
| Density Limit | 1 per path segment |
| Placement Rule | Path Layout |
| Acceptance Gate | Production Slice Gate |

### 11.6 Retaining Walls

| Field | Value |
|---|---|
| AssetID | BV_ARC_WALL_001 |
| Category | Architecture |
| Subcategory | Retaining Walls |
| Description | Stone retaining walls supporting terrain edges, workshop terrace, and path cuts. Must communicate craft and human modification of the landscape. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace, River Corridor, Arrival Path |
| LOD Count | 2 |
| Max Tri Count | 800 (per segment) |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | Mesh |
| Culling Group | Architecture |
| Scale Range | 0.8–1.2 |
| Density Limit | 1 per wall segment |
| Placement Rule | Terrain Edge Placement |
| Acceptance Gate | Production Slice Gate |

### 11.7 Stairs and Steps

| Field | Value |
|---|---|
| AssetID | BV_ARC_STAIRS_001 |
| Category | Architecture |
| Subcategory | Stairs and Steps |
| Description | Stone or timber steps connecting elevation changes along paths and the workshop terrace. Must be readable as walkable surfaces. |
| Lifecycle | PLANNED |
| Zone | Arrival Path, Workshop Terrace |
| LOD Count | 2 |
| Max Tri Count | 300 (per flight) |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | Mesh |
| Culling Group | Architecture |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 per elevation change |
| Placement Rule | Path Layout |
| Acceptance Gate | Production Slice Gate |

## 12 Workshop Assets

### 12.1 Workshop Building

| Field | Value |
|---|---|
| AssetID | BV_WKS_BUILDING_001 |
| Category | Workshop |
| Subcategory | Workshop Building |
| Description | The primary workshop structure on the terrace. Must feel used and useful — a center of human craft. Warm timber construction with visible construction logic. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace |
| LOD Count | 3 |
| Max Tri Count | 4,000 |
| Max Draw Calls | 2 |
| Material Slots | 2 (timber, roof) |
| Texture Resolution | 2048×2048 |
| Collision Type | Mesh |
| Culling Group | Architecture |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

### 12.2 Workbench

| Field | Value |
|---|---|
| AssetID | BV_WKS_BENCH_001 |
| Category | Workshop |
| Subcategory | Workbench |
| Description | The primary work surface where the player assembles, measures, and constructs. Must support the gather-place-revise gameplay loop. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace |
| LOD Count | 2 |
| Max Tri Count | 800 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | Mesh |
| Culling Group | Workshop |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Workshop Layout |
| Acceptance Gate | Production Slice Gate |

### 12.3 Tool Rack

| Field | Value |
|---|---|
| AssetID | BV_WKS_TOOLRACK_001 |
| Category | Workshop |
| Subcategory | Tool Rack |
| Description | Wall-mounted or freestanding rack holding workshop tools. Communicates craft readiness and provides visual storytelling about workshop activity. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace |
| LOD Count | 2 |
| Max Tri Count | 500 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | None |
| Culling Group | Workshop |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Workshop Layout |
| Acceptance Gate | Production Slice Gate |

### 12.4 Material Storage

| Field | Value |
|---|---|
| AssetID | BV_WKS_STORAGE_001 |
| Category | Workshop |
| Subcategory | Material Storage |
| Description | Storage containers, bins, and shelves for construction materials. Must communicate available resources and support the quantity and resource use learning experience. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace |
| LOD Count | 2 |
| Max Tri Count | 600 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024×1024 |
| Collision Type | Mesh |
| Culling Group | Workshop |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 2 |
| Placement Rule | Workshop Layout |
| Acceptance Gate | Production Slice Gate |

### 12.5 Material Piles

| Field | Value |
|---|---|
| AssetID | BV_WKS_MATPILE_001 |
| Category | Workshop |
| Subcategory | Material Piles |
| Description | Piles of timber, stone, and other raw materials near the workshop. Must communicate quantity and availability. Supports the mathematical language of quantity and comparison. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace |
| LOD Count | 2 |
| Max Tri Count | 400 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | Mesh |
| Culling Group | Workshop |
| Scale Range | 0.8–1.2 |
| Density Limit | 3 |
| Placement Rule | Workshop Layout |
| Acceptance Gate | Production Slice Gate |

### 12.6 Staging Area

| Field | Value |
|---|---|
| AssetID | BV_WKS_STAGE_001 |
| Category | Workshop |
| Subcategory | Staging Area |
| Description | A designated area where the player can arrange materials before construction. Supports the arrange, compare, and test verbs. Must be clearly readable as an interaction zone. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace |
| LOD Count | 1 |
| Max Tri Count | 200 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | Mesh |
| Culling Group | Workshop |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Workshop Layout |
| Acceptance Gate | Production Slice Gate |

### 12.7 Workshop Props

| Field | Value |
|---|---|
| AssetID | BV_WKS_PROPS_001 |
| Category | Workshop |
| Subcategory | Workshop Props |
| Description | Small props adding life and storytelling to the workshop: measuring tools, half-finished projects, blueprints, ropes, buckets, and craft debris. Must not clutter interaction zones. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace |
| LOD Count | 1 |
| Max Tri Count | 150 (per prop) |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 512×512 |
| Collision Type | None |
| Culling Group | Workshop |
| Scale Range | 0.6–1.0 |
| Density Limit | 8 |
| Placement Rule | Workshop Layout |
| Acceptance Gate | Production Slice Gate |

## 13 Gameplay Readability Assets

### 13.1 Interaction Markers

| Field | Value |
|---|---|
| AssetID | BV_READY_INTERACT_001 |
| Category | Gameplay Readability |
| Subcategory | Interaction Markers |
| Description | Visual indicators showing where the player can interact with the world. Must be readable without UI overlays. Uses material, color, or subtle animation to communicate interactability. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | 50 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 256×256 |
| Collision Type | None |
| Culling Group | Readability |
| Scale Range | 0.5–1.0 |
| Density Limit | 5 per zone |
| Placement Rule | Interaction Zone Placement |
| Acceptance Gate | Production Slice Gate |

### 13.2 Placement Zones

| Field | Value |
|---|---|
| AssetID | BV_READY_PLACE_001 |
| Category | Gameplay Readability |
| Subcategory | Placement Zones |
| Description | Defined areas where the player can place materials or constructed elements. Must communicate valid placement through surface treatment, boundary definition, or ground marking. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace, Bridge Crossing |
| LOD Count | 1 |
| Max Tri Count | 100 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 256×256 |
| Collision Type | Mesh |
| Culling Group | Readability |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 3 per zone |
| Placement Rule | Interaction Zone Placement |
| Acceptance Gate | Production Slice Gate |

### 13.3 Navigation Cues

| Field | Value |
|---|---|
| AssetID | BV_READY_NAV_001 |
| Category | Gameplay Readability |
| Subcategory | Navigation Cues |
| Description | Subtle environmental cues that guide the player along the intended route. Includes path surface contrast, sightline framing, landmark visibility, and directional vegetation gaps. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | N/A (environmental) |
| Max Draw Calls | 0 (integrated into other assets) |
| Material Slots | N/A |
| Texture Resolution | N/A |
| Collision Type | None |
| Culling Group | Readability |
| Scale Range | N/A |
| Density Limit | N/A |
| Placement
### 13.4 State Indicators

| Field | Value |
|---|---|
| AssetID | BV_READY_STATE_001 |
| Category | Gameplay Readability |
| Subcategory | State Indicators |
| Description | Visual indicators showing the state of interactive objects: incomplete, in-progress, complete, damaged, or repaired. Must use material, color, or form changes rather than UI overlays. |
| Lifecycle | PLANNED |
| Zone | Bridge Crossing, Workshop Terrace |
| LOD Count | 1 |
| Max Tri Count | 80 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 256�256 |
| Collision Type | None |
| Culling Group | Readability |
| Scale Range | 0.5�1.0 |
| Density Limit | 5 per zone |
| Placement Rule | Interaction Zone Placement |
| Acceptance Gate | Production Slice Gate |

### 13.5 Safe Zone Boundaries

| Field | Value |
|---|---|
| AssetID | BV_READY_SAFE_001 |
| Category | Gameplay Readability |
| Subcategory | Safe Zone Boundaries |
| Description | Subtle visual or surface treatment defining safe traversal areas versus terrain the player should not enter. Must be readable without breaking immersion. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | 50 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 256�256 |
| Collision Type | None |
| Culling Group | Readability |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 per zone boundary |
| Placement Rule | Composition Layout |
| Acceptance Gate | Production Slice Gate |

## 14 Landmark Assets

### 14.1 Bridge Crossing (Primary Landmark)

| Field | Value |
|---|---|
| AssetID | BV_LM_BRIDGE_001 |
| Category | Landmark |
| Subcategory | Bridge Crossing |
| Description | The primary landmark of Builder'\''s Valley. A handcrafted bridge spanning the river corridor. Must be recognizable from a distance and remain visually dominant without becoming oversized. Meaning: connection through structure. |
| Lifecycle | PLANNED |
| Zone | Bridge Crossing |
| LOD Count | 3 |
| Max Tri Count | 8,000 (combined assembly) |
| Max Draw Calls | 4 |
| Material Slots | 3 (timber, stone, rope/metal) |
| Texture Resolution | 2048�2048 |
| Collision Type | Mesh |
| Culling Group | Landmark |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

### 14.2 Workshop Terrace (Secondary Landmark)

| Field | Value |
|---|---|
| AssetID | BV_LM_WORKSHOP_001 |
| Category | Landmark |
| Subcategory | Workshop Terrace |
| Description | The secondary landmark of Builder'\''s Valley. The workshop terrace is the center of human craft. Must feel used and useful � a place where understanding becomes craft. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace |
| LOD Count | 3 |
| Max Tri Count | 6,000 (combined assembly) |
| Max Draw Calls | 3 |
| Material Slots | 2 (timber, stone) |
| Texture Resolution | 2048�2048 |
| Collision Type | Mesh |
| Culling Group | Landmark |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

### 14.3 Waterfall Vista (Natural Anchor)

| Field | Value |
|---|---|
| AssetID | BV_LM_WATERFALL_001 |
| Category | Landmark |
| Subcategory | Waterfall Vista |
| Description | The natural anchor of the valley. Establishes depth, direction, and the flow of systems through the world. Must be readable from the Arrival Overlook and throughout the River Corridor. |
| Lifecycle | PLANNED |
| Zone | Waterfall Vista |
| LOD Count | 3 |
| Max Tri Count | 3,000 (combined assembly) |
| Max Draw Calls | 3 |
| Material Slots | 2 (water, rock) |
| Texture Resolution | 1024�1024 |
| Collision Type | None |
| Culling Group | Landmark |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

### 14.4 Arrival Overlook (Orientation Landmark)

| Field | Value |
|---|---|
| AssetID | BV_LM_ARRIVAL_001 |
| Category | Landmark |
| Subcategory | Arrival Overlook |
| Description | The player'\''s first view of Builder'\''s Valley. Must establish the full composition: river corridor, bridge, waterfall, workshop terrace, and surrounding terrain. Serves as orientation and emotional arrival. |
| Lifecycle | PLANNED |
| Zone | Arrival Path |
| LOD Count | 2 |
| Max Tri Count | 500 (viewpoint structure) |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 1024�1024 |
| Collision Type | Mesh |
| Culling Group | Landmark |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

## 15 FX Assets

### 15.1 Water Surface Ripple

| Field | Value |
|---|---|
| AssetID | BV_FX_RIPPLE_001 |
| Category | FX |
| Subcategory | Water Surface Ripple |
| Description | Subtle ripple effects on the river surface. Must communicate water flow direction and movement without visual noise. |
| Lifecycle | PLANNED |
| Zone | River Corridor |
| LOD Count | 1 |
| Max Tri Count | 200 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 256�256 |
| Collision Type | None |
| Culling Group | FX |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 per river segment |
| Placement Rule | Water Layout |
| Acceptance Gate | Production Slice Gate |

### 15.2 Waterfall Mist

| Field | Value |
|---|---|
| AssetID | BV_FX_MIST_001 |
| Category | FX |
| Subcategory | Waterfall Mist |
| Description | Mist particles at the base of the waterfall. Must add atmospheric depth without obscuring gameplay-critical visibility. |
| Lifecycle | PLANNED |
| Zone | Waterfall Vista |
| LOD Count | 1 |
| Max Tri Count | 300 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 256�256 |
| Collision Type | None |
| Culling Group | FX |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 |
| Placement Rule | Landmark Placement |
| Acceptance Gate | Production Slice Gate |

### 15.3 Waterfall Foam

| Field | Value |
|---|---|
| AssetID | BV_FX_FOAM_001 |
| Category | FX |
| Subcategory | Waterfall Foam |
| Description | Foam and churning water effects at the waterfall base and along rapid sections. Must communicate water energy and movement. |
| Lifecycle | PLANNED |
| Zone | Waterfall Vista, River Corridor |
| LOD Count | 1 |
| Max Tri Count | 400 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 256�256 |
| Collision Type | None |
| Culling Group | FX |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 per rapid zone |
| Placement Rule | Water Layout |
| Acceptance Gate | Production Slice Gate |

### 15.4 Dust Particles

| Field | Value |
|---|---|
| AssetID | BV_FX_DUST_001 |
| Category | FX |
| Subcategory | Dust Particles |
| Description | Subtle dust motes in sunlit areas of the valley. Adds atmospheric warmth and depth without distracting from gameplay. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | 100 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 128�128 |
| Collision Type | None |
| Culling Group | FX |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 per zone |
| Placement Rule | Atmospheric Placement |
| Acceptance Gate | Production Slice Gate |

### 15.5 Light Shafts

| Field | Value |
|---|---|
| AssetID | BV_FX_SHAFTS_001 |
| Category | FX |
| Subcategory | Light Shafts |
| Description | Volumetric light shafts through the canopy and valley openings. Must support composition hierarchy and emotional warmth without reducing readability. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | 200 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 256�256 |
| Collision Type | None |
| Culling Group | FX |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 2 per zone |
| Placement Rule | Atmospheric Placement |
| Acceptance Gate | Production Slice Gate |

### 15.6 Firefly Ambient

| Field | Value |
|---|---|
| AssetID | BV_FX_FIREFLY_001 |
| Category | FX |
| Subcategory | Firefly Ambient |
| Description | Small ambient light particles near water and vegetation edges. Adds life and warmth to the valley atmosphere. Must remain subtle and not distract from interaction. |
| Lifecycle | PLANNED |
| Zone | River Corridor, Workshop Terrace |
| LOD Count | 1 |
| Max Tri Count | 50 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 64�64 |
| Collision Type | None |
| Culling Group | FX |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 emitter per zone |
| Placement Rule | Atmospheric Placement |
| Acceptance Gate | Production Slice Gate |

### 15.7 Leaf Fall

| Field | Value |
|---|---|
| AssetID | BV_FX_LEAF_001 |
| Category | FX |
| Subcategory | Leaf Fall |
| Description | Occasional falling leaves from canopy trees. Adds seasonal atmosphere and gentle movement to the environment. Must not obstruct gameplay view. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | 1 |
| Max Tri Count | 50 |
| Max Draw Calls | 1 |
| Material Slots | 1 |
| Texture Resolution | 64�64 |
| Collision Type | None |
| Culling Group | FX |
| Scale Range | 1:1 (non-scalable) |
| Density Limit | 1 emitter per zone |
| Placement Rule | Atmospheric Placement |
| Acceptance Gate | Production Slice Gate |

## 16 Ambient Audio Assets

### 16.1 River Flow

| Field | Value |
|---|---|
| AssetID | BV_AUDIO_RIVER_001 |
| Category | Ambient Audio |
| Subcategory | River Flow |
| Description | Continuous river flow audio for the River Corridor zone. Must communicate direction, scale, and movement. Spatialized along the river path. |
| Lifecycle | PLANNED |
| Zone | River Corridor |
| LOD Count | N/A |
| Max Tri Count | N/A |
| Max Draw Calls | N/A |
| Material Slots | N/A |
| Texture Resolution | N/A |
| Collision Type | N/A |
| Culling Group | Audio |
| Scale Range | N/A |
| Density Limit | 1 audio source per segment |
| Placement Rule | Audio Zone Placement |
| Acceptance Gate | Production Slice Gate |

### 16.2 Waterfall Distant

| Field | Value |
|---|---|
| AssetID | BV_AUDIO_FALL_DIST_001 |
| Category | Ambient Audio |
| Subcategory | Waterfall Distant |
| Description | Distant waterfall rumble audible from the Arrival Overlook and upper River Corridor. Must establish the presence of the waterfall before it is visible. |
| Lifecycle | PLANNED |
| Zone | Arrival Path, River Corridor |
| LOD Count | N/A |
| Max Tri Count | N/A |
| Max Draw Calls | N/A |
| Material Slots | N/A |
| Texture Resolution | N/A |
| Collision Type | N/A |
| Culling Group | Audio |
| Scale Range | N/A |
| Density Limit | 1 audio source |
| Placement Rule | Audio Zone Placement |
| Acceptance Gate | Production Slice Gate |

### 16.3 Waterfall Close

| Field | Value |
|---|---|
| AssetID | BV_AUDIO_FALL_CLOSE_001 |
| Category | Ambient Audio |
| Subcategory | Waterfall Close |
| Description | Close-range waterfall audio at the Waterfall Vista. Must communicate power, scale, and immersion. Louder and more detailed than the distant variant. |
| Lifecycle | PLANNED |
| Zone | Waterfall Vista |
| LOD Count | N/A |
| Max Tri Count | N/A |
| Max Draw Calls | N/A |
| Material Slots | N/A |
| Texture Resolution | N/A |
| Collision Type | N/A |
| Culling Group | Audio |
| Scale Range | N/A |
| Density Limit | 1 audio source |
| Placement Rule | Audio Zone Placement |
| Acceptance Gate | Production Slice Gate |

### 16.4 Wind Through Valley

| Field | Value |
|---|---|
| AssetID | BV_AUDIO_WIND_001 |
| Category | Ambient Audio |
| Subcategory | Wind Through Valley |
| Description | Gentle wind audio passing through the valley. Must vary by zone and elevation. Adds atmospheric depth without becoming repetitive. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | N/A |
| Max Tri Count | N/A |
| Max Draw Calls | N/A |
| Material Slots | N/A |
| Texture Resolution | N/A |
| Collision Type | N/A |
| Culling Group | Audio |
| Scale Range | N/A |
| Density Limit | 1 audio source per zone |
| Placement Rule | Audio Zone Placement |
| Acceptance Gate | Production Slice Gate |

### 16.5 Workshop Activity

| Field | Value |
|---|---|
| AssetID | BV_AUDIO_WORKSHOP_001 |
| Category | Ambient Audio |
| Subcategory | Workshop Activity |
| Description | Subtle workshop ambient audio: soft hammering, material shifting, and craft activity. Must communicate that the workshop is alive and used. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace |
| LOD Count | N/A |
| Max Tri Count | N/A |
| Max Draw Calls | N/A |
| Material Slots | N/A |
| Texture Resolution | N/A |
| Collision Type | N/A |
| Culling Group | Audio |
| Scale Range | N/A |
| Density Limit | 1 audio source |
| Placement Rule | Audio Zone Placement |
| Acceptance Gate | Production Slice Gate |

### 16.6 Bird Layer

| Field | Value |
|---|---|
| AssetID | BV_AUDIO_BIRDS_001 |
| Category | Ambient Audio |
| Subcategory | Bird Layer |
| Description | Occasional bird calls and songs appropriate to a warm river valley. Must add life without becoming repetitive or distracting. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | N/A |
| Max Tri Count | N/A |
| Max Draw Calls | N/A |
| Material Slots | N/A |
| Texture Resolution | N/A |
| Collision Type | N/A |
| Culling Group | Audio |
| Scale Range | N/A |
| Density Limit | 1 audio source per zone |
| Placement Rule | Audio Zone Placement |
| Acceptance Gate | Production Slice Gate |

### 16.7 Insect Layer

| Field | Value |
|---|---|
| AssetID | BV_AUDIO_INSECTS_001 |
| Category | Ambient Audio |
| Subcategory | Insect Layer |
| Description | Subtle insect ambient audio (crickets, cicadas) for warm-season atmosphere. Must remain in the background and not compete with gameplay audio. |
| Lifecycle | PLANNED |
| Zone | All Zones |
| LOD Count | N/A |
| Max Tri Count | N/A |
| Max Draw Calls | N/A |
| Material Slots | N/A |
| Texture Resolution | N/A |
| Collision Type | N/A |
| Culling Group | Audio |
| Scale Range | N/A |
| Density Limit | 1 audio source per zone |
| Placement Rule | Audio Zone Placement |
| Acceptance Gate | Production Slice Gate |

### 16.8 Material Handling

| Field | Value |
|---|---|
| AssetID | BV_AUDIO_MATERIAL_001 |
| Category | Ambient Audio |
| Subcategory | Material Handling |
| Description | Audio for player material interaction: picking up, placing, and arranging construction materials. Must communicate weight, material type, and placement accuracy. |
| Lifecycle | PLANNED |
| Zone | Workshop Terrace, Bridge Crossing |
| LOD Count | N/A |
| Max Tri Count | N/A |
| Max Draw Calls | N/A |
| Material Slots | N/A |
| Texture Resolution | N/A |
| Collision Type | N/A |
| Culling Group | Audio |
| Scale Range | N/A |
| Density Limit | 1 audio source per interaction zone |
| Placement Rule | Audio Zone Placement |
| Acceptance Gate | Production Slice Gate |
