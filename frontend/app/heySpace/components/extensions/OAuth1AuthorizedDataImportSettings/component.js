import { Fragment } from 'react';

import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { MoreVertical } from 'commonComponents/Icons';
import InfoTooltip from 'commonComponents/InfoTooltip';
import LoadingDots from 'commonComponents/LoadingDots';
import UniversalModal from 'commonComponents/UniversalModal';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInput from 'commonComponents/UserInput';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import { getConfig } from 'common/services/config';

import styles from './styles.css';

const getFrontendBaseUrl = () => {
  const config = getConfig();
  return config.webAppUrl 
    ? (config.webAppUrl.startsWith('http') ? config.webAppUrl : `https://${config.webAppUrl}`)
    : (process.env.FRONTEND_BASE_URL || 'http://localhost:3002');
};

OAuth1AuthorizedDataImportSettings.propTypes = {
  isOAuth1AuthorizedDataImportModalOpen: PropTypes.bool,
  isOAuthAuthorizationFailure: PropTypes.bool,
  isOAuth1Authorized: PropTypes.bool,
  isFetchingIsOAuth1AuthorizedFinished: PropTypes.bool,
  isGetIntegrationsFinished: PropTypes.bool,
  isIntegrationInProgress: PropTypes.bool,
  isHoveringInProgressButton: PropTypes.bool,
  isIntegrationSuccessful: PropTypes.bool,
  isOptionsOpen: PropTypes.bool,
  shouldRenderOptions: PropTypes.bool,
  apiKey: PropTypes.string,
  oauthSecret: PropTypes.string,
  displayedApplicationName: PropTypes.string,
  linkToApiKeyAndOAuth1Secret: PropTypes.string,

  onChangeApiKey: PropTypes.func,
  onChangeOAuthSecret: PropTypes.func,
  onOpenOAuth1AuthorizedDataImportModal: PropTypes.func,
  onCloseOAuth1AuthorizedDataImportModal: PropTypes.func,
  onSetIsOAuth1AuthorizedDataImportModalOpen: PropTypes.func,
  onSubmit: PropTypes.func,
  onStartIntegration: PropTypes.func,
  onHideInProgressButtonTooltip: PropTypes.func,
  onShowInProgressButtonTooltip: PropTypes.func,
  onToggleOptions: PropTypes.func,
  onDeauthorizeOAuth1: PropTypes.func,
};

OAuth1AuthorizedDataImportSettings.defaultProps = {
  isOAuth1AuthorizedDataImportModalOpen: false,
  isOAuthAuthorizationFailure: false,
  isOAuth1Authorized: false,
  isFetchingIsOAuth1AuthorizedFinished: false,
  isGetIntegrationsFinished: false,
  isIntegrationInProgress: false,
  isHoveringInProgressButton: false,
  isIntegrationSuccessful: false,
  isOptionsOpen: false,
  shouldRenderOptions: false,
  apiKey: '',
  oauthSecret: '',
  displayedApplicationName: '',
  linkToApiKeyAndOAuth1Secret: '',

  onChangeApiKey: doNothing,
  onChangeOAuthSecret: doNothing,
  onOpenOAuth1AuthorizedDataImportModal: doNothing,
  onCloseOAuth1AuthorizedDataImportModal: doNothing,
  onSetIsOAuth1AuthorizedDataImportModalOpen: doNothing,
  onSubmit: doNothing,
  onStartIntegration: doNothing,
  onHideInProgressButtonTooltip: doNothing,
  onShowInProgressButtonTooltip: doNothing,
  onToggleOptions: doNothing,
  onDeauthorizeOAuth1: doNothing,
};

function OAuth1AuthorizedDataImportSettings(props) {
  const { t } = useTranslation();

  return (
    <Fragment>
      {props.shouldRenderOptions ? renderOptions(props, t) : null}
      <div className={styles.mainButtonWrapper}>{renderMainButton(props, t)}</div>
      {renderCalendarIntegrationModal(props, t)}
    </Fragment>
  );
}

function renderOptions(props, t) {
  return (
    <UniversalPopover
      isPopoverOpened={props.isOptionsOpen}
      targetClassName={styles.options}
      targetComponent={renderOptionsButton(props)}
      popperComponent={renderDropdown(props, t)}
      popperPlacement={'bottom'}
    />
  );
}

function renderOptionsButton(props) {
  return (
    <SecondaryButton onClick={props.onToggleOptions}>
      <MoreVertical />
    </SecondaryButton>
  );
}

function renderDropdown(props, t) {
  return (
    <div className={styles.dropdown}>
      <SecondaryButton onClick={props.onDeauthorizeOAuth1}>{t('Deauthorize Trello account')}</SecondaryButton>
    </div>
  );
}

