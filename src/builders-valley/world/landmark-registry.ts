import type { LandmarkRuntimeRegistration } from './world-runtime.types';

export class LandmarkRegistry {
  private readonly registrations = new Map<string, LandmarkRuntimeRegistration>();

  register(registration: LandmarkRuntimeRegistration): void {
    if (this.registrations.has(registration.id)) {
      throw new Error(`LANDMARK_ALREADY_REGISTERED:${registration.id}`);
    }

    this.registrations.set(registration.id, registration);
  }

  unregister(id: string): LandmarkRuntimeRegistration | undefined {
    const registration = this.registrations.get(id);
    this.registrations.delete(id);
    return registration;
  }

  get(id: string): LandmarkRuntimeRegistration | undefined {
    return this.registrations.get(id);
  }

  list(): readonly LandmarkRuntimeRegistration[] {
    return [...this.registrations.values()];
  }
}
