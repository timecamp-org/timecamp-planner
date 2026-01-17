

import Table, { ForeignKey, UniqueKey } from '../db/Table'


import {
  UserInProjectDbRow,
} from '../db/schema'
import { violatesForeignKey, violatesUniqueKey } from '../../../../utils'
import { ProjectPeopleServiceInterface } from './interfaces/ProjectPeopleServiceInterface'
import {
  AddProjectPersonResult,
  AddProjectPersonsResult,
  AddProjectPersonsStatus,
  AddProjectPersonStatus,
  DeleteGuestFromAllSpacesResult,
  DeleteGuestFromAllSpacesStatus,
  DeleteProjectPeopleRoleResult,
  DeleteProjectPeopleRoleStatus,
  UpdateProjectPeopleRoleResult,
  UpdateProjectPeopleRoleStatus,
  RemoveProjectMemberEventData, AddProjectMemberEventData, GetProjectPersonsResult, GetProjectPersonsStatus,
} from './types'
import { inject, injectable } from 'inversify'
import { Id } from '../common/identifier'

import { UsersModule } from '../users/UsersModule'
import { UserServiceInterface } from '../users/UserServiceInterface'

import { OrganizationsModule } from '../organizations/OrganizationsModule'
import {
  existingProjectsWithoutConversationsModifier,
  getProjectsPeopleQueryModifier,
} from './queryDecorators'
import {
  DeactivateUserFromWorkspaceResult,
  DeactivateUserFromWorkspaceStatus,
  GetOrganizationProjectsPeopleResult,
  GetOrganizationProjectsResultStatus,
  OrganizationProjectsPeople,
} from '../organizations/types'
import { UserInProjectProviderInterface } from './interfaces/UserInProjectProviderInterface'
import { ProjectsModule } from './ProjectsModule'
import { EventDelegate } from '../../../../utils/EventDelegate';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { UserInOrganizationServiceInterface } from '../organizations/interfaces/UserInOrganizationServiceInterface';
import { QueryModifier } from '../../../../services/types';
import { OrganizationProviderInterface } from '../organizations/interfaces/OrganizationProviderInterface';
import { ActivitiesModule } from '../activities/ActivitiesModule'
import { ActivityServiceInterface } from '../activities/interfaces/ActivityServiceInterface'
import { ConnectionInterface } from '../db/ConnectionInterface'
import { DbModule } from '../db/DbModule'
import { ProjectProviderInterface } from './interfaces/ProjectProviderInterface'
import { GuestInProjectServiceInterface } from './interfaces/GuestInProjectServiceInterface'

@injectable()
export class ProjectPeopleService implements ProjectPeopleServiceInterface {

  public addProjectMemberEvent: EventDelegate<AddProjectMemberEventData>
  public removeProjectMemberEvent: EventDelegate<RemoveProjectMemberEventData>

  constructor(
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    private organizationProvider: OrganizationProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
    private userInOrganizationService: UserInOrganizationServiceInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProviderInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(ActivitiesModule.ActivityServiceInterface)
    private activityService: ActivityServiceInterface,
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(ProjectsModule.GuestInProjectServiceInterface)
    private guestInProjectService: GuestInProjectServiceInterface,
  ) {
    this.removeProjectMemberEvent = new EventDelegate<RemoveProjectMemberEventData>(logger);
    this.addProjectMemberEvent = new EventDelegate<AddProjectMemberEventData>(logger);
  }

  async addProjectPerson(projectPerson: UserInProjectDbRow, actorId?: Id): Promise<AddProjectPersonResult> {
    return await this.connection.getConnection().transaction(trx => {
      return this.doAddProjectPerson(trx, projectPerson, actorId);
    })
  }

