import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';
import commonStyles from 'styles/common.css';

import PersonIcon from 'components/person/PersonIcon';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInfoPopper from 'commonComponents/UserInfoPopper';

const popperModifiers = {
  offset: {
    offset: `0, ${parseInt(commonStyles.gridCellSize, 10) * 3}`,
  },
  preventOverflow: {
    escapeWithReference: false,
  },
};

PersonIconWithPopup.propTypes = {
  userId: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  isPopoverOpened: PropTypes.bool,
  onUserIconClick: PropTypes.func,
  onClosePopover: PropTypes.func,
};

PersonIconWithPopup.defaultProps = {
  isPopoverOpened: false,
  onUserIconClick: doNothing,
  onClosePopover: doNothing,
};

function PersonIconWithPopup(props) {
  if (!props.isPopoverOpened) {
    return renderPersonIcon(props);
  }

  return (
    <UniversalPopover
      isPopoverOpened={props.isPopoverOpened}
      targetClassName={styles.targetClassName}
      targetComponent={renderPersonIcon(props)}
      popperComponent={<UserInfoPopper userId={props.userId} onHide={props.onClosePopover} />}
      popperPlacement={'top'}
      popperModifiers={popperModifiers}
    />
  );
}

function renderPersonIcon(props) {
  return (
    <PersonIcon
      wrapperClassName={styles.personIcon}
      userId={props.userId}
      onClick={props.onUserIconClick}
      width={props.width}
      height={props.height}
    />
  );
}

export default memo(PersonIconWithPopup);
