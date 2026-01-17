import { getTaskFiltersTargetType } from 'components/chat/rightPanelChat/utils';
import FiltersButtonWithCounter from 'components/tasks/taskFilters/FiltersButtonWithCounter';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { RightPanelType } from 'models/domain/ProjectsSettingsModel/types';
import { NavLink } from 'react-router-dom';

import styles from '../../styles.css';
import { BaseHeaderProps } from '../../types';

type FilterNavLink = Pick<BaseHeaderProps, 'projectId' | 'isRightPanelActive' | 'projectPanelType'> & {
  to: string;
};

const FilterNavlink = ({ to, isRightPanelActive, projectId, projectPanelType }: FilterNavLink) => {
  return (
    <NavLink className={isRightPanelActive(RightPanelType.FILTERS) ? styles.navLinkActive : styles.navLink} to={to}>
      <FiltersButtonWithCounter
        containerType={TaskFiltersContainerType.PROJECT}
        containerId={projectId}
        targetType={getTaskFiltersTargetType(projectPanelType)}
        buttonClassName={styles.link}
        isActive={isRightPanelActive(RightPanelType.FILTERS)}
      />
    </NavLink>
  );
};

export default FilterNavlink;
