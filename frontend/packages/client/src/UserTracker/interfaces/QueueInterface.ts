import { TrackerCallback } from '../types';

export interface QueueInterface<T> {
    push(event: T, callback: TrackerCallback)
    getAll(callback: (error: Error, events?: T[]) => void);
    remove(event: T, callback: TrackerCallback);
}