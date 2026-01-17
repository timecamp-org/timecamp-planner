import { Fragment } from 'react';

import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Copy as CopyIcon, MoreVertical } from 'commonComponents/Icons';
import UniversalModal from 'commonComponents/UniversalModal';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInput from 'commonComponents/UserInput';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { i18n, useTranslation } from 'i18n';

import styles from './styles.css';

CalendarSyncExtensionSettings.propTypes = {
  extensionId: PropTypes.string.isRequired,
  isExtensionEnabled: PropTypes.bool,
  isExtensionSettingsModalOpen: PropTypes.bool,
  isExtensionSettingsPopoverOpen: PropTypes.bool,

  onDisableExtensionEnabledForOrganization: PropTypes.func,
  onEnableExtensionEnabledForOrganization: PropTypes.func,
  onResetSyncToken: PropTypes.func,
  onOpenExtensionSettingsModal: PropTypes.func,
  onCloseExtensionSettingsModal: PropTypes.func,
  onSetIsExtensionSettingsModalOpen: PropTypes.func,
  onOpenExtensionSettingsPopover: PropTypes.func,
  onCloseExtensionSettingsPopover: PropTypes.func,
  onSetInputRef: PropTypes.func,
  onCopyLink: PropTypes.func,
  onMoreVerticalButtonClick: PropTypes.func,
};

CalendarSyncExtensionSettings.defaultProps = {
  isExtensionEnabled: false,
  syncUrl: i18n.t('Failed to load sync url'),
  isExtensionSettingsModalOpen: false,

  onDisableExtensionEnabledForOrganization: doNothing,
  onEnableExtensionEnabledForOrganization: doNothing,
  onResetSyncToken: doNothing,
  onOpenExtensionSettingsModal: doNothing,
  onCloseExtensionSettingsModal: doNothing,
  onSetIsExtensionSettingsModalOpen: doNothing,
  onOpenExtensionSettingsPopover: doNothing,
  onCloseExtensionSettingsPopover: doNothing,
  onSetInputRef: doNothing,
  onCopyLink: doNothing,
  onMoreVerticalButtonClick: doNothing,
};

function CalendarSyncExtensionSettings(props) {
  const { t } = useTranslation();

  return (
    <Fragment>
      {renderCalendarSettingsModal(props, t)}
      <Button className={styles.button} onClick={props.onOpenExtensionSettingsModal}>
        {t('Integrate')}
      </Button>
      {renderCalendarIntegrationModal(props, t)}
    </Fragment>
  );
}

function renderCalendarIntegrationModal(props, t) {
  return (
    <UniversalModal
      isModalOpen={props.isExtensionSettingsModalOpen}
      shouldRenderHeader={false}
      shouldRenderFooter={false}
      shouldRenderCloseIcon={true}
      onSetIsModalOpen={props.onSetIsExtensionSettingsModalOpen}
    >
      {renderModalContent(props, t)}
    </UniversalModal>
  );
}

function renderCalendarSettingsModal(props, t) {
  return (
    <UniversalPopover
      isPopoverOpened={props.isExtensionSettingsPopoverOpen}
      targetClassName={styles.extensionSettings}
      targetComponent={renderMoreVerticalButton(props)}
      popperComponent={renderExtensionSettingDropdown(props, t)}
      popperPlacement={'bottom'}
    />
  );
}

function renderMoreVerticalButton(props) {
  return (
    <SecondaryButton onClick={props.onMoreVerticalButtonClick}>
      <MoreVertical />
    </SecondaryButton>
  );
}

function renderExtensionSettingDropdown(props, t) {
  return (
    <div className={styles.dropdown}>
      <SecondaryButton onClick={props.onResetSyncToken}>{t('Reset url')}</SecondaryButton>
    </div>
  );
}

function renderModalContent(props, t) {
  return (
    <div className={styles.modalContent}>
      <div className={styles.header}>{t(`Synchronize tasks with your calendar!`)}</div>
      <div className={styles.text}>
        {t(
          `Now you can import your tasks as events to your Calendar. Before proceeding with the below instruction make sure these conditions are met:`
        )}
      </div>
      <div className={styles.text}>{t(`- You are assingned to the tasks you want to export.`)}</div>
      <div className={styles.text}>{t(`- Tasks include “due dates”.`)}</div>
      <div className={styles.header}>{t(`How to integrate?`)}</div>
      {renderInputWrapper(props)}
      <div className={styles.resetLink} onClick={props.onResetSyncToken}>
        {t('Reset url')}
      </div>
      <div className={styles.coloredHeader}>{t(`Google Calendar`)}</div>
      <div className={styles.text}>
        {t(
          `Go to Google Calendar and in the left column find “Add Calendar” option. Choose “from URL” and simply past the URL that we provided on the top.`
        )}
      </div>
      <a className={styles.link} href="https://support.google.com/calendar/answer/37100" target={'_blank'}>
        {t('Add Calendar to Google Calendar ')}
      </a>
      <div className={styles.text}>{t(`That’s it! You can now enjoy the Calendar filled with Planner tasks.`)}</div>

      <div className={styles.coloredHeader}>{t(`Outlook, ICal and others`)}</div>
      <div className={styles.text}>
        {t(
          `Copy provided URL and paste it as a new Calendar to Outlook, ICal or any other default app that you use to track your schedule.`
        )}
      </div>
      <a
        className={styles.link}
        href="https://support.office.com/en-gb/article/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c"
        target={'_blank'}
      >
        {t('Add Calendar to Outlook tutorial')}
      </a>
      <a className={styles.link} href="https://support.apple.com/en-us/HT202361" target={'_blank'}>
        {t('Add Calendar to Apple tutorial')}
      </a>
    </div>
  );
}

function renderInputWrapper(props) {
  return (
    <div className={styles.inputWrapper}>
      <UserInput
        className={styles.syncUrlInput}
        innerClassName={styles.inputInnter}
        isDisabled={true}
        value={props.syncUrl}
        onSetInnerRef={props.onSetInputRef}
      />
      <SecondaryButton onClick={props.onCopyLink}>
        <CopyIcon />
      </SecondaryButton>
    </div>
  );
}

export default CalendarSyncExtensionSettings;
