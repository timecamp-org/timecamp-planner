import { Button } from '@mui/material';
import { doNothing } from 'common/utils';
import GuestProfileModal from 'components/settings/workspaceSettings/GuestProfileModal';
import { useTranslation } from 'i18n';
import PropTypes from 'prop-types';

const buttonStyles = {
  textTransform: 'unset',
  fontWeight: 'var(--fontWeight-regular)',
  color: 'var(--color-gray-900)',
  '&:hover': {
    color: 'var(--color-primary-500)',
    background: 'transparent',
  },
  '&:active': {
    color: 'var(--color-primary-500)',
    background: 'transparent',
  },
};

ReactivateUserButton.propTypes = {
  userId: PropTypes.string.isRequired,
  className: PropTypes.string,
  isGuestProfileVisible: PropTypes.bool,

  onReactivateUserFromOrganization: PropTypes.func,
  onSetIsModalVisible: PropTypes.func,
};

ReactivateUserButton.defaultProps = {
  isGuestProfileVisible: false,

  onReactivateUserFromOrganization: doNothing,
  onSetIsModalVisible: doNothing,
};

function ReactivateUserButton(props) {
  const { t } = useTranslation();

  return (
    <>
      <Button sx={buttonStyles} disableRipple variant="text" onClick={props.onReactivateUserFromOrganization}>
        {t('Reactivate')}
      </Button>
      {renderGuestProfile(props, t)}
    </>
  );
}

function renderGuestProfile(props, t) {
  return (
    <GuestProfileModal
      isModalVisible={props.isGuestProfileVisible}
      userId={props.userId}
      onSetIsModalVisible={props.onSetIsModalVisible}
    />
  );
}

export default ReactivateUserButton;
