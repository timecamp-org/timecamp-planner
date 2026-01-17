import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Id } from 'common/utils/identifier';
import { DropdownChevron as DropdownChevronDown } from 'commonComponents/Icons/index-NEW';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import Button from 'components/buttons/Button';
import { ButtonKind } from 'components/buttons/Button/types';
import { useTranslation } from 'i18n';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors';

import FiltersButtonWithCounter from '../../tasks/taskFilters/FiltersButtonWithCounter';
import TaskFilters from '../../tasks/taskFilters/TaskFilters';

import { useComponent } from './hook';
import styles from './styles.css';

interface ScheduleFiltersInterface {
  filterId?: Id;
}

const GET_PROJECTS_PARAMS = { isMember: false };
const requestType = getRequestTypeWithParams(RequestTypesConstants.getOrganizationProjects, GET_PROJECTS_PARAMS);

export const ScheduleFilters: FC<ScheduleFiltersInterface> = ({ filterId }) => {
  const { t } = useTranslation();
  const { isFiltersOpen, currentOrganizationId, onCloseFilters, onToggleFilters } = useComponent();
  const dispatch = useDispatch();
  const areProjectsLoaded = useSelector((state) =>
    selectRequestIsSuccess(state, {
      requestType,
      objectId: currentOrganizationId,
    })
  );

  useEffect(() => {
    if (!areProjectsLoaded) {
      dispatch(ProjectsModelActions.onGetOrganizationProjects(GET_PROJECTS_PARAMS));
    }
  }, [dispatch, areProjectsLoaded]);

  return (
    <PopoverContent isVisible={isFiltersOpen} onClickOutside={onCloseFilters}>
      <UniversalPopover
        isPopoverOpened={isFiltersOpen}
        popperContentWrapperClassName={styles.popperContentWrapperClassName}
        popperArrowFillClassName={styles.popperArrowFillClassName}
        targetComponent={
          <FiltersButtonWithCounter
            className={styles.button}
            containerType={TaskFiltersContainerType.SCHEDULE}
            containerId={currentOrganizationId}
            targetType={TaskFiltersTargetType.SCHEDULE}
            targetRenderer={renderFiltersButton}
          />
        }
        popperComponent={
          <TaskFilters
            className={styles.filtersPanel}
            containerType={TaskFiltersContainerType.SCHEDULE}
            targetType={TaskFiltersTargetType.SCHEDULE}
            containerId={currentOrganizationId}
            shouldRenderCloseIcon
            onCloseFilters={onCloseFilters}
            filterId={filterId}
            isProjectsSectionVisible
            isUserGroupVisible
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

  function renderFiltersButton() {
    return (
      <Button isActive={isFiltersOpen} kind={ButtonKind.DEFAULT} onClick={onToggleFilters}>
        {t('Filters')}
        <DropdownChevronDown className={isFiltersOpen ? styles.chevronIconUp : styles.chevronIcon} />
      </Button>
    );
  }
};
