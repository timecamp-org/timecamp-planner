import { fromJS, List, Map } from 'immutable';
import { all, call, cps, delay, fork, put, select, spawn, takeEvery } from 'redux-saga/effects';
import handleError from '../../../../utils/handleError';
import waitFor from '../../../../utils/waitFor';
// @ts-ignore
import { getLocation, push } from 'connected-react-router/immutable';

import * as Actions from '../actions';
import * as Constants from '../constants';
import * as Selectors from '../selectors';

import { HeySpaceClient as client, localStorage, UserTracker } from '../../../../services';
import { selectProjectIdByListId, selectProjectListIdsInOrder } from '../../ListsModel/selectors';
import { selectProjectIdByObjectId, selectProjectIsDirectChat } from '../../ProjectsModel/selectors';
import { selectProjectPeople } from '../../ProjectsModel/selectors/domain';
import { selectCurrentUserId, selectCurrentUserOrganizationIds } from '../../UsersModel/selectors/domain';
import * as RequestTypesConstants from '../constants/requestTypes';
import {
  getRequestTypeWithParams,
  normalizeChecklistsItemsBasicDataFromAPI,
  normalizeListsDataFromAPI,
  normalizeTasksDataFromAPI,
} from '../helpers';

import isEmpty from 'lodash/isEmpty';
import { onBatchFilesData } from '../../FilesModel/actions';

import { TaskFiltersTargetType } from 'common/models/component/FiltersModel/types';
import get from 'lodash/get';
import { OnSetOpenedCardDetailsModalIdPayload } from 'models/domain/AppModel/payloads';
import { batchActions } from 'redux-batched-actions';
import { Dict, PartialPayloadAction, PayloadAction } from '../../../../types';
import { initialRequestDelay } from '../../../../utils/delays';
import { Id } from '../../../../utils/identifier';
import { saveCSVFile } from '../../../../utils/saveFile';
import * as FiltersModelSagas from '../../../component/FiltersModel/sagas';
import * as FiltersModelSelectors from '../../../component/FiltersModel/selectors';
import { makeFilterId } from '../../../component/FiltersModel/utils';
import { UserTrackerEvent } from '../../../component/UserTrackerEventModel/constants';
import * as ExtensionsModelActions from '../../../domain/ExtensionsModel/actions';
import { onFetchCustomFields } from '../../../domain/ExtensionsModel/actions';
import { TargetType } from '../../../domain/ExtensionsModel/types';
import { getCustomFieldsMap } from '../../../domain/ExtensionsModel/utils';
import * as AppModelConstants from '../../AppModel/constants';
import { ChecklistItemInterface } from '../../ChecklistsModel/types';
import * as EntityModelSelectors from '../../EntityModel/selectors';
import { EntityType } from '../../EntityModel/types';
import { FileInterface } from '../../FilesModel/types';
import * as ListsModelActions from '../../ListsModel/actions';
import * as MessagesActions from '../../MessagesModel/actions';
import {
  onCreateOrganizationData,
  onSetCurrentOrganizationId,
  onSetCurrentUserInOrganizationId,
} from '../../OrganizationsModel/actions';
import { selectCurrentOrganizationId } from '../../OrganizationsModel/selectors/domain';
import { onSetPageLastNext } from '../../PaginationModel/actions';
import { selectPageLastNext } from '../../PaginationModel/selectors';
import * as ProjectsModelActions from '../../ProjectsModel/actions';
import { onCreateProjectData } from '../../ProjectsModel/actions';
import { FIRST_PROJECT_NAME } from '../../ProjectsModel/constants';
import { ProjectPeopleRole } from '../../ProjectsModel/types';
import { onBatchTags } from '../../TagsModel/actions';
import { Tag } from '../../TagsModel/models';
import { TagInterface } from '../../TagsModel/types';
import * as TasksModelActions from '../../TasksModel/actions';
import { onFetchTaskDetails } from '../../TasksModel/sagas';
import * as TasksModelSelectors from '../../TasksModel/selectors';
import { TaskPeopleRole, TaskStatusFilterType } from '../../TasksModel/types';
import { onCreateUserOrganizations } from '../../UsersModel/actions';
import { parseConversationViewData, parseObjectPeople, parseProjectViewData } from '../dataParsers';
import { OnFetchProjectViewDataPayload, OnFetchSpaceOrConversationViewDataPayload } from '../payloads';
import { selectIsRequestRepeatable } from '../selectors';
import { selectProjectViewRequestIsRepeatable } from '../selectors/projectViewRequest';
import { RequestStatus } from '../types';
import { onFailedRequest, onLoadingRequest, onSuccessRequest } from './requestStatusSagas';

