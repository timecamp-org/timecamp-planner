import { TrackedUser, TrackerEvent } from '../types';

export interface TrackerClient {
  trackUserEvents(event: TrackerEvent[]): void;
  setUser(user: TrackedUser): void;
}
