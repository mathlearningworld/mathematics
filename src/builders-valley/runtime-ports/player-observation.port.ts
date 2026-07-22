export interface PlayerObservation {
  readonly playerId: string;
  readonly landmarkId: string;
  readonly region: 'approach' | 'observation' | 'crossing' | 'destination';
  readonly observedAt: string;
}

export interface PlayerObservationPort {
  subscribe(
    landmarkId: string,
    listener: (observation: PlayerObservation) => void,
  ): () => void;
}
