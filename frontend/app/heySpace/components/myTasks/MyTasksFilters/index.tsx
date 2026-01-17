import { BarsFilter } from 'commonComponents/Icons/fontawesome/BarsFilter';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import React from 'react';
import FiltersButtonWithCounter from '../../tasks/taskFilters/FiltersButtonWithCounter';
import TaskFilters from '../../tasks/taskFilters/TaskFilters';
import { useComponent } from './hook';
import styles from './styles.css';

type MyTasksFiltersInterface = {};

const MyTasksFilters: React.FC<MyTasksFiltersInterface> = (): React.ReactElement => {
  const { t } = useTranslation();
  const { isFiltersOpen, currentOrganizationId, taskFiltersTargetType, onCloseFilters, onToggleFilters } =
    useComponent();

  return (
    <PopoverContent isVisible={isFiltersOpen} onClickOutside={onCloseFilters}>
      <UniversalPopover
        isPopoverOpened={isFiltersOpen}
        popperContentWrapperClassName={styles.popperContentWrapperClassName}
        popperArrowFillClassName={styles.popperArrowFillClassName}
        targetComponent={
          <FiltersButtonWithCounter
            className={styles.button}
            containerType={TaskFiltersContainerType.MY_TASKS}
            containerId={currentOrganizationId}
            targetType={taskFiltersTargetType}
            onClick={onToggleFilters}
            isActive={isFiltersOpen}
          />
        }
        popperComponent={
          <TaskFilters
            className={styles.filtersPanel}
            containerType={TaskFiltersContainerType.MY_TASKS}
            containerId={currentOrganizationId}
            targetType={taskFiltersTargetType}
            isDueDatesEnabled={true}
            isProjectsSectionVisible={true}
            shouldRenderCloseIcon={true}
            onCloseFilters={onCloseFilters}
          />
        }
        popperPlacement={'bottom'}
        popperModifiers={{
          offset: {
            offset: `0, 20`,
          },
        }}
      />
    </PopoverContent>
  );
};

export default MyTasksFilters;
