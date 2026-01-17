import { action } from 'typesafe-actions';
import { AnyDict, PayloadAction } from '../../../types';
import { Id } from '../../../utils/identifier';
import { EntityType } from '../EntityModel/types';
import * as C from './constants';
import createRequestId from './createRequestId';
import {
  OnFetchProjectViewDataPayload,
  OnFetchSpaceOrConversationViewDataPayload,
} from './payloads';
import {
  ConversationViewDataQueryParams,
  LatestVisitedTasksInterface,
  NormalizedListsDataInterface,
  NormalizedTasksDataInterface,
  ParsedConversationViewDataInterface,
  ParsedProjectViewDataInterface,
  ProjectTasksQueryParams,
  RequestStatus,
} from './types';

export const onSetRequestStatus = (
  requestType: string,
  objectId: Id | Id[],
  status: RequestStatus,
  error?: Error,
  data?: AnyDict,
  showAlert?: boolean,
  isBatchDisabled?: boolean
) => {
  const id = createRequestId(requestType, objectId);
  return action(
    C.onSetRequestStatus,
    {
      id,
      requestType,
      status,
      error,
      data,
      showAlert,
    },
    { isBatchDisabled }
  );
};

export const onFetchProjectViewData = (
  projectId: Id,
  queryParams?: { fetchArchived?: boolean },
  purgeTasksOrder = false
): PayloadAction<OnFetchProjectViewDataPayload> =>
  action(C.onFetchProjectViewData, { projectId, queryParams, purgeTasksOrder });

export const onFetchProjectViewDataSuccess = (
  projectId: Id,
  data: ParsedProjectViewDataInterface
) => action(C.onFetchProjectViewDataSuccess, { projectId, data });

export const onFetchConversationViewData = (
  projectId: Id,
  conversationUserId: Id,
  queryParams: ConversationViewDataQueryParams
) =>
  action(C.onFetchConversationViewData, {
    projectId,
    conversationUserId,
    queryParams,
  });

export const onFetchConversationViewDataSuccess = (
  projectId: Id,
  data: ParsedConversationViewDataInterface
) => action(C.onFetchConversationViewDataSuccess, { projectId, data });

export const onFetchSpaceOrConversationViewData = (
  objectId: Id,
  filterId?: Id,
  force?: boolean,
  purgeTasksOrder = false
): PayloadAction<OnFetchSpaceOrConversationViewDataPayload> =>
  action(C.onFetchSpaceOrConversationViewData, {
    objectId,
    filterId,
    force,
    purgeTasksOrder,
  });

export const onFetchProjectListsData = (projectId: Id) =>
  action(C.onFetchProjectListsData, { projectId });

export const onFetchProjectListsDataSuccess = (
  projectId: Id,
  data: NormalizedListsDataInterface
) => action(C.onFetchProjectListsDataSuccess, { projectId, data });

export const onFetchProjectTasksData = (
  projectId: Id,
  queryParams?: ProjectTasksQueryParams
) => action(C.onFetchProjectTasksData, { projectId, queryParams });

export const onFetchProjectTasksDataSuccess = (
  projectId: Id,
  data: NormalizedTasksDataInterface
) => action(C.onFetchProjectTasksDataSuccess, { projectId, data });

export const onFetchProjectListsAndTasksData = (projectId: Id) =>
  action(C.onFetchProjectListsAndTasksData, { projectId });

export const onFetchListTasksData = (listId: Id) =>
  action(C.onFetchListTasksData, { listId });

export const onFetchListTasksDataSuccess = (
  data: NormalizedTasksDataInterface
) => action(C.onFetchListTasksDataSuccess, { data });

export const onFetchUserLatestVisitedTasks = (count: number) =>
  action(C.onFetchUserLatestVisitedTasks, { count });

export const onFetchUserLatestVisitedTasksSuccess = ({
  tasksData,
  projectIdsByTaskIds,
  listIdByTaskId,
  tasksOrderByListId,
  taskLatestVisit,
  projectIdsByListIds,
}: LatestVisitedTasksInterface) =>
  action(C.onFetchUserLatestVisitedTasksSuccess, {
    tasksData,
    projectIdsByTaskIds,
    listIdByTaskId,
    tasksOrderByListId,
    taskLatestVisit,
    projectIdsByListIds,
  });

export const onFetchContainerFilesIfDidNotFetchAlready = (
  containerId: Id,
  limit: number = 150
) =>
  action(C.onFetchContainerFilesIfDidNotFetchAlready, { containerId, limit });

export const onFetchContainerFiles = (containerId: Id, limit: number = 150) =>
  action(C.onFetchContainerFiles, { containerId, limit });

export const onFetchOrganizationTagsOverviewIfDidNotFetchAlready = (
  organizationId: Id
) =>
  action(C.onFetchOrganizationTagsOverviewIfDidNotFetchAlready, {
    organizationId,
  });

export const onFetchLatestActiveUserConversations = (count: number = 20) =>
  action(
    C.onFetchLatestActiveUserConversations,
    { count },
    { isBatchDisabled: true }
  );

export const onInitDelayedRequests = () =>
  action(C.onInitDelayedRequests, null, { isBatchDisabled: true });

export const onClearState = () => action(C.onClearState);

export const onFetchArchivedProjectsViewData = () =>
  action(C.onFetchArchivedProjectsViewData);

export const onSetDirtyRequests = () => action(C.onSetDirtyRequests);

export const onSetIsRequestDirty = (requestId: Id) =>
  action(C.onSetIsRequestDirty, { requestId });

export const onFetchExportedBoardCardsData = (projectId: Id) =>
  action(C.onFetchExportedBoardCardsData, { projectId });

export const onFetchUserInitialData = () => action(C.onFetchUserInitialData);

export const onSetContainerAccessLossTimestamp = (
  containerType: EntityType,
  containerId: Id,
  timestamp: number
) =>
  action(C.onSetContainerAccessLossTimestamp, {
    containerType,
    containerId,
    timestamp,
  });
