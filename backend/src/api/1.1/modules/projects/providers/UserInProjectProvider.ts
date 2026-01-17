import { UserInProjectProviderInterface } from '../interfaces/UserInProjectProviderInterface';

import { Id } from '../../common/identifier';
import { injectable, inject } from 'inversify';
import Table from '../../db/Table';
import { first, groupBy } from 'lodash';
import { QueryModifier } from '../../../../../services/types';
import { UserInProjectDbRow, ProjectRole } from '../../db/schema';
import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { Dict } from '../../common/types';

@injectable()
export class UserInProjectProvider implements UserInProjectProviderInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getUserProjectIds(organizationId: Id, userId: Id, decorate?: QueryModifier, trx?: Transaction): Promise<Id[]> {
    let query = this.connection.getQueryWithTransaction(trx);
    query = query
      .select('projectId')
      .from(Table.USER_IN_PROJECT)
      .join(Table.PROJECT, `${Table.USER_IN_PROJECT}.projectId`, `${Table.PROJECT}.id`)
      .where({ organizationId, userId });

    if (decorate) {
      decorate(query);
    }

    const result = await query;
    return result.map((item: UserInProjectDbRow) => item.projectId);
  }

  async getUserInProject(userId: Id, projectId: Id, trx?: Transaction): Promise<UserInProjectDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    return query.select('*').from(Table.USER_IN_PROJECT).where({ userId, projectId }).first();
  }

  async checkIfUserIsProjectManagerOrOwner(userId: Id, projectId: Id, trx?: Transaction): Promise<boolean> {
    const userInProject = await this.getUserInProject(userId, projectId, trx);
    return !!userInProject && [ProjectRole.MANAGER, ProjectRole.OWNER].includes(userInProject.role);
  }

  async getProjectPeople(projectId: Id, trx?: Transaction): Promise<UserInProjectDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx);
    return await query.select().from(Table.USER_IN_PROJECT).where('projectId', projectId);
  }

  async getProjectsPeople(projectIds: Id[], trx?: Transaction): Promise<UserInProjectDbRow[]> {
    return await this.connection
      .getQueryWithTransaction(trx)
      .select()
      .from(Table.USER_IN_PROJECT)
      .whereIn('projectId', projectIds);
  }

  async getUsersInProjects(
    organizationId: Id,
    userIds: Id[],
    decorate?: QueryModifier,
    trx?: Transaction
  ): Promise<Dict<Id[]>> {
    let query = this.connection.getQueryWithTransaction(trx);
    query = query
      .select(`${Table.USER_IN_PROJECT}.userId`, `${Table.USER_IN_PROJECT}.projectId`)
      .from(Table.USER_IN_PROJECT)
      .join(Table.PROJECT, `${Table.USER_IN_PROJECT}.projectId`, `${Table.PROJECT}.id`)
      .where({ [`${Table.PROJECT}.organizationId`]: organizationId })
      .whereIn(`${Table.USER_IN_PROJECT}.userId`, userIds);

    if (decorate) {
      decorate(query);
    }

    const result = await query;
    return groupBy(result, 'userId');
  }

  async getUsersInProjectsFull(
    organizationId: Id,
    userIds: Id[],
    decorate?: QueryModifier,
    trx?: Transaction
  ): Promise<UserInProjectDbRow[]> {
    let query = this.connection.getQueryWithTransaction(trx);
    query = query
      .select(`${Table.USER_IN_PROJECT}.*`)
      .from(Table.USER_IN_PROJECT)
      .join(Table.PROJECT, `${Table.USER_IN_PROJECT}.projectId`, `${Table.PROJECT}.id`)
      .where({ [`${Table.PROJECT}.organizationId`]: organizationId })
      .whereIn(`${Table.USER_IN_PROJECT}.userId`, userIds);

    if (decorate) {
      decorate(query);
    }

    return await query;
  }

  async removeUserFromProjects(userId: Id, projectIds: Id[], trx?: Transaction): Promise<void> {
    await this.connection
      .getQueryWithTransaction(trx)
      .from(Table.USER_IN_PROJECT)
      .whereIn('projectId', projectIds)
      .andWhere('userId', userId)
      .del();
  }

  async setUserOwnerToProject(userId: string, projectId: string): Promise<UserInProjectDbRow> {
    const query = this.connection.getConnection();

    const result = await query
      .table(Table.USER_IN_PROJECT)
      .insert({
        userId,
        projectId,
        role: ProjectRole.OWNER,
      })
      .returning('*')
      .then(first);

    return result;
  }
}
