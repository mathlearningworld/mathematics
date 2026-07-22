import type { PersistencePort } from '../../../runtime-ports';
import type { BridgeCrossingSnapshot } from '../domain/bridge-crossing-state';

export interface BridgeCrossingClockPort {
  now(): string;
}

export interface BridgeCrossingSnapshotStorePort {
  load(): Promise<BridgeCrossingSnapshot | null>;
  save(snapshot: BridgeCrossingSnapshot): Promise<void>;
}

export interface BridgeCrossingApplicationPorts {
  readonly clock: BridgeCrossingClockPort;
  readonly snapshotStore: BridgeCrossingSnapshotStorePort;
}

export function createBridgeCrossingSnapshotStore(
  persistence: PersistencePort,
  landmarkId = 'bridge-crossing',
): BridgeCrossingSnapshotStorePort {
  return {
    async load() {
      const record = await persistence.load<BridgeCrossingSnapshot['state']>(landmarkId);

      if (!record) {
        return null;
      }

      return {
        landmarkId: 'bridge-crossing',
        state: record.state,
        version: 0,
        updatedAt: record.updatedAt,
      };
    },
    async save(snapshot) {
      await persistence.save({
        landmarkId: snapshot.landmarkId,
        state: snapshot.state,
        updatedAt: snapshot.updatedAt,
      });
    },
  };
}
