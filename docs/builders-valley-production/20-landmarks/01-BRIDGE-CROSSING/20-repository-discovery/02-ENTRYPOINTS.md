# Bridge Crossing Repository Discovery — Entrypoints

## Result

No executable application entrypoint was discovered for Builders Valley runtime.

No repository-backed entrypoint could be confirmed for:

- world startup
- scene construction
- landmark registration
- player interaction dispatch
- persistence startup
- runtime verification

## Current Authoritative Entrypoints

At this stage, the only confirmed entrypoints are documentation contracts:

1. Product intent begins at `00-MISSION.md`.
2. Runtime responsibility begins at `10-runtime/00-RUNTIME-MAPPING.md`.
3. State behavior begins at `10-runtime/02-STATE-MACHINE.md`.
4. Acceptance authority begins at `05-ACCEPTANCE.md` and `10-runtime/04-EVIDENCE-REQUIREMENTS.md`.

These are planning and governance entrypoints, not executable runtime entrypoints.

## Implementation Gate

Before runtime implementation starts, the Executor must declare:

- selected runtime technology and package boundary
- executable startup file
- world composition root
- landmark registration root
- verification command or script

The declaration must be committed before feature logic so ownership does not emerge accidentally from implementation details.
