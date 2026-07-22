import {
  createBridgeCrossingController,
  type BridgeCrossingSnapshot,
} from '../landmarks/bridge-crossing';

export interface BridgeCrossingControllerVerificationResult {
  readonly name: string;
  readonly passed: boolean;
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

export async function verifyBridgeCrossingController(): Promise<
  readonly BridgeCrossingControllerVerificationResult[]
> {
  const saved: BridgeCrossingSnapshot[] = [];
  const controller = createBridgeCrossingController({
    ports: {
      clock: { now: () => '2026-07-22T00:00:00.000Z' },
      snapshotStore: {
        load: async () => null,
        save: async (snapshot) => {
          saved.push(snapshot);
        },
      },
    },
  });

  const first = await controller.execute({
    type: 'DISCOVER',
    requestedAt: '2026-07-22T00:00:01.000Z',
  });

  assert(first.state === 'APPROACHING', 'Expected DISCOVER to enter APPROACHING.');
  assert(first.version === 1, 'Expected successful command to increment version.');
  assert(saved.length === 1, 'Expected successful transition to persist once.');

  const repeated = await controller.execute({
    type: 'DISCOVER',
    requestedAt: '2026-07-22T00:00:02.000Z',
  });

  assert(repeated === first, 'Expected repeated command to preserve snapshot identity.');
  assert(saved.length === 1, 'Expected idempotent command not to persist again.');

  let persistenceFailed = false;
  const failingController = createBridgeCrossingController({
    ports: {
      clock: { now: () => '2026-07-22T00:00:00.000Z' },
      snapshotStore: {
        load: async () => null,
        save: async () => {
          throw new Error('PERSISTENCE_FAILURE');
        },
      },
    },
  });

  try {
    await failingController.execute({
      type: 'DISCOVER',
      requestedAt: '2026-07-22T00:00:01.000Z',
    });
  } catch {
    persistenceFailed = true;
  }

  assert(persistenceFailed, 'Expected persistence failure to propagate.');
  assert(
    failingController.read().state === 'UNDISCOVERED',
    'Expected failed persistence not to commit in-memory state.',
  );

  return [
    { name: 'command transition persistence', passed: true },
    { name: 'idempotent command persistence', passed: true },
    { name: 'persistence-before-memory commit', passed: true },
  ];
}
