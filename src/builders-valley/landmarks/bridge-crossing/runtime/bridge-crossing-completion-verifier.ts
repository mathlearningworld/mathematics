import type { PlayerObservation } from '../../../runtime-ports';
import type { BridgeCrossingRuntimeContract } from '../bridge-crossing.contract';

export interface BridgeCrossingCompletionVerifier {
  verify(observation: PlayerObservation): Promise<boolean>;
}

export function createBridgeCrossingCompletionVerifier(
  runtime: BridgeCrossingRuntimeContract,
): BridgeCrossingCompletionVerifier {
  return {
    async verify(observation: PlayerObservation): Promise<boolean> {
      if (observation.landmarkId !== runtime.landmarkId) {
        return false;
      }

      if (observation.region !== 'destination') {
        return false;
      }

      const snapshot = runtime.read();
      if (snapshot.state === 'CROSSING_VERIFIED') {
        return true;
      }

      if (snapshot.state !== 'CROSSING') {
        return false;
      }

      const verified = await runtime.execute({
        type: 'VERIFY_CROSSING',
        requestedAt: observation.observedAt,
      });

      return verified.state === 'CROSSING_VERIFIED';
    },
  };
}
