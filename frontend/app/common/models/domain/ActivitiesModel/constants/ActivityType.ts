import { ActivityContainerType, ActivityTargetType, BasicActivityType } from 'models/domain/ActivitiesModel/types';

export enum ActivityType {
  TASK_CREATED = 'TASK_CREATED',
  PROJECT_CREATED = 'PROJECT_CREATED',
  TASK_ADDED_TO_PROJECT = 'TASK_ADDED_TO_PROJECT',
  MESSAGE_ADDED_TO_PROJECT = 'MESSAGE_ADDED_TO_PROJECT',
  PERSON_ADDED_TO_PROJECT = 'PERSON_ADDED_TO_PROJECT',
  MESSAGE_ADDED_TO_TASK = 'MESSAGE_ADDED_TO_TASK',
  TAG_ADDED_TO_TASK = 'TAG_ADDED_TO_TASK',
  TASK_ASSIGNEE_ADDED = 'TASK_ASSIGNEE_ADDED',
  TASK_ASSIGNEE_REMOVED = 'TASK_ASSIGNEE_REMOVED',
  TASK_STARTDATE_CHANGED = 'TASK_STARTDATE_CHANGED',
  TASK_DUEDATE_CHANGED = 'TASK_DUEDATE_CHANGED',
  TASK_NAME_CHANGED = 'TASK_NAME_CHANGED',
  TASK_DESCRIPTION_CHANGED = 'TASK_DESCRIPTION_CHANGED',
  TASK_PROGRESS_ESTIMATE_CHANGED = 'TASK_PROGRESS_ESTIMATE_CHANGED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  TASK_PROJECT_CHANGED = 'TASK_PROJECT_CHANGED',
  TASK_TIME_ESTIMATE_CHANGED = 'TASK_TIME_ESTIMATE_CHANGED',
  TASK_PRIORITY_TYPE_CHANGED = 'TASK_PRIORITY_TYPE_CHANGED',
  PROJECT_NAME_CHANGED = 'PROJECT_NAME_CHANGED',
  PROJECT_DESCRIPTION_CHANGED = 'PROJECT_DESCRIPTION_CHANGED',
  PROJECT_CODE_CHANGED = 'PROJECT_CODE_CHANGED',
  PROJECT_COLOR_CHANGED = 'PROJECT_COLOR_CHANGED',
  PROJECT_STARTDATE_CHANGED = 'PROJECT_STARTDATE_CHANGED',
  PROJECT_DUEDATE_CHANGED = 'PROJECT_DUEDATE_CHANGED',
  PROJECT_PERSON_REMOVED = 'PROJECT_PERSON_REMOVED',
  PROJECT_TASK_REMOVED = 'PROJECT_TASK_REMOVED',
  PROJECT_STATUS_CHANGED = 'PROJECT_STATUS_CHANGED',
  TASK_ARCHIVED_CHANGED = 'TASK_ARCHIVED_CHANGED',
  TASK_LABEL_CHANGED = 'TASK_LABEL_CHANGED',
  CARD_POINTS_CHANGED = 'CARD_POINTS_CHANGED',
  CARD_TIME_ESTIMATES_CHANGED = 'CARD_TIME_ESTIMATES_CHANGED',
}

/* eslint-disable quote-props */
// map structure :
/*
    activityType(created) => objectType
    activityType(added) => containerType => objectType
    activityType(changed) => objectType => propertyType
    activityType(removed) => containerType => collectionName or activityType(removed) => containerType => objectType

*/
export const ActivityTypesMap = {
  [BasicActivityType.CREATE]: {
    [ActivityContainerType.TASK]: ActivityType.TASK_CREATED,
    [ActivityContainerType.PROJECT]: ActivityType.PROJECT_CREATED,
  },
  [BasicActivityType.ADD]: {
    [ActivityContainerType.PROJECT]: {
      [ActivityTargetType.TASK]: ActivityType.TASK_ADDED_TO_PROJECT,
      [ActivityTargetType.MESSAGE]: ActivityType.MESSAGE_ADDED_TO_PROJECT,
      [ActivityTargetType.USER]: ActivityType.PERSON_ADDED_TO_PROJECT,
    },
    [ActivityContainerType.TASK]: {
      [ActivityTargetType.USER]: ActivityType.TASK_ASSIGNEE_ADDED,
      [ActivityTargetType.MESSAGE]: ActivityType.MESSAGE_ADDED_TO_TASK,
      [ActivityTargetType.TAG]: ActivityType.TAG_ADDED_TO_TASK,
    },
  },
  [BasicActivityType.MODIFY]: {
    [ActivityContainerType.TASK]: {
      startDate: ActivityType.TASK_STARTDATE_CHANGED,
      dueDate: ActivityType.TASK_DUEDATE_CHANGED,
      name: ActivityType.TASK_NAME_CHANGED,
      description: ActivityType.TASK_DESCRIPTION_CHANGED,
      progress: ActivityType.TASK_PROGRESS_ESTIMATE_CHANGED,
      status: ActivityType.TASK_STATUS_CHANGED,
      projectId: ActivityType.TASK_PROJECT_CHANGED,
      isArchived: ActivityType.TASK_ARCHIVED_CHANGED,
      taskListId: ActivityType.TASK_LABEL_CHANGED,
      'agile.estimatedEffort': ActivityType.CARD_POINTS_CHANGED,
      hours: ActivityType.CARD_TIME_ESTIMATES_CHANGED,
      taskPriorityType: ActivityType.TASK_PRIORITY_TYPE_CHANGED,
    },
    [ActivityContainerType.PROJECT]: {
      name: ActivityType.PROJECT_NAME_CHANGED,
      description: ActivityType.PROJECT_DESCRIPTION_CHANGED,
      code: ActivityType.PROJECT_CODE_CHANGED,
      color: ActivityType.PROJECT_COLOR_CHANGED,
      startDate: ActivityType.PROJECT_STARTDATE_CHANGED,
      dueDate: ActivityType.PROJECT_DUEDATE_CHANGED,
      status: ActivityType.PROJECT_STATUS_CHANGED,
    },
  },
  [BasicActivityType.REMOVE]: {
    [ActivityContainerType.TASK]: {
      [ActivityTargetType.USER]: ActivityType.TASK_ASSIGNEE_REMOVED,
    },
    [ActivityContainerType.PROJECT]: {
      [ActivityTargetType.PEOPLE]: ActivityType.PROJECT_PERSON_REMOVED,
      [ActivityTargetType.TASKS]: ActivityType.PROJECT_TASK_REMOVED,
    },
  },
};
