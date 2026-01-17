import React from 'react';
import { useTranslation } from '../../../../../common/i18n';
import styles from './styles.css';
import meetsUrl from './meets.png';
import arrowsUrl from './arrows.png';

const Version2490ModalContent = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.component}>
      <p>
        <b>{t('Check out our latest changes.')}</b>
      </p>
      <br />
      <ul>
        <li>
          <b>{t('14 days free trial! (14 - 28 September)')}</b>
          {t(' - for all accounts without subscription.')}
        </li>
        <br />
        <li>
          <b>{t('Planner Meets (up to 10 members per one meet)')}</b>
          {t(
            ' - video calls with Project and Conversation members, screen sharing, minimized mode and more offered by Jitsi.'
          )}

          <br />
          <br />
          <img src={meetsUrl} />
          <br />
          <br />
        </li>
        <br />
        <li>
          <b>{t('Navigation arrows')}</b>
          {t(' - navigate there and forth through history of previously opened Projects, Conversations and Tasks.')}
          <br />
          <br />
          <img src={arrowsUrl} />
          <br />
          <br />
        </li>
      </ul>
      <br />
      <p>{t("We hope you'll enjoy this release.")}</p>
    </div>
  );
};

export default Version2490ModalContent;
