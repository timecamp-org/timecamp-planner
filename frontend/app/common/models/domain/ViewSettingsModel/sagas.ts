import { cps, fork, select, takeEvery } from 'redux-saga/effects';
import { HeySpaceClient as client } from '../../../services';
import * as Constants from './constants';
import * as Actions from './actions';
import { PayloadAction } from 'common/types';
import {
  OnDeleteViewSettingsPayload,
  OnFetchViewSettingsPayload,
  OnUpdateViewSettingsBodyPayload,
  OnCreateViewSettingsPayload,
  OnCreateBaseViewSettingsPayload,
} from 'models/domain/ViewSettingsModel/payloads';
import { ViewSettingsBodyType, ViewSettingsWithSettingsBody } from 'models/domain/ViewSettingsModel/types';
import {
  parseViewSettingsFromAPI,
  parseViewSettingsImmutableRecordsToAPIFormat,
  extractFiltersFromViewSettingsBody,
} from 'models/domain/ViewSettingsModel/utils';
import handleError from 'common/utils/handleError';
import { put } from 'redux-saga/effects';
import { onSetRequestStatus } from 'models/domain/RequestModel/actions';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { RequestStatus } from 'models/domain/RequestModel/types';
import { batchActions } from 'redux-batched-actions';
import { selectBaseViewSettingsIdByLinkedViewSettingsId } from 'models/domain/ViewSettingsModel/selectors/domain';
import { onDeleteViewSettingsSuccess } from './actions';
import { Id } from 'common/utils/identifier';
import { onCreateViewSettings } from './actions';
import { Map } from 'immutable';
import { FilterRecordInterface } from 'models/component/FiltersModel/types';
import { onBatchFilters } from 'models/component/FiltersModel/actions';
import { OnBatchFiltersPayload } from 'models/component/FiltersModel/payloads';
import { ViewSettings } from './models';
import generateId from 'common/utils/generate-pushid';

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onCreateBaseViewSettings, onCreateBaseViewSettings);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onUpdateViewSettings, onUpdateViewSettings);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onUpdateViewSettingsBody, onUpdateViewSettingsBody);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onDeleteViewSettings, onDeleteViewSettings);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchViewSettings, onFetchViewSettings);
    });
  },
];

export function* onCreateBaseViewSettings({
  payload: { containerId, containerType, viewType, viewSettingsBody },
}: PayloadAction<OnCreateBaseViewSettingsPayload>) {
  const requestId = [containerType, containerId];
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.createViewSettingsWithLinkedSettings, requestId, RequestStatus.LOADING)
    );

    const viewSettings = ViewSettings({
      id: generateId(),
      containerType,
      containerId,
      viewType,
    });
    const parsedBaseViewSettings = parseViewSettingsImmutableRecordsToAPIFormat(viewSettings, viewSettingsBody);

    yield put(onCreateViewSettings(viewSettings, viewSettingsBody));

    yield cps(client.restApiClient.createViewSettingsWithLinkedSettings, parsedBaseViewSettings, []);

    yield put(
      onSetRequestStatus(RequestTypesConstants.createViewSettingsWithLinkedSettings, requestId, RequestStatus.SUCCESS)
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createViewSettingsWithLinkedSettings,
        requestId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* createLinkedViewSettings(views: ViewSettingsWithSettingsBody<ViewSettingsBodyType>[], baseViewId: Id) {
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.createLinkedViewSettingsForBaseView, baseViewId, RequestStatus.LOADING)
    );
    const actionsBatch = [];
    const parsedLinkedViewSettings = [];

    views.forEach(({ viewSettings, viewSettingsBody }) => {
      actionsBatch.push(Actions.onCreateViewSettings(viewSettings, viewSettingsBody, baseViewId));
      parsedLinkedViewSettings.push(parseViewSettingsImmutableRecordsToAPIFormat(viewSettings, viewSettingsBody));
    });
    yield put(batchActions(actionsBatch));

    for (let viewSettings of parsedLinkedViewSettings) {
      yield cps(client.restApiClient.createViewSettingsWithLinkedSettings, viewSettings, null);

      yield cps(client.restApiClient.createViewSettingsLink, baseViewId, viewSettings.id);
    }

    yield put(
      onSetRequestStatus(RequestTypesConstants.createLinkedViewSettingsForBaseView, baseViewId, RequestStatus.SUCCESS)
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createLinkedViewSettingsForBaseView,
        baseViewId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

function* onUpdateViewSettings({ payload: { viewId, settings } }: PayloadAction<OnUpdateViewSettingsBodyPayload>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateViewSettings, viewId, RequestStatus.LOADING));

    yield cps(client.restApiClient.updateViewSettingsById, viewId, { settings });
    yield put(onSetRequestStatus(RequestTypesConstants.updateViewSettings, viewId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.updateViewSettings, viewId, RequestStatus.FAILURE, error));
  }
}

