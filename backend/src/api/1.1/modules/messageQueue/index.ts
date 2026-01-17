import { interfaces } from 'inversify';
import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import config from '../../../../config';
import { JobStatusService } from './JobStatusService';
import { MessageQueueModule } from './MessageQueueModule';
import { AMQPDelayedPublisher } from './amqp/AMQPDelayedPublisher';
import { AMQPInstance } from './amqp/AMQPInstance';
import { AMQPPublisher } from './amqp/AMQPPublisher';
import { AMQPRetryPublisher } from './amqp/AMQPRetryPublisher';
import { JobStatusProviderInterface } from './interfaces/JobStatusProviderInterface';
import { JobStatusServiceInterface } from './interfaces/JobStatusServiceInterface';
import { MessageQueueInstanceInterface } from './interfaces/MessageQueueInstanceInterface';
import { MessageQueuePublisherInterface } from './interfaces/MessageQueuePublisherInterface';
import { JobStatusProvider } from './providers/JobStatusProvider';
import { MessageOptions } from './types';
import { RetryMessageQueuePublisherOptionsInterface } from './interfaces/RetryMessageQueuePublisherOptionsInterface';
import { RetryMessageQueuePublisherInterface } from './interfaces/RetryMessageQueuePublisherInterface';

export const messageQueueModule: ModuleLoaderType = (kernel) => {
  kernel.bind(MessageQueueModule.MessageQueueOptions).toConstantValue(config.messageQueue);

  kernel.bind<MessageQueueInstanceInterface>(MessageQueueModule.MessageQueueInstanceInterface).to(AMQPInstance);

  kernel.bind<MessageQueuePublisherInterface>(MessageQueueModule.MessageQueuePublisherInterface).to(AMQPPublisher);

  kernel
    .bind<MessageQueuePublisherInterface>(MessageQueueModule.DelayedMessageQueuePublisherInterface)
    .to(AMQPDelayedPublisher);

  kernel
    .bind<MessageQueuePublisherInterface>(MessageQueueModule.RetryQueueMessagePublisherInterface)
    .to(AMQPRetryPublisher);

  kernel.bind<JobStatusProviderInterface>(MessageQueueModule.JobStatusProviderInterface).to(JobStatusProvider);

  kernel.bind<JobStatusServiceInterface>(MessageQueueModule.JobStatusServiceInterface).to(JobStatusService);

  kernel
    .bind<interfaces.Factory<MessageOptions>>(MessageQueueModule.DelayedQueueMessageOptionsFactory)
    .toFactory<MessageOptions>(() => {
      return (delay: number) => ({
        persistent: true,
        headers: { 'x-delay': delay },
      });
    });

  kernel
    .bind<interfaces.Factory<RetryMessageQueuePublisherInterface>>(MessageQueueModule.RetryMessageQueuePublisherFactory)
    .toFactory<RetryMessageQueuePublisherInterface>((ctx) => {
      return (
        retryMessageQueuePublisherOptions: RetryMessageQueuePublisherOptionsInterface
      ): RetryMessageQueuePublisherInterface => {
        let retryQueuePublisher = ctx.container.get<RetryMessageQueuePublisherInterface>(
          MessageQueueModule.RetryQueueMessagePublisherInterface
        );
        retryQueuePublisher.retryPublisherOptions = retryMessageQueuePublisherOptions;
        return retryQueuePublisher;
      };
    });
};
