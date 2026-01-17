import React from 'react';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { List } from 'immutable';
import { doNothing } from 'common/utils';
import { BillingPeriodType } from 'models/domain/SubscriptionModel/types';
import { useTranslation } from 'i18n';

import SubscriptionPlan from '../SubscriptionPlan';
import MaterialSwitch from 'commonComponents/MaterialSwitch';

SubscriptionPlanSelection.propTypes = {
  subscriptionPlanIds: ImmutablePropTypes.list.isRequired,
  billingPeriodId: PropTypes.string.isRequired,
  onSwitchBillingPeriod: PropTypes.func,
};

SubscriptionPlanSelection.defaultProps = {
  subscriptionPlanIds: new List(),
  onSwitchBillingPeriod: doNothing,
};

function SubscriptionPlanSelection(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.Component}>
      {renderBillingPeriodSwitcher(props, t)}
      <div className={styles.plans}>
        {props.subscriptionPlanIds.map(renderSubscriptionPlan)}
      </div>
    </div>
  );
}

function renderBillingPeriodSwitcher(props, t) {
  const isChecked =
    props.billingPeriodId === BillingPeriodType.BILLING_PERIOD_YEARLY;
  return (
    <div className={styles.billingPeriodSwitcher}>
      <span className={styles.label}>{t('monthly')}</span>
      <MaterialSwitch
        className={styles.switchButton}
        isChecked={isChecked}
        onClick={props.onSwitchBillingPeriod}
      />
      <span className={styles.label}>{t('annual')}</span>
      <span className={styles.hint}>
        {t('({{percent}}% off)', { percent: 25 })}
      </span>
    </div>
  );
}

function renderSubscriptionPlan(subscriptionPlanId) {
  return (
    <SubscriptionPlan
      className={styles.subscriptionPlan}
      key={subscriptionPlanId}
      subscriptionPlanId={subscriptionPlanId}
    />
  );
}

export default SubscriptionPlanSelection;
