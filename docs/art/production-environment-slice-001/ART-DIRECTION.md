# Production Environment Slice 001 — Art Direction

**Status:** ACTIVE PRODUCTION AUTHORITY  
**Owner:** Art Director / World Architect  
**Target:** Builders Valley bridge-and-workshop scene  
**Branch:** `art/production-environment-slice-001`

## Mission

Create one small playable scene whose screenshot carries the same emotional quality, visual density, depth, material richness, and authored composition as the approved Builders Valley concept image.

This is not a prototype-decoration pass. It is the first **production-quality environment vertical slice** and will establish the visual standard for later areas.

## Non-negotiable target

The runtime scene must feel:

- crafted rather than assembled,
- dense without becoming noisy,
- warm and adventurous,
- readable at gameplay scale,
- materially believable,
- visually layered from foreground through background,
- close in mood and finish to the approved concept image.

The concept image is a **quality target**, not merely a list of objects to copy.

## Core correction

Previous work improved the prototype through incremental props and patches. That proved the gameplay and asset-loading path, but it cannot reach the target quality by accumulating isolated sprites.

From this slice onward, the scene is designed as one authored composition first, then decomposed into reusable runtime layers.

## Scene frame

The production slice is limited to one camera composition containing:

1. river corridor,
2. waterfall or visible upstream source,
3. finished bridge landmark,
4. sculpted banks and cliff walls,
5. compact workshop yard,
6. layered vegetation,
7. environmental storytelling,
8. lighting and atmospheric treatment,
9. gameplay-safe traversal and interaction visibility.

No new gameplay feature is required.

## Visual hierarchy

The viewer should read the scene in this order:

1. river and bridge silhouette,
2. player and current interaction area,
3. workshop landmark,
4. cliff and vegetation framing,
5. secondary props and story details,
6. atmosphere and distant detail,
7. HUD.

The HUD must never become the strongest visual mass in the frame.

## Environment layer contract

### Background

- upper river source or waterfall,
- distant cliff faces,
- dark tree masses,
- atmospheric color separation.

### Midground

- bridge,
- workshop,
- river banks,
- primary trees and rocks,
- paths and construction areas.

### Gameplay plane

- player,
- collectible resources,
- placed blocks,
- clear walkable surfaces,
- interaction highlights.

### Foreground

- bushes,
- reeds,
- rock edges,
- partial occluders,
- dark framing shapes.

Foreground elements may overlap the lower portion of objects but must not hide critical interaction targets.

## Material language

### Wood

- visible plank variation,
- edge wear,
- warm upper-left highlights,
- dark structural undersides,
- nails, joins, repair marks,
- old and new timber contrast.

### Stone

- irregular silhouettes,
- clustered values rather than flat gray,
- moss and soil transitions,
- darker crevices,
- lighter top-facing planes.

### Water

- deep central body,
- lighter bank edges,
- moving highlights,
- foam near obstacles,
- bridge shadow,
- waterfall turbulence.

### Ground

- grass is not a flat field,
- paths blend into soil,
- soil blends into rock and vegetation,
- repeated tiles must be visually broken,
- every major prop receives contact detail.

## Lighting direction

Primary light: upper-left, warm daylight.

Required lighting effects:

- coherent contact shadows,
- darker river canyon values,
- warm bridge and workshop highlights,
- cool water contrast,
- subtle lantern warmth without night-time darkness,
- atmospheric darkening toward scene edges.

## Density rules

- No large empty grass rectangles in the hero frame.
- Every landmark requires primary, secondary, ground-transition, and story layers.
- Detail density may fall near the player path to preserve readability.
- Repeated props must vary in orientation, scale, value, or partial occlusion.
- Decorative detail must form clusters, not uniform random scatter.

## Bridge landmark requirements

The bridge is complete only when it has:

- readable deck planks,
- side rails that frame rather than block,
- structural supports,
- bank anchors,
- water shadow,
- repair history,
- rope or fastening detail,
- moss or weathering,
- clear traversal silhouette,
- coherent integration with cliff and river banks.

## Workshop requirements

The workshop must read as a working place through:

- workbench focal point,
- material storage,
- tool storage,
- wood and stone staging,
- worn ground,
- path connection,
- shelter or vertical structure,
- story details suggesting recent work.

## Production order

1. Compose the full scene as one visual target.
2. Lock camera and major masses.
3. Build terrain and river banks.
4. Complete bridge structure.
5. Ground the workshop.
6. Add vegetation layers.
7. Add lighting, shadow, and water effects.
8. Integrate gameplay objects.
9. Reduce noise around interaction paths.
10. Capture comparison evidence.

## Technical boundaries

Do not change:

- collect/place/recollect behavior,
- Intent-Aware Hotbar behavior,
- inventory semantics,
- resource semantics,
- collision rules unless a separate approved traversal contract is created,
- Learning Engine or mission logic.

Code changes are permitted only when required to render, layer, animate, or load approved production art correctly.

## Acceptance criteria

The slice passes Art Direction review when:

- a screenshot is recognizably in the same visual family as the concept image,
- the bridge no longer reads as assembled prototype sprites,
- terrain feels sculpted rather than tiled,
- the river has depth and motion,
- vegetation creates foreground, midground, and background separation,
- workshop and bridge feel embedded in the same landscape,
- player and resources remain readable,
- gameplay behavior is unchanged,
- the scene establishes reusable production standards.

## Evidence package

Required before approval:

- concept target image,
- current baseline screenshot,
- production slice screenshot at matching framing,
- short runtime capture showing movement across the scene,
- changed asset catalog,
- render-layer list,
- performance comparison,
- gameplay regression result.
