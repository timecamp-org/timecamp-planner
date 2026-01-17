import { useCallback } from 'react';

import { List } from 'immutable';
import { useDispatch } from 'react-redux';

import { Id } from 'common/utils/identifier';
import * as FiltersModelActions from 'models/component/FiltersModel/actions';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';

import { TaskFiltersInterface } from '.';

export type DataProviderHookInterface = {
  color?: string;

  tasksAssignees: List<Id>;
  visibleTaskAssignees: List<Id>;
  hiddenTaskAssigneesCount: number;

  tasksTagIds: List<Id>;
  visibleTaskTags: List<Id>;
  hiddenTaskTagsCount: number;

  tasksProjectIds: List<Id>;
  visibleTasksProjectIds: List<Id>;
  hiddenTasksProjectIdsCount: number;

  tasksAssigneeGroups?: List<Id>;
  visibleTasksAssigneeGroups?: List<Id>;
  hiddenTasksAssigneeGroupsCount?: number;

  taskStatusFilter: TaskStatusFilterType;
  taskAssigneeFilter: List<Id>;
  taskTagsFilter: List<Id>;
  taskProjectsFilter: List<Id>;
  taskDueDateFilter: List<string>;
  taskAssigneeGroupFilter?: List<Id>;

  filtersCount: number;
  filterId: Id;
};

export type DataPersisterHookInterface = {
  onSetFilterBy: (filterId: Id, filterKey: string, filterValue: string | number | boolean) => void;
  onClearFilters: (filterId: Id) => void;
};

export type DataHooksInterface = {
  useDataProvider: (props: TaskFiltersInterface, targetType?: TaskFiltersTargetType) => DataProviderHookInterface;
};

export const useDataHooksFactory = (
  containerType: TaskFiltersContainerType,
  targetType: TaskFiltersTargetType
): DataHooksInterface => {
  switch (targetType) {
    case TaskFiltersTargetType.TIMELINE: {
      switch (containerType) {
        case TaskFiltersContainerType.OVERWATCH_SPACE_TILE: {
          const { useDataProvider } = require('./overwatchTimelineDataHooks');

          return {
            useDataProvider,
          };
        }
        case TaskFiltersContainerType.CONVERSATION: {
          const { useDataProvider } = require('./conversationTasksDataHooks');

          return {
            useDataProvider,
          };
        }
        case TaskFiltersContainerType.MY_TASKS: {
          const { useDataProvider } = require('./myTasksDataHooks');

          return {
            useDataProvider,
          };
        }
        default: {
          const { useDataProvider } = require('./spaceTimelineDataHooks');

          return {
            useDataProvider,
          };
        }
      }
    }
    case TaskFiltersTargetType.KANBAN: {
      switch (containerType) {
        case TaskFiltersContainerType.OVERWATCH_SPACE_TILE: {
          const { useDataProvider } = require('./overwatchKanbanDataHooks');

          return {
            useDataProvider,
          };
        }
        default: {
          const { useDataProvider } = require('./projectTasksDataHooks');

          return {
            useDataProvider,
          };
        }
      }
    }
    case TaskFiltersTargetType.KANBAN_VERTICAL:
    case TaskFiltersTargetType.CALENDAR: {
      switch (containerType) {
        case TaskFiltersContainerType.CONVERSATION: {
          const { useDataProvider } = require('./conversationTasksDataHooks');

          return {
            useDataProvider,
          };
        }
        case TaskFiltersContainerType.MY_TASKS: {
          const { useDataProvider } = require('./myTasksDataHooks');

          return {
            useDataProvider,
          };
        }
        default: {
          const { useDataProvider } = require('./projectTasksDataHooks');

          return {
            useDataProvider,
          };
        }
      }
    }

    case TaskFiltersTargetType.SCHEDULE: {
      const { useDataProvider } = require('./scheduleDataHooks');

      return {
        useDataProvider,
      };
    }

    case TaskFiltersTargetType.TASK_LIST: {
      switch (containerType) {
        case TaskFiltersContainerType.CONVERSATION: {
          const { useDataProvider } = require('./conversationTasksDataHooks');

          return {
            useDataProvider,
          };
        }
        case TaskFiltersContainerType.MY_TASKS: {
          const { useDataProvider } = require('./myTasksDataHooks');

          return {
            useDataProvider,
          };
        }
        default: {
          const { useDataProvider } = require('./projectTasksDataHooks');

          return {
            useDataProvider,
          };
        }
      }
    }

    default: {
      throw new Error(`Not implemented containerType: ${targetType} used in TaskFilters`);
    }
  }
};
export function useDataPersister(): DataPersisterHookInterface {
  const dispatch = useDispatch();

  return {
    onSetFilterBy: useCallback(
      (filterId: Id, filterKey: string, filterValue: string | number | boolean) =>
        dispatch(FiltersModelActions.onSetFilterBy(filterId, filterKey, filterValue)),
      [dispatch]
    ),
    onClearFilters: useCallback((filterId: Id) => dispatch(FiltersModelActions.onClearFilters(filterId)), [dispatch]),
  };
}
