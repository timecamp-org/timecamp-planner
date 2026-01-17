import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { billingPeriods } from "models/domain/SubscriptionModel/constants/billingPeriods";

import {
  selectBillingPeriodId,
  selectNumberOfSeats,
  selectCurrency,
  selectPlanCostPerSeat,
  selectIsPaymentStage,
  selectIsConfirmationStage,
  selectPlanName,
} from "models/domain/SubscriptionModel/selectors/domain";
import * as SubscriptionModelActions from "models/domain/SubscriptionModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function EnhanceBillingCycle(ComposedComponent) {
  class EnhanceBillingSummary extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      billingPeriodId: PropTypes.string.isRequired,
      subscriptionPlanId: PropTypes.string.isRequired,
      isPaymentStage: PropTypes.bool.isRequired,
      isConfirmationStage: PropTypes.bool.isRequired,
      currency: PropTypes.string.isRequired,
      costPerSeat: PropTypes.string,
      subscriptionName: PropTypes.string,
      numberOfSeats: PropTypes.number.isRequired,
      onChooseBillingPeriod: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          billingPeriodId={this.props.billingPeriodId}
          subscriptionPlanId={this.props.subscriptionPlanId}
          billingPeriods={billingPeriods}
          currency={this.props.currency}
          costPerSeat={this.props.costPerSeat}
          numberOfSeats={this.props.numberOfSeats}
          subscriptionName={this.props.subscriptionName}
          onChooseBillingPeriod={this.props.onChooseBillingPeriod}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      isPaymentStage: selectIsPaymentStage(state),
      isConfirmationStage: selectIsConfirmationStage(state),
      billingPeriodId: selectBillingPeriodId(state),
      numberOfSeats: selectNumberOfSeats(state),
      subscriptionName: selectPlanName(state, {
        planId: props.subscriptionPlanId,
      }),
      costPerSeat: selectPlanCostPerSeat(state, {
        planId: props.subscriptionPlanId,
      }),
      currency: selectCurrency(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onChooseBillingPeriod: (period) =>
      dispatch(SubscriptionModelActions.onChooseBillingPeriod(period)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceBillingSummary);
}

export default EnhanceBillingCycle;
