import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';

import PrimaryButton from 'components/buttons/PrimaryButton';
import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';
import LoadingDots from 'commonComponents/LoadingDots';

OAuth1AuthorizedDataImportController.propTypes = {
  isImportDataModalOpen: PropTypes.bool,
  isOAuthAuthorizationFailure: PropTypes.bool,
  isOAuth1Authorized: PropTypes.bool,

  onOpenImportDataModal: PropTypes.func,
  onCloseImportDataModal: PropTypes.func,
  onSetIsImportDataModalOpen: PropTypes.func,
  onStartImport: PropTypes.func,
};

OAuth1AuthorizedDataImportController.defaultProps = {
  isImportDataModalOpen: false,
  isOAuthAuthorizationFailure: false,
  isOAuth1Authorized: false,
  apiKey: '',
  oauthSecret: '',

  onOpenImportDataModal: doNothing,
  onCloseImportDataModal: doNothing,
  onSetIsImportDataModalOpen: doNothing,
  onStartImport: doNothing,
};

function OAuth1AuthorizedDataImportController(props) {
  const { t } = useTranslation();
  return <Fragment>{renderImportDataModal(props, t)}</Fragment>;
}

function renderImportDataModal(props, t) {
  return (
    <UniversalModal
      isModalOpen={props.isImportDataModalOpen}
      shouldRenderHeader={false}
      shouldRenderFooter={false}
      shouldRenderCloseIcon={true}
      onSetIsModalOpen={props.onSetIsImportDataModalOpen}
    >
      {renderModalContent(props, t)}
    </UniversalModal>
  );
}

function renderModalContent(props, t) {
  if (props.isOAuthAuthorizationFailure) {
    return (
      <div className={styles.errorMessage}>
        {t(`Authorization failed. Please try again`)}
      </div>
    );
  }

  if (!props.isOAuth1Authorized) {
    return (
      <div className={styles.modalContent}>
        <LoadingDots className={styles.loadingDots} />
      </div>
    );
  }

  return (
    <div className={styles.modalContent}>
      <div className={styles.header}>{t(`You’re almost there!`)}</div>
      <div className={styles.text}>
        {t(`The synchronisation might take around an hour - depending on number of your boards.
You will be notified once it’s completed!`)}
      </div>
      <div className={styles.completeButtonWrapper}>
        <PrimaryButton onClick={props.onStartImport}>
          {t('Start importing data')}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default OAuth1AuthorizedDataImportController;
