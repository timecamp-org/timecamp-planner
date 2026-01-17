import { injectable, unmanaged } from 'inversify';
import { WebhooksSubworkerInterface } from '../interfaces/WebhooksSubworkerInterface';
import { WebhooksJobInterface, WebhooksJobType } from '../types';

@injectable()
export abstract class AbstractWebhookSubWorker implements WebhooksSubworkerInterface {
  protected constructor(@unmanaged() protected jobType: WebhooksJobType) {}

  public abstract handle(job: WebhooksJobInterface): Promise<void>;
  public async supports(job: WebhooksJobInterface): Promise<boolean> {
    return job.type === this.jobType;
  }
}
