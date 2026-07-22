import { createWorldCompositionRoot } from '../world';
import { createBuildersValleyWorldRuntime } from '../world/world-runtime';
import type {
  CameraPort,
  LightingPort,
  MaterialPort,
  PersistencePort,
  PlayerObservation,
  PlayerObservationPort,
  TerrainPort,
} from '../runtime-ports';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export async function verifyWorldRuntimeLifecycle(): Promise<void> {
  const listeners = new Set<(observation: PlayerObservation) => void>();
  let subscribeCount = 0;
  let unsubscribeCount = 0;

  const playerObservation: PlayerObservationPort = {
    subscribe(_landmarkId, listener) {
      subscribeCount += 1;
      listeners.add(listener);

      return () => {
        if (listeners.delete(listener)) {
          unsubscribeCount += 1;
        }
      };
    },
  };

  const persistenceRecords = new Map<string, { landmarkId: string; state: string; updatedAt: string }>();
  const persistence: PersistencePort = {
    async load<State extends string>(landmarkId: string) {
      return (persistenceRecords.get(landmarkId) as {
        landmarkId: string;
        state: State;
        updatedAt: string;
      } | undefined) ?? null;
    },
    async save<State extends string>(record: {
      landmarkId: string;
      state: State;
      updatedAt: string;
    }) {
      persistenceRecords.set(record.landmarkId, record);
    },
  };

  const noopCamera: CameraPort = {
    requestFocus() {},
  };
  const noopTerrain: TerrainPort = {
    requestAssembly() {},
  };
  const noopLighting: LightingPort = {
    requestLighting() {},
  };
  const noopMaterial: MaterialPort = {
    requestMaterial() {},
  };

  const root = createWorldCompositionRoot({
    camera: noopCamera,
    terrain: noopTerrain,
    persistence,
    playerObservation,
    lighting: noopLighting,
    material: noopMaterial,
  });
  const runtime = await createBuildersValleyWorldRuntime(root);

  await runtime.start();
  assert(subscribeCount === 1, 'WORLD_RUNTIME_SHOULD_SUBSCRIBE_ON_FIRST_START');
  assert(root.landmarkLoader.isLoaded('bridge-crossing'), 'BRIDGE_CROSSING_SHOULD_BE_LOADED');

  await runtime.start();
  assert(subscribeCount === 1, 'WORLD_RUNTIME_START_SHOULD_BE_IDEMPOTENT');

  await runtime.stop();
  assert(unsubscribeCount === 1, 'WORLD_RUNTIME_STOP_SHOULD_UNSUBSCRIBE');
  assert(!root.landmarkLoader.isLoaded('bridge-crossing'), 'BRIDGE_CROSSING_SHOULD_BE_UNLOADED');
  assert(root.landmarks.get('bridge-crossing') === undefined, 'BRIDGE_CROSSING_SHOULD_BE_UNREGISTERED');

  await runtime.stop();
  assert(unsubscribeCount === 1, 'WORLD_RUNTIME_STOP_SHOULD_BE_IDEMPOTENT');

  await runtime.start();
  assert(subscribeCount === 2, 'WORLD_RUNTIME_SHOULD_RESUBSCRIBE_AFTER_RESTART');
  assert(root.landmarkLoader.isLoaded('bridge-crossing'), 'BRIDGE_CROSSING_SHOULD_RELOAD_AFTER_RESTART');

  await runtime.stop();
  assert(unsubscribeCount === 2, 'WORLD_RUNTIME_FINAL_STOP_SHOULD_UNSUBSCRIBE');
}
