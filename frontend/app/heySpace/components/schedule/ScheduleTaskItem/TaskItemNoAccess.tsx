import { FC } from 'react';

import { Lock } from 'commonComponents/Icons/index-NEW';
import { useTranslation } from 'i18n';

import styles from './styles.css';

interface TaskItemNoAccessInterface {
  subTitle: string;
}

export const TaskItemNoAccess: FC<TaskItemNoAccessInterface> = ({ subTitle }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.frame} ${styles.locked}`}>
      <div className={styles.lockedContent}>
        <Lock className={`${styles.lockIcon} ${styles.content}`} />
        <div className={`${styles.contentWrapper} ${styles.ellipsized}`}>
          <p className={`${styles.name}`}>{t('No access')}</p>
          <p className={styles.content}>{subTitle}</p>
        </div>
      </div>
    </div>
  );
};