function* onUpdateViewSettingsBody({ payload: { viewId, settings } }: PayloadAction<OnUpdateViewSettingsBodyPayload>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateViewSettingsBody, viewId, RequestStatus.LOADING));

    yield cps(client.restApiClient.updateViewSettingsById, viewId, { settingsBody: settings });
    yield put(onSetRequestStatus(RequestTypesConstants.updateViewSettingsBody, viewId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.updateViewSettingsBody, viewId, RequestStatus.FAILURE, error));
  }
}

export function* onDeleteViewSettings({ payload: { viewId } }: PayloadAction<OnDeleteViewSettingsPayload>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteViewSettingsById, viewId, RequestStatus.LOADING));
    const baseViewId = yield select(selectBaseViewSettingsIdByLinkedViewSettingsId, { linkedViewId: viewId });
    yield put(onDeleteViewSettingsSuccess(viewId, baseViewId));

    yield cps(client.restApiClient.deleteViewSettingsById, viewId);

    yield put(onSetRequestStatus(RequestTypesConstants.deleteViewSettingsById, viewId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.deleteViewSettingsById, viewId, RequestStatus.FAILURE, error));
  }
}

export function* onFetchViewSettings({
  payload: { viewType, containerType, containerId },
}: PayloadAction<OnFetchViewSettingsPayload>) {
  const requestId = [viewType, containerId];
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getViewSettings, requestId, RequestStatus.LOADING));

    const { baseViewSettings, linkedViewSettings } = yield cps(
      client.restApiClient.getViewSettings,
      viewType,
      containerType,
      containerId
    );

    let filters = Map<Id, FilterRecordInterface>();

    // base settings
    const { viewSettings: immutableBaseViewSettings, viewSettingsBody: immutableBaseViewSettingsBody } =
      parseViewSettingsFromAPI(baseViewSettings);
    const actionsBatch: PayloadAction<OnCreateViewSettingsPayload | OnBatchFiltersPayload>[] = [
      onCreateViewSettings(immutableBaseViewSettings, immutableBaseViewSettingsBody),
    ];
    const filter = extractFiltersFromViewSettingsBody(immutableBaseViewSettingsBody);
    if (filter) {
      filters = filters.set(filter.id, filter);
    }

    // linked settings
    linkedViewSettings.forEach((linkedSettings) => {
      const { viewSettings: immutableLinkedViewSettings, viewSettingsBody: immutableLinkedViewSettingsBody } =
        parseViewSettingsFromAPI(linkedSettings);

      const filter = extractFiltersFromViewSettingsBody(immutableLinkedViewSettingsBody);
      if (filter) {
        filters = filters.set(filter.id, filter);
      }

      actionsBatch.push(
        onCreateViewSettings(immutableLinkedViewSettings, immutableLinkedViewSettingsBody, immutableBaseViewSettings.id)
      );
    });

    if (filters.size > 0) {
      actionsBatch.push(onBatchFilters(filters));
    }

    yield put(batchActions(actionsBatch));
    yield put(onSetRequestStatus(RequestTypesConstants.getViewSettings, requestId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.getViewSettings, requestId, RequestStatus.FAILURE, error));
  }
}
