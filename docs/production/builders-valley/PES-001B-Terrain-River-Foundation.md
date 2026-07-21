# PES-001B — Terrain and River Foundation

**Status:** CONTRACT READY — IMPLEMENTATION BLOCKED  
**Authority:** PCP-001 / VSC-001 / PES-001A  
**Activation gate:** PES-001A local runtime, interaction, and Creative Director frame approval  
**Repository branch:** `main`

## 1. Purpose

PES-001B converts the current straight prototype water corridor and repeated cliff-bank blockout into an authored terrain-and-river foundation that supports the Builders Valley hero frame.

The package must improve spatial composition and environmental readability without changing the gather → carry → place gameplay contract.

## 2. Current repository baseline

The existing hero slice currently owns:

- a full-height river base inside the fixed `STREAM` corridor;
- repeated horizontal current marks;
- a waterfall and gorge at the upper world edge;
- cliff-bank rock faces repeated at fixed vertical intervals;
- a visual bridge and workshop layered above the terrain;
- presentation-only composition offsets applied by `BuildersValleyCompositionPatch.js`.

Current implementation paths:

| Concern | Repository owner |
|---|---|
| World, tile, viewport and stream dimensions | `frontend/src/sandbox/config/worldContract.js` |
| Base world terrain and gameplay geometry | `frontend/src/sandbox/scenes/BuildersValleyScene.js` and `frontend/src/sandbox/art/pixelArtFactory.js` |
| River, waterfall and cliff-bank visual blockout | `frontend/src/sandbox/scenes/BuildersValleyHeroSlicePatch.js` |
| Camera and landmark composition | `frontend/src/sandbox/scenes/BuildersValleyCompositionPatch.js` |

## 3. Scope

PES-001B includes:

1. authored river silhouette inside the existing gameplay corridor;
2. readable shoreline transitions rather than one uninterrupted rectangle;
3. non-repeating left and right bank masses;
4. waterfall-to-river continuity;
5. terrain paths that visually connect the player plane, crossing and workshop;
6. controlled river-current rhythm that follows the water direction;
7. bank shadows, shallow-water accents and terrain-contact treatment;
8. repository inspection metadata for runtime evidence.

## 4. Explicit non-goals

PES-001B must not:

- move the player spawn;
- change world bounds;
- alter stream collision or crossing rules;
- move resource nodes;
- change pickup, carry, placement or hotbar behavior;
- add final bridge interaction states;
- add final workshop assets;
- introduce final lighting or atmospheric grading;
- expand the world beyond the Builders Valley vertical slice.

Any required gameplay-geometry change must stop this package and be proposed as a separate contract amendment.

## 5. Terrain grammar

### 5.1 Primary terrain planes

The environment must read as three connected planes:

- **Left gameplay plane:** player spawn, gathering and approach space;
- **River incision:** the strong vertical separator and leading line;
- **Right destination plane:** bridge exit, workshop approach and future expansion cue.

The river may bend visually, but these planes must remain readable at the reference viewport.

### 5.2 Shoreline rhythm

Each bank should use a controlled sequence of:

```text
broad mass
→ short recess
→ directional projection
→ calm transition near crossing
→ renewed mass
```

Left and right banks must not mirror one another. Repetition at a constant interval is prohibited in the approved frame.

### 5.3 Crossing protection zone

A protected composition zone must remain around the bridge anchor:

- no tall cliff mass blocking the deck silhouette;
- no high-frequency shoreline noise at the bridge ends;
- terrain paths must widen as they approach the crossing;
- contact shadows may strengthen the bridge foundation but must not obscure player readability.

## 6. River grammar

### 6.1 Water hierarchy

The river requires four visual layers:

1. deep-water base;
2. directional mid-current bands;
3. shallow bank transitions;
4. sparse foam or turbulence accents.

The layers must communicate downstream movement from waterfall to lower world without covering the scene in repeated stripes.

### 6.2 Waterfall continuity

The waterfall must visibly feed the same river system. The gorge, spray, turbulence and downstream currents should form one continuous visual sentence rather than separate decorative objects.

### 6.3 Current density

Current marks should be concentrated where water speed or obstruction implies movement. Calm sections need negative space. A uniform row pattern across the whole river is not acceptable for the production target.

## 7. Path and destination readability

Two terrain paths are required:

- player/gathering area → bridge approach;
- bridge exit → workshop cluster.

Paths are visual guidance, not hard rails. They should be expressed through terrain value, wear, edge vegetation and prop spacing while preserving free movement.

At the reference viewport, the player should be able to infer:

```text
I am here
→ resources are accessible here
→ the river divides the space
→ the bridge is the crossing
→ the workshop is the destination
```

## 8. Layer and ownership contract

PES-001B should introduce a terrain-and-river owner rather than continuing to enlarge a general hero-slice patch indefinitely.

Preferred ownership:

```text
frontend/src/sandbox/scenes/BuildersValleyTerrainRiverPatch.js
```

This module should own only:

- authored terrain support overlays;
- shoreline silhouettes;
- river visual layers;
- waterfall-to-river continuity treatment;
- terrain-path presentation;
- inspection metadata for this package.

`BuildersValleyHeroSlicePatch.js` remains the owner of the current bridge, workshop and framing-vegetation blockout until their dedicated packages replace them.

## 9. Runtime inspection contract

The implementation should expose a read-only inspection function under the existing Builders Valley runtime namespace:

```text
window.__BUILDERS_VALLEY__.getTerrainRiverFoundation()
```

Expected evidence fields:

- standard identifier;
- package status;
- reference viewport;
- river corridor bounds;
- crossing protection zone;
- path anchors;
- gameplay geometry changed flag;
- implementation owner.

The inspection API is evidence support only and must not become gameplay authority.

## 10. Acceptance gates

### Repository gate

- dedicated module ownership is clear;
- imports and patch load order are explicit;
- no gameplay contract files change without approval;
- repository diff contains only PES-001B scope;
- inspection metadata is available;
- documentation and implementation agree.

### Runtime gate

- application starts without console errors;
- river and terrain render correctly at 960 × 540;
- no visible seams or invalid depth ordering;
- pointer targeting and placement preview remain aligned;
- player can traverse all previously valid ground;
- frame rate and animation behavior remain acceptable.

### Composition gate

- river creates a clear leading line;
- waterfall, bridge and workshop remain readable together;
- banks no longer appear mechanically repeated;
- crossing space is visually protected;
- left and right terrain planes remain distinct.

### Gameplay gate

- gather → carry → place loop remains intact;
- resource nodes remain reachable;
- no new collision trap or false affordance is introduced;
- paths guide but do not constrain player agency.

### Creative Director gate

Required evidence:

- initial reference frame screenshot;
- bridge approach screenshot;
- workshop approach screenshot;
- before/after terrain comparison;
- concise notes for any intentional deviation from PCP-001.

## 11. Completion rule

PES-001B is complete only when:

```text
Repository PASS
+ Runtime PASS
+ Composition PASS
+ Gameplay PASS
+ Creative Director approval
```

A committed visual patch without local runtime evidence remains `IMPLEMENTATION STARTED`, not complete.

## 12. Next package boundary

After PES-001B approval, PES-001C may replace the bridge blockout with a modular production asset and explicit reconstruction-state readability. PES-001B must leave stable bank integration anchors for that work.
