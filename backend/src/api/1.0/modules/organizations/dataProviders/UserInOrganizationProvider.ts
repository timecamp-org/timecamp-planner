import { UserInOrganizationProviderInterface } from '../interfaces/UserInOrganizationProviderInterface';
import { UserInOrganizationDbRow, OrganizationRole, ProjectType } from '../../db/schema';

import { Id } from '../../common/identifier';
import Table from '../../db/Table';
import { injectable, inject } from 'inversify';
import { QueryModifier } from '../../../../../services/types';
import { UserInOrganizationJson, UsersInOrganizationsMap } from '../types';
import {
  userIsNotBotModifier,
  userIsActiveInOrganizationModifier,
  userIsActiveMemberInOrganizationModifier,
  usersAreNotGuestsQueryModifier, onlyGuestUsersQueryModifier,
} from '../queryDecorators';
import { get, chain } from 'lodash'
import { CommonModule } from '../../common/CommonModule';
import { TimeServiceInterface } from '../../common/time/TimeServiceInterface';
import { EntityStatus } from '../../common/enum';
import { Dict } from '../../common/types';
import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';

@injectable()
export class UserInOrganizationProvider implements UserInOrganizationProviderInterface {

  constructor(
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
  }

  async getUserInOrganizationById(id: Id, trx?: Transaction): Promise<UserInOrganizationDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select('*')
      .from(Table.USER_IN_ORGANIZATION)
      .where({ id })
      .first()
  }

  async getUserInOrganization(userId: Id, organizationId: Id, trx?: Transaction): Promise<UserInOrganizationDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select('*')
      .from(Table.USER_IN_ORGANIZATION)
      .where({ userId, organizationId })
      .first()
  }

  async getOrganizationUserIds(organizationId: Id, trx?: Transaction, decorate?: QueryModifier): Promise<Id[]> {
    const query = this.connection.getQueryWithTransaction(trx)
      .select('user_id')
      .from(Table.USER_IN_ORGANIZATION)
      .join(Table.USER, `${Table.USER_IN_ORGANIZATION}.userId`, `${Table.USER}.id`)
      .where({ 'organization_id': organizationId })
      ;

    if (decorate) {
      decorate(query)
    }

    const users = await query

    return users.map(user => user.userId);
  }

  async getOrganizationUsersByOrganizationId(organizationId: Id, trx?: Transaction, decorate?: QueryModifier): Promise<UserInOrganizationDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.USER_IN_ORGANIZATION)
      .where({ 'organization_id': organizationId })
      ;

    if (decorate) {
      decorate(query)
    }

    return await query
  }

  async getOrganizationUserIdsWithoutBot(organizationId: Id, trx?: Transaction): Promise<Id[]> {
    return await this.getOrganizationUserIds(organizationId, trx, userIsNotBotModifier);
  }

  async getOrganizationActiveUserIds(organizationId: Id, trx?: Transaction): Promise<Id[]> {
    return await this.getOrganizationUserIds(organizationId, trx, userIsActiveInOrganizationModifier);
  }

  async getOrganizationActiveMemberIds(organizationId: Id, trx?: Transaction): Promise<Id[]> {
    return await this.getOrganizationUserIds(organizationId, trx, userIsActiveMemberInOrganizationModifier);
  }

  async getOrganizationUsersWithoutGuests(organizationId: Id, trx?: Transaction): Promise<UserInOrganizationDbRow[]> {
    return await this.getOrganizationUsersByOrganizationId(organizationId, trx, usersAreNotGuestsQueryModifier);
  }

  async getOrganizationGuests(organizationId: Id, trx?: Transaction): Promise<UserInOrganizationDbRow[]> {
    return await this.getOrganizationUsersByOrganizationId(organizationId, trx, onlyGuestUsersQueryModifier);
  }

  async updateUserInOrganization(
    organizationId: Id,
    userId: Id,
    userInOrganizationJson: UserInOrganizationJson,
    trx?: Transaction,
  ): Promise<UserInOrganizationDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    const results = await query
      .update({
        ...userInOrganizationJson,
        modifiedAt: this.timeService.getCurrentTime(),
      })
      .from(Table.USER_IN_ORGANIZATION)
      .where({ organizationId, userId })
      .returning('*')

    return results[0];
  }

  async createUserInOrganization(
    userInOrganizationJson: UserInOrganizationJson,
    trx?: Transaction,
  ): Promise<UserInOrganizationDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    const results = await query
      .insert(userInOrganizationJson)
      .into(Table.USER_IN_ORGANIZATION)
      .returning('*')

    return results[0];
  }

  async getOrganizationOwner(organizationId: Id, trx?: Transaction): Promise<Id> {
    const query = this.connection.getQueryWithTransaction(trx)
    const row = await query
      .select('userId')
      .from(Table.USER_IN_ORGANIZATION)
      .where({
        role: OrganizationRole.OWNER,
        organizationId,
        entityStatus: EntityStatus.EXISTS,
      })
      .first()

    return get(row, 'userId')
  }

  async getOrganizationAdminUserIds(organizationId: Id, trx?: Transaction): Promise<Id[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    const rows = await query
      .select('userId')
      .from(Table.USER_IN_ORGANIZATION)
      .where({ organizationId })
      .whereIn('role', [OrganizationRole.ADMIN, OrganizationRole.OWNER])

    return rows.map((row: UserInOrganizationDbRow) => row.userId)
  }

  async filterOutDeactivatedUsers(organizationId: Id, userIds: Id[], trx?: Transaction): Promise<Id[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .select('userId')
      .from(Table.USER_IN_ORGANIZATION)
      .whereIn('userId', userIds)
      .andWhere({ entityStatus: EntityStatus.EXISTS, organizationId })
      ;

    return result
      .map((userInOrganization: UserInOrganizationDbRow) => userInOrganization.userId)
  }

  async checkIfUserIsInOrganization(organizationId: Id, userId: Id, trx?: Transaction): Promise<boolean> {
    const query = this.connection.getQueryWithTransaction(trx)
    const row = await query
      .select()
      .from(Table.USER_IN_ORGANIZATION)
      .where('organizationId', organizationId)
      .where('user_id', userId)
      .andWhere('entityStatus', EntityStatus.EXISTS)
      .first()
      ;

    return row != null;
  }

  async getUsersOrganizationIds(userIds: Id[]): Promise<UsersInOrganizationsMap> {
    const usersInOrganizations = await this.connection.getQueryBuilder()
      .select('user_id', 'organization_id')
      .from(Table.USER_IN_ORGANIZATION)
      .whereIn('userId', userIds) as UserInOrganizationDbRow[]

    return chain(usersInOrganizations)
      .groupBy('userId')
      .mapValues((values) => values.map(value => value.organizationId))
      .value()
  }

  async getUserOrganizationIds(userId: Id, decorate?: QueryModifier): Promise<Id[]> {
    const query = this.connection.getQueryBuilder()
      .select('organization_id')
      .from(Table.USER_IN_ORGANIZATION)
      .where({ userId })

    if (decorate) {
      decorate(query)
    }

    return await query.pluck('organization_id')
  }

  async getOrganizationRolesForUser(userId: Id): Promise<Dict<OrganizationRole>> {
    const roles = await this.connection.getQueryBuilder()
      .select('organizationId', 'role')
      .from(Table.USER_IN_ORGANIZATION)
      .where({ userId })

    const result = chain(roles)
      .keyBy('organizationId')
      .mapValues((role: UserInOrganizationDbRow) => role.role)
      .value()

    return result
  }

  async getOccupiedGuestSeatCountForOrganization(organizationId: Id, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .count(`${Table.PROJECT}.*`)
      .from(Table.USER_IN_ORGANIZATION)
      .join(Table.USER_IN_PROJECT, `${Table.USER_IN_ORGANIZATION}.userId`, `${Table.USER_IN_PROJECT}.userId`)
      .join(Table.PROJECT, `${Table.USER_IN_PROJECT}.projectId`, `${Table.PROJECT}.id`)
      .join(Table.USER, `${Table.USER_IN_PROJECT}.userId`, `${Table.USER}.id`)
      .where({
        [`${Table.USER_IN_ORGANIZATION}.organizationId`]: organizationId,
        [`${Table.USER_IN_ORGANIZATION}.entityStatus`]: EntityStatus.EXISTS,
        [`${Table.USER_IN_ORGANIZATION}.role`]: OrganizationRole.GUEST,
        [`${Table.PROJECT}.projectType`]: ProjectType.PROJECT,
        [`${Table.PROJECT}.is_archived`]: false,
        [`${Table.PROJECT}.organization_id`]: organizationId,
        [`${Table.USER}.status`]: EntityStatus.EXISTS,
      })
      .first()
      .then((result) => parseInt(result.count as string))
  }

  async getUserOwnedOrganizationIds(userId: Id): Promise<Id[]> {
    const query = this.connection.getQueryBuilder()
      .select('organizationId')
      .from(Table.USER_IN_ORGANIZATION)
      .where({
        userId,
        entityStatus: EntityStatus.EXISTS,
        role: OrganizationRole.OWNER,
      })

    return await query.pluck('organization_id')
  }

  async getOrganizationsPeopleCountWithoutBot(organizationIds: Id[]): Promise<Dict<number>> {
    const query = this.connection.getQueryBuilder()
    const results = await query
      .select(`${Table.USER_IN_ORGANIZATION}.organizationId`)
      .count(`${Table.USER_IN_ORGANIZATION}.userId`)
      .from(Table.USER_IN_ORGANIZATION)
      .join(`${Table.USER}`, `${Table.USER_IN_ORGANIZATION}.userId`, `${Table.USER}.id`)
      .whereIn(`${Table.USER_IN_ORGANIZATION}.organizationId`, organizationIds)
      .andWhere({
        [`${Table.USER_IN_ORGANIZATION}.entityStatus`]: EntityStatus.EXISTS,
        [`${Table.USER}.isBot`]: false,
      })
      .groupBy(`${Table.USER_IN_ORGANIZATION}.organizationId`)

    const map = chain(results)
      .keyBy('organizationId')
      .mapValues(row => parseInt(row.count))
      .value()

    return map
  }

  async getOrganizationGuestsForGivenProject(organizationId: Id, projectId: Id, trx?: Transaction): Promise<UserInOrganizationDbRow[]> {
    return await this.connection.getQueryWithTransaction(trx)
      .select(`${Table.USER_IN_ORGANIZATION}.*`)
      .from(Table.USER_IN_ORGANIZATION)
      .join(Table.USER_IN_PROJECT,
        `${Table.USER_IN_PROJECT}.userId`, `${Table.USER_IN_ORGANIZATION}.userId`
      )
      .where({ 'organization_id': organizationId })
      .andWhere({
        [`${Table.USER_IN_PROJECT}.project_id`]: projectId,
        [`${Table.USER_IN_ORGANIZATION}.role`]: OrganizationRole.GUEST,
      })
    ;
  }

  // doesn't include chatWithMe guests
  async getGuestsInvitedByUser(
    userId: Id,
    organizationId: Id,
    decorate?: QueryModifier,
    trx?: Transaction,
  ): Promise<UserInOrganizationDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
      .select(`${Table.USER_IN_ORGANIZATION}.*`)
      .from(Table.USER_IN_ORGANIZATION)
      .leftJoin(Table.USER_INVITATION,
        `${Table.USER_INVITATION}.invited_user_id`, `${Table.USER_IN_ORGANIZATION}.user_id`
      )
      .where({
        [`${Table.USER_IN_ORGANIZATION}.role`]: OrganizationRole.GUEST,
        [`${Table.USER_IN_ORGANIZATION}.organizationId`]: organizationId,
        [`${Table.USER_INVITATION}.inviterId`]: userId,
      })

    if (decorate) {
      decorate(query)
    }

    return await query
  }

  async getOrganizationUsersInSpecifiedProjects(
    organizationId: Id,
    projectIds: Id[],
    decorate?: QueryModifier,
    trx?: Transaction,
  ): Promise<UserInOrganizationDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
      .select(`${Table.USER_IN_ORGANIZATION}.*`)
      .from(Table.USER_IN_ORGANIZATION)
      .innerJoin(Table.USER_IN_PROJECT,
        `${Table.USER_IN_PROJECT}.user_id`, `${Table.USER_IN_ORGANIZATION}.user_id`
      )
      .where({
        [`${Table.USER_IN_ORGANIZATION}.organization_id`]: organizationId,
      })
      .whereIn(`${Table.USER_IN_PROJECT}.project_id`, projectIds)

    if (decorate) {
      decorate(query)
    }

    return await query
  }

  async getMemberUserIdsFromAllProjectsShardedWithUser(userId: Id, organizationId: Id): Promise<Id[]> {
    const projectsSpecifiedUserIsInSubquery = this.connection.getQueryBuilder()
      .select(`${Table.PROJECT}.id`)
      .from(Table.PROJECT)
      .join(Table.USER_IN_PROJECT,
        `${Table.PROJECT}.id`, `${Table.USER_IN_PROJECT}.project_id`
      )
      .where({
        [`${Table.USER_IN_PROJECT}.user_id`]: userId,
        [`${Table.PROJECT}.organization_id`]: organizationId,
        [`${Table.PROJECT}.project_type`]: ProjectType.PROJECT,
      })

    const userIds = await this.connection.getQueryBuilder()
      .distinct(`${Table.USER_IN_PROJECT}.userId`)
      .from(Table.USER_IN_PROJECT)
      .join(Table.PROJECT,
        `${Table.USER_IN_PROJECT}.projectId`, `${Table.PROJECT}.id`
      )
      .where({
        [`${Table.PROJECT}.projectType`]: ProjectType.PROJECT,
        [`${Table.PROJECT}.organizationId`]: organizationId,
      })
      .whereIn(`${Table.PROJECT}.id`, projectsSpecifiedUserIsInSubquery)
      .pluck(`${Table.USER_IN_PROJECT}.user_id`)

    return userIds
  }

  async getProjectUsersInOrganizationWithoutSharedProjects(
    userId: Id,
    projectId: Id,
    organizationId: Id,
    decorate?: QueryModifier
  ): Promise<UserInOrganizationDbRow[]> {
    const projectsSpecifiedUserIsInSubquery = this.connection.getQueryBuilder()
      .select(`${Table.PROJECT}.id`)
      .from(Table.PROJECT)
      .join(Table.USER_IN_PROJECT,
        `${Table.PROJECT}.id`, `${Table.USER_IN_PROJECT}.project_id`
      )
      .where({
        [`${Table.USER_IN_PROJECT}.user_id`]: userId,
        [`${Table.PROJECT}.organization_id`]: organizationId,
        [`${Table.PROJECT}.project_type`]: ProjectType.PROJECT,
      })

    const allSharedProjectUserIdsSubquery = this.connection.getQueryBuilder()
      .distinct(`${Table.USER_IN_PROJECT}.userId`)
      .from(Table.USER_IN_PROJECT)
      .join(Table.PROJECT,
        `${Table.USER_IN_PROJECT}.projectId`, `${Table.PROJECT}.id`
      )
      .where({
        [`${Table.PROJECT}.projectType`]: ProjectType.PROJECT,
        [`${Table.PROJECT}.organizationId`]: organizationId,
      })
      .whereIn(`${Table.PROJECT}.id`, projectsSpecifiedUserIsInSubquery)

    const userIdsQuery = this.connection.getQueryBuilder()
      .distinct(`${Table.USER_IN_PROJECT}.userId`)
      .from(Table.USER_IN_PROJECT)
      .join(Table.PROJECT,
        `${Table.USER_IN_PROJECT}.projectId`, `${Table.PROJECT}.id`
      )
      .where({
        [`${Table.PROJECT}.id`]: projectId,
        [`${Table.PROJECT}.organizationId`]: organizationId,
      })
      .whereNotIn(`${Table.USER_IN_PROJECT}.userId`, allSharedProjectUserIdsSubquery)


    const query = this.connection.getQueryBuilder()
      .select(`${Table.USER_IN_ORGANIZATION}.*`)
      .from(Table.USER_IN_ORGANIZATION)
      .where({ organizationId })
      .whereIn(`${Table.USER_IN_ORGANIZATION}.userId`, userIdsQuery)

    if (decorate) {
      decorate(query)
    }

    return await query
  }

  async getUserInviterInOrganization(userId, organizationId): Promise<UserInOrganizationDbRow> {
    const query = this.connection.getQueryBuilder()
      .select()
      .from(Table.USER_IN_ORGANIZATION)
      .leftJoin(Table.USER_INVITATION, function () {
        this
          .on(`${Table.USER_INVITATION}.inviterId`, `${Table.USER_IN_ORGANIZATION}.userId`)
          .andOn(`${Table.USER_INVITATION}.organizationId`, `${Table.USER_IN_ORGANIZATION}.organizationId`)
      })
      .where({
        [`${Table.USER_IN_ORGANIZATION}.organizationId`]: organizationId,
        [`${Table.USER_INVITATION}.invitedUserId`]: userId,
      })
      .first()

    return await query
  }

  async getUsersInOrganizations(organizationIds: Id[], decorate?: QueryModifier): Promise<UserInOrganizationDbRow[]> {
    const query = this.connection.getConnection()
      .select()
      .from(Table.USER_IN_ORGANIZATION)
      .whereIn('organizationId', organizationIds)

    if (decorate) {
      decorate(query)
    }

    return await query
  }
}