const emptyMap = Map();
const emptyList = List();

const MAX_LATEST_ACTIVE_CONVERSATIONS = 20;

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onSetRequestStatus, onSetRequestStatus);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchProjectViewData, onFetchProjectViewData);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchConversationViewData, onFetchConversationViewData);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchSpaceOrConversationViewData, onFetchSpaceOrConversationViewData);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchProjectListsData, onFetchProjectListsData);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchProjectTasksData, onFetchProjectTasksData);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchProjectListsAndTasksData, onFetchProjectListsAndTasksData);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchListTasksData, onFetchListTasksData);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchContainerFilesIfDidNotFetchAlready, onFetchContainerFilesIfDidNotFetchAlready);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(
        Constants.onFetchOrganizationTagsOverviewIfDidNotFetchAlready,
        onFetchOrganizationTagsOverviewIfDidNotFetchAlready,
      );
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchUserLatestVisitedTasks, onFetchUserLatestVisitedTasks);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchLatestActiveUserConversations, onFetchLatestActiveUserConversations);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onInitDelayedRequests, onInitDelayedRequests);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchArchivedProjectsViewData, onFetchArchivedProjectsViewData);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(AppModelConstants.onSetOpenedCardDetailsModalId, onSetOpenedCardDetailsModalId);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchExportedBoardCardsData, onFetchExportedBoardCardsData);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchUserInitialData, onFetchUserInitialData);
    });
  },
];

function* onSetRequestStatus({
  payload: { requestType, status, error, data, showAlert = true },
}: PartialPayloadAction) {
  if (!showAlert) {
    return null;
  }

  if (error) {
    return yield call(onFailedRequest, requestType, error, data);
  }

  if (status === RequestStatus.SUCCESS) {
    return yield call(onSuccessRequest, requestType, data);
  }

  if (status === RequestStatus.LOADING) {
    return yield call(onLoadingRequest, requestType, data);
  }
}

