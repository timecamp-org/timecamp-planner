import { useState } from 'react';

import { List } from 'immutable';

import { Id } from 'common/utils/identifier';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import {
  scheduleTaskStatusOptions,
  TaskDueDateFilterInterface,
  taskDueDateOptions as taskDueDateOptionsStatic,
  TaskStatusFilterInterface,
  taskStatusOptions as taskStatusOptionsStatic,
} from 'models/domain/TasksModel/constants/tasksFilters';
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';

import { useDataHooksFactory, useDataPersister } from './dataHooks';

import { TaskFiltersInterface } from '.';

const MAX_VISIBLE_DUE_DATE_ITEMS_COUNT = 5;

const taskDueDateOptionsList = List(taskDueDateOptionsStatic);
const taskStatusOptionsList = List(taskStatusOptionsStatic);
const visibleDueDateOptions = taskDueDateOptionsList.slice(
  0,
  MAX_VISIBLE_DUE_DATE_ITEMS_COUNT
) as List<TaskDueDateFilterInterface>;

export interface TaskFiltersHookInterface {
  taskStatusOptions: List<TaskStatusFilterInterface>;
  taskDueDateOptions: List<TaskDueDateFilterInterface>;
  taskDueDatesHiddenCount: number;
  isDueDatesExpanded: boolean;

  tasksAssignees: List<Id>;
  tasksAssigneesHiddenCount: number;
  isAssigneesExpanded: boolean;

  tasksProjectIds: List<Id>;
  hiddenTasksProjectIdsCount: number;
  isProjectsExpanded: boolean;

  tasksTagIds: List<Id>;
  tasksTagIdsHiddenCount: number;
  isTagsExpanded: boolean;

  taskStatusFilter: TaskStatusFilterType;
  taskAssigneeFilter: List<Id>;
  taskTagsFilter: List<Id>;
  taskProjectsFilter: List<Id>;
  taskDueDateFilter: List<string>;
  filtersCount: number;
  color: string;
  isClearFiltersVisible: boolean;
  filterId: Id;

  taskAssigneeGroupFilter?: List<Id>;
  tasksAssigneeGroups?: List<Id>;
  visibleTasksAssigneesGroups?: List<Id>;
  hiddenTasksAssigneeGroupsCount?: number;
  isTasksAssigneeGroupExpanded?: boolean;

  onSelectStatusFilter: (filter: string) => void;
  onCheckAssignee: (userId: Id, isChecked: boolean) => void;
  onCheckUserGroup: (userGroupId: Id, isChecked: boolean) => void;
  onCheckTag: (tagId: Id, isChecked: boolean) => void;
  onCheckDueDate: (option: string, isChecked: boolean) => void;
  onCheckProject: (projectId: Id, isChecked: boolean) => void;
  onSetIsTagsExpanded: (isExpanded: boolean) => void;
  onSetIsAssigneesExpanded: (isExpanded: boolean) => void;
  onSetIsDueDatesExpanded: (isExpanded: boolean) => void;
  onSetIsProjectsExpanded: (isExpanded: boolean) => void;
  onSetIsTasksAssigneeGroupsExpanded: (isExpanded: boolean) => void;
  onClearFilters: VoidFunction;
}

