import React from 'react';
import { useTranslation } from '../../../../../common/i18n';
import styles from './styles.css';

const SpaceGroupsModalContent = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.component}>
      <p>{t('Check out our latest improvements.')}</p>
      <br />
      <ul>
        <li>
          <b>{t('Timeline view in Projects')}</b>
          {t(" - Monitor your deadlines and see the progress on Project's Timeline.")}
        </li>
        <li>
          <b>{t('Folders for Projects')}</b>
          {t(' - Create folders and organize your Projects. You can even change the order of Projects!')}
        </li>
        <li>
          <b>{t('New notifications view')}</b>
          {t(" - We've separated chat and board notifications. Use them to be up-to-date with your projects.")}
        </li>
        <li>
          <b>{t('UI changes')}</b>
          {t(" - Now you'll find notifications and settings on the right.")}
        </li>
      </ul>
      <p>{t("We hope you'll enjoy this release.")}</p>
    </div>
  );
};

export default SpaceGroupsModalContent;