export function* onFetchProjectViewData({
  payload: { projectId, queryParams = { fetchArchived: false }, purgeTasksOrder },
}: PayloadAction<OnFetchProjectViewDataPayload>) {
  const requestType = getRequestTypeWithParams(RequestTypesConstants.getProjectViewData, queryParams);
  try {
    if (projectId === FIRST_PROJECT_NAME) {
      return;
    }

    yield put(Actions.onSetRequestStatus(requestType, projectId, RequestStatus.LOADING));

    const projectViewData = yield cps(client.restApiClient.getProjectViewData, projectId, queryParams);

    const actionsBatch = [];

    if (projectViewData) {
      const normalizedProjectViewData = parseProjectViewData(projectViewData);

      if (purgeTasksOrder) {
        const currentProjectListIds = yield select((state) => selectProjectListIdsInOrder(state, { projectId }));
        yield put(ListsModelActions.onPurgeTaskListsOrder(currentProjectListIds));
      }

      actionsBatch.push(Actions.onFetchProjectViewDataSuccess(projectId, normalizedProjectViewData));

      if (!isEmpty(projectViewData.tasksCustomFields)) {
        const customFields = getCustomFieldsMap(projectViewData.tasksCustomFields, TargetType.TASK);
        actionsBatch.push(ExtensionsModelActions.onBatchCustomFieldValues(customFields));
      }
    }
    yield put(batchActions(actionsBatch));
    yield put(Actions.onSetRequestStatus(requestType, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(Actions.onSetRequestStatus(requestType, projectId, RequestStatus.FAILURE, error));
  }
}

function* getConversationUserId(projectId: Id) {
  yield call(waitFor, (state) => {
    const projectPeople = selectProjectPeople(state, { projectId });
    return projectPeople && projectPeople.size;
  });
  const projectPeople = yield select(selectProjectPeople, { projectId });
  const currentUserId = yield select(selectCurrentUserId);
  return projectPeople.size === 1
    ? projectPeople.get(0)
    : projectPeople.filterNot((projectMemberId) => projectMemberId === currentUserId).first();
}

function* onFetchConversationViewData({
  payload: { projectId, conversationUserId, queryParams = { fetchArchived: false } },
}: PartialPayloadAction) {
  const requestType = getRequestTypeWithParams(RequestTypesConstants.getConversationViewData, queryParams);
  try {
    yield put(Actions.onSetRequestStatus(requestType, projectId, RequestStatus.LOADING));

    const currentOrganizationId = yield select(selectCurrentOrganizationId);

    const conversationViewData = yield cps(
      client.restApiClient.getConversationViewData,
      currentOrganizationId,
      conversationUserId,
      queryParams,
    );

    if (conversationViewData) {
      const normalizedConversationViewData = parseConversationViewData(conversationViewData);
      yield put(Actions.onFetchConversationViewDataSuccess(projectId, normalizedConversationViewData));
    }

    yield put(Actions.onSetRequestStatus(requestType, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(Actions.onSetRequestStatus(requestType, projectId, RequestStatus.FAILURE, error));
  }
}

function* onFetchSpaceOrConversationViewData({
  payload: { objectId, filterId, force, purgeTasksOrder },
}: PayloadAction<OnFetchSpaceOrConversationViewDataPayload>) {
  try {
    if (objectId === FIRST_PROJECT_NAME) {
      return;
    }
    const projectId = yield select(selectProjectIdByObjectId, { objectId });
    const isConversation = yield select(selectProjectIsDirectChat, {
      projectId,
    });

    let fetchArchived = false;
    if (filterId) {
      fetchArchived = yield call(getFetchArchivedFilterParam, filterId);
    }
    const queryParams = { fetchArchived };

    if (isConversation) {
      const requestType = getRequestTypeWithParams(RequestTypesConstants.getConversationViewData, queryParams);
      const isConversationViewRequestRepeatable = yield select(Selectors.selectIsRequestRepeatable, {
        requestType,
        objectId: projectId,
      });
      if (isConversationViewRequestRepeatable || force) {
        const conversationUserId = yield call(getConversationUserId, projectId);
        yield call(onFetchConversationViewData, {
          payload: { projectId, conversationUserId, queryParams },
        });
      }
    } else {
      const isCustomFieldsRequestRepeatable = yield select(selectIsRequestRepeatable, {
        requestType: RequestTypesConstants.getCustomFields,
        objectId: [TargetType.PROJECT, projectId],
      });

      if (isCustomFieldsRequestRepeatable) {
        yield put(onFetchCustomFields(TargetType.PROJECT, projectId));
      }

      const isProjectViewRequestRepeatable = yield select(selectProjectViewRequestIsRepeatable, {
        projectId,
        forceFetchArchived: fetchArchived,
      });

      if (isProjectViewRequestRepeatable || force) {
        // @ts-ignore
        yield call(onFetchProjectViewData, {
          payload: { projectId, queryParams, purgeTasksOrder },
        });
      }
    }
  } catch (error) {
    handleError(error);
  }
}

function* getFetchArchivedFilterParam(filterId: Id) {
  const filter = yield select(FiltersModelSelectors.selectFilter, { filterId });
  let filterStatus;
  if (!filter) {
    // TODO: generator typescript error
    // @ts-ignore
    yield call(FiltersModelSagas.onInit, { payload: { filterId } });
    filterStatus = yield select(FiltersModelSelectors.selectFilterByProperty, {
      filterId,
      property: 'status',
    });
  } else {
    filterStatus = filter.getIn(['filterByField', 'status']);
  }

  return filterStatus === TaskStatusFilterType.ARCHIVED;
}

export function* onFetchProjectListsData({ payload: { projectId } }: PartialPayloadAction) {
  try {
    const isFetchProjectViewDataRequestRepeatable = yield select(selectProjectViewRequestIsRepeatable, { projectId });

    const isFetchProjectListsRequestRepeatable = yield select(Selectors.selectIsEntityContainedRequestRepeatable, {
      objectId: projectId,
      requestType: RequestTypesConstants.getProjectLists,
      containerId: projectId,
      containerType: EntityType.PROJECT_DATA,
    });

    if (isFetchProjectViewDataRequestRepeatable && isFetchProjectListsRequestRepeatable) {
      yield put(Actions.onSetRequestStatus(RequestTypesConstants.getProjectLists, projectId, RequestStatus.LOADING));
      const { lists, listsFollowers } = yield cps(client.restApiClient.getProjectLists, projectId);
      const { normalizedListsData, listsOrderByProjectId } = normalizeListsDataFromAPI(lists);

      yield put(
        Actions.onFetchProjectListsDataSuccess(projectId, {
          normalizedListsData,
          listsOrderByProjectId,
          listFollowers: fromJS(listsFollowers),
        }),
      );
      yield put(Actions.onSetRequestStatus(RequestTypesConstants.getProjectLists, projectId, RequestStatus.SUCCESS));
    }
  } catch (error) {
    handleError(error);
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.getProjectLists, projectId, RequestStatus.FAILURE, error),
    );
  }
}

export function* onFetchProjectTasksData({ payload: { projectId, queryParams } }: PartialPayloadAction) {
  const requestType = getRequestTypeWithParams(RequestTypesConstants.getProjectTasks, queryParams);
  try {
    const isFetchProjectViewDataRequestRepeatable = yield select(selectProjectViewRequestIsRepeatable, { projectId });

    const isFetchProjectTasksRequestRepeatable = yield select(Selectors.selectIsEntityContainedRequestRepeatable, {
      objectId: projectId,
      requestType,
      containerId: projectId,
      containerType: EntityType.PROJECT_DATA,
    });

    const isRequestRepeatable = isFetchProjectViewDataRequestRepeatable || isFetchProjectTasksRequestRepeatable;

    if (!isRequestRepeatable) {
      return;
    }

    yield put(Actions.onSetRequestStatus(requestType, projectId, RequestStatus.LOADING));
    const { tasks, taskFollowerIds, taskTags, taskPeople, taskChecklist } = yield cps(
      client.restApiClient.getProjectTasks,
      projectId,
      queryParams,
    );

    const { tasksData, tasksOrderByListId, listIdByTaskId, projectIdsByTaskIds } = normalizeTasksDataFromAPI(tasks);
    const normalizedTaskFollowerIds = fromJS(taskFollowerIds) as List<Id>;

    let taskPeopleIds = emptyMap as Map<Id, List<Id>>;
    let taskPeopleRole = emptyMap as Map<Id, Map<Id, TaskPeopleRole>>;

    let checklistItemsData: Map<Id, ChecklistItemInterface> = Map();
    let checklistsByTaskId: Map<Id, List<Id>> = Map();
    let taskIdByChecklistItemId: Map<Id, Id> = Map();

    if (!isEmpty(taskChecklist)) {
      const normalizedChecklistData = normalizeChecklistsItemsBasicDataFromAPI(taskChecklist);
      checklistItemsData = normalizedChecklistData.checklistItemsData;
      checklistsByTaskId = normalizedChecklistData.checklistsByTaskId;
      taskIdByChecklistItemId = normalizedChecklistData.taskIdByChecklistItemId;
    }

    if (!isEmpty(taskPeople)) {
      const taskIds = tasks.map((task) => task.id);
      const { peopleIds, peopleRole } = parseObjectPeople<TaskPeopleRole>(taskPeople, taskIds);
      taskPeopleIds = peopleIds;
      taskPeopleRole = peopleRole;
    }

    yield put(
      Actions.onFetchProjectTasksDataSuccess(projectId, {
        tasksData,
        tasksOrderByListId,
        listIdByTaskId,
        projectIdsByTaskIds,
        taskFollowerIds: normalizedTaskFollowerIds,
        taskTagIds: taskTags ? fromJS(taskTags) : null,
        taskPeopleIds,
        taskPeopleRole,
        checklistItemsData,
        checklistsByTaskId,
        taskIdByChecklistItemId,
      }),
    );

    yield put(Actions.onSetRequestStatus(requestType, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(Actions.onSetRequestStatus(requestType, projectId, RequestStatus.FAILURE, error));
  }
}

export function* onFetchProjectListsAndTasksData({ payload: { projectId } }: PartialPayloadAction) {
  try {
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.getProjectListsAndTasks, projectId, RequestStatus.LOADING),
    );
    yield all([
      call(onFetchProjectListsData, { payload: { projectId } }),
      call(onFetchProjectTasksData, {
        payload: { projectId, queryParams: { fetchArchived: false } },
      }),
    ]);
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.getProjectListsAndTasks, projectId, RequestStatus.SUCCESS),
    );
  } catch (error) {
    handleError(error);
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.getProjectListsAndTasks, projectId, RequestStatus.FAILURE),
    );
  }
}

