# Builders Valley Camera Standard

Status: Active Foundation Standard  
Authority: Builders Valley Production Bible

## 1. Purpose

The camera is part of world design, not a late presentation setting. It must make geography, traversal, learning purpose, landmarks, and player scale readable before UI explains them.

Runtime must implement an approved camera contract. Runtime must not discover the final composition by trial-and-error offsets.

## 2. Camera role

The Builders Valley camera must simultaneously provide:

- spatial orientation;
- readable player movement;
- clear interaction range;
- landmark recognition;
- terrain depth;
- safe UI space;
- continuity between exploration and learning activity.

A camera that produces an attractive image but obscures gameplay does not pass.

## 3. Primary presentation model

Builders Valley uses an elevated three-quarter world view as its default presentation language.

The view should reveal:

- enough ground plane to understand routes;
- enough elevation to read cliffs and terraces;
- enough horizon or distant mass to suggest a larger world;
- the player at a scale that remains emotionally present and mechanically readable.

The camera must avoid a flat top-down map appearance and must avoid a low cinematic angle that hides traversable ground.

## 4. Camera contract per landmark

Every landmark must define:

1. Camera purpose.
2. Evaluation position.
3. Look target or composition target.
4. Allowed framing range.
5. Primary route visibility.
6. Landmark silhouette visibility.
7. Player readability requirement.
8. UI exclusion zones.
9. Occlusion risks.
10. Screenshot acceptance view.

A landmark is not implementation-ready without this contract.

## 5. Hero camera

The hero camera is the canonical review view for a landmark. It is not necessarily a permanently locked gameplay camera.

The hero camera must:

- expose the landmark's geographic reason for existing;
- show the primary player route;
- preserve the dominant silhouette;
- separate foreground, midground, and background;
- provide a stable screenshot comparison target;
- reveal visual ownership conflicts and overdraw.

The hero camera must not be selected solely because it hides unfinished areas.

## 6. Gameplay camera behavior

Gameplay camera movement may follow, ease, pan, or constrain, but it must preserve the approved spatial reading.

Required behavior:

- no abrupt reorientation without gameplay cause;
- no camera drift that changes the landmark's identity;
- no zoom level that turns characters into unreadable pixels;
- no framing that allows UI to cover the active interaction space;
- no automatic motion that competes with a learning task;
- no occluding terrain between camera and player without a defined mitigation rule.

## 7. Composition priority

When framing a scene, resolve priorities in this order:

1. Active gameplay and safe traversal.
2. Player readability.
3. Landmark identity.
4. Terrain story and route logic.
5. Depth and atmosphere.
6. Secondary environmental storytelling.
7. Decoration.

Lower-priority elements must not compromise higher-priority elements.

## 8. Camera-safe world design

World geometry must be authored with camera behavior in mind.

- Foreground terrain may frame but must not permanently block the player.
- Tall structures must preserve readable gaps around active zones.
- Trees must form boundaries and depth without creating a continuous visual wall.
- Cliff silhouettes must remain distinct at the hero framing scale.
- Bridge decks, paths, entrances, and interactable areas must preserve contrast from the viewing angle.

## 9. UI relationship

The world owns the center of attention. UI must occupy declared safe regions and must not become the primary navigation system.

Each landmark screenshot contract must define:

- critical world area that must remain unobstructed;
- safe HUD bands;
- temporary modal impact;
- mobile aspect-ratio risks.

## 10. Aspect-ratio policy

The camera standard must survive supported desktop and mobile ratios without changing the landmark's meaning.

Cropping may reduce peripheral decoration, but it must preserve:

- player;
- primary route;
- active interaction;
- landmark identity;
- required learning feedback.

Do not solve narrow-screen composition by shrinking the entire world until it becomes unreadable.

## 11. Camera ownership

One authoritative camera controller must own final camera position, target, zoom, transition, and landmark framing state.

Independent visual patches must not directly override camera state. Camera requests must pass through the camera owner using an explicit contract.

## 12. Acceptance criteria

A camera standard implementation passes when:

- the landmark can be understood without UI explanation;
- the active route is visible;
- the player remains readable;
- foreground does not cause persistent occlusion;
- the hero frame has clear depth layers;
- desktop and mobile framing preserve the same gameplay meaning;
- final camera state has one runtime owner;
- screenshot comparisons can be reproduced from a declared evaluation state.

## 13. Failure examples

The camera fails when:

- the bridge is visible but the canyon is not, removing the bridge's purpose;
- scenery hides the player or interaction target;
- the landmark reads as a collection of assets rather than a geographic place;
- camera position changes merely to conceal rendering conflicts;
- the HUD covers the route or construction area;
- different patches apply competing zoom or offset values.