import { Id } from '../common/identifier';
import { PeriodType, Position } from '../common/types';
import {
  ChecklistItemDbRow,
  FileDbRow,
  TaskAttachmentDbRow,
  TaskDbRow,
  TaskHasTagDbRow,
  TaskRecurrenceDependencyDbRow,
  TaskRecurrenceSettingsDbRow,
  TaskStatus,
  TaskTimeEstimateDbRow,
  UserFollowsTaskDbRow,
  UserInTaskDbRow,
} from '../db/schema';

import { ResourceQueryParams } from '../../../../infrastructure/resources/types';

export enum CreateTaskStatus {
  OK,
  TASK_ALREADY_EXISTS,
  TASK_WITH_ORDER_ALREADY_EXISTS,
  PROJECT_NOT_FOUND,
  LIST_NOT_FOUND,
  DUE_DATE_EARLIER_THAN_START_DATE,
}

export enum UpdateTaskStatus {
  OK,
  TASK_NOT_FOUND,
  TASK_WITH_ORDER_ALREADY_EXISTS,
  DUE_DATE_EARLIER_THAN_START_DATE,
}

export enum AddTaskPeopleStatus {
  OK,
  USER_ALREADY_IN_TASK,
  TASK_NOT_FOUND,
  USER_NOT_FOUND,
}

export enum UpdateTaskPeopleStatus {
  OK,
  TASK_PEOPLE_NOT_FOUND,
}

export enum DeleteTaskPeopleStatus {
  OK,
  TASK_PEOPLE_NOT_FOUND,
}

export enum AttachTagToTaskStatus {
  OK,
  TASK_ALREADY_HAS_TAG,
  TAG_NOT_FOUND,
  TASK_NOT_FOUND,
}

export enum DetachTagFromTaskStatus {
  OK,
  TASK_TAG_NOT_FOUND,
}

export enum AttachFileToTaskStatus {
  OK,
  FILE_NOT_FOUND,
  TASK_NOT_FOUND,
}

export enum DetachFileFromTaskStatus {
  OK,
  TASK_ATTACHMENT_NOT_FOUND,
  FILE_NOT_FOUND,
}

export enum GetTaskChecklistStatus {
  OK,
  TASK_NOT_FOUND,
}

export enum AddTaskFollowerStatus {
  OK,
  USER_ALREADY_FOLLOWING_TASK,
  TASK_NOT_FOUND,
  USER_NOT_FOUND,
}

export enum RemoveTaskFollowerStatus {
  OK,
  TASK_FOLLOWER_NOT_FOUND,
}

export enum RemoveTasksFollowerStatus {
  OK,
}

export enum CopyTaskStatus {
  OK,
  TASK_NOT_FOUND,
}

export enum GetTaskRelatedObjectsStatus {
  OK,
  TASK_NOT_FOUND,
}

export interface CreateTaskResult {
  status: CreateTaskStatus;
  task?: TaskDbRow;
}

export interface UpdateTaskResult {
  status: UpdateTaskStatus;
}

export interface AddTaskPeopleResult {
  status: AddTaskPeopleStatus;
}

export interface UpdateTaskPeolpeResult {
  status: UpdateTaskPeopleStatus;
}

export interface DeleteTaskPeolpeResult {
  status: DeleteTaskPeopleStatus;
}

export interface AttachTagToTaskResult {
  status: AttachTagToTaskStatus;
}

export interface DetachTagFromTaskResult {
  status: DetachTagFromTaskStatus;
}

export interface AttachFileToTaskResult {
  status: AttachFileToTaskStatus;
}

export interface DetachFileFromTaskResult {
  status: DetachFileFromTaskStatus;
}

export interface GetTaskChecklistResult {
  status: GetTaskChecklistStatus;
  data?: Array<ChecklistItemDbRow>;
}

export interface AddTaskFollowerResult {
  status: AddTaskFollowerStatus;
}

export interface RemoveTaskFollowerResult {
  status: RemoveTaskFollowerStatus;
}

export interface RemoveTasksFollowerResult {
  status: RemoveTasksFollowerStatus;
}

export interface CopyTaskResult {
  status: CopyTaskStatus;
  newTaskId?: Id;
}
export interface GetTaskRelatedObjectsResult {
  status: GetTaskRelatedObjectsStatus;
  data?: TaskRelatedObjectsData;
}
export interface TaskRelatedObjectsData {
  task: TaskDbRow;
  taskFollowerIds: Id[];
  taskPeople: UserInTaskDbRow[];
  taskTagIds: Id[];
  checklistItems: ChecklistItemDbRow[];
  taskAttachments?: FileDbRow[];
}
export interface TaskRelatedObjectsInsertData {
  task: TaskDbRow;
  taskFollowers: UserFollowsTaskDbRow[];
  taskPeople: UserInTaskDbRow[];
  taskTags: TaskHasTagDbRow[];
  checklistItems: ChecklistItemDbRow[];
  taskAttachments?: TaskAttachmentDbRow[];
}

