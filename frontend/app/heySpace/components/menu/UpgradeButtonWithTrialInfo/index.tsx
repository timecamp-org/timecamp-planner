import { Button } from '@mui/material';

import NavLink from 'commonComponents/NavLink';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';

import useComponent from './hook';
import styles from './styles.css';

const UpgradeButtonWithTrialInfo = () => {
  const { isBillingEnabled, isCurrentSubscriptionTrial, daysLeft } = useComponent();
  const { t } = useTranslation();

  if (!isBillingEnabled) {
    return null;
  }

  if (isCurrentSubscriptionTrial) {
    return renderCaseTrial(daysLeft, t);
  }

  return (
    <NavLink className={styles.upgradeButtonWrapper} to={'/settings/subscription'}>
      <Button className={styles.button}>{'UPGRADE'}</Button>
    </NavLink>
  );
};

function renderCaseTrial(daysLeft: number, t: TranslateFunction) {
  return (
    <NavLink to={'/settings/subscription'}>
      <div className={styles.trial}>{t('{{daysLeft}} days of trial left', { daysLeft })}</div>
    </NavLink>
  );
}

export default UpgradeButtonWithTrialInfo;
