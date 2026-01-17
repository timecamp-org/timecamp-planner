import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import { selectCurrentOrganizationId } from "models/domain/OrganizationsModel/selectors/domain";
import { selectIsOrganizationSubscriptionCancellationRequestPending } from "models/domain/SubscriptionModel/selectors/domain";
import { selectRequestStatus } from "models/domain/RequestModel/selectors";
import { cancelOrganizationSubscription } from "models/domain/RequestModel/constants/requestTypes";
import { RequestStatus } from "models/domain/RequestModel/types";

function Enhance(ComposedComponent) {
  class EnhanceCancelSubscriptionButton extends BaseComponent {
    static propTypes = {
      cancellationRequestSent: PropTypes.bool.isRequired,
    };

    state = {
      isCancelModalVisible: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          cancellationRequestSent={this.props.cancellationRequestSent}
          isDisabled={this.isDisabled()}
          isCancelModalVisible={this.state.isCancelModalVisible}
          onSetIsCancelModalVisible={this.onSetIsCancelModalVisible}
          onToggleModalVisible={this.onToggleModalVisible}
        />
      );
    }

    isDisabled() {
      return this.props.isDisabled || this.props.cancellationRequestSent;
    }

    onSetIsCancelModalVisible(isCancelModalVisible) {
      this.setState({ isCancelModalVisible });
    }

    onToggleModalVisible() {
      this.setState(({ isCancelModalVisible }) => ({
        isCancelModalVisible: !isCancelModalVisible,
      }));
    }
  }

  const mapStateToProps = (state, props) => {
    const organizationId = selectCurrentOrganizationId(state);
    const requestStatus = selectRequestStatus(state, {
      requestType: cancelOrganizationSubscription,
      objectId: organizationId,
    });
    const isOrganizationSubscriptionCancellationRequestPending =
      selectIsOrganizationSubscriptionCancellationRequestPending(state, {
        organizationId,
      });

    return {
      cancellationRequestSent:
        isOrganizationSubscriptionCancellationRequestPending ||
        requestStatus === RequestStatus.LOADING ||
        requestStatus === RequestStatus.SUCCESS,
    };
  };

  return connect(mapStateToProps)(EnhanceCancelSubscriptionButton);
}

export default Enhance;
