import type { PlayerObservationPort } from '../../../runtime-ports';
import type { BridgeCrossingRuntimeContract } from '../bridge-crossing.contract';
import { BRIDGE_CROSSING_LANDMARK_ID } from '../bridge-crossing.contract';
import type { BridgeCrossingCompletionVerifier } from './bridge-crossing-completion-verifier';

export interface BridgeCrossingInteractionRuntime {
  start(): () => void;
}

export interface BridgeCrossingInteractionOptions {
  readonly playerObservation: PlayerObservationPort;
  readonly runtime: BridgeCrossingRuntimeContract;
  readonly completionVerifier: BridgeCrossingCompletionVerifier;
}

export function createBridgeCrossingInteractionRuntime(
  options: BridgeCrossingInteractionOptions,
): BridgeCrossingInteractionRuntime {
  return {
    start(): () => void {
      return options.playerObservation.subscribe(
        BRIDGE_CROSSING_LANDMARK_ID,
        (observation) => {
          void (async () => {
            const current = options.runtime.read();

            if (observation.region === 'approach' && current.state === 'UNDISCOVERED') {
              await options.runtime.execute({
                type: 'DISCOVER',
                requestedAt: observation.observedAt,
              });
              return;
            }

            if (observation.region === 'observation' && current.state === 'APPROACHING') {
              await options.runtime.execute({
                type: 'BEGIN_OBSERVATION',
                requestedAt: observation.observedAt,
              });
              return;
            }

            if (observation.region === 'crossing' && current.state === 'CROSSABLE') {
              await options.runtime.execute({
                type: 'BEGIN_CROSSING',
                requestedAt: observation.observedAt,
              });
              return;
            }

            if (observation.region === 'destination') {
              await options.completionVerifier.verify(observation);
            }
          })();
        },
      );
    },
  };
}
