import { LoggerInterface } from '../../../../infrastructure/logger';
import * as WebSocket from 'ws'
import { FeedMessageType } from './types';
import { ProcessType, ProcessMessage } from '../processManager/types';
import { ControlCommand } from '../messaging/types';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';

/**
 * Wrapper that monitors socket for broken connections. Does that by pinging the client in specified interval.
 * If no response is received until next ping interval, the connection is terminated.
 */
export class KeepAliveSocket {
  private socket: WebSocket;
  private isAlive: boolean;
  private keepAliveInterval: number
  private timer: NodeJS.Timeout;
  private logger: LoggerInterface;
  private jsonSerializer: JsonSerializerInterface;

  constructor(
    parameters: {
      logger: LoggerInterface,
      socket: WebSocket,
      keepAliveSeconds?: number
    },
    jsonSerializer: JsonSerializerInterface,
  ) {
    const { logger, socket, keepAliveSeconds } = parameters
    this.logger = logger;
    this.socket = socket
    this.keepAliveInterval = keepAliveSeconds || 30;
    this.isAlive = true;
    this.registerPing();
    this.registerControlCommand();
    this.jsonSerializer = jsonSerializer;
    this.onMessage = this.onMessage.bind(this)
  }

  registerPing() {
    if (this.timer) {
      return;
    }
    this.logger.debug(`Registering ping interval (${this.keepAliveInterval})`);
    this.socket.on('pong', this.onPong.bind(this));
    this.socket.on('close', this.unregisterPing.bind(this));
    this.timer = setInterval(this.ping.bind(this), this.keepAliveInterval * 1000);
  }

  registerControlCommand() {
    this.logger.debug('Registering control command');
    process.on('message', this.onMessage)
  }

  async onMessage(message: ProcessMessage): Promise<void> {
    if (!message || !message.type) {
      this.logger.error(new Error('Unspecified process message type'))
      return
    }
    switch (message.type) {
      case ProcessType.CONTROL_COMMAND: {
        const command = message.data as ControlCommand;
        this.logger.debug(`Sending control command: ${command.type}`);
        this.socket.send(this.jsonSerializer.toJson(command), this.onSendError.bind(this));
        break;
      }
      default: break;
    }
  }

  unregisterPing() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  onPong() {
    this.logger.verbose('Got pong!');
    this.isAlive = true;
  }

  ping() {
    if (!this.isAlive) {
      return this.terminate()
    }
    this.isAlive = false;
    this.socket.ping();
    // Special message type sent to browser because browser cannot intercept onpong nor send ping/pong
    this.socket.send(this.jsonSerializer.toJson({ type: FeedMessageType.PING }), this.onSendError.bind(this));
    this.logger.verbose('Pinging websocket ... ');
  }

  onSendError(error: Error) {
    if (error) {
      this.logger.error(error)
    }
  }

  private terminate() {
    this.logger.info('No pong since last ping. Terminating websocket.');
    this.unregisterPing();
    this.socket.terminate();
  }
}
