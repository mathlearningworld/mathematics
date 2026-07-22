export interface CameraFocusRequest {
  readonly landmarkId: string;
  readonly intent: 'observe' | 'crossing' | 'destination';
}

export interface CameraPort {
  requestFocus(request: CameraFocusRequest): void;
}
