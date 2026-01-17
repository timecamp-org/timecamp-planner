import { Id } from 'common/utils/identifier';
import { Map } from 'immutable'
import { ImmutableMap } from 'common/types';
import { TypedRecord } from 'typed-immutable-record'

export interface GuestInProjectInterface {
  id: Id,
  userInProjectId: Id,
  userInOrganizationId: Id,
  organizationId: Id,
  userId: Id,
  projectId: Id,
}

export interface GuestInProjectRecordInterface extends TypedRecord<GuestInProjectRecordInterface>, GuestInProjectInterface {}

export interface GuestsState extends ImmutableMap<string, any> {
  guestInProjectData: GuestInProjectData,
}

export type GuestInProjectData = Map<Id, GuestInProjectInterface>