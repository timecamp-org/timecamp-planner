import React from 'react';

import differenceInDays from 'date-fns/difference_in_days';
import startOfDay from 'date-fns/start_of_day';
import { connect } from 'react-redux';

import { epochNow } from 'common/utils/epoch';
import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { selectCurrentOrganizationOccupiedGuestSeatsCount } from 'models/domain/GuestsModel/selectors';
import { selectIsCurrentUserOrganizationAdmin } from 'models/domain/OrganizationsModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import {
  getSubscriptionViewData,
  cancelOrganizationSubscription,
} from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestStatus, selectRequestIsLoading } from 'models/domain/RequestModel/selectors';
import { RequestStatus } from 'models/domain/RequestModel/types';
import {
  selectUsersPerWorkspaceLimit,
  selectCurrentSubscriptionGuestSeatCount,
} from 'models/domain/SubscriptionLimitsModel/selectors';
import {
  selectCurrentSubscriptionPlanName,
  selectCurrentSubscriptionExpireTime,
  selectIsCurrentSubscriptionFree,
  selectIsCurrentSubscriptionInternalTrial,
  selectCurrentSubscriptionSeatCount,
  selectIsCurrentSubscriptionLifetime,
  selectCurrentSubscriptionCostPerSeat,
  selectLastChargeTime,
  selectCurrentSubscriptionBillingPeriodName,
  selectIsCurrentSubscriptionActive,
  selectIsCurrentSubscriptionTrial,
  selectIsTrialAvaliable,
  selectCurrentSubscriptionNextBillingAmount,
  selectIsBillingEnabled,
} from 'models/domain/SubscriptionModel/selectors';
import {
  selectInvoices,
  selectSubscriptionPlanId,
  selectIsOrganizationSubscriptionCancellationRequestPending,
} from 'models/domain/SubscriptionModel/selectors/domain';

