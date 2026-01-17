import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';

import BillingCycle from '../BillingCycle';
import SubscriptionFeatures from '../SubscriptionFeatures';
import UserInput from 'commonComponents/UserInput';
import { useTranslation } from 'i18n';

PaymentSummaryPanel.propTypes = {
  className: PropTypes.string,
  subscriptionPlanId: PropTypes.string.isRequired,
  numberOfSeats: PropTypes.number.isRequired,
  planName: PropTypes.string,
  hasMultiSeats: PropTypes.bool,
  minNumberOfSeats: PropTypes.number,
  isSubscriptionDetailsStage: PropTypes.bool.isRequired,

  onSeatsNumberUpdate: PropTypes.func.isRequired,
  onSaveNumberOfSeats: PropTypes.func.isRequired,
};

PaymentSummaryPanel.defaultProps = {
  numberOfSeats: 0,
  planName: '',
  hasMultiSeats: false,
  isSubscriptionDetailsStage: false,
  minNumberOfSeats: 1,

  onSeatsNumberUpdate: doNothing,
  onSaveNumberOfSeats: doNothing,
};

function PaymentSummaryPanel(props) {
  // eslint-disable-line react/prefer-stateless-function
  const { t } = useTranslation();
  return (
    <div className={props.className ? props.className : styles.Component}>
      <SubscriptionFeatures
        subscriptionPlanId={props.subscriptionPlanId}
        header={t(props.planName)}
        className={styles.features}
      />
      {renderSeatCountInput()}
      <BillingCycle
        subscriptionPlanId={props.subscriptionPlanId}
        className={styles.billingCycle}
      />
    </div>
  );

  function renderSeatCountInput() {
    return props.isSubscriptionDetailsStage ? (
      <UserInput
        type={'number'}
        label={t('Number of seats: ')}
        className={styles.numberOfSeats}
        onChange={props.onSeatsNumberUpdate}
        onBlur={props.onSaveNumberOfSeats}
        min={props.minNumberOfSeats}
        value={props.proposedNumberOfSeats}
        isEditable={!props.hasMultiSeats}
      />
    ) : (
      <span className={styles.numberOfSeatsLabel}>
        {t('Number of seats: ')}
        <span className={styles.numberOfSeatsValue}>{props.numberOfSeats}</span>
      </span>
    );
  }
}

export default PaymentSummaryPanel;
