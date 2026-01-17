import { UserTracker, HeySpaceClient as client } from 'common/services';
import { PartialPayloadAction, PayloadAction } from 'common/types';
import handleError from 'common/utils/handleError';
import { Id } from 'common/utils/identifier';
import { List, Map } from 'immutable';
import isEmpty from 'lodash/isEmpty';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import * as ProjectModelConstants from 'models/domain/ProjectsModel/constants';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { batchActions } from 'redux-batched-actions';
import { call, cps, fork, put, select, takeEvery } from 'redux-saga/effects';
import calculateOrder, { attachOrdersToUnorderedItems } from '../../../utils/CalculateOrder';
import generateId from '../../../utils/generate-pushid';
import { selectCurrentUserInOrganizationId } from '../OrganizationsModel/selectors';
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain';
import { selectAvailableSpacesIds } from '../ProjectsModel/selectors';
import { selectSortedAvailableVisibleSpacesIds } from '../ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector';
import { onSetRequestStatus } from '../RequestModel/actions';
import { RequestStatus } from '../RequestModel/types';
import * as Actions from './actions';
import { onCreateProjectGroupSuccess, onUpdateGrouplessProjectOrders, onUpdateProjectOrdersInGroup } from './actions';
import * as Constants from './constants';
import { UserProjectGroup } from './models';
import {
  OnCreateProjectGroupPayload,
  OnDeleteProjectGroupPayload,
  OnMoveProjectGroupPayload,
  OnMoveProjectInStructurePayload,
  OnUpdateGroupPayload,
} from './payloads';
import { selectOrderedProjectIdsByGroupId, selectProjectGroupOrders } from './selectors';
import {
  selectProjectGroupIsExpanded,
  selectProjectIdsInGroups,
  selectProjectOrderWithoutGroupDomain,
  selectProjectOrdersByGroupId,
} from './selectors/domain';
import {
  ProjectDroppableType,
  ProjectStructureInterface,
  UserProjectGroupInterface,
  UserProjectGroupRecordInterface,
} from './types';

const emptyMap = Map();

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchPersonalProjectStructure, onFetchPersonalProjectStructure);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onUpdateProjectGroup, onUpdateProjectGroup);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onCreateProjectGroup, onCreateProjectGroup);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onDeleteProjectGroup, onDeleteProjectGroup);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onMoveProjectInStructure, onMoveProjectInStructure);
    });
    yield fork(function* () {
      yield takeEvery(Constants.onMoveProjectGroup, onMoveProjectGroup);
    });
    yield fork(function* () {
      yield takeEvery(ProjectModelConstants.onProjectCreateSuccess, onWatchProjectCreate);
    });
  },
];

function* onFetchPersonalProjectStructure() {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getPersonalProjectStructure,
        currentOrganizationId,
        RequestStatus.LOADING
      )
    );

    const result: ProjectStructureInterface = yield cps(
      client.restApiClient.getPersonalProjectStructure,
      currentOrganizationId
    );

    const actionsBatch = [];

    if (!isEmpty(result.projectGroups)) {
      let projectGroupsMap = Map<Id, UserProjectGroupRecordInterface>();
      Object.keys(result.projectGroups).map((groupId: Id) => {
        const projectGroup = result.projectGroups[groupId];
        projectGroupsMap = projectGroupsMap.set(groupId, UserProjectGroup(projectGroup));
      });
      actionsBatch.push(Actions.onBatchProjectGroups(projectGroupsMap));
    }

    if (!isEmpty(result.projectOrder)) {
      let projectOrderWithoutGroup = Map<Id, number>();
      let projectOrderByGroupId = Map<Id, Map<Id, number>>();

      Object.keys(result.projectOrder).map((projectId: Id) => {
        const { containerId, containerType, order } = result.projectOrder[projectId];

        switch (containerType) {
          case ProjectDroppableType.LOOSE: {
            projectOrderWithoutGroup = projectOrderWithoutGroup.set(projectId, order);
            break;
          }
          case ProjectDroppableType.GROUP: {
            projectOrderByGroupId = projectOrderByGroupId.setIn([containerId, projectId], order);
            break;
          }
          default: {
            throw new Error(`Unimplemented container type: ${containerType}`);
          }
        }
      });
      actionsBatch.push(Actions.onUpdateGrouplessProjectOrders(projectOrderWithoutGroup));
      actionsBatch.push(Actions.onBatchProjectOrdersInGroup(projectOrderByGroupId));
    }

    yield put(batchActions(actionsBatch));
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getPersonalProjectStructure,
        currentOrganizationId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getPersonalProjectStructure,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

