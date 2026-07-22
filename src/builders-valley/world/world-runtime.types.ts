import type {
  CameraPort,
  LightingPort,
  MaterialPort,
  PersistencePort,
  PlayerObservationPort,
  TerrainPort,
} from '../runtime-ports';

export interface BuildersValleyRuntimePorts {
  readonly camera: CameraPort;
  readonly terrain: TerrainPort;
  readonly persistence: PersistencePort;
  readonly playerObservation: PlayerObservationPort;
  readonly lighting: LightingPort;
  readonly material: MaterialPort;
}

export interface LandmarkRuntimeRegistration {
  readonly id: string;
  readonly activate: () => Promise<void> | void;
  readonly deactivate?: () => Promise<void> | void;
}
