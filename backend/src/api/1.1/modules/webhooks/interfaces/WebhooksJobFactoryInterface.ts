import { WebhooksJobInterface } from '../types';

export interface WebhooksJobFactoryInterface {
  createSendWebhookJob(args: Omit<WebhooksJobInterface, 'id' | 'type'>): WebhooksJobInterface;
}
