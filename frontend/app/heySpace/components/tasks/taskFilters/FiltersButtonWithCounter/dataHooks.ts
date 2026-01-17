import { Id } from 'common/utils/identifier';
import {
  FilterByType,
  TaskFiltersContainerType,
} from 'models/component/FiltersModel/types';

import { FiltersButtonWithCounterInterface } from '.';

export type DataProviderHookInterface = {
  filtersCount: number;
  filterBy: FilterByType;
  filterId: Id;
  color?: string;
};
export type DataHooksInterface = {
  useDataProvider: (
    props: FiltersButtonWithCounterInterface
  ) => DataProviderHookInterface;
};

export type DataProvideHookType = (
  props: FiltersButtonWithCounterInterface
) => DataProviderHookInterface;

export const useDataHooksFactory = (
  containerType: TaskFiltersContainerType
): DataHooksInterface => {
  switch (containerType) {
    case TaskFiltersContainerType.PROJECT:
    case TaskFiltersContainerType.CONVERSATION: {
      const { useDataProvider } = require('./projectTasksDataHooks');

      return {
        useDataProvider,
      };
    }

    case TaskFiltersContainerType.OVERWATCH_SPACE_TILE: {
      const { useDataProvider } = require('./overwatchTileDataHooks');

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

    case TaskFiltersContainerType.SCHEDULE: {
      const { useScheduleDataProvider } = require('./scheduleTaskDataHooks');

      return {
        useDataProvider: useScheduleDataProvider,
      };
    }

    default: {
      throw new Error(
        `Not implemented containerType: ${containerType} used in FiltersButtonWithCounter`
      );
    }
  }
};
