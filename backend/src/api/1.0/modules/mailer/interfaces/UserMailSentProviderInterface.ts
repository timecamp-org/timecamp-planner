import { UserMailSentDbRow, MailType } from '../../db/schema';
import { Id } from '../../common/identifier';

export interface UserMailSentProviderInterface {
  createUserMailSentRows(userMailSentRows: UserMailSentDbRow[]): Promise<void>

  getUserMailSentRows(usersInOrganizationsIds: Id[], mailType: MailType): Promise<UserMailSentDbRow[]>
}