export default function useComponent(props: TaskFiltersInterface): TaskFiltersHookInterface {
  const { useDataProvider } = useDataHooksFactory(props.containerType, props.targetType);
  const [isDueDatesExpanded, onSetIsDueDatesExpanded] = useState(false);
  const [isTagsExpanded, onSetIsTagsExpanded] = useState(false);
  const [isAssigneesExpanded, onSetIsAssigneesExpanded] = useState(false);
  const [isProjectsExpanded, onSetIsProjectsExpanded] = useState(false);
  const [isTasksAssigneeGroupExpanded, onSetIsTasksAssigneeGroupsExpanded] = useState(false);
  const {
    tasksAssignees,
    visibleTaskAssignees,
    hiddenTaskAssigneesCount,
    visibleTaskTags,
    hiddenTaskTagsCount,
    taskStatusFilter,
    taskAssigneeFilter,
    taskAssigneeGroupFilter,
    taskTagsFilter,
    taskDueDateFilter,
    filtersCount,
    taskProjectsFilter,
    hiddenTasksProjectIdsCount,
    visibleTasksProjectIds,
    visibleTasksAssigneeGroups,
    hiddenTasksAssigneeGroupsCount,
    color,
    filterId,
    ...dataProvider
  } = useDataProvider(props, props.targetType);

  const { onSetFilterBy, ...dataPersister } = useDataPersister();

  const taskDueDateOptions = isDueDatesExpanded ? taskDueDateOptionsList : visibleDueDateOptions;
  const taskDueDatesHiddenCount = taskDueDateOptionsList.size - visibleDueDateOptions.size;

  const taskAssigneeIds = isAssigneesExpanded ? tasksAssignees : visibleTaskAssignees;

  const tasksTagIds = isTagsExpanded ? dataProvider.tasksTagIds : visibleTaskTags;
  const tasksProjectIds = isProjectsExpanded ? dataProvider.tasksProjectIds : visibleTasksProjectIds;

  const tasksAssigneeGroups = isTasksAssigneeGroupExpanded
    ? dataProvider.tasksAssigneeGroups
    : visibleTasksAssigneeGroups;

  const onSelectStatusFilter = (status: TaskStatusFilterType) => {
    onSetFilterBy(filterId, 'status', status);
  };

  const onCheckAssignee = (userId: Id, isChecked: boolean) => {
    let newTaskAssigneeFilter;
    if (isChecked) {
      const index = taskAssigneeFilter.indexOf(userId);
      newTaskAssigneeFilter = taskAssigneeFilter.delete(index);
    } else {
      newTaskAssigneeFilter = taskAssigneeFilter.push(userId);
    }
    onSetFilterBy(filterId, 'assigneeId', newTaskAssigneeFilter);
  };

  const onCheckUserGroup = (userGroupId: Id, isChecked: boolean) => {
    let newTaskAssigneeGroupFilter;
    if (isChecked) {
      const index = taskAssigneeGroupFilter.indexOf(userGroupId);
      newTaskAssigneeGroupFilter = taskAssigneeGroupFilter.delete(index);
    } else {
      newTaskAssigneeGroupFilter = taskAssigneeGroupFilter.push(userGroupId);
    }
    onSetFilterBy(filterId, 'userGroup', newTaskAssigneeGroupFilter);
  };

  const onCheckTag = (tagId: Id, isChecked: boolean) => {
    let newTaskTagsFilter;
    if (isChecked) {
      const index = taskTagsFilter.indexOf(tagId);
      newTaskTagsFilter = taskTagsFilter.delete(index);
    } else {
      newTaskTagsFilter = taskTagsFilter.push(tagId);
    }
    onSetFilterBy(filterId, 'tags', newTaskTagsFilter);
  };

  const onCheckProject = (projectId: Id, isChecked: boolean) => {
    let newTaskProjectsFilter;
    if (isChecked) {
      const index = taskProjectsFilter.indexOf(projectId);
      newTaskProjectsFilter = taskProjectsFilter.delete(index);
    } else {
      newTaskProjectsFilter = taskProjectsFilter.push(projectId);
    }
    onSetFilterBy(filterId, 'projects', newTaskProjectsFilter);
  };

  const onCheckDueDate = (dueDateOption: string, isChecked: boolean) => {
    let newTaskDueDateFilter;
    if (isChecked) {
      const index = taskDueDateFilter.indexOf(dueDateOption);
      newTaskDueDateFilter = taskDueDateFilter.delete(index);
    } else {
      newTaskDueDateFilter = taskDueDateFilter.push(dueDateOption);
    }
    onSetFilterBy(filterId, 'dueDate', newTaskDueDateFilter);
  };

  const onClearFilters = () => {
    dataPersister.onClearFilters(filterId);
    props.onCloseFilters();
  };

  const taskStatusOptions =
    props.containerType === TaskFiltersContainerType.SCHEDULE ? List(scheduleTaskStatusOptions) : taskStatusOptionsList;

  return {
    taskStatusOptions,
    taskDueDateOptions,
    taskDueDatesHiddenCount,
    isDueDatesExpanded,

    tasksAssignees: taskAssigneeIds,
    tasksAssigneesHiddenCount: hiddenTaskAssigneesCount,
    isAssigneesExpanded,

    tasksAssigneeGroups,
    hiddenTasksAssigneeGroupsCount,
    isTasksAssigneeGroupExpanded,

    tasksTagIds,
    tasksTagIdsHiddenCount: hiddenTaskTagsCount,
    isTagsExpanded,

    tasksProjectIds,
    hiddenTasksProjectIdsCount,
    isProjectsExpanded,

    taskStatusFilter: taskStatusFilter || TaskStatusFilterType.ALL,
    taskAssigneeFilter,
    taskAssigneeGroupFilter,
    taskTagsFilter,
    taskProjectsFilter,
    taskDueDateFilter,
    filtersCount,
    color,
    isClearFiltersVisible: getIsClearFiltersVisible(filtersCount, taskStatusFilter),
    filterId,

    onClearFilters,
    onSelectStatusFilter,
    onCheckAssignee,
    onCheckTag,
    onCheckDueDate,
    onCheckProject,
    onSetIsAssigneesExpanded,
    onSetIsTagsExpanded,
    onSetIsDueDatesExpanded,
    onSetIsProjectsExpanded,
    onSetIsTasksAssigneeGroupsExpanded,
    onCheckUserGroup,
  };
}

function getIsClearFiltersVisible(filtersCount: number, taskStatusFilter: TaskStatusFilterType): boolean {
  if (filtersCount === 1 && taskStatusFilter === TaskStatusFilterType.ALL) {
    return false;
  }
  return filtersCount > 0;
}
