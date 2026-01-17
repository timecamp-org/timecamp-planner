import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import * as SubscriptionModelActions from 'models/domain/SubscriptionModel/actions';
import { selectCurrentSubscriptionPlanId } from 'models/domain/SubscriptionModel/selectors';
import {
  selectCurrency,
  selectSubscriptionRecommendedAudience,
  selectPlanCode,
  selectPlanName,
  selectPlanCostPerSeat,
  selectPlanBillingPeriod
} from 'models/domain/SubscriptionModel/selectors/domain';

function Enhance(ComposedComponent) {
  class EnhanceSubscriptionPlan extends BaseComponent {

    static propTypes = {
      className: PropTypes.string,
      subscriptionPlanId: PropTypes.string.isRequired,
      currentSubscriptionPlanId: PropTypes.string,
      name: PropTypes.string,
      recommendedAudience: PropTypes.string,
      costPerSeat: PropTypes.string,
      currency: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          subscriptionPlanId={this.props.subscriptionPlanId}
          currentSubscriptionPlanId={this.props.currentSubscriptionPlanId}
          name={this.props.name}
          recommendedAudience={this.props.recommendedAudience}
          costPerSeat={this.props.costPerSeat}
          isSubscriptionFree={this.props.costPerSeat === '0'}
          currency={this.props.currency}
          planBillingPeriod={this.props.planBillingPeriod}
          onSelectPlan={this.onSelectPlan}
        />
      );
    }

    onSelectPlan() {
      this.props.onSelectPlan(this.props.subscriptionPlanId);
      this.props.onContinue();
    }
  
}

  const mapStateToProps = (state, props) => {
    const planCode = selectPlanCode(state, {
      planId: props.subscriptionPlanId,
    });

    return {
      name: selectPlanName(state, { planId: props.subscriptionPlanId }),
      recommendedAudience: selectSubscriptionRecommendedAudience(state, {
        subscriptionPlanId: planCode,
      }),
      costPerSeat: selectPlanCostPerSeat(state, {
        planId: props.subscriptionPlanId,
      }),
      currency: selectCurrency(state),
      currentSubscriptionPlanId: selectCurrentSubscriptionPlanId(state),
      planBillingPeriod: selectPlanBillingPeriod(state, {
        planId: props.subscriptionPlanId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onSelectPlan: (subscriptionPlanId) =>
      dispatch(SubscriptionModelActions.onSelectPlan(subscriptionPlanId)),
    onContinue: () =>
      dispatch(SubscriptionModelActions.onAdvanceFromSubscriptionChoice()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSubscriptionPlan);
}

export default Enhance;
