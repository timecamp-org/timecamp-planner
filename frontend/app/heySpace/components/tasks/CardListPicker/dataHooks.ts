import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { List } from 'immutable';
import {
  selectListIdByTaskId,
  selectListsData,
  selectProjectNotArchivedListIdsInOrder,
} from 'models/domain/ListsModel/selectors';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';
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
  listId: Id;
  projectId: Id;
  listIds: List<Id>;
  projectColor: string;
  isGetProjectViewDataSuccess: boolean;
  isGetProjectViewDataRepeatable: boolean;
  listsData: { id: Id; name: string }[];
};

export function useDataProvider(taskId: Id): DataProviderHook {
  const projectId = useSelector((state) => selectProjectIdByTaskId(state, { taskId }));
  const listId = useSelector((state) => selectListIdByTaskId(state, { taskId }));
  const projectDataRequestType = getRequestTypeWithParams(getProjectViewData, { fetchArchived: false });
  const listIds = useSelector((state) =>
    selectProjectNotArchivedListIdsInOrder(state, { projectId }).filter((taskListId) => taskListId !== listId)
  ) as List<Id>;
  const listIdsArray = listIds.toArray();

  const listsData = useSelector((state) => selectListsData(state, { listIdsArray }));

  return {
    listId,
    projectId,
    listIds,
    projectColor: useSelector((state) => selectProjectColor(state, { projectId })),
    isGetProjectViewDataSuccess: useSelector((state) =>
      selectRequestIsSuccess(state, { requestType: projectDataRequestType, objectId: projectId })
    ),
    isGetProjectViewDataRepeatable: useSelector((state) =>
      selectProjectViewRequestIsRepeatable(state, { projectId, forceFetchArchived: false })
    ),
    listsData,
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
