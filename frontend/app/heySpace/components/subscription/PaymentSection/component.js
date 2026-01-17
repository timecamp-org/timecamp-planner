import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import CheckoutErrorPage from 'components/subscription/CheckoutErrorPage';
import PaymentSummaryPanel from 'components/subscription/PaymentSummaryPanel';
import { useTranslation } from 'i18n';

import PaymentForm from '../PaymentForm';

import styles from './styles.css';

PaymentSection.propTypes = {
  className: PropTypes.string,
  isPaymentStage: PropTypes.bool.isRequired,
  isPaymentPageRequestFailed: PropTypes.bool.isRequired,

  onFinishCheckout: PropTypes.func,
};

PaymentSection.defaultProps = {
  isPaymentStage: false,
  isPaymentPageRequestFailed: false,

  onFinishCheckout: doNothing,
};

function PaymentSection(props) {
  // eslint-disable-line react/prefer-stateless-function
  return (
    <div className={props.className ? props.className : styles.Component}>
      {props.isPaymentStage ? <PaymentForm /> : null}
      {props.isPaymentPageRequestFailed ? <CheckoutErrorPage /> : renderSummary(props)}
    </div>
  );
}

function renderSummary(props) {
  const { t } = useTranslation();

  return (
    <>
      <PaymentSummaryPanel className={styles.paymentSummaryPanel} subscriptionPlanId={props.subscriptionPlanId} />
      <Button onClick={props.onFinishCheckout}>{t('Return to subscription plans')}</Button>
    </>
  );
}

export default PaymentSection;
