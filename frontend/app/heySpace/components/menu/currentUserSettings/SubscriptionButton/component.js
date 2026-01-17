import React from 'react';
import styles from './styles.css';

import { Card } from 'commonComponents/Icons';
import SecondaryButton from 'components/buttons/SecondaryButton';
import NavLink from 'commonComponents/NavLink';
import { useTranslation } from 'i18n';

function SubscriptionButton(props) {
  const { t } = useTranslation();
  return (
    <NavLink className={styles.navLink} to={'/settings/subscription'}>
      <SecondaryButton className={styles.button}>
        <div className={styles.linkContents}>
          <Card className={styles.icon} />
          <span className={styles.title}>
            {props.isFreeSubscription
              ? t('Upgrade to Premium')
              : t('Subscription')}
          </span>
        </div>
      </SecondaryButton>
    </NavLink>
  );
}

export default SubscriptionButton;
