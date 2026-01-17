

import Table, { ForeignKey, UniqueKey } from '../db/Table'


import {
  ProjectType,
  UserFollowsProjectDbRow,
  UserInProjectDbRow,
} from '../db/schema'
import { chain } from 'lodash'
import { violatesForeignKey, violatesUniqueKey } from '../../../../utils'
import { EventDelegate } from '../../../../utils/EventDelegate'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { ProjectFollowersServiceInterface } from './interfaces/ProjectFollowersServiceInterface'
import {
  AddProjectFollowerResult,
  AddProjectFollowerStatus,
  ProjectsFollowersMap,
  RemoveProjectFollowerEventData,
  RemoveProjectFollowerResult,
  RemoveProjectFollowerStatus,
} from './types'
import { inject, injectable } from 'inversify'
import { Id } from '../common/identifier'
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule'
import { DbModule } from '../db/DbModule'
import { ConnectionInterface } from '../db/ConnectionInterface'

@injectable()
export class ProjectFollowersService implements ProjectFollowersServiceInterface {

  protected logger: LoggerInterface
  public removeProjectFollowerEvent: EventDelegate<RemoveProjectFollowerEventData>

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) {
    this.logger = logger
    this.removeProjectFollowerEvent = new EventDelegate<RemoveProjectFollowerEventData>(logger);
  }

  async addProjectFollower(projectId, userId): Promise<AddProjectFollowerResult> {
    try {
      const projectFollower = {
        projectId,
        userId,
      }

      await this.connection.getQueryBuilder()
        .insert(projectFollower)
        .into(Table.USER_FOLLOWS_PROJECT)

      return { status: AddProjectFollowerStatus.OK }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.USER_FOLLOWS_PROJECT)) {
        return { status: AddProjectFollowerStatus.USER_ALREADY_FOLLOWING_PROJECT }
      } else if (violatesForeignKey(error, ForeignKey.USER_FOLLOWS_PROJECT_PROJECT_ID)) {
        return { status: AddProjectFollowerStatus.PROJECT_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.USER_FOLLOWS_PROJECT_USER_ID)) {
        return { status: AddProjectFollowerStatus.USER_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

  async removeProjectFollower(projectId, userId): Promise<RemoveProjectFollowerResult> {
    return await this.connection.getConnection().transaction(trx => {
      return this.doRemoveProjectFollower(trx, projectId, userId);
    })

  }

  async doRemoveProjectFollower(trx: Transaction, projectId: Id, userId: Id): Promise<RemoveProjectFollowerResult> {
    const affectedRowsNumber = await this.connection.getQueryBuilder()
      .from(Table.USER_FOLLOWS_PROJECT)
      .where('projectId', projectId)
      .where('user_id', userId)
      .transacting(trx)
      .del()

    await this.removeProjectFollowerEvent.triggerEvent({
      projectId,
      userId,
      trx,
    });

    if (affectedRowsNumber === 0) {
      return { status: RemoveProjectFollowerStatus.PROJECT_FOLLOWER_NOT_FOUND }
    } else {
      return { status: RemoveProjectFollowerStatus.OK }
    }
  }

  async getProjectFollowerIds(projectId): Promise<Id[]> {
    return await this.connection.getQueryBuilder()
      .from(Table.USER_FOLLOWS_PROJECT)
      .select('user_id')
      .where('projectId', projectId)
      .pluck('user_id')
  }

  async getProjectsFollowerIds(projectIds: Array<Id>, trx?: Transaction): Promise<ProjectsFollowersMap> {
    const usersFollowingProjects = await this.getUsersFollowingProjects(projectIds, trx)
    return chain(usersFollowingProjects)
      .groupBy((row: UserInProjectDbRow) => row.projectId)
      .mapValues((row) => row.map(item => item.userId))
      .value()
  }

  async getUsersFollowingProjects(projectIds: Array<Id>, trx?: Transaction): Promise<Array<UserFollowsProjectDbRow>> {
    return await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.USER_FOLLOWS_PROJECT)
      .join(Table.PROJECT, `${Table.USER_FOLLOWS_PROJECT}.project_id`, `${Table.PROJECT}.id`)
      .whereIn('projectId', projectIds)
      .andWhere({
        projectType: ProjectType.PROJECT,
      })
  }

}
