import { Map, List } from 'immutable'
import { Id } from 'common/utils/identifier'
import {
  ActivityChangedPropRecordInterface,
  ActivityRecordInterface
} from 'models/domain/ActivitiesModel/types'


export interface OnBatchActivitiesDataPayload {
  activitiesData: Map<Id, ActivityRecordInterface>,
  objectActivities: Map<Id, List<Id>>,
}

export interface OnBatchActivitiesChangedPropsPayload {
  activitiesChangedProps: Map<Id, List<ActivityChangedPropRecordInterface>>
}

export interface OnCreateActivityDataPayload {
  activityId: Id,
  activity: ActivityRecordInterface,
  objectActivities: Map<Id, List<Id>>,
  activityChangedProps: List<ActivityChangedPropRecordInterface>,
}