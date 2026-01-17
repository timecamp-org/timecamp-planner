import { LoggerInterface } from '../../../../infrastructure/logger';
import { EventEmitter } from 'events';
import { UserBucket } from './UserBucket';
import { FeedMessage } from './types';
import { Id } from '../common/identifier';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';

export class BucketRegistry {
  protected bucketsByUserId: { [id: string]: UserBucket };
  private logger: LoggerInterface;
  private eventEmitter: EventEmitter;
  private jsonSerializer: JsonSerializerInterface;

  constructor(
    logger: LoggerInterface, 
    eventEmitter: EventEmitter,
    jsonSerializer: JsonSerializerInterface,
  ) {
    this.logger = logger
    this.eventEmitter = eventEmitter
    this.bucketsByUserId = {};
    this.jsonSerializer = jsonSerializer;
  }

  getOrCreateUserBucket(userId): UserBucket {
    const bucket = this.getUserBucket(userId);
    if (!bucket) {
      this.logger.debug(`No bucket for user [${userId}] -- creating`);
      this.bucketsByUserId[userId] = new UserBucket({
        bucketRegistry: this,
        userId: userId,
        logger: this.logger,
        eventEmitter: this.eventEmitter,
        jsonSerializer: this.jsonSerializer,
      });
    }
    return this.bucketsByUserId[userId];
  }

  getUserBucket(userId): UserBucket {
    if (typeof this.bucketsByUserId[userId] === 'undefined') {
      return null;
    }
    return this.bucketsByUserId[userId];
  }

  onBucketSizeChange(userId) {
    const bucket = this.getUserBucket(userId);
    if (!bucket) {
      return;
    }
    if (bucket.connectionCount() === 0) {
      // Bucket has emptied..
      this.logger.debug(`Removing empty bucket for user [${userId}]`);
      delete this.bucketsByUserId[userId];
    }
  }

  broadcastToUser(userId: Id, message: FeedMessage) {
    const bucket = this.getUserBucket(userId);
    if (!bucket) {
      this.logger.debug(`Message recipient [${userId}] has no active connections`);
      // No connections to send.
      return;
    }

    bucket.broadcast(message);
  }

  broadcastToAll(message: FeedMessage) {
    for (const userId in this.bucketsByUserId) {
      try {
        this.bucketsByUserId[userId].broadcast(message);
      } catch (e) {
        this.logger.error(e);
      }
    }
  }
}
