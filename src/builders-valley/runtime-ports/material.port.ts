export interface MaterialReferenceRequest {
  readonly landmarkId: string;
  readonly family: string;
}

export interface MaterialPort {
  resolveReference(request: MaterialReferenceRequest): string;
}
