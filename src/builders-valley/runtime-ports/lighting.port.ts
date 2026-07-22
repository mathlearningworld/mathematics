export interface LightingIntentRequest {
  readonly landmarkId: string;
  readonly intent: 'discovery' | 'construction' | 'crossing' | 'completion';
}

export interface LightingPort {
  requestIntent(request: LightingIntentRequest): void;
}
