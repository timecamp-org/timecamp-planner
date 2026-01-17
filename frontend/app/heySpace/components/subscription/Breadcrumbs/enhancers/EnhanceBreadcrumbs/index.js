import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as SubscriptionModelDomainSelectors from "models/domain/SubscriptionModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

function EnhanceBreadcrumbs(ComposedComponent) {
  class EnhanceBreadcrumbs extends BaseComponent {
    static propTypes = {
      isSubscriptionChoiceStage: PropTypes.bool.isRequired,
      isSubscriptionDetailsStage: PropTypes.bool.isRequired,
      isPaymentStage: PropTypes.bool.isRequired,
      isClientFormDataValid: PropTypes.bool.isRequired,
      isSubscriptionPlanChosen: PropTypes.bool.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          isSubscriptionChoiceStage={this.props.isSubscriptionChoiceStage}
          isSubscriptionDetailsStage={this.props.isSubscriptionDetailsStage}
          isPaymentStage={this.props.isPaymentStage}
          isClientFormDataValid={this.props.isClientFormDataValid}
          isSubscriptionPlanChosen={this.props.isSubscriptionPlanChosen}
          isSubscriptionChoiceStageValid={this.isSubscriptionChoiceStageValid()}
          isSubscriptionDetailsStageValid={this.isSubscriptionDetailsStageValid()}
        />
      );
    }

    isSubscriptionChoiceStageValid() {
      const {
        isSubscriptionPlanChosen,
        isSubscriptionDetailsStage,
        isPaymentStage,
      } = this.props;
      return (
        isSubscriptionPlanChosen &&
        (isSubscriptionDetailsStage || isPaymentStage)
      );
    }

    isSubscriptionDetailsStageValid() {
      const { isClientFormDataValid, isPaymentStage } = this.props;
      return isClientFormDataValid && isPaymentStage;
    }
  }

  const mapStateToProps = (state) => {
    return {
      isSubscriptionChoiceStage:
        SubscriptionModelDomainSelectors.selectIsSubscriptionChoiceStage(state),
      isSubscriptionDetailsStage:
        SubscriptionModelDomainSelectors.selectIsSubscriptionDetailsStage(
          state
        ),
      isPaymentStage:
        SubscriptionModelDomainSelectors.selectIsPaymentStage(state),
      isClientFormDataValid:
        SubscriptionModelDomainSelectors.selectIsClientFormDataValid(state),
      isSubscriptionPlanChosen:
        SubscriptionModelDomainSelectors.selectIsSubscriptionPlanChosen(state),
    };
  };

  return connect(mapStateToProps)(EnhanceBreadcrumbs);
}

export default EnhanceBreadcrumbs;
