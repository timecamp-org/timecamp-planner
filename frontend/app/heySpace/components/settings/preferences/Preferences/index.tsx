import React from 'react';

import LoadingDots from 'commonComponents/LoadingDots';
import MaterialSwitch from 'commonComponents/MaterialSwitch';
import UserInput from 'commonComponents/UserInput/component';
import { useTranslation } from 'i18n';

import { useComponent } from './hook';
import styles from './styles.css';

const NotificationsSettings: React.FC = () => {
  const { t } = useTranslation();
  const {
    enablePushNotifications,
    enableEmailNotifications,
    enableSoundNotifications,
    isNotificationsSettingsLoading,
    visibleChatsCount,
    chatsExpirationPeriod,
    onSwitchBrowserNotifications,
    onSwitchEmailNotifications,
    onSwitchSoundNotifications,
    onSetChatsExpirationPeriod,
    onSetVisibleChatsCount,
    onBlur,
  } = useComponent();

  return isNotificationsSettingsLoading ? (
    <div className={styles.loaderWrapper}>
      <LoadingDots className={styles.loadingDots} />{' '}
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.title}>{t('Get notified through…')}</div>

        <div className={styles.inline}>
          <MaterialSwitch isChecked={enablePushNotifications} onClick={onSwitchBrowserNotifications} />
          <div className={styles.label}>{t('Show pop up notifications in a browser')}</div>
        </div>
        <div className={styles.description}>
          {t('You will get a browser pop up notification when Planner is open on your computer’s browser.')}
        </div>

        <div className={styles.inline}>
          <MaterialSwitch isChecked={enableEmailNotifications} onClick={onSwitchEmailNotifications} />
          <div className={styles.label}>{t('Send email notifications')}</div>
        </div>
        <div className={styles.description}>{t(`You will receive an email notification when you're offline.`)}</div>

        <div className={styles.inline}>
          <MaterialSwitch isChecked={enableSoundNotifications} onClick={onSwitchSoundNotifications} />
          <div className={styles.label}>{t('Sound notifications')}</div>
        </div>
        <div className={styles.description}>{t('You will get a sound notification.')}</div>
      </div>

      <div className={styles.box}>
        <div className={styles.title}>{t('Chats retention')}</div>

        <div className={styles.field}>
          <div className={styles.fieldLabel}>{t('Number of visible chats')}</div>
          <div className={styles.fieldDescription}>{t('Chats are visible on the left menu under the CHATS label')}</div>
          <UserInput
            type={'number'}
            innerClassName={styles.numberInput}
            min={1}
            max={30}
            onChange={onSetVisibleChatsCount}
            onBlur={onBlur}
            value={visibleChatsCount}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.fieldLabel}>{t('Number of days after which chats will be marked as inactive')}</div>
          <div className={styles.fieldDescription}>
            {t('After this time the chats will be marked as inactive and will disappear from the menu')}
          </div>
          <UserInput
            type={'number'}
            innerClassName={styles.numberInput}
            min={1}
            max={7}
            onChange={onSetChatsExpirationPeriod}
            onBlur={onBlur}
            value={chatsExpirationPeriod}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettings;
