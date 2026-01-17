import { inject, injectable } from 'inversify';
import { WebhooksJobInterface, WebhooksJobType } from '../types';
import { AbstractWebhookSubWorker } from './AbstractWebhookSubworker';

import { MessageQueueModule } from '../../messageQueue/MessageQueueModule';
import { ExchangeName } from '../../messageQueue/amqp/types';
import { MessageQueuePublisherInterface } from '../../messageQueue/interfaces/MessageQueuePublisherInterface';
import { QueueDescriptorInterface } from '../../messageQueue/interfaces/QueueDescriptorInterface';
import { getRetryQueueName } from '../../messageQueue/utils';
import { Redis } from '../../redis/Redis';
import { RedisModule } from '../../redis/RedisModule';
import { WebhookModule } from '../WebhookModule';
import {
  WEBHOOK_FAILS_LIMIT_BEFORE_REMOVAL,
  WEBHOOK_RETRY_COUNT_LIMIT_BEFORE_FAIL,
  WEBHOOK_SUCCESSFUL_RESPONSE_STATUSES,
} from '../const';
import { WebhookProviderInterface } from '../interfaces/WebhookProviderInterface';
import { WebhooksJobFactoryInterface } from '../interfaces/WebhooksJobFactoryInterface';
import { WebhookFailProvider } from '../providers/WebhookFailProvider';
import { convertFailedResponse, webhookRequest } from '../utils';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';

@injectable()
export class WebhooksSubworker extends AbstractWebhookSubWorker {
  constructor(
    @inject(WebhookModule.WebhooksJobFactoryInterface)
    private jobFactory: WebhooksJobFactoryInterface,
    @inject(WebhookModule.WebhooksQueue)
    private queue: QueueDescriptorInterface,

    @inject(RedisModule.Redis)
    private redis: Redis,

    @inject(MessageQueueModule.RetryQueueMessagePublisherInterface)
    private retryMqPublisher: MessageQueuePublisherInterface,
    @inject(WebhookModule.WebhookProviderInterface)
    private webhookProvider: WebhookProviderInterface,
    @inject(WebhookModule.WebhookFailProviderInterface)
    private webhookFailProvider: WebhookFailProvider,
    @inject(InfrastructureModule.LoggerInterface)
    protected logger: LoggerInterface
  ) {
    super(WebhooksJobType.SEND_WEBHOOK);
  }

  public async handle(job: WebhooksJobInterface): Promise<void> {
    try {
      const { messageId, data, headers, callbackUrl, retryCount, timestamp, webhookId } = job;
      const currentRedisMessageIdTimestamp = await this.redis.get(messageId);

      const isJobOutdated = currentRedisMessageIdTimestamp > timestamp;

      if (isJobOutdated) {
        return;
      }
      const response = await webhookRequest({ data, headers, callbackUrl });

      const isWebhookResponseSuccessful = WEBHOOK_SUCCESSFUL_RESPONSE_STATUSES.includes(response.status);
      if (isWebhookResponseSuccessful) {
        await this.redis.del(messageId);
        return;
      }

      const newRetryCount = retryCount + 1;
      const isWebhookFailedTooManyTimes = newRetryCount > WEBHOOK_RETRY_COUNT_LIMIT_BEFORE_FAIL;

      if (isWebhookFailedTooManyTimes) {
        await this.handleFail(job, response);
        return;
      }

      const retryJob = this.jobFactory.createSendWebhookJob({
        messageId,
        data,
        headers,
        callbackUrl,
        retryCount: newRetryCount,
        timestamp,
        webhookId,
      });
      const newRetryQueueName = getRetryQueueName(newRetryCount);
      await this.retryMqPublisher.publish(
        retryJob,
        this.queue,
        {
          persistent: true,
        },
        ExchangeName.TTL,
        newRetryQueueName
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async handleFail(webhooksJob: WebhooksJobInterface, failedResponse: any) {
    const { webhookId } = webhooksJob;
    const response = convertFailedResponse(failedResponse);

    await this.webhookFailProvider.createWebhookFail({ webhookId, response });

    const webhookFails = await this.webhookFailProvider.getWebhookFailsByWebhookId(webhookId);

    const shouldWebhookRemainEnabled = webhookFails.length < WEBHOOK_FAILS_LIMIT_BEFORE_REMOVAL;
    if (shouldWebhookRemainEnabled) {
      return;
    }

    if (response.status < 500) {
      await this.webhookProvider.deleteWebhook(webhookId);
    } else {
      await this.webhookProvider.disableWebhook(webhookId);
    }
  }
}
