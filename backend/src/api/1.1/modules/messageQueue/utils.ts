import { DEFAULT_RETRY_QUEUE_NAME_PREFIX } from './const';

export const getRetryQueueName = (index: number) => `${DEFAULT_RETRY_QUEUE_NAME_PREFIX}${index}`;
