import type { BridgeCrossingState } from '../domain/bridge-crossing-state';

export type BridgeCrossingObjective =
  | 'DISCOVER_BRIDGE'
  | 'OBSERVE_CROSSING'
  | 'PREPARE_ROUTE'
  | 'MAKE_BRIDGE_CROSSABLE'
  | 'CROSS_BRIDGE'
  | 'REACH_DESTINATION'
  | 'COMPLETED';

export type BridgeCrossingAvailableAction =
  | 'APPROACH'
  | 'OBSERVE'
  | 'PREPARE'
  | 'MARK_CROSSABLE'
  | 'CROSS'
  | 'VERIFY_DESTINATION'
  | null;

export interface BridgeCrossingViewModel {
  readonly landmarkId: 'bridge-crossing';
  readonly currentState: BridgeCrossingState;
  readonly objective: BridgeCrossingObjective;
  readonly availableAction: BridgeCrossingAvailableAction;
  readonly isBridgeCrossable: boolean;
  readonly isCrossingActive: boolean;
  readonly isCompleted: boolean;
  readonly version: number;
  readonly updatedAt: string;
}
