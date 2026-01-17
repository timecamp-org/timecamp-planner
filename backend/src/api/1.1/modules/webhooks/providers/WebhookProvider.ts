import { inject, injectable } from 'inversify';
import { Id } from '../../common/identifier';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { DbModule } from '../../db/DbModule';
import Table from '../../db/Table';
import { WebhookDbRow } from '../../db/schema';
import { WebhookProviderInterface } from '../interfaces/WebhookProviderInterface';
import { WebhookCreateRequestBodyInterface } from '../types';
import { first } from 'lodash';
import { EntityStatus } from '../../common/enum';

const KNEX_WEBHOOK_RETURNING_COLUMNS: Partial<keyof WebhookDbRow>[] = ['id', 'createdAt', 'callbackUrl', 'status'];
@injectable()
export class WebhookProvider implements WebhookProviderInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}
  async createWebhook(data: WebhookCreateRequestBodyInterface & { userId: Id }) {
    const { callbackUrl, userId, secretKey } = data;

    return await this.connection
      .getConnection()
      .insert({ callbackUrl, userId, secretKey })
      .into(Table.WEBHOOK)
      .returning(KNEX_WEBHOOK_RETURNING_COLUMNS)
      .then(first);
  }

  async updateWebhook(id: Id, data: WebhookCreateRequestBodyInterface) {
    return await this.connection
      .getConnection()
      .from(Table.WEBHOOK)
      .where({ id })
      .update(data)
      .returning(KNEX_WEBHOOK_RETURNING_COLUMNS)
      .then(first);
  }

  async deleteWebhook(id) {
    return await this.connection
      .getConnection()
      .from(Table.WEBHOOK)
      .where({ id })
      .update({ status: EntityStatus.DELETED })
      .returning(KNEX_WEBHOOK_RETURNING_COLUMNS)
      .then(first);
  }

  async disableWebhook(id: string): Promise<WebhookDbRow> {
    return await this.connection
      .getConnection()
      .from(Table.WEBHOOK)
      .where({ id })
      .update({ status: EntityStatus.ARCHIVED })
      .returning(KNEX_WEBHOOK_RETURNING_COLUMNS)
      .then(first);
  }

  async getWebhook(id: Id) {
    return await this.connection.getConnection().select().from(Table.WEBHOOK).where({ id }).first();
  }

  async getWebhooks(userId: Id): Promise<WebhookDbRow[]> {
    return await this.connection
      .getConnection()
      .select()
      .from(Table.WEBHOOK)
      .where({ userId, status: EntityStatus.EXISTS });
  }

  async getWebhookByUserCallbackUrl(userId: Id, callbackUrl: string) {
    return await this.connection
      .getConnection()
      .select()
      .from(Table.WEBHOOK)
      .where({ userId, callbackUrl })
      .returning('*')
      .first();
  }
}
