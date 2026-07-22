import type { LandmarkRuntimeRegistration } from './world-runtime.types';
import { LandmarkRegistry } from './landmark-registry';

export interface LoadedLandmarkRuntime {
  readonly registration: LandmarkRuntimeRegistration;
  readonly stop?: () => void;
}

export interface LandmarkLoader {
  load(runtime: LoadedLandmarkRuntime): Promise<void>;
  unload(id: string): Promise<void>;
}

export function createLandmarkLoader(registry: LandmarkRegistry): LandmarkLoader {
  const loaded = new Map<string, LoadedLandmarkRuntime>();

  return {
    async load(runtime) {
      registry.register(runtime.registration);
      await runtime.registration.activate();
      loaded.set(runtime.registration.id, runtime);
    },
    async unload(id) {
      const runtime = loaded.get(id);
      if (!runtime) {
        return;
      }

      runtime.stop?.();
      await runtime.registration.deactivate?.();
      loaded.delete(id);
    },
  };
}
