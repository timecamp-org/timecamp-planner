import { GuestInProjectInterface, GuestInProjectRecordInterface } from 'models/domain/GuestsModel/types'
import { Map } from 'immutable'
import { Id } from 'common/utils/identifier'

export interface OnAddGuestInProjectPayload {
  guestInProject: GuestInProjectInterface
}

export interface OnBatchGuestInProjectPayload {
  guestsInProject: Map<Id, GuestInProjectInterface>
}

export interface OnRemoveGuestInProjectPayload {
  guestInProjectId: Id,
}

export interface OnCreateGuestInProjectPayload {
  guestInProjectId: Id,
  guestInProject: GuestInProjectRecordInterface,
}

export interface OnDeleteGuestInProjectPayload {
  guestInProjectId: Id,
}