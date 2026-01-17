import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'i18n';
import { doNothing } from 'common/utils';
import useElementOpen from 'common/hooks/useElementOpen';
import styles from './styles.css';
import AppsLogo from './assets/apps.png';

import SecondaryButton from 'components/buttons/SecondaryButton';
import UniversalModal from 'commonComponents/UniversalModal';
import UserInput from 'commonComponents/UserInput';
import { Copy as CopyIcon, ArrowRight } from 'commonComponents/Icons';

ChatWithMeForm.propTypes = {
  className: PropTypes.string,
  invitationLink: PropTypes.string,
  onGenerateLink: PropTypes.func,
  onCopyLink: PropTypes.func,
  onSetInputRef: PropTypes.func,
};

ChatWithMeForm.defaultProps = {
  className: '',
  invitationLink: '',
  onGenerateLink: doNothing,
  onCopyLink: doNothing,
  onSetInputRef: doNothing,
};

function ChatWithMeForm(props) {
  const { t } = useTranslation();
  return (
    <div className={props.className || styles.Component}>
      <div className={styles.headerWithLogo}>
        <span className={styles.mascot} />
        <div className={styles.header}>
          {t(`Get all your communication channels into one place!\nNo more checking dozens of apps for the updates.`)}
          <img src={AppsLogo} className={styles.logo} alt="apps" />
        </div>
      </div>
      {renderForm(props, t)}
      {renderHints(t)}
    </div>
  );
}

function renderForm(props, t) {
  const { isOpen: isModalOpen, onOpen, onToggleOpen } = useElementOpen(false);
  return (
    <>
      <div className={styles.inputWithIcon}>
        <UserInput
          className={styles.input}
          innerClassName={styles.inputInner}
          value={props.invitationLink}
          isDisabled
          onSetInnerRef={props.onSetInputRef}
        />
        <SecondaryButton className={styles.copyButton} onClick={props.onCopyLink}>
          <CopyIcon />
        </SecondaryButton>
      </div>
      <SecondaryButton className={styles.reloadLink} onClick={onOpen}>
        {t('Disable or reload link')}
      </SecondaryButton>
      <UniversalModal
        isModalOpen={isModalOpen}
        cancelButtonCaption={t('Cancel')}
        saveButtonCaption={t('Reload link')}
        header={t('Reload invitation link')}
        onModalSave={props.onGenerateLink}
        onSetIsModalOpen={onToggleOpen}
      >
        {t('Are you sure you want to reload invitation link?')}
      </UniversalModal>
    </>
  );
}

function renderHints(t) {
  return (
    <div className={styles.hints}>
      {renderHint(1, t('Copy the link above'))}
      {renderHint(2, t('Send it directly to your friends or paste it to your public channel'))}
      <span className={styles.subHints}>
        {renderSubHint(t('paste it to your email footer'))}
        {renderSubHint(t('share it with the facebook group'))}
        {renderSubHint(t('post it on your profile'))}
        {renderSubHint(t('set it as a status on whats app or slack'))}
        {renderSubHint(t('send in as a message'))}
      </span>
      {renderHint(3, t('Make sure that people can contact you right through the Planner Channel at ANYTIME'))}
      {renderHint(4, t('Optionally add them to a project or invite to your team for good :) '))}
    </div>
  );
}

function renderHint(number, text) {
  return (
    <span className={styles.hint}>
      {renderCounter(number)}
      {text}
    </span>
  );
}

function renderCounter(number) {
  return <span className={styles.counter}>{number}</span>;
}

function renderSubHint(text) {
  return (
    <span className={styles.subHint}>
      <ArrowRight className={styles.arrow} />
      {text}
    </span>
  );
}

export default ChatWithMeForm;
