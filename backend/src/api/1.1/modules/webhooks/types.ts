import Table from '../db/Table';
import { WebhookDbRow } from '../db/schema';
import { JobInterface } from '../messageQueue/types';

export type ResourceTypes = 'PROJECT' | 'TASK' | 'ORGANIZATION' | 'TASK-LIST' | 'USER' | 'CHECKLIST-ITEM';

export type ResourceTypesByTableName = Partial<Record<Table, any>>;

export type WebhookCreateResourceRequestBodyInterface = {
  isPrivate?: boolean;
};

export type WebhookCreateRequestBodyInterface = {
  callbackUrl: string;

  resources: Record<ResourceTypes, WebhookCreateResourceRequestBodyInterface>;
  secretKey: string;
};

export enum WebhooksQueueType {
  WEBHOOKS = 'webhooks',
  WEBHOOKS_RETRY = 'webhooks_retry',
}

export enum WebhooksJobType {
  SEND_WEBHOOK = 'send_webhook',
}

export type WebhooksJobInterface = JobInterface<WebhooksJobType> & {
  messageId: string;

  data: any;
  headers: Record<string, any>;
  callbackUrl: string;
  retryCount: number;
  timestamp: number;
  webhookId: string;
};

export enum CreateWebhookStatus {
  OK,
  USER_NOT_ORGANIZATION_OWNER,
  INVALID_CALLBACK_URL,
}

export interface CreateWebhookResult {
  status: CreateWebhookStatus;
  webhook?: WebhookDbRow;
}

export enum UpdateWebhookStatus {
  OK,
  WEBHOOK_NOT_FOUND,
  WEBHOOK_NOT_OWNED,
}
export interface UpdateWebhookResult {
  status: UpdateWebhookStatus;
  webhook?: WebhookDbRow;
}
export enum GetWebhookStatus {
  OK,
  WEBHOOK_NOT_OWNED,
  WEBHOOK_NOT_FOUND,
}

export interface GetWebhookResult {
  status: GetWebhookStatus;
  webhook?: WebhookDbRow;
}

export enum GetWebhooksStatus {
  OK,
  WEBHOOK_NOT_FOUND,
}

export interface GetWebhooksResult {
  status: GetWebhooksStatus;
  webhooks?: WebhookDbRow[];
}

export enum DeleteWebhookStatus {
  OK,
  WEBHOOK_NOT_FOUND,
  WEBHOOK_NOT_OWNED,
}

export interface DeleteWebhookResult {
  status: DeleteWebhookStatus;
}
