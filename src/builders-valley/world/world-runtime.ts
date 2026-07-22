import { createBridgeCrossingRuntimeBundle, type BridgeCrossingRuntimeBundle } from '../landmarks/bridge-crossing';
import type { WorldCompositionRoot } from './world-composition-root';

export interface BuildersValleyWorldRuntime {
  readonly bridgeCrossing: BridgeCrossingRuntimeBundle;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export async function createBuildersValleyWorldRuntime(
  root: WorldCompositionRoot,
): Promise<BuildersValleyWorldRuntime> {
  const bridgeCrossing = await createBridgeCrossingRuntimeBundle({
    ports: root.ports,
  });
  let stopBridgeInteraction: (() => void) | undefined;

  return {
    bridgeCrossing,
    async start() {
      stopBridgeInteraction = bridgeCrossing.interaction.start();
      await root.landmarkLoader.load({
        registration: bridgeCrossing.registration,
        stop: stopBridgeInteraction,
      });
    },
    async stop() {
      await root.landmarkLoader.unload(bridgeCrossing.registration.id);
      stopBridgeInteraction = undefined;
    },
  };
}
