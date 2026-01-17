import { doNothing } from 'common/utils';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInfoPopper from 'commonComponents/UserInfoPopper';
import PersonFullName from 'components/person/PersonFullName';
import PropTypes from 'prop-types';
import commonStyles from 'styles/common.css';
import styles from './styles.css';

PersonFullNameWithPopup.propTypes = {
  userId: PropTypes.string.isRequired,
  isPopoverOpened: PropTypes.bool,
  onUserNameClick: PropTypes.func,
  onClosePopover: PropTypes.func,
};

PersonFullNameWithPopup.defaultProps = {
  isPopoverOpened: false,
  onUserNameClick: doNothing,
  onClosePopover: doNothing,
};

function PersonFullNameWithPopup(props) {
  if (!props.isPopoverOpened) {
    return renderPersonFullName(props);
  }

  return (
    <UniversalPopover
      isPopoverOpened={props.isPopoverOpened}
      targetComponent={renderPersonFullName(props)}
      popperComponent={<UserInfoPopper userId={props.userId} onHide={props.onClosePopover} />}
      popperPlacement={'top'}
      popperModifiers={{
        offset: {
          offset: `0, ${parseInt(commonStyles.gridCellSize, 10) * 3}`,
        },
        preventOverflow: {
          escapeWithReference: false,
        },
      }}
    />
  );
}

function renderPersonFullName(props) {
  return (
    <PersonFullName
      className={`${styles.personName} ${props.isPopoverOpened ? styles.popupOpened : ''}`}
      userId={props.userId}
      onClick={props.onUserNameClick}
    />
  );
}

export default PersonFullNameWithPopup;
