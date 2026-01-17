import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as SubscriptionModelSelectors from "models/domain/SubscriptionModel/selectors";
import { onDownloadInvoice } from "models/domain/SubscriptionModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceCoupon extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      couponId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          name={this.props.name}
          status={this.props.status}
          validUntil={this.props.validUntil}
          code={this.props.code}
          discountAmount={this.props.discountAmount}
          discountPercentage={this.props.discountPercentage}
          durationMonth={this.props.durationMonth}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      name: SubscriptionModelSelectors.selectCouponName(state, {
        couponId: props.couponId,
      }),
      status: SubscriptionModelSelectors.selectCouponStatus(state, {
        couponId: props.couponId,
      }),
      validUntil: SubscriptionModelSelectors.selectCouponValidUntil(state, {
        couponId: props.couponId,
      }),
      code: SubscriptionModelSelectors.selectCouponCode(state, {
        couponId: props.couponId,
      }),
      discountAmount: SubscriptionModelSelectors.selectCouponDiscountAmount(
        state,
        { couponId: props.couponId }
      ),
      discountPercentage:
        SubscriptionModelSelectors.selectCouponDiscountPercentage(state, {
          couponId: props.couponId,
        }),
      durationMonth: SubscriptionModelSelectors.selectCouponDurationMonth(
        state,
        { couponId: props.couponId }
      ),
    };
  };

  return connect(mapStateToProps)(EnhanceCoupon);
}

export default Enhance;