export function* onFetchListTasksData({ payload: { listId } }: PartialPayloadAction) {
  try {
    const projectId = yield select(selectProjectIdByListId, { listId });
    const isListTasksRepeatable = yield select(Selectors.selectIsEntityContainedRequestRepeatable, {
      objectId: listId,
      requestType: RequestTypesConstants.getListTasks,
      containerId: projectId,
      containerType: EntityType.PROJECT_DATA,
    });
    const isProjectViewDataRepeatable = yield select(selectProjectViewRequestIsRepeatable, { projectId });

    if (isProjectViewDataRepeatable && isListTasksRepeatable) {
      yield put(Actions.onSetRequestStatus(RequestTypesConstants.getListTasks, listId, RequestStatus.LOADING));
      const tasks = yield cps(client.restApiClient.getListTasks, listId);

      const { tasksData, tasksOrderByListId, listIdByTaskId, projectIdsByTaskIds } = normalizeTasksDataFromAPI(tasks);

      yield put(
        Actions.onFetchListTasksDataSuccess({
          tasksData,
          tasksOrderByListId,
          listIdByTaskId,
          projectIdsByTaskIds,
        }),
      );
      yield put(Actions.onSetRequestStatus(RequestTypesConstants.getListTasks, listId, RequestStatus.SUCCESS));
    }
  } catch (error) {
    handleError(error);
    yield put(Actions.onSetRequestStatus(RequestTypesConstants.getListTasks, listId, RequestStatus.FAILURE, error));
  }
}

