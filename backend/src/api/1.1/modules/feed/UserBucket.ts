import { LoggerInterface } from '../../../../infrastructure/logger';
import { BucketRegistry } from './BucketRegistry';
import { EventEmitter } from 'events';
import { UuidSocketIdGenerator } from './UuidSocketIdGenerator';
import {
  UserFeedEvent,
  FeedMessageType,
  WelcomeMessage,
  FeedMessage,
  ClientMessage,
} from './types';
import { SocketIdType } from './types';
import * as WebSocket from 'ws';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';

const socketIdGenerator = new UuidSocketIdGenerator();

const FEED_VERSION = 'v1.1';
/**
 * Contains all user's connections (might be more than one).
 */
export class UserBucket {
  protected sockets: { [id: string]: WebSocket };
  protected bucketRegistry: BucketRegistry;
  private logger: LoggerInterface;
  private userId: string;
  private eventEmitter: EventEmitter;
  private jsonSerializer: JsonSerializerInterface;

  constructor(parameters: {
    bucketRegistry: BucketRegistry;
    userId: string;
    logger: LoggerInterface;
    eventEmitter: EventEmitter;
    jsonSerializer: JsonSerializerInterface;
  }) {
    const { bucketRegistry, userId, logger, eventEmitter, jsonSerializer } =
      parameters;
    this.userId = userId;
    this.logger = logger;
    this.sockets = {};
    this.bucketRegistry = bucketRegistry;
    this.eventEmitter = eventEmitter;
    this.jsonSerializer = jsonSerializer;
  }

  /**
   * Adds socket to array. Registers listener for 'close' event
   * that will remove socket from array.
   *
   * @param {WebSocket} socket
   */
  registerSocket(socket: WebSocket) {
    const socketId = socketIdGenerator.generateUniqueId();
    if (this.connectionCount() === 0) {
      this.eventEmitter.emit(UserFeedEvent.USER_ONLINE, this.userId);
      this.eventEmitter.emit(
        UserFeedEvent.USER_FEED_OPENED,
        this.userId,
        socketId,
        true
      );
    } else {
      this.eventEmitter.emit(
        UserFeedEvent.USER_FEED_OPENED,
        this.userId,
        socketId,
        false
      );
    }
    this.sockets[socketId] = socket;
    this.logger.debug(`Registered new socket for user [${this.userId}]`);
    socket.on('close', this.onClosed.bind(this, socketId));
    socket.on('error', this.onError.bind(this, socketId));
    this.registerClientMessage(socket, socketId);
    this.sendWelcomeMessage(socket);
  }

  /**
   * Sends welcome message after user connect to specific socket
   *
   * @param {WebSocket} socket
   */
  sendWelcomeMessage(socket: WebSocket) {
    const message: WelcomeMessage = {
      type: FeedMessageType.WELCOME,
      userId: this.userId,
      version: FEED_VERSION,
    };
    const serializedMessage = this.jsonSerializer.toJson(message);
    this.logger.debug(`Welcome user [${this.userId}]`);
    this.send(socket, serializedMessage);
  }

  /**
   * Removes from sockets array. Reports empty array to registry to clean up.
   *
   * @param {userId} socketId
   */
  onClosed(socketId: SocketIdType) {
    this.logger.debug(`Removing closed socket for user [${this.userId}]`);
    delete this.sockets[socketId];
    if (this.connectionCount() === 0) {
      this.eventEmitter.emit(
        UserFeedEvent.USER_FEED_CLOSED,
        this.userId,
        socketId,
        true
      );
      this.eventEmitter.emit(UserFeedEvent.USER_OFFLINE, this.userId);
    } else {
      this.eventEmitter.emit(
        UserFeedEvent.USER_FEED_CLOSED,
        this.userId,
        socketId,
        false
      );
    }
    this.bucketRegistry.onBucketSizeChange(this.userId);
  }

  onError(socketId: SocketIdType, error: Error) {
    this.logger.error(`Socket ${socketId} error`, error);
  }

  /**
   * Sends message to ALL connected sockets (for current user).
   *
   * @param {FeedMessage} message
   */
  broadcast(message: FeedMessage) {
    message.version = FEED_VERSION;
    const serializedMessage = this.jsonSerializer.toJson(message);
    this.logger.debug(
      `Broadcasting message ${serializedMessage} to user [${this.userId}]`
    );
    const keys = socketIdGenerator.getAllKeys(this.sockets);
    keys.forEach((socketId) => {
      this.send(this.sockets[socketId], serializedMessage);
    });
  }

  registerClientMessage(socket: WebSocket, socketId: string) {
    socket.on('message', (serializedMessage: string) => {
      const message: ClientMessage =
        this.jsonSerializer.fromJson(serializedMessage);
      this.eventEmitter.emit(
        UserFeedEvent.CLIENT_MESSAGE,
        this.userId,
        socketId,
        message
      );
    });
  }

  protected send(socket: WebSocket, serializedMessage: string) {
    socket.send(serializedMessage, this.onSendError.bind(this));
  }

  onSendError(error: Error) {
    if (error) {
      this.logger.error('Could not send message', error);
    }
  }

  /**
   * Number of active (or considered active) connections.
   *
   * @return {number}
   */
  connectionCount(): number {
    return socketIdGenerator.getAllKeys(this.sockets).length;
  }
}
