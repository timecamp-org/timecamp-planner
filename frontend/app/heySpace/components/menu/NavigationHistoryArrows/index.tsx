import React, { memo } from 'react';
import SecondaryButton from 'components/buttons/SecondaryButton';

import styles from './styles.css';
import useComponent from './hook';
import { ChevronLeft } from 'commonComponents/Icons/fontawesome/ChevronLeft';
import { ChevronRight } from 'commonComponents/Icons/fontawesome/ChevronRight';

const NavigationHistoryArrows = () => {
  const hook = useComponent();

  return (
    <div className={styles.Component}>
      <SecondaryButton onClick={hook.onGoPrevious} isDisabled={!hook.previousUrl}>
        <ChevronLeft className={!hook.previousUrl ? styles.disabledIcon : styles.icon} />
      </SecondaryButton>

      <SecondaryButton onClick={hook.onGoNext} isDisabled={!hook.nextUrl}>
        <ChevronRight className={!hook.nextUrl ? styles.disabledIcon : styles.icon} />
      </SecondaryButton>
    </div>
  );
};

export default memo(NavigationHistoryArrows, () => true);
