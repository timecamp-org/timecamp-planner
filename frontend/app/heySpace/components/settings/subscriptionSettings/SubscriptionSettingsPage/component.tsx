import { Fragment } from 'react';

import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import InfoTooltip from 'commonComponents/InfoTooltip';
import LoadingDots from 'commonComponents/LoadingDots';
import UserInput from 'commonComponents/UserInput';
import DateOutput from 'components/date/DateOutput';
import AppliedCoupons from 'components/subscription/AppliedCoupons';
import BillingHistory from 'components/subscription/BillingHistory';
import CancelSubscriptionButton from 'components/subscription/CancelSubscriptionButton';
import UpdateSubscriptionButton from 'components/subscription/UpdateSubscriptionButton';
import { useTranslation } from 'i18n';
import commonStyles from 'styles/common.css';

import SubscriptionDescription from '../SubscriptionDescription';

import styles from './styles.css';

SubscriptionSettingsPage.propTypes = {
  planName: PropTypes.string,
  expireTime: PropTypes.number,
  daysLeft: PropTypes.number,
  isFree: PropTypes.bool,
  isTrialAvailable: PropTypes.bool,
  isTrial: PropTypes.bool,
  isLifetime: PropTypes.bool,
  isCurrentUserOrganizationAdmin: PropTypes.bool,
  isHovering: PropTypes.bool,
  numberOfSeats: PropTypes.number,
  costPerSeat: PropTypes.number,
  nextBillingAmount: PropTypes.number,
  billingPeriodName: PropTypes.string,
  isUpdateSubscriptionEnabled: PropTypes.bool,
  isSeatCountInputEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isBillingFrequencyEnabled: PropTypes.bool,
  isLastChargeEnabled: PropTypes.bool,
  isNextPaymentEnabled: PropTypes.bool,
  isMonthlyBilledEnabled: PropTypes.bool,
  isUpdateButtonEnabled: PropTypes.bool,
  subscriptionData: PropTypes.object,
  guestSeatCount: PropTypes.number,
  guestSeatsOccupied: PropTypes.number,
  isPaymentFormVisible: PropTypes.bool,
  isBillingEnabled: PropTypes.bool,

  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onNavigateToSubscriptions: PropTypes.func,
  onChangeNumberOfSeats: PropTypes.func,
};

SubscriptionSettingsPage.defaultProps = {
  expireTime: null,
  daysLeft: null,
  isFree: false,
  isLifetime: false,
  isCurrentUserOrganizationAdmin: false,
  isHovering: false,
  isUpdateSubscriptionEnabled: false,
  isSeatCountInputEnabled: false,
  isLoading: false,
  isBillingFrequencyEnabled: false,
  isLastChargeEnabled: false,
  isNextPaymentEnabled: false,
  isMonthlyBilledEnabled: false,
  isUpdateButtonEnabled: false,
  isTrialAvailable: false,
  isTrial: false,
  isPaymentFormVisible: false,
  isBillingEnabled: false,
  planName: '',
  numberOfSeats: 0,
  costPerSeat: 0,
  nextBillingAmount: 0,
  subscriptionData: null,
  guestSeatCount: 0,
  guestSeatsOccupied: 0,

  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
  onNavigateToSubscriptions: doNothing,
  onChangeNumberOfSeats: doNothing,
};

function SubscriptionSettingsPage(props) {
  return (
    <div className={props.className || styles.Component}>
      {props.isLoading ? renderLoadingDots() : renderSettings(props)}
    </div>
  );
}

function renderSettings(props) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <div className={styles.settingsRow}>
        <div className={styles.settingsSection}>
          <div className={styles.title}>{t('Your current plan')}</div>
          {renderRow(t('Plan type:'), renderCurrentPlan(props, t))}
          {props.isBillingEnabled &&
            renderRow(
              t('Billing frequency:'),
              props.isBillingFrequencyEnabled ? t(props.billingPeriodName) : t('billingFreq.None'),
            )}
          {props.isBillingEnabled &&
            renderRow(
              t('Last charge:'),
              props.isLastChargeEnabled ? renderTime(props.lastChargeTime) : t('lastCharge.None'),
            )}
          {props.isBillingEnabled &&
            renderRow(
              t('Next payment:'),
              props.isNextPaymentEnabled ? renderNextPaymentTime(props, t) : t('nextPayment.None'),
            )}
          {renderRow(t('Number of seats:'), renderNumberOfSeatsInput(props))}
          {props.isBillingEnabled &&
            renderRow(
              t('Billed {{period}}:', {
                period: props.billingPeriodName || 'monthly',
              }),
              props.isMonthlyBilledEnabled ? renderMonthlyBilled(props, t) : t('billedMonthly.None'),
            )}
          {props.isBillingEnabled &&
            renderRow(
              t('Next billing amount:'),
              props.isMonthlyBilledEnabled ? renderNextBillingAmount(props, t) : t('billedMonthly.None'),
            )}
          {props.isBillingEnabled && props.isUpdateButtonEnabled && renderUpdateButton(props)}
          {renderGuestsDescription(props, t)}
        </div>
      </div>
      {props.isBillingEnabled && props.isCurrentUserOrganizationAdmin && renderBillingHistoryRow(t)}
      {props.isBillingEnabled && renderCouponsRow(t)}
      {props.isFree && <SubscriptionDescription className={styles.description} />}
    </Fragment>
  );
}

