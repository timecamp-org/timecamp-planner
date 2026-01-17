export const MessageQueueModule = {
  MessageQueuePublisherInterface: Symbol('MessageQueuePublisherInterface'),
  DelayedMessageQueuePublisherInterface: Symbol('DelayedMessageQueuePublisherInterface'),
  RetryQueueMessagePublisherInterface: Symbol('RetryQueueMessagePublisherInterface'),
  MessageQueueOptions: Symbol('MessageQueueOptions'),
  MessageQueueInstanceInterface: Symbol('MessageQueueInstanceInterface'),
  MessageQueueProvider: Symbol('MessageQueueProvider'),
  JobStatusProviderInterface: Symbol('JobStatusProviderInterface'),
  JobStatusServiceInterface: Symbol('JobStatusServiceInterface'),
  WorkerOptionsInterface: Symbol('WorkerOptionsInterface'),
  DelayedQueueMessageOptionsFactory: Symbol('DelayedQueueMessageOptionsFactory'),
  RetryMessageQueuePublisherFactory: Symbol('RetryMessageQueuePublisherFactory'),
};
