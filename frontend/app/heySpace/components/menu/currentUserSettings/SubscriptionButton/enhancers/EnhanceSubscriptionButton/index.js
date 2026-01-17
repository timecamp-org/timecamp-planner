import React from "react";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectIsCurrentSubscriptionFree } from "models/domain/SubscriptionModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceSubscriptionButton extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    render() {
      return (
        <ComposedComponent isFreeSubscription={this.props.isFreeSubscription} />
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    isFreeSubscription: selectIsCurrentSubscriptionFree(state),
  });

  return connect(mapStateToProps)(EnhanceSubscriptionButton);
}

export default Enhance;
