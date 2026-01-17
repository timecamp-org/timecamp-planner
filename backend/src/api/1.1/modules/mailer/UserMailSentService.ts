import { inject, injectable } from 'inversify';
import { MailerModule } from './MailerModule';
import { UserMailSentServiceInterface } from './interfaces/UserMailSentServiceInterface';
import { UserMailSentProviderInterface } from './interfaces/UserMailSentProviderInterface';
import { MailType, UserMailSentDbRow, UserInOrganizationDbRow } from '../db/schema';
import { Id } from '../common/identifier';

@injectable()
export class UserMailSentService
  implements UserMailSentServiceInterface {

  protected userMailSentProvider: UserMailSentProviderInterface;

  constructor(
    @inject(MailerModule.UserMailSentProviderInterface) userMailSentProvider: UserMailSentProviderInterface,
  ) {
    this.userMailSentProvider = userMailSentProvider
  }

  async setMailAlreadySentToUsers(usersInOrganizations: UserInOrganizationDbRow[], mailType: MailType): Promise<void> {
    const rows: UserMailSentDbRow[] = usersInOrganizations.map(userInOrganization => ({
      userId: userInOrganization.userId,
      userInOrganizationId: userInOrganization.id,
      mailType
    }))
    return await this.userMailSentProvider.createUserMailSentRows(rows);
  }

  async filterOutUserInOrganizationIdsWhichAlreadyGotMail(usersInOrganizationsIds: Id[], mailType: MailType): Promise<Id[]> {
    const userMailSentRows: UserMailSentDbRow[] = await this.userMailSentProvider.getUserMailSentRows(usersInOrganizationsIds, mailType);
    return usersInOrganizationsIds
      .filter(userInOrganizationId => !userMailSentRows.find(userMailSentRow => userMailSentRow.userInOrganizationId === userInOrganizationId))
  }

}
