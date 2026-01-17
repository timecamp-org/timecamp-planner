import React from 'react';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { List } from 'immutable';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import * as RequestModelSelectors from 'models/domain/RequestModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectCurrentOrganizationOccupiedGuestSeatsCount } from 'models/domain/GuestsModel/selectors';
import { onInviteGuestsToOrganization } from 'models/domain/OrganizationsModel/actions';
import {
  selectIsWorkspaceGuestSeatsAvailable,
  selectCurrentSubscriptionGuestSeatCount,
} from 'models/domain/SubscriptionLimitsModel/selectors';

import { i18n } from 'i18n';

const emptyList = new List();

function Enhance(ComposedComponent) {
  class EnhanceInviteGuestButton extends BaseComponent {
    static propTypes = {};

    state = {
      isModalVisible: false,
      selectedUserEmails: emptyList,
      selectedSpaceIds: emptyList,
      error: null,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isModalVisible={this.state.isModalVisible}
          isInviting={this.props.isInviting}
          guestSeatCount={this.props.guestSeatCount}
          occupiedGuestSeats={this.props.occupiedGuestSeats}
          error={this.state.error}
          tooltipMessage={this.getTooltipMessage()}
          isWorkspaceGuestSeatsAvailable={this.props.isWorkspaceGuestSeatsAvailable}
          isGuestsExceeded={this.isGuestsExceeded()}
          isSubmitDisabled={this.isSubmitDisabled()}
          onSetIsModalVisible={this.onSetIsModalVisible}
          onCloseModal={this.onCloseModal}
          onInviteGuests={this.onInviteGuests}
          onSelectedEmailsChange={this.onSelectedEmailsChange}
          onSelectedSpacesChange={this.onSelectedSpacesChange}
        />
      );
    }

    onSetIsModalVisible(isModalVisible) {
      this.setState({ isModalVisible });
    }

    getTooltipMessage() {
      if (this.isGuestsExceeded()) {
        return i18n.t(
          `You have reached the maximum guests number. You can change this limit by changing the number of seats on subscription page or by removing other guests.`
        );
      } else if (this.state.selectedUserEmails.size === 0) {
        return i18n.t('You forgot to type emails.');
      } else if (this.state.selectedSpaceIds.size === 0) {
        return i18n.t('You forgot to choose projects.');
      }
    }

    onInviteGuests() {
      this.onClearErrors();
      const isValidForm = this.onValidateForm();
      if (isValidForm) {
        const { selectedUserEmails, selectedSpaceIds } = this.state;
        this.props.onInviteGuestsToOrganization(selectedUserEmails.toJS(), selectedSpaceIds.toJS());
      }
    }

    onClearErrors() {
      this.setState({ error: null });
    }

    onValidateForm() {
      if (this.state.selectedUserEmails.size === 0) {
        const error = i18n.t('You forgot to type emails.');
        this.setState({ error });
        return false;
      }
      if (this.state.selectedSpaceIds.size === 0) {
        const error = i18n.t('You forgot to choose projects.');
        this.setState({ error });
        return false;
      }
      return true;
    }

    onSelectedEmailsChange(emails) {
      this.setState({
        selectedUserEmails: new List(emails),
        error: null,
      });
    }

    onSelectedSpacesChange(spaceIds) {
      this.setState({
        selectedSpaceIds: new List(spaceIds),
        error: null,
      });
    }

    isGuestsExceeded() {
      return this.props.occupiedGuestSeats + this.state.selectedSpaceIds.size > this.props.guestSeatCount;
    }

    isSubmitDisabled() {
      return (
        this.isGuestsExceeded() || this.state.selectedSpaceIds.size === 0 || this.state.selectedUserEmails.size === 0
      );
    }

    componentDidUpdate(prevProps) {
      if (prevProps.isInviting && !this.props.isInviting) {
        this.onSetIsModalVisible(false);
      }
    }
  }

  const mapStateToProps = (state) => {
    const organizationId = selectCurrentOrganizationId(state);
    return {
      isInviting: RequestModelSelectors.selectRequestIsLoading(state, {
        requestType: RequestTypesConstants.inviteGuestsToOrganization,
        objectId: organizationId,
      }),
      isWorkspaceGuestSeatsAvailable: selectIsWorkspaceGuestSeatsAvailable(state),
      occupiedGuestSeats: selectCurrentOrganizationOccupiedGuestSeatsCount(state),
      guestSeatCount: selectCurrentSubscriptionGuestSeatCount(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onInviteGuestsToOrganization: (guests, spaceIds) => dispatch(onInviteGuestsToOrganization(guests, spaceIds, false)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceInviteGuestButton);
}

export default Enhance;