function renderMainButton(props, t) {
  if (!props.isFetchingIsOAuth1AuthorizedFinished || !props.isGetIntegrationsFinished) {
    return (
      <PrimaryButton className={styles.mainButton} isDisabled={true}>
        <LoadingDots className={styles.loadingDots} />
      </PrimaryButton>
    );
  }

  if (props.isIntegrationInProgress) {
    return (
      <InfoTooltip
        shouldRenderInfoTooltip={props.isHoveringInProgressButton}
        popperPlacement={'right'}
        targetComponent={
          <Button
            onMouseEnter={props.onShowInProgressButtonTooltip}
            onMouseLeave={props.onHideInProgressButtonTooltip}
            className={styles.mainButton}
            isDisabled={true}
          >
            {t('Pending synchronisation')}
          </Button>
        }
        message={t(`Note that his might take up to 24 hours.`)}
        transitionDuration={0}
      />
    );
  }

  if (props.isOAuth1Authorized) {
    return (
      <Button className={styles.mainButton} onClick={props.onStartIntegration}>
        {props.isIntegrationSuccessful ? t('Resynchronise boards') : t('Synchronise boards')}
      </Button>
    );
  }

  return (
    <Button className={styles.mainButton} onClick={props.onOpenOAuth1AuthorizedDataImportModal}>
      {t('Integrate')}
    </Button>
  );
}

function renderCalendarIntegrationModal(props, t) {
  return (
    <UniversalModal
      isModalOpen={props.isOAuth1AuthorizedDataImportModalOpen}
      shouldRenderHeader={false}
      shouldRenderFooter={false}
      shouldRenderCloseIcon={true}
      onSetIsModalOpen={props.onSetIsOAuth1AuthorizedDataImportModalOpen}
    >
      {renderModalContent(props, t)}
    </UniversalModal>
  );
}

function renderModalContent(props, t) {
  return (
    <div className={styles.modalContent}>
      <div className={styles.header}>
        {t(`Integrate {{applicationName}} with Planner`, {
          applicationName: props.displayedApplicationName,
        })}
      </div>
      <div className={styles.text}>
        {t(`Integration with {{applicationName}} will allow you to import all your:`, {
          applicationName: props.displayedApplicationName,
        })}
      </div>
      <div className={styles.text}>{t(`- boards (as projects)`)}</div>
      <div className={styles.text}>{t(`- lists`)}</div>
      <div className={styles.text}>{t(`- tasks`)}</div>
      <div className={styles.header}>{t(`How to integrate?`)}</div>
      <div className={styles.boldText}>
        {t(
          `1) Log in to {{applicationName}} and add {{frontendUrl}} to allowed origins, you can find it `,
          {
            applicationName: props.displayedApplicationName,
            frontendUrl: getFrontendBaseUrl(),
          }
        )}
        <a className={styles.link} href={props.linkToApiKeyAndOAuth1Secret} target={'_blank'}>
          {t('here')}
        </a>
        {t('. Also there you can find your Api Key and OAuth Secret')}
      </div>
      <div className={styles.text}>{t(`2) Paste them below`)}</div>
      <div className={styles.text}>
        {t(`3) Click "Complete in {{applicationName}}"`, {
          applicationName: props.displayedApplicationName,
        })}
      </div>
      <div className={styles.text}>
        {t(`4) You’ll be redirected to {{applicationName}} where you will need to agree to terms and conditions`, {
          applicationName: props.displayedApplicationName,
        })}
      </div>
      <div className={styles.text}>
        {t(`5) Give Planner access to {{applicationName}}`, {
          applicationName: props.displayedApplicationName,
        })}
      </div>
      <div className={styles.text}>
        {t(`6) The synchronisation might take around an hour - depending on the amount of your boards`)}
      </div>
      <div className={`${styles.text} ${styles.section}`}>
        {t(`That’s it! You can now enjoy your {{applicationName}} tasks in Planner!`, {
          applicationName: props.displayedApplicationName,
        })}
      </div>
      <div className={styles.coloredHeader}>{t(`Api Key`)}</div>
      {renderInputWrapper(props.apiKey, props.onChangeApiKey, props.apiKeyInputError, t(`Api Key`))}
      <div className={styles.coloredHeader}>{t(`OAuth Secret`)}</div>
      {renderInputWrapper(props.oauthSecret, props.onChangeOAuthSecret, props.oauthSecretInputError, t(`OAuth Secret`))}
      <div className={styles.footer}>
        <div>
          {props.isOAuthAuthorizationFailure && (
            <div className={styles.errorMessage}>{t(`Authorization failed. Invalid api key or secret`)}</div>
          )}
        </div>
        <PrimaryButton onClick={props.onSubmit}>
          {t('Complete in {{applicationName}}', {
            applicationName: props.displayedApplicationName,
          })}
        </PrimaryButton>
      </div>
    </div>
  );
}

function renderInputWrapper(value, onChange, error, placeholder) {
  return (
    <div className={styles.inputWrapper}>
      <UserInput
        className={styles.input}
        innerClassName={styles.inputInner}
        value={value}
        onChange={onChange}
        humanMessage={error}
        placeholder={placeholder}
      />
    </div>
  );
}

export default OAuth1AuthorizedDataImportSettings;
