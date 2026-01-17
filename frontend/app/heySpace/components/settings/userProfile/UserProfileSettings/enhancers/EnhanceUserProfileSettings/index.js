import React from "react";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";

import { UserTrackerEvent } from "models/component/UserTrackerEventModel/constants";
import EhanceWithUserTrackerEvent from 'enhancers/EhanceWithUserTrackerEvent';
import * as CurrentUserModelSelectors from "models/domain/CurrentUserModel/selectors";
import {
  selectIsCurrentUserCurrentOrganizationOwner,
  selectCurrentOrganizationActivePeopleWithoutBotCount,
} from "models/domain/OrganizationsModel/selectors";

export default function enhance(Component) {
  @EhanceWithUserTrackerEvent(UserTrackerEvent.pageOpen, {
    type: "profile-settings",
  })
  class EnhanceUserProfileSettings extends BaseComponent {
    static propTypes = {};

    static defaultProps = {};

    state = {
      isFirstDeleteConfirmationOpen: false,
      isFinalDeleteConfirmationOpen: false,
      isFinalConfirmationEnabled: false,
    };

    render() {
      return (
        <Component
          isFirstDeleteConfirmationOpen={
            this.state.isFirstDeleteConfirmationOpen
          }
          isFinalDeleteConfirmationOpen={
            this.state.isFinalDeleteConfirmationOpen
          }
          isFinalConfirmationEnabled={this.state.isFinalConfirmationEnabled}
          canCurrentUserDeleteAccount={this.props.canCurrentUserDeleteAccount}
          isCurrentUserOrganizationOwner={
            this.props.isCurrentUserOrganizationOwner
          }
          isUserAloneInOrganization={this.props.isUserAloneInOrganization}
          onSetIsFirstConfirmationVisible={this.onSetIsFirstConfirmationVisible}
          onSetIsFinalConfirmationVisible={this.onSetIsFinalConfirmationVisible}
          onUpdateConfirmText={this.onUpdateConfirmText}
        />
      );
    }

    onSetIsFirstConfirmationVisible(isFirstDeleteConfirmationOpen) {
      this.setState({ isFirstDeleteConfirmationOpen });
    }

    onSetIsFinalConfirmationVisible(isFinalDeleteConfirmationOpen) {
      this.setState({ isFinalDeleteConfirmationOpen });
    }

    onUpdateConfirmText(event) {
      this.setState({
        isFinalConfirmationEnabled: event.target.value === "DELETE",
      });
    }
  }

  function mapStateToProps(state) {
    return {
      canCurrentUserDeleteAccount:
        CurrentUserModelSelectors.selectCanCurrentUserDeleteAccount(state),
      isUserAloneInOrganization:
        selectCurrentOrganizationActivePeopleWithoutBotCount(state) === 1,
      isCurrentUserOrganizationOwner:
        selectIsCurrentUserCurrentOrganizationOwner(state),
    };
  }

  return connect(mapStateToProps)(EnhanceUserProfileSettings);
}
