import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { List } from 'immutable';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';
import { selectSortedAndFilteredAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector';
import * as ProjectModelActions from 'models/domain/RequestModel/actions';
import { getProjectViewData } from 'models/domain/RequestModel/constants/requestTypes';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors';
import { selectProjectViewRequestIsRepeatable } from 'models/domain/RequestModel/selectors/projectViewRequest';
import * as TaskModelActions from 'models/domain/TasksModel/actions';
import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export type DataProviderHook = {
  projectId: Id;
  spaceIds: List<Id>;
  projectColor: string;
  isGetProjectViewDataSuccess: boolean;
  isGetProjectViewDataRepeatable: boolean;
};

export function useDataProvider(taskId: Id, searchFilter: string): DataProviderHook {
  const projectId = useSelector((state) => selectProjectIdByTaskId(state, { taskId }));
  const projectDataRequestType = getRequestTypeWithParams(getProjectViewData, { fetchArchived: false });
  return {
    projectId,
    spaceIds: useSelector((state) =>
      selectSortedAndFilteredAvailableVisibleSpacesIds(state, { searchFilter }).filter(
        (spaceId) => spaceId !== projectId
      )
    ) as List<Id>,
    projectColor: useSelector((state) => selectProjectColor(state, { projectId })),
    isGetProjectViewDataSuccess: useSelector((state) =>
      selectRequestIsSuccess(state, { requestType: projectDataRequestType, objectId: projectId })
    ),
    isGetProjectViewDataRepeatable: useSelector((state) =>
      selectProjectViewRequestIsRepeatable(state, { projectId, forceFetchArchived: false })
    ),
  };
}

export type DataPersisterHook = {
  onMoveTask: (
    sourceTaskId: Id,
    destinationTaskId: Id,
    destinationSectionId: Id,
    projectId: Id,
    destinationProjectId: Id,
    moveBelowDestination?: boolean
  ) => void;
  onFetchProjectViewData: (projectId: Id) => void;
};

export function useDataPersister(): DataPersisterHook {
  const dispatch = useDispatch();

  return {
    onMoveTask: useCallback(
      (
        sourceTaskId: Id,
        destinationTaskId: Id,
        destinationSectionId: Id,
        projectId: Id,
        destinationProjectId: Id,
        moveBelowDestination: boolean = true
      ) =>
        dispatch(
          TaskModelActions.onMoveTask(
            sourceTaskId,
            destinationTaskId,
            destinationSectionId,
            projectId,
            destinationProjectId,
            moveBelowDestination
          )
        ),
      [dispatch]
    ),
    onFetchProjectViewData: useCallback(
      (projectId) => dispatch(ProjectModelActions.onFetchProjectViewData(projectId)),
      [dispatch]
    ),
  };
}
