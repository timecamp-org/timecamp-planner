import React from 'react';

import { PhoneAndroid } from 'commonComponents/Icons';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';

import styles from './styles.css';

const URL = 'https://www.timecamp.com/planner#applications';

function MobileAppButton() {
  const { t } = useTranslation();

  return (
    <SecondaryButton className={styles.button} onClick={onClick}>
      <PhoneAndroid className={styles.icon} height={14} width={14} />
      <span>{t('Apps')}</span>
    </SecondaryButton>
  );
}

function onClick() {
  window.open(URL, '_blank');
}

export default MobileAppButton;
