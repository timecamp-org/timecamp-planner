import useElementOpen from 'common/hooks/useElementOpen';
import { useSelector } from 'common/hooks/useSelector';
import { AnyDict } from 'common/types';
import { Id } from 'common/utils/identifier';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { useParams } from 'react-router';
import { MyTasksPanelType } from '../types';

export interface MyTasksFiltersHookInterface {
  isFiltersOpen: boolean;
  currentOrganizationId: Id;
  taskFiltersTargetType: TaskFiltersTargetType;
  onToggleFilters: VoidFunction;
  onCloseFilters: VoidFunction;
}

export const useComponent = (): MyTasksFiltersHookInterface => {
  const {
    isOpen: isFiltersOpen,
    onToggleOpen: onToggleFilters,
    onClose: onCloseFilters,
  } = useElementOpen();

  const currentOrganizationId = useSelector(selectCurrentOrganizationId);
  const params = useParams<AnyDict>();

  const taskFiltersTargetType = getTaskFiltersTargetType(
    params.myTasksPanelType
  );

  return {
    isFiltersOpen,
    currentOrganizationId,
    taskFiltersTargetType,
    onToggleFilters,
    onCloseFilters,
  };
};

function getTaskFiltersTargetType(
  myTasksPanelType: MyTasksPanelType
): TaskFiltersTargetType {
  switch (myTasksPanelType) {
    case MyTasksPanelType.CALENDAR:
      return TaskFiltersTargetType.CALENDAR;
    case MyTasksPanelType.LIST:
      return TaskFiltersTargetType.TASK_LIST;
    default:
      return null;
  }
}
