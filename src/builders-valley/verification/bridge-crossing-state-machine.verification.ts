import {
  createInitialBridgeCrossingSnapshot,
  transitionBridgeCrossing,
  type BridgeCrossingSnapshot,
  type BridgeCrossingState,
} from '../landmarks/bridge-crossing';

export interface BridgeCrossingVerificationResult {
  readonly name: string;
  readonly passed: boolean;
  readonly details?: string;
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function verifyLinearTransitionPath(): BridgeCrossingVerificationResult {
  const path: readonly BridgeCrossingState[] = [
    'APPROACHING',
    'OBSERVING',
    'PREPARING',
    'CROSSABLE',
    'CROSSING',
    'CROSSING_VERIFIED',
  ];

  let snapshot: BridgeCrossingSnapshot = createInitialBridgeCrossingSnapshot(
    '2026-07-22T00:00:00.000Z',
  );

  path.forEach((state, index) => {
    snapshot = transitionBridgeCrossing(
      snapshot,
      state,
      `2026-07-22T00:00:0${index + 1}.000Z`,
    );
  });

  assert(snapshot.state === 'CROSSING_VERIFIED', 'Expected verified terminal state.');
  assert(snapshot.version === path.length, 'Expected one version increment per transition.');

  return { name: 'linear transition path', passed: true };
}

function verifyIdempotentTransition(): BridgeCrossingVerificationResult {
  const initial = createInitialBridgeCrossingSnapshot('2026-07-22T00:00:00.000Z');
  const approaching = transitionBridgeCrossing(
    initial,
    'APPROACHING',
    '2026-07-22T00:00:01.000Z',
  );
  const repeated = transitionBridgeCrossing(
    approaching,
    'APPROACHING',
    '2026-07-22T00:00:02.000Z',
  );

  assert(repeated === approaching, 'Expected same-state transition to preserve object identity.');
  assert(repeated.version === 1, 'Expected same-state transition not to increase version.');

  return { name: 'idempotent same-state transition', passed: true };
}

function verifyInvalidTransitionRejected(): BridgeCrossingVerificationResult {
  const initial = createInitialBridgeCrossingSnapshot('2026-07-22T00:00:00.000Z');
  let rejected = false;

  try {
    transitionBridgeCrossing(initial, 'CROSSING', '2026-07-22T00:00:01.000Z');
  } catch {
    rejected = true;
  }

  assert(rejected, 'Expected invalid transition to be rejected.');

  return { name: 'invalid transition rejection', passed: true };
}

export function verifyBridgeCrossingStateMachine(): readonly BridgeCrossingVerificationResult[] {
  return [
    verifyLinearTransitionPath(),
    verifyIdempotentTransition(),
    verifyInvalidTransitionRejected(),
  ];
}
