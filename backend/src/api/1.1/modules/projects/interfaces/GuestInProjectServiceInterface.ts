import { Id } from '../../common/identifier'
import { GuestInProjectFullDbRow } from '../../db/schema'

import { AddGuestInProjectResult, RemoveGuestInProjectResult } from '../types'

export interface GuestInProjectServiceInterface {
  getGuestInProject(guestId: Id, projectId: Id, trx?: Transaction): PromiseLike<GuestInProjectFullDbRow>,
  addGuestInProject(guestId: Id, projectId: Id, trx?: Transaction): PromiseLike<AddGuestInProjectResult>,
  addGuestInProjects(guestId: Id, projectIds: Id[], trx?: Transaction): PromiseLike<AddGuestInProjectResult>,

  removeGuestInProject(guestId: Id, projectId: Id, trx?: Transaction): PromiseLike<RemoveGuestInProjectResult>,
  removeGuestInProjects(guestId: Id, projectIds: Id[], trx?: Transaction): PromiseLike<RemoveGuestInProjectResult>

  areThereAnyGuestsInProject(projectId: Id, trx?: Transaction): PromiseLike<boolean>
}