import React, { useState } from 'react';
import { useTranslation } from 'i18n';
import styles from './styles.css';
import commonStyles from 'styles/common.css';

import InfoTooltip from 'commonComponents/InfoTooltip';
import { AlertCircle } from 'commonComponents/Icons';

export default function GuestHintIcon() {
  const { t } = useTranslation();
  const [isHoveringGuestInfo, onSetIsHoveringGuestInfo] = useState(false);
  return (
    <InfoTooltip
      shouldRenderInfoTooltip={isHoveringGuestInfo}
      infoTooltipWrapperClassName={styles.infoTooltip}
      popperPlacement={'bottom'}
      targetComponent={
        <div onMouseEnter={() => onSetIsHoveringGuestInfo(true)} onMouseLeave={() => onSetIsHoveringGuestInfo(false)}>
          <AlertCircle className={styles.alertIcon} />
        </div>
      }
      popperModifiers={{
        offset: {
          offset: `0, ${commonStyles.gridCellSize}`,
        },
      }}
      message={t('Each project to which you will invite the guest will be considered as one guest seat.')}
    />
  );
}
