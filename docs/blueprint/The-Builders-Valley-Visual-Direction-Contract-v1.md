# The Builder’s Valley — Visual Direction Contract v1

**Status:** ARCHITECT DRAFT — AWAITING HUMAN APPROVAL  
**Product:** Math Learning World  
**Visual Identity:** 2D 3/4 Top-down Pixel Sandbox  
**Scope:** Art direction and production rules for the first playable valley  
**Authority:** Extends the Product Blueprint and Vertical Slice Contract without changing world, game, or mathematical rules.

---

## 1. Decision

Math Learning World will use a **2D 3/4 Top-down Pixel Sandbox** presentation.

The camera looks downward while still showing the front faces, height, and volume of characters, resources, blocks, furniture, machines, and buildings. It is not a flat technical top view, an isometric diamond grid, a side-view platformer, or simulated 3D.

This decision is intended to combine:

- the readability and production cost of 2D;
- the spatial freedom of a sandbox;
- enough visual depth to make construction feel tangible;
- visible characters and customization;
- an asset pipeline that can scale without coupling learning semantics to art.

---

## 2. Experience Target

The first polished frame must communicate, without explanatory text:

1. **I can move through this world.**
2. **I can touch, collect, use, place, and remove these objects.**
3. **The things I build remain mine.**
4. **The world is alive beyond the learning mechanic.**
5. **This is a game, not a worksheet wearing game colors.**

The visual tone must be welcoming to a younger learner without appearing infantile to an early secondary learner.

---

## 3. Camera and Spatial Contract

### 3.1 Camera

- Orthographic 2D camera.
- 3/4 top-down presentation with visible front faces.
- No perspective convergence.
- Camera follows the player smoothly but does not change world truth.
- Camera zoom may change presentation only; interaction distances remain world-space rules.
- The player should normally see enough surrounding space to choose a direction and form a construction plan.

### 3.2 Grid

- Authoritative logical grid: **32 × 32 world units per ground cell**.
- Construction, collision, path connectivity, evidence, and mathematical length refer to logical cells/world units—not sprite pixels.
- Ground uses a rectangular grid, not an isometric diamond grid.
- Tall sprites may extend above their anchor cell.
- Standard object anchor: bottom-center at the object’s contact point with the ground.

### 3.3 Depth

- World objects use Y-based depth sorting from their ground-contact anchor.
- Tall objects may visually overlap actors behind them.
- Occlusion must never make the player’s location or selected interaction target unreadable.
- Roofs, tree canopies, and tall walls must support fade, cutaway, or hide rules when they obstruct active play.
- HUD, selection previews, and accessibility cues are separate from world depth.

---

## 4. Pixel and Scale Contract

### 4.1 Native Scale

- Base ground tile: **32 × 32 px** at 1× authoring scale.
- Default character footprint: one logical cell or smaller.
- Default character sprite frame: **32 × 48 px**; exceptional equipment or animation may exceed the frame through a documented envelope.
- Common resource props:
  - small: 16–32 px footprint;
  - standard: 32 × 32 px footprint;
  - tall: 32 × 48–64 px visual envelope;
  - large structures: modular multiples of 32 px.

### 4.2 Rendering

- Integer display scaling whenever practical.
- Nearest-neighbor filtering.
- No smoothing that blurs pixel edges.
- Subpixel camera movement may be used internally only if final rendering remains visually stable.
- Mixed-resolution assets are prohibited unless deliberately normalized by the asset pipeline.

### 4.3 Shape Language

- Strong silhouettes before internal detail.
- One object must remain recognizable at normal gameplay zoom.
- Tools and materials require distinct silhouette, value, and texture—not color alone.
- Decorative detail must not compete with interaction targets.
- Avoid excessive outlines on terrain; use outlines selectively for characters, portable items, and interaction emphasis.

---

## 5. Palette and Lighting Contract

### 5.1 Palette

- Use a controlled shared palette with material-specific color ramps.
- The initial environment should target approximately **32–48 core colors**, with documented extensions for effects and accessibility.
- Each material family needs a stable identity:
  - wood: warm, fibrous, organic;
  - stone: cool/neutral, hard, faceted;
  - soil: warm, granular;
  - grass: living green with terrain variation;
  - water: cool, transparent/reflective motion;
  - metal: higher-value contrast and controlled highlights.
