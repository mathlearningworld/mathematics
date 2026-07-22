# PAL-001A — Thai Nature Decorative Atlas Delivery

## Status

`DELIVERED / RUNTIME DISABLED`

PAL-001A delivers the first reusable Thai nature artwork package for the Production Asset Library. This slice intentionally stops before scene composition or runtime activation so Builders Valley remains frozen at its approved PES-006 release-candidate baseline.

## Delivered atlases

### PAL_TH_NATURE_ATLAS_01

Files:

- `/assets/pal/thai-nature/pal-thai-nature-atlas.svg`
- `/assets/pal/thai-nature/pal-thai-nature-atlas.json`

Delivered frames used by PAL-001A:

- `coconut_palm_01`
- `banana_plant_01`
- `mango_tree_01`
- `sugar_palm_01`
- `bamboo_cluster_01`

The source atlas also contains an authored reserve frame that is not activated by this slice.

### PAL_TH_WETLAND_ATLAS_01

Files:

- `/assets/pal/thai-nature/pal-thai-wetland-atlas.svg`
- `/assets/pal/thai-nature/pal-thai-wetland-atlas.json`

Frames:

- `lotus_flower_01`
- `lotus_leaf_cluster_01`
- `rice_clump_01`

## Contract mapping

The delivery ledger is owned by:

`frontend/src/sandbox/assets/Pal001ThaiNatureDeliveryManifest.js`

Every delivered frame maps to an existing PAL source record. Delivery and activation are intentionally separate states:

- `deliveryStatus: DELIVERED`
- `activationStatus: DISABLED`
- `collisionPolicy: NONE`
- `interactionPolicy: DECORATIVE_ONLY`

## Safety boundaries

PAL-001A does not:

- import the atlases into the game entry point;
- replace Builders Valley vegetation;
- add physics bodies or collision;
- add harvest interactions;
- alter spawn, movement, pathing, or gameplay geometry;
- reopen the PES-006 environment visual scope.

Harvestable banana, mango, and rice remain blocked behind their future gameplay contracts.

## Verification

Run:

```bash
cd frontend
npm run verify:production-asset-library
npm run verify:builders-valley-environment-rc
npm run build
```

Expected PAL result:

- 2 delivered atlases
- 8 delivered decorative asset mappings
- 0 activated PAL assets
- no collision or interaction authority

## Next gate

`PAL-001B — Thai Nature Decorative Runtime Preview`

The next slice should preload these atlases into an isolated preview/catalog surface first. It must not replace the approved Builders Valley composition until visual scale, origin, layer, density, and performance are reviewed independently.
