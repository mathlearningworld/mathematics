import { BridgeCrossingTransitionError } from './bridge-crossing.errors';
import type {
  BridgeCrossingSnapshot,
  BridgeCrossingState,
} from './bridge-crossing-state';

const ALLOWED_TRANSITIONS: Readonly<Record<BridgeCrossingState, readonly BridgeCrossingState[]>> = {
  UNDISCOVERED: ['APPROACHING'],
  APPROACHING: ['OBSERVING'],
  OBSERVING: ['PREPARING'],
  PREPARING: ['CROSSABLE'],
  CROSSABLE: ['CROSSING'],
  CROSSING: ['CROSSING_VERIFIED'],
  CROSSING_VERIFIED: [],
};

export function canTransitionBridgeCrossing(
  from: BridgeCrossingState,
  to: BridgeCrossingState,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function transitionBridgeCrossing(
  snapshot: BridgeCrossingSnapshot,
  to: BridgeCrossingState,
  updatedAt: string,
): BridgeCrossingSnapshot {
  if (snapshot.state === to) {
    return snapshot;
  }

  if (!canTransitionBridgeCrossing(snapshot.state, to)) {
    throw new BridgeCrossingTransitionError(snapshot.state, to);
  }

  return {
    ...snapshot,
    state: to,
    version: snapshot.version + 1,
    updatedAt,
  };
}
