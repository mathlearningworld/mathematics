# Bridge Crossing — Asset Rules

## Purpose

This contract defines how Bridge Crossing may use landmark-specific assets without weakening global world consistency or creating duplicate runtime ownership.

Assets must support mission readability, terrain structure, scale, and gameplay state. They must not become the source of truth for the landmark contract.

## Asset Categories

### Structural Assets

Examples include bridge decks, beams, posts, supports, ropes, rails, foundations, and anchor structures.

Structural assets must:

- align with the approved terrain span;
- communicate believable support and load paths;
- match player and route scale;
- expose clear incomplete and completed states where required;
- remain compatible with visible and operational collision surfaces.

### Gameplay Assets

Examples include construction points, resource placements, repair targets, activation devices, and mathematical interaction surfaces.

Gameplay assets must:

- communicate affordance through form and placement;
- remain owned by the Bridge Crossing gameplay module;
- avoid becoming generic shared workflow components unless proven to be neutral primitives;
- preserve state consistency after interruption, reload, and completion.

### Environmental Assets

Examples include trees, rocks, grasses, water details, signs, debris, tools, and settlement traces.

Environmental assets must:

- strengthen spatial storytelling;
- reinforce route boundaries and destination value;
- respect foreground, midground, and background hierarchy;
- remain subordinate to the crossing problem.

## Material Rules

Bridge Crossing must use approved global material families wherever possible.

Landmark-specific material variation is permitted only when it expresses:

- construction state;
- age or damage;
- environmental exposure;
- gameplay feedback;
- local cultural or narrative identity.

A new material family requires an explicit Foundation-level decision when it is intended for reuse beyond this landmark.

## Color Rules

- Structural readability must not rely on saturation alone.
- Gameplay accents must use the approved accent hierarchy.
- Incomplete, interactable, completed, and failed states must remain distinguishable through more than color.
- Decorative color must not compete with route, destination, or interaction cues.

## Scale Rules

All assets must be evaluated against:

- player height;
- route width;
- bridge span;
- hand or tool interaction distance;
- approved gameplay camera;
- destination landing size.

Scaling an asset to repair weak composition or mismatched terrain is prohibited. The underlying contract or terrain must be corrected instead.

## Placement Rules

- Structural assets must connect visibly to terrain anchors.
- Props must not narrow the route below movement requirements.
- Foreground assets must not block the Hero Frame.
- Interaction assets must remain reachable and visible from valid player positions.
- Asset placement must not create false routes or accidental traversal bypasses.

## Runtime Ownership

Bridge Crossing owns landmark-specific asset assembly and state projection within its approved boundary.

It does not own:

- global asset registries;
- global material authority;
- global lighting;
- global camera;
- global terrain outside its boundary;
- shared persistence infrastructure.

The landmark may request shared assets and services through approved contracts but must not mutate them directly.

## Performance Expectations

- Asset count and draw cost must remain appropriate for the target platform.
- Repeated elements should use approved instancing or reuse strategies where available.
- Effects must not conceal overdraw or duplicate renderer chains.
- Optimization must preserve the approved silhouette and gameplay readability.

## Prohibited Patterns

- Selecting a bridge asset first and reshaping the world around it without design approval
- Copying global materials into landmark-local variants without purpose
- Creating duplicate camera or lighting rigs inside the landmark
- Embedding gameplay correctness inside mesh or renderer code
- Using decoration to hide unsupported geometry, terrain gaps, or collision mismatch
- Making a shared Bridge component that owns workflow-specific behavior for unrelated landmarks

## Asset Acceptance

Assets pass when:

- every visible asset supports structure, gameplay, navigation, or storytelling;
- structural endpoints align with terrain and collision;
- asset scale is believable from the gameplay camera;
- state variations are visually and operationally consistent;
- no asset introduces duplicate global authority;
- decoration remains subordinate to the landmark mission.
