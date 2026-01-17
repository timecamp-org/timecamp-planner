import { Fragment } from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import Pending from 'commonAssets/emptyState/Empty_State_26.png';
import Success from 'commonAssets/emptyState/Empty_State_28.png';
import BillingSummary from 'components/subscription/BillingSummary';
import { useTranslation } from 'i18n';

import styles from './styles.css';

ConfirmationSection.propTypes = {
  subscriptionPlanId: PropTypes.string.isRequired,
  isSubscriptionConfirmed: PropTypes.bool.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

ConfirmationSection.defaultProps = {
  isSubscriptionConfirmed: false,
  onGoBack: doNothing,
};

function ConfirmationSection(props) {
  // eslint-disable-line react/prefer-stateless-function
  const { t } = useTranslation();

  return (
    <div className={styles.Component}>
      <div className={styles.summaryWrapper}>
        {props.isSubscriptionConfirmed ? renderCaseSuccess() : renderCasePending()}
        <div className={styles.subHeader}>{t(`You have just made yourself a gift`)}</div>
        <BillingSummary subscriptionPlanId={props.subscriptionPlanId} className={styles.billingSummary} />
      </div>
      <div className={styles.footer}>
        {t('Go back to the')}
        <span onClick={props.onGoBack} className={styles.link}>
          {t('Subscription settings')}
        </span>
      </div>
    </div>
  );

  function renderCasePending() {
    return (
      <Fragment>
        <div className={styles.header}>{t(`We are happy to see you joining our community!`)}</div>
        <img src={Pending} className={styles.mascot} />
        <div className={styles.message}>
          <div className={styles.messageText}>{t('We are almost there... just need to confirm the transaction.')}</div>
          <div className={styles.mail}>
            {t('You will receive your billing details on your email box as soon as we confirm your payment.')}
          </div>
        </div>
      </Fragment>
    );
  }

  function renderCaseSuccess() {
    return (
      <Fragment>
        <div className={styles.header}>{t(`Success!`)}</div>
        <img src={Success} className={styles.mascot} />
        <div className={styles.message}>
          <div className={styles.messageText}>{t('Everything works perfectly fine!')}</div>
          <div className={styles.mail}>{t('You will find your billing details on your email box.')}</div>
        </div>
      </Fragment>
    );
  }
}

export default ConfirmationSection;
