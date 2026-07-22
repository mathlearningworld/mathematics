# PAL-000 — Production Asset Library Foundation

## Status

- Phase: FOUNDATION
- Repository authority: `main`
- Environment visual scope: frozen at Builders Valley PES-006 RC
- Library strategy: reusable asset packs, not scene-specific art

## Purpose

The Production Asset Library (PAL) is the reusable visual and gameplay asset system for Math Learning World. It separates asset ownership from individual scenes so Builders Valley, villages, farms, markets, temples, rivers, forests, and future learning worlds can reuse the same authored content without copying scene-specific implementations.

PAL assets are not decorative files only. Every gameplay-capable asset must declare its visual identity, runtime behavior, interaction role, collision policy, placement rules, drop or harvest contract, and fallback behavior.

## Permanent principles

1. Asset library owns reusable art and metadata; scenes own composition and workflow.
2. Environment scenes may consume PAL assets but must not become their source of truth.
3. Asset activation is incremental, reversible, and verifier-gated.
4. Decorative assets must not silently add gameplay collision.
5. Gameplay assets require explicit runtime contracts before activation.
6. Thai cultural identity must be specific, respectful, and internally consistent rather than a generic pan-Asian mixture.
7. Existing Builders Valley visual scope remains frozen unless a regression or approved replacement slice reopens it.

## Initial pack roadmap

| Pack | Name | Primary scope | Runtime expectation |
|---|---|---|---|
| PAL-001 | Thai Nature Pack | trees, crops, flowers, pond plants, rocks, water-edge nature | decorative and harvestable variants |
| PAL-002 | Thai Building Pack | houses, shops, pavilions, temple support structures | footprint, entry, interior hook |
| PAL-003 | Thai Props Pack | household, craft, market, farming and cultural props | decoration or interaction contract |
| PAL-004 | Thai Food Pack | ingredients, dishes, drinks and containers | inventory, cooking and reward hooks |
| PAL-005 | Workshop Pack | workbenches, storage, tools and production stations | crafting and placement hooks |
| PAL-006 | Village NPC Pack | villagers, professions and special roles | dialogue, mission and schedule hooks |
| PAL-007 | Animals Pack | domestic and regional animals | movement, care and resource hooks |
| PAL-008 | River & Boat Pack | boats, docks, fishing and water transport | navigation and interaction hooks |
| PAL-009 | Temple Pack | temple architecture, ceremonial props and gardens | respectful world-building contracts |
| PAL-010 | Marketplace Pack | stalls, signs, produce displays and merchant props | trading and economy hooks |

## PAL-001 first delivery scope

PAL-001 starts with the smallest reusable Thai nature vocabulary that can improve multiple worlds without changing gameplay architecture.

### Tier A — decorative foundation

- coconut palm
- banana plant
- mango tree
- sugar palm
- bamboo cluster
- broadleaf tropical tree
- lotus flower
- lotus leaf cluster
- rice clump
- flowering shrub
- tropical grass
- moss rock cluster

### Tier B — gameplay-ready candidates

- harvestable banana plant
- harvestable mango tree
- harvestable coconut palm
- rice crop growth stages
- lotus harvest node
- bamboo harvest node

Tier B assets remain disabled until interaction, inventory, drop-table, respawn, and persistence contracts exist.

## Asset identity contract

Every PAL asset record must declare:

- stable asset ID
- pack ID and semantic family
- source type and file paths
- lifecycle status
- visual role
- runtime role
- collision policy
- placement policy
- interaction policy
- fallback policy
- cultural review status
- version

## Lifecycle states

- `PLANNED` — contract exists, artwork not delivered
- `DELIVERED` — files exist, not runtime-enabled
- `DECORATIVE_READY` — safe for non-colliding visual use
- `GAMEPLAY_CONTRACT_REQUIRED` — artwork exists but gameplay contract is incomplete
- `GAMEPLAY_READY` — runtime and interaction contracts verified
- `DEPRECATED` — retained only for migration or replay compatibility

## Runtime boundaries

### Decorative asset

May provide:

- sprite or atlas frame
- depth class
- scale range
- placement tags
- visual footprint

Must not provide collision, drops, harvesting, inventory mutation, or mission progress implicitly.

### Gameplay asset

Must additionally provide:

- entity type
- interaction verbs
- collision shape and authority
- state machine
- drop or harvest table
- persistence identity
- replay-safe transitions
- mission event hooks

## Folder standard

```text
frontend/public/assets/pal/
  thai-nature/
  thai-buildings/
  thai-props/
  thai-food/
  workshop/
  village-npc/
  animals/
  river-boats/
  temple/
  marketplace/

frontend/src/sandbox/assets/
  ProductionAssetLibraryManifest.js
```

## Verification gates

### Repository gate

- unique IDs
- valid pack and family names
- explicit lifecycle state
- no enabled asset without delivery paths
- gameplay-ready asset has a runtime contract reference
- decorative asset collision policy is `NONE`

### Runtime gate

- atlas or sheet loads successfully
- fallback remains available
- no unsupported rendering API
- no hidden collision creation
- scene shutdown cleanup exists for animation handlers

### Operational gate

- player movement remains available
- interaction targeting remains deterministic
- placement does not overlap protected corridors
- inventory and mission events are correct for gameplay assets

## PAL-001 completion definition

PAL-001 Foundation is complete when:

1. the pack contract and manifest records exist;
2. the verifier passes with all undelivered records disabled;
3. decorative delivery can be activated independently;
4. gameplay-ready candidates remain blocked until their runtime contracts exist;
5. Builders Valley PES-006 remains unchanged.
