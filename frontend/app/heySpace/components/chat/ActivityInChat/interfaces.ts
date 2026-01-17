import { ActivityType } from 'models/domain/ActivitiesModel/constants/ActivityType';
import { ActivityChangedPropRecordInterface } from 'models/domain/ActivitiesModel/types';

export interface ActivityWithChange {
  change: ActivityChangedPropRecordInterface;
  activityType: ActivityType;
}
