import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as SubscriptionModelSelectors from "models/domain/SubscriptionModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceAppliedCoupons extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          couponIds={this.props.couponIds}
        />
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      couponIds: SubscriptionModelSelectors.selectCouponIds(state),
    };
  };

  return connect(mapStateToProps)(EnhanceAppliedCoupons);
}

export default Enhance;
