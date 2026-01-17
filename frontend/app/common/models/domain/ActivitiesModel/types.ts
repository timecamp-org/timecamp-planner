import { Id } from 'common/utils/identifier';
import { TypedRecord } from 'typed-immutable-record';
import { ImmutableMap } from 'common/types';
import { List, Map } from 'immutable';

export interface ActivitiesState extends ImmutableMap<string, any> {
  activitiesData: Map<Id, ActivityRecordInterface>;
  activitiesChangedProps: Map<Id, List<ActivityChangedPropRecordInterface>>;
  objectActivities: Map<Id, List<Id>>;
  fatalError: boolean;
}

export interface ActivityRecordInterface
  extends TypedRecord<ActivityRecordInterface>,
    ActivityInterface {}

export enum ActivityContainerType {
  TASK = 'task',
  PROJECT = 'project',
  TASK_LIST = 'task_list',
  CHECKLIST_ITEM = 'checklist_item',
}

export enum ActivityTargetType {
  TASK = 'task',
  PROJECT = 'project',
  USER = 'user',
  TASK_LIST = 'task_list',
  FILE = 'file',
  TAG = 'tag',
  MESSAGE = 'message',
  PEOPLE = 'people',
  TASKS = 'tasks',
  TASK_TIME_ESTIMATES = 'task_time_estimates',
}

export enum BasicActivityType {
  CREATE = 'create',
  ADD = 'add',
  DELETE = 'delete',
  REMOVE = 'remove',
  MODIFY = 'modify',
}

export interface ActivityInterface<TValue = any> {
  id: Id;
  actingUserId: Id;
  objectId: Id;
  objectType: ActivityTargetType;
  objectValue: TValue;
  collectionName: string;
  containerId: Id;
  containerType: ActivityContainerType;
  organizationId: Id;
  type: BasicActivityType;
  timestamp: number;
}

export interface ActivityChangedPropInterface<TValue = any> {
  activityId: Id;
  id: Id;
  new: TValue;
  old: TValue;
  propertyName: string;
}

export interface ActivityChangedPropRecordInterface
  extends TypedRecord<ActivityChangedPropRecordInterface>,
    ActivityChangedPropInterface {}

export interface ActivityEntityInterface {
  actorId: Id;
  changedProps?: ActivityChangedPropInterface[];
  containerId: Id;
  containerType?: ActivityContainerType;
  containerValue?: string;
  createdAt?: number;
  id: Id;
  targetId: Id;
  targetType: ActivityTargetType;
  targetValue: string;
  type: BasicActivityType;
}