function* onUpdateProjectGroup({ payload: { groupId, fields } }: PayloadAction<OnUpdateGroupPayload>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateProjectGroup, groupId, RequestStatus.LOADING));
    yield cps(client.restApiClient.updateProjectGroup, groupId, fields);
    yield put(onSetRequestStatus(RequestTypesConstants.updateProjectGroup, groupId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.updateProjectGroup, groupId, RequestStatus.FAILURE, error));
  }
}

function* onDeleteProjectGroup({ payload: { groupId } }: PayloadAction<OnDeleteProjectGroupPayload>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteProjectGroup, groupId, RequestStatus.LOADING));
    const actionsBatch = [];

    const orderedProjectIdsByGroupId = yield select(selectOrderedProjectIdsByGroupId, { groupId });

    let grouplessProjectOrders = yield call(getComposedGrouplessProjectOrders);
    for (let i = 0; i <= orderedProjectIdsByGroupId.size - 1; i++) {
      const projectId = orderedProjectIdsByGroupId.get(i);
      const updatedOrders = calculateOrder(projectId, i, grouplessProjectOrders);
      grouplessProjectOrders = grouplessProjectOrders.mergeDeep(updatedOrders);
    }

    actionsBatch.push(onUpdateProjectOrdersInGroup(groupId, emptyMap as Map<Id, number>));
    actionsBatch.push(onUpdateGrouplessProjectOrders(grouplessProjectOrders));
    yield put(batchActions(actionsBatch));

    yield cps(client.restApiClient.deleteProjectGroup, groupId);
    yield put(onSetRequestStatus(RequestTypesConstants.deleteProjectGroup, groupId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.deleteProjectGroup, groupId, RequestStatus.FAILURE, error));
  }
}

function* onCreateProjectGroup({ payload: { id = generateId(), name } }: PayloadAction<OnCreateProjectGroupPayload>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.createProjectGroup, id, RequestStatus.LOADING));
    const userInOrganizationId = yield select(selectCurrentUserInOrganizationId);

    const projectGroupOrders = yield select(selectProjectGroupOrders);
    const updatedOrders = calculateOrder(id, 0, projectGroupOrders);
    const order = updatedOrders.get(id);

    const rawProjectGroup: UserProjectGroupInterface = {
      id,
      isExpanded: false,
      name,
      order,
      userInOrganizationId,
    };
    const projectGroup = UserProjectGroup({ ...rawProjectGroup, wasJustCreated: true });
    yield put(onCreateProjectGroupSuccess(projectGroup));

    yield cps(client.restApiClient.createProjectGroup, rawProjectGroup);
    UserTracker.track(UserTrackerEvent.featureUsed, { name: 'Project groups' });

    yield put(onSetRequestStatus(RequestTypesConstants.createProjectGroup, id, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.createProjectGroup, id, RequestStatus.FAILURE, error));
  }
}

function* onMoveProjectGroup({ payload: { groupId, selectedPosition } }: PayloadAction<OnMoveProjectGroupPayload>) {
  try {
    const projectGroupOrders = yield select(selectProjectGroupOrders);
    const updatedOrders = calculateOrder(groupId, selectedPosition, projectGroupOrders);
    const order = updatedOrders.get(groupId);
    yield put(Actions.onUpdateProjectGroup(groupId, { order }));
  } catch (error) {
    handleError(error);
  }
}

