import { TaskDbRow, ConversationSettingsDbRow, ProjectDbRow } from '../../db/schema';
import { Id } from '../../common/identifier';

import { QueryModifier, ConversationSettingsJson } from '../../../../../services/types';
import { UpdateConversationSettingsResult, CreateProjectResult } from '../types';

export interface ConversationServiceInterface {
  getConversationTasks(projectId: Id, trx?: Transaction, queryDecorators?: QueryModifier[]): PromiseLike<TaskDbRow[]>

  getUserConversations(userId: Id, organizationId: Id): PromiseLike<ProjectDbRow[]>;

  getUserConversationsSettings(userId: Id, organizationId: Id, decorate?: QueryModifier, trx?: Transaction): PromiseLike<Partial<ConversationSettingsDbRow>[]>

  updateConversationSettings(
    userId: Id,
    conversationHash: string,
    organizationId: Id,
    settings: ConversationSettingsJson
  ): PromiseLike<UpdateConversationSettingsResult>

  getConversationSettings(userId: Id, conversationHash: string, organizationId: Id): PromiseLike<ConversationSettingsDbRow>

  getConversation(organizationId: Id, memberIds: Id[], trx?: Transaction): PromiseLike<ProjectDbRow>;

  createConversation(creatorId: Id, memberIds: Id[], organizationId: Id): PromiseLike<CreateProjectResult>;

  doCreateConversation(trx: Transaction, creatorId: Id, memberIds: Id[], organizationId: Id): PromiseLike<CreateProjectResult>;

  generateConversationId(organizationId: Id, memberIds: Id[], trx?: Transaction): PromiseLike<Id>

  generateConversationHash(organizationId: Id, memberIds: Id[]): Id;

  getConversationsSettingsByHash(conversationHash: Id): PromiseLike<ConversationSettingsDbRow[]>;

}