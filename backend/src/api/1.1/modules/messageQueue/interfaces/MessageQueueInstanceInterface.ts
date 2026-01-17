import { Channel } from "amqplib";

export interface MessageQueueInstanceInterface {
  connect(): PromiseLike<void>
  disconnect(): PromiseLike<void>
  createChannel(): PromiseLike<Channel>
}