export function* onFetchContainerFiles({ payload: { containerId, limit = 150 } }: PartialPayloadAction) {
  try {
    const page = yield select(selectPageLastNext, {
      requestType: RequestTypesConstants.fetchContainerFiles,
      objectId: containerId,
    });
    if (page === null) {
      return;
    }
    const containerType = yield select(EntityModelSelectors.selectContainerType, { entityId: containerId });
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.fetchContainerFiles, containerId, RequestStatus.LOADING),
    );
    let result = {};
    if (containerType === EntityType.PROJECT_DATA) {
      result = yield cps(client.restApiClient.fetchProjectFiles, containerId, page, limit);
    } else {
      result = yield cps(client.restApiClient.fetchTaskFiles, containerId, page, limit);
    }

    const filesResult = get(result, 'files');
    if (filesResult) {
      //@ts-ignore
      const files = filesResult.results;
      yield put(onBatchFilesData(files));
      const fileIds = List(files.map((file: FileInterface) => file.id)) as List<Id>;
      if (containerType === EntityType.PROJECT_DATA) {
        yield put(ProjectsModelActions.onBatchProjectFileIds(fileIds, containerId));
      } else {
        yield put(TasksModelActions.onBatchTaskFileIds(fileIds, containerId));
      }
      //@ts-ignore
      yield put(onSetPageLastNext(RequestTypesConstants.fetchContainerFiles, containerId, filesResult.nextPage));
    }
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.fetchContainerFiles, containerId, RequestStatus.SUCCESS),
    );
  } catch (error) {
    handleError(error, { containerId, limit });
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.fetchContainerFiles, containerId, RequestStatus.FAILURE, error),
    );
  }
}

export function* onFetchContainerFilesIfDidNotFetchAlready({
  payload: { containerId, limit = 150 },
}: PartialPayloadAction) {
  try {
    const isRepeatable = yield select(Selectors.selectIsRequestRepeatable, {
      objectId: containerId,
      requestType: RequestTypesConstants.fetchContainerFiles,
    });
    if (isRepeatable) {
      yield call(onFetchContainerFiles, { payload: { containerId, limit } });
    }
  } catch (error) {
    handleError(error, { containerId, limit });
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.fetchContainerFiles, containerId, RequestStatus.FAILURE, error),
    );
  }
}