  async doAddProjectPerson(trx: Transaction, projectPerson: UserInProjectDbRow, actorId?: Id): Promise<AddProjectPersonResult> {
    try {
      const connection = this.connection.getConnection()
      const {
        userId,
        projectId,
        role
      } = projectPerson

      await this.addProjectMemberEvent.triggerEvent({
        projectId,
        userId,
        trx,
        actorId,
      });

      const params = {
        table: Table.USER_IN_PROJECT,

        userId: connection.raw('?', userId),
        projectId: connection.raw('?', projectId),
        role: connection.raw('?', role),
      }

      await trx.raw(
        'INSERT INTO :table: (user_id, project_id, role)' +
        'VALUES (:userId:, :projectId:, :role:)' +
        'ON CONFLICT (user_id, project_id) DO NOTHING'
        ,
        params
      )

      const { organizationId } = await this.projectProvider.getProject(projectId, trx, ['organizationId'])
      const { userIsOrganizationGuest } = await this.userInOrganizationService.checkIfUserIsOrganizationGuest(userId, organizationId, trx)

      if (userIsOrganizationGuest) {
        const currentGuest = await this.guestInProjectService.getGuestInProject(userId, projectId, trx)
        if (!currentGuest) {
          await this.guestInProjectService.addGuestInProject(userId, projectId, trx)
        }
      }

      await this.activityService.createActivityProjectPeopleAdded(
        projectPerson.projectId,
        actorId,
        projectPerson.userId,
        trx
      )

      return { status: AddProjectPersonStatus.OK }
    } catch (error) {
      if (violatesForeignKey(error, ForeignKey.USER_IN_PROJECT)) {
        return { status: AddProjectPersonStatus.USER_ALREADY_IN_PROJECT }
      } else if (violatesUniqueKey(error, UniqueKey.USER_IN_PROJECT_USERID_PROJECT_ID_UNIQ)) {
        return { status: AddProjectPersonStatus.USER_ALREADY_IN_PROJECT }
      } else if (violatesForeignKey(error, ForeignKey.USER_IN_PROJECT_PROJECT_ID)) {
        return { status: AddProjectPersonStatus.PROJECT_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.USER_IN_TASK_USER_ID)) {
        return { status: AddProjectPersonStatus.USER_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

  async addProjectPersons(projectPersons: UserInProjectDbRow[], actorId?: Id): Promise<AddProjectPersonsResult> {
    return await this.connection.getConnection().transaction(trx => {
      return this.doAddProjectPersons(trx, projectPersons, actorId);
    })
  }

  async doAddProjectPersons(trx: Transaction, projectPersons: UserInProjectDbRow[], actorId?: Id): Promise<AddProjectPersonsResult> {
    // todo make sure this place doesnt need to be handled too
    try {
      await this.connection.getQueryWithTransaction(trx)
        .insert(projectPersons)
        .into(Table.USER_IN_PROJECT)

      const projectMemberAddedEventPromises = projectPersons.map(
        person => this.addProjectMemberEvent.triggerEvent({
          projectId: person.projectId,
          actorId,
          userId: person.userId,
          trx,
        })
      )

      await Promise.all(projectMemberAddedEventPromises)

      if (actorId) {
        const projectPeopleAddedActivitiesPromises = projectPersons.map(
          person => this.activityService.createActivityProjectPeopleAdded(
            person.projectId,
            actorId,
            person.userId,
            trx
          ))

        await Promise.all(projectPeopleAddedActivitiesPromises)
      }

      return { status: AddProjectPersonsStatus.OK }
    } catch (error) {
      if (violatesForeignKey(error, ForeignKey.USER_IN_PROJECT)) {
        return { status: AddProjectPersonsStatus.USER_ALREADY_IN_PROJECT }
      } else if (violatesForeignKey(error, ForeignKey.USER_IN_PROJECT_PROJECT_ID)) {
        return { status: AddProjectPersonsStatus.PROJECT_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.USER_IN_TASK_USER_ID)) {
        return { status: AddProjectPersonsStatus.USER_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

  async getProjectPersons(projectId: Id): Promise<GetProjectPersonsResult> {
    const project = await this.projectProvider.getProject(projectId)
    if (!project) {
      return {
        status: GetProjectPersonsStatus.PROJECT_NOT_FOUND
      }
    }

    const projectPeople = await this.getProjectPeople(projectId)

    return {
      status: GetProjectPersonsStatus.OK,
      projectPeople,
    }

  }

  async updateProjectPeopleRole({ projectId, userId, role }: UserInProjectDbRow): Promise<UpdateProjectPeopleRoleResult> {
    const affectedRowsNumber = await this.connection.getQueryBuilder()
      .from(Table.USER_IN_PROJECT)
      .where({ projectId, userId })
      .update({ role })

    if (affectedRowsNumber === 0) {
      return { status: UpdateProjectPeopleRoleStatus.PROJECT_PEOPLE_NOT_FOUND }
    } else {
      return { status: UpdateProjectPeopleRoleStatus.OK }
    }
  }

  async deleteProjectPeopleRole(projectId: Id, userId: Id, actorId?: Id): Promise<DeleteProjectPeopleRoleResult> {
    return await this.connection.getConnection().transaction(trx => {
      return this.doDeleteProjectPeopleRole(trx, projectId, userId, actorId);
    })
  }

  async doDeleteProjectPeopleRole(trx: Transaction, projectId: Id, userId: Id, actorId?: Id): Promise<DeleteProjectPeopleRoleResult> {
    await this.removeProjectMemberEvent.triggerEvent({
      projectId,
      userId,
      trx,
      actorId,
    });

    const affectedRowsNumber = await this.connection.getQueryBuilder()
      .from(Table.USER_IN_PROJECT)
      .transacting(trx)
      .where('projectId', projectId)
      .where('user_id', userId)
      .del()

    await this.activityService.createActivityProjectPeopleDeleted(
      projectId,
      actorId,
      userId,
      trx,
    )

    if (affectedRowsNumber === 0) {
      return { status: DeleteProjectPeopleRoleStatus.PROJECT_PEOPLE_NOT_FOUND }
    } else {
      return { status: DeleteProjectPeopleRoleStatus.OK }
    }
  }

  async getProjectPeople(projectId: Id, trx?: Transaction): Promise<Array<UserInProjectDbRow>> {
    return await this.userInProjectProvider.getProjectPeople(projectId, trx)
  }

  async getUserIdsInProject(projectId: Id, trx?: Transaction): Promise<Array<Id>> {
    const projectPeople = await this.getProjectPeople(projectId, trx)
    return projectPeople.map(user => user.userId)
  }

  async deleteGuestFromAllSpaces(currentUserId: Id, userId: Id, organizationId: Id): Promise<DeleteGuestFromAllSpacesResult> {
    return await this.connection.getConnection().transaction(async trx => {
      const organization = await this.organizationProvider.getOrganization(organizationId, trx)
      if (!organization) {
        return {
          status: DeleteGuestFromAllSpacesStatus.ORGANIZATION_NOT_FOUND
        }
      }

      const user = await this.userService.getUserById(userId, trx)
      if (!user) {
        return {
          status: DeleteGuestFromAllSpacesStatus.USER_NOT_FOUND
        }
      }

      let deactivateResult: DeactivateUserFromWorkspaceResult


      const userProjectIds = await this.userInProjectProvider.getUserProjectIds(organizationId, userId, existingProjectsWithoutConversationsModifier, trx);

      if (userProjectIds.length === 1) {
        const isCurrentUserProjectManagerOrOwner = await this.userInProjectProvider.checkIfUserIsProjectManagerOrOwner(currentUserId, userProjectIds[0], trx)
        const { userIsOrganizationAdmin } = await this.userInOrganizationService.checkIfUserIsOrganizationAdmin(currentUserId, organizationId, trx)
        if (!isCurrentUserProjectManagerOrOwner && !userIsOrganizationAdmin) {
          return {
            status: DeleteGuestFromAllSpacesStatus.FORBIDDEN,
          }
        }
        deactivateResult = await this.userInOrganizationService.doDeactivateUserFromWorkspace(userId, organizationId, trx);
      } else {
        deactivateResult = await this.userInOrganizationService.deactivateUserFromWorkspace(currentUserId, userId, organizationId, trx)
      }


      switch (deactivateResult.status) {
        case DeactivateUserFromWorkspaceStatus.FORBIDDEN:
          return {
            status: DeleteGuestFromAllSpacesStatus.FORBIDDEN
          }
        default: break;
      }
      const deleteProjectPeoplePromises = userProjectIds.map(async projectId => await this.doDeleteProjectPeopleRole(trx, projectId, userId, currentUserId));
      await Promise.all(deleteProjectPeoplePromises)

      return {
        status: DeleteGuestFromAllSpacesStatus.OK,
      }
    })
  }

  async deleteUserFromOrganizationSpaces(userId: Id, organizationId: Id, actodId: Id, trx?: Transaction): Promise<void> {
    const userProjectIds = await this.userInProjectProvider.getUserProjectIds(organizationId, userId, existingProjectsWithoutConversationsModifier, trx);
    const deleteProjectPeoplePromises = userProjectIds.map(async projectId => await this.doDeleteProjectPeopleRole(trx, projectId, userId, actodId));
    const results = await Promise.all(deleteProjectPeoplePromises)
    results.forEach(result => {
      if (result.status !== DeleteProjectPeopleRoleStatus.OK) {
        throw new Error(result.status.toString())
      }
    })
  }

  /**
 * @param {Id} organizationId
 * @return {Promise<GetOrganizationProjectsPeopleResult>}
 */
  async getOrganizationProjectsPeople(organizationId: Id, decorate?: QueryModifier): Promise<GetOrganizationProjectsPeopleResult> {
    const query = this.connection.getQueryBuilder()
      .select('userId', 'projectId', 'role')
      .table(Table.PROJECT)
      .join(Table.USER_IN_PROJECT, `${Table.PROJECT}.id`, `${Table.USER_IN_PROJECT}.project_id`)
      .where({ 'organizationId': organizationId })

    if (decorate) {
      decorate(query);
    }

    const organizationProjectsPeople = await query;

    const userRoleByProject: OrganizationProjectsPeople = {}
    organizationProjectsPeople.forEach(role => {
      if (!userRoleByProject[role.projectId]) {
        userRoleByProject[role.projectId] = []
      }
      userRoleByProject[role.projectId].push({
        userId: role.userId,
        role: role.role,
      })
    })

    return {
      status: GetOrganizationProjectsResultStatus.OK,
      organizationProjectsPeople: userRoleByProject
    }
  }

  async getOrganizationProjectsPeopleForUser(organizationId: Id, userId: Id): Promise<OrganizationProjectsPeople> {
    const userProjectIds = await this.userInProjectProvider.getUserProjectIds(organizationId, userId)

    const projectsPeopleQueryModifier = getProjectsPeopleQueryModifier(userProjectIds)

    const projectsPeopleResult = await this.getOrganizationProjectsPeople(organizationId, projectsPeopleQueryModifier)

    return projectsPeopleResult.organizationProjectsPeople
  }

}
