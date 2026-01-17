
import { Id } from '../../common/identifier'
import { GuestInProjectFullDbRow } from '../../db/schema'
import { QueryModifier } from '../../../../../services/types'
import { GuestInProjectJson } from '../types'
import { AnyDict } from '../../common/types'

export interface GuestInProjectProviderInterface {
  getGuestInProject(userId: Id, projectId: Id, trx?: Transaction): PromiseLike<GuestInProjectFullDbRow>
  getGuestInProjectById(guestInProjectId: Id, trx?: Transaction): PromiseLike<GuestInProjectFullDbRow>
  getGuestProjectIds(organizationId: Id, guestId: Id, decorate?: QueryModifier, trx?: Transaction): PromiseLike<Id[]>
  getProjectGuestIds(projectId: Id, trx?: Transaction): PromiseLike<Id[]>

  getGuestInProjectJsons(guestId: Id, projectIds: Id[], trx?: Transaction): PromiseLike<GuestInProjectJson[]>

  addGuestInProject(guestInProject: GuestInProjectJson, trx?: Transaction): PromiseLike<AnyDict>
  addGuestInProjects(guestInProjects: GuestInProjectJson[], trx?: Transaction): PromiseLike<AnyDict>

  removeGuestInProject(userInOrganizationId: Id, userInProjectId: Id, trx?: Transaction): PromiseLike<number>
  removeGuestInProjects(guestInProjectJsons: GuestInProjectJson[], trx?: Transaction): PromiseLike<number>

  getOrganizationProjectsGuestInProject(organizationId: Id, trx?: Transaction): PromiseLike<GuestInProjectFullDbRow[]>
  getOccupiedGuestSeatCountForOrganization(organizationId: Id, trx?: Transaction): PromiseLike<number>
}