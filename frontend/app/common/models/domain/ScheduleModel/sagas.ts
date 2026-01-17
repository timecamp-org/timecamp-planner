import { PartialPayloadAction } from 'common/types';
import { Id } from 'common/utils/identifier';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { cps, fork, put, takeEvery } from 'redux-saga/effects';
import { HeySpaceClient as client } from '../../../services/index';
import { onSetRequestStatus } from '../RequestModel/actions';
import { RequestStatus } from '../RequestModel/types';
import * as A from './actions';
import * as C from './constants';
import { TaskScheduleInterface } from './types';

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(C.onFetchScheduleData, onFetchScheduleData);
    });
  },
];

export function* onFetchScheduleData({ payload: { organizationId } }: PartialPayloadAction<{ organizationId: Id }>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getScheduleData, organizationId, RequestStatus.LOADING));

    const { result }: { result: TaskScheduleInterface[] } = yield cps(
      client.restApiClient.getScheduleData,
      organizationId
    );
    yield put(A.onFetchScheduleDataSuccess(result));

    yield put(onSetRequestStatus(RequestTypesConstants.getScheduleData, organizationId, RequestStatus.SUCCESS));
  } catch (e) {
    yield put(onSetRequestStatus(RequestTypesConstants.getScheduleData, organizationId, RequestStatus.FAILURE));
  }
}
