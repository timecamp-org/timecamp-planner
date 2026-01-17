import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import config from '../../../../config';
import { MessageQueueModule } from './MessageQueueModule';
import { AMQPInstance } from './amqp/AMQPInstance';
import { MessageQueueInstanceInterface } from './interfaces/MessageQueueInstanceInterface';
import { AMQPPublisher } from './amqp/AMQPPublisher';
import { MessageQueuePublisherInterface } from './interfaces/MessageQueuePublisherInterface';
import { JobStatusProviderInterface } from './interfaces/JobStatusProviderInterface';
import { JobStatusProvider } from './providers/JobStatusProvider';
import { JobStatusServiceInterface } from './interfaces/JobStatusServiceInterface';
import { JobStatusService } from './JobStatusService';
import { AMQPDelayedPublisher } from './amqp/AMQPDelayedPublisher'
import { interfaces } from 'inversify';
import { MessageOptions } from './types';

export const messageQueueModule: ModuleLoaderType = kernel => {
  kernel.bind(MessageQueueModule.MessageQueueOptions)
    .toConstantValue(config.messageQueue)

  kernel.bind<MessageQueueInstanceInterface>(MessageQueueModule.MessageQueueInstanceInterface)
    .to(AMQPInstance)

  kernel.bind<MessageQueuePublisherInterface>(MessageQueueModule.MessageQueuePublisherInterface)
    .to(AMQPPublisher)

  kernel.bind<MessageQueuePublisherInterface>(MessageQueueModule.DelayedMessageQueuePublisherInterface)
    .to(AMQPDelayedPublisher)

  kernel.bind<JobStatusProviderInterface>(MessageQueueModule.JobStatusProviderInterface)
    .to(JobStatusProvider)

  kernel.bind<JobStatusServiceInterface>(MessageQueueModule.JobStatusServiceInterface)
    .to(JobStatusService)

  kernel
    .bind<interfaces.Factory<MessageOptions>>(MessageQueueModule.DelayedQueueMessageOptionsFactory)
    .toFactory<MessageOptions>(() => {
      return (delay: number) => ({
        persistent: true, headers: { 'x-delay': delay }
      })
    })
}