- Gameplay meaning may not depend on hue alone.

### 5.2 Lighting

- Initial production baseline: clear daytime.
- Consistent light direction: upper-left unless a scene explicitly declares another source.
- Contact shadows ground characters and objects.
- Shadows communicate height and placement but do not alter collision truth.
- Day/night variation is deferred until daytime readability is approved.

### 5.3 Effects

Minimum effect families:

- footsteps/dust;
- tool impact;
- wood chips;
- stone fragments;
- pickup motion;
- placement puff/snap;
- invalid-placement cue;
- water ripple/splash;
- construction completion accent.

Effects must be brief, readable, and reusable across objects.

---

## 6. Character Contract

The production character must support:

- idle, walk, and run in four directions;
- carry/held-item presentation;
- gather/chop;
- mine;
- place/build;
- remove;
- pickup;
- celebrate or acknowledge success;
- hit reaction without combat semantics;
- visible customization layers later.

Character design rules:

- age-neutral heroic proportions rather than toddler proportions;
- readable head, hands, tool, and facing direction;
- expressive motion with minimal frames;
- equipment layers must not require redrawing the entire base body;
- skin tone, hair, clothing, and accessories must be separable production concerns;
- no gendered gameplay capability.

Initial animation target:

| Action | Directions | Minimum frames |
| --- | ---: | ---: |
| Idle | 4 | 2 |
| Walk | 4 | 4 |
| Run | 4 | 4 |
| Tool use | 4 | 4 |
| Place/remove | 4 | 3 |
| Pickup/celebrate | 4 or reusable | 3 |

These are production targets, not mathematical or runtime invariants.

---

## 7. Environment and Construction Kit

### 7.1 Terrain

The first kit contains:

- grass variants and transitions;
- soil and disturbed soil;
- stone ground;
- shallow/deep water distinction;
- banks and shore transitions;
- paths;
- ambient ground details;
- shadow overlays.

Terrain requires edge, corner, inner-corner, and transition coverage sufficient to avoid obvious rectangular stamping.

### 7.2 Resources

At minimum:

- 2–3 tree silhouettes;
- fallen wood/log;
- 2–3 stone deposit silhouettes;
- loose collectible wood and stone;
- later-ready visual hooks for ore and metal.

Resource state must be visible:

- untouched;
- targeted;
- receiving impact;
- depleted/removed;
- dropped collectible.

### 7.3 Construction Modules

The first modular kit contains:

- wood floor/block;
- stone floor/block;
- beam;
- support/post;
- wall with visible front face;
- corner and end caps;
- bridge/path segment;
- removal/ghost state.

Every module must declare:

- logical footprint;
- anchor;
- collision shape;
- connectivity points;
- material;
- walkability;
- visual variants;
- damaged/removed behavior if applicable.

Art does not determine these rules; it visualizes authoritative metadata.

---

## 8. UI and Visual Language

- Hotbar remains permanently readable without dominating the world.
- Inventory uses item silhouettes plus quantity.
- Selected tool/item has a strong frame and held-item confirmation.
- Valid placement: positive ghost with clear snap.
- Invalid placement: distinct shape/pattern and restrained motion; not a punitive red failure screen.
- Interaction range and target cues appear in world space.
- Mathematical tools use the same visual language as construction tools.
- Text is supportive and minimal; icons and spatial feedback carry primary meaning.
- Thai and future languages must fit without redesigning core HUD geometry.

---

## 9. Mathematical Visual Contract

Mathematics appears through world relationships:

- length is visible as world-aligned span;
- equal parts share physical scale;
- split/join preserves the visible whole;
- snap points show correspondence;
- measuring tools overlay the construction;
- symbols may label an observed relationship after interaction;
- no separate worksheet scene is introduced.

Colors, animation IDs, sprite names, and screen coordinates are never mathematical truth or learning evidence.

---

## 10. Asset Production Contract

### 10.1 Source Structure

Each production asset family must have:

- source file;
- exported runtime atlas/spritesheet;
- metadata manifest;
- preview sheet;
- license/provenance record;
- version;
- named owner or generating workflow.

Suggested repository layout:

```text
frontend/assets/
  source/
    characters/
    terrain/
    resources/
    construction/
    effects/
    ui/
  runtime/
    atlases/
    tilesets/
    audio/
  manifests/
  previews/
  licenses/
```