function* onFetchOrganizationTagsOverviewIfDidNotFetchAlready({ payload: { organizationId } }: PartialPayloadAction) {
  try {
    const isRequestRepeatable = yield select(Selectors.selectIsRequestRepeatable, {
      requestType: RequestTypesConstants.getOrganizationTagsOverview,
      objectId: organizationId,
    });
    if (isRequestRepeatable) {
      yield put(
        Actions.onSetRequestStatus(
          RequestTypesConstants.getOrganizationTagsOverview,
          organizationId,
          RequestStatus.LOADING,
        ),
      );
      const { tagsData, tasksTagIds } = yield cps(client.restApiClient.getOrganizationTagsOverviewData, organizationId);

      let immutableTagsData = emptyMap as Map<Id, TagInterface>;
      tagsData.forEach((tagData) => {
        immutableTagsData = immutableTagsData.set(tagData.id, Tag(tagData));
      });

      let immutableTasksTagIds = emptyMap as Map<Id, List<Id>>;
      for (const taskId in tasksTagIds) {
        const tagIds = tasksTagIds[taskId];
        immutableTasksTagIds = immutableTasksTagIds.set(taskId, List(tagIds));
      }

      yield put(onBatchTags(immutableTagsData, immutableTasksTagIds));
      yield put(
        Actions.onSetRequestStatus(
          RequestTypesConstants.getOrganizationTagsOverview,
          organizationId,
          RequestStatus.SUCCESS,
        ),
      );
    }
  } catch (error) {
    handleError(error);
    yield put(
      Actions.onSetRequestStatus(
        RequestTypesConstants.getOrganizationTagsOverview,
        organizationId,
        RequestStatus.FAILURE,
        error,
      ),
    );
  }
}

export function* onFetchUserLatestVisitedTasks({ payload: { count = 25 } }: PartialPayloadAction) {
  const organizationId = yield select(selectCurrentOrganizationId);
  const userId = yield select(selectCurrentUserId);
  try {
    yield put(
      Actions.onSetRequestStatus(
        RequestTypesConstants.getUserLatestVisitedTasks,
        organizationId,
        RequestStatus.LOADING,
      ),
    );
    const response = yield cps(client.restApiClient.getUserLatestVisitedTasks, organizationId, count);

    const { tasksData, projectIdsByTaskIds, listIdByTaskId, tasksOrderByListId } = normalizeTasksDataFromAPI(response);

    let taskLatestVisit = emptyMap as Map<Id, Date>;
    let projectIdsByListIds = emptyMap as Map<Id, Id>;

    response.forEach(({ latestVisitedAt, id, projectId, listId }) => {
      taskLatestVisit = taskLatestVisit.set(id, latestVisitedAt);
      projectIdsByListIds = projectIdsByListIds.set(listId, projectId);
    });

    yield put(
      Actions.onFetchUserLatestVisitedTasksSuccess({
        tasksData,
        projectIdsByTaskIds,
        listIdByTaskId,
        tasksOrderByListId,
        taskLatestVisit,
        projectIdsByListIds,
      }),
    );
    yield put(
      Actions.onSetRequestStatus(
        RequestTypesConstants.getUserLatestVisitedTasks,
        organizationId,
        RequestStatus.SUCCESS,
      ),
    );
  } catch (error) {
    handleError(error, { userId, organizationId });
    yield put(
      Actions.onSetRequestStatus(
        RequestTypesConstants.getUserLatestVisitedTasks,
        organizationId,
        RequestStatus.FAILURE,
        error,
        { userId, organizationId },
      ),
    );
  }
}

export function* onInitDelayedRequests() {
  try {
    yield spawn(onDelayFetchLatestActiveUserConversations, MAX_LATEST_ACTIVE_CONVERSATIONS);
  } catch (error) {
    handleError(error);
  }
}

function* onDelayFetchLatestActiveUserConversations(count: number) {
  try {
    yield delay(initialRequestDelay);
    const organizationId = yield select(selectCurrentOrganizationId);
    const isRepeatable = yield select(Selectors.selectIsRequestRepeatable, {
      requestType: RequestTypesConstants.getLatestActiveUserConversations,
      objectId: organizationId,
    });
    if (isRepeatable && organizationId) {
      yield put(Actions.onFetchLatestActiveUserConversations(count));
    }
  } catch (error) {
    handleError(error);
  }
}

