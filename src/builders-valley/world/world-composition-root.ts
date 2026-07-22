import type { BuildersValleyRuntimePorts } from './world-runtime.types';
import { LandmarkRegistry } from './landmark-registry';

export interface WorldCompositionRoot {
  readonly ports: BuildersValleyRuntimePorts;
  readonly landmarks: LandmarkRegistry;
}

export function createWorldCompositionRoot(
  ports: BuildersValleyRuntimePorts,
): WorldCompositionRoot {
  return {
    ports,
    landmarks: new LandmarkRegistry(),
  };
}
