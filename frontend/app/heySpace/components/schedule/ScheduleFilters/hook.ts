import useElementOpen from 'common/hooks/useElementOpen';
import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';

export interface MyTasksFiltersHookInterface {
  isFiltersOpen: boolean;
  currentOrganizationId: Id;
  taskFiltersTargetType: TaskFiltersTargetType;
  onToggleFilters: VoidFunction;
  onCloseFilters: VoidFunction;
}

export const useComponent = (): MyTasksFiltersHookInterface => {
  const currentOrganizationId = useSelector(selectCurrentOrganizationId);
  const taskFiltersTargetType = TaskFiltersTargetType.TIMELINE;
  const { isOpen: isFiltersOpen, onToggleOpen: onToggleFilters, onClose: onCloseFilters } = useElementOpen();

  return {
    isFiltersOpen,
    currentOrganizationId,
    taskFiltersTargetType,
    onToggleFilters,
    onCloseFilters,
  };
};
