import { useSelector } from 'common/hooks/useSelector';
import { selectFilteredScheduleTasksCountPreview } from 'models/domain/ScheduleModel/selectors';
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';

import { DataProviderHookInterface } from './dataHooks';

import { TaskFiltersResultsCountInterface } from '.';

export function useDataProvider(props: TaskFiltersResultsCountInterface): DataProviderHookInterface {
  let resultsCount;
  const [filterKey, filterValue] = props.filterPath;

  const fetchArchived = filterKey === 'status' && filterValue === TaskStatusFilterType.ARCHIVED;

  resultsCount = useSelector((state) =>
    selectFilteredScheduleTasksCountPreview(state, {
      filterId: props.filterId,
      filterKey,
      filterValue,
    })
  );

  if (fetchArchived) {
    resultsCount = null;
  }

  return {
    resultsCount,
  };
}
