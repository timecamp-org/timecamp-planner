import React from 'react';

import { CheckList } from 'commonComponents/Icons/fontawesome/CheckList';
import { NavSidebarButtonLayout } from 'commonComponents/Layouts/Navigation';
import TooltipedDisabledFreePlanElement from 'commonComponents/TooltipedDisabledFreePlanElement';
import NavButton from 'components/buttons/NavButton/NavButton';
import { useTranslation } from 'i18n';
import { getConditionalClass } from 'utils/getConditionalClass';

import styles from './styles.css';

interface Props {
  isCollapsed?: boolean;
}

const MyTasksButton: React.FC<Props> = ({ isCollapsed = false }) => {
  const { t } = useTranslation();

  return (
    <TooltipedDisabledFreePlanElement className={styles.buttonWrapper}>
      {(isDisabled) => (
        <NavButton
          to="/myTasks"
          className={isDisabled ? styles.disabledButton : `${getConditionalClass(styles.buttonCollapsed, isCollapsed)}`}
          isDisabled={isDisabled}
          isCollapsed={isCollapsed}
        >
          <NavSidebarButtonLayout
            icon={<CheckList className={getConditionalClass(styles.icon, !isCollapsed)} />}
            text={!isCollapsed && t('My tasks')}
          />
        </NavButton>
      )}
    </TooltipedDisabledFreePlanElement>
  );
};

export default MyTasksButton;
