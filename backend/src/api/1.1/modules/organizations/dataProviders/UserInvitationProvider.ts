import { UserInvitationProviderInterface } from "../interfaces/UserInvitationProviderInterface";
import { UserInvitationDbRow } from "../../db/schema";
import { injectable, inject } from "inversify";

import Table from "../../db/Table";
import { TimeServiceInterface } from "../../common/time/TimeServiceInterface";
import { CommonModule } from "../../common/CommonModule";
import { UserRegistrationStatus } from "../../common/enum";
import { first } from 'lodash'
import { DbModule } from "../../db/DbModule";
import { ConnectionInterface } from "../../db/ConnectionInterface";

@injectable()
export class UserInvitationProvider implements UserInvitationProviderInterface {


  constructor(
    @inject(CommonModule.TimeServiceInterface) 
    private timeService: TimeServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
  }

  async createInvitation(userInvitation: UserInvitationDbRow, trx?: Transaction): Promise<void> {
    let connection = trx || this.connection.getConnection()
    const params = {
      table: Table.USER_INVITATION,

      inviterId: connection.raw('?', userInvitation.inviterId),
      invitedUserId: connection.raw('?', userInvitation.invitedUserId),
      organizationId: connection.raw('?', userInvitation.organizationId),
    }

    await connection.raw(
      `INSERT INTO :table: (inviter_id, invited_user_id, organization_id)` +
      `VALUES (:inviterId:, :invitedUserId:, :organizationId:)` +
      `ON CONFLICT (inviter_id, invited_user_id, organization_id) DO NOTHING`
      ,
      params
    )
  }

  async updateInvitation(userInvitation: UserInvitationDbRow, trx?: Transaction): Promise<UserInvitationDbRow> {
    let query = this.connection.getQueryWithTransaction(trx);

    userInvitation.updatedAt = this.timeService.getCurrentTime()

    return await query
      .update(userInvitation)
      .from(Table.USER_INVITATION)
      .where({
        inviterId: userInvitation.inviterId,
        invitedUserId: userInvitation.invitedUserId,
        organizationId: userInvitation.organizationId,
      })
      .returning('*')
      .then(first) as UserInvitationDbRow
  }

  async getUserInvitation(inviterId: string, invitedUserId: string, organizationId: string, trx?: Transaction): Promise<UserInvitationDbRow> {
    let query = this.connection.getQueryWithTransaction(trx);
    return await query
      .select()
      .from(Table.USER_INVITATION)
      .where({
        inviterId,
        invitedUserId,
        organizationId,
      })
      .first()
  }

  public async getNotAcceptedInvitationsWithDayOffsetSentTimes(
    dayOffset: number,
    sentTimes: number,
  ): Promise<UserInvitationDbRow[]> {
    const dateDaysAgo = this.timeService.getDateNDaysAgo(dayOffset)
    const startOfDay = this.timeService.getStartOfDay(dateDaysAgo)
    const endOfDay = this.timeService.getEndOfDay(dateDaysAgo)

    const userInvitations: UserInvitationDbRow[] = await this.connection.getQueryBuilder()
      .select(`${Table.USER_INVITATION}.*`)
      .from(Table.USER)
      .join(Table.USER_INVITATION, `${Table.USER}.id`, `${Table.USER_INVITATION}.invitedUserId`)
      .where(`${Table.USER}.registrationStatus`, UserRegistrationStatus.PENDING)
      .where(`${Table.USER_INVITATION}.createdAt`, '>=', startOfDay)
      .where(`${Table.USER_INVITATION}.createdAt`, '<', endOfDay)
      .where(`${Table.USER_INVITATION}.invitationCount`, sentTimes)

    return userInvitations
  }
}
