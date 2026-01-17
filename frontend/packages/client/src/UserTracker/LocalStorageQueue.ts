import { QueueInterface } from './interfaces/QueueInterface';
import { TrackerEvent, TrackerCallback } from './types';

const TRACKER_QUEUE_KEY = '__tc3_tracker_queue';

class LocalStorageQueue implements QueueInterface<TrackerEvent> {
  private localStorage

  constructor(localStorage) {
    this.localStorage = localStorage
  }

  push(event: TrackerEvent, callback: TrackerCallback) {
    try {
      this.localStorage.getItem(TRACKER_QUEUE_KEY, (error, queue) => {
        if (error) {
          return callback(error);
        }

        if (queue) {
          queue = JSON.parse(queue);
          queue.push(event);
        } else {
          queue = [event];
        }

        return this.localStorage.setItem(TRACKER_QUEUE_KEY, JSON.stringify(queue), callback);
      });
    } catch (parseError) {
      callback(parseError);
    }
  }

  getAll(callback: TrackerCallback) {
    try {
      this.localStorage.getItem(TRACKER_QUEUE_KEY, (error, queue) => {
        callback(error, JSON.parse(queue));
      });
    } catch (parseError) {
      callback(parseError);
    }
  }

  remove(event: TrackerEvent, callback: TrackerCallback) {
    try {
      this.localStorage.getItem(TRACKER_QUEUE_KEY, (error, queue) => {
        if (error) {
          return callback(error);
        }

        if (queue) {
          queue = JSON.parse(queue);
          queue = queue.filter(eventInQueue => eventInQueue.id !== event.id);
        }

        return this.localStorage.setItem(TRACKER_QUEUE_KEY, JSON.stringify(queue), callback);
      });
    } catch (parseError) {
      callback(parseError);
    }
  }
}

export default LocalStorageQueue;

