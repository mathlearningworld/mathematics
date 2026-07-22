import type { BridgeCrossingCommand } from './application/bridge-crossing.commands';
import type { BridgeCrossingSnapshot } from './domain/bridge-crossing-state';

export const BRIDGE_CROSSING_LANDMARK_ID = 'bridge-crossing' as const;

export interface BridgeCrossingRuntimeContract {
  readonly landmarkId: typeof BRIDGE_CROSSING_LANDMARK_ID;
  read(): BridgeCrossingSnapshot;
  execute(command: BridgeCrossingCommand): Promise<BridgeCrossingSnapshot>;
}
