
import InfoTooltip from 'commonComponents/InfoTooltip';

import useOnHover from 'hooks/useOnHover';
import { useTranslation } from 'i18n';

import React, { memo, PropsWithChildren } from 'react';

import commonStyles from 'styles/common.css';

import { actionInfoMessage, ActionType } from './constants';
import styles from './styles.css';

const transitionDuration = 100; // ms

type WrappedActionInterface = PropsWithChildren<{
  actionType: ActionType;
}>
  

const WrappedAction: React.FC<WrappedActionInterface> = ({
    actionType,
    children,
  }) => {
    const { t } = useTranslation();
    const { isHovering, onMouseEnter, onMouseLeave } =
      useOnHover<HTMLDivElement>();
  
    return (
      <InfoTooltip
        shouldRenderInfoTooltip={isHovering}
        infoTooltipWrapperClassName={styles.infoTooltip}
        popperPlacement={'top'}
        transitionDuration={transitionDuration}
        // @ts-ignore
        renderWrappedAction
        targetComponent={
          <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {children}
          </div>
        }
        popperModifiers={{
          offset: {
            offset: `0, ${commonStyles.gridCellSize}`,
          },
        }}
        title={t(actionInfoMessage[actionType])}
      />
    );
  };

  


  export default memo(WrappedAction)