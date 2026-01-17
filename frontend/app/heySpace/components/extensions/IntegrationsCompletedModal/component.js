import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List, Map } from 'immutable';

import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';
import * as IntegrationStatus from 'models/domain/IntegrationsModel/constants/integrationStatus';

const emptyList = new List();
const emptyMap = new Map();

IntegrationsCompletedModal.propTypes = {
  integrationsToShow: ImmutablePropTypes.list,
  extensionNames: ImmutablePropTypes.map,
  onCloseModal: PropTypes.func,
};

IntegrationsCompletedModal.defaultProps = {
  integrationsToShow: emptyList,
  extensionNames: emptyMap,
  onCloseModal: doNothing,
};

function IntegrationsCompletedModal(props) {
  const { t } = useTranslation();

  return (
    <UniversalModal
      isModalOpen={props.integrationsToShow.size > 0}
      shouldRenderHeader={true}
      shouldRenderFooter={true}
      shouldRenderCloseIcon={false}
      header={getHeader(props, t)}
      onSetIsModalOpen={props.onCloseModal}
      innerModalDialogClassName={styles.innerModalDialog}
      headerClassName={styles.modalHeader}
      saveButtonCaption={t('Got it!')}
      shouldRenderCancelButton={false}
      saveButtonClassName={styles.saveButton}
    >
      {renderModalContent(props, t)}
    </UniversalModal>
  );
}

function getHeader(props, t) {
  const firstIntegration = props.integrationsToShow.first();
  const firstIntegrationStatus = firstIntegration ? firstIntegration.get('status') : null;
  return props.integrationsToShow.size > 1
    ? t('Almost there!')
    : firstIntegrationStatus === IntegrationStatus.SUCCESS
    ? t('Success!')
    : t('Ops!');
}

function renderModalContent(props, t) {
  const succesfulIntegrations = props.integrationsToShow.filter(
    (integration) => integration.get('status') === IntegrationStatus.SUCCESS
  );
  const succesfulIntegrationIds = succesfulIntegrations.map((integration) => integration.get('extensionId'));
  const failedIntegrations = props.integrationsToShow.filter(
    (integration) => integration.get('status') === IntegrationStatus.FAILURE
  );
  const failedIntegrationIds = failedIntegrations.map((integration) => integration.get('extensionId'));
  return (
    <div>
      {succesfulIntegrations.size > 0 &&
        renderSuccessfulIntegrationsMessage(succesfulIntegrationIds, props.extensionNames, t)}
      {failedIntegrations.size > 0 && renderFailedIntegrationsMessage(failedIntegrationIds, props.extensionNames, t)}
    </div>
  );
}

function renderSuccessfulIntegrationsMessage(succesfulIntegrationIds, extensionNames, t) {
  return (
    <div className={styles.paragraph}>
      {t(`Your {{names}} have completed succesfully and are ready for a test ride!`, {
        names: getIntegrationNamesString(succesfulIntegrationIds, extensionNames, t),
      })}
    </div>
  );
}

function renderFailedIntegrationsMessage(failedIntegrationIds, extensionNames, t) {
  return (
    <div className={styles.paragraph}>
      {t(`{{names}} have failed to complete.`, {
        names: getIntegrationNamesString(failedIntegrationIds, extensionNames, t),
      })}
      <div>{t(`Please try again later or contact us at planner@timecamp.com`)}</div>
    </div>
  );
}

function getIntegrationNamesString(integrationIds, extensionNames, t) {
  let result = ``;
  integrationIds.forEach((integrationId, index) => {
    result += t(extensionNames.get(integrationId));

    if (index !== integrationIds.size - 1) {
      result += t(' and ');
    }
  });

  return result;
}

export default IntegrationsCompletedModal;