function* onMoveProjectInStructure({
  payload: { spaceId, selectedPosition, sourceType, sourceId, targetType, targetId },
}: PayloadAction<OnMoveProjectInStructurePayload>) {
  try {
    const currentOrganizationId = yield select(selectCurrentOrganizationId);
    yield put(onSetRequestStatus(RequestTypesConstants.moveProjectInStructure, spaceId, RequestStatus.LOADING));

    let order: number;

    if (sourceType === ProjectDroppableType.LOOSE && targetType === ProjectDroppableType.LOOSE) {
      order = yield call(onMoveProjectOutsideGroups, spaceId, selectedPosition);
    }

    if (sourceType === ProjectDroppableType.LOOSE && targetType === ProjectDroppableType.GROUP) {
      order = yield call(onMoveUngroupedProjectToGroup, spaceId, selectedPosition, targetId);
    }

    if (sourceType === ProjectDroppableType.GROUP && targetType === ProjectDroppableType.GROUP) {
      order = yield call(onMoveProjectBetweenGroups, spaceId, selectedPosition, sourceId, targetId);
    }

    if (sourceType === ProjectDroppableType.GROUP && targetType === ProjectDroppableType.LOOSE) {
      order = yield call(onMoveProjectToUngrouped, spaceId, selectedPosition, sourceId);
    }
    yield cps(client.restApiClient.moveProjectInStructure, currentOrganizationId, spaceId, {
      containerType: targetType,
      containerId: targetId,
      order,
    });
    UserTracker.track(UserTrackerEvent.featureUsed, { name: 'Project groups' });

    yield put(onSetRequestStatus(RequestTypesConstants.moveProjectInStructure, spaceId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.moveProjectInStructure, spaceId, RequestStatus.FAILURE, error));
  }
}

function* onMoveProjectOutsideGroups(spaceId: Id, selectedPosition: number) {
  let grouplessProjectOrders = yield call(getComposedGrouplessProjectOrders);
  grouplessProjectOrders = yield filterUnavailableProjects(grouplessProjectOrders);

  const updatedOrders = calculateOrder(spaceId, selectedPosition, grouplessProjectOrders);
  grouplessProjectOrders = grouplessProjectOrders.mergeDeep(updatedOrders);

  yield put(onUpdateGrouplessProjectOrders(grouplessProjectOrders));

  return yield updatedOrders.get(spaceId);
}

function* onMoveUngroupedProjectToGroup(spaceId: Id, selectedPosition: number, groupId: Id) {
  const actionsBatch = [];

  let grouplessProjectOrders = yield call(getComposedGrouplessProjectOrders);
  grouplessProjectOrders = yield filterUnavailableProjects(grouplessProjectOrders);

  if (grouplessProjectOrders.has(spaceId)) {
    grouplessProjectOrders = grouplessProjectOrders.filter((_, projectId) => projectId !== spaceId);
    actionsBatch.push(onUpdateGrouplessProjectOrders(grouplessProjectOrders));
  }

  let projectOrdersByGroupId = yield select(selectProjectOrdersByGroupId, { groupId });
  let isGroupExpanded = yield select(selectProjectGroupIsExpanded, { groupId });

  if (!isGroupExpanded) {
    selectedPosition = projectOrdersByGroupId.size;
  }

  const updatedOrders = calculateOrder(spaceId, selectedPosition, projectOrdersByGroupId);
  projectOrdersByGroupId = projectOrdersByGroupId.mergeDeep(updatedOrders);

  actionsBatch.push(onUpdateProjectOrdersInGroup(groupId, projectOrdersByGroupId));
  yield put(batchActions(actionsBatch));

  return yield updatedOrders.get(spaceId);
}

