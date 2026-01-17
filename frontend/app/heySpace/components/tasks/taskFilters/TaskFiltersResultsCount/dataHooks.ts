import {
  TaskFiltersContainerType,
  TaskFiltersTargetType,
} from 'models/component/FiltersModel/types';

import { TaskFiltersResultsCountInterface } from '.';

export type DataProviderHookInterface = {
  resultsCount: number;
};

export type DataHooksInterface = {
  useDataProvider: (
    props: TaskFiltersResultsCountInterface
  ) => DataProviderHookInterface;
};

export const useDataHooksFactory = (
  containerType: TaskFiltersContainerType,
  targetType: TaskFiltersTargetType
): DataHooksInterface => {
  switch (targetType) {
    case TaskFiltersTargetType.TIMELINE: {
      switch (containerType) {
        case TaskFiltersContainerType.MY_TASKS: {
          const { useDataProvider } = require('./myTasksDataHooks');

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
        case TaskFiltersContainerType.PROJECT: {
          const { useDataProvider } = require('./projectTasksDataHooks');

          return {
            useDataProvider,
          };
        }
        case TaskFiltersContainerType.SCHEDULE: {
          const { useDataProvider } = require('./scheduleDataHooks');

          return {
            useDataProvider,
          };
        }
        default: {
          const { useDataProvider } = require('./overwatchTileDataHooks');

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
    case TaskFiltersTargetType.KANBAN: {
      const { useDataProvider } = require('./projectTasksDataHooks');

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

    case TaskFiltersTargetType.SCHEDULE: {
      const { useDataProvider } = require('./scheduleDataHooks');

      return {
        useDataProvider,
      };
    }

    default: {
      throw new Error(
        `Not implemented containerType: ${targetType} used in TaskFiltersResultsCount`
      );
    }
  }
};
