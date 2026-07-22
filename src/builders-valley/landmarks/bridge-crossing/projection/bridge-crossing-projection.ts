import type { BridgeCrossingSnapshot } from '../domain/bridge-crossing-state';
import type {
  BridgeCrossingAvailableAction,
  BridgeCrossingObjective,
  BridgeCrossingViewModel,
} from './bridge-crossing-view-model';
import type { BridgeCrossingUiState } from './bridge-crossing-ui-state';

const OBJECTIVE_BY_STATE: Readonly<Record<BridgeCrossingSnapshot['state'], BridgeCrossingObjective>> = {
  UNDISCOVERED: 'DISCOVER_BRIDGE',
  APPROACHING: 'OBSERVE_CROSSING',
  OBSERVING: 'PREPARE_ROUTE',
  PREPARING: 'MAKE_BRIDGE_CROSSABLE',
  CROSSABLE: 'CROSS_BRIDGE',
  CROSSING: 'REACH_DESTINATION',
  CROSSING_VERIFIED: 'COMPLETED',
};

const ACTION_BY_STATE: Readonly<
  Record<BridgeCrossingSnapshot['state'], BridgeCrossingAvailableAction>
> = {
  UNDISCOVERED: 'APPROACH',
  APPROACHING: 'OBSERVE',
  OBSERVING: 'PREPARE',
  PREPARING: 'MARK_CROSSABLE',
  CROSSABLE: 'CROSS',
  CROSSING: 'VERIFY_DESTINATION',
  CROSSING_VERIFIED: null,
};

export interface BridgeCrossingProjection {
  readonly viewModel: BridgeCrossingViewModel;
  readonly uiState: BridgeCrossingUiState;
}

export function projectBridgeCrossing(
  snapshot: BridgeCrossingSnapshot,
): BridgeCrossingProjection {
  const isBridgeCrossable =
    snapshot.state === 'CROSSABLE' ||
    snapshot.state === 'CROSSING' ||
    snapshot.state === 'CROSSING_VERIFIED';

  const isCompleted = snapshot.state === 'CROSSING_VERIFIED';

  return {
    viewModel: {
      landmarkId: snapshot.landmarkId,
      currentState: snapshot.state,
      objective: OBJECTIVE_BY_STATE[snapshot.state],
      availableAction: ACTION_BY_STATE[snapshot.state],
      isBridgeCrossable,
      isCrossingActive: snapshot.state === 'CROSSING',
      isCompleted,
      version: snapshot.version,
      updatedAt: snapshot.updatedAt,
    },
    uiState: {
      showApproachMarker: snapshot.state === 'UNDISCOVERED',
      showObservationMarker: snapshot.state === 'APPROACHING',
      showPreparationMarker: snapshot.state === 'OBSERVING' || snapshot.state === 'PREPARING',
      showBlockedPath: !isBridgeCrossable,
      showCrossablePath: isBridgeCrossable,
      showDestinationMarker: snapshot.state === 'CROSSING',
      showCompletion: isCompleted,
      highlightBridge:
        snapshot.state === 'APPROACHING' ||
        snapshot.state === 'OBSERVING' ||
        snapshot.state === 'PREPARING',
    },
  };
}
