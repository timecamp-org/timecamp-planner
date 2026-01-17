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
} from "models/domain/SubscriptionModel/selectors/domain";
import * as SubscriptionModelActions from "models/domain/SubscriptionModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function EnhanceBillingCycle(ComposedComponent) {
  class EnhanceBillingCycle extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      billingPeriodId: PropTypes.string.isRequired,
      subscriptionPlanId: PropTypes.string.isRequired,
      isPaymentStage: PropTypes.bool.isRequired,
      isConfirmationStage: PropTypes.bool.isRequired,
      currency: PropTypes.string.isRequired,
      costPerSeat: PropTypes.string,
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
          isEditable={this.isEditable()}
          onChooseBillingPeriod={this.props.onChooseBillingPeriod}
        />
      );
    }

    isEditable() {
      return (
        !this.props.isPaymentStage &&
        !this.props.isConfirmationStage &&
        billingPeriods.size > 1
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      isPaymentStage: selectIsPaymentStage(state),
      isConfirmationStage: selectIsConfirmationStage(state),
      billingPeriodId: selectBillingPeriodId(state),
      numberOfSeats: selectNumberOfSeats(state),
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

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceBillingCycle);
}

export default EnhanceBillingCycle;
