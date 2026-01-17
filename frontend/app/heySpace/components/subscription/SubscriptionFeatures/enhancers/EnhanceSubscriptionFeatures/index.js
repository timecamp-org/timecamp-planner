import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";

import {
  selectSubscriptionFeatures,
  selectSubscriptionFeaturesAdditional,
  selectPlanCode,
} from "models/domain/SubscriptionModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceSubscriptionFeatures extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      subscriptionPlanId: PropTypes.string.isRequired,
      features: ImmutablePropTypes.list,
      featuresAdditional: ImmutablePropTypes.list,
      header: PropTypes.string,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          features={this.props.features}
          featuresAdditional={this.props.featuresAdditional}
          header={this.props.header}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    const planCode = selectPlanCode(state, {
      planId: props.subscriptionPlanId,
    });
    return {
      features: selectSubscriptionFeatures(state, {
        subscriptionPlanId: planCode,
      }),
      featuresAdditional: selectSubscriptionFeaturesAdditional(state, {
        subscriptionPlanId: planCode,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceSubscriptionFeatures);
}

export default Enhance;
