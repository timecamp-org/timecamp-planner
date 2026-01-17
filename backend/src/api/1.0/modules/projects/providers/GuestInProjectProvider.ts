import { injectable } from 'inversify'
import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider'
import { GuestInProjectProviderInterface } from '../interfaces/GuestInProjectProviderInterface'

import { Id } from '../../common/identifier'
import { GuestInProjectFullDbRow } from '../../db/schema'
import Table from '../../db/Table'
import { QueryModifier } from '../../../../../services/types'
import { GuestInProjectJson } from '../types'
import { AnyDict } from '../../common/types'
import { EntityStatus } from '../../common/enum'

@injectable()
export class GuestInProjectProvider extends AbstractPostgresProvider implements GuestInProjectProviderInterface {

  async getGuestInProject(userId: Id, projectId: Id, trx?: Transaction): Promise<GuestInProjectFullDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select(
        `${Table.GUEST_IN_PROJECT}.*`,
        `${Table.USER_IN_PROJECT}.projectId`,
        `${Table.USER_IN_PROJECT}.userId`
      )
      .from(Table.GUEST_IN_PROJECT)
      .join(Table.USER_IN_PROJECT, `${Table.USER_IN_PROJECT}.id`, `${Table.GUEST_IN_PROJECT}.userInProjectId`)
      .where(`${Table.USER_IN_PROJECT}.userId`, userId)
      .andWhere(`${Table.USER_IN_PROJECT}.projectId`, projectId)
      .first()
  }

  async getGuestInProjectById(guestInProjectId: Id, trx?: Transaction): Promise<GuestInProjectFullDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select(
        `${Table.GUEST_IN_PROJECT}.*`,
        `${Table.USER_IN_PROJECT}.projectId`,
        `${Table.USER_IN_PROJECT}.userId`
      )
      .from(Table.GUEST_IN_PROJECT)
      .join(Table.USER_IN_PROJECT, `${Table.USER_IN_PROJECT}.id`, `${Table.GUEST_IN_PROJECT}.userInProjectId`)
      .where(`${Table.GUEST_IN_PROJECT}.id`, guestInProjectId)
      .first()
  }

  async getGuestProjectIds(organizationId: Id, guestId: Id, decorate?: QueryModifier, trx?: Transaction): Promise<Id[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    query
      .select(`${Table.USER_IN_PROJECT}.project_id`)
      .from(Table.GUEST_IN_PROJECT)
      .join(
        Table.USER_IN_ORGANIZATION,
        join => join
          .on(`${Table.GUEST_IN_PROJECT}.userInOrganizationId`, `${Table.USER_IN_ORGANIZATION}.id`)
          .andOn(this.connection.getConnection().raw(`${Table.USER_IN_ORGANIZATION}.organization_id = ?`, organizationId))
      )
      .join(
        Table.USER_IN_PROJECT,
        join => join
          .on(`${Table.GUEST_IN_PROJECT}.userInProjectId`, `${Table.USER_IN_PROJECT}.id`)
          .andOn(this.connection.getConnection().raw(`${Table.USER_IN_PROJECT}.user_id = ?`, guestId))
      )
      .pluck('project_id')

    if (decorate) {
      decorate(query)
    }

    return await query
  }

  async getProjectGuestIds(projectId: Id, trx?: Transaction): Promise<Id[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select(`${Table.USER_IN_PROJECT}.userId`)
      .from(Table.GUEST_IN_PROJECT)
      .join(Table.USER_IN_PROJECT,
        `${Table.GUEST_IN_PROJECT}.userInProjectId`, `${Table.USER_IN_PROJECT}.id`
      )
      .where(`${Table.USER_IN_PROJECT}.project_id`, projectId)
      .pluck('user_id')
  }

  async getGuestInProjectJsons(guestId: Id, projectIds: Id[], trx?: Transaction): Promise<GuestInProjectJson[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .column(
        `${Table.PROJECT}.organizationId`,
        {userInOrganizationId: `${Table.USER_IN_ORGANIZATION}.id`},
        {userInProjectId: `${Table.USER_IN_PROJECT}.id`},
      )
      .select()
      .from(Table.PROJECT)
      .join(Table.USER_IN_PROJECT, `${Table.USER_IN_PROJECT}.projectId`, `${Table.PROJECT}.id`)
      .join(Table.USER_IN_ORGANIZATION, `${Table.USER_IN_ORGANIZATION}.organizationId`, `${Table.PROJECT}.organizationId`)
      .whereIn(`${Table.PROJECT}.id`, projectIds)
      .andWhere(`${Table.USER_IN_ORGANIZATION}.userId`, guestId)
      .andWhere(`${Table.USER_IN_PROJECT}.userId`, guestId)
  }


  async addGuestInProject(guestInProject: GuestInProjectJson, trx?: Transaction): Promise<AnyDict> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .insert(guestInProject)
      .into(Table.GUEST_IN_PROJECT)
  }

  async addGuestInProjects(guestInProjects: GuestInProjectJson[], trx?: Transaction): Promise<AnyDict> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .insert(guestInProjects)
      .into(Table.GUEST_IN_PROJECT)
  }

  async removeGuestInProject(userInOrganizationId: Id, userInProjectId: Id, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .from(Table.GUEST_IN_PROJECT)
      .where({
        userInOrganizationId,
        userInProjectId,
      })
      .del()
  }

  async removeGuestInProjects(guestInProjectJsons: GuestInProjectJson[], trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx)
    const whereInParam = guestInProjectJsons.reduce((acc, guestInProjectJson) => {
      acc.push([guestInProjectJson.userInOrganizationId, guestInProjectJson.userInProjectId])
      return acc
    }, [])

    return await query
      .from(Table.GUEST_IN_PROJECT)
      .whereIn([`${Table.GUEST_IN_PROJECT}.userInOrganizationId`, `${Table.GUEST_IN_PROJECT}.userInProjectId`], whereInParam)
      .del()
  }

  async getOrganizationProjectsGuestInProject(organizationId: Id, trx?: Transaction): Promise<GuestInProjectFullDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .column(
        `${Table.GUEST_IN_PROJECT}.*`,
        `${Table.USER_IN_PROJECT}.projectId`,
        `${Table.USER_IN_PROJECT}.userId`
      )
      .select()
      .from(Table.GUEST_IN_PROJECT)
      .join(Table.USER_IN_ORGANIZATION, `${Table.USER_IN_ORGANIZATION}.id`, `${Table.GUEST_IN_PROJECT}.userInOrganizationId`)
      .join(Table.USER_IN_PROJECT, `${Table.USER_IN_PROJECT}.id`, `${Table.GUEST_IN_PROJECT}.userInProjectId`)
      .where(`${Table.USER_IN_ORGANIZATION}.organization_id`, organizationId)
      .andWhere(`${Table.USER_IN_ORGANIZATION}.entityStatus`, EntityStatus.EXISTS)
  }

  async getOccupiedGuestSeatCountForOrganization(organizationId: Id, trx?: Transaction): Promise<number> {
    const organizationProjectsGuestInProject = await this.getOrganizationProjectsGuestInProject(organizationId, trx)

    return organizationProjectsGuestInProject.length
  }
}
