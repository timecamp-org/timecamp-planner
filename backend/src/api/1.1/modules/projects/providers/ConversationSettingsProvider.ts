import { ConversationSettingsProviderInterface } from '../interfaces/ConversationSettingsProviderInterface';
import { ConversationSettingsDbRow } from '../../db/schema';
import { ConversationSettingsJson } from '../../../../../services/types';
import { Id } from '../../common/identifier';

import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider';
import Table from '../../db/Table';
import { injectable } from 'inversify';

@injectable()
export class ConversationSettingsProvider
  extends AbstractPostgresProvider
  implements ConversationSettingsProviderInterface
{
  async getConversationSettings(
    userId: Id,
    conversationHash: Id,
    organizationId: Id,
    trx?: Transaction
  ): Promise<ConversationSettingsDbRow> {
    return await this.connection
      .getQueryWithTransaction(trx)
      .from(Table.CONVERSATION_SETTINGS)
      .first()
      .where({ userId, conversationHash, organizationId });
  }

  async updateConversationSettings(
    userId: Id,
    conversationHash: Id,
    organizationId: Id,
    settingsJson: ConversationSettingsJson,
    trx?: Transaction
  ): Promise<void> {
    await this.connection
      .getQueryWithTransaction(trx)
      .from(Table.CONVERSATION_SETTINGS)
      .where({ userId, conversationHash, organizationId })
      .update(settingsJson);
  }

  async createConversationSettings(
    userId: Id,
    conversationHash: Id,
    organizationId: Id,
    settingsJson: ConversationSettingsJson,
    trx?: Transaction
  ): Promise<void> {
    await this.connection
      .getQueryWithTransaction(trx)
      .insert({ userId, conversationHash, organizationId, ...settingsJson })
      .into(Table.CONVERSATION_SETTINGS);
  }

  async hideConversations(
    userId: Id,
    organizationId: Id,
    conversationHashes: Id[],
    trx?: Transaction
  ): Promise<void> {
    await this.connection
      .getQueryWithTransaction(trx)
      .update({ isVisible: false })
      .from(Table.CONVERSATION_SETTINGS)
      .whereIn('conversation_hash', conversationHashes)
      .where({ userId, organizationId, isVisible: true });
  }
}
