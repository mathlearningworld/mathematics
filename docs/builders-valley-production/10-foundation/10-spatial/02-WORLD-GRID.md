# Builders Valley World Grid

Status: Active Foundation Standard  
Authority: Builders Valley Production Bible

## 1. Purpose

The world grid provides deterministic placement, collision alignment, construction logic, and runtime reproducibility without forcing the visible world to look tiled or rectangular.

The grid is logical infrastructure. Geography remains the visible design authority.

## 2. Grid principles

- One world owner defines the canonical grid transform.
- Landmarks use local grids that map explicitly into world coordinates.
- Gameplay placement may snap to cells or sub-cells.
- Terrain silhouettes, rivers, paths, and cliff faces may visually deviate from cell boundaries.
- Logical alignment must not create visible repetition or mechanical-looking geography.

## 3. Spatial levels

### World grid

The stable global addressing system used to locate regions and landmarks.

### Region grid

A coarse partition for streaming, progression, ownership, and broad geographic planning.

### Landmark grid

A local coordinate frame used for terrain layout, path routing, construction zones, and screenshot reproducibility.

### Interaction grid

A finer deterministic layer used for placement, harvesting, collision, and learning activity interactions.

The exact unit ratios remain implementation decisions until runtime discovery confirms current engine scale. Those values must then be recorded here rather than inferred repeatedly from code.

## 4. Grid and terrain relationship

Terrain is authored from masses and cuts, not from exposed cell blocks.

The grid may guide:

- collision boundaries;
- bridge alignment;
- buildable surfaces;
- path connectivity;
- interaction reach;
- deterministic object placement.

The grid must not directly dictate:

- river silhouette;
- cliff contour;
- vegetation edge;
- horizon shape;
- final material boundary;
- decorative distribution.

## 5. Zone declaration

Every gameplay zone must declare:

- owning landmark;
- local origin;
- logical bounds;
- traversable bounds;
- buildable or interactable bounds;
- entry and exit connections;
- forbidden placement areas;
- camera-critical area;
- runtime owner.

Overlapping zones require an explicit priority rule. Accidental overlap between independent patches is prohibited.

## 6. Path connectivity

Paths are graph connections between meaningful spaces, not painted strips placed after terrain.

Each route must identify:

- origin zone;
- destination zone;
- terrain reason;
- width class;
- traversal constraints;
- landmark visibility along the route;
- connection owner.

A bridge route must cross an actual terrain cut. A mine path must lead toward a readable entrance. A decorative path with no navigational or gameplay purpose does not pass.

## 7. Construction alignment

Construction systems may use snapping, but visible placement should preserve natural variation where gameplay allows it.

Required distinctions:

- Structural anchors use deterministic grid positions.
- Player-placeable objects use valid placement cells or sockets.
- Environmental props may use authored offsets within controlled areas.
- Terrain dressing must not create false interaction affordances.

## 8. Runtime migration rule

Before changing grid size, origin, or axis mapping, the executor must identify:

- current runtime unit scale;
- all coordinate owners;
- saved-state dependencies;
- collision dependencies;
- camera dependencies;
- object-placement dependencies;
- tests and screenshots affected.

No silent grid migration is allowed.

## 9. Acceptance criteria

The world grid passes when:

- every landmark has one local grid and one transform to world space;
- logical placement remains deterministic;
- paths connect meaningful zones;
- visible terrain does not expose rectangular grid structure unintentionally;
- no independent patch creates a competing grid origin;
- construction and interaction rules can be verified without using decorative geometry as authority;
- runtime scale decisions are documented after discovery.

## 10. Deferred values

The following values are deliberately deferred until repository and runtime inspection:

- engine units per world cell;
- interaction sub-cell ratio;
- region dimensions;
- landmark bounding sizes;
- streaming chunk size;
- navigation resolution.

These are not permission to guess. They are required discovery outputs before implementation changes.