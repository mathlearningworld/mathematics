import type { LandmarkRuntimeRegistration } from '../../../world';
import type { BridgeCrossingRuntimeContract } from '../bridge-crossing.contract';
import { BRIDGE_CROSSING_LANDMARK_ID } from '../bridge-crossing.contract';

export interface BridgeCrossingRegistrationOptions {
  readonly runtime: BridgeCrossingRuntimeContract;
  readonly onActivate?: () => Promise<void> | void;
  readonly onDeactivate?: () => Promise<void> | void;
}

export function createBridgeCrossingRegistration(
  options: BridgeCrossingRegistrationOptions,
): LandmarkRuntimeRegistration {
  return {
    id: BRIDGE_CROSSING_LANDMARK_ID,
    async activate(): Promise<void> {
      await options.onActivate?.();
      options.runtime.read();
    },
    async deactivate(): Promise<void> {
      await options.onDeactivate?.();
    },
  };
}
