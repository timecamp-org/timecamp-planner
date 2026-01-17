import { EntityStatus } from '../../common/enum';
import { Id } from '../../common/identifier';
import { WebhookDbRow } from '../../db/schema';
import { WebhookCreateRequestBodyInterface } from '../types';

export interface WebhookProviderInterface {
  createWebhook(data: WebhookCreateRequestBodyInterface & { userId: Id }): Promise<WebhookDbRow>;
  updateWebhook(id: Id, data: WebhookCreateRequestBodyInterface & { status: EntityStatus }): Promise<WebhookDbRow>;
  getWebhooks(userId: Id): PromiseLike<WebhookDbRow[]>;
  getWebhook(webhookId: Id): PromiseLike<WebhookDbRow>;
  deleteWebhook(id: Id): PromiseLike<WebhookDbRow>;
  disableWebhook(id: Id): PromiseLike<WebhookDbRow>;
  getWebhookByUserCallbackUrl(userId: Id, callbackUrl: string): Promise<WebhookDbRow>;
}
