import { useState } from 'react';

import InfoTooltip from 'commonComponents/InfoTooltip';

import styles from '../../styles.css';

import LinkComponent, { LinkComponentProps } from './LinkComponent';

type RightPanelLinkProps = {
  color: string;
  message: string;
} & Omit<LinkComponentProps, 'onSetIsHovering'>;

const RightPanelLink = (props: RightPanelLinkProps) => {
  const [isHovering, onSetIsHovering] = useState(false);

  return (
    <InfoTooltip
      shouldRenderInfoTooltip={isHovering}
      popperPlacement={'bottom'}
      targetComponent={<LinkComponent {...props} onSetIsHovering={onSetIsHovering} />}
      message={props.message}
      infoTooltipWrapperClassName={styles.infoTooltip}
      popperModifiers={{
        offset: {
          offset: `0, 5`,
        },
      }}
    />
  );
};

export default RightPanelLink;
