import React from 'react';

import { Telescope } from 'commonComponents/Icons/fontawesome/Telescope';
import TooltipedDisabledFreePlanElement from 'commonComponents/TooltipedDisabledFreePlanElement';
import NavButton from 'components/buttons/NavButton/NavButton';
import { useTranslation } from 'i18n';
import { getConditionalClass } from 'utils/getConditionalClass';

import { NavSidebarButtonLayout } from '../../common/Layouts/Navigation/NavSidebarButtonLayout';

import styles from './styles.css';

interface Props {
  isCollapsed?: boolean;
}

const OverwatchButton: React.FC<Props> = ({ isCollapsed = false }) => {
  const { t } = useTranslation();

  return (
    <TooltipedDisabledFreePlanElement className={styles.overwatchButtonWrapper}>
      {(isDisabled) => (
        <NavButton
          to="/overwatch"
          className={
            isDisabled ? styles.disabledOverwatchButton : `${getConditionalClass(styles.buttonCollapsed, isCollapsed)}`
          }
          isDisabled={isDisabled}
          isCollapsed={isCollapsed}
        >
          <NavSidebarButtonLayout
            icon={<Telescope className={getConditionalClass(styles.icon, !isCollapsed)} />}
            text={!isCollapsed && t('Overwatch')}
          />
        </NavButton>
      )}
    </TooltipedDisabledFreePlanElement>
  );
};

export default OverwatchButton;
