import type { LandmarkRuntimeRegistration } from './world-runtime.types';
import { LandmarkRegistry } from './landmark-registry';

export interface LoadedLandmarkRuntime {
  readonly registration: LandmarkRuntimeRegistration;
  readonly stop?: () => void;
}

export interface LandmarkLoader {
  load(runtime: LoadedLandmarkRuntime): Promise<void>;
  unload(id: string): Promise<void>;
  isLoaded(id: string): boolean;
}

export function createLandmarkLoader(registry: LandmarkRegistry): LandmarkLoader {
  const loaded = new Map<string, LoadedLandmarkRuntime>();

  return {
    async load(runtime) {
      if (loaded.has(runtime.registration.id)) {
        return;
      }

      registry.register(runtime.registration);

      try {
        await runtime.registration.activate();
        loaded.set(runtime.registration.id, runtime);
      } catch (error) {
        registry.unregister(runtime.registration.id);
        throw error;
      }
    },
    async unload(id) {
      const runtime = loaded.get(id);
      if (!runtime) {
        return;
      }

      runtime.stop?.();

      try {
        await runtime.registration.deactivate?.();
      } finally {
        loaded.delete(id);
        registry.unregister(id);
      }
    },
    isLoaded(id) {
      return loaded.has(id);
    },
  };
}
