import type { BridgeCrossingState } from '../domain/bridge-crossing-state';

export type BridgeCrossingCommandType =
  | 'DISCOVER'
  | 'BEGIN_OBSERVATION'
  | 'BEGIN_PREPARATION'
  | 'MARK_CROSSABLE'
  | 'BEGIN_CROSSING'
  | 'VERIFY_CROSSING';

export interface BridgeCrossingCommand {
  readonly type: BridgeCrossingCommandType;
  readonly requestedAt: string;
}

export const BRIDGE_CROSSING_COMMAND_TARGET: Readonly<
  Record<BridgeCrossingCommandType, BridgeCrossingState>
> = {
  DISCOVER: 'APPROACHING',
  BEGIN_OBSERVATION: 'OBSERVING',
  BEGIN_PREPARATION: 'PREPARING',
  MARK_CROSSABLE: 'CROSSABLE',
  BEGIN_CROSSING: 'CROSSING',
  VERIFY_CROSSING: 'CROSSING_VERIFIED',
};
