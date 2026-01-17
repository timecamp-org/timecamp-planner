
import { Id } from '../common/identifier'
import { CreateBotResult, CreateSampleSpaceResult } from './types'
import { PublicUserDbRow } from '../db/schema'

export interface BotProviderInterface
{
  createBotForOrganization(trx: Transaction, organizationId: Id): PromiseLike<CreateBotResult>

  createSampleProject(trx: Transaction, organizationId: Id, botId: Id, userLanguage: string): PromiseLike<CreateSampleSpaceResult>;

  createConversationWithBot(trx: Transaction, organizationId: Id, userId: Id, bot: PublicUserDbRow): PromiseLike<void>

  getBotForOrganization(organizationId: Id, trx?: Transaction): PromiseLike<PublicUserDbRow>
}
