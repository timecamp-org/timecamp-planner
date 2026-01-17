import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { CommonModule } from '../common/CommonModule';
import { EntityStatus } from '../common/enum';
import { Id } from '../common/identifier';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { OrganizationRole, WebhookDbRow } from '../db/schema';
import { MessageQueueModule } from '../messageQueue/MessageQueueModule';
import { MessageQueuePublisherInterface } from '../messageQueue/interfaces/MessageQueuePublisherInterface';
import { QueueDescriptorInterface } from '../messageQueue/interfaces/QueueDescriptorInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { WebhookModule } from './WebhookModule';
import { WebhookProviderInterface } from './interfaces/WebhookProviderInterface';
import { WebhookServiceInterface } from './interfaces/WebhookServiceInterface';
import { WebhooksJobFactoryInterface } from './interfaces/WebhooksJobFactoryInterface';
import {
  CreateWebhookStatus,
  DeleteWebhookStatus,
  GetWebhookStatus,
  GetWebhooksStatus,
  UpdateWebhookStatus,
  WebhookCreateRequestBodyInterface,
  WebhooksQueueType,
} from './types';
import { getHeaders, getPayload, getRedisMessageId, validateUrl } from './utils';

import { ExchangeName } from '../messageQueue/amqp/types';
import { Redis } from '../redis/Redis';
import { RedisModule } from '../redis/RedisModule';
@injectable()
export class WebhookService implements WebhookServiceInterface {
  constructor(
    @inject(WebhookModule.WebhookProviderInterface)
    private webhookProvider: WebhookProviderInterface,

    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,

    @inject(InfrastructureModule.LoggerInterface)
    protected logger: LoggerInterface,

    @inject(WebhookModule.WebhooksJobFactoryInterface)
    private jobFactory: WebhooksJobFactoryInterface,

    @inject(MessageQueueModule.RetryQueueMessagePublisherInterface)
    private retryMqPublisher: MessageQueuePublisherInterface,
    @inject(WebhookModule.WebhooksQueue)
    private queue: QueueDescriptorInterface,

    @inject(RedisModule.Redis)
    private redis: Redis
  ) {}

  async getWebhook(webhookId: Id, userId: Id) {
    const webhook = await this.webhookProvider.getWebhook(webhookId);
    if (!webhook) {
      return {
        status: GetWebhookStatus.WEBHOOK_NOT_FOUND,
      };
    }

    const webhookDoesntBelongToUser = webhook.userId !== userId;
    if (webhookDoesntBelongToUser) {
      return {
        status: GetWebhookStatus.WEBHOOK_NOT_OWNED,
      };
    }
    return {
      status: GetWebhookStatus.OK,
      webhook,
    };
  }
  async getWebhooks(userId: Id) {
    const webhooks = await this.webhookProvider.getWebhooks(userId);

    if (!webhooks) {
      return {
        status: GetWebhooksStatus.WEBHOOK_NOT_FOUND,
      };
    }

    return {
      status: GetWebhooksStatus.OK,
      webhooks,
    };
  }

  async createWebhook(data: WebhookCreateRequestBodyInterface, userId: Id) {
    const userInOrganizations = await this.userInOrganizationProvider.getUserOrganizations(userId);
    const isOrganizationOwner = userInOrganizations
      .filter((organization) => organization.entityStatus === EntityStatus.EXISTS)
      .some((userInOrganization) => userInOrganization.role === OrganizationRole.OWNER);

    if (!isOrganizationOwner) {
      return {
        status: CreateWebhookStatus.USER_NOT_ORGANIZATION_OWNER,
      };
    }

    const isValidUrl = validateUrl(data.callbackUrl);

    if (!isValidUrl) {
      return {
        status: CreateWebhookStatus.INVALID_CALLBACK_URL,
      };
    }

    const existingWebhookForSpecificCallbackUrl = await this.webhookProvider.getWebhookByUserCallbackUrl(
      userId,
      data.callbackUrl
    );

    let webhook;
    if (existingWebhookForSpecificCallbackUrl) {
      webhook = await this.webhookProvider.updateWebhook(existingWebhookForSpecificCallbackUrl.id, {
        ...data,
        status: EntityStatus.EXISTS,
      });
    } else {
      webhook = await this.webhookProvider.createWebhook({
        ...data,
        userId,
      });
    }

    return {
      status: CreateWebhookStatus.OK,
      webhook,
    };
  }

  async updateWebhook(webhookId, userId, data) {
    const webhook = await this.webhookProvider.getWebhook(webhookId);

    if (!webhook) {
      return {
        status: UpdateWebhookStatus.WEBHOOK_NOT_FOUND,
      };
    }

    const webhookDoesntBelongToUser = webhook.userId !== userId;
    if (webhookDoesntBelongToUser) {
      return {
        status: UpdateWebhookStatus.WEBHOOK_NOT_OWNED,
      };
    }

    const updatedWebhook = await this.webhookProvider.updateWebhook(webhookId, data);

    return {
      status: UpdateWebhookStatus.OK,
      webhook: updatedWebhook,
    };
  }

  async deleteWebhook(webhookId, userId) {
    const webhook = await this.webhookProvider.getWebhook(webhookId);
    if (!webhook) {
      return {
        status: DeleteWebhookStatus.WEBHOOK_NOT_FOUND,
      };
    }

    const webhookDoesntBelongToUser = webhook.userId !== userId;
    if (webhookDoesntBelongToUser) {
      return {
        status: DeleteWebhookStatus.WEBHOOK_NOT_OWNED,
      };
    }

    await this.webhookProvider.deleteWebhook(webhookId);

    return {
      status: DeleteWebhookStatus.OK,
    };
  }

  async triggerWebhooks(props) {
    const { organizationOwnerId, payload, operation, entityType } = props;

    const webhooks = await this.webhookProvider.getWebhooks(organizationOwnerId);

    for (const webhook of webhooks) {
      const redisMessageId = getRedisMessageId(webhook.id, entityType, operation, payload.id);

      await this.handleWebhook(
        webhook,
        {
          operation,
          entityType,
          payload,
        },
        redisMessageId
      );
    }
  }

  async handleWebhook(webhook: WebhookDbRow, payload: any, messageId: string) {
    try {
      const { callbackUrl, secretKey, id } = webhook;
      const timestamp = this.timeService.getCurrentEpoch();

      const data = getPayload(timestamp, payload);
      const headers = getHeaders(secretKey, data);

      await this.redis.set(messageId, timestamp);

      const job = this.jobFactory.createSendWebhookJob({
        messageId,
        data,
        headers,
        callbackUrl,
        retryCount: 1,
        timestamp,
        webhookId: id,
      });

      await this.retryMqPublisher.publish(
        job,
        this.queue,
        {
          persistent: true,
        },
        ExchangeName.RETRY,
        WebhooksQueueType.WEBHOOKS
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
