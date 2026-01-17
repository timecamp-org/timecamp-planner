import { Channel } from 'amqplib';

export interface AMQPOptions {
  hostname: string,
  vhost: string,
  username: string,
  password: string,
  port: number,
}

export type ChannelMap = { [key: string]: Channel}

export enum ExchangeName {
  DELAYED = 'delayed'
}

export enum ExchangeType {
  DIRECT = 'direct',
  FANOUT = 'fanout',
  TOPIC = 'topic',
  HEADER = 'header',
  DELAYED = 'x-delayed-message',
}