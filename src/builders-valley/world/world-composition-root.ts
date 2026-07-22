import type { BuildersValleyRuntimePorts } from './world-runtime.types';
import { LandmarkRegistry } from './landmark-registry';
import { createLandmarkLoader, type LandmarkLoader } from './landmark-loader';

export interface WorldCompositionRoot {
  readonly ports: BuildersValleyRuntimePorts;
  readonly landmarks: LandmarkRegistry;
  readonly landmarkLoader: LandmarkLoader;
}

export function createWorldCompositionRoot(
  ports: BuildersValleyRuntimePorts,
): WorldCompositionRoot {
  const landmarks = new LandmarkRegistry();

  return {
    ports,
    landmarks,
    landmarkLoader: createLandmarkLoader(landmarks),
  };
}
