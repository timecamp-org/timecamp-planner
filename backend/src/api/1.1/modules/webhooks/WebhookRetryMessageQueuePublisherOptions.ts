import { DEFAULT_RETRY_QUEUE_NAME_PREFIX } from '../messageQueue/const';
import { RetryMessageQueuePublisherOptionsInterface } from '../messageQueue/interfaces/RetryMessageQueuePublisherOptionsInterface';
import { WEBHOOK_RETRY_QUEUE_INTERVALS_TTLS } from './const';

export const WebhookRetryMessageQueuePublisherOptions: RetryMessageQueuePublisherOptionsInterface = {
  retryQueues: WEBHOOK_RETRY_QUEUE_INTERVALS_TTLS.map((messageTtl, index) => ({
    messageTtl,
    name: `${DEFAULT_RETRY_QUEUE_NAME_PREFIX}${index + 1}`,
  })),
};
