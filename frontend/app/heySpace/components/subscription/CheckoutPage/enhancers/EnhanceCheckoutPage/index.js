import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { selectIsCurrentUserOrganizationAdmin } from 'models/domain/OrganizationsModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import {
  checkoutSubscriptionPaymentPage,
  getSubscriptionViewData
} from 'models/domain/RequestModel/constants/requestTypes';
import {
  selectRequestIsLoading,
  selectRequestIsFailure,
  selectIsRequestRepeatable,
} from 'models/domain/RequestModel/selectors';
import * as SubscriptionModelActions from 'models/domain/SubscriptionModel/actions';
import {
  selectSubscriptionPlanId,
  selectIsDataUntilCurrentPathValid,
  selectCheckoutStage,
  selectIsCheckoutFailed,
  selectIsPaymentStage,
  selectIsConfirmationStage
} from 'models/domain/SubscriptionModel/selectors/domain';

function Enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceCheckoutPage extends BaseComponent {
    static propTypes = {
      checkoutStage: PropTypes.string.isRequired,
      subscriptionPlanId: PropTypes.string,
      isDataUntilCurrentPathValid: PropTypes.bool.isRequired,
      isPaymentStage: PropTypes.bool.isRequired,
      isConfirmationStage: PropTypes.bool.isRequired,

      onCheckoutStageCheck: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          subscriptionPlanId={this.props.subscriptionPlanId}
          checkoutStage={this.props.checkoutStage}
          isDataUntilCurrentPathValid={this.props.isDataUntilCurrentPathValid}
          isPaymentStage={this.props.isPaymentStage}
          isLoading={this.props.isLoading}
          isCurrentUserWorkspaceAdmin={this.props.isCurrentUserWorkspaceAdmin}
          isCheckoutFailed={this.isCheckoutFailed()}
          shouldRenderHeader={this.shouldRenderHeader()}
          onClose={this.onClose}
        />
      );
    }

    shouldRenderHeader() {
      return (
        !this.props.isConfirmationStage &&
        !this.props.isSubscriptionViewDataRequestFailed &&
        !this.props.isPaymentPageRequestFailed
      );
    }

    isCheckoutFailed() {
      return this.props.isSubscriptionViewDataRequestFailed;
    }

    onClose() {
      this.props.onFinishCheckout();
      this.props.history.push('/settings/subscription');
    }

    componentDidMount() {
      this.props.onCheckoutStageCheck();
      if (this.props.isSubscriptionViewDataRequestRepeatable) {
        this.props.onFetchSubscriptionData();
      }

      if (this.props.isPaymentPageRequestFailed) {
        this.props.onFetchPaymentPage();
      }
    }

    componentDidUpdate(prevProps) {
      if (
        (this.props.checkoutStage !== prevProps.checkoutStage ||
          this.props.subscriptionPlanId !== prevProps.subscriptionPlanId) &&
        !this.props.isCheckoutFailed
      ) {
        this.props.onCheckoutStageCheck();
      }
    }
  }

  const mapStateToProps = (state) => {
    const organizationId = selectCurrentOrganizationId(state);

    return {
      checkoutStage: selectCheckoutStage(state),
      subscriptionPlanId: selectSubscriptionPlanId(state),
      isPaymentStage: selectIsPaymentStage(state),
      isConfirmationStage: selectIsConfirmationStage(state),
      isDataUntilCurrentPathValid: selectIsDataUntilCurrentPathValid(state),
      isCheckoutFailed: selectIsCheckoutFailed(state),
      isCurrentUserWorkspaceAdmin: selectIsCurrentUserOrganizationAdmin(state),
      isLoading: selectRequestIsLoading(state, {
        requestType: checkoutSubscriptionPaymentPage,
        objectId: organizationId,
      }),
      isSubscriptionViewDataRequestFailed: selectRequestIsFailure(state, {
        requestType: getSubscriptionViewData,
        objectId: organizationId,
      }),
      isSubscriptionViewDataRequestRepeatable: selectIsRequestRepeatable(
        state,
        { requestType: getSubscriptionViewData, objectId: organizationId }
      ),
      isPaymentPageRequestFailed: selectRequestIsFailure(state, {
        requestType: checkoutSubscriptionPaymentPage,
        objectId: organizationId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onCheckoutStageCheck: () =>
      dispatch(SubscriptionModelActions.onCheckoutStageCheck()),
    onFetchSubscriptionData: () =>
      dispatch(SubscriptionModelActions.onFetchSubscriptionData()),
    onFetchPaymentPage: () =>
      dispatch(SubscriptionModelActions.onFetchPaymentPage()),
    onFinishCheckout: () =>
      dispatch(SubscriptionModelActions.onFinishCheckout()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCheckoutPage);
}

export default Enhance;
