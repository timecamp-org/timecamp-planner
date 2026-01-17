import { ActivityType, ActivityTypesMap } from './constants/ActivityType';
import { List } from 'immutable';
import {
  ActivityChangedPropRecordInterface,
  ActivityRecordInterface,
  BasicActivityType,
} from 'models/domain/ActivitiesModel/types';
import get from 'lodash/get';

export const visibleActivityTypes = [
  ActivityType.TASK_CREATED,
  ActivityType.TASK_STATUS_CHANGED,
  ActivityType.TASK_ARCHIVED_CHANGED,
  ActivityType.TASK_PROGRESS_ESTIMATE_CHANGED,
  ActivityType.TASK_STARTDATE_CHANGED,
  ActivityType.TASK_DUEDATE_CHANGED,
  ActivityType.TASK_PROJECT_CHANGED,
  ActivityType.TASK_LABEL_CHANGED,
  ActivityType.CARD_POINTS_CHANGED,
  ActivityType.CARD_TIME_ESTIMATES_CHANGED,
  ActivityType.TASK_ASSIGNEE_ADDED,
  ActivityType.TASK_ASSIGNEE_REMOVED,
  ActivityType.TASK_PRIORITY_TYPE_CHANGED,
];

export function isActivityVisible(
  activity: ActivityRecordInterface,
  changes: List<ActivityChangedPropRecordInterface>
): boolean {
  let isInVisibleAcitivityTypes = false;
  const activityType = getActivityType(activity, changes);

  if (activityType instanceof List) {
    -(activityType as List<ActivityType>).forEach((type) => {
      if (visibleActivityTypes.includes(type)) {
        isInVisibleAcitivityTypes = true;
      }
    });
  } else {
    isInVisibleAcitivityTypes = visibleActivityTypes.includes(activityType as ActivityType);
  }

  return isInVisibleAcitivityTypes;
}

export function getActivityType(
  activity: ActivityRecordInterface,
  changes: List<ActivityChangedPropRecordInterface>
): ActivityType | List<ActivityType> {
  const { type, objectType, containerType, collectionName } = activity;

  switch (type) {
    case BasicActivityType.CREATE:
      return ActivityTypesMap[type][objectType];
    case BasicActivityType.ADD:
      return ActivityTypesMap[type][containerType][objectType];
    case BasicActivityType.MODIFY:
      if (!changes || changes.size <= 0) {
        return null;
      } else {
        return changes.map(
          (change) => ActivityTypesMap[type][objectType][change.get('propertyName')]
        ) as List<ActivityType>;
      }
    case BasicActivityType.REMOVE:
      return get(ActivityTypesMap, [type, containerType, collectionName || objectType]);
    default:
      return null;
  }
}
