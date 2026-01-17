import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectSubscriptionPlanId } from "models/domain/SubscriptionModel/selectors/domain";
import * as SubscriptionModelActions from "models/domain/SubscriptionModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceSubscriptionDetailsSection extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      subscriptionPlanId: PropTypes.string.isRequired,
      onAdvanceFromSubscriptionDetails: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          subscriptionPlanId={this.props.subscriptionPlanId}
          onContinueClick={this.props.onAdvanceFromSubscriptionDetails}
        />
      );
    }
  }

  const mapStateToProps = (state) => ({
    subscriptionPlanId: selectSubscriptionPlanId(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onAdvanceFromSubscriptionDetails: () =>
      dispatch(SubscriptionModelActions.onAdvanceFromSubscriptionDetails()),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceSubscriptionDetailsSection);
}

export default Enhance;