function* onMoveProjectBetweenGroups(spaceId: Id, selectedPosition: number, sourceGroupId: Id, destinationGroupId: Id) {
  const actionsBatch = [];

  let sourceGroupProjectOrders = yield select(selectProjectOrdersByGroupId, { groupId: sourceGroupId });
  let destinationGroupProjectOrders = yield select(selectProjectOrdersByGroupId, { groupId: destinationGroupId });
  destinationGroupProjectOrders = yield filterUnavailableProjects(destinationGroupProjectOrders);

  sourceGroupProjectOrders = sourceGroupProjectOrders.filter((_, projectId) => projectId !== spaceId);

  let isGroupExpanded = yield select(selectProjectGroupIsExpanded, { groupId: destinationGroupId });

  if (!isGroupExpanded) {
    selectedPosition = destinationGroupProjectOrders.size;
  }

  const updatedOrders = calculateOrder(spaceId, selectedPosition, destinationGroupProjectOrders);
  destinationGroupProjectOrders = destinationGroupProjectOrders.mergeDeep(updatedOrders);

  actionsBatch.push(onUpdateProjectOrdersInGroup(sourceGroupId, sourceGroupProjectOrders));
  actionsBatch.push(onUpdateProjectOrdersInGroup(destinationGroupId, destinationGroupProjectOrders));

  yield put(batchActions(actionsBatch));

  return yield updatedOrders.get(spaceId);
}

function* onMoveProjectToUngrouped(spaceId: Id, selectedPosition: number, groupId: Id) {
  const actionsBatch = [];

  let sourceGroupProjectOrders = yield select(selectProjectOrdersByGroupId, { groupId });
  sourceGroupProjectOrders = sourceGroupProjectOrders.filter((_, projectId) => projectId !== spaceId);
  actionsBatch.push(onUpdateProjectOrdersInGroup(groupId, sourceGroupProjectOrders));

  let grouplessProjectOrders = yield call(getComposedGrouplessProjectOrders);

  const updatedOrders = calculateOrder(spaceId, selectedPosition, grouplessProjectOrders);
  grouplessProjectOrders = grouplessProjectOrders.mergeDeep(updatedOrders);

  actionsBatch.push(onUpdateGrouplessProjectOrders(grouplessProjectOrders));
  yield put(batchActions(actionsBatch));

  return yield updatedOrders.get(spaceId);
}

function* onGenerateOrdersToUnorderedSpaces() {
  const projectIdsWithGroups = yield select(selectProjectIdsInGroups);
  const unorderedProjectIds = yield select(selectSortedAvailableVisibleSpacesIds);
  const spaceIdsToAttachOrder = unorderedProjectIds.filter((projectId) => !projectIdsWithGroups.includes(projectId));
  return yield attachOrdersToUnorderedItems(spaceIdsToAttachOrder);
}

function* getComposedGrouplessProjectOrders() {
  let grouplessProjectOrders: Map<string, number> = yield select(selectProjectOrderWithoutGroupDomain);

  if (grouplessProjectOrders.isEmpty()) {
    grouplessProjectOrders = yield call(onGenerateOrdersToUnorderedSpaces);
  }

  grouplessProjectOrders = yield filterUnavailableProjects(grouplessProjectOrders);

  return yield grouplessProjectOrders;
}

function* filterUnavailableProjects(projects: Map<string, number>) {
  const availableProjects: List<string> = yield select(selectAvailableSpacesIds);

  return projects.filter((_, id) => availableProjects.includes(id)).toMap();
}

function* onWatchProjectCreate({
  payload: {
    data: { projectId },
  },
}: PartialPayloadAction) {
  try {
    let grouplessProjectOrders = yield call(getComposedGrouplessProjectOrders);
    const updatedOrders = calculateOrder(projectId, 0, grouplessProjectOrders);
    grouplessProjectOrders = grouplessProjectOrders.mergeDeep(updatedOrders);
    yield put(onUpdateGrouplessProjectOrders(grouplessProjectOrders));
  } catch (error) {
    handleError(error);
  }
}
