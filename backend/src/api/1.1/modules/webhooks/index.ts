import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { MessageQueueModule } from '../messageQueue/MessageQueueModule';
import { QueueDescriptor } from '../messageQueue/QueueDescriptor';
import { WorkerOptionsInterface } from '../messageQueue/types';

import { WebhookModule } from './WebhookModule';
import { WebhookService } from './WebhookService';
import { WebhooksJobFactory } from './WebhooksJobFactory';
import { WebhookFailProviderInterface } from './interfaces/WebhookFailProvicerInterface';
import { WebhookProviderInterface } from './interfaces/WebhookProviderInterface';
import { WebhookServiceInterface } from './interfaces/WebhookServiceInterface';
import { WebhooksJobFactoryInterface } from './interfaces/WebhooksJobFactoryInterface';
import { WebhookFailProvider } from './providers/WebhookFailProvider';
import { WebhookProvider } from './providers/WebhookProvider';
import { WebhooksQueueType } from './types';
import { WebhooksSubworker } from './workers/WebhooksSubworker';
import { WebhooksWorker } from './workers/WebhooksWorker';

export const webhookModule: ModuleLoaderType = (kernel) => {
  kernel.bind<WebhookServiceInterface>(WebhookModule.WebhookServiceInterface).to(WebhookService);
  kernel.bind<WebhookProviderInterface>(WebhookModule.WebhookProviderInterface).to(WebhookProvider);

  kernel.bind<WebhooksSubworker>(WebhookModule.WebhookSubworkers).to(WebhooksSubworker);
  kernel.bind<WebhooksWorker>(WebhookModule.WebhooksWorker).to(WebhooksWorker);
  kernel
    .bind<WorkerOptionsInterface>(MessageQueueModule.WorkerOptionsInterface)
    .toConstantValue({ maxConcurrentJobs: 5 })
    .whenTargetNamed('WebhooksWorker');

  kernel
    .bind(WebhookModule.WebhooksQueue)
    .toDynamicValue(() => new QueueDescriptor(WebhooksQueueType.WEBHOOKS, { durable: true }));

  kernel.bind<WebhooksJobFactoryInterface>(WebhookModule.WebhooksJobFactoryInterface).to(WebhooksJobFactory);

  kernel.bind<WebhookFailProviderInterface>(WebhookModule.WebhookFailProviderInterface).to(WebhookFailProvider);
};
