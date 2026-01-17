import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as SubscriptionModelActions from 'models/domain/SubscriptionModel/actions';
import { selectSubscriptionPlanId } from 'models/domain/SubscriptionModel/selectors/domain';
import { selectRequestIsFailure } from 'models/domain/RequestModel/selectors';
import { checkoutSubscriptionPaymentPage } from 'models/domain/RequestModel/constants/requestTypes';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';

import PureBaseComponent from 'commonEnhancers/PureBaseComponent';

function Enhance(ComposedComponent) {
  class EnhancePaymentSection extends PureBaseComponent {
    static propTypes = {
      className: PropTypes.string,
      subscriptionPlanId: PropTypes.string.isRequired,
      isPaymentStage: PropTypes.bool.isRequired,
      onFinishCheckout: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isPaymentStage={this.props.isPaymentStage}
          subscriptionPlanId={this.props.subscriptionPlanId}
          isPaymentPageRequestFailed={this.props.isPaymentPageRequestFailed}
          onFinishCheckout={this.props.onFinishCheckout}
        />
      );
    }
  }

  const mapStateToProps = (state) => {
    const organizationId = selectCurrentOrganizationId(state);
    return {
      subscriptionPlanId: selectSubscriptionPlanId(state),
      isPaymentPageRequestFailed: selectRequestIsFailure(state, {
        requestType: checkoutSubscriptionPaymentPage,
        objectId: organizationId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onFinishCheckout: () =>
      dispatch(SubscriptionModelActions.onFinishCheckout()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhancePaymentSection);
}

export default Enhance;
