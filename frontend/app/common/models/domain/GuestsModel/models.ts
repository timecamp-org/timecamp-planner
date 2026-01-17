import { makeTypedFactory } from 'typed-immutable-record'
import { GuestInProjectInterface, GuestInProjectRecordInterface } from 'models/domain/GuestsModel/types'

const defaultGuestInProject: GuestInProjectInterface = {
  id: undefined,
  userInProjectId: undefined,
  userInOrganizationId: undefined,
  organizationId: undefined,
  userId: undefined,
  projectId: undefined,
}

export const GuestInProject = makeTypedFactory<
  GuestInProjectInterface | GuestInProjectRecordInterface,
  GuestInProjectRecordInterface
>(defaultGuestInProject)