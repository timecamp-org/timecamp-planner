import { TaskStatusFilterType } from 'models/domain/TasksModel/types';

import { useDataHooksFactory } from './dataHooks';

import { FiltersButtonWithCounterInterface } from '.';

export interface FiltersButtonWithCounterHookInterface {
  numberOfActiveFilters: number;
  color?: string;
}

export default function useComponent(
  props: FiltersButtonWithCounterInterface
): FiltersButtonWithCounterHookInterface {
  const { useDataProvider } = useDataHooksFactory(props.containerType);
  const { filterBy, filtersCount, color } = useDataProvider(props);

  const numberOfActiveFilters =
    (filterBy && filterBy.get('status')) === TaskStatusFilterType.ALL
      ? filtersCount - 1
      : filtersCount;

  return {
    numberOfActiveFilters,
    color,
  };
}
