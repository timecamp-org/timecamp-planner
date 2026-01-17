import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  selectSubscriptionPlanId,
  selectCurrency,
  selectEnabledPlanIdsByCurrentBillingPeriod,
  selectBillingPeriodId,
} from 'models/domain/SubscriptionModel/selectors/domain';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { UserTracker } from 'common/services';

import { onChooseBillingPeriod } from 'models/domain/SubscriptionModel/actions';

import { BillingPeriodType } from 'models/domain/SubscriptionModel/types';

import BaseComponent from 'commonEnhancers/BaseComponent';

function Enhance(ComposedComponent) {
  class EnhanceSubscriptionPlanSelection extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      subscriptionPlanId: PropTypes.string,
      currency: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          subscriptionPlanIds={this.props.subscriptionPlanIds}
          subscriptionPlanId={this.props.subscriptionPlanId}
          billingPeriodId={this.props.billingPeriodId}
          currency={this.props.currency}
          onSwitchBillingPeriod={this.onSwitchBillingPeriod}
        />
      );
    }

    onSwitchBillingPeriod() {
      if (
        this.props.billingPeriodId === BillingPeriodType.BILLING_PERIOD_MONTHLY
      ) {
        this.props.onChooseBillingPeriod(
          BillingPeriodType.BILLING_PERIOD_YEARLY
        );
        UserTracker.track(UserTrackerEvent.billingPeriodChanged, {
          period: BillingPeriodType.BILLING_PERIOD_YEARLY,
        });
      } else {
        this.props.onChooseBillingPeriod(
          BillingPeriodType.BILLING_PERIOD_MONTHLY
        );
        UserTracker.track(UserTrackerEvent.billingPeriodChanged, {
          period: BillingPeriodType.BILLING_PERIOD_MONTHLY,
        });
      }
    }
  }

  const mapStateToProps = (state) => {
    return {
      subscriptionPlanIds: selectEnabledPlanIdsByCurrentBillingPeriod(state),
      subscriptionPlanId: selectSubscriptionPlanId(state),
      currency: selectCurrency(state),
      billingPeriodId: selectBillingPeriodId(state),
    };
  };

  const makeDispatchToProps = (dispatch) => {
    return {
      onChooseBillingPeriod: (billingPeriodId) =>
        dispatch(onChooseBillingPeriod(billingPeriodId)),
    };
  };

  return connect(
    mapStateToProps,
    makeDispatchToProps
  )(EnhanceSubscriptionPlanSelection);
}

export default Enhance;
