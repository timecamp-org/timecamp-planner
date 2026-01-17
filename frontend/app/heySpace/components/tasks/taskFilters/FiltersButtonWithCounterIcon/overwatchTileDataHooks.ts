import { FiltersButtonWithCounterInterface } from '.'
import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { makeFilterId } from 'models/component/FiltersModel/utils'
import * as FiltersModelSelectors from 'models/component/FiltersModel/selectors'
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types'
import { DataProviderHookInterface } from './dataHooks'

export function useDataProvider(props: FiltersButtonWithCounterInterface): DataProviderHookInterface {
  const currentUserId = useSelector(state => selectCurrentUserId(state))
  const filterId = makeFilterId(currentUserId, TaskFiltersContainerType.OVERWATCH_SPACE_TILE, props.containerId)
  return {
    filtersCount: useSelector(state => FiltersModelSelectors.selectFiltersCount(state, { filterId })),
    filterBy: useSelector(state => FiltersModelSelectors.selectFilterBy(state, { filterId })),
    filterId,
    color: useSelector(state => selectProjectColor(state, { projectId: props.containerId })),
  }
}
