import type { BridgeCrossingRuntimeContract } from '../bridge-crossing.contract';
import { BRIDGE_CROSSING_COMMAND_TARGET, type BridgeCrossingCommand } from './bridge-crossing.commands';
import { createInitialBridgeCrossingSnapshot, type BridgeCrossingSnapshot } from '../domain/bridge-crossing-state';
import { transitionBridgeCrossing } from '../domain/bridge-crossing-machine';
import type { BridgeCrossingApplicationPorts } from '../ports';

export interface BridgeCrossingControllerOptions {
  readonly ports: BridgeCrossingApplicationPorts;
  readonly initialSnapshot?: BridgeCrossingSnapshot;
}

export function createBridgeCrossingController(
  options: BridgeCrossingControllerOptions,
): BridgeCrossingRuntimeContract {
  let snapshot =
    options.initialSnapshot ?? createInitialBridgeCrossingSnapshot(options.ports.clock.now());

  return {
    landmarkId: 'bridge-crossing',
    read() {
      return snapshot;
    },
    async execute(command: BridgeCrossingCommand) {
      const next = transitionBridgeCrossing(
        snapshot,
        BRIDGE_CROSSING_COMMAND_TARGET[command.type],
        command.requestedAt,
      );

      if (next === snapshot) {
        return snapshot;
      }

      await options.ports.snapshotStore.save(next);
      snapshot = next;
      return snapshot;
    },
  };
}

export async function restoreBridgeCrossingController(
  ports: BridgeCrossingApplicationPorts,
): Promise<BridgeCrossingRuntimeContract> {
  const restored = await ports.snapshotStore.load();

  return createBridgeCrossingController({
    ports,
    initialSnapshot: restored ?? createInitialBridgeCrossingSnapshot(ports.clock.now()),
  });
}
