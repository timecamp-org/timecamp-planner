
import { Id } from '../../common/identifier';
import { ChatWithMeTokenDbRow } from '../../db/schema';

export interface ChatWithMeCustomFieldsProviderInterface {
  getInvitationTokenDbRow(token: string, trx?: Transaction): Promise<ChatWithMeTokenDbRow>;
  getInviterId(userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<string>;
}
