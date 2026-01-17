import * as C from './constants'
import { action } from 'typesafe-actions'
import { PayloadAction } from 'common/types'
import { GuestInProjectInterface } from 'models/domain/GuestsModel/types'
import {
  OnAddGuestInProjectPayload,
  OnBatchGuestInProjectPayload,
  OnCreateGuestInProjectPayload,
  OnDeleteGuestInProjectPayload,
  OnRemoveGuestInProjectPayload
} from 'models/domain/GuestsModel/payloads'
import { Map } from 'immutable'
import { Id } from 'common/utils/identifier'
import { EntityInterface } from 'models/domain/EntityModel/types'
import { GuestInProject } from 'models/domain/GuestsModel/models'

export const onInit = () => action(C.onInit)

export const onAddGuestInProject = (guestInProject: GuestInProjectInterface): PayloadAction<OnAddGuestInProjectPayload> =>
  action(C.onAddGuestInProject, { guestInProject })

export const onBatchGuestInProject = (guestsInProject: Map<Id, GuestInProjectInterface>): PayloadAction<OnBatchGuestInProjectPayload> =>
  action(C.onBatchGuestInProject, { guestsInProject })

export const onRemoveGuestInProject = (guestInProjectId: Id): PayloadAction<OnRemoveGuestInProjectPayload> =>
  action(C.onRemoveGuestInProject, { guestInProjectId })

export const onCreateGuestInProject = (entity: EntityInterface): PayloadAction<OnCreateGuestInProjectPayload> => {
  const { entityId: guestInProjectId, body } = entity
  const payload = {
    guestInProjectId,
    guestInProject: GuestInProject(body)
  }
  return action(C.onCreateGuestInProject, payload)
}

export const onDeleteGuestInProject = (entity: EntityInterface): PayloadAction<OnDeleteGuestInProjectPayload> => {
  return action(C.onDeleteGuestInProject, { guestInProjectId: entity.entityId })
}