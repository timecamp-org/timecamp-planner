import { PartialPayloadAction } from 'common/types';
import { onSetRequestStatus } from 'models/domain/RequestModel/actions';
import { cps, fork, put, takeEvery } from 'redux-saga/effects';
import { HeySpaceClient as client } from '../../../services/index';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { RequestStatus } from '../RequestModel/types';
import * as A from './actions';
import * as C from './constants/index';
import { TaskTimeEstimate } from './models';
import { TaskTimeEstimateInterface } from './types';

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(C.onFetchTaskTimeEstimate, onFetchTaskTimeEstimate);
    });
    yield fork(function* () {
      yield takeEvery(C.onCreateTaskTimeEstimate, onCreateTaskTimeEstimate);
    });
    yield fork(function* () {
      yield takeEvery(C.onUpdateTaskTimeEstimate, onUpdateTaskTimeEstimate);
    });
    yield fork(function* () {
      yield takeEvery(C.onDeleteTaskTimeEstimate, onDeleteTaskTimeEstimate);
    });
  },
];

export function mapResponseToEstimateRecord(estimate: TaskTimeEstimateInterface): TaskTimeEstimateInterface {
  return new TaskTimeEstimate(estimate);
}

export function* onFetchTaskTimeEstimate({ payload: { taskId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getTaskTimeEstimate, taskId, RequestStatus.LOADING));

    const { result } = yield cps(client.restApiClient.getTaskEstimates, taskId);

    yield put(A.onFetchTaskTimeEstimateSuccess(mapResponseToEstimateRecord(result)));

    yield put(onSetRequestStatus(RequestTypesConstants.getTaskTimeEstimate, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.getTaskTimeEstimate, taskId, RequestStatus.FAILURE));
  }
}

export function* onCreateTaskTimeEstimate({ payload }: PartialPayloadAction) {
  const { estimate } = payload;
  const { taskId } = estimate;

  try {
    yield put(onSetRequestStatus(RequestTypesConstants.createTaskTimeEstimate, taskId, RequestStatus.LOADING));

    const { result } = yield cps(client.restApiClient.createTaskEstimates, taskId, estimate);

    yield put(A.onCreateTaskTimeEstimateSuccess(mapResponseToEstimateRecord(result)));

    yield put(onSetRequestStatus(RequestTypesConstants.createTaskTimeEstimate, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.createTaskTimeEstimate, taskId, RequestStatus.FAILURE));
  }
}

export function* onUpdateTaskTimeEstimate({ payload }: PartialPayloadAction) {
  const { estimate } = payload;
  const { taskId } = estimate;

  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateTaskTimeEstimate, taskId, RequestStatus.LOADING));

    const { result } = yield cps(client.restApiClient.updateTaskEstimates, taskId, estimate);

    yield put(A.onUpdateTaskTimeEstimateSuccess(mapResponseToEstimateRecord(result)));

    yield put(onSetRequestStatus(RequestTypesConstants.updateTaskTimeEstimate, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.updateTaskTimeEstimate, taskId, RequestStatus.FAILURE));
  }
}

export function* onDeleteTaskTimeEstimate({ payload }: PartialPayloadAction) {
  const { taskId } = payload;

  try {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteTaskTimeEstimate, taskId, RequestStatus.LOADING));

    yield cps(client.restApiClient.deleteTaskEstimates, taskId);

    yield put(A.onDeleteTaskTimeEstimateSuccess(taskId));

    yield put(onSetRequestStatus(RequestTypesConstants.deleteTaskTimeEstimate, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteTaskTimeEstimate, taskId, RequestStatus.FAILURE));
  }
}
