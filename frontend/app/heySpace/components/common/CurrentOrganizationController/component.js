import React from 'react';
import PropTypes from 'prop-types';

import PrimaryButton from 'components/buttons/PrimaryButton';
import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';

import styles from './styles.css';

CurrentOrganizationController.propTypes = {
  ownerEmail: PropTypes.string,
  currentOrganizationName: PropTypes.string,
  isOrganizationArchived: PropTypes.bool.isRequired,
  isOrganizationOwner: PropTypes.bool,
};

CurrentOrganizationController.defaultTypes = {
  ownerEmail: '',
  currentOrganizationName: '',
  isOrganizationArchived: false,
  isOrganizationOwner: false,
};

function CurrentOrganizationController(props) {
  if (!props.isOrganizationArchived) {
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
          {t(`Workspace {{organizationName}} has been archived!`, {
            organizationName: props.currentOrganizationName,
          })}
        </div>
        <div className={styles.mascot} />
        {props.isOrganizationOwner || (
          <div className={styles.text}>
            {t(
              `In order to retrieve the access to this workspace contact {{email}}`,
              { email: props.ownerEmail }
            )}
          </div>
        )}

        <div className={styles.button}>
          <PrimaryButton onClick={props.onRedirectFromThisWorkspace}>
            {t(`Got it!`)}
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

export default CurrentOrganizationController;
