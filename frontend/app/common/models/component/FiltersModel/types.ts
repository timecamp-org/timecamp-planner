import { ImmutableMap } from 'common/types';
import { Id } from 'common/utils/identifier';
import { List, Map } from 'immutable';
import {
  DueDateFilterKey,
  TaskStatusFilterType,
} from 'models/domain/TasksModel/types';
import { TypedRecord } from 'typed-immutable-record';

export enum TaskFiltersContainerType {
  OVERWATCH_SPACE_TILE = 'overwatchSpaceTile',
  PROJECT = 'project',
  CONVERSATION = 'conversation',
  MY_TASKS = 'myTasks',
  SCHEDULE = 'schedule',
}
export enum TaskFiltersTargetType {
  KANBAN = 'kanban',
  KANBAN_VERTICAL = 'kanbanVertical',
  CALENDAR = 'calendar',
  TIMELINE = 'timeline',
  TASK_LIST = 'taskList',
  FILES = 'files',
  SCHEDULE = 'schedule',
}

export enum FilterType {
  FILTER_BY_FIELD = 'filterByField',
  SORT_BY_FIELD = 'sortByField',
  GROUP_BY_FIELD = 'groupByField',
}

export type ListFilterByType = Map<string, List<Id>>;
export type StringFilterByType = Map<string, string>;
export type NumberFilterByType = Map<string, number>;

export type FilterByType =
  | ListFilterByType
  | StringFilterByType
  | NumberFilterByType;

export interface FiltersInterface {
  id: Id;
  groupByField?: string;
  sortByField?: Map<string, string>;
  filterByField?: FilterByType;
}

export interface FilterRecordInterface
  extends TypedRecord<FilterRecordInterface>,
    FiltersInterface {}

export interface FiltersState extends ImmutableMap<Id, FilterRecordInterface> {}

export interface TaskFiltersPayloadInterface {
  status: TaskStatusFilterType;
  dueDate: DueDateFilterKey[];
  assignee: Id[];
  tagIds: Id[];
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export const EMPTY_FILTER_OPTION = 'none';