function renderLoadingDots() {
  return (
    <div className={styles.loaderWrapper}>
      <LoadingDots className={styles.loadingDots} />
    </div>
  );
}

function renderRow(label, value) {
  return (
    <div className={styles.row}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}

function renderCurrentPlan(props, t) {
  return (
    <div className={styles.currentPlanWrapper}>
      {t(`{{planName}} Plan `, { planName: t(props.planName.trim()) })}
      {props.isFree && '/'}
      {props.isTrial && renderTrialInfo(props, t)}
      {props.isBillingEnabled &&
        (props.isCurrentUserOrganizationAdmin
          ? renderPlanActionButton(props, t)
          : renderPlanActionButtonWithTooltip(props, t))}
    </div>
  );
}

function renderTrialInfo(props, t) {
  return (
    <span className={styles.trialInfo}>{t('({{count}} days of trial remaining)', { count: props.daysLeft })}</span>
  );
}

function renderNextPaymentTime(props, t) {
  return (
    <div>
      {renderTime(props.expireTime)}
      {props.daysLeft ? (
        <span className={styles.hint}>{t(`  (in {{daysLeft}} days)`, { daysLeft: props.daysLeft })}</span>
      ) : null}
    </div>
  );
}

function renderTime(time) {
  return <DateOutput timestamp={time} format={'MMM D, YYYY'} />;
}

function renderNumberOfSeatsInput(props) {
  return (
    <UserInput
      className={styles.input}
      type={'number'}
      value={props.numberOfSeats}
      isDisabled={!props.isSeatCountInputEnabled}
      min={1}
      onChange={props.onChangeNumberOfSeats}
    />
  );
}

function renderUpdateButton(props) {
  return <UpdateSubscriptionButton className={styles.updateButton} subscriptionData={props.subscriptionData} />;
}

function renderBillingHistoryRow(t) {
  return (
    <div className={styles.settingsRow}>
      <div className={styles.settingsSection}>
        <div className={styles.title}>{t('Billing history')}</div>
        <BillingHistory />
      </div>
    </div>
  );
}

function renderCouponsRow(t) {
  return (
    <div className={styles.settingsRow}>
      <div className={styles.settingsSection}>
        <div className={styles.title}>{t('Applied coupons')}</div>
        <AppliedCoupons />
      </div>
    </div>
  );
}

function renderPlanActionButtonWithTooltip(props, t) {
  return (
    <InfoTooltip
      infoTooltipWrapperClassName={styles.infoTooltip}
      targetWrapperClassName={styles.targetWrapperClassName}
      shouldRenderInfoTooltip={props.isHovering}
      popperPlacement={'top'}
      targetComponent={renderPlanActionButton(props, t)}
      popperModifiers={{
        offset: {
          offset: `0, ${commonStyles.gridCellSize}`,
        },
      }}
      title={t(`You have to be workspace owner to {{action}} plan.`, {
        action: props.isFree ? t('action|upgrade') : t('action|cancel'),
      })}
    />
  );
}

function renderPlanActionButton(props, t) {
  return (
    <div className={styles.planActionButton} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
      {props.isFree ? (
        <Button disabled={!props.isCurrentUserOrganizationAdmin} onClick={props.onNavigateToSubscriptions}>
          {props.isTrialAvailable ? t('Try out 14 days Premium trial') : t('Upgrade to Premium')}
        </Button>
      ) : (
        <CancelSubscriptionButton className={styles.cancelButton} isDisabled={!props.isCurrentUserOrganizationAdmin} />
      )}
    </div>
  );
}

function renderGuestsDescription(props, t) {
  return (
    <div className={styles.guestsRow}>
      <div className={styles.row}>
        <div className={styles.labelGuests}>{t('Number of guests allowed:')}</div>
        <div className={styles.valueGuests}>
          {props.guestSeatCount}{' '}
          {props.guestSeatCount > 0 ? t('({{count}} granted)', { count: props.guestSeatsOccupied }) : ''}
        </div>
      </div>
      <div className={styles.guestsDescription}>
        {t(`Guest can be a part of particular project and communicate with your team. They can’t access projects, were he is not assigned. 
          The number of guests you can invite is calculated by increasing the number of seats you have already purchuased by 5. 
          Each project to which you will invite the guest will be considered as one guest seat.`)}
      </div>
    </div>
  );
}

function renderMonthlyBilled(props, t) {
  const total = props.costPerSeat * props.numberOfSeats;

  return total ? `$${total?.toFixed(2)}` : t('None');
}

function renderNextBillingAmount(props, t) {
  if (props.nextBillingAmount) {
    const amount = props.nextBillingAmount / 100;

    return `$${amount}`;
  } else {
    return t('None');
  }
}

export default SubscriptionSettingsPage;
