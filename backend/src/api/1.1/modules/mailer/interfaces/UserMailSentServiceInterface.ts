import { MailType, UserInOrganizationDbRow } from '../../db/schema';
import { Id } from '../../common/identifier';

export interface UserMailSentServiceInterface {
  setMailAlreadySentToUsers(userInOrganizations: UserInOrganizationDbRow[], mailType: MailType): PromiseLike<void>

  filterOutUserInOrganizationIdsWhichAlreadyGotMail(userInOrganizationsIds: Id[], mailType: MailType): PromiseLike<Id[]>
}
