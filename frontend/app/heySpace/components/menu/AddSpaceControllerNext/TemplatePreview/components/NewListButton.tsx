import { TemplatePlusIcon } from 'commonComponents/Icons/index-NEW';
import { useTranslation } from 'i18n';

import styles from '../styles.css';

export const NewListButton = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.addListWrapper}>
      <TemplatePlusIcon />
      <p>{t('Create new list')}</p>
    </div>
  );
};
