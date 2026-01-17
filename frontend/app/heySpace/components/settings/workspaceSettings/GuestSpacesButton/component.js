import PropTypes from 'prop-types';
import { useState } from 'react';

import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';

import InfoTooltip from 'commonComponents/InfoTooltip';
import GuestProfileModal from 'components/settings/workspaceSettings/GuestProfileModal';

import { Button } from '@mui/material';
import styles from './styles.css';

const buttonStyles = {
  textTransform: 'unset',
  paddingLeft: 0,
  paddingRight: 0,
  color: 'var(--color-gray-900)',
  fontWeight: 'var(--fontWeight-regular)',
  '&:hover': {
    color: 'var(--color-primary-500)',
    background: 'transparent',
  },
  '&:active': {
    color: 'var(--color-primary-500)',
    background: 'transparent',
  },
};

GuestSpacesButton.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string.isRequired,
  displayValue: PropTypes.string,
  displayShortValue: PropTypes.string,
  isTooltipVisible: PropTypes.bool,
  isCurrentUserWorkspaceAdmin: PropTypes.bool,
  hiddenSpacesCount: PropTypes.number,
  spacesCount: PropTypes.number,

  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

GuestSpacesButton.defaultProps = {
  className: '',
  displayValue: '',
  displayShortValue: '',
  isTooltipVisible: false,
  isCurrentUserWorkspaceAdmin: false,
  hiddenSpacesCount: 0,
  spacesCount: 0,

  onClick: doNothing,
  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
};

function GuestSpacesButton(props) {
  const { t } = useTranslation();
  const [isModalVisible, onSetIsModalVisible] = useState(false);
  return props.isCurrentUserWorkspaceAdmin
    ? renderTooltipedButton(props, t, isModalVisible, onSetIsModalVisible)
    : renderSpacesCount(props, t);
}

function renderTooltipedButton(props, t, isModalVisible, onSetIsModalVisible) {
  return (
    <>
      <InfoTooltip
        shouldRenderInfoTooltip={props.isTooltipVisible}
        infoTooltipWrapperClassName={styles.infoTooltip}
        targetWrapperClassName={styles.targetWrapperClassName}
        popperPlacement={'bottom'}
        targetComponent={
          <div onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
            {renderButton(props, onSetIsModalVisible)}
          </div>
        }
        popperModifiers={{
          offset: {
            offset: `0, 5`,
          },
        }}
        message={getMessage(props, t)}
      />
      <GuestProfileModal
        userId={props.userId}
        onSetIsModalVisible={onSetIsModalVisible}
        isModalVisible={isModalVisible}
      />
    </>
  );
}

function getMessage(props, t) {
  return props.hiddenSpacesCount > 0
    ? t('Guest in {{spaces}} and {{countMore}} more...', {
        spaces: props.displayValue,
        countMore: props.hiddenSpacesCount,
      })
    : t('Guest in {{spaces}}', { spaces: props.displayValue });
}

function renderButton(props, onSetIsModalVisible) {
  return (
    <Button disableRipple sx={buttonStyles} variant="text" onClick={() => onSetIsModalVisible(true)}>
      {props.displayShortValue}
    </Button>
  );
}

function renderSpacesCount(props, t) {
  return <span className={styles.spaceScount}>{t('{{count}} projects', { count: props.spacesCount })}</span>;
}

export default GuestSpacesButton;
