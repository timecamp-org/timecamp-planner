import { inject, injectable } from 'inversify';
import { WebhooksJobFactoryInterface } from './interfaces/WebhooksJobFactoryInterface';
import { CommonModule } from '../common/CommonModule';
import { WebhooksJobType } from './types';
import { Id, IdGeneratorInterface } from '../common/identifier';

@injectable()
export class WebhooksJobFactory implements WebhooksJobFactoryInterface {
  constructor(
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>
  ) {}

  private createBaseJob(type: WebhooksJobType) {
    return {
      id: this.idGenerator.generateId(),
      type,
    };
  }
  createSendWebhookJob(kwargs) {
    const baseJob = this.createBaseJob(WebhooksJobType.SEND_WEBHOOK);
    return {
      ...baseJob,
      ...kwargs,
    };
  }
}
