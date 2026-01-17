import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';
import { BillingPeriodType } from 'models/domain/SubscriptionModel/types';

import SubscriptionFeatures from '../SubscriptionFeatures';

import styles from './styles.css';

SubscriptionPlan.propTypes = {
  className: PropTypes.string,
  subscriptionPlanId: PropTypes.string.isRequired,
  name: PropTypes.string,
  recommendedAudience: PropTypes.string,
  costPerSeat: PropTypes.string,
  currency: PropTypes.string,
  planCode: PropTypes.string,
  isSubscriptionFree: PropTypes.bool,
  planBillingPeriod: PropTypes.string,

  onSelectPlan: PropTypes.func,
};

SubscriptionPlan.defaultProps = {
  name: '',
  recommendedAudience: '',
  costPerSeat: '',
  currency: '',
  isSubscriptionFree: false,

  onSelectPlan: doNothing,
};

function SubscriptionPlan(props) {
  const { t } = useTranslation();

  return (
    <div className={`${props.className ? props.className : styles.Component}`}>
      <div className={styles.nameAndPrice}>
        <div className={styles.name}>{t(props.name)}</div>
        <div className={styles.recommendedAudience}>{t(props.recommendedAudience)}</div>
        {renderPrice()}
      </div>
      <SubscriptionFeatures
        className={styles.features}
        header={t(`What's included`)}
        subscriptionPlanId={props.subscriptionPlanId}
      />
      {props.currentSubscriptionPlanId === props.subscriptionPlanId ? renderCurrentPlanBox() : remderChoosePlanButton()}
    </div>
  );

  function renderPrice() {
    return (
      <span className={styles.price}>
        <span className={styles.currency}>{props.currency}</span>
        <span className={styles.costPerSeat}>{props.costPerSeat}</span>
        {props.isSubscriptionFree ? null : (
          <span className={styles.billingCycle}>
            {t('/user/{{period}}', {
              period: getPeriodLabel(props.planBillingPeriod, t),
            })}
          </span>
        )}
      </span>
    );
  }

  function renderCurrentPlanBox() {
    return <div className={styles.currentPlanBox}>{t('Your current plan')}</div>;
  }

  function remderChoosePlanButton() {
    return (
      <Button onClick={props.onSelectPlan} disabled={props.isSubscriptionFree}>
        {t(`Choose plan {{planName}}`, { planName: props.name.toUpperCase() })}
      </Button>
    );
  }
}

function getPeriodLabel(billingPeriodId, t) {
  switch (billingPeriodId) {
    case BillingPeriodType.BILLING_PERIOD_MONTHLY:
      return t('month');
    case BillingPeriodType.BILLING_PERIOD_YEARLY:
      return t('year');
    default:
      return '';
  }
}

export default SubscriptionPlan;