### 10.2 Naming

Use stable semantic names, for example:

- `terrain.grass.base.01`
- `resource.tree.oak.mature.01`
- `construction.wood.beam.horizontal.01`
- `character.base.walk.south.01`
- `effect.impact.stone.01`

Runtime logic may request semantic asset IDs but must not infer game rules from filenames.

### 10.3 Mass Production Template

Every new asset brief must specify:

- family and semantic ID;
- native dimensions;
- anchor;
- logical footprint;
- view/facing;
- palette ramps;
- lighting direction;
- outline policy;
- required states/animations;
- adjacency or modular rules;
- export format;
- provenance/license;
- comparison against approved reference sheet.

No asset is production-ready solely because it looks attractive in isolation.

---

## 11. External and AI Asset Policy

- Search-result previews are inspiration, not reusable source files.
- Assets require explicit compatible licenses or original ownership.
- Shutterstock and similar marketplaces are not “free” merely because images are visible in search.
- Purchased packs may accelerate production only after license, redistribution, modification, and team-use terms are recorded.
- AI-assisted assets require human art direction, cleanup, consistency review, and provenance notes.
- Direct imitation of Minecraft, Stardew Valley, Terraria, or another identifiable game is prohibited.
- The goal is a coherent original Math Learning World visual identity.

---

## 12. First Art Vertical Slice

The first art slice replaces only a compact portion of the Graybox and must show:

- one finished player character;
- grass, soil, bank, and water;
- one tree family;
- one stone family;
- wood and stone collectibles;
- wood and stone placed blocks;
- hotbar and held-item state;
- one gather animation;
- one placement animation;
- contact shadows;
- dust, impact, pickup, placement, and water effects;
- one harmless ambient creature.

The existing movement, collision, collection, inventory, and placement rules remain authoritative.

This slice must prove:

1. a child wants to touch and explore the scene;
2. the style works for both intended family testers;
3. a second asset can be produced from the same contract without visual drift;
4. art replacement does not change domain or learning behavior.

---

## 13. Acceptance Gates

### Repository Gate

- visual contract stored beside the Builder’s Valley contract;
- no backend, Prisma, migration, or learning-rule change;
- all dimensions, anchors, naming, licensing, and production boundaries documented.

### Runtime Gate

- nearest-neighbor and pixel scale remain stable;
- Y-sort and occlusion behave correctly;
- replacement assets do not change collision or interaction;
- production build succeeds.

### Human Visual Gate

Observe without explaining:

- player identifies the character;
- player distinguishes tree, stone, wood, water, and placed materials;
- player recognizes selected tool and placement state;
- player can tell what is walkable;
- player expresses curiosity or initiates interaction;
- neither tester describes the presentation as a worksheet or “เกมเด็กเล็ก”;
- tester can identify newly produced assets as belonging to the same world.

---

## 14. Failure Conditions

The direction fails if:

- the scene still reads as an educational app before it reads as a game;
- normal gameplay zoom cannot distinguish key objects;
- depth sorting makes position ambiguous;
- art changes collision, mathematical length, or evidence meaning;
- assets depend on color alone;
- each new object requires a new unrepeatable visual style;
- purchased or generated assets lack provenance;
- decoration overwhelms interaction;
- visual polish hides an incomplete sandbox loop.

---

## 15. Delivery Sequence

1. Approve this Visual Direction Contract.
2. Build one reference board: palette, scale, character, terrain, resource, block, UI, and effects.
3. Produce one character movement/tool-use sheet.
4. Produce the minimum terrain and material kit.
5. Integrate assets into the existing Graybox without changing game rules.
6. Verify Y-sort, anchors, collision alignment, and pixel stability.
7. Run the Human Visual Gate with both family testers.
8. Correct the style and production template.
9. Declare Art Direction v1 reusable.
10. Expand the asset library only after the reference slice passes.

---

## 16. Approval Record

Human approval must confirm:

- 2D 3/4 Top-down Pixel Sandbox as the production direction;
- 32 × 32 logical/pixel base tile;
- rectangular grid with bottom-center anchors and Y-sort;
- age-neutral, non-infantile character direction;
- consistent daytime upper-left lighting baseline;
- semantic asset IDs and provenance records;
- one Art Vertical Slice before mass production;
- graphics remain presentation, never mathematical truth.
