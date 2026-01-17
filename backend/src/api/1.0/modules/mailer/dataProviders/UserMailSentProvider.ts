import { UserMailSentProviderInterface } from '../interfaces/UserMailSentProviderInterface'
import { Id } from '../../common/identifier'

import Table from '../../db/Table'
import { injectable, inject } from 'inversify'
import { UserMailSentDbRow, MailType } from '../../db/schema';
import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';

@injectable()
export class UserMailSentProvider implements UserMailSentProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async createUserMailSentRows(userMailSentRows: UserMailSentDbRow[]): Promise<void> {
    return await this.connection.getQueryBuilder()
      .insert(userMailSentRows)
      .into(Table.USER_MAIL_SENT)
  }

  async getUserMailSentRows(usersInOrganizationsIds: Id[], mailType: MailType): Promise<UserMailSentDbRow[]> {
    return await this.connection.getQueryBuilder()
      .from(Table.USER_MAIL_SENT)
      .where('mailType', mailType)
      .whereIn('userInOrganizationId', usersInOrganizationsIds)
  }

}
