import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { makeFilterId } from 'models/component/FiltersModel/utils'
import * as FiltersModelSelectors from 'models/component/FiltersModel/selectors'
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types'
import { DataProviderHookInterface } from './dataHooks'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { FiltersButtonWithCounterInterface } from '.'

export function useDataProvider(props: FiltersButtonWithCounterInterface): DataProviderHookInterface {
  const currentUserId = useSelector(selectCurrentUserId)
  const currentOrganizationId = useSelector(selectCurrentOrganizationId)
  const filterId = props.filterId || makeFilterId(currentUserId, TaskFiltersContainerType.MY_TASKS, currentOrganizationId)
  return {
    filtersCount: useSelector(state => FiltersModelSelectors.selectFiltersCount(state, { filterId })),
    filterBy: useSelector(state => FiltersModelSelectors.selectFilterBy(state, { filterId })),
    filterId,
  }
}
