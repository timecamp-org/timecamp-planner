import { QueueInterface } from './interfaces/QueueInterface';
import { TrackerEvent, TrackerCallback } from './types';

class MemQueue implements QueueInterface<TrackerEvent> {
  queue: TrackerEvent[] = [];

  push(event: TrackerEvent, callback: TrackerCallback) {
    this.queue.push(event);
    setImmediate(callback);
  }
  getAll(callback) {
    setImmediate(() => callback(undefined, this.queue.slice()));
  }
  remove(event: TrackerEvent, callback: TrackerCallback) {
    this.queue.shift();
    setImmediate(callback);
  }
}

export default MemQueue
