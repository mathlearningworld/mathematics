# Builders Valley Production Assets

This directory is the delivery root for PES-001C production art.

Planned families:

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

Binary files are not considered active merely because they exist here. Every asset must be declared in `frontend/src/sandbox/assets/BuildersValleyAssetManifest.js`, enabled intentionally, loaded successfully, and selected by its owning production composer.

Until that process is complete, the approved PES-001B Graphics composition remains the runtime fallback.

Do not replace gameplay collision, player coordinates, resource coordinates or placement authority with visual asset metadata.
