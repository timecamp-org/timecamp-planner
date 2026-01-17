import React from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Delete } from 'commonComponents/Icons';
import LoadingDots from 'commonComponents/LoadingDots';
import SecondaryButton from 'components/buttons/SecondaryButton';
import ForbiddenPage from 'components/pages/ForbiddenPage';
import { useTranslation } from 'i18n';
import { CheckoutStage } from 'models/domain/SubscriptionModel/types';

import Breadcrumbs from '../Breadcrumbs';
import CheckoutErrorPage from '../CheckoutErrorPage';
import ConfirmationSection from '../ConfirmationSection';
import PaymentSection from '../PaymentSection';
import SubscriptionDetailsSection from '../SubscriptionDetailsSection';
import SubscriptionPlanSelection from '../SubscriptionPlanSelection';

import styles from './styles.css';

CheckoutPage.propTypes = {
  checkoutStage: PropTypes.string.isRequired,
  isPaymentStage: PropTypes.bool.isRequired,
  shouldRenderHeader: PropTypes.bool.isRequired,
  isDataUntilCurrentPathValid: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  isCheckoutFailed: PropTypes.bool,
  isCurrentUserWorkspaceAdmin: PropTypes.bool,

  onClose: PropTypes.func,
};

CheckoutPage.defaultProps = {
  checkoutStage: CheckoutStage.STAGE_SUBSCRIPTION_CHOICE,
  isDataUntilCurrentPathValid: false,
  isPaymentStage: false,
  shouldRenderHeader: false,
  isLoading: false,
  isCheckoutFailed: false,
  isCurrentUserWorkspaceAdmin: false,

  onClose: doNothing,
};

function CheckoutPage(props) {
  const { t } = useTranslation();

  if (!props.isCurrentUserWorkspaceAdmin) {
    return (
      <ForbiddenPage
        buttonText={t('Go back to subscription page')}
        returnLink={'/settings/subscription'}
      />
    );
  }

  return (
    <div className={styles.Component}>
      {props.isCheckoutFailed ? <CheckoutErrorPage /> : renderContent()}
    </div>
  );

  function renderContent() {
    return (
      <div className={styles.container}>
        {props.shouldRenderHeader && renderHeader()}
        <div className={styles.stageBody}>
          {props.isLoading
            ? renderLoadingDots()
            : props.isDataUntilCurrentPathValid && renderStageBody()}
        </div>
      </div>
    );
  }

  function renderHeader() {
    return (
      <div className={styles.header}>
        <div className={styles.titleWithClose}>
          <div className={styles.title}>{t('Subscription')}</div>
          <SecondaryButton
            onClick={props.onClose}
            className={styles.closeButton}
          >
            {t('Close')}
            <Delete className={styles.closeIcon} />
          </SecondaryButton>
        </div>
        <Breadcrumbs />
      </div>
    );
  }

  function renderStageBody() {
    switch (props.checkoutStage) {
      case CheckoutStage.STAGE_SUBSCRIPTION_CHOICE:
        return <SubscriptionPlanSelection className={styles.planSelection} />;
      case CheckoutStage.STAGE_SUBSCRIPTION_DETAILS:
        return (
          <SubscriptionDetailsSection
            className={styles.subscriptionDetailsSection}
          />
        );
      case CheckoutStage.STAGE_PAYMENT:
        return <PaymentSection isPaymentStage={props.isPaymentStage} />;
      case CheckoutStage.STAGE_CONFIRMATION:
        return <ConfirmationSection />;
      default:
        throw new Error('Unexpected checkout stage');
    }
  }

  function renderLoadingDots() {
    return (
      <div className={styles.loaderWrapper}>
        <LoadingDots className={styles.loadingDots} />
      </div>
    );
  }
}

export default CheckoutPage;
