import React from 'react';

import { ChartGantt } from 'commonComponents/Icons/fontawesome/ChartGantt';
import TooltipedDisabledFreePlanElement from 'commonComponents/TooltipedDisabledFreePlanElement';
import NavButton from 'components/buttons/NavButton/NavButton';
import { useTranslation } from 'i18n';
import { getConditionalClass } from 'utils/getConditionalClass';

import { NavSidebarButtonLayout } from '../../common/Layouts/Navigation/NavSidebarButtonLayout';

import styles from './styles.css';

interface ScheduleButtonInterface {
  isCollapsed?: boolean;
}

export const ScheduleButton: React.FC<ScheduleButtonInterface> = ({ isCollapsed = false }) => {
  const { t } = useTranslation();

  return (
    <TooltipedDisabledFreePlanElement className={styles.buttonWrapper}>
      {(isDisabled) => (
        <NavButton
          to="/schedule"
          className={isDisabled ? styles.disabledButton : `${getConditionalClass(styles.buttonCollapsed, isCollapsed)}`}
          isDisabled={isDisabled}
          isCollapsed={isCollapsed}
        >
          <NavSidebarButtonLayout
            icon={<ChartGantt className={getConditionalClass(styles.icon, !isCollapsed)} />}
            text={!isCollapsed && <div> {t('Planner')}</div>}
          />
        </NavButton>
      )}
    </TooltipedDisabledFreePlanElement>
  );
};
