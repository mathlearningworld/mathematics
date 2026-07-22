import type { BuildersValleyRuntimePorts } from '../../../world';
import {
  createBridgeCrossingController,
  restoreBridgeCrossingController,
} from '../application';
import type { BridgeCrossingRuntimeContract } from '../bridge-crossing.contract';
import {
  createBridgeCrossingSnapshotStore,
  type BridgeCrossingClockPort,
} from '../ports';
import {
  projectBridgeCrossing,
  type BridgeCrossingProjection,
} from '../projection';
import { createBridgeCrossingCompletionVerifier } from './bridge-crossing-completion-verifier';
import {
  createBridgeCrossingInteractionRuntime,
  type BridgeCrossingInteractionRuntime,
} from './bridge-crossing-interaction';
import { createBridgeCrossingRegistration } from './bridge-crossing-registration';

export interface BridgeCrossingRuntimeBundle {
  readonly runtime: BridgeCrossingRuntimeContract;
  readonly interaction: BridgeCrossingInteractionRuntime;
  readonly registration: ReturnType<typeof createBridgeCrossingRegistration>;
  project(): BridgeCrossingProjection;
}

export interface BridgeCrossingRuntimeFactoryOptions {
  readonly ports: BuildersValleyRuntimePorts;
  readonly clock?: BridgeCrossingClockPort;
  readonly restore?: boolean;
}

export async function createBridgeCrossingRuntimeBundle(
  options: BridgeCrossingRuntimeFactoryOptions,
): Promise<BridgeCrossingRuntimeBundle> {
  const clock: BridgeCrossingClockPort =
    options.clock ?? ({ now: () => new Date().toISOString() } satisfies BridgeCrossingClockPort);
  const applicationPorts = {
    clock,
    snapshotStore: createBridgeCrossingSnapshotStore(options.ports.persistence),
  };

  const runtime =
    options.restore === false
      ? createBridgeCrossingController({ ports: applicationPorts })
      : await restoreBridgeCrossingController(applicationPorts);
  const completionVerifier = createBridgeCrossingCompletionVerifier(runtime);
  const interaction = createBridgeCrossingInteractionRuntime({
    playerObservation: options.ports.playerObservation,
    runtime,
    completionVerifier,
  });
  const registration = createBridgeCrossingRegistration({ runtime });

  return {
    runtime,
    interaction,
    registration,
    project() {
      return projectBridgeCrossing(runtime.read());
    },
  };
}
