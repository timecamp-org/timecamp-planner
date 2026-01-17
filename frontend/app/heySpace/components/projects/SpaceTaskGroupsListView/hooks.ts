import { useSelector } from 'react-redux';

import { getProjectViewData } from 'common/models/domain/RequestModel/constants/requestTypes';
import { selectFilterByProperty } from 'models/component/FiltersModel/selectors';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors';
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

export const useFilterId = (projectId) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const filterId = makeFilterId(currentUserId, TaskFiltersTargetType.TASK_LIST, projectId);

  return filterId;
};

export function useIsLoading(filterId: string, projectId: string) {
  const fetchArchived =
    useSelector((state) => selectFilterByProperty(state, { filterId, property: 'status' })) ===
    TaskStatusFilterType.ARCHIVED;
  const projectDataRequestType = getRequestTypeWithParams(getProjectViewData, {
    fetchArchived,
  });

  const isLoading = useSelector((state) =>
    selectRequestIsLoading(state, {
      requestType: projectDataRequestType,
      objectId: projectId,
    })
  );

  return isLoading;
}
