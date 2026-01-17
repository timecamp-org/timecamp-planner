import * as C from './constants'
import { action } from 'typesafe-actions'
import { Id } from 'common/utils/identifier'
import { ActionResultInterface, ActionResultPayload } from 'models/domain/ActionResultModel'
import { PayloadAction } from 'common/types'
import {
  OnInitPayload,
  OnSetFilterByPayload,
  OnSetGroupByPayload,
  OnClearFiltersPayload,
  OnBatchFiltersPayload,
  OnSetSortByPayload
} from './payloads'
import { FilterRecordInterface, SortOrder } from './types'
import { Map } from 'immutable'

export const onInit = (filterId: Id): PayloadAction<OnInitPayload> =>
  action(C.onInit, { filterId })

export const onSetFilterBy = (filterId: Id, filterKey: string, filterValue: string | number | boolean): PayloadAction<OnSetFilterByPayload> =>
  action(C.onSetFilterBy, { filterId, filterKey, filterValue })

export const onSetFilterBySuccess = (actionResult: ActionResultInterface): PayloadAction<ActionResultPayload> =>
  action(C.onSetFilterBySuccess, { actionResult })

export const onSetGroupBy = (filterId: Id, groupId: Id): PayloadAction<OnSetGroupByPayload> =>
  action(C.onSetGroupBy, { filterId, groupId })

export const onSetGroupBySuccess = (actionResult: ActionResultInterface): PayloadAction<ActionResultPayload> =>
  action(C.onSetGroupBySuccess, { actionResult })

export const onSetSortBy = (filterId: Id, sortKey: string, sortOrder: SortOrder): PayloadAction<OnSetSortByPayload> =>
  action(C.onSetSortBy, { filterId, sortKey, sortOrder })

export const onSetSortBySuccess = (actionResult: ActionResultInterface): PayloadAction<ActionResultPayload> =>
  action(C.onSetSortBySuccess, { actionResult })

export const onClearFilters = (filterId: Id): PayloadAction<OnClearFiltersPayload> =>
  action(C.onClearFilters, { filterId })

export const onClearFiltersSuccess = (actionResult: ActionResultInterface): PayloadAction<ActionResultPayload> =>
  action(C.onClearFiltersSuccess, { actionResult })

export const onBatchFilters = (filtersData: Map<Id, FilterRecordInterface>): PayloadAction<OnBatchFiltersPayload> =>
  action(C.onBatchFilters, { filtersData })