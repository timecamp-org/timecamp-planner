import { call, cps, fork, select, takeEvery } from 'redux-saga/effects';
import { HeySpaceClient as client } from '../../../services';
import * as Constants from './constants';
import { defaultFilters, OverwatchViewSettingsBody } from './models';
import { PayloadAction } from 'common/types';
import {} from 'models/domain/ViewSettingsModel/payloads';
import {
  ViewContainerType,
  ViewSettingsViewType,
  ViewSettingsRecordInterface,
} from 'models/domain/ViewSettingsModel/types';
import { parseViewSettingsImmutableRecordsToAPIFormat } from 'models/domain/ViewSettingsModel/utils';
import handleError from 'common/utils/handleError';
import { put } from 'redux-saga/effects';
import { onSetRequestStatus } from 'models/domain/RequestModel/actions';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { RequestStatus } from 'models/domain/RequestModel/types';
import { batchActions } from 'redux-batched-actions';
import generateId from 'common/utils/generate-pushid';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import {
  selectViewSettingsContainerId,
  selectViewSettingsIdByTypeAndContainerId,
  selectLinkedViewIdsByBaseViewId,
  selectLinkedViewSettingsByBaseViewId,
} from 'models/domain/ViewSettingsModel/selectors/domain';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { onClearFilters } from 'models/component/FiltersModel/sagas';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import { selectCurrentUserId } from '../UsersModel/selectors/domain';
import { OnCreateOverwatchViewPayload, OnUpdateOverwatchViewsPayload } from './payloads';
import { onCreateViewSettings, onDeleteViewSettings } from '../ViewSettingsModel/actions';
import { ViewSettings } from '../ViewSettingsModel/models';
import { createLinkedViewSettings } from '../ViewSettingsModel/sagas';
import { generateDefaultOverwatchTileViewSettings } from './utils';
import { List } from 'immutable';
import { OnClearFiltersPayload } from 'models/component/FiltersModel/payloads';

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onCreateOverwatchView, onCreateOverwatchView);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onClearOverwatchFilters, onClearOverwatchFilters);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onUpdateOverwatchViews, onUpdateOverwatchViews);
    });
  },
];

function* onCreateOverwatchView({ payload: { spaceIds } }: PayloadAction<OnCreateOverwatchViewPayload>) {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createViewSettingsWithLinkedSettings,
        currentOrganizationId,
        RequestStatus.LOADING
      )
    );

    const overwatchViewSettings = ViewSettings({
      id: generateId(),
      containerType: ViewContainerType.ORGANIZATION,
      containerId: currentOrganizationId,
      viewType: ViewSettingsViewType.OVERWATCH,
    });
    const overwatchViewSettingsBody = OverwatchViewSettingsBody({ filters: defaultFilters });
    const parsedBaseViewSettings = parseViewSettingsImmutableRecordsToAPIFormat(
      overwatchViewSettings,
      overwatchViewSettingsBody
    );
    const actionsBatch = [onCreateViewSettings(overwatchViewSettings, overwatchViewSettingsBody)];

    const parsedLinkedViewSettings = [];
    spaceIds.map(generateDefaultOverwatchTileViewSettings).forEach(({ viewSettings, viewSettingsBody }) => {
      actionsBatch.push(onCreateViewSettings(viewSettings, viewSettingsBody, overwatchViewSettings.id));
      parsedLinkedViewSettings.push(parseViewSettingsImmutableRecordsToAPIFormat(viewSettings, viewSettingsBody));
    });
    yield put(batchActions(actionsBatch));

    yield cps(
      client.restApiClient.createViewSettingsWithLinkedSettings,
      parsedBaseViewSettings,
      parsedLinkedViewSettings
    );

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createViewSettingsWithLinkedSettings,
        currentOrganizationId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createViewSettingsWithLinkedSettings,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

function* onClearOverwatchFilters() {
  try {
    const currentOrganizationId = yield select(selectCurrentOrganizationId);
    const currentUserId = yield select(selectCurrentUserId);
    const baseViewId = yield select(selectViewSettingsIdByTypeAndContainerId, {
      viewType: ViewSettingsViewType.OVERWATCH,
      containerId: currentOrganizationId,
      containerType: ViewContainerType.ORGANIZATION,
    });
    const linkedViewSettingsIds = yield select(selectLinkedViewIdsByBaseViewId, { baseViewId });

    if (linkedViewSettingsIds.size > 0) {
      for (let viewId of linkedViewSettingsIds) {
        const spaceId = yield select(selectViewSettingsContainerId, { viewId });
        const filterId = makeFilterId(currentUserId, TaskFiltersContainerType.OVERWATCH_SPACE_TILE, spaceId);

        yield call(onClearFilters, { payload: { filterId } } as PayloadAction<OnClearFiltersPayload>);
      }
    }
  } catch (error) {
    handleError(error);
  }
}

function* onUpdateOverwatchViews({
  payload: { selectedSpaceIds, overwatchViewId },
}: PayloadAction<OnUpdateOverwatchViewsPayload>) {
  try {
    const currentOverwatchTilesSettings: List<ViewSettingsRecordInterface> = yield select(
      selectLinkedViewSettingsByBaseViewId,
      { baseViewId: overwatchViewId }
    );

    const currentOverwatchSpaceIds = currentOverwatchTilesSettings.map((viewSettings) => viewSettings.containerId);

    const viewIdBySpaceId = {};

    currentOverwatchTilesSettings.forEach((viewSettings) => {
      viewIdBySpaceId[viewSettings.containerId] = viewSettings.id;
    });

    const addedSpaceIds = selectedSpaceIds.filter((spaceId) => !currentOverwatchSpaceIds.includes(spaceId));

    const deletedSpaceIds = currentOverwatchSpaceIds.filter((spaceId) => !selectedSpaceIds.includes(spaceId));

    const deletedViewIds = deletedSpaceIds.map((spaceId) => viewIdBySpaceId[spaceId]);

    if (addedSpaceIds.size > 0) {
      const newSpaceTimelineViews = addedSpaceIds.map(generateDefaultOverwatchTileViewSettings);
      yield call(createLinkedViewSettings, newSpaceTimelineViews.toArray(), overwatchViewId);
    }
    if (deletedViewIds.size > 0) {
      for (const viewId of deletedViewIds.toArray()) {
        yield put(onDeleteViewSettings(viewId));
      }
    }
  } catch (error) {
    handleError(error);
  }
}
