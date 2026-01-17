import * as ActivitiesConstants from './constants'
import { Map, List } from 'immutable'
import { getActivityRecordFromRestResponse } from '../../../utils/fetchResultToRecord'
import {
  ActivityChangedPropInterface, ActivityChangedPropRecordInterface,
  ActivityEntityInterface,
  ActivityRecordInterface,
} from 'models/domain/ActivitiesModel/types'
import { Id } from 'common/utils/identifier'
import { Dict, PayloadAction } from 'common/types'
import { action } from 'typesafe-actions'
import * as payloads from './payloads'
import { ActivityChangedProp } from 'models/domain/ActivitiesModel/models'
import { updateListWithNewItem } from 'common/utils/immutableUtils'

const emptyList = List()
const emptyMap = Map()

export function onBatchActivitiesData(
  activitiesEntities: List<ActivityEntityInterface>,
  activityIdTargetIdMap: Dict<Id>,
): PayloadAction<payloads.OnBatchActivitiesDataPayload> {
  let activitiesData = emptyMap as Map<Id, ActivityRecordInterface>
  let objectActivities = emptyMap as Map<Id, List<Id>>

  activitiesEntities.forEach(entity => {
    const targetId = activityIdTargetIdMap[entity.id]
    if (targetId) {
      entity.targetId = targetId
    }
    const activity = getActivityRecordFromRestResponse(entity)

    if (entity.containerId) {
      objectActivities = objectActivities.update(
        entity.containerId,
        (activityIds) => activityIds ? activityIds.push(entity.id) : List([entity.id]),
      )
    }
    activitiesData = activitiesData.set(entity.id, activity)
  })

  return action(ActivitiesConstants.onBatchActivtiesData, {
    activitiesData,
    objectActivities,
  })
}


export function onBatchActivitiesChangedProps(
  changedProps: List<ActivityChangedPropInterface>
): PayloadAction<payloads.OnBatchActivitiesChangedPropsPayload> {
  let activitiesChangedProps = emptyMap as Map<Id, List<ActivityChangedPropRecordInterface>>
  changedProps.forEach(changedProp => {
    const change = ActivityChangedProp(changedProp)
    activitiesChangedProps = activitiesChangedProps.update(
      change.activityId,
      updateListWithNewItem(change),
    )
  })

  return action(ActivitiesConstants.onBatchActivitiesChangedProps, {
    activitiesChangedProps,
  })
}

export function onCreateActivityData(
  activityId: Id,
  activityEntity: ActivityEntityInterface,
): PayloadAction<payloads.OnCreateActivityDataPayload> {
  const activity = getActivityRecordFromRestResponse(activityEntity)
  const containerId = activity.containerId
  const objectId = activity.objectId
  let objectActivities = emptyMap as Map<Id, List<Id>>
  let activityChangedProps = emptyList as List<ActivityChangedPropRecordInterface>
  if (containerId) {
    objectActivities = objectActivities.set(containerId, List([activityId]))
  }
  if (objectId) {
    objectActivities = objectActivities.set(objectId, List([activityId]))
  }
  if (activityEntity.changedProps) {
    const changedProps = activityEntity.changedProps.map(changedProp => ActivityChangedProp(changedProp))
    activityChangedProps = List(changedProps)
  }

  return action(ActivitiesConstants.onCreateActivityData, {
    activityId,
    activity,
    objectActivities,
    activityChangedProps,
  });
}
