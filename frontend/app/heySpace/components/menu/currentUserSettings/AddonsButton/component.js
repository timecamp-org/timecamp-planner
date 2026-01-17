import React from 'react';
import styles from './styles.css';
import { ShoppingBag } from 'commonComponents/Icons';
import SecondaryButton from 'components/buttons/SecondaryButton';
import NavLink from 'commonComponents/NavLink';
import { useTranslation } from 'i18n';

function AddonsButton() {
  const { t } = useTranslation();
  return (
    <NavLink className={styles.navLink} to={'/settings/addons'}>
      <SecondaryButton className={styles.button}>
        <div className={styles.linkContents}>
          <ShoppingBag className={styles.icon} />
          <span className={styles.title}>{t('Addons')}</span>
        </div>
      </SecondaryButton>
    </NavLink>
  );
}

export default AddonsButton;
