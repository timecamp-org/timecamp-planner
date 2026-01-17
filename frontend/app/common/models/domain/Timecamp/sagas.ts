import { GetTasksTimeEntriesResponse } from 'client/src/HeySpaceRestApiClient/types';
import { PartialPayloadAction } from 'common/types';
import { differenceInSeconds } from 'date-fns';

import { i18mark, i18n } from 'common/i18n';
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions';
import { onSetRequestStatus } from 'models/domain/RequestModel/actions';
import { call, cps, fork, put, select, takeEvery } from 'redux-saga/effects';
import { HeySpaceClient as client } from '../../../services/index';
import { HumanMessage } from '../HumanMessageModel/models';
import { HumanMessageKind } from '../HumanMessageModel/types';
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain';
import { selectCurrentUserInOrganizationId } from '../OrganizationsModel/selectors/index';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { RequestStatus } from '../RequestModel/types';
import * as A from './actions';
import * as C from './constants';
import { selectTaskTimer } from './selectors';
import { DurationEntryInterface, TimeEntryAction, TimeEntryInterface } from './types';

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(C.onSaveToken, onSaveToken);
    });
    yield fork(function* () {
      yield takeEvery(C.onSetTimer, onSetTimer);
    });
    yield fork(function* () {
      yield takeEvery(C.onCheckTimerStatus, onCheckTimerStatus);
    });
    yield fork(function* () {
      yield takeEvery(C.onFetchTaskTimeEntries, onFetchTaskTimeEntries);
    });
    yield fork(function* () {
      yield takeEvery(C.onFetchHasTimecampIntegration, onFetchHasTimecampIntegration);
    });
    yield fork(function* () {
      yield takeEvery(C.onAddTimeEntry, onAddTimeEntry);
    });
  },
];

function* onSaveToken({ payload: { token } }: PartialPayloadAction) {
  const currentUserInOrganizationId: string = yield select(selectCurrentUserInOrganizationId);

  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.saveTimecampApiToken, currentUserInOrganizationId, RequestStatus.LOADING)
    );

    // @ts-ignore
    yield cps(client.restApiClient.saveTimecampApiToken, currentUserInOrganizationId, token);

    const organizationId = yield select(selectCurrentOrganizationId);

    yield put(A.onSaveTokenSuccess({ [organizationId]: true }));

    yield put(
      onSetRequestStatus(RequestTypesConstants.saveTimecampApiToken, currentUserInOrganizationId, RequestStatus.SUCCESS)
    );

    yield put(
      PopUpAlertsModelActions.onAddAlert({
        humanMessage: HumanMessage({
          kind: HumanMessageKind.success,
          text: i18n.t(i18mark('TimeCamp Api key added successfully')),
        }),
      })
    );
  } catch (error) {
    yield put(
      onSetRequestStatus(RequestTypesConstants.saveTimecampApiToken, currentUserInOrganizationId, RequestStatus.FAILURE)
    );
  }
}

function* onFetchHasTimecampIntegration() {
  const organizationId: string = yield select(selectCurrentOrganizationId);

  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getHasIntegration, organizationId, RequestStatus.LOADING));
    // @ts-ignore
    const response = yield cps(client.restApiClient.getHasUserTimecampIntegration, organizationId);

    yield put(A.onFetchHasTimecampIntegrationSuccess({ [organizationId]: true }));

    yield put(onSetRequestStatus(RequestTypesConstants.getHasIntegration, organizationId, RequestStatus.SUCCESS));

    return response;
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.getHasIntegration, organizationId, RequestStatus.FAILURE));
  }
}

function* onSetTimer({
  payload: { taskId, timeEntryAction },
}: PartialPayloadAction<{ taskId: string; timeEntryAction: TimeEntryAction }>) {
  try {
    if (timeEntryAction === 'start') {
      yield put(
        A.onSetTimerSuccess({
          taskId,
          startedAt: new Date(),
          isRunning: true,
        })
      );
    } else if (timeEntryAction === 'stop') {
      const { startedAt } = yield select(selectTaskTimer, { taskId });
      yield put(A.onSetTimerSuccess({ isRunning: false }));

      yield onAddTaskTime({ taskId, from: startedAt });
    }

    yield put(onSetRequestStatus(RequestTypesConstants.setTimer, taskId, RequestStatus.LOADING));
    // @ts-ignore
    yield cps(client.restApiClient.setTimecampTimer, taskId, timeEntryAction);

    yield put(onSetRequestStatus(RequestTypesConstants.setTimer, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.setTimer, taskId, RequestStatus.FAILURE));
    yield put(A.onSetTimerSuccess(null));
  }
}

function* onCheckTimerStatus({ payload: { taskId } }: PartialPayloadAction<{ taskId: string }>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.checkTaskTimer, taskId, RequestStatus.LOADING));
    // @ts-ignore
    const result = yield cps(client.restApiClient.setTimecampTimer, taskId, 'status');

    yield put(
      A.onCheckTimerStatusSuccess({
        taskId: String(result.external_task_id).replace('task_', ''),
        startedAt: new Date(result.start_time),
        isRunning: result.isTimerRunning,
      })
    );

    yield put(onSetRequestStatus(RequestTypesConstants.checkTaskTimer, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.checkTaskTimer, taskId, RequestStatus.FAILURE));
  }
}

function* onFetchTaskTimeEntries({ payload: taskId }: PartialPayloadAction<string>) {
  const organizationId: string = yield select(selectCurrentOrganizationId);

  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getAllEntries, organizationId, RequestStatus.LOADING));
    // @ts-ignore
    const result = yield cps(client.restApiClient.getTasksTimeEntries, taskId);

    const taskTotalTime = (result as GetTasksTimeEntriesResponse).reduce((acc, { duration }) => acc + duration, 0);

    yield put(A.onFetchTaskTimeEntrySuccess({ [taskId]: taskTotalTime }));

    yield put(onSetRequestStatus(RequestTypesConstants.getAllEntries, organizationId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.getAllEntries, organizationId, RequestStatus.FAILURE));
  }
}

function* onAddTimeEntry({ payload: entry }: PartialPayloadAction<DurationEntryInterface | TimeEntryInterface>) {
  const { taskId } = entry;

  try {
    yield put(onSetRequestStatus(RequestTypesConstants.addTimeEntry, taskId, RequestStatus.LOADING));

    // @ts-ignore
    const response = yield cps(client.restApiClient.addTimeEntry, entry);

    yield onAddTaskTime(entry);

    yield put(A.onAddTimeEntrySuccess({ [taskId]: response }));

    yield put(onSetRequestStatus(RequestTypesConstants.addTimeEntry, taskId, RequestStatus.SUCCESS));
    yield call(showAddEntrySuccessMessage);
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.addTimeEntry, taskId, RequestStatus.FAILURE));
  }
}

function* onAddTaskTime({ taskId, ...rest }: DurationEntryInterface | TimeEntryInterface) {
  if ('from' in rest) {
    const { from } = rest;
    const to = rest?.to ?? new Date();

    yield put(A.onAddTaskTime({ [taskId]: differenceInSeconds(to, from) }));
  } else if ('duration' in rest) {
    yield put(A.onAddTaskTime({ [taskId]: rest.duration }));
  }
}

function* showAddEntrySuccessMessage(message = i18n.t('Time entry has been added')) {
  yield put(
    PopUpAlertsModelActions.onAddAlert({
      humanMessage: HumanMessage({
        kind: HumanMessageKind.success,
        text: message,
      }),
    })
  );
}