function EnhanceSubscriptionSettingsPage(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceSubscriptionSettingsPage extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function
    static propTypes = {};

    state = {
      isHovering: false,
      numberOfSeats: this.props.numberOfSeats,
    };

    render() {
      return (
        <ComposedComponent
          planName={this.props.planName}
          expireTime={this.props.expireTime}
          payments={this.props.payments}
          isFree={this.props.isFree}
          isLifetime={this.props.isLifetime}
          isActive={this.props.isActive}
          isTrial={this.props.isTrial}
          isTrialAvailable={this.props.isTrialAvailable}
          daysLeft={this.getDaysLeft()}
          isCurrentUserOrganizationAdmin={this.props.isCurrentUserOrganizationAdmin}
          isHovering={this.state.isHovering}
          numberOfSeats={this.state.numberOfSeats}
          costPerSeat={parseFloat(this.props.costPerSeat)}
          lastChargeTime={this.props.lastChargeTime}
          billingPeriodName={this.props.billingPeriodName}
          excessWorkspaceMembers={this.props.excessWorkspaceMembers}
          guestSeatCount={this.props.guestSeatCount}
          guestSeatsOccupied={this.props.guestSeatsOccupied}
          nextBillingAmount={this.props.nextBillingAmount}
          isUpdateSubscriptionEnabled={this.isUpdateSubscriptionEnabled()}
          isSeatCountInputEnabled={this.isSeatCountInputEnabled()}
          isLoading={this.props.isLoading}
          isBillingFrequencyEnabled={this.isBillingFrequencyEnabled()}
          isLastChargeEnabled={this.isLastChargeEnabled()}
          isNextPaymentEnabled={this.isNextPaymentEnabled()}
          isMonthlyBilledEnabled={this.isMonthlyBilledEnabled()}
          isUpdateButtonEnabled={this.isUpdateButtonEnabled()}
          isBillingEnabled={this.props.isBillingEnabled}
          subscriptionData={this.getSubscriptionData()}
          onNavigateToSubscriptions={this.onNavigateToSubscriptions}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onChangeNumberOfSeats={this.onChangeNumberOfSeats}
        />
      );
    }

    onMouseEnter() {
      this.setState({ isHovering: true });
    }

    onMouseLeave() {
      this.setState({ isHovering: false });
    }

    getDaysLeft() {
      if (this.props.expireTime) {
        const expireDay = startOfDay(this.props.expireTime);
        const today = startOfDay(epochNow());
        if (expireDay < today) {
          return 0;
        }
        return differenceInDays(expireDay, today);
      }
      return null;
    }

    isBillingFrequencyEnabled() {
      return (
        (this.props.isActive && !this.props.isFree && !this.props.isLifetime) || this.isUpdateSubscriptionEnabled()
      );
    }

    isLastChargeEnabled() {
      return this.props.lastChargeTime && this.props.isActive && !this.props.isLifetime && !this.props.isFree;
    }

    isNextPaymentEnabled() {
      return this.props.isActive && !this.props.isLifetime && !this.props.isFree && !this.props.isInternalTrial;
    }

    isMonthlyBilledEnabled() {
      return (
        ((!this.props.isFree && !this.props.isLifetime) || this.isUpdateSubscriptionEnabled()) &&
        !this.props.isInternalTrial
      );
    }

    isUpdateButtonEnabled() {
      return this.isUpdateSubscriptionEnabled() && this.props.isCurrentUserOrganizationAdmin;
    }

    isUpdateSubscriptionEnabled() {
      return (
        this.props.isBillingEnabled &&
        !this.props.cancellationRequestSent &&
        this.props.isCurrentUserOrganizationAdmin &&
        this.props.isActive &&
        !this.props.isFree
      );
    }

    isSeatCountInputEnabled() {
      return (
        this.props.isBillingEnabled &&
        !this.props.cancellationRequestSent &&
        this.props.isCurrentUserOrganizationAdmin &&
        !this.props.isUpdating &&
        !this.props.isFree
      );
    }

    onNavigateToSubscriptions() {
      this.props.history.push('/subscription/checkout');
    }

    onChangeNumberOfSeats(event) {
      const numberOfSeats = parseInt(event.target.value);
      this.setState({ numberOfSeats });
    }

    getSubscriptionData() {
      return {
        seatCount: this.state.numberOfSeats,
      };
    }

    componentDidUpdate(prevProps) {
      if (
        prevProps.numberOfSeats !== this.props.numberOfSeats &&
        this.state.numberOfSeats !== this.props.numberOfSeats
      ) {
        this.setState({ numberOfSeats: this.props.numberOfSeats });
      }
      if (!prevProps.subscriptionPlanId && this.props.subscriptionPlanId) {
        this.props.history.push('/subscription/checkout');
      }
    }
  }

  const mapStateToProps = (state) => {
    const organizationId = selectCurrentOrganizationId(state);
    const isOrganizationSubscriptionCancellationRequestPending =
      selectIsOrganizationSubscriptionCancellationRequestPending(state, {
        organizationId,
      });
    const requestStatus = selectRequestStatus(state, {
      requestType: cancelOrganizationSubscription,
      objectId: organizationId,
    });
    const isFree = selectIsCurrentSubscriptionFree(state);
    const isInternalTrial = selectIsCurrentSubscriptionInternalTrial(state);
    const userPerWorkspaceLimit = selectUsersPerWorkspaceLimit(state);
    const numberOfSeats = isFree
      ? userPerWorkspaceLimit
      : selectCurrentSubscriptionSeatCount(state) || userPerWorkspaceLimit;

    return {
      planName: selectCurrentSubscriptionPlanName(state),
      subscriptionPlanId: selectSubscriptionPlanId(state),
      expireTime: selectCurrentSubscriptionExpireTime(state),
      isFree,
      isInternalTrial,
      isLifetime: selectIsCurrentSubscriptionLifetime(state),
      isActive: selectIsCurrentSubscriptionActive(state),
      isTrial: selectIsCurrentSubscriptionTrial(state),
      isTrialAvailable: selectIsTrialAvaliable(state),
      numberOfSeats,
      payments: selectInvoices(state),
      costPerSeat: selectCurrentSubscriptionCostPerSeat(state),
      guestSeatCount: selectCurrentSubscriptionGuestSeatCount(state),
      guestSeatsOccupied: selectCurrentOrganizationOccupiedGuestSeatsCount(state),
      lastChargeTime: selectLastChargeTime(state),
      billingPeriodName: selectCurrentSubscriptionBillingPeriodName(state),
      nextBillingAmount: selectCurrentSubscriptionNextBillingAmount(state),
      isCurrentUserOrganizationAdmin: selectIsCurrentUserOrganizationAdmin(state),
      isBillingEnabled: selectIsBillingEnabled(state),
      isLoading: selectRequestIsLoading(state, {
        requestType: getSubscriptionViewData,
        objectId: organizationId,
      }),
      cancellationRequestSent:
        isOrganizationSubscriptionCancellationRequestPending ||
        requestStatus === RequestStatus.LOADING ||
        requestStatus === RequestStatus.SUCCESS,
    };
  };

  return connect(mapStateToProps)(EnhanceSubscriptionSettingsPage);
}

export default EnhanceSubscriptionSettingsPage;
