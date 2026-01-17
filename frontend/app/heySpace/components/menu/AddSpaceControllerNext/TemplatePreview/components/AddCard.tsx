import { TemplatePlusIcon } from 'commonComponents/Icons/index-NEW';
import { useTranslation } from 'i18n';

import styles from '../styles.css';

export const AddCard = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.addCard}>
      <div className={styles.addCardIcon}>
        <TemplatePlusIcon />
      </div>
      <span>{t('Add task')}</span>
    </div>
  );
};
