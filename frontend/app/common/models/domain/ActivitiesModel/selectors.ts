import { createSelector } from 'reselect';
import * as Constants from './constants';
import { Map, List } from 'immutable';
import createCachedSelector from 're-reselect';
import { isActivityVisible, visibleActivityTypes, getActivityType } from './utils';
import generateSelectorName from '../../../utils/generateSelectorName';
import { ApplicationState } from 'common/types';
import {
  ActivitiesState,
  ActivityChangedPropRecordInterface,
  ActivityRecordInterface,
} from 'models/domain/ActivitiesModel/types';
import { Id } from 'common/utils/identifier';
import { ActivityType } from 'models/domain/ActivitiesModel/constants/ActivityType';

const emptyMap = Map();
const emptyList = List();

export const selectActivitiesDomain = (state: ApplicationState): ActivitiesState => state.get(Constants.domain);

export const selectActivitiesData = createSelector(
  selectActivitiesDomain,
  (domain: ActivitiesState): Map<Id, ActivityRecordInterface> => domain.get('activitiesData')
);

export const selectObjectActivities = createSelector(
  selectActivitiesDomain,
  (domain: ActivitiesState): Map<Id, List<Id>> => domain.get('objectActivities')
);

export const selectActivitiesChangedPropsDomain = createSelector(
  selectActivitiesDomain,
  (domain: ActivitiesState): Map<Id, List<ActivityChangedPropRecordInterface>> => domain.get('activitiesChangedProps')
);

// args: activityId
export const selectActivity = createCachedSelector(
  selectActivitiesData,
  (_, args) => args.activityId,
  (data, activityId: Id): ActivityRecordInterface => data.get(activityId) || null
)((_, args) => generateSelectorName(args, ['activityId']));

/**
 * @param {string} objectId
 * @returns {List}
 */
export const selectObjectActivityIds = createCachedSelector(
  selectObjectActivities,
  (_, args) => args.objectId,
  (objectActivities, objectId: Id): List<Id> => objectActivities.get(objectId) || (emptyList as List<Id>)
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} objectId
 * @returns {List}
 */
export const selectFilteredObjectActivityIds = createCachedSelector(
  selectObjectActivityIds,
  selectActivitiesData,
  selectActivitiesChangedPropsDomain,
  (activityIds, activitiesData, activitiesChangedProps): List<Id> => {
    return activityIds.filter(
      (activityId) =>
        activitiesData.has(activityId) &&
        isActivityVisible(activitiesData.get(activityId), activitiesChangedProps.get(activityId))
    ) as List<Id>;
  }
)((_, args) => generateSelectorName(args, ['objectId']));

export const selectActivitiesTimestamp = createSelector(
  selectActivitiesData,
  (activitiesData): Map<Id, number> => activitiesData.map((data) => data.get('timestamp')) as Map<Id, number>
);

/**
 * @param {string} objectId
 * @returns {Map}
 */
export const selectFilteredObjectActivityTimestamps = createCachedSelector(
  selectFilteredObjectActivityIds,
  selectActivitiesTimestamp,
  (activityIds, activitiesTimestamp): Map<Id, number> => {
    let result = emptyMap as Map<Id, number>;

    if (activityIds) {
      activityIds.forEach((id) => {
        const timestamp = activitiesTimestamp.get(id);
        if (timestamp) {
          result = result.set(id, timestamp);
        }
      });
    }

    return result;
  }
)((_, args) => generateSelectorName(args, ['objectId']));

// args: activityId
export const selectActivityChangedProps = createCachedSelector(
  selectActivitiesChangedPropsDomain,
  (_, args) => args.activityId,
  (activitiesChangedProps, activityId: Id): List<ActivityChangedPropRecordInterface> =>
    activitiesChangedProps.get(activityId)
)((_, args) => generateSelectorName(args, ['activityId']));

// args: activityId
export const selectFilteredActivityTypes = createCachedSelector(
  selectActivity,
  selectActivityChangedProps,
  (activity, changes): ActivityType | List<ActivityType> => {
    if (activity) {
      const activityType = getActivityType(activity, changes);
      if (activityType instanceof List) {
        return (activityType as List<ActivityType>).map((type) =>
          visibleActivityTypes.includes(type) ? type : null
        ) as List<ActivityType>;
      } else {
        return visibleActivityTypes.includes(activityType as ActivityType) ? activityType : null;
      }
    } else {
      return null;
    }
  }
)((_, args) => generateSelectorName(args, ['activityId']));
