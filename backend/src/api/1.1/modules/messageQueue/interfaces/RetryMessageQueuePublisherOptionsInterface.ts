interface RetryMessageQueue {
  messageTtl: number;
  name: string;
}

export interface RetryMessageQueuePublisherOptionsInterface {
  retryQueues: RetryMessageQueue[];
}
