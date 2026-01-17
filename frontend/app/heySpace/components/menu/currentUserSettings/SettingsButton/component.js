import React from 'react';
import styles from './styles.css';

import { Settings as SettingsIcon } from 'commonComponents/Icons';
import SecondaryButton from 'components/buttons/SecondaryButton';
import NavLink from 'commonComponents/NavLink';
import { useTranslation } from 'i18n';

function SettingsButton() {
  const { t } = useTranslation();
  return (
    <NavLink className={styles.navLink} to={'/settings/profile'}>
      <SecondaryButton className={styles.button}>
        <SettingsIcon className={styles.icon} height={14} width={14} />
        <span>{t('Settings')}</span>
      </SecondaryButton>
    </NavLink>
  );
}

export default SettingsButton;
