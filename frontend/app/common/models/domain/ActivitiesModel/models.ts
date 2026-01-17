import { makeTypedFactory } from 'typed-immutable-record'
import {
  ActivityChangedPropInterface,
  ActivityChangedPropRecordInterface,
  ActivityInterface,
  ActivityRecordInterface
} from 'models/domain/ActivitiesModel/types'

export const defaultActivity: ActivityInterface = {
  id: undefined,
  actingUserId: undefined,
  objectId: undefined,
  objectType: undefined,
  objectValue: undefined,
  collectionName: undefined,
  containerId: undefined,
  containerType: undefined,
  organizationId: undefined,
  type: undefined,
  timestamp: undefined,
}

export const defaultActivityChangedProp: ActivityChangedPropInterface = {
  activityId: undefined,
  id: undefined,
  new: undefined,
  old: undefined,
  propertyName: undefined,
}

export const Activity = makeTypedFactory<
  ActivityInterface | ActivityRecordInterface, ActivityRecordInterface
>(defaultActivity)

export const ActivityChangedProp = makeTypedFactory<
  ActivityChangedPropInterface | ActivityChangedPropRecordInterface, ActivityChangedPropRecordInterface
>(defaultActivityChangedProp)