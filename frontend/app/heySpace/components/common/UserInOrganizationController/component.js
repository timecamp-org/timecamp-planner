import React from 'react';
import PropTypes from 'prop-types';

import PrimaryButton from 'components/buttons/PrimaryButton';
import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';
import { doNothing } from 'common/utils';

import styles from './styles.css';

UserInOrganizationController.propTypes = {
  ownerEmail: PropTypes.string,
  currentOrganizationName: PropTypes.string,

  isUserRemovedFromOrganization: PropTypes.bool.isRequired,
  onRedirectFromThisWorkspace: PropTypes.func,
};

UserInOrganizationController.defaultTypes = {
  ownerEmail: '',
  currentOrganizationName: '',

  isUserRemovedFromOrganization: false,
  onRedirectFromThisWorkspace: doNothing,
};

function UserInOrganizationController(props) {
  if (!props.isUserRemovedFromOrganization) {
    return null;
  }

  return (
    <UniversalModal
      isModalOpen={true}
      shouldRenderHeader={false}
      shouldRenderFooter={false}
      shouldRenderCloseIcon={false}
    >
      {renderContent()}
    </UniversalModal>
  );

  function renderContent() {
    const { t } = useTranslation();
    return (
      <div className={styles.content}>
        <div className={styles.header}>
          {t(`You have been removed from the {{organizationName}} workspace!`, {
            organizationName: props.currentOrganizationName,
          })}
        </div>
        <div className={styles.mascot} />
        <div className={styles.text}>
          {t(
            `In order to retrieve the access to this workspace contact {{email}}`,
            { email: props.ownerEmail }
          )}
        </div>
        <div className={styles.button}>
          <PrimaryButton onClick={props.onRedirectFromThisWorkspace}>
            {t(`Got it!`)}
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

export default UserInOrganizationController;
