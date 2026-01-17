import { Envelope } from 'commonComponents/Icons/fontawesome/Envelope';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';

import styles from '../styles.css';

export const UserDropdownMailToItem = () => {
  const { t } = useTranslation();

  return (
    <a href="mailto: help@timecamp.com">
      <SecondaryButton className={styles.menuItem}>
        <div className={styles.iconWrapper}>
          <Envelope />
        </div>

        <div> {t('Contact us')}</div>
      </SecondaryButton>
    </a>
  );
};

export default UserDropdownMailToItem;
