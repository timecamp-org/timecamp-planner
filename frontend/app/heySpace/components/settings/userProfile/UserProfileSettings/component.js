import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';

import NavLink from 'commonComponents/NavLink';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import UserInput from 'commonComponents/UserInput';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import LanguageSelector from 'components/settings/userProfile/LanguageSelector';
import FinalDeleteAccountConfirmationModal from '../FeedbackModal/deleteAccount';
import UserAvatar from '../UserAvatar/currentUser';
import UserAvatarController from '../UserAvatarController';
import UserEmailInput from '../UserEmailInput';
import UserFullNameInput from '../UserFullNameInput';
import UserNicknameInput from '../UserNicknameInput';
import UserProfilePasswordChange from '../UserProfilePasswordChange';

UserProfileSettings.propTypes = {
  className: PropTypes.string,
  isFirstDeleteConfirmationOpen: PropTypes.bool,
  isFinalDeleteConfirmationOpen: PropTypes.bool,
  isFinalConfirmationEnabled: PropTypes.bool,
  selectedLanguage: PropTypes.string,
  canCurrentUserDeleteAccount: PropTypes.bool,
  isCurrentUserOrganizationOwner: PropTypes.bool,
  isUserAloneInOrganization: PropTypes.bool,

  onSetIsFirstConfirmationVisible: PropTypes.func,
  onSetIsFinalConfirmationVisible: PropTypes.func,
  onUpdateConfirmText: PropTypes.func,
  onSelectLanguage: PropTypes.func,
};

UserProfileSettings.defaultProps = {
  isFirstDeleteConfirmationOpen: false,
  isFinalDeleteConfirmationOpen: false,
  isFinalConfirmationEnabled: false,
  canCurrentUserDeleteAccount: false,
  isCurrentUserOrganizationOwner: false,
  isUserAloneInOrganization: false,

  onSetIsFirstConfirmationVisible: doNothing,
  onSetIsFinalConfirmationVisible: doNothing,
  onUpdateConfirmText: doNothing,
};

function UserProfileSettings(props) {
  const { t } = useTranslation();
  return (
    <div className={props.className || styles.Component}>
      {props.isFirstDeleteConfirmationOpen ? renderFirstDeleteConfirmation() : renderForm()}
      <FinalDeleteAccountConfirmationModal
        isModalOpen={props.isFinalDeleteConfirmationOpen}
        onSetIsModalOpened={props.onSetIsFinalConfirmationVisible}
      />
    </div>
  );

  function renderForm() {
    return (
      <React.Fragment>
        <div className={styles.settingsRow}>
          <div className={styles.basicDataSection}>
            <div className={styles.title}>{t('Profile')}</div>
            <UserFullNameInput className={styles.field} humanMessageClassName={styles.error} label={t('Full name')} />
            <UserNicknameInput className={styles.field} label={t('Nickname')} />
            <UserEmailInput className={styles.field} label={t('Email')} />
          </div>
          <div className={styles.settingsSection}>
            <div className={styles.title}>{t('Your avatar')}</div>
            <UserAvatar className={styles.avatar} />
            <UserAvatarController className={styles.avatarController} />
          </div>
        </div>
        <div className={styles.settingsSection}>
          <div className={styles.title}>{t('Language')}</div>
          <LanguageSelector className={styles.languageSelector} />
        </div>
        <div className={styles.settingsSection}>
          <div className={styles.title}>{t('Password')}</div>
          <UserProfilePasswordChange />
        </div>
        <div className={styles.settingsSection}>
          <div className={styles.title}>{t('Delete your account')}</div>
          <div className={styles.subTitle}>
            {t(
              `You can delete your account with all your projects, tasks, notes, chats etc. Please notice thet your account will be permanently removed.`,
            )}
          </div>
          <TooltipedDisabledElement
            isDisabled={!props.canCurrentUserDeleteAccount}
            className={styles.leftAligned}
            message={getDisabledMessage(t, props.isUserAloneInOrganization)}
          >
            <SecondaryButton
              className={styles.deleteAccountButton}
              isDisabled={!props.canCurrentUserDeleteAccount}
              onClick={() => props.onSetIsFirstConfirmationVisible(true)}
            >
              {t('DELETE ACCOUNT')}
            </SecondaryButton>
          </TooltipedDisabledElement>
        </div>
      </React.Fragment>
    );
  }

  function renderFirstDeleteConfirmation() {
    return (
      <div className={styles.firstDeleteConfirmation}>
        <div className={styles.question}>{t('Is this goodbye?')}</div>
        <div className={styles.text}>{t('We are sorry to see you go.')}</div>
        <br />
        <div>{t('Before you delete your account, know this:')}</div>
        <div>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              {t('If you’re tired od getting notifications from us, you can ')}
              <NavLink className={styles.navlink} to={'/settings/notifications'}>
                {t('disable them here.')}
              </NavLink>
            </li>
            <li className={styles.listItem}>
              {t('If you want to change your name, nickname or password, you can ')}
              <span className={styles.navlink} onClick={() => props.onSetIsFirstConfirmationVisible(false)}>
                {t('do that here.')}
              </span>
            </li>
          </ul>
        </div>
        <div className={styles.text}>
          {t('Account deletion is')} <span className={styles.boldText}>{t(' final. ')}</span>{' '}
          {t('The account will no longer be available, and all data in the account will be parmamently deleted.')}
        </div>
        <div className={styles.text}>
          {t('If you are still sold on deleteing your account, please type „{{DELETE}}” to confirm your decision.', {
            DELETE: 'DELETE',
          })}
        </div>
        <UserInput
          className={styles.input}
          placeholder={t('type {{DELETE}} to confirm', { DELETE: 'DELETE' })}
          onChange={props.onUpdateConfirmText}
        />
        {props.isCurrentUserOrganizationOwner && renderOwnerWarning(t)}
        <div className={styles.buttons}>
          <SecondaryButton onClick={() => props.onSetIsFirstConfirmationVisible(false)}>
            {t('Keep my account')}
          </SecondaryButton>
          <TooltipedDisabledElement
            isDisabled={!props.canCurrentUserDeleteAccount}
            className={styles.leftAligned}
            message={getDisabledMessage(t, props.isUserAloneInOrganization)}
          >
            <PrimaryButton
              isDisabled={!props.isFinalConfirmationEnabled || !props.canCurrentUserDeleteAccount}
              onClick={() => props.onSetIsFinalConfirmationVisible(true)}
            >
              {t('Delete my account')}
            </PrimaryButton>
          </TooltipedDisabledElement>
        </div>
      </div>
    );
  }
}

function renderOwnerWarning(t) {
  return (
    <div className={styles.ownerWarning}>
      <span>
        {t('Please note that your Workspace will lose an Owner and it will not be possible to grant a new one.')}
      </span>
      <span>{t('Please transfer Ownership before deleting your account.')}</span>
    </div>
  );
}

function getDisabledMessage(t, isUserAloneInOrganization) {
  return isUserAloneInOrganization
    ? t('Please cancel your active subscriptions before deleting your account.')
    : t('Please pass workspace ownership to someone else before deleting your account');
}

export default UserProfileSettings;