export interface ChecklistMap {
  [checkListItemId: string]: ChecklistItemDbRow;
}

export interface TaskPeopleMap {
  [taskId: string]: Array<UserInTaskDbRow>;
}

export interface TaskFollowersMap {
  [taskId: string]: Array<Id>;
}

export interface TaskTagsMap {
  [taskId: string]: Array<TaskHasTagDbRow>;
}

export type TaskCreatedEventData = {
  task: Partial<TaskDbRow>;
  creatorId: Id;
  trx: Transaction;
};

export enum GetUserLatestVisitedTasksStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
  USER_NOT_FOUND,
}

export interface UserLatestVisitedTaskData extends TaskDbRow {
  latestVisitedDate: Date;
}

export interface GetUserLatestVisitedTasksResult {
  status: GetUserLatestVisitedTasksStatus;
  data?: UserLatestVisitedTaskData[];
}

export enum SetUserLatestTaskVisitDateResultStatus {
  OK,
  USER_NOT_FOUND,
  TASK_NOT_FOUND,
}

export interface SetUserLatestTaskVisitDateResult {
  status: SetUserLatestTaskVisitDateResultStatus;
}

export type TaskChangedProps = Partial<TaskDbRow>;

export interface TaskJson {
  id?: Id;
  projectId?: Id;
  taskListId?: Id;
  name?: string;
  order?: number;
  description?: string;
  isArchived?: boolean;
  status?: TaskStatus;
  progress?: number;
  dueDate?: string;
  startDate?: string;
  creatorId?: Id;
  sourceMessageId?: Id;
}

export enum TaskJsonValidationStatus {
  OK,
  DUE_DATE_EARLIER_THAN_START_DATE,
}

export interface TaskJsonValidationResult {
  status: TaskJsonValidationStatus;
}

export type TaskOrderByListId = {
  [listId: string]: number;
};

export type TasksAssigneeIdsMap = {
  [id: string]: Id[];
};

export type RecurrenceSettingsData = {
  periodType: PeriodType;
  interval: number;

  targetTaskListId: Id;
  position: Position;

  dayOfMonth: number;
  month: number;
  weekDays: number[];

  updateDueDate: boolean;
  dueDateOffset: number;
  dueDateOffsetPeriod: PeriodType;
};

export type RecurrencyData = {
  recurrableTaskIds: Id[];
  updatedRecurrenceSettings: TaskRecurrenceSettingsDbRow[];
};

export type TasksWithRecurrencyDependencies = {
  newTasks: TaskDbRow[];
  taskRecurrencyDependencies: TaskRecurrenceDependencyDbRow[];
};

export interface CopyCardOptionsInteface {
  withAttachments: boolean;
}

export interface ProjectTasksQueryParams extends ResourceQueryParams {
  organizationId?: Id;
  fetchArchived: boolean;
}

export type TaskRelatedDataPromise =
  | QueryBuilder<unknown, number[] | AddTaskPeopleResult>
  | Promise<AddTaskPeopleResult>;

export enum GetTaskTimeEstimatesStatus {
  OK,
  TASK_TIME_ESTIMATE_NOT_FOUND,
}
export interface GetTaskTimeEstimatesResult {
  status: GetTaskTimeEstimatesStatus;
  result?: TaskTimeEstimateDbRow;
}

export enum CreateTaskTimeEstimatesStatus {
  OK,
  TASK_TIME_ESTIMATE_ALREADY_EXISTS,
}
export interface CreateTaskTimeEstimatesResult {
  status: CreateTaskTimeEstimatesStatus;
  result?: TaskTimeEstimateDbRow;
}

export enum UpdateTaskTimeEstimatesStatus {
  OK,
}
export interface UpdateTaskTimeEstimatesResult {
  status: UpdateTaskTimeEstimatesStatus;
  result?: TaskTimeEstimateDbRow;
}

export enum DeleteTaskTimeEstimatesStatus {
  OK,
}
export interface DeleteTaskTimeEstimatesResult {
  status: DeleteTaskTimeEstimatesStatus;
}

export type TaskWithEstimate = Pick<TaskDbRow, 'id' | 'startDate' | 'dueDate' | 'projectId' | 'name'> &
  Pick<TaskTimeEstimateDbRow, 'minutes' | 'skipWeekends' | 'sumPeriod'> &
  Pick<UserInTaskDbRow, 'userId'> & {
    hasAccess?: boolean;
  };

export enum GetOrganizationTasksScheduleStatus {
  OK,
}

export interface GetOrganizationTasksScheduleResult {
  status: GetOrganizationTasksScheduleStatus;
  result?: TaskWithEstimate[];
}

export enum TaskPriorityType {
  urgent = 'Urgent',
  high = 'High',
  normal = 'Normal',
  low = 'Low',
}
