export const BRIDGE_CROSSING_STATES = [
  'UNDISCOVERED',
  'APPROACHING',
  'OBSERVING',
  'PREPARING',
  'CROSSABLE',
  'CROSSING',
  'CROSSING_VERIFIED',
] as const;

export type BridgeCrossingState = (typeof BRIDGE_CROSSING_STATES)[number];

export interface BridgeCrossingSnapshot {
  readonly landmarkId: 'bridge-crossing';
  readonly state: BridgeCrossingState;
  readonly version: number;
  readonly updatedAt: string;
}

export function createInitialBridgeCrossingSnapshot(
  updatedAt: string,
): BridgeCrossingSnapshot {
  return {
    landmarkId: 'bridge-crossing',
    state: 'UNDISCOVERED',
    version: 0,
    updatedAt,
  };
}
