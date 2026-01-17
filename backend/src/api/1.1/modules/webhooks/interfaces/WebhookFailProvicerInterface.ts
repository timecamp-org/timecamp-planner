import { Id } from '../../common/identifier';
import { WebhookFailDbRow } from '../../db/schema';

export interface WebhookFailProviderInterface {
  createWebhookFail(webhookFailDbRow: WebhookFailDbRow): Promise<WebhookFailDbRow>;
  getWebhookFailsByWebhookId(webhookId: Id): Promise<WebhookFailDbRow[]>;
}
