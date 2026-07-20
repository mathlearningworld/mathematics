# Production Environment Slice 001 — Scene Blueprint

## Hero shot

The slice uses one locked hero composition for art review.

```text
┌──────────────────────────────────────────────────────┐
│ Dark forest frame      Waterfall / river source      │
│        Cliff shelves and vegetation masses          │
│                                                      │
│ West bank      Finished bridge       Workshop yard  │
│ rocks/path    player traversal      bench/shelter    │
│                                                      │
│ Foreground reeds, bushes, stones and water detail    │
└──────────────────────────────────────────────────────┘
```

## Camera authority

- Preserve the existing top-down gameplay readability.
- Compose for the current 960 × 540 runtime viewport.
- Hero area should occupy one camera frame without requiring the viewer to imagine missing scenery.
- The bridge crosses the middle third of the frame.
- The river establishes a strong vertical axis.
- The workshop occupies the upper-right third.
- Darker vegetation and cliff masses frame the upper and side edges.
- The lower-center remains readable for the player and HUD.

## Massing plan

### Mass A — River canyon

- approximately 28–34% of the visible width,
- irregular bank silhouette,
- upstream narrowing toward waterfall,
- deeper blue-green central channel,
- bright turbulence at waterfall and obstacles,
- bridge shadow aligned to structural supports.

### Mass B — West natural bank

- dense trees and rocks,
- one readable approach path,
- a small material staging area,
- foreground bush and reed overlap,
- no empty rectangular lawn.

### Mass C — East workshop terrace

- compact raised or visually bounded work area,
- workshop shelter or canopy,
- workbench as primary prop,
- material storage triangle around the bench,
- path joining bridge to workshop,
- cliff or rock transition behind the terrace.

### Mass D — Bridge

- clear deck silhouette,
- plank rhythm,
- posts at structural intervals,
- side rails with open visibility,
- visible underside/support beam,
- asymmetrical repair marks,
- one warm lantern focal point and one quieter supporting light.

## Palette distribution

- 45% natural greens and moss values,
- 20% cool river blues and cyan highlights,
- 15% stone and soil neutrals,
- 12% warm wood,
- 5% dark framing values,
- 3% gold light and interaction accents.

Gold must remain scarce so the selected action and meaningful discoveries retain authority.

## Terrain construction

The hero scene may not use one flat grass color as its dominant terrain solution.

Required terrain families:

- grass base variants,
- mossy grass,
- worn grass,
- dirt path,
- damp soil,
- stone bank,
- cliff face,
- cliff top,
- river-edge blend,
- workshop floor blend.

Transitions should use irregular masks and clustered decals rather than straight tile borders.

## Vegetation architecture

### Background vegetation

- tall tree masses,
- overlapping canopies,
- darker values,
- low animation amplitude.

### Midground vegetation

- readable tree trunks,
- bushes,
- flowers near paths,
- moss on stone,
- reeds near water.

### Foreground vegetation

- partial frame overlap,
- darker silhouettes,
- no obstruction of player-critical interactions.

## Water treatment

Minimum runtime treatment:

- animated highlight strips,
- slower deep-water drift,
- foam near banks and supports,
- waterfall animation,
- bridge shadow layer,
- subtle sparkle variation,
- darker values beneath the bridge.

## Bridge production kit

Required assets or render layers:

- deck plank set A/B/C,
- deck end caps,
- side rail segments,
- rope/fastening segments,
- main support posts,
- underside beam,
- repair plank,
- moss/wear overlay,
- nail/join overlay,
- cast shadow,
- water occlusion/shadow.

## Workshop production kit

Required assets or render layers:

- shelter/canopy,
- production-quality workbench,
- tool rack,
- stacked timber,
- stone/material storage,
- sacks/crates/barrels with size variation,
- worn ground overlays,
- wheel or drag marks,
- small repair props,
- one warm lamp.

## Interaction-safe zone

Maintain a clear visual corridor:

- across the full bridge deck,
- from east bridge exit to workshop center,
- around collectible trees and rocks,
- around placement preview cells.

The corridor can contain ground texture, shadows, and low details but not strong silhouettes that resemble interactable objects.

## Runtime decomposition

The final scene should be divided into reusable layers rather than one static full-screen image:

1. terrain base,
2. cliff and bank structures,
3. water base,
4. water animation/effects,
5. bridge structural back layer,
6. gameplay plane,
7. bridge foreground rail/details,
8. workshop props,
9. vegetation midground,
10. foreground framing,
11. lighting/color treatment,
12. HUD.

A temporary painted scene may be used as a visual target and alignment guide, but gameplay-critical runtime objects must remain independently addressable.

## Work packages

### PES-001A — Painted target frame

Create one production-quality target composition at the exact gameplay camera ratio.

### PES-001B — Terrain and river foundation

Replace the flat field in the hero frame with sculpted banks, cliff transitions, layered ground, and production water.

### PES-001C — Bridge production asset

Replace prototype bridge assembly with the completed bridge kit and correct layer behavior.

### PES-001D — Workshop production cluster

Complete the workshop terrace, shelter, props, and ground story.

### PES-001E — Vegetation, lighting and atmosphere

Add depth layers, coherent light, shadows, waterfall atmosphere, and edge framing.

### PES-001F — Gameplay integration and polish

Reintroduce resource readability, placement visibility, player overlap, performance checks, and regression evidence.

## Stop conditions

Do not expand to Village, Mine, Forest biome, NPCs, or Learning Engine until the hero frame passes production art review.
