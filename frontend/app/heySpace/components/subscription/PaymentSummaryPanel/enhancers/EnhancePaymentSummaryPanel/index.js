import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectCurrentOrganizationMemberUserIds } from 'models/domain/OrganizationsModel/selectors';
import * as SubscriptionModelActions from 'models/domain/SubscriptionModel/actions';
import {
  selectIsSubscriptionDetailsStage,
  selectNumberOfSeats,
  selectPlanName,
  selectSubscriptionHasMultiSeats,
  selectSubscriptionPlanId,
} from 'models/domain/SubscriptionModel/selectors/domain';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { isNumber } from 'lodash';

function Enhance(ComposedComponent) {
  class EnhancePaymentSummaryPanel extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      subscriptionPlanId: PropTypes.string.isRequired,
      isSubscriptionDetailsStage: PropTypes.bool.isRequired,
      planName: PropTypes.string,
      hasMultiSeats: PropTypes.bool,
      numberOfSeats: PropTypes.number.isRequired,
      onSeatsNumberUpdate: PropTypes.func.isRequired,
    };

    constructor(props) {
      super(props);

      this.state = {
        proposedNumberOfSeats: this.getProposedNumberOfSeats(),
      };
    }

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          subscriptionPlanId={this.props.subscriptionPlanId}
          planName={this.props.planName}
          hasMultiSeats={this.props.hasMultiSeats}
          numberOfSeats={this.props.numberOfSeats}
          proposedNumberOfSeats={this.state.proposedNumberOfSeats}
          isSubscriptionDetailsStage={this.props.isSubscriptionDetailsStage}
          minNumberOfSeats={this.props.organizationUserIds.size}
          onSeatsNumberUpdate={this.onSeatsNumberUpdate}
          onSaveNumberOfSeats={this.onSaveNumberOfSeats}
        />
      );
    }

    onSeatsNumberUpdate(event) {
      const value = event.target.value;
      this.setState({
        proposedNumberOfSeats: value ? parseInt(value) : undefined,
      });

      const numberOfSeats = parseInt(value);
      if (isNumber(numberOfSeats)) {
        this.props.onSeatsNumberUpdate(numberOfSeats);
      }
    }

    onSaveNumberOfSeats() {
      this.props.onSeatsNumberUpdate(this.state.proposedNumberOfSeats);
    }

    getProposedNumberOfSeats() {
      return this.props.organizationUserIds.size;
    }
  }

  const mapStateToProps = (state) => {
    const subscriptionPlanId = selectSubscriptionPlanId(state);
    return {
      subscriptionPlanId,
      isSubscriptionDetailsStage: selectIsSubscriptionDetailsStage(state),
      planName: selectPlanName(state, { planId: subscriptionPlanId }),
      hasMultiSeats: selectSubscriptionHasMultiSeats(state, {
        subscriptionPlanId,
      }),
      numberOfSeats: selectNumberOfSeats(state),
      organizationUserIds: selectCurrentOrganizationMemberUserIds(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onSeatsNumberUpdate: (seatsNumber) => dispatch(SubscriptionModelActions.onSeatsNumberUpdate(seatsNumber)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhancePaymentSummaryPanel);
}

export default Enhance;
