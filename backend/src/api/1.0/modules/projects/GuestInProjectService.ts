import { inject, injectable } from 'inversify'
import { GuestInProjectServiceInterface } from './interfaces/GuestInProjectServiceInterface'
import { Id } from '../common/identifier'

import { ProjectsModule } from './ProjectsModule'
import {
  AddGuestInProjectResult,
  AddGuestInProjectStatus,
  RemoveGuestInProjectResult,
  RemoveGuestInProjectStatus
} from './types'
import { GuestInProjectProviderInterface } from './interfaces/GuestInProjectProviderInterface'
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { violatesForeignKey, violatesUniqueKey } from '../../../../utils'
import { ForeignKey, UniqueKey } from '../db/Table'
import { Maybe } from '../common/types'
import { isEmpty } from 'lodash'
import { GuestInProjectFullDbRow } from '../db/schema'

@injectable()
export class GuestInProjectService implements GuestInProjectServiceInterface {
  constructor(
    @inject(ProjectsModule.GuestInProjectProviderInterface)
    private guestInProjectProvider: GuestInProjectProviderInterface,
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
  ) {}

  private handleAddGuestInProjectError(error: Error): Maybe<AddGuestInProjectResult> {
    if (violatesUniqueKey(error, UniqueKey.USER_IN_ORGANIZATION_ID_USER_IN_PROJECT_ID_UNIQ)) {
      return {
        status: AddGuestInProjectStatus.GUEST_ALREADY_IN_PROJECT
      }
    } else if (violatesForeignKey(error, ForeignKey.USER_IN_PROJECT_ID_FK)) {
      return {
        status: AddGuestInProjectStatus.PROJECT_NOT_FOUND
      }
    } else if (violatesForeignKey(error, ForeignKey.ORGANIZATION_ID_FK)) {
      return {
        status: AddGuestInProjectStatus.ORGANIZATION_NOT_FOUND,
      }
    } else {
      this.logger.error(error)
      throw error
    }
  }

  async getGuestInProject(guestId: Id, projectId: Id, trx?: Transaction): Promise<GuestInProjectFullDbRow> {
    const guestInProjectJson = await this.guestInProjectProvider.getGuestInProject(guestId, projectId, trx)

    return guestInProjectJson
  }

  async addGuestInProject(guestId: Id, projectId: Id, trx?: Transaction): Promise<AddGuestInProjectResult> {
    try {
      const [ guestInProjectJson ] = await this.guestInProjectProvider.getGuestInProjectJsons(guestId, [projectId], trx)

      await this.guestInProjectProvider.addGuestInProject(guestInProjectJson, trx)

      return {
        status: AddGuestInProjectStatus.OK,
      }
    } catch (error) {
      return this.handleAddGuestInProjectError(error)
    }
  }

  async addGuestInProjects(guestId: Id, projectIds: Id[], trx?: Transaction): Promise<AddGuestInProjectResult> {
    try {
      const guestInProjects = await this.guestInProjectProvider.getGuestInProjectJsons(guestId, projectIds, trx)

      await this.guestInProjectProvider.addGuestInProjects(guestInProjects, trx)

      return {
        status: AddGuestInProjectStatus.OK,
      }
    } catch (error) {
      return this.handleAddGuestInProjectError(error)
    }
  }

  async removeGuestInProject(guestId: Id, projectId: Id, trx?: Transaction): Promise<RemoveGuestInProjectResult> {
    try {
      const [{
        userInOrganizationId,
        userInProjectId,
      }] = await this.guestInProjectProvider.getGuestInProjectJsons(guestId, [projectId], trx)

      const deletedRows = await this.guestInProjectProvider.removeGuestInProject(userInOrganizationId, userInProjectId, trx)

      return {
        status: deletedRows === 0
          ? RemoveGuestInProjectStatus.NOT_FOUND
          : RemoveGuestInProjectStatus.OK
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  async removeGuestInProjects(guestId: Id, projectIds: Id[], trx?: Transaction): Promise<RemoveGuestInProjectResult> {
    try {
      const guestInProjectJsons = await this.guestInProjectProvider.getGuestInProjectJsons(guestId, projectIds, trx)

      const deletedRows = await this.guestInProjectProvider.removeGuestInProjects(guestInProjectJsons, trx)

      return {
        status: deletedRows !== projectIds.length
          ? RemoveGuestInProjectStatus.NOT_FOUND
          : RemoveGuestInProjectStatus.OK
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  async areThereAnyGuestsInProject(projectId: Id, trx?: Transaction): Promise<boolean> {
    const guestsInProject = await this.guestInProjectProvider.getProjectGuestIds(projectId, trx)
    return isEmpty(guestsInProject)
  }
}