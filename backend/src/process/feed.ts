// Import required at top-level by inversify-js package. Don't ask why.. No idea.
import { Message } from 'amqplib';
import 'reflect-metadata';
import { FeedModule } from '../api/1.1/modules/feed/FeedModule';
import { FeedServiceInterface } from '../api/1.1/modules/feed/interfaces/FeedServiceInterface';
import { MessageQueueModule } from '../api/1.1/modules/messageQueue/MessageQueueModule';
import { MessageQueueInstanceInterface } from '../api/1.1/modules/messageQueue/interfaces/MessageQueueInstanceInterface';
import { MessageQueueWorkerInterface } from '../api/1.1/modules/messageQueue/interfaces/MessageQueueWorkerInterface';
import { RetryMessageQueuePublisherInterface } from '../api/1.1/modules/messageQueue/interfaces/RetryMessageQueuePublisherInterface';
import { Redis } from '../api/1.1/modules/redis/Redis';
import { RedisModule } from '../api/1.1/modules/redis/RedisModule';
import { WebhookModule } from '../api/1.1/modules/webhooks/WebhookModule';
import { WebhookRetryMessageQueuePublisherOptions } from '../api/1.1/modules/webhooks/WebhookRetryMessageQueuePublisherOptions';
import { FeedServer } from '../infrastructure/FeedServer';
import { InfrastructureModule } from '../infrastructure/InfrastructureModule';
import { ProcessEventType } from '../infrastructure/types';
import { theKernel } from '../services';

import { interfaces } from 'inversify';
const feedPort = parseInt(process.env.FEED_PORT) || 3002;

(async () => {
  const mqInstance = theKernel.get<MessageQueueInstanceInterface>(MessageQueueModule.MessageQueueInstanceInterface);

  const retryPublisherFactory = theKernel.get<interfaces.Factory<RetryMessageQueuePublisherInterface>>(
    MessageQueueModule.RetryMessageQueuePublisherFactory
  );

  const retryPublisher = retryPublisherFactory(
    WebhookRetryMessageQueuePublisherOptions
  ) as RetryMessageQueuePublisherInterface;

  const worker = theKernel.get<MessageQueueWorkerInterface<Message>>(WebhookModule.WebhooksWorker);

  const redisInstance = theKernel.get<Redis>(RedisModule.Redis);

  const feedServer = theKernel.get<FeedServer>(InfrastructureModule.FeedServer);
  const feedService = theKernel.get<FeedServiceInterface>(FeedModule.FeedServiceInterface);

  feedService.initialize();

  await mqInstance.connect();
  await retryPublisher.initialize();
  await worker.initialize();
  await worker.listen();

  await feedServer.listen(feedPort);

  console.log(`FeedServer is listening on ${feedPort}`);

  process.on(ProcessEventType.SIGINT, () => {
    console.log('Received SIGINT. Initiating graceful shutdown...');
    feedService.close();
    feedServer.close();
    retryPublisher.close();
    worker.close();
    mqInstance.disconnect();
    redisInstance.disconnect();

    process.exit(0);
  });
})();
