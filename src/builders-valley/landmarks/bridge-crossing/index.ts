export {
  BRIDGE_CROSSING_LANDMARK_ID,
  type BridgeCrossingRuntimeContract,
} from './bridge-crossing.contract';

export {
  BRIDGE_CROSSING_COMMAND_TARGET,
  type BridgeCrossingCommand,
  type BridgeCrossingCommandType,
} from './application/bridge-crossing.commands';

export {
  BRIDGE_CROSSING_STATES,
  createInitialBridgeCrossingSnapshot,
  type BridgeCrossingSnapshot,
  type BridgeCrossingState,
} from './domain/bridge-crossing-state';

export {
  canTransitionBridgeCrossing,
  transitionBridgeCrossing,
} from './domain/bridge-crossing-machine';

export { BridgeCrossingTransitionError } from './domain/bridge-crossing.errors';
