import { WebhooksJobInterface } from '../types';

export interface WebhooksSubworkerInterface {
  supports(job: WebhooksJobInterface): PromiseLike<boolean>;
  handle(job: WebhooksJobInterface): PromiseLike<void>;
}
