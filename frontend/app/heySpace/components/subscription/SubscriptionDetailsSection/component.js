import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';

import ClientDataForm from '../ClientDataForm';
import PaymentSummaryPanel from '../PaymentSummaryPanel';

import styles from './styles.css';

SubscriptionDetailsSection.propTypes = {
  className: PropTypes.string,
  subscriptionPlanId: PropTypes.string.isRequired,
  onContinueClick: PropTypes.func,
};

SubscriptionDetailsSection.defaultProps = {
  onContinueClick: doNothing,
};

function SubscriptionDetailsSection(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className ? props.className : styles.Component}>
      <div className={styles.clientFormWithSummary}>
        <ClientDataForm className={styles.clientDataForm} />
        <PaymentSummaryPanel className={styles.paymentSummaryPanel} subscriptionPlanId={props.subscriptionPlanId} />
      </div>
      <Button onClick={props.onContinueClick} className={styles.buttonContinue}>
        {t('Continue')}
      </Button>
    </div>
  );
}

export default SubscriptionDetailsSection;
