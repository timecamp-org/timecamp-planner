import { Channel } from 'amqplib';

export interface AMQPOptions {
  hostname: string;
  vhost: string;
  username: string;
  password: string;
  port: number;
}

export type ChannelMap = { [key: string]: Channel };

export enum ExchangeName {
  DELAYED = 'delayed',
  RETRY = 'retry',
  TTL = 'ttl',
  DLX = 'dlx',
}

export enum ExchangeType {
  DIRECT = 'direct',
  FANOUT = 'fanout',
  TOPIC = 'topic',
  HEADER = 'header',
  DELAYED = 'x-delayed-message',
  RETRY = 'x-dead-letter-exchange',
}

export enum ExchangeQueueName {
  RETRY = 'retry',
}
