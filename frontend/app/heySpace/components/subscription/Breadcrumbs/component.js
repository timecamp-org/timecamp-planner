import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import Breadcrumb from '../Breadcrumb';
import HorizontalDivider from 'commonComponents/HorizontalDivider';
import {
  SubscriptionChoiceBreadcrumb,
  SubscriptionDetailsBreadcrumb,
  PaymentBreadcrumb,
} from 'commonComponents/Icons';
import { useTranslation } from 'i18n';

Breadcrumbs.propTypes = {
  isSubscriptionChoiceStage: PropTypes.bool.isRequired,
  isSubscriptionDetailsStage: PropTypes.bool.isRequired,
  isPaymentStage: PropTypes.bool.isRequired,

  isClientFormDataValid: PropTypes.bool.isRequired,
  isSubscriptionPlanChosen: PropTypes.bool.isRequired,
  isSubscriptionChoiceStageValid: PropTypes.bool.isRequired,
  isSubscriptionDetailsStageValid: PropTypes.bool.isRequired,
};

Breadcrumbs.defaultProps = {
  isSubscriptionChoiceStage: false,
  isSubscriptionDetailsStage: false,
  isPaymentStage: false,

  isClientFormDataValid: false,
  isSubscriptionPlanChosen: false,
  isSubscriptionChoiceStageValid: false,
  isSubscriptionDetailsStageValid: false,
};

function Breadcrumbs(props) {
  // eslint-disable-line react/prefer-stateless-function
  const { t } = useTranslation();
  return (
    <div className={styles.breadcrumbs}>
      <Breadcrumb
        icon={SubscriptionChoiceBreadcrumb}
        isActive={props.isSubscriptionChoiceStage}
        isValid={props.isSubscriptionChoiceStageValid}
        label={t('Choose plan')}
      ></Breadcrumb>
      <HorizontalDivider
        className={`${styles.horizontalDivider} ${
          props.isSubscriptionChoiceStageValid ? styles.valid : ''
        }`}
      />
      <Breadcrumb
        icon={SubscriptionDetailsBreadcrumb}
        isActive={props.isSubscriptionDetailsStage}
        isValid={props.isSubscriptionDetailsStageValid}
        label={t('Fill the data form')}
      ></Breadcrumb>
      <HorizontalDivider
        className={`${styles.horizontalDivider} ${
          props.isSubscriptionDetailsStageValid ? styles.valid : ''
        }`}
      />
      <Breadcrumb
        icon={PaymentBreadcrumb}
        isActive={props.isPaymentStage}
        isValid={false}
        label={t('Payment')}
      ></Breadcrumb>
    </div>
  );
}

export default Breadcrumbs;
