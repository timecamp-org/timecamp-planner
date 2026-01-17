import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import SecondaryButton from 'components/buttons/SecondaryButton';
import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';

import { PowerOff } from 'commonComponents/Icons/fontawesome/PowerOff';

LogoutButton.propTypes = {
  onSignOut: PropTypes.func,
  className: PropTypes.string
};

LogoutButton.defaultProps = {
  onSignOut: () => {},
};

function LogoutButton(props) {
  const { t } = useTranslation();
  return (
    <div>
      <SecondaryButton className={props.className || styles.button} onClick={props.onTrySignOut}>
        <PowerOff className={styles.icon}/>
        <span>{t('Log out')}</span>
      </SecondaryButton>
      <UniversalModal
        isModalOpen={props.isModalOpen}
        saveButtonCaption={t('LOG OUT')}
        header={t('Log out')}
        onModalSave={props.onSignOut}
        onSetIsModalOpen={props.onSetIsModalOpen}
      >
        {t(
          'It looks like your file is still uploading. If you leave the page, your changes will be lost. Are you sure you want to log out?'
        )}
      </UniversalModal>
    </div>
  );
}

export default LogoutButton;
