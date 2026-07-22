export interface TerrainAssemblyRequest {
  readonly landmarkId: string;
  readonly terrainContract: string;
}

export interface TerrainPort {
  requestAssembly(request: TerrainAssemblyRequest): void;
}
