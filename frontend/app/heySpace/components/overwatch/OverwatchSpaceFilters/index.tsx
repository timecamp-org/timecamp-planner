import React from 'react';

import { Id } from 'common/utils/identifier';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import { useTranslation } from 'i18n';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';

import FiltersButtonWithCounterIcon from '../../tasks/taskFilters/FiltersButtonWithCounterIcon';
import TaskFilters from '../../tasks/taskFilters/TaskFilters';

import styles from './styles.css';

export type OverwatchSpaceFiltersInterface = {
  spaceId: Id;
  filterId?: Id;
  targetType: TaskFiltersTargetType;
  containerType: TaskFiltersContainerType;
  isFiltersOpen: boolean;

  onToggleFilters?: VoidFunction;
  onCloseFilters?: VoidFunction;
};

const OverwatchSpaceFilters: React.FC<OverwatchSpaceFiltersInterface> = (props): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <PopoverContent isVisible={props.isFiltersOpen} onClickOutside={props.onCloseFilters}>
      <UniversalPopover
        isPopoverOpened={props.isFiltersOpen}
        popperContentWrapperClassName={styles.popperContentWrapperClassName}
        popperArrowFillClassName={styles.popperArrowFillClassName}
        targetComponent={
          <FiltersButtonWithCounterIcon
            containerType={props.containerType}
            targetType={props.targetType}
            containerId={props.spaceId}
            filterId={props.filterId}
            isActive={props.isFiltersOpen}
            onClick={props.onToggleFilters}
          />
        }
        popperComponent={
          <TaskFilters
            className={styles.filtersPanel}
            containerType={props.containerType}
            containerId={props.spaceId}
            filterId={props.filterId}
            targetType={props.targetType}
            isDueDatesEnabled={true}
            shouldRenderCloseIcon={true}
            onCloseFilters={props.onCloseFilters}
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

export default OverwatchSpaceFilters;
