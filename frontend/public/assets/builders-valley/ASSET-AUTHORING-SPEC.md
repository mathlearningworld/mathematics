# Builders Valley Asset Authoring Specification

This directory receives production-ready runtime assets. Source artwork may be created elsewhere, but exported files must satisfy this specification before the manifest is enabled.

## Canvas and pixel rules

- Base world grid: 32 × 32 px.
- Author pixel art at integer scale.
- Do not export with smoothing, resampling, or lossy compression.
- Preserve transparent padding only when required by anchor or animation consistency.
- Use consistent frame dimensions inside one animation group.
- Keep sprite origins documented.

## Runtime filtering

Production pixel-art textures use nearest-neighbour filtering. Assets must be reviewed at:

- 100% source scale;
- normal gameplay zoom (`0.90`);
- browser viewport 960 × 540.

## Atlas format

Preferred packed atlas pair:

```text
<family>-atlas.png
<family>-atlas.json
```

JSON must be compatible with Phaser atlas loading and use stable frame names defined by the PES contract.

Spritesheets may use:

```text
<family>-sheet.png
<family>-sheet.json
```

The companion metadata must document:

- frame width;
- frame height;
- frame count;
- animation groups;
- recommended frame rate;
- repeat behavior;
- origin.

## Naming

Use lowercase kebab-case for files and stable snake_case for frame names.

Example:

```text
builders-valley-cliff-atlas.png
cliff_outer_corner_ne
rock_shelf_02
```

Do not encode mutable version numbers into frame names. Versioning belongs in the manifest and asset-pack documentation.

## Family folders

```text
ground/
water/
cliff/
bridge/
workshop/
vegetation/
props/
effects/
```

Each folder should include a short README when an asset pack is delivered, stating:

- source and license;
- authoring tool;
- export date;
- palette authority;
- frame list;
- animation list;
- known limitations.

## Alpha and edge quality

- No opaque matte pixels around transparent edges.
- No accidental semi-transparent blur from scaling.
- Contact shadows may use controlled alpha.
- Pixel clusters should remain deliberate and readable.

## Anchors and origins

Default rules:

- ground tiles: top-left grid aligned;
- cliffs: top-left or declared tile anchor;
- props and vegetation: bottom-center ground contact;
- bridge modules: explicit structural anchor;
- effects: center unless the animation contract states otherwise.

## Collision

Art files do not define collision authority by themselves. New collision shapes require a separate gameplay contract and runtime review.

## Safe activation workflow

```text
1. Deliver files into the correct family folder.
2. Validate names and atlas metadata.
3. Enable only the corresponding manifest entries.
4. Run the local application.
5. Inspect getProductionAssetPipeline().
6. Capture runtime screenshots.
7. Approve the replacement family.
8. Only then retire its fallback graphics.
```

Never enable an asset entry before its files are committed at the exact manifest path.
