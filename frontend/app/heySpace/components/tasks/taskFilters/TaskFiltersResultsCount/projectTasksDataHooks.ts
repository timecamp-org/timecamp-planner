import { useSelector } from 'common/hooks/useSelector';
import { getProjectViewData } from 'models/domain/RequestModel/constants/requestTypes';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors';
import { selectFilteredTaskIdsCountPreview } from 'models/domain/TasksModel/selectors';
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';
import { TaskFiltersResultsCountInterface } from '.';
import { DataProviderHookInterface } from './dataHooks';

export function useDataProvider(
  props: TaskFiltersResultsCountInterface
): DataProviderHookInterface {
  let resultsCount;
  const [filterKey, filterValue] = props.filterPath;
  const fetchArchived =
    filterKey === 'status' && filterValue === TaskStatusFilterType.ARCHIVED;
  const requestParams = {
    fetchArchived,
  };
  const isFetchArchivedProjectViewDataRequestSuccess = useSelector((state) =>
    selectRequestIsSuccess(state, {
      requestType: getRequestTypeWithParams(getProjectViewData, requestParams),
      objectId: props.containerId,
    })
  );
  resultsCount = useSelector((state) =>
    selectFilteredTaskIdsCountPreview(state, {
      filterId: props.filterId,
      projectId: props.containerId,
      filterPath: props.filterPath,
    })
  );

  if (fetchArchived && !isFetchArchivedProjectViewDataRequestSuccess) {
    resultsCount = null;
  }

  return {
    resultsCount,
  };
}
