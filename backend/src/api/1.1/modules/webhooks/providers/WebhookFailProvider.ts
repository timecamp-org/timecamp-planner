import { inject, injectable } from 'inversify';
import { first } from 'lodash';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { DbModule } from '../../db/DbModule';
import Table from '../../db/Table';
import { WebhookFailDbRow } from '../../db/schema';
import { WebhookFailProviderInterface } from '../interfaces/WebhookFailProvicerInterface';
import { Id } from '../../common/identifier';

@injectable()
export class WebhookFailProvider implements WebhookFailProviderInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getWebhookFailsByWebhookId(webhookId: Id) {
    const query = this.connection.getConnection();

    return await query.table(Table.WEBHOOK_FAIL).where({ webhookId }).select('*');
  }

  async createWebhookFail(webhookFailDbRow: WebhookFailDbRow) {
    const query = this.connection.getConnection();

    return await query.table(Table.WEBHOOK_FAIL).insert(webhookFailDbRow).returning('*').then(first);
  }
}
