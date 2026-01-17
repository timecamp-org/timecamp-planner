import { List, Map } from 'immutable';
import { FilterByType } from 'models/component/FiltersModel/types';
import { TimelineItemBase } from 'react-calendar-timeline';
import { ImmutableMap } from '../../../types';
import { Id } from '../../../utils/identifier';

export interface TaskInterface {
  id: Id;
  projectId?: Id;
  taskListId?: Id;
  creatorId?: Id;
  name: string;
  order: number;
  description?: string;
  isArchived: boolean;
  status: TaskStatus;
  progress?: number;
  dueDate?: number;
  startDate?: number;
  sourceMessageId?: Id;
  taskPriorityType?: TaskPriorityTypes;
}

export type TasksData = Map<Id, TaskInterface>;
export type ProjectIdsByTaskIds = Map<Id, Id>;

export enum TaskStatus {
  COMPLETED = 'complete',
  ACTIVE = 'incomplete',
}

export enum TaskPeopleRole {
  OWNER = 'owner',
  COLLABORATOR = 'collaborator',
  ASSIGNEE = 'assignee',
}

export enum TaskStatusFilterType {
  ALL = 'all',
  COMPLETED = 'complete',
  ACTIVE = 'incomplete',
  ARCHIVED = 'archived',
}

export interface TaskFilterPayload {
  taskIds: List<Id>;
  taskStatuses: Map<Id, TaskStatus>;
  taskDueDates: Map<Id, number>;
  taskProgressEstimates: Map<Id, number>;
  taskIsArchivedStatuses: Map<Id, boolean>;
  filterBy: FilterByType;
  defaultFilterBy: FilterByType;
  tagsByObjectId: Map<Id, List<Id>>;
  projectIdsByTaskIds: Map<Id, Id>;
  taskPeopleRole: Map<Id, Map<Id, TaskPeopleRole>>;
  weekStartsOn: number;
  listIsArchivedStatuses: Map<Id, boolean>;
  listIdByTaskId: Map<Id, Id>;
}

export type TaskFilterKey = 'assigneeId' | 'projects' | 'dueDate' | 'tags';

export enum TaskSortKey {
  NAME = 'name',
  PROGRESS = 'progress',
  DATE = 'date',
  SPACE = 'space',
  LIST = 'list',
  PRIORITY = 'priority',
}

export type DueDateFilterKey =
  | 'today'
  | 'tomorrow'
  | 'next-week'
  | 'this-week'
  | 'this-month'
  | 'next-month'
  | 'overdue'
  | 'none';

export interface TaskFilterForPathPayload extends TaskFilterPayload {
  filterPath: [TaskFilterKey, string];
}

export interface TasksState extends ImmutableMap<string, any> {
  tasksData: Map<Id, TaskInterface>;
  taskDescriptions: Map<Id, string>;
  taskReactions: Map<Id, List<Id>>;
  taskPeopleIds: Map<Id, List<Id>>;
  taskPeopleRole: Map<Id, Map<Id, TaskPeopleRole>>;
  taskTagIds: Map<Id, List<Id>>;
  taskFollowerIds: Map<Id, List<Id>>;
  taskLatestVisit: Map<Id, number>;
  taskAttachmentsIds: Map<Id, List<Id>>;
  taskIdByMessageId: Map<Id, Id>;
  isTaskDescriptionDirty: boolean;
  projectIdsByTaskIds: Map<Id, Id>;
  taskFileIds: Map<Id, List<Id>>;
  isWaitingToUpdateProgress: boolean;
}

export interface TaskPropsChhangesInterface extends TaskInterface {
  taskAssigneeIds: Id[];
  taskFollowerIds: Id[];
}

export interface TaskChangedDataInterface {
  taskData: TaskInterface;
  order: number;
  description?: string;
  projectId: Id;
  taskListId: Id;
  sourceMessageId: Id;
  taskAssigneeIds: Id[];
  taskFollowerIds: Id[];
}

export type TasksFromMessagesData = {
  [mapName: string]: Map<Id, Id>;
};

export interface CopyCardOptionsInterface {
  withAttachments: boolean;
}

export interface TasksRelatedData {
  taskIds: List<Id>;
  tasksOrderByList: Map<Id, Map<Id, number>>;
  taskStatuses: Map<Id, TaskStatus>;
  taskDueDates: Map<Id, number>;
  taskProgressEstimates: Map<Id, number>;
  taskIsArchivedStatuses: Map<Id, boolean>;
  taskPeopleRole: Map<Id, Map<Id, TaskPeopleRole>>;
  taskNames: Map<Id, string>;
  taskProjectNames: Map<Id, string>;
  taskListNames: Map<Id, string>;
  taskPriorities: Map<Id, TaskPriorityTypes>;
}

export enum TaskEditSource {
  OVERWATCH = 'overwatch',
  SPACE_TIMELINE = 'spaceTimeline',
  MY_TASKS = 'myTasks',
  SCHEDULE = 'schedule',
}

export enum TaskCreateSource {
  CHAT = 'from-chat',
  KANBAN = 'kanban',
  SPACE_TASK_LIST = 'space-task-list',
  SPACE_TIMELINE = 'space-timeline',
  MY_TASKS = 'my-tasks',
  CALENDAR = 'calendar',
  SCHEDULE = 'schedule',
}

export interface TaskTimelineItem extends TimelineItemBase<number> {
  taskId: Id;
}

export enum TaskPriorityTypes {
  low = 'low',
  normal = 'normal',
  high = 'high',
  urgent = 'urgent',
}

export interface TaskListData extends TaskInterface {
  list: Id;
  assignees: Id[];
}

export type TaskGroupBy =
  | 'none'
  | keyof Pick<TaskListData, 'dueDate' | 'taskPriorityType' | 'assignees' | 'list' | 'taskPriorityType'>;

export type GroupedTasksType = { groupId: 'empty' | string; taskIds: string[] }[];

export type DueDateGroupsKeys = string | 'overdue' | 'future' | 'thisMonth' | 'nextMonth' | 'empty';
