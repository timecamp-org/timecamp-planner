import { Id } from 'common/utils/identifier'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import * as FiltersModelActions from 'models/component/FiltersModel/actions'
import { AnyDict } from 'common/types'
import { selectFiltersCount, selectFilterBy, selectFilter } from 'models/component/FiltersModel/selectors'
import { FiltersRightPanelChatInterface } from '.'
import { makeFilterId } from 'models/component/FiltersModel/utils'
import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'

export type DataProviderHookInterface = {
  color: string,
  filtersCount: number,
  filterBy: AnyDict,
  filterId: Id,
}

export function useDataProvider(props: FiltersRightPanelChatInterface): DataProviderHookInterface {
  const currentUserId = useSelector(selectCurrentUserId)
  const filterId = makeFilterId(currentUserId, props.targetType, props.containerId)
  return {
    filtersCount: useSelector(state => selectFiltersCount(state, { filterId })),
    filterBy: useSelector(state => selectFilterBy(state, { filterId })),
    filterId,
    color: useSelector(state => selectProjectColor(state, { projectId: props.containerId })),
  }
}

export type DataPersisterHookInterface = {
  onClearFilters: (filterId: Id) => void
}

export function useDataPersister(): DataPersisterHookInterface {
  const dispatch = useDispatch()
  return {
    onClearFilters: useCallback(
      (filterId: Id) => dispatch(FiltersModelActions.onClearFilters(filterId)),
      [dispatch]
    ),
  }
}