export function* onHideInactiveConversations() {
  const organizationId = yield select(selectCurrentOrganizationId);
  yield cps(client.restApiClient.hideOldConversations, organizationId);
}

export function* onFetchLatestActiveUserConversations({ payload: { count } }: PartialPayloadAction) {
  const organizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      Actions.onSetRequestStatus(
        RequestTypesConstants.getLatestActiveUserConversations,
        organizationId,
        RequestStatus.LOADING,
      ),
    );
    const latestActiveUserConversationsData = yield cps(
      client.restApiClient.getLatestActiveUserConversations,
      organizationId,
      count,
    );
    let objectMessages = emptyMap;
    let messagesCreatedAt = emptyMap;

    latestActiveUserConversationsData.forEach(({ containerId, messageId, createdAt }) => {
      objectMessages = objectMessages.set(containerId, emptyList.push(messageId));
      messagesCreatedAt = messagesCreatedAt.set(messageId, createdAt);
    });

    yield put(MessagesActions.onBatchLatestActiveUserConversations(objectMessages, messagesCreatedAt));

    yield put(
      Actions.onSetRequestStatus(
        RequestTypesConstants.getLatestActiveUserConversations,
        organizationId,
        RequestStatus.SUCCESS,
      ),
    );
  } catch (error) {
    handleError(error);
    yield put(
      Actions.onSetRequestStatus(
        RequestTypesConstants.getLatestActiveUserConversations,
        organizationId,
        RequestStatus.FAILURE,
        error,
        { count },
      ),
    );
  }
}

function* onFetchArchivedProjectsViewData() {
  const organizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      Actions.onSetRequestStatus(
        RequestTypesConstants.getArchivedProjectsViewData,
        organizationId,
        RequestStatus.LOADING,
      ),
    );
    const result = yield cps(client.restApiClient.getArchivedProjectsViewData, organizationId);
    const actionsBatch = [];

    let projectIds = [];
    if (!isEmpty(result.projects)) {
      projectIds = result.projects.map((project) => project.id);
      actionsBatch.push(ProjectsModelActions.onBatchProjects(Object.values(result.projects)));
    }

    if (!isEmpty(result.projectsPeople)) {
      const { peopleIds, peopleRole } = parseObjectPeople<ProjectPeopleRole>(result.projectsPeople, projectIds);

      actionsBatch.push(ProjectsModelActions.onBatchProjectsPeopleIds(peopleIds));
      actionsBatch.push(ProjectsModelActions.onBatchProjectsPeopleRole(peopleRole));
    }

    actionsBatch.push(
      Actions.onSetRequestStatus(
        RequestTypesConstants.getArchivedProjectsViewData,
        organizationId,
        RequestStatus.SUCCESS,
      ),
    );
    yield put(batchActions(actionsBatch));
  } catch (error) {
    handleError(error, { organizationId });
    yield put(
      Actions.onSetRequestStatus(
        RequestTypesConstants.getArchivedProjectsViewData,
        organizationId,
        RequestStatus.FAILURE,
        error,
      ),
    );
  }
}

export function* onSetOpenedCardDetailsModalId({
  payload: { cardId, isHistorySelfControlled },
}: PayloadAction<OnSetOpenedCardDetailsModalIdPayload>) {
  try {
    if (!cardId) {
      return;
    }

    const { pathname } = yield select(getLocation);
    yield put(
      //@ts-ignore
      push(`${pathname}?taskId=${cardId}`, {
        selfControlled: isHistorySelfControlled,
      }),
    );

    const projectId = yield select(TasksModelSelectors.selectProjectIdByTaskId, { taskId: cardId });
    const isTaskDetailsRequestRepeatable = yield select(Selectors.selectIsEntityContainedRequestRepeatable, {
      objectId: cardId,
      requestType: RequestTypesConstants.getTaskDetails,
      containerId: projectId,
      containerType: EntityType.PROJECT_DATA,
    });

    if (isTaskDetailsRequestRepeatable) {
      yield call(onFetchTaskDetails, { payload: { taskId: cardId } });
    }
  } catch (error) {
    handleError(error);
  }
}

