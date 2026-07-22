export {
  BRIDGE_CROSSING_LANDMARK_ID,
  type BridgeCrossingRuntimeContract,
} from './bridge-crossing.contract';

export {
  BRIDGE_CROSSING_COMMAND_TARGET,
  createBridgeCrossingController,
  restoreBridgeCrossingController,
  type BridgeCrossingCommand,
  type BridgeCrossingCommandType,
  type BridgeCrossingControllerOptions,
} from './application';

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

export {
  createBridgeCrossingSnapshotStore,
  type BridgeCrossingApplicationPorts,
  type BridgeCrossingClockPort,
  type BridgeCrossingSnapshotStorePort,
} from './ports';
