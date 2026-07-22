export interface LandmarkProgressRecord<State extends string = string> {
  readonly landmarkId: string;
  readonly state: State;
  readonly updatedAt: string;
}

export interface PersistencePort {
  load<State extends string>(landmarkId: string): Promise<LandmarkProgressRecord<State> | null>;
  save<State extends string>(record: LandmarkProgressRecord<State>): Promise<void>;
}
