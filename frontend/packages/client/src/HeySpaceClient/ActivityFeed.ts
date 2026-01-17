import { boundClass } from 'autobind-decorator';
import EventEmitter from 'eventemitter3';

import { LoggerInterface } from '../types';

import { FeedConnectionInstance, FeedEventHandler, MessageType } from './types';

const WEBSOCKET_WANTED_CLOSE_CODE = 1005;

function Logger(logger = console): LoggerInterface {
  return {
    log: function (message) {
      logger.log(`[Feed] | ${message}`);
    },
    error: function (error) {
      logger.error(error);
    },
  };
}

export interface ActivityFeedInterface {
  subscribe(callback: CallableFunction);
}

export interface ActivityFeedOptionsInterface {
  url: string;
  reconnectionDelay?: number;
  pingTimeoutMs?: number;
  deviceType: string;
}

@boundClass
class ActivityFeed {
  private eventEmitter: EventEmitter;

  private isReconnecting: boolean;

  private pingTimeout: NodeJS.Timeout;

  private logger: LoggerInterface;

  private feedOptions: ActivityFeedOptionsInterface;

  constructor(options: ActivityFeedOptionsInterface) {
    this.eventEmitter = new EventEmitter();
    this.isReconnecting = false;
    this.pingTimeout = null;
    this.logger = Logger();
    this.feedOptions = {
      url: null,
      reconnectionDelay: 5 * 1000,
      pingTimeoutMs: 10000,
      ...options,
    };
  }

  subscribe(callback: CallableFunction) {
    const ctx = this;
    let wsc = connect();

    const feed: FeedConnectionInstance = {
      on: this.attachListener.bind(this),
      off: this.detachListener.bind(this),
      once: this.attachOnceListener.bind(this),
      unsubscribe,
      reconnect,
      close,
    };

    callback(null, feed);

    function connect() {
      const connection = new WebSocket(ctx.feedOptions.url); // eslint-disable-line
      // @ts-ignore
      connection.onerror = onError;
      connection.onopen = onOpen;
      connection.onclose = onClose;
      connection.onmessage = onMessage;

      return connection;
    }

    function onOpen() {
      ctx.eventEmitter.emit('started');
      ctx.logger.log(`Attempt to connect`);
    }

    function onError(error: Error) {
      ctx.logger.log(`Connection error`, error);
      if (ctx.eventEmitter.listeners('error').length > 0) {
        ctx.eventEmitter.emit('error', error);
      }
    }

    function onClose(event: CloseEvent) {
      ctx.eventEmitter.emit('closed');
      ctx.logger.log(`Closed with code: ${event.code}`);
      if (event.code === WEBSOCKET_WANTED_CLOSE_CODE) {
        clearTimeout(ctx.pingTimeout);
      } else {
        onSetPingTimeout();
      }
    }

    function close() {
      wsc.close();
      clearTimeout(ctx.pingTimeout);
    }

    function unsubscribe() {
      wsc.close();
      clearTimeout(ctx.pingTimeout);
      ctx.eventEmitter.removeAllListeners();
    }

    function onMessage(message: MessageEvent) {
      try {
        const parsedMessage = JSON.parse(message.data);
        switch (parsedMessage.type) {
          case MessageType.WELCOME: {
            onWelcomeMessage();
            onSetDeviceInfo();
            break;
          }
          case MessageType.PING: {
            onSetPingTimeout();
            break;
          }
          case MessageType.CONTROL_COMMAND: {
            ctx.eventEmitter.emit('controlCommand', parsedMessage);
            break;
          }
          default: {
            ctx.eventEmitter.emit('message', parsedMessage);
            break;
          }
        }
      } catch (error) {
        ctx.eventEmitter.emit('error', error);
      }
    }

    function onPingNotReceived() {
      ctx.logger.log('Ping not received. Reconnectiong WS...');
      reconnect();
    }

    function reconnect() {
      ctx.isReconnecting = true;
      wsc.close();
      wsc = connect();
    }

    function onWelcomeMessage() {
      if (ctx.isReconnecting) {
        ctx.isReconnecting = false;
        ctx.logger.log('Connection restored');
        ctx.eventEmitter.emit('reconnected');
      } else {
        ctx.logger.log('Connection started');
      }
    }

    function onSetPingTimeout() {
      clearTimeout(ctx.pingTimeout);
      ctx.pingTimeout = <any>(
        setTimeout(onPingNotReceived, ctx.feedOptions.pingTimeoutMs)
      );
    }

    function onSetDeviceInfo() {
      wsc.send(
        JSON.stringify({
          type: 'setDeviceInfo',
          deviceType: ctx.feedOptions.deviceType,
        })
      );
    }
  }

  attachListener(eventName: string, handler: FeedEventHandler) {
    return this.eventEmitter.on(eventName, handler);
  }

  attachOnceListener(eventName: string, handler: FeedEventHandler) {
    return this.eventEmitter.once(eventName, handler);
  }

  detachListener(eventName: string, handler: FeedEventHandler) {
    return this.eventEmitter.off(eventName, handler);
  }

  getEventEmitter(): EventEmitter {
    return this.eventEmitter;
  }
}

export default ActivityFeed;