function* onFetchExportedBoardCardsData({ payload: { projectId } }: PartialPayloadAction) {
  try {
    yield put(Actions.onSetRequestStatus(RequestTypesConstants.getExportedData, projectId, RequestStatus.LOADING));

    const currentUserId = yield select(selectCurrentUserId);
    const filterId = makeFilterId(currentUserId, TaskFiltersTargetType.KANBAN, projectId);
    const taskStatusFilter = yield select(FiltersModelSelectors.selectFilterByProperty, {
      filterId,
      property: 'status',
    });
    const organizationId = yield select(selectCurrentOrganizationId);

    const queryParams = {
      organizationId,
      projectId,
      exportArchivedCards: taskStatusFilter === TaskStatusFilterType.ARCHIVED,
    };
    const { filename, csv } = yield cps(client.restApiClient.fetchExportedData, 'boardCards', 'csv', queryParams);

    saveCSVFile(csv, filename);

    UserTracker.track(UserTrackerEvent.featureUsed, {
      name: 'Export project to csv',
    });

    yield put(Actions.onSetRequestStatus(RequestTypesConstants.getExportedData, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.getExportedData, projectId, RequestStatus.FAILURE, error),
    );
  }
}

export function* onFetchUserInitialData() {
  const currentUserId = yield select(selectCurrentUserId);
  try {
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.getUserInitialData, currentUserId, RequestStatus.LOADING),
    );
    const localOrganizationId = yield cps(localStorage.getItem, 'currentOrganizationId');
    const result = yield cps(client.restApiClient.getUserInitialData, localOrganizationId);

    yield storeInitialData(currentUserId, result);
  } catch (error) {
    handleError(error);
    yield put(
      Actions.onSetRequestStatus(RequestTypesConstants.getUserInitialData, currentUserId, RequestStatus.FAILURE, error),
    );
  }
}

export function* retrieveLocalInitialData() {
  const currentUserId = yield select(selectCurrentUserId);
  const localInitialData = yield cps(localStorage.getItem, 'initialUserData');
  if (localInitialData) {
    yield storeInitialData(currentUserId, JSON.parse(localInitialData));
  }
}

function* storeInitialData(currentUserId, result) {
  yield cps(localStorage.setItem, 'initialUserData', JSON.stringify(result));

  const actionsBatch = [];

  if (result.currentOrganization) {
    const currentOrganizationId = result.currentOrganization.id;
    let userOrganizationIds: List<Id> = yield select(selectCurrentUserOrganizationIds);

    if (!userOrganizationIds.includes(currentOrganizationId)) {
      userOrganizationIds = userOrganizationIds.push(currentOrganizationId);
      actionsBatch.push(onCreateUserOrganizations(currentUserId, userOrganizationIds));
    }

    actionsBatch.push(onCreateOrganizationData(result.currentOrganization));
    yield cps(localStorage.setItem, 'currentOrganizationId', currentOrganizationId);
    yield call(client.userContext.setOrganizationId, currentOrganizationId);

    actionsBatch.push(onSetCurrentOrganizationId(currentOrganizationId));

    const { id: userInOrganizationId } = result.currentUserInOrganization;
    actionsBatch.push(onSetCurrentUserInOrganizationId(currentOrganizationId, currentUserId, userInOrganizationId));
  }

  if (result.firstProject) {
    const projectId = result.firstProject.id;
    actionsBatch.push(onCreateProjectData(result.firstProject));

    if (!isEmpty(result.firstProjectPeople)) {
      const peopleIds = result.firstProjectPeople.map((userInProject) => userInProject.userId);
      const peopleRole: Dict<ProjectPeopleRole> = {};

      result.firstProjectPeople.forEach((userInProject) => {
        peopleRole[userInProject.userId] = userInProject.role;
      });
      actionsBatch.push(ProjectsModelActions.onCreateProjectPeopleIds(projectId, peopleIds));
      actionsBatch.push(ProjectsModelActions.onCreateProjectPeopleRole(projectId, peopleRole));
    }

    if (result.currentOrganization) {
      actionsBatch.push(ProjectsModelActions.onGetFirstProjectSuccess(result.currentOrganization.id, projectId));
    }
  }
  yield put(batchActions(actionsBatch));
  yield put(Actions.onSetRequestStatus(RequestTypesConstants.getUserInitialData, currentUserId, RequestStatus.SUCCESS));
}
