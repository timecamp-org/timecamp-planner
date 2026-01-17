import { useSelector } from 'react-redux';

import * as FiltersModelSelectors from 'models/component/FiltersModel/selectors';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { DataProvideHookType } from './dataHooks';

export const useScheduleDataProvider: DataProvideHookType = (props) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const currentOrganizationId = useSelector(selectCurrentOrganizationId);
  const filterId =
    props.filterId ||
    makeFilterId(
      currentUserId,
      TaskFiltersContainerType.SCHEDULE,
      currentOrganizationId
    );

  return {
    filtersCount: useSelector((state) =>
      FiltersModelSelectors.selectFiltersCount(state, { filterId })
    ),
    filterBy: useSelector((state) =>
      FiltersModelSelectors.selectFilterBy(state, { filterId })
    ),
    filterId,
  };
};
