import type { BridgeCrossingState } from './bridge-crossing-state';

export class BridgeCrossingTransitionError extends Error {
  readonly code = 'BRIDGE_CROSSING_INVALID_TRANSITION';

  constructor(
    readonly from: BridgeCrossingState,
    readonly to: BridgeCrossingState,
  ) {
    super(`Invalid Bridge Crossing transition: ${from} -> ${to}`);
    this.name = 'BridgeCrossingTransitionError';
  }
}
