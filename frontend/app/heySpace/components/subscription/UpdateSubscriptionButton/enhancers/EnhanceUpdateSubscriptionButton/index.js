import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';

import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectIsCurrentUserOrganizationAdmin } from 'models/domain/OrganizationsModel/selectors';
import {
  onUpdateSubscription,
  onUpdateCustomSubscription,
  onSetPaymentPage,
} from 'models/domain/SubscriptionModel/actions';
import {
  selectCurrentSubscriptionSeatCount,
  selectCurrentSubscriptionCostPerSeat,
  selectIsCurrentSubscriptionFree,
  selectIsCurrentSubscriptionCustom,
  selectCurrentSubscriptionUpdatedAt,
} from 'models/domain/SubscriptionModel/selectors';

import { CheckoutStep } from 'common/modules/checkout/types';

import { selectPaymentPageUrl } from 'models/domain/SubscriptionModel/selectors/domain';

function Enhance(ComposedComponent) {
  class EnhanceUpdateSubscriptionButton extends BaseComponent {
    static propTypes = {
      subscriptionData: PropTypes.object,
      onUpdateSubscription: PropTypes.func.isRequired,
    };

    state = {
      isModalVisible: false,
      isUpdating: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isModalVisible={this.state.isModalVisible}
          isDisabled={this.isDisabled()}
          seatCountDiff={this.getSeatCountDiff()}
          updatedCharge={this.getUpdatedCharge()}
          isUpdating={this.state.isUpdating}
          isPaymentFormVisible={this.isPaymentFormVisible()}
          onStopUpdating={this.onStopUpdating}
          onCheckoutStep={this.onCheckoutStep}
          onUpdateOrganizationSubscription={
            this.onUpdateOrganizationSubscription
          }
          onSetIsModalVisible={this.onSetIsModalVisible}
          onUpdateClick={this.onUpdateClick}
        />
      );
    }

    isDisabled() {
      return (
        !this.props.isCurrentUserOrganizationAdmin || this.state.isUpdating
      );
    }

    getSeatCountDiff() {
      if (!this.props.subscriptionData) {
        return 0;
      }
      const { seatCount } = this.props.subscriptionData;
      return seatCount - this.props.seatCount;
    }

    getUpdatedCharge() {
      const seatCountDiff = this.getSeatCountDiff();
      return seatCountDiff * this.props.costPerSeat;
    }

    onUpdateOrganizationSubscription() {
      if (this.props.subscriptionData) {
        if (this.props.isCustom || this.props.isFree) {
          this.onUpdateCustomSubscription();
        } else {
          this.props.onUpdateSubscription(this.props.subscriptionData);
        }
        this.setState({ isUpdating: true });
      }
    }

    onStopUpdating() {
      if (this.checkoutStep !== CheckoutStep.THANKYOU_SCREEN) {
        this.setState({ isUpdating: false });
      }
      this.props.onClearPaymentPage();
    }

    onCheckoutStep(currentStep) {
      this.checkoutStep = currentStep;
    }

    onUpdateCustomSubscription() {
      this.props.onUpdateCustomSubscription(this.props.subscriptionData);
    }

    onSetIsModalVisible(isModalVisible) {
      this.setState({ isModalVisible });
    }

    onUpdateClick() {
      const seatCountDiff = this.getSeatCountDiff();
      if (seatCountDiff) {
        this.onToggleModalVisible();
      } else {
        this.onUpdateOrganizationSubscription();
      }
    }

    onToggleModalVisible() {
      this.setState(({ isModalVisible }) => ({
        isModalVisible: !isModalVisible,
      }));
    }

    isPaymentFormVisible() {
      return !!this.props.paymentPageUrl && this.state.isUpdating;
    }

    componentDidUpdate(prevProps) {
      if (prevProps.updatedAt !== this.props.updatedAt) {
        this.setState({ isUpdating: false });
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const organizationId = selectCurrentOrganizationId(state);

    return {
      organizationId,
      isCurrentUserOrganizationAdmin:
        selectIsCurrentUserOrganizationAdmin(state),
      seatCount: selectCurrentSubscriptionSeatCount(state),
      costPerSeat: selectCurrentSubscriptionCostPerSeat(state),
      isFree: selectIsCurrentSubscriptionFree(state),
      isCustom: selectIsCurrentSubscriptionCustom(state),
      updatedAt: selectCurrentSubscriptionUpdatedAt(state),
      paymentPageUrl: selectPaymentPageUrl(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onUpdateSubscription: (subscriptionData) =>
      dispatch(onUpdateSubscription(subscriptionData)),
    onUpdateCustomSubscription: (subscriptionData) =>
      dispatch(onUpdateCustomSubscription(subscriptionData)),
    onClearPaymentPage: () => dispatch(onSetPaymentPage(null)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceUpdateSubscriptionButton);
}

export default Enhance;
