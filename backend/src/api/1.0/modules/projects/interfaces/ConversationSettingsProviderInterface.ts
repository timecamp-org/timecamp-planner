import { Id } from '../../common/identifier';
import { ConversationSettingsDbRow } from '../../db/schema';

import { ConversationSettingsJson } from '../../../../../services/types';

export interface ConversationSettingsProviderInterface {
  getConversationSettings(
    userId: Id,
    conversationHash: Id,
    organizationId: Id,
    trx?: Transaction
  ): PromiseLike<ConversationSettingsDbRow>;

  updateConversationSettings(
    userId: Id,
    conversationHash: Id,
    organizationId: Id,
    settingsJson: ConversationSettingsJson,
    trx?: Transaction
  ): PromiseLike<void>;

  createConversationSettings(
    userId: Id,
    conversationHash: Id,
    organizationId: Id,
    settingsJson: ConversationSettingsJson,
    trx?: Transaction
  ): PromiseLike<void>;

  hideConversations(
    userId: Id,
    organizationId: Id,
    conversationHashes: Id[],
    trx?: Transaction
  ): PromiseLike<void>;
}
