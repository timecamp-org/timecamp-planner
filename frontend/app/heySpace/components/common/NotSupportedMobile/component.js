import React from 'react';
import styles from './styles.css';

import GooglePlayBadge from './assets/google-play-badge.png';
import AppStoreBadge from './assets/download-on-app-store.png';
import { useTranslation } from 'i18n';

const heyspaceGoogleStoreLink = 'https://play.google.com/store/apps/details?id=com.heyspacemobile';
const heyspaceAppStoreLink = 'https://apps.apple.com/us/app/heyspace/id1449828077';

function NotSupportedMobile() {
  const { t } = useTranslation();
  return (
    <div className={styles.component}>
      <div className={styles.mascot} />
      <div className={styles.title}>{t('Get the Planner app')}</div>
      <a href={heyspaceGoogleStoreLink}>
        <img className={styles.googlePlayBadge} src={GooglePlayBadge} />
      </a>
      <a href={heyspaceAppStoreLink}>
        <img className={styles.appStoreBadge} src={AppStoreBadge} />
      </a>
    </div>
  );
}

export default NotSupportedMobile;
