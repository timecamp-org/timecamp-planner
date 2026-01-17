import { Id } from '../../common/identifier';
import { WebhookDbRow } from '../../db/schema';
import { NotificationAction } from '../../db/types';
import {
  CreateWebhookResult,
  DeleteWebhookResult,
  GetWebhookResult,
  GetWebhooksResult,
  UpdateWebhookResult,
  WebhookCreateRequestBodyInterface,
} from '../types';

export interface WebhookServiceInterface {
  getWebhook(webhookId: Id, userId: Id): Promise<GetWebhookResult>;
  getWebhooks(userId: Id): Promise<GetWebhooksResult>;
  createWebhook(data: WebhookCreateRequestBodyInterface, userId: Id): Promise<CreateWebhookResult>;
  updateWebhook(webhookId: Id, userId: Id, data: any): Promise<UpdateWebhookResult>;
  deleteWebhook(id: Id, userId: Id): Promise<DeleteWebhookResult>;

  triggerWebhooks(data: {
    operation?: NotificationAction;
    payload: Record<string, any>;
    organizationId: Id;
    organizationOwnerId: Id;
  }): Promise<void>;
  handleWebhook(webhook: WebhookDbRow, payload: any, messageId: string): Promise<void>;
}
