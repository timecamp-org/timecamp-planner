import { fromJS, Map } from 'immutable';
import {
  call,
  cps,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import handleError from '../../../utils/handleError';
import makeActionResult from '../../../utils/makeActionResult';
import * as A from './actions';
import * as C from './constants';
import { Filter } from './models';
import * as S from './selectors';

import { PayloadAction } from 'common/types';
import { Id } from 'common/utils/identifier';
import { onUpdateViewSettingsBody } from 'models/domain/ViewSettingsModel/actions';
import { selectViewSettingsIdsByContainerId } from 'models/domain/ViewSettingsModel/selectors/domain';
import { ViewContainerType } from 'models/domain/ViewSettingsModel/types';
import { localStorage } from '../../../services';
import {
  OnClearFiltersPayload,
  OnInitPayload,
  OnSetFilterByPayload,
  OnSetGroupByPayload,
  OnSetSortByPayload,
} from './payloads';
import {
  FilterRecordInterface,
  FiltersInterface,
  FilterType,
  TaskFiltersContainerType,
  TaskFiltersTargetType,
} from './types';
import { getFilterContainerId, getFilterContainerType } from './utils';

const emptyMap = Map<string, string>();

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(C.onInit, onInit);
    });
    yield fork(function* () {
      yield takeEvery(C.onSetFilterBy, onSetFilterBy);
    });
    yield fork(function* () {
      yield takeEvery(C.onSetSortBy, onSetSortBy);
    });
    yield fork(function* () {
      yield takeEvery(C.onSetGroupBy, onSetGroupBy);
    });
    yield fork(function* () {
      yield takeEvery(C.onClearFilters, onClearFilters);
    });
  },
];

export function* onInit({
  payload: { filterId },
}: PayloadAction<OnInitPayload>) {
  try {
    const existingFilter = yield select(S.selectFilter, { filterId });
    if (existingFilter) {
      return;
    }
    const filter: FiltersInterface = JSON.parse(
      yield cps(localStorage.getItem, filterId)
    );
    if (filter) {
      const filterRecord = Filter({
        id: filterId,
        filterByField: fromJS(filter.filterByField),
        sortByField: fromJS(filter.sortByField),
      });
      yield put(
        A.onSetFilterBySuccess(
          makeActionResult({
            isOk: true,
            code: 'onSetFilterBySuccess',
            data: { filter: filterRecord, filterId },
          })
        )
      );
    }
  } catch (error) {
    handleError(error);
  }
}

/*
* filterId - generated in specific enhancers that wants its own filters - filterId must be able to be regenerated (no random values)
* filterKey - property name that some list of records will be filtered by
- filterValue - primitive or List of values
*/
function* onSetFilterBy({
  payload: { filterId, filterKey, filterValue },
}: PayloadAction<OnSetFilterByPayload>) {
  try {
    const filterType = FilterType.FILTER_BY_FIELD;
    let filter = yield select(S.selectFilter, { filterId });
    if (!filter) {
      filter = Filter({ id: filterId });
    }
    if (filterValue) {
      if (!filter.get(filterType)) {
        filter = filter.set(filterType, emptyMap);
      }
      filter = filter.setIn([filterType, filterKey], filterValue);
    } else {
      filter = filter.deleteIn([filterType, filterKey]);
    }
    yield call(onPersistFilter, filter);

    yield put(
      A.onSetFilterBySuccess(
        makeActionResult({
          isOk: true,
          code: 'onSetFilterBySuccess',
          data: { filter, filterId },
        })
      )
    );
  } catch (error) {
    handleError(error, {
      filterKey,
      filterValue,
      filterId,
    });
  }
}

function* onSetSortBy({
  payload: { filterId, sortKey, sortOrder },
}: PayloadAction<OnSetSortByPayload>) {
  try {
    const filterType = FilterType.SORT_BY_FIELD;
    let filter = yield select(S.selectFilter, { filterId });
    if (!filter) {
      filter = Filter({ id: filterId });
    }
    if (sortOrder) {
      filter = filter.set(filterType, Map({ [sortKey]: sortOrder }));
    } else {
      filter = filter.deleteIn([filterType, sortKey]);
    }

    yield call(onPersistFilter, filter);

    yield put(
      A.onSetSortBySuccess(
        makeActionResult({
          isOk: true,
          code: 'onSetSortBySuccess',
          data: { filter, filterId },
        })
      )
    );
  } catch (error) {
    handleError(error, {
      filterId,
      sortKey,
      sortOrder,
    });
  }
}

function* onSetGroupBy({
  payload: { filterId, groupId },
}: PayloadAction<OnSetGroupByPayload>) {
  try {
    const filterType = FilterType.GROUP_BY_FIELD;
    let filter = yield select(S.selectFilter, { filterId });
    if (!filter) {
      filter = Filter({ id: filterId });
    }
    if (groupId) {
      filter = filter.set(filterType, groupId);
    } else {
      filter = filter.delete(filterType);
    }

    yield call(onPersistFilter, filter);

    yield put(
      A.onSetGroupBySuccess(
        makeActionResult({
          isOk: true,
          code: 'onSetGroupBySuccess',
          data: { filter, filterId },
        })
      )
    );
  } catch (error) {
    handleError(error, {
      groupId,
      filterId,
    });
  }
}

function* onPersistFilter(filter: FilterRecordInterface) {
  try {
    const containerType = getFilterContainerType(filter.id);
    const containerId = getFilterContainerId(filter.id);
    switch (containerType) {
      case TaskFiltersContainerType.OVERWATCH_SPACE_TILE: {
        return yield onPresistViewSettings(filter, containerType, containerId);
      }
      case TaskFiltersContainerType.MY_TASKS: {
        const containerType = ViewContainerType.ORGANIZATION;
        return yield onPresistViewSettings(filter, containerType, containerId);
      }
      case TaskFiltersTargetType.TIMELINE: {
        const containerType = TaskFiltersContainerType.PROJECT;
        return yield onPresistViewSettings(filter, containerType, containerId);
      }
      case TaskFiltersTargetType.SCHEDULE: {
        const containerType = ViewContainerType.ORGANIZATION;
        return yield onPresistViewSettings(filter, containerType, containerId);
      }
      default:
        yield cps(
          localStorage.setItem,
          filter.id,
          JSON.stringify(filter.toJS())
        );
        break;
    }
  } catch (error) {
    handleError(error);
  }
}

function* onPresistViewSettings(
  filter: FilterRecordInterface,
  containerType: TaskFiltersContainerType | ViewContainerType,
  containerId: Id
) {
  try {
    const containerViewIds = yield select(selectViewSettingsIdsByContainerId, {
      containerId,
      containerType,
    });
    const parsedFilters = filter.toJS();
    for (let viewId of containerViewIds) {
      yield put(onUpdateViewSettingsBody(viewId, { filters: parsedFilters }));
    }
  } catch (error) {
    handleError(error);
  }
}

export function* onClearFilters({
  payload: { filterId },
}: PayloadAction<OnClearFiltersPayload>) {
  try {
    const filter = Filter({ id: filterId });
    yield call(onPersistFilter, filter);

    yield put(
      A.onClearFiltersSuccess(
        makeActionResult({
          isOk: true,
          code: 'onClearFiltersSuccess',
          data: { filter, filterId },
        })
      )
    );
  } catch (error) {
    handleError(error, { filterId });
  }
}
