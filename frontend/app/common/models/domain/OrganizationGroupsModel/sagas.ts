import { put, select, fork, takeLatest, cps } from 'redux-saga/effects';
import handleError from '../../../utils/handleError';
import { HeySpaceClient as client } from '../../../services';
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain';

import * as A from './actions';
import * as C from './constants';

import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { RequestStatus } from '../RequestModel/types';
import { OrganizationGroupInterface } from './types';
import { Id } from 'common/utils/identifier';
import { SagaIterator } from 'redux-saga';
import { Dict, PartialPayloadAction } from 'common/types';
import { Map } from 'immutable';

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(C.onInit, onInit);
    });
    yield fork(function* () {
      yield takeLatest(C.onCreateGroup, onCreateGroup);
    });
    yield fork(function* () {
      yield takeLatest(C.onDeleteGroup, onDeleteGroup);
    });
    yield fork(function* () {
      yield takeLatest(C.onUpdateGroup, onUpdateGroup);
    });
    yield fork(function* () {
      yield takeLatest(C.onAddUserToGroup, onAddUserToGroup);
    });
    yield fork(function* () {
      yield takeLatest(C.onRemoveUserFromGroup, onRemoveUserFromGroup);
    });
  },
];

export function* onInit(): SagaIterator {
  const organizationId: Id = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getOrganizationGroups,
        organizationId,
        RequestStatus.LOADING
      )
    );

    const groups: OrganizationGroupInterface[] = yield cps(
      client.restApiClient.getOrganizationGroups,
      // @ts-ignore
      organizationId
    );
    const groupsPeople: Dict<Id> = yield cps(
      client.restApiClient.getOrganizationGroupsPeople,
      // @ts-ignore
      organizationId
    );

    yield put(A.onSetGroupsData(groups));
    yield put(A.onSetGroupsPeople(Map<Id, Id>(groupsPeople)));

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getOrganizationGroups,
        organizationId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getOrganizationGroups,
        organizationId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onCreateGroup({
  payload,
}: PartialPayloadAction): SagaIterator {
  const organizationId: Id = yield select(selectCurrentOrganizationId);
  const { name, slug } = payload.group;

  try {
    const group: OrganizationGroupInterface = yield cps(
      client.restApiClient.createOrganizationGroup,
      // @ts-ignore
      organizationId,
      name,
      slug
    );
    yield put(A.onSetGroupData(group));
  } catch (error) {
    handleError(error);
  }
}

export function* onUpdateGroup({
  payload,
}: PartialPayloadAction): SagaIterator {
  const { id, name, slug } = payload.group;

  try {
    const group: OrganizationGroupInterface = yield cps(
      client.restApiClient.updateOrganizationGroup,
      // @ts-ignore
      id,
      name,
      slug
    );
    yield put(A.onSetGroupData(group));
  } catch (error) {
    handleError(error);
  }
}

export function* onDeleteGroup({
  payload,
}: PartialPayloadAction): SagaIterator {
  try {
    const { groupId } = payload;
    // @ts-ignore
    yield cps(client.restApiClient.deleteOrganizationGroup, groupId as Id);
    yield put(A.onDeleteGroupSuccess(groupId));
  } catch (error) {
    handleError(error);
  }
}

export function* onAddUserToGroup({
  payload,
}: PartialPayloadAction): SagaIterator {
  try {
    const { userId, groupId } = payload;
    // @ts-ignore
    yield cps(client.restApiClient.addUserToGroup, groupId, userId);
    yield put(A.onAddUserToGroupSuccess(userId, groupId));
  } catch (error) {
    handleError(error);
  }
}

export function* onRemoveUserFromGroup({
  payload,
}: PartialPayloadAction): SagaIterator {
  try {
    const { userId, groupId } = payload;
    // @ts-ignore
    yield cps(client.restApiClient.removeUserFromGroup, groupId, userId);
    yield put(A.onRemoveUserFromGroupSuccess(userId, groupId));
  } catch (error) {
    handleError(error);
  }
